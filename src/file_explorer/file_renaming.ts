import { Signal } from "@tcn/state";
import { FileSystem } from "./file_system.ts";

export class FileRenaming {
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

    get filePath() {
        return this._originalFilePath;
    }

    get errorBroadcast() {
        return this._error.broadcast;
    }

    constructor(filePath: string, fileSystem: FileSystem, onComplete: (fileName: string) => void, onAbort: () => void) {
        this._fileSystem = fileSystem;
        this._name = new Signal(this._getFileName(filePath));
        this._originalFilePath = filePath;
        this._directory = this._getDirectory(filePath);
        this._error = new Signal<string | null>(null);
        this._onComplete = onComplete;
        this._onAbort = onAbort;
    }

    private _getDirectory(filePath: string) {
        return filePath.split("/").slice(0, -1).join("/") + "/";
    }

    private _getFileName(filePath: string) {
        return filePath.split("/").slice(-1)[0];
    }

    updateName(value: string) {
        this._name.set(value);

        if (value.trim().length === 0) {
            this._error.set("File name cannot be empty.");
            return;
        }

        if (value.includes(" ")) {
            this._error.set("Cannot have spaces in file name.");
            return;
        }

        if (value.includes("/")) {
            this._error.set("Cannot have forward slashes in file name.");
            return;
        }

        this._error.set(null);
    }

    async commit() {
        if (this._error.get() == null) {
            const newFilePath = this._directory + this._name.get();
            await this._fileSystem.renameFile(this._originalFilePath, this._name.get());
            this._onComplete(newFilePath);
        }
    }

    async abort() {
        this._onAbort();
    }
}