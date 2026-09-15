import { useEffect, useRef, useState } from "react";

export function AutoVideo({
  src,
  poster,
  className,
  loop = false,
  onEnded,
}: {
  src: string;
  poster?: string;
  className?: string;
  loop?: boolean;
  onEnded?: () => void;
}) {
  const vRef = useRef<HTMLVideoElement>(null);
  const ended = useRef(onEnded);
  ended.current = onEnded;
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

    const go = () => setCover(false);
    const kick = () => {
      v.muted = true;
      void v.play().then(go).catch(() => {});
    };
    const onEnd = () => {
      if (!loop) ended.current?.();
    };

    v.addEventListener("playing", go);
    v.addEventListener("canplay", kick);
    v.addEventListener("ended", onEnd);
    kick();

    return () => {
      v.removeEventListener("playing", go);
      v.removeEventListener("canplay", kick);
      v.removeEventListener("ended", onEnd);
      v.pause();
      v.removeAttribute("src");
      v.load();
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
