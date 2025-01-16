import { j as jsxRuntimeExports } from "../_virtual/jsx-runtime.js";
import "../node_modules/@tcn/state/dist/irunner_broadcast.js";
import { useSignalValue } from "../node_modules/@tcn/state/dist/hooks/use_signal_value.js";
import { r as reactExports } from "../_virtual/index.js";
import "../node_modules/@tcn/ui-controls/dist/button/button.js";
/* empty css                                           */
import "../node_modules/@tcn/ui-core/dist/hooks/use_resize_observer.js";
import "../node_modules/@tcn/ui-core/dist/icon.js";
import { BodyText } from "../node_modules/@tcn/ui-core/dist/typography/body_text.js";
import "../_virtual/index3.js";
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
import "../node_modules/@tcn/ui-layout/dist/pad.js";
import "../node_modules/@tcn/ui-layout/dist/stacks/box/box.js";
import "../node_modules/@tcn/ui-layout/dist/stacks/flex_box.js";
import { HStack } from "../node_modules/@tcn/ui-layout/dist/stacks/h_stack.js";
import "../node_modules/@tcn/ui-layout/dist/stacks/spacer.js";
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
import { MenuItem } from "../node_modules/@tcn/ui-controls/dist/menu/menu.js";
import { ContextMenu } from "../node_modules/@tcn/ui-controls/dist/context_menu/context_menu.js";
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
import { PendingFileCreation } from "./pending_file_creation.js";
import { FileItem } from "./file_item.js";
import { PendingDirectoryCreation } from "./pending_directory_creation.js";
import styles from "./directory_item.module.css.js";
import styles$1 from "../app.module.css.js";
import SvgChevronDown from "../icons/chevron_down.svg.js";
import SvgChevronRight from "../icons/chevron_right.svg.js";
function DirectoryItem({ directory, presenter }) {
  const focusedItem = useSignalValue(presenter.focusedItemBroadcast);
  const isFocused = directory.path === (focusedItem == null ? void 0 : focusedItem.path);
  const [isContextMenuOpen, setContextMenuOpen] = reactExports.useState(false);
  const [position, setPosition] = reactExports.useState(null);
  const openMap = useSignalValue(presenter.openDirectoriesBroadcast);
  const pendingFileCreation = useSignalValue(presenter.pendingFileCreationBroadcast);
  const pendingDirectoryCreation = useSignalValue(
    presenter.pendingDirectoryCreationBroadcast
  );
  const isPending = pendingDirectoryCreation != null || pendingFileCreation != null;
  const isOpen = openMap.get(directory.path);
  const path = directory.path;
  const children = directory.items.map((i, index) => {
    if (i.type === "directory") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DirectoryItem, { directory: i, presenter }, index);
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(FileItem, { file: i, presenter }, index);
    }
  });
  if (pendingFileCreation != null && pendingFileCreation.directory === directory.path) {
    children.unshift(/* @__PURE__ */ jsxRuntimeExports.jsx(PendingFileCreation, { presenter: pendingFileCreation }, -1));
  }
  if (pendingDirectoryCreation != null && pendingDirectoryCreation.directory === directory.path) {
    children.unshift(
      /* @__PURE__ */ jsxRuntimeExports.jsx(PendingDirectoryCreation, { presenter: pendingDirectoryCreation }, -1)
    );
  }
  function selectItem(event) {
    presenter.toggleDirectory(directory.path);
    presenter.focus(directory.path);
    event.stopPropagation();
    event.preventDefault();
  }
  function placeMenu(event) {
    setPosition({ x: event.clientX, y: event.clientY });
    setContextMenuOpen(true);
    event.preventDefault();
  }
  function close() {
    setContextMenuOpen(false);
  }
  function deleteFile() {
    presenter.deleteFile(directory.path);
  }
  reactExports.useLayoutEffect(() => {
    if (isPending) {
      presenter.openDirectory(path);
    }
  }, [isPending, presenter, path]);
  const padding = path.split("/").length * 5;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      HStack,
      {
        height: "auto",
        "data-is-focused": isFocused,
        onContextMenu: placeMenu,
        onClick: selectItem,
        className: styles["directory-item"],
        paddingInlineStart: `${padding}px`,
        children: [
          isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(SvgChevronDown, { className: `${styles$1["icon"]} ${styles$1["black"]}` }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SvgChevronRight, { className: `${styles$1["icon"]} ${styles$1["black"]}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BodyText, { variant: "large", children: directory.name })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(VStack, { height: "auto", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ContextMenu, { open: isContextMenuOpen, position, onClose: close, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { label: "Delete", onClick: deleteFile }) })
  ] });
}
export {
  DirectoryItem
};
