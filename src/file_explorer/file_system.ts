import { generateGUID } from "./generate_guid.ts";

const META_KEY = "$__File_System__META$";

export interface ItemMeta {
    type: "file" | "directory";
    name: string;
    parent: DirectoryMeta | null;
}

interface FileMeta extends ItemMeta {
    type: "file";
    guid: string;
}

interface DirectoryMeta extends ItemMeta {
    type: "directory";
    items: (DirectoryMeta | FileMeta)[];
}

function replacer(key: string, value: any) {
    if (key === "parent") {
        return null;
    }

    return value;
}

export class FileSystem {
    private _storage: Storage;
    private _meta: DirectoryMeta;

    constructor(storage: Storage = window.localStorage) {
        this._storage = storage;
        this._meta = this._getRoot();
    }

    private _getRoot() {
        let metaString = this._storage.getItem(META_KEY);
        let meta: DirectoryMeta | null = null;

        try {
            if (metaString != null) {
                meta = JSON.parse(metaString);
            }
        } catch {
        }

        if (meta == null) {
            meta = {
                type: "directory",
                name: "",
                parent: null,
                items: []
            };
            this._storage.setItem(META_KEY, JSON.stringify(meta, replacer));
        }

        return this._normalizeMetaData(meta);
    }

    upgradeStorage() {
        const pathRegex = /^\/([a-zA-Z0-9._-]+\/?)*[a-zA-Z0-9._-]*$/;
        for (let x = 0; x < this._storage.length; x++) {
            const key = this._storage.key(x);
            if (key != null && pathRegex.test(key)) {
                const value = this._storage.getItem(key);
                if (value != null) {
                    this.writeFile(key, value);
                }
            }
        }
    }

    private _normalizeMetaData(metaData: DirectoryMeta) {
        this._walkDown(metaData, (item, parent) => {
            item.parent = parent;
        }, this._meta);

        return metaData;
    }

    private _walkDown(item: FileMeta | DirectoryMeta, callback: (item: FileMeta | DirectoryMeta, parent: DirectoryMeta) => void, fromDirectory: DirectoryMeta) {
        callback(item, fromDirectory);
        if (item.type === "directory") {
            const directories: DirectoryMeta[] = [];

            item.items.forEach(i => {
                if (i.type === "file") {
                    this._walkDown(i, callback, item);
                } else {
                    directories.push(i);
                }
            });

            directories.forEach(d => this._walkDown(d, callback, item));
        }
    }

    private _getMetaDataForPath(path: string) {
        if (path.startsWith("/")) {
            path = path.slice(1);
        }

        if (path.endsWith("/")) {
            path = path.slice(0, -1);
        }

        const parts = path.split("/");
        let directory = this._meta;

        parts.slice(0, -1).forEach((part) => {
            const match = directory.items.find((i) => i.name === part);

            if (match == null || match.type === "file") {
                throw new Error("Not Found");
            }

            directory = match;
        });

        const result = directory.items.find((i) => i.name === parts[parts.length - 1]);

        if (result == null) {
            throw new Error("Not Found");
        }

        return result;
    }

    async isFile(path: string) {
        return this._getMetaDataForPath(path).type === "file";
    }

    async hasFile(path: string) {
        try {
            return await this.isFile(path);
        } catch {
            return false;
        }
    }

    async readFile(path: string) {
        const metaData = this._getMetaDataForPath(path);
        if (metaData.type === "directory") {
            throw new Error("File Not Found");
        }

        return this._storage.getItem(metaData.guid) || "";
    }

    async writeFile(path: string, content: string) {
        path = this._normalizeFile(path);

        const name = this.getName(path);
        const directoryPath = this.getDirectoryPath(path);

        try {
            const metaItem = this._getMetaDataForPath(path);

            if (metaItem.type === "directory") {
                throw new Error("Cannot Write File");
            }

            this._storage.setItem(metaItem.guid, content);
        } catch {
            this._actIfPathIsEmpty(path, () => {
                const directory = this._createDirectoriesForPath(directoryPath);
                const guid = generateGUID();

                directory.items.push({
                    type: "file",
                    guid: guid,
                    name: name,
                    parent: directory,
                });

                this._persist();
                this._storage.setItem(guid, content);
            });
        }

    }

    async renameFile(path: string, newName: string) {
        const metaData = this._getMetaDataForPath(path);

        if (metaData.type === "directory") {
            throw new Error("File Not Found");
        }

        if (newName.includes("/")) {
            throw new Error("Invalid File Name");
        }

        metaData.name = newName;
        this._persist();
    }

    async deleteFile(path: string) {
        const metaData = this._getMetaDataForPath(path);

        if (metaData.type === "directory") {
            throw new Error("File Not Found");
        }

        if (metaData.parent != null) {
            const index = metaData.parent.items.indexOf(metaData);

            if (index > -1) {
                metaData.parent.items.splice(index, 1);
            }

            this._storage.removeItem(metaData.guid);
            this._persist();
        }
    }

