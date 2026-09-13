import type {
  FlipBattleState,
  GameMode,
  GameState,
  Phase,
  Player,
  DrawResult,
} from '../game/state'

export type ClientMsg =
  | { type: 'create'; name: string }
  | { type: 'join'; code: string; name: string }
  | { type: 'sync'; state: SyncPayload }
  | { type: 'kick'; playerId: string }
  | { type: 'ping' }

export type ServerMsg =
  | { type: 'created'; code: string; playerId: string }
  | { type: 'joined'; code: string; playerId: string; isHost: boolean }
  | { type: 'roster'; players: { id: string; name: string; connected: boolean }[]; hostId: string }
  | { type: 'state'; state: SyncPayload }
  | { type: 'error'; message: string }
  | { type: 'pong' }

/** 房主權威同步負載 */
export interface SyncPayload {
  phase: Phase
  mode: GameMode | null
  players: Player[]
  seed: string
  drawCount: number
  lastResult: DrawResult | null
  skillPending: boolean
  ceremonyStep: number
  flip: FlipBattleState | null
}

export function toSync(state: GameState): SyncPayload {
  return {
    phase: state.phase,
    mode: state.mode,
    players: state.players,
    seed: state.seed,
    drawCount: state.drawCount,
    lastResult: state.lastResult,
    skillPending: state.skillPending,
    ceremonyStep: state.ceremonyStep,
    flip: state.flip,
  }
}

export function applySync(state: GameState, sync: SyncPayload): void {
  state.phase = sync.phase
  state.mode = sync.mode
  state.players = sync.players
  state.seed = sync.seed
  state.drawCount = sync.drawCount
  state.lastResult = sync.lastResult
  state.skillPending = sync.skillPending
  state.ceremonyStep = sync.ceremonyStep
  state.flip = sync.flip ?? null
}

export function defaultWsUrl(): string {
  const env = (import.meta as ImportMeta & { env: Record<string, string> }).env
  if (env.VITE_WS_URL) return env.VITE_WS_URL
  const loc = typeof location !== 'undefined' ? location : null
  if (!loc) return 'ws://localhost:8787'
  // 本機開發
  if (loc.hostname === 'localhost' || loc.hostname === '127.0.0.1') {
    return `ws://${loc.hostname}:8787`
  }
  // 預設假設同主機 8787（自架 server）
  const proto = loc.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${loc.hostname}:8787`
}
