import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { ART, roleArt } from "@/game/art";
import { type RoleDef } from "@/game/roles";
import { heatOf, peekDrawOne } from "@/game/state";
import { WHEEL } from "@/game/party";
import { fillPunish } from "@/game/partyPlay";
import { sfxSlam, sfxSpray, sfxTick, unlockSfx, vibrate } from "@/game/sfx";
import { useGame } from "@/game/store";
import { cn } from "@/lib/utils";

export function Portrait({
  roleId,
  className,
  size = 56,
}: {
  roleId: string;
  className?: string;
  size?: number;
}) {
  return (
    <img
      src={roleArt(roleId)}
      alt=""
      draggable={false}
      width={size}
      height={size}
      className={cn("portrait", className)}
      style={size ? { width: size, height: size } : undefined}
    />
  );
}

function BottleIcon({ filled, color }: { filled: boolean; color: string }) {
  return (
    <svg className={`stat-bottle${filled ? " on" : ""}`} viewBox="0 0 18 32" width="16" height="28" aria-hidden>
      <path
        d="M7 1.4h4v3.2c2.2.9 3.6 3.2 3.6 6.2v15.6A3.4 3.4 0 0 1 11.2 30H6.8A3.4 3.4 0 0 1 3.4 26.4V10.8c0-3 1.4-5.3 3.6-6.2V1.4Z"
        fill={filled ? color : "#1a1210"}
        stroke="#000"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <rect x="6.4" y="0.6" width="5.2" height="3.2" rx="0.8" fill={filled ? color : "#2a2018"} stroke="#000" strokeWidth="1.4" />
      {filled ? <path d="M6.2 18h5.6v8.2c0 .7-.6 1.3-1.3 1.3H7.5c-.7 0-1.3-.6-1.3-1.3V18Z" fill="rgba(0,0,0,0.22)" /> : null}
    </svg>
  );
}

