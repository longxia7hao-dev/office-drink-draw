import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  Crown,
  Dices,
  Dumbbell,
  GlassWater,
  Hand,
  KeyRound,
  Layers,
  ListOrdered,
  PencilLine,
  Play,
  Plus,
  Radio,
  RotateCw,
  ShoppingBag,
  Shuffle,
  Swords,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  Wine,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ROLE_ART, ART } from "@/game/art";
import { APP_VERSION } from "@/game/version";
import { FLIP_CATEGORIES, questionsForCat } from "@/game/flipQuestions";
import { ROLES, claimedBy, getRole, isRoleAvailable } from "@/game/roles";
import { fillPunish, punishPhrase } from "@/game/partyPlay";
import { currentFlipQuestion, flipVoteCounts, type GameState, type Player } from "@/game/state";
import { isBgmMuted, sfxFlip, sfxTalk, sfxTick, toggleBgmMute, unlockSfx } from "@/game/sfx";
import { hasSignaling } from "@/game/odd";
import { useGame } from "@/game/store";
import { RoleIcon, Screen, SprayBurst, usePress } from "./chrome";
import { DrinkHud, Portrait, RoleShowcase, RouletteDraw, SprayDraw } from "./artui";
import { AutoVideo } from "./AutoVideo";
import { HomeLoopVideo } from "./HomeLoopVideo";

export function HomeScreen() {
  const setOverlay = useGame((s) => s.setOverlay);
  const startSolo = useGame((s) => s.startSolo);
  const pressSolo = usePress(() => {
    unlockSfx();
    startSolo();
  });
  const pressHost = usePress(() => {
    unlockSfx();
    setOverlay("host-name");
  });
  const pressJoin = usePress(() => {
    unlockSfx();
    setOverlay("join");
  });
  const pressRules = usePress(() => {
    unlockSfx();
    setOverlay("rules");
  });
  const pressPacks = usePress(() => {
    unlockSfx();
    setOverlay("packs");
  });
  const pressRoles = usePress(() => {
    unlockSfx();
    setOverlay("roles-preview");
  });
  const pressBoard = usePress(() => {
    unlockSfx();
    setOverlay("board");
  });
  return (
    <Screen className="screen-home">
      <h1 className="sr-only">公司酒局</h1>
      <div className="home-stage">
        <div className="home-poster-wrap">
          <img className="home-poster" src={ART.homePoster} alt="" draggable={false} />
          <HomeLoopVideo />
          <button type="button" className="hs hs-solo" aria-label="單機開打，練習模式" {...pressSolo} />
          <button type="button" className="hs hs-host" aria-label="開房間連線，揪朋友一起玩" {...pressHost} />
          <button type="button" className="hs hs-join" aria-label="加入房間，輸入房號立即開局" {...pressJoin} />
          <button type="button" className="hs hs-rules" aria-label="遊戲規則" {...pressRules} />
          <button type="button" className="hs hs-packs" aria-label="題庫商店" {...pressPacks} />
          <button type="button" className="hs hs-roles" aria-label="角色收藏" {...pressRoles} />
          <button type="button" className="hs hs-board" aria-label="排行榜" {...pressBoard} />
        </div>
      </div>
    </Screen>
  );
}

function HomeBack({ title }: { title: string }) {
  const setOverlay = useGame((s) => s.setOverlay);
  return (
    <div className="top-bar">
      <button className="btn btn-ghost btn-sm" type="button" onClick={() => setOverlay(null)} aria-label="返回">
        <ChevronLeft size={18} />
      </button>
      <span className="tag-pill">{title}</span>
    </div>
  );
}

const STOCK_PUNISH: { id: string; Icon: LucideIcon }[] = [
  { id: "喝半杯", Icon: GlassWater },
  { id: "喝一杯", Icon: Wine },
  { id: "體能訓練", Icon: Dumbbell },
  { id: "彈額頭", Icon: Hand },
  { id: "自行設定", Icon: PencilLine },
];

/** HOTFIX-PRACTICE-PENALTY — ART-PENALTY-001 + HUD-PENALTY-001 */
const PENALTY_STEM: Record<string, string> = {
  "喝半杯": "penalty-half-v3",
  "喝一杯": "penalty-full-v2",
  "體能訓練": "penalty-fitness-v2",
  "彈額頭": "penalty-forehead-v2",
};

function PunishPicker() {
  const punishLabel = useGame((s) => s.punishLabel);
  const setPunishLabel = useGame((s) => s.setPunishLabel);
  const stockIds = STOCK_PUNISH.slice(0, 4).map((p) => p.id);
  const customOn = !stockIds.includes(punishLabel);
  const [draft, setDraft] = useState(customOn && punishLabel !== "自行設定" ? punishLabel : "");
  const artStem = stockIds.includes(punishLabel) ? PENALTY_STEM[punishLabel]! : "penalty-custom-v2";
  const base = import.meta.env.BASE_URL;
  return (
    <div className="punish-pick" id="penalty-picker">
      <div className="penalty-stage" key={artStem}>
        <img
          className="penalty-art"
          src={`${base}art/penalties/${artStem}.jpg?v=${APP_VERSION}`}
          alt=""
          draggable={false}
        />
      </div>
      <p className="penalty-caption">{punishLabel}</p>
      <div className="punish-icons">
        {STOCK_PUNISH.map(({ id, Icon }) => {
          const on = id === "自行設定" ? customOn : punishLabel === id;
          return (
            <button
              key={id}
              type="button"
              className={`punish-ico${on ? " on" : ""}`}
              onClick={() => setPunishLabel(id === "自行設定" ? draft.trim() || "自行設定" : id)}
            >
              <Icon size={22} strokeWidth={2.4} />
              <b>{id}</b>
            </button>
          );
        })}
      </div>
      {customOn ? (
        <input
          className="punish-custom"
          value={draft}
          maxLength={16}
          placeholder="自己寫，例如：伏地挺身 10 下"
          aria-label="自訂懲罰"
          onChange={(e) => {
            const v = e.target.value;
            setDraft(v);
            setPunishLabel(v.trim() || "自行設定");
          }}
        />
      ) : null}
    </div>
  );
}

