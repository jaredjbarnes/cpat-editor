var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class FileSystem {
  constructor(storage = window.localStorage) {
    __publicField(this, "_storage");
    this._storage = storage;
    try {
      this._getMetadata("/");
    } catch (_) {
      this._setMetadata("/", {
        isFile: false,
        name: "",
        path: "/"
      });
    }
  }
  async isFile(path) {
    try {
      return this._getMetadata(path).isFile;
    } catch (_) {
      return false;
    }
  }
  async isDirectory(path) {
    try {
      return !this._getMetadata(path).isFile;
    } catch (_) {
      return false;
    }
  }
  async readFile(path) {
    const metadata = this._getMetadata(path);
    if (!metadata.isFile) {
      throw new Error(`Path is a Directory.`);
    }
    const content = this._storage.getItem(path);
    if (content == null) {
      throw new Error(`File Not Found: ${path}`);
    }
    return content;
  }
  _getMetadata(path) {
    const data = this._storage.getItem(this._getMetadataPath(path));
    if (data == null) {
      throw new Error(`File Not Found: ${path}`);
    }
    try {
      return JSON.parse(data);
    } catch (_) {
      throw new Error(`Corrupt Metadata: ${path}`);
    }
  }
  _getMetadataPath(path) {
    return `$$Meta$$_${path}`;
  }
  async writeFile(path, content) {
    if (path === "/") {
      throw new Error("Cannot save a file to the root path.");
    }
    this._setMetadata(path, { isFile: true, path, name: this._getFileName(path) });
    this._storage.setItem(path, content);
  }
  async renameFile(path, newPath) {
    const hasFile = await this.hasFile(path);
    if (hasFile) {
      const content = await this.readFile(path);
      await this.writeFile(newPath, content);
      await this.deleteFile(path);
    } else {
      throw new Error("Cannot find file to rename.");
    }
  }
  _getFileName(path) {
    return path.split("/").slice(-1)[0];
  }
  _setMetadata(path, data) {
    this._storage.setItem(this._getMetadataPath(path), JSON.stringify(data));
  }
  _deleteMetadata(path) {
    this._storage.removeItem(this._getMetadataPath(path));
  }
  async hasFile(path) {
    const content = this._storage.getItem(path);
    if (content == null) {
      return false;
    }
    return true;
  }
  async deleteFile(path) {
    const content = this._storage.getItem(path);
    if (content == null) {
      throw new Error(`File Not Found: ${path}`);
    }
    this._deleteMetadata(path);
    this._storage.removeItem(path);
  }
  async createDirectory(path) {
    path = path.endsWith("/") ? path : path + "/";
    const name = path.split("/").slice(-2)[0];
    this._setMetadata(path, { isFile: false, path, name });
  }
  async deleteDirectory(path) {
    const items = await this.readDirectory(path);
    for (const item of items) {
      if (item.isFile) {
        await this.deleteFile(item.path);
      } else {
        await this.deleteDirectory(item.path);
      }
    }
    this._deleteMetadata(path);
  }
  async readDirectory(path) {
    try {
      const metadata = this._getMetadata(path);
      if (metadata.isFile) {
        throw new Error();
      }
    } catch (_) {
      throw new Error(`Directory Not Found: ${path}`);
    }
    path = path.endsWith("/") ? path : path + "/";
    const depth = path.split("/").length;
    const allMetadata = [];
    for (let x = 0; x < this._storage.length; x++) {
      try {
        const storagePath = this._storage.key(x);
        if (storagePath == null) {
          continue;
        }
        const isFile = !storagePath.startsWith("$$Meta$$_");
        const isDirectory = storagePath.endsWith("/");
        if (isFile) {
          const metadata = this._getMetadata(storagePath);
          const isCorrectDepth = metadata.path.split("/").length === depth;
          if (storagePath.startsWith(path) && isCorrectDepth) {
            allMetadata.push(metadata);
          }
        } else if (isDirectory) {
          const metadata = this._getMetadata(storagePath.split("$$Meta$$_")[1]);
          const isCorrectDepth = metadata.path.split("/").length - 1 === depth;
          if (isCorrectDepth && metadata.path.startsWith(path)) {
            allMetadata.push(metadata);
          }
        }
      } catch (_) {
      }
    }
    return allMetadata;
  }
  async walkDirectory(callback, fromPath = "/") {
    const items = await this.readDirectory(fromPath);
    const directories = [];
    const pathParts = fromPath.split("/");
    const name = pathParts.length > 2 ? pathParts.slice(-2)[0] : pathParts.slice(-1)[0];
    const directory = pathParts.slice(0, -2).join("/") + "/";
    callback(directory, name, fromPath, false);
    items.forEach((metadata) => {
      if (metadata.isFile) {
        const fileName = this._getFileName(metadata.path);
        callback(fromPath, fileName, metadata.path, true);
      } else {
        directories.push(metadata);
      }
    });
    for (let directory2 of directories) {
      await this.walkDirectory(callback, directory2.path);
    }
  }
}
export {
  FileSystem
};
