import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { asset } from "@/game/art";
import { duckBgm, isBgmMuted, sfxSlam, sfxTick, unduckBgm, unlockSfx } from "@/game/sfx";
import { useGame } from "@/game/store";
import { APP_VERSION } from "@/game/version";
import { wolfAwaiting, wolfCanSee, wolfRoleBlurb, wolfRoleCard, wolfRoleName, wolfSetupLabel, type WolfRole } from "@/game/wolf";
import { JUDGE_FILE, judgeCues, type JudgeClip, type JudgeSnap } from "@/game/wolfVoice";
import { Portrait } from "./artui";
import { Screen } from "./chrome";
import { SkillUseBtn } from "./partyScreens";

function RoleArt({ wolfRole, roleId, className }: { wolfRole: WolfRole; roleId: string; className: string }) {
  const [on, setOn] = useState(false);
  return (
    <img
      className={className}
      src={`${asset(wolfRoleCard(wolfRole, roleId))}?v=${APP_VERSION}`}
      alt=""
      draggable={false}
      hidden={!on}
      onLoad={() => setOn(true)}
      onError={() => setOn(false)}
    />
  );
}

export function WolfScreen() {
  const wolf = useGame((s) => s.wolf);
  const players = useGame((s) => s.players);
  const myId = useGame((s) => s.myPlayerId);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const act = useGame((s) => s.wolfAct);
  const pump = useGame((s) => s.wolfPump);
  const again = useGame((s) => s.wolfAgain);
  const toModes = useGame((s) => s.toModes);
  const hostOnly = isOnline && !isHost;
  const sig = wolf
    ? `${wolf.sub}|${wolf.nightStep}|${wolf.day}|${wolf.readyIds.length}|${Object.keys(wolf.wolfVotes).length}|${Object.keys(wolf.votes).length}|${wolf.deaths.join(",")}|${wolf.hunterId ?? ""}|${wolf.hint}`
    : "";
  const voiceSig = wolf
    ? `${wolf.sub}|${wolf.nightStep}|${wolf.deaths.join("|")}|${wolf.log[wolf.log.length - 1] ?? ""}|${wolf.day}`
    : "";

  const holdRef = useRef(false);
  const queueRef = useRef<JudgeClip[]>([]);
  const prevRef = useRef<JudgeSnap | null>(null);
  const seenRef = useRef("");
  const pulling = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const clipLock = useRef<JudgeClip | null>(null);
  const [clip, setClip] = useState<JudgeClip | null>(null);
  const [needTap, setNeedTap] = useState(false);
  const [rev, setRev] = useState(0);
  const [aiming, setAiming] = useState(false);
  const [shotId, setShotId] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (!wolf) {
      prevRef.current = null;
      seenRef.current = "";
      queueRef.current = [];
      holdRef.current = false;
      return;
    }
    if (seenRef.current === voiceSig) return;
    seenRef.current = voiceSig;
    const next: JudgeSnap = {
      sub: wolf.sub,
      step: wolf.nightStep,
      deaths: wolf.deaths.join("|"),
      log: wolf.log[wolf.log.length - 1] ?? "",
    };
    const names: Record<string, string> = {};
    for (const p of players) names[p.id] = p.name;
    const cues = judgeCues(prevRef.current, next, wolf.seats, names);
    prevRef.current = next;
    if (!cues.length) return;
    queueRef.current.push(...cues);
    holdRef.current = true;
    setRev((n) => n + 1);
  }, [voiceSig, wolf, players]);

  useEffect(() => {
    if (clip || pulling.current || !queueRef.current.length) return;
    pulling.current = true;
    const next = queueRef.current.shift() ?? null;
    holdRef.current = next !== null;
    setClip(next);
  }, [rev, clip]);

  useEffect(() => {
    if (clip) pulling.current = false;
  }, [clip]);

  function advanceFrom(mine: JudgeClip) {
    if (clipLock.current !== mine) return;
    clipLock.current = null;
    const next = queueRef.current.shift() ?? null;
    holdRef.current = next !== null;
    setNeedTap(false);
    setClip(next);
  }

  useLayoutEffect(() => {
    if (!clip) {
      clipLock.current = null;
      unduckBgm();
      return;
    }
    const el = videoRef.current;
    if (!el) return;
    const mine = clip;
    clipLock.current = mine;
    let dead = false;
    let cap = 0;
    const done = () => {
      if (dead || clipLock.current !== mine) return;
      dead = true;
      advanceFrom(mine);
    };
    const muted = isBgmMuted();
    el.muted = muted;
    if (muted) unduckBgm();
    else duckBgm(0.06);
    const arm = () => {
      window.clearTimeout(cap);
      const known = el.duration;
      const dur = Number.isFinite(known) && known > 0 && known < 40 ? known : 12;
      cap = window.setTimeout(done, (dur + 8) * 1000);
    };
    el.addEventListener("loadedmetadata", arm);
    el.addEventListener("ended", done);
    el.addEventListener("error", done);
    arm();
    const played = el.play();
    if (played) {
      void played.then(() => {
        if (!dead) setNeedTap(false);
      }).catch(() => {
        if (dead) return;
        setNeedTap(true);
        unduckBgm();
      });
    }
    return () => {
      dead = true;
      window.clearTimeout(cap);
      el.removeEventListener("loadedmetadata", arm);
      el.removeEventListener("ended", done);
      el.removeEventListener("error", done);
    };
  }, [clip]);

  useEffect(() => () => unduckBgm(), []);

  useEffect(() => {
    if (!wolf || wolf.sub === "card" || wolf.knightUsed || (wolf.sub !== "speak" && wolf.sub !== "vote")) setAiming(false);
    if (!wolf || wolf.sub !== "hunter") setShotId(null);
  }, [wolf]);

  useEffect(() => {
    if (!wolf || hostOnly || holdRef.current || clip) return;
    const t = window.setTimeout(() => pump(), 460);
    return () => window.clearTimeout(t);
  }, [sig, hostOnly, pump, wolf, clip]);

  useEffect(() => {
    if (!wolf || hostOnly || holdRef.current || clip) return;
    if (wolf.sub !== "dawn" && !(wolf.sub === "speak" && !isOnline)) return;
    if (wolf.sub === "speak") {
      const mine = wolf.seats.find((s) => s.id === myId);
      if (mine?.alive && mine.role === "knight" && !wolf.knightUsed) return;
    }
    const t = window.setTimeout(() => act(wolf.sub === "dawn" ? "dawn" : "discuss"), wolf.sub === "dawn" ? 1400 : 900);
    return () => window.clearTimeout(t);
  }, [wolf, hostOnly, isOnline, act, clip, voiceSig, myId]);

  function hear() {
    unlockSfx();
    const el = videoRef.current;
    if (!el || !clip) return;
    el.muted = isBgmMuted();
    if (!el.muted) duckBgm(0.06);
    void el.play().then(() => setNeedTap(false)).catch(() => setNeedTap(true));
  }

  if (!wolf) {
    return (
      <Screen>
        <p className="hint">法官準備牌組…</p>
      </Screen>
    );
  }

  const me = wolf.seats.find((s) => s.id === myId) ?? null;
  const awaiting = wolfAwaiting({ ...useGame.getState(), wolf }, myId);
  const canDuel = Boolean(me?.alive && me.role === "knight" && !wolf.knightUsed && (wolf.sub === "speak" || wolf.sub === "vote"));
  const picking = awaiting || (aiming && canDuel);
  const nameOf = (id: string) => players.find((p) => p.id === id)?.name ?? "某人";
  const mine = Boolean(myId && wolf.readyIds.includes(myId));
  const showHint = wolf.sub !== "night" || awaiting;

  function tapSeat(id: string) {
    if (!me) return;
    if (aiming && canDuel) {
      unlockSfx();
      sfxSlam();
      setAiming(false);
      act("duel", id);
      return;
    }
    if (!awaiting) return;
    unlockSfx();
    sfxTick();
    if (wolf?.sub === "night" && wolf.nightStep === "wolf") act("kill", id);
    else if (wolf?.sub === "night" && wolf.nightStep === "seer") act("seer", id);
    else if (wolf?.sub === "night" && wolf.nightStep === "witch" && wolf.witchPoison && !wolf.witchUsed) act("poison", id);
    else if (wolf?.sub === "vote") act("vote", id);
    else if (wolf?.sub === "hunter") {
      const seat = wolf.seats.find((s) => s.id === id);
      if (!seat?.alive) return;
      setShotId(id);
    }
  }

  const title =
    wolf.sub === "card"
      ? "發牌"
      : wolf.sub === "night"
        ? `第 ${wolf.day} 夜`
        : wolf.sub === "vote"
          ? `第 ${wolf.day} 天 · 投票`
          : wolf.sub === "hunter"
            ? "獵人開槍"
            : wolf.sub === "end"
              ? wolf.winner === "wolf"
                ? "狼人勝利"
                : "好人勝利"
              : wolf.sub === "speak"
                ? `第 ${wolf.day} 天`
                : `第 ${wolf.day} 天 · 天亮`;

  return (
    <Screen className="screen-wolf">
      <div className="top-bar">
        <span className="tag-pill">法官</span>
        <span className="tag-pill pink">{title}</span>
        {needTap ? (
          <button className="btn wolf-hear" type="button" onClick={hear}>
            聽法官
          </button>
        ) : clip ? (
          <button className="btn btn-ghost wolf-hear" type="button" onClick={() => advanceFrom(clip)}>
            跳過旁白
          </button>
        ) : null}
      </div>
      {wolf.sub === "card" ? (
        <div className="wolf-card">
          <p className="hint">{wolfSetupLabel(players.length)}</p>
          {me ? (
            <RoleArt
              key={`${me.role}-${players.find((p) => p.id === myId)?.roleId ?? "worker"}`}
              wolfRole={me.role}
              roleId={players.find((p) => p.id === myId)?.roleId ?? "worker"}
              className="wolf-role-art"
            />
          ) : null}
          <b className={`wolf-role role-${me?.role ?? "villager"}`}>{me ? wolfRoleName(me.role) : "等待發牌"}</b>
          {me ? <p className="hint">{wolfRoleBlurb(me.role)}</p> : null}
          <p className="hint">{me ? `${players.find((p) => p.id === myId)?.name ?? "你"}，這張只有你看得到。` : "等法官發牌。"}</p>
          <button
            className="btn btn-lg btn-pink"
            type="button"
            disabled={mine}
            onClick={() => {
              unlockSfx();
              sfxSlam();
              act("ready");
            }}
          >
            {mine ? `已看完 ${wolf.readyIds.length}/${players.length}` : "看完了"}
          </button>
        </div>
      ) : (
        <>
          {me ? (
            <div className="wolf-me-role">
              <RoleArt
                key={`${me.role}-${players.find((p) => p.id === myId)?.roleId ?? "worker"}`}
                wolfRole={me.role}
                roleId={players.find((p) => p.id === myId)?.roleId ?? "worker"}
                className="wolf-me-art"
              />
              <b>你是{wolfRoleName(me.role)}</b>
            </div>
          ) : null}
          <p className="wolf-hint">{showHint ? wolf.hint : me && !me.alive && wolf.sub !== "end" ? "你已出局，看著就好。" : "法官處理中…"}</p>
          {me?.role === "seer" && wolf.seerLog.some((row) => row.seerId === me.id) ? (
            <p className="wolf-secret">
              查驗：
              {wolf.seerLog
                .filter((row) => row.seerId === me.id)
                .map((row) => `${nameOf(row.targetId)}${row.wolf ? "狼" : "好"}`)
                .join("、")}
            </p>
          ) : null}
          {canDuel ? (
            <p className="wolf-secret">{aiming ? "點一個人決鬥。刺中狼則狼出局，刺錯你出局。" : "你是騎士。白天可決鬥一次。"}</p>
          ) : null}
          {wolf.sub === "hunter" && wolf.hunterId === myId ? (
            <p className="wolf-secret">{shotId ? `要射殺 ${nameOf(shotId)}，按選定。` : "點一個人，再按選定。不想開就按不開槍。"}</p>
          ) : null}
          {me?.role === "witch" && me.alive && wolf.sub === "night" && wolf.nightStep === "witch" ? (
            <p className="wolf-secret">
              {wolf.wolfTarget ? `今晚被刀的是 ${nameOf(wolf.wolfTarget)}。` : "今夜沒有人被刀。"}
              {wolf.witchSave ? " 解藥還在。" : " 解藥用過了。"}
              {wolf.witchPoison ? " 毒藥還在。" : " 毒藥用過了。"}
            </p>
          ) : null}
          {wolf.log.length ? <p className="wolf-log">{wolf.log[wolf.log.length - 1]}</p> : null}
          <div className="wolf-board">
            {players.map((p) => {
              const seat = wolf.seats.find((s) => s.id === p.id);
              if (!seat) return null;
              const seen = wolfCanSee({ ...useGame.getState(), wolf }, myId, p.id);
              const picked =
                (wolf.wolfVotes[myId ?? ""] === p.id && wolf.nightStep === "wolf") ||
                wolf.votes[myId ?? ""] === p.id ||
                (wolf.sub === "hunter" && shotId === p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`wolf-seat${seat.alive ? "" : " is-dead"}${p.id === myId ? " is-me" : ""}${picked ? " is-pick" : ""}`}
                  disabled={!picking || (aiming && (!seat.alive || p.id === myId)) || (wolf.sub === "hunter" && !seat.alive)}
                  onClick={() => tapSeat(p.id)}
                >
                  <Portrait roleId={p.roleId} size={36} />
                  <strong>{p.name}</strong>
                  <em>{!seat.alive ? wolfRoleName(seat.role) : seen ? wolfRoleName(seat.role) : p.id === myId ? "你" : "？"}</em>
                </button>
              );
            })}
          </div>
          <div className="wolf-actions">
            {wolf.sub === "night" && wolf.nightStep === "witch" && me?.role === "witch" && me.alive ? (
              <div className="btn-row inline">
                {wolf.witchSave && wolf.wolfTarget ? (
                  <button className="btn btn-lime" type="button" onClick={() => act("save")}>
                    救 {nameOf(wolf.wolfTarget)}
                  </button>
                ) : null}
                <button className="btn" type="button" onClick={() => act("pass")}>
                  不用藥
                </button>
              </div>
            ) : null}
            {wolf.sub === "speak" || (wolf.sub === "vote" && canDuel) ? (
              <div className="btn-row inline">
                {canDuel ? (
                  <button
                    className="btn btn-lg"
                    type="button"
                    onClick={() => {
                      unlockSfx();
                      sfxTick();
                      setAiming((v) => !v);
                    }}
                  >
                    {aiming ? "取消決鬥" : "決鬥"}
                  </button>
                ) : null}
                {wolf.sub === "speak" ? (
                  <button className="btn btn-lg btn-pink" type="button" disabled={hostOnly} onClick={() => act("discuss")}>
                    {hostOnly ? "等待房主開始投票" : "開始投票"}
                  </button>
                ) : null}
              </div>
            ) : null}
            {wolf.sub === "hunter" && wolf.hunterId === myId ? (
              <div className="btn-row inline">
                <button
                  className="btn btn-lg"
                  type="button"
                  disabled={!shotId}
                  onClick={() => {
                    if (!shotId) return;
                    unlockSfx();
                    sfxSlam();
                    act("shoot", shotId);
                  }}
                >
                  選定
                </button>
                <button
                  className="btn btn-lg btn-ghost"
                  type="button"
                  onClick={() => {
                    unlockSfx();
                    sfxTick();
                    act("spare");
                  }}
                >
                  不開槍
                </button>
              </div>
            ) : null}
            {wolf.sub === "dawn" ? (
              <button className="btn btn-lg" type="button" disabled={hostOnly} onClick={() => act("dawn")}>
                {hostOnly ? "等待法官" : "繼續"}
              </button>
            ) : null}
            {wolf.sub === "end" ? (
              <div className="btn-row inline">
                <SkillUseBtn />
                <button className="btn btn-lg" type="button" disabled={hostOnly} onClick={again}>
                  再來一局
                </button>
                <button className="btn btn-ghost" type="button" disabled={hostOnly} onClick={toModes}>
                  換模式
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
      {clip ? (
        <video
          key={clip}
          ref={videoRef}
          className="wolf-voice-audio"
          src={`${asset(JUDGE_FILE[clip])}?v=${APP_VERSION}`}
          playsInline
          autoPlay
          preload="auto"
        />
      ) : null}
    </Screen>
  );
}
