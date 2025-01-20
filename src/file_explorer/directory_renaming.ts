import { Signal } from "@tcn/state";
import { FileSystem } from "./file_system.ts";

export class DirectoryRenaming {
    private _fileSystem: FileSystem;
    private _name: Signal<string>;
    private _error: Signal<string | null>;
    private _directory: string;
    private _originalFilePath: string;
    private _onComplete: (fileName: string) => void;
    private _onAbort: () => void;

    get directory() {
        return this._directory;
    }

    get nameBroadcast() {
        return this._name.broadcast;
    }

    get directoryPath() {
        return this._originalFilePath;
    }

    get errorBroadcast() {
        return this._error.broadcast;
    }

    constructor(directoryPath: string, fileSystem: FileSystem, onComplete: (fileName: string) => void, onAbort: () => void) {
        this._fileSystem = fileSystem;
        this._name = new Signal(this._getDirectoryName(directoryPath));
        this._originalFilePath = directoryPath;
        this._directory = this._getParentDirectory(directoryPath);
        this._error = new Signal<string | null>(null);
        this._onComplete = onComplete;
        this._onAbort = onAbort;
    }

    private _getParentDirectory(directoryPath: string) {
        return directoryPath.split("/").slice(0, -1).join("/") + "/";
    }

    private _getDirectoryName(directoryPath: string) {
        return directoryPath.split("/").slice(-1)[0];
    }

    updateName(value: string) {
        this._name.set(value);

        if (value.trim().length === 0) {
            this._error.set("Directory name cannot be empty.");
            return;
        }

        if (value.includes(" ")) {
            this._error.set("Cannot have spaces in directory name.");
            return;
        }

        if (value.includes("/")) {
            this._error.set("Cannot have forward slashes in directory name.");
            return;
        }

        if (value.includes(".")) {
            this._error.set("Cannot have periods in there name.");
            return;
        }

        this._error.set(null);
    }

    async commit() {
        if (this._error.get() == null) {
            const newFilePath = this._directory + this._name.get();
            await this._fileSystem.renameDirectory(this._originalFilePath, this._name.get());
            this._onComplete(newFilePath);
        }
    }

    async abort() {
        this._onAbort();
    }
}