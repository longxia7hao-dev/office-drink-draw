import { useEffect, useRef, useState } from "react";

export function AutoVideo({
  src,
  poster,
  className,
  loop = false,
  onEnded,
  onBuffered,
  onProgress,
}: {
  src: string;
  poster?: string;
  className?: string;
  loop?: boolean;
  onEnded?: () => void;
  onBuffered?: () => void;
  onProgress?: (pct: number) => void;
}) {
  const vRef = useRef<HTMLVideoElement>(null);
  const ended = useRef(onEnded);
  ended.current = onEnded;
  const buffered = useRef(onBuffered);
  buffered.current = onBuffered;
  const progress = useRef(onProgress);
  progress.current = onProgress;
  const [on, setOn] = useState(false);

  useEffect(() => {
    const v = vRef.current;
    if (!v) return;
    let alive = true;
    const arm = () => {
      v.muted = true;
      v.defaultMuted = true;
      v.volume = 0;
      v.autoplay = true;
      v.playsInline = true;
      v.controls = false;
      v.disablePictureInPicture = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "true");
      v.setAttribute("webkit-playsinline", "true");
      v.setAttribute("x-webkit-airplay", "deny");
    };
    arm();
    if (v.getAttribute("src") !== src) {
      v.src = src;
      v.load();
    }

    const go = () => {
      if (!alive) return;
      setOn(true);
    };
    const kick = () => {
      if (!alive) return;
      arm();
      if (!v.paused && !v.ended) {
        go();
        return;
      }
      const p = v.play();
      if (p) void p.then(go).catch(() => {});
    };
    const onEnd = () => {
      if (!loop) ended.current?.();
    };
    const onThrough = () => buffered.current?.();
    const onTime = () => {
      if (v.duration > 0) progress.current?.(Math.min(100, (v.currentTime / v.duration) * 100));
    };

    v.addEventListener("playing", go);
    v.addEventListener("canplay", kick);
    v.addEventListener("canplaythrough", onThrough);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    document.addEventListener("pointerdown", kick, true);
    document.addEventListener("touchstart", kick, { capture: true, passive: true });
    kick();
    const poll = window.setInterval(kick, 350);

    return () => {
      alive = false;
      window.clearInterval(poll);
      v.removeEventListener("playing", go);
      v.removeEventListener("canplay", kick);
      v.removeEventListener("canplaythrough", onThrough);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
      document.removeEventListener("pointerdown", kick, true);
      document.removeEventListener("touchstart", kick, true);
      v.pause();
    };
  }, [src, loop]);

  return (
    <span className="silent-video">
      <video
        ref={vRef}
        className={`${className ?? ""} ${on ? "is-on" : ""}`}
        poster={poster}
        muted
        playsInline
        autoPlay
        loop={loop}
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
      />
    </span>
  );
}
