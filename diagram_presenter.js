var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import "./node_modules/@tcn/state/dist/irunner_broadcast.js";
import { Signal } from "./node_modules/@tcn/state/dist/signal.js";
import "./_virtual/index.js";
/* empty css                               */
import { Diagram, Group, Sequence, Choice, OneOrMore, Terminal, Optional } from "./railroad_diagrams/railroad.js";
const charMap = {
  "\r": "\\r",
  "\n": "\\n",
  "	": "\\t",
  " ": " "
};
class DiagramPresenter {
  constructor() {
    __publicField(this, "_patterns");
    __publicField(this, "_viewingPatterns");
    __publicField(this, "_diagrams");
    this._patterns = new Signal({});
    this._viewingPatterns = new Signal([]);
    this._diagrams = new Signal(this._buildDiagram([]));
  }
  get patterns() {
    return this._patterns.broadcast;
  }
  get viewingPatternBroadcast() {
    return this._viewingPatterns.broadcast;
  }
  get diagramsBroadcast() {
    return this._diagrams.broadcast;
  }
  _buildDiagram(patterns) {
    return patterns.map((pattern) => {
      switch (pattern.type) {
        case "literal": {
          return new Diagram(new Group(this._buildPattern(pattern), pattern.name));
        }
        case "regex": {
          return new Diagram(new Group(`/${pattern.regex}/`, pattern.name));
        }
        case "not": {
          return new Diagram(new Group(this._buildPattern(pattern), pattern.name));
        }
        case "optional": {
          return new Diagram(new Group(this._buildPattern(pattern), pattern.name));
        }
        case "options": {
          const children = pattern.children.map((p) => this._buildPattern(p));
          const options = new Choice(0, ...children);
          return new Diagram(new Group(options, pattern.name));
        }
        case "reference": {
          return new Diagram(new Group(this._buildPattern(pattern), pattern.name));
        }
        case "sequence": {
          const children = pattern.children.map((p) => this._buildPattern(p));
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
  _buildPattern(pattern) {
    switch (pattern.type) {
      case "literal": {
        const text = this.replaceSpecialCharacters(pattern.token);
        const terminal = new Terminal(text, { href: `#${pattern.name}` });
        return terminal;
      }
      case "regex": {
        const text = pattern.name;
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
        const children = pattern.children[0].children.map((p) => this._buildPattern(p));
        return new OneOrMore(...children);
      }
      case "infinite-repeat": {
        const children = pattern.children[0].children.map((p) => this._buildPattern(p));
        return new OneOrMore(...children);
      }
    }
  }
  replaceSpecialCharacters(value) {
    return value.replace(/[\s\S]/g, (char) => {
      return charMap[char] == null ? char : charMap[char];
    });
  }
  selectPattern(patterns) {
    this._viewingPatterns.set(patterns);
    this._diagrams.set(this._buildDiagram(patterns));
  }
}
export {
  DiagramPresenter
};
