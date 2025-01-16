import { j as jsxRuntimeExports } from "./_virtual/jsx-runtime.js";
import "./node_modules/@tcn/ui-layout/dist/pad.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/box/box.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/flex_box.js";
import { HStack } from "./node_modules/@tcn/ui-layout/dist/stacks/h_stack.js";
import { Spacer } from "./node_modules/@tcn/ui-layout/dist/stacks/spacer.js";
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
import "./_virtual/index3.js";
import "./node_modules/@tcn/ui-core/dist/typography/body_text.module.css.js";
import "./node_modules/@tcn/ui-core/dist/typography/header.module.css.js";
import "./node_modules/@tcn/ui-core/dist/click_away_listener.js";
import "./node_modules/@tcn/ui-core/dist/scroll_away_listener.js";
import "./node_modules/@tcn/ui-layout/dist/virtualized_list/virtualized_list.js";
import "./node_modules/@tcn/ui-layout/dist/stacks/style_box.js";
import "./node_modules/@tcn/ui-layout/dist/portal/portal_platform_context.js";
import "./node_modules/@tcn/ui-layout/dist/popover/popover.module.css.js";
import { PanelHeader } from "./panel_header.js";
import { Snippets } from "./snippets.js";
import styles from "./snippets_side_panel.module.css.js";
import "./node_modules/@tcn/ui-controls/dist/button/button.js";
import { IconButton } from "./node_modules/@tcn/ui-controls/dist/button/icon_button.js";
import "./node_modules/@tcn/ui-controls/dist/checkbox/checkbox.js";
import "./node_modules/@tcn/ui-controls/dist/radio/radio.js";
import "./node_modules/@tcn/ui-controls/dist/switch/switch.js";
import "./node_modules/@tcn/ui-controls/dist/slider/slider.js";
import "./node_modules/@tcn/ui-controls/dist/input/input.js";
import "./node_modules/@tcn/ui-controls/dist/textarea/textarea.js";
import "./node_modules/@tcn/ui-controls/dist/select/select.js";
import "./node_modules/@tcn/ui-controls/dist/multiselect/multiselect.js";
import "./node_modules/@tcn/ui-controls/dist/multiselect/freeform_multiselect.js";
import "./node_modules/@tcn/ui-controls/dist/date_picker/date_picker.js";
import "./node_modules/@tcn/ui-controls/dist/focus_redirect/focus_redirect.js";
import "./node_modules/@tcn/ui-controls/dist/date_picker/date_picker_input.module.css.js";
import "./node_modules/@tcn/ui-controls/dist/date_range_picker/date_range_picker.js";
import "./node_modules/@tcn/ui-controls/dist/date_range_picker/date_range_picker_input.module.css.js";
import "./node_modules/@tcn/ui-controls/dist/select_group/select_group.js";
import "./node_modules/@tcn/ui-controls/dist/page_selector/page_selector.module.css.js";
import "./node_modules/@tcn/ui-controls/dist/chip/chip.js";
import "./node_modules/@tcn/ui-controls/dist/button/button_group.js";
import "./node_modules/@tcn/ui-controls/dist/unit_input/unit_input.js";
import "./node_modules/@tcn/ui-controls/dist/mask_input/mask_input.js";
import "./node_modules/@tcn/ui-controls/dist/phone_number_input/phone_number_input.js";
import "./node_modules/@tcn/ui-controls/dist/menu/menu.js";
import "./node_modules/@tcn/ui-controls/dist/auto_complete_input/auto_complete_input.js";
import "./node_modules/@tcn/ui-controls/dist/color_input/color_picker.js";
import "./node_modules/@tcn/ui-controls/dist/color_input/color_input.module.css.js";
import "./node_modules/@tcn/ui-controls/dist/accordion/accordion.js";
import "./node_modules/@tcn/ui-controls/dist/fieldrow/fieldrow.js";
import "./node_modules/@tcn/ui-controls/dist/fieldset/fieldset.js";
import "./node_modules/@tcn/ui-controls/dist/accordion/accordion_fieldrow.js";
import "./node_modules/@tcn/ui-controls/dist/tabs/tabs.js";
import "./node_modules/@tcn/ui-controls/dist/select/select_row.js";
import "./node_modules/@tcn/ui-controls/dist/multiselect/multiselect_row.js";
import "./node_modules/@tcn/ui-controls/dist/unit_input/unit_input_row.js";
import "./node_modules/@tcn/ui-controls/dist/mask_input/mask_input_row.js";
import "./node_modules/@tcn/ui-controls/dist/phone_number_input/phone_number_input_row.js";
import "./node_modules/@tcn/ui-controls/dist/badge/badge.js";
import "./node_modules/@tcn/ui-controls/dist/badge/bubble.js";
import "./node_modules/@tcn/ui-controls/dist/progress/progress_bar.js";
import "./node_modules/@tcn/ui-controls/dist/confirm/confirm.js";
import "./node_modules/@tcn/ui-controls/dist/alert/alert.js";
function SnippetsSidePanel({ onClose }) {
  function close() {
    onClose && onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    VStack,
    {
      className: styles["snippets-side-panel"],
      horizontalAlignment: "start",
      overflowY: "hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { className: styles["panel-header"], children: /* @__PURE__ */ jsxRuntimeExports.jsxs(HStack, { height: "auto", children: [
          "SNIPPETS",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Spacer, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { iconSize: "22px", iconName: "cross", onClick: close })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Snippets, { className: styles["panel-body"] })
      ]
    }
  );
}
export {
  SnippetsSidePanel
};