export function RulesOverlay() {
  return (
    <Screen>
      <HomeBack title="RULES" />
      <h1 className="graffiti-title" style={{ fontSize: "1.8rem" }}>
        怎麼玩
      </h1>
      <div className="rules-list">
        <p><b>連線局</b> 模式與題庫類型由房主選，其他人同步進場。</p>
        <p><b>多數決</b> 選 A 或 B，少數派受罰。</p>
        <p><b>誰最可能</b> 點名互嘴，票最高受罰。</p>
        <p><b>真心話</b> 回答，或接受懲罰。</p>
        <p><b>反應挑戰</b> 綠就拍、紅不准拍。</p>
        <p><b>混亂事件</b> 每 3 題插入加倍／拖人／免死。</p>
        <p>懲罰在組隊時自訂：喝半杯、體能訓練、彈額頭都可以。</p>
      </div>
    </Screen>
  );
}

export function PacksOverlay() {
  const allow18 = useGame((s) => s.allow18);
  return (
    <Screen>
      <HomeBack title="PACKS" />
      <h1 className="graffiti-title" style={{ fontSize: "1.8rem" }}>
        題庫
      </h1>
      <div className="cat-grid packs">
        {FLIP_CATEGORIES.map((c) => {
          const n = questionsForCat(c.id, true).length;
          const locked = c.age === "18+" && !allow18;
          return (
            <div key={c.id} className={`cat-btn${locked ? " locked" : ""}`}>
              <span className="cat-ic">{c.icon}</span>
              <b>{c.id}</b>
              <small>{locked ? "需 18+" : `${n} 題`}</small>
            </div>
          );
        })}
      </div>
      <p className="hint">12 類 × 100 題＝1,200。成人話題在設定開 18+。</p>
    </Screen>
  );
}

export function BoardOverlay() {
  const [rows, setRows] = useState<{ name: string; roleId: string; cups: number }[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("odd-board");
      if (raw) setRows(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);
  const sorted = [...rows].sort((a, b) => b.cups - a.cups);
  return (
    <Screen>
      <HomeBack title="BOARD" />
      <h1 className="graffiti-title" style={{ fontSize: "1.8rem" }}>
        排行榜
      </h1>
      {sorted.length === 0 ? (
        <p className="hint">還沒開罰。打完一局再回來看誰最慘。</p>
      ) : (
        <ol className="recap-list">
          {sorted.map((p, i) => (
            <li key={`${p.name}-${i}`} className={i === 0 ? "champ" : ""}>
              <Portrait roleId={p.roleId} size={40} />
              <div>
                <strong>{p.name}</strong>
                <span className="recap-tag">{p.cups} 罰</span>
              </div>
              <b>{p.cups}</b>
            </li>
          ))}
        </ol>
      )}
    </Screen>
  );
}

export function SettingsOverlay() {
  const allow18 = useGame((s) => s.allow18);
  const setAllow18 = useGame((s) => s.setAllow18);
  const [musicOn, setMusicOn] = useState(!isBgmMuted());
  return (
    <Screen>
      <HomeBack title="SET" />
      <h1 className="graffiti-title" style={{ fontSize: "1.8rem" }}>
        設定
      </h1>
      <p className="mode-kicker">預設懲罰</p>
      <PunishPicker />
      <button className="btn btn-cyan" type="button" onClick={() => setMusicOn(!toggleBgmMute())}>
        {musicOn ? <Volume2 size={18} /> : <VolumeX size={18} />} {musicOn ? "音樂開" : "音樂關"}
      </button>
      <button className={`btn ${allow18 ? "btn-pink" : "btn-ghost"}`} type="button" onClick={() => setAllow18(!allow18)}>
        {allow18 ? "18+ 題庫已開" : "18+ 題庫關閉"}
      </button>
    </Screen>
  );
}

export function FriendsOverlay() {
  const setOverlay = useGame((s) => s.setOverlay);
  return (
    <Screen>
      <HomeBack title="FRIENDS" />
      <h1 className="graffiti-title" style={{ fontSize: "1.8rem" }}>
        揪團
      </h1>
      <p className="hint">同一間 Wi‑Fi 也能開房間。房主抽籤，朋友輸入 4 碼進房。</p>
      <div className="btn-row">
        <button className="btn btn-cyan btn-lg" type="button" onClick={() => setOverlay("host-name")}>
          開房間
        </button>
        <button className="btn btn-pink" type="button" onClick={() => setOverlay("join")}>
          加入房間
        </button>
      </div>
    </Screen>
  );
}

export function AchievementsOverlay() {
  const [n, setN] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("odd-board");
      const rows = raw ? JSON.parse(raw) : [];
      setN(Array.isArray(rows) ? rows.reduce((s: number, p: { cups?: number }) => s + (p.cups || 0), 0) : 0);
    } catch {
      /* ignore */
    }
  }, []);
  const items = [
    { ok: true, t: "進場", d: "打開公司酒局" },
    { ok: n > 0, t: "第一罰", d: "完成一局並結算" },
    { ok: n >= 10, t: "酒局失控", d: "單局累積 10 次懲罰" },
  ];
  return (
    <Screen>
      <HomeBack title="ACHV" />
      <h1 className="graffiti-title" style={{ fontSize: "1.8rem" }}>
        成就
      </h1>
      <div className="rules-list">
        {items.map((a) => (
          <p key={a.t}>
            <b>{a.ok ? "★" : "☆"} {a.t}</b> {a.d}
          </p>
        ))}
      </div>
    </Screen>
  );
}

