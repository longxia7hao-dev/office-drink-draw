import { useEffect, useRef, useState } from "react";
import { ART, STUDIO_FRAMES } from "@/game/art";
import { isLiteMode } from "@/game/odd";
import { warmupGame, warmupSplash } from "@/game/preload";
import { bootBgm, unlockSfx } from "@/game/sfx";
import { AutoVideo } from "./AutoVideo";

export function StudioSplash({ onDone }: { onDone: () => void }) {
  const finished = useRef(false);
  const warmed = useRef(false);
  const [pct, setPct] = useState(0);

  function warmRest() {
    if (warmed.current) return;
    warmed.current = true;
    void warmupGame();
  }

  useEffect(() => {
    void warmupSplash();
    if (isLiteMode()) {
      warmRest();
      const t = window.setTimeout(() => finish(), 0);
      return () => window.clearTimeout(t);
    }
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
    setPct(100);
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
            onProgress={setPct}
            onEnded={finish}
          />
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
        <img
          className="studio-load-cat"
          src={ART.loadCat}
          alt=""
          draggable={false}
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}
