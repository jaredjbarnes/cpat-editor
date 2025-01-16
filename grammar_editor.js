import { j as jsxRuntimeExports } from "./_virtual/jsx-runtime.js";
import { r as reactExports } from "./_virtual/index.js";
import { TextEditor } from "./text_editor.js";
/* empty css                   */
function GrammarEditor({ presenter }) {
  reactExports.useLayoutEffect(() => {
    presenter.initialize();
  }, [presenter]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TextEditor, { presenter: presenter.textEditor });
}
export {
  GrammarEditor
};
