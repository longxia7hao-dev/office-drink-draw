import { create } from "zustand";
import { newRoomCode, newSeed } from "./rng";
import { BOT_NAMES } from "./bots";
import { getRole } from "./roles";
import { playMeow } from "./sfx";
import { preloadReactCards } from "./art";
import { netSend } from "./netBridge";
import {
  artistAddStroke,
  artistAdvance,
  artistGuess,
  artistOrderReady,
  artistPickWord,
  artistStopDraw,
  artistUndo,
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
  neverAnswer,
  neverConfirm,
  neverMarkReady,
  neverToggle,
  notePresence,
  setPlayerRole,
  spendCoverRepay,
  spendSkipToken,
  autoBotSkip,
  spinWheel,
  addCups,
  allRolesPicked,
  claimSeat,
  confirmChaos,
  consumeDrag,
  flushPunish,
  launchCoreMode,
  linerAdvance,
  linerBegin,
  linerMarkReady,
  linerSetRounds,
  linerSpinDone,
  linerSubmit,
  linerVote,
  markGateReady,
  matchDeal,
  matchTap,
  matchFlipBack,
  matchArm,
  matchBeginSwap,
  matchSwapReady,
  matchCancelSwap,
  matchCommitSwap,
  matchAgain,
  reactAdvance,
  reactAgain,
  reactBegin,
  reactFail,
  reactFinish,
  reactMarkReady,
  reactContinue,
  reactRelease,
  reactSetHard,
  reactTickCount,
  reactTap,
  reactMustTap,
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
  whoMarkReady,
  whoVote,
  castBotSkill,
  type GameMode,
  type GameState,
  type SyncPayload,
} from "./state";
import { startWolf, wolfAct as dispatchWolf, wolfPump, type WolfAct } from "./wolf";

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
  | { t: "ask-sync"; name?: string }
  | { t: "claim"; id: string }
  | { t: "pick-role"; roleId: string }
  | { t: "match-tap"; i: number }
  | { t: "match-swap" }
  | { t: "use-skill"; id?: string }
  | { t: "skill-target"; id: string }
  | { t: "skill-opt"; opt: string }
  | { t: "skip-skill" }
  | { t: "repay-cover" }
  | { t: "use-skip" }
  | { t: "react-ready" }
  | { t: "react-tap"; id?: string; card?: number }
  | { t: "react-again" }
  | { t: "gate-ready" }
  | { t: "react-hard"; hard: boolean }
  | { t: "never-say"; did: boolean }
  | { t: "never-ready" }
  | { t: "artist-pick"; id: string }
  | { t: "artist-stroke"; pts: number[] }
  | { t: "artist-undo" }
  | { t: "artist-done" }
  | { t: "artist-guess"; id: string }
  | { t: "artist-next" }
  | { t: "liner-line"; text: string }
  | { t: "liner-vote"; hit: boolean }
  | { t: "liner-ready" }
  | { t: "who-ready" }
  | { t: "wolf-act"; kind: WolfAct; id?: string };

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
  claimSeat: (peerId: string, name: string, live: string[]) => string | null;
  notePresence: (live: string[]) => void;
  adoptSeat: (id: string) => void;
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
  useSkill: (pid?: string) => void;
  skipSkill: () => void;
  skillTarget: (targetId: string) => void;
  skillOpt: (opt: string) => void;
  repayCover: (pid?: string) => void;
  useSkip: (pid?: string) => void;
  applyRemoteSync: (payload: SyncPayload) => void;
  snapshot: () => SyncPayload;
  burst: () => void;
  beginKing: () => void;
  kingRevealDone: () => void;
  kingPickCmd: (id: string) => void;
  kingTap: (id: string) => void;
  beginNever: () => void;
  neverTap: (id: string) => void;
  neverSay: (did: boolean, pid?: string) => void;
  neverDone: () => void;
  neverNext: () => void;
  markNeverReady: (ids?: string | string[]) => void;
  linerSetRounds: (n: number) => void;
  linerBegin: () => void;
  linerSpinDone: () => void;
  linerSubmit: (text: string, pid?: string) => void;
  linerVote: (hit: boolean, pid?: string) => void;
  linerReady: (ids?: string | string[]) => void;
  linerNext: () => void;
  linerLeave: () => void;
  artistOrderDone: () => void;
  artistPick: (wordId: string, pid?: string) => void;
  artistStroke: (pts: number[], pid?: string) => void;
  artistUndo: (pid?: string) => void;
  artistDone: (pid?: string) => void;
  artistGuess: (optionId: string, pid?: string) => void;
  artistNext: () => void;
  beginWheel: () => void;
  wheelGo: () => void;
  wheelLanded: () => void;
  wheelTap: (id: string) => void;
  toRecap: () => void;
  setPunishLabel: (label: string) => void;
  setAllow18: (v: boolean) => void;
  beginCore: (mode: GameMode, cat?: string | null) => void;
  setModeFocus: (i: number) => void;
  armMode: (mode: GameMode) => void;
  markGate: (ids?: string | string[]) => void;
  confirmChaosCard: () => void;
  dragExtra: (id: string) => void;
  voteWho: (targetId: string, voterId?: string) => void;
  nextWho: () => void;
  markWhoReady: (ids?: string | string[]) => void;
  runBotSkill: () => void;
  pickTruth: (took: "answer" | "punish") => void;
  nextTruth: () => void;
  startReactPlay: () => void;
  finishReact: (misses: number) => void;
  nextReact: () => void;
  againReact: () => void;
  setReactHard: (hard: boolean) => void;
  markReactReady: (pid?: string) => void;
  tickReactCount: () => void;
  failReact: (pid?: string) => void;
  beatReact: () => void;
  releaseReact: () => void;
  tapReact: (pid?: string, card?: number) => "miss" | "ok" | "ignore";
  timeoutReact: () => void;
  dealMatch: (n: 8 | 12 | 18) => void;
  againMatch: () => void;
  armMatch: () => void;
  tapMatch: (i: number, pid?: string) => void;
  flipMatch: () => void;
  swapMatch: (pid?: string) => void;
  readyMatchSwap: () => void;
  cancelMatchSwap: () => void;
  commitMatchSwap: () => void;
  advanceFlip: () => void;
  wolfAct: (kind: WolfAct, targetId?: string, pid?: string) => void;
  wolfPump: () => void;
  wolfAgain: () => void;
}

