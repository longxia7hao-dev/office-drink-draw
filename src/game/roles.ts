/** 公司酒局 — 角色與技能定義 */

export type SkillKind =
  | "none"
  | "pick_drink2"
  | "boss_choice"
  | "intern_pass"
  | "treat"
  | "transfer"
  | "tax"
  | "deploy"
  | "overtime";

export interface RoleDef {
  id: string;
  name: string;
  tag: string;
  drink: string;
  skillName: string;
  skillDesc: string;
  skillKind: SkillKind;
  color: string;
  icon: RoleIconId;
  bio: string;
  line: string;
  stats: RoleStats;
}

export interface RoleStats {
  /** 酒量 1–5 */
  drink: number;
  /** 酒品 1–5 */
  manners: number;
  /** 交際手腕 1–5 */
  social: number;
}

export const STAT_META: { key: keyof RoleStats; label: string; hint: string }[] = [
  { key: "drink", label: "酒量", hint: "能灌多少、撐多久" },
  { key: "manners", label: "酒品", hint: "喝醉會不會亂" },
  { key: "social", label: "交際手腕", hint: "帶風向、甩鍋、拉關係" },
];

export type RoleIconId =
  | "manager"
  | "worker"
  | "ceo"
  | "intern"
  | "sales"
  | "hr"
  | "accountant"
  | "engineer"
  | "overtime";

export const ROLES: RoleDef[] = [
  {
    id: "manager",
    name: "主管",
    tag: "BOSS UP",
    drink: "{P}",
    skillName: "打小報告",
    skillDesc: "指定一位「上班族」{P2}",
    skillKind: "pick_drink2",
    color: "#FF3D71",
    icon: "manager",
    bio: "會議永遠開不完，酒局卻永遠到得最準。擅長把責任往下推，也擅長把酒往別人杯子裡倒。",
    line: "這杯先記在你們組的績效上。",
    stats: { drink: 3, manners: 2, social: 4 },
  },
  {
    id: "worker",
    name: "上班族",
    tag: "9to5",
    drink: "{P}",
    skillName: "摸魚",
    skillDesc: "只要{P}，沒有特殊技能（但人多勢眾）",
    skillKind: "none",
    color: "#4ECDC4",
    icon: "worker",
    bio: "公司裡最多的一種人。沒有光環，但酒局少了他們就冷場。默默乾杯，默默摸魚。",
    line: "我先乾為敬，請假的事明天再說。",
    stats: { drink: 3, manners: 3, social: 3 },
  },
  {
    id: "ceo",
    name: "老闆",
    tag: "BIG SHOT",
    drink: "{P}",
    skillName: "老闆發話",
    skillDesc: "全場一起{P}，或指定一人{P2}",
    skillKind: "boss_choice",
    color: "#FFD700",
    icon: "ceo",
    bio: "買單的人、點名的人、說「再來一輪」的人。酒杯從不空，人情從不欠。",
    line: "今晚我買單，誰敢把杯子放下？",
    stats: { drink: 4, manners: 2, social: 5 },
  },
  {
    id: "intern",
    name: "實習生",
    tag: "ROOKIE",
    drink: "{P}（可減半）",
    skillName: "喊救命",
    skillDesc: "整場遊戲可使用 1 次：把這次懲罰傳給別人",
    skillKind: "intern_pass",
    color: "#A78BFA",
    icon: "intern",
    bio: "第一次跟長官喝酒，手還在發抖。酒量是裝飾品，求救才是生存技能。",
    line: "學長我真的只能抿一口，拜託……",
    stats: { drink: 1, manners: 5, social: 2 },
  },
  {
    id: "sales",
    name: "業務",
    tag: "DEAL",
    drink: "{P}",
    skillName: "請客",
    skillDesc: "指定一人跟你一起各{P}",
    skillKind: "treat",
    color: "#FF8C42",
    icon: "sales",
    bio: "名片比酒更快出手。陪笑、乾杯、把氣氛炒熱，是這場酒局的潤滑劑。",
    line: "成交！這杯乾了，細節待會再補。",
    stats: { drink: 5, manners: 3, social: 5 },
  },
  {
    id: "hr",
    name: "人資",
    tag: "HR",
    drink: "{P}",
    skillName: "調職",
    skillDesc: "與一人互換角色，或全體重新抽角色",
    skillKind: "transfer",
    color: "#38BDF8",
    icon: "hr",
    bio: "看起來在紀錄誰沒喝、誰喝太多。調職令一下，今晚的角色重新洗牌。",
    line: "這場算團建，我會列入出席紀錄。",
    stats: { drink: 2, manners: 5, social: 4 },
  },
  {
    id: "accountant",
    name: "會計",
    tag: "TAX",
    drink: "{P}",
    skillName: "報帳",
    skillDesc: "指定一人多{P}；自己可改為減半",
    skillKind: "tax",
    color: "#34D399",
    icon: "accountant",
    bio: "每一杯都要入帳。自己能少喝就少喝，但絕對算得出誰該多喝那一杯。",
    line: "發票先給我，這杯報內勤交際費。",
    stats: { drink: 2, manners: 4, social: 2 },
  },
  {
    id: "engineer",
    name: "工程師",
    tag: "SHIP IT",
    drink: "{P}",
    skillName: "緊急上線",
    skillDesc: "自己{P}，可指定一人這輪免抽（延後）",
    skillKind: "deploy",
    color: "#60A5FA",
    icon: "engineer",
    bio: "不愛應酬卻意外能喝。緊急上線是口頭禪，也是他逃酒、救人的方法。",
    line: "這輪我喝，下輪我去修 production。",
    stats: { drink: 4, manners: 1, social: 1 },
  },
  {
    id: "overtime",
    name: "加班狗",
    tag: "OT",
    drink: "{P2}",
    skillName: "加班免抽",
    skillDesc: "這輪{P2}，下一輪抽籤時自動跳過你",
    skillKind: "overtime",
    color: "#F472B6",
    icon: "overtime",
    bio: "肝是拿來用的。今晚已經加班，酒局再加一場：喝兩杯，換下一輪免抽。",
    line: "加班費沒有，這兩杯算我的。",
    stats: { drink: 5, manners: 1, social: 2 },
  },
];

export function getRole(id: string): RoleDef {
  return ROLES.find((r) => r.id === id) ?? ROLES[1]!;
}

/** 依人數分配角色（保證有上班族池可被主管點） */
export function assignRoles(playerCount: number, pick: (n: number) => number): string[] {
  const pool = [...ROLES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = pick(i + 1);
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  const ids: string[] = [];
  for (let i = 0; i < playerCount; i++) {
    if (i < pool.length) ids.push(pool[i]!.id);
    else ids.push("worker");
  }
  for (let i = ids.length - 1; i > 0; i--) {
    const j = pick(i + 1);
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
  }
  return ids;
}

/** 已被別人佔走的角色不能再選。超過 9 人時「上班族」可重複。 */
export function isRoleAvailable(
  players: { id: string; roleId: string }[],
  roleId: string,
  actorId: string,
): boolean {
  if (!roleId) return true;
  const holders = players.filter((p) => p.roleId === roleId && p.id !== actorId);
  if (holders.length === 0) return true;
  return roleId === "worker" && players.length > ROLES.length;
}

export function claimedBy(
  players: { id: string; name: string; roleId: string }[],
  roleId: string,
  exceptId?: string,
): { id: string; name: string } | undefined {
  return players.find((p) => p.roleId === roleId && p.id !== exceptId);
}

