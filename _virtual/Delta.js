import { getDefaultExportFromCjs } from "./_commonjsHelpers.js";
import { __require as requireDelta } from "../node_modules/quill-delta/dist/Delta.js";
var DeltaExports = requireDelta();
const Delta = /* @__PURE__ */ getDefaultExportFromCjs(DeltaExports);
export {
  DeltaExports as D,
  Delta as default
};
