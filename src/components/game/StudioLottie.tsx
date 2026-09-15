import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web";

export function StudioLottie({
  src,
  className,
  onEnded,
  onProgress,
  onReady,
}: {
  src: string;
  className?: string;
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
      loop: false,
      autoplay: true,
      path: src,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        clearCanvas: true,
      },
    });
    const onFrame = () => {
      const total = anim.totalFrames || 90;
      const cur = Math.min(total, Math.max(0, anim.currentFrame));
      progress.current?.((cur / total) * 100);
    };
    const onDone = () => {
      progress.current?.(100);
      ended.current?.();
    };
    anim.addEventListener("DOMLoaded", () => ready.current?.());
    anim.addEventListener("data_ready", () => ready.current?.());
    anim.addEventListener("enterFrame", onFrame);
    anim.addEventListener("complete", onDone);
    return () => {
      anim.removeEventListener("enterFrame", onFrame);
      anim.removeEventListener("complete", onDone);
      anim.destroy();
    };
  }, [src]);

  return <div ref={box} className={className} aria-hidden="true" />;
}
