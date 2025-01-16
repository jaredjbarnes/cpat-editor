import { j as jsxRuntimeExports } from "./_virtual/jsx-runtime.js";
import styles from "./panel_header.module.css.js";
import classNames from "./_virtual/index3.js";
import "./node_modules/@tcn/ui-layout/dist/pad.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/box/box.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/flex_box.js";
import { HStack } from "./node_modules/@tcn/ui-layout/dist/stacks/h_stack.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/spacer.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/v_stack.js";
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
function PanelHeader({ children, className, style }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(HStack, { height: "auto", verticalAlignment: "center", className: classNames(styles["panel-header"], className), style, children });
}
export {
  PanelHeader
};
