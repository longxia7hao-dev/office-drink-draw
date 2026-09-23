import { create } from "zustand";
import { newRoomCode, newSeed } from "./rng";
import { BOT_NAMES } from "./bots";
import { getRole } from "./roles";
import { playMeow } from "./sfx";
import { preloadReactCards } from "./art";
import {
  applyBaseDrink,
  applySkill,
  applySync,
  canFireSkill,
  continueAfterSkill,
  createInitialState,
  declineSkill,
  drawOne,
  drawOrder,
  drawTeams,
  fillRemainingRoles,
  fillBotRoles,
  flipAdvance,
  flipAllReady,
  flipMarkReady,
  flipPick,
  kingAddTarget,
  kingChoose,
  kingToPick,
  makeLocalPlayers,
  neverAdvance,
  neverConfirm,
  neverToggle,
  setPlayerRole,
  spinWheel,
  addCups,
  allRolesPicked,
  confirmChaos,
  consumeDrag,
  launchCoreMode,
  matchDeal,
  matchTap,
  matchFlipBack,
  matchArm,
  matchBeginSwap,
  matchSwapReady,
  matchCommitSwap,
  reactAdvance,
  reactBegin,
  reactFail,
  reactFinish,
  reactMarkReady,
  reactNextBeat,
  reactSetHard,
  reactTickCount,
  reactTap,
  reactTimeout,
  goAward,
  startFlipBattle,
  startKing,
  startNever,
  startWheel,
  toSync,
  truthAdvance,
  truthChoose,
  wheelLand,
  wheelPickTarget,
  whoAdvance,
  whoVote,
  type GameMode,
  type GameState,
  type SyncPayload,
} from "./state";

export type Overlay =
  | "join"
  | "host-name"
  | "roles-preview"
  | "rules"
  | "packs"
  | "board"
  | "settings"
  | "friends"
  | "achievements"
  | null;

export interface RosterPeer {
  id: string;
  name: string;
  connected: boolean;
}

export type NetMsg =
  | { t: "sync"; payload: SyncPayload }
  | { t: "hello"; name: string }
  | { t: "vote"; choice: 0 | 1 }
  | { t: "ready" }
  | { t: "ask-sync" }
  | { t: "pick-role"; roleId: string };

interface GameStore extends GameState {
  overlay: Overlay;
  setupNames: string[];
  setupYou: string;
  setupBots: number;
  roster: RosterPeer[];
  notice: string;
  joinedNet: boolean;
  burstKey: number;

  setOverlay: (o: Overlay) => void;
  setNotice: (n: string) => void;
  setSetupName: (i: number, name: string) => void;
  addPlayer: () => void;
  removePlayer: (i: number) => void;
  setSetupYou: (name: string) => void;
  setSetupBots: (n: number) => void;
  goHome: () => void;
  startSolo: () => void;
  confirmSetup: () => void;
  beginHost: (name: string) => { code: string; playerId: string };
  beginJoin: (name: string, code: string) => { code: string } | { error: string };
  setMyIdentity: (id: string, isHost: boolean) => void;
  setJoinedNet: (v: boolean) => void;
  setRoster: (r: RosterPeer[]) => void;
  startOnline: () => string | null;
  pickRole: (playerId: string, roleId: string) => string | null;
  fillRandomRoles: () => void;
  confirmRoles: () => string | null;
  leavePick: () => void;
  backPickRoles: () => void;
  toModes: () => void;
  toFlipCats: () => void;
  backRoles: () => void;
  startCeremony: (mode: GameMode) => void;
  tickCeremony: () => boolean;
  finishDraw: () => void;
  beginFlip: () => void;
  pickFlip: (choice: 0 | 1, voterId?: string) => void;
  markReady: (playerId: string) => boolean;
  soloReadyNext: () => boolean;
  again: () => void;
  useSkill: () => void;
  skipSkill: () => void;
  skillTarget: (targetId: string) => void;
  skillOpt: (opt: string) => void;
  applyRemoteSync: (payload: SyncPayload) => void;
  snapshot: () => SyncPayload;
  burst: () => void;
  beginKing: () => void;
  kingRevealDone: () => void;
  kingPickCmd: (id: string) => void;
  kingTap: (id: string) => void;
  beginNever: () => void;
  neverTap: (id: string) => void;
  neverDone: () => void;
  neverNext: () => void;
  beginWheel: () => void;
  wheelGo: () => void;
  wheelLanded: () => void;
  wheelTap: (id: string) => void;
  toRecap: () => void;
  setPunishLabel: (label: string) => void;
  setAllow18: (v: boolean) => void;
  beginCore: (mode: GameMode, cat?: string | null) => void;
  confirmChaosCard: () => void;
  dragExtra: (id: string) => void;
  voteWho: (targetId: string, voterId?: string) => void;
  nextWho: () => void;
  pickTruth: (took: "answer" | "punish") => void;
  nextTruth: () => void;
  startReactPlay: () => void;
  finishReact: (misses: number) => void;
  nextReact: () => void;
  setReactHard: (hard: boolean) => void;
  markReactReady: (pid?: string) => void;
  tickReactCount: () => void;
  failReact: (pid?: string) => void;
  beatReact: () => void;
  tapReact: (pid?: string) => "miss" | "ok" | "ignore";
  timeoutReact: () => void;
  dealMatch: (n: 8 | 12 | 18) => void;
  armMatch: () => void;
  tapMatch: (i: number, pid?: string) => void;
  flipMatch: () => void;
  swapMatch: (pid?: string) => void;
  readyMatchSwap: () => void;
  commitMatchSwap: () => void;
  advanceFlip: () => void;
}

