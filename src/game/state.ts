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
  | "recap";

export type GameMode =
  | "draw_one"
  | "drink_order"
  | "team_toast"
  | "flip_battle"
  | "who"
  | "truth"
  | "react"
  | "king"
  | "never"
  | "wheel";

export type FlipSubPhase = "choose" | "result";

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

export interface ReactState {
  sub: "ready" | "play" | "result" | "drag";
  playerId: string;
  misses: number;
  punished: boolean;
  dragFrom: string | null;
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
  chaos: ChaosBuff | null;
  punishLabel: string;
  practice: boolean;
  allow18: boolean;
  flipCat: string | null;
  punishQueue: string[];
  punishAmt: number;
  punishActorId: string | null;
  skillReturnPhase: Phase;
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
    skillReturnPhase: "home",
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
  for (const id of unique) {
    const p = state.players.find((x) => x.id === id);
    if (!p) continue;
    if (p.handoffId) {
      const hid = p.handoffId;
      p.handoffId = null;
      if (hid && hid !== id) addCups(state, [hid], n * 3);
      continue;
    }
    const m = p.nextMult ?? 1;
    p.nextMult = 1;
    if (m === 0) continue;
    p.cups = (p.cups || 0) + (n + bonus) * m;
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

export function canFireSkill(p: Player): boolean {
  if (p.skillUsed || p.isBot) return false;
  return getRole(p.roleId).skillKind !== "none";
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
    if (!canFireSkill(p)) {
      applyPunish(state, [id], state.punishAmt || 1);
      state.punishQueue.shift();
      continue;
    }
    const role = getRole(p.roleId);
    state.punishActorId = id;
    state.lastResult = {
      playerId: id,
      mode: state.mode ?? "flip_battle",
      message: `${p.name} 被罰`,
      drinkHint: role.drink,
      skillKind: role.skillKind,
    };
    state.skillPending = true;
    state.phase = "skill";
    return;
  }
  state.punishActorId = null;
  state.skillPending = false;
  if (state.mode === "draw_one") state.phase = "result";
  else state.phase = state.skillReturnPhase;
}

export function settlePunish(state: GameState, ids: string[], n = 1): string[] {
  const buff = state.chaos;
  let list = [...new Set(ids)];
  if (buff?.shieldId) list = list.filter((id) => id !== buff.shieldId);
  if (state.phase !== "skill") state.skillReturnPhase = state.phase;
  state.punishAmt = n;
  state.punishQueue = list;
  pumpPunishQueue(state);
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
    deck: ids,
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
  state.who.index = (state.who.index + 1) % Math.max(1, state.who.deck.length);
  state.who.sub = "vote";
  state.who.votes = {};
  state.who.punishedIds = [];
  state.who.dragFrom = null;
  state.who.voterId = state.players[0]?.id ?? null;
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
    deck: ids,
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
  state.truth.index = (state.truth.index + 1) % Math.max(1, state.truth.deck.length);
  const i = (state.players.findIndex((p) => p.id === state.truth!.playerId) + 1) % Math.max(1, state.players.length);
  state.truth.playerId = state.players[i]?.id ?? "";
  state.truth.sub = "ask";
  state.truth.took = null;
  state.truth.dragFrom = null;
  state.drawCount += 1;
  state.chaos = null;
}

export function startReact(state: GameState): void {
  const turn = state.drawCount % Math.max(1, state.players.length);
  state.mode = "react";
  state.phase = "react";
  state.react = {
    sub: "ready",
    playerId: state.players[turn]?.id ?? state.players[0]?.id ?? "",
    misses: 0,
    punished: false,
    dragFrom: null,
  };
  state.flip = null;
  state.who = null;
  state.truth = null;
}

export function reactBegin(state: GameState): void {
  if (state.react) state.react.sub = "play";
}

export function reactFinish(state: GameState, misses: number): void {
  const r = state.react;
  if (!r) return;
  r.misses = misses;
  r.punished = misses > 0;
  if (r.punished) settlePunish(state, [r.playerId], 1);
  r.sub = r.punished && state.chaos?.drag ? "drag" : "result";
}

export function reactAdvance(state: GameState): void {
  if (!state.react) return;
  const i = (state.players.findIndex((p) => p.id === state.react!.playerId) + 1) % Math.max(1, state.players.length);
  state.react.playerId = state.players[i]?.id ?? "";
  state.react.sub = "ready";
  state.react.misses = 0;
  state.react.punished = false;
  state.react.dragFrom = null;
  state.drawCount += 1;
  state.chaos = null;
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

  switch (kind) {
    case "slacker":
      mark();
      if (me) me.nextMult = 3;
      return `${me?.name} 摸魚！這次免罰，下次被罰 ×3`;
    case "pick_drink2":
      if (!target) return "請選擇目標";
      mark();
      addCups(state, [target.id], 2);
      if (me) me.nextMult = 2;
      return `${me?.name} 打小報告！${target.name} ${punishPhrase(state, 2)}。${me?.name} 下次 ×2`;
    case "boss_choice":
      if (option === "all") {
        mark();
        addCups(
          state,
          state.players.filter((p) => p.id !== me?.id).map((p) => p.id),
          1,
        );
        if (me) me.nextMult = 2;
        return `老闆發話：全場一起${punishPhrase(state)}（老闆這次免罰，下次 ×2）`;
      }
      if (!target) return "請選擇";
      mark();
      addCups(state, [target.id], 2);
      if (me) me.nextMult = 2;
      return `老闆點名：${target.name} ${punishPhrase(state, 2)}。${me?.name} 下次 ×2`;
    case "intern_pass":
      if (!target) return "請選擇傳給誰";
      mark();
      addCups(state, [target.id], 1);
      if (me) me.nextMult = 2;
      return `${me?.name} 喊救命！懲罰傳給 ${target.name}。${me?.name} 下次 ×2`;
    case "treat":
      if (!target || !me) return "請選擇請客對象";
      mark();
      addCups(state, [me.id, target.id], 1);
      return `${me.name} 請客！${me.name} 與 ${target.name} 各${punishPhrase(state)}`;
    case "transfer":
      if (me && target) {
        mark();
        const tmp = me.roleId;
        me.roleId = target.roleId;
        target.roleId = tmp;
        addCups(state, [target.id], 1);
        me.nextMult = 2;
        return `調職！${me.name} ⇄ ${target.name}，由 ${target.name} 代罰。${me.name} 下次 ×2`;
      }
      return "請選擇";
    case "tax":
      if (!target || !me) return "請選擇";
      mark();
      target.nextMult = Math.max(target.nextMult ?? 1, 2);
      me.nextMult = 2;
      return `報帳！${me.name} 這次免罰；${target.name} 與 ${me.name} 下次都 ×2`;
    case "deploy":
      if (!target || !me) return "請選擇";
      mark();
      target.nextMult = 0;
      me.nextMult = 2;
      return `緊急上線！${me.name} 這次免罰，下次 ×2；${target.name} 下次免罰`;
    case "overtime":
      if (!target || !me) return "請選擇";
      mark();
      addCups(state, [me.id], 2);
      me.handoffId = target.id;
      return `${me.name} 補休！這次罰兩次，下次懲罰交接給 ${target.name}（×3）`;
    default:
      mark();
      if (me) addCups(state, [me.id], 1);
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
  if (actor && state.punishQueue[0] === actor) state.punishQueue.shift();
  state.skillPending = false;
  if (state.mode === "draw_one") {
    state.phase = "result";
    return;
  }
  pumpPunishQueue(state);
}

export function declineSkill(state: GameState): void {
  const actor = state.punishActorId ?? state.lastResult?.playerId;
  if (actor) applyPunish(state, [actor], state.punishAmt || 1);
  if (actor && state.punishQueue[0] === actor) state.punishQueue.shift();
  state.skillPending = false;
  if (state.mode === "draw_one") {
    state.phase = "reveal";
    return;
  }
  pumpPunishQueue(state);
}

export function startFlipBattle(state: GameState): void {
  const rng = createRng(`${state.seed}:flip:${state.drawCount}:${state.flipCat ?? "mix"}`);
  const pool = questionsForCat(state.flipCat, state.allow18);
  const ids = (pool.length ? pool : FLIP_QUESTIONS.filter((q) => q.age !== "18+")).map((q) => q.id);
  shuffleInPlace(ids, rng);
  const answerer = state.players.length > 0 ? state.players[0]!.id : null;
  state.mode = "flip_battle";
  state.phase = "flip_battle";
  state.flip = {
    deck: ids.slice(0, Math.min(12, ids.length)),
    index: 0,
    sub: "choose",
    votes: {},
    readyIds: [],
    answererId: answerer,
    drinkerIds: [],
    tie: false,
    majoritySide: null,
    cat: state.flipCat,
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
  let countA = 0;
  let countB = 0;
  for (const p of state.players) {
    const v = flip.votes[p.id];
    if (v === 0) countA += 1;
    else if (v === 1) countB += 1;
  }
  if (countA === 0 && countB === 0) {
    flip.tie = true;
    flip.majoritySide = null;
    flip.drinkerIds = [];
    return;
  }
  if (countA === countB) {
    flip.tie = true;
    flip.majoritySide = null;
    flip.drinkerIds = [];
    return;
  }
  flip.tie = false;
  const minoritySide: 0 | 1 = countA < countB ? 0 : 1;
  flip.majoritySide = minoritySide === 0 ? 1 : 0;
  const raw = state.players.filter((p) => flip.votes[p.id] === minoritySide).map((p) => p.id);
  flip.drinkerIds = settlePunish(state, raw, 1);
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
  state.flip.index = (state.flip.index + 1) % state.flip.deck.length;
  state.flip.sub = "choose";
  state.flip.votes = {};
  state.flip.readyIds = [];
  state.flip.drinkerIds = [];
  state.flip.tie = false;
  state.flip.majoritySide = null;
  state.flip.answererId = state.players[0]?.id ?? null;
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
  chaos: ChaosBuff | null;
  punishLabel: string;
  punishQueue: string[];
  punishAmt: number;
  punishActorId: string | null;
  skillReturnPhase: Phase;
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
    chaos: state.chaos,
    punishLabel: state.punishLabel,
    punishQueue: state.punishQueue,
    punishAmt: state.punishAmt,
    punishActorId: state.punishActorId,
    skillReturnPhase: state.skillReturnPhase,
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
  state.chaos = sync.chaos ?? null;
  if (sync.punishLabel) state.punishLabel = sync.punishLabel;
  if (sync.punishQueue) state.punishQueue = sync.punishQueue;
  if (sync.punishAmt != null) state.punishAmt = sync.punishAmt;
  state.punishActorId = sync.punishActorId ?? null;
  if (sync.skillReturnPhase) state.skillReturnPhase = sync.skillReturnPhase;
}
