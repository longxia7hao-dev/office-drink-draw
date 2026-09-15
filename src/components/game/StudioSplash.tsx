import { useEffect, useRef, useState } from "react";
import { ART, STUDIO_FRAMES } from "@/game/art";
import { isLiteMode } from "@/game/odd";
import { prefetchHomeLoop, warmupGame, warmupSplash } from "@/game/preload";
import { bootBgm, unlockSfx } from "@/game/sfx";
import { StudioLottie } from "./StudioLottie";

export function StudioSplash({ onDone }: { onDone: () => void }) {
  const finished = useRef(false);
  const warmed = useRef(false);
  const [pct, setPct] = useState(0);

  function warmRest() {
    if (warmed.current) return;
    warmed.current = true;
    void warmupGame();
  }

  function finish() {
    if (finished.current) return;
    finished.current = true;
    setPct(100);
    warmRest();
    try {
      unlockSfx();
      bootBgm();
    } finally {
      onDone();
    }
  }

  useEffect(() => {
    void warmupSplash();
    warmRest();
    if (isLiteMode()) {
      const t = window.setTimeout(() => finish(), 0);
      return () => window.clearTimeout(t);
    }
    let hold = 0;
    void prefetchHomeLoop((p) => {
      if (finished.current) return;
      setPct(p);
      if (p >= 100) {
        hold = window.setTimeout(() => finish(), 280);
      }
    });
    return () => window.clearTimeout(hold);
  }, []);

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
          <StudioLottie className="studio-reel" src={ART.studioSting} onReady={warmRest} />
        )}
      </div>
      <div
        className="studio-load"
        role="progressbar"
        aria-label="開場進度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <i style={{ width: `${pct}%` }} />
        <div className="studio-load-cat" style={{ left: `${pct}%` }}>
          <StudioLottie className="studio-load-walk" src={ART.catWalk} loop />
        </div>
      </div>
    </div>
  );
}
