import { Signal } from "@tcn/state";
import { Test } from "./test_suite_presenter.ts";

export class TestPresenter {
    private _test: Signal<Test>;
    private _originalName: string;
    private _onCommit: (test: Test) => void;
    private _onAbort: (test: Test) => void;

    get testBroadcast() {
        return this._test.broadcast;
    }

    get name() {
        return this._test.get().name;
    }

    constructor(test: Test, onCommit: (test: Test) => void, onAbort: (test: Test) => void) {
        this._originalName = test.name;
        this._test = new Signal(test);
        this._onCommit = onCommit;
        this._onAbort = onAbort;
    }

    updateName(value: string) {
        this._test.transform(t => {
            t.name = value;
            return t;
        });
    }

    commit() {
        this._onCommit(this._test.get());
    }

    abort() {
        const test = this._test.get();
        test.name = this._originalName;

        this._onAbort(this._test.get());
    }
}