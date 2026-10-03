/** 狼人殺：系統當法官。身分只在畫面上隱藏，狀態仍由房主同步。 */
import { createRng, rngInt, shuffleInPlace } from "./rng";
import { isHere, settlePunish, type GameState } from "./state";

export type WolfRole = "wolf" | "villager" | "seer" | "witch" | "hunter" | "knight";
export type WolfSub = "card" | "night" | "dawn" | "speak" | "vote" | "hunter" | "end";
export type WolfNight = "wolf" | "seer" | "witch" | "resolve";
export type WolfCause = "wolf" | "poison" | "vote" | "hunter" | "knight";
export type WolfAct =
  | "ready"
  | "duel"
  | "kill"
  | "seer"
  | "save"
  | "poison"
  | "pass"
  | "vote"
  | "shoot"
  | "spare"
  | "discuss"
  | "dawn";

export interface WolfSeat {
  id: string;
  role: WolfRole;
  alive: boolean;
}

export interface WolfState {
  sub: WolfSub;
  nightStep: WolfNight;
  day: number;
  seats: WolfSeat[];
  seerLog: { seerId: string; targetId: string; wolf: boolean; day: number }[];
  witchSave: boolean;
  witchPoison: boolean;
  witchUsed: boolean;
  /** 騎士整局只能決鬥一次。 */
  knightUsed: boolean;
  wolfVotes: Record<string, string>;
  wolfTarget: string | null;
  saved: boolean;
  poisonedId: string | null;
  deaths: string[];
  deathCause: Record<string, WolfCause>;
  votes: Record<string, string>;
  hunterId: string | null;
  readyIds: string[];
  winner: "wolf" | "good" | null;
  /** 天亮之後要去討論，還是進入下一夜。 */
  pending: "speak" | "night";
  log: string[];
  hint: string;
}

export function wolfRoleName(role: WolfRole): string {
  if (role === "wolf") return "狼人";
  if (role === "seer") return "預言家";
  if (role === "witch") return "女巫";
  if (role === "hunter") return "獵人";
  if (role === "knight") return "騎士";
  return "平民";
}

export function wolfRoleBlurb(role: WolfRole): string {
  if (role === "wolf") return "夜晚和同伴一起刀一個人。";
  if (role === "seer") return "夜晚可以驗一個人是狼還是好人。";
  if (role === "witch") return "一瓶解藥、一瓶毒藥。同一晚只能用一種。";
  if (role === "hunter") return "出局可開槍。點人後按選定。被毒不能開。";
  if (role === "knight") return "白天決鬥一次。刺中狼則狼出局，刺錯你出局。";
  return "沒有技能。白天投票找出狼人。";
}

export function wolfRoleCard(role: WolfRole, roleId: string): string {
  return `/art/wolf/cards/${role}/${roleId}.jpg`;
}

export function wolfSetupLabel(n: number): string {
  if (n <= 8) return "2 狼、預言家、女巫，其餘平民";
  if (n <= 11) return "3 狼、預言家、女巫、獵人，其餘平民";
  return "4 狼、預言家、女巫、獵人、騎士、4 平民";
}

function godsFor(n: number): WolfRole[] {
  if (n <= 8) return ["seer", "witch"];
  if (n <= 11) return ["seer", "witch", "hunter"];
  return ["seer", "witch", "hunter", "knight"];
}

function wolvesFor(n: number): number {
  if (n <= 8) return 2;
  if (n <= 11) return 3;
  return 4;
}

function nameOf(state: GameState, id: string): string {
  return state.players.find((p) => p.id === id)?.name ?? "某人";
}

function pushLog(w: WolfState, line: string) {
  w.log = [...w.log, line].slice(-6);
}

function rngOf(state: GameState, salt: string) {
  const w = state.wolf;
  return createRng(`${state.seed}:wolf:${w?.day ?? 0}:${salt}:${w?.log.length ?? 0}`);
}

function alive(w: WolfState, role?: WolfRole): WolfSeat[] {
  return w.seats.filter((s) => s.alive && (role ? s.role === role : true));
}

