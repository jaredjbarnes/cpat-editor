import "./syntax_highlight_blot.ts";
import { grammar, Grammar, Pattern } from "clarity-pattern-parser";
import { TextEditorPresenter } from "./text_editor_presenter.ts";
import { Delta } from "quill";

const KEYWORD_CLASS = 'syntax-keyword';
const LITERAL_CLASS = 'syntax-literal';
const COMMENT_CLASS = 'syntax-comment';
const NAME_CLASS = 'syntax-name';
const STRUCTURE_CLASS = "syntax-structure";
const REGEX_CLASS = "syntax-regex";

const nodeColorMap = {
    // String Literals
    "literal": LITERAL_CLASS,
    "resource": LITERAL_CLASS,

    // Keywords
    "import": KEYWORD_CLASS,
    "use-params": KEYWORD_CLASS,
    "with-params": KEYWORD_CLASS,
    "from": KEYWORD_CLASS,
    "as": KEYWORD_CLASS,

    // Comments
    "comment": COMMENT_CLASS,

    // Names
    "name": NAME_CLASS,
    "alias-literal": NAME_CLASS,
    "pattern-name": NAME_CLASS,
    "import-name": NAME_CLASS,
    "import-name-alias": NAME_CLASS,
    "divider-pattern": NAME_CLASS,
    "param-name": NAME_CLASS,

    // Language Structure
    "open-bracket": STRUCTURE_CLASS,
    "close-bracket": STRUCTURE_CLASS,
    "open-paren": STRUCTURE_CLASS,
    "close-paren": STRUCTURE_CLASS,
    "quantifier-shorthand": STRUCTURE_CLASS,
    "is-optional": STRUCTURE_CLASS,

    // Regex
    "regex-literal": REGEX_CLASS
}

export class GrammarEditorPresenter {
    private _onGrammarProcess: (patterns: Record<string, Pattern>) => void;
    readonly textEditor: TextEditorPresenter;

    constructor(onGrammarProcess: (patterns: Record<string, Pattern>) => void) {
        this._onGrammarProcess = onGrammarProcess;
        this.textEditor = new TextEditorPresenter();
    }

    initialize() {
        this.textEditor.onChange((delta, _, source) => {
            if (source === "user") {
                this._processGrammar();
                this._highlight(delta);
            }
        });
    }

    private _processGrammar() {
        const text = this.textEditor.getText();
        try {
            const allPatterns = Grammar.parseString(text);
            this._onGrammarProcess(allPatterns);
        } catch (_) {
            console.log("Bad Grammar");
        }

        if (text === ""){
            this._onGrammarProcess({});
        }
    }

    private _highlight(_: Delta) {
        const textEditor = this.textEditor;
        const text = textEditor.getText();
        //const [start, end] = this._getDeltaIndex(delta);
        const { ast, cursor } = grammar.exec(text);

        if (ast != null) {
            textEditor.clearFormatting();
            ast.walkDown((node) => {
                if (nodeColorMap[node.name] != null) {
                    textEditor.syntaxHighlight(node.startIndex, node.endIndex, nodeColorMap[node.name]);
                }
            });
        } else {

            if (cursor.furthestError != null) {
                const { endIndex: startIndex } = cursor.furthestError;
                const endIndex = cursor.length;
                textEditor.syntaxHighlight(startIndex, endIndex, "syntax-error");
            } else {
                textEditor.syntaxHighlight(0, cursor.length, "syntax-error");
            }
        }
    }

}