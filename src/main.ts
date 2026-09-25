import './styles.css'
import {
  applySkill,
  createInitialState,
  drawOne,
  drawOrder,
  drawTeams,
  flipAdvance,
  flipAllReady,
  flipMarkReady,
  flipPick,
  makeLocalPlayers,
  startFlipBattle,
  type GameMode,
  type GameState,
} from './game/state'
import { newSeed } from './game/rng'
import { RoomClient } from './multiplayer/client'
import { applySync, toSync } from './multiplayer/protocol'
import * as UI from './ui/render'

const app = document.querySelector<HTMLDivElement>('#app')!
const state: GameState = createInitialState()

let setupNames = ['玩家1', '玩家2', '玩家3', '玩家4']
let wsStatus: 'connecting' | 'open' | 'closed' | 'error' | 'idle' = 'idle'
let roster: { id: string; name: string; connected: boolean }[] = []
let skillMessage = ''
let ceremonyTimer: number | null = null
let flipTimer: number | null = null
let pendingMode: GameMode | null = null
let uiOverlay: 'join' | 'host-name' | 'roles-preview' | null = null

const room = new RoomClient({
  onStatus: (s) => {
    wsStatus = s
    if (state.phase === 'lobby') render()
  },
  onCreated: (code, playerId) => {
    state.roomCode = code
    state.myPlayerId = playerId
    state.isHost = true
    state.isOnline = true
    state.phase = 'lobby'
    updateUrlRoom(code)
    render()
  },
  onJoined: (code, playerId, isHost) => {
    state.roomCode = code
    state.myPlayerId = playerId
    state.isHost = isHost
    state.isOnline = true
    state.phase = 'lobby'
    updateUrlRoom(code)
    render()
  },
  onRoster: (players) => {
    roster = players
    if (state.isHost && state.phase === 'lobby') {
      // keep lobby names for when host starts
    }
    render()
  },
  onState: (sync) => {
    if (state.isHost) return
    applySync(state, sync)
    render()
    if (state.phase === 'reveal') burstSpray()
  },
  onError: (message) => {
    alert(message)
  },
})

function updateUrlRoom(code: string | null) {
  const url = new URL(location.href)
  if (code) url.searchParams.set('room', code)
  else url.searchParams.delete('room')
  history.replaceState(null, '', url.toString())
}

function broadcast() {
  if (state.isOnline && state.isHost && room.connected) {
    room.sync(toSync(state))
  }
}

function render() {
  let html = ''
  switch (state.phase) {
    case 'home':
      html = UI.homeView()
      break
    case 'setup':
      html = UI.setupView(setupNames, state.isOnline)
      break
    case 'lobby':
      html = UI.lobbyView(state, roster, wsStatus)
      break
    case 'roles':
      html = UI.rolesView(state.players)
      break
    case 'mode_select':
      html = UI.modesView(state)
      break
    case 'drawing':
      html = UI.drawingView(state.ceremonyStep)
      break
    case 'reveal':
      html = UI.revealView(state)
      break
    case 'skill':
      html = UI.skillView(state)
      break
    case 'result':
      html = UI.resultBanner(skillMessage)
      break
    case 'flip_battle':
      html = UI.flipBattleView(state)
      break
    default:
      html = UI.homeView()
  }
  if (uiOverlay === 'join') html = UI.joinView()
  if (uiOverlay === 'host-name') html = UI.hostNameView()
  if (uiOverlay === 'roles-preview') html = UI.rolesPreviewView()

  app.innerHTML = html
}

function setUi(ui: typeof uiOverlay) {
  uiOverlay = ui
}

function clearFlipTimer() {
  if (flipTimer != null) {
    window.clearInterval(flipTimer)
    flipTimer = null
  }
}

function beginFlipBattle() {
  if (state.isOnline && !state.isHost) return
  clearFlipTimer()
  if (ceremonyTimer != null) {
    window.clearInterval(ceremonyTimer)
    ceremonyTimer = null
  }
  startFlipBattle(state)
  broadcast()
  render()
  burstSpray()
}

function advanceFlipRound() {
  if (state.isOnline && !state.isHost) return
  flipAdvance(state)
  broadcast()
  render()
  burstSpray()
}

