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
let homeLoopVideo: HTMLVideoElement | null = null;
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

function makeHomeVideo(): HTMLVideoElement {
  const v = document.createElement("video");
  v.muted = true;
  v.defaultMuted = true;
  v.volume = 0;
  v.loop = true;
  v.autoplay = true;
  v.playsInline = true;
  v.preload = "auto";
  v.controls = false;
  v.disablePictureInPicture = true;
  v.setAttribute("muted", "");
  v.setAttribute("playsinline", "true");
  v.setAttribute("webkit-playsinline", "true");
  v.setAttribute("x-webkit-airplay", "deny");
  v.setAttribute("disablepictureinpicture", "");
  v.playsInline = true;
  parkNode(v);
  document.body.appendChild(v);
  return v;
}

function parkNode(v: HTMLVideoElement) {
  v.style.cssText = "position:fixed;left:-120px;top:0;width:2px;height:2px;opacity:0;pointer-events:none;border:0";
}

/** 下載＋解碼主選單沙發。條到 100 代表這支 video 已經可以播。 */
export function prefetchHomeLoop(onProgress: (pct: number) => void): Promise<void> {
  homeLoopListeners.add(onProgress);
  onProgress(homeLoopPct);
  if (!homeLoopStarted) homeLoopStarted = runHomeLoopPrefetch();
  return homeLoopStarted.finally(() => {
    homeLoopListeners.delete(onProgress);
  });
}

async function runHomeLoopPrefetch(): Promise<void> {
  const v = makeHomeVideo();
  homeLoopVideo = v;
  try {
    const res = await fetch(ART.homeLoop, { credentials: "same-origin" });
    if (!res.ok) throw new Error("home-loop fetch failed");
    const total = Number(res.headers.get("content-length")) || 632929;
    const chunks: BlobPart[] = [];
    let received = 0;
    reportHomeLoop(1);
    if (res.body) {
      const reader = res.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.byteLength;
        reportHomeLoop(Math.min(86, (received / total) * 86));
      }
    } else {
      chunks.push(await res.arrayBuffer());
      reportHomeLoop(86);
    }
    const blob = new Blob(chunks, { type: "video/mp4" });
    if (homeLoopBlobUrl) URL.revokeObjectURL(homeLoopBlobUrl);
    homeLoopBlobUrl = URL.createObjectURL(blob);
    reportHomeLoop(88);

    await new Promise<void>((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      v.addEventListener("canplaythrough", done, { once: true });
      v.addEventListener("playing", () => {
        reportHomeLoop(96);
        done();
      });
      v.addEventListener("canplay", () => reportHomeLoop(92));
      v.addEventListener("error", done, { once: true });
      v.src = homeLoopBlobUrl!;
      v.load();
      void v.play().catch(() => {});
      window.setTimeout(done, 5000);
    });
    reportHomeLoop(100);
  } catch {
    v.src = ART.homeLoop;
    v.load();
    void v.play().catch(() => {});
    reportHomeLoop(100);
  }
}

export function peekHomeLoopVideo(): HTMLVideoElement | null {
  return homeLoopVideo;
}

export function parkHomeLoopVideo(): void {
  if (!homeLoopVideo) return;
  parkNode(homeLoopVideo);
  if (homeLoopVideo.parentElement !== document.body) document.body.appendChild(homeLoopVideo);
}

export function homeLoopSrc(): string {
  return homeLoopBlobUrl || ART.homeLoop;
}
