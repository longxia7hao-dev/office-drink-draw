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

let started: Promise<void> | null = null;

export function warmupGame(): Promise<void> {
  if (started) return started;
  started = (async () => {
    warmupBgm();
    warmupStudioSting();
    await Promise.all([
      loadImage(ART.homePoster),
      loadImage(STUDIO_FRAMES[0]!),
      document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve(),
    ]);
    void Promise.all([
      ...Object.values(ROLE_ART).map(loadImage),
      loadImage(ART.logo),
    ]);
    const v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.src = ART.studioIntro;
    const h = document.createElement("video");
    h.preload = "auto";
    h.muted = true;
    h.playsInline = true;
    h.src = ART.homeLoop;
  })();
  return started;
}
