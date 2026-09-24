import { useEffect, useRef, useState, type ReactNode } from "react";
import { Crown, RotateCw, Zap } from "lucide-react";
import { getKingCmd, NEVER_PROMPTS, recapTitle, WHEEL } from "@/game/party";
import { getTruth, getWho, fillPunish, punishPhrase } from "@/game/partyPlay";
import { useGame } from "@/game/store";
import { sfxDrink, sfxSlam, sfxSpin, sfxTick, sfxWin, unlockSfx, vibrate } from "@/game/sfx";
import { ART, modeArt, preloadReactCards, reactCardSrc, whenReactCardsReady, STICKER_ART } from "@/game/art";
import { REACT_CARDS, REACT_COLOR_META, REACT_COLORS, REACT_DECOYS } from "@/game/reactCards";
import { canUseSkillNow } from "@/game/state";
import { Screen, usePress } from "./chrome";
import { DrinkHud, FateWheel, Portrait } from "./artui";


function SkillUseBtn() {
  const useSkill = useGame((s) => s.useSkill);
  const show = useGame((s) => canUseSkillNow(s, s.myPlayerId));
  if (!show) return null;
  return (
    <button className="btn btn-pink" type="button" onClick={useSkill}>
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
  const toModes = useGame((s) => s.toModes);
  const punishLabel = useGame((s) => s.punishLabel);
  const myPlayerId = useGame((s) => s.myPlayerId);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const practice = useGame((s) => s.practice);
  if (!who) return <Screen><p className="hint">載入中…</p></Screen>;
  const q = getWho(who.deck[who.index % who.deck.length] ?? "w01");
  const voter = players.find((p) => p.id === who.voterId);
  const punished = who.punishedIds.map((id) => players.find((p) => p.id === id)?.name).filter(Boolean).join("、");
  const myVoted = Boolean(myPlayerId && myPlayerId in who.votes);
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
            {practice
              ? myVoted
                ? "已點名 · 等電腦投票"
                : "點名一個人，電腦也會投票"
              : `輪到 ${voter?.name ?? "下一位"} 點名`}
          </p>
          <div className="king-grid">
            {players.map((p) => (
              <button
                key={p.id}
                type="button"
                className="king-seat"
                disabled={!canVote}
                onClick={() => {
                  unlockSfx();
                  sfxTick();
                  voteWho(p.id, practice || isOnline ? myPlayerId ?? undefined : undefined);
                }}
              >
                <Portrait roleId={p.roleId} size={48} />
                <strong>{p.name}</strong>
              </button>
            ))}
          </div>
          <div className="btn-row">
            <ModeSwitchBtn />
          </div>
        </>
      ) : (
        <>
          <div className={`flip-result ${who.punishedIds.length ? "bad" : "ok"}`}>
            <div className="flip-result-title">票數最高</div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {punished || "沒人"} · {punishLabel}
            </p>
          </div>
          <DragPicker exclude={who.punishedIds} />
          <div className="btn-row">
            <SkillUseBtn />
            <button className="btn btn-lg" type="button" onClick={nextWho}>下一題</button>
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
          <p className="hint">電腦正在決定要不要講…</p>
        ) : (
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
          <div className="btn-row inline">
            <SkillUseBtn />
            <button className="btn btn-lg" type="button" onClick={nextTruth}>下一題</button>
            <ModeSwitchBtn />
          </div>
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
  const [okFlash, setOkFlash] = useState(false);
  const colorMeta = r ? REACT_COLOR_META[r.color as keyof typeof REACT_COLOR_META] : null;
  const needLabel =
    r?.need === "cat" ? "貓" : r?.need === "dog" ? "狗" : r?.need === "cow" ? "牛" : r?.need === "panda" ? "熊貓" : "";
  const faceKey = `${r?.card ?? 0}:${r?.file ?? ""}`;
  const [readyKey, setReadyKey] = useState("");
  const faceReady = r?.sub === "play" && readyKey === faceKey;

  useEffect(() => {
    preloadReactCards([...REACT_CARDS.map((c) => c.file), ...REACT_DECOYS.map((c) => c.file)]);
  }, []);

  useEffect(() => {
    if (r?.sub !== "count") return;
    const t = window.setTimeout(tick, 800);
    return () => window.clearTimeout(t);
  }, [r?.sub, r?.count, tick]);

  useEffect(() => {
    setOkFlash(false);
  }, [r?.card]);

  useEffect(() => {
    if (r?.sub !== "play" || !r.hold) return;
    const t = window.setTimeout(() => release(), 420);
    return () => window.clearTimeout(t);
  }, [r?.sub, r?.hold, r?.card, release]);

  useEffect(() => {
    if (r?.sub !== "play" || !faceReady || r.hold) return;
    const t = window.setTimeout(() => timeoutReact(), r.tempo);
    return () => window.clearTimeout(t);
  }, [r?.sub, r?.card, r?.tempo, faceReady, timeoutReact]);

  if (!r) return <Screen><p className="hint">載入中…</p></Screen>;
  const live = r;

  function tap() {
    if (live.sub !== "play") return;
    unlockSfx();
    const result = tapReact(myId ?? undefined);
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
            <button className="btn btn-lg" type="button" onClick={() => { unlockSfx(); mark(); }}>
              準備
            </button>
            <p className="hint">
              {r.ready.length}/{players.length} 已準備
            </p>
          </div>
        </>
      ) : null}
      {r.sub === "count" ? (
        <>
          <div className="react-target">
            <b style={{ background: colorMeta?.hex }} />
            <span>
              點「{colorMeta?.name}」
              {r.hard ? `＋${needLabel}` : ""}
            </span>
            {r.hard && r.need ? <img src={STICKER_ART[r.need]} alt="" className="react-need" /> : null}
          </div>
          <div className="react-count-only">{r.count}</div>
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
          <div className="react-target">
            <b style={{ background: colorMeta?.hex }} />
            <span>
              點「{colorMeta?.name}」
              {r.hard ? `＋${needLabel}` : ""}
            </span>
            {r.hard && r.need ? <img src={STICKER_ART[r.need]} alt="" className="react-need" /> : null}
          </div>
          <button type="button" className={`react-card${okFlash || r.hold ? " is-ok" : ""}`} onPointerDown={tap}>
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
          <button className="btn btn-lg" type="button" onClick={nextRound}>
            {r.beat + 1 >= 9 ? "結算" : "下一次"}
          </button>
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
          <div className="btn-row">
            <button className="btn btn-lg" type="button" onClick={again}>
              再來一局
            </button>
            <ModeSwitchBtn />
          </div>
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
          <div className="btn-row">
            <HostGate>
              <button
                className="btn btn-lg"
                type="button"
                onClick={() => {
                  sfxDrink();
                  vibrate(30);
                  beginKing();
                }}
              >
                再來一輪
              </button>
              <ModeSwitchBtn />
            </HostGate>
          </div>
        </>
      ) : null}
    </Screen>
  );
}

