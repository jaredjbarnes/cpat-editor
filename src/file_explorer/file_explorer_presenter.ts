import { Signal } from "@tcn/state";
import { FileSystem, ItemMeta } from "./file_system.ts";
import { FileCreation } from "./file_creation.ts";
import { DirectoryCreation } from "./directory_creation.ts";
import { FileRenaming } from "./file_renaming.ts";

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
    private _pendingDirectoryCreation: Signal<DirectoryCreation | null>;
    private _pendingFileRenaming: Signal<FileRenaming | null>;

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

    get pendingDirectoryCreationBroadcast() {
        return this._pendingDirectoryCreation.broadcast;
    }

    get pendingFileRenamingBroadcast() {
        return this._pendingFileRenaming.broadcast;
    }

    constructor(options: FileExplorerOptions) {
        this._fileSystem = options.fileSystem;
        this._onPathFocus = options.onPathFocus;
        this._directory = new Signal<Directory>({
            type: "directory",
            name: "",
            items: [],
            path: "",
            directory: ""
        });
        this._directories = new Map();
        this._files = new Map();
        this._openDirectories = new Signal(new Map());
        this._directories.set(this._directory.get().path, this._directory.get());
        this._focusedItem = new Signal<File | Directory | null>(null);
        this._pendingFileCreation = new Signal<FileCreation | null>(null);
        this._pendingDirectoryCreation = new Signal<DirectoryCreation | null>(null);
        this._pendingFileRenaming = new Signal<FileRenaming | null>(null);
    }

    async initialize() {
        await this._updateDirectories();
    }

    async refresh() {
        return this._updateDirectories();
    }

    private async _updateDirectories() {
        const directories = new Map<string, Directory>();
        const files = new Map<string, File>();

        directories.set("/", {
            type: "directory",
            directory: "",
            name: "",
            path: "/",
            items: []
        });

        await this._fileSystem.walk((itemMeta: ItemMeta) => {
            const path = this._makePathFromMetaData(itemMeta);
            const name = this._fileSystem.getName(path);
            const directoryPath = this._fileSystem.getDirectoryPath(path);
            const isFile = itemMeta.type === "file";

            if (path === "/") {
                return;
            }

            let directory = directories.get(directoryPath);
            if (directory == null) {
                directory = this._makeDirectoryFromPath(directoryPath);
                directories.set(directoryPath, directory);
            }

            if (isFile) {
                const file: File = {
                    type: "file",
                    directory: directoryPath,
                    name,
                    path,
                };

                directory.items.push(file);
                files.set(path, file);

            } else {
                let childDirectory = directories.get(path);
                if (childDirectory == null) {
                    childDirectory = this._makeDirectoryFromPath(path);
                    directories.set(path, childDirectory);
                }
                directory.items.push(childDirectory);
            }
        });

        const rootDirectory = directories.get("/");
        Array.from(directories.values()).forEach(d => {
            d.items.sort((a, b) => {
                if (a.type === "directory" && b.type === "directory") {
                    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
                } else if (a.type === "directory" && b.type === "file") {
                    return -1;
                } else if (a.type === "file" && b.type === "file") {
                    return 1;
                } else {
                    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
                }
            });
        });

        if (rootDirectory != null) {
            this._directory.set(rootDirectory);
        }

        this._directories = directories;
        this._files = files;
    }

    private _makePathFromMetaData(metaData: ItemMeta) {
        if (metaData.parent == null) {
            return "/";
        }

        const parts: string[] = [];
        let item: ItemMeta | null = metaData;

        parts.unshift(metaData.name);
        item = metaData.parent;

        while (item?.parent != null) {
            parts.unshift(item.name);
            item = item.parent;
        }

        const path = "/" + parts.join("/");

        if (metaData.type === "directory") {
            return path + "/";
        }

        return path;
    }

    private _makeDirectoryFromPath(path: string): Directory {
        return {
            type: 'directory',
            directory: this._fileSystem.getDirectoryPath(path),
            name: this._fileSystem.getName(path),
            path: path,
            items: []
        };
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

    startRenamingFile(filePath: string) {
        this._pendingFileRenaming.set(new FileRenaming(filePath, this._fileSystem, async (filePath: string) => {
            this._pendingFileRenaming.set(null);
            await this.refresh();
            this.focus(filePath);
        }, async () => {
            this._pendingFileRenaming.set(null);
            await this.refresh();
        }));
    }

    startFileCreation() {
        const currentDirectory = this._focusedItem.get();
        let path = "/";

        if (currentDirectory && currentDirectory.type === "file") {
            path = currentDirectory.directory;
        } else if (currentDirectory && currentDirectory.type === "directory") {
            path = currentDirectory.path;
        }

        this._pendingFileCreation.set(new FileCreation(path, this._fileSystem, async (filePath: string) => {
            this._pendingFileCreation.set(null);
            await this.refresh();
            this.focus(filePath);
        }, async () => {
            this._pendingFileCreation.set(null);
            await this.refresh();
        }));
    }

    startDirectoryCreation() {
        const currentDirectory = this._focusedItem.get();
        let path = "/";

        if (currentDirectory && currentDirectory.type === "file") {
            path = currentDirectory.directory;
        } else if (currentDirectory && currentDirectory.type === "directory") {
            path = currentDirectory.path;
        }

        this._pendingDirectoryCreation.set(new DirectoryCreation(path, this._fileSystem, async () => {
            this._pendingDirectoryCreation.set(null);
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