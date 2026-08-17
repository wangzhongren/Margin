import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./notes.css";
import "./history.css";
import "./desktop.css";

if (new URLSearchParams(window.location.search).get("desktop") === "1") {
  document.documentElement.classList.add("desktop-app");
  const platform = new URLSearchParams(window.location.search).get("platform");
  if (platform) document.documentElement.classList.add(`desktop-${platform}`);
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
