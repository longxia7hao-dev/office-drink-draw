import { assignRoles, getRole, isRoleAvailable, ROLES, type RoleDef, type SkillKind } from "./roles";
import { createRng, newSeed, rngInt, shuffleInPlace } from "./rng";
import { FLIP_QUESTIONS, getFlipQuestion, questionsForCat, type FlipQuestion } from "./flipQuestions";
import {
  getKingCmd,
  kingNeed,
  KING_CMDS,
  NEVER_PROMPTS,
  WHEEL,
  type KingKind,
} from "./party";
import { CHAOS_CARDS, TRUTH_QUESTIONS, WHO_QUESTIONS, fillPunish } from "./partyPlay";
import { REACT_CARDS, REACT_COLORS, type ReactColor } from "./reactCards";

export type Phase =
  | "home"
  | "setup"
  | "lobby"
  | "pick_role"
  | "roles"
  | "mode_select"
  | "flip_cat"
  | "drawing"
  | "reveal"
  | "skill"
  | "result"
  | "flip_battle"
  | "who"
  | "truth"
  | "react"
  | "chaos"
  | "king"
  | "never"
  | "wheel"
  | "match"
  | "award"
  | "recap";

export type GameMode =
  | "draw_one"
  | "drink_order"
  | "team_toast"
  | "flip_battle"
  | "who"
  | "truth"
  | "react"
  | "match"
  | "king"
  | "never"
  | "wheel";

export type FlipSubPhase = "choose" | "result";

export type FlipRule = "majority" | "minority" | "solo" | "allsame";
export const FLIP_RULES: FlipRule[] = ["majority", "minority", "solo", "allsame"];
export function flipRuleLabel(r: FlipRule): string {
  if (r === "majority") return "多數受罰";
  if (r === "minority") return "少數受罰";
  if (r === "solo") return "落單 ×2";
  return "全員同一邊 ×2";
}

export interface FlipBattleState {
  deck: string[];
  index: number;
  sub: FlipSubPhase;
  votes: Record<string, 0 | 1>;
  readyIds: string[];
  answererId: string | null;
  drinkerIds: string[];
  tie: boolean;
  majoritySide: 0 | 1 | null;
  cat: string | null;
  rule: FlipRule;
  ruleDeck: FlipRule[];
}

export interface KingState {
  sub: "reveal" | "pick" | "target" | "resolve";
  numbers: Record<string, number>;
  kingId: string;
  optionIds: string[];
  commandId: string | null;
  targetIds: string[];
  drinkerIds: string[];
  cups: number;
  message: string;
  need: number;
}

export interface NeverState {
  deck: string[];
  index: number;
  marked: string[];
  sub: "ask" | "result";
}

export interface WheelState {
  sub: "idle" | "spin" | "target" | "resolve";
  angle: number;
  landed: number;
  spinnerId: string;
  targetId: string | null;
  drinkerIds: string[];
  message: string;
}

export interface WhoState {
  deck: string[];
  index: number;
  sub: "vote" | "result" | "drag";
  votes: Record<string, string>;
  voterId: string | null;
  punishedIds: string[];
  dragFrom: string | null;
}

export interface TruthState {
  deck: string[];
  index: number;
  sub: "ask" | "result" | "drag";
  playerId: string;
  took: "answer" | "punish" | null;
  dragFrom: string | null;
}

export type ReactSticker = "cat" | "dog" | "cow";
export interface ReactState {
  sub: "ready" | "count" | "play" | "result" | "drag";
  hard: boolean;
  ready: string[];
  count: number;
  beat: number;
  color: string;
  file: string;
  sticker: ReactSticker | null;
  need: ReactSticker | null;
  stickerX: number;
  stickerY: number;
  tempo: number;
  dead: string[];
  tapped: string[];
  playerId: string;
  misses: number;
  punished: boolean;
  dragFrom: string | null;
}

export interface MatchTile {
  key: string;
  file: string;
  color: string;
  open: boolean;
  matched: boolean;
}
export interface MatchState {
  size: 8 | 12 | 16;
  cols: number;
  sub: "size" | "play" | "result";
  tiles: MatchTile[];
  pick: number[];
  scores: Record<string, number>;
  turn: string;
  swapped: string[];
  swapping: boolean;
  swapBy: string | null;
  swapPick: number[];
  flash: string | null;
  lock: boolean;
  found: number;
  pairs: number;
}

export interface AwardState {
  worst: string[];
  best: string[];
  mode: GameMode | null;
}

export interface ChaosBuff {
  id: string;
  title: string;
  desc: string;
  double: boolean;
  drag: boolean;
  shieldId: string | null;
  pendingMode: GameMode;
}

export interface Player {
  id: string;
  name: string;
  roleId: string;
  connected?: boolean;
  skipNext?: boolean;
  hasPass?: boolean;
  cups: number;
  isBot?: boolean;
  skillUsed?: boolean;
  nextMult?: number;
  handoffId?: string | null;
  skipToken?: boolean;
  coverFor?: string;
  oweCover?: string;
  collateralHit?: boolean;
}

export interface DrawResult {
  playerId: string;
  mode: GameMode;
  message: string;
  drinkHint: string;
  skillKind: SkillKind;
  order?: string[];
  teams?: { name: string; members: string[] }[];
}

export interface GameState {
  phase: Phase;
  mode: GameMode | null;
  players: Player[];
  seed: string;
  drawCount: number;
  lastResult: DrawResult | null;
  roomCode: string | null;
  isHost: boolean;
  isOnline: boolean;
  myPlayerId: string | null;
  hostId: string | null;
  skillPending: boolean;
  ceremonyStep: number;
  flip: FlipBattleState | null;
  skillMessage: string;
  king: KingState | null;
  never: NeverState | null;
  wheel: WheelState | null;
  who: WhoState | null;
  truth: TruthState | null;
  react: ReactState | null;
  match: MatchState | null;
  award: AwardState | null;
  hitAmt: Record<string, number>;
  chaos: ChaosBuff | null;
  punishLabel: string;
  practice: boolean;
  allow18: boolean;
  flipCat: string | null;
  punishQueue: string[];
  punishAmt: number;
  punishActorId: string | null;
  punishCollateral: boolean;
  skillReturnPhase: Phase;
  skillFlash: { roleId: string; name: string; skill: string; msg: string } | null;
}

export function createInitialState(): GameState {
  return {
    phase: "home",
    mode: null,
    players: [],
    seed: newSeed(),
    drawCount: 0,
    lastResult: null,
    roomCode: null,
    isHost: true,
    isOnline: false,
    myPlayerId: null,
    hostId: null,
    skillPending: false,
    ceremonyStep: 0,
    flip: null,
    skillMessage: "",
    king: null,
    never: null,
    wheel: null,
    who: null,
    truth: null,
    react: null,
    match: null,
    award: null,
    hitAmt: {},
    chaos: null,
    punishLabel: "喝半杯",
    practice: false,
    allow18: (() => {
      try {
        return localStorage.getItem("odd-18") === "1";
      } catch {
        return false;
      }
    })(),
    flipCat: null,
    punishQueue: [],
    punishAmt: 1,
    punishActorId: null,
    punishCollateral: false,
    skillReturnPhase: "home",
    skillFlash: null,
  };
}