export function SetupScreen() {
  const you = useGame((s) => s.setupYou);
  const bots = useGame((s) => s.setupBots);
  const setSetupYou = useGame((s) => s.setSetupYou);
  const setSetupBots = useGame((s) => s.setSetupBots);
  const confirmSetup = useGame((s) => s.confirmSetup);
  const goHome = useGame((s) => s.goHome);

  return (
    <Screen className="setup-screen">
      <div className="top-bar">
        <button className="btn btn-ghost btn-sm" type="button" onClick={goHome} aria-label="返回">
          <ChevronLeft size={18} />
        </button>
        <span className="tag-pill">PRACTICE</span>
      </div>
      <h1 className="graffiti-title" style={{ fontSize: "2rem" }}>
        練習模式
      </h1>
      <p className="hint">你只操作自己。電腦模擬同事投票、選角、反應。</p>
      <div className="player-list" id="practice-roster">
        <div className="player-chip">
          <span className="num">你</span>
          <input value={you} maxLength={12} aria-label="你的暱稱" onChange={(e) => setSetupYou(e.target.value)} />
        </div>
      </div>
      <p className="mode-kicker">電腦對手</p>
      <div className="punish-row">
        {[2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`punish-chip${bots === n ? " on" : ""}`}
            onClick={() => setSetupBots(n)}
          >
            {n} 位
          </button>
        ))}
      </div>
      <p className="mode-kicker">本局懲罰＝</p>
      <div className="setup-art">
        <PunishPicker />
      </div>
      <div className="btn-row" id="btn-penalty-go">
        <button className="btn btn-lg" type="button" onClick={confirmSetup}>
          開始練習
        </button>
      </div>
    </Screen>
  );
}