export function NeverScreen() {
  const n = useGame((s) => s.never);
  const punishLabel = useGame((s) => s.punishLabel);
  const players = useGame((s) => s.players);
  const neverTap = useGame((s) => s.neverTap);
  const neverDone = useGame((s) => s.neverDone);
  const neverNext = useGame((s) => s.neverNext);
  const toModes = useGame((s) => s.toModes);
  const hostOnly = useGame((s) => s.isOnline && !s.isHost);

  if (!n) {
    return (
      <Screen>
        <p className="hint">題庫載入中…</p>
      </Screen>
    );
  }
  const q = NEVER_PROMPTS.find((p) => p.id === n.deck[n.index % n.deck.length]) ?? NEVER_PROMPTS[0]!;

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
        從未做過
      </h1>
      <div className="flip-q sticker">
        <div className="flip-q-label">做過的人{punishLabel}</div>
        <p className="flip-q-text">{q.q}</p>
      </div>
      {n.sub === "ask" ? (
        <>
          <p className="flip-ux-hint">點選做過的人（可多選）</p>
          <div className="king-grid">
            {players.map((p) => (
              <button
                type="button"
                key={p.id}
                className={`king-seat ${n.marked.includes(p.id) ? "is-king" : ""}`}
                disabled={hostOnly}
                onClick={() => neverTap(p.id)}
              >
                <Portrait roleId={p.roleId} size={48} />
                <strong>{p.name}</strong>
              </button>
            ))}
          </div>
          <div className="btn-row">
            <HostGate>
              <button
                className="btn btn-pink btn-lg"
                type="button"
                onClick={() => {
                  unlockSfx();
                  sfxDrink();
                  vibrate(24);
                  neverDone();
                }}
              >
                確認 · {n.marked.length} 人受罰
              </button>
            </HostGate>
          </div>
        </>
      ) : (
        <>
          <div className={`flip-result ${n.marked.length ? "bad" : "ok"}`}>
            <div className="flip-result-title">{n.marked.length ? "中鏢受罰" : "全場清白"}</div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {n.marked.length
                ? n.marked
                    .map((id) => players.find((p) => p.id === id)?.name)
                    .filter(Boolean)
                    .join("、") + ` ${punishLabel}`
                : "這題沒人中"}
            </p>
          </div>
          <div className="btn-row inline">
            <HostGate>
              <button className="btn btn-lg" type="button" onClick={neverNext}>
                下一題
              </button>
              <ModeSwitchBtn />
            </HostGate>
          </div>
        </>
      )}
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
          <div className="btn-row inline">
            <HostGate>
              <button
                className="btn btn-lg"
                type="button"
                onClick={() => {
                  sfxDrink();
                  beginWheel();
                }}
              >
                再轉一次
              </button>
              <ModeSwitchBtn />
            </HostGate>
          </div>
        </>
      ) : null}
    </Screen>
  );
}

