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

/**
 * 開場播放期間只做這些。
 *
 * 之前 warmupGame() 是在開場一掛載就跑，開場播到第 1.5 秒時會同時送出
 * 十幾個請求（首頁海報、9 張角色圖、logo、home-loop.mp4，還有「再抓一次
 * 正在播的 studio-intro.mp4」），跟開場影片搶頻寬與解碼資源，手機上就是卡。
 * 現在把重的東西全部延後到開場影片緩衝完成或播完才載。
 */
export function warmupSplash(): Promise<void> {
  if (splashStarted) return splashStarted;
  splashStarted = (async () => {
    warmupBgm();
    warmupStudioSting();
    await Promise.all([
      loadImage(STUDIO_FRAMES[0]!),
      document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve(),
    ]);
  })();
  return splashStarted;
}

/**
 * 開場影片已經緩衝完（canplaythrough）或已經播完才呼叫。
 * 注意這裡不再預載 studio-intro.mp4：它就是正在播的那一支，
 * 再開一個 video 元素抓同一個檔案在 iOS 上會直接讓播放中的那支卡住。
 */
export function warmupGame(): Promise<void> {
  if (gameStarted) return gameStarted;
  gameStarted = (async () => {
    await loadImage(ART.homePoster);
    void Promise.all([...Object.values(ROLE_ART).map(loadImage), loadImage(ART.logo)]);
    // 不要再開一個隱藏 <video> 去預載 home-loop：iPhone 常常只能硬體解一支，
    // 隱藏那支會把解碼器佔走，主選單沙發就不會動。
  })();
  return gameStarted;
}
