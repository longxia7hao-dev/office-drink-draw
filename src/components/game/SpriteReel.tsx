import { useEffect, useRef } from "react";
import { isLiteMode } from "@/game/odd";

export function SpriteReel({
  src,
  frames,
  cols,
  fps = 4,
  mode = "once",
  playing = true,
  className,
  onEnded,
}: {
  src: string;
  frames: number;
  cols: number;
  fps?: number;
  mode?: "once" | "pingpong";
  playing?: boolean;
  className?: string;
  onEnded?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ended = useRef(onEnded);
  ended.current = onEnded;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!playing || frames < 2 || isLiteMode()) {
      if (playing && (isLiteMode() || frames < 2)) ended.current?.();
      return;
    }
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    let alive = true;
    let raf = 0;
    let i = 0;
    let dir = 1;
    let last = 0;
    const step = 1000 / Math.min(12, Math.max(3, fps));

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (!alive) return;
      const fw = img.naturalWidth / cols;
      const rows = Math.ceil(frames / cols);
      const fh = img.naturalHeight / rows;
      canvas.width = fw;
      canvas.height = fh;

      const blit = (idx: number) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        ctx.drawImage(img, c * fw, r * fh, fw, fh, 0, 0, fw, fh);
      };
      blit(0);

      const tick = (now: number) => {
        if (!alive) return;
        if (!last) last = now;
        if (now - last >= step) {
          last = now;
          if (mode === "pingpong") {
            i += dir;
            if (i >= frames - 1) {
              i = frames - 1;
              dir = -1;
            } else if (i <= 0) {
              i = 0;
              dir = 1;
            }
          } else if (i >= frames - 1) {
            ended.current?.();
            return;
          } else {
            i += 1;
          }
          blit(i);
        }
        raf = window.requestAnimationFrame(tick);
      };
      raf = window.requestAnimationFrame(tick);
    };
    img.src = src;

    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
    };
  }, [src, frames, cols, fps, mode, playing]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
