import { Signal } from "@tcn/state";
import { FileSystem } from "./file_system.ts";

export class FileCreation {
    private _fileSystem: FileSystem;
    private _name: Signal<string>;
    private _error: Signal<string | null>;
    private _path: string;
    private _onComplete: (filePath: string) => void;
    private _onAbort: () => void;

    get directory() {
        return this._path;
    }

    get nameBroadcast() {
        return this._name.broadcast;
    }

    get errorBroadcast() {
        return this._error.broadcast;
    }

    constructor(path: string, fileSystem: FileSystem, onComplete: (filePath: string) => void, onAbort: () => void) {
        this._fileSystem = fileSystem;
        this._path = path;
        this._name = new Signal("");
        this._error = new Signal<string | null>(null);
        this._onComplete = onComplete;
        this._onAbort = onAbort;
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
            const fileName = this._path + this._name.get();
            await this._fileSystem.writeFile(fileName, "");
            this._onComplete(fileName);
        }
    }

    async abort() {
        this._onAbort();
    }
}