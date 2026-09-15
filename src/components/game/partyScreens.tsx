import { useEffect, useRef, useState, type ReactNode } from "react";
import { Crown, RotateCw, Zap } from "lucide-react";
import { getKingCmd, NEVER_PROMPTS, recapTitle, WHEEL } from "@/game/party";
import { getTruth, getWho, fillPunish, punishPhrase } from "@/game/partyPlay";
import { useGame } from "@/game/store";
import { sfxDrink, sfxSlam, sfxSpin, sfxTick, sfxWin, unlockSfx, vibrate } from "@/game/sfx";
import { Screen, usePress } from "./chrome";
import { DrinkHud, FateWheel, Portrait } from "./artui";

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
          <div className="btn-row inline">
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
  const startReactPlay = useGame((s) => s.startReactPlay);
  const finishReact = useGame((s) => s.finishReact);
  const nextReact = useGame((s) => s.nextReact);
  const toModes = useGame((s) => s.toModes);
  const punishLabel = useGame((s) => s.punishLabel);
  const actor = players.find((p) => p.id === r?.playerId);
  const botTurn = Boolean(actor?.isBot);
  const [flash, setFlash] = useState<"wait" | "lime" | "pink">("wait");
  const [beat, setBeat] = useState(0);
  const misses = useRef(0);
  const expect = useRef<"lime" | "pink" | null>(null);
  const armed = useRef(false);
  const ended = useRef(false);

  useEffect(() => {
    if (r?.sub !== "play") {
      setFlash("wait");
      setBeat(0);
      misses.current = 0;
      expect.current = null;
      armed.current = false;
      ended.current = false;
      return;
    }
    const beats: ("lime" | "pink")[] = [];
    for (let i = 0; i < 5; i++) beats.push(Math.random() < 0.62 ? "lime" : "pink");
    let i = 0;
    let raf = 0;
    let nextAt = performance.now() + 700;
    let showingUntil = 0;
    const loop = (now: number) => {
      if (ended.current) return;
      if (showingUntil && now >= showingUntil) {
        setFlash("wait");
        expect.current = null;
        armed.current = false;
        showingUntil = 0;
        i += 1;
        if (i >= beats.length) {
          ended.current = true;
          finishReact(misses.current);
          return;
        }
        nextAt = now + 380 + Math.random() * 520;
      }
      if (!showingUntil && now >= nextAt) {
        const c = beats[i]!;
        expect.current = c;
        armed.current = true;
        setFlash(c);
        setBeat(i + 1);
        showingUntil = now + (c === "lime" ? 720 : 640);
        sfxTick();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [r?.sub, finishReact]);

  function tap() {
    if (r?.sub !== "play" || ended.current) return;
    if (!armed.current) {
      misses.current += 1;
      ended.current = true;
      vibrate(40);
      sfxSlam();
      finishReact(misses.current);
      return;
    }
    if (expect.current === "pink") {
      misses.current += 1;
      ended.current = true;
      vibrate(40);
      sfxSlam();
      finishReact(misses.current);
      return;
    }
    armed.current = false;
    expect.current = null;
    sfxWin();
  }

  if (!r) return <Screen><p className="hint">載入中…</p></Screen>;

  return (
    <Screen>
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">REACT</span>
        <span className="tag-pill pink">{actor?.name ?? "—"}</span>
      </div>
      <p className="hint">綠＝拍　紅＝不准拍　搶拍或誤拍就受罰</p>
      {r.sub === "ready" ? (
        botTurn ? (
          <p className="hint">{actor?.name}（電腦）準備拍了…</p>
        ) : (
          <div className="btn-row">
            <button
              className="btn btn-lg"
              type="button"
              onClick={() => {
                unlockSfx();
                startReactPlay();
              }}
            >
              <Zap size={18} /> {actor?.name} 開始
            </button>
            <ModeSwitchBtn />
          </div>
        )
      ) : null}
      {r.sub === "play" ? (
        <button type="button" className={`react-flash ${flash}`} onPointerDown={tap}>
          {flash === "wait" ? "等…" : flash === "lime" ? "拍！" : "停！"}
          <span className="react-beat">{beat}/5</span>
        </button>
      ) : null}
      {r.sub === "result" || r.sub === "drag" ? (
        <>
          <div className={`flip-result ${r.punished ? "bad" : "ok"}`}>
            <div className="flip-result-title">{r.punished ? "失手受罰" : "過關"}</div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {r.punished ? `${actor?.name} · ${punishLabel}` : `${actor?.name} 反應過關`}
            </p>
          </div>
          <DragPicker exclude={[r.playerId]} />
          <div className="btn-row inline">
            <button className="btn btn-lg" type="button" onClick={nextReact}>下一位</button>
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
