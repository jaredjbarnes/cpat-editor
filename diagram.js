import { j as jsxRuntimeExports } from "./_virtual/jsx-runtime.js";
import { r as reactExports } from "./_virtual/index.js";
import "./node_modules/@tcn/state/dist/irunner_broadcast.js";
import { useSignalValueEffect } from "./node_modules/@tcn/state/dist/hooks/use_signal_value_effect.js";
import "./node_modules/@tcn/ui-layout/dist/pad.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/box/box.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/flex_box.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/h_stack.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/spacer.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/v_stack.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/z_stack.js";
import "./node_modules/@tcn/ui-layout/dist/grid.js";
import "./node_modules/@tcn/ui-layout/dist/list.js";
import "./node_modules/@tcn/ui-layout/dist/virtualized_grid/virtualized_grid.js";
/* empty css                                          */
import "./node_modules/@tcn/ui-core/dist/hooks/use_resize_observer.js";
import "./node_modules/@tcn/ui-core/dist/icon.js";
import "./_virtual/index3.js";
import "./node_modules/@tcn/ui-core/dist/typography/body_text.module.css.js";
import "./node_modules/@tcn/ui-core/dist/typography/header.module.css.js";
import "./node_modules/@tcn/ui-core/dist/click_away_listener.js";
import "./node_modules/@tcn/ui-core/dist/scroll_away_listener.js";
import "./node_modules/@tcn/ui-layout/dist/virtualized_list/virtualized_list.js";
import { StyleBox } from "./node_modules/@tcn/ui-layout/dist/stacks/style_box.js";
import "./node_modules/@tcn/ui-layout/dist/portal/portal_platform_context.js";
import "./node_modules/@tcn/ui-layout/dist/popover/popover.module.css.js";
function Diagram({ presenter }) {
  const ref = reactExports.useRef(null);
  useSignalValueEffect((diagrams) => {
    const div = ref.current;
    if (div != null) {
      div.innerHTML = "";
      diagrams.forEach((diagram) => {
        const wrapper = window.document.createElement("div");
        let id = "";
        try {
          id = diagram.items[1].label.text;
        } catch {
        }
        wrapper.id = id;
        console.log(wrapper.id);
        diagram.addTo(wrapper);
        div.appendChild(wrapper);
      });
    }
  }, presenter.diagramsBroadcast);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    StyleBox,
    {
      ref,
      overflow: "auto",
      backgroundColor: "var(--surface-tertiary-color)"
    }
  );
}
export {
  Diagram
};