function cloneState<T extends GameState>(s: T): T {
  return {
    ...s,
    gateReady: [...(s.gateReady ?? [])],
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
    never: s.never
      ? {
          ...s.never,
          deck: [...s.never.deck],
          marked: [...s.never.marked],
          passed: [...(s.never.passed ?? [])],
          readyIds: [...(s.never.readyIds ?? [])],
        }
      : null,
    wheel: s.wheel ? { ...s.wheel, drinkerIds: [...s.wheel.drinkerIds] } : null,
    artist: s.artist
      ? {
          ...s.artist,
          deck: [...s.artist.deck],
          order: [...s.artist.order],
          choices: [...s.artist.choices],
          options: [...s.artist.options],
          strokes: s.artist.strokes.map((st) => [...st]),
          guesses: { ...s.artist.guesses },
          wrongIds: [...s.artist.wrongIds],
          faults: { ...(s.artist.faults ?? {}) },
        }
      : null,
    oneliner: s.oneliner
      ? {
          ...s.oneliner,
          order: [...s.oneliner.order],
          sitDeck: [...s.oneliner.sitDeck],
          effDeck: [...s.oneliner.effDeck],
          votes: { ...s.oneliner.votes },
          scores: { ...s.oneliner.scores },
          readyIds: [...(s.oneliner.readyIds ?? [])],
          best: [...(s.oneliner.best ?? [])],
          worst: [...(s.oneliner.worst ?? [])],
        }
      : null,
    who: s.who
      ? {
          ...s.who,
          deck: [...s.who.deck],
          votes: { ...s.who.votes },
          punishedIds: [...s.who.punishedIds],
          readyIds: [...(s.who.readyIds ?? [])],
        }
      : null,
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
          losers: [...(s.match.losers ?? [])],
        }
      : null,
    award: s.award ? { ...s.award, worst: [...s.award.worst], best: [...s.award.best] } : null,
    wolf: s.wolf
      ? {
          ...s.wolf,
          seats: s.wolf.seats.map((seat) => ({ ...seat })),
          seerLog: s.wolf.seerLog.map((row) => ({ ...row })),
          wolfVotes: { ...s.wolf.wolfVotes },
          deathCause: { ...s.wolf.deathCause },
          votes: { ...s.wolf.votes },
          readyIds: [...s.wolf.readyIds],
          deaths: [...s.wolf.deaths],
          log: [...s.wolf.log],
        }
      : null,
    hitAmt: { ...(s.hitAmt ?? {}) },
    seatAlias: { ...(s.seatAlias ?? {}) },
    skillFlash: s.skillFlash ? { ...s.skillFlash } : null,
    chaos: s.chaos ? { ...s.chaos } : null,
  };
}