function MatchStarterReel({
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
  const commitSwap = useGame((s) => s.commitMatchSwap);
  const arm = useGame((s) => s.armMatch);
  const myId = useGame((s) => s.myPlayerId);
  const players = useGame((s) => s.players);
  const next = useGame((s) => s.nextReact);

  useEffect(() => {
    if (!m?.tiles.length) return;
    preloadReactCards(m.tiles.map((t) => t.file));
  }, [m?.round, m?.size, m?.tiles.length]);

  useEffect(() => {
    if (!m?.lock) return;
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
    const t = window.setTimeout(() => readySwap(), 1000);
    return () => window.clearTimeout(t);
  }, [m?.swapping, m?.swapBurst, readySwap]);

  useEffect(() => {
    if (!m?.swapping || m.swapPick.length !== 2) return;
    const t = window.setTimeout(() => commitSwap(), 420);
    return () => window.clearTimeout(t);
  }, [m?.swapping, m?.swapPick.length, commitSwap]);

  if (!m) return <Screen><p className="hint">載入中…</p></Screen>;
  const myTurn = m.turn === myId;
  const canSwap = myTurn && !m.swapped.includes(myId ?? "") && !m.lock && m.sub === "play" && !m.swapping;
  const showSwapGlow = m.swapping && m.swapBy === myId;
  const turnName = players.find((p) => p.id === m.turn)?.name.replace(/^電腦[·・]/, "") ?? "";

  return (
    <Screen className="screen-match">
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">MATCH</span>
        <span className="tag-pill pink">對對碰 {m.round > 0 ? `${m.round}/${m.roundMax || 3}` : ""}</span>
      </div>
      {m.sub === "size" ? (
        <div className="match-setup">
          <img className="match-setup-art" src={modeArt("match")} alt="" draggable={false} />
          <p className="hint">三局一場。對到繼續，對錯換人。終場配對最少的喝。自己回合可調換一次，牌面不亮。</p>
          <div className="match-sizes">
            {(
              [
                { n: 8 as const, grid: "4×4" },
                { n: 12 as const, grid: "6×4" },
                { n: 18 as const, grid: "6×6" },
              ]
            ).map((opt) => (
              <button key={opt.n} className="match-size" type="button" onClick={() => deal(opt.n)}>
                <strong>{opt.n} 對</strong>
                <span>{opt.grid} · 共 3 局</span>
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
            第 {m.round}/{m.roundMax || 3} 局 · {m.sub === "spin" ? "抽誰先開始…" : `輪到 ${turnName}`}
            {m.swapping ? (m.swapBurst ? " · 調換特效" : " · 點兩張蓋牌，卡背會亮黃") : ""}
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
              onDone={arm}
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
          <p className="hint">三局結束，配對最少的喝。現在可以放技能。</p>
          <div className="btn-row">
            <SkillUseBtn />
            <button className="btn btn-lg" type="button" onClick={next}>
              本局頒獎
            </button>
            <ModeSwitchBtn />
          </div>
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
      <div className="btn-row">
        <button className="btn btn-lg" type="button" onClick={() => award?.mode && beginCore(award.mode)}>
          再來一局
        </button>
        <button className="btn btn-ghost" type="button" onClick={toModes}>
          換模式
        </button>
      </div>
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
