import { Signal } from "@tcn/state";
import { Literal, Pattern, Regex } from "clarity-pattern-parser";
import "./railroad_diagrams/railroad.css";
import { Choice, Diagram, OneOrMore, Terminal, Sequence, Optional, Group } from "./railroad_diagrams/railroad.js";
import { generatePath } from "./debugger/step_generator.js";

const charMap: { [key: string]: string } = {
    '\r': "\\r",
    '\n': '\\n',
    '\t': '\\t',
    ' ': ' ',
};

export interface CustomClass {
    patternPath: string;
    className: string;
}

export class DiagramPresenter {
    private _patterns: Signal<Record<string, Pattern>>;
    private _viewingPatterns: Signal<Pattern[]>;
    private _diagrams: Signal<Diagram[]>;
    private _classNames: Map<string, string>;
    private _expandedPatternPaths: Map<string, boolean>;

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
        this._classNames = new Map();
        this._expandedPatternPaths = new Map();
    }

    private _buildDiagram(patterns: Pattern[]) {
        return patterns.map((pattern: Pattern) => {
            switch (pattern.type) {
                case "literal": {
                    const diagram = new Diagram(new Group(this._buildPattern(pattern), pattern.name));
                    diagram.attrs.id = pattern.id;

                    return diagram;
                }
                case "regex": {
                    const diagram = new Diagram(new Group(`/${(pattern as Regex).regex}/`, pattern.name));
                    diagram.attrs.id = pattern.id;

                    return diagram;
                }
                case "not": {
                    const diagram = new Diagram(new Group(this._buildPattern(pattern), pattern.name));
                    diagram.attrs.id = pattern.id;

                    return diagram;
                }
                case "optional": {
                    const diagram = new Diagram(new Group(this._buildPattern(pattern), pattern.name));
                    diagram.attrs.id = pattern.id;

                    return diagram;
                }
                case "options": {
                    const children = pattern.children.map(p => this._buildPattern(p));
                    const options = new Choice(0, ...children);
                    options.attrs.id = pattern.id;

                    const diagram = new Diagram(new Group(options, pattern.name));
                    diagram.attrs.id = pattern.id;

                    return diagram;
                }
                case "reference": {
                    const diagram = new Diagram(new Group(this._buildPattern(pattern), pattern.name));
                    diagram.attrs.id = pattern.id;

                    return diagram;
                }
                case "sequence": {
                    const children = pattern.children.map(p => this._buildPattern(p));
                    const sequence = new Sequence(...children);
                    sequence.attrs.id = pattern.id;

                    const diagram = new Diagram(new Group(sequence, pattern.name));
                    diagram.attrs.id = pattern.id;

                    return diagram;
                }
                case "finite-repeat": {
                    const children = pattern.children[0].children.map(p => this._buildPattern(p));
                    const repeat = new OneOrMore(...children);
                    repeat.attrs.id = pattern.id;

                    const diagram = new Diagram(new Group(repeat, pattern.name));
                    diagram.attrs.id = pattern.id;

                    return diagram;
                }
                case "infinite-repeat": {
                    const children = pattern.children[0].children.map(p => this._buildPattern(p));
                    const repeat = new OneOrMore(...children);
                    repeat.attrs.id = pattern.id;

                    const diagram = new Diagram(new Group(repeat, pattern.name));
                    diagram.attrs.id = pattern.id;

                    return diagram;
                }
            }

            throw new Error("Unknown pattern.");
        });

    }

    private _buildPattern(pattern: Pattern): any {
        switch (pattern.type) {
            case "literal": {
                const text = this.replaceSpecialCharacters((pattern as Literal).token);
                const path = generatePath(pattern);
                const terminalOptions: any = {};
                const classNames = this._classNames.get(path);
                if (classNames != null) {
                    terminalOptions.cls = classNames;
                }

                const terminal = new Terminal(text, terminalOptions);
                terminal.attrs.id = generatePath(pattern);
                terminal.attrs["data-type"] = "literal";

                return terminal;
            }
            case "regex": {
                const path = generatePath(pattern);

                if (this._expandedPatternPaths.get(path)) {
                    const text = (pattern as Regex).regex;
                    const terminalOptions: any = {};
                    const classNames = this._classNames.get(path);
                    if (classNames != null) {
                        terminalOptions.cls = classNames;
                    }

                    const terminal = new Terminal(text, terminalOptions);
                    terminal.attrs.id = generatePath(pattern);
                    terminal.attrs["data-type"] = "regex";

                    return terminal;
                } else {
                    const text = pattern.name;
                    const termninalOptions: any = {};
                    const classNames = this._classNames.get(path);
                    if (classNames != null) {
                        termninalOptions.cls = classNames;
                    }

                    const terminal = new Terminal(text, termninalOptions);
                    terminal.attrs.id = generatePath(pattern);
                    terminal.attrs["data-type"] = "regex";

                    return terminal;
                }
            }
            case "not": {
                const text = pattern.name;
                const path = generatePath(pattern);
                const terminalOptions: any = {};
                const classNames = this._classNames.get(path);
                if (classNames != null) {
                    terminalOptions.cls = classNames;
                }

                const terminal = new Terminal(text, terminalOptions);
                terminal.attrs.id = generatePath(pattern);
                terminal.attrs["data-type"] = "not";

                return terminal;
            }
            case "optional": {
                const optional = new Optional(this._buildPattern(pattern.children[0]));
                optional.attrs["data-type"] = "optional";
                return optional;
            }
            case "options": {
                const text = pattern.name;
                const path = generatePath(pattern);

                if (this._expandedPatternPaths.get(path)) {
                    const children = pattern.children.map(p => this._buildPattern(p));
                    const options = new Choice(0, ...children);
                    options.attrs.id = pattern.id;

                    const terminalOptions: any = {};
                    const classNames = this._classNames.get(path);
                    if (classNames != null) {
                        terminalOptions.cls = classNames;
                    }

                    const label = new Terminal(`${text}:`, terminalOptions);
                    label.attrs.id = path;
                    label.attrs["data-group"] = "true";
                    label.attrs["data-type"] = "options";

                    const group = new Sequence(label, options);
                    group.attrs.id = path;
                    group.attrs["data-group"] = "true";

                    return group;
                } else {
                    const terminalOptions: any = {};
                    const classNames = this._classNames.get(path);
                    if (classNames != null) {
                        terminalOptions.cls = classNames;
                    }

                    const terminal = new Terminal(text, terminalOptions);
                    terminal.attrs.id = path;
                    terminal.attrs["data-type"] = "options";

                    return terminal;
                }
            }
            case "reference": {
                const path = generatePath(pattern);

                if (this._expandedPatternPaths.get(path)) {
                    const refPattern = (pattern as any)._getPatternSafely();
                    this._expandedPatternPaths.set(generatePath(refPattern), true);

                    const node = this._buildPattern(refPattern);
                    node.attrs["data-reference-path"] = path;

                    return node;
                } else {
                    const terminalOptions: any = {};
                    const classNames = this._classNames.get(path);
                    if (classNames != null) {
                        terminalOptions.cls = classNames;
                    }

                    const terminal = new Terminal(pattern.name, terminalOptions);
                    terminal.attrs.id = generatePath(pattern);
                    terminal.attrs["data-type"] = "reference";

                    return terminal;
                }


            }
            case "sequence": {
                const text = pattern.name;
                const path = generatePath(pattern);

                if (this._expandedPatternPaths.get(path)) {
                    const children = pattern.children.map(p => this._buildPattern(p));
                    const sequence = new Sequence(...children);

                    const terminalOptions: any = {};
                    const classNames = this._classNames.get(path);
                    if (classNames != null) {
                        terminalOptions.cls = classNames;
                    }
                    const label = new Terminal(`${text}:`, terminalOptions);
                    label.attrs.id = path;
                    label.attrs["data-group"] = "true";
                    label.attrs["data-type"] = "sequence";

                    const group = new Sequence(label, sequence);
                    group.attrs.id = path;

                    return group;
                } else {
                    const terminalOptions: any = {};
                    const classNames = this._classNames.get(path);
                    if (classNames != null) {
                        terminalOptions.cls = classNames;
                    }

                    const terminal = new Terminal(text, terminalOptions);
                    terminal.attrs.id = path;
                    terminal.attrs['data-type'] = "sequence";

                    return terminal;
                }
            }
            case "finite-repeat": {
                const children = pattern.children[0].children.map(p => this._buildPattern(p));
                const repeat = new OneOrMore(...children);
                repeat.attrs.id = generatePath(pattern);
                repeat.attrs['data-type'] = "repeat";

                return repeat;
            }
            case "infinite-repeat": {
                const children = pattern.children[0].children.map(p => this._buildPattern(p));
                const repeat = new OneOrMore(...children);
                repeat.attrs.id = generatePath(pattern);
                repeat.attrs['data-type'] = "repeat";

                return repeat;
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

    setClass(customClass: CustomClass) {
        this._classNames.set(customClass.patternPath, customClass.className);
        this._diagrams.set(this._buildDiagram(this._viewingPatterns.get()));
    }

    setClasses(customClasses: CustomClass[]) {
        customClasses.forEach(customClass => {
            this._classNames.set(customClass.patternPath, customClass.className);
        });
        this._diagrams.set(this._buildDiagram(this._viewingPatterns.get()));
    }

    clearClasses() {
        this._classNames.clear();
        this._diagrams.set(this._buildDiagram(this._viewingPatterns.get()));
    }

    expandPatternPath(patternPath: string) {
        const parts = patternPath.split("/");
        for (let x = 1 ; x < parts.length ;x++){
            const path = parts.slice(0, x).join("/");
            this._expandedPatternPaths.set(path, true);
        }

        this._diagrams.set(this._buildDiagram(this._viewingPatterns.get()));
    }

    collapsePatternPath(patternPath: string) {
        this._expandedPatternPaths.set(patternPath, false);
        this._diagrams.set(this._buildDiagram(this._viewingPatterns.get()));
    }

    togglePatternPath(patternPath: string) {
        const currentValue = Boolean(this._expandedPatternPaths.get(patternPath));
        this._expandedPatternPaths.set(patternPath, !currentValue);

        this._diagrams.set(this._buildDiagram(this._viewingPatterns.get()));
    }

}
