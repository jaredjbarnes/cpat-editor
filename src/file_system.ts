export interface Metadata {
    isFile: boolean;
    path: string;
    name: string;
}

export class FileSystem {
    private _storage: Storage;

    constructor(storage: Storage = window.localStorage) {
        this._storage = storage;

        try {
            this._getMetadata("/");
        } catch (_) {
            this._setMetadata("/", {
                isFile: false,
                name: "",
                path: "/"
            });
        }

    }

    async isFile(path: string) {
        try {
            return this._getMetadata(path).isFile;
        } catch (_) {
            return false;
        }
    }

    async isDirectory(path: string) {
        try {
            return !this._getMetadata(path).isFile;
        } catch (_) {
            return false;
        }
    }

    async readFile(path: string): Promise<string> {
        const metadata = this._getMetadata(path);

        if (!metadata.isFile) {
            throw new Error(`Path is a Directory.`);
        }

        const content = this._storage.getItem(path);

        if (content == null) {
            throw new Error(`File Not Found: ${path}`);
        }

        return content;
    }

    private _getMetadata(path: string) {
        const data = this._storage.getItem(this._getMetadataPath(path));
        if (data == null) {
            throw new Error(`File Not Found: ${path}`);
        }

        try {
            return JSON.parse(data);
        } catch (_) {
            throw new Error(`Corrupt Metadata: ${path}`);
        }
    }

    private _getMetadataPath(path: string) {
        return `$$Meta$$_${path}`;
    }

    async writeFile(path: string, content: string): Promise<void> {
        this._setMetadata(path, { isFile: true, path, name: this._getFileName(path) });
        this._storage.setItem(path, content);
    }

    private _getFileName(path: string) {
        return path.split("/").slice(-1)[0];
    }

    private _setMetadata(path: string, data: Metadata) {
        this._storage.setItem(this._getMetadataPath(path), JSON.stringify(data));
    }

    private _deleteMetadata(path: string) {
        this._storage.removeItem(this._getMetadataPath(path));
    }

    async deleteFile(path: string) {
        const content = this._storage.getItem(path);
        if (content == null) {
            throw new Error(`File Not Found: ${path}`);
        }

        this._deleteMetadata(path);
        this._storage.removeItem(path);
    }

    async createDirectory(path: string) {
        path = path.endsWith("/") ? path : path + "/";
        const name = path.split("/").slice(-1)[0];
        this._setMetadata(path, { isFile: false, path, name });
    }

    async deleteDirectory(path: string) {
        const items = await this.readDirectory(path);

        for (const item of items) {
            if (item.isFile) {
                await this.deleteFile(item.path);
            } else {
                await this.deleteDirectory(item.path);
            }
        }

        this._deleteMetadata(path);
    }

    async readDirectory(path: string): Promise<Metadata[]> {
        try {
            const metadata = this._getMetadata(path);
            if (metadata.isFile) {
                throw new Error();
            }
        } catch (_) {
            throw new Error(`Directory Not Found: ${path}`);
        }


        path = path.endsWith("/") ? path : path + "/";
        const depth = path.split("/").length;

        const allMetadata: Metadata[] = [];
        for (let x = 0; x < this._storage.length; x++) {
            try {
                const storagePath = this._storage.key(x);
                if (storagePath == null || storagePath.startsWith("$$Meta$$_")) {
                    continue;
                }

                const metadata = this._getMetadata(storagePath);
                const isCorrectDepth = storagePath.split("/").length === depth;

                if (storagePath.startsWith(path) && isCorrectDepth) {
                    allMetadata.push(metadata);
                }
            } catch (_) {
            }
        }

        return allMetadata;
    }

    async walkDirectory(callback: (directory: string, name: string, path: string, isFile: boolean) => void, fromPath = "/") {

        const items = await this.readDirectory(fromPath);
        const directories: Metadata[] = [];
        const pathParts = fromPath.split("/");
        const name = pathParts.slice(-1)[0];
        const directory = pathParts.slice(0, -1)[0] + "/";

        callback(directory, name, fromPath, false);

        items.forEach((metadata: Metadata) => {
            if (metadata.isFile) {
                const fileName = this._getFileName(metadata.path);
                callback(fromPath, fileName, metadata.path, true);
            } else {
                directories.push(metadata);
            }
        });

        for (let directory of directories) {
            await this.walkDirectory(callback, directory.path);
        }
    }
}
