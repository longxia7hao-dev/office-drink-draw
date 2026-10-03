import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ChevronLeft, Crown, RotateCw, Zap } from "lucide-react";
import { getKingCmd, NEVER_PROMPTS, recapTitle, WHEEL } from "@/game/party";
import { getTruth, getWho, fillPunish, punishPhrase } from "@/game/partyPlay";
import { useGame } from "@/game/store";
import { playMeow, sfxDrink, sfxSlam, sfxSpin, sfxTick, sfxWin, unlockSfx, vibrate } from "@/game/sfx";
import { ART, modeArt, paintRoleArt, preloadReactCards, reactCardSrc, whenReactCardsReady, STICKER_ART } from "@/game/art";
import { getRole } from "@/game/roles";
import { artistWord } from "@/game/artist";
import { REACT_CARDS, REACT_COLOR_META, REACT_COLORS, REACT_DECOYS } from "@/game/reactCards";
import { canUseSkillNow, isHere } from "@/game/state";
import { Screen, usePress } from "./chrome";
import { DrinkHud, FateWheel, Portrait } from "./artui";


export function SkillUseBtn({ float = false }: { float?: boolean }) {
  const useSkill = useGame((s) => s.useSkill);
  const show = useGame((s) => canUseSkillNow(s, s.myPlayerId));
  if (!show) return null;
  return (
    <button className={`btn btn-pink${float ? " skill-float" : ""}`} type="button" onClick={() => useSkill()}>
      <Zap size={16} />
      使用技能
    </button>
  );
}

function HostGate({ children }: { children: ReactNode }) {
  const hostOnly = useGame((s) => s.isOnline && !s.isHost);
  if (hostOnly) return <p className="hint">等待房主操作…</p>;
  return <>{children}</>;
}

function ModeSwitchBtn({ label = "換模式" }: { label?: string }) {
  const toModes = useGame((s) => s.toModes);
  const hostOnly = useGame((s) => s.isOnline && !s.isHost);
  return (
    <button className="btn btn-ghost" type="button" disabled={hostOnly} onClick={toModes}>
      {hostOnly ? "等待房主" : label}
    </button>
  );
}

function useAllReady(active: boolean, onGo: () => void) {
  const players = useGame((s) => s.players);
  const gate = useGame((s) => s.gateReady);
  const mark = useGame((s) => s.markGate);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const goRef = useRef(onGo);
  goRef.current = onGo;
  const key = (gate ?? []).join(",");
  useEffect(() => {
    if (!active || (isOnline && !isHost)) return;
    const missing = players.filter((p) => p.isBot && !(gate ?? []).includes(p.id)).map((p) => p.id);
    if (!missing.length) return;
    const t = window.setTimeout(() => mark(missing), 450);
    return () => window.clearTimeout(t);
  }, [active, key, players, gate, isOnline, isHost, mark]);
  useEffect(() => {
    if (!active || (isOnline && !isHost)) return;
    const here = players.filter(isHere);
    if (!here.length || !here.every((p) => (gate ?? []).includes(p.id))) return;
    const t = window.setTimeout(() => goRef.current(), 700);
    return () => window.clearTimeout(t);
  }, [active, key, players, gate, isOnline, isHost]);
}

function NextReadyButtons({
  active,
  onGo,
  extra,
  row = false,
}: {
  active: boolean;
  onGo: () => void;
  extra?: ReactNode;
  row?: boolean;
}) {
  const myId = useGame((s) => s.myPlayerId);
  const gate = useGame((s) => s.gateReady);
  const mark = useGame((s) => s.markGate);
  const mine = Boolean(myId && (gate ?? []).includes(myId));
  useAllReady(active, onGo);
  return (
    <div className={`btn-row${row ? " inline" : ""}`}>
      {extra}
      <button
        className="btn btn-lg"
        type="button"
        disabled={!active || mine}
        onClick={() => {
          unlockSfx();
          sfxSlam();
          mark();
        }}
      >
        {mine ? "已準備" : "下一題準備"}
      </button>
      <ModeSwitchBtn />
    </div>
  );
}

function DragPicker({ exclude }: { exclude: string[] }) {
  const players = useGame((s) => s.players);
  const dragExtra = useGame((s) => s.dragExtra);
  const chaos = useGame((s) => s.chaos);
  if (!chaos?.drag) return null;
  return (
    <>
      <p className="flip-ux-hint">混亂事件：再拖一個人陪罰</p>
      <div className="king-grid">
        {players
          .filter((p) => !exclude.includes(p.id))
          .map((p) => (
            <button key={p.id} type="button" className="king-seat" onClick={() => dragExtra(p.id)}>
              <Portrait roleId={p.roleId} size={40} />
              <strong>{p.name}</strong>
            </button>
          ))}
      </div>
    </>
  );
}

export function ChaosScreen() {
  const chaos = useGame((s) => s.chaos);
  const confirm = useGame((s) => s.confirmChaosCard);
  const players = useGame((s) => s.players);
  const press = usePress(() => {
    unlockSfx();
    sfxSlam();
    confirm();
  });
  const shield = chaos?.shieldId ? players.find((p) => p.id === chaos.shieldId) : null;
  return (
    <Screen>
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">CHAOS</span>
        <span className="tag-pill pink">混亂事件</span>
      </div>
      <h1 className="graffiti-title">事件卡</h1>
      <div className="chaos-card">
        <div className="flip-q-label">插入本回合</div>
        <h2>{chaos?.title ?? "混亂"}</h2>
        <p>{chaos?.desc}</p>
        {shield ? <p className="hint">免死金牌：{shield.name}</p> : null}
      </div>
      <div className="btn-row">
        <button className="btn btn-lg btn-pink" type="button" {...press}>
          開罰
        </button>
      </div>
    </Screen>
  );
}

