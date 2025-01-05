import { Signal } from "@tcn/state";
import { FileSystem } from "./file_system.ts";

export interface File {
    type: 'file';
    path: string;
    directory: string;
    name: string;
}

export interface Directory {
    type: 'directory';
    name: string;
    path: string;
    directory: string;
    items: (File | Directory)[];
}

export class FileExplorerPresenter {
    private _fileSystem: FileSystem;
    private _directory: Signal<Directory>;
    private _directories: Map<string, Directory>;
    private _files: Map<string, File>;
    private _openDirectories: Signal<Map<string, boolean>>;
    private _focusedItem: Signal<File | Directory | null>;

    get directoryBroadcast() {
        return this._directory.broadcast;
    }

    get openDirectoriesBroadcast() {
        return this._openDirectories.broadcast;
    }

    constructor() {
        this._fileSystem = new FileSystem();
        this._directory = new Signal<Directory>({
            type: "directory",
            name: "",
            items: [],
            path: "/",
            directory: ""
        });
        this._directories = new Map();
        this._files = new Map();
        this._openDirectories = new Signal(new Map());
        this._directories.set(this._directory.get().path, this._directory.get());
        this._focusedItem = new Signal<File | Directory | null>(null);
    }

   async initialize() {
        await this._updateDirectories();
    }

    private async _updateDirectories() {
        this._directories.clear();
        this._files.clear();

        await this._fileSystem.walkDirectory((directory, name, path, isFile) => {

            if (isFile) {
                const fileDirectory = this._directories.get(directory);
                if (fileDirectory == null) {
                    throw new Error(`Couldn't find directory: ${path}`);
                }

                const file: File = {
                    type: "file",
                    directory,
                    name,
                    path,
                };

                fileDirectory.items.push(file);

                this._files.set(path, file);

            } else {
                this._directories.set(directory, {
                    type: "directory",
                    directory,
                    name,
                    path,
                    items: [],
                });
            }
        });

        const rootDirectory = this._directories.get("/");

        if (rootDirectory != null) {
            this._directory.set(rootDirectory);
        }
    }

    focus(path: string) {
        const file = this._files.get(path);
        if (file != null) {
            this._focusedItem.set(file);
            return;
        }

        const directory = this._directories.get(path);
        if (directory != null) {
            this._focusedItem.set(directory);
        }
    }

    async createFile(name: string, content = "") {
        name = name.endsWith("cpat") ? name : `${name}.cpat`;
        const currentDirectory = this._focusedItem.get();

        if (currentDirectory == null) {
            await this._fileSystem.writeFile(`/${name}`, content);
        } else if (currentDirectory.type === "directory") {
            await this._fileSystem.writeFile(currentDirectory.path + name, "");
        } else {
            await this._fileSystem.writeFile(`${currentDirectory.directory}/${name}`, "");
        }

        await this._updateDirectories();
    }

    async deleteFile(path: string) {
        try {
            await this._fileSystem.deleteFile(path);
        } catch (_) {
        }
        
        await this._updateDirectories();
    }

    async updateFile(path: string, content: string) {
        await this._fileSystem.writeFile(path, content);
        await this._updateDirectories();
    }

   async createDirectory(name: string) {
        name = name.endsWith("/") ? name : `${name}/`;

        const currentDirectory = this._focusedItem.get();

        if (currentDirectory == null) {
            await this._fileSystem.createDirectory(`/${name}`);
        } else if (currentDirectory.type === "directory") {
           await this._fileSystem.createDirectory(currentDirectory.path + name);
        } else {
            await this._fileSystem.createDirectory(`${currentDirectory.directory}/${name}`);
        }

        await this._updateDirectories();
    }

    async deleteDirectory(path: string) {
        await this._fileSystem.deleteDirectory(path);
        await this._updateDirectories();
    }

    openDirectory(path: string) {
        this._openDirectories.transform(m => {
            m.set(path, true);
            return m;
        });
    }

    closeDirectory(path: string) {
        this._openDirectories.transform(m => {
            m.set(path, false);
            return m;
        });
    }

    toggleDirectory(path: string) {
        this._openDirectories.transform(m => {
            m.set(path, !m.get(path));
            return m;
        });
    }
}