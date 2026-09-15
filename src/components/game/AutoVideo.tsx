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
    const go = () => setCover(false);
    const kick = () => {
      // canplay 會重複觸發（緩衝、seek），只在第一次真的去 play()，
      // 免得播放中又被重新起手而抖動。
      if (kicked) return;
      kicked = true;
      v.muted = true;
      void v.play().then(go).catch(() => {
        // 這次沒播成就讓下一個 canplay 再試一次
        kicked = false;
      });
    };
    const onEnd = () => {
      if (!loop) ended.current?.();
    };
    const onThrough = () => buffered.current?.();

    v.addEventListener("playing", go);
    v.addEventListener("canplay", kick);
    v.addEventListener("canplaythrough", onThrough);
    v.addEventListener("ended", onEnd);
    kick();

    return () => {
      v.removeEventListener("playing", go);
      v.removeEventListener("canplay", kick);
      v.removeEventListener("canplaythrough", onThrough);
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