function present(state: GameState, ids: string[]): string[] {
  const here = new Set(state.players.filter(isHere).map((p) => p.id));
  return ids.filter((id) => here.has(id));
}

function seat(w: WolfState, id: string): WolfSeat | undefined {
  return w.seats.find((s) => s.id === id);
}

export function wolfCanSee(state: GameState, viewerId: string | null, targetId: string): boolean {
  const w = state.wolf;
  if (!w) return false;
  const t = seat(w, targetId);
  if (!t) return false;
  if (w.sub === "end" || !t.alive) return true;
  if (viewerId && viewerId === targetId) return true;
  const me = viewerId ? seat(w, viewerId) : undefined;
  return Boolean(me?.alive && me.role === "wolf" && t.role === "wolf");
}

function winnerOf(w: WolfState): "wolf" | "good" | null {
  const live = alive(w);
  const wolves = live.filter((s) => s.role === "wolf").length;
  const good = live.length - wolves;
  if (wolves <= 0) return "good";
  if (wolves >= good) return "wolf";
  return null;
}

function finish(state: GameState, side: "wolf" | "good") {
  const w = state.wolf;
  if (!w || w.sub === "end") return;
  w.winner = side;
  w.sub = "end";
  w.hunterId = null;
  w.hint = "";
  const losers = w.seats.filter((s) => (side === "good" ? s.role === "wolf" : s.role !== "wolf")).map((s) => s.id);
  pushLog(w, side === "good" ? "好人贏。狼人受罰。" : "狼人贏。好人受罰。");
  if (losers.length) settlePunish(state, losers, 1);
  state.drawCount += 1;
}

function kill(state: GameState, id: string, cause: WolfCause) {
  const w = state.wolf;
  if (!w) return;
  const s = seat(w, id);
  if (!s || !s.alive) return;
  s.alive = false;
  w.deathCause[id] = cause;
  if (!w.deaths.includes(id)) w.deaths.push(id);
}

function openHunter(state: GameState, id: string, cause: WolfCause) {
  const w = state.wolf;
  if (!w) return;
  if (cause === "poison") return;
  const s = seat(w, id);
  if (!s || s.role !== "hunter") return;
  const others = alive(w).filter((x) => x.id !== id);
  if (!others.length) return;
  w.hunterId = id;
}

function afterDeaths(state: GameState) {
  const w = state.wolf;
  if (!w) return;
  if (w.hunterId) {
    const others = alive(w);
    if (!others.length) {
      w.hunterId = null;
    } else {
      const hunter = state.players.find((p) => p.id === w.hunterId);
      w.sub = "hunter";
      w.hint = `${nameOf(state, w.hunterId)} 是獵人。點人後按選定，也可以不開槍。`;
      if (!hunter || !isHere(hunter)) {
        const rng = rngOf(state, `auto-hunt:${w.hunterId}`);
        const t = others[rngInt(rng, others.length)]!;
        shoot(state, w.hunterId, t.id);
      }
      return;
    }
  }
  const side = winnerOf(w);
  if (side) {
    finish(state, side);
    return;
  }
  if (w.pending === "night") openNight(state);
  else {
    w.sub = "speak";
    w.votes = {};
    w.hint = "白天。先討論，再投票。";
  }
}

function resolveNight(state: GameState) {
  const w = state.wolf;
  if (!w) return;
  w.deaths = [];
  let knife = w.wolfTarget;
  if (knife && w.saved) knife = null;
  const poison = w.poisonedId;
  if (knife && poison === knife) {
    kill(state, knife, "poison");
    openHunter(state, knife, "poison");
  } else {
    if (knife) {
      kill(state, knife, "wolf");
      openHunter(state, knife, "wolf");
    }
    if (poison) {
      kill(state, poison, "poison");
      openHunter(state, poison, "poison");
    }
  }
  if (!w.deaths.length) pushLog(w, `第 ${w.day} 夜平安，沒人出局。`);
  else pushLog(w, `第 ${w.day} 夜出局：${w.deaths.map((id) => nameOf(state, id)).join("、")}`);
  w.pending = "speak";
  w.sub = "dawn";
  w.hint = w.deaths.length ? "天亮了。出局者的身分已公開。" : "天亮了，今夜平安。";
}