export function makeLocalPlayers(names: string[], _seed: string, ids?: string[]): Player[] {
  return names.map((name, i) => ({
    id: ids?.[i] ?? `p${i}`,
    name: name.trim() || `玩家${i + 1}`,
    roleId: "",
    hasPass: false,
    skipNext: false,
    cups: 0,
    skillUsed: false,
    nextMult: 1,
    handoffId: null,
  }));
}

export function setPlayerRole(state: GameState, playerId: string, roleId: string): string | null {
  const p = state.players.find((x) => x.id === playerId);
  if (!p) return "找不到玩家";
  if (!roleId) {
    p.roleId = "";
    p.hasPass = false;
    return null;
  }
  if (!ROLES.some((r) => r.id === roleId)) return "沒有這個角色";
  if (!isRoleAvailable(state.players, roleId, playerId)) {
    return `${getRole(roleId).name} 已被選走`;
  }
  p.roleId = roleId;
  p.hasPass = roleId === "intern";
  return null;
}

export function allRolesPicked(state: GameState): boolean {
  return state.players.length >= 2 && state.players.every((p) => Boolean(p.roleId));
}

export function fillRemainingRoles(state: GameState): void {
  const rng = createRng(`${state.seed}:fill-roles`);
  const used = new Set(state.players.map((p) => p.roleId).filter(Boolean));
  const pool = shuffleInPlace(
    ROLES.map((r) => r.id).filter((id) => !used.has(id)),
    rng,
  );
  for (const p of state.players) {
    if (p.roleId) continue;
    const id = pool.shift() ?? "worker";
    p.roleId = id;
    p.hasPass = id === "intern";
  }
}

export function fillBotRoles(state: GameState): void {
  const rng = createRng(`${state.seed}:fill-bots`);
  const used = new Set(state.players.map((p) => p.roleId).filter(Boolean));
  const pool = shuffleInPlace(
    ROLES.map((r) => r.id).filter((id) => !used.has(id)),
    rng,
  );
  for (const p of state.players) {
    if (!p.isBot || p.roleId) continue;
    const id = pool.shift() ?? "worker";
    p.roleId = id;
    p.hasPass = id === "intern";
  }
}

export function roleOf(p: Player): RoleDef {
  return getRole(p.roleId);
}

export function heatOf(state: GameState): number {
  const total = state.players.reduce((s, p) => s + (p.cups || 0), 0);
  return Math.min(3, 1 + Math.floor(total / 8));
}

export function roleDrinkCups(_roleId: string): number {
  return 1;
}

export function addCups(state: GameState, ids: string[], n: number): void {
  if (n <= 0 || ids.length === 0) return;
  const bonus = heatOf(state) >= 3 ? 1 : 0;
  const unique = [...new Set(ids)];
  if (!state.hitAmt) state.hitAmt = {};
  for (const id of unique) {
    const p = state.players.find((x) => x.id === id);
    if (!p) continue;
    if (p.oweCover) {
      const other = state.players.find((x) => x.id === p.oweCover);
      p.oweCover = undefined;
      if (other) {
        addCups(state, [other.id], n);
        continue;
      }
    }
    if (p.handoffId) {
      const hid = p.handoffId;
      p.handoffId = null;
      if (hid && hid !== id) addCups(state, [hid], n * 3);
      continue;
    }
    if (p.skipToken) {
      p.skipToken = false;
      continue;
    }
    const m = p.nextMult ?? 1;
    p.nextMult = 1;
    if (m === 0) continue;
    const add = (n + bonus) * m;
    p.cups = (p.cups || 0) + add;
    state.hitAmt[p.id] = (state.hitAmt[p.id] ?? 0) + add;
  }
}

export function punishPhrase(state: GameState, n = 1): string {
  const label = state.punishLabel || "喝半杯";
  return n > 1 ? `${label} ×${n}` : label;
}

export function applyPunish(state: GameState, ids: string[], n = 1): string[] {
  const buff = state.chaos;
  let amt = n;
  if (buff?.double) amt *= 2;
  let list = [...new Set(ids)];
  if (buff?.shieldId) list = list.filter((id) => id !== buff.shieldId);
  addCups(state, list, amt);
  return list;
}

export function canFireSkill(p: Player, collateral = false): boolean {
  if (p.skillUsed || p.isBot) return false;
  const kind = getRole(p.roleId).skillKind;
  if (kind === "none") return false;
  if (kind === "protect") return collateral || Boolean(p.collateralHit);
  return true;
}

export function currentDrinkers(state: GameState): string[] {
  if (state.flip?.sub === "result") return state.flip.tie ? [] : [...state.flip.drinkerIds];
  if (state.who?.sub === "result" || state.who?.sub === "drag") return [...(state.who?.punishedIds ?? [])];
  if (state.truth && (state.truth.sub === "result" || state.truth.sub === "drag") && state.truth.took === "punish") {
    return [state.truth.playerId];
  }
  if (state.react?.sub === "result") return [...state.react.dead];
  if (state.punishQueue.length) return [...state.punishQueue];
  return Object.keys(state.hitAmt ?? {}).filter((id) => (state.hitAmt[id] ?? 0) > 0);
}

export function canUseSkillNow(state: GameState, pid: string | null | undefined): boolean {
  if (!pid) return false;
  const p = state.players.find((x) => x.id === pid);
  if (!p || p.skillUsed || p.isBot) return false;
  const kind = getRole(p.roleId).skillKind;
  if (kind === "none") return false;
  const drinkers = currentDrinkers(state);
  if (kind === "cover") return drinkers.some((id) => id !== pid);
  if (kind === "protect") return Boolean(p.collateralHit) && drinkers.includes(pid);
  return drinkers.includes(pid);
}

export function pumpPunishQueue(state: GameState): void {
  while (state.punishQueue.length) {
    const id = state.punishQueue[0]!;
    const p = state.players.find((x) => x.id === id);
    if (!p) {
      state.punishQueue.shift();
      continue;
    }
    if ((p.nextMult ?? 1) === 0) {
      p.nextMult = 1;
      state.punishQueue.shift();
      continue;
    }
    if (!canFireSkill(p, state.punishCollateral || Boolean(p.collateralHit))) {
      applyPunish(state, [id], state.punishAmt || 1);
      p.collateralHit = false;
      state.punishQueue.shift();
      continue;
    }
    break;
  }
  if (!state.punishQueue.length) {
    state.punishActorId = null;
    state.skillPending = false;
    state.punishCollateral = false;
  }
}

export function flushPunish(state: GameState): void {
  const amt = state.punishAmt || 1;
  const q = [...state.punishQueue];
  state.punishQueue = [];
  state.punishActorId = null;
  state.skillPending = false;
  state.punishCollateral = false;
  for (const p of state.players) p.collateralHit = false;
  if (q.length) applyPunish(state, q, amt);
}

