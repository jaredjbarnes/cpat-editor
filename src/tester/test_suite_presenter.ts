import { Signal } from "@tcn/state";
import { TestPresenter } from "./test_presenter.ts";
import { EditorPresenter } from "../monaco_editor/editor_presenter.ts";
import { IDisposable } from "monaco-editor-core";

const TEST_SUITE_PREFIX = "$__test_suite__$:";

export interface Test {
    name: string;
    syntax: string;
}

export class TestSuitePresenter {
    private _tests: Signal<Test[]>;
    private _editorPresenter: EditorPresenter;
    private _pendingTestCreation: Signal<TestPresenter | null>;
    private _pendingTestRenaming: Signal<TestPresenter | null>;
    private _focusedTest: Signal<Test | null>;
    private _patternFilePath: string | null;
    private _selectedPatternName: string | null;
    private _changeListener: IDisposable;
    private _onChange: (value: string) => void;

    get editorPresenter() {
        return this._editorPresenter;
    }

    get pendingTestCreationBroadcast() {
        return this._pendingTestCreation.broadcast;
    }

    get pendingTestRenamingBroadcast() {
        return this._pendingTestRenaming.broadcast;
    }

    get testsBroadcast() {
        return this._tests.broadcast;
    }

    get focusedTestBroadcast() {
        return this._focusedTest.broadcast;
    }

    private get _storageKey() {
        return `${TEST_SUITE_PREFIX}${this._patternFilePath}[${this._selectedPatternName}]`;
    }

    constructor(patternFilePath: string | null, selectedPattern: string | null, onChange: (test: string) => void) {
        this._patternFilePath = patternFilePath;
        this._selectedPatternName = selectedPattern;
        this._tests = new Signal(this._getTests());
        this._pendingTestCreation = new Signal<TestPresenter | null>(null);
        this._pendingTestRenaming = new Signal<TestPresenter | null>(null);
        this._editorPresenter = new EditorPresenter("test");
        this._focusedTest = new Signal(this._tests[0]);
        this._changeListener = { dispose() { } };
        this._onChange = onChange;
    }

    initialize() {
        this._changeListener = this._editorPresenter.onChange((value) => {
            const test = this._focusedTest.get();
            if (test != null) {
                this.saveTest(test.name, value);
                this._onChange(value);
            }
        });
    }

    dispose() {
        this._changeListener.dispose();
    }

    private _getTests() {
        if (this._patternFilePath == null || this._selectedPatternName == null) {
            return [];
        }

        let tests: Test[] = [];
        let testsJson = window.localStorage.getItem(this._storageKey);

        if (testsJson == null) {
            testsJson = `[]`;
            tests = [];
            window.localStorage.setItem(this._storageKey, JSON.stringify([]));
        }

        try {
            tests = JSON.parse(testsJson);
        } catch { }

        if (tests.length === 0) {
            tests = [{ name: "Untitled", syntax: "" }];
        }

        return tests;
    }

    saveTest(name: string, syntax: string) {
        if (this._patternFilePath == null || this._selectedPatternName == null) {
            return;
        }

        const test = this._tests.get().find(t => t.name === name);

        if (test == null) {
            this._tests.transform(t => {
                t.push({ name, syntax });
                return t;
            });
        } else {
            test.syntax = syntax;
        }

        this._sortTests();
        this._persist();
    }

    private _sortTests() {
        this._tests.transform(t => {
            t.sort((a, b) => a.name.localeCompare(b.name));
            return t;
        });
    }

    deleteTest(name: string) {
        if (this._patternFilePath == null || this._selectedPatternName == null) {
            return;
        }

        this._tests.transform((tests) => {
            return tests.filter(t => t.name !== name);
        });

        if (this._tests.get().length === 0) {
            this._tests.set([{
                name: "Untitled",
                syntax: ""
            }]);
        }

        if (this._focusedTest.get()?.name === name) {
            this.focus(this._tests.get()[0]);
        }

        this._persist();
    }

    renameTest(oldName: string, newName: string) {
        if (this._patternFilePath == null || this._selectedPatternName == null) {
            return;
        }

        const test = this._tests.get().find(t => t.name === oldName);

        if (test != null) {
            test.name = newName;
        }

        this._sortTests();
        this._persist();
    }

    startTestCreation() {
        if (this._patternFilePath == null || this._selectedPatternName == null) {
            return;
        }

        this._pendingTestCreation.set(new TestPresenter({ name: "", syntax: "" }, (test) => {
            this.saveTest(test.name, test.syntax);
            this._pendingTestCreation.set(null);
        }, () => {
            this._pendingTestCreation.set(null);
        }));
    }


    startRenamingTest(test: Test) {
        if (this._patternFilePath == null || this._selectedPatternName == null) {
            return;
        }

        this._pendingTestRenaming.set(new TestPresenter(test, (test: Test) => {
            this.saveTest(test.name, test.syntax);
            this._pendingTestRenaming.set(null);
        }, (test: Test) => {
            this.saveTest(test.name, test.syntax);
            this._pendingTestRenaming.set(null);
        }));
    }

    updateSize() {
        this._editorPresenter.updateSize();
    }

    focus(test: Test) {
        const prevTest = this._focusedTest.get();
        if (prevTest != null && this.hasTest(prevTest)) {
            this.saveTest(prevTest.name, this._editorPresenter.getText());
        }
        this._focusedTest.set(test);
        this._editorPresenter.setText(test.syntax);
        this._onChange(test.syntax);
    }

    hasTest(test: Test) {
        return this._tests.get().find(t => t === test) != null;
    }

    setContext(patternFilePath: string | null, selectedPattern: string | null) {
        this._patternFilePath = patternFilePath;
        this._selectedPatternName = selectedPattern;

        if (this._patternFilePath != null && this._selectedPatternName != null) {
            this._tests.set(this._getTests());
        }
    }

    private _persist() {
        window.localStorage.setItem(this._storageKey, JSON.stringify(this._tests.get()));
    }
}