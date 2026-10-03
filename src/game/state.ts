import { assignRoles, getRole, isRoleAvailable, ROLES, type RoleDef, type SkillKind } from "./roles";
import type { WolfState } from "./wolf";
import { createRng, newSeed, rngInt, shuffleInPlace } from "./rng";
import { getFlipQuestion, questionsForCat, type FlipQuestion } from "./flipQuestions";
import {
  getKingCmd,
  kingNeed,
  KING_CMDS,
  NEVER_PROMPTS,
  WHEEL,
  type KingKind,
} from "./party";
import { CHAOS_CARDS, TRUTH_QUESTIONS, WHO_QUESTIONS, fillPunish } from "./partyPlay";
import { REACT_CARDS, REACT_COLORS, REACT_DECOYS, pickMatchFaces, type ReactColor } from "./reactCards";
import { LINER_EFFECTS, LINER_SITUATIONS } from "./oneliner";
import { ARTIST_SETS } from "./artist";

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
  | "artist"
  | "oneliner"
  | "wolf"
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
  | "wheel"
  | "artist"
  | "oneliner"
  | "wolf";

export type FlipSubPhase = "choose" | "result";

export type FlipRule = "majority" | "minority" | "solo" | "allsame";
export const FLIP_RULES: FlipRule[] = ["majority", "minority", "solo", "allsame"];
export function flipRuleLabel(r: FlipRule): string {
  if (r === "majority") return "多數懲罰";
  if (r === "minority") return "少數懲罰";
  if (r === "solo") return "單獨一人懲罰";
  return "全部相同懲罰";
}

export function flipRuleHint(r: FlipRule): string {
  if (r === "majority") return "人多的那一邊受罰";
  if (r === "minority") return "人少的那一邊受罰";
  if (r === "solo") return "只有一個人不同邊，那個人受罰";
  return "全員選同一邊，一起受罰";
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
  passed: string[];
  sub: "ask" | "result";
  readyIds: string[];
  allDeny: boolean;
}

export interface OneLinerState {
  sub: "setup" | "spin" | "prompt" | "judge" | "reveal" | "rank";
  perPlayer: number;
  order: string[];
  round: number;
  seat: number;
  sitDeck: number[];
  effDeck: number[];
  cursor: number;
  situation: string;
  effect: string;
  line: string;
  votes: Record<string, boolean>;
  scores: Record<string, number>;
  readyIds: string[];
  boom: boolean;
  success: boolean;
  deadline: number;
  best: string[];
  worst: string[];
}

