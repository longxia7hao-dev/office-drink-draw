/** 狼人殺法官語音。每台裝置自己播，不進同步狀態。 */

export type JudgeClip =
  | "confirm"
  | "night"
  | "wolf-open"
  | "wolf-close"
  | "seer-open"
  | "seer-ask"
  | "seer-close"
  | "witch-open"
  | "witch-close"
  | "dawn"
  | "wolf-dead"
  | "knight-duel"
  | "knight-dead"
  | "hunter-open"
  | "hunter-ask"
  | "hunter-close";

export const JUDGE_FILE: Record<JudgeClip, string> = {
  confirm: "/art/wolf/confirm.mp4",
  night: "/art/wolf/night.mp4",
  "wolf-open": "/art/wolf/wolf-open.mp4",
  "wolf-close": "/art/wolf/wolf-close.mp4",
  "seer-open": "/art/wolf/seer-open.mp4",
  "seer-ask": "/art/wolf/seer-ask.mp4",
  "seer-close": "/art/wolf/seer-close.mp4",
  "witch-open": "/art/wolf/witch-open.mp4",
  "witch-close": "/art/wolf/witch-close.mp4",
  dawn: "/art/wolf/dawn.mp4",
  "wolf-dead": "/art/wolf/wolf-dead.mp4",
  "knight-duel": "/art/wolf/knight-duel.mp4",
  "knight-dead": "/art/wolf/knight-dead.mp4",
  "hunter-open": "/art/wolf/hunter-open.mp4",
  "hunter-ask": "/art/wolf/hunter-ask.mp4",
  "hunter-close": "/art/wolf/hunter-close.mp4",
};

export type JudgeSnap = {
  sub: "card" | "night" | "dawn" | "speak" | "vote" | "hunter" | "end";
  step: "wolf" | "seer" | "witch" | "resolve";
  deaths: string;
  log: string;
};

const HUNTER_LOG = "獵人帶走 ";

function openOf(step: JudgeSnap["step"]): JudgeClip[] {
  if (step === "wolf") return ["wolf-open"];
  if (step === "seer") return ["seer-open", "seer-ask"];
  if (step === "witch") return ["witch-open"];
  return [];
}

function closeOf(step: JudgeSnap["step"]): JudgeClip[] {
  if (step === "wolf") return ["wolf-close"];
  if (step === "seer") return ["seer-close"];
  if (step === "witch") return ["witch-close"];
  return [];
}

function addedIds(prev: string, next: string): string[] {
  const had = new Set(prev ? prev.split("|") : []);
  return (next ? next.split("|") : []).filter((id) => id && !had.has(id));
}

function wolfAnnounced(
  prev: JudgeSnap,
  next: JudgeSnap,
  seats: { id: string; role: string }[],
  names: Record<string, string>,
): boolean {
  const isWolf = (id: string) => seats.some((s) => s.id === id && s.role === "wolf");
  if (addedIds(prev.deaths, next.deaths).some(isWolf)) return true;
  if (next.log !== prev.log && next.log.startsWith(HUNTER_LOG)) {
    const name = next.log.slice(HUNTER_LOG.length).trim();
    const id = Object.entries(names).find(([, n]) => n === name)?.[0];
    if (id && isWolf(id)) return true;
  }
  return false;
}

/** 由上一個畫面切到下一個畫面時，法官要接的句子。 */
export function judgeCues(
  prev: JudgeSnap | null,
  next: JudgeSnap,
  seats: { id: string; role: string }[],
  names: Record<string, string>,
): JudgeClip[] {
  if (next.sub === "card" && (!prev || prev.sub !== "card")) return ["confirm"];
  if (!prev || next.sub === "card") return [];

  const out: JudgeClip[] = [];
  const toDawn = next.sub === "dawn" && prev.sub !== "dawn";
  const toNight = next.sub === "night" && prev.sub !== "night";
  const stepChange = prev.sub === "night" && next.sub === "night" && prev.step !== next.step;
  const deadWolf = wolfAnnounced(prev, next, seats, names);
  const knightDuel = next.log !== prev.log && next.log.startsWith("騎士發動決鬥");
  const knightSorry = knightDuel && next.log.includes("謝罪");
  const hunterShot = next.log !== prev.log && next.log.startsWith(HUNTER_LOG);
  const toHunter = next.sub === "hunter" && (prev.sub !== "hunter" || hunterShot);
  const fromHunter = prev.sub === "hunter" && (next.sub !== "hunter" || hunterShot);

  if (prev.sub === "night" && next.sub !== "night") out.push(...closeOf(prev.step));
  if (stepChange) out.push(...closeOf(prev.step), ...openOf(next.step));
  if (fromHunter) out.push("hunter-close");
  if (knightDuel) out.push("knight-duel");
  if (knightSorry) out.push("knight-dead");
  if (deadWolf && !toDawn) out.push("wolf-dead");
  if (toDawn) {
    out.push("dawn");
    if (deadWolf) out.push("wolf-dead");
  }
  if (toNight) out.push("night", ...openOf(next.step));
  if (toHunter) out.push("hunter-open", "hunter-ask");
  return out;
}
