import * as monaco from "monaco-editor-core";
import { grammar } from "clarity-pattern-parser";
import { tokensMap } from "./tokens_map.ts";


// 1️⃣ Register a custom language
monaco.languages.register({ id: 'cpat' });


// 2️⃣ Register a semantic token provider
monaco.languages.registerDocumentSemanticTokensProvider('cpat', {
    getLegend: function (): monaco.languages.SemanticTokensLegend {
        return {
            tokenTypes: ["keyword", "type", "string", "comment", "number", "operator", "variable", "regexp"],
            tokenModifiers: [],
        };
    },
    provideDocumentSemanticTokens: (model: monaco.editor.ITextModel) => {
        const text = model.getValue();

        const result = grammar.exec(text, true);

        const tokens: number[] = [];
        let prevLine = 0;
        let prevChar = 0;

        if (result.ast == null) {
            result.cursor.allMatchedNodes.forEach((n) => {
                if (tokensMap[n.name] != null) {
                    const startPos = model.getPositionAt(n.startIndex);

                    const deltaLine = startPos.lineNumber - 1 - prevLine;
                    const deltaStart = deltaLine === 0
                        ? startPos.column - 1 - prevChar
                        : startPos.column - 1;

                    tokens.push(
                        deltaLine,
                        deltaStart,
                        n.endIndex - n.startIndex,
                        tokensMap[n.name],
                        0
                    );

                    prevLine = startPos.lineNumber - 1;
                    prevChar = startPos.column - 1;
                }
            });
        } else {
            result.ast.walkUp(n => {
                if (tokensMap[n.name] != null) {
                    const startPos = model.getPositionAt(n.startIndex);

                    const deltaLine = startPos.lineNumber - 1 - prevLine;
                    const deltaStart = deltaLine === 0
                        ? startPos.column - 1 - prevChar
                        : startPos.column - 1;

                    tokens.push(
                        deltaLine,
                        deltaStart,
                        n.endIndex - n.startIndex,
                        tokensMap[n.name],
                        0
                    );


                    prevLine = startPos.lineNumber - 1;
                    prevChar = startPos.column - 1;
                }
            });
        }

        return { data: new Uint32Array(tokens.flat()) };

    },
    releaseDocumentSemanticTokens: () => {
    }
});

export interface Marker {
    start: number;
    end: number;
    severity: monaco.MarkerSeverity;
    message: string;
}

export interface Decoration {
    start: number;
    end: number;
    className: string;
}


export interface EditorPresenterOptions {
    language: string;
}

export class EditorPresenter {
    private _editor: monaco.editor.IStandaloneCodeEditor | null;
    private _language: string;
    private _onSave: (text: string) => void;
    private _decorationsCollection: monaco.editor.IEditorDecorationsCollection | null;

    get editor() {
        if (this._editor == null) {
            throw new Error("Editor isn't ready yet.");
        }

        return this._editor;
    }

    constructor(language: string, onSave: (text: string) => void = () => { }) {
        this._editor = null;
        this._language = language;
        this._onSave = onSave;
        this._decorationsCollection = null;
    }

    initialize(element: HTMLElement) {

        this._editor = monaco.editor.create(element, {
            value: ``,
            language: this._language,
            theme: 'vs',
            "semanticHighlighting.enabled": true,
            minimap: {
                enabled: false, // Disable the minimap
            },
        });

        this._editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
            this._onSave
        );

        this._decorationsCollection = this.editor.createDecorationsCollection();
    }

    dispose() {
        this._editor?.dispose();
    }

    setText(value: string) {
        const oldModel = this.editor.getModel();

        if (oldModel != null) {
            const newModel = monaco.editor.createModel(value, oldModel.getLanguageId());
            this.editor.setModel(newModel);
            oldModel.dispose();
        }

    }

    getText() {
        return this.editor.getValue() || "";
    }

    getSelection() {
        return this.editor.getSelection();
    }

    updateSize() {
        this.editor.layout();
    }

    onChange(callback: (value: string, model: monaco.editor.ITextModel | null) => void) {
        this.editor.onDidChangeModelContent(() => {
            callback(this.editor.getValue(), this.editor.getModel());
        });
    }

    onSelectionChange(callback: (selection: monaco.Selection, model: monaco.editor.ITextModel | null) => void) {
        this.editor.onDidChangeCursorSelection((event) => {
            callback(event.selection, this.editor.getModel());
        });
    }

    setMarkers(markers: Marker[]) {
        const model = this.editor.getModel();

        if (model != null) {
            const monacoMarkers = markers.map((marker) => {

                const startPos = model.getPositionAt(marker.start);
                const endPos = model.getPositionAt(marker.end);

                return {
                    startLineNumber: startPos.lineNumber,
                    startColumn: startPos.column,
                    endLineNumber: endPos.lineNumber,
                    endColumn: endPos.column,
                    severity: marker.severity,
                    message: marker.message,
                };
            });

            monaco.editor.setModelMarkers(model, 'owner', monacoMarkers);
        }

    }

    clearMarkers() {
        const model = this.editor.getModel();

        if (model != null) {
            monaco.editor.setModelMarkers(model, 'owner', []);
        }
    }

    setDecorations(decorations: Decoration[]) {
        if (this._decorationsCollection == null) {
            return;
        }

        this._decorationsCollection.clear();

        const model = this.editor.getModel();

        if (model == null) {
            return;
        }

        const monacoDecorations = decorations.map((d) => {
            const startPosition = model.getPositionAt(d.start);
            const endPosition = model.getPositionAt(d.end);

            const range = new monaco.Range(
                startPosition.lineNumber,
                startPosition.column,
                endPosition.lineNumber,
                endPosition.column
            );

            return {
                range,
                options: {
                    inlineClassName: d.className
                }
            };
        });

        this._decorationsCollection.append(monacoDecorations);
    }

    clearDecorations() {
        this.editor.createDecorationsCollection([]);
    }

    enable() {
        this.editor.updateOptions({ readOnly: false });
    }

    disable() {
        this.editor.updateOptions({ readOnly: true });
    }
}