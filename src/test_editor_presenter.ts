import { Optional, Pattern, Regex, Sequence } from "clarity-pattern-parser";
import { TextEditorPresenter } from "./text_editor_presenter.ts";
import { Signal } from "@tcn/state";

export class TestEditorPresenter {
    private _ast: Signal<string>;
    private _selectedPattern: Signal<string | null>;
    private _patterns: Signal<Record<string, Pattern>>;
    readonly textEditor: TextEditorPresenter;

    get patternsBroadcast() {
        return this._patterns.broadcast;
    }

    get selectedPatternBroadcast() {
        return this._selectedPattern.broadcast;
    }

    get astBroadcast() {
        return this._ast.broadcast;
    }

    get selectedPattern(): Pattern | null {
        const name = this.selectedPatternBroadcast.get();
        return this._patterns.get()[String(name)] || null;
    }

    constructor() {
        this._ast = new Signal("");
        this._selectedPattern = new Signal<string | null>(null);
        this._patterns = new Signal({});
        this.textEditor = new TextEditorPresenter();
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
        this._selectedPattern.set(name);
        this._process();
    }

    dispose() {

    }
}