import { useEffect, useRef, useState } from "react";
import { ART, STUDIO_FRAMES } from "@/game/art";
import { isLiteMode } from "@/game/odd";
import { warmupGame, warmupSplash } from "@/game/preload";
import { bootBgm, primeBgm, unlockSfx } from "@/game/sfx";
import { StudioLottie } from "./StudioLottie";

const LOGO_MS = 5600;
const HEAR_MS = 1100;

if (typeof window !== "undefined") void warmupSplash();

export function StudioSplash({ onDone }: { onDone: () => void }) {
  const finished = useRef(false);
  const warmed = useRef(false);
  const [pct, setPct] = useState(0);
  const [needTap, setNeedTap] = useState(false);

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
    void bootBgm().then((playing) => {
      if (playing) {
        window.setTimeout(() => onDone(), HEAR_MS);
        return;
      }
      setNeedTap(true);
    });
  }

  useEffect(() => {
    if (!needTap) return;
    const go = () => {
      unlockSfx();
      window.setTimeout(() => onDone(), 500);
    };
    window.addEventListener("pointerdown", go, true);
    return () => window.removeEventListener("pointerdown", go, true);
  }, [needTap, onDone]);

  useEffect(() => {
    primeBgm();
    void warmupSplash();
    warmRest();
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min(100, ((performance.now() - t0) / LOGO_MS) * 100);
      setPct(p);
      if (p >= 100) finish();
      else raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  function arm(e: { stopPropagation: () => void; preventDefault?: () => void }) {
    e.stopPropagation();
    unlockSfx();
  }

  return (
    <div
      className="studio-splash"
      role="presentation"
      onPointerDown={arm}
    >
      <div className="studio-reel-box">
        {isLiteMode() ? (
          <img className="studio-reel" src={STUDIO_FRAMES[0]} alt="" draggable={false} />
        ) : (
          <StudioLottie className="studio-reel" src={ART.studioSting} loop onReady={warmRest} />
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
      {needTap ? <p className="studio-tap">點擊開始遊戲</p> : null}
    </div>
  );
}