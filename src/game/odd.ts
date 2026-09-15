/** Runtime flags shared with the GitHub Pages hotfix. */

declare global {
  interface Window {
    ODD_CONFIG?: { signalingEndpoint?: string };
  }
}

let interacted = false;

export function markInteracted(): void {
  interacted = true;
}

export function hasInteracted(): boolean {
  return interacted;
}

export function isLiteMode(): boolean {
  if (typeof window === "undefined") return false;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const save = !!nav.connection?.saveData;
  const slow = /(^|-)2g$/.test(nav.connection?.effectiveType || "");
  return motion || save || slow;
}

export function applyLiteClass(): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("lite-mode", isLiteMode());
}

/** Empty string = no signaling (GitHub Pages). Grok preview keeps `/api/rtc`. */
export function signalingEndpoint(): string {
  if (typeof window === "undefined") return "/api/rtc";
  const cfg = window.ODD_CONFIG;
  if (cfg && Object.prototype.hasOwnProperty.call(cfg, "signalingEndpoint")) {
    const v = cfg.signalingEndpoint ?? "";
    return typeof v === "string" ? v.replace(/\/$/, "") : "";
  }
  if (window.location.hostname.endsWith("github.io")) return "";
  return "/api/rtc";
}

export function hasSignaling(): boolean {
  return signalingEndpoint() !== "";
}

export async function rtcFetch(query = "", options: RequestInit = {}): Promise<Response> {
  const endpoint = signalingEndpoint();
  if (!endpoint) throw new Error("Multiplayer requires a configured signaling endpoint");
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 6000);
  try {
    return await fetch(endpoint + query, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

export function emitConnectionError(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("odd:connection-error"));
}

if (typeof window !== "undefined") {
  for (const ev of ["pointerdown", "touchstart", "keydown"] as const) {
    window.addEventListener(
      ev,
      (e) => {
        if (e.isTrusted) interacted = true;
      },
      { capture: true, passive: true },
    );
  }
  applyLiteClass();
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", applyLiteClass);
  const nav = navigator as Navigator & { connection?: EventTarget };
  nav.connection?.addEventListener?.("change", applyLiteClass);
}
