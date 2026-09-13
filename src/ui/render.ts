import { ROLES, getRole } from '../game/roles'
import type { GameState, Player } from '../game/state'
import { currentFlipQuestion, flipVoteCounts, roleOf } from '../game/state'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function shell(inner: string): string {
  return `<div class="wall-bg" aria-hidden="true"></div>${inner}`
}

export function homeView(): string {
  return shell(`
    <div class="screen" data-screen="home">
      <div class="top-bar">
        <span class="tag-pill">STREET DRAW</span>
        <span class="tag-pill" style="transform:rotate(3deg);border-color:var(--spray-pink);color:var(--spray-pink)">18+</span>
      </div>
      <h1 class="graffiti-title">公司酒局</h1>
      <div class="graffiti-sub">OFFICE DRINK DRAW</div>
      <div class="street-row" aria-hidden="true">🧢 🎤 🎧 💥 🏙️</div>
      <div class="sticker">
        <p style="margin:0;font-weight:800;line-height:1.5">
          美式嘻哈街頭塗鴉風 · 上班族抽籤喝酒<br/>
          <span style="color:var(--spray-cyan)">儀式感大揭示 · 角色技能 · 少數方喝 · 可單機 / 可開房</span>
        </p>
      </div>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="solo">🎮 單機開打</button>
        <button class="btn btn-cyan btn-lg" data-action="host">📡 開房間（連線）</button>
        <button class="btn btn-pink" data-action="join">🔑 加入房間</button>
        <button class="btn btn-ghost" data-action="roles-preview">👀 看角色技能</button>
      </div>
      <p class="footer-note">請理性飲酒 · 未成年勿玩</p>
    </div>
  `)
}

export function setupView(names: string[], online: boolean): string {
  const chips = names
    .map(
      (n, i) => `
      <div class="player-chip">
        <span class="num">${i + 1}</span>
        <input data-name-idx="${i}" value="${esc(n)}" maxlength="12" aria-label="玩家${i + 1}" />
        <button class="chip-btn" data-action="remove-player" data-idx="${i}" ${names.length <= 2 ? 'disabled' : ''} type="button">✕</button>
      </div>`,
    )
    .join('')
  return shell(`
    <div class="screen" data-screen="setup">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">${online ? 'ONLINE SETUP' : 'SOLO SETUP'}</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">組隊</h1>
      <p class="hint">2–12 人。每個人會拿到一個街頭辦公室角色。</p>
      <div class="player-list">${chips}</div>
      <button class="btn btn-lime" data-action="add-player" ${names.length >= 12 ? 'disabled' : ''} type="button">＋ 加一位</button>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="confirm-setup" type="button">🔥 鎖定陣容</button>
      </div>
    </div>
  `)
}

export function lobbyView(
  state: GameState,
  roster: { id: string; name: string; connected: boolean }[],
  wsStatus: string,
): string {
  const list =
    roster.length > 0
      ? roster
          .map(
            (p) => `
        <div class="player-chip">
          <span class="status-dot ${p.connected ? 'on' : 'off'}"></span>
          <strong>${esc(p.name)}</strong>
          ${p.id === state.myPlayerId ? '<span class="tag-pill" style="font-size:0.6rem">YOU</span>' : ''}
        </div>`,
          )
          .join('')
      : state.players
          .map(
            (p) => `
        <div class="player-chip"><span class="num">★</span><strong>${esc(p.name)}</strong></div>`,
          )
          .join('')

  return shell(`
    <div class="screen" data-screen="lobby">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        ${state.roomCode ? `<span class="room-badge">${esc(state.roomCode)}</span>` : ''}
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">房間</h1>
      <p class="hint">
        <span class="status-dot ${wsStatus === 'open' ? 'on' : 'off'}"></span>
        連線：${esc(wsStatus)} · 房主為抽籤權威
      </p>
      <div class="sticker">
        <p style="margin:0;font-weight:800">把房間碼或網址分給同事加入。</p>
        <p class="hint" style="margin-bottom:0">網址可帶 <code>?room=${esc(state.roomCode ?? '')}</code></p>
      </div>
      <div class="player-list" style="margin-top:12px">${list}</div>
      <div class="btn-row">
        ${
          state.isHost
            ? `<button class="btn btn-lg" data-action="start-online" type="button">🎤 開始發角色</button>`
            : `<p class="hint">等待房主開始…</p>`
        }
      </div>
    </div>
  `)
}