export function LobbyScreen({ joined }: { joined: boolean }) {
  const roomCode = useGame((s) => s.roomCode);
  const roster = useGame((s) => s.roster);
  const isHost = useGame((s) => s.isHost);
  const myPlayerId = useGame((s) => s.myPlayerId);
  const startOnline = useGame((s) => s.startOnline);
  const goHome = useGame((s) => s.goHome);
  const notice = useGame((s) => s.notice);
  const setNotice = useGame((s) => s.setNotice);
  const [copied, setCopied] = useState(false);

  function copyCode() {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode ?? ""}`;
    void navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <Screen>
      <div className="top-bar">
        <button className="btn btn-ghost btn-sm" type="button" onClick={goHome} aria-label="返回">
          <ChevronLeft size={18} />
        </button>
        {roomCode ? <span className="room-badge">{roomCode}</span> : null}
      </div>
      <h1 className="graffiti-title" style={{ fontSize: "2rem" }}>
        房間
      </h1>
      <p className="hint">
        <span className={`status-dot ${joined ? "on" : "off"}`} />
        連線：{joined ? "已接通" : "連線中"} · 房主為抽籤權威 · 最多 8 人
      </p>
      <div className="sticker">
        <p style={{ margin: 0, fontWeight: 800 }}>把房間碼或網址分給同事加入。</p>
        <p className="hint" style={{ marginBottom: 0 }}>
          網址可帶 <code>?room={roomCode}</code>
        </p>
        <button className="btn btn-lime" type="button" style={{ marginTop: 10 }} onClick={copyCode}>
          {copied ? "已複製連結" : "複製邀請連結"}
        </button>
      </div>
      <div className="player-list" style={{ marginTop: 12 }}>
        {roster.map((p) => (
          <div className="player-chip" key={p.id}>
            <span className={`status-dot ${p.connected ? "on" : "off"}`} />
            <strong>{p.name}</strong>
            {p.id === myPlayerId ? (
              <span className="tag-pill" style={{ fontSize: "0.7rem" }}>
                YOU
              </span>
            ) : null}
          </div>
        ))}
      </div>
      {notice ? <div className="error-banner">{notice}</div> : null}
      <div className="btn-row">
        {isHost ? (
          <button
            className="btn btn-lg"
            type="button"
            onClick={() => {
              const err = startOnline();
              if (err) setNotice(err);
            }}
          >
            開始選角色
          </button>
        ) : (
          <p className="hint">等待房主開始…</p>
        )}
      </div>
    </Screen>
  );
}

export function PickRoleScreen({ onPick }: { onPick: (playerId: string, roleId: string) => void }) {
  const players = useGame((s) => s.players);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const myPlayerId = useGame((s) => s.myPlayerId);
  const notice = useGame((s) => s.notice);
  const setNotice = useGame((s) => s.setNotice);
  const confirmRoles = useGame((s) => s.confirmRoles);
  const fillRandomRoles = useGame((s) => s.fillRandomRoles);
  const leavePick = useGame((s) => s.leavePick);
  const burstKey = useGame((s) => s.burstKey);
  const practice = useGame((s) => s.practice);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const hop = useRef(0);
  const empty = players.find((p) => !p.roleId);
  const actorId = practice || isOnline ? myPlayerId : (focusId ?? empty?.id ?? players[0]?.id ?? null);
  const picked = players.filter((p) => p.roleId).length;
  const mePicked = Boolean(players.find((p) => p.id === myPlayerId)?.roleId);
  const canConfirm = practice ? mePicked : players.length >= 2 && picked === players.length;
  const canChoose = Boolean(actorId) && (!isOnline || Boolean(myPlayerId));
  const hostGate = isOnline && !isHost;
  const role = ROLES[idx] ?? ROLES[0]!;
  const actor = players.find((p) => p.id === actorId);
  const mine = actor?.roleId === role.id;
  const holder = claimedBy(players, role.id, actorId ?? undefined);
  const available = actorId ? isRoleAvailable(players, role.id, actorId) : false;
  const overflow = role.id === "worker" && players.length > ROLES.length && Boolean(holder);
  const locked = Boolean(holder) && !available && !mine;

  useEffect(() => {
    const r = actor?.roleId;
    if (!r) return;
    const i = ROLES.findIndex((x) => x.id === r);
    if (i >= 0) setIdx(i);
  }, [actorId, actor?.roleId]);

  function step(delta: number) {
    unlockSfx();
    sfxTick();
    setIdx((i) => (i + delta + ROLES.length) % ROLES.length);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function choose() {
    if (!actorId) return;
    unlockSfx();
    if (mine) {
      sfxTick();
      onPick(actorId, "");
      return;
    }
    sfxTalk();
    onPick(actorId, role.id);
    if (!isOnline && !practice) {
      const next = players.find((p) => p.id !== actorId && !p.roleId);
      if (next) {
        const token = ++hop.current;
        window.setTimeout(() => {
          if (hop.current === token) setFocusId(next.id);
        }, 1600);
      }
    }
  }

  let stamp: ReactNode = null;
  if (mine) stamp = <div className="taken-stamp mine-stamp">已選</div>;
  else if (locked && holder) stamp = <div className="taken-stamp">{holder.name} 搶走</div>;
  else if (overflow) stamp = <div className="taken-stamp overflow-stamp">可重複</div>;

  return (
    <Screen className="pick-screen">
      <div className="top-bar">
        {hostGate ? (
          <span className="tag-pill">PICK</span>
        ) : (
          <button className="btn btn-ghost btn-sm" type="button" onClick={leavePick} aria-label="返回">
            <ChevronLeft size={18} />
          </button>
        )}
        <span className="pick-title">選角色</span>
        <span className="tag-pill pink">
          {picked}/{players.length}
        </span>
      </div>
      <p className="hint pick-hint">
        {practice
          ? "左右換角色，只選你自己的。電腦稍後自動選。"
          : isOnline
            ? "左右換角色。每人選自己的，被搶走就不能再選。"
            : "先點玩家，左右換角色。被搶走的不能再選。"}
      </p>
      <div className="pick-crew">
        {players.map((p) => {
          const active = p.id === actorId;
          const pr = p.roleId ? getRole(p.roleId) : null;
          return (
            <button
              type="button"
              key={p.id}
              className={`pick-chip${active ? " on" : ""}${p.roleId ? " done" : ""}`}
              disabled={isOnline || practice}
              onClick={() => {
                hop.current += 1;
                setFocusId(p.id);
              }}
            >
              {p.roleId ? <Portrait roleId={p.roleId} size={28} /> : <span className="pick-empty">?</span>}
              <span>{p.name}</span>
              {p.isBot ? (
                <span className="tag-pill" style={{ fontSize: "0.6rem" }}>
                  CPU
                </span>
              ) : p.id === myPlayerId ? (
                <span className="tag-pill" style={{ fontSize: "0.65rem" }}>
                  YOU
                </span>
              ) : null}
              <span className="who">{pr ? pr.name : p.isBot ? "待機" : "未選"}</span>
            </button>
          );
        })}
      </div>
      <RoleShowcase
        role={role}
        index={idx}
        total={ROLES.length}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        stamp={stamp}
        speaking={mine}
        footer={
          <button className="btn btn-lg pick-this" type="button" disabled={!canChoose || locked} onClick={choose}>
            {mine ? "退選這個角色" : locked ? `${holder?.name ?? "別人"} 已搶走` : `選定：${role.name}`}
          </button>
        }
      />
      {notice ? <div className="error-banner">{notice}</div> : null}
      <div className="btn-row inline">
        {hostGate ? (
          <p className="hint">選好後等房主鎖定。角色被搶就換一個。</p>
        ) : (
          <>
            <button
              className="btn btn-lg"
              type="button"
              disabled={!canConfirm}
              onClick={() => {
                const err = confirmRoles();
                if (err) setNotice(err);
              }}
            >
              鎖定角色
            </button>
            <button className="btn btn-ghost" type="button" onClick={fillRandomRoles}>
              <Shuffle size={18} /> {practice ? "電腦先隨機" : "剩下隨機"}
            </button>
          </>
        )}
      </div>
      <SprayBurst burstKey={burstKey} />
    </Screen>
  );
}

function RoleCard({ player, roleId }: { player?: Player; roleId: string }) {
  const r = getRole(roleId);
  const punishLabel = useGame((s) => s.punishLabel);
  return (
    <article className="crew-card" style={{ ["--neon" as string]: r.color }}>
      <div className="crew-art">
        <img src={ROLE_ART[r.id] ?? ROLE_ART.worker} alt="" className="crew-port" draggable={false} />
        <span className="crew-graffiti">{r.tag}</span>
        <div className="crew-plate">
          <strong>{player?.name ?? r.name}</strong>
          <span>
            {r.tag} · {r.name}
          </span>
        </div>
      </div>
      <div className="crew-skill">
        <b>{r.skillName}</b>
        <p>{fillPunish(r.skillDesc, punishLabel)}</p>
        <em>{fillPunish(r.drink, punishLabel)}</em>
        <q>{r.line}</q>
      </div>
    </article>
  );
}

export function RolesScreen() {
  const players = useGame((s) => s.players);
  const toModes = useGame((s) => s.toModes);
  const backPickRoles = useGame((s) => s.backPickRoles);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const n = players.length;
  const dense = n > 4;
  return (
    <Screen className="screen-crew">
      <div className="crew-brand">
        <img className="crew-logo" src={ART.logo} alt="" draggable={false} />
        <span className="crew-slogan">GOOD PEOPLE DRINK TOGETHER!</span>
      </div>
      <DrinkHud />
      <div className="crew-head">
        <button
          className="crew-back"
          type="button"
          onClick={backPickRoles}
          disabled={isOnline && !isHost}
          aria-label="返回"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="crew-titles">
          <h1 className="graffiti-title">角色卡</h1>
          <p className="hint">自己選的角色，記住技能。準備上場噴漆揭示！</p>
        </div>
        <span className="crew-stamp">CREW</span>
      </div>
      <div className={`role-grid n${n}${dense ? " dense" : ""}`}>
        {players.map((p) => (
          <RoleCard key={p.id} player={p} roleId={p.roleId} />
        ))}
      </div>
      <div className="btn-row">
        <button className="btn btn-lg crew-go" type="button" disabled={isOnline && !isHost} onClick={toModes}>
          {isOnline && !isHost ? "等待房主選模式" : "選模式"}
        </button>
      </div>
    </Screen>
  );
}

export function RolesPreviewScreen() {
  const setOverlay = useGame((s) => s.setOverlay);
  const [idx, setIdx] = useState(0);
  const role = ROLES[idx] ?? ROLES[0]!;
  function step(delta: number) {
    unlockSfx();
    sfxTick();
    setIdx((i) => (i + delta + ROLES.length) % ROLES.length);
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <Screen className="pick-screen">
      <div className="top-bar">
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => setOverlay(null)} aria-label="返回">
          <ChevronLeft size={18} />
        </button>
        <span className="pick-title">全角色</span>
        <span className="tag-pill">
          {idx + 1}/{ROLES.length}
        </span>
      </div>
      <p className="hint pick-hint">左右鍵切換角色。</p>
      <RoleShowcase
        role={role}
        index={idx}
        total={ROLES.length}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        speaking
      />
    </Screen>
  );
}

function CatHit({
  cat,
  locked,
  disabled,
  col,
  row,
  onPick,
}: {
  cat: string;
  locked: boolean;
  disabled: boolean;
  col: number;
  row: number;
  onPick: (id: string) => void;
}) {
  const press = usePress(() => {
    if (!locked && !disabled) onPick(cat);
  });
  return (
    <button
      type="button"
      className={`hs hs-cat${locked ? " locked" : ""}`}
      style={{
        left: col === 0 ? "5.1%" : "51.2%",
        top: `${35.2 + row * 7.15}%`,
        width: "44.2%",
        height: "6.5%",
      }}
      disabled={disabled || locked}
      aria-label={cat}
      {...press}
    />
  );
}

export function FlipCatsOverlay() {
  const toModes = useGame((s) => s.toModes);
  const beginCore = useGame((s) => s.beginCore);
  const allow18 = useGame((s) => s.allow18);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const hostOnly = isOnline && !isHost;
  function pick(cat: string | null) {
    if (hostOnly) return;
    beginCore("flip_battle", cat);
  }
  const pressBack = usePress(() => {
    if (!hostOnly) toModes();
  });
  const pressMix = usePress(() => pick(null));
  return (
    <Screen className="screen-home">
      <div className="home-stage">
        <div className="home-poster-wrap">
          <img className="home-poster" src={ART.catsPoster} alt="" draggable={false} />
          <button type="button" className="hs hs-poster-back" aria-label="返回" disabled={hostOnly} {...pressBack} />
          <button type="button" className="hs hs-cat-mix" aria-label="全部混搭" disabled={hostOnly} {...pressMix} />
          {FLIP_CATEGORIES.map((c, i) => (
            <CatHit
              key={c.id}
              cat={c.id}
              locked={c.age === "18+" && !allow18}
              disabled={hostOnly}
              col={i % 2}
              row={Math.floor(i / 2)}
              onPick={(id) => pick(id)}
            />
          ))}
        </div>
      </div>
    </Screen>
  );
}

export function ModesScreen() {
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const backRoles = useGame((s) => s.backRoles);
  const beginCore = useGame((s) => s.beginCore);
  const toFlipCats = useGame((s) => s.toFlipCats);
  const toRecap = useGame((s) => s.toRecap);
  const hostOnly = isOnline && !isHost;
  const pressBack = usePress(() => {
    if (!hostOnly) backRoles();
  });
  const pressFlip = usePress(() => {
    if (!hostOnly) toFlipCats();
  });
  const pressWho = usePress(() => {
    if (!hostOnly) beginCore("who");
  });
  const pressTruth = usePress(() => {
    if (!hostOnly) beginCore("truth");
  });
  const pressReact = usePress(() => {
    if (!hostOnly) beginCore("react");
  });
  const pressRecap = usePress(() => toRecap());

  return (
    <Screen className="screen-home">
      <div className="home-stage">
        <div className="home-poster-wrap">
          <img className="home-poster" src={ART.modesPoster} alt="" draggable={false} />
          <button type="button" className="hs hs-mode-back" aria-label="返回" disabled={hostOnly} {...pressBack} />
          <button type="button" className="hs hs-mode-flip" aria-label="多數決" disabled={hostOnly} {...pressFlip} />
          <button type="button" className="hs hs-mode-who" aria-label="誰最可能" disabled={hostOnly} {...pressWho} />
          <button type="button" className="hs hs-mode-truth" aria-label="真心話" disabled={hostOnly} {...pressTruth} />
          <button type="button" className="hs hs-mode-react" aria-label="反應挑戰" disabled={hostOnly} {...pressReact} />
          <button type="button" className="hs hs-mode-recap" aria-label="今晚結算" {...pressRecap} />
        </div>
      </div>
    </Screen>
  );
}

export function DrawingScreen() {
  const mode = useGame((s) => s.mode);
  const burstKey = useGame((s) => s.burstKey);
  return (
    <Screen>
      {mode === "draw_one" ? <RouletteDraw /> : <SprayDraw />}
      <SprayBurst burstKey={burstKey} />
    </Screen>
  );
}

export function RevealScreen() {
  const state = useGame();
  const r = state.lastResult;
  if (!r) return <ModesScreen />;
  const player = state.players.find((p) => p.id === r.playerId);
  const role = player ? getRole(player.roleId) : null;
  const canSkill = r.skillKind !== "none" && state.skillPending;
  const hostOnly = state.isOnline && !state.isHost;

  if (r.mode === "drink_order" && r.order) {
    return (
      <Screen>
        <DrinkHud />
        <div className="ceremony" style={{ justifyContent: "flex-start", paddingTop: 24 }}>
          <div className="reveal-name">順序出爐</div>
          <ul className="order-list">
            {r.order.map((id, i) => {
              const p = state.players.find((x) => x.id === id);
              if (!p) return null;
              return (
                <li key={id} style={{ animationDelay: `${i * 0.08}s` }}>
                  <Portrait roleId={p.roleId} size={36} />
                  {i + 1}. {p.name}{" "}
                  <span style={{ color: "var(--muted)" }}>（{getRole(p.roleId).name}）</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="btn-row">
          <button className="btn btn-lg" type="button" disabled={hostOnly} onClick={state.again}>
            再來一輪
          </button>
          <button className="btn btn-ghost" type="button" disabled={hostOnly} onClick={state.toModes}>
            換模式
          </button>
        </div>
      </Screen>
    );
  }

  if (r.mode === "team_toast" && r.teams) {
    return (
      <Screen>
        <DrinkHud />
        <div className="ceremony" style={{ justifyContent: "flex-start", paddingTop: 24 }}>
          <div className="reveal-name">分隊乾杯</div>
          <div className="team-box">
            {r.teams.map((t) => (
              <div className="team" key={t.name}>
                <h3>{t.name}</h3>
                <div>{t.members.join(" · ")}</div>
              </div>
            ))}
          </div>
          <div className="reveal-drink">兩隊互敬 · 乾！</div>
        </div>
        <div className="btn-row">
          <button className="btn btn-lg" type="button" disabled={hostOnly} onClick={state.again}>
            再分一次
          </button>
          <button className="btn btn-ghost" type="button" disabled={hostOnly} onClick={state.toModes}>
            換模式
          </button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill" style={{ transform: "rotate(-6deg)" }}>
          HIT!
        </span>
        <span className="tag-pill pink">{role?.tag ?? "DRAW"}</span>
      </div>
      <div className="ceremony">
        {player ? <Portrait roleId={player.roleId} size={100} className="reveal-portrait" /> : null}
        <div className="reveal-name shake">{player?.name ?? "?"}</div>
        {role ? (
          <div className="icon-wrap" style={{ width: 48, height: 48, color: role.color, display: "none" }}>
            <RoleIcon id={role.icon} size={36} color={role.color} />
          </div>
        ) : null}
        <div className="graffiti-sub">
          {role?.name} · {role?.tag}
        </div>
        <div className="reveal-drink">{fillPunish(r.drinkHint, state.punishLabel)}</div>
        {role && role.skillKind !== "none" ? (
          <div className="sticker" style={{ width: "100%", marginTop: 8 }}>
            <strong style={{ color: "var(--spray-pink)" }}>{role.skillName}</strong>
            <p className="hint" style={{ margin: "4px 0 0" }}>
              {fillPunish(role.skillDesc, state.punishLabel)}
            </p>
          </div>
        ) : null}
      </div>
      <div className="btn-row">
        {canSkill ? (
          <>
            <button className="btn btn-pink btn-lg" type="button" disabled={hostOnly} onClick={state.useSkill}>
              <Zap size={20} /> 發動技能
            </button>
            <button className="btn btn-lime" type="button" disabled={hostOnly} onClick={state.skipSkill}>
              直接受罰 · 跳過技能
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-lg" type="button" disabled={hostOnly} onClick={state.again}>
              再抽一次
            </button>
            <button className="btn btn-ghost" type="button" disabled={hostOnly} onClick={state.toModes}>
              換模式
            </button>
          </>
        )}
      </div>
      <SprayBurst burstKey={state.burstKey} />
    </Screen>
  );
}

function TargetBtns({ list, onPick }: { list: Player[]; onPick: (id: string) => void }) {
  if (list.length === 0) return <p className="hint">沒有可選對象</p>;
  return (
    <div className="king-grid skill-targets">
      {list.map((p) => (
        <button className="king-seat" type="button" key={p.id} onClick={() => onPick(p.id)}>
          <Portrait roleId={p.roleId} size={56} />
          <strong>{p.name}</strong>
          <span>{getRole(p.roleId).name}</span>
        </button>
      ))}
    </div>
  );
}

export function SkillScreen() {
  const state = useGame();
  const r = state.lastResult;
  if (!r) return <ModesScreen />;
  const me = state.players.find((p) => p.id === (state.punishActorId ?? r.playerId));
  const role = me ? getRole(me.roleId) : null;
  const others = state.players.filter((p) => p.id !== me?.id);
  const hostOnly = state.isOnline && !state.isHost && state.myPlayerId !== me?.id;
  const used = Boolean(me?.skillUsed);
  let body: ReactNode = null;
  if (used) {
    body = <p className="error-banner">這個模式技能已經用過了</p>;
  } else switch (r.skillKind) {
    case "slacker":
      body = (
        <button className="btn btn-pink btn-lg" type="button" disabled={hostOnly} onClick={() => state.skillOpt("slack")}>
          確定摸魚：這次免罰，下次 ×3
        </button>
      );
      break;
    case "pick_drink2":
      body = (
        <>
          <p className="hint">指定一人代你受罰（雙倍）。你下次 ×2</p>
          <TargetBtns list={others} onPick={state.skillTarget} />
        </>
      );
      break;
    case "boss_choice":
      body = (
        <>
          <button className="btn btn-pink" type="button" disabled={hostOnly} onClick={() => state.skillOpt("all")}>
            全場{state.punishLabel}（你免罰，下次 ×2）
          </button>
          <p className="hint">或指定一人 {punishPhrase(state.punishLabel, 2)}：</p>
          <TargetBtns list={others} onPick={state.skillTarget} />
        </>
      );
      break;
    case "intern_pass":
      body = (
        <>
          <p className="hint">把這次懲罰傳給誰？你下次 ×2</p>
          <TargetBtns list={others} onPick={state.skillTarget} />
        </>
      );
      break;
    case "treat":
      body = (
        <>
          <p className="hint">請客對象（你們各{state.punishLabel}）</p>
          <TargetBtns list={others} onPick={state.skillTarget} />
        </>
      );
      break;
    case "transfer":
      body = (
        <>
          <p className="hint">與誰對調角色，並由對方代罰？你下次 ×2</p>
          <TargetBtns list={others} onPick={state.skillTarget} />
        </>
      );
      break;
    case "tax":
      body = (
        <>
          <p className="hint">這次免罰。誰下次 ×2？（你自己下次也 ×2）</p>
          <TargetBtns list={others} onPick={state.skillTarget} />
        </>
      );
      break;
    case "deploy":
      body = (
        <>
          <p className="hint">這次免罰。誰下次免罰？（你下次 ×2）</p>
          <TargetBtns list={others} onPick={state.skillTarget} />
        </>
      );
      break;
    case "overtime":
      body = (
        <>
          <p className="hint">這次你罰兩次。下次被罰時，業務交接給誰（對方 ×3）？</p>
          <TargetBtns list={others} onPick={state.skillTarget} />
        </>
      );
      break;
    default:
      body = (
        <button className="btn" type="button" onClick={state.skipSkill}>
          完成
        </button>
      );
  }
  return (
    <Screen>
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">SKILL</span>
        <span className="tag-pill pink">本模式限一次</span>
      </div>
      {me ? <Portrait roleId={me.roleId} size={72} /> : null}
      <h1 className="graffiti-title" style={{ fontSize: "1.6rem" }}>
        {role?.skillName ?? "技能"}
      </h1>
      <p className="hint">{fillPunish(role?.skillDesc ?? "", state.punishLabel)}</p>
      <div className="skill-panel sticker">{body}</div>
      <div className="btn-row">
        <button className="btn btn-lime" type="button" disabled={hostOnly} onClick={state.skipSkill}>
          接受懲罰 · 不用技能
        </button>
      </div>
    </Screen>
  );
}

export function ResultScreen() {
  const msg = useGame((s) => s.skillMessage);
  const again = useGame((s) => s.again);
  const toModes = useGame((s) => s.toModes);
  const hostOnly = useGame((s) => s.isOnline && !s.isHost);
  return (
    <Screen>
      <DrinkHud />
      <div className="ceremony">
        <div className="reveal-name" style={{ fontSize: "1.6rem" }}>
          技能發動
        </div>
        <div className="sticker" style={{ width: "100%" }}>
          <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900, lineHeight: 1.5 }}>{msg}</p>
        </div>
      </div>
      <div className="btn-row">
        <button className="btn btn-lg" type="button" disabled={hostOnly} onClick={again}>
          再抽
        </button>
        <button className="btn btn-ghost" type="button" disabled={hostOnly} onClick={toModes}>
          換模式
        </button>
      </div>
    </Screen>
  );
}

function FlipOptionButton({
  i,
  cls,
  disabled,
  label,
  text,
  footer,
  onVote,
}: {
  i: 0 | 1;
  cls: string;
  disabled: boolean;
  label: string;
  text: string;
  footer: string;
  onVote: (choice: 0 | 1) => void;
}) {
  const press = usePress(() => {
    if (!disabled) onVote(i);
  });
  return (
    <button className={cls} type="button" disabled={disabled} {...press}>
      <span className="flip-inner">
        <span className="flip-back" style={{ backgroundImage: `url(${ART.cardBack})` }} />
        <span className="flip-front">
          <span className="flip-opt-label">{label}</span>
          <span className="flip-opt-text">{text}</span>
          <span className="flip-vote-n">{footer}</span>
        </span>
      </span>
    </button>
  );
}

export function FlipBattleScreen({
  onVote,
  onReady,
}: {
  onVote: (choice: 0 | 1) => void;
  onReady: () => void;
}) {
  const flip = useGame((s) => s.flip);
  const players = useGame((s) => s.players);
  const burstKey = useGame((s) => s.burstKey);
  const toModes = useGame((s) => s.toModes);
  const isOnline = useGame((s) => s.isOnline);
  const isHost = useGame((s) => s.isHost);
  const myPlayerId = useGame((s) => s.myPlayerId);
  const punishLabel = useGame((s) => s.punishLabel);
  const chaos = useGame((s) => s.chaos);
  const dragExtra = useGame((s) => s.dragExtra);
  const q = currentFlipQuestion({ flip } as GameState);
  const counts = flipVoteCounts({ players, flip } as GameState);
  const [dealt, setDealt] = useState(false);
  const flipIndex = flip?.index ?? 0;
  useEffect(() => {
    setDealt(false);
    const t = window.setTimeout(() => {
      setDealt(true);
      sfxFlip();
    }, 180);
    return () => window.clearTimeout(t);
  }, [flipIndex]);

  if (!flip || !q) {
    return (
      <Screen>
        <p className="hint">題庫載入中…</p>
        <button className="btn btn-ghost" type="button" disabled={isOnline && !isHost} onClick={toModes}>
          回模式
        </button>
      </Screen>
    );
  }

  const answerer = flip.answererId ? players.find((p) => p.id === flip.answererId) : null;
  const officialLabel = q.correct === 0 ? "A" : "B";
  const myVoted = myPlayerId ? myPlayerId in flip.votes : false;
  const practice = useGame((s) => s.practice);
  const canPick =
    flip.sub === "choose" &&
    (practice ? Boolean(myPlayerId) && !myVoted : isOnline ? !myVoted : isHost || !isOnline);
  const drinkers = flip.drinkerIds
    .map((id) => players.find((p) => p.id === id)?.name)
    .filter(Boolean)
    .join("、");

  return (
    <Screen>
      <DrinkHud />
      <div className="top-bar">
        <span className="tag-pill">FLIP</span>
        {flip.cat ? <span className="tag-pill pink">{flip.cat}</span> : <span className="tag-pill pink">混搭</span>}
        <span className="tag-pill">
          {flip.index + 1}/{flip.deck.length}
        </span>
      </div>
      <div className="flip-q sticker">
        <div className="flip-q-label">二選一</div>
        <p className="flip-q-text">{q.q}</p>
      </div>
      <p className="flip-ux-hint">
        {flip.sub === "choose"
          ? practice
            ? myVoted
              ? "已選 · 等電腦投票"
              : "選你的答案 · 電腦同步投票，少數派受罰"
            : isOnline
              ? myVoted
                ? "已選 · 等其他人"
                : "選你的答案 · 少數派受罰"
              : `輪到 ${answerer?.name ?? "下一位"} 選`
          : "揭曉少數派"}
      </p>
      <div className="flip-cards">
        {([0, 1] as const).map((i) => {
          let cls = "flip-card-3d";
          if (dealt) cls += " dealt";
          if (flip.sub === "result") {
            if (flip.majoritySide != null && !flip.tie) {
              cls += i === flip.majoritySide ? " is-majority" : " is-minority";
            }
            if (q.correct != null && q.correct === i) cls += " is-official";
          }
          const voteN = i === 0 ? counts.a : counts.b;
          return (
            <FlipOptionButton
              key={i}
              i={i}
              cls={cls}
              disabled={!canPick}
              label={i === 0 ? "A" : "B"}
              text={q.options[i]}
              footer={flip.sub === "result" ? `${voteN} 票` : "點我站邊"}
              onVote={onVote}
            />
          );
        })}
      </div>
      {flip.sub === "result" ? (
        <>
          <div className={`flip-result ${flip.tie ? "ok" : "bad"}`}>
            <div className="flip-result-title">{flip.tie ? "平手免罰" : "少數派受罰"}</div>
            <p className="hint" style={{ marginBottom: 0 }}>
              {flip.tie
                ? "兩邊同票，沒人受罰"
                : `${drinkers || "少數派"} · ${punishLabel}`}
              {q.correct != null ? ` · 官方 ${officialLabel}` : ""}
            </p>
          </div>
          {chaos?.drag && flip.sub === "result" && !flip.tie ? (
            <div className="king-grid" style={{ flex: "0 0 auto" }}>
              {players
                .filter((p) => !flip.drinkerIds.includes(p.id))
                .map((p) => (
                  <button key={p.id} type="button" className="king-seat" onClick={() => dragExtra(p.id)}>
                    <Portrait roleId={p.roleId} size={40} />
                    <strong>拖 {p.name}</strong>
                  </button>
                ))}
            </div>
          ) : null}
          <div className="ready-list">
            {players.map((p) => {
              const on = flip.readyIds.includes(p.id);
              return (
                <div className={`ready-chip ${on ? "on" : "off"}`} key={p.id}>
                  <strong>{p.name}</strong>
                  <span className="ready-label">{on ? "就緒" : "還沒"}</span>
                </div>
              );
            })}
          </div>
          <div className="btn-row inline">
            <button className="btn btn-lg" type="button" onClick={onReady}>
              下一題
            </button>
            <button className="btn btn-ghost" type="button" disabled={isOnline && !isHost} onClick={toModes}>
              換模式
            </button>
          </div>
        </>
      ) : (
        <div className="btn-row">
          <button className="btn btn-ghost" type="button" disabled={isOnline && !isHost} onClick={toModes}>
            換模式
          </button>
        </div>
      )}
      <SprayBurst burstKey={burstKey} />
    </Screen>
  );
}

export function JoinOverlay({ presetCode }: { presetCode?: string }) {
  const [name, setName] = useState("玩家");
  const [code, setCode] = useState(presetCode ?? "");
  const setOverlay = useGame((s) => s.setOverlay);
  const beginJoin = useGame((s) => s.beginJoin);
  const setNotice = useGame((s) => s.setNotice);
  const notice = useGame((s) => s.notice);

  if (!hasSignaling()) {
    return <OnlineFallback joining presetCode={presetCode} />;
  }

  return (
    <Screen>
      <div className="top-bar">
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => setOverlay(null)} aria-label="返回">
          <ChevronLeft size={18} />
        </button>
        <span className="tag-pill">JOIN</span>
      </div>
      <h1 className="graffiti-title" style={{ fontSize: "2rem" }}>
        加入房間
      </h1>
      <label className="field" htmlFor="join-name">
        暱稱
      </label>
      <input id="join-name" maxLength={12} value={name} onChange={(e) => setName(e.target.value)} />
      <label className="field" htmlFor="join-code">
        房間碼
      </label>
      <input
        id="join-code"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="ABCD"
        autoCapitalize="characters"
      />
      {notice ? <div className="error-banner">{notice}</div> : null}
      <div className="btn-row">
        <button
          className="btn btn-lg"
          type="button"
          onClick={() => {
            const res = beginJoin(name, code);
            if ("error" in res) setNotice(res.error);
          }}
        >
          進房
        </button>
      </div>
    </Screen>
  );
}

function OnlineFallback({ joining, presetCode }: { joining: boolean; presetCode?: string }) {
  const [room, setRoom] = useState(
    () => presetCode || (typeof location !== "undefined" ? new URLSearchParams(location.search).get("room") || "" : ""),
  );
  const setOverlay = useGame((s) => s.setOverlay);
  const startSolo = useGame((s) => s.startSolo);
  return (
    <Screen>
      <div className="top-bar">
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => setOverlay(null)} aria-label="返回">
          <ChevronLeft size={18} />
        </button>
        <span className="tag-pill">{joining ? "JOIN" : "HOST"}</span>
      </div>
      <h1 className="graffiti-title" style={{ fontSize: "2rem" }}>
        {joining ? "加入連線版" : "前往連線版開房"}
      </h1>
      <p className="hint">
        此網站提供單機練習。GitHub Pages 沒有連線後端，多人遊戲請在 Grok 預覽裡開房，或在 config.js 設定自己的 signaling 服務。
      </p>
      <label className="field" htmlFor="online-room">
        房號（加入房間時填寫）
      </label>
      <input
        id="online-room"
        maxLength={6}
        value={room}
        autoCapitalize="characters"
        onChange={(e) => setRoom(e.target.value.toUpperCase())}
        placeholder="ABCD"
      />
      <div className="btn-row">
        <button
          className="btn btn-lg"
          type="button"
          onClick={() => {
            setOverlay(null);
            startSolo();
          }}
        >
          留在這裡單機練習
        </button>
      </div>
    </Screen>
  );
}

export function HostNameOverlay() {
  const [name, setName] = useState("房主");
  const setOverlay = useGame((s) => s.setOverlay);
  const beginHost = useGame((s) => s.beginHost);
  if (!hasSignaling()) {
    return <OnlineFallback joining={false} />;
  }
  return (
    <Screen>
      <div className="top-bar">
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => setOverlay(null)} aria-label="返回">
          <ChevronLeft size={18} />
        </button>
        <span className="tag-pill">HOST</span>
      </div>
      <h1 className="graffiti-title" style={{ fontSize: "2rem" }}>
        開房間
      </h1>
      <p className="hint">開房後把 4 碼房間碼傳給同事。房主是抽籤權威。</p>
      <label className="field" htmlFor="host-name">
        你的暱稱
      </label>
      <input id="host-name" maxLength={12} value={name} onChange={(e) => setName(e.target.value)} />
      <div className="btn-row">
        <button className="btn btn-lg" type="button" onClick={() => beginHost(name)}>
          開房
        </button>
      </div>
    </Screen>
  );
}
