import { Pattern } from "clarity-pattern-parser";
import * as monaco from "monaco-editor-core";

export class TestSemanticTokensProvider {
    private _grammar: Pattern | null;
    private _tokensMap: Record<string, number>;

    constructor() {
        this._grammar = null;
        this._tokensMap = {};
    }

    getLegend(): monaco.languages.SemanticTokensLegend {
        return {
            tokenTypes: ["keyword", "type", "string", "comment", "number", "operator", "variable", "regexp", "method", "property"],
            tokenModifiers: [],
        };
    }

    provideDocumentSemanticTokens(model: monaco.editor.ITextModel) {
        const text = model.getValue();

        if (this._grammar == null) {
            return { data: new Uint32Array([]) };
        }

        const result = this._grammar.exec(text, true);

        const tokens: number[] = [];
        let prevLine = 0;
        let prevChar = 0;

        if (result.ast == null) {
            result.cursor.allMatchedNodes.forEach((n) => {
                if (this._tokensMap[n.name] != null) {
                    const startPos = model.getPositionAt(n.startIndex);

                    const deltaLine = startPos.lineNumber - 1 - prevLine;
                    const deltaStart = deltaLine === 0
                        ? startPos.column - 1 - prevChar
                        : startPos.column - 1;

                    tokens.push(
                        deltaLine,
                        deltaStart,
                        n.endIndex - n.startIndex,
                        this._tokensMap[n.name],
                        0
                    );

                    prevLine = startPos.lineNumber - 1;
                    prevChar = startPos.column - 1;
                }
            });
        } else {
            result.ast.walkUp(n => {
                if (this._tokensMap[n.name] != null) {
                    const startPos = model.getPositionAt(n.startIndex);

                    const deltaLine = startPos.lineNumber - 1 - prevLine;
                    const deltaStart = deltaLine === 0
                        ? startPos.column - 1 - prevChar
                        : startPos.column - 1;

                    tokens.push(
                        deltaLine,
                        deltaStart,
                        n.endIndex - n.startIndex,
                        this._tokensMap[n.name],
                        0
                    );


                    prevLine = startPos.lineNumber - 1;
                    prevChar = startPos.column - 1;
                }
            });
        }

        return { data: new Uint32Array(tokens.flat()) };

    }

    releaseDocumentSemanticTokens() {
    }

    setGrammar(grammar: Pattern | null) {
        this._grammar = grammar;
    }

    setTokensMap(tokenMap: Record<string, number>) {
        this._tokensMap = tokenMap;
    }
}