export function settlePunish(state: GameState, ids: string[], n = 1): string[] {
  const buff = state.chaos;
  let list = [...new Set(ids)];
  if (buff?.shieldId) list = list.filter((id) => id !== buff.shieldId);
  state.hitAmt = {};
  if (state.phase !== "skill") state.skillReturnPhase = state.phase;
  state.punishAmt = n;
  state.punishQueue = list;
  state.punishActorId = list[0] ?? null;
  state.punishCollateral = false;
  state.skillPending = false;
  for (const id of list) {
    const p = state.players.find((x) => x.id === id);
    const m = p?.nextMult ?? 1;
    state.hitAmt[id] = n * (m === 0 ? 0 : m);
  }
  return list;
}

export function launchCoreMode(state: GameState, mode: GameMode, fromChaos = false): void {
  if (!fromChaos && state.drawCount > 0 && state.drawCount % 3 === 0) {
    const rng = createRng(`${state.seed}:chaos:${state.drawCount}`);
    const card = CHAOS_CARDS[rngInt(rng, CHAOS_CARDS.length)]!;
    let shieldId: string | null = null;
    if (card.shieldLowest && state.players.length) {
      shieldId = [...state.players].sort((a, b) => (a.cups || 0) - (b.cups || 0))[0]!.id;
    }
    state.chaos = {
      id: card.id,
      title: card.title,
      desc: card.desc,
      double: card.double,
      drag: card.drag,
      shieldId,
      pendingMode: mode,
    };
    state.phase = "chaos";
    state.mode = mode;
    return;
  }
  if (mode === "flip_battle") startFlipBattle(state);
  else if (mode === "who") startWho(state);
  else if (mode === "truth") startTruth(state);
  else if (mode === "react") startReact(state);
  else if (mode === "match") startMatch(state);
  for (const p of state.players) p.skillUsed = false;
}

export function confirmChaos(state: GameState): void {
  const mode = state.chaos?.pendingMode;
  if (!mode) return;
  launchCoreMode(state, mode, true);
}

export function consumeDrag(state: GameState, extraId: string): void {
  if (!state.chaos?.drag) return;
  applyPunish(state, [extraId], 1);
  if (state.flip && !state.flip.drinkerIds.includes(extraId)) state.flip.drinkerIds.push(extraId);
  if (state.who && !state.who.punishedIds.includes(extraId)) state.who.punishedIds.push(extraId);
  if (state.truth) state.truth.dragFrom = extraId;
  if (state.react) state.react.dragFrom = extraId;
  state.chaos = { ...state.chaos, drag: false };
}

export function startWho(state: GameState): void {
  const rng = createRng(`${state.seed}:who:${state.drawCount}`);
  const ids = WHO_QUESTIONS.map((q) => q.id);
  shuffleInPlace(ids, rng);
  state.mode = "who";
  state.phase = "who";
  state.who = {
    deck: ids.slice(0, 8),
    index: 0,
    sub: "vote",
    votes: {},
    voterId: state.players[0]?.id ?? null,
    punishedIds: [],
    dragFrom: null,
  };
  state.flip = null;
  state.truth = null;
  state.react = null;
}

export function whoVote(state: GameState, targetId: string, voterId?: string): void {
  const who = state.who;
  if (!who || who.sub !== "vote") return;
  const id = voterId ?? who.voterId ?? state.players.find((p) => !(p.id in who.votes))?.id;
  if (!id || id in who.votes) return;
  if (!state.players.some((p) => p.id === targetId)) return;
  who.votes[id] = targetId;
  if (state.players.every((p) => p.id in who.votes)) {
    const tally: Record<string, number> = {};
    for (const t of Object.values(who.votes)) tally[t] = (tally[t] ?? 0) + 1;
    let max = 0;
    for (const n of Object.values(tally)) if (n > max) max = n;
    const punished = Object.keys(tally).filter((k) => tally[k] === max);
    who.punishedIds = settlePunish(state, punished, 1);
    who.sub = state.chaos?.drag && who.punishedIds.length ? "drag" : "result";
    who.voterId = null;
  } else {
    who.voterId = state.players.find((p) => !(p.id in who.votes))?.id ?? null;
  }
}

export function whoAdvance(state: GameState): void {
  if (!state.who) return;
  flushPunish(state);
  if (state.who.index + 1 >= state.who.deck.length) {
    goAward(state);
    return;
  }
  state.who.index += 1;
  state.who.sub = "vote";
  state.who.votes = {};
  state.who.punishedIds = [];
  state.who.dragFrom = null;
  state.who.voterId = state.players[0]?.id ?? null;
  state.hitAmt = {};
  state.drawCount += 1;
  state.chaos = null;
}

export function startTruth(state: GameState): void {
  const rng = createRng(`${state.seed}:truth:${state.drawCount}`);
  const ids = TRUTH_QUESTIONS.map((q) => q.id);
  shuffleInPlace(ids, rng);
  const turn = state.drawCount % Math.max(1, state.players.length);
  state.mode = "truth";
  state.phase = "truth";
  state.truth = {
    deck: ids.slice(0, 8),
    index: 0,
    sub: "ask",
    playerId: state.players[turn]?.id ?? state.players[0]?.id ?? "",
    took: null,
    dragFrom: null,
  };
  state.flip = null;
  state.who = null;
  state.react = null;
}

export function truthChoose(state: GameState, took: "answer" | "punish"): void {
  const t = state.truth;
  if (!t || t.sub !== "ask") return;
  t.took = took;
  if (took === "punish") settlePunish(state, [t.playerId], 1);
  t.sub = took === "punish" && state.chaos?.drag ? "drag" : "result";
}

export function truthAdvance(state: GameState): void {
  if (!state.truth) return;
  flushPunish(state);
  if (state.truth.index + 1 >= state.truth.deck.length) {
    goAward(state);
    return;
  }
  state.truth.index += 1;
  const i = (state.players.findIndex((p) => p.id === state.truth!.playerId) + 1) % Math.max(1, state.players.length);
  state.truth.playerId = state.players[i]?.id ?? "";
  state.truth.sub = "ask";
  state.truth.took = null;
  state.truth.dragFrom = null;
  state.hitAmt = {};
  state.drawCount += 1;
  state.chaos = null;
}

export function startReact(state: GameState): void {
  state.mode = "react";
  state.phase = "react";
  state.hitAmt = {};
  state.react = {
    sub: "ready",
    hard: false,
    ready: [],
    count: 3,
    beat: 0,
    color: "lime",
    file: REACT_CARDS[0]?.file ?? "",
    sticker: null,
    need: null,
    stickerX: 50,
    stickerY: 50,
    tempo: 2000,
    dead: [],
    tapped: [],
    playerId: "",
    misses: 0,
    punished: false,
    dragFrom: null,
  };
  state.flip = null;
  state.who = null;
  state.truth = null;
}

export function reactSetHard(state: GameState, hard: boolean): void {
  if (state.react && state.react.sub === "ready") state.react.hard = hard;
}

export function reactMarkReady(state: GameState, pid: string): void {
  const r = state.react;
  if (!r || r.sub !== "ready") return;
  if (!r.ready.includes(pid)) r.ready.push(pid);
  state.players.filter((p) => p.isBot).forEach((p) => {
    if (!r.ready.includes(p.id)) r.ready.push(p.id);
  });
  if (r.ready.length >= state.players.length) {
    r.sub = "count";
    r.count = 3;
  }
}