function startCeremony(mode: GameMode) {
  if (state.isOnline && !state.isHost) return
  pendingMode = mode
  state.mode = mode
  state.phase = 'drawing'
  state.ceremonyStep = 0
  state.skillPending = false
  broadcast()
  render()
  burstSpray()

  if (ceremonyTimer != null) window.clearInterval(ceremonyTimer)
  ceremonyTimer = window.setInterval(() => {
    state.ceremonyStep += 1
    if (state.ceremonyStep >= 3) {
      if (ceremonyTimer != null) window.clearInterval(ceremonyTimer)
      ceremonyTimer = null
      finishDraw()
    } else {
      broadcast()
      render()
      burstSpray()
    }
  }, 700)
}

function finishDraw() {
  const mode = pendingMode ?? state.mode
  if (!mode || mode === 'flip_battle') return
  let result
  if (mode === 'draw_one') result = drawOne(state)
  else if (mode === 'drink_order') result = drawOrder(state)
  else result = drawTeams(state)

  state.lastResult = result
  state.drawCount += 1
  state.phase = 'reveal'
  state.skillPending = mode === 'draw_one' && result.skillKind !== 'none'
  broadcast()
  render()
  burstSpray()
}

function burstSpray() {
  const root = document.getElementById('spray-burst')
  if (!root) return
  const icons = ['💥', '✨', '🔥', '🧢', '🎤', '⭐', '💧', '🎨']
  for (let i = 0; i < 14; i++) {
    const span = document.createElement('span')
    span.textContent = icons[i % icons.length]!
    const x = 10 + Math.random() * 80
    const y = 20 + Math.random() * 50
    span.style.left = `${x}%`
    span.style.top = `${y}%`
    span.style.setProperty('--dx', `${(Math.random() - 0.5) * 160}px`)
    span.style.setProperty('--dy', `${-80 - Math.random() * 120}px`)
    span.style.setProperty('--rot', `${(Math.random() - 0.5) * 120}deg`)
    span.style.animationDelay = `${Math.random() * 0.2}s`
    root.appendChild(span)
    window.setTimeout(() => span.remove(), 1200)
  }
}

