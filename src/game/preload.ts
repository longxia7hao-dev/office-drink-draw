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

/**
 * 開場 Lottie 播放期間：暖音樂與海報。
 * 主選單沙發 MP4 由 prefetchHomeLoop 單獨抓，好把下載進度畫在讀取條上。
 */
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

/** 下載主選單沙發 MP4，回報 0–100。不建立 <video>。 */
export function prefetchHomeLoop(onProgress: (pct: number) => void): Promise<void> {
  if (homeLoopStarted) {
    onProgress(100);
    return homeLoopStarted;
  }
  homeLoopStarted = (async () => {
    try {
      const res = await fetch(ART.homeLoop, { credentials: "same-origin" });
      if (!res.ok || !res.body) {
        onProgress(100);
        return;
      }
      const total = Number(res.headers.get("content-length")) || 632929;
      const reader = res.body.getReader();
      let received = 0;
      onProgress(1);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        onProgress(Math.min(99, (received / total) * 100));
      }
      onProgress(100);
    } catch {
      onProgress(100);
    }
  })();
  return homeLoopStarted;
}