function pickReactBeat(hard: boolean): Pick<ReactState, "color" | "file" | "sticker" | "need" | "stickerX" | "stickerY"> {
  const target = REACT_COLORS[Math.floor(Math.random() * REACT_COLORS.length)]!;
  const matchColor = Math.random() < 0.42;
  const shown = matchColor
    ? target
    : REACT_COLORS.filter((c) => c !== target)[Math.floor(Math.random() * (REACT_COLORS.length - 1))]!;
  const pool = REACT_CARDS.filter((c) => c.color === shown);
  const card = pool[Math.floor(Math.random() * pool.length)] ?? REACT_CARDS[Math.floor(Math.random() * REACT_CARDS.length)]!;
  const stickers: ReactSticker[] = ["cat", "dog", "cow"];
  const need = hard ? stickers[Math.floor(Math.random() * 3)]! : null;
  let sticker: ReactSticker | null = null;
  if (hard) {
    const matchSticker = Math.random() < 0.45;
    sticker = matchSticker ? need : stickers.filter((s) => s !== need)[Math.floor(Math.random() * 2)]!;
  }
  return {
    color: target,
    file: card.file,
    sticker,
    need,
    stickerX: 14 + Math.random() * 62,
    stickerY: 14 + Math.random() * 62,
  };
}

export function reactTickCount(state: GameState): void {
  const r = state.react;
  if (!r || r.sub !== "count") return;
  if (r.count > 1) {
    r.count -= 1;
    return;
  }
  const beat = pickReactBeat(r.hard);
  Object.assign(r, beat);
  r.sub = "play";
  r.beat = 0;
  r.tempo = 2000;
  r.dead = [];
  r.tapped = [];
}

export function reactMustTap(r: ReactState): boolean {
  const shown = r.file.split("-")[0];
  const colorOk = shown === r.color;
  const stickerOk = !r.hard || r.sticker === r.need;
  return colorOk && stickerOk;
}

export function reactFail(state: GameState, pid: string): void {
  const r = state.react;
  if (!r || r.sub !== "play") return;
  if (r.dead.includes(pid)) return;
  r.dead.push(pid);
  r.punished = true;
  r.sub = "result";
  settlePunish(state, [pid], 1);
}

export function reactTap(state: GameState, pid: string): "miss" | "ok" | "ignore" {
  const r = state.react;
  if (!r || r.sub !== "play") return "ignore";
  if (!pid || r.dead.includes(pid) || r.tapped.includes(pid)) return "ignore";
  if (!reactMustTap(r)) {
    reactFail(state, pid);
    return "miss";
  }
  r.tapped.push(pid);
  const alive = state.players.filter((p) => !r.dead.includes(p.id));
  if (alive.length > 0 && alive.every((p) => r.tapped.includes(p.id))) reactNextBeat(state);
  return "ok";
}

export function reactTimeout(state: GameState): void {
  const r = state.react;
  if (!r || r.sub !== "play") return;
  if (!reactMustTap(r)) {
    reactNextBeat(state);
    return;
  }
  const missed = state.players.filter((p) => !r.dead.includes(p.id) && !r.tapped.includes(p.id)).map((p) => p.id);
  if (missed.length) {
    r.dead.push(...missed);
    r.punished = true;
    r.sub = "result";
    settlePunish(state, missed, 1);
    return;
  }
  reactNextBeat(state);
}

export function reactNextBeat(state: GameState): void {
  const r = state.react;
  if (!r || r.sub !== "play") return;
  if (r.beat + 1 >= 60) {
    r.sub = "result";
    r.punished = false;
    return;
  }
  const beat = pickReactBeat(r.hard);
  Object.assign(r, beat);
  r.beat += 1;
  r.tapped = [];
  r.tempo = Math.max(800, r.tempo - 100);
}

export function reactBegin(state: GameState): void {
  if (state.react) reactMarkReady(state, state.myPlayerId ?? state.players[0]?.id ?? "");
}

export function reactFinish(state: GameState, misses: number): void {
  const r = state.react;
  if (!r) return;
  r.misses = misses;
  r.punished = misses > 0;
  if (r.punished) {
    const id = r.dead[0] ?? state.myPlayerId ?? r.playerId;
    settlePunish(state, [id], 1);
    r.sub = "result";
  }
}

export function goAward(state: GameState): void {
  const cups = state.players.map((p) => p.cups || 0);
  const hi = Math.max(0, ...cups);
  const lo = Math.min(...cups);
  state.award = {
    worst: state.players.filter((p) => (p.cups || 0) === hi).map((p) => p.id),
    best: state.players.filter((p) => (p.cups || 0) === lo).map((p) => p.id),
    mode: state.mode,
  };
  state.phase = "award";
  state.hitAmt = {};
}

export function startMatch(state: GameState): void {
  state.mode = "match";
  state.phase = "match";
  state.hitAmt = {};
  state.match = {
    size: 8,
    cols: 4,
    sub: "size",
    tiles: [],
    pick: [],
    scores: Object.fromEntries(state.players.map((p) => [p.id, 0])),
    turn: state.players[0]?.id ?? "",
    swapped: [],
    swapping: false,
    swapBy: null,
    swapPick: [],
    flash: null,
    lock: false,
    found: 0,
    pairs: 0,
  };
}

export function matchDeal(state: GameState, size: 8 | 12 | 16): void {
  const m = state.match;
  if (!m) return;
  const pairs = size;
  const cols = size === 8 ? 4 : size === 12 ? 6 : 8;
  const pool = [...REACT_CARDS];
  const keys: MatchTile[] = [];
  for (let i = 0; i < pairs; i++) {
    const c = pool[i % pool.length]!;
    keys.push({ key: `${c.color}:${c.file}:${i}`, file: c.file, color: c.color, open: false, matched: false });
  }
  const doubled = [...keys, ...keys.map((k) => ({ ...k }))];
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j]!, doubled[i]!];
  }
  m.size = size;
  m.cols = cols;
  m.sub = "play";
  m.tiles = doubled;
  m.pick = [];
  m.found = 0;
  m.pairs = pairs;
  m.scores = Object.fromEntries(state.players.map((p) => [p.id, 0]));
  m.turn = state.players[0]?.id ?? "";
  m.swapped = [];
  m.swapping = false;
  m.swapBy = null;
  m.swapPick = [];
  m.flash = null;
  m.lock = false;
}

export function matchBeginSwap(state: GameState, pid: string): void {
  const m = state.match;
  if (!m || m.sub !== "play" || m.lock) return;
  if (m.turn !== pid) return;
  if (m.swapped.includes(pid) || m.swapping) return;
  m.swapping = true;
  m.swapBy = pid;
  m.swapPick = [];
  m.flash = "點兩張牌調換位置";
}