function enterStep(state: GameState, step: WolfNight) {
  const w = state.wolf;
  if (!w) return;
  w.nightStep = step;
  w.sub = "night";
  w.hint = "";
  if (step === "resolve") {
    resolveNight(state);
    return;
  }
  if (step === "wolf") {
    const wolves = present(state, alive(w, "wolf").map((s) => s.id));
    if (!wolves.length) {
      const pool = alive(w).filter((s) => s.role !== "wolf");
      const fall = pool.length ? pool : alive(w);
      if (fall.length) {
        const rng = rngOf(state, "autokill");
        w.wolfTarget = fall[rngInt(rng, fall.length)]!.id;
      }
      return enterStep(state, "seer");
    }
    w.hint = "狼人請統一刀人。";
    return;
  }
  if (step === "seer") {
    const seers = present(state, alive(w, "seer").map((s) => s.id));
    if (!seers.length) return enterStep(state, "witch");
    w.hint = "預言家請驗一個人。";
    return;
  }
  const witch = alive(w, "witch")[0];
  if (!witch || (!w.witchSave && !w.witchPoison) || !present(state, [witch.id]).length) {
    return enterStep(state, "resolve");
  }
  w.hint = "女巫行動。同一晚只能救或毒，不能兩樣都做。";
}

function closeWolves(state: GameState) {
  const w = state.wolf;
  if (!w) return;
  const need = present(state, alive(w, "wolf").map((s) => s.id));
  if (!need.length || !need.every((id) => w.wolfVotes[id])) return;
  const tally = new Map<string, number>();
  for (const id of need) {
    const t = w.wolfVotes[id];
    if (!t) continue;
    tally.set(t, (tally.get(t) ?? 0) + 1);
  }
  let best = 0;
  let tops: string[] = [];
  for (const [id, n] of tally) {
    if (n > best) {
      best = n;
      tops = [id];
    } else if (n === best) tops.push(id);
  }
  if (!tops.length) return enterStep(state, "seer");
  const pick = tops.length === 1 ? tops[0]! : tops[rngInt(rngOf(state, "wolf-tie"), tops.length)]!;
  w.wolfTarget = pick;
  enterStep(state, "seer");
}

function closeVotes(state: GameState) {
  const w = state.wolf;
  if (!w || w.sub !== "vote") return;
  const need = present(state, alive(w).map((s) => s.id));
  if (!need.length || !need.every((id) => w.votes[id])) return;
  const tally = new Map<string, number>();
  for (const id of need) {
    const t = w.votes[id];
    if (!t) continue;
    tally.set(t, (tally.get(t) ?? 0) + 1);
  }
  let best = 0;
  let tops: string[] = [];
  for (const [id, n] of tally) {
    if (n > best) {
      best = n;
      tops = [id];
    } else if (n === best) tops.push(id);
  }
  w.deaths = [];
  w.hunterId = null;
  if (tops.length !== 1) {
    pushLog(w, "投票平手，今天沒人出局。");
    w.hint = "平手，沒人出局。";
    w.pending = "night";
    w.sub = "dawn";
    return;
  }
  const id = tops[0]!;
  kill(state, id, "vote");
  pushLog(w, `投票出局：${nameOf(state, id)}`);
  openHunter(state, id, "vote");
  w.pending = "night";
  w.sub = "dawn";
  w.hint = `${nameOf(state, id)} 被投出局。`;
}

function shoot(state: GameState, hunterId: string, targetId: string) {
  const w = state.wolf;
  if (!w || w.hunterId !== hunterId) return;
  const target = seat(w, targetId);
  if (!target?.alive || targetId === hunterId) {
    w.hint = "請射一個還活著的人。";
    return;
  }
  kill(state, targetId, "hunter");
  pushLog(w, `獵人帶走 ${nameOf(state, targetId)}`);
  w.hunterId = null;
  w.hint = `獵人帶走 ${nameOf(state, targetId)}。`;
  afterDeaths(state);
}

