import { useEffect } from "react";
import { useGame } from "@/game/store";
import { linerBotLine, linerEffect } from "@/game/oneliner";
import { sfxTick, unlockSfx } from "@/game/sfx";
import { Screen } from "./chrome";
import { DrinkHud, Portrait } from "./artui";
import { MatchStarterReel, SkillUseBtn } from "./partyScreens";

export function OneLinerScreen() {
  const o = useGame((s) => s.oneliner);
  const players = useGame((s) => s.players);
  const myId = useGame((s) => s.myPlayerId);
  const punishLabel = useGame((s) => s.punishLabel);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const hostOnly = isOnline && !isHost;
  const setRounds = useGame((s) => s.linerSetRounds);
  const begin = useGame((s) => s.linerBegin);
  const spinDone = useGame((s) => s.linerSpinDone);
  const submit = useGame((s) => s.linerSubmit);
  const vote = useGame((s) => s.linerVote);
  const markReady = useGame((s) => s.linerReady);
  const next = useGame((s) => s.linerNext);
  const leave = useGame((s) => s.linerLeave);
  const readyKey = (o?.readyIds ?? []).join(",");
  const voteKey = o ? Object.keys(o.votes).sort().join(",") : "";

  useEffect(() => {
    if (!o || o.sub !== "prompt") return;
    if (isOnline && !isHost) return;
    const speaker = o.order[o.seat] ?? "";
    const bot = players.find((p) => p.id === speaker && p.isBot);
    if (!bot) return;
    const round = o.round;
    const seat = o.seat;
    const t = window.setTimeout(() => {
      const cur = useGame.getState();
      const live = cur.oneliner;
      if (!live || live.sub !== "prompt" || live.round !== round || live.seat !== seat) return;
      cur.linerSubmit(linerBotLine(live.effect, `${cur.seed}:${round}:${seat}`), speaker);
    }, 1400);
    return () => window.clearTimeout(t);
  }, [o?.sub, o?.round, o?.seat, isHost, isOnline, players]);

  useEffect(() => {
    if (!o || o.sub !== "judge") return;
    if (isOnline && !isHost) return;
    const speaker = o.order[o.seat] ?? "";
    const votes = o.votes ?? {};
    const ready = new Set(o.readyIds ?? []);
    const timers: number[] = [];
    players
      .filter((p) => p.isBot && p.id !== speaker)
      .forEach((p, i) => {
        if (!(p.id in votes)) {
          timers.push(
            window.setTimeout(() => {
              const cur = useGame.getState();
              if (cur.oneliner?.sub !== "judge" || p.id in (cur.oneliner.votes ?? {})) return;
              const hit = ((p.id.charCodeAt(0) + (cur.oneliner.cursor ?? 0)) % 5) < 3;
              cur.linerVote(hit, p.id);
            }, 420 + i * 180),
          );
        } else if (!ready.has(p.id)) {
          timers.push(
            window.setTimeout(() => {
              const cur = useGame.getState();
              if (cur.oneliner?.sub !== "judge") return;
              if ((cur.oneliner.readyIds ?? []).includes(p.id)) return;
              cur.linerReady(p.id);
            }, 280 + i * 120),
          );
        }
      });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [o, voteKey, readyKey, players, isOnline, isHost]);

  useEffect(() => {
    if (!o || o.sub !== "reveal") return;
    if (isOnline && !isHost) return;
    const missing = players.filter((p) => p.isBot && !(o.readyIds ?? []).includes(p.id)).map((p) => p.id);
    if (!missing.length) return;
    const t = window.setTimeout(() => markReady(missing), 450);
    return () => window.clearTimeout(t);
  }, [o, readyKey, players, isOnline, isHost, markReady]);

  useEffect(() => {
    if (!o || o.sub !== "reveal") return;
    if (isOnline && !isHost) return;
    if (!players.length || !players.every((p) => (o.readyIds ?? []).includes(p.id))) return;
    const t = window.setTimeout(() => next(), 700);
    return () => window.clearTimeout(t);
  }, [o, readyKey, players, isOnline, isHost, next]);

  if (!o) {
    return (
      <Screen>
        <p className="hint">載入中…</p>
      </Screen>
    );
  }

  const speakerId = o.order[o.seat] ?? "";
  const speaker = players.find((p) => p.id === speakerId);
  const effect = linerEffect(o.effect);
  const mine = myId === speakerId;
  const judges = players.filter((p) => p.id !== speakerId);
  const hits = judges.filter((p) => o.votes[p.id]).length;
  const voted = Boolean(myId && myId in (o.votes ?? {}));
  const mineReady = Boolean(myId && (o.readyIds ?? []).includes(myId));
  const nameOf = (id: string) => players.find((p) => p.id === id)?.name.replace(/^電腦[·・]/, "") ?? "";

  return (
    <Screen className="screen-liner">
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">一句見笑</span>
        {o.sub === "setup" ? (
          <span className="tag-pill pink">開局</span>
        ) : o.sub === "rank" ? (
          <span className="tag-pill pink">結算</span>
        ) : (
          <span className="tag-pill pink">
            {o.round + 1}/{o.perPlayer}
          </span>
        )}
      </div>
      <div className="liner-scores">
        {players.map((p) => (
          <span key={p.id} className={p.id === speakerId && o.sub !== "setup" && o.sub !== "rank" ? "is-on" : ""}>
            {p.name.replace(/^電腦[·・]/, "")} {o.scores[p.id] ?? 0}
          </span>
        ))}
      </div>

      {o.sub === "setup" ? (
        <>
          <h1 className="graffiti-title" style={{ fontSize: "1.7rem" }}>
            一句見笑
          </h1>
          <p className="flip-ux-hint">開口講一句，讓其他人判斷有沒有中。</p>
          <div className="liner-setup">
            <button className={`btn btn-lg${o.perPlayer === 3 ? " is-mine" : ""}`} type="button" disabled={hostOnly} onClick={() => setRounds(3)}>
              每人 3 題
            </button>
            <button className={`btn btn-lg${o.perPlayer === 5 ? " is-mine" : ""}`} type="button" disabled={hostOnly} onClick={() => setRounds(5)}>
              每人 5 題
            </button>
            <div className="liner-step">
              <button className="nav-arrow" type="button" disabled={hostOnly} onClick={() => setRounds(o.perPlayer - 1)} aria-label="減少">
                −
              </button>
              <b>每人 {o.perPlayer} 題</b>
              <button className="nav-arrow" type="button" disabled={hostOnly} onClick={() => setRounds(o.perPlayer + 1)} aria-label="增加">
                +
              </button>
            </div>
          </div>
          <div className="btn-row">
            <button className="btn btn-lg" type="button" disabled={hostOnly} onClick={() => { unlockSfx(); begin(); }}>
              {hostOnly ? "等待房主" : "開始"}
            </button>
          </div>
        </>
      ) : null}

      {o.sub === "spin" ? (
        <MatchStarterReel
          players={players}
          winnerId={o.order[0] ?? ""}
          onDone={() => {
            if (!hostOnly) spinDone();
          }}
        />
      ) : null}

      {o.sub === "prompt" || o.sub === "judge" || o.sub === "reveal" ? (
        <>
          <div className="liner-effect">
            <b>{effect.emoji} {effect.name}</b>
            <span>本回合要讓人感受到這個</span>
          </div>
          <div className="flip-q sticker">
            <div className="flip-q-label">{speaker ? `${speaker.name.replace(/^電腦[·・]/, "")} 一句` : "一句"}</div>
            <p className="flip-q-text">{o.situation}</p>
          </div>
        </>
      ) : null}

      {o.sub === "prompt" ? (
        mine ? (
          <button
            className="btn btn-lg"
            type="button"
            onClick={() => {
              unlockSfx();
              sfxTick();
              submit("");
            }}
          >
            我說完了
          </button>
        ) : (
          <div className="artist-wait-card">
            <Portrait roleId={speaker?.roleId ?? "worker"} size={160} />
            <p>{speaker?.isBot ? `${speaker.name.replace(/^電腦[·・]/, "")} 在講…` : `${speaker?.name.replace(/^電腦[·・]/, "")} 開口中…`}</p>
          </div>
        )
      ) : null}

      {o.sub === "judge" ? (
        mine ? (
          <div className="artist-wait-card">
            <Portrait roleId={speaker?.roleId ?? "worker"} size={140} />
            <p>等大家評完就公布</p>
            {speaker?.isBot && o.line ? <b className="liner-said">「{o.line}」</b> : <span className="hint">你已經說完了</span>}
          </div>
        ) : (
          <>
            <p className="flip-ux-hint">這句有「{effect.name}」到嗎？</p>
            {speaker?.isBot && o.line ? <p className="liner-said">「{o.line}」</p> : <p className="liner-said">對方開口說了，現場聽。</p>}
            <div className="btn-row inline">
              <button
                className={`btn btn-lg${myId && o.votes[myId] === true ? " is-mine" : ""}`}
                type="button"
                disabled={voted}
                onClick={() => {
                  unlockSfx();
                  sfxTick();
                  vote(true);
                }}
              >
                😂 有中
              </button>
              <button
                className={`btn btn-ghost btn-lg${myId && o.votes[myId] === false ? " is-mine" : ""}`}
                type="button"
                disabled={voted}
                onClick={() => {
                  unlockSfx();
                  sfxTick();
                  vote(false);
                }}
              >
                😐 沒中
              </button>
            </div>
          </>
        )
      ) : null}

      {o.sub === "reveal" ? (
        <>
          <div className={`flip-result ${o.success ? "ok" : "bad"}`}>
            <div className="flip-result-title">{o.boom ? "一句爆擊！" : o.success ? "一句見效！" : "沒中"}</div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {hits} 有中 · {Math.max(0, judges.length - hits)} 沒中
              {o.success ? " · 笑點 +1" : ` · ${nameOf(speakerId)} ${punishLabel}`}
            </p>
          </div>
          {o.boom ? <p className="liner-boom">全員有中</p> : null}
          <div className="who-stage">
            {speaker ? (
              <figure>
                <Portrait roleId={speaker.roleId} size={200} />
                <figcaption>{nameOf(speaker.id)}</figcaption>
              </figure>
            ) : null}
          </div>
          {o.line ? <p className="liner-said">「{o.line}」</p> : null}
          <div className="btn-row">
            {!o.success ? <SkillUseBtn /> : null}
            <button className="btn btn-lg" type="button" disabled={mineReady} onClick={() => markReady()}>
              下一題準備
            </button>
            <button className="btn btn-ghost" type="button" disabled={hostOnly} onClick={leave}>
              換模式
            </button>
          </div>
        </>
      ) : null}

      {o.sub === "rank" ? (
        <>
          <h1 className="graffiti-title" style={{ fontSize: "1.6rem" }}>
            今晚最會講
          </h1>
          <div className={`who-stage${o.best.length > 1 ? " is-many" : ""}`}>
            {o.best.map((id) => {
              const p = players.find((x) => x.id === id);
              if (!p) return null;
              return (
                <figure key={id}>
                  <Portrait roleId={p.roleId} size={180} />
                  <figcaption>
                    {nameOf(id)} · {o.scores[id] ?? 0}
                  </figcaption>
                </figure>
              );
            })}
          </div>
          <div className={`flip-result ${o.worst.length ? "bad" : "ok"}`}>
            <div className="flip-result-title">{o.worst.length ? "最後一名" : "笑點打平"}</div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {o.worst.length
                ? `${o.worst.map(nameOf).join("、")} ${punishLabel}。要不要真的執行，現場決定。`
                : "沒有單獨墊底，這次不追加懲罰。"}
            </p>
          </div>
          <div className="btn-row">
            {o.worst.length ? <SkillUseBtn /> : null}
            <button className="btn btn-lg" type="button" disabled={hostOnly} onClick={leave}>
              {hostOnly ? "等待房主" : "回模式"}
            </button>
          </div>
        </>
      ) : null}
    </Screen>
  );
}
