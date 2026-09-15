/** 派對加碼：國王遊戲、從未做過、命運輪盤 */

export type KingKind =
  | "pick1"
  | "pick2"
  | "odds"
  | "evens"
  | "highlow"
  | "all_but_king"
  | "king_drinks"
  | "neighbors"
  | "role_boss"
  | "role_intern"
  | "leader"
  | "rookie"
  | "all"
  | "overtime"
  | "workers";

export interface KingCmd {
  id: string;
  title: string;
  desc: string;
  kind: KingKind;
  cups: number;
}

export const KING_CMDS: KingCmd[] = [
  { id: "k1", title: "點名處罰", desc: "國王指定一人{P2}", kind: "pick1", cups: 2 },
  { id: "k2", title: "雙人組", desc: "國王指定兩人互相對決（各{P}）", kind: "pick2", cups: 1 },
  { id: "k3", title: "單數特攻", desc: "號碼單數的人各{P}", kind: "odds", cups: 1 },
  { id: "k4", title: "偶數加班", desc: "號碼偶數的人各{P}", kind: "evens", cups: 1 },
  { id: "k5", title: "兩極乾杯", desc: "最大號與最小號互相對決（各{P}）", kind: "highlow", cups: 1 },
  { id: "k6", title: "國王免責", desc: "除了國王，全場各{P}", kind: "all_but_king", cups: 1 },
  { id: "k7", title: "以身作則", desc: "國王自己{P2} 當榜樣", kind: "king_drinks", cups: 2 },
  { id: "k8", title: "左右逢源", desc: "國王左邊與右邊的人各{P}", kind: "neighbors", cups: 1 },
  { id: "k9", title: "管理階層", desc: "老闆／主管角色各{P}", kind: "role_boss", cups: 1 },
  { id: "k10", title: "菜鳥特攻", desc: "實習生{P}（沒有就上班族）", kind: "role_intern", cups: 1 },
  { id: "k11", title: "酒王加碼", desc: "目前受罰最多的人再{P}", kind: "leader", cups: 1 },
  { id: "k12", title: "清水補課", desc: "目前受罰最少的人{P}", kind: "rookie", cups: 1 },
  { id: "k13", title: "全場乾杯", desc: "包含國王，全員{P}", kind: "all", cups: 1 },
  { id: "k14", title: "肝帝點名", desc: "加班狗角色{P2}（沒有則國王）", kind: "overtime", cups: 2 },
  { id: "k15", title: "基層團結", desc: "所有上班族各{P}", kind: "workers", cups: 1 },
  { id: "k16", title: "國王欽點", desc: "國王指定一人{P} 並講一句幹話", kind: "pick1", cups: 1 },
];

export function getKingCmd(id: string): KingCmd {
  return KING_CMDS.find((c) => c.id === id) ?? KING_CMDS[0]!;
}

export function kingNeed(kind: KingKind): number {
  if (kind === "pick1") return 1;
  if (kind === "pick2") return 2;
  return 0;
}

export const NEVER_PROMPTS: { id: string; q: string }[] = [
  { id: "n01", q: "從未在會議中滑手機" },
  { id: "n02", q: "從未用「收到」當已讀不回" },
  { id: "n03", q: "從未裝忙等下班" },
  { id: "n04", q: "從未把工作推給實習生" },
  { id: "n05", q: "從未把檔名存成「最終版_真的最終」" },
  { id: "n06", q: "從未說「我五分鐘就好」然後半小時" },
  { id: "n07", q: "從未在廁所滑到被敲門" },
  { id: "n08", q: "從未把便當放壞在冰箱" },
  { id: "n09", q: "從未周一按掉鬧鐘三次" },
  { id: "n10", q: "從未假裝沒看到群組 @all" },
  { id: "n11", q: "從未把錯推給「系統」" },
  { id: "n12", q: "從未在視訊關鏡頭偷吃" },
  { id: "n13", q: "從未複製學長報告只改名字" },
  { id: "n14", q: "從未把截止日期記成下週" },
  { id: "n15", q: "從未被主管一句「順便」整晚" },
  { id: "n16", q: "從未在公司滑到差點睡著" },
  { id: "n17", q: "從未用超商美式當晚餐" },
  { id: "n18", q: "從未把會議紀錄寫成「如上」" },
  { id: "n19", q: "從未忘記自己的員工編號" },
  { id: "n20", q: "從未開會講「那個那個那個」" },
  { id: "n21", q: "從未把密碼設成公司名稱+123" },
  { id: "n22", q: "從未在捷運上改過簡報" },
  { id: "n23", q: "從未把「下週再看」真的拖到下下週" },
  { id: "n24", q: "從未用過「我再確認一下」當擋箭牌" },
  { id: "n25", q: "從未把同事便當微波到爆炸" },
  { id: "n26", q: "從未在年會抽到自己不想要的獎" },
  { id: "n27", q: "從未把冷氣遙控器藏起來" },
  { id: "n28", q: "從未在群組傳錯過部門" },
  { id: "n29", q: "從未把 KPI  Spreadsheet 搞亂公式" },
  { id: "n30", q: "從未開會時突然被點名然後空白" },
  { id: "n31", q: "從未把識別證忘在家" },
  { id: "n32", q: "從未用「訊號不好」逃離視訊" },
  { id: "n33", q: "從未在夜市排隊排到懷疑人生" },
  { id: "n34", q: "從未把珍珠奶茶當正餐" },
  { id: "n35", q: "從未在颱風假群組當氣象專家" },
  { id: "n36", q: "從未把「差不多就好」講出口" },
  { id: "n37", q: "從未加班到最後一班捷運" },
  { id: "n38", q: "從未把印表機卡紙當成人生隱喻" },
  { id: "n39", q: "從未在酒局說「我真的不會喝」然後倒" },
  { id: "n40", q: "從未把這句話講完還裝沒事" },
];

export function getNever(id: string) {
  return NEVER_PROMPTS.find((p) => p.q && p.id === id) ?? NEVER_PROMPTS[0]!;
}

export type WheelKind = "random1" | "random2" | "all" | "pick" | "skip" | "redraw" | "leader" | "buddy";

export interface WheelSeg {
  id: string;
  label: string;
  color: string;
  kind: WheelKind;
  cups: number;
}

export const WHEEL: WheelSeg[] = [
  { id: "w1", label: "隨機受罰", color: "#ff2d95", kind: "random1", cups: 1 },
  { id: "w2", label: "隨機 ×2", color: "#ff6b1a", kind: "random2", cups: 2 },
  { id: "w3", label: "全場受罰", color: "#ffd700", kind: "all", cups: 1 },
  { id: "w4", label: "點名 ×2", color: "#00f0ff", kind: "pick", cups: 2 },
  { id: "w5", label: "免罰過關", color: "#b8ff00", kind: "skip", cups: 0 },
  { id: "w6", label: "重抽角色", color: "#a78bfa", kind: "redraw", cups: 0 },
  { id: "w7", label: "領先加碼", color: "#f472b6", kind: "leader", cups: 1 },
  { id: "w8", label: "找人陪罰", color: "#38bdf8", kind: "buddy", cups: 1 },
];

export function recapTitle(rank: number, total: number): string {
  if (rank === 0) return "今晚最慘";
  if (rank === 1 && total >= 3) return "陪跑亞軍";
  if (rank === total - 1) return "完美倖存";
  return "普通受難";
}
