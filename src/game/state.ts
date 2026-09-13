import { assignRoles, getRole, type RoleDef, type SkillKind } from './roles'
import { createRng, newSeed, rngInt, shuffleInPlace } from './rng'

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

export type GameMode = 'draw_one' | 'drink_order' | 'team_toast'

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
