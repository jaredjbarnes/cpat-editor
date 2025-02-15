import { Optional, Pattern, Regex, Sequence, Node, generateErrorMessage } from "clarity-pattern-parser";
import { Signal } from "@tcn/state";
import { EditorPresenter } from "../monaco_editor/editor_presenter.ts";
import { IDisposable, MarkerSeverity } from "monaco-editor-core";
import { TestSuitePresenter } from "./test_suite_presenter.ts";

const QUICK_TEST_PREFIX = '$__quick_test__$:';

export interface TestEditorPresenterOptions {
    patternFilePath: string | null;
    onDebug: () => void;
}

export class TestEditorPresenter {
    private _options: TestEditorPresenterOptions;
    private _astJson: Signal<string>;
    private _ast: Signal<Node | null>;
    private _selectedPattern: Signal<string | null>;
    private _patterns: Signal<Record<string, Pattern>>;
    private _parseDuration: Signal<number>;
    private _removeSpaces: Signal<boolean>;
    private _testSuitePresenter: Signal<TestSuitePresenter | null>;
    private _changeListener: IDisposable;
    private _blurListener: IDisposable;
    private _errorMessage: Signal<string | null>;

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

    get testSuitePresenterBroadcast() {
        return this._testSuitePresenter.broadcast;
    }

    get errorMessageBroadcast() {
        return this._errorMessage.broadcast;
    }

    get _storageKey() {
        return `${QUICK_TEST_PREFIX}${this._options.patternFilePath}[${this.selectedPatternBroadcast.get()}]`;
    }

    constructor(options: TestEditorPresenterOptions) {
        this._options = options;
        this._astJson = new Signal("");
        this._ast = new Signal<Node | null>(null);
        this._selectedPattern = new Signal<string | null>(null);
        this._patterns = new Signal({});
        this.textEditor = new EditorPresenter("test");
        this._parseDuration = new Signal(0);
        this._removeSpaces = new Signal(false);
        this._testSuitePresenter = new Signal<TestSuitePresenter | null>(null);
        this._changeListener = { dispose: () => { } };
        this._blurListener = { dispose: () => { } };
        this._errorMessage = new Signal<string | null>(null);
    }

    initialize() {
        const key = this._storageKey;
        const content = window.localStorage.getItem(key);

        this._changeListener = this.textEditor.onChange((value: string) => {
            this._process(value);
            window.localStorage.setItem(this._storageKey, value);
        });

        this._blurListener = this.textEditor.onChange((value: string) => {
            if (this._options.patternFilePath == null || this.selectedPatternBroadcast.get() == null) {
                return;
            }

            window.localStorage.setItem(this._storageKey, value);
        });

        if (content != null) {
            this.textEditor.setText(content);
        }
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

                this._parseDuration.set(Number(parseDuration.toFixed(2)));
                if (ast != null) {
                    const rootAst = ast.children[0];

                    this._errorMessage.set(null);
                    this._cleanAst(rootAst);
                    this._astJson.set(rootAst.toJson(2));
                    this._ast.set(rootAst);
                    this.textEditor.clearMarkers();
                } else {
                    this._astJson.set("");
                    this._ast.set(null);
                    this._errorMessage.set(generateErrorMessage(editorPattern, cursor));

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

    setPatternFilePath(patternFilePath: string) {
        this._options.patternFilePath = patternFilePath;
    }

    selectPattern(name: string | null) {
        const savedQuickTestContent = window.localStorage.getItem(`${QUICK_TEST_PREFIX}${this._options.patternFilePath}[${name}]`);

        if (name != null && savedQuickTestContent != null) {
            this.textEditor.setText(savedQuickTestContent);
        }

        this._selectedPattern.set(name);
        this._process(this.textEditor.getText());

        const testSuitePresenter = this._testSuitePresenter.get();

        if (testSuitePresenter != null) {
            testSuitePresenter.setContext(this._options.patternFilePath, this.selectedPatternBroadcast.get());
        }
    }

    toggleRemoveSpaces() {
        this._removeSpaces.transform(v => !v);
        this._process(this.textEditor.getText());
    }

    showTestSuite() {
        if (this._options.patternFilePath != null) {
            this._testSuitePresenter.set(new TestSuitePresenter(this._options.patternFilePath, this.selectedPatternBroadcast.get(), (value) => {
                this._process(value);
            }));
        }
    }

    showQuickTest() {
        this._testSuitePresenter.set(null);
    }

    updateSize() {
        this.textEditor.updateSize();
        this._testSuitePresenter.get()?.updateSize();
    }

    debug() {
        this._options.onDebug();
    }

    dispose() {
        this._changeListener.dispose();
        this._blurListener.dispose();
    }
}