export function matchTap(state: GameState, i: number, pid: string): void {
  const m = state.match;
  if (!m || m.sub !== "play" || m.lock) return;
  if (m.turn !== pid) return;
  if (state.punishQueue.length && !m.swapping) flushPunish(state);
  if (m.swapping && m.swapBy === pid) {
    if (m.swapPick.includes(i)) return;
    const tile = m.tiles[i];
    if (!tile || tile.matched) return;
    m.swapPick = [...m.swapPick, i];
    if (m.swapPick.length < 2) return;
    const [a, b] = m.swapPick;
    const tmp = m.tiles[a!]!;
    m.tiles[a!] = m.tiles[b!]!;
    m.tiles[b!] = tmp;
    m.swapped.push(pid);
    const name = state.players.find((p) => p.id === pid)?.name ?? "玩家";
    m.flash = `${name} 調換了兩張牌`;
    m.swapping = false;
    m.swapBy = null;
    m.swapPick = [];
    return;
  }
  const tile = m.tiles[i];
  if (!tile || tile.matched || tile.open) return;
  tile.open = true;
  m.pick = [...m.pick, i];
  if (m.pick.length < 2) return;
  const [a, b] = m.pick;
  if (m.tiles[a!]!.key === m.tiles[b!]!.key) {
    m.tiles[a!]!.matched = true;
    m.tiles[b!]!.matched = true;
    m.scores[pid] = (m.scores[pid] ?? 0) + 1;
    m.found += 1;
    m.pick = [];
    if (m.found >= m.pairs) {
      const min = Math.min(...Object.values(m.scores));
      const losers = Object.entries(m.scores)
        .filter(([, v]) => v === min)
        .map(([k]) => k);
      settlePunish(state, losers, 1);
      m.sub = "result";
    }
    return;
  }
  settlePunish(state, [pid], 1);
  m.lock = true;
}

export function matchFlipBack(state: GameState): void {
  const m = state.match;
  if (!m?.lock) return;
  for (const i of m.pick) {
    const t = m.tiles[i];
    if (t && !t.matched) t.open = false;
  }
  m.pick = [];
  m.lock = false;
  const order = state.players.map((p) => p.id);
  const idx = Math.max(0, order.indexOf(m.turn));
  m.turn = order[(idx + 1) % order.length] ?? m.turn;
}

export function reactAdvance(state: GameState): void {
  flushPunish(state);
  goAward(state);
}

export function peekDrawOne(state: GameState): DrawResult {
  const rng = createRng(`${state.seed}:draw:${state.drawCount}`);
  const eligible = state.players.filter((p) => !p.skipNext);
  const pool = eligible.length > 0 ? eligible : state.players;
  const picked = pool[rngInt(rng, pool.length)]!;
  const role = roleOf(picked);
  return {
    playerId: picked.id,
    mode: "draw_one",
    message: `${picked.name}（${role.name}）中籤！`,
    drinkHint: role.drink,
    skillKind: role.skillKind,
  };
}

export function drawOne(state: GameState): DrawResult {
  const result = peekDrawOne(state);
  for (const p of state.players) {
    if (p.skipNext) p.skipNext = false;
  }
  return result;
}

export function drawOrder(state: GameState): DrawResult {
  const rng = createRng(`${state.seed}:order:${state.drawCount}`);
  const ids = state.players.map((p) => p.id);
  shuffleInPlace(ids, rng);
  const names = ids.map((id) => state.players.find((p) => p.id === id)!.name);
  return {
    playerId: ids[0]!,
    mode: "drink_order",
    message: "乾杯順序出爐！",
    drinkHint: names.map((n, i) => `${i + 1}. ${n}`).join(" → "),
    skillKind: "none",
    order: ids,
  };
}

export function drawTeams(state: GameState): DrawResult {
  const rng = createRng(`${state.seed}:team:${state.drawCount}`);
  const ids = state.players.map((p) => p.id);
  shuffleInPlace(ids, rng);
  const mid = Math.ceil(ids.length / 2);
  const a = ids.slice(0, mid);
  const b = ids.slice(mid);
  const nameOf = (id: string) => state.players.find((p) => p.id === id)!.name;
  return {
    playerId: a[0]!,
    mode: "team_toast",
    message: "分隊完成！兩隊乾杯！",
    drinkHint: "HEAT 隊 vs ICE 隊",
    skillKind: "none",
    teams: [
      { name: "HEAT 隊", members: a.map(nameOf) },
      { name: "ICE 隊", members: b.map(nameOf) },
    ],
  };
}

function applyWithProtect(state: GameState, ids: string[], n: number): void {
  const delayed: string[] = [];
  const now: string[] = [];
  for (const id of ids) {
    const p = state.players.find((x) => x.id === id);
    const intern =
      p &&
      getRole(p.roleId).skillKind === "protect" &&
      !p.skillUsed &&
      !p.isBot &&
      p.id !== state.punishActorId;
    if (intern && p) {
      p.collateralHit = true;
      delayed.push(id);
      state.hitAmt[id] = (state.hitAmt[id] ?? 0) + n;
    } else now.push(id);
  }
  addCups(state, now, n);
  for (const id of delayed) {
    if (!state.punishQueue.includes(id)) state.punishQueue.push(id);
  }
  if (delayed.length) state.punishCollateral = true;
}

export function applySkill(
  state: GameState,
  kind: SkillKind,
  targetId?: string,
  option?: string,
): string {
  const actorId = state.punishActorId ?? state.lastResult?.playerId;
  const me = actorId ? state.players.find((p) => p.id === actorId) : undefined;
  const target = targetId ? state.players.find((p) => p.id === targetId) : undefined;
  const mark = () => {
    if (me) me.skillUsed = true;
  };
  const amt = state.punishAmt || 1;

  switch (kind) {
    case "slacker":
      mark();
      if (me) me.nextMult = 2;
      return `${me?.name} 摸魚！本次免罰，下次 ×2`;
    case "exam": {
      if (!target) return "請選擇目標";
      mark();
      if (me) addCups(state, [me.id], amt);
      applyWithProtect(state, [target.id], amt);
      return `${me?.name} 考績！${target.name} 接受相同份量`;
    }
    case "treat_all":
      mark();
      applyWithProtect(
        state,
        state.players.map((p) => p.id),
        amt,
      );
      return `${me?.name} 我請客！全桌一起受罰`;
    case "protect":
      mark();
      if (me) me.collateralHit = false;
      return `${me?.name} 新人保護期！這次被連坐的懲罰免除`;
    case "split": {
      if (!target || !me) return "請選擇平分對象";
      mark();
      const half = amt / 2;
      addCups(state, [me.id], half);
      applyWithProtect(state, [target.id], half);
      return `${me.name} 一人一半！與 ${target.name} 各承擔一半`;
    }
    case "able": {
      mark();
      if (me) addCups(state, [me.id], amt / 2);
      const poor = [...state.players].sort((a, b) => (a.cups || 0) - (b.cups || 0)).find((p) => p.id !== me?.id);
      if (poor) applyWithProtect(state, [poor.id], amt);
      return `${me?.name} 能者多勞！減半，並由 ${poor?.name ?? "最低分"} 多喝一份`;
    }
    case "hedge": {
      if (!target || !me) return "請選擇";
      mark();
      addCups(state, [me.id], amt / 2);
      me.nextMult = 2;
      target.nextMult = 2;
      return `風險對沖！${me.name} 減半；你與 ${target.name} 下次都 ×2`;
    }
    case "backup": {
      if (!target || !me) return "請選擇";
      mark();
      addCups(state, [me.id], amt / 2);
      me.nextMult = 2;
      target.nextMult = 0;
      return `緊急備援！${me.name} 減半，下次 ×2；${target.name} 下次免罰`;
    }
    case "ot_skip":
      mark();
      if (me) {
        addCups(state, [me.id], amt * 2);
        me.skipToken = true;
      }
      return `${me?.name} 爆肝！本次 ×2，換一次免罰`;
    case "cover": {
      if (!target || !me) return "請選擇要擋的人";
      mark();
      me.coverFor = target.id;
      target.oweCover = me.id;
      const n = state.hitAmt[target.id] ?? amt;
      target.cups = Math.max(0, (target.cups || 0) - n);
      me.cups = (me.cups || 0) + n;
      state.hitAmt[target.id] = 0;
      state.hitAmt[me.id] = (state.hitAmt[me.id] ?? 0) + n;
      state.punishQueue = state.punishQueue.filter((id) => id !== target.id);
      return `${me.name} 替 ${target.name} 擋酒！下次由對方還`;
    }
    case "veteran": {
      mark();
      if (me) {
        if (amt >= 2) addCups(state, [me.id], 1);
        else addCups(state, [me.id], 0.5);
      }
      return amt >= 2 ? `${me?.name} 見過大場面，降回 1 份` : `${me?.name} 見過大場面，減半`;
    }
    default:
      mark();
      if (me) addCups(state, [me.id], amt);
      return `${me?.name} ${punishPhrase(state)}`;
  }
}