function cloneState<T extends GameState>(s: T): T {
  return {
    ...s,
    players: s.players.map((p) => ({ ...p })),
    punishQueue: [...(s.punishQueue ?? [])],
    lastResult: s.lastResult
      ? { ...s.lastResult, order: s.lastResult.order?.slice(), teams: s.lastResult.teams?.map((t) => ({ ...t, members: [...t.members] })) }
      : null,
    flip: s.flip
      ? {
          ...s.flip,
          deck: [...s.flip.deck],
          votes: { ...s.flip.votes },
          readyIds: [...s.flip.readyIds],
          drinkerIds: [...s.flip.drinkerIds],
        }
      : null,
    king: s.king
      ? {
          ...s.king,
          numbers: { ...s.king.numbers },
          optionIds: [...s.king.optionIds],
          targetIds: [...s.king.targetIds],
          drinkerIds: [...s.king.drinkerIds],
        }
      : null,
    never: s.never ? { ...s.never, deck: [...s.never.deck], marked: [...s.never.marked] } : null,
    wheel: s.wheel ? { ...s.wheel, drinkerIds: [...s.wheel.drinkerIds] } : null,
    who: s.who ? { ...s.who, deck: [...s.who.deck], votes: { ...s.who.votes }, punishedIds: [...s.who.punishedIds] } : null,
    truth: s.truth ? { ...s.truth, deck: [...s.truth.deck] } : null,
    react: s.react ? { ...s.react, ready: [...s.react.ready], dead: [...s.react.dead], tapped: [...(s.react.tapped ?? [])] } : null,
    match: s.match
      ? {
          ...s.match,
          tiles: s.match.tiles.map((t) => ({ ...t })),
          pick: [...s.match.pick],
          scores: { ...s.match.scores },
          swapped: [...s.match.swapped],
          swapPick: [...(s.match.swapPick ?? [])],
        }
      : null,
    award: s.award ? { ...s.award, worst: [...s.award.worst], best: [...s.award.best] } : null,
    hitAmt: { ...(s.hitAmt ?? {}) },
    skillFlash: s.skillFlash ? { ...s.skillFlash } : null,
    chaos: s.chaos ? { ...s.chaos } : null,
  };
}

