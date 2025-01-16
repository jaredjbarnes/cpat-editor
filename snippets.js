import { j as jsxRuntimeExports } from "./_virtual/jsx-runtime.js";
import classNames from "./_virtual/index3.js";
import styles from "./snippets.module.css.js";
import "./node_modules/@tcn/ui-layout/dist/pad.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/box/box.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/flex_box.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/h_stack.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/spacer.js";
import { VStack } from "./node_modules/@tcn/ui-layout/dist/stacks/v_stack.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/z_stack.js";
import "./node_modules/@tcn/ui-layout/dist/grid.js";
import "./node_modules/@tcn/ui-layout/dist/list.js";
import "./node_modules/@tcn/ui-layout/dist/virtualized_grid/virtualized_grid.js";
import "./node_modules/@tcn/state/dist/irunner_broadcast.js";
import "./_virtual/index.js";
/* empty css                                          */
import "./node_modules/@tcn/ui-core/dist/hooks/use_resize_observer.js";
import "./node_modules/@tcn/ui-core/dist/icon.js";
import "./node_modules/@tcn/ui-core/dist/typography/body_text.module.css.js";
import "./node_modules/@tcn/ui-core/dist/typography/header.module.css.js";
import "./node_modules/@tcn/ui-core/dist/click_away_listener.js";
import "./node_modules/@tcn/ui-core/dist/scroll_away_listener.js";
import "./node_modules/@tcn/ui-layout/dist/virtualized_list/virtualized_list.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/style_box.js";
import "./node_modules/@tcn/ui-layout/dist/portal/portal_platform_context.js";
import "./node_modules/@tcn/ui-layout/dist/popover/popover.module.css.js";
function GrammarExampleHeader({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: styles["snippet-header"], children: text });
}
function Literal() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Literal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["snippet-code"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "john" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"John"' })
    ] })
  ] });
}
function Regex() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Regular Expression" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["snippet-code"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "space" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-regex", children: "/\\s+/" })
    ] })
  ] });
}
function Options() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Options" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["snippet-code"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "john" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"John"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "jane" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"Jane"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "jane" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " | " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "john" })
      ] })
    ] })
  ] });
}
function Sequence() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Sequence" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["snippet-code"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "prefix" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"I am "' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "adjective" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"happy"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "mood" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "prefix" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " + " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "adjective" })
      ] })
    ] })
  ] });
}
function OptionalPattern() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Optional Pattern" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["snippet-code"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "prefix" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"I am "' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "super" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"super "' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "adjective" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"happy"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "mood" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "prefix" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " + " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "super" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "? + " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "adjective" })
      ] })
    ] })
  ] });
}
function Repeat() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Repeat" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["snippet-code"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"John"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "comma" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '", "' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "zero-or-more" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        "(",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        ", ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "comma" }),
        ")*"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "at-least-one-entry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        "(",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        ", ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "comma" }),
        ")+"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "at-least-two-entries" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        "(",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        ", ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "comma" }),
        ")",
        `{2,}`
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "between-two-and-four-entries" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        "(",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        ", ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "comma" }),
        ")",
        `{2,4}`
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "trim-divider" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        "(",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        ", ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "comma" }),
        " trim)"
      ] })
    ] })
  ] });
}
function NegativeLookahead() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Negative Lookahead" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["snippet-code"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "bob" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"Bob"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "james" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"James"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " = !" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "james" }),
        " + ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "bob" })
      ] })
    ] })
  ] });
}
function Import() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Import" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["snippet-code"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-keyword", children: "import" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          " ",
          "{",
          " "
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "another-test" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          " ",
          "}",
          " "
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-keyword", children: "from " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"./test.cpat"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "another-test" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "test" }),
        " | ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"something else"' })
      ] })
    ] })
  ] });
}
function UseParams() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Use Parameters" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["snippet-code"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-keyword", children: "use params " }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          " ",
          "{",
          " "
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "customer-names" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          " ",
          "}",
          " "
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "customer-names" }),
        " | ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"Billy"' })
      ] })
    ] })
  ] });
}
function DefineImportParams() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Define Parameters on Import" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["snippet-code"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-keyword", children: "import" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          " ",
          "{",
          " "
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          " ",
          "}",
          " "
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-keyword", children: "from " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"./names.cpat"' }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-keyword", children: " with params " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "{" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", style: { whiteSpace: "pre" }, children: "  customer-names" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " = " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"Anakin"' }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " | " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"Yoda"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "}" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name-list" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        "(",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        ", ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "comma" }),
        " trim)"
      ] })
    ] })
  ] });
}
function Comment() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Comment" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles["snippet-code"], children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-comment", children: "# Describe your patterns" }) })
  ] });
}
function GreedyOptions() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(VStack, { height: "auto", horizontalAlignment: "start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GrammarExampleHeader, { text: "Greedy Options" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["snippet-code"], children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-comment", children: "# Will traverse each option and take the longest one" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "john" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"John"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "jane" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-literal", children: '"Jane"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "=" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: " " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "jane" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          " ",
          "<|>",
          " "
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-name", children: "john" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-comment", children: "# Potentially computationally expensive, use with care" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "syntax-comment", children: "# Do not use in circular patterns" }) })
    ] })
  ] });
}
function Snippets({ className, style }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    VStack,
    {
      flex: true,
      horizontalAlignment: "start",
      overflowY: "auto",
      className: classNames(styles["snippets"], className),
      style,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Literal, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Regex, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Options, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(OptionalPattern, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NegativeLookahead, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Import, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(UseParams, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DefineImportParams, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Comment, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(GreedyOptions, {})
      ]
    }
  );
}
export {
  Snippets
};