export interface ArtistState {
  deck: string[];
  index: number;
  sub: "order" | "pick" | "draw" | "guess" | "result";
  order: string[];
  artistId: string;
  choices: string[];
  answer: string;
  options: string[];
  strokes: number[][];
  guesses: Record<string, string>;
  wrongIds: string[];
  /** True only when nobody guessed the answer. Skills may add the painter later. */
  allMissed: boolean;
  faults: Record<string, number>;
  drawStart: number;
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
  readyIds: string[];
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

export type ReactSticker = "cat" | "dog" | "cow" | "panda";
export interface ReactState {
  sub: "ready" | "count" | "play" | "between" | "result" | "drag";
  hard: boolean;
  ready: string[];
  count: number;
  arm: number;
  beat: number;
  card: number;
  color: string;
  file: string;
  sticker: ReactSticker | null;
  need: ReactSticker | null;
  stickerX: number;
  stickerY: number;
  tempo: number;
  hold: boolean;
  dead: string[];
  tapped: string[];
  slips: string[];
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
  size: 8 | 12 | 18;
  cols: number;
  sub: "size" | "spin" | "play" | "next" | "result";
  tiles: MatchTile[];
  pick: number[];
  scores: Record<string, number>;
  turn: string;
  swapped: string[];
  swapping: boolean;
  swapBurst: boolean;
  swapBy: string | null;
  swapPick: number[];
  flash: string | null;
  lock: boolean;
  found: number;
  pairs: number;
  round: number;
  roundMax: number;
  losers: string[];
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
  joinNext?: boolean;
  backupWith?: string;
  backupHold?: boolean;
  punishStreak?: number;
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
  seatAlias: Record<string, string>;
  skillPending: boolean;
  ceremonyStep: number;
  flip: FlipBattleState | null;
  skillMessage: string;
  king: KingState | null;
  never: NeverState | null;
  wheel: WheelState | null;
  artist: ArtistState | null;
  oneliner: OneLinerState | null;
  who: WhoState | null;
  truth: TruthState | null;
  react: ReactState | null;
  reactLock: { color: string; need: ReactSticker | null } | null;
  match: MatchState | null;
  award: AwardState | null;
  wolf: WolfState | null;
  hitAmt: Record<string, number>;
  chaos: ChaosBuff | null;
  punishLabel: string;
  practice: boolean;
  allow18: boolean;
  flipCat: string | null;
  modeFocus: number;
  modeArm: GameMode | null;
  gateReady: string[];
  punishQueue: string[];
  punishAmt: number;
  punishActorId: string | null;
  punishCollateral: boolean;
  skillReturnPhase: Phase;
  skillFlash: { roleId: string; name: string; skill: string; desc?: string; msg: string } | null;
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
    seatAlias: {},
    skillPending: false,
    ceremonyStep: 0,
    flip: null,
    skillMessage: "",
    king: null,
    never: null,
    wheel: null,
    artist: null,
    oneliner: null,
    who: null,
    truth: null,
    react: null,
    reactLock: null,
    match: null,
    award: null,
    wolf: null,
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
    modeFocus: 0,
    modeArm: null,
    gateReady: [],
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

export function isHere(p: Player): boolean {
  return Boolean(p.isBot) || p.connected !== false;
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
    if (p.handoffId) {
      const hid = p.handoffId;
      p.handoffId = null;
      if (hid && hid !== id) addCups(state, [hid], n * 3);
      continue;
    }
    let share = n;
    if (p.backupWith && !p.backupHold) {
      const otherId = p.backupWith;
      p.backupWith = undefined;
      const half = n / 2;
      if (otherId && otherId !== p.id) addCups(state, [otherId], half);
      share = half;
    }
    const m = p.nextMult ?? 1;
    p.nextMult = 1;
    if (m === 0) continue;
    const add = (share + bonus) * m;
    p.cups = (p.cups || 0) + add;
    state.hitAmt[p.id] = (state.hitAmt[p.id] ?? 0) + add;
  }
}

function touchPunishList(list: string[] | undefined, id: string, on: boolean) {
  if (!list) return;
  const i = list.indexOf(id);
  if (on && i < 0) list.push(id);
  if (!on && i >= 0) list.splice(i, 1);
}

function setPunishBorder(state: GameState, id: string, on: boolean) {
  touchPunishList(state.flip?.drinkerIds, id, on);
  touchPunishList(state.who?.punishedIds, id, on);
  touchPunishList(state.match?.losers, id, on);
  touchPunishList(state.artist?.wrongIds, id, on);
  if (!on) {
    state.hitAmt[id] = 0;
    state.punishQueue = state.punishQueue.filter((x) => x !== id);
  }
}

export function spendSkipToken(state: GameState, pid: string): string {
  const me = state.players.find((p) => p.id === pid);
  if (!me?.skipToken) return "";
  if (!currentDrinkers(state).includes(pid)) return "";
  me.skipToken = false;
  me.punishStreak = Math.max(0, (me.punishStreak ?? 1) - 1);
  setPunishBorder(state, pid, false);
  if (state.react) state.react.dead = state.react.dead.filter((id) => id !== pid);
  return `${me.name} 選擇這次免罰`;
}

export function autoBotSkip(state: GameState): boolean {
  const bot = state.players.find((p) => p.isBot && p.skipToken && currentDrinkers(state).includes(p.id));
  if (!bot) return false;
  const msg = spendSkipToken(state, bot.id);
  if (!msg) return false;
  state.skillMessage = msg;
  return true;
}

export function spendCoverRepay(state: GameState, pid: string): string {
  const me = state.players.find((p) => p.id === pid);
  if (!me?.oweCover) return "";
  const other = state.players.find((p) => p.id === me.oweCover);
  if (!other || other.id === me.id) return "";
  const n = state.hitAmt[me.id] || state.punishAmt || 1;
  me.oweCover = undefined;
  me.coverFor = undefined;
  state.hitAmt[me.id] = 0;
  state.punishQueue = state.punishQueue.filter((id) => id !== me.id);
  if (state.flip) state.flip.drinkerIds = state.flip.drinkerIds.filter((id) => id !== me.id);
  if (state.who) state.who.punishedIds = state.who.punishedIds.filter((id) => id !== me.id);
  if (state.react) state.react.dead = state.react.dead.filter((id) => id !== me.id);
  addCups(state, [other.id], n);
  if (state.flip && !state.flip.drinkerIds.includes(other.id)) state.flip.drinkerIds.push(other.id);
  if (state.who && !state.who.punishedIds.includes(other.id)) state.who.punishedIds.push(other.id);
  return `${me.name} 選擇由 ${other.name} 代替這次受罰`;
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
  if (kind === "protect") return true;
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

export function botCanSkill(state: GameState, pid: string): boolean {
  if (state.phase === "react" || state.mode === "react" || state.phase === "skill" || state.skillFlash) return false;
  const p = state.players.find((x) => x.id === pid);
  if (!p?.isBot || p.skillUsed) return false;
  const kind = getRole(p.roleId).skillKind;
  if (kind === "none") return false;
  const drinkers = currentDrinkers(state);
  if (kind === "cover" || kind === "backup" || kind === "soothe") return drinkers.some((id) => id !== pid);
  if (kind === "restock") return drinkers.length > 0;
  if (kind === "hedge") return drinkers.includes(pid) && (p.punishStreak ?? 0) >= 2;
  return drinkers.includes(pid);
}

export function castBotSkill(state: GameState): boolean {
  const me = state.players.find((p) => botCanSkill(state, p.id));
  if (!me) return false;
  const kind = getRole(me.roleId).skillKind;
  const others = state.players.filter((p) => p.id !== me.id);
  const drinkers = currentDrinkers(state).filter((id) => id !== me.id);
  const punished = state.players.filter((p) => drinkers.includes(p.id));
  const pool =
    kind === "cover" || kind === "backup" || kind === "soothe"
      ? punished
      : kind === "restock" && !drinkers.includes(me.id) && !currentDrinkers(state).includes(me.id)
        ? punished
        : others;
  const needsTarget =
    kind === "exam" ||
    kind === "split" ||
    kind === "hedge" ||
    kind === "backup" ||
    kind === "cover" ||
    kind === "protect" ||
    kind === "patrol" ||
    kind === "contract" ||
    kind === "restock" ||
    kind === "soothe";
  const target = needsTarget ? pool[Math.floor(Math.random() * Math.max(1, pool.length))]?.id : undefined;
  if (needsTarget && !target) return false;
  if (state.phase !== "skill") state.skillReturnPhase = state.phase;
  state.punishActorId = me.id;
  const msg = applySkill(state, kind, target, "go");
  if (msg.startsWith("請選擇")) return false;
  continueAfterSkill(state, msg);
  return true;
}

export function canUseSkillNow(state: GameState, pid: string | null | undefined): boolean {
  if (state.phase === "react" || state.mode === "react") return false;
  if (!pid) return false;
  const p = state.players.find((x) => x.id === pid);
  if (!p || p.skillUsed || p.isBot) return false;
  const kind = getRole(p.roleId).skillKind;
  if (kind === "none") return false;
  const drinkers = currentDrinkers(state);
  if (kind === "cover" || kind === "backup" || kind === "soothe") return drinkers.some((id) => id !== pid);
  if (kind === "restock") return drinkers.length > 0;
  if (kind === "hedge") return drinkers.includes(pid) && (p.punishStreak ?? 0) >= 2;
  if (kind === "protect") return drinkers.includes(pid);
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
  for (const p of state.players) {
    if (p.backupHold) p.backupHold = false;
  }
  if (list.length) {
    for (const p of state.players) {
      if (!p.joinNext) continue;
      if (!list.includes(p.id)) list.push(p.id);
      p.joinNext = false;
    }
  }
  const punishedNow = new Set(list);
  for (const p of state.players) {
    p.punishStreak = punishedNow.has(p.id) ? (p.punishStreak ?? 0) + 1 : 0;
  }
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

export function clearGate(state: GameState): void {
  state.gateReady = [];
}

export function gateOpen(state: GameState): boolean {
  if (state.phase === "truth" && (state.truth?.sub === "result" || state.truth?.sub === "drag")) return true;
  if (state.phase === "artist" && state.artist?.sub === "result") return true;
  if (state.phase === "react" && (state.react?.sub === "between" || state.react?.sub === "result" || state.react?.sub === "drag")) return true;
  if (state.phase === "king" && state.king?.sub === "resolve") return true;
  if (state.phase === "wheel" && state.wheel?.sub === "resolve") return true;
  if (state.phase === "match" && state.match?.sub === "result") return true;
  if (state.phase === "award") return true;
  return false;
}

export function markGateReady(state: GameState, pid: string): void {
  if (!pid || !gateOpen(state)) return;
  if (!state.players.some((p) => p.id === pid)) return;
  if (!state.gateReady) state.gateReady = [];
  if (!state.gateReady.includes(pid)) state.gateReady.push(pid);
}

export function launchCoreMode(state: GameState, mode: GameMode, fromChaos = false): void {
  clearGate(state);
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
  else if (mode === "never") startNever(state);
  else if (mode === "artist") startArtist(state);
  else if (mode === "oneliner") startOneLiner(state);
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
    readyIds: [],
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
  if (!id || id in who.votes || id === targetId) return;
  if (!state.players.some((p) => p.id === targetId)) return;
  who.votes[id] = targetId;
  whoClose(state);
}

function whoClose(state: GameState): void {
  const who = state.who;
  if (!who || who.sub !== "vote") return;
  const present = state.players.filter(isHere);
  if (!present.length || !present.every((p) => p.id in who.votes)) return;
  const punished = present
    .filter((p) => present.every((o) => o.id === p.id || who.votes[o.id] === p.id))
    .map((p) => p.id);
  if (punished.length) {
    who.punishedIds = settlePunish(state, punished, 1);
    who.sub = state.chaos?.drag && who.punishedIds.length ? "drag" : "result";
  } else {
    who.punishedIds = [];
    who.sub = "result";
    state.hitAmt = {};
    state.punishQueue = [];
    state.punishActorId = null;
  }
  who.voterId = null;
}

export function whoMarkReady(state: GameState, pid: string): void {
  const who = state.who;
  if (!who || who.sub !== "result" || !pid) return;
  if (!who.readyIds) who.readyIds = [];
  if (!state.players.some((p) => p.id === pid)) return;
  if (!who.readyIds.includes(pid)) who.readyIds.push(pid);
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
  state.who.readyIds = [];
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
  clearGate(state);
  t.sub = took === "punish" && state.chaos?.drag ? "drag" : "result";
}

export function truthAdvance(state: GameState): void {
  if (!state.truth) return;
  clearGate(state);
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
    arm: 0,
    beat: 0,
    card: 0,
    color: "lime",
    file: REACT_CARDS[0]?.file ?? "",
    sticker: null,
    need: null,
    stickerX: 50,
    stickerY: 50,
    tempo: 2000,
    hold: false,
    dead: [],
    tapped: [],
    slips: [],
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
  if (!r || r.sub !== "ready" || !pid) return;
  if (!r.ready.includes(pid)) r.ready.push(pid);
  state.players.filter((p) => p.isBot).forEach((p) => {
    if (!r.ready.includes(p.id)) r.ready.push(p.id);
  });
  const need = state.players.filter(isHere);
  if (!need.length || !need.every((p) => r.ready.includes(p.id))) return;
  Object.assign(r, pickReactBeat(state, r.hard));
  r.card += 1;
  r.sub = "count";
  r.count = 3;
  r.arm = Date.now();
  r.beat = 0;
  r.tempo = 2000;
  r.dead = [];
  r.tapped = [];
  r.slips = [];
  r.hold = false;
}

function ensureReactLock(state: GameState, hard: boolean): { color: string; need: ReactSticker | null } {
  const stickers: ReactSticker[] = ["cat", "dog", "cow", "panda"];
  if (!state.reactLock) {
    state.reactLock = {
      color: REACT_COLORS[Math.floor(Math.random() * REACT_COLORS.length)]!,
      need: hard ? stickers[Math.floor(Math.random() * stickers.length)]! : null,
    };
    return state.reactLock;
  }
  if (hard && !state.reactLock.need) {
    state.reactLock = {
      ...state.reactLock,
      need: stickers[Math.floor(Math.random() * stickers.length)]!,
    };
  }
  return state.reactLock;
}

function pickReactBeat(state: GameState, hard: boolean): Pick<ReactState, "color" | "file" | "sticker" | "need" | "stickerX" | "stickerY"> {
  const lock = ensureReactLock(state, hard);
  const target = lock.color;
  const need = hard ? lock.need : null;
  const roll = Math.random();
  let file: string;
  if (roll < 0.4) {
    const pool = REACT_CARDS.filter((c) => c.color === target);
    file = pool[Math.floor(Math.random() * pool.length)]!.file;
  } else if (roll < 0.64 && REACT_DECOYS.length) {
    const traps = REACT_DECOYS.filter((d) => d.looks === target);
    const pool = traps.length ? traps : REACT_DECOYS;
    file = pool[Math.floor(Math.random() * pool.length)]!.file;
  } else {
    const shown = REACT_COLORS.filter((c) => c !== target)[Math.floor(Math.random() * (REACT_COLORS.length - 1))]!;
    const pool = REACT_CARDS.filter((c) => c.color === shown);
    file = pool[Math.floor(Math.random() * pool.length)]!.file;
  }
  const stickers: ReactSticker[] = ["cat", "dog", "cow", "panda"];
  let sticker: ReactSticker | null = null;
  if (hard && need) {
    const matchSticker = Math.random() < 0.45;
    const wrong = stickers.filter((s) => s !== need);
    sticker = matchSticker ? need : wrong[Math.floor(Math.random() * wrong.length)]!;
  }
  return {
    color: target,
    file,
    sticker,
    need,
    stickerX: 28 + Math.random() * 44,
    stickerY: 26 + Math.random() * 48,
  };
}

export function reactTickCount(state: GameState): void {
  const r = state.react;
  if (!r || r.sub !== "count") return;
  if (!r.file) {
    Object.assign(r, pickReactBeat(state, r.hard));
    r.card += 1;
  }
  r.sub = "play";
  r.count = 0;
  r.tapped = [];
}

export function reactMustTap(r: ReactState): boolean {
  const shown = r.file.split("-")[0];
  const colorOk = shown === r.color;
  const stickerOk = !r.hard || r.sticker === r.need;
  return colorOk && stickerOk;
}

function settleReact(state: GameState): void {
  const r = state.react;
  if (!r) return;
  const counts: Record<string, number> = {};
  for (const id of r.slips) counts[id] = (counts[id] ?? 0) + 1;
  const ids = Object.keys(counts);
  r.dead = ids;
  r.punished = ids.length > 0;
  r.sub = "result";
  r.hold = false;
  if (r.punished) {
    settlePunish(state, ids, 1);
    for (const id of ids) {
      const times = counts[id] ?? 1;
      state.hitAmt[id] = (state.hitAmt[id] ?? 0) * times;
    }
    state.punishAmt = Math.max(1, ...Object.values(counts));
  }
  state.reactLock = null;
}

function endReactRound(state: GameState, losers: string[]): void {
  const r = state.react;
  if (!r || r.sub !== "play") return;
  const ids = [...new Set(losers.filter(Boolean))];
  r.dead = ids;
  r.slips.push(...ids);
  r.hold = false;
  r.punished = ids.length > 0;
  r.sub = "result";
  clearGate(state);
  state.reactLock = null;
  if (ids.length) settlePunish(state, ids, 1);
}

function reactNextCard(state: GameState): void {
  const r = state.react;
  if (!r || r.sub !== "play") return;
  Object.assign(r, pickReactBeat(state, r.hard));
  r.card += 1;
  r.tapped = [];
  r.hold = false;
  r.tempo = Math.max(600, r.tempo - 100);
}

export function reactFail(state: GameState, pid: string): void {
  const r = state.react;
  if (!r || r.sub !== "play") return;
  endReactRound(state, [pid]);
}

export function reactTap(state: GameState, pid: string): "miss" | "ok" | "ignore" {
  const r = state.react;
  if (!r || r.sub !== "play") return "ignore";
  if (!pid || r.tapped.includes(pid)) return "ignore";
  if (!reactMustTap(r)) {
    reactFail(state, pid);
    return "miss";
  }
  r.tapped.push(pid);
  if (state.players.filter(isHere).every((p) => r.tapped.includes(p.id))) r.hold = true;
  return "ok";
}

export function reactRelease(state: GameState): void {
  const r = state.react;
  if (!r || r.sub !== "play" || !r.hold) return;
  r.hold = false;
  reactNextCard(state);
}

export function reactTimeout(state: GameState): void {
  const r = state.react;
  if (!r || r.sub !== "play" || r.hold) return;
  if (!reactMustTap(r)) {
    reactNextCard(state);
    return;
  }
  const missed = state.players.filter((p) => !r.tapped.includes(p.id)).map((p) => p.id);
  endReactRound(state, missed);
}

export function reactContinue(state: GameState): void {
  const r = state.react;
  if (!r || r.sub !== "between") return;
  if (r.beat + 1 >= 3) {
    settleReact(state);
    return;
  }
  r.beat += 1;
  state.reactLock = null;
  Object.assign(r, pickReactBeat(state, r.hard));
  r.card += 1;
  r.sub = "count";
  r.count = 3;
  r.arm = Date.now();
  r.tempo = 2000;
  r.hold = false;
  r.dead = [];
  r.tapped = [];
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
    clearGate(state);
  }
}

export function goAward(state: GameState): void {
  clearGate(state);
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
    swapBurst: false,
    swapBy: null,
    swapPick: [],
    flash: null,
    lock: false,
    found: 0,
    pairs: 0,
    round: 0,
    roundMax: 1,
    losers: [],
  };
}

export function matchDeal(state: GameState, size: 8 | 12 | 18): void {
  const m = state.match;
  if (!m) return;
  const pairs = size;
  const cols = size === 8 ? 4 : 6;
  const faces = pickMatchFaces(pairs);
  const keys: MatchTile[] = faces.map((c, i) => ({
    key: `${c.color}:${c.file}:${i}`,
    file: c.file,
    color: c.color,
    open: false,
    matched: false,
  }));
  const doubled = [
    ...keys.map((k) => ({ ...k, key: `${k.key}:a` })),
    ...keys.map((k) => ({ ...k, key: `${k.key}:b` })),
  ];
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j]!, doubled[i]!];
  }
  m.size = size;
  m.cols = cols;
  m.sub = "spin";
  m.tiles = doubled;
  m.pick = [];
  m.found = 0;
  m.pairs = pairs;
  m.scores = Object.fromEntries(state.players.map((p) => [p.id, 0]));
  m.round = 1;
  m.losers = [];
  const start = state.players[Math.floor(Math.random() * Math.max(1, state.players.length))];
  m.turn = start?.id ?? state.players[0]?.id ?? "";
  m.swapped = [];
  m.swapping = false;
  m.swapBurst = false;
  m.swapBy = null;
  m.swapPick = [];
  m.flash = null;
  m.lock = false;
}

