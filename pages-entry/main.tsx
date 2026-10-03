import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GameApp } from "@/components/game/GameApp";
import "@/game/odd";
import "@/styles.css";

const room = new URLSearchParams(window.location.search).get("room") ?? undefined;
const reload = document.getElementById("reload-app");
reload?.addEventListener("click", () => location.reload());
window.addEventListener(
  "error",
  (event) => {
    const t = event.target as HTMLElement | null;
    if (t?.matches?.("script[data-app],img.home-poster") || event.error) {
      const panel = document.getElementById("load-error");
      if (panel) panel.hidden = false;
    }
  },
  true,
);
window.setTimeout(() => {
  if (!document.querySelector("#root .app-shell")) {
    const panel = document.getElementById("load-error");
    if (panel) panel.hidden = false;
  }
}, 12000);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameApp presetRoom={room} />
  </StrictMode>,
);
