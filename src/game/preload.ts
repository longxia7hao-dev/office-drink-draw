import { ART, ROLE_ART, STUDIO_FRAMES } from "./art";
import { warmupBgm, warmupStudioSting } from "./sfx";

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
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
  if (splashStarted) return splashStarted;
  splashStarted = (async () => {
    warmupBgm();
    warmupStudioSting();
    await Promise.all([
      loadImage(STUDIO_FRAMES[0]!),
      loadImage(ART.homePoster),
      document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve(),
    ]);
  })();
  return splashStarted;
}

export function warmupGame(): Promise<void> {
  if (gameStarted) return gameStarted;
  gameStarted = (async () => {
    await loadImage(ART.homePoster);
    void Promise.all([...Object.values(ROLE_ART).map(loadImage), loadImage(ART.logo)]);
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
