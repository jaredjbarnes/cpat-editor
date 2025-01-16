var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { Sequence, Optional, Regex } from "./node_modules/clarity-pattern-parser/dist/index.esm.js";
import { TextEditorPresenter } from "./text_editor_presenter.js";
import "./node_modules/@tcn/state/dist/irunner_broadcast.js";
import { Signal } from "./node_modules/@tcn/state/dist/signal.js";
import "./_virtual/index.js";
class TestEditorPresenter {
  constructor() {
    __publicField(this, "_ast");
    __publicField(this, "_selectedPattern");
    __publicField(this, "_patterns");
    __publicField(this, "textEditor");
    this._ast = new Signal("");
    this._selectedPattern = new Signal(null);
    this._patterns = new Signal({});
    this.textEditor = new TextEditorPresenter();
  }
  get patternsBroadcast() {
    return this._patterns.broadcast;
  }
  get selectedPatternBroadcast() {
    return this._selectedPattern.broadcast;
  }
  get astBroadcast() {
    return this._ast.broadcast;
  }
  initialize() {
    this.textEditor.onChange((_d, _od, source) => {
      if (source === "user") {
        this._process();
      }
    });
  }
  _process() {
    const patterns = this._patterns.get();
    const testPatternName = this._selectedPattern.get();
    const pattern = patterns[String(testPatternName)];
    if (pattern != null) {
      const editorPattern = new Sequence("editor-pattern-wrapper", [
        new Optional("optional-space", new Regex("space", "\\s+")),
        pattern,
        new Optional("optional-space", new Regex("space", "\\s+"))
      ]);
      this.textEditor.clearFormatting();
      const text = this.textEditor.getText();
      const startTime = performance.now();
      const { ast, cursor } = editorPattern.exec(text);
      const parseDuration = performance.now() - startTime;
      console.log("Test Parse Time: ", parseDuration);
      if (ast != null) {
        const rootAst = ast.children[0];
        this._ast.set(rootAst.toJson(2));
      } else {
        this._ast.set("");
        if (cursor.furthestError != null) {
          const { endIndex: startIndex } = cursor.furthestError;
          const endIndex = cursor.length;
          this.textEditor.syntaxHighlight(startIndex, endIndex, "syntax-error");
          console.log(startIndex);
        } else {
          this.textEditor.syntaxHighlight(0, cursor.length, "syntax-error");
        }
      }
    }
  }
  setPatterns(patterns) {
    this._patterns.set(patterns);
    this._process();
  }
  selectPattern(name) {
    this._selectedPattern.set(name);
    this._process();
  }
  dispose() {
  }
}
export {
  TestEditorPresenter
};