    async move(path: string, newPath: string) {
        const metaData = this._getMetaDataForPath(path);

        this._actIfPathIsEmpty(newPath, () => {
            if (metaData.parent != null) {
                const index = metaData.parent.items.indexOf(metaData);

                if (index > -1) {
                    metaData.parent.items.splice(index, 1);
                }

                const directoryPath = this.getDirectoryPath(newPath);
                const directory = this._createDirectoriesForPath(directoryPath);

                directory.items.push(metaData);
                this._persist();
            }
        });
    }

    async isDirectory(path: string) {
        return this._getMetaDataForPath(path).type === "directory";
    }

    async hasDirectory(path: string) {
        try {
            return await this.isDirectory(path);
        } catch {
            return false;
        }
    }

    async createDirectory(path: string) {
        path = this._normalizeDirectory(path);

        const name = this.getName(path);
        const directoryPath = this.getDirectoryPath(path);

        this._actIfPathIsEmpty(path, () => {
            const directory = this._createDirectoriesForPath(directoryPath);
            const meta: DirectoryMeta = {
                type: "directory",
                name: name,
                parent: directory,
                items: []
            };

            directory.items.push(meta);

            this._persist();
        });
    }

    private _createDirectoriesForPath(path: string) {
        const parts = this._normalizeDirectory(path).split("/").slice(1, -1);
        let directory = this._meta;

        if (path === "/") {
            return this._meta;
        }

        parts.forEach((part) => {
            let match = directory.items.find(i => i.name === part);

            if (match == null) {
                match = {
                    type: "directory",
                    name: part,
                    parent: directory,
                    items: []
                };
                directory.items.push(match);
            } else if (match.type === "file") {
                throw new Error("Cannot Create Directory");
            }

            directory = match;
        });

        this._persist();
        return directory;
    }

    private _normalizeDirectory(path: string) {
        path = path.trim();
        if (!path.endsWith("/")) {
            path = path + "/";
        }

        if (!path.startsWith("/")) {
            return "/" + path;
        }

        return path;
    }

    private _normalizeFile(path: string) {
        path = path.trim();
        if (path.endsWith("/")) {
            path = path.slice(0, -1);
        }

        if (!path.startsWith("/")) {
            return "/" + path;
        }

        return path;
    }

    getName(path: string) {
        if (path.endsWith("/")) {
            path = this._normalizeDirectory(path);
            path = path.slice(0, -1);
        } else {
            path = this._normalizeFile(path);
        }

        return path.split("/").slice(-1)[0];
    }

    getDirectoryPath(path: string) {
        if (path.endsWith("/")) {
            path = path.slice(0, -1);
        }

        return path.split("/").slice(0, -1).join("/") + "/";
    }

    private _actIfPathIsEmpty(path: string, action: () => void) {
        let metaData: ItemMeta | null = null;
        try {
            metaData = this._getMetaDataForPath(path);
        } catch {
            action();
            return;
        }

        if (metaData.type === "file") {
            throw new Error("File Already Exists");
        } else {
            throw new Error("Directory Already Exists");
        }
    }

    async renameDirectory(path: string, newName: string) {
        const metaData = this._getMetaDataForPath(path);
        if (metaData.type === "file") {
            throw new Error("Directory Not Found");
        }

        metaData.name = newName;
        this._persist();
    }

    async deleteDirectory(path: string) {
        const metaData = this._getMetaDataForPath(path);

        if (metaData.type === "file") {
            throw new Error("Directory Not Found");
        }

        if (metaData.parent != null) {
            const index = metaData.parent.items.indexOf(metaData);

            if (index > -1) {
                metaData.parent.items.splice(index, 1);
                this._recursiveFileDelete(metaData);
                this._persist();
            }
        }
    }

    private _recursiveFileDelete(meta: DirectoryMeta) {
        meta.items.forEach((i) => {
            if (i.type === "file") {
                this._storage.removeItem(i.guid);
            } else {
                this._recursiveFileDelete(i);
            }
        });
    }

    async readDirectory(path: string) {
        const directory = this._getMetaDataForPath(path);

        if (directory.type === "file") {
            throw new Error("Directory Not Found");
        }

        return JSON.parse(JSON.stringify(directory, replacer));
    }

    async walk(callback: (item: ItemMeta) => void) {
        this._walkDown(this._meta, callback, this._meta);
    }

    async getMetaData() {
        return this._normalizeMetaData(JSON.parse(JSON.stringify(this._meta, replacer)));
    }

    private _persist() {
        this._storage.setItem(META_KEY, JSON.stringify(this._meta, replacer));
    }

    async refresh() {
        this._meta = this._getRoot();
    }
}