app.addEventListener('click', (ev) => {
  const t = (ev.target as HTMLElement).closest('[data-action]') as HTMLElement | null
  if (!t) return
  const action = t.dataset.action
  if (!action) return

  switch (action) {
    case 'home':
      setUi(null)
      clearFlipTimer()
      state.phase = 'home'
      state.flip = null
      state.isOnline = false
      state.roomCode = null
      room.disconnect()
      updateUrlRoom(null)
      render()
      break
    case 'solo':
      setUi(null)
      state.isOnline = false
      state.isHost = true
      state.phase = 'setup'
      render()
      break
    case 'host':
      setUi('host-name')
      render()
      break
    case 'join':
      setUi('join')
      render()
      break
    case 'roles-preview':
      setUi('roles-preview')
      render()
      break
    case 'do-host': {
      const name = (document.getElementById('host-name') as HTMLInputElement)?.value.trim() || '房主'
      setUi(null)
      room.create(name)
      state.phase = 'lobby'
      render()
      break
    }
    case 'do-join': {
      const name = (document.getElementById('join-name') as HTMLInputElement)?.value.trim() || '玩家'
      const code = (document.getElementById('join-code') as HTMLInputElement)?.value.trim().toUpperCase()
      if (!code || code.length < 4) {
        alert('請輸入 4 碼房間碼')
        return
      }
      setUi(null)
      room.join(code, name)
      state.phase = 'lobby'
      render()
      break
    }
    case 'add-player':
      if (setupNames.length < 12) {
        setupNames.push(`玩家${setupNames.length + 1}`)
        render()
      }
      break
    case 'remove-player': {
      const idx = Number(t.dataset.idx)
      if (setupNames.length > 2) {
        setupNames.splice(idx, 1)
        render()
      }
      break
    }
    case 'confirm-setup': {
      const inputs = app.querySelectorAll<HTMLInputElement>('[data-name-idx]')
      inputs.forEach((inp) => {
        const i = Number(inp.dataset.nameIdx)
        setupNames[i] = inp.value.trim() || `玩家${i + 1}`
      })
      state.seed = newSeed()
      state.players = makeLocalPlayers(setupNames, state.seed)
      state.drawCount = 0
      state.lastResult = null
      state.phase = 'roles'
      broadcast()
      render()
      break
    }
    case 'start-online': {
      if (!state.isHost) return
      const names = roster.map((p) => p.name)
      if (names.length < 2) {
        alert('至少需要 2 人')
        return
      }
      state.seed = newSeed()
      state.players = makeLocalPlayers(names, state.seed)
      state.players.forEach((p, i) => {
        const r = roster[i]
        if (r) {
          p.id = r.id
          p.name = r.name
        }
      })
      state.myPlayerId = state.myPlayerId
      state.drawCount = 0
      state.lastResult = null
      state.phase = 'roles'
      broadcast()
      render()
      break
    }
    case 'to-modes':
      setUi(null)
      clearFlipTimer()
      state.phase = 'mode_select'
      state.skillPending = false
      state.flip = null
      broadcast()
      render()
      break
    case 'back-roles':
      state.phase = 'roles'
      broadcast()
      render()
      break
    case 'mode': {
      const mode = t.dataset.mode as GameMode
      if (mode === 'flip_battle') {
        beginFlipBattle()
      } else {
        startCeremony(mode)
      }
      break
    }
    case 'flip-pick': {
      if (state.isOnline && !state.isHost) return
      const choice = Number(t.dataset.choice) as 0 | 1
      if (choice !== 0 && choice !== 1) return
      flipPick(state, choice)
      broadcast()
      render()
      burstSpray()
      break
    }
    case 'flip-ready': {
      if (state.isOnline && !state.isHost) return
      const pid = t.dataset.player
      if (!pid) return
      flipMarkReady(state, pid)
      broadcast()
      render()
      if (flipAllReady(state)) {
        window.setTimeout(() => {
          if (!flipAllReady(state)) return
          advanceFlipRound()
        }, 350)
      }
      break
    }
    case 'flip-ready-all': {
      if (state.isOnline && !state.isHost) return
      if (state.isOnline && state.myPlayerId) {
        flipMarkReady(state, state.myPlayerId)
      } else {
        const next = state.players.find((p) => !state.flip!.readyIds.includes(p.id))
        if (next) flipMarkReady(state, next.id)
      }
      broadcast()
      render()
      if (flipAllReady(state)) {
        window.setTimeout(() => advanceFlipRound(), 350)
      }
      break
    }
    case 'again':
      if (state.mode === 'flip_battle') beginFlipBattle()
      else if (state.mode) startCeremony(state.mode)
      break
    case 'use-skill':
      state.phase = 'skill'
      broadcast()
      render()
      break
    case 'skip-skill':
      state.skillPending = false
      state.phase = 'reveal'
      broadcast()
      render()
      break
    case 'skill-target': {
      const targetId = t.dataset.target!
      const kind = state.lastResult?.skillKind ?? 'none'
      skillMessage = applySkill(state, kind, targetId)
      state.skillPending = false
      state.phase = 'result'
      broadcast()
      render()
      break
    }
    case 'skill-opt': {
      const opt = t.dataset.opt!
      const kind = state.lastResult?.skillKind ?? 'none'
      if (opt === 'selfonly') {
        skillMessage = applySkill(state, 'deploy')
      } else if (opt === 'ot') {
        skillMessage = applySkill(state, 'overtime')
      } else {
        skillMessage = applySkill(state, kind, undefined, opt)
      }
      state.skillPending = false
      state.phase = 'result'
      broadcast()
      render()
      break
    }
    default:
      break
  }
})

app.addEventListener('change', (ev) => {
  const inp = ev.target as HTMLInputElement
  if (inp.matches('[data-name-idx]')) {
    const i = Number(inp.dataset.nameIdx)
    setupNames[i] = inp.value
  }
})

function isIphoneXClass(): boolean {
  const w = Math.min(window.screen.width, window.innerWidth)
  const h = window.screen.height
  // X / XS / 11 Pro 約 375×812；iPhone 17 約 402×874，不會進這扇門
  return w >= 350 && w <= 390 && h <= 824
}

function syncVisibleFrame() {
  const root = document.documentElement
  if (!isIphoneXClass()) {
    root.classList.remove('iphone-x-short')
    root.style.removeProperty('--vvh')
    return
  }
  const h = window.visualViewport?.height ?? window.innerHeight
  root.style.setProperty('--vvh', `${Math.round(h)}px`)
  root.classList.add('iphone-x-short')
}

syncVisibleFrame()
window.visualViewport?.addEventListener('resize', syncVisibleFrame)
window.visualViewport?.addEventListener('scroll', syncVisibleFrame)
window.addEventListener('resize', syncVisibleFrame)
window.addEventListener('orientationchange', () => window.setTimeout(syncVisibleFrame, 250))

const params = new URLSearchParams(location.search)
const roomParam = params.get('room')
if (roomParam) {
  setUi('join')
  render()
  window.setTimeout(() => {
    const codeInput = document.getElementById('join-code') as HTMLInputElement | null
    if (codeInput) codeInput.value = roomParam.toUpperCase()
  }, 0)
} else {
  render()
}
