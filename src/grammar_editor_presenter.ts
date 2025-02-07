import "./syntax_highlight_blot.ts";
import { grammar, Grammar, Pattern } from "clarity-pattern-parser";
import { FileSystem } from "./file_explorer/file_system.ts";
import { EditorPresenter } from "./monaco_editor/editor_presenter.ts";
import { MarkerSeverity } from "monaco-editor";

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
    private _allPatterns: Record<string, Pattern>;
    private _onPattern: (pattern: Pattern | null) => void;
    readonly textEditor: EditorPresenter;

    constructor({ onGrammarProcess, onSave, fileSystem, onPattern }: GrammarEditorOptions) {
        this._fileSystem = fileSystem;
        this._cursorPosition = null;
        this._path = "";
        this._onGrammarProcess = onGrammarProcess;
        this._allPatterns = {};
        this.textEditor = new EditorPresenter("cpat", onSave);
        this._onPattern = onPattern;
    }

    initialize() {
        this.textEditor.onChange((_, model) => {
            this._processGrammar();
            this._markErrors();
            const range = this.textEditor.editor.getSelection();

            if (range != null && model != null) {
                this._cursorPosition = model.getOffsetAt(range.getStartPosition());
            }
            this._processCursorToPattern();
        });

        this.textEditor.onSelectionChange((range, model) => {
            if (range != null && model != null) {
                this._cursorPosition = model.getOffsetAt(range.getStartPosition());
            }
            this._processCursorToPattern();
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

    private _markErrors() {
        const textEditor = this.textEditor;
        const text = textEditor.getText();
        const {ast,  cursor } = grammar.exec(text, true);

        if (ast != null){
            this.textEditor.clearMarkers();
            return;
        }

        const nodes = cursor.allMatchedNodes.slice();
        nodes.sort((a, b) => a.endIndex - b.endIndex);
        const furthestMatch = nodes[nodes.length - 1];

        if (furthestMatch != null) {
            const { endIndex: startIndex } = furthestMatch;
            const endIndex = cursor.length;
            this.textEditor.setMarkers([{
                start: startIndex,
                end: endIndex,
                severity: MarkerSeverity.Error,
                message: "Syntax Error"
            }]);
        } else {
            this.textEditor.setMarkers([{
                start: 0,
                end: cursor.length,
                severity: MarkerSeverity.Error,
                message: "Syntax Error"
            }]);
        }
    }

    disable() {
        this.textEditor.disable();
    }

    setText(text: string, path: string) {
        this.textEditor.enable();
        this._path = path;
        this.textEditor.setText(text);
        this._processGrammar();
        this._markErrors();
    }

}