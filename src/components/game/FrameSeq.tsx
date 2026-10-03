import { useEffect, useRef } from "react";
import { isLiteMode } from "@/game/odd";

export function FrameSeq({
  frames,
  fps = 8,
  mode = "once",
  playing = true,
  className,
  alt = "",
  onEnded,
}: {
  frames: string[];
  fps?: number;
  mode?: "once" | "pingpong";
  playing?: boolean;
  className?: string;
  alt?: string;
  onEnded?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const ended = useRef(onEnded);
  ended.current = onEnded;

  useEffect(() => {
    if (!playing || frames.length < 2 || isLiteMode()) {
      if (playing && (isLiteMode() || frames.length < 2)) ended.current?.();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    let alive = true;
    let raf = 0;
    let i = 0;
    let dir = 1;
    let last = 0;
    const step = 1000 / Math.min(10, Math.max(3, fps));
    const bitmaps: (HTMLImageElement | undefined)[] = new Array(frames.length);

    const draw = (im: HTMLImageElement) => {
      if (canvas.width !== im.naturalWidth || canvas.height !== im.naturalHeight) {
        canvas.width = im.naturalWidth;
        canvas.height = im.naturalHeight;
      }
      ctx.drawImage(im, 0, 0);
    };

    const tick = (now: number) => {
      if (!alive) return;
      if (!last) last = now;
      if (now - last >= step) {
        last = now;
        if (mode === "pingpong") {
          i += dir;
          if (i >= frames.length - 1) {
            i = frames.length - 1;
            dir = -1;
          } else if (i <= 0) {
            i = 0;
            dir = 1;
          }
        } else if (i >= frames.length - 1) {
          ended.current?.();
          return;
        } else {
          i += 1;
        }
        let im = bitmaps[i];
        if (!im) {
          for (let k = i; k >= 0; k--) {
            if (bitmaps[k]) {
              im = bitmaps[k];
              break;
            }
          }
        }
        if (im) draw(im);
      }
      raf = window.requestAnimationFrame(tick);
    };

    frames.forEach((src, idx) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        if (!alive) return;
        bitmaps[idx] = im;
        if (idx === 0) {
          draw(im);
          if (imgRef.current) imgRef.current.style.visibility = "hidden";
          raf = window.requestAnimationFrame(tick);
        }
      };
      im.src = src;
    });

    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
    };
  }, [frames, fps, mode, playing]);

  return (
    <span className="frame-seq">
      <img ref={imgRef} className={className} src={frames[0]} alt={alt} draggable={false} />
      <canvas ref={canvasRef} className={className} aria-hidden="true" />
    </span>
  );
}
