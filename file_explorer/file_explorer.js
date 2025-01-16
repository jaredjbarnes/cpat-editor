import { j as jsxRuntimeExports } from "../_virtual/jsx-runtime.js";
import { Button } from "../node_modules/@tcn/ui-controls/dist/button/button.js";
/* empty css                                           */
import "../_virtual/index.js";
import "../node_modules/@tcn/ui-core/dist/hooks/use_resize_observer.js";
import "../node_modules/@tcn/ui-core/dist/icon.js";
import "../_virtual/index3.js";
import "../node_modules/@tcn/ui-core/dist/typography/body_text.module.css.js";
import "../node_modules/@tcn/ui-core/dist/typography/header.module.css.js";
import "../node_modules/@tcn/ui-core/dist/click_away_listener.js";
import "../node_modules/@tcn/ui-core/dist/scroll_away_listener.js";
import "../node_modules/@tcn/ui-controls/dist/button/icon_button.module.css.js";
import "../node_modules/@tcn/ui-controls/dist/checkbox/checkbox.js";
import "../node_modules/@tcn/ui-controls/dist/radio/radio.js";
import "../node_modules/@tcn/ui-controls/dist/switch/switch.js";
import "../node_modules/@tcn/ui-controls/dist/slider/slider.js";
import "../node_modules/@tcn/ui-controls/dist/input/input.js";
import "../node_modules/@tcn/ui-controls/dist/textarea/textarea.js";
import "../node_modules/@tcn/ui-controls/dist/select/select.js";
import "../node_modules/@tcn/ui-controls/dist/multiselect/multiselect.js";
import "../node_modules/@tcn/ui-controls/dist/multiselect/freeform_multiselect.js";
import "../node_modules/@tcn/state/dist/irunner_broadcast.js";
import { useSignalValue } from "../node_modules/@tcn/state/dist/hooks/use_signal_value.js";
import "../node_modules/@tcn/ui-layout/dist/pad.js";
import "../node_modules/@tcn/ui-layout/dist/stacks/box/box.js";
import { FlexBox } from "../node_modules/@tcn/ui-layout/dist/stacks/flex_box.js";
import { HStack } from "../node_modules/@tcn/ui-layout/dist/stacks/h_stack.js";
import { Spacer } from "../node_modules/@tcn/ui-layout/dist/stacks/spacer.js";
import { VStack } from "../node_modules/@tcn/ui-layout/dist/stacks/v_stack.js";
import "../node_modules/@tcn/ui-layout/dist/stacks/z_stack.js";
import "../node_modules/@tcn/ui-layout/dist/grid.js";
import "../node_modules/@tcn/ui-layout/dist/list.js";
import "../node_modules/@tcn/ui-layout/dist/virtualized_grid/virtualized_grid.js";
import "../node_modules/@tcn/ui-layout/dist/virtualized_list/virtualized_list.js";
import "../node_modules/@tcn/ui-layout/dist/stacks/style_box.js";
import "../node_modules/@tcn/ui-layout/dist/portal/portal_platform_context.js";
import "../node_modules/@tcn/ui-layout/dist/popover/popover.module.css.js";
import "../node_modules/@tcn/ui-controls/dist/date_picker/date_picker.js";
import "../node_modules/@tcn/ui-controls/dist/focus_redirect/focus_redirect.js";
import "../node_modules/@tcn/ui-controls/dist/date_picker/date_picker_input.module.css.js";
import "../node_modules/@tcn/ui-controls/dist/date_range_picker/date_range_picker.js";
import "../node_modules/@tcn/ui-controls/dist/date_range_picker/date_range_picker_input.module.css.js";
import "../node_modules/@tcn/ui-controls/dist/select_group/select_group.js";
import "../node_modules/@tcn/ui-controls/dist/page_selector/page_selector.module.css.js";
import "../node_modules/@tcn/ui-controls/dist/chip/chip.js";
import "../node_modules/@tcn/ui-controls/dist/button/button_group.js";
import "../node_modules/@tcn/ui-controls/dist/unit_input/unit_input.js";
import "../node_modules/@tcn/ui-controls/dist/mask_input/mask_input.js";
import "../node_modules/@tcn/ui-controls/dist/phone_number_input/phone_number_input.js";
import "../node_modules/@tcn/ui-controls/dist/menu/menu.js";
import "../node_modules/@tcn/ui-controls/dist/auto_complete_input/auto_complete_input.js";
import "../node_modules/@tcn/ui-controls/dist/color_input/color_picker.js";
import "../node_modules/@tcn/ui-controls/dist/color_input/color_input.module.css.js";
import "../node_modules/@tcn/ui-controls/dist/accordion/accordion.js";
import "../node_modules/@tcn/ui-controls/dist/fieldrow/fieldrow.js";
import "../node_modules/@tcn/ui-controls/dist/fieldset/fieldset.js";
import "../node_modules/@tcn/ui-controls/dist/accordion/accordion_fieldrow.js";
import "../node_modules/@tcn/ui-controls/dist/tabs/tabs.js";
import "../node_modules/@tcn/ui-controls/dist/select/select_row.js";
import "../node_modules/@tcn/ui-controls/dist/multiselect/multiselect_row.js";
import "../node_modules/@tcn/ui-controls/dist/unit_input/unit_input_row.js";
import "../node_modules/@tcn/ui-controls/dist/mask_input/mask_input_row.js";
import "../node_modules/@tcn/ui-controls/dist/phone_number_input/phone_number_input_row.js";
import "../node_modules/@tcn/ui-controls/dist/badge/badge.js";
import "../node_modules/@tcn/ui-controls/dist/badge/bubble.js";
import "../node_modules/@tcn/ui-controls/dist/progress/progress_bar.js";
import "../node_modules/@tcn/ui-controls/dist/confirm/confirm.js";
import "../node_modules/@tcn/ui-controls/dist/alert/alert.js";
import { PanelHeader } from "../panel_header.js";
import styles from "./file_explorer.module.css.js";
import { RootDirectory } from "./root_directory.js";
import SvgFilePlus from "../icons/file_plus.svg.js";
import SvgFolderPlus from "../icons/folder_plus.svg.js";
import SvgRefreshCcw from "../icons/refresh_ccw.svg.js";
import styles$1 from "../app.module.css.js";
function FileExplorer({ presenter }) {
  const directory = useSignalValue(presenter.directoryBroadcast);
  function startFileCreation() {
    presenter.startFileCreation();
  }
  function startDirectoryCreation() {
    presenter.startDirectoryCreation();
  }
  function refresh() {
    presenter.refresh();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    VStack,
    {
      className: styles["file-explorer-side-panel"],
      horizontalAlignment: "start",
      overflowY: "hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { className: styles["panel-header"], children: /* @__PURE__ */ jsxRuntimeExports.jsxs(HStack, { children: [
          "FILE EXPLORER ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Spacer, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: styles$1["icon-button"], onClick: startFileCreation, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SvgFilePlus, { className: styles$1["icon"] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Spacer, { width: "8px" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: styles$1["icon-button"], onClick: startDirectoryCreation, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SvgFolderPlus, { className: styles$1["icon"] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Spacer, { width: "8px" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: styles$1["icon-button"], onClick: refresh, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SvgRefreshCcw, { className: styles$1["icon"] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FlexBox, { className: styles["panel-body"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(RootDirectory, { directory, presenter }) })
      ]
    }
  );
}
export {
  FileExplorer
};