export const useGame = create<GameStore>((set, get) => ({
  ...createInitialState(),
  overlay: null,
  setupNames: ["玩家1", "玩家2", "玩家3", "玩家4"],
  setupYou: "你",
  setupBots: 3,
  roster: [],
  notice: "",
  joinedNet: false,
  burstKey: 0,

  setOverlay: (o) => set({ overlay: o, notice: "" }),
  setNotice: (n) => set({ notice: n }),
  setSetupName: (i, name) =>
    set((s) => {
      const names = [...s.setupNames];
      names[i] = name;
      return { setupNames: names };
    }),
  setSetupYou: (name) => set({ setupYou: name }),
  setSetupBots: (n) => set({ setupBots: Math.max(2, Math.min(5, n)) }),
  addPlayer: () =>
    set((s) => {
      if (s.setupNames.length >= 12) return s;
      return { setupNames: [...s.setupNames, `玩家${s.setupNames.length + 1}`] };
    }),
  removePlayer: (i) =>
    set((s) => {
      if (s.setupNames.length <= 2) return s;
      return { setupNames: s.setupNames.filter((_, idx) => idx !== i) };
    }),
  goHome: () =>
    set({
      ...createInitialState(),
      punishLabel: get().punishLabel,
      overlay: null,
      setupNames: get().setupNames.length >= 2 ? get().setupNames : ["玩家1", "玩家2", "玩家3", "玩家4"],
      setupYou: get().setupYou || "你",
      setupBots: get().setupBots || 3,
      roster: [],
      notice: "",
      joinedNet: false,
    }),
  startSolo: () => set({ overlay: null, isOnline: false, isHost: true, practice: true, phase: "setup", notice: "" }),
  confirmSetup: () =>
    set((s) => {
      const you = s.setupYou.trim() || "你";
      const n = Math.max(2, Math.min(5, s.setupBots));
      const seed = newSeed();
      const players = [
        { id: "you", name: you, roleId: "", cups: 0, isBot: false, hasPass: false, skipNext: false },
        ...BOT_NAMES.slice(0, n).map((name, i) => ({
          id: `bot${i}`,
          name,
          roleId: "",
          cups: 0,
          isBot: true,
          hasPass: false,
          skipNext: false,
        })),
      ];
      return {
        seed,
        players,
        myPlayerId: "you",
        hostId: "you",
        drawCount: 0,
        lastResult: null,
        phase: "pick_role" as const,
        overlay: null,
        isOnline: false,
        isHost: true,
        practice: true,
        flip: null,
        king: null,
        never: null,
        wheel: null,
        skillMessage: "",
      };
    }),
  beginHost: (name) => {
    const code = newRoomCode();
    const playerId = `h-${Math.random().toString(36).slice(2, 10)}`;
    set({
      overlay: null,
      isOnline: true,
      isHost: true,
      roomCode: code,
      myPlayerId: playerId,
      hostId: playerId,
      phase: "lobby",
      roster: [{ id: playerId, name: name.trim() || "房主", connected: true }],
      notice: "",
    });
    return { code, playerId };
  },
  beginJoin: (name, code) => {
    const c = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (c.length < 4) return { error: "請輸入 4 碼房間碼" };
    const playerId = `g-${Math.random().toString(36).slice(2, 10)}`;
    set({
      overlay: null,
      isOnline: true,
      isHost: false,
      roomCode: c,
      myPlayerId: playerId,
      phase: "lobby",
      notice: "",
      roster: [{ id: playerId, name: name.trim() || "玩家", connected: true }],
    });
    return { code: c };
  },
  setMyIdentity: (id, isHost) => set({ myPlayerId: id, isHost, hostId: isHost ? id : get().hostId }),
  setJoinedNet: (v) => set({ joinedNet: v }),
  setRoster: (r) => set({ roster: r }),
  startOnline: () => {
    const s = get();
    if (!s.isHost) return "只有房主可以開始";
    const names = s.roster.map((p) => p.name);
    if (names.length < 2) return "至少需要 2 人";
    if (names.length > 8) return "連線房最多 8 人";
    const seed = newSeed();
    const players = makeLocalPlayers(
      names,
      seed,
      s.roster.map((p) => p.id),
    );
    set({
      seed,
      players,
      drawCount: 0,
      lastResult: null,
      phase: "pick_role",
      flip: null,
      king: null,
      never: null,
      wheel: null,
      skillMessage: "",
    });
    return null;
  },
  pickRole: (playerId, roleId) => {
    const s = cloneState(get());
    const err = setPlayerRole(s, playerId, roleId);
    if (err) {
      set({ notice: err });
      return err;
    }
    s.notice = "";
    s.burstKey += 1;
    set(s);
    return null;
  },
  fillRandomRoles: () => {
    const s = cloneState(get());
    if (s.practice) fillBotRoles(s);
    else fillRemainingRoles(s);
    s.notice = "";
    s.burstKey += 1;
    set(s);
  },
  confirmRoles: () => {
    const s = cloneState(get());
    if (s.practice) {
      const me = s.players.find((p) => p.id === s.myPlayerId);
      if (!me?.roleId) return "先選你的角色";
      fillBotRoles(s);
    }
    if (s.players.length < 2) return "至少需要 2 人";
    if (!allRolesPicked(s)) return "每個人都要選一個角色";
    set({ ...s, phase: "roles", notice: "", overlay: null, burstKey: s.burstKey + 1 });
    return null;
  },
  leavePick: () => {
    const s = get();
    if (s.isOnline) {
      set({ phase: "lobby", players: [], notice: "", lastResult: null });
    } else {
      set({ phase: "setup", players: [], notice: "", lastResult: null });
    }
  },
  backPickRoles: () => set({ phase: "pick_role", notice: "" }),
  toModes: () => {
    if (get().isOnline && !get().isHost) return;
    set({
      phase: "mode_select",
      overlay: null,
      skillPending: false,
      flip: null,
      king: null,
      never: null,
      wheel: null,
    });
  },
  toFlipCats: () => {
    if (get().isOnline && !get().isHost) return;
    set({ phase: "flip_cat", overlay: null, notice: "" });
  },
  backRoles: () => {
    if (get().isOnline && !get().isHost) return;
    set({ phase: "roles" });
  },
  startCeremony: (mode) =>
    set({
      mode,
      phase: "drawing",
      ceremonyStep: 0,
      skillPending: false,
      burstKey: get().burstKey + 1,
    }),
  tickCeremony: () => {
    const next = get().ceremonyStep + 1;
    if (next >= 3) return true;
    set({ ceremonyStep: next, burstKey: get().burstKey + 1 });
    return false;
  },
  finishDraw: () => {
    const s = cloneState(get());
    const mode = s.mode;
    if (!mode || mode === "flip_battle" || mode === "king" || mode === "never" || mode === "wheel") return;
    const result = mode === "draw_one" ? drawOne(s) : mode === "drink_order" ? drawOrder(s) : drawTeams(s);
    s.lastResult = result;
    s.drawCount += 1;
    s.phase = "reveal";
    const hit = s.players.find((p) => p.id === result.playerId);
    s.skillPending = mode === "draw_one" && Boolean(hit && canFireSkill(hit));
    if (mode === "draw_one") {
      s.punishActorId = result.playerId;
      s.punishQueue = [result.playerId];
      s.punishAmt = 1;
      s.skillReturnPhase = "reveal";
    }
    if (mode === "draw_one" && !s.skillPending) applyBaseDrink(s);
    if (mode === "drink_order" || mode === "team_toast") {
      addCups(
        s,
        s.players.map((p) => p.id),
        1,
      );
    }
    s.burstKey += 1;
    set(s);
  },
  beginFlip: () => {
    if (get().isOnline && !get().isHost) return;
    const s = cloneState(get());
    launchCoreMode(s, "flip_battle");
    s.burstKey += 1;
    set(s);
  },
  pickFlip: (choice, voterId) => {
    const s = cloneState(get());
    flipPick(s, choice, voterId);
    s.burstKey += 1;
    set(s);
  },
  markReady: (playerId) => {
    const s = cloneState(get());
    flipMarkReady(s, playerId);
    const done = flipAllReady(s);
    set(s);
    return done;
  },
  soloReadyNext: () => {
    const s = cloneState(get());
    if (s.practice) {
      for (const p of s.players) flipMarkReady(s, p.id);
    } else {
      const next = s.players.find((p) => !s.flip?.readyIds.includes(p.id));
      if (next) flipMarkReady(s, next.id);
    }
    const done = flipAllReady(s);
    set(s);
    return done;
  },
  again: () => {
    if (get().isOnline && !get().isHost) return;
    const mode = get().mode;
    if (mode === "flip_battle") get().beginFlip();
    else if (mode === "king") get().beginKing();
    else if (mode === "never") get().neverNext();
    else if (mode === "wheel") get().beginWheel();
    else if (mode) get().startCeremony(mode);
  },
  useSkill: () => {
    const s = cloneState(get());
    const me = s.players.find((p) => p.id === s.myPlayerId) ?? s.players.find((p) => !p.isBot);
    if (!me) return;
    if (s.phase !== "skill") s.skillReturnPhase = s.phase;
    s.punishActorId = me.id;
    const role = getRole(me.roleId);
    s.lastResult = {
      playerId: me.id,
      mode: s.mode ?? "flip_battle",
      message: `${me.name} 使用 ${role.skillName}`,
      drinkHint: role.drink,
      skillKind: role.skillKind,
    };
    s.skillPending = true;
    s.phase = "skill";
    set(s);
  },
  skipSkill: () => {
    const s = cloneState(get());
    declineSkill(s);
    s.burstKey += 1;
    set(s);
  },
  skillTarget: (targetId) => {
    const s = cloneState(get());
    const kind = s.lastResult?.skillKind ?? "none";
    continueAfterSkill(s, applySkill(s, kind, targetId));
    s.burstKey += 1;
    set(s);
  },
  skillOpt: (opt) => {
    const s = cloneState(get());
    const kind = s.lastResult?.skillKind ?? "none";
    const msg = applySkill(s, kind, undefined, opt);
    continueAfterSkill(s, msg);
    s.burstKey += 1;
    set(s);
  },
  applyRemoteSync: (payload) => {
    const s = cloneState(get());
    applySync(s, payload);
    set(s);
  },
  snapshot: () => toSync(get()),
  burst: () => set({ burstKey: get().burstKey + 1 }),
  beginKing: () => {
    const s = cloneState(get());
    startKing(s);
    s.burstKey += 1;
    set(s);
  },
  kingRevealDone: () => {
    const s = cloneState(get());
    kingToPick(s);
    set(s);
  },
  kingPickCmd: (id) => {
    const s = cloneState(get());
    kingChoose(s, id);
    s.burstKey += 1;
    set(s);
  },
  kingTap: (id) => {
    const s = cloneState(get());
    kingAddTarget(s, id);
    s.burstKey += 1;
    set(s);
  },
  beginNever: () => {
    const s = cloneState(get());
    startNever(s);
    s.burstKey += 1;
    set(s);
  },
  neverTap: (id) => {
    const s = cloneState(get());
    neverToggle(s, id);
    set(s);
  },
  neverDone: () => {
    const s = cloneState(get());
    neverConfirm(s);
    s.burstKey += 1;
    set(s);
  },
  neverNext: () => {
    const s = cloneState(get());
    neverAdvance(s);
    s.burstKey += 1;
    set(s);
  },
  beginWheel: () => {
    const s = cloneState(get());
    startWheel(s);
    s.burstKey += 1;
    set(s);
  },
  wheelGo: () => {
    const s = cloneState(get());
    spinWheel(s);
    s.burstKey += 1;
    set(s);
  },
  wheelLanded: () => {
    const s = cloneState(get());
    wheelLand(s);
    s.burstKey += 1;
    set(s);
  },
  wheelTap: (id) => {
    const s = cloneState(get());
    wheelPickTarget(s, id);
    s.burstKey += 1;
    set(s);
  },
  toRecap: () => {
    const s = get();
    try {
      localStorage.setItem(
        "odd-board",
        JSON.stringify(s.players.map((p) => ({ name: p.name, roleId: p.roleId, cups: p.cups || 0 }))),
      );
    } catch {
      /* ignore */
    }
    set({ phase: "recap", burstKey: s.burstKey + 1 });
  },
  setPunishLabel: (label) => set({ punishLabel: label.trim() || "喝半杯" }),
  setAllow18: (v) => {
    try {
      localStorage.setItem("odd-18", v ? "1" : "0");
    } catch {
      /* ignore */
    }
    set({ allow18: v });
  },
  beginCore: (mode, cat) => {
    if (get().isOnline && !get().isHost) return;
    const s = cloneState(get());
    if (mode === "flip_battle") s.flipCat = cat ?? null;
    launchCoreMode(s, mode);
    s.overlay = null;
    s.burstKey += 1;
    set(s);
  },
  confirmChaosCard: () => {
    const s = cloneState(get());
    confirmChaos(s);
    s.burstKey += 1;
    set(s);
  },
  dragExtra: (id) => {
    const s = cloneState(get());
    consumeDrag(s, id);
    if (s.who && s.who.sub === "drag") s.who.sub = "result";
    if (s.truth && s.truth.sub === "drag") s.truth.sub = "result";
    if (s.react && s.react.sub === "drag") s.react.sub = "result";
    s.burstKey += 1;
    set(s);
  },
  voteWho: (targetId, voterId) => {
    const s = cloneState(get());
    whoVote(s, targetId, voterId);
    s.burstKey += 1;
    set(s);
  },
  nextWho: () => {
    const s = cloneState(get());
    whoAdvance(s);
    s.burstKey += 1;
    set(s);
  },
  pickTruth: (took) => {
    const s = cloneState(get());
    truthChoose(s, took);
    s.burstKey += 1;
    set(s);
  },
  nextTruth: () => {
    const s = cloneState(get());
    truthAdvance(s);
    s.burstKey += 1;
    set(s);
  },
  startReactPlay: () => {
    const s = cloneState(get());
    reactBegin(s);
    set(s);
  },
  finishReact: (misses) => {
    const s = cloneState(get());
    reactFinish(s, misses);
    s.burstKey += 1;
    set(s);
  },
  nextReact: () => {
    const s = cloneState(get());
    reactAdvance(s);
    s.burstKey += 1;
    set(s);
  },
  setReactHard: (hard) => {
    const s = cloneState(get());
    reactSetHard(s, hard);
    set(s);
  },
  markReactReady: (pid) => {
    const s = cloneState(get());
    reactMarkReady(s, pid ?? s.myPlayerId ?? s.players[0]?.id ?? "");
    set(s);
  },
  tickReactCount: () => {
    const s = cloneState(get());
    reactTickCount(s);
    set(s);
  },
  failReact: (pid) => {
    const s = cloneState(get());
    reactFail(s, pid ?? s.myPlayerId ?? "");
    s.burstKey += 1;
    set(s);
  },
  beatReact: () => {
    const s = cloneState(get());
    reactNextBeat(s);
    set(s);
  },
  tapReact: (pid) => {
    const s = cloneState(get());
    const result = reactTap(s, pid ?? s.myPlayerId ?? "");
    s.burstKey += 1;
    set(s);
    return result;
  },
  timeoutReact: () => {
    const s = cloneState(get());
    reactTimeout(s);
    s.burstKey += 1;
    set(s);
  },
  dealMatch: (n) => {
    const s = cloneState(get());
    matchDeal(s, n);
    set(s);
    preloadReactCards((s.match?.tiles ?? []).map((t) => t.file));
  },
  armMatch: () => {
    const s = cloneState(get());
    matchArm(s);
    set(s);
  },
  tapMatch: (i, pid) => {
    const s = cloneState(get());
    const before = s.match?.found ?? 0;
    matchTap(s, i, pid ?? s.myPlayerId ?? s.match?.turn ?? "");
    if ((s.match?.found ?? 0) > before) {
      playMeow();
      s.burstKey += 1;
    }
    set(s);
  },
  flipMatch: () => {
    const s = cloneState(get());
    matchFlipBack(s);
    set(s);
  },
  swapMatch: (pid) => {
    const s = cloneState(get());
    matchBeginSwap(s, pid ?? s.myPlayerId ?? "");
    s.burstKey += 1;
    set(s);
  },
  readyMatchSwap: () => {
    const s = cloneState(get());
    matchSwapReady(s);
    set(s);
  },
  commitMatchSwap: () => {
    const s = cloneState(get());
    matchCommitSwap(s);
    set(s);
  },
  advanceFlip: () => {
    const s = cloneState(get());
    flipAdvance(s);
    s.burstKey += 1;
    set(s);
  },
}));
