var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const Options = {
  DEBUG: false,
  // if true, writes some debug information into attributes
  VS: 8,
  // minimum vertical separation between things. For a 3px stroke, must be at least 4
  AR: 10,
  // radius of arcs
  DIAGRAM_CLASS: "railroad-diagram",
  // class to put on the root <svg>
  STROKE_ODD_PIXEL_LENGTH: true,
  // is the stroke width an odd (1px, 3px, etc) pixel length?
  INTERNAL_ALIGNMENT: "center",
  // how to align items when they have extra space. left/right/center
  CHAR_WIDTH: 8.5,
  // width of each monospace character. play until you find the right value for your font
  COMMENT_CHAR_WIDTH: 7,
  // comments are in smaller text by default
  ESCAPE_HTML: true
  // Should Diagram.toText() produce HTML-escaped text, or raw?
};
const defaultCSS = `
	svg {
		background-color: hsl(30,20%,95%);
	}
	path {
		stroke-width: 3;
		stroke: black;
		fill: rgba(0,0,0,0);
	}
	text {
		font: bold 14px monospace;
		text-anchor: middle;
		white-space: pre;
	}
	text.diagram-text {
		font-size: 12px;
	}
	text.diagram-arrow {
		font-size: 16px;
	}
	text.label {
		text-anchor: start;
	}
	text.comment {
		font: italic 12px monospace;
	}
	g.non-terminal text {
		/*font-style: italic;*/
	}
	rect {
		stroke-width: 3;
		stroke: black;
		fill: hsl(120,100%,90%);
	}
	rect.group-box {
		stroke: gray;
		stroke-dasharray: 10 5;
		fill: none;
	}
	path.diagram-text {
		stroke-width: 3;
		stroke: black;
		fill: white;
		cursor: help;
	}
	g.diagram-text:hover path.diagram-text {
		fill: #eee;
	}`;
