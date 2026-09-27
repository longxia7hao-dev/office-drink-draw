import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useP2PRoom } from "@/lib/multiplayer/use-p2p-room";
import { bootBgm, setBgmTrack, unlockSfx } from "@/game/sfx";
import { APP_VERSION } from "@/game/version";
import "@/game/odd";
import { useGame, type NetMsg } from "@/game/store";
import { netSend } from "@/game/netBridge";
import { TopFabs, WallBg } from "./chrome";
import { StudioSplash } from "./StudioSplash";
import { usePracticeBots } from "./usePracticeBots";
import {
  AchievementsOverlay,
  BoardOverlay,
  DrawingScreen,
  FlipBattleScreen,
  FlipCatsOverlay,
  FriendsOverlay,
  HomeScreen,
  HostNameOverlay,
  JoinOverlay,
  LobbyScreen,
  ModesScreen,
  PacksOverlay,
  PickRoleScreen,
  ResultScreen,
  RevealScreen,
  RolesPreviewScreen,
  RolesScreen,
  RulesOverlay,
  SettingsOverlay,
  SetupScreen,
  SkillScreen,
} from "./screens";
import { AwardScreen, ArtistScreen, ChaosScreen, KingScreen, MatchScreen, NeverScreen, RecapScreen, ReactScreen, TruthScreen, WheelScreen, WhoScreen } from "./partyScreens";
import { OneLinerScreen } from "./OneLinerScreen";
import { Portrait } from "./artui";
import { fillPunish } from "@/game/partyPlay";
import { getRole } from "@/game/roles";

function isNetMsg(data: unknown): data is NetMsg {
  return typeof data === "object" && data !== null && "t" in data && typeof (data as { t: unknown }).t === "string";
}