export function applyBaseDrink(state: GameState): void {
  const r = state.lastResult;
  if (!r || r.mode !== "draw_one") return;
  const p = state.players.find((x) => x.id === r.playerId);
  if (!p) return;
  applyPunish(state, [p.id], roleDrinkCups(p.roleId));
}

export function continueAfterSkill(state: GameState, msg: string): void {
  if (msg.startsWith("請選擇")) {
    state.skillMessage = msg;
    return;
  }
  state.skillMessage = msg;
  const actor = state.punishActorId;
  const me = actor ? state.players.find((p) => p.id === actor) : undefined;
  if (me) {
    state.skillFlash = {
      roleId: me.roleId,
      name: me.name,
      skill: getRole(me.roleId).skillName,
      msg,
    };
  }
  if (actor && state.punishQueue[0] === actor) state.punishQueue.shift();
  else if (actor) state.punishQueue = state.punishQueue.filter((id) => id !== actor);
  state.skillPending = false;
  if (state.mode === "draw_one") {
    state.phase = "result";
    return;
  }
  state.phase = state.skillReturnPhase;
}

export function declineSkill(state: GameState): void {
  const actor = state.punishActorId ?? state.lastResult?.playerId;
  if (actor && state.punishQueue.includes(actor)) {
    applyPunish(state, [actor], state.punishAmt || 1);
    state.punishQueue = state.punishQueue.filter((id) => id !== actor);
  }
  state.skillPending = false;
  state.skillFlash = null;
  if (state.mode === "draw_one") {
    state.phase = "reveal";
    return;
  }
  state.phase = state.skillReturnPhase;
}

export function startFlipBattle(state: GameState): void {
  const rng = createRng(`${state.seed}:flip:${state.drawCount}:${state.flipCat ?? "mix"}`);
  const pool = questionsForCat(state.flipCat, state.allow18);
  const ids = (pool.length ? pool : FLIP_QUESTIONS.filter((q) => q.age !== "18+")).map((q) => q.id);
  shuffleInPlace(ids, rng);
  const answerer = state.players.length > 0 ? state.players[0]!.id : null;
  const rules: FlipRule[] = [...FLIP_RULES, ...FLIP_RULES, ...FLIP_RULES, ...FLIP_RULES];
  shuffleInPlace(rules, rng);
  state.mode = "flip_battle";
  state.phase = "flip_battle";
  state.flip = {
    deck: ids.slice(0, Math.min(16, ids.length)),
    index: 0,
    sub: "choose",
    votes: {},
    readyIds: [],
    answererId: answerer,
    drinkerIds: [],
    tie: false,
    majoritySide: null,
    cat: state.flipCat,
    rule: rules[0]!,
    ruleDeck: rules,
  };
  state.skillPending = false;
  state.lastResult = null;
  state.king = null;
  state.never = null;
  state.wheel = null;
}

export function currentFlipQuestion(state: GameState): FlipQuestion | null {
  const flip = state.flip;
  if (!flip || flip.deck.length === 0) return null;
  const id = flip.deck[flip.index % flip.deck.length];
  return id ? getFlipQuestion(id) : null;
}

export function flipAllVoted(state: GameState): boolean {
  if (!state.flip) return false;
  if (state.players.length === 0) return true;
  return state.players.every((p) => p.id in state.flip!.votes);
}

export function resolveFlipMinority(state: GameState): void {
  const flip = state.flip;
  if (!flip) return;
  const rule = flip.rule ?? FLIP_RULES[flip.index % FLIP_RULES.length]!;
  flip.rule = rule;
  let countA = 0;
  let countB = 0;
  for (const p of state.players) {
    const v = flip.votes[p.id];
    if (v === 0) countA += 1;
    else if (v === 1) countB += 1;
  }
  const side = (s: 0 | 1) => state.players.filter((p) => flip.votes[p.id] === s).map((p) => p.id);
  flip.tie = false;
  flip.majoritySide = null;
  let drinkers: string[] = [];
  let n = 1;
  if (rule === "allsame") {
    if (countA === state.players.length || countB === state.players.length) {
      drinkers = state.players.map((p) => p.id);
      n = 2;
    } else {
      flip.tie = true;
    }
  } else if (rule === "solo") {
    if (countA === 1) {
      drinkers = side(0);
      n = 2;
    } else if (countB === 1) {
      drinkers = side(1);
      n = 2;
    } else {
      flip.tie = true;
    }
  } else if (countA === countB || (countA === 0 && countB === 0)) {
    flip.tie = true;
  } else if (rule === "majority") {
    const maj: 0 | 1 = countA > countB ? 0 : 1;
    flip.majoritySide = maj;
    drinkers = side(maj);
  } else {
    const min: 0 | 1 = countA < countB ? 0 : 1;
    flip.majoritySide = min === 0 ? 1 : 0;
    drinkers = side(min);
  }
  if (flip.tie) {
    flip.drinkerIds = [];
    state.hitAmt = {};
    return;
  }
  flip.drinkerIds = settlePunish(state, drinkers, n);
}

export function flipPick(state: GameState, choice: 0 | 1, voterId?: string): void {
  if (!state.flip || state.flip.sub !== "choose") return;
  const flip = state.flip;
  const id =
    voterId ??
    flip.answererId ??
    state.players.find((p) => !(p.id in flip.votes))?.id ??
    state.myPlayerId;
  if (!id) return;
  if (id in flip.votes) return;
  flip.votes[id] = choice;

  if (!flipAllVoted(state)) {
    const next = state.players.find((p) => !(p.id in flip.votes));
    flip.answererId = next?.id ?? null;
    return;
  }

  resolveFlipMinority(state);
  flip.sub = "result";
  flip.readyIds = [];
  flip.answererId = null;
}

