import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Display grotesque — headlines, numerals, structure
import "@fontsource-variable/bricolage-grotesque";
// Editorial serif italic — used sparingly for emphasis / pull-quotes
import "@fontsource-variable/fraunces/opsz-italic.css";
// UI + body
import "@fontsource-variable/inter";
// Meta labels, indices, coordinates
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
