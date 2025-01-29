import { DiagramPresenter } from "./diagram_presenter.ts";
import { TestEditorPresenter } from "./test_editor_presenter.ts";
import { GrammarEditorPresenter } from "./grammar_editor_presenter.ts";
import { Signal } from "@tcn/state";
import { FileExplorerPresenter } from "./file_explorer/file_explorer_presenter.ts";
import { DirectoryMeta, FileMeta, FileSystem } from "./file_explorer/file_system.ts";
import { Pattern } from "clarity-pattern-parser";
import { DebuggerPresenter } from "./debugger/debugger_presenter.ts";

export class AppPresenter {
    private _isDocumentationOpen: Signal<boolean>;
    private _fileSystem: FileSystem;
    private _currentPath: Signal<string | null>;
    private _currentPathMetaData: Signal<DirectoryMeta | FileMeta | null>;
    private _astView: Signal<'json' | 'tree'>;
    readonly grammarEditor: GrammarEditorPresenter;
    readonly testEditor: TestEditorPresenter;
    readonly diagramPresenter: DiagramPresenter;
    readonly fileExplorer: FileExplorerPresenter;
    readonly debuggerPresenter: Signal<DebuggerPresenter | null>;
    readonly pathToSelectedPatternName: Record<string, string>;
    readonly pathToTestPatternContent: Record<string, Record<string, string>>;


    get isDocumentationOpenBroadcast() {
        return this._isDocumentationOpen.broadcast;
    }

    get currentPathBroadcast() {
        return this._currentPath.broadcast;
    }

    get currentPathMetaDataBroadcast() {
        return this._currentPathMetaData.broadcast;
    }

    get astViewBroadcast() {
        return this._astView.broadcast;
    }

    constructor() {
        this.pathToSelectedPatternName = {};
        this.pathToTestPatternContent = {};
        this._fileSystem = new FileSystem();
        this._currentPath = new Signal<string | null>(null);
        this._currentPathMetaData = new Signal<DirectoryMeta | FileMeta | null>(null);
        this._isDocumentationOpen = new Signal(false);
        this._astView = new Signal<'json' | 'tree'>("json");

        this.grammarEditor = new GrammarEditorPresenter({
            onGrammarProcess: (patterns) => {
                this.testEditor.setPatterns(patterns);
            },
            onSave: () => {
                this.save();
            },
            fileSystem: this._fileSystem,
            onPattern: (pattern: Pattern | null) => {
                if (pattern != null) {
                    this.diagramPresenter.selectPattern([pattern]);
                } else {
                    this.diagramPresenter.selectPattern([]);
                }
            }
        });
        this.testEditor = new TestEditorPresenter({
            onPatternChange: (oldName, newName) => {
                const currentPath = this._currentPath.get();
                const currentContent = this.testEditor.textEditor.getText();

                if (currentPath != null && oldName != null) {
                    let map = this.pathToTestPatternContent[currentPath];
                    if (map == null) {
                        map = {};
                        this.pathToTestPatternContent[currentPath] = map;
                    }
                    map[oldName] = currentContent;
                }

                if (currentPath != null && newName != null) {
                    let map = this.pathToTestPatternContent[currentPath];
                    if (map == null) {
                        map = {};
                        this.pathToTestPatternContent[currentPath] = map;
                    }
                    this.testEditor.textEditor.setText(map[newName] || "");
                    return;
                }

                this.testEditor.textEditor.setText("");
            }
        });
        this.diagramPresenter = new DiagramPresenter();
        this.fileExplorer = new FileExplorerPresenter({
            fileSystem: this._fileSystem,
            onPathFocus: async (path, oldPath) => {
                this.cacheTestEditoryContent();

                const selectedPatternName = this.testEditor.selectedPatternBroadcast.get();
                const currentPath = this._currentPath.get();

                if (currentPath != null && selectedPatternName != null) {
                    this.pathToSelectedPatternName[currentPath] = selectedPatternName;
                }

                let newSelectedPatternName = this.pathToSelectedPatternName[path] || null;
                let metaData: FileMeta | DirectoryMeta | null = null;

                try {
                    metaData = this._fileSystem.getMetaDataForPath(path);
                } catch { }

                console.log(newSelectedPatternName);
                this._currentPath.set(path);
                this._currentPathMetaData.set(metaData);
                this.testEditor.selectPattern(newSelectedPatternName);
                this.setTestContent();

                if (oldPath != null) {
                    try {
                        const hasFile = await this._fileSystem.hasFile(oldPath);

                        if (!hasFile) {
                            throw new Error("File Not Found.");
                        }

                        const content = this.grammarEditor.textEditor.getText();
                        await this._fileSystem.writeFile(oldPath, content);
                    } catch { }
                }

                try {
                    const content = await this._fileSystem.readFile(path);
                    this.grammarEditor.setText(content, path);
                } catch {
                    this.grammarEditor.setText("", path);
                    this.grammarEditor.disable();
                }
            }
        });

        this.debuggerPresenter = new Signal<DebuggerPresenter | null>(null);
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

    private cacheTestEditoryContent() {
        const path = this._currentPath.get();
        const selectedPattern = this.testEditor.selectedPatternBroadcast.get();

        if (path != null && selectedPattern != null) {
            let map = this.pathToTestPatternContent[path];
            if (map == null) {
                map = {};
                this.pathToTestPatternContent[path] = map;
            }

            map[selectedPattern] = this.testEditor.textEditor.getText();
        }
    }

    private setTestContent() {
        const path = this._currentPath.get();
        const selectedPattern = this.testEditor.selectedPatternBroadcast.get();

        if (path != null && selectedPattern != null) {
            let map = this.pathToTestPatternContent[path];
            if (map == null) {
                map = {};
                this.pathToTestPatternContent[path] = map;
            }

            this.testEditor.textEditor.setText(map[selectedPattern]);
        }
    }

    toggleDocumentation() {
        this._isDocumentationOpen.transform((v) => !v);
    }

    showDebugger() {
        const pattern = this.testEditor.selectedPattern;

        if (pattern != null) {
            const presenter = new DebuggerPresenter(this.testEditor.textEditor.getText(), pattern);
            this.debuggerPresenter.set(presenter);
        }
    }

    closeDebugger() {
        this.debuggerPresenter.set(null);
    }

    save() {
        const currentPath = this._currentPath.get();

        if (currentPath != null) {
            this._fileSystem.writeFile(currentPath, this.grammarEditor.textEditor.getText());
        }
    }

    setAstView(view: "json" | "tree") {
        this._astView.set(view);
    }

    dispose() {

    }
}