function OnlineBridge({
  roomCode,
  selfId,
  name,
  isHost,
}: {
  roomCode: string;
  selfId: string;
  name: string;
  isHost: boolean;
}) {
  const p2p = useP2PRoom({
    room: `odd${roomCode}`.slice(0, 64),
    selfId,
    name,
  });
  const setJoinedNet = useGame((s) => s.setJoinedNet);
  const setRoster = useGame((s) => s.setRoster);
  const applyRemoteSync = useGame((s) => s.applyRemoteSync);
  const pickFlip = useGame((s) => s.pickFlip);
  const markReady = useGame((s) => s.markReady);
  const pickRole = useGame((s) => s.pickRole);
  const tapMatch = useGame((s) => s.tapMatch);
  const swapMatch = useGame((s) => s.swapMatch);
  const useSkill = useGame((s) => s.useSkill);
  const skillTarget = useGame((s) => s.skillTarget);
  const repayCover = useGame((s) => s.repayCover);
  const useSkip = useGame((s) => s.useSkip);
  const markReactReady = useGame((s) => s.markReactReady);
  const tapReact = useGame((s) => s.tapReact);
  const againReact = useGame((s) => s.againReact);
  const setReactHard = useGame((s) => s.setReactHard);
  const neverSay = useGame((s) => s.neverSay);
  const artistPick = useGame((s) => s.artistPick);
  const artistStroke = useGame((s) => s.artistStroke);
  const artistUndo = useGame((s) => s.artistUndo);
  const artistDone = useGame((s) => s.artistDone);
  const artistGuess = useGame((s) => s.artistGuess);
  const artistNext = useGame((s) => s.artistNext);
  const markWhoReady = useGame((s) => s.markWhoReady);
  const markNeverReady = useGame((s) => s.markNeverReady);
  const linerSubmit = useGame((s) => s.linerSubmit);
  const linerVote = useGame((s) => s.linerVote);
  const linerReady = useGame((s) => s.linerReady);
  const snapshot = useGame((s) => s.snapshot);
  const hostId = useGame((s) => s.hostId);

  useEffect(() => {
    setJoinedNet(p2p.joined);
  }, [p2p.joined, setJoinedNet]);

  useEffect(() => {
    const mine = { id: selfId, name, connected: true };
    const others = p2p.peers.map((p) => ({
      id: p.id,
      name: p.name || "玩家",
      connected: true,
    }));
    setRoster([mine, ...others]);
  }, [p2p.peers, selfId, name, setRoster]);

  const pushSync = useCallback(
    (to?: string) => {
      if (!isHost) return;
      const payload = snapshot();
      if (to) p2p.send({ t: "sync", payload }, to);
      else p2p.send({ t: "sync", payload });
    },
    [isHost, p2p, snapshot],
  );

  useEffect(() => {
    if (!isHost || !p2p.joined) return;
    return useGame.subscribe(() => {
      p2p.send({ t: "sync", payload: useGame.getState().snapshot() });
    });
  }, [isHost, p2p, p2p.joined, p2p.send]);

  useEffect(() => {
    if (p2p.joined && !isHost) {
      p2p.send({ t: "ask-sync" });
    }
  }, [p2p.joined, isHost, p2p, p2p.send]);

  useEffect(() => {
    return p2p.onMessage((from, data) => {
      if (!isNetMsg(data)) return;
      if (data.t === "sync" && !isHost) {
        applyRemoteSync(data.payload);
        return;
      }
      if (!isHost) return;
      if (data.t === "ask-sync") {
        pushSync(from);
        return;
      }
      if (data.t === "vote") {
        pickFlip(data.choice, from);
        return;
      }
      if (data.t === "pick-role") {
        pickRole(from, data.roleId);
        return;
      }
      if (data.t === "match-tap") {
        tapMatch(data.i, from);
        return;
      }
      if (data.t === "match-swap") {
        swapMatch(from);
        return;
      }
      if (data.t === "use-skill") {
        useSkill(data.id || from);
        return;
      }
      if (data.t === "skill-target") {
        skillTarget(data.id);
        return;
      }
      if (data.t === "skill-opt") {
        useGame.getState().skillOpt(data.opt);
        return;
      }
      if (data.t === "skip-skill") {
        useGame.getState().skipSkill();
        return;
      }
      if (data.t === "repay-cover") {
        repayCover(from);
        return;
      }
      if (data.t === "use-skip") {
        useSkip(from);
        return;
      }
      if (data.t === "react-ready") {
        markReactReady(from);
        return;
      }
      if (data.t === "react-tap") {
        tapReact(data.id || from, data.card);
        return;
      }
      if (data.t === "react-again") {
        againReact();
        return;
      }
      if (data.t === "react-hard") {
        setReactHard(data.hard);
        return;
      }
      if (data.t === "never-say") {
        neverSay(data.did, from);
        return;
      }
      if (data.t === "never-ready") {
        markNeverReady(from);
        return;
      }
      if (data.t === "liner-line") {
        linerSubmit(data.text, from);
        return;
      }
      if (data.t === "liner-vote") {
        linerVote(data.hit, from);
        return;
      }
      if (data.t === "liner-ready") {
        linerReady(from);
        return;
      }
      if (data.t === "artist-pick") {
        artistPick(data.id, from);
        return;
      }
      if (data.t === "artist-stroke") {
        artistStroke(data.pts, from);
        return;
      }
      if (data.t === "artist-undo") {
        artistUndo(from);
        return;
      }
      if (data.t === "artist-done") {
        artistDone(from);
        return;
      }
      if (data.t === "artist-guess") {
        artistGuess(data.id, from);
        return;
      }
      if (data.t === "artist-next") {
        artistNext();
        return;
      }
      if (data.t === "who-ready") {
        markWhoReady(from);
        return;
      }
      if (data.t === "ready") {
        markReady(from);
        return;
      }
    });
  }, [p2p, p2p.onMessage, isHost, applyRemoteSync, pickFlip, markReady, pickRole, tapMatch, swapMatch, useSkill, skillTarget, repayCover, useSkip, markReactReady, tapReact, againReact, setReactHard, neverSay, artistPick, artistStroke, artistUndo, artistDone, artistGuess, artistNext, markWhoReady, markNeverReady, linerSubmit, linerVote, linerReady, pushSync]);

  useEffect(() => {
    netSend.current = (msg, to) => {
      if (to) p2p.send(msg, to);
      else if (hostId && !isHost) p2p.send(msg, hostId);
      else p2p.send(msg);
    };
    return () => {
      netSend.current = null;
    };
  }, [p2p, p2p.send, hostId, isHost]);

  return null;
}

