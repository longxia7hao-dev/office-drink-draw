import { assignRoles, getRole, type RoleDef, type SkillKind } from './roles'
import { createRng, newSeed, rngInt, shuffleInPlace } from './rng'
import { FLIP_QUESTIONS, getFlipQuestion, type FlipQuestion } from './flipQuestions'

export type Phase =
  | 'home'
  | 'setup'
  | 'lobby'
  | 'roles'
  | 'mode_select'
  | 'drawing'
  | 'reveal'
  | 'skill'
  | 'order_reveal'
  | 'team_reveal'
  | 'result'
  | 'flip_battle'

export type GameMode = 'draw_one' | 'drink_order' | 'team_toast' | 'flip_battle'

/** 翻牌對戰子階段 */
export type FlipSubPhase = 'countdown' | 'choose' | 'result'

export interface FlipBattleState {
  /** 洗牌後的題目 id 序列 */
  deck: string[]
  /** 目前題目在 deck 的索引 */
  index: number
  sub: FlipSubPhase
  /** 倒數剩餘秒數（3→0） */
  countdown: number
  /** 玩家選擇 0 | 1；尚未選為 null */
  picked: 0 | 1 | null
  /** 已點「下一題」的玩家 id */
  readyIds: string[]
  /** 本輪指定作答者（單機傳手機用；可空） */
  answererId: string | null
}

export interface Player {
  id: string
  name: string
  roleId: string
  connected?: boolean
  /** 加班狗：下一輪免抽 */
  skipNext?: boolean
  /** 實習生：是否還有喊救命 */
  hasPass?: boolean
}

export interface DrawResult {
  playerId: string
  mode: GameMode
  message: string
  drinkHint: string
  skillKind: SkillKind
  order?: string[]
  teams?: { name: string; members: string[] }[]
}

export interface GameState {
  phase: Phase
  mode: GameMode | null
  players: Player[]
  seed: string
  drawCount: number
  lastResult: DrawResult | null
  roomCode: string | null
  isHost: boolean
  isOnline: boolean
  myPlayerId: string | null
  skillPending: boolean
  ceremonyStep: number
  flip: FlipBattleState | null
}

export function createInitialState(): GameState {
  return {
    phase: 'home',
    mode: null,
    players: [],
    seed: newSeed(),
    drawCount: 0,
    lastResult: null,
    roomCode: null,
    isHost: true,
    isOnline: false,
    myPlayerId: null,
    skillPending: false,
    ceremonyStep: 0,
    flip: null,
  }
}

export function makeLocalPlayers(names: string[], seed: string): Player[] {
  const rng = createRng(seed + ':roles')
  const roleIds = assignRoles(names.length, (n) => rngInt(rng, n))
  return names.map((name, i) => {
    const roleId = roleIds[i]!
    return {
      id: `p${i}`,
      name: name.trim() || `玩家${i + 1}`,
      roleId,
      hasPass: roleId === 'intern',
      skipNext: false,
    }
  })
}

export function roleOf(p: Player): RoleDef {
  return getRole(p.roleId)
}

export function drawOne(state: GameState): DrawResult {
  const rng = createRng(`${state.seed}:draw:${state.drawCount}`)
  const eligible = state.players.filter((p) => !p.skipNext)
  const pool = eligible.length > 0 ? eligible : state.players
  const picked = pool[rngInt(rng, pool.length)]!
  // 清除所有 skipNext（本輪已用）
  for (const p of state.players) {
    if (p.skipNext) p.skipNext = false
  }
  const role = roleOf(picked)
  return {
    playerId: picked.id,
    mode: 'draw_one',
    message: `${picked.name}（${role.name}）中籤！`,
    drinkHint: role.drink,
    skillKind: role.skillKind,
  }
}

export function drawOrder(state: GameState): DrawResult {
  const rng = createRng(`${state.seed}:order:${state.drawCount}`)
  const ids = state.players.map((p) => p.id)
  shuffleInPlace(ids, rng)
  const names = ids.map((id) => state.players.find((p) => p.id === id)!.name)
  return {
    playerId: ids[0]!,
    mode: 'drink_order',
    message: '乾杯順序出爐！',
    drinkHint: names.map((n, i) => `${i + 1}. ${n}`).join(' → '),
    skillKind: 'none',
    order: ids,
  }
}

export function drawTeams(state: GameState): DrawResult {
  const rng = createRng(`${state.seed}:team:${state.drawCount}`)
  const ids = state.players.map((p) => p.id)
  shuffleInPlace(ids, rng)
  const mid = Math.ceil(ids.length / 2)
  const a = ids.slice(0, mid)
  const b = ids.slice(mid)
  const nameOf = (id: string) => state.players.find((p) => p.id === id)!.name
  return {
    playerId: a[0]!,
    mode: 'team_toast',
    message: '分隊完成！兩隊乾杯！',
    drinkHint: `🔥 A隊 vs ❄️ B隊`,
    skillKind: 'none',
    teams: [
      { name: '🔥 HEAT 隊', members: a.map(nameOf) },
      { name: '❄️ ICE 隊', members: b.map(nameOf) },
    ],
  }
}

