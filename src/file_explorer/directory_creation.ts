import { Signal } from "@tcn/state";
import { FileSystem } from "./file_system.ts";

export class DirectoryCreation {
    private _fileSystem: FileSystem;
    private _name: Signal<string>;
    private _error: Signal<string | null>;
    private _path: string;
    private _onComplete: () => void;

    get directory() {
        return this._path;
    }

    get nameBroadcast() {
        return this._name.broadcast;
    }

    get errorBroadcast() {
        return this._error.broadcast;
    }

    constructor(path: string, fileSystem: FileSystem, onComplete: () => void) {
        this._fileSystem = fileSystem;
        this._path = path;
        this._name = new Signal("");
        this._error = new Signal<string | null>(null);
        this._onComplete = onComplete;
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
            await this._fileSystem.createDirectory(this._path + this._name.get());
            this._onComplete();
        }
    }

    async abort() {
        this._onComplete();
    }
}