var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "./node_modules/quill/quill.js";
/* empty css                                       */
import "./node_modules/quill/core.js";
import Quill from "./node_modules/quill/core/quill.js";
class TextEditorPresenter {
  constructor(defaultText = "") {
    __publicField(this, "_editor");
    __publicField(this, "_defaultText");
    __publicField(this, "_editorElement");
    this._editor = null;
    this._defaultText = defaultText;
    this._editorElement = null;
  }
  get editor() {
    if (this._editor == null) {
      throw new Error("Editor isn't made yet.");
    }
    return this._editor;
  }
  initialize(element) {
    if (this._editor != null) {
      return;
    }
    element.setAttribute("spellcheck", "false");
    this._editorElement = element;
    this._editor = new Quill(element, {
      theme: "snow",
      modules: {
        toolbar: false
      }
    });
    this.editor.setText(this._defaultText);
    this.editor.on("selection-change", (range, oldRange) => {
      console.log("Selection changed:", range, oldRange);
    });
  }
  setText(text) {
    this.editor.setText(text);
  }
  getText() {
    return this.editor.getText();
  }
  syntaxHighlight(start, end, className) {
    this.editor.formatText(start, end - start, "syntax-highlight", className);
  }
  clearFormatting() {
    const length = this.editor.getLength();
    this.editor.formatText(0, length, "syntax-highlight", false);
  }
  disable() {
    this.editor.enable(false);
  }
  enable() {
    this.editor.enable(true);
  }
  dispose() {
    this._editorElement && (this._editorElement.innerHTML = "");
    this._editor = null;
  }
  onChange(callback) {
    this.editor.on("text-change", callback);
  }
  onSelectionChange(callback) {
    this.editor.on("selection-change", callback);
  }
}
export {
  TextEditorPresenter
};
