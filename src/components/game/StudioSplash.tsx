import { useEffect, useRef } from "react";
import { ART, STUDIO_FRAMES } from "@/game/art";
import { isLiteMode } from "@/game/odd";
import { warmupGame, warmupSplash } from "@/game/preload";
import { bootBgm, unlockSfx } from "@/game/sfx";
import { AutoVideo } from "./AutoVideo";

export function StudioSplash({ onDone }: { onDone: () => void }) {
  const finished = useRef(false);
  const warmed = useRef(false);

  /** 其餘素材等開場影片不再需要頻寬了才載，避免播放中被搶資源。 */
  function warmRest() {
    if (warmed.current) return;
    warmed.current = true;
    void warmupGame();
  }

  useEffect(() => {
    void warmupSplash();
    if (isLiteMode()) {
      // 精簡模式不播影片，沒有搶資源的問題，直接開始預載。
      warmRest();
      const t = window.setTimeout(() => finish(), 0);
      return () => window.clearTimeout(t);
    }
    // 保險：萬一 canplaythrough 沒觸發，播到後段也要開始預載。
    const warmFallback = window.setTimeout(warmRest, 4500);
    const t = window.setTimeout(() => finish(), 8000);
    return () => {
      window.clearTimeout(warmFallback);
      window.clearTimeout(t);
    };
  }, []);

  function finish() {
    if (finished.current) return;
    finished.current = true;
    warmRest();
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
          <AutoVideo
            className="studio-reel"
            src={ART.studioIntro}
            poster={STUDIO_FRAMES[0]}
            onBuffered={warmRest}
            onEnded={finish}
          />
        )}
      </div>
      <p className="studio-skip">點擊進入 · 五告哞聊工作室</p>
    </div>
  );
}
