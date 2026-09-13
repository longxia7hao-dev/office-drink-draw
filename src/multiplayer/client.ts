import type { ClientMsg, ServerMsg, SyncPayload } from './protocol'
import { defaultWsUrl } from './protocol'

export type RoomHandlers = {
  onCreated?: (code: string, playerId: string) => void
  onJoined?: (code: string, playerId: string, isHost: boolean) => void
  onRoster?: (
    players: { id: string; name: string; connected: boolean }[],
    hostId: string,
  ) => void
  onState?: (state: SyncPayload) => void
  onError?: (message: string) => void
  onStatus?: (status: 'connecting' | 'open' | 'closed' | 'error') => void
}

export class RoomClient {
  private ws: WebSocket | null = null
  private handlers: RoomHandlers
  private url: string
  private reconnectTimer: number | null = null

  constructor(handlers: RoomHandlers, url?: string) {
    this.handlers = handlers
    this.url = url ?? defaultWsUrl()
  }

  get connected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }
    this.handlers.onStatus?.('connecting')
    try {
      this.ws = new WebSocket(this.url)
    } catch {
      this.handlers.onStatus?.('error')
      this.handlers.onError?.('無法連線到房間伺服器')
      return
    }
    this.ws.onopen = () => this.handlers.onStatus?.('open')
    this.ws.onclose = () => {
      this.handlers.onStatus?.('closed')
    }
    this.ws.onerror = () => {
      this.handlers.onStatus?.('error')
      this.handlers.onError?.('連線失敗（可改用單機模式，或確認已啟動 npm run server）')
    }
    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(String(ev.data)) as ServerMsg
        this.handle(msg)
      } catch {
        /* ignore */
      }
    }
  }

  private handle(msg: ServerMsg): void {
    switch (msg.type) {
      case 'created':
        this.handlers.onCreated?.(msg.code, msg.playerId)
        break
      case 'joined':
        this.handlers.onJoined?.(msg.code, msg.playerId, msg.isHost)
        break
      case 'roster':
        this.handlers.onRoster?.(msg.players, msg.hostId)
        break
      case 'state':
        this.handlers.onState?.(msg.state)
        break
      case 'error':
        this.handlers.onError?.(msg.message)
        break
      default:
        break
    }
  }

  send(msg: ClientMsg): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.handlers.onError?.('尚未連上伺服器')
      return
    }
    this.ws.send(JSON.stringify(msg))
  }

  create(name: string): void {
    this.connect()
    const trySend = () => {
      if (this.ws?.readyState === WebSocket.OPEN) this.send({ type: 'create', name })
      else setTimeout(trySend, 50)
    }
    trySend()
  }

  join(code: string, name: string): void {
    this.connect()
    const trySend = () => {
      if (this.ws?.readyState === WebSocket.OPEN) this.send({ type: 'join', code, name })
      else setTimeout(trySend, 50)
    }
    trySend()
  }

  sync(state: SyncPayload): void {
    this.send({ type: 'sync', state })
  }

  disconnect(): void {
    if (this.reconnectTimer != null) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.ws?.close()
    this.ws = null
  }
}
