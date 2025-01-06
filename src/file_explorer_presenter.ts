import { Signal } from "@tcn/state";
import { FileSystem } from "./file_system.ts";
import { FileCreation } from "./file_creation.ts";

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



export interface FileExplorerOptions {
    fileSystem: FileSystem;
    onPathFocus: (path: string, oldPath: string | null) => void;
}

export class FileExplorerPresenter {
    private _fileSystem: FileSystem;
    private _directory: Signal<Directory>;
    private _directories: Map<string, Directory>;
    private _files: Map<string, File>;
    private _openDirectories: Signal<Map<string, boolean>>;
    private _focusedItem: Signal<File | Directory | null>;
    private _onPathFocus: (path: string, oldPath: string | null) => void;
    private _pendingFileCreation: Signal<FileCreation | null>;

    get directoryBroadcast() {
        return this._directory.broadcast;
    }

    get openDirectoriesBroadcast() {
        return this._openDirectories.broadcast;
    }

    get focusedItemBroadcast() {
        return this._focusedItem.broadcast;
    }

    get pendingFileCreationBroadcast() {
        return this._pendingFileCreation.broadcast;
    }

    constructor(options: FileExplorerOptions) {
        this._fileSystem = options.fileSystem;
        this._onPathFocus = options.onPathFocus;
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
        this._pendingFileCreation = new Signal<FileCreation | null>(null);
    }

    async initialize() {
        await this._updateDirectories();
    }

    async refresh(){
        return this._updateDirectories();
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
        const focusedItem = this._focusedItem.get();
        const oldPath = focusedItem == null ? null : focusedItem.path;

        if (oldPath === path) {
            return;
        }

        if (file != null) {
            this._focusedItem.set(file);
            this._onPathFocus(path, oldPath);
            return;
        }

        const directory = this._directories.get(path);
        if (directory != null) {
            this._focusedItem.set(directory);
            this._onPathFocus(path, oldPath);
            return;
        }
    }

    startFileCreation() {
        const currentDirectory = this._focusedItem.get();
        let path = "/";

        if (currentDirectory && currentDirectory.type === "file") {
            path = currentDirectory.directory;
        } else if (currentDirectory && currentDirectory.type === "directory") {
            path = currentDirectory.path;
        }

        this._pendingFileCreation.set(new FileCreation(path, this._fileSystem, async () => {
            this._pendingFileCreation.set(null);
            await this.refresh();
            this.focus(path);
        }));
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