export function GameApp({ presetRoom }: { presetRoom?: string }) {
  const phase = useGame((s) => s.phase);
  const overlay = useGame((s) => s.overlay);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const roomCode = useGame((s) => s.roomCode);
  const myPlayerId = useGame((s) => s.myPlayerId);
  const roster = useGame((s) => s.roster);
  const joinedNet = useGame((s) => s.joinedNet);
  const setOverlay = useGame((s) => s.setOverlay);
  const setNotice = useGame((s) => s.setNotice);
  const pickFlip = useGame((s) => s.pickFlip);
  const markReady = useGame((s) => s.markReady);
  const pickRoleStore = useGame((s) => s.pickRole);
  const punishLabel = useGame((s) => s.punishLabel);
  const skillFlash = useGame((s) => s.skillFlash);
  const openedPreset = useRef(false);
  const [splash, setSplash] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  usePracticeBots();

  useEffect(() => {
    if (presetRoom && !openedPreset.current) {
      openedPreset.current = true;
      setOverlay("join");
    }
  }, [presetRoom, setOverlay]);

  useEffect(() => {
    if (!splash) bootBgm();
  }, [splash]);

  useEffect(() => {
    if (!skillFlash) {
      setFlashOn(false);
      return;
    }
    setFlashOn(true);
    if (skillFlash.skill !== "調換") return;
    const t = window.setTimeout(() => setFlashOn(false), 1000);
    return () => window.clearTimeout(t);
  }, [skillFlash?.roleId, skillFlash?.skill, skillFlash?.msg]);

  useEffect(() => {
    setBgmTrack(
      phase === "who"
        ? "who"
        : phase === "truth" || phase === "never" || phase === "artist" || phase === "oneliner"
          ? "truth"
          : phase === "flip_battle" || phase === "react" || phase === "match"
            ? "flip"
            : "main",
    );
  }, [phase]);

  useEffect(() => {
    const onErr = () => {
      setNotice("連線還在重試。請留在房間，對方可直接加入。");
    };
    const onOk = () => {
      const s = useGame.getState();
      if (s.notice.startsWith("連線")) setNotice("");
    };
    window.addEventListener("odd:connection-error", onErr);
    window.addEventListener("odd:connection-ok", onOk);
    return () => {
      window.removeEventListener("odd:connection-error", onErr);
      window.removeEventListener("odd:connection-ok", onOk);
    };
  }, [setNotice]);

  useEffect(() => {
    if (!(isOnline && phase === "lobby" && !isHost)) return;
    const t = window.setTimeout(() => {
      const s = useGame.getState();
      if (
        s.isOnline &&
        s.phase === "lobby" &&
        !s.isHost &&
        !s.roster.some((p) => p.id !== s.myPlayerId && p.connected)
      ) {
        window.dispatchEvent(new Event("odd:connection-error"));
      }
    }, 30000);
    return () => window.clearTimeout(t);
  }, [isOnline, phase, isHost]);

  const myName = roster.find((p) => p.id === myPlayerId)?.name ?? (isHost ? "房主" : "玩家");

  function handlePickRole(playerId: string, roleId: string) {
    const s = useGame.getState();
    if (s.isOnline && !s.isHost) {
      netSend.current?.({ t: "pick-role", roleId });
      return;
    }
    pickRoleStore(playerId, roleId);
  }

  function handleVote(choice: 0 | 1) {
    const s = useGame.getState();
    if (s.isOnline && !s.isHost) {
      netSend.current?.({ t: "vote", choice });
      return;
    }
    const voter = s.isOnline || s.practice ? s.myPlayerId ?? undefined : undefined;
    pickFlip(choice, voter);
  }

  function handleReady() {
    const s = useGame.getState();
    if (s.isOnline && !s.isHost) {
      netSend.current?.({ t: "ready" });
      return;
    }
    if (s.myPlayerId) markReady(s.myPlayerId);
  }

  let view: ReactNode;
  if (overlay === "join") view = <JoinOverlay presetCode={presetRoom} />;
  else if (overlay === "host-name") view = <HostNameOverlay />;
  else if (overlay === "roles-preview") view = <RolesPreviewScreen />;
  else if (overlay === "rules") view = <RulesOverlay />;
  else if (overlay === "packs") view = <PacksOverlay />;
  else if (overlay === "board") view = <BoardOverlay />;
  else if (overlay === "settings") view = <SettingsOverlay />;
  else if (overlay === "friends") view = <FriendsOverlay />;
  else if (overlay === "achievements") view = <AchievementsOverlay />;
  else {
    switch (phase) {
      case "setup":
        view = <SetupScreen />;
        break;
      case "lobby":
        view = <LobbyScreen joined={joinedNet} />;
        break;
      case "pick_role":
        view = <PickRoleScreen onPick={handlePickRole} />;
        break;
      case "roles":
        view = <RolesScreen />;
        break;
      case "mode_select":
        view = <ModesScreen />;
        break;
      case "flip_cat":
        view = <FlipCatsOverlay />;
        break;
      case "drawing":
        view = <DrawingScreen />;
        break;
      case "reveal":
        view = <RevealScreen />;
        break;
      case "skill":
        view = <SkillScreen />;
        break;
      case "result":
        view = <ResultScreen />;
        break;
      case "flip_battle":
        view = <FlipBattleScreen onVote={handleVote} onReady={handleReady} />;
        break;
      case "who":
        view = <WhoScreen />;
        break;
      case "truth":
        view = <TruthScreen />;
        break;
      case "react":
        view = <ReactScreen />;
        break;
      case "match":
        view = <MatchScreen />;
        break;
      case "award":
        view = <AwardScreen />;
        break;
      case "chaos":
        view = <ChaosScreen />;
        break;
      case "king":
        view = <KingScreen />;
        break;
      case "never":
        view = <NeverScreen />;
        break;
      case "artist":
        view = <ArtistScreen />;
        break;
      case "oneliner":
        view = <OneLinerScreen />;
        break;
      case "wheel":
        view = <WheelScreen />;
        break;
      case "recap":
        view = <RecapScreen />;
        break;
      default:
        view = <HomeScreen />;
    }
  }

  return (
    <div
      className={`app-shell${
        (phase === "home" || phase === "mode_select" || phase === "flip_cat") && !overlay && !splash ? " is-home" : ""
      }${splash ? " is-splash" : ""}`}
      onPointerDown={unlockSfx}
    >
      <aside id="landscape-hint" role="status">
        直向遊玩效果最佳
      </aside>
      <WallBg />
      {isOnline && roomCode && myPlayerId ? (
        <OnlineBridge
          key={`${roomCode}:${myPlayerId}`}
          roomCode={roomCode}
          selfId={myPlayerId}
          name={myName}
          isHost={isHost}
        />
      ) : null}
      {splash ? <StudioSplash onDone={() => setSplash(false)} /> : view}
      {flashOn && skillFlash && phase !== "skill" ? (
        <button
          type="button"
          className={`skill-burst is-tap${skillFlash.skill === "調換" ? " is-hold" : ""}`}
          onClick={() => {
            if (skillFlash.skill === "調換") return;
            setFlashOn(false);
          }}
        >
          <Portrait roleId={skillFlash.roleId} size={240} />
          <strong>
            {skillFlash.name} 放技能「{skillFlash.skill}」
          </strong>
          <p>{fillPunish(skillFlash.desc || getRole(skillFlash.roleId).skillDesc, punishLabel)}</p>
          {skillFlash.skill === "調換" ? null : <span className="skill-dismiss">點一下關閉</span>}
        </button>
      ) : null}
      <TopFabs
        onSettings={() => {
          if (splash) setSplash(false);
          const cur = useGame.getState().overlay;
          useGame.getState().setOverlay(cur === "settings" ? null : "settings");
        }}
      />
      <span className="app-ver" aria-hidden="true">
        V{APP_VERSION}
      </span>
    </div>
  );
}
