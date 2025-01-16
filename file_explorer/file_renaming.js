var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "../node_modules/@tcn/state/dist/irunner_broadcast.js";
import { Signal } from "../node_modules/@tcn/state/dist/signal.js";
import "../_virtual/index.js";
class FileRenaming {
  constructor(filePath, fileSystem, onComplete, onAbort) {
    __publicField(this, "_fileSystem");
    __publicField(this, "_name");
    __publicField(this, "_error");
    __publicField(this, "_directory");
    __publicField(this, "_originalFilePath");
    __publicField(this, "_onComplete");
    __publicField(this, "_onAbort");
    this._fileSystem = fileSystem;
    this._name = new Signal(this._getFileName(filePath));
    this._originalFilePath = filePath;
    this._directory = this._getDirectory(filePath);
    this._error = new Signal(null);
    this._onComplete = onComplete;
    this._onAbort = onAbort;
  }
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
  _getDirectory(filePath) {
    return filePath.split("/").slice(0, -1).join("/") + "/";
  }
  _getFileName(filePath) {
    return filePath.split("/").slice(-1)[0];
  }
  updateName(value) {
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
      await this._fileSystem.renameFile(this._originalFilePath, newFilePath);
      this._onComplete(newFilePath);
    }
  }
  async abort() {
    this._onAbort();
  }
}
export {
  FileRenaming
};
