/**
 * 公司酒局 — 輕量 WebSocket 房間伺服器
 * 用法：npm run server
 * 環境變數：PORT（預設 8787）
 *
 * 協議：房主為 RNG / 狀態權威，透過 sync 廣播；伺服器只轉發與維護 roster。
 */
import { WebSocketServer } from 'ws'
import { createServer } from 'http'

const PORT = Number(process.env.PORT || 8787)

/** @typedef {{ id: string, name: string, ws: import('ws').WebSocket, connected: boolean }} Member */
/** @typedef {{ code: string, hostId: string, members: Map<string, Member>, lastState: any }} Room */

/** @type {Map<string, Room>} */
const rooms = new Map()

function code4() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 4; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)]
  return s
}

function uid() {
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function roster(room) {
  return {
    type: 'roster',
    hostId: room.hostId,
    players: [...room.members.values()].map((m) => ({
      id: m.id,
      name: m.name,
      connected: m.connected,
    })),
  }
}

function broadcast(room, msg, exceptId) {
  const raw = JSON.stringify(msg)
  for (const m of room.members.values()) {
    if (exceptId && m.id === exceptId) continue
    if (m.ws.readyState === 1) m.ws.send(raw)
  }
}

function send(ws, msg) {
  if (ws.readyState === 1) ws.send(JSON.stringify(msg))
}

const httpServer = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('公司酒局 room server OK\n')
})

const wss = new WebSocketServer({ server: httpServer })

wss.on('connection', (ws) => {
  /** @type {{ roomCode: string|null, playerId: string|null }} */
  const ctx = { roomCode: null, playerId: null }

  ws.on('message', (data) => {
    let msg
    try {
      msg = JSON.parse(String(data))
    } catch {
      return
    }

    if (msg.type === 'ping') {
      send(ws, { type: 'pong' })
      return
    }

    if (msg.type === 'create') {
      let code = code4()
      while (rooms.has(code)) code = code4()
      const playerId = uid()
      /** @type {Room} */
      const room = {
        code,
        hostId: playerId,
        members: new Map(),
        lastState: null,
      }
      room.members.set(playerId, {
        id: playerId,
        name: String(msg.name || '房主').slice(0, 12),
        ws,
        connected: true,
      })
      rooms.set(code, room)
      ctx.roomCode = code
      ctx.playerId = playerId
      send(ws, { type: 'created', code, playerId })
      send(ws, roster(room))
      return
    }

    if (msg.type === 'join') {
      const code = String(msg.code || '')
        .toUpperCase()
        .trim()
      const room = rooms.get(code)
      if (!room) {
        send(ws, { type: 'error', message: '找不到房間碼' })
        return
      }
      if (room.members.size >= 12) {
        send(ws, { type: 'error', message: '房間已滿（最多 12 人）' })
        return
      }
      const playerId = uid()
      room.members.set(playerId, {
        id: playerId,
        name: String(msg.name || '玩家').slice(0, 12),
        ws,
        connected: true,
      })
      ctx.roomCode = code
      ctx.playerId = playerId
      send(ws, { type: 'joined', code, playerId, isHost: false })
      broadcast(room, roster(room))
      if (room.lastState) send(ws, { type: 'state', state: room.lastState })
      return
    }

    if (msg.type === 'sync') {
      const room = ctx.roomCode ? rooms.get(ctx.roomCode) : null
      if (!room || ctx.playerId !== room.hostId) {
        send(ws, { type: 'error', message: '只有房主可以同步狀態' })
        return
      }
      room.lastState = msg.state
      broadcast(room, { type: 'state', state: msg.state }, ctx.playerId)
      return
    }

    if (msg.type === 'kick') {
      const room = ctx.roomCode ? rooms.get(ctx.roomCode) : null
      if (!room || ctx.playerId !== room.hostId) return
      const target = room.members.get(msg.playerId)
      if (target) {
        send(target.ws, { type: 'error', message: '你已被踢出房間' })
        target.ws.close()
        room.members.delete(msg.playerId)
        broadcast(room, roster(room))
      }
    }
  })

  ws.on('close', () => {
    const room = ctx.roomCode ? rooms.get(ctx.roomCode) : null
    if (!room || !ctx.playerId) return
    const m = room.members.get(ctx.playerId)
    if (m) {
      m.connected = false
      room.members.delete(ctx.playerId)
    }
    if (room.members.size === 0) {
      rooms.delete(room.code)
      return
    }
    if (room.hostId === ctx.playerId) {
      // 移交房主給下一位
      const next = room.members.values().next().value
      if (next) room.hostId = next.id
    }
    broadcast(room, roster(room))
  })
})

httpServer.listen(PORT, () => {
  console.log(`公司酒局 room server listening on :${PORT}`)
})
