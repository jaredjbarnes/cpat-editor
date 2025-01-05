import { Grammar, patterns } from "clarity-pattern-parser";
import { TextEditorPresenter } from "./text_editor_presenter.ts";
import { DiagramPresenter } from "./diagram_presenter.ts";
import { TestEditorPresenter } from "./test_editor_presenter.ts";
import { GrammarEditorPresenter } from "./grammar_editor_presenter.ts";
import { Signal } from "@tcn/state";
import { FileExplorerPresenter } from "./file_explorer_presenter.ts";

export class AppPresenter {
    private _isDocumentationOpen: Signal<boolean>;
    readonly grammarEditor: GrammarEditorPresenter;
    readonly testEditor: TestEditorPresenter;
    readonly diagramPresenter: DiagramPresenter;
    readonly fileExplorer: FileExplorerPresenter;

    get isDocumentationOpenBroadcast() {
        return this._isDocumentationOpen.broadcast;
    }

    constructor() {
        this._isDocumentationOpen = new Signal(false);
        this.grammarEditor = new GrammarEditorPresenter((patterns) => {
            this.diagramPresenter.selectPattern(Object.values(patterns));
            this.testEditor.setPatterns(patterns);
        });
        this.testEditor = new TestEditorPresenter();
        this.diagramPresenter = new DiagramPresenter();
        this.fileExplorer = new FileExplorerPresenter();
    }

    async initialize() {
        if (this.fileExplorer.directoryBroadcast.get().items.length === 0) {
            await this.fileExplorer.createFile("examples.cpat");
            this.fileExplorer.focus("/examples.cpat");
        }
    }

    toggleDocumentation() {
        this._isDocumentationOpen.transform((v) => !v);
    }

    dispose() {

    }
}