function seatKey(code: string): string {
  return `odd-seat:${code}`;
}

function readSeat(code: string): { id: string; name: string } | null {
  try {
    const raw = localStorage.getItem(seatKey(code));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { id?: string; name?: string };
    if (!parsed.id) return null;
    return { id: parsed.id, name: parsed.name || "" };
  } catch {
    return null;
  }
}

function writeSeat(code: string, id: string, name: string): void {
  try {
    localStorage.setItem(seatKey(code), JSON.stringify({ id, name }));
  } catch {
    /* ignore */
  }
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
  setSetupBots: (n) => set({ setupBots: Math.max(2, Math.min(11, n)) }),
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
      const n = Math.max(2, Math.min(11, s.setupBots));
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
    const saved = readSeat(code);
    const playerId = saved?.id?.startsWith("h-") ? saved.id : `h-${Math.random().toString(36).slice(2, 10)}`;
    const nm = name.trim() || "房主";
    writeSeat(code, playerId, nm);
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
    const saved = readSeat(c);
    const playerId = saved?.id ?? `g-${Math.random().toString(36).slice(2, 10)}`;
    const nm = name.trim() || saved?.name || "玩家";
    writeSeat(c, playerId, nm);
    set({
      overlay: null,
      isOnline: true,
      isHost: false,
      roomCode: c,
      myPlayerId: playerId,
      phase: "lobby",
      notice: "",
      roster: [{ id: playerId, name: nm, connected: true }],
    });
    return { code: c };
  },
  setMyIdentity: (id, isHost) => set({ myPlayerId: id, isHost, hostId: isHost ? id : get().hostId }),
  setJoinedNet: (v) => set({ joinedNet: v }),
  setRoster: (r) => set({ roster: r }),
  claimSeat: (peerId, name, live) => {
    const cur = get();
    const s = cloneState(cur);
    const id = claimSeat(s, peerId, name, live);
    if (!id) return null;
    const changed =
      id !== peerId ||
      s.phase !== cur.phase ||
      s.players.some((p, i) => p.connected !== cur.players[i]?.connected);
    if (changed) set(s);
    return id;
  },
  notePresence: (live) => {
    const cur = get();
    if (!cur.isOnline || !cur.isHost) return;
    const s = cloneState(cur);
    const before = s.players.map((p) => `${p.id}:${p.connected ? 1 : 0}`).join(",");
    const phase = s.phase;
    const sub = s.artist?.sub ?? s.flip?.sub ?? s.who?.sub ?? s.never?.sub ?? s.oneliner?.sub ?? "";
    notePresence(s, live);
    const after = s.players.map((p) => `${p.id}:${p.connected ? 1 : 0}`).join(",");
    const sub2 = s.artist?.sub ?? s.flip?.sub ?? s.who?.sub ?? s.never?.sub ?? s.oneliner?.sub ?? "";
    if (before === after && phase === s.phase && sub === sub2) return;
    set(s);
  },
  adoptSeat: (id) => {
    const cur = get();
    if (!id || id === cur.myPlayerId) return;
    if (cur.roomCode) {
      const name = cur.players.find((p) => p.id === id)?.name || readSeat(cur.roomCode)?.name || "玩家";
      writeSeat(cur.roomCode, id, name);
    }
    set({ myPlayerId: id });
  },
  startOnline: () => {
    const s = get();
    if (!s.isHost) return "只有房主可以開始";
    const names = s.roster.map((p) => p.name);
    if (names.length < 2) return "至少需要 2 人";
    if (names.length > 12) return "連線房最多 12 人";
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
      modeArm: null,
      gateReady: [],
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
  useSkill: (pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "use-skill", id: cur.myPlayerId ?? "" });
      return;
    }
    const s = cloneState(cur);
    const me =
      s.players.find((p) => p.id === (pid ?? s.myPlayerId)) ?? s.players.find((p) => !p.isBot);
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
    const cur = get();
    if (cur.isOnline && !cur.isHost) {
      netSend.current?.({ t: "skip-skill" });
      return;
    }
    const s = cloneState(cur);
    declineSkill(s);
    s.burstKey += 1;
    set(s);
  },
  skillTarget: (targetId) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) {
      netSend.current?.({ t: "skill-target", id: targetId });
      return;
    }
    const s = cloneState(cur);
    const kind = s.lastResult?.skillKind ?? "none";
    continueAfterSkill(s, applySkill(s, kind, targetId));
    s.burstKey += 1;
    set(s);
  },
  skillOpt: (opt) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) {
      netSend.current?.({ t: "skill-opt", opt });
      return;
    }
    const s = cloneState(cur);
    const kind = s.lastResult?.skillKind ?? "none";
    const msg = applySkill(s, kind, undefined, opt);
    continueAfterSkill(s, msg);
    s.burstKey += 1;
    set(s);
  },
  repayCover: (pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "repay-cover" });
      return;
    }
    const s = cloneState(cur);
    const msg = spendCoverRepay(s, pid ?? cur.myPlayerId ?? "");
    if (msg) s.skillMessage = msg;
    s.burstKey += 1;
    set(s);
  },
  useSkip: (pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "use-skip" });
      return;
    }
    const s = cloneState(cur);
    const msg = spendSkipToken(s, pid ?? cur.myPlayerId ?? "");
    if (!msg) return;
    s.skillMessage = msg;
    s.burstKey += 1;
    set(s);
  },
  applyRemoteSync: (payload) => {
    const prev = get().match?.found ?? 0;
    const s = cloneState(get());
    applySync(s, payload);
    if ((s.match?.found ?? 0) > prev) playMeow();
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
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    neverToggle(s, id);
    set(s);
  },
  neverSay: (did, pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "never-say", did });
      return;
    }
    const s = cloneState(cur);
    neverAnswer(s, pid ?? s.myPlayerId ?? "", did);
    s.burstKey += 1;
    set(s);
  },
  neverDone: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    neverConfirm(s);
    s.burstKey += 1;
    set(s);
  },
  neverNext: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    neverAdvance(s);
    s.burstKey += 1;
    set(s);
  },
  markNeverReady: (ids) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && ids == null) {
      netSend.current?.({ t: "never-ready" });
      return;
    }
    const list = (ids == null ? [cur.myPlayerId ?? ""] : Array.isArray(ids) ? ids : [ids]).filter(Boolean);
    const s = cloneState(cur);
    for (const id of list) neverMarkReady(s, id);
    set(s);
  },
  linerSetRounds: (n) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    linerSetRounds(s, n);
    set(s);
  },
  linerBegin: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    linerBegin(s);
    s.burstKey += 1;
    set(s);
  },
  linerSpinDone: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    linerSpinDone(s);
    s.burstKey += 1;
    set(s);
  },
  linerSubmit: (text, pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "liner-line", text });
      return;
    }
    const s = cloneState(cur);
    linerSubmit(s, text, pid ?? cur.myPlayerId ?? undefined);
    s.burstKey += 1;
    set(s);
  },
  linerVote: (hit, pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "liner-vote", hit });
      return;
    }
    const s = cloneState(cur);
    linerVote(s, hit, pid ?? cur.myPlayerId ?? "");
    s.burstKey += 1;
    set(s);
  },
  linerReady: (ids) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && ids == null) {
      netSend.current?.({ t: "liner-ready" });
      return;
    }
    const list = (ids == null ? [cur.myPlayerId ?? ""] : Array.isArray(ids) ? ids : [ids]).filter(Boolean);
    const s = cloneState(cur);
    for (const id of list) linerMarkReady(s, id);
    set(s);
  },
  linerNext: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    linerAdvance(s);
    s.burstKey += 1;
    set(s);
  },
  linerLeave: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    flushPunish(s);
    s.phase = "mode_select";
    s.oneliner = null;
    s.hitAmt = {};
    s.punishQueue = [];
    s.burstKey += 1;
    set(s);
  },
  artistOrderDone: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    artistOrderReady(s);
    s.burstKey += 1;
    set(s);
  },
  artistPick: (wordId, pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "artist-pick", id: wordId });
      return;
    }
    const s = cloneState(cur);
    artistPickWord(s, pid ?? s.myPlayerId ?? "", wordId);
    s.burstKey += 1;
    set(s);
  },
  artistStroke: (pts, pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "artist-stroke", pts });
      const s = cloneState(cur);
      artistAddStroke(s, s.myPlayerId ?? "", pts);
      set(s);
      return;
    }
    const s = cloneState(cur);
    artistAddStroke(s, pid ?? s.myPlayerId ?? "", pts);
    set(s);
  },
  artistUndo: (pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "artist-undo" });
      const s = cloneState(cur);
      artistUndo(s, s.myPlayerId ?? "");
      set(s);
      return;
    }
    const s = cloneState(cur);
    artistUndo(s, pid);
    set(s);
  },
  artistDone: (pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "artist-done" });
      return;
    }
    const s = cloneState(cur);
    artistStopDraw(s, pid);
    s.burstKey += 1;
    set(s);
  },
  artistGuess: (optionId, pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "artist-guess", id: optionId });
      return;
    }
    const s = cloneState(cur);
    artistGuess(s, pid ?? s.myPlayerId ?? "", optionId);
    s.burstKey += 1;
    set(s);
  },
  artistNext: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    artistAdvance(s);
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
    s.modeArm = null;
    if (mode === "wolf") {
      if (s.players.length < 6) {
        s.notice = "狼人殺至少要 6 人。";
        set(s);
        return;
      }
      s.notice = "";
      startWolf(s);
      s.overlay = null;
      s.burstKey += 1;
      set(s);
      return;
    }
    if (mode === "flip_battle") s.flipCat = cat ?? null;
    launchCoreMode(s, mode);
    s.overlay = null;
    s.burstKey += 1;
    set(s);
  },
  setModeFocus: (i) => {
    const cur = get();
    if (cur.modeArm) return;
    if (cur.isOnline && !cur.isHost) return;
    const n = 4;
    const idx = ((i % n) + n) % n;
    set({ modeFocus: idx });
  },
  armMode: (mode) => {
    const cur = get();
    if (cur.modeArm) return;
    if (cur.isOnline && !cur.isHost) return;
    set({ modeArm: mode });
  },
  markGate: (ids) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && ids == null) {
      netSend.current?.({ t: "gate-ready" });
      return;
    }
    const list = (ids == null ? [cur.myPlayerId ?? ""] : Array.isArray(ids) ? ids : [ids]).filter(Boolean);
    const s = cloneState(cur);
    for (const id of list) markGateReady(s, id);
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
  markWhoReady: (ids) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && ids == null) {
      netSend.current?.({ t: "who-ready" });
      return;
    }
    const list = (ids == null ? [cur.myPlayerId ?? ""] : Array.isArray(ids) ? ids : [ids]).filter(Boolean);
    const s = cloneState(cur);
    for (const id of list) whoMarkReady(s, id);
    set(s);
  },
  runBotSkill: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    if (cur.skillFlash || cur.phase === "skill") return;
    const s = cloneState(cur);
    if (autoBotSkip(s)) {
      s.burstKey += 1;
      set(s);
      return;
    }
    if (!castBotSkill(s)) return;
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
  againReact: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) {
      netSend.current?.({ t: "react-again" });
      return;
    }
    const s = cloneState(cur);
    reactAgain(s);
    s.burstKey += 1;
    set(s);
  },
  setReactHard: (hard) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) {
      netSend.current?.({ t: "react-hard", hard });
      return;
    }
    const s = cloneState(cur);
    reactSetHard(s, hard);
    set(s);
  },
  markReactReady: (pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "react-ready" });
      return;
    }
    const s = cloneState(cur);
    reactMarkReady(s, pid ?? s.myPlayerId ?? s.players[0]?.id ?? "");
    set(s);
  },
  tickReactCount: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
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
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    reactContinue(s);
    set(s);
  },
  releaseReact: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    reactRelease(s);
    set(s);
  },
  tapReact: (pid, card) => {
    const cur = get();
    const who = pid ?? cur.myPlayerId ?? "";
    if (cur.isOnline && !cur.isHost) {
      const id = cur.myPlayerId || who;
      if (id) netSend.current?.({ t: "react-tap", id, card: cur.react?.card ?? 0 });
      if (!cur.react || cur.react.sub !== "play") return "ignore";
      return reactMustTap(cur.react) ? "ok" : "miss";
    }
    if (cur.react && card != null && card > 0 && cur.react.card !== card) return "ignore";
    const s = cloneState(cur);
    const result = reactTap(s, who);
    if (result === "miss") playMeow();
    s.burstKey += 1;
    set(s);
    return result;
  },
  timeoutReact: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    const wasPlay = s.react?.sub === "play";
    reactTimeout(s);
    if (wasPlay && s.react && s.react.sub !== "play") playMeow();
    s.burstKey += 1;
    set(s);
  },
  dealMatch: (n) => {
    const s = cloneState(get());
    matchDeal(s, n);
    set(s);
    preloadReactCards((s.match?.tiles ?? []).map((t) => t.file));
  },
  againMatch: () => {
    const s = cloneState(get());
    matchAgain(s);
    s.burstKey += 1;
    set(s);
    preloadReactCards((s.match?.tiles ?? []).map((t) => t.file));
  },
  armMatch: () => {
    const s = cloneState(get());
    matchArm(s);
    set(s);
  },
  tapMatch: (i, pid) => {
    const cur = get();
    const who = pid ?? cur.myPlayerId ?? cur.match?.turn ?? "";
    if (cur.isOnline && !cur.isHost) {
      netSend.current?.({ t: "match-tap", i });
      return;
    }
    const s = cloneState(cur);
    const before = s.match?.found ?? 0;
    matchTap(s, i, who);
    if ((s.match?.found ?? 0) > before) {
      playMeow();
      s.burstKey += 1;
    }
    set(s);
  },
  flipMatch: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    matchFlipBack(s);
    set(s);
  },
  swapMatch: (pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) {
      netSend.current?.({ t: "match-swap" });
      return;
    }
    const s = cloneState(cur);
    matchBeginSwap(s, pid ?? cur.myPlayerId ?? "");
    s.burstKey += 1;
    set(s);
  },
  readyMatchSwap: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    matchSwapReady(s);
    set(s);
  },
  cancelMatchSwap: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    matchCancelSwap(s);
    set(s);
  },
  commitMatchSwap: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    matchCommitSwap(s);
    set(s);
  },
  advanceFlip: () => {
    const s = cloneState(get());
    flipAdvance(s);
    s.burstKey += 1;
    set(s);
  },
  wolfAct: (kind, targetId, pid) => {
    const cur = get();
    if (cur.isOnline && !cur.isHost && !pid) {
      netSend.current?.({ t: "wolf-act", kind, id: targetId });
      return;
    }
    const s = cloneState(cur);
    dispatchWolf(s, pid ?? s.myPlayerId ?? "", kind, targetId);
    s.burstKey += 1;
    set(s);
  },
  wolfPump: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    if (!wolfPump(s)) return;
    s.burstKey += 1;
    set(s);
  },
  wolfAgain: () => {
    const cur = get();
    if (cur.isOnline && !cur.isHost) return;
    const s = cloneState(cur);
    if (!startWolf(s)) {
      s.notice = "狼人殺至少要 6 人。";
      set(s);
      return;
    }
    s.burstKey += 1;
    set(s);
  },
}));
