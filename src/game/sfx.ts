import { asset } from "./art";
import { hasInteracted, markInteracted } from "./odd";

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!hasInteracted() || readMuted()) return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function unlockSfx(): void {
  markInteracted();
  try {
    ac();
    startBgm();
  } catch {
    /* WebView / iframe may block AudioContext */
  }
}

const MUTE_KEY = "odd-mute";
const TRACKS = {
  main: asset("/audio/palm-shadow-drive.mp3"),
  flip: asset("/audio/apex-pursuit.mp3"),
} as const;
export type BgmTrack = keyof typeof TRACKS;

let players: Partial<Record<BgmTrack, HTMLAudioElement>> = {};
let muted = readMuted();
let bgmHooked = false;
let currentTrack: BgmTrack = "main";

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function makePlayer(track: BgmTrack): HTMLAudioElement {
  const a = new Audio();
  a.loop = true;
  a.preload = "none";
  a.autoplay = false;
  a.volume = track === "flip" ? 0.42 : 0.36;
  a.muted = muted;
  a.setAttribute("playsinline", "true");
  a.setAttribute("aria-hidden", "true");
  a.style.display = "none";
  document.body.appendChild(a);
  return a;
}

function getPlayer(track: BgmTrack): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!hasInteracted() || muted) return null;
  if (!bgmHooked) {
    bgmHooked = true;
    document.addEventListener("visibilitychange", () => {
      const a = players[currentTrack];
      if (!a || muted) return;
      if (document.hidden) a.pause();
      else void a.play().catch(() => {});
    });
    const kick = () => unlockSfx();
    window.addEventListener("pointerdown", kick, { capture: true, once: true });
    window.addEventListener("touchstart", kick, { capture: true, once: true, passive: true });
    window.addEventListener("keydown", kick, { capture: true, once: true });
  }
  if (!players[track]) players[track] = makePlayer(track);
  return players[track] ?? null;
}

export function setBgmTrack(track: BgmTrack): void {
  if (currentTrack === track && players[track]) {
    startBgm();
    return;
  }
  const prev = players[currentTrack];
  if (prev) {
    prev.pause();
    prev.currentTime = 0;
  }
  currentTrack = track;
  startBgm();
}

export function startBgm(): void {
  if (!hasInteracted()) return;
  const a = getPlayer(currentTrack);
  if (!a) return;
  if (!a.getAttribute("src") && !muted) a.src = TRACKS[currentTrack];
  a.muted = muted;
  if (muted) {
    a.pause();
    return;
  }
  const play = () => {
    void a.play().catch(() => {});
  };
  play();
  a.addEventListener("canplay", play, { once: true });
}

export function warmupBgm(): void {
  /* Don't prefetch audio until the user taps — saves mobile data. */
}

export function bootBgm(): void {
  try {
    muted = localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    muted = false;
  }
  try {
    if (!muted) localStorage.removeItem(MUTE_KEY);
  } catch {
    /* ignore */
  }
  startBgm();
}

let sting: HTMLAudioElement | null = null;

function getSting(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!hasInteracted() || muted) return null;
  if (!sting) {
    sting = new Audio(asset("/audio/studio-meow.mp3"));
    sting.preload = "auto";
    sting.loop = false;
    sting.volume = 0.9;
    sting.setAttribute("playsinline", "true");
  }
  return sting;
}

export function warmupStudioSting(): void {
  /* sting loads on first tap */
}

export function playStudioSting(): void {
  if (!hasInteracted()) return;
  const a = getSting();
  if (!a || muted) return;
  a.muted = false;
  if (!a.paused && a.currentTime > 0.05) return;
  a.currentTime = a.paused && a.currentTime > 0.05 ? a.currentTime : 0;
  void a.play().catch(() => {});
}

export function stopStudioSting(): void {
  if (!sting) return;
  sting.pause();
  sting.currentTime = 0;
}

export function isBgmMuted(): boolean {
  return muted;
}

export function toggleBgmMute(): boolean {
  muted = !isBgmMuted();
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
  for (const a of Object.values(players)) {
    if (a) a.muted = muted;
  }
  if (muted) {
    for (const track of Object.values(players)) {
      if (!track) continue;
      track.pause();
      track.removeAttribute("src");
      try {
        track.load();
      } catch {
        /* ignore */
      }
    }
  } else {
    startBgm();
  }
  return muted;
}

function beep(freq: number, dur: number, type: OscillatorType, vol: number, slide = 0) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export function sfxTick(): void {
  beep(420 + Math.random() * 80, 0.05, "square", 0.05);
}

export function sfxTalk(): void {
  beep(280, 0.07, "square", 0.05, 40);
  beep(420, 0.09, "triangle", 0.045, 80);
}

export function sfxSpray(): void {
  beep(180, 0.18, "sawtooth", 0.07, 220);
  beep(900, 0.12, "triangle", 0.04, -400);
}

export function sfxSlam(): void {
  beep(90, 0.22, "sine", 0.16, -40);
  beep(240, 0.12, "square", 0.06);
}

export function sfxFlip(): void {
  beep(520, 0.1, "triangle", 0.07, 180);
}

export function sfxDrink(): void {
  beep(220, 0.16, "sine", 0.1, 80);
  beep(330, 0.2, "triangle", 0.06);
}

export function sfxSpin(): void {
  beep(160, 0.08, "sawtooth", 0.05, 80);
}

export function sfxWin(): void {
  beep(523, 0.12, "square", 0.08);
  beep(659, 0.14, "square", 0.07);
  beep(784, 0.2, "square", 0.07);
}

export function vibrate(ms = 28): void {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* ignore */
  }
}
