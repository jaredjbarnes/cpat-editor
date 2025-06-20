import { Optional, ParseError, Pattern, Regex, Sequence } from "clarity-pattern-parser";
import { DiagramPresenter } from "../diagram_presenter.ts";
import { DebuggerStep, generateSteps } from "./step_generator.ts";
import { Signal } from "@tcn/state";
import { Decoration, EditorPresenter } from "../monaco_editor/editor_presenter.ts";

export class DebuggerPresenter {
    private _text: string;
    private _pattern: Pattern;
    private _steps: DebuggerStep[];
    private _onStep: Signal<number>;
    private _tickId: number;
    private _isPlaying: Signal<boolean>;
    private _playbackSpeed: Signal<number>;
    readonly diagramPresenter: DiagramPresenter;
    readonly textEditor: EditorPresenter;

    get isPlayingBroadcast() {
        return this._isPlaying.broadcast;
    }

    get playbackSpeedBroadcast() {
        return this._playbackSpeed.broadcast;
    }

    constructor(text: string, pattern: Pattern) {
        this._text = text;
        this._onStep = new Signal(0);
        this._steps = [];
        this._tickId = 0;
        this._isPlaying = new Signal(false);
        this._playbackSpeed = new Signal(500);
        this.diagramPresenter = new DiagramPresenter();
        this.textEditor = new EditorPresenter("test");

        this._pattern = new Sequence("editor-pattern-wrapper", [
            new Optional("optional-space", new Regex("space", "\\s+")),
            pattern,
            new Optional("optional-space", new Regex("space", "\\s+"))
        ]);
    }

    initialize() {
        this.textEditor.setText(this._text);
        this.textEditor.disable();
        this._onStep.set(0);

        this.diagramPresenter.selectPattern([this._pattern]);

        try {
            const { ast, cursor } = this._pattern.exec(this._text, true);
            this._steps = generateSteps(this._pattern, cursor.records);

            if (ast == null) {
                const nodes = cursor.allMatchedNodes.slice();
                nodes.sort((a, b) => a.endIndex - b.endIndex);
                const furthestMatch = nodes[nodes.length - 1];

                this._steps.push({
                    type: "error",
                    path: "_",
                    pattern: this._pattern,
                    record: {
                        ast: null,
                        error: new ParseError(furthestMatch?.endIndex || 0, this._text.length, this._pattern),
                        pattern: this._pattern
                    }
                });
            }

            this._update();
        } catch {

        }
    }

    play() {
        if (this._onStep.get() === this._steps.length - 1) {
            this._onStep.set(0);
        }

        this.stop();
        this._isPlaying.set(true);
        this._tickId = window.setInterval(() => {
            if (this.hasNext()) {
                this.next();
            } else {
                this.stop();
            }
        }, this._playbackSpeed.get());
    }

    stop() {
        window.clearInterval(this._tickId);
        this._isPlaying.set(false);
    }

    hasNext() {
        const onStep = this._onStep.get() + 1;
        return onStep < this._steps.length;
    }

    next() {
        const onStep = this._onStep.get() + 1;

        if (onStep < this._steps.length) {
            this._onStep.set(onStep);
            this._update();
        }
    }

    nextError() {
        for (let i = this._onStep.get() + 1; i < this._steps.length; i++) {
            if (this._steps[i].type === "error") {
                this._onStep.set(i);
                this._update();
                return;
            }
        }
    }

    previousError() {
        for (let i = this._onStep.get() - 1; i > -1; i--) {
            if (this._steps[i].type === "error") {
                this._onStep.set(i);
                this._update();
                return;
            }
        }
    }

    firstError() {
        const firstStep = this._steps.findIndex(step => step.type === "error");
        if (firstStep > -1) {
            this._onStep.set(firstStep);
            this._update();
        }
    }

    lastError() {
        let furthestErrorStep = -1;
        let furthestIndex = -1;

        for (let i = 0; i < this._steps.length; i++) {
            const step = this._steps[i];
            if (step.type === "error" && (step.record.error != null && step.record.error.firstIndex > furthestIndex)) {
                furthestErrorStep = i;
                furthestIndex = step.record.error.firstIndex;
            }
        }

        if (furthestErrorStep > -1) {
            this._onStep.set(furthestErrorStep);
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

    start() {
        this._onStep.set(0);
        this._update();
    }

    end() {
        this._onStep.set(this._steps.length - 1);
        this._update();
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
        this.diagramPresenter.focusPath(step.path);
    }

    private _updateTextStyles() {
        const step = this._steps[this._onStep.get()];
        const decorations: Decoration[] = [];

        if (step.type === "move") {
            if (step.record.ast != null) {
                const startIndex = step.record.ast.firstIndex;
                decorations.push({
                    start: startIndex,
                    end: startIndex + 1,
                    className: "highlight-move"
                });
            } else if (step.record.error != null) {
                const startIndex = step.record.error.startIndex;
                decorations.push({
                    start: startIndex,
                    end: startIndex + 1,
                    className: "highlight-move"
                });
            }
        } else if (step.type === "match") {
            if (step.record.ast != null) {
                const startIndex = step.record.ast.firstIndex;
                const endIndex = step.record.ast.endIndex;

                decorations.push({
                    start: startIndex,
                    end: endIndex,
                    className: "highlight-match"
                });

            }
        } else if (step.type === "error") {
            if (step.record.error != null) {
                const startIndex = step.record.error.startIndex;
                const endIndex = step.record.error.endIndex;
                decorations.push({
                    start: startIndex,
                    end: endIndex,
                    className: "highlight-error"
                });
            }
        }

        this.textEditor.setDecorations(decorations);
    }

    setPlaybackSpeed(value: number) {
        if (this._isPlaying.get()) {
            this.stop();
            this._playbackSpeed.set(value);
            this.play();
            return;
        }
        this._playbackSpeed.set(value);
    }
}