class FakeSVG {
  constructor(tagName, attrs, text) {
    if (text) this.children = text;
    else this.children = [];
    this.tagName = tagName;
    this.attrs = unnull(attrs, {});
  }
  format(x, y, width) {
  }
  addTo(parent) {
    if (parent instanceof FakeSVG) {
      parent.children.push(this);
      return this;
    } else {
      var svg = this.toSVG();
      parent.appendChild(svg);
      return svg;
    }
  }
  toSVG() {
    var el = SVG(this.tagName, this.attrs);
    if (typeof this.children == "string") {
      el.textContent = this.children;
    } else {
      this.children.forEach(function(e) {
        el.appendChild(e.toSVG());
      });
    }
    return el;
  }
  toString() {
    var str = "<" + this.tagName;
    var group = this.tagName == "g" || this.tagName == "svg";
    for (var attr in this.attrs) {
      str += " " + attr + '="' + (this.attrs[attr] + "").replace(/&/g, "&amp;").replace(/"/g, "&quot;") + '"';
    }
    str += ">";
    if (group) str += "\n";
    if (typeof this.children == "string") {
      str += escapeString(this.children);
    } else {
      this.children.forEach(function(e) {
        str += e;
      });
    }
    str += "</" + this.tagName + ">\n";
    return str;
  }
  toTextDiagram() {
    return new TextDiagram(0, 0, []);
  }
  toText() {
    var outputTD = this.toTextDiagram();
    var output = outputTD.lines.join("\n") + "\n";
    {
      output = output.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;");
    }
    return output;
  }
  walk(cb) {
    cb(this);
  }
}
class Path extends FakeSVG {
  constructor(x, y) {
    super("path");
    this.attrs.d = "M" + x + " " + y;
  }
  m(x, y) {
    this.attrs.d += "m" + x + " " + y;
    return this;
  }
  h(val) {
    this.attrs.d += "h" + val;
    return this;
  }
  right(val) {
    return this.h(Math.max(0, val));
  }
  left(val) {
    return this.h(-Math.max(0, val));
  }
  v(val) {
    this.attrs.d += "v" + val;
    return this;
  }
  down(val) {
    return this.v(Math.max(0, val));
  }
  up(val) {
    return this.v(-Math.max(0, val));
  }
  arc(sweep) {
    var x = Options.AR;
    var y = Options.AR;
    if (sweep[0] == "e" || sweep[1] == "w") {
      x *= -1;
    }
    if (sweep[0] == "s" || sweep[1] == "n") {
      y *= -1;
    }
    var cw;
    if (sweep == "ne" || sweep == "es" || sweep == "sw" || sweep == "wn") {
      cw = 1;
    } else {
      cw = 0;
    }
    this.attrs.d += "a" + Options.AR + " " + Options.AR + " 0 0 " + cw + " " + x + " " + y;
    return this;
  }
  arc_8(start, dir) {
    const arc = Options.AR;
    const s2 = 1 / Math.sqrt(2) * arc;
    const s2inv = arc - s2;
    let path = "a " + arc + " " + arc + " 0 0 " + (dir == "cw" ? "1" : "0") + " ";
    const sd = start + dir;
    const offset = sd == "ncw" ? [s2, s2inv] : sd == "necw" ? [s2inv, s2] : sd == "ecw" ? [-s2inv, s2] : sd == "secw" ? [-s2, s2inv] : sd == "scw" ? [-s2, -s2inv] : sd == "swcw" ? [-s2inv, -s2] : sd == "wcw" ? [s2inv, -s2] : sd == "nwcw" ? [s2, -s2inv] : sd == "nccw" ? [-s2, s2inv] : sd == "nwccw" ? [-s2inv, s2] : sd == "wccw" ? [s2inv, s2] : sd == "swccw" ? [s2, s2inv] : sd == "sccw" ? [s2, -s2inv] : sd == "seccw" ? [s2inv, -s2] : sd == "eccw" ? [-s2inv, -s2] : sd == "neccw" ? [-s2, -s2inv] : null;
    path += offset.join(" ");
    this.attrs.d += path;
    return this;
  }
  l(x, y) {
    this.attrs.d += "l" + x + " " + y;
    return this;
  }
  format() {
    this.attrs.d += "h.5";
    return this;
  }
  toTextDiagram() {
    return new TextDiagram(0, 0, []);
  }
}
class DiagramMultiContainer extends FakeSVG {
  constructor(tagName, items, attrs, text) {
    super(tagName, attrs, text);
    this.items = items.map(wrapString);
  }
  walk(cb) {
    cb(this);
    this.items.forEach((x) => x.walk(cb));
  }
}
class Diagram extends DiagramMultiContainer {
  constructor(...items) {
    super("svg", items, { class: Options.DIAGRAM_CLASS });
    if (!(this.items[0] instanceof Start)) {
      this.items.unshift(new Start());
    }
    if (!(this.items[this.items.length - 1] instanceof End)) {
      this.items.push(new End());
    }
    this.up = this.down = this.height = this.width = 0;
    for (const item of this.items) {
      this.width += item.width + (item.needsSpace ? 20 : 0);
      this.up = Math.max(this.up, item.up - this.height);
      this.height += item.height;
      this.down = Math.max(this.down - item.height, item.down);
    }
    this.formatted = false;
  }
  format(paddingt, paddingr, paddingb, paddingl) {
    paddingt = unnull(paddingt, 20);
    paddingr = unnull(paddingr, paddingt, 20);
    paddingb = unnull(paddingb, paddingt, 20);
    paddingl = unnull(paddingl, paddingr, 20);
    var x = paddingl;
    var y = paddingt;
    y += this.up;
    var g = new FakeSVG("g", { transform: "translate(.5 .5)" });
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item.needsSpace) {
        new Path(x, y).h(10).addTo(g);
        x += 10;
      }
      item.format(x, y, item.width).addTo(g);
      x += item.width;
      y += item.height;
      if (item.needsSpace) {
        new Path(x, y).h(10).addTo(g);
        x += 10;
      }
    }
    this.attrs.width = this.width + paddingl + paddingr;
    this.attrs.height = this.up + this.height + this.down + paddingt + paddingb;
    this.attrs.viewBox = "0 0 " + this.attrs.width + " " + this.attrs.height;
    g.addTo(this);
    this.formatted = true;
    return this;
  }
  addTo(parent) {
    if (!parent) {
      var scriptTag = document.getElementsByTagName("script");
      scriptTag = scriptTag[scriptTag.length - 1];
      parent = scriptTag.parentNode;
    }
    return super.addTo.call(this, parent);
  }
  toSVG() {
    if (!this.formatted) {
      this.format();
    }
    return super.toSVG.call(this);
  }
  toString() {
    if (!this.formatted) {
      this.format();
    }
    return super.toString.call(this);
  }
  toStandalone(style) {
    if (!this.formatted) {
      this.format();
    }
    const s = new FakeSVG("style", {}, style || defaultCSS);
    this.children.push(s);
    this.attrs.xmlns = "http://www.w3.org/2000/svg";
    this.attrs["xmlns:xlink"] = "http://www.w3.org/1999/xlink";
    const result = super.toString.call(this);
    this.children.pop();
    delete this.attrs.xmlns;
    return result;
  }
  toTextDiagram() {
    var [separator] = TextDiagram._getParts(["separator"]);
    var diagramTD = this.items[0].toTextDiagram();
    for (const item of this.items.slice(1)) {
      var itemTD = item.toTextDiagram();
      if (item.needsSpace) {
        itemTD = itemTD.expand(1, 1, 0, 0);
      }
      diagramTD = diagramTD.appendRight(itemTD, separator);
    }
    return diagramTD;
  }
}
class Sequence extends DiagramMultiContainer {
  constructor(...items) {
    super("g", items);
    this.items.length;
    this.needsSpace = true;
    this.up = this.down = this.height = this.width = 0;
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      this.width += item.width + (item.needsSpace ? 20 : 0);
      this.up = Math.max(this.up, item.up - this.height);
      this.height += item.height;
      this.down = Math.max(this.down - item.height, item.down);
    }
    if (this.items[0].needsSpace) this.width -= 10;
    if (this.items[this.items.length - 1].needsSpace) this.width -= 10;
  }
  format(x, y, width) {
    var gaps = determineGaps(width, this.width);
    new Path(x, y).h(gaps[0]).addTo(this);
    new Path(x + gaps[0] + this.width, y + this.height).h(gaps[1]).addTo(this);
    x += gaps[0];
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item.needsSpace && i > 0) {
        new Path(x, y).h(10).addTo(this);
        x += 10;
      }
      item.format(x, y, item.width).addTo(this);
      x += item.width;
      y += item.height;
      if (item.needsSpace && i < this.items.length - 1) {
        new Path(x, y).h(10).addTo(this);
        x += 10;
      }
    }
    return this;
  }
  toTextDiagram() {
    var [separator] = TextDiagram._getParts(["separator"]);
    var diagramTD = new TextDiagram(0, 0, [""]);
    for (const item of this.items) {
      var itemTD = item.toTextDiagram();
      if (item.needsSpace) {
        itemTD = itemTD.expand(1, 1, 0, 0);
      }
      diagramTD = diagramTD.appendRight(itemTD, separator);
    }
    return diagramTD;
  }
}
class Choice extends DiagramMultiContainer {
  constructor(normal, ...items) {
    super("g", items);
    if (typeof normal !== "number" || normal !== Math.floor(normal)) {
      throw new TypeError("The first argument of Choice() must be an integer.");
    } else if (normal < 0 || normal >= items.length) {
      throw new RangeError("The first argument of Choice() must be an index for one of the items.");
    } else {
      this.normal = normal;
    }
    this.width = max(this.items, (el) => el.width) + Options.AR * 4;
    var firstItem = this.items[0];
    var lastItem = this.items[items.length - 1];
    var normalItem = this.items[normal];
    this.separators = Array.from({ length: items.length - 1 }, (x) => 0);
    this.up = 0;
    var arcs;
    for (var i = normal - 1; i >= 0; i--) {
      if (i == normal - 1) arcs = Options.AR * 2;
      else arcs = Options.AR;
      let item = this.items[i];
      let lowerItem = this.items[i + 1];
      let entryDelta = lowerItem.up + Options.VS + item.down + item.height;
      let exitDelta = lowerItem.height + lowerItem.up + Options.VS + item.down;
      let separator = Options.VS;
      if (exitDelta < arcs || entryDelta < arcs) {
        separator += Math.max(arcs - entryDelta, arcs - exitDelta);
      }
      this.separators[i] = separator;
      this.up += lowerItem.up + separator + item.down + item.height;
    }
    this.up += firstItem.up;
    this.height = normalItem.height;
    this.down = 0;
    for (var i = normal + 1; i < this.items.length; i++) {
      if (i == normal + 1) arcs = Options.AR * 2;
      else arcs = Options.AR;
      let item = this.items[i];
      let upperItem = this.items[i - 1];
      let entryDelta = upperItem.height + upperItem.down + Options.VS + item.up;
      let exitDelta = upperItem.down + Options.VS + item.up + item.height;
      let separator = Options.VS;
      if (entryDelta < arcs || exitDelta < arcs) {
        separator += Math.max(arcs - entryDelta, arcs - exitDelta);
      }
      this.separators[i - 1] = separator;
      this.down += upperItem.down + separator + item.up + item.height;
    }
    this.down += lastItem.down;
  }
  format(x, y, width) {
    var gaps = determineGaps(width, this.width);
    new Path(x, y).h(gaps[0]).addTo(this);
    new Path(x + gaps[0] + this.width, y + this.height).h(gaps[1]).addTo(this);
    x += gaps[0];
    var last = this.items.length - 1;
    var innerWidth = this.width - Options.AR * 4;
    var distanceFromY = 0;
    for (var i = this.normal - 1; i >= 0; i--) {
      let item = this.items[i];
      let lowerItem = this.items[i + 1];
      distanceFromY += lowerItem.up + this.separators[i] + item.down + item.height;
      new Path(x, y).arc("se").up(distanceFromY - Options.AR * 2).arc("wn").addTo(this);
      item.format(x + Options.AR * 2, y - distanceFromY, innerWidth).addTo(this);
      new Path(x + Options.AR * 2 + innerWidth, y - distanceFromY + item.height).arc("ne").down(distanceFromY - item.height + this.height - Options.AR * 2).arc("ws").addTo(this);
    }
    new Path(x, y).right(Options.AR * 2).addTo(this);
    this.items[this.normal].format(x + Options.AR * 2, y, innerWidth).addTo(this);
    new Path(x + Options.AR * 2 + innerWidth, y + this.height).right(Options.AR * 2).addTo(this);
    var distanceFromY = 0;
    for (var i = this.normal + 1; i <= last; i++) {
      let item = this.items[i];
      let upperItem = this.items[i - 1];
      distanceFromY += upperItem.height + upperItem.down + this.separators[i - 1] + item.up;
      new Path(x, y).arc("ne").down(distanceFromY - Options.AR * 2).arc("ws").addTo(this);
      if (!item.format) console.log(item);
      item.format(x + Options.AR * 2, y + distanceFromY, innerWidth).addTo(this);
      new Path(x + Options.AR * 2 + innerWidth, y + distanceFromY + item.height).arc("se").up(distanceFromY - Options.AR * 2 + item.height - this.height).arc("wn").addTo(this);
    }
    return this;
  }
  toTextDiagram() {
    var [cross, line, line_vertical, roundcorner_bot_left, roundcorner_bot_right, roundcorner_top_left, roundcorner_top_right] = TextDiagram._getParts(["cross", "line", "line_vertical", "roundcorner_bot_left", "roundcorner_bot_right", "roundcorner_top_left", "roundcorner_top_right"]);
    var itemTDs = [];
    for (const item of this.items) {
      itemTDs.push(item.toTextDiagram().expand(1, 1, 0, 0));
    }
    var max_item_width = Math.max(...itemTDs.map(function(itemTD2) {
      return itemTD2.width;
    }));
    var diagramTD = new TextDiagram(0, 0, []);
    for (var [itemNum, itemTD] of enumerate(itemTDs)) {
      var [leftPad, rightPad] = TextDiagram._gaps(max_item_width, itemTD.width);
      itemTD = itemTD.expand(leftPad, rightPad, 0, 0);
      var hasSeparator = true;
      var leftLines = [];
      var rightLines = [];
      for (var i = 0; i < itemTD.height; i++) {
        leftLines.push(line_vertical);
        rightLines.push(line_vertical);
      }
      var moveEntry = false;
      var moveExit = false;
      if (itemNum <= this.normal) {
        leftLines[itemTD.entry] = roundcorner_top_left;
        rightLines[itemTD.exit] = roundcorner_top_right;
        if (itemNum == 0) {
          hasSeparator = false;
          for (i = 0; i < itemTD.entry; i++) {
            leftLines[i] = " ";
          }
          for (i = 0; i < itemTD.exit; i++) {
            rightLines[i] = " ";
          }
        }
      }
      if (itemNum >= this.normal) {
        leftLines[itemTD.entry] = roundcorner_bot_left;
        rightLines[itemTD.exit] = roundcorner_bot_right;
        if (itemNum == 0) {
          hasSeparator = false;
        }
        if (itemNum == this.items.length - 1) {
          for (i = itemTD.entry + 1; i < itemTD.height; i++) {
            leftLines[i] = " ";
          }
          for (i = itemTD.exit + 1; i < itemTD.height; i++) {
            rightLines[i] = " ";
          }
        }
      }
      if (itemNum == this.normal) {
        leftLines[itemTD.entry] = cross;
        rightLines[itemTD.exit] = cross;
        moveEntry = true;
        moveExit = true;
        if (itemNum == 0 && itemNum == this.items.length - 1) {
          leftLines[itemTD.entry] = line;
          rightLines[itemTD.exit] = line;
        } else if (itemNum == 0) {
          leftLines[itemTD.entry] = roundcorner_top_right;
          rightLines[itemTD.exit] = roundcorner_top_left;
        } else if (itemNum == this.items.length - 1) {
          leftLines[itemTD.entry] = roundcorner_bot_right;
          rightLines[itemTD.exit] = roundcorner_bot_left;
        }
      }
      var leftJointTD = new TextDiagram(itemTD.entry, itemTD.entry, leftLines);
      var rightJointTD = new TextDiagram(itemTD.exit, itemTD.exit, rightLines);
      itemTD = leftJointTD.appendRight(itemTD, "").appendRight(rightJointTD, "");
      var separator = hasSeparator ? [line_vertical + " ".repeat(TextDiagram._maxWidth(diagramTD, itemTD) - 2) + line_vertical] : [];
      diagramTD = diagramTD.appendBelow(itemTD, separator, moveEntry, moveExit);
    }
    return diagramTD;
  }
}
class Optional extends FakeSVG {
  constructor(item, skip) {
    if (skip === void 0)
      return new Choice(1, new Skip(), item);
    else if (skip === "skip")
      return new Choice(0, new Skip(), item);
    else
      throw "Unknown value for Optional()'s 'skip' argument.";
  }
}
class OneOrMore extends FakeSVG {
  constructor(item, rep) {
    super("g");
    rep = rep || new Skip();
    this.item = wrapString(item);
    this.rep = wrapString(rep);
    this.width = Math.max(this.item.width, this.rep.width) + Options.AR * 2;
    this.height = this.item.height;
    this.up = this.item.up;
    this.down = Math.max(Options.AR * 2, this.item.down + Options.VS + this.rep.up + this.rep.height + this.rep.down);
    this.needsSpace = true;
  }
  format(x, y, width) {
    var gaps = determineGaps(width, this.width);
    new Path(x, y).h(gaps[0]).addTo(this);
    new Path(x + gaps[0] + this.width, y + this.height).h(gaps[1]).addTo(this);
    x += gaps[0];
    new Path(x, y).right(Options.AR).addTo(this);
    this.item.format(x + Options.AR, y, this.width - Options.AR * 2).addTo(this);
    new Path(x + this.width - Options.AR, y + this.height).right(Options.AR).addTo(this);
    var distanceFromY = Math.max(Options.AR * 2, this.item.height + this.item.down + Options.VS + this.rep.up);
    new Path(x + Options.AR, y).arc("nw").down(distanceFromY - Options.AR * 2).arc("ws").addTo(this);
    this.rep.format(x + Options.AR, y + distanceFromY, this.width - Options.AR * 2).addTo(this);
    new Path(x + this.width - Options.AR, y + distanceFromY + this.rep.height).arc("se").up(distanceFromY - Options.AR * 2 + this.rep.height - this.item.height).arc("en").addTo(this);
    return this;
  }
  toTextDiagram() {
    var [line, repeat_top_left, repeat_left, repeat_bot_left, repeat_top_right, repeat_right, repeat_bot_right] = TextDiagram._getParts(["line", "repeat_top_left", "repeat_left", "repeat_bot_left", "repeat_top_right", "repeat_right", "repeat_bot_right"]);
    var itemTD = this.item.toTextDiagram();
    var repeatTD = this.rep.toTextDiagram();
    var fIRWidth = TextDiagram._maxWidth(itemTD, repeatTD);
    repeatTD = repeatTD.expand(0, fIRWidth - repeatTD.width, 0, 0);
    itemTD = itemTD.expand(0, fIRWidth - itemTD.width, 0, 0);
    var itemAndRepeatTD = itemTD.appendBelow(repeatTD, []);
    var leftLines = [];
    leftLines.push(repeat_top_left + line);
    for (var i = 0; i < itemTD.height - itemTD.entry + repeatTD.entry - 1; i++) {
      leftLines.push(repeat_left + " ");
    }
    leftLines.push(repeat_bot_left + line);
    var leftTD = new TextDiagram(0, 0, leftLines);
    leftTD = leftTD.appendRight(itemAndRepeatTD, "");
    var rightLines = [];
    rightLines.push(line + repeat_top_right);
    for (i = 0; i < itemTD.height - itemTD.exit + repeatTD.exit - 1; i++) {
      rightLines.push(" " + repeat_right);
    }
    rightLines.push(line + repeat_bot_right);
    var rightTD = new TextDiagram(0, 0, rightLines);
    var diagramTD = leftTD.appendRight(rightTD, "");
    return diagramTD;
  }
  walk(cb) {
    cb(this);
    this.item.walk(cb);
    this.rep.walk(cb);
  }
}
class Group extends FakeSVG {
  constructor(item, label) {
    super("g");
    this.item = wrapString(item);
    this.label = label instanceof FakeSVG ? label : label ? new Comment(label) : void 0;
    this.width = Math.max(
      this.item.width + (this.item.needsSpace ? 20 : 0),
      this.label ? this.label.width : 0,
      Options.AR * 2
    );
    this.height = this.item.height;
    this.boxUp = this.up = Math.max(this.item.up + Options.VS, Options.AR);
    if (this.label) {
      this.up += this.label.up + this.label.height + this.label.down;
    }
    this.down = Math.max(this.item.down + Options.VS, Options.AR);
    this.needsSpace = true;
  }
  format(x, y, width) {
    var gaps = determineGaps(width, this.width);
    new Path(x, y).h(gaps[0]).addTo(this);
    new Path(x + gaps[0] + this.width, y + this.height).h(gaps[1]).addTo(this);
    x += gaps[0];
    new FakeSVG("rect", {
      x,
      y: y - this.boxUp,
      width: this.width,
      height: this.boxUp + this.height + this.down,
      rx: Options.AR,
      ry: Options.AR,
      "class": "group-box"
    }).addTo(this);
    this.item.format(x, y, this.width).addTo(this);
    if (this.label) {
      this.label.format(
        x,
        y - (this.boxUp + this.label.down + this.label.height),
        this.label.width
      ).addTo(this);
    }
    return this;
  }
  toTextDiagram() {
    var diagramTD = TextDiagram.roundrect(this.item.toTextDiagram(), true);
    if (this.label != void 0) {
      var labelTD = this.label.toTextDiagram();
      diagramTD = labelTD.appendBelow(diagramTD, [], true, true).expand(0, 0, 1, 0);
    }
    return diagramTD;
  }
  walk(cb) {
    cb(this);
    this.item.walk(cb);
    this.label.walk(cb);
  }
}
class Start extends FakeSVG {
  constructor({ type = "simple", label } = {}) {
    super("g");
    this.width = 20;
    this.height = 0;
    this.up = 10;
    this.down = 10;
    this.type = type;
    if (label) {
      this.label = "" + label;
      this.width = Math.max(20, this.label.length * Options.CHAR_WIDTH + 10);
    }
  }
  format(x, y) {
    let path = new Path(x, y - 10);
    if (this.type === "complex") {
      path.down(20).m(0, -10).right(this.width).addTo(this);
    } else {
      path.down(20).m(10, -20).down(20).m(-10, -10).right(this.width).addTo(this);
    }
    if (this.label) {
      new FakeSVG("text", { x, y: y - 15, style: "text-anchor:start" }, this.label).addTo(this);
    }
    return this;
  }
  toTextDiagram() {
    var [cross, line, tee_right] = TextDiagram._getParts(["cross", "line", "tee_right"]);
    if (this.type === "simple") {
      var start = tee_right + cross + line;
    } else {
      start = tee_right + line;
    }
    var labelTD = new TextDiagram(0, 0, []);
    if (this.label != void 0) {
      labelTD = new TextDiagram(0, 0, [this.label]);
      start = TextDiagram._padR(start, labelTD.width, line);
    }
    var startTD = new TextDiagram(0, 0, [start]);
    return labelTD.appendBelow(startTD, [], true, true);
  }
}
class End extends FakeSVG {
  constructor({ type = "simple" } = {}) {
    super("path");
    this.width = 20;
    this.height = 0;
    this.up = 10;
    this.down = 10;
    this.type = type;
  }
  format(x, y) {
    if (this.type === "complex") {
      this.attrs.d = "M " + x + " " + y + " h 20 m 0 -10 v 20";
    } else {
      this.attrs.d = "M " + x + " " + y + " h 20 m -10 -10 v 20 m 10 -20 v 20";
    }
    return this;
  }
  toTextDiagram() {
    var [cross, line, tee_left] = TextDiagram._getParts(["cross", "line", "tee_left"]);
    if (this.type === "simple") {
      var end = line + cross + tee_left;
    } else {
      end = line + tee_left;
    }
    return new TextDiagram(0, 0, [end]);
  }
}
class Terminal extends FakeSVG {
  constructor(text, { href, title, cls } = {}) {
    super("g", { "class": ["terminal", cls].join(" ") });
    this.text = "" + text;
    this.href = href;
    this.title = title;
    this.cls = cls;
    this.width = this.text.length * Options.CHAR_WIDTH + 20;
    this.height = 0;
    this.up = 11;
    this.down = 11;
    this.needsSpace = true;
  }
  format(x, y, width) {
    var gaps = determineGaps(width, this.width);
    new Path(x, y).h(gaps[0]).addTo(this);
    new Path(x + gaps[0] + this.width, y).h(gaps[1]).addTo(this);
    x += gaps[0];
    new FakeSVG("rect", { x, y: y - 11, width: this.width, height: this.up + this.down, rx: 10, ry: 10 }).addTo(this);
    var text = new FakeSVG("text", { x: x + this.width / 2, y: y + 4 }, this.text);
    if (this.href)
      new FakeSVG("a", { "xlink:href": this.href }, [text]).addTo(this);
    else
      text.addTo(this);
    if (this.title)
      new FakeSVG("title", {}, [this.title]).addTo(this);
    return this;
  }
  toTextDiagram() {
    return TextDiagram.roundrect(this.text);
  }
}
class Comment extends FakeSVG {
  constructor(text, { href, title, cls = "" } = {}) {
    super("g", { "class": ["comment", cls].join(" ") });
    this.text = "" + text;
    this.href = href;
    this.title = title;
    this.cls = cls;
    this.width = this.text.length * Options.COMMENT_CHAR_WIDTH + 10;
    this.height = 0;
    this.up = 8;
    this.down = 8;
    this.needsSpace = true;
  }
  format(x, y, width) {
    var gaps = determineGaps(width, this.width);
    new Path(x, y).h(gaps[0]).addTo(this);
    new Path(x + gaps[0] + this.width, y + this.height).h(gaps[1]).addTo(this);
    x += gaps[0];
    var text = new FakeSVG("text", { x: x + this.width / 2, y: y + 5, class: "comment" }, this.text);
    if (this.href)
      new FakeSVG("a", { "xlink:href": this.href }, [text]).addTo(this);
    else
      text.addTo(this);
    if (this.title)
      new FakeSVG("title", {}, this.title).addTo(this);
    return this;
  }
  toTextDiagram() {
    return new TextDiagram(0, 0, [this.text]);
  }
}
class Skip extends FakeSVG {
  constructor() {
    super("g");
    this.width = 0;
    this.height = 0;
    this.up = 0;
    this.down = 0;
    this.needsSpace = false;
  }
  format(x, y, width) {
    new Path(x, y).right(width).addTo(this);
    return this;
  }
  toTextDiagram() {
    var [line] = TextDiagram._getParts(["line"]);
    return new TextDiagram(0, 0, [line]);
  }
}
const _TextDiagram = class _TextDiagram {
  constructor(entry, exit, lines) {
    this.entry = entry;
    this.exit = exit;
    this.height = lines.length;
    this.lines = Array.from(lines);
    this.width = lines.length > 0 ? lines[0].length : 0;
    if (entry > lines.length) {
      throw new Error("Entry is not within diagram vertically:\n" + this._dump(false));
    }
    if (exit > lines.length) {
      throw new Error("Exit is not within diagram vertically:\n" + this._dump(false));
    }
    for (var i = 0; i < lines.length; i++) {
      if (lines[0].length != lines[i].length) {
        throw new Error("Diagram data is not rectangular:\n" + this._dump(false));
      }
    }
  }
  alter(entry = null, exit = null, lines = null) {
    var newEntry = entry || this.entry;
    var newExit = exit || this.exit;
    var newLines = lines || this.lines;
    return new _TextDiagram(newEntry, newExit, Array.from(newLines));
  }
  appendBelow(item, linesBetween, moveEntry = false, moveExit = false) {
    var newWidth = Math.max(this.width, item.width);
    var newLines = [];
    var centeredLines = this.center(newWidth, " ").lines;
    for (const line of centeredLines) {
      newLines.push(line);
    }
    for (const line of linesBetween) {
      newLines.push(_TextDiagram._padR(line, newWidth, " "));
    }
    centeredLines = item.center(newWidth, " ").lines;
    for (const line of centeredLines) {
      newLines.push(line);
    }
    var newEntry = moveEntry ? this.height + linesBetween.length + item.entry : this.entry;
    var newExit = moveExit ? this.height + linesBetween.length + item.exit : this.exit;
    return new _TextDiagram(newEntry, newExit, newLines);
  }
  appendRight(item, charsBetween) {
    var joinLine = Math.max(this.exit, item.entry);
    var newHeight = Math.max(this.height - this.exit, item.height - item.entry) + joinLine;
    var leftTopAdd = joinLine - this.exit;
    var leftBotAdd = newHeight - this.height - leftTopAdd;
    var rightTopAdd = joinLine - item.entry;
    var rightBotAdd = newHeight - item.height - rightTopAdd;
    var left = this.expand(0, 0, leftTopAdd, leftBotAdd);
    var right = item.expand(0, 0, rightTopAdd, rightBotAdd);
    var newLines = [];
    for (var i = 0; i < newHeight; i++) {
      var sep = i != joinLine ? " ".repeat(charsBetween.length) : charsBetween;
      newLines.push(left.lines[i] + sep + right.lines[i]);
    }
    var newEntry = this.entry + leftTopAdd;
    var newExit = item.exit + rightTopAdd;
    return new _TextDiagram(newEntry, newExit, newLines);
  }
  center(width, pad) {
    if (width < this.width) {
      throw new Error("Cannot center into smaller width");
    }
    if (width === this.width) {
      return this.copy();
    } else {
      var totalPadding = width - this.width;
      var leftWidth = Math.trunc(totalPadding / 2);
      var left = [];
      for (var i = 0; i < this.height; i++) {
        left.push(pad.repeat(leftWidth));
      }
      var right = [];
      for (i = 0; i < this.height; i++) {
        right.push(pad.repeat(totalPadding - leftWidth));
      }
      return new _TextDiagram(this.entry, this.exit, _TextDiagram._encloseLines(this.lines, left, right));
    }
  }
  copy() {
    return new _TextDiagram(this.entry, this.exit, Array.from(this.lines));
  }
  expand(left, right, top, bottom) {
    if (left < 0 || right < 0 || top < 0 || bottom < 0) {
      throw new Error("Expansion values cannot be negative");
    }
    if (left + right + top + bottom === 0) {
      return this.copy();
    } else {
      var line = _TextDiagram.parts["line"];
      var newLines = [];
      for (var i = 0; i < top; i++) {
        newLines.push(" ".repeat(this.width + left + right));
      }
      for (i = 0; i < this.height; i++) {
        var leftExpansion = i === this.entry ? line : " ";
        var rightExpansion = i === this.exit ? line : " ";
        newLines.push(leftExpansion.repeat(left) + this.lines[i] + rightExpansion.repeat(right));
      }
      for (i = 0; i < bottom; i++) {
        newLines.push(" ".repeat(this.width + left + right));
      }
      return new _TextDiagram(this.entry + top, this.exit + top, newLines);
    }
  }
  static rect(item, dashed = false) {
    return _TextDiagram._rectish("rect", item, dashed);
  }
  static roundrect(item, dashed = false) {
    return _TextDiagram._rectish("roundrect", item, dashed);
  }
  static setFormatting(characters = null, defaults = null) {
    if (characters !== null) {
      _TextDiagram.parts = {};
      if (defaults !== null) {
        _TextDiagram.parts = { ..._TextDiagram.parts, ...defaults };
      }
      _TextDiagram.parts = { ..._TextDiagram.parts, ...characters };
    }
    for (const [name, value] of _TextDiagram.parts) {
      if (value.length != 1) ;
    }
  }
  _dump(show = true) {
    var nl = "\n";
    var result = "height=" + this.height + " lines.length=" + this.lines.length;
    if (this.entry > this.lines.length) {
      result += "; entry outside diagram: entry=" + this.entry;
    }
    if (this.exit > this.lines.length) {
      result += "; exit outside diagram: exit=" + this.exit;
    }
    for (var y = 0; y < Math.max(this.lines.length, this.entry + 1, this.exit + 1); y++) {
      result = result + nl + "[" + ("00" + y).slice(-3) + "]";
      if (y < this.lines.length) {
        result += " '" + this.lines[y] + "' len=" + this.lines[y].length;
      }
      if (y === this.entry && y === this.exit) {
        result += " <- entry, exit";
      } else if (y === this.entry) {
        result += " <- entry";
      } else if (y === this.exit) {
        result += " <- exit";
      }
    }
    if (show) {
      console.log(result);
    }
    return result;
  }
  static _encloseLines(lines, lefts, rights) {
    if (lines.length != lefts.length) {
      throw new Error("All arguments must be the same length");
    }
    if (lines.length != rights.length) {
      throw new Error("All arguments must be the same length");
    }
    var newLines = [];
    for (var i = 0; i < lines.length; i++) {
      newLines.push(lefts[i] + lines[i] + rights[i]);
    }
    return newLines;
  }
  static _gaps(outerWidth, innerWidth) {
    var diff = outerWidth - innerWidth;
    {
      var left = Math.trunc(diff / 2);
      var right = diff - left;
      return [left, right];
    }
  }
  static _getParts(partNames) {
    var result = [];
    for (const name of partNames) {
      if (_TextDiagram.parts[name] == void 0) {
        throw new Error("Text diagram part " + name + "not found.");
      }
      result.push(_TextDiagram.parts[name]);
    }
    return result;
  }
  static _maxWidth(...args) {
    var maxWidth = 0;
    for (const arg of args) {
      if (arg instanceof _TextDiagram) {
        var width = arg.width;
      } else if (arg instanceof Array) {
        width = Math.max(arg.map(function(e) {
          return e.length;
        }));
      } else if (Number.isInteger(arg)) {
        width = Number.toString(arg).length;
      } else {
        width = arg.length;
      }
      maxWidth = width > maxWidth ? width : maxWidth;
    }
    return maxWidth;
  }
  static _padL(string, width, pad) {
    if ((width - string.length) % pad.length != 0) {
      throw new Error("Gap " + (width - string.length) + " must be a multiple of pad string '" + pad + "'");
    }
    return pad.repeat(Math.trunc(width - string.length / pad.length)) + string;
  }
  static _padR(string, width, pad) {
    if ((width - string.length) % pad.length != 0) {
      throw new Error("Gap " + (width - string.length) + " must be a multiple of pad string '" + pad + "'");
    }
    return string + pad.repeat(Math.trunc(width - string.length / pad.length));
  }
  static _rectish(rectType, data, dashed = false) {
    var lineType = dashed ? "_dashed" : "";
    var [topLeft, ctrLeft, botLeft, topRight, ctrRight, botRight, topHoriz, botHoriz, line, cross] = _TextDiagram._getParts([rectType + "_top_left", rectType + "_left" + lineType, rectType + "_bot_left", rectType + "_top_right", rectType + "_right" + lineType, rectType + "_bot_right", rectType + "_top" + lineType, rectType + "_bot" + lineType, "line", "cross"]);
    var itemWasFormatted = data instanceof _TextDiagram;
    if (itemWasFormatted) {
      var itemTD = data;
    } else {
      itemTD = new _TextDiagram(0, 0, [data]);
    }
    var lines = [];
    lines.push(topHoriz.repeat(itemTD.width + 2));
    if (itemWasFormatted) {
      lines += itemTD.expand(1, 1, 0, 0).lines;
    } else {
      for (var i = 0; i < itemTD.lines.length; i++) {
        lines.push(" " + itemTD.lines[i] + " ");
      }
    }
    lines.push(botHoriz.repeat(itemTD.width + 2));
    var entry = itemTD.entry + 1;
    var exit = itemTD.exit + 1;
    var leftMaxWidth = _TextDiagram._maxWidth(topLeft, ctrLeft, botLeft);
    var lefts = [];
    lefts.push(_TextDiagram._padR(topLeft, leftMaxWidth, topHoriz));
    for (i = 1; i < lines.length - 1; i++) {
      lefts.push(_TextDiagram._padR(ctrLeft, leftMaxWidth, " "));
    }
    lefts.push(_TextDiagram._padR(botLeft, leftMaxWidth, botHoriz));
    if (itemWasFormatted) {
      lefts[entry] = cross;
    }
    var rightMaxWidth = _TextDiagram._maxWidth(topRight, ctrRight, botRight);
    var rights = [];
    rights.push(_TextDiagram._padL(topRight, rightMaxWidth, topHoriz));
    for (i = 1; i < lines.length - 1; i++) {
      rights.push(_TextDiagram._padL(ctrRight, rightMaxWidth, " "));
    }
    rights.push(_TextDiagram._padL(botRight, rightMaxWidth, botHoriz));
    if (itemWasFormatted) {
      rights[exit] = cross;
    }
    lines = _TextDiagram._encloseLines(lines, lefts, rights);
    lefts = [];
    for (i = 0; i < lines.length; i++) {
      lefts.push(" ");
    }
    lefts[entry] = line;
    rights = [];
    for (i = 0; i < lines.length; i++) {
      rights.push(" ");
    }
    rights[exit] = line;
    lines = _TextDiagram._encloseLines(lines, lefts, rights);
    return new _TextDiagram(entry, exit, lines);
  }
};
// Note:  All the drawing sequences below MUST be single characters.  setFormatting() checks this.
// Unicode 25xx box drawing characters, plus a few others.
__publicField(_TextDiagram, "PARTS_UNICODE", {
  "cross_diag": "╳",
  "corner_bot_left": "└",
  "corner_bot_right": "┘",
  "corner_top_left": "┌",
  "corner_top_right": "┐",
  "cross": "┼",
  "left": "│",
  "line": "─",
  "line_vertical": "│",
  "multi_repeat": "↺",
  "rect_bot": "─",
  "rect_bot_dashed": "┄",
  "rect_bot_left": "└",
  "rect_bot_right": "┘",
  "rect_left": "│",
  "rect_left_dashed": "┆",
  "rect_right": "│",
  "rect_right_dashed": "┆",
  "rect_top": "─",
  "rect_top_dashed": "┄",
  "rect_top_left": "┌",
  "rect_top_right": "┐",
  "repeat_bot_left": "╰",
  "repeat_bot_right": "╯",
  "repeat_left": "│",
  "repeat_right": "│",
  "repeat_top_left": "╭",
  "repeat_top_right": "╮",
  "right": "│",
  "roundcorner_bot_left": "╰",
  "roundcorner_bot_right": "╯",
  "roundcorner_top_left": "╭",
  "roundcorner_top_right": "╮",
  "roundrect_bot": "─",
  "roundrect_bot_dashed": "┄",
  "roundrect_bot_left": "╰",
  "roundrect_bot_right": "╯",
  "roundrect_left": "│",
  "roundrect_left_dashed": "┆",
  "roundrect_right": "│",
  "roundrect_right_dashed": "┆",
  "roundrect_top": "─",
  "roundrect_top_dashed": "┄",
  "roundrect_top_left": "╭",
  "roundrect_top_right": "╮",
  "separator": "─",
  "tee_left": "┤",
  "tee_right": "├"
});
//	Plain	old	ASCII	characters.
__publicField(_TextDiagram, "PARTS_ASCII", {
  "cross_diag": "X",
  "corner_bot_left": "\\",
  "corner_bot_right": "/",
  "corner_top_left": "/",
  "corner_top_right": "\\",
  "cross": "+",
  "left": "|",
  "line": "-",
  "line_vertical": "|",
  "multi_repeat": "&",
  "rect_bot": "-",
  "rect_bot_dashed": "-",
  "rect_bot_left": "+",
  "rect_bot_right": "+",
  "rect_left": "|",
  "rect_left_dashed": "|",
  "rect_right": "|",
  "rect_right_dashed": "|",
  "rect_top_dashed": "-",
  "rect_top": "-",
  "rect_top_left": "+",
  "rect_top_right": "+",
  "repeat_bot_left": "\\",
  "repeat_bot_right": "/",
  "repeat_left": "|",
  "repeat_right": "|",
  "repeat_top_left": "/",
  "repeat_top_right": "\\",
  "right": "|",
  "roundcorner_bot_left": "\\",
  "roundcorner_bot_right": "/",
  "roundcorner_top_left": "/",
  "roundcorner_top_right": "\\",
  "roundrect_bot": "-",
  "roundrect_bot_dashed": "-",
  "roundrect_bot_left": "\\",
  "roundrect_bot_right": "/",
  "roundrect_left": "|",
  "roundrect_left_dashed": "|",
  "roundrect_right": "|",
  "roundrect_right_dashed": "|",
  "roundrect_top": "-",
  "roundrect_top_dashed": "-",
  "roundrect_top_left": "/",
  "roundrect_top_right": "\\",
  "separator": "-",
  "tee_left": "|",
  "tee_right": "|"
});
// Characters to use in drawing diagrams.  See setFormatting(), PARTS_ASCII, and PARTS_UNICODE.
__publicField(_TextDiagram, "parts", _TextDiagram.PARTS_UNICODE);
let TextDiagram = _TextDiagram;
function unnull(...args) {
  return args.reduce(function(sofar, x) {
    return sofar !== void 0 ? sofar : x;
  });
}
function determineGaps(outer, inner) {
  var diff = outer - inner;
  switch (Options.INTERNAL_ALIGNMENT) {
    case "left":
      return [0, diff];
    case "right":
      return [diff, 0];
    default:
      return [diff / 2, diff / 2];
  }
}
function wrapString(value) {
  return value instanceof FakeSVG ? value : new Terminal("" + value);
}
function max(iter, func = (x) => x) {
  return Math.max.apply(null, iter.map(func));
}
function SVG(name, attrs, text) {
  attrs = attrs || {};
  text = text || "";
  var el = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (var attr in attrs) {
    if (attr === "xlink:href")
      el.setAttributeNS("http://www.w3.org/1999/xlink", "href", attrs[attr]);
    else
      el.setAttribute(attr, attrs[attr]);
  }
  el.textContent = text;
  return el;
}
function escapeString(string) {
  return string.replace(/[*_\`\[\]<&]/g, function(charString) {
    return "&#" + charString.charCodeAt(0) + ";";
  });
}
function* enumerate(iter) {
  var count = 0;
  for (const x of iter) {
    yield [count, x];
    count++;
  }
}
export {
  Choice,
  Comment,
  Diagram,
  DiagramMultiContainer,
  End,
  FakeSVG,
  Group,
  OneOrMore,
  Optional,
  Options,
  Path,
  Sequence,
  Skip,
  Start,
  Terminal,
  TextDiagram,
  defaultCSS
};