export function matchArm(state: GameState): void {
  const m = state.match;
  if (!m || m.sub !== "spin") return;
  m.sub = "play";
}

export function matchBeginSwap(state: GameState, pid: string): void {
  const m = state.match;
  if (!m || m.sub !== "play" || m.lock) return;
  if (m.turn !== pid) return;
  if (m.swapped.includes(pid) || m.swapping) return;
  const closed = m.tiles.filter((t) => !t.matched && !t.open).length;
  if (closed < 2) return;
  m.swapping = true;
  m.swapBurst = true;
  m.swapBy = pid;
  m.swapPick = [];
  m.flash = null;
  const who = state.players.find((p) => p.id === pid);
  if (who) {
    state.skillFlash = {
      roleId: who.roleId,
      name: who.name.replace(/^電腦[·・]/, ""),
      skill: "調換",
      msg: "點兩張蓋著的牌對調。卡背會亮黃，只有你看得到。牌面不亮。",
    };
  }
}

export function matchSwapReady(state: GameState): void {
  const m = state.match;
  if (!m?.swapping || !m.swapBurst) return;
  m.swapBurst = false;
  if (state.skillFlash?.skill === "調換") state.skillFlash = null;
}

export function matchCancelSwap(state: GameState): void {
  const m = state.match;
  if (!m?.swapping) return;
  const closed = m.tiles.filter((t) => !t.matched && !t.open).length;
  if (closed >= 2) return;
  m.swapping = false;
  m.swapBurst = false;
  m.swapBy = null;
  m.swapPick = [];
  m.flash = null;
  if (state.skillFlash?.skill === "調換") state.skillFlash = null;
}

