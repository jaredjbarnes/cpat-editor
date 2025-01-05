import Quill, { Delta, EmitterSource, Range } from "quill";
import 'quill/dist/quill.snow.css';

export class TextEditorPresenter {
    private _editor: Quill | null;
    private _defaultText: string;
    private _editorElement: HTMLDivElement | null;

    get editor() {
        if (this._editor == null) {
            throw new Error("Editor isn't made yet.");
        }

        return this._editor;
    }

    constructor(defaultText = "") {
        this._editor = null;
        this._defaultText = defaultText;
        this._editorElement = null;
    }

    initialize(element: HTMLDivElement) {
        if (this._editor != null) {
            return;
        }
        element.setAttribute('spellcheck', 'false');
        this._editorElement = element;
        this._editor = new Quill(element, {
            theme: 'snow',
            modules: {
                toolbar: false,
            },
        });

        this.editor.setText(this._defaultText);


        // Delete below
        this.editor.on("selection-change", (range, oldRange) => {
            console.log('Selection changed:', range, oldRange);
        });
    }

    setText(text: string) {
        this.editor.setText(text);
    }

    getText() {
        return this.editor.getText();
    }

    syntaxHighlight(start: number, end: number, className: string) {
        this.editor.formatText(start, end - start, "syntax-highlight", className);
    }

    clearFormatting() {
        const length = this.editor.getLength();
        this.editor.formatText(0, length, "syntax-highlight", false);
    }

    disable() {
        this.editor.enable(false);
    }

    enable() {
        this.editor.enable(true);
    }

    dispose() {
        this._editorElement && (this._editorElement.innerHTML = "");
        this._editor = null;
    }

    onChange(callback: (delta: Delta, oldDelta: Delta, source: EmitterSource) => void) {
        this.editor.on("text-change", callback);
    }

    onSelectionChange(callback: (range: Range, oldRange: Range) => void) {
        this.editor.on("selection-change", callback);
    }

}