export function applySkill(
  state: GameState,
  kind: SkillKind,
  targetId?: string,
  option?: string,
): string {
  const result = state.lastResult
  if (!result) return ''
  const me = state.players.find((p) => p.id === result.playerId)
  const target = targetId ? state.players.find((p) => p.id === targetId) : undefined

  switch (kind) {
    case 'pick_drink2':
      return target
        ? `📢 ${me?.name} 打小報告！${target.name} 喝 2 杯！`
        : '請選擇目標'
    case 'boss_choice':
      if (option === 'all') return `🕶️ 老闆發話：全場一起喝 1 杯！`
      return target
        ? `🕶️ 老闆點名：${target.name} 喝 2 杯！`
        : '請選擇'
    case 'intern_pass':
      if (me) me.hasPass = false
      return target
        ? `🐣 ${me?.name} 喊救命！喝酒傳給 ${target.name}！`
        : '請選擇傳給誰'
    case 'treat':
      return target
        ? `🤝 ${me?.name} 請客！${me?.name} 與 ${target.name} 各喝 1！`
        : '請選擇請客對象'
    case 'transfer':
      if (option === 'redraw') {
        const rng = createRng(`${state.seed}:redraw:${state.drawCount}`)
        const ids = assignRoles(state.players.length, (n) => rngInt(rng, n))
        state.players.forEach((p, i) => {
          p.roleId = ids[i]!
          p.hasPass = p.roleId === 'intern'
        })
        return '📋 人資宣布：全體重新抽角色！'
      }
      if (me && target) {
        const tmp = me.roleId
        me.roleId = target.roleId
        target.roleId = tmp
        me.hasPass = me.roleId === 'intern'
        target.hasPass = target.roleId === 'intern'
        return `📋 調職！${me.name} ⇄ ${target.name}`
      }
      return '請選擇'
    case 'tax':
      return target
        ? `🧮 報帳！${target.name} 多喝 1；${me?.name} 改半杯`
        : '請選擇'
    case 'deploy':
      if (target) target.skipNext = true
      return target
        ? `💻 緊急上線！${me?.name} 喝 1；${target.name} 下輪免抽`
        : `${me?.name} 喝 1 杯（可選延後對象）`
    case 'overtime':
      if (me) me.skipNext = true
      return `🐕 ${me?.name} 加班！喝 2 杯，下輪免抽`
    default:
      return `${me?.name} ${getRole(me?.roleId ?? 'worker').drink}`
  }
}

/** 開新一局翻牌對戰（洗牌＋第一題倒數） */
export function startFlipBattle(state: GameState): void {
  const rng = createRng(`${state.seed}:flip:${state.drawCount}`)
  const ids = FLIP_QUESTIONS.map((q) => q.id)
  shuffleInPlace(ids, rng)
  const answerer =
    state.players.length > 0
      ? state.players[rngInt(rng, state.players.length)]!.id
      : null
  state.mode = 'flip_battle'
  state.phase = 'flip_battle'
  state.flip = {
    deck: ids,
    index: 0,
    sub: 'countdown',
    countdown: 3,
    picked: null,
    readyIds: [],
    answererId: answerer,
  }
  state.skillPending = false
  state.lastResult = null
}

export function currentFlipQuestion(state: GameState): FlipQuestion | null {
  const flip = state.flip
  if (!flip || flip.deck.length === 0) return null
  const id = flip.deck[flip.index % flip.deck.length]
  return id ? getFlipQuestion(id) : null
}

/** 倒數結束 → 翻開選項 */
export function flipRevealCards(state: GameState): void {
  if (!state.flip) return
  state.flip.sub = 'choose'
  state.flip.countdown = 0
  state.flip.picked = null
}

/** 作答 */
export function flipPick(state: GameState, choice: 0 | 1): void {
  if (!state.flip || state.flip.sub !== 'choose') return
  state.flip.picked = choice
  state.flip.sub = 'result'
  state.flip.readyIds = []
}

/** 標記下一題就緒 */
export function flipMarkReady(state: GameState, playerId: string): void {
  if (!state.flip || state.flip.sub !== 'result') return
  if (!state.flip.readyIds.includes(playerId)) {
    state.flip.readyIds.push(playerId)
  }
}

export function flipAllReady(state: GameState): boolean {
  if (!state.flip) return false
  if (state.players.length === 0) return true
  return state.players.every((p) => state.flip!.readyIds.includes(p.id))
}

/** 全體就緒 → 下一題（循環題庫） */
export function flipAdvance(state: GameState): void {
  if (!state.flip) return
  const nextIndex = (state.flip.index + 1) % state.flip.deck.length
  const rng = createRng(`${state.seed}:flip-ans:${state.drawCount}:${nextIndex}`)
  const answerer =
    state.players.length > 0
      ? state.players[rngInt(rng, state.players.length)]!.id
      : null
  state.flip.index = nextIndex
  state.flip.sub = 'countdown'
  state.flip.countdown = 3
  state.flip.picked = null
  state.flip.readyIds = []
  state.flip.answererId = answerer
  state.drawCount += 1
}

export function flipIsCorrect(state: GameState): boolean {
  const q = currentFlipQuestion(state)
  if (!q || state.flip?.picked == null) return false
  return state.flip.picked === q.correct
}
