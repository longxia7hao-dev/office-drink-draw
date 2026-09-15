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
    const anim: AnimationItem = lottie.loadAnimation({
      container: el,
      renderer: "canvas",
      loop,
      autoplay: true,
      path: src,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        clearCanvas: true,
      },
    });
    const onFrame = () => {
      if (!progress.current) return;
      const total = anim.totalFrames || 1;
      const cur = Math.min(total, Math.max(0, anim.currentFrame));
      progress.current((cur / total) * 100);
    };
    const onDone = () => {
      progress.current?.(100);
      ended.current?.();
    };
    anim.addEventListener("DOMLoaded", () => ready.current?.());
    anim.addEventListener("data_ready", () => ready.current?.());
    if (progress.current) anim.addEventListener("enterFrame", onFrame);
    if (!loop) anim.addEventListener("complete", onDone);
    return () => {
      anim.removeEventListener("enterFrame", onFrame);
      anim.removeEventListener("complete", onDone);
      anim.destroy();
    };
  }, [src, loop]);

  return <div ref={box} className={className} aria-hidden="true" />;
}