export function flipMarkReady(state: GameState, playerId: string): void {
  if (!state.flip || state.flip.sub !== "result") return;
  if (!state.flip.readyIds.includes(playerId)) {
    state.flip.readyIds.push(playerId);
  }
}

export function flipAllReady(state: GameState): boolean {
  if (!state.flip) return false;
  if (state.players.length === 0) return true;
  return state.players.every((p) => state.flip!.readyIds.includes(p.id));
}

export function flipAdvance(state: GameState): void {
  if (!state.flip) return;
  flushPunish(state);
  if (state.flip.index + 1 >= state.flip.deck.length) {
    goAward(state);
    return;
  }
  state.flip.index += 1;
  state.flip.rule = state.flip.ruleDeck?.[state.flip.index] ?? FLIP_RULES[state.flip.index % FLIP_RULES.length]!;
  state.flip.sub = "choose";
  state.flip.votes = {};
  state.flip.readyIds = [];
  state.flip.drinkerIds = [];
  state.flip.tie = false;
  state.flip.majoritySide = null;
  state.flip.answererId = state.players[0]?.id ?? null;
  state.hitAmt = {};
  state.drawCount += 1;
  state.chaos = null;
}

export function flipVoteCounts(state: GameState): { a: number; b: number } {
  const flip = state.flip;
  let a = 0;
  let b = 0;
  if (!flip) return { a, b };
  for (const p of state.players) {
    const v = flip.votes[p.id];
    if (v === 0) a += 1;
    else if (v === 1) b += 1;
  }
  return { a, b };
}

export function startKing(state: GameState): void {
  const rng = createRng(`${state.seed}:king:${state.drawCount}`);
  const order = state.players.map((p) => p.id);
  shuffleInPlace(order, rng);
  const kingId = order[0]!;
  const numbers: Record<string, number> = {};
  numbers[kingId] = 0;
  let n = 1;
  for (const id of order.slice(1)) numbers[id] = n++;
  const cmds = KING_CMDS.map((c) => c.id);
  shuffleInPlace(cmds, rng);
  state.mode = "king";
  state.phase = "king";
  state.king = {
    sub: "reveal",
    numbers,
    kingId,
    optionIds: cmds.slice(0, 3),
    commandId: null,
    targetIds: [],
    drinkerIds: [],
    cups: 0,
    message: "",
    need: 0,
  };
  state.flip = null;
  state.never = null;
  state.wheel = null;
  state.lastResult = null;
  state.skillPending = false;
}

export function kingToPick(state: GameState): void {
  if (state.king) state.king.sub = "pick";
}

export function resolveKingDrinkers(state: GameState, kind: KingKind, targets: string[]): string[] {
  const king = state.king;
  if (!king) return [];
  const players = state.players;
  switch (kind) {
    case "pick1":
      return targets.slice(0, 1);
    case "pick2":
      return targets.slice(0, 2);
    case "odds":
      return players.filter((p) => (king.numbers[p.id] ?? 0) % 2 === 1).map((p) => p.id);
    case "evens":
      return players.filter((p) => (king.numbers[p.id] ?? 0) > 0 && (king.numbers[p.id] ?? 0) % 2 === 0).map((p) => p.id);
    case "highlow": {
      const rest = players.filter((p) => p.id !== king.kingId);
      if (rest.length === 0) return [king.kingId];
      const sorted = [...rest].sort((a, b) => (king.numbers[a.id] ?? 0) - (king.numbers[b.id] ?? 0));
      const ids = [sorted[0]!.id];
      if (sorted.length > 1) ids.push(sorted[sorted.length - 1]!.id);
      return ids;
    }
    case "all_but_king":
      return players.filter((p) => p.id !== king.kingId).map((p) => p.id);
    case "king_drinks":
      return [king.kingId];
    case "neighbors": {
      const seated = players;
      const ki = seated.findIndex((p) => p.id === king.kingId);
      if (ki < 0 || seated.length < 2) return [king.kingId];
      const left = seated[(ki + seated.length - 1) % seated.length]!.id;
      const right = seated[(ki + 1) % seated.length]!.id;
      return left === right ? [left] : [left, right];
    }
    case "role_boss": {
      const d = players.filter((p) => p.roleId === "ceo" || p.roleId === "manager").map((p) => p.id);
      return d.length ? d : [king.kingId];
    }
    case "role_intern": {
      const d = players.filter((p) => p.roleId === "intern").map((p) => p.id);
      if (d.length) return d;
      const w = players.filter((p) => p.roleId === "worker").map((p) => p.id);
      return w.length ? w : [king.kingId];
    }
    case "leader":
      return [players.reduce((a, b) => ((a.cups || 0) >= (b.cups || 0) ? a : b)).id];
    case "rookie":
      return [players.reduce((a, b) => ((a.cups || 0) <= (b.cups || 0) ? a : b)).id];
    case "all":
      return players.map((p) => p.id);
    case "overtime": {
      const d = players.filter((p) => p.roleId === "overtime").map((p) => p.id);
      return d.length ? d : [king.kingId];
    }
    case "workers": {
      const d = players.filter((p) => p.roleId === "worker").map((p) => p.id);
      return d.length ? d : players.map((p) => p.id);
    }
    default:
      return [];
  }
}

export function kingChoose(state: GameState, commandId: string): void {
  const king = state.king;
  if (!king || (king.sub !== "pick" && king.sub !== "target")) return;
  const cmd = getKingCmd(commandId);
  king.commandId = commandId;
  king.need = kingNeed(cmd.kind);
  king.message = cmd.desc;
  king.cups = cmd.cups;
  if (king.need > 0) {
    king.sub = "target";
    king.targetIds = [];
    return;
  }
  kingCommit(state);
}

export function kingAddTarget(state: GameState, playerId: string): void {
  const king = state.king;
  if (!king || king.sub !== "target") return;
  if (king.targetIds.includes(playerId)) {
    king.targetIds = king.targetIds.filter((id) => id !== playerId);
    return;
  }
  if (king.targetIds.length >= king.need) return;
  king.targetIds.push(playerId);
  if (king.targetIds.length >= king.need) kingCommit(state);
}

export function kingCommit(state: GameState): void {
  const king = state.king;
  if (!king || !king.commandId) return;
  const cmd = getKingCmd(king.commandId);
  const drinkers = resolveKingDrinkers(state, cmd.kind, king.targetIds);
  king.drinkerIds = drinkers;
  king.sub = "resolve";
  addCups(state, drinkers, cmd.cups);
  state.drawCount += 1;
}

export function startNever(state: GameState): void {
  const rng = createRng(`${state.seed}:never:${state.drawCount}`);
  const deck = NEVER_PROMPTS.map((p) => p.id);
  shuffleInPlace(deck, rng);
  state.mode = "never";
  state.phase = "never";
  state.never = { deck, index: 0, marked: [], sub: "ask" };
  state.flip = null;
  state.king = null;
  state.wheel = null;
  state.lastResult = null;
  state.skillPending = false;
}

export function neverToggle(state: GameState, playerId: string): void {
  const n = state.never;
  if (!n || n.sub !== "ask") return;
  if (n.marked.includes(playerId)) n.marked = n.marked.filter((id) => id !== playerId);
  else n.marked.push(playerId);
}

