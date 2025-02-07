import { Optional, Pattern, Regex, Sequence, Node } from "clarity-pattern-parser";
import { TextEditorPresenter } from "./text_editor_presenter.ts";
import { Signal } from "@tcn/state";

export interface TestEditorPresenterOptions {
    onPatternChange?: (oldName: string | null, newName: string | null) => void;
}

export class TestEditorPresenter {
    private _options: TestEditorPresenterOptions;
    private _astJson: Signal<string>;
    private _ast: Signal<Node | null>;
    private _selectedPattern: Signal<string | null>;
    private _patterns: Signal<Record<string, Pattern>>;
    private _parseDuration: Signal<number>;
    readonly textEditor: TextEditorPresenter;

    get patternsBroadcast() {
        return this._patterns.broadcast;
    }

    get selectedPatternBroadcast() {
        return this._selectedPattern.broadcast;
    }

    get astJsonBroadcast() {
        return this._astJson.broadcast;
    }

    get astBroadcast() {
        return this._ast.broadcast;
    }

    get selectedPattern(): Pattern | null {
        const name = this.selectedPatternBroadcast.get();
        return this._patterns.get()[String(name)] || null;
    }

    get parseDurationBroadcast() {
        return this._parseDuration.broadcast;
    }

    constructor(options: TestEditorPresenterOptions = {}) {
        this._options = options;
        this._astJson = new Signal("");
        this._ast = new Signal<Node | null>(null);
        this._selectedPattern = new Signal<string | null>(null);
        this._patterns = new Signal({});
        this.textEditor = new TextEditorPresenter();
        this._parseDuration = new Signal(0);
    }

    initialize() {
        this.textEditor.onChange((_d, _od, source) => {
            if (source === "user") {
                this._process();
            }
        });
    }

    private _process() {
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
            try {
                const { ast, cursor } = editorPattern.exec(text, true);
                const parseDuration = performance.now() - startTime;

                this._parseDuration.set(parseDuration);
                if (ast != null) {
                    const rootAst = ast.children[0];
                    this._astJson.set(rootAst.toJson(2));
                    this._ast.set(rootAst);
                } else {
                    this._astJson.set("");
                    this._ast.set(null);
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
            } catch (e) {
                console.log(e);
            }
        }
    }

    setPatterns(patterns: Record<string, Pattern>) {
        this._patterns.set(patterns);
        this._process();
    }

    selectPattern(name: string | null) {
        const oldName = this._selectedPattern.get();
        this._selectedPattern.set(name);
        this._options.onPatternChange && this._options.onPatternChange(oldName, name);
        this._process();
    }

    dispose() {

    }
}