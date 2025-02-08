import { Optional, Pattern, Regex, Sequence, Node } from "clarity-pattern-parser";
import { Signal } from "@tcn/state";
import { EditorPresenter } from "./monaco_editor/editor_presenter.ts";
import { MarkerSeverity } from "monaco-editor-core";

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
    private _removeSpaces: Signal<boolean>;

    readonly textEditor: EditorPresenter;

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

    get removeSpacesBroadcast() {
        return this._removeSpaces.broadcast;
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
        this.textEditor = new EditorPresenter("test");
        this._parseDuration = new Signal(0);
        this._removeSpaces = new Signal(false);
    }

    initialize() {
        this.textEditor.onChange((value: string) => {
            this._process(value);
        });

    }

    private _process(text: string) {
        const patterns = this._patterns.get();
        const testPatternName = this._selectedPattern.get();
        const pattern = patterns[String(testPatternName)];

        if (pattern != null) {
            const editorPattern = new Sequence("editor-pattern-wrapper", [
                new Optional("optional-space", new Regex("space", "\\s+")),
                pattern,
                new Optional("optional-space", new Regex("space", "\\s+"))
            ]);

            const startTime = performance.now();
            try {
                const { ast, cursor } = editorPattern.exec(text, true);
                const parseDuration = performance.now() - startTime;

                this._parseDuration.set(parseDuration);
                if (ast != null) {
                    const rootAst = ast.children[0];

                    this._cleanAst(rootAst);
                    this._astJson.set(rootAst.toJson(2));
                    this._ast.set(rootAst);
                    this.textEditor.clearMarkers();
                } else {
                    this._astJson.set("");
                    this._ast.set(null);
                    const nodes = cursor.allMatchedNodes.slice();
                    nodes.sort((a, b) => a.endIndex - b.endIndex);

                    if (nodes.length === 0) {
                        this.textEditor.clearMarkers();
                        return;
                    }

                    const furthestMatch = nodes[nodes.length - 1];

                    this.textEditor.setMarkers([{
                        start: furthestMatch.endIndex,
                        end: cursor.length,
                        severity: MarkerSeverity.Error,
                        message: "Syntax Error"
                    }]);

                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    private _cleanAst(ast: Node) {
        if (this._removeSpaces.get()) {
            ast.walkBreadthFirst(n => {
                if (n.value.trim().length === 0) {
                    n.remove();
                }

            });
        }

        ast.walkBreadthFirst(n => {
            const firstChild = n.children[0];
            if (n.children.length === 1 && firstChild.children.length === 0) {
                n.replaceWith(firstChild);
            }
        });
    }

    setPatterns(patterns: Record<string, Pattern>) {
        this._patterns.set(patterns);
        this._process(this.textEditor.getText());
    }

    selectPattern(name: string | null) {
        const oldName = this._selectedPattern.get();
        this._selectedPattern.set(name);
        this._options.onPatternChange && this._options.onPatternChange(oldName, name);
        this._process(this.textEditor.getText());
    }

    toggleRemoveSpaces() {
        this._removeSpaces.transform(v => !v);
        this._process(this.textEditor.getText());
    }

    dispose() {

    }
}