export function WhoScreen() {
  const who = useGame((s) => s.who);
  const players = useGame((s) => s.players);
  const voteWho = useGame((s) => s.voteWho);
  const nextWho = useGame((s) => s.nextWho);
  const markWhoReady = useGame((s) => s.markWhoReady);
  const toModes = useGame((s) => s.toModes);
  const punishLabel = useGame((s) => s.punishLabel);
  const myPlayerId = useGame((s) => s.myPlayerId);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const practice = useGame((s) => s.practice);
  const readyKey = (who?.readyIds ?? []).join(",");
  useEffect(() => {
    if (!who || who.sub !== "result") return;
    if (isOnline && !isHost) return;
    const missing = players.filter((p) => p.isBot && !(who.readyIds ?? []).includes(p.id)).map((p) => p.id);
    if (!missing.length) return;
    const t = window.setTimeout(() => markWhoReady(missing), 450);
    return () => window.clearTimeout(t);
  }, [who, readyKey, players, isOnline, isHost, markWhoReady]);
  useEffect(() => {
    if (!who || who.sub !== "result") return;
    if (isOnline && !isHost) return;
    const here = players.filter(isHere);
    if (!here.length || !here.every((p) => (who.readyIds ?? []).includes(p.id))) return;
    const t = window.setTimeout(() => nextWho(), 700);
    return () => window.clearTimeout(t);
  }, [who, readyKey, players, isOnline, isHost, nextWho]);
  if (!who) return <Screen><p className="hint">載入中…</p></Screen>;
  const q = getWho(who.deck[who.index % who.deck.length] ?? "w01");
  const punished = who.punishedIds.map((id) => players.find((p) => p.id === id)?.name).filter(Boolean).join("、");
  const myVoted = Boolean(myPlayerId && myPlayerId in who.votes);
  const mineReady = Boolean(myPlayerId && (who.readyIds ?? []).includes(myPlayerId));
  const canVote = who.sub === "vote" && (practice
    ? Boolean(myPlayerId) && !myVoted
    : isOnline
      ? isHost || myPlayerId === who.voterId
      : true);

  return (
    <Screen>
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">WHO</span>
        <span className="tag-pill pink">{who.index + 1}/{who.deck.length}</span>
      </div>
      <div className="flip-q sticker">
        <div className="flip-q-label">誰最可能</div>
        <p className="flip-q-text">{q.q}</p>
      </div>
      {who.sub === "vote" ? (
        <>
          <p className="flip-ux-hint">
            不能投自己。除了本人，大家都投同一個人，那個人就要喝。
          </p>
          <div className="king-grid">
            {players.map((p) => {
              const voterId = practice || isOnline ? myPlayerId : who.voterId;
              const self = p.id === voterId;
              const minePick = Boolean(myPlayerId && who.votes[myPlayerId] === p.id);
              return (
              <button
                key={p.id}
                type="button"
                className={`king-seat${minePick ? " is-my-pick" : ""}`}
                disabled={!canVote || self}
                onClick={() => {
                  if (self) return;
                  unlockSfx();
                  sfxTick();
                  voteWho(p.id, practice || isOnline ? myPlayerId ?? undefined : undefined);
                }}
              >
                <Portrait roleId={p.roleId} size={48} />
                <strong>{self ? "不能投自己" : p.name}</strong>
              </button>
              );
            })}
          </div>
          <div className="btn-row">
            <ModeSwitchBtn />
          </div>
        </>
      ) : (
        <>
          <div className={`flip-result ${who.punishedIds.length ? "bad" : "ok"}`}>
            <div className="flip-result-title">{who.punishedIds.length ? "全員鎖定" : "沒有共識"}</div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {who.punishedIds.length ? `${punished || "沒人"} · ${punishLabel}` : "沒有大家都投的同一個人，這題沒人喝"}
            </p>
          </div>
          <div className={`who-stage${who.punishedIds.length > 1 ? " is-many" : ""}`}>
            {who.punishedIds.map((id) => {
              const p = players.find((x) => x.id === id);
              if (!p) return null;
              return (
                <figure key={id}>
                  <Portrait roleId={p.roleId} size={220} />
                  <figcaption>{p.name.replace(/^電腦[·・]/, "")}</figcaption>
                </figure>
              );
            })}
          </div>
          <DragPicker exclude={who.punishedIds} />
          <div className="btn-row">
            <SkillUseBtn />
            <button className="btn btn-lg" type="button" disabled={mineReady} onClick={() => markWhoReady()}>
              下一題準備
            </button>
            <ModeSwitchBtn />
          </div>
        </>
      )}
    </Screen>
  );
}

export function TruthScreen() {
  const t = useGame((s) => s.truth);
  const players = useGame((s) => s.players);
  const pickTruth = useGame((s) => s.pickTruth);
  const nextTruth = useGame((s) => s.nextTruth);
  const toModes = useGame((s) => s.toModes);
  const punishLabel = useGame((s) => s.punishLabel);
  if (!t) return <Screen><p className="hint">載入中…</p></Screen>;
  const q = getTruth(t.deck[t.index % t.deck.length] ?? "t01");
  const actor = players.find((p) => p.id === t.playerId);
  const botTurn = Boolean(actor?.isBot);

  return (
    <Screen>
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">TRUTH</span>
        <span className="tag-pill pink">{q.cat}</span>
      </div>
      <p className="flip-ux-hint">
        {botTurn ? `${actor?.name}（電腦）思考中…` : `輪到 ${actor?.name ?? "—"}`}
      </p>
      <div className="flip-q sticker">
        <div className="flip-q-label">真心話 · 或受罰</div>
        <p className="flip-q-text">{q.q}</p>
      </div>
      {t.sub === "ask" ? (
        botTurn ? (
          <>
            <p className="hint">電腦正在決定要不要講…</p>
            <ModeSwitchBtn />
          </>
        ) : (
        <>
        <div className="btn-row inline">
          <button
            className="btn btn-lg"
            type="button"
            onClick={() => {
              unlockSfx();
              sfxWin();
              pickTruth("answer");
            }}
          >
            我答
          </button>
          <button
            className="btn btn-pink btn-lg"
            type="button"
            onClick={() => {
              unlockSfx();
              sfxDrink();
              vibrate(24);
              pickTruth("punish");
            }}
          >
            受罰
          </button>
        </div>
        <ModeSwitchBtn />
        </>
        )
      ) : (
        <>
          <div className={`flip-result ${t.took === "punish" ? "bad" : "ok"}`}>
            <div className="flip-result-title">{t.took === "punish" ? "選擇受罰" : "選擇回答"}</div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {t.took === "punish" ? `${actor?.name} · ${punishLabel}` : `${actor?.name} 講實話（大家負責監督）`}
            </p>
          </div>
          <DragPicker exclude={t.playerId ? [t.playerId] : []} />
          <NextReadyButtons active={t.sub === "result" || t.sub === "drag"} onGo={nextTruth} extra={<SkillUseBtn />} />
        </>
      )}
    </Screen>
  );
}

export function ReactScreen() {
  const r = useGame((s) => s.react);
  const players = useGame((s) => s.players);
  const myId = useGame((s) => s.myPlayerId);
  const mark = useGame((s) => s.markReactReady);
  const hard = useGame((s) => s.setReactHard);
  const tick = useGame((s) => s.tickReactCount);
  const tapReact = useGame((s) => s.tapReact);
  const timeoutReact = useGame((s) => s.timeoutReact);
  const again = useGame((s) => s.againReact);
  const nextRound = useGame((s) => s.beatReact);
  const release = useGame((s) => s.releaseReact);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const clock = !isOnline || isHost;
  const [okFlash, setOkFlash] = useState(false);
  const [localCount, setLocalCount] = useState(3);
  const tapLock = useRef(0);
  const armed = useRef(0);
  const needLabel =
    r?.need === "cat" ? "貓" : r?.need === "dog" ? "狗" : r?.need === "cow" ? "牛" : r?.need === "panda" ? "熊貓" : "";
  const reactSub = r?.sub;
  const reactPunished = r?.punished;
  const seenSub = useRef(reactSub);
  useEffect(() => {
    if (isOnline && !isHost && seenSub.current === "play" && reactSub === "result" && reactPunished) playMeow();
    seenSub.current = reactSub;
  }, [isOnline, isHost, reactSub, reactPunished]);
  const faceKey = `${r?.card ?? 0}:${r?.file ?? ""}`;
  const [readyKey, setReadyKey] = useState("");
  const faceReady = r?.sub === "play" && readyKey === faceKey;

  useEffect(() => {
    preloadReactCards([...REACT_CARDS.map((c) => c.file), ...REACT_DECOYS.map((c) => c.file)]);
  }, []);

  useEffect(() => {
    if (r?.sub !== "count" || !r.arm || !clock) return;
    if (armed.current === r.arm) return;
    armed.current = r.arm;
    setLocalCount(3);
    const a = window.setTimeout(() => setLocalCount(2), 1000);
    const b = window.setTimeout(() => setLocalCount(1), 2000);
    const c = window.setTimeout(() => tick(), 3000);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
      window.clearTimeout(c);
    };
  }, [r?.sub, r?.arm, tick, clock]);

  useEffect(() => {
    if (r?.sub !== "count" || !r.arm || clock) return;
    if (armed.current === r.arm) return;
    armed.current = r.arm;
    setLocalCount(3);
    const a = window.setTimeout(() => setLocalCount(2), 1000);
    const b = window.setTimeout(() => setLocalCount(1), 2000);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [r?.sub, r?.arm, clock]);

  useEffect(() => {
    setOkFlash(false);
  }, [r?.card]);

  useEffect(() => {
    if (r?.sub !== "play" || !r.hold || !clock) return;
    const t = window.setTimeout(() => release(), 420);
    return () => window.clearTimeout(t);
  }, [r?.sub, r?.hold, r?.card, release, clock]);

  useEffect(() => {
    if (r?.sub !== "play" || !faceReady || r.hold || !clock) return;
    const wait = isOnline ? Math.max(r.tempo, 1200) + 400 : r.tempo;
    const t = window.setTimeout(() => timeoutReact(), wait);
    return () => window.clearTimeout(t);
  }, [r?.sub, r?.card, r?.tempo, faceReady, timeoutReact, clock]);

  if (!r) return <Screen><p className="hint">載入中…</p></Screen>;
  const live = r;

  function tap(e?: { preventDefault?: () => void; stopPropagation?: () => void }) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (live.sub !== "play") return;
    const now = Date.now();
    if (now - tapLock.current < 220) return;
    tapLock.current = now;
    unlockSfx();
    const result = tapReact(myId || undefined);
    if (result === "miss") {
      vibrate(40);
      return;
    }
    if (result === "ok") {
      setOkFlash(true);
      sfxWin();
    }
  }

  return (
    <Screen className="screen-react">
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">REACT</span>
        <span className="tag-pill pink">
          {r.sub === "play" || r.sub === "count" || r.sub === "between"
            ? "按錯立刻結束"
            : "一場定輸贏 · 按錯就罰"}
        </span>
      </div>
      {r.sub === "play" || r.sub === "count" ? (
        <div className="react-palette">
          {REACT_COLORS.map((c) => (
            <i
              key={c}
              className={r.color === c ? "on" : ""}
              style={{ background: REACT_COLOR_META[c].hex }}
              title={REACT_COLOR_META[c].name}
            />
          ))}
          {r.hard && r.need ? (
            <span className="react-plus">
              ＋{needLabel}
              <img src={STICKER_ART[r.need]} alt="" draggable={false} />
            </span>
          ) : null}
        </div>
      ) : null}
      {r.sub === "ready" ? (
        <>
          <div className="react-rules">
            <button className={`react-rule${!r.hard ? " is-on" : ""}`} type="button" onClick={() => hard(false)}>
              <div className="react-rule-head">一般・色卡</div>
              <div className="react-swatches">
                {REACT_COLORS.map((c) => (
                  <i key={c} style={{ background: REACT_COLOR_META[c].hex }} title={REACT_COLOR_META[c].name} />
                ))}
              </div>
              <p>看背景顏色，白底不算、不要按。同一題一直出，直到有人按錯。按錯立刻貓叫並結束，直接受罰。不能用技能。</p>
            </button>
            <button className={`react-rule${r.hard ? " is-on" : ""}`} type="button" onClick={() => hard(true)}>
              <div className="react-rule-head">進階・動物貼紙</div>
              <div className="react-rule-icons">
                <i className="react-swatch" style={{ background: REACT_COLOR_META.red.hex }} title="紅" />
                {(
                  [
                    ["cat", "貓"],
                    ["dog", "狗"],
                    ["cow", "牛"],
                    ["panda", "熊貓"],
                  ] as const
                ).map(([id, name]) => (
                  <span key={id} className="react-rule-pet">
                    <img src={STICKER_ART[id]} alt={name} draggable={false} />
                    <b>{name}</b>
                  </span>
                ))}
              </div>
              <p>看背景顏色，白底不算、不要按。顏色和動物都要對。按錯立刻貓叫並結束，直接受罰。不能用技能。</p>
            </button>
          </div>
          <div className="react-ready-foot">
            <button
              className={`btn btn-lg${myId && r.ready.includes(myId) ? " is-mine" : ""}`}
              type="button"
              disabled={Boolean(myId && r.ready.includes(myId))}
              onClick={() => {
                unlockSfx();
                sfxSlam();
                mark();
              }}
            >
              {myId && r.ready.includes(myId) ? "已準備" : "準備"}
            </button>
            <p className="hint">
              全員準備才一起開始 · {players.filter((p) => isHere(p) && r.ready.includes(p.id)).length}/
              {players.filter(isHere).length}
            </p>
          </div>
        </>
      ) : null}
      {r.sub === "count" ? (
        <>
          <div className="react-count-only">{localCount}</div>
          <img
            className="react-preload"
            alt=""
            src={reactCardSrc(r.file)}
            decoding="sync"
            ref={(el) => {
              if (el?.complete && el.naturalWidth > 0) setReadyKey(faceKey);
            }}
            onLoad={() => setReadyKey(faceKey)}
          />
        </>
      ) : null}
      {r.sub === "play" ? (
        <>
          <button
            type="button"
            className={`react-card${okFlash || r.hold || (myId && r.tapped.includes(myId)) ? " is-ok" : ""}`}
            onPointerDown={tap}
            onClick={tap}
          >
            <img
              key={faceKey}
              src={reactCardSrc(r.file)}
              alt=""
              draggable={false}
              decoding="sync"
              ref={(el) => {
                if (el?.complete && el.naturalWidth > 0) setReadyKey(faceKey);
              }}
              onLoad={() => setReadyKey(faceKey)}
              onError={() => setReadyKey(faceKey)}
            />
            {r.sticker ? (
              <img
                className="react-sticker"
                src={STICKER_ART[r.sticker]}
                alt=""
                style={{ left: `${r.stickerX}%`, top: `${r.stickerY}%` }}
              />
            ) : null}
          </button>
        </>
      ) : null}
      {r.sub === "between" ? (
        <>
          <div className="flip-result bad">
            <div className="flip-result-title">第 {r.beat + 1}/3 次結束</div>
            <p className="hint">
              {r.dead.map((id) => players.find((p) => p.id === id)?.name).filter(Boolean).join("、") || "有人"} 按錯
            </p>
          </div>
          <NextReadyButtons active={r.sub === "between"} onGo={nextRound} />
        </>
      ) : null}
      {r.sub === "result" || r.sub === "drag" ? (
        <>
          <div className={`flip-result ${r.punished ? "bad" : "ok"}`}>
            <div className="flip-result-title">{r.punished ? "按錯，直接受罰" : "沒人按錯"}</div>
            <p className="hint">
              {r.dead.map((id) => players.find((p) => p.id === id)?.name).join("、") || "時間到"}
            </p>
          </div>
          <NextReadyButtons active={r.sub === "result" || r.sub === "drag"} onGo={again} />
        </>
      ) : null}
    </Screen>
  );
}

