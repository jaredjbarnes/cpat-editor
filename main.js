import { j as jsxRuntimeExports } from "./_virtual/jsx-runtime.js";
/* empty css         */
import { r as reactExports } from "./_virtual/index.js";
import { c as clientExports } from "./_virtual/client.js";
import { App } from "./app.js";
import { AppPresenter } from "./app_presenter.js";
const presenter = new AppPresenter();
clientExports.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, { presenter }) })
);