function duel(state: GameState, knightId: string, targetId: string | undefined) {
  const w = state.wolf;
  if (!w || (w.sub !== "speak" && w.sub !== "vote")) return;
  const me = seat(w, knightId);
  if (!me?.alive || me.role !== "knight" || w.knightUsed) return;
  const target = targetId ? seat(w, targetId) : undefined;
  if (!target?.alive || !targetId || targetId === knightId) {
    w.hint = "請選一個還活著的人決鬥。";
    return;
  }
  w.knightUsed = true;
  if (target.role === "wolf") {
    kill(state, target.id, "knight");
    pushLog(w, `騎士發動決鬥，${nameOf(state, target.id)} 是狼人，出局。`);
    w.hint = `${nameOf(state, target.id)} 是狼人，決鬥出局。`;
  } else {
    kill(state, knightId, "knight");
    pushLog(w, "騎士發動決鬥，騎士謝罪出局。");
    w.hint = "騎士刺中好人，謝罪出局。";
  }
  const side = winnerOf(w);
  if (side) {
    finish(state, side);
    return;
  }
  w.votes = {};
  w.sub = "speak";
}

export function startWolf(state: GameState): boolean {
  if (state.players.length < 6) return false;
  const n = state.players.length;
  const bag: WolfRole[] = [];
  for (let i = 0; i < wolvesFor(n); i++) bag.push("wolf");
  bag.push(...godsFor(n));
  while (bag.length < n) bag.push("villager");
  shuffleInPlace(bag, createRng(`${state.seed}:wolf-deal:${state.drawCount}:${n}`));
  const seats: WolfSeat[] = state.players.map((p, i) => ({ id: p.id, role: bag[i]!, alive: true }));
  state.wolf = {
    sub: "card",
    nightStep: "wolf",
    day: 0,
    seats,
    seerLog: [],
    witchSave: true,
    witchPoison: true,
    witchUsed: false,
    knightUsed: false,
    wolfVotes: {},
    wolfTarget: null,
    saved: false,
    poisonedId: null,
    deaths: [],
    deathCause: {},
    votes: {},
    hunterId: null,
    readyIds: [],
    winner: null,
    pending: "speak",
    log: [`法官發牌。${wolfSetupLabel(n)}。`],
    hint: "看自己的身分。看完按準備。",
  };
  state.mode = "wolf";
  state.phase = "wolf";
  state.flip = null;
  state.who = null;
  state.truth = null;
  state.react = null;
  state.hitAmt = {};
  state.punishQueue = [];
  state.punishActorId = null;
  state.skillPending = false;
  state.skillFlash = null;
  state.gateReady = [];
  for (const p of state.players) p.skillUsed = false;
  return true;
}

function openNight(state: GameState) {
  const w = state.wolf;
  if (!w) return;
  w.day += 1;
  w.wolfVotes = {};
  w.wolfTarget = null;
  w.saved = false;
  w.poisonedId = null;
  w.witchUsed = false;
  w.deaths = [];
  w.hunterId = null;
  w.votes = {};
  w.readyIds = [];
  enterStep(state, "wolf");
}

