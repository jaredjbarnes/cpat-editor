import { j as jsxRuntimeExports } from "../_virtual/jsx-runtime.js";
import "../node_modules/@tcn/state/dist/irunner_broadcast.js";
import { useSignalValue } from "../node_modules/@tcn/state/dist/hooks/use_signal_value.js";
import "../_virtual/index.js";
import { PendingFileCreation } from "./pending_file_creation.js";
import { DirectoryItem } from "./directory_item.js";
import { FileItem } from "./file_item.js";
import { PendingDirectoryCreation } from "./pending_directory_creation.js";
function RootDirectory({ directory, presenter }) {
  const pendingFileCreation = useSignalValue(presenter.pendingFileCreationBroadcast);
  const pendingDirectoryCreation = useSignalValue(
    presenter.pendingDirectoryCreationBroadcast
  );
  const children = directory.items.map((i, index) => {
    if (i.type === "directory") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DirectoryItem, { directory: i, presenter }, index);
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(FileItem, { file: i, presenter }, index);
    }
  });
  if (pendingFileCreation != null && pendingFileCreation.directory === "/") {
    children.unshift(/* @__PURE__ */ jsxRuntimeExports.jsx(PendingFileCreation, { presenter: pendingFileCreation }, -1));
  }
  if (pendingDirectoryCreation != null && pendingDirectoryCreation.directory === "/") {
    children.unshift(
      /* @__PURE__ */ jsxRuntimeExports.jsx(PendingDirectoryCreation, { presenter: pendingDirectoryCreation }, -1)
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
export {
  RootDirectory
};