export function neverConfirm(state: GameState): void {
  const n = state.never;
  if (!n || n.sub !== "ask") return;
  addCups(state, n.marked, 1);
  n.sub = "result";
  state.drawCount += 1;
}

export function neverAdvance(state: GameState): void {
  const n = state.never;
  if (!n) return;
  n.index = (n.index + 1) % n.deck.length;
  n.marked = [];
  n.sub = "ask";
}

export function startWheel(state: GameState): void {
  const spinner = state.players[state.drawCount % Math.max(1, state.players.length)]?.id ?? state.players[0]?.id ?? "";
  state.mode = "wheel";
  state.phase = "wheel";
  state.wheel = {
    sub: "idle",
    angle: 0,
    landed: 0,
    spinnerId: spinner,
    targetId: null,
    drinkerIds: [],
    message: "",
  };
  state.flip = null;
  state.king = null;
  state.never = null;
  state.lastResult = null;
  state.skillPending = false;
}

export function spinWheel(state: GameState): void {
  const w = state.wheel;
  if (!w || (w.sub !== "idle" && w.sub !== "resolve")) return;
  const rng = createRng(`${state.seed}:wheel:${state.drawCount}:${state.players.reduce((s, p) => s + p.cups, 0)}`);
  const landed = rngInt(rng, WHEEL.length);
  const deg = 360 / WHEEL.length;
  const extra = 360 * (5 + rngInt(rng, 3));
  const angle = extra + (360 - (landed * deg + deg / 2));
  w.landed = landed;
  w.angle = (w.angle % 360) + angle;
  w.sub = "spin";
  w.targetId = null;
  w.drinkerIds = [];
  w.message = "";
}

export function wheelLand(state: GameState): void {
  const w = state.wheel;
  if (!w || w.sub !== "spin") return;
  const seg = WHEEL[w.landed] ?? WHEEL[0]!;
  w.message = seg.label;
  if (seg.kind === "pick" || seg.kind === "buddy") {
    w.sub = "target";
    return;
  }
  wheelApply(state);
}

export function wheelPickTarget(state: GameState, playerId: string): void {
  const w = state.wheel;
  if (!w || w.sub !== "target") return;
  w.targetId = playerId;
  wheelApply(state);
}

export function wheelApply(state: GameState): void {
  const w = state.wheel;
  if (!w) return;
  const seg = WHEEL[w.landed] ?? WHEEL[0]!;
  const rng = createRng(`${state.seed}:wheel-who:${state.drawCount}`);
  const randomOne = () => state.players[rngInt(rng, state.players.length)]!.id;
  let drinkers: string[] = [];
  switch (seg.kind) {
    case "random1":
    case "random2":
      drinkers = [randomOne()];
      break;
    case "all":
      drinkers = state.players.map((p) => p.id);
      break;
    case "pick":
      drinkers = w.targetId ? [w.targetId] : [];
      break;
    case "skip":
      drinkers = [];
      w.message = "本輪免罰，過關！";
      break;
    case "redraw": {
      const ids = assignRoles(state.players.length, (n) => rngInt(rng, n));
      state.players.forEach((p, i) => {
        p.roleId = ids[i]!;
        p.hasPass = p.roleId === "intern";
      });
      w.message = "命運宣布：全體重抽角色！";
      drinkers = [];
      break;
    }
    case "leader":
      drinkers = [state.players.reduce((a, b) => ((a.cups || 0) >= (b.cups || 0) ? a : b)).id];
      break;
    case "buddy":
      drinkers = w.targetId ? [w.spinnerId, w.targetId].filter(Boolean) : [w.spinnerId];
      break;
  }
  w.drinkerIds = drinkers;
  if (seg.cups > 0 && drinkers.length) addCups(state, drinkers, seg.cups);
  w.sub = "resolve";
  state.drawCount += 1;
}

export interface SyncPayload {
  phase: Phase;
  mode: GameMode | null;
  players: Player[];
  seed: string;
  drawCount: number;
  lastResult: DrawResult | null;
  skillPending: boolean;
  ceremonyStep: number;
  flip: FlipBattleState | null;
  skillMessage: string;
  hostId: string | null;
  king: KingState | null;
  never: NeverState | null;
  wheel: WheelState | null;
  who: WhoState | null;
  truth: TruthState | null;
  react: ReactState | null;
  match: MatchState | null;
  award: AwardState | null;
  hitAmt: Record<string, number>;
  chaos: ChaosBuff | null;
  punishLabel: string;
  punishQueue: string[];
  punishAmt: number;
  punishActorId: string | null;
  punishCollateral: boolean;
  skillReturnPhase: Phase;
  skillFlash: { roleId: string; name: string; skill: string; msg: string } | null;
}

export function toSync(state: GameState): SyncPayload {
  return {
    phase: state.phase,
    mode: state.mode,
    players: state.players,
    seed: state.seed,
    drawCount: state.drawCount,
    lastResult: state.lastResult,
    skillPending: state.skillPending,
    ceremonyStep: state.ceremonyStep,
    flip: state.flip,
    skillMessage: state.skillMessage,
    hostId: state.hostId,
    king: state.king,
    never: state.never,
    wheel: state.wheel,
    who: state.who,
    truth: state.truth,
    react: state.react,
    match: state.match,
    award: state.award,
    hitAmt: state.hitAmt,
    chaos: state.chaos,
    punishLabel: state.punishLabel,
    punishQueue: state.punishQueue,
    punishAmt: state.punishAmt,
    punishActorId: state.punishActorId,
    punishCollateral: state.punishCollateral,
    skillReturnPhase: state.skillReturnPhase,
    skillFlash: state.skillFlash,
  };
}

export function applySync(state: GameState, sync: SyncPayload): void {
  state.phase = sync.phase;
  state.mode = sync.mode;
  state.players = sync.players.map((p) => ({ ...p, cups: p.cups ?? 0 }));
  state.seed = sync.seed;
  state.drawCount = sync.drawCount;
  state.lastResult = sync.lastResult;
  state.skillPending = sync.skillPending;
  state.ceremonyStep = sync.ceremonyStep;
  state.flip = sync.flip ?? null;
  state.skillMessage = sync.skillMessage ?? "";
  state.hostId = sync.hostId ?? state.hostId;
  state.king = sync.king ?? null;
  state.never = sync.never ?? null;
  state.wheel = sync.wheel ?? null;
  state.who = sync.who ?? null;
  state.truth = sync.truth ?? null;
  state.react = sync.react ?? null;
  state.match = sync.match ?? null;
  state.award = sync.award ?? null;
  state.hitAmt = sync.hitAmt ?? {};
  state.chaos = sync.chaos ?? null;
  if (sync.punishLabel) state.punishLabel = sync.punishLabel;
  if (sync.punishQueue) state.punishQueue = sync.punishQueue;
  if (sync.punishAmt != null) state.punishAmt = sync.punishAmt;
  state.punishActorId = sync.punishActorId ?? null;
  state.punishCollateral = sync.punishCollateral ?? false;
  if (sync.skillReturnPhase) state.skillReturnPhase = sync.skillReturnPhase;
  state.skillFlash = sync.skillFlash ?? null;
}
