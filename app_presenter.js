var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { DiagramPresenter } from "./diagram_presenter.js";
import { TestEditorPresenter } from "./test_editor_presenter.js";
import { GrammarEditorPresenter } from "./grammar_editor_presenter.js";
import "./node_modules/@tcn/state/dist/irunner_broadcast.js";
import { Signal } from "./node_modules/@tcn/state/dist/signal.js";
import "./_virtual/index.js";
import { FileExplorerPresenter } from "./file_explorer/file_explorer_presenter.js";
import { FileSystem } from "./file_explorer/file_system.js";
class AppPresenter {
  constructor() {
    __publicField(this, "_isDocumentationOpen");
    __publicField(this, "_fileSystem");
    __publicField(this, "_currentPath");
    __publicField(this, "grammarEditor");
    __publicField(this, "testEditor");
    __publicField(this, "diagramPresenter");
    __publicField(this, "fileExplorer");
    this._fileSystem = new FileSystem();
    this._currentPath = null;
    this._isDocumentationOpen = new Signal(false);
    this.grammarEditor = new GrammarEditorPresenter({
      onGrammarProcess: (patterns) => {
        this.diagramPresenter.selectPattern(Object.values(patterns));
        this.testEditor.setPatterns(patterns);
      },
      onSave: (content) => {
        if (this._currentPath != null) {
          this._fileSystem.writeFile(this._currentPath, content);
        }
      },
      fileSystem: this._fileSystem
    });
    this.testEditor = new TestEditorPresenter();
    this.diagramPresenter = new DiagramPresenter();
    this.fileExplorer = new FileExplorerPresenter({
      fileSystem: this._fileSystem,
      onPathFocus: async (path, oldPath) => {
        this._currentPath = path;
        if (oldPath != null) {
          try {
            const hasFile = await this._fileSystem.hasFile(oldPath);
            if (!hasFile) {
              throw new Error("File Not Found.");
            }
            const content = this.grammarEditor.textEditor.getText();
            await this._fileSystem.writeFile(oldPath, content);
          } catch {
          }
        }
        try {
          const content = await this._fileSystem.readFile(path);
          this.grammarEditor.setText(content, path);
        } catch {
          this.grammarEditor.setText("", path);
          this.grammarEditor.disable();
        }
      }
    });
  }
  get isDocumentationOpenBroadcast() {
    return this._isDocumentationOpen.broadcast;
  }
  async initialize() {
    var _a;
    await this.fileExplorer.initialize();
    const directory = this.fileExplorer.directoryBroadcast.get();
    if (directory.items.length === 0) {
      await this.fileExplorer.createFile("examples.cpat");
      this.fileExplorer.focus("/examples.cpat");
    } else {
      this.fileExplorer.focus((_a = directory.items[0]) == null ? void 0 : _a.path);
    }
  }
  toggleDocumentation() {
    this._isDocumentationOpen.transform((v) => !v);
  }
  dispose() {
  }
}
export {
  AppPresenter
};