export function wolfAct(state: GameState, actorId: string, kind: WolfAct, targetId?: string): void {
  const w = state.wolf;
  if (!w || state.phase !== "wolf" || !actorId) return;
  const me = seat(w, actorId);
  if (kind === "discuss") {
    if (w.sub !== "speak") return;
    w.votes = {};
    w.deaths = [];
    w.sub = "vote";
    w.hint = "投票放逐一個人。平手就沒人出局。";
    return;
  }
  if (kind === "dawn") {
    if (w.sub !== "dawn") return;
    afterDeaths(state);
    return;
  }
  if (!me) return;
  if (kind === "ready") {
    if (w.sub !== "card" || w.readyIds.includes(actorId)) return;
    w.readyIds = [...w.readyIds, actorId];
    const need = present(state, state.players.map((p) => p.id));
    if (need.every((id) => w.readyIds.includes(id))) openNight(state);
    return;
  }
  if (!me.alive && kind !== "shoot" && kind !== "spare") return;
  if (kind === "duel") {
    duel(state, actorId, targetId);
    return;
  }
  if (kind === "kill") {
    if (w.sub !== "night" || w.nightStep !== "wolf" || me.role !== "wolf") return;
    if (!targetId || !seat(w, targetId)?.alive) return;
    w.wolfVotes = { ...w.wolfVotes, [actorId]: targetId };
    closeWolves(state);
    return;
  }
  if (kind === "seer") {
    if (w.sub !== "night" || w.nightStep !== "seer" || me.role !== "seer") return;
    if (!targetId || targetId === actorId || !seat(w, targetId)?.alive) {
      w.hint = "請驗別人。";
      return;
    }
    const t = seat(w, targetId)!;
    w.seerLog = [...w.seerLog, { seerId: actorId, targetId, wolf: t.role === "wolf", day: w.day }];
    enterStep(state, "witch");
    return;
  }
  if (kind === "save" || kind === "poison" || kind === "pass") {
    if (w.sub !== "night" || w.nightStep !== "witch" || me.role !== "witch") return;
    if (kind === "pass") {
      enterStep(state, "resolve");
      return;
    }
    if (w.witchUsed) return;
    if (kind === "save") {
      if (!w.witchSave || !w.wolfTarget) {
        w.hint = "沒有解藥，或今夜沒有刀口。";
        return;
      }
      w.witchSave = false;
      w.witchUsed = true;
      w.saved = true;
      enterStep(state, "resolve");
      return;
    }
    if (!w.witchPoison || !targetId || targetId === actorId || !seat(w, targetId)?.alive) {
      w.hint = "請毒一個還活著的人，不能毒自己。";
      return;
    }
    w.witchPoison = false;
    w.witchUsed = true;
    w.poisonedId = targetId;
    enterStep(state, "resolve");
    return;
  }
  if (kind === "vote") {
    if (w.sub !== "vote" || !me.alive) return;
    if (!targetId || targetId === actorId || !seat(w, targetId)?.alive) {
      w.hint = "請投一個還活著的人。";
      return;
    }
    w.votes = { ...w.votes, [actorId]: targetId };
    closeVotes(state);
    return;
  }
  if (kind === "spare") {
    if (w.sub !== "hunter" || w.hunterId !== actorId) return;
    w.hunterId = null;
    pushLog(w, "獵人沒有開槍。");
    w.hint = "獵人沒有開槍。";
    afterDeaths(state);
    return;
  }
  if (kind === "shoot") {
    if (w.sub !== "hunter" || !targetId) return;
    shoot(state, actorId, targetId);
  }
}

