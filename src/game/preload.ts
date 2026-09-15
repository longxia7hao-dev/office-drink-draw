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

/** HTTP 快取暖身，不建立 <video>，不碰解碼器。 */
function prefetchFile(src: string): Promise<void> {
  return fetch(src, { cache: "force-cache", credentials: "same-origin" })
    .then(async (r) => {
      if (r.ok) await r.arrayBuffer();
    })
    .catch(() => undefined);
}

let splashStarted: Promise<void> | null = null;
let gameStarted: Promise<void> | null = null;

/**
 * 開場 Lottie 播放期間：暖音樂、海報、主選單沙發 MP4 檔案快取。
 * 沙發只 fetch，不 new Video，避免佔走 iPhone 解碼器。
 */
export function warmupSplash(): Promise<void> {
  if (splashStarted) return splashStarted;
  splashStarted = (async () => {
    warmupBgm();
    warmupStudioSting();
    void prefetchFile(ART.homeLoop);
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
    await Promise.all([
      loadImage(ART.homePoster),
      prefetchFile(ART.homeLoop),
    ]);
    void Promise.all([...Object.values(ROLE_ART).map(loadImage), loadImage(ART.logo)]);
  })();
  return gameStarted;
}
