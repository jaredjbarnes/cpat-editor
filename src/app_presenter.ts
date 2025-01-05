import { DiagramPresenter } from "./diagram_presenter.ts";
import { TestEditorPresenter } from "./test_editor_presenter.ts";
import { GrammarEditorPresenter } from "./grammar_editor_presenter.ts";
import { Signal } from "@tcn/state";
import { FileExplorerPresenter } from "./file_explorer_presenter.ts";
import { FileSystem } from "./file_system.ts";

export class AppPresenter {
    private _isDocumentationOpen: Signal<boolean>;
    private _fileSystem: FileSystem;
    private _currentPath: string | null;
    readonly grammarEditor: GrammarEditorPresenter;
    readonly testEditor: TestEditorPresenter;
    readonly diagramPresenter: DiagramPresenter;
    readonly fileExplorer: FileExplorerPresenter;

    get isDocumentationOpenBroadcast() {
        return this._isDocumentationOpen.broadcast;
    }

    constructor() {
        this._fileSystem = new FileSystem();
        this._currentPath = null;
        this._isDocumentationOpen = new Signal(false);
        this.grammarEditor = new GrammarEditorPresenter({
            onGrammarProcess: (patterns) => {
                this.diagramPresenter.selectPattern(Object.values(patterns));
                this.testEditor.setPatterns(patterns);
            },
            onSave: (content) => {
                if (this._currentPath != null) {
                    this._fileSystem.writeFile(this._currentPath, content);
                }
            }
        });
        this.testEditor = new TestEditorPresenter();
        this.diagramPresenter = new DiagramPresenter();
        this.fileExplorer = new FileExplorerPresenter({
            fileSystem: this._fileSystem,
            onPathFocus: async (path, oldPath) => {
                this._currentPath = path;

                if (oldPath != null) {
                    try {
                        const content = this.grammarEditor.textEditor.getText();
                        await this._fileSystem.writeFile(oldPath, content);
                    } catch { }
                }

                try {
                    const content = await this._fileSystem.readFile(path);
                    this.grammarEditor.setText(content);
                } catch { }
            }
        });
    }

    async initialize() {
        await this.fileExplorer.initialize();
        const directory = this.fileExplorer.directoryBroadcast.get();
        if (directory.items.length === 0) {
            await this.fileExplorer.createFile("examples.cpat");
            this.fileExplorer.focus("/examples.cpat");
        } else {
            this.fileExplorer.focus(directory.items[0]?.path);
        }
    }

    toggleDocumentation() {
        this._isDocumentationOpen.transform((v) => !v);
    }

    dispose() {

    }
}