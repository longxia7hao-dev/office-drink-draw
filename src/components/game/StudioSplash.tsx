import { useEffect, useRef } from "react";
import { ART, STUDIO_FRAMES } from "@/game/art";
import { isLiteMode } from "@/game/odd";
import { warmupGame } from "@/game/preload";
import { bootBgm, unlockSfx } from "@/game/sfx";
import { AutoVideo } from "./AutoVideo";

export function StudioSplash({ onDone }: { onDone: () => void }) {
  const finished = useRef(false);

  useEffect(() => {
    void warmupGame();
    const t = window.setTimeout(() => finish(), isLiteMode() ? 0 : 8000);
    return () => window.clearTimeout(t);
  }, []);

  function finish() {
    if (finished.current) return;
    finished.current = true;
    try {
      unlockSfx();
      bootBgm();
    } finally {
      onDone();
    }
  }

  function skip(e: { stopPropagation: () => void }) {
    e.stopPropagation();
    unlockSfx();
    finish();
  }

  return (
    <div
      className="studio-splash"
      role="button"
      tabIndex={0}
      aria-label="跳過開場"
      onClick={skip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          skip(e);
        }
      }}
    >
      <div className="studio-reel-box">
        {isLiteMode() ? (
          <img className="studio-reel" src={STUDIO_FRAMES[0]} alt="" draggable={false} />
        ) : (
          <AutoVideo className="studio-reel" src={ART.studioIntro} poster={STUDIO_FRAMES[0]} onEnded={finish} />
        )}
      </div>
      <p className="studio-skip">點擊進入 · 五告哞聊工作室</p>
    </div>
  );
}