export function BottleMeter({
  value,
  color,
  label,
  hint,
}: {
  value: number;
  color: string;
  label: string;
  hint?: string;
}) {
  const n = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="stat-row">
      <div className="stat-copy">
        <span className="stat-label">{label}</span>
        {hint ? <span className="stat-hint">{hint}</span> : null}
      </div>
      <span className="stat-bottles" aria-label={`${label} ${n} 分，滿分 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <BottleIcon key={i} filled={i < n} color={color} />
        ))}
      </span>
    </div>
  );
}

export function RoleShowcase({
  role,
  index,
  total,
  onPrev,
  onNext,
  stamp,
  footer,
  speaking = false,
}: {
  role: RoleDef;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  stamp?: ReactNode;
  footer?: ReactNode;
  speaking?: boolean;
}) {
  const startX = useRef<number | null>(null);
  const punishLabel = useGame((s) => s.punishLabel);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    startX.current = e.clientX;
  }
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (dx > 48) onPrev();
    else if (dx < -48) onNext();
  }

  return (
    <article className={`role-hero${speaking ? " talking" : ""}`} style={{ ["--hero-color" as string]: role.color }}>
      {speaking ? <p className="hero-bubble">「{role.line}」</p> : null}
      <div
        className="hero-stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          startX.current = null;
        }}
      >
        <div className={`hero-art-wrap${speaking ? " talking" : ""}`} key={role.id}>
          <div className="hero-id">
            <h2 className="hero-name">{role.name}</h2>
            <div className="hero-tag">{role.tag}</div>
          </div>
          <Portrait roleId={role.id} size={320} className="hero-art idle" />
          {stamp}
          <div className="hero-pager">
            <button className="nav-arrow" type="button" onClick={onPrev} aria-label="上一個角色">
              <ChevronLeft size={22} strokeWidth={3} />
            </button>
            <span />
            <button className="nav-arrow" type="button" onClick={onNext} aria-label="下一個角色">
              <ChevronRight size={22} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
      <p className="hero-bio">{role.bio}</p>
      <div className="hero-skill">
        <span className="hero-skill-kicker">技能</span>
        <strong style={{ color: role.color }}>{role.skillName}</strong>
        <p>{fillPunish(role.skillDesc, punishLabel)}</p>
        <span className="hero-drink">{fillPunish(role.drink, punishLabel)}</span>
      </div>
      {footer}
    </article>
  );
}

export function FrameAnim({
  frames,
  fps = 6,
  className,
  alt = "",
}: {
  frames: string[];
  fps?: number;
  className?: string;
  alt?: string;
}) {
  const [i, setI] = useState(0);
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current || frames.length < 2) return;
    const interval = 1000 / fps;
    let last = performance.now();
    let idx = 0;
    let raf = 0;
    const loop = (now: number) => {
      if (now - last >= interval) {
        last = now;
        idx = (idx + 1) % frames.length;
        setI(idx);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [frames, fps]);
  const src = frames[i] ?? frames[0];
  if (!src) return null;
  return <img src={src} alt={alt} draggable={false} className={className} />;
}

export function DrinkHud() {
  const players = useGame((s) => s.players);
  const phase = useGame((s) => s.phase);
  const flip = useGame((s) => s.flip);
  const hit = useGame((s) => s.hitAmt);
  const heat = useGame((s) => heatOf(s));
  const minorityPunished =
    phase === "flip_battle" &&
    flip != null &&
    flip.sub === "result" &&
    !flip.tie &&
    flip.drinkerIds.length > 0;
  const punished = minorityPunished ? new Set(flip!.drinkerIds) : new Set(Object.keys(hit ?? {}).filter((id) => (hit ?? {})[id] > 0));
  const match = useGame((s) => s.match);
  const showPairs = phase === "match" && match && match.sub !== "size";
  if (players.length === 0) return null;
  if (phase === "home" || phase === "setup" || phase === "lobby" || phase === "pick_role") return null;
  return (
    <div className="drink-hud">
      <div className={`heat-pip heat-${heat}`}>
        <Flame size={14} />
        <span>熱度 {heat}</span>
      </div>
      <div className="hud-row">
        {players.map((p) => {
          const label = p.isBot ? p.name.replace(/^電腦[·・]/, "") : p.name;
          return (
          <div
            className={cn("hud-chip", punished?.has(p.id) && "is-minority-hit")}
            key={p.id}
          >
            <Portrait roleId={p.roleId} size={28} />
            <span className={cn("hud-name", p.isBot && "is-bot")}>{label}</span>
            <b className="hud-cups">{p.cups || 0}</b>
            {showPairs ? <em className="hud-pairs">{match.scores[p.id] ?? 0}對</em> : null}
            {hit?.[p.id] ? <i className="hud-hit">×{hit[p.id]}</i> : null}
            {(p.nextMult ?? 1) > 1 ? <em className="hud-buff">下次×{p.nextMult}</em> : null}
            {p.nextMult === 0 ? <em className="hud-buff">下次免</em> : null}
            {p.skipToken ? <em className="hud-buff">補休</em> : null}
            {p.oweCover ? <em className="hud-buff">要還</em> : null}
            {p.coverFor ? <em className="hud-buff">擋酒中</em> : null}
          </div>
          );
        })}
      </div>
    </div>
  );
}

export function RouletteDraw() {
  const players = useGame((s) => s.players);
  const finishDraw = useGame((s) => s.finishDraw);
  const isHost = useGame((s) => s.isHost);
  const isOnline = useGame((s) => s.isOnline);
  const winnerId = useMemo(() => peekDrawOne(useGame.getState()).playerId, []);
  const winnerIndex = Math.max(0, players.findIndex((p) => p.id === winnerId));
  const [idx, setIdx] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    unlockSfx();
    sfxSpray();
    if (players.length === 0) return;
    const start = performance.now();
    const total = 2300;
    let lastTick = 0;
    let i = 0;
    let raf = 0;
    let done = false;
    const loop = (now: number) => {
      if (done) return;
      const t = Math.min(1, (now - start) / total);
      const interval = 48 + t * t * 300;
      if (now - lastTick >= interval) {
        lastTick = now;
        i = t > 0.8 ? winnerIndex : (i + 1) % players.length;
        setIdx(i);
        sfxTick();
      }
      if (t < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        setIdx(winnerIndex);
        setLocked(true);
        sfxSlam();
        vibrate(40);
        window.setTimeout(() => {
          if (!(isOnline && !isHost)) finishDraw();
        }, 520);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => {
      done = true;
      cancelAnimationFrame(raf);
    };
  }, [players, winnerIndex, finishDraw, isHost, isOnline]);

  const current = players[idx];
  return (
    <div className="roulette">
      <FrameAnim frames={ART.spray} fps={7} className="spray-mascot" />
      <div className={`roulette-stage ${locked ? "locked" : ""}`}>
        {current ? <Portrait roleId={current.roleId} size={148} className="roulette-hero" /> : null}
      </div>
      <div className="reveal-name" style={{ fontSize: "1.8rem" }}>
        {locked ? current?.name : current?.name ?? "…"}
      </div>
      <p className="hint">{locked ? "中籤！" : "噴漆抽籤中…"}</p>
      <div className="roulette-row">
        {players.map((p, i) => (
          <button
            type="button"
            key={p.id}
            className={`roulette-pip ${i === idx ? "on" : ""}`}
            tabIndex={-1}
          >
            <Portrait roleId={p.roleId} size={40} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function SprayDraw() {
  const step = useGame((s) => s.ceremonyStep);
  const tickCeremony = useGame((s) => s.tickCeremony);
  const finishDraw = useGame((s) => s.finishDraw);
  const isHost = useGame((s) => s.isHost);
  const isOnline = useGame((s) => s.isOnline);
  const lines = ["搖罐中…", "噴漆上牆…", "揭開標籤！"];

  useEffect(() => {
    if (isOnline && !isHost) return;
    unlockSfx();
    sfxSpray();
    const start = performance.now();
    let last = 0;
    let raf = 0;
    let finished = false;
    const loop = (now: number) => {
      if (finished) return;
      if (now - start > last + 700) {
        last = now - start;
        if (tickCeremony()) {
          finished = true;
          finishDraw();
          return;
        }
        sfxTick();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      finished = true;
      cancelAnimationFrame(raf);
    };
  }, [isHost, isOnline, tickCeremony, finishDraw]);

  return (
    <div className="ceremony">
      <FrameAnim frames={ART.spray} fps={8} className="spray-mascot" />
      <div className="graffiti-title" style={{ fontSize: "1.8rem" }}>
        {lines[Math.min(step, lines.length - 1)]}
      </div>
      <p className="hint">街頭儀式進行中</p>
    </div>
  );
}

export function FateWheel({ spinning, angle, onDone }: { spinning: boolean; angle: number; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: TransitionEvent) => {
      if (e.propertyName === "transform" && spinning) onDone();
    };
    el.addEventListener("transitionend", handler);
    const fallback = window.setTimeout(() => {
      if (spinning) onDone();
    }, 3300);
    return () => {
      el.removeEventListener("transitionend", handler);
      window.clearTimeout(fallback);
    };
  }, [spinning, onDone]);

  const stops = WHEEL.map((seg, i) => {
    const a = (360 / WHEEL.length) * i;
    const b = (360 / WHEEL.length) * (i + 1);
    return `${seg.color} ${a}deg ${b}deg`;
  }).join(", ");

  return (
    <div className="wheel-wrap">
      <div className="wheel-pointer" aria-hidden />
      <div
        ref={ref}
        className={`wheel-disk ${spinning ? "spinning" : ""}`}
        style={{
          background: `conic-gradient(${stops})`,
          transform: `rotate(${angle}deg)`,
        }}
      />
    </div>
  );
}

export function CrewLine() {
  const ids = ["ceo", "manager", "intern", "sales", "overtime"] as const;
  return (
    <div className="crew-line" aria-hidden>
      {ids.map((id) => (
        <img key={id} src={roleArt(id)} alt="" className="crew-sticker" draggable={false} />
      ))}
    </div>
  );
}
