import { useEffect, useRef, useState } from "react";
import lottie, { type AnimationItem } from "lottie-web";
import { prefetchLottie } from "@/game/preload";

export function StudioLottie({
  src,
  className,
  loop = false,
  onEnded,
  onProgress,
  onReady,
}: {
  src: string;
  className?: string;
  loop?: boolean;
  onEnded?: () => void;
  onProgress?: (pct: number) => void;
  onReady?: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const ended = useRef(onEnded);
  const progress = useRef(onProgress);
  const ready = useRef(onReady);
  ended.current = onEnded;
  progress.current = onProgress;
  ready.current = onReady;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let anim: AnimationItem | null = null;
    let dead = false;
    let started = false;

    const onFrame = () => {
      if (!anim || !progress.current) return;
      const total = anim.totalFrames || 1;
      const cur = Math.min(total, Math.max(0, anim.currentFrame));
      progress.current((cur / total) * 100);
    };
    const onDone = () => {
      progress.current?.(100);
      ended.current?.();
    };

    const start = (data: unknown) => {
      if (dead || !el) return;
      started = true;
      anim = lottie.loadAnimation({
        container: el,
        renderer: "canvas",
        loop,
        autoplay: true,
        animationData: data,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          clearCanvas: true,
        },
      });
      anim.addEventListener("DOMLoaded", () => {
        anim?.resize();
        anim?.play();
        ready.current?.();
      });
      if (progress.current) anim.addEventListener("enterFrame", onFrame);
      if (!loop) anim.addEventListener("complete", onDone);
    };

    const fail = () => {
      if (!dead && !started) ended.current?.();
    };

    prefetchLottie(src)
      .then((data) => {
        if (data) start(data);
        else fail();
      })
      .catch(fail);

    const watchdog = window.setTimeout(fail, 4000);

    return () => {
      dead = true;
      window.clearTimeout(watchdog);
      if (anim) {
        anim.removeEventListener("enterFrame", onFrame);
        anim.removeEventListener("complete", onDone);
        anim.destroy();
      }
    };
  }, [src, loop]);

  return <div ref={box} className={className} aria-hidden="true" />;
}

function bobAnimation(src: string, size = 800) {
  const c = size / 2;
  const ease = { i: { x: [0.67], y: [1] }, o: { x: [0.33], y: [0] } };
  return {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 90,
    w: size,
    h: size,
    nm: "logo-bob",
    ddd: 0,
    assets: [{ id: "logo", w: size, h: size, u: "", p: src, e: 1 }],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 2,
        nm: "logo",
        refId: "logo",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: {
            a: 1,
            k: [
              { t: 0, s: [c, c + 10, 0], ...ease },
              { t: 45, s: [c, c - 10, 0], ...ease },
              { t: 90, s: [c, c + 10, 0] },
            ],
          },
          a: { a: 0, k: [c, c, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        ip: 0,
        op: 90,
        st: 0,
        bm: 0,
      },
    ],
  };
}

/** Lottie bob: logo floats a few pixels up and down. Falls back to a CSS bob. */
export function ModeLogoBob({ src, className }: { src: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [fail, setFail] = useState(false);

  useEffect(() => {
    if (fail) return;
    const el = box.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setFail(true);
      return;
    }
    let anim: AnimationItem | null = null;
    try {
      anim = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: bobAnimation(src),
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
    } catch {
      setFail(true);
      return;
    }
    return () => {
      anim?.destroy();
    };
  }, [src, fail]);

  if (fail) {
    return <img className={`${className ?? ""} mode-logo-fallback`} src={src} alt="" draggable={false} />;
  }
  return <div ref={box} className={className} aria-hidden="true" />;
}
