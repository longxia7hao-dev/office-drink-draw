import { ART, MODE_ART, ROLE_ART, STICKER_ART, STUDIO_FRAMES, modeArt, preloadReactCards } from "./art";
import { REACT_CARDS, REACT_DECOYS } from "./reactCards";
import { warmupBgm, warmupStudioSting } from "./sfx";

const lottieCache = new Map<string, Promise<unknown>>();

export function prefetchLottie(src: string): Promise<unknown> {
  const hit = lottieCache.get(src);
  if (hit) return hit;
  const job = fetch(src, { credentials: "same-origin" })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  lottieCache.set(src, job);
  return job;
}

function loadImage(src: string): Promise<void> {
  if (typeof window === "undefined" || typeof Image === "undefined") return Promise.resolve();
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    if (typeof img.decode === "function") void img.decode().then(resolve, resolve);
    else {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    }
  });
}

let splashStarted: Promise<void> | null = null;
let gameStarted: Promise<void> | null = null;
let homeLoopStarted: Promise<void> | null = null;
let homeLoopBlobUrl: string | null = null;
let homeLoopPct = 0;
const homeLoopListeners = new Set<(pct: number) => void>();

function reportHomeLoop(pct: number) {
  homeLoopPct = Math.max(homeLoopPct, Math.min(100, pct));
  homeLoopListeners.forEach((fn) => fn(homeLoopPct));
}

export function warmupSplash(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (splashStarted) return splashStarted;
  splashStarted = (async () => {
    warmupBgm();
    warmupStudioSting();
    void prefetchHomeLoop(() => {});
    void prefetchLottie(ART.studioSting);
    void prefetchLottie(ART.catWalk);
    const modes = Object.keys(MODE_ART).map((id) => loadImage(modeArt(id)));
    const stickers = Object.values(STICKER_ART).map(loadImage);
    await Promise.all([
      loadImage(STUDIO_FRAMES[0]!),
      loadImage(ART.homePoster),
      prefetchLottie(ART.studioSting),
      document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve(),
    ]);
    void Promise.all([...modes, ...stickers, prefetchLottie(ART.catWalk)]);
  })();
  return splashStarted;
}

export function warmupGame(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (gameStarted) return gameStarted;
  gameStarted = (async () => {
    const base = import.meta.env.BASE_URL || "/";
    const penalty = ["half", "full", "forehead", "fitness", "custom"].map((id) =>
      prefetchLottie(`${base}lottie/penalty/penalty-${id}.json`),
    );
    await Promise.all([
      loadImage(ART.homePoster),
      loadImage(ART.logo),
      ...Object.values(ROLE_ART).map(loadImage),
      ...Object.keys(MODE_ART).map((id) => loadImage(modeArt(id))),
      ...penalty,
    ]);
    void preloadReactCards([...REACT_CARDS.map((c) => c.file), ...REACT_DECOYS.map((c) => c.file)]);
  })();
  return gameStarted;
}

/** 只下載主選單 mp4 暖快取，不碰解碼器。進度 100 = 檔案已在記憶體。 */
export function prefetchHomeLoop(onProgress: (pct: number) => void): Promise<void> {
  homeLoopListeners.add(onProgress);
  onProgress(homeLoopPct);
  if (!homeLoopStarted) homeLoopStarted = runHomeLoopPrefetch();
  return homeLoopStarted.finally(() => {
    homeLoopListeners.delete(onProgress);
  });
}

async function runHomeLoopPrefetch(): Promise<void> {
  const ac = new AbortController();
  const kill = window.setTimeout(() => ac.abort(), 8000);
  try {
    const res = await fetch(ART.homeLoop, { credentials: "same-origin", signal: ac.signal });
    if (!res.ok) throw new Error("home-loop fetch failed");
    const total = Number(res.headers.get("content-length")) || 632929;
    const chunks: BlobPart[] = [];
    let received = 0;
    reportHomeLoop(4);
    if (res.body) {
      const reader = res.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.byteLength;
        reportHomeLoop(Math.min(98, (received / total) * 98));
      }
    } else {
      chunks.push(await res.arrayBuffer());
    }
    const blob = new Blob(chunks, { type: "video/mp4" });
    if (homeLoopBlobUrl) URL.revokeObjectURL(homeLoopBlobUrl);
    homeLoopBlobUrl = URL.createObjectURL(blob);
    const warm = document.createElement("video");
    warm.muted = true;
    warm.preload = "auto";
    warm.src = homeLoopBlobUrl;
    warm.load();
    reportHomeLoop(100);
  } catch {
    reportHomeLoop(100);
  } finally {
    window.clearTimeout(kill);
  }
}

export function homeLoopSrc(): string {
  return homeLoopBlobUrl || ART.homeLoop;
}