export function rolesView(players: Player[]): string {
  const cards = players
    .map((p) => {
      const r = roleOf(p)
      return `
        <div class="role-card" style="box-shadow:4px 4px 0 ${r.color}">
          <span class="drip" style="background:${r.color}"></span>
          <span class="emoji">${r.emoji}</span>
          <div class="name">${esc(p.name)}</div>
          <div class="tag">${esc(r.tag)} · ${esc(r.name)}</div>
          <div class="skill"><strong style="color:${r.color}">${esc(r.skillName)}</strong><br/>${esc(r.skillDesc)}<br/><span style="color:var(--spray-lime)">${esc(r.drink)}</span></div>
        </div>`
    })
    .join('')
  return shell(`
    <div class="screen" data-screen="roles">
      <div class="top-bar">
        <span class="tag-pill">CREW</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">角色卡</h1>
      <p class="hint">記住自己的技能。準備上牆噴漆揭示！</p>
      <div class="role-grid">${cards}</div>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="to-modes" type="button">👉 選模式</button>
      </div>
    </div>
  `)
}

export function rolesPreviewView(): string {
  const cards = ROLES.map(
    (r) => `
    <div class="role-card" style="box-shadow:4px 4px 0 ${r.color}">
      <span class="drip" style="background:${r.color}"></span>
      <span class="emoji">${r.emoji}</span>
      <div class="name">${esc(r.name)}</div>
      <div class="tag">${esc(r.tag)}</div>
      <div class="skill"><strong style="color:${r.color}">${esc(r.skillName)}</strong><br/>${esc(r.skillDesc)}<br/><span style="color:var(--spray-lime)">${esc(r.drink)}</span></div>
    </div>`,
  ).join('')
  return shell(`
    <div class="screen" data-screen="roles-preview">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">ROSTER</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">全角色</h1>
      <div class="role-grid">${cards}</div>
    </div>
  `)
}

export function modesView(state: GameState): string {
  const hostOnly = state.isOnline && !state.isHost
  return shell(`
    <div class="screen" data-screen="modes">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="back-roles" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        ${state.roomCode ? `<span class="room-badge">${esc(state.roomCode)}</span>` : '<span class="tag-pill">MODE</span>'}
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">選模式</h1>
      ${hostOnly ? `<p class="hint">只有房主可以抽籤，你會同步看到結果。</p>` : ''}
      <div class="mode-grid">
        <button class="mode-card" data-action="mode" data-mode="draw_one" ${hostOnly ? 'disabled' : ''} type="button">
          <div class="m-title">🎲 抽一位喝酒</div>
          <div class="m-desc">Seed 公平亂數 · 街頭儀式大揭示 · 可發動技能</div>
        </button>
        <button class="mode-card" data-action="mode" data-mode="drink_order" ${hostOnly ? 'disabled' : ''} type="button">
          <div class="m-title">📜 喝杯順序</div>
          <div class="m-desc">洗牌排出誰先乾，誰壓軸</div>
        </button>
        <button class="mode-card" data-action="mode" data-mode="team_toast" ${hostOnly ? 'disabled' : ''} type="button">
          <div class="m-title">🤜 分隊乾杯</div>
          <div class="m-desc">隨機兩隊 · 對幹乾杯</div>
        </button>
        <button class="mode-card" data-action="mode" data-mode="flip_battle" ${hostOnly ? 'disabled' : ''} type="button">
          <div class="m-title">🃏 翻牌對戰</div>
          <div class="m-desc">時事梗／無厘頭 · 選項即開 · 少數方喝</div>
        </button>
      </div>
    </div>
  `)
}

