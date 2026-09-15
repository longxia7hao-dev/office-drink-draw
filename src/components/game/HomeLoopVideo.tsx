import { useEffect, useRef, useState } from "react";
import { ART } from "@/game/art";
import { parkHomeLoopVideo, peekHomeLoopVideo } from "@/game/preload";
import { AutoVideo } from "./AutoVideo";

/** 把開場已解碼好的沙發 video 直接搬進主選單，不再重新載一次。 */
export function HomeLoopVideo() {
  const box = useRef<HTMLSpanElement>(null);
  const [fallback, setFallback] = useState(() => !peekHomeLoopVideo());

  useEffect(() => {
    const slot = box.current;
    const v = peekHomeLoopVideo();
    if (!slot || !v) {
      setFallback(true);
      return;
    }
    v.className = "home-party-vid is-on";
    v.removeAttribute("style");
    slot.appendChild(v);
    v.muted = true;
    v.loop = true;
    void v.play().catch(() => {});
    return () => parkHomeLoopVideo();
  }, []);

  if (fallback) return <AutoVideo className="home-party-vid" src={ART.homeLoop} loop />;
  return <span ref={box} className="silent-video" />;
}
