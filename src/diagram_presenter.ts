import { Signal } from "@tcn/state";
import { Expression, Literal, Pattern, Reference, Regex } from "clarity-pattern-parser";
import "./railroad_diagrams/railroad.css";
import { Choice, Diagram, OneOrMore, Terminal, Sequence, Optional, Group } from "./railroad_diagrams/railroad.js";
import { generatePath } from "./debugger/step_generator.js";
import { Position } from "@tcn/ui-core";

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
    private _focusNodePath: Signal<string | null>;
    private _scale: Signal<number>;
    private _translate: Signal<Position>;

    get patterns() {
        return this._patterns.broadcast;
    }

    get viewingPatternBroadcast() {
        return this._viewingPatterns.broadcast;
    }

    get diagramsBroadcast() {
        return this._diagrams.broadcast;
    }

    get focusNodePathBroadcast() {
        return this._focusNodePath.broadcast;
    }

    get scaleBroadcast() {
        return this._scale.broadcast;
    }

    get translateBroadcast() {
        return this._translate.broadcast;
    }


    constructor() {
        this._patterns = new Signal({});
        this._viewingPatterns = new Signal<Pattern[]>([]);
        this._diagrams = new Signal<Diagram[]>(this._buildDiagrams([]));
        this._classNames = new Map();
        this._expandedPatternPaths = new Map();
        this._focusNodePath = new Signal<string | null>(null);
        this._scale = new Signal(1);
        this._translate = new Signal<Position>({
            x: 0,
            y: 0
        });
    }

    private _buildDiagram(pattern: Pattern) {
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
            case "expression": {
                const expressionPattern = pattern as Expression;
                expressionPattern.build();

                const prefixPatterns = expressionPattern.prefixPatterns;
                const atomPatterns = expressionPattern.atomPatterns;
                const postfixPatterns = expressionPattern.postfixPatterns;
                const binaryPatterns = expressionPattern.binaryPatterns;

                const prefixChildren = prefixPatterns.map(p => this._buildPattern(p));
                const atomChildren = atomPatterns.map(p => this._buildPattern(p));
                const postfixChildren = postfixPatterns.map(p => this._buildPattern(p));
                const binaryChildren = binaryPatterns.map(p => this._buildPattern(p));

                const children: any = [];

                if (prefixPatterns.length > 0) {
                    const prefixOptions = new Optional(new OneOrMore(new Choice(0, ...prefixChildren)));
                    children.push(prefixOptions);
                }

                const atomOptions = new Choice(0, ...atomChildren);
                children.push(atomOptions);

                if (postfixPatterns.length > 0) {
                    const postfixOptions = new Optional(new OneOrMore(new Choice(0, ...postfixChildren)));
                    children.push(postfixOptions);
                }

                let expression: any = new Sequence(...children);

                if (binaryPatterns.length > 0) {
                    const binaryOptions = new Choice(0, ...binaryChildren);
                    expression = new OneOrMore(expression, binaryOptions);
                }

                expression.attrs.id = pattern.id;

                const diagram = new Diagram(new Group(expression, pattern.name));
                diagram.attrs.id = pattern.id;

                return diagram;
            }
            case "context": {
                return this._buildDiagram(pattern.children[pattern.children.length - 1]);
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
    }

    private _buildDiagrams(patterns: Pattern[]) {
        return patterns.map((pattern: Pattern) => {
            return this._buildDiagram(pattern);
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
            case "expression": {
                const text = pattern.name;
                const path = generatePath(pattern);

                if (this._expandedPatternPaths.get(path)) {
                    const expressionPattern = pattern as Expression;
                    expressionPattern.build();

                    const prefixPatterns = expressionPattern.prefixPatterns;
                    const atomPatterns = expressionPattern.atomPatterns;
                    const postfixPatterns = expressionPattern.postfixPatterns;
                    const binaryPatterns = expressionPattern.binaryPatterns;

                    const prefixChildren = prefixPatterns.map(p => this._buildPattern(p));
                    const atomChildren = atomPatterns.map(p => this._buildPattern(p));
                    const postfixChildren = postfixPatterns.map(p => this._buildPattern(p));
                    const binaryChildren = binaryPatterns.map(p => this._buildPattern(p));

                    const children: any = [];

                    if (prefixPatterns.length > 0) {
                        const prefixOptions = new Optional(new OneOrMore(new Choice(0, ...prefixChildren)));
                        children.push(prefixOptions);
                    }

                    const atomOptions = new Choice(0, ...atomChildren);
                    children.push(atomOptions);

                    if (postfixPatterns.length > 0) {
                        const postfixOptions = new Optional(new OneOrMore(new Choice(0, ...postfixChildren)));
                        children.push(postfixOptions);
                    }

                    let expression: any = new Sequence(...children);

                    if (binaryPatterns.length > 0) {
                        const binaryOptions = new Choice(0, ...binaryChildren);
                        expression = new OneOrMore(expression, binaryOptions);
                    }

                    expression.attrs.id = pattern.id;

                    const terminalOptions: any = {};
                    const classNames = this._classNames.get(path);
                    if (classNames != null) {
                        terminalOptions.cls = classNames;
                    }

                    const label = new Terminal(`${text}:`, terminalOptions);
                    label.attrs.id = path;
                    label.attrs["data-group"] = "true";
                    label.attrs["data-type"] = "expression";

                    const group = new Sequence(label, expression);
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
                    terminal.attrs["data-type"] = "expression";

                    return terminal;
                }
            }
            case "context": {
                return this._buildPattern(pattern.children[pattern.children.length - 1]);
            }
            case "reference": {
                const path = generatePath(pattern);

                if (this._expandedPatternPaths.get(path)) {
                    const refPattern = (pattern as Reference).getReferencePatternSafely();

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
        this._diagrams.set(this._buildDiagrams(patterns));
    }

    setClass(customClass: CustomClass) {
        this._classNames.set(customClass.patternPath, customClass.className);
        this._diagrams.set(this._buildDiagrams(this._viewingPatterns.get()));
    }

    setClasses(customClasses: CustomClass[]) {
        customClasses.forEach(customClass => {
            this._classNames.set(customClass.patternPath, customClass.className);
        });
        this._diagrams.set(this._buildDiagrams(this._viewingPatterns.get()));
    }

    clearClasses() {
        this._classNames.clear();
        this._diagrams.set(this._buildDiagrams(this._viewingPatterns.get()));
    }

    expandPatternPath(patternPath: string) {
        const parts = patternPath.split("_");
        for (let x = 0; x < parts.length; x++) {
            const path = parts.slice(0, x + 1).join("_");
            const finalPath = path.length === 0 ? "_" : path;
            this._expandedPatternPaths.set(finalPath, true);
        }

        this._diagrams.set(this._buildDiagrams(this._viewingPatterns.get()));
    }

    collapsePatternPath(patternPath: string) {
        this._expandedPatternPaths.set(patternPath, false);
        this._diagrams.set(this._buildDiagrams(this._viewingPatterns.get()));
    }

    togglePatternPath(patternPath: string) {
        const currentValue = Boolean(this._expandedPatternPaths.get(patternPath));
        this._expandedPatternPaths.set(patternPath, !currentValue);

        this._diagrams.set(this._buildDiagrams(this._viewingPatterns.get()));
    }

    focusPath(path: string) {
        this._focusNodePath.set(path);
    }

    setScale(value: number) {
        this._scale.set(value);
    }

    setTranslate(x: number, y: number) {
        this._translate.transform((v) => {
            v.x = x;
            v.y = y;
            return v;
        });
    }
}
