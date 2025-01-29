import "./syntax_highlight_blot.ts";
import { grammar, Grammar, Pattern } from "clarity-pattern-parser";
import { TextEditorPresenter } from "./text_editor_presenter.ts";
import { FileSystem } from "./file_explorer/file_system.ts";

const KEYWORD_CLASS = 'syntax-keyword';
const LITERAL_CLASS = 'syntax-literal';
const COMMENT_CLASS = 'syntax-comment';
const NAME_CLASS = 'syntax-name';
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

export interface GrammarEditorOptions {
    fileSystem: FileSystem;
    onGrammarProcess: (patterns: Record<string, Pattern>) => void;
    onSave: (content: string) => void;
    onPattern: (pattern: Pattern | null) => void;
}

export class GrammarEditorPresenter {
    private _fileSystem: FileSystem;
    private _cursorPosition: number | null;
    private _path: string;
    private _onGrammarProcess: (patterns: Record<string, Pattern>) => void;
    private _onSave: (content: string) => void;
    private _allPatterns: Record<string, Pattern>;
    private _onPattern: (pattern: Pattern | null) => void;
    readonly textEditor: TextEditorPresenter;


    constructor({ onGrammarProcess, onSave, fileSystem, onPattern }: GrammarEditorOptions) {
        this._fileSystem = fileSystem;
        this._cursorPosition = null;
        this._path = "";
        this._onGrammarProcess = onGrammarProcess;
        this._onSave = onSave;
        this._allPatterns = {};
        this.textEditor = new TextEditorPresenter();
        this._onPattern = onPattern;
    }

    initialize() {
        this.textEditor.onChange((_1, _2, source) => {
            if (source === "user") {
                this._processGrammar();
                this._highlight();
                const range = this.textEditor.editor.getSelection();

                if (range != null) {
                    this._cursorPosition = range.index;
                }
                this._processCursorToPattern();
            }
        });

        this.textEditor.onSelectionChange((range) => {
            if (range != null) {
                this._cursorPosition = range.index;
            }
            this._processCursorToPattern();
        });

        this.textEditor.editor.keyboard.addBinding({
            key: 's',
            shortKey: true
        }, () => {
            this._onSave(this.textEditor.getText());
            return false;
        });
    }

    private async _processGrammar() {
        const text = this.textEditor.getText();
        try {
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

            this._allPatterns = allPatterns;
            this._processCursorToPattern();
            this._onGrammarProcess(allPatterns);
        } catch (e: any) {
            console.log("Grammar Error:", e.message.replaceAll("\n", "\\n"));
        }

        if (text === "") {
            this._allPatterns = {};
            this._onGrammarProcess({});
        }
    }

    private _processCursorToPattern() {
        if (this._cursorPosition == null) {
            this._onPattern(null);
            return;
        }

        try {
            const text = this.textEditor.getText();
            const { ast } = grammar.exec(text);
            const index = this._cursorPosition;

            if (ast != null) {
                let node = ast.find(n => (n.name === "assign-statement" || n.name === "export-name") && index >= n.startIndex && index < n.endIndex);

                if (node == null) {
                    // This takes the last pattern if there is one.
                    node = ast.findAll(n => (n.name === "assign-statement" || n.name === "export-name")).slice(-1)[0] || null;
                }

                if (node != null && node.name === "assign-statement") {
                    const name = node.children[0].value;
                    const pattern = this._allPatterns[name];
                    this._onPattern(pattern);
                } else if (node != null && node.name === "export-name") {
                    const name = node.value;
                    const pattern = this._allPatterns[name];
                    this._onPattern(pattern);
                }

            }
        } catch {

        }

    }

    private _highlight() {
        const textEditor = this.textEditor;
        const text = textEditor.getText();
        //const [start, end] = this._getDeltaIndex(delta);
        const { ast, cursor } = grammar.exec(text, true);

        if (ast != null) {
            textEditor.clearFormatting();
            ast.walkDown((node) => {
                if (nodeColorMap[node.name] != null) {
                    textEditor.syntaxHighlight(node.startIndex, node.endIndex, nodeColorMap[node.name]);
                }
            });
        } else {
            const nodes = cursor.allMatchedNodes.slice();
            nodes.sort((a, b) => a.endIndex - b.endIndex);
            const furthestMatch = nodes[nodes.length - 1];

            if (furthestMatch != null) {
                const { endIndex: startIndex } = furthestMatch;
                const endIndex = cursor.length;
                this.textEditor.syntaxHighlight(startIndex, endIndex, "syntax-error");
            } else {
                this.textEditor.syntaxHighlight(0, cursor.length, "syntax-error");
            }
        }
    }

    disable() {
        this.textEditor.editor.disable();
    }

    setText(text: string, path: string) {
        this.textEditor.editor.enable();
        this._path = path;
        this.textEditor.setText(text);
        this._processGrammar();
        this._highlight();
        this._clearEditorState();
    }

    private _clearEditorState() {
        const history = this.textEditor.editor.getModule("history") as any;

        if (history != null) {
            history.stack.undo = [];
            history.stack.redo = [];
        }
    }

}