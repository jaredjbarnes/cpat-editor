var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "../node_modules/@tcn/state/dist/irunner_broadcast.js";
import { Signal } from "../node_modules/@tcn/state/dist/signal.js";
import "../_virtual/index.js";
class DirectoryCreation {
  constructor(path, fileSystem, onComplete) {
    __publicField(this, "_fileSystem");
    __publicField(this, "_name");
    __publicField(this, "_error");
    __publicField(this, "_path");
    __publicField(this, "_onComplete");
    this._fileSystem = fileSystem;
    this._path = path;
    this._name = new Signal("");
    this._error = new Signal(null);
    this._onComplete = onComplete;
  }
  get directory() {
    return this._path;
  }
  get nameBroadcast() {
    return this._name.broadcast;
  }
  get errorBroadcast() {
    return this._error.broadcast;
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
export {
  DirectoryCreation
};
