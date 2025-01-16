import { j as jsxRuntimeExports } from "./_virtual/jsx-runtime.js";
import { r as reactExports } from "./_virtual/index.js";
import "./node_modules/@tcn/ui-layout/dist/pad.js";
import { Box } from "./node_modules/@tcn/ui-layout/dist/stacks/box/box.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/flex_box.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/h_stack.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/spacer.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/v_stack.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/z_stack.js";
import "./node_modules/@tcn/ui-layout/dist/grid.js";
import "./node_modules/@tcn/ui-layout/dist/list.js";
import "./node_modules/@tcn/ui-layout/dist/virtualized_grid/virtualized_grid.js";
import "./node_modules/@tcn/state/dist/irunner_broadcast.js";
/* empty css                                          */
import "./node_modules/@tcn/ui-core/dist/hooks/use_resize_observer.js";
import "./node_modules/@tcn/ui-core/dist/icon.js";
import "./_virtual/index3.js";
import "./node_modules/@tcn/ui-core/dist/typography/body_text.module.css.js";
import "./node_modules/@tcn/ui-core/dist/typography/header.module.css.js";
import "./node_modules/@tcn/ui-core/dist/click_away_listener.js";
import "./node_modules/@tcn/ui-core/dist/scroll_away_listener.js";
import "./node_modules/@tcn/ui-layout/dist/virtualized_list/virtualized_list.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/style_box.js";
import "./node_modules/@tcn/ui-layout/dist/portal/portal_platform_context.js";
import "./node_modules/@tcn/ui-layout/dist/popover/popover.module.css.js";
import styles from "./text_editor.module.css.js";
function TextEditor({ presenter }) {
  const ref = reactExports.useRef(null);
  reactExports.useLayoutEffect(() => {
    if (ref.current != null) {
      presenter.initialize(ref.current);
    }
    return () => {
      presenter.dispose();
    };
  }, [presenter]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: styles["text-editor"], ref });
}
export {
  TextEditor
};