export function matchCommitSwap(state: GameState): void {
  const m = state.match;
  if (!m?.swapping || m.swapPick.length !== 2) return;
  const [a, b] = m.swapPick;
  const tmp = m.tiles[a!]!;
  m.tiles[a!] = m.tiles[b!]!;
  m.tiles[b!] = tmp;
  if (m.swapBy) m.swapped.push(m.swapBy);
  m.swapping = false;
  m.swapBurst = false;
  m.swapBy = null;
  m.swapPick = [];
  m.flash = null;
}

export function matchTap(state: GameState, i: number, pid: string): void {
  const m = state.match;
  if (!m || m.sub !== "play" || m.lock) return;
  if (m.turn !== pid) return;
  if (state.punishQueue.length && !m.swapping) flushPunish(state);
  if (m.swapping && m.swapBy === pid) {
    if (m.swapBurst) return;
    if (m.swapPick.length >= 2) return;
    const tile = m.tiles[i];
    if (!tile || tile.matched || tile.open) return;
    if (m.swapPick.includes(i)) {
      m.swapPick = m.swapPick.filter((x) => x !== i);
      return;
    }
    m.swapPick = [...m.swapPick, i];
    return;
  }
  if (m.pick.length >= 2) return;
  const tile = m.tiles[i];
  if (!tile || tile.matched || tile.open) return;
  tile.open = true;
  m.pick = [...m.pick, i];
  if (m.pick.length < 2) return;
  const [a, b] = m.pick;
  if (m.tiles[a!]!.file === m.tiles[b!]!.file && m.tiles[a!]!.color === m.tiles[b!]!.color) {
    m.tiles[a!]!.matched = true;
    m.tiles[b!]!.matched = true;
    m.scores[pid] = (m.scores[pid] ?? 0) + 1;
    m.found += 1;
    m.pick = [];
    if (m.found >= m.pairs) {
      const scored = Object.fromEntries(state.players.map((p) => [p.id, m.scores[p.id] ?? 0]));
      const min = Math.min(...Object.values(scored));
      const losers = Object.entries(scored)
        .filter(([, v]) => v === min)
        .map(([k]) => k);
      m.losers = losers;
      settlePunish(state, losers, 1);
      clearGate(state);
      m.sub = "result";
    }
    return;
  }
  m.lock = true;
}

