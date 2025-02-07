import * as monaco from "monaco-editor";
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


export class EditorPresenter {
    private _editor: monaco.editor.IStandaloneCodeEditor | null;

    constructor() {
        this._editor = null;
    }

    initialize(element: HTMLElement) {

        this._editor = monaco.editor.create(element, {
            value: ``,
            language: 'cpat', // Ensure this matches the registered language
            theme: 'vs',
            "semanticHighlighting.enabled": true
        });
    }

    dispose() {
        this._editor?.dispose();
    }

    setText(value: string) {
        this._editor?.setValue(value);
    }

    getText() {
        return this._editor?.getValue();
    }

    updateSize(){
        this._editor?.layout();
    }
}