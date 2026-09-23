import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useP2PRoom } from "@/lib/multiplayer/use-p2p-room";
import { bootBgm, setBgmTrack, unlockSfx } from "@/game/sfx";
import { APP_VERSION } from "@/game/version";
import "@/game/odd";
import { useGame, type NetMsg } from "@/game/store";
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
import { AwardScreen, ChaosScreen, KingScreen, MatchScreen, NeverScreen, RecapScreen, ReactScreen, TruthScreen, WheelScreen, WhoScreen } from "./partyScreens";
import { Portrait } from "./artui";

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
      connected: p.connectionState === "connected",
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
      if (data.t === "ready") {
        const done = markReady(from);
        if (done) {
          window.setTimeout(() => {
            useGame.getState().advanceFlip();
          }, 350);
        }
      }
    });
  }, [p2p, p2p.onMessage, isHost, applyRemoteSync, pickFlip, markReady, pickRole, pushSync]);

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

const netSend: { current: ((msg: NetMsg, to?: string) => void) | null } = { current: null };

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
  const soloReadyNext = useGame((s) => s.soloReadyNext);
  const markReady = useGame((s) => s.markReady);
  const pickRoleStore = useGame((s) => s.pickRole);
  const skillFlash = useGame((s) => s.skillFlash);
  const burstKey = useGame((s) => s.burstKey);
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
    const ms = skillFlash.skill === "調換" ? 1000 : 1800;
    const t = window.setTimeout(() => setFlashOn(false), ms);
    return () => window.clearTimeout(t);
  }, [burstKey, skillFlash?.skill]);

  useEffect(() => {
    setBgmTrack(
      phase === "who"
        ? "who"
        : phase === "truth"
          ? "truth"
          : phase === "flip_battle" || phase === "react" || phase === "match"
            ? "flip"
            : "main",
    );
  }, [phase]);

  useEffect(() => {
    const onErr = () => {
      setNotice("連線失敗或逾時。請返回重試；單機練習仍可使用。");
    };
    window.addEventListener("odd:connection-error", onErr);
    return () => window.removeEventListener("odd:connection-error", onErr);
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
    }, 15000);
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
    const done = s.isOnline && s.myPlayerId ? markReady(s.myPlayerId) : soloReadyNext();
    if (done) {
      window.setTimeout(() => {
        useGame.getState().advanceFlip();
      }, 350);
    }
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
        <div className={`skill-burst${skillFlash.skill === "調換" ? " is-hold" : ""}`} role="status">
          <Portrait roleId={skillFlash.roleId} size={192} />
          <strong>
            {skillFlash.name} 使用了 {skillFlash.skill}
          </strong>
          <p>{skillFlash.msg}</p>
        </div>
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
      {phase === "home" && !splash ? (
        <a className="making-of-link" href="/making-of">
          開發精華
        </a>
      ) : null}
    </div>
  );
}
