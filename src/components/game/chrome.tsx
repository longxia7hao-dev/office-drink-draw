import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import {
  Briefcase,
  Calculator,
  ClipboardList,
  Crown,
  GraduationCap,
  Handshake,
  Laptop,
  Timer,
  User,
  Volume2,
  VolumeX,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { RoleIconId } from "@/game/roles";
import { isBgmMuted, toggleBgmMute } from "@/game/sfx";
import { cn } from "@/lib/utils";

export function WallBg() {
  return <div className="wall-bg" aria-hidden="true" />;
}

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("screen", className)}>{children}</div>;
}

/** Fire on press (pointerdown) and click, ignoring the duplicate. Survives iOS scroll-cancel. */
export function usePress(fn: () => void) {
  const last = useRef(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const run = useCallback(() => {
    const now = Date.now();
    if (now - last.current < 400) return;
    last.current = now;
    fnRef.current();
  }, []);
  return {
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (e.pointerType === "mouse" && e.button !== 0) return;
      run();
    },
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      run();
    },
  };
}

export function MusicToggle({ className }: { className?: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    setOn(!isBgmMuted());
  }, []);
  const press = usePress(() => {
    const nowMuted = toggleBgmMute();
    setOn(!nowMuted);
  });
  return (
    <button
      className={cn("music-fab", className)}
      type="button"
      {...press}
      aria-label={on ? "關閉音樂" : "開啟音樂"}
      title={on ? "音樂開" : "音樂關"}
    >
      {on ? <Volume2 size={20} strokeWidth={2.6} /> : <VolumeX size={20} strokeWidth={2.6} />}
    </button>
  );
}

export function TopFabs({ onSettings }: { onSettings: () => void }) {
  const pressSet = usePress(onSettings);
  return (
    <div className="top-fabs">
      <MusicToggle />
      <button
        className="music-fab"
        type="button"
        {...pressSet}
        aria-label="設定"
        title="設定"
      >
        <Settings size={20} strokeWidth={2.6} />
      </button>
    </div>
  );
}

const ROLE_ICONS: Record<RoleIconId, LucideIcon> = {
  manager: Briefcase,
  worker: User,
  ceo: Crown,
  intern: GraduationCap,
  sales: Handshake,
  hr: ClipboardList,
  accountant: Calculator,
  engineer: Laptop,
  overtime: Timer,
};

export function RoleIcon({ id, size = 28, color }: { id: RoleIconId; size?: number; color?: string }) {
  const Icon = ROLE_ICONS[id] ?? User;
  return <Icon size={size} color={color} strokeWidth={2.2} aria-hidden />;
}

export function Boombox() {
  return (
    <svg className="boombox" viewBox="0 0 96 96" aria-hidden>
      <rect x="8" y="28" width="80" height="52" rx="8" fill="#1a1210" stroke="#000" strokeWidth="4" />
      <rect x="14" y="14" width="8" height="20" rx="2" fill="#ffd700" stroke="#000" strokeWidth="3" />
      <rect x="74" y="14" width="8" height="20" rx="2" fill="#ffd700" stroke="#000" strokeWidth="3" />
      <circle cx="30" cy="54" r="14" fill="#111" stroke="#00f0ff" strokeWidth="3" />
      <circle cx="30" cy="54" r="6" fill="#ff2d95" />
      <circle cx="66" cy="54" r="14" fill="#111" stroke="#b8ff00" strokeWidth="3" />
      <circle cx="66" cy="54" r="6" fill="#ffd700" />
      <rect x="44" y="42" width="8" height="24" rx="2" fill="#fff200" stroke="#000" strokeWidth="2" />
    </svg>
  );
}

const SPRAY_COLORS = ["#ff2d95", "#00f0ff", "#b8ff00", "#ffd700", "#ff6b1a"];

export function SprayBurst({ burstKey }: { burstKey: number }) {
  const [dots, setDots] = useState<{ id: number; x: number; y: number; c: string; dx: number; dy: number; rot: number }[]>(
    [],
  );

  useEffect(() => {
    if (!burstKey) return;
    const next = Array.from({ length: 14 }, (_, i) => ({
      id: burstKey * 100 + i,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 50,
      c: SPRAY_COLORS[i % SPRAY_COLORS.length]!,
      dx: (Math.random() - 0.5) * 160,
      dy: -80 - Math.random() * 120,
      rot: (Math.random() - 0.5) * 120,
    }));
    setDots(next);
    const t = window.setTimeout(() => setDots([]), 1200);
    return () => window.clearTimeout(t);
  }, [burstKey]);

  return (
    <div className="spray-burst" aria-hidden>
      {dots.map((d) => (
        <span
          key={d.id}
          style={
            {
              left: `${d.x}%`,
              top: `${d.y}%`,
              background: d.c,
              "--dx": `${d.dx}px`,
              "--dy": `${d.dy}px`,
              "--rot": `${d.rot}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function StreetMarks() {
  return (
    <div className="street-row" aria-hidden>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 14a4 4 0 0 1 4-4h1l2-5h2l1 5h2a4 4 0 0 1 0 8H8a4 4 0 0 1-4-4Z" />
      </svg>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v10" />
        <path d="M8 8h8" />
        <rect x="6" y="13" width="12" height="8" rx="2" />
      </svg>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12a9 9 0 1 0 18 0" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3" />
      </svg>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
      </svg>
    </div>
  );
}