export function drawingView(step: number): string {
  const lines = ['搖罐中…', '噴漆上牆…', '揭開標籤！']
  return shell(`
    <div class="screen" data-screen="drawing">
      <div class="ceremony">
        <div class="boombox">🎧</div>
        <div class="graffiti-title" style="font-size:1.8rem">${lines[Math.min(step, lines.length - 1)]}</div>
        <p class="hint">街頭儀式進行中</p>
      </div>
      <div class="spray-burst" id="spray-burst"></div>
    </div>
  `)
}

export function revealView(state: GameState): string {
  const r = state.lastResult
  if (!r) return modesView(state)
  const player = state.players.find((p) => p.id === r.playerId)
  const role = player ? getRole(player.roleId) : null

  if (r.mode === 'drink_order' && r.order) {
    const items = r.order
      .map((id, i) => {
        const p = state.players.find((x) => x.id === id)!
        return `<li style="animation-delay:${i * 0.08}s">${i + 1}. ${esc(p.name)} <span style="color:var(--muted)">（${esc(getRole(p.roleId).name)}）</span></li>`
      })
      .join('')
    return shell(`
      <div class="screen" data-screen="reveal">
        <div class="ceremony" style="justify-content:flex-start;padding-top:24px">
          <div class="reveal-name">順序出爐</div>
          <ul class="order-list" style="padding:0;width:100%">${items}</ul>
        </div>
        <div class="btn-row">
          <button class="btn btn-lg" data-action="again" type="button">再來一輪</button>
          <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
        </div>
      </div>
    `)
  }

  if (r.mode === 'team_toast' && r.teams) {
    const teams = r.teams
      .map(
        (t) => `
      <div class="team">
        <h3>${esc(t.name)}</h3>
        <div>${t.members.map((m) => esc(m)).join(' · ')}</div>
      </div>`,
      )
      .join('')
    return shell(`
      <div class="screen" data-screen="reveal">
        <div class="ceremony" style="justify-content:flex-start;padding-top:24px">
          <div class="reveal-name">分隊乾杯</div>
          <div class="team-box">${teams}</div>
          <div class="reveal-drink">兩隊互敬 · 乾！</div>
        </div>
        <div class="btn-row">
          <button class="btn btn-lg" data-action="again" type="button">再分一次</button>
          <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
        </div>
      </div>
    `)
  }

  // draw_one
  const canSkill = r.skillKind !== 'none' && state.skillPending
  return shell(`
    <div class="screen" data-screen="reveal">
      <div class="ceremony">
        <div class="tag-pill" style="transform:rotate(-6deg)">HIT!</div>
        <div class="reveal-name shake">${esc(player?.name ?? '?')}</div>
        <div style="font-size:2.5rem">${role?.emoji ?? '💥'}</div>
        <div class="graffiti-sub">${esc(role?.name ?? '')} · ${esc(role?.tag ?? '')}</div>
        <div class="reveal-drink">${esc(r.drinkHint)}</div>
        ${
          role && role.skillKind !== 'none'
            ? `<div class="sticker" style="width:100%;margin-top:8px">
                <strong style="color:var(--spray-pink)">${esc(role.skillName)}</strong>
                <p class="hint" style="margin:4px 0 0">${esc(role.skillDesc)}</p>
              </div>`
            : ''
        }
      </div>
      <div class="btn-row">
        ${
          canSkill
            ? `<button class="btn btn-pink btn-lg" data-action="use-skill" type="button">⚡ 發動技能</button>
               <button class="btn btn-lime" data-action="skip-skill" type="button">直接喝 · 跳過技能</button>`
            : `<button class="btn btn-lg" data-action="again" type="button">🎲 再抽一次</button>
               <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>`
        }
      </div>
      <div class="spray-burst" id="spray-burst"></div>
    </div>
  `)
}

