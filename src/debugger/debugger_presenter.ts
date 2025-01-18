import { Optional, Pattern, Regex, Sequence } from "clarity-pattern-parser";
import { DiagramPresenter } from "../diagram_presenter.ts";
import { TextEditorPresenter } from "../text_editor_presenter.ts";
import { DebuggerStep, generateSteps } from "./step_generator.ts";
import { Signal } from "@tcn/state";

export class DebuggerPresenter {
    private _text: string;
    private _pattern: Pattern;
    private _steps: DebuggerStep[];
    private _onStep: Signal<number>;
    readonly diagramPresenter: DiagramPresenter;
    readonly textEditorPresenter: TextEditorPresenter;

    constructor(text: string, pattern: Pattern) {
        this._text = text;
        this._onStep = new Signal(0);
        this._steps = [];
        this.diagramPresenter = new DiagramPresenter();
        this.textEditorPresenter = new TextEditorPresenter();

        this._pattern = new Sequence("editor-pattern-wrapper", [
            new Optional("optional-space", new Regex("space", "\\s+")),
            pattern,
            new Optional("optional-space", new Regex("space", "\\s+"))
        ]);
    }

    initialize() {
        this.textEditorPresenter.setText(this._text);
        this.textEditorPresenter.disable();
        this._onStep.set(0);

        this.diagramPresenter.selectPattern([this._pattern]);

        try {
            const { cursor } = this._pattern.exec(this._text, true);
            this._steps = generateSteps(this._pattern, cursor.records);
            this._update();
            console.log(this._steps);
            (window as any).debuggerPresenter = this;
        } catch {

        }
    }

    next() {
        const onStep = this._onStep.get() + 1;

        if (onStep < this._steps.length) {
            this._onStep.set(onStep);
            this._update();
        }
    }

    previous() {
        const onStep = this._onStep.get() - 1;

        if (onStep > -1) {
            this._onStep.set(onStep);
            this._update();
        }
    }

    private _update() {
        this._updateDiagramStyles();
        this._updateTextStyles();
    }

    private _updateDiagramStyles() {
        const step = this._steps[this._onStep.get()];
        this.diagramPresenter.expandPatternPath(step.path);
        this.diagramPresenter.clearClasses();
        this.diagramPresenter.setClasses([{
            patternPath: step.path,
            className: step.type
        }]);
    }

    private _updateTextStyles() {
        const step = this._steps[this._onStep.get()];
        this.textEditorPresenter.clearFormatting();

        if (step.type === "move") {
            if (step.record.ast != null) {
                const startIndex = step.record.ast.firstIndex;
                this.textEditorPresenter.syntaxHighlight(
                    startIndex, startIndex + 1,
                    "highlight-move"
                );
            } else if (step.record.error != null) {
                const startIndex = step.record.error.startIndex;
                this.textEditorPresenter.syntaxHighlight(
                    startIndex, startIndex + 1,
                    "highlight-move"
                );
            }
        } else if (step.type === "match") {
            if (step.record.ast != null) {
                const startIndex = step.record.ast.firstIndex;
                const endIndex = step.record.ast.endIndex;
                this.textEditorPresenter.syntaxHighlight(
                    startIndex, endIndex,
                    "highlight-match"
                );
            }
        } else if (step.type === "error"){
            if (step.record.error != null) {
                const startIndex = step.record.error.startIndex;
                const endIndex = step.record.error.endIndex;
                this.textEditorPresenter.syntaxHighlight(
                    startIndex, endIndex + 1,
                    "highlight-error"
                );
            }
        }

    }
}