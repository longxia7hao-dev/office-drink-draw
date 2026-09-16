import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";

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

    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error("lottie fetch");
        return r.json();
      })
      .then(start)
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