export function KingScreen() {
  const king = useGame((s) => s.king);
  const punishLabel = useGame((s) => s.punishLabel);
  const players = useGame((s) => s.players);
  const kingRevealDone = useGame((s) => s.kingRevealDone);
  const kingPickCmd = useGame((s) => s.kingPickCmd);
  const kingTap = useGame((s) => s.kingTap);
  const beginKing = useGame((s) => s.beginKing);
  const toModes = useGame((s) => s.toModes);
  const hostOnly = useGame((s) => s.isOnline && !s.isHost);

  if (!king) {
    return (
      <Screen>
        <p className="hint">國王遊戲載入中…</p>
      </Screen>
    );
  }

  const kingPlayer = players.find((p) => p.id === king.kingId);

  return (
    <Screen>
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">KING</span>
        <span className="tag-pill pink">國王遊戲</span>
      </div>
      <h1 className="graffiti-title" style={{ fontSize: "2rem" }}>
        國王遊戲
      </h1>

      {king.sub === "reveal" ? (
        <>
          <p className="hint">號碼揭曉。國王發號施令，被點到的人受罰。</p>
          <div className="king-grid">
            {players.map((p) => {
              const n = king.numbers[p.id] ?? 0;
              const isKing = p.id === king.kingId;
              return (
                <div className={`king-seat ${isKing ? "is-king" : ""}`} key={p.id}>
                  <Portrait roleId={p.roleId} size={48} />
                  <strong>{p.name}</strong>
                  <span className="king-num">{isKing ? "國王" : `#${n}`}</span>
                </div>
              );
            })}
          </div>
          <div className="btn-row">
            <HostGate>
              <button
                className="btn btn-lg"
                type="button"
                onClick={() => {
                  unlockSfx();
                  sfxSlam();
                  kingRevealDone();
                }}
              >
                <Crown size={18} /> 國王選指令
              </button>
            </HostGate>
          </div>
        </>
      ) : null}

      {king.sub === "pick" ? (
        <>
          <p className="flip-ux-hint">國王是 {kingPlayer?.name} · 選一張指令</p>
          <div className="mode-grid">
            {king.optionIds.map((id) => {
              const c = getKingCmd(id);
              return (
                <button
                  key={id}
                  className="mode-card"
                  type="button"
                  disabled={hostOnly}
                  onClick={() => {
                    unlockSfx();
                    sfxSpin();
                    kingPickCmd(id);
                  }}
                >
                  <div className="m-title">{c.title}</div>
                  <div className="m-desc">{fillPunish(c.desc, punishLabel)}</div>
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      {king.sub === "target" ? (
        <>
          <p className="flip-ux-hint">
            {king.message} · 再點 {king.need - king.targetIds.length} 人
          </p>
          <div className="king-grid">
            {players.map((p) => (
              <button
                type="button"
                key={p.id}
                className={`king-seat ${king.targetIds.includes(p.id) ? "is-king" : ""}`}
                disabled={hostOnly}
                onClick={() => kingTap(p.id)}
              >
                <Portrait roleId={p.roleId} size={48} />
                <strong>{p.name}</strong>
              </button>
            ))}
          </div>
        </>
      ) : null}

      {king.sub === "resolve" ? (
        <>
          <div className="flip-result bad">
            <div className="flip-result-title">{getKingCmd(king.commandId ?? "").title}</div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {king.message}
            </p>
          </div>
          <div className="drinkers">
            {king.drinkerIds.map((id) => {
              const p = players.find((x) => x.id === id);
              if (!p) return null;
              return (
                <div className="drinker-chip" key={id}>
                  <Portrait roleId={p.roleId} size={48} />
                  <span>
                    {p.name} · {punishPhrase(punishLabel, king.cups)}
                  </span>
                </div>
              );
            })}
            {king.drinkerIds.length === 0 ? <p className="hint">本輪沒人受罰</p> : null}
          </div>
          <NextReadyButtons
            active={king.sub === "resolve"}
            onGo={() => {
              sfxDrink();
              vibrate(30);
              beginKing();
            }}
          />
        </>
      ) : null}
    </Screen>
  );
}

export function NeverScreen() {
  const n = useGame((s) => s.never);
  const punishLabel = useGame((s) => s.punishLabel);
  const players = useGame((s) => s.players);
  const myId = useGame((s) => s.myPlayerId);
  const neverSay = useGame((s) => s.neverSay);
  const neverNext = useGame((s) => s.neverNext);
  const markNeverReady = useGame((s) => s.markNeverReady);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const readyKey = (n?.readyIds ?? []).join(",");
  useEffect(() => {
    if (!n || n.sub !== "result") return;
    if (isOnline && !isHost) return;
    const missing = players.filter((p) => p.isBot && !(n.readyIds ?? []).includes(p.id)).map((p) => p.id);
    if (!missing.length) return;
    const t = window.setTimeout(() => markNeverReady(missing), 450);
    return () => window.clearTimeout(t);
  }, [n, readyKey, players, isOnline, isHost, markNeverReady]);
  useEffect(() => {
    if (!n || n.sub !== "result") return;
    if (isOnline && !isHost) return;
    const here = players.filter(isHere);
    if (!here.length || !here.every((p) => (n.readyIds ?? []).includes(p.id))) return;
    const t = window.setTimeout(() => neverNext(), 700);
    return () => window.clearTimeout(t);
  }, [n, readyKey, players, isOnline, isHost, neverNext]);

  if (!n) {
    return (
      <Screen>
        <p className="hint">題庫載入中…</p>
      </Screen>
    );
  }
  const q = NEVER_PROMPTS.find((p) => p.id === n.deck[n.index % n.deck.length]) ?? NEVER_PROMPTS[0]!;
  const passed = n.passed ?? [];
  const me = myId ?? "";
  const mineDid = n.marked.includes(me) && n.sub === "ask";
  const mineNo = passed.includes(me);
  const mineReady = Boolean(myId && (n.readyIds ?? []).includes(myId));
  const waiting = players.filter((p) => !n.marked.includes(p.id) && !passed.includes(p.id));

  function say(did: boolean) {
    unlockSfx();
    if (did) sfxDrink();
    else sfxTick();
    neverSay(did);
  }

  return (
    <Screen>
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">NEVER</span>
        <span className="tag-pill pink">
          {n.index + 1}/{n.deck.length}
        </span>
      </div>
      <h1 className="graffiti-title" style={{ fontSize: "1.7rem" }}>
        我從來沒有
      </h1>
      <div className="flip-q sticker">
        <div className="flip-q-label">做過的人{punishLabel}</div>
        <p className="flip-q-text">{q.q}</p>
      </div>
      {n.sub === "ask" ? (
        <>
          <p className="flip-ux-hint">自己承認。全場都說沒有，就全員{punishLabel}。</p>
          <div className="btn-row inline">
            <button className={`btn btn-lg${mineDid ? " is-mine" : ""}`} type="button" onClick={() => say(true)}>
              我做過
            </button>
            <button className={`btn btn-ghost btn-lg${mineNo ? " is-mine" : ""}`} type="button" onClick={() => say(false)}>
              我沒有
            </button>
          </div>
          <div className="ready-list">
            {players.map((p) => {
              const did = n.sub === "ask" && n.marked.includes(p.id);
              const no = passed.includes(p.id);
              return (
                <div className={`ready-chip ${did ? "on" : "off"}`} key={p.id}>
                  <strong>{p.name.replace(/^電腦[·・]/, "")}</strong>
                  <span className="ready-label">{did ? "做過" : no ? "沒有" : "還沒"}</span>
                </div>
              );
            })}
          </div>
          <p className="hint">{waiting.length ? `還有 ${waiting.length} 人沒表態` : "全員到齊，結算中…"}</p>
        </>
      ) : (
        <>
          <div className={`flip-result ${n.marked.length ? "bad" : "ok"}`}>
            <div className="flip-result-title">{n.allDeny ? "全場都說沒有" : "做過的人受罰"}</div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {n.allDeny
                ? `沒人承認，全員 ${punishLabel}`
                : n.marked
                    .map((id) => players.find((p) => p.id === id)?.name?.replace(/^電腦[·・]/, ""))
                    .filter(Boolean)
                    .join("、") + ` ${punishLabel}`}
            </p>
          </div>
          {n.marked.length ? (
            <div className={`who-stage${n.marked.length > 1 ? " is-many" : ""}`}>
              {n.marked.map((id) => {
                const p = players.find((x) => x.id === id);
                if (!p) return null;
                return (
                  <figure key={id}>
                    <Portrait roleId={p.roleId} size={220} />
                    <figcaption>{p.name.replace(/^電腦[·・]/, "")}</figcaption>
                  </figure>
                );
              })}
            </div>
          ) : null}
          <DragPicker exclude={n.marked} />
          <div className="btn-row">
            <SkillUseBtn />
            <button className="btn btn-lg" type="button" disabled={mineReady} onClick={() => markNeverReady()}>
              下一題準備
            </button>
            <ModeSwitchBtn />
          </div>
        </>
      )}
    </Screen>
  );
}

function paintArtist(ctx: CanvasRenderingContext2D, pts: number[], w: number) {
  let start = 0;
  let erase = false;
  if (pts[0] === 1002) {
    erase = true;
    start = 2;
  } else if (pts[0] === 1001) start = 2;
  if (pts.length < start + 4) return;
  ctx.save();
  ctx.globalCompositeOperation = erase ? "destination-out" : "source-over";
  ctx.strokeStyle = "#161616";
  ctx.lineWidth = erase ? 36 : 10;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo((pts[start]! / 1000) * w, (pts[start + 1]! / 1000) * w);
  for (let i = start + 2; i < pts.length; i += 2) ctx.lineTo((pts[i]! / 1000) * w, (pts[i + 1]! / 1000) * w);
  ctx.stroke();
  ctx.restore();
}

function ArtistWait({
  roleId,
  name,
  title,
  detail,
  paint,
}: {
  roleId: string;
  name: string;
  title: string;
  detail?: string;
  paint?: boolean;
}) {
  return (
    <div className="artist-wait-card">
      {paint ? (
        <img key={roleId} className="artist-wait-paint" src={paintRoleArt(roleId)} alt="" draggable={false} />
      ) : (
        <Portrait key={roleId} roleId={roleId} size={168} className="artist-wait-art" />
      )}
      <strong>{name}</strong>
      <p>{title}</p>
      {detail ? <b className="artist-wait">{detail}</b> : <span className="artist-dots">等待中</span>}
    </div>
  );
}

function ArtistPaper({
  strokes,
  spin,
  enabled,
  erase,
  onStroke,
  label,
}: {
  strokes: number[][];
  spin: boolean;
  enabled: boolean;
  erase: boolean;
  onStroke: (pts: number[]) => void;
  label?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const liveRef = useRef<number[]>([]);
  const [liveTick, setLiveTick] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    ctx.clearRect(0, 0, w, w);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, w);
    for (const st of strokes) paintArtist(ctx, st, w);
    paintArtist(ctx, liveRef.current, w);
  }, [strokes, liveTick]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (!spin) {
      el.style.transform = "none";
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      angleRef.current = ((now - t0) / 1000) * 60;
      el.style.transform = `rotate(${angleRef.current}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [spin]);

  function point(e: PointerEvent) {
    const el = wrapRef.current;
    if (!el) return [0, 0];
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rad = (-angleRef.current * Math.PI) / 180;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const lx = dx * Math.cos(rad) - dy * Math.sin(rad);
    const ly = dx * Math.sin(rad) + dy * Math.cos(rad);
    const half = el.clientWidth / 2 || 1;
    const x = Math.round(((lx / half + 1) / 2) * 1000);
    const y = Math.round(((ly / half + 1) / 2) * 1000);
    return [Math.max(0, Math.min(1000, x)), Math.max(0, Math.min(1000, y))];
  }

  function down(e: PointerEvent) {
    if (!enabled) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const [x, y] = point(e);
    liveRef.current = erase ? [1002, 0, x!, y!] : [1001, 0, x!, y!];
    setLiveTick((n) => n + 1);
  }
  function move(e: PointerEvent) {
    if (!enabled || liveRef.current.length === 0) return;
    e.preventDefault();
    const [x, y] = point(e);
    const pts = liveRef.current;
    const px = pts[pts.length - 2] ?? 0;
    const py = pts[pts.length - 1] ?? 0;
    if (Math.hypot(x! - px, y! - py) < 12) return;
    if (pts.length < 160) pts.push(x!, y!);
    setLiveTick((n) => n + 1);
  }
  function up() {
    const pts = liveRef.current;
    liveRef.current = [];
    setLiveTick((n) => n + 1);
    if (pts.length >= 6) onStroke(pts);
  }

  return (
    <div className={`artist-stage${spin ? " is-spin" : ""}${label ? " has-tag" : ""}`}>
      <div
        ref={wrapRef}
        className="artist-paper"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <canvas ref={canvasRef} width={400} height={400} />
        {label ? <b className="artist-tag">{label}</b> : null}
      </div>
    </div>
  );
}

export function ArtistScreen() {
  const a = useGame((s) => s.artist);
  const players = useGame((s) => s.players);
  const myId = useGame((s) => s.myPlayerId);
  const punishLabel = useGame((s) => s.punishLabel);
  const hostOnly = useGame((s) => s.isOnline && !s.isHost);
  const orderDone = useGame((s) => s.artistOrderDone);
  const pick = useGame((s) => s.artistPick);
  const stroke = useGame((s) => s.artistStroke);
  const done = useGame((s) => s.artistDone);
  const guess = useGame((s) => s.artistGuess);
  const next = useGame((s) => s.artistNext);
  const undo = useGame((s) => s.artistUndo);
  const toModes = useGame((s) => s.toModes);
  const [left, setLeft] = useState(20);
  const [tool, setTool] = useState<"pen" | "erase">("pen");

  useEffect(() => {
    if (a?.sub !== "draw") return;
    const tick = () => setLeft(Math.max(0, Math.ceil((a.drawStart + 20000 - Date.now()) / 1000)));
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [a?.sub, a?.drawStart]);

  useEffect(() => {
    if (a?.sub !== "draw" || hostOnly) return;
    const wait = Math.max(0, a.drawStart + 20000 - Date.now());
    const t = window.setTimeout(() => done(), wait);
    return () => window.clearTimeout(t);
  }, [a?.sub, a?.drawStart, hostOnly, done]);

  if (!a) {
    return (
      <Screen>
        <p className="hint">調色中…</p>
      </Screen>
    );
  }
  const painter = players.find((p) => p.id === a.artistId);
  const painterRole = painter ? getRole(painter.roleId).name : "";
  const mine = myId === a.artistId;
  const myGuess = myId ? a.guesses[myId] : "";
  const waiting = players.filter((p) => p.id !== a.artistId && !a.guesses[p.id]);
  const ordered = a.order
    .map((id, i) => ({ id, i, name: players.find((p) => p.id === id)?.name ?? "?" }))
    .filter((p) => p.name);

  return (
    <Screen className="screen-artist">
      <DrinkHud />
      <div className="top-bar">
        <button
          className="btn btn-ghost btn-sm"
          type="button"
          disabled={hostOnly}
          aria-label="返回"
          onClick={() => {
            if (!hostOnly) toModes();
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="tag-pill">ART</span>
        <span className="tag-pill pink">
          {a.sub === "order" ? "排順序" : `畫家 ${painter?.name ?? "？"}・${painterRole}`}
        </span>
      </div>
      {a.sub === "order" ? (
        <MatchStarterReel players={players} winnerId={a.order[0] ?? ""} onDone={() => orderDone()} />
      ) : (
        <div className="artist-order">
          {ordered.map((p) => (
            <span key={p.id} className={p.id === a.artistId ? "on" : ""}>
              {p.i + 1}.{p.name.replace(/^電腦[·・]/, "")}
            </span>
          ))}
        </div>
      )}
      {a.sub === "pick" ? (
        <>
          <p className="flip-ux-hint">{mine ? "三選一，等下要在旋轉畫紙上畫出來" : `等 ${painter?.name ?? "畫家"} 選題`}</p>
          {mine ? (
            <div className="artist-words">
              {a.choices.map((id) => (
                <button
                  key={id}
                  className="btn btn-lg"
                  type="button"
                  onClick={() => {
                    unlockSfx();
                    sfxTick();
                    pick(id);
                  }}
                >
                  {artistWord(id)}
                </button>
              ))}
            </div>
          ) : (
            <ArtistWait
              roleId={painter?.roleId ?? "worker"}
              name={painter?.name ?? "畫家"}
              title={`${painter?.name ?? "畫家"}・${painterRole} 選題中…`}
              paint
            />
          )}
        </>
      ) : null}
      {a.sub === "draw" ? (
        <>
          <p className="flip-ux-hint">
            {mine ? `畫「${artistWord(a.answer)}」。畫紙會一直轉，${left} 秒` : "先等這張畫完成"}
          </p>
          {mine ? (
            <>
              <ArtistPaper
                strokes={a.strokes}
                spin
                enabled
                erase={tool === "erase"}
                onStroke={(pts) => stroke(pts)}
              />
              <div className="artist-tools">
                <button className={`btn${tool === "pen" ? " is-mine" : " btn-ghost"}`} type="button" onClick={() => setTool("pen")}>
                  畫筆
                </button>
                <button className={`btn${tool === "erase" ? " is-mine" : " btn-ghost"}`} type="button" onClick={() => setTool("erase")}>
                  橡皮擦
                </button>
                <button className="btn btn-ghost" type="button" disabled={a.strokes.length === 0} onClick={() => undo()}>
                  上一步
                </button>
              </div>
              <button className="btn btn-lg" type="button" onClick={() => done()}>
                畫完
              </button>
            </>
          ) : (
            <ArtistWait
              roleId={painter?.roleId ?? "worker"}
              name={painter?.name ?? "畫家"}
              title={`${painter?.name ?? "畫家"}・${painterRole} 作畫中…`}
              detail={String(left)}
              paint
            />
          )}
        </>
      ) : null}
      {a.sub === "guess" || a.sub === "result" ? (
        <ArtistPaper
          strokes={a.strokes}
          spin={false}
          enabled={false}
          erase={false}
          onStroke={() => {}}
          label={a.sub === "result" ? artistWord(a.answer) : undefined}
        />
      ) : null}
      {a.sub === "guess" ? (
        <>
          {mine ? (
            <div className="artist-wait-card is-compact">
              <p>等大家猜這張畫</p>
              <div className="artist-wait-row">
                {waiting.map((p) => (
                  <span key={p.id}>
                    <Portrait roleId={p.roleId} size={64} />
                    <b>{p.name}</b>
                  </span>
                ))}
              </div>
              {waiting.length === 0 ? <span className="artist-dots">結算中</span> : <span className="artist-dots">還沒猜</span>}
            </div>
          ) : (
            <>
              <p className="flip-ux-hint">這張在畫什麼？三選一</p>
              <div className="artist-words">
                {a.options.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={`btn btn-lg${myGuess === id ? " is-mine" : ""}`}
                    onClick={() => {
                      unlockSfx();
                      sfxTick();
                      guess(id);
                    }}
                  >
                    {artistWord(id)}
                  </button>
                ))}
              </div>
            </>
          )}
          <p className="hint">{waiting.length ? `還有 ${waiting.length} 人在猜` : "猜完了"}</p>
        </>
      ) : null}
      {a.sub === "result" ? (
        <>
          {a.wrongIds.length ? (
            <div className="artist-wrong">
              {a.wrongIds.map((id) => {
                const p = players.find((x) => x.id === id);
                if (!p) return null;
                return (
                  <figure key={id}>
                    <Portrait roleId={p.roleId} size={72} />
                    <figcaption>{p.name.replace(/^電腦[·・]/, "")}</figcaption>
                  </figure>
                );
              })}
            </div>
          ) : null}
          <div className={`flip-result ${a.wrongIds.length ? "bad" : "ok"}`}>
            <div className="flip-result-title">
              {a.allMissed ? "全猜錯，畫家受罰" : a.wrongIds.length ? "猜錯的人受罰" : "大家都猜對"}
            </div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {a.wrongIds.length ? punishLabel : "過關"}
            </p>
          </div>
          <div className="artist-dock">
            <SkillUseBtn float />
            <NextReadyButtons row active={a.sub === "result"} onGo={next} />
          </div>
        </>
      ) : null}
    </Screen>
  );
}

export function WheelScreen() {
  const w = useGame((s) => s.wheel);
  const punishLabel = useGame((s) => s.punishLabel);
  const players = useGame((s) => s.players);
  const wheelGo = useGame((s) => s.wheelGo);
  const wheelLanded = useGame((s) => s.wheelLanded);
  const wheelTap = useGame((s) => s.wheelTap);
  const beginWheel = useGame((s) => s.beginWheel);
  const toModes = useGame((s) => s.toModes);
  const hostOnly = useGame((s) => s.isOnline && !s.isHost);

  if (!w) {
    return (
      <Screen>
        <p className="hint">輪盤載入中…</p>
      </Screen>
    );
  }

  const spinner = players.find((p) => p.id === w.spinnerId);
  const seg = WHEEL[w.landed];

  return (
    <Screen>
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">WHEEL</span>
        <span className="tag-pill pink">命運輪盤</span>
      </div>
      <h1 className="graffiti-title" style={{ fontSize: "1.8rem" }}>
        命運輪盤
      </h1>
      <p className="hint">本輪轉盤手：{spinner?.name ?? "—"}</p>
      <FateWheel spinning={w.sub === "spin"} angle={w.angle} onDone={wheelLanded} />
      <div className="wheel-legend">
        {WHEEL.map((seg) => (
          <span key={seg.id}>
            <i style={{ background: seg.color }} />
            {seg.label}
          </span>
        ))}
      </div>

      {w.sub === "idle" ? (
        <div className="btn-row inline">
          <HostGate>
            <button
              className="btn btn-lg"
              type="button"
              onClick={() => {
                unlockSfx();
                sfxSpin();
                wheelGo();
              }}
            >
              <RotateCw size={18} /> 轉！
            </button>
            <ModeSwitchBtn />
          </HostGate>
        </div>
      ) : null}

      {w.sub === "spin" ? <p className="flip-ux-hint">命運轉動中…</p> : null}

      {w.sub === "target" ? (
        <>
          <p className="flip-ux-hint">{seg?.label} · 點一個人</p>
          <div className="king-grid">
            {players.map((p) => (
              <button type="button" key={p.id} className="king-seat" disabled={hostOnly} onClick={() => wheelTap(p.id)}>
                <Portrait roleId={p.roleId} size={48} />
                <strong>{p.name}</strong>
              </button>
            ))}
          </div>
        </>
      ) : null}

      {w.sub === "resolve" ? (
        <>
          <div className={`flip-result ${w.drinkerIds.length ? "bad" : "ok"}`}>
            <div className="flip-result-title">{w.message || seg?.label}</div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {w.drinkerIds.length
                ? w.drinkerIds
                    .map((id) => players.find((p) => p.id === id)?.name)
                    .filter(Boolean)
                    .join("、") + ` ${punishPhrase(punishLabel, seg?.cups ?? 1)}`
                : "沒人受罰"}
            </p>
          </div>
          <NextReadyButtons
            active={w.sub === "resolve"}
            onGo={() => {
              sfxDrink();
              beginWheel();
            }}
          />
        </>
      ) : null}
    </Screen>
  );
}

export function MatchStarterReel({
  players,
  winnerId,
  onDone,
}: {
  players: { id: string; name: string; roleId: string }[];
  winnerId: string;
  onDone: () => void;
}) {
  const n = Math.max(1, players.length);
  const winner = Math.max(0, players.findIndex((p) => p.id === winnerId));
  const [idx, setIdx] = useState(0);
  const [locked, setLocked] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    let stop = false;
    let step = 0;
    const spins = n * 4 + winner;
    let timer = 0;
    const tick = () => {
      if (stop) return;
      if (step >= spins) {
        setIdx(winner);
        setLocked(true);
        sfxSlam();
        vibrate(36);
        timer = window.setTimeout(() => {
          if (!stop) doneRef.current();
        }, 520);
        return;
      }
      setIdx(step % n);
      sfxTick();
      const delay = Math.min(70 + step * 16, 260);
      step += 1;
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 60);
    return () => {
      stop = true;
      window.clearTimeout(timer);
    };
  }, [n, winner]);

  const current = players[idx];
  const label = current?.name.replace(/^電腦[·・]/, "") ?? "";
  return (
    <div className="match-spin" role="status">
      <p className="match-spin-kicker">誰先開始</p>
      <div className={`match-slot${locked ? " locked" : ""}`}>
        {current ? <Portrait roleId={current.roleId} size={148} className="match-slot-art" /> : null}
      </div>
      <strong className="match-spin-name">{locked ? `${label} 先手` : label}</strong>
      <div className="match-spin-row">
        {players.map((p, i) => (
          <span key={p.id} className={`match-spin-pip${i === idx ? " on" : ""}`}>
            <Portrait roleId={p.roleId} size={36} />
          </span>
        ))}
      </div>
    </div>
  );
}

export function MatchScreen() {
  const m = useGame((s) => s.match);
  const deal = useGame((s) => s.dealMatch);
  const tap = useGame((s) => s.tapMatch);
  const flipBack = useGame((s) => s.flipMatch);
  const swap = useGame((s) => s.swapMatch);
  const readySwap = useGame((s) => s.readyMatchSwap);
  const cancelSwap = useGame((s) => s.cancelMatchSwap);
  const commitSwap = useGame((s) => s.commitMatchSwap);
  const arm = useGame((s) => s.armMatch);
  const again = useGame((s) => s.againMatch);
  const myId = useGame((s) => s.myPlayerId);
  const players = useGame((s) => s.players);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const hostOnly = isOnline && !isHost;

  useEffect(() => {
    if (!m?.tiles.length) return;
    preloadReactCards(m.tiles.map((t) => t.file));
  }, [m?.round, m?.size, m?.tiles.length]);

  useEffect(() => {
    if (!m?.lock) return;
    const live = useGame.getState();
    if (live.isOnline && !live.isHost) return;
    let stop = false;
    const files = (m.pick ?? []).map((i) => m.tiles[i]?.file).filter(Boolean) as string[];
    const started = Date.now();
    const hold = 1200;
    void (async () => {
      await whenReactCardsReady(files, 2000);
      const wait = Math.max(0, hold - (Date.now() - started));
      await new Promise((r) => window.setTimeout(r, wait));
      if (!stop) flipBack();
    })();
    const fallback = window.setTimeout(() => {
      if (!stop) flipBack();
    }, 3200);
    return () => {
      stop = true;
      window.clearTimeout(fallback);
    };
  }, [m?.lock, flipBack]);

  useEffect(() => {
    if (m?.sub !== "next") return;
    const t = window.setTimeout(() => deal(m.size), 1200);
    return () => window.clearTimeout(t);
  }, [m?.sub, m?.size, deal]);

  useEffect(() => {
    if (!m?.swapping || !m.swapBurst) return;
    const live = useGame.getState();
    if (live.isOnline && !live.isHost) return;
    const t = window.setTimeout(() => readySwap(), 1000);
    return () => window.clearTimeout(t);
  }, [m?.swapping, m?.swapBurst, readySwap]);

  useEffect(() => {
    if (!m?.swapping || m.swapPick.length !== 2) return;
    const live = useGame.getState();
    if (live.isOnline && !live.isHost) return;
    const t = window.setTimeout(() => commitSwap(), 420);
    return () => window.clearTimeout(t);
  }, [m?.swapping, m?.swapPick.length, commitSwap]);

  useEffect(() => {
    if (!m?.swapping) return;
    const closed = m.tiles.filter((t) => !t.matched && !t.open).length;
    if (closed >= 2) return;
    const live = useGame.getState();
    if (live.isOnline && !live.isHost) return;
    cancelSwap();
  }, [m?.swapping, m?.tiles, cancelSwap]);

  if (!m) return <Screen><p className="hint">載入中…</p></Screen>;
  const myTurn = m.turn === myId;
  const swapClosed = m.tiles.filter((t) => !t.matched && !t.open).length;
  const canSwap =
    myTurn && !m.swapped.includes(myId ?? "") && !m.lock && m.sub === "play" && !m.swapping && swapClosed >= 2;
  const showSwapGlow = m.swapping && m.swapBy === myId;
  const turnName = players.find((p) => p.id === m.turn)?.name.replace(/^電腦[·・]/, "") ?? "";

  return (
    <Screen className="screen-match">
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">MATCH</span>
        <span className="tag-pill pink">對對碰</span>
      </div>
      {m.sub === "size" ? (
        <div className="match-setup">
          <img className="match-setup-art" src={modeArt("match")} alt="" draggable={false} />
          <p className="hint">一局就結束。對到繼續，對錯換人。配對最少的喝，同分最少就一起罰。自己回合可調換一次，牌面不亮。</p>
          <div className="match-sizes">
            {(
              [
                { n: 8 as const, grid: "4×4" },
                { n: 12 as const, grid: "6×4" },
                { n: 18 as const, grid: "6×6" },
              ]
            ).map((opt) => (
              <button key={opt.n} className="match-size" type="button" disabled={hostOnly} onClick={() => deal(opt.n)}>
                <strong>{opt.n} 對</strong>
                <span>{opt.grid}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {m.sub === "next" ? (
        <p className="hint">第 {m.round} 局結束，接著第 {(m.round || 1) + 1} 局…</p>
      ) : null}
      {m.sub === "play" || m.sub === "spin" ? (
        <>
          <p className="hint">
            {m.sub === "spin" ? "抽誰先開始…" : `輪到 ${turnName}`}
            {m.swapping ? (m.swapBurst ? "" : " · 點兩張蓋牌") : ""}
          </p>
          <div className={`match-board${m.cols >= 6 ? " grid-6" : ""}`} style={{ ["--n" as string]: String(m.cols || 4) }}>
            {m.tiles.map((t, i) => (
              <button
                key={i}
                className={`match-tile ${t.open || t.matched ? "open" : ""} ${t.matched ? "matched" : ""} ${showSwapGlow && m.swapPick.includes(i) ? "swap-on" : ""}`}
                type="button"
                disabled={m.sub !== "play" || !myTurn || m.lock || Boolean(m.swapBurst) || m.swapPick.length >= 2}
                onClick={() => {
                  unlockSfx();
                  tap(i, myId ?? undefined);
                }}
              >
                <img className="match-back" src={ART.cardBack} alt="" draggable={false} />
                <img className="match-face" src={reactCardSrc(t.file)} alt="" draggable={false} />
              </button>
            ))}
          </div>
          {m.sub === "spin" ? (
            <MatchStarterReel
              key={`${m.round}-${m.turn}`}
              players={players}
              winnerId={m.turn}
              onDone={() => {
                if (useGame.getState().isOnline && !useGame.getState().isHost) return;
                arm();
              }}
            />
          ) : null}
          <div className="match-actions">
            <button
              className="btn btn-pink"
              type="button"
              disabled={!canSwap}
              onClick={() => {
                if (!canSwap) return;
                unlockSfx();
                swap(myId ?? undefined);
              }}
            >
              調換
            </button>
            <ModeSwitchBtn />
          </div>
        </>
      ) : null}
      {m.sub === "result" ? (
        <>
          <div className="flip-result bad">
            <div className="flip-result-title">
              {(m.losers?.length ?? 0) > 1 ? "同分最少，一起受罰" : "配對最少，受罰"}
            </div>
            <p className="hint">
              {(m.losers?.length
                ? m.losers
                : players
                    .filter((p) => (m.scores[p.id] ?? 0) === Math.min(...players.map((x) => m.scores[x.id] ?? 0)))
                    .map((p) => p.id)
              )
                .map((id) => players.find((p) => p.id === id)?.name.replace(/^電腦[·・]/, ""))
                .filter(Boolean)
                .join("、") || "有人"}
              喝
            </p>
          </div>
          <NextReadyButtons active={m.sub === "result"} onGo={again} extra={<SkillUseBtn />} />
        </>
      ) : m.sub === "size" || m.sub === "next" ? (
        <div className="btn-row">
          <ModeSwitchBtn />
        </div>
      ) : null}
    </Screen>
  );
}

export function AwardScreen() {
  const award = useGame((s) => s.award);
  const players = useGame((s) => s.players);
  const beginCore = useGame((s) => s.beginCore);
  const toModes = useGame((s) => s.toModes);
  const face = (ids: string[]) =>
    ids
      .map((id) => players.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => (
        <span className="award-who" key={p!.id}>
          <Portrait roleId={p!.roleId} size={64} />
          <b>{p!.name}</b>
        </span>
      ));
  return (
    <Screen className="screen-award">
      <DrinkHud />
      <h1 className="graffiti-title">本局頒獎</h1>
      <div className="award-card worst">
        <p className="kicker">最雷代表</p>
        <div className="award-faces">{face(award?.worst ?? [])}</div>
        <p>懲罰最多</p>
      </div>
      <div className="award-card best">
        <p className="kicker">最強代表</p>
        <div className="award-faces">{face(award?.best ?? [])}</div>
        <p>懲罰最少</p>
      </div>
      <NextReadyButtons active onGo={() => award?.mode && beginCore(award.mode)} />
    </Screen>
  );
}

export function RecapScreen() {
  const players = useGame((s) => s.players);
  const goHome = useGame((s) => s.goHome);
  const toModes = useGame((s) => s.toModes);
  const ranked = [...players].sort((a, b) => (b.cups || 0) - (a.cups || 0));
  const total = ranked.reduce((s, p) => s + (p.cups || 0), 0);

  return (
    <Screen>
      <div className="top-bar">
        <span className="tag-pill">RECAP</span>
        <span className="tag-pill pink">今晚結算</span>
      </div>
      <h1 className="graffiti-title" style={{ fontSize: "2rem" }}>
        懲罰榜
      </h1>
      <p className="hint">全場共 {total} 次懲罰 · 規則自己定</p>
      <ol className="recap-list">
        {ranked.map((p, i) => (
          <li key={p.id} className={i === 0 ? "champ" : ""}>
            <Portrait roleId={p.roleId} size={40} />
            <div>
              <strong>{p.name}</strong>
              <span className="recap-tag">{recapTitle(i, ranked.length)}</span>
            </div>
            <b>{p.cups || 0}</b>
          </li>
        ))}
      </ol>
          <div className="btn-row inline">
            <button
              className="btn btn-lg"
              type="button"
              onClick={() => {
                sfxWin();
                toModes();
              }}
            >
              繼續玩
            </button>
            <button className="btn btn-ghost" type="button" onClick={goHome}>
              回首頁
            </button>
          </div>
    </Screen>
  );
}
