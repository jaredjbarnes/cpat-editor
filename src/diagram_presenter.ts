import { Signal } from "@tcn/state";
import { Literal, Pattern, Regex } from "clarity-pattern-parser";
import "./railroad_diagrams/railroad.css";
import { Choice, Diagram, OneOrMore, Terminal, Sequence, Optional, Group } from "./railroad_diagrams/railroad.js";


const charMap: { [key: string]: string } = {
    '\r': "\\r",
    '\n': '\\n',
    '\t': '\\t',
    ' ': ' ',
};

export class DiagramPresenter {
    private _patterns: Signal<Record<string, Pattern>>;
    private _viewingPatterns: Signal<Pattern[]>;
    private _diagrams: Signal<Diagram[]>;

    get patterns() {
        return this._patterns.broadcast;
    }

    get viewingPatternBroadcast() {
        return this._viewingPatterns.broadcast;
    }

    get diagramsBroadcast() {
        return this._diagrams.broadcast;
    }

    constructor() {
        this._patterns = new Signal({});
        this._viewingPatterns = new Signal<Pattern[]>([]);
        this._diagrams = new Signal<Diagram[]>(this._buildDiagram([]));
    }

    private _buildDiagram(patterns: Pattern[]) {
        return patterns.map((pattern: Pattern) => {
            switch (pattern.type) {
                case "literal": {
                    return new Diagram(new Group(this._buildPattern(pattern), pattern.name));
                }
                case "regex": {
                    return new Diagram(new Group(`/${(pattern as Regex).regex}/`, pattern.name));
                }
                case "not": {
                    return new Diagram(new Group(this._buildPattern(pattern), pattern.name));
                }
                case "optional": {
                    return new Diagram(new Group(this._buildPattern(pattern), pattern.name));
                }
                case "options": {
                    const children = pattern.children.map(p => this._buildPattern(p));
                    const options = new Choice(0, ...children);
                    return new Diagram(new Group(options, pattern.name));
                }
                case "reference": {
                    return new Diagram(new Group(this._buildPattern(pattern), pattern.name));
                }
                case "sequence": {
                    const children = pattern.children.map(p => this._buildPattern(p));
                    return new Diagram(new Group(new Sequence(...children), pattern.name));
                }
                case "finite-repeat": {
                    return new Diagram(new Group(this._buildPattern(pattern), pattern.name));
                }
                case "infinite-repeat": {
                    return new Diagram(new Group(this._buildPattern(pattern), pattern.name));
                }
            }

            throw new Error("Unknown pattern.");
        });

    }

    private _buildPattern(pattern: Pattern): any {
        switch (pattern.type) {
            case "literal": {
                const text = this.replaceSpecialCharacters((pattern as Literal).token);
                const terminal = new Terminal(text, { href: `#${pattern.name}` });
                return terminal;
            }
            case "regex": {
                const text = (pattern as Regex).name;
                const terminal = new Terminal(text, { href: `#${pattern.name}` });
                return terminal;
            }
            case "not": {
                const text = `${pattern.name}`;
                const terminal = new Terminal(text, { href: `#${pattern.name}` });
                return terminal;
            }
            case "optional": {
                return new Optional(this._buildPattern(pattern.children[0]));
            }
            case "options": {
                const text = `${pattern.name}`;
                const terminal = new Terminal(text, { href: `#${pattern.name}` });
                return terminal;
            }
            case "reference": {
                return new Terminal(pattern.name, { href: `#${pattern.name}` });
            }
            case "sequence": {
                const text = pattern.name;
                const terminal = new Terminal(text, { href: `#${pattern.name}` });
                return terminal;
            }
            case "finite-repeat": {
                const children = pattern.children[0].children.map(p => this._buildPattern(p));
                return new OneOrMore(...children);
            }
            case "infinite-repeat": {
                const children = pattern.children[0].children.map(p => this._buildPattern(p));
                return new OneOrMore(...children);
            }
        }
    }

    replaceSpecialCharacters(value: string) {
        return value.replace(/[\s\S]/g, (char) => {
            // Use the mapping for known characters or default to a general format
            return charMap[char] == null ? char : charMap[char];
        });
    }

    selectPattern(patterns: Pattern[]) {
        this._viewingPatterns.set(patterns);
        this._diagrams.set(this._buildDiagram(patterns));
    }

}
