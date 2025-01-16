var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "./syntax_highlight_blot.js";
import { Grammar, grammar } from "./node_modules/clarity-pattern-parser/dist/index.esm.js";
import { TextEditorPresenter } from "./text_editor_presenter.js";
const KEYWORD_CLASS = "syntax-keyword";
const LITERAL_CLASS = "syntax-literal";
const COMMENT_CLASS = "syntax-comment";
const NAME_CLASS = "syntax-name";
const STRUCTURE_CLASS = "syntax-structure";
const REGEX_CLASS = "syntax-regex";
const nodeColorMap = {
  // String Literals
  "literal": LITERAL_CLASS,
  "resource": LITERAL_CLASS,
  // Keywords
  "import": KEYWORD_CLASS,
  "use-params": KEYWORD_CLASS,
  "with-params": KEYWORD_CLASS,
  "from": KEYWORD_CLASS,
  "as": KEYWORD_CLASS,
  // Comments
  "comment": COMMENT_CLASS,
  // Names
  "name": NAME_CLASS,
  "alias-literal": NAME_CLASS,
  "pattern-name": NAME_CLASS,
  "import-name": NAME_CLASS,
  "import-name-alias": NAME_CLASS,
  "divider-pattern": NAME_CLASS,
  "param-name": NAME_CLASS,
  // Language Structure
  "open-bracket": STRUCTURE_CLASS,
  "close-bracket": STRUCTURE_CLASS,
  "open-paren": STRUCTURE_CLASS,
  "close-paren": STRUCTURE_CLASS,
  "quantifier-shorthand": STRUCTURE_CLASS,
  "is-optional": STRUCTURE_CLASS,
  // Regex
  "regex-literal": REGEX_CLASS
};
class GrammarEditorPresenter {
  constructor({ onGrammarProcess, onSave, fileSystem }) {
    __publicField(this, "_fileSystem");
    __publicField(this, "_path");
    __publicField(this, "_onGrammarProcess");
    __publicField(this, "_onSave");
    __publicField(this, "textEditor");
    this._fileSystem = fileSystem;
    this._path = "";
    this._onGrammarProcess = onGrammarProcess;
    this._onSave = onSave;
    this.textEditor = new TextEditorPresenter();
  }
  initialize() {
    this.textEditor.onChange((_1, _2, source) => {
      if (source === "user") {
        this._processGrammar();
        this._highlight();
      }
    });
    this.textEditor.editor.keyboard.addBinding({
      key: "s",
      shortKey: true
    }, () => {
      this._onSave(this.textEditor.getText());
      return false;
    });
  }
  async _processGrammar() {
    const text = this.textEditor.getText();
    try {
      const startTime = performance.now();
      const allPatterns = await Grammar.parse(text, {
        originResource: this._path,
        resolveImport: async (resource, originResource) => {
          const origin = originResource == null ? "/" : originResource;
          const url = new URL(resource, window.location.origin + origin);
          const path = url.pathname;
          try {
            const expression = await this._fileSystem.readFile(path);
            return { expression, resource: path };
          } catch {
            throw new Error(`File not found: ${path}`);
          }
        }
      });
      console.log("Build Pattern Time: ", performance.now() - startTime);
      this._onGrammarProcess(allPatterns);
    } catch (_) {
      console.log("Bad Grammar");
    }
    if (text === "") {
      this._onGrammarProcess({});
    }
  }
  _highlight() {
    const textEditor = this.textEditor;
    const text = textEditor.getText();
    const { ast, cursor } = grammar.exec(text);
    if (ast != null) {
      textEditor.clearFormatting();
      ast.walkDown((node) => {
        if (nodeColorMap[node.name] != null) {
          textEditor.syntaxHighlight(node.startIndex, node.endIndex, nodeColorMap[node.name]);
        }
      });
    } else {
      if (cursor.furthestError != null) {
        const { endIndex: startIndex } = cursor.furthestError;
        const endIndex = cursor.length;
        textEditor.syntaxHighlight(startIndex, endIndex, "syntax-error");
      } else {
        textEditor.syntaxHighlight(0, cursor.length, "syntax-error");
      }
    }
  }
  disable() {
    this.textEditor.editor.disable();
  }
  setText(text, path) {
    this.textEditor.editor.enable();
    this._path = path;
    this.textEditor.setText(text);
    this._processGrammar();
    this._highlight();
    this._clearEditorState();
  }
  _clearEditorState() {
    const history = this.textEditor.editor.getModule("history");
    if (history != null) {
      history.stack.undo = [];
      history.stack.redo = [];
    }
  }
}
export {
  GrammarEditorPresenter
};
