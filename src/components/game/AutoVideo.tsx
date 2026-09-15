import { useEffect, useRef, useState } from "react";

export function AutoVideo({
  src,
  poster,
  className,
  loop = false,
  onEnded,
  onBuffered,
}: {
  src: string;
  poster?: string;
  className?: string;
  loop?: boolean;
  onEnded?: () => void;
  /** 影片已經緩衝到可以一路播完，適合在這時才去載其他素材。 */
  onBuffered?: () => void;
}) {
  const vRef = useRef<HTMLVideoElement>(null);
  const ended = useRef(onEnded);
  ended.current = onEnded;
  const buffered = useRef(onBuffered);
  buffered.current = onBuffered;
  const [cover, setCover] = useState(Boolean(poster));

  useEffect(() => {
    const v = vRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.volume = 0;
    v.playsInline = true;
    v.controls = false;
    v.disablePictureInPicture = true;
    v.setAttribute("playsinline", "true");
    v.setAttribute("webkit-playsinline", "true");
    v.setAttribute("muted", "");

    let kicked = false;
    let alive = true;
    const go = () => setCover(false);
    const onPlaying = () => {
      kicked = true;
      go();
    };
    const kick = () => {
      if (!alive || kicked) return;
      if (!v.paused) {
        kicked = true;
        go();
        return;
      }
      v.muted = true;
      const p = v.play();
      if (!p) return;
      void p.then(onPlaying).catch(() => {
        if (!alive || kicked) return;
        window.setTimeout(kick, 180);
      });
    };
    const onEnd = () => {
      if (!loop) ended.current?.();
    };
    const onThrough = () => buffered.current?.();

    v.addEventListener("playing", onPlaying);
    v.addEventListener("canplay", kick);
    v.addEventListener("canplaythrough", onThrough);
    v.addEventListener("ended", onEnd);
    kick();

    return () => {
      alive = false;
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("canplay", kick);
      v.removeEventListener("canplaythrough", onThrough);
      v.removeEventListener("ended", onEnd);
      v.pause();
    };
  }, [src, loop]);

  return (
    <span className="silent-video">
      <video
        ref={vRef}
        className={className}
        src={src}
        poster={poster}
        muted
        playsInline
        autoPlay
        loop={loop}
        preload="auto"
        controls={false}
        disablePictureInPicture
      />
      {cover && poster ? <img className={`${className ?? ""} silent-cover`} src={poster} alt="" draggable={false} /> : null}
    </span>
  );
}