export function matchAgain(state: GameState): void {
  const size = state.match?.size ?? 8;
  flushPunish(state);
  startMatch(state);
  matchDeal(state, size);
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

export function reactAgain(state: GameState): void {
  const hard = state.react?.hard ?? false;
  flushPunish(state);
  state.reactLock = null;
  startReact(state);
  const r = state.react;
  if (!r) return;
  r.hard = hard;
  r.sub = "ready";
  r.ready = [];
  r.dead = [];
  r.tapped = [];
  r.slips = [];
  r.punished = false;
  r.beat = 0;
  r.hold = false;
  r.count = 3;
}

function dealArtistChoices(state: GameState, a: ArtistState): void {
  const rng = createRng(`${state.seed}:artist:${a.index}`);
  const setId = a.deck[a.index % a.deck.length] ?? "0";
  const trio = [...(ARTIST_SETS[Number(setId)] ?? ARTIST_SETS[0]!)];
  shuffleInPlace(trio, rng);
  a.choices = trio;
  a.answer = "";
  a.options = [];
  a.strokes = [];
  a.guesses = {};
  a.wrongIds = [];
  a.allMissed = false;
  a.drawStart = 0;
  const n = Math.max(1, a.order.length);
  a.artistId = a.order[a.index % n] ?? state.players[0]?.id ?? "";
}

export function startArtist(state: GameState): void {
  const rng = createRng(`${state.seed}:artist-deck:${state.drawCount}`);
  const deck = ARTIST_SETS.map((_, i) => String(i));
  shuffleInPlace(deck, rng);
  const order = state.players.map((p) => p.id);
  shuffleInPlace(order, rng);
  const artist: ArtistState = {
    deck,
    index: 0,
    sub: "order",
    order,
    artistId: order[0] ?? "",
    choices: [],
    answer: "",
    options: [],
    strokes: [],
    guesses: {},
    wrongIds: [],
    allMissed: false,
    faults: {},
    drawStart: 0,
  };
  dealArtistChoices(state, artist);
  state.mode = "artist";
  state.phase = "artist";
  state.artist = artist;
  state.flip = null;
  state.who = null;
  state.truth = null;
  state.react = null;
  state.never = null;
  state.king = null;
  state.wheel = null;
  state.match = null;
}

export function artistOrderReady(state: GameState): void {
  const a = state.artist;
  if (!a || a.sub !== "order") return;
  a.sub = "pick";
}

export function artistPickWord(state: GameState, pid: string, wordId: string): void {
  const a = state.artist;
  if (!a || a.sub !== "pick" || !pid || pid !== a.artistId) return;
  if (!a.choices.includes(wordId)) return;
  const rng = createRng(`${state.seed}:artist-opt:${a.index}:${wordId}`);
  const options = [...a.choices];
  shuffleInPlace(options, rng);
  a.answer = wordId;
  a.options = options;
  a.strokes = [];
  a.drawStart = Date.now();
  a.sub = "draw";
}

export function artistUndo(state: GameState, pid?: string): void {
  const a = state.artist;
  if (!a || a.sub !== "draw") return;
  if (pid && pid !== a.artistId) return;
  a.strokes.pop();
}

export function artistAddStroke(state: GameState, pid: string, pts: number[]): void {
  const a = state.artist;
  if (!a || a.sub !== "draw" || !pid || pid !== a.artistId) return;
  if (pts.length < 4 || a.strokes.length > 80) return;
  a.strokes.push(pts.slice(0, 160));
}

export function artistStopDraw(state: GameState, pid?: string): void {
  const a = state.artist;
  if (!a || a.sub !== "draw") return;
  if (pid && pid !== a.artistId) return;
  a.sub = "guess";
}

export function artistGuess(state: GameState, pid: string, optionId: string): void {
  const a = state.artist;
  if (!a || a.sub !== "guess" || !pid || pid === a.artistId) return;
  if (!a.options.includes(optionId)) return;
  a.guesses[pid] = optionId;
  const guessers = state.players.filter((p) => isHere(p) && p.id !== a.artistId);
  if (guessers.length === 0 || guessers.every((p) => a.guesses[p.id])) artistResolve(state);
}

function artistResolve(state: GameState): void {
  const a = state.artist;
  if (!a || a.sub !== "guess") return;
  const guessers = state.players.filter((p) => isHere(p) && p.id !== a.artistId);
  const missed = guessers.filter((p) => a.guesses[p.id] !== a.answer).map((p) => p.id);
  const anyRight = guessers.some((p) => a.guesses[p.id] === a.answer);
  const wrong = anyRight ? missed : a.artistId ? [a.artistId] : [];
  a.wrongIds = wrong;
  a.allMissed = !anyRight;
  if (!a.faults) a.faults = {};
  for (const id of wrong) a.faults[id] = (a.faults[id] ?? 0) + 1;
  a.sub = "result";
  clearGate(state);
  state.drawCount += 1;
  if (wrong.length) settlePunish(state, wrong, 1);
  else {
    state.hitAmt = {};
    state.punishQueue = [];
    state.punishActorId = null;
  }
}

export function artistAdvance(state: GameState): void {
  const a = state.artist;
  if (!a) return;
  clearGate(state);
  flushPunish(state);
  state.skillFlash = null;
  a.index += 1;
  dealArtistChoices(state, a);
  a.sub = "pick";
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
      if (me) {
        me.nextMult = 2;
        setPunishBorder(state, me.id, false);
      }
      return `${me?.name} 摸魚！這次免罰，下次被抓到懲罰加倍`;
    case "exam": {
      if (!target || !me || target.id === me.id) return "請選擇其他玩家";
      mark();
      const once = (state.hitAmt[me.id] ?? 0) > 0 ? state.hitAmt[me.id]! : amt;
      me.cups = (me.cups || 0) + once;
      state.hitAmt[me.id] = once;
      state.punishQueue = state.punishQueue.filter((id) => id !== me.id);
      setPunishBorder(state, me.id, true);
      applyWithProtect(state, [target.id], amt * 2);
      setPunishBorder(state, target.id, true);
      return `${me.name} 考績！自己維持原懲罰，${target.name} 承受兩次`;
    }
    case "treat_all":
      mark();
      applyWithProtect(
        state,
        state.players.map((p) => p.id),
        amt,
      );
      for (const p of state.players) setPunishBorder(state, p.id, true);
      return `${me?.name} 我請客！全桌一起受罰`;
    case "protect": {
      if (!target || !me) return "請其他玩家指派";
      mark();
      me.collateralHit = false;
      state.hitAmt[me.id] = 0;
      setPunishBorder(state, me.id, false);
      return `${me.name} 免除這次懲罰，大家指派去幫 ${target.name} 做一件事`;
    }
    case "split": {
      if (!target || !me) return "請選擇平分對象";
      mark();
      const half = amt / 2;
      addCups(state, [me.id], half);
      applyWithProtect(state, [target.id], half);
      setPunishBorder(state, target.id, true);
      return `${me.name} 一人一半！與 ${target.name} 各承擔一半`;
    }
    case "able": {
      mark();
      if (me) {
        me.joinNext = true;
        state.hitAmt[me.id] = 0;
        setPunishBorder(state, me.id, false);
      }
      return `${me?.name} 能者多勞！這次免罰，下一回合陪受罰的人一起罰`;
    }
    case "hedge": {
      if (!target || !me) return "請選擇";
      if ((me.punishStreak ?? 0) < 2) return "請選擇";
      mark();
      const n = state.hitAmt[me.id] || amt || 1;
      me.punishStreak = 0;
      state.hitAmt[me.id] = 0;
      state.punishQueue = state.punishQueue.filter((id) => id !== me.id);
      setPunishBorder(state, me.id, false);
      addCups(state, [target.id], n);
      setPunishBorder(state, target.id, true);
      return `風險對沖！${me.name} 連續第二次受罰，改由 ${target.name} 承擔`;
    }
    case "backup": {
      if (!target || !me) return "請選擇";
      mark();
      const n = state.hitAmt[target.id] || amt || 1;
      const half = n / 2;
      state.punishQueue = state.punishQueue.filter((id) => id !== target.id);
      state.hitAmt[target.id] = 0;
      addCups(state, [target.id], half);
      me.backupWith = target.id;
      me.backupHold = true;
      return `緊急備援！${target.name} 這次減半，下次你受罰由對方自動分攤一半`;
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
      me.oweCover = target.id;
      const n = state.hitAmt[target.id] ?? amt;
      target.cups = Math.max(0, (target.cups || 0) - n);
      me.cups = (me.cups || 0) + n;
      state.hitAmt[target.id] = 0;
      state.hitAmt[me.id] = (state.hitAmt[me.id] ?? 0) + n;
      state.punishQueue = state.punishQueue.filter((id) => id !== target.id);
      setPunishBorder(state, target.id, false);
      setPunishBorder(state, me.id, true);
      return `${me.name} 替 ${target.name} 擋酒！之後你受罰時，可選擇由對方代替一次`;
    }
    case "veteran": {
      mark();
      if (me) {
        if (amt >= 2) addCups(state, [me.id], 1);
        else addCups(state, [me.id], 0.5);
      }
      return amt >= 2 ? `${me?.name} 見過大場面，降回 1 份` : `${me?.name} 見過大場面，減半`;
    }
    case "patrol": {
      if (!target || !me || target.id === me.id) return "請選擇其他玩家";
      mark();
      const n = (state.hitAmt[me.id] ?? 0) || amt;
      me.cups = (me.cups || 0) + n;
      state.hitAmt[me.id] = n;
      state.punishQueue = state.punishQueue.filter((id) => id !== me.id);
      setPunishBorder(state, me.id, true);
      const prev = state.hitAmt[target.id] ?? 0;
      target.cups = (target.cups || 0) + n;
      state.hitAmt[target.id] = prev + n;
      setPunishBorder(state, target.id, true);
      return `${me.name} 盤查！自己照罰，${target.name} 一起受罰`;
    }
    case "inspect": {
      if (!me) return "請選擇";
      const pool = state.players.filter((p) => p.id !== me.id);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (!pick) return "請選擇";
      mark();
      const n = (state.hitAmt[me.id] ?? 0) || amt;
      setPunishBorder(state, me.id, false);
      pick.cups = (pick.cups || 0) + n;
      state.hitAmt[pick.id] = (state.hitAmt[pick.id] ?? 0) + n;
      setPunishBorder(state, pick.id, true);
      return `抽檢！${me.name} 這次免罰，改由 ${pick.name} 受罰`;
    }
    case "soothe": {
      if (!target || !me || target.id === me.id) return "請選擇其他玩家";
      mark();
      setPunishBorder(state, target.id, false);
      me.joinNext = true;
      return `${me.name} 安撫 ${target.name}，這次免罰；你下一輪陪罰`;
    }
    case "contract": {
      if (!target || !me || target.id === me.id) return "請選擇其他玩家";
      mark();
      const n = (state.hitAmt[me.id] ?? 0) || amt;
      setPunishBorder(state, me.id, false);
      target.cups = (target.cups || 0) + n;
      state.hitAmt[target.id] = (state.hitAmt[target.id] ?? 0) + n;
      setPunishBorder(state, target.id, true);
      return `合約生效！${me.name} 免罰，改由 ${target.name} 承擔`;
    }
    case "restock": {
      if (!target || !me || target.id === me.id) return "請選擇其他玩家";
      const a = state.hitAmt[me.id] || 0;
      const b = state.hitAmt[target.id] || 0;
      if (a === 0 && b === 0) return "請選擇";
      mark();
      setPunishBorder(state, me.id, false);
      setPunishBorder(state, target.id, false);
      if (b > 0) {
        me.cups = (me.cups || 0) + b;
        state.hitAmt[me.id] = b;
        setPunishBorder(state, me.id, true);
      }
      if (a > 0) {
        target.cups = (target.cups || 0) + a;
        state.hitAmt[target.id] = a;
        setPunishBorder(state, target.id, true);
      }
      return `調貨！${me.name} 與 ${target.name} 對調這次罰量`;
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
      desc: getRole(me.roleId).skillDesc,
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
  const rng = createRng(`${state.seed}:flip:${state.drawCount}`);
  const pool = questionsForCat(null, true);
  const ids = pool.map((q) => q.id);
  shuffleInPlace(ids, rng);
  const answerer = state.players.length > 0 ? state.players[0]!.id : null;
  const take = Math.min(16, ids.length);
  const deck = ids.slice(0, take);
  const rules: FlipRule[] = deck.map(() => FLIP_RULES[rngInt(rng, FLIP_RULES.length)]!);
  state.mode = "flip_battle";
  state.phase = "flip_battle";
  state.flip = {
    deck,
    index: 0,
    sub: "choose",
    votes: {},
    readyIds: [],
    answererId: answerer,
    drinkerIds: [],
    tie: false,
    majoritySide: null,
    cat: null,
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
  const present = state.players.filter(isHere);
  if (!present.length) return false;
  return present.every((p) => p.id in state.flip!.votes);
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
      flip.majoritySide = countA === state.players.length ? 0 : 1;
    } else {
      flip.tie = true;
    }
  } else if (rule === "solo") {
    if (countA === 1 && countB > 1) {
      drinkers = side(0);
      flip.majoritySide = 1;
    } else if (countB === 1 && countA > 1) {
      drinkers = side(1);
      flip.majoritySide = 0;
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
  const present = state.players.filter(isHere);
  if (!present.length) return false;
  return present.every((p) => state.flip!.readyIds.includes(p.id));
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
  clearGate(state);
  addCups(state, drinkers, cmd.cups);
  state.drawCount += 1;
}

export function startNever(state: GameState): void {
  const rng = createRng(`${state.seed}:never:${state.drawCount}`);
  const deck = NEVER_PROMPTS.map((p) => p.id);
  shuffleInPlace(deck, rng);
  state.mode = "never";
  state.phase = "never";
  state.never = { deck, index: 0, marked: [], passed: [], sub: "ask", readyIds: [], allDeny: false };
  state.flip = null;
  state.king = null;
  state.wheel = null;
  state.lastResult = null;
  state.skillPending = false;
}

export function neverAnswer(state: GameState, playerId: string, did: boolean): void {
  const n = state.never;
  if (!n || n.sub !== "ask" || !playerId) return;
  if (!n.passed) n.passed = [];
  n.marked = n.marked.filter((id) => id !== playerId);
  n.passed = n.passed.filter((id) => id !== playerId);
  if (did) n.marked.push(playerId);
  else n.passed.push(playerId);
  const answered = new Set([...n.marked, ...n.passed]);
  const present = state.players.filter(isHere);
  if (present.length > 0 && present.every((p) => answered.has(p.id))) neverConfirm(state);
}

export function neverToggle(state: GameState, playerId: string): void {
  const n = state.never;
  if (!n || n.sub !== "ask") return;
  neverAnswer(state, playerId, !n.marked.includes(playerId));
}

export function neverConfirm(state: GameState): void {
  const n = state.never;
  if (!n || n.sub !== "ask") return;
  n.sub = "result";
  n.readyIds = [];
  state.drawCount += 1;
  if (!n.marked.length) {
    n.allDeny = true;
    n.marked = state.players.map((p) => p.id);
  } else {
    n.allDeny = false;
  }
  settlePunish(state, n.marked, 1);
}

export function neverMarkReady(state: GameState, pid: string): void {
  const n = state.never;
  if (!n || n.sub !== "result" || !pid) return;
  if (!n.readyIds) n.readyIds = [];
  if (!state.players.some((p) => p.id === pid)) return;
  if (!n.readyIds.includes(pid)) n.readyIds.push(pid);
}

export function neverAdvance(state: GameState): void {
  const n = state.never;
  if (!n) return;
  flushPunish(state);
  n.index = (n.index + 1) % n.deck.length;
  n.marked = [];
  n.passed = [];
  n.readyIds = [];
  n.allDeny = false;
  n.sub = "ask";
  state.hitAmt = {};
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
  clearGate(state);
  state.drawCount += 1;
}

function linerSpeaker(state: GameState): string {
  const o = state.oneliner;
  if (!o) return "";
  return o.order[o.seat] ?? "";
}

function linerDeal(state: GameState): void {
  const o = state.oneliner;
  if (!o) return;
  const sit = LINER_SITUATIONS[o.sitDeck[o.cursor % o.sitDeck.length]!] ?? LINER_SITUATIONS[0]!;
  const eff = LINER_EFFECTS[o.effDeck[o.cursor % o.effDeck.length]!] ?? LINER_EFFECTS[0]!;
  o.cursor += 1;
  o.situation = sit;
  o.effect = eff.name;
  o.line = "";
  o.votes = {};
  o.readyIds = [];
  o.boom = false;
  o.success = false;
  o.deadline = 0;
  o.sub = "prompt";
  state.hitAmt = {};
  state.punishQueue = [];
  state.punishActorId = null;
}

function linerResolve(state: GameState): void {
  const o = state.oneliner;
  if (!o || o.sub !== "judge") return;
  const speaker = linerSpeaker(state);
  const judges = state.players.filter((p) => p.id !== speaker);
  const hits = judges.filter((p) => o.votes[p.id]).length;
  const need = Math.floor(judges.length / 2) + 1;
  o.success = judges.length === 0 ? true : hits >= need;
  o.boom = judges.length > 0 && hits === judges.length;
  if (o.success) {
    o.scores[speaker] = (o.scores[speaker] ?? 0) + 1;
    state.hitAmt = {};
    state.punishQueue = [];
    state.punishActorId = null;
  } else if (speaker) {
    settlePunish(state, [speaker], 1);
  }
  o.sub = "reveal";
  o.readyIds = [];
}

export function startOneLiner(state: GameState): void {
  const rng = createRng(`${state.seed}:oneliner:${state.drawCount}`);
  const order = state.players.map((p) => p.id);
  shuffleInPlace(order, rng);
  const sitDeck = LINER_SITUATIONS.map((_, i) => i);
  const effDeck = LINER_EFFECTS.map((_, i) => i);
  shuffleInPlace(sitDeck, rng);
  shuffleInPlace(effDeck, rng);
  const scores: Record<string, number> = {};
  for (const p of state.players) scores[p.id] = 0;
  state.mode = "oneliner";
  state.phase = "oneliner";
  state.oneliner = {
    sub: "setup",
    perPlayer: 3,
    order,
    round: 0,
    seat: 0,
    sitDeck,
    effDeck,
    cursor: 0,
    situation: "",
    effect: "",
    line: "",
    votes: {},
    scores,
    readyIds: [],
    boom: false,
    success: false,
    deadline: 0,
    best: [],
    worst: [],
  };
  state.flip = null;
  state.never = null;
  state.artist = null;
  state.who = null;
  state.truth = null;
}

export function linerSetRounds(state: GameState, n: number): void {
  const o = state.oneliner;
  if (!o || o.sub !== "setup") return;
  o.perPlayer = Math.max(1, Math.min(8, Math.round(n)));
}

export function linerBegin(state: GameState): void {
  const o = state.oneliner;
  if (!o || o.sub !== "setup" || state.players.length === 0) return;
  o.sub = "spin";
}

export function linerSpinDone(state: GameState): void {
  const o = state.oneliner;
  if (!o || o.sub !== "spin") return;
  linerDeal(state);
}

export function linerSubmit(state: GameState, text: string, pid?: string): void {
  const o = state.oneliner;
  if (!o || o.sub !== "prompt") return;
  const speaker = linerSpeaker(state);
  if (pid && pid !== speaker) return;
  o.line = text.trim().slice(0, 42);
  o.sub = "judge";
  o.votes = {};
  const judges = state.players.filter((p) => isHere(p) && p.id !== speaker);
  if (judges.length === 0) linerResolve(state);
}

export function linerVote(state: GameState, hit: boolean, pid: string): void {
  const o = state.oneliner;
  if (!o || o.sub !== "judge" || !pid) return;
  const speaker = linerSpeaker(state);
  if (pid === speaker) return;
  if (!state.players.some((p) => p.id === pid)) return;
  o.votes[pid] = hit;
  if (!o.readyIds.includes(pid)) o.readyIds.push(pid);
  const judges = state.players.filter((p) => isHere(p) && p.id !== speaker);
  if (judges.length > 0 && judges.every((p) => p.id in o.votes)) linerResolve(state);
}

export function linerMarkReady(state: GameState, pid: string): void {
  const o = state.oneliner;
  if (!o || !pid) return;
  if (!o.readyIds) o.readyIds = [];
  if (!state.players.some((p) => p.id === pid)) return;
  const speaker = linerSpeaker(state);
  if (o.sub === "judge") {
    if (pid === speaker || !(pid in o.votes)) return;
    if (!o.readyIds.includes(pid)) o.readyIds.push(pid);
    const judges = state.players.filter((p) => isHere(p) && p.id !== speaker);
    if (judges.length > 0 && judges.every((p) => o.readyIds.includes(p.id))) linerResolve(state);
    return;
  }
  if (o.sub !== "reveal") return;
  if (!o.readyIds.includes(pid)) o.readyIds.push(pid);
}

export function linerAdvance(state: GameState): void {
  const o = state.oneliner;
  if (!o || o.sub !== "reveal") return;
  flushPunish(state);
  const n = Math.max(1, o.order.length);
  const lastSeat = o.seat >= n - 1;
  const lastRound = o.round >= o.perPlayer - 1;
  if (lastSeat && lastRound) {
    const vals = state.players.map((p) => o.scores[p.id] ?? 0);
    const max = Math.max(0, ...vals);
    const min = Math.min(...vals);
    o.best = state.players.filter((p) => (o.scores[p.id] ?? 0) === max).map((p) => p.id);
    o.worst = max === min ? [] : state.players.filter((p) => (o.scores[p.id] ?? 0) === min).map((p) => p.id);
    o.sub = "rank";
    state.hitAmt = {};
    state.punishQueue = [];
    if (o.worst.length) settlePunish(state, o.worst, 1);
    return;
  }
  if (lastSeat) {
    o.round += 1;
    o.seat = 0;
  } else {
    o.seat += 1;
  }
  linerDeal(state);
}

export function claimSeat(state: GameState, peerId: string, name: string, live: string[]): string | null {
  const known = state.players.find((p) => p.id === peerId);
  if (known) {
    known.connected = true;
    return peerId;
  }
  if (state.phase === "home" || state.phase === "setup" || state.phase === "lobby" || state.phase === "pick_role") return null;
  const liveSet = new Set(live);
  const taken = new Set(Object.values(state.seatAlias ?? {}));
  const missing = state.players.filter((p) => !p.isBot && !liveSet.has(p.id) && !taken.has(p.id));
  const named = name.trim() ? missing.filter((p) => p.name === name.trim()) : [];
  const seat = named.length === 1 ? named[0] : missing.length === 1 ? missing[0] : null;
  if (!seat) return null;
  if (!state.seatAlias) state.seatAlias = {};
  state.seatAlias[peerId] = seat.id;
  seat.connected = true;
  return seat.id;
}

export function notePresence(state: GameState, live: string[]): void {
  const set = new Set(live);
  const returned = new Set<string>();
  for (const [peer, seat] of Object.entries(state.seatAlias ?? {})) {
    if (set.has(peer)) returned.add(seat);
  }
  for (const p of state.players) {
    if (p.isBot || p.id === state.hostId) {
      p.connected = true;
      continue;
    }
    p.connected = set.has(p.id) || returned.has(p.id);
  }
  if (state.flip?.sub === "choose" && flipAllVoted(state)) {
    resolveFlipMinority(state);
    state.flip.sub = "result";
    state.flip.readyIds = [];
    state.flip.answererId = null;
  }
  whoClose(state);
  const n = state.never;
  if (n?.sub === "ask") {
    const answered = new Set([...(n.marked ?? []), ...(n.passed ?? [])]);
    const present = state.players.filter(isHere);
    if (present.length > 0 && present.every((p) => answered.has(p.id))) neverConfirm(state);
  }
  const a = state.artist;
  if (a?.sub === "guess") {
    const guessers = state.players.filter((p) => isHere(p) && p.id !== a.artistId);
    if (guessers.length === 0 || guessers.every((p) => a.guesses[p.id])) artistResolve(state);
  }
  const o = state.oneliner;
  if (o?.sub === "judge") {
    const speaker = o.order[o.seat] ?? "";
    const judges = state.players.filter((p) => isHere(p) && p.id !== speaker);
    if (judges.length > 0 && judges.every((p) => p.id in (o.votes ?? {}))) linerResolve(state);
  }
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
  artist: ArtistState | null;
  oneliner: OneLinerState | null;
  who: WhoState | null;
  truth: TruthState | null;
  react: ReactState | null;
  match: MatchState | null;
  award: AwardState | null;
  wolf: WolfState | null;
  hitAmt: Record<string, number>;
  chaos: ChaosBuff | null;
  punishLabel: string;
  punishQueue: string[];
  punishAmt: number;
  punishActorId: string | null;
  punishCollateral: boolean;
  skillReturnPhase: Phase;
  skillFlash: { roleId: string; name: string; skill: string; desc?: string; msg: string } | null;
  modeFocus: number;
  modeArm: GameMode | null;
  gateReady: string[];
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
    artist: state.artist,
    oneliner: state.oneliner,
    who: state.who,
    truth: state.truth,
    react: state.react,
    match: state.match,
    award: state.award,
    wolf: state.wolf,
    hitAmt: state.hitAmt,
    chaos: state.chaos,
    punishLabel: state.punishLabel,
    punishQueue: state.punishQueue,
    punishAmt: state.punishAmt,
    punishActorId: state.punishActorId,
    punishCollateral: state.punishCollateral,
    skillReturnPhase: state.skillReturnPhase,
    skillFlash: state.skillFlash,
    modeFocus: state.modeFocus ?? 0,
    modeArm: state.modeArm ?? null,
    gateReady: [...(state.gateReady ?? [])],
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
  state.artist = sync.artist ?? null;
  state.oneliner = sync.oneliner ?? null;
  state.who = sync.who ?? null;
  state.truth = sync.truth ?? null;
  state.react = sync.react ?? null;
  state.match = sync.match ?? null;
  state.award = sync.award ?? null;
  state.wolf = sync.wolf ?? null;
  state.hitAmt = sync.hitAmt ?? {};
  state.chaos = sync.chaos ?? null;
  if (sync.punishLabel) state.punishLabel = sync.punishLabel;
  if (sync.punishQueue) state.punishQueue = sync.punishQueue;
  if (sync.punishAmt != null) state.punishAmt = sync.punishAmt;
  state.punishActorId = sync.punishActorId ?? null;
  state.punishCollateral = sync.punishCollateral ?? false;
  if (sync.skillReturnPhase) state.skillReturnPhase = sync.skillReturnPhase;
  state.skillFlash = sync.skillFlash ?? null;
  state.modeFocus = sync.modeFocus ?? 0;
  state.modeArm = sync.modeArm ?? null;
  state.gateReady = [...(sync.gateReady ?? [])];
}