export function skillView(state: GameState): string {
  const r = state.lastResult
  if (!r) return modesView(state)
  const me = state.players.find((p) => p.id === r.playerId)
  const role = me ? getRole(me.roleId) : null
  const others = state.players.filter((p) => p.id !== r.playerId)
  const workers = state.players.filter((p) => p.roleId === 'worker' && p.id !== r.playerId)

  const targetBtns = (list: Player[], action: string) =>
    list
      .map(
        (p) =>
          `<button class="chip-btn" data-action="${action}" data-target="${p.id}" type="button">${esc(p.name)}</button>`,
      )
      .join('') || `<p class="hint">沒有可選對象</p>`

  let body = ''
  switch (r.skillKind) {
    case 'pick_drink2':
      body = `<p class="hint">指定一位「上班族」喝 2</p><div class="targets">${targetBtns(workers.length ? workers : others, 'skill-target')}</div>`
      break
    case 'boss_choice':
      body = `
        <button class="btn btn-pink" data-action="skill-opt" data-opt="all" type="button">全場喝 1</button>
        <p class="hint">或指定一人喝 2：</p>
        <div class="targets">${targetBtns(others, 'skill-target')}</div>`
      break
    case 'intern_pass':
      body = me?.hasPass === false
        ? `<p class="error-banner">救命已用完</p>`
        : `<p class="hint">把這次喝酒傳給誰？</p><div class="targets">${targetBtns(others, 'skill-target')}</div>`
      break
    case 'treat':
      body = `<p class="hint">請客對象（各喝 1）</p><div class="targets">${targetBtns(others, 'skill-target')}</div>`
      break
    case 'transfer':
      body = `
        <button class="btn btn-cyan" data-action="skill-opt" data-opt="redraw" type="button">全體重抽角色</button>
        <p class="hint">或與一人互換：</p>
        <div class="targets">${targetBtns(others, 'skill-target')}</div>`
      break
    case 'tax':
      body = `<p class="hint">誰多喝 1？（你改半杯）</p><div class="targets">${targetBtns(others, 'skill-target')}</div>`
      break
    case 'deploy':
      body = `
        <p class="hint">可指定一人下輪免抽（也可跳過）</p>
        <div class="targets">${targetBtns(others, 'skill-target')}</div>
        <button class="btn btn-lime" data-action="skill-opt" data-opt="selfonly" type="button">只自己喝 1</button>`
      break
    case 'overtime':
      body = `<button class="btn btn-pink btn-lg" data-action="skill-opt" data-opt="ot" type="button">確認加班：喝 2，下輪免抽</button>`
      break
    default:
      body = `<button class="btn" data-action="skip-skill" type="button">完成</button>`
  }

  return shell(`
    <div class="screen" data-screen="skill">
      <div class="top-bar">
        <span class="tag-pill">SKILL</span>
      </div>
      <h1 class="graffiti-title" style="font-size:1.8rem">${esc(role?.skillName ?? '技能')}</h1>
      <div class="skill-panel sticker">
        ${body}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" data-action="skip-skill" type="button">取消技能</button>
      </div>
    </div>
  `)
}

export function resultBanner(msg: string): string {
  return shell(`
    <div class="screen" data-screen="result">
      <div class="ceremony">
        <div class="reveal-name" style="font-size:1.6rem">技能發動</div>
        <div class="sticker" style="width:100%">
          <p style="margin:0;font-size:1.2rem;font-weight:900;line-height:1.5">${esc(msg)}</p>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="again" type="button">🎲 再抽</button>
        <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
      </div>
    </div>
  `)
}


