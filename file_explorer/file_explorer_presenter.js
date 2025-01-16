var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "../node_modules/@tcn/state/dist/irunner_broadcast.js";
import { Signal } from "../node_modules/@tcn/state/dist/signal.js";
import "../_virtual/index.js";
import { FileCreation } from "./file_creation.js";
import { DirectoryCreation } from "./directory_creation.js";
import { FileRenaming } from "./file_renaming.js";
class FileExplorerPresenter {
  constructor(options) {
    __publicField(this, "_fileSystem");
    __publicField(this, "_directory");
    __publicField(this, "_directories");
    __publicField(this, "_files");
    __publicField(this, "_openDirectories");
    __publicField(this, "_focusedItem");
    __publicField(this, "_onPathFocus");
    __publicField(this, "_pendingFileCreation");
    __publicField(this, "_pendingDirectoryCreation");
    __publicField(this, "_pendingFileRenaming");
    this._fileSystem = options.fileSystem;
    this._onPathFocus = options.onPathFocus;
    this._directory = new Signal({
      type: "directory",
      name: "",
      items: [],
      path: "/",
      directory: ""
    });
    this._directories = /* @__PURE__ */ new Map();
    this._files = /* @__PURE__ */ new Map();
    this._openDirectories = new Signal(/* @__PURE__ */ new Map());
    this._directories.set(this._directory.get().path, this._directory.get());
    this._focusedItem = new Signal(null);
    this._pendingFileCreation = new Signal(null);
    this._pendingDirectoryCreation = new Signal(null);
    this._pendingFileRenaming = new Signal(null);
  }
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
  async initialize() {
    await this._updateDirectories();
  }
  async refresh() {
    return this._updateDirectories();
  }
  async _updateDirectories() {
    const directories = /* @__PURE__ */ new Map();
    const files = /* @__PURE__ */ new Map();
    directories.set("/", {
      type: "directory",
      directory: "",
      name: "",
      path: "/",
      items: []
    });
    await this._fileSystem.walkDirectory((directoryPath, name, path, isFile) => {
      if (path === "/") {
        return;
      }
      let directory = directories.get(directoryPath);
      if (directory == null) {
        directory = this._makeDirectoryFromPath(directoryPath);
        directories.set(directoryPath, directory);
      }
      if (isFile) {
        const file = {
          type: "file",
          directory: directoryPath,
          name,
          path
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
    Array.from(directories.values()).forEach((d) => {
      d.items.sort((a, b) => {
        if (a.path.endsWith("/") && b.path.endsWith("/")) {
          return a.name.localeCompare(b.name, void 0, { sensitivity: "base" });
        } else if (a.path.endsWith("/") && !b.path.endsWith("/")) {
          return -1;
        } else if (!a.path.endsWith("/") && b.path.endsWith("/")) {
          return 1;
        } else {
          return a.name.localeCompare(b.name, void 0, { sensitivity: "base" });
        }
      });
    });
    if (rootDirectory != null) {
      this._directory.set(rootDirectory);
    }
    this._directories = directories;
    this._files = files;
  }
  _makeDirectoryFromPath(path) {
    const pathParts = path.split("/");
    return {
      type: "directory",
      directory: pathParts.slice(0, -2).join("/") + "/",
      name: pathParts.slice(-2, -1).join("/"),
      path,
      items: []
    };
  }
  focus(path) {
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
  startRenamingFile(filePath) {
    this._pendingFileRenaming.set(new FileRenaming(filePath, this._fileSystem, async (filePath2) => {
      this._pendingFileRenaming.set(null);
      await this.refresh();
      this.focus(filePath2);
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
    this._pendingFileCreation.set(new FileCreation(path, this._fileSystem, async (filePath) => {
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
  async createFile(name, content = "") {
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
  async deleteFile(path) {
    try {
      await this._fileSystem.deleteFile(path);
    } catch (_) {
    }
    await this._updateDirectories();
  }
  async updateFile(path, content) {
    await this._fileSystem.writeFile(path, content);
    await this._updateDirectories();
  }
  async createDirectory(name) {
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
  async deleteDirectory(path) {
    await this._fileSystem.deleteDirectory(path);
    await this._updateDirectories();
  }
  openDirectory(path) {
    this._openDirectories.transform((m) => {
      m.set(path, true);
      return m;
    });
  }
  closeDirectory(path) {
    this._openDirectories.transform((m) => {
      m.set(path, false);
      return m;
    });
  }
  toggleDirectory(path) {
    this._openDirectories.transform((m) => {
      m.set(path, !m.get(path));
      return m;
    });
  }
}
export {
  FileExplorerPresenter
};
