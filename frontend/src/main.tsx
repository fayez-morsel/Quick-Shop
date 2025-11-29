import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.tsx";

if (typeof globalThis !== "undefined") {
  const globalScope = globalThis as typeof globalThis & { chrome?: Record<string, unknown> };
  if (!globalScope.chrome) {
    globalScope.chrome = {};
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
