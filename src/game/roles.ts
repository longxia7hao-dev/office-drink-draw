/** 公司酒局 — 角色與技能定義 */

export type SkillKind =
  | 'none'
  | 'pick_drink2'      // 打小報告：指定上班族喝 2
  | 'boss_choice'      // 老闆：全場喝 1 或指定喝 2
  | 'intern_pass'      // 實習生：喊救命（本局可跳過一次）
  | 'treat'            // 業務：請客（對方跟你各喝 1）
  | 'transfer'         // 人資：調職（互換角色或重抽）
  | 'tax'              // 會計：報帳（指定一人多喝 1，自己少喝半杯）
  | 'deploy'           // 工程師：上線（自己喝 1，可指定一人延後到下輪）
  | 'overtime'         // 加班狗：加班（自己喝 2，下一輪免抽）

export interface RoleDef {
  id: string
  name: string
  emoji: string
  tag: string
  drink: string
  skillName: string
  skillDesc: string
  skillKind: SkillKind
  color: string
  accent: string
}

export const ROLES: RoleDef[] = [
  {
    id: 'manager',
    name: '主管',
    emoji: '👔',
    tag: 'BOSS UP',
    drink: '喝 1 杯',
    skillName: '打小報告',
    skillDesc: '指定一位「上班族」喝 2 杯',
    skillKind: 'pick_drink2',
    color: '#FF3D71',
    accent: '#FFE566',
  },
  {
    id: 'worker',
    name: '上班族',
    emoji: '💼',
    tag: '9to5',
    drink: '喝 1 杯',
    skillName: '摸魚',
    skillDesc: '純喝 1 杯，沒有特殊技能（但人多勢眾）',
    skillKind: 'none',
    color: '#4ECDC4',
    accent: '#FFF',
  },
  {
    id: 'ceo',
    name: '老闆',
    emoji: '🕶️',
    tag: 'BIG SHOT',
    drink: '喝 1 杯',
    skillName: '老闆發話',
    skillDesc: '全場一起喝 1，或指定一人喝 2',
    skillKind: 'boss_choice',
    color: '#FFD700',
    accent: '#1A1A1A',
  },
  {
    id: 'intern',
    name: '實習生',
    emoji: '🐣',
    tag: 'ROOKIE',
    drink: '抿半杯 或 喝 1',
    skillName: '喊救命',
    skillDesc: '整場遊戲可使用 1 次：把這次喝酒傳給別人',
    skillKind: 'intern_pass',
    color: '#A78BFA',
    accent: '#FFF',
  },
  {
    id: 'sales',
    name: '業務',
    emoji: '🤝',
    tag: 'DEAL',
    drink: '喝 1 杯',
    skillName: '請客',
    skillDesc: '指定一人跟你一起各喝 1 杯',
    skillKind: 'treat',
    color: '#FF8C42',
    accent: '#FFF',
  },
  {
    id: 'hr',
    name: '人資',
    emoji: '📋',
    tag: 'HR',
    drink: '喝 1 杯',
    skillName: '調職',
    skillDesc: '與一人互換角色，或全體重新抽角色',
    skillKind: 'transfer',
    color: '#38BDF8',
    accent: '#FFF',
  },
  {
    id: 'accountant',
    name: '會計',
    emoji: '🧮',
    tag: 'TAX',
    drink: '喝 1 杯',
    skillName: '報帳',
    skillDesc: '指定一人多喝 1；自己可改為半杯',
    skillKind: 'tax',
    color: '#34D399',
    accent: '#1A1A1A',
  },
  {
    id: 'engineer',
    name: '工程師',
    emoji: '💻',
    tag: 'SHIP IT',
    drink: '喝 1 杯',
    skillName: '緊急上線',
    skillDesc: '自己喝 1，可指定一人這輪免抽（延後）',
    skillKind: 'deploy',
    color: '#60A5FA',
    accent: '#FFF',
  },
  {
    id: 'overtime',
    name: '加班狗',
    emoji: '🐕',
    tag: 'OT',
    drink: '喝 2 杯',
    skillName: '加班免抽',
    skillDesc: '這輪喝 2，下一輪抽籤時自動跳過你',
    skillKind: 'overtime',
    color: '#F472B6',
    accent: '#FFF',
  },
]

export function getRole(id: string): RoleDef {
  return ROLES.find((r) => r.id === id) ?? ROLES[1]!
}

/** 依人數分配角色（保證有上班族池可被主管點） */
export function assignRoles(playerCount: number, pick: (n: number) => number): string[] {
  const pool = [...ROLES]
  // 洗牌池
  for (let i = pool.length - 1; i > 0; i--) {
    const j = pick(i + 1)
    ;[pool[i], pool[j]] = [pool[j]!, pool[i]!]
  }
  const ids: string[] = []
  for (let i = 0; i < playerCount; i++) {
    if (i < pool.length) {
      ids.push(pool[i]!.id)
    } else {
      // 多於角色種類時，額外塞上班族
      ids.push('worker')
    }
  }
  // 再洗一次分配順序
  for (let i = ids.length - 1; i > 0; i--) {
    const j = pick(i + 1)
    ;[ids[i], ids[j]] = [ids[j]!, ids[i]!]
  }
  return ids
}