/** 房主推一步電腦。回傳是否有動作。 */
export function wolfPump(state: GameState): boolean {
  const w = state.wolf;
  if (!w || state.phase !== "wolf") return false;
  if (w.sub === "card") {
    const need = present(state, state.players.map((p) => p.id));
    if (need.length > 0 && need.every((id) => w.readyIds.includes(id))) {
      openNight(state);
      return true;
    }
  }
  if (w.sub === "night" && w.nightStep === "wolf") {
    const wolves = present(state, alive(w, "wolf").map((s) => s.id));
    if (!wolves.length) {
      if (!w.wolfTarget) {
        const pool = alive(w).filter((s) => s.role !== "wolf");
        const fall = pool.length ? pool : alive(w);
        if (fall.length) w.wolfTarget = fall[rngInt(rngOf(state, "autokill2"), fall.length)]!.id;
      }
      enterStep(state, "seer");
      return true;
    }
    closeWolves(state);
    if (state.wolf?.nightStep !== "wolf" || state.wolf.sub !== "night") return true;
  }
  if (w.sub === "vote") {
    const need = present(state, alive(w).map((s) => s.id));
    if (!need.length) {
      pushLog(w, "沒有人投票，今天沒人出局。");
      w.hint = "沒有人投票。";
      w.sub = "dawn";
      return true;
    }
    closeVotes(state);
    if (state.wolf?.sub !== "vote") return true;
  }
  const bots = state.players.filter((p) => p.isBot);
  if (w.sub === "card") {
    const bot = bots.find((p) => !w.readyIds.includes(p.id));
    if (!bot) return false;
    wolfAct(state, bot.id, "ready");
    return true;
  }
  if (w.sub === "speak" && !w.knightUsed) {
    const knight = alive(w, "knight").find((s) => bots.some((b) => b.id === s.id));
    if (!knight) return false;
    const rng = rngOf(state, `duel:${knight.id}:${w.day}`);
    if (rng() > 0.42) return false;
    const pool = alive(w).filter((s) => s.id !== knight.id);
    if (!pool.length) return false;
    wolfAct(state, knight.id, "duel", pool[rngInt(rng, pool.length)]!.id);
    return true;
  }
  if (w.sub === "night" && w.nightStep === "wolf") {
    const wolf = alive(w, "wolf").find((s) => bots.some((b) => b.id === s.id) && !w.wolfVotes[s.id]);
    if (!wolf) return false;
    const goods = alive(w).filter((s) => s.role !== "wolf");
    const pool = goods.length ? goods : alive(w).filter((s) => s.id !== wolf.id);
    if (!pool.length) return false;
    const rng = rngOf(state, `k:${wolf.id}`);
    wolfAct(state, wolf.id, "kill", pool[rngInt(rng, pool.length)]!.id);
    return true;
  }
  if (w.sub === "night" && w.nightStep === "seer") {
    const seer = alive(w, "seer").find((s) => bots.some((b) => b.id === s.id));
    if (!seer) return false;
    const known = new Set(w.seerLog.filter((x) => x.seerId === seer.id).map((x) => x.targetId));
    const pool = alive(w).filter((s) => s.id !== seer.id && !known.has(s.id));
    const fall = pool.length ? pool : alive(w).filter((s) => s.id !== seer.id);
    if (!fall.length) return false;
    const rng = rngOf(state, `s:${seer.id}`);
    wolfAct(state, seer.id, "seer", fall[rngInt(rng, fall.length)]!.id);
    return true;
  }
  if (w.sub === "night" && w.nightStep === "witch") {
    const witch = alive(w, "witch").find((s) => bots.some((b) => b.id === s.id));
    if (!witch) return false;
    const rng = rngOf(state, `witch:${witch.id}`);
    const roll = rng();
    if (w.witchSave && w.wolfTarget && w.wolfTarget !== witch.id && roll < 0.55) {
      wolfAct(state, witch.id, "save");
      return true;
    }
    if (w.witchPoison && roll > 0.72) {
      const pool = alive(w).filter((s) => s.id !== witch.id && s.id !== w.wolfTarget);
      if (pool.length) {
        wolfAct(state, witch.id, "poison", pool[rngInt(rng, pool.length)]!.id);
        return true;
      }
    }
    wolfAct(state, witch.id, "pass");
    return true;
  }
  if (w.sub === "vote") {
    const bot = alive(w).find((s) => bots.some((b) => b.id === s.id) && !w.votes[s.id]);
    if (!bot) return false;
    const pool = alive(w).filter((s) => s.id !== bot.id);
    if (!pool.length) return false;
    const rng = rngOf(state, `v:${bot.id}:${w.day}`);
    wolfAct(state, bot.id, "vote", pool[rngInt(rng, pool.length)]!.id);
    return true;
  }
  if (w.sub === "hunter" && w.hunterId && bots.some((b) => b.id === w.hunterId)) {
    const pool = alive(w);
    if (!pool.length) return false;
    const rng = rngOf(state, `h:${w.hunterId}`);
    wolfAct(state, w.hunterId, "shoot", pool[rngInt(rng, pool.length)]!.id);
    return true;
  }
  return false;
}

export function wolfAwaiting(state: GameState, id: string | null): boolean {
  const w = state.wolf;
  if (!w || !id) return false;
  const me = seat(w, id);
  if (!me) return false;
  if (w.sub === "card") return !w.readyIds.includes(id);
  if (!me.alive && !(w.sub === "hunter" && w.hunterId === id)) return false;
  if (w.sub === "night" && w.nightStep === "wolf") return me.role === "wolf" && !w.wolfVotes[id];
  if (w.sub === "night" && w.nightStep === "seer") return me.role === "seer";
  if (w.sub === "night" && w.nightStep === "witch") return me.role === "witch";
  if (w.sub === "vote") return !w.votes[id];
  if (w.sub === "hunter") return w.hunterId === id;
  return false;
}