export function flipBattleView(state: GameState): string {
  const flip = state.flip
  const q = currentFlipQuestion(state)
  if (!flip || !q) {
    return shell(`
      <div class="screen" data-screen="flip">
        <p class="hint">題庫載入中…</p>
        <button class="btn btn-ghost" data-action="to-modes" type="button">回模式</button>
      </div>
    `)
  }

  const answerer = flip.answererId
    ? state.players.find((p) => p.id === flip.answererId)
    : null
  const hostOnly = state.isOnline && !state.isHost
  const canAct = !hostOnly
  const n = flip.index + 1
  const total = flip.deck.length
  const counts = flipVoteCounts(state)
  const officialLabel = q.correct === 0 ? 'A' : 'B'
  const officialText = q.options[q.correct]

  // FLIP-004：選項一開始就亮；票數／少數標籤只在 result 揭曉
  const cards = [0, 1]
    .map((i) => {
      const opt = q.options[i as 0 | 1]
      let cls = 'flip-card face-up'
      if (flip.sub === 'result') {
        if (flip.majoritySide != null && !flip.tie) {
          if (i === flip.majoritySide) cls += ' is-majority'
          else cls += ' is-minority'
        }
        if (q.correct === i) cls += ' is-official'
      }
      const disabled =
        !canAct || flip.sub !== 'choose' ? 'disabled' : ''
      const voteN = i === 0 ? counts.a : counts.b
      const voteHint =
        flip.sub === 'result'
          ? `<span class="flip-vote-n">${voteN} 票</span>`
          : `<span class="flip-vote-n muted">選項已公開</span>`
      return `
        <button class="${cls}" data-action="flip-pick" data-choice="${i}" ${disabled} type="button">
          <div class="flip-card-inner">
            <div class="flip-face flip-front">
              <span class="flip-opt-label">${i === 0 ? 'A' : 'B'}</span>
              <span class="flip-opt-text">${esc(opt)}</span>
              ${voteHint}
            </div>
          </div>
        </button>`
    })
    .join('')

  let chooseProgress = ''
  if (flip.sub === 'choose') {
    const voteChips = state.players
      .map((p) => {
        const done = p.id in flip.votes
        const turn = flip.answererId === p.id
        return `<div class="ready-chip ${done ? 'on' : turn ? 'turn' : 'off'}">
          <span class="status-dot ${done ? 'on' : 'off'}"></span>
          <strong>${esc(p.name)}</strong>
          <span class="ready-label">${done ? '已選' : turn ? '輪到選' : '還沒選'}</span>
        </div>`
      })
      .join('')
    chooseProgress = `
      <div class="sticker flip-ready-box" style="width:100%;margin-top:8px">
        <p style="margin:0 0 8px;font-weight:900">選邊進度（收齊才結算）</p>
        <div class="ready-list">${voteChips}</div>
        ${
          answerer
            ? `<p class="hint" style="margin:10px 0 0">傳手機給 <strong style="color:var(--spray-pink)">${esc(answerer.name)}</strong> 選 A 或 B</p>`
            : ''
        }
        <p class="hint" style="margin-bottom:0">規則：跟大家不一樣的<strong>少數方</strong>喝；平手免喝。</p>
      </div>`
  }

  let resultBlock = ''
  if (flip.sub === 'result') {
    const drinkNames = flip.drinkerIds
      .map((id) => state.players.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .map((n) => esc(n!))
    if (flip.tie) {
      resultBlock = `<div class="flip-result ok">
           <div class="flip-result-title">平手免喝！</div>
           <p class="hint" style="margin:0">A ${counts.a} ： B ${counts.b} · 少數不成立，這輪放過</p>
         </div>`
    } else if (drinkNames.length === 0) {
      resultBlock = `<div class="flip-result ok">
           <div class="flip-result-title">全場同邊！</div>
           <p class="hint" style="margin:0">沒有少數方 · 全員免喝 🍻</p>
         </div>`
    } else {
      resultBlock = `<div class="flip-result bad">
           <div class="flip-result-title">少數方喝！</div>
           <p class="hint" style="margin:0">${drinkNames.join('、')} · 跟大家不一樣 · 乾一口 🍻</p>
           <p class="hint" style="margin:6px 0 0">票數 A ${counts.a} ： B ${counts.b}</p>
         </div>`
    }

    resultBlock += `
      <div class="flip-official sticker" style="width:100%;margin-top:8px">
        <div class="flip-q-label">官方答案（趣味｜不決定誰喝）</div>
        <p style="margin:4px 0 0;font-weight:800">${officialLabel}. ${esc(officialText)}</p>
      </div>`

    const readySet = new Set(flip.readyIds)
    const readyList = state.players
      .map((p) => {
        const done = readySet.has(p.id)
        return `<div class="ready-chip ${done ? 'on' : 'off'}">
          <span class="status-dot ${done ? 'on' : 'off'}"></span>
          <strong>${esc(p.name)}</strong>
          <span class="ready-label">${done ? '已就緒' : '還沒按'}</span>
          ${
            canAct && !done
              ? `<button class="chip-btn alt" data-action="flip-ready" data-player="${p.id}" type="button">下一題 ✓</button>`
              : ''
          }
        </div>`
      })
      .join('')

    resultBlock += `
      <div class="sticker flip-ready-box" style="width:100%;margin-top:8px">
        <p style="margin:0 0 8px;font-weight:900">下一題就緒狀況</p>
        <div class="ready-list">${readyList}</div>
        ${
          canAct
            ? `<button class="btn btn-lg" style="margin-top:12px" data-action="flip-ready-all" type="button">下一題</button>
               <p class="hint" style="margin-bottom:0">傳手機：每人按一次「下一題」；名單會顯示誰好了／誰還沒。全到齊自動進下一題。</p>`
            : `<p class="hint" style="margin-bottom:0">等待房主／大家按下一題…</p>`
        }
      </div>`
  }

  return shell(`
    <div class="screen" data-screen="flip">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="to-modes" style="width:auto;min-height:40px;padding:8px 12px" type="button">←</button>
        <span class="tag-pill">FLIP ${n}/${total}</span>
      </div>
      <div class="flip-q sticker">
        <div class="flip-q-label">牆上口號</div>
        <p class="flip-q-text">${esc(q.q)}</p>
      </div>
      <p class="hint flip-ux-hint">兩選項已公開 · 全員選完才揭曉少數方誰喝</p>
      <div class="flip-cards revealed">${cards}</div>
      ${chooseProgress}
      ${resultBlock}
      <div class="spray-burst" id="spray-burst"></div>
      <p class="footer-note">少數方喝 · 平手免喝 · 請理性飲酒</p>
    </div>
  `)
}

export function joinView(): string {
  return shell(`
    <div class="screen" data-screen="join">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">JOIN</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">加入</h1>
      <label class="field">你的暱稱</label>
      <input id="join-name" maxlength="12" placeholder="例如：小明" />
      <label class="field">房間碼</label>
      <input id="join-code" maxlength="4" placeholder="ABCD" style="text-transform:uppercase;letter-spacing:0.3em;font-size:1.4rem;text-align:center" />
      <div class="btn-row">
        <button class="btn btn-lg btn-cyan" data-action="do-join" type="button">進房</button>
      </div>
      <p class="hint">需房主已執行 <strong>npm run server</strong>，且你的裝置能連到同一個 WS 位址。</p>
    </div>
  `)
}

export function hostNameView(): string {
  return shell(`
    <div class="screen" data-screen="host-name">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">HOST</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">開房</h1>
      <label class="field">房主暱稱</label>
      <input id="host-name" maxlength="12" placeholder="例如：阿豪" />
      <div class="btn-row">
        <button class="btn btn-lg" data-action="do-host" type="button">建立房間</button>
      </div>
      <p class="hint">請先在電腦執行 <strong>npm run server</strong>（預設 ws://該機:8787）。手機連同一 Wi‑Fi，並用 <strong>VITE_WS_URL</strong> 指向該位址。</p>
    </div>
  `)
}
