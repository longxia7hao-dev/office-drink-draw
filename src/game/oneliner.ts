export interface LinerEffect {
  id: string;
  name: string;
  emoji: string;
}

export const LINER_EFFECTS: LinerEffect[] = [
  { id: "funny", name: "搞笑", emoji: "😂" },
  { id: "awkward", name: "尷尬", emoji: "😳" },
  { id: "blank", name: "傻眼", emoji: "😐" },
  { id: "moved", name: "感動", emoji: "🥹" },
  { id: "punch", name: "欠揍", emoji: "😤" },
  { id: "creep", name: "毛骨悚然", emoji: "👻" },
  { id: "guilty", name: "心虛", emoji: "😅" },
  { id: "mad", name: "火大", emoji: "😡" },
  { id: "speechless", name: "無言", emoji: "🤐" },
  { id: "scared", name: "害怕", emoji: "😨" },
  { id: "crash", name: "崩潰", emoji: "🤯" },
  { id: "ew", name: "噁心", emoji: "🤢" },
];

export const LINER_SITUATIONS: string[] = [
  "吵鬧的圖書館裡，你突然開口。",
  "第一次去另一半家吃飯，全桌看著你。",
  "婚禮致詞，麥克風交到你手上。",
  "電梯裡只剩你和董事長。",
  "尾牙主持人把你叫上台。",
  "群組已讀很久，你終於傳了一句。",
  "會議安靜了十秒，你打破沉默。",
  "前任突然坐到同一桌。",
  "你把飲料打翻在主管身上之後。",
  "深夜加班，只剩你和一個同事。",
  "面試官問完最後一題，等你說話。",
  "家裡吃飯，長輩問你薪水。",
  "KTV 麥克風硬塞到你手上。",
  "你遲到二十分鐘，推開會議室的門。",
  "朋友哭著跟你訴苦，等你一句。",
  "大家問你今晚為什麼還不走。",
  "客戶已經很生氣，輪到你開口。",
  "合照倒數，你突然插了一句。",
  "醫師問你這週的作息。",
  "室友發現你偷吃他的泡麵。",
  "老闆問這個專案什麼時候好。",
  "暗戀的人坐到你旁邊。",
  "你把訊息傳到錯的群組。",
  "小孩問你為什麼大人要喝酒。",
  "你一開視訊，全公司都在。",
  "你被抓到上班在滑手機。",
  "聚餐該你敬酒，大家看著你。",
  "你走錯廁所，被發現了。",
  "結帳時才發現錢不夠。",
  "你媽打電話來，揚聲器不小心開著。",
  "同事當眾問你周末去哪。",
  "你打噴嚏噴到前面的人。",
  "年會主持人把麥克風塞給你。",
  "朋友剛講完秘密，盯著你。",
  "你在喪禮上被要求講一句。",
];

const BOT_LINES: Record<string, string[]> = {
  搞笑: ["我不是遲到，我是在幫會議熱身。", "報告還沒寫，但笑容先交了。"],
  尷尬: ["阿姨，妳兒子長得好像我前任。", "我剛剛在廁所一直想你們。"],
  傻眼: ["所以這個專案是用感覺做的嗎？", "我以為今天放假。"],
  感動: ["沒有你們，我大概還在櫃檯哭。", "這杯我敬當初沒放棄我的人。"],
  欠揍: ["你們慢慢做，我先去收功勞。", "這題我閉著眼睛都會。"],
  毛骨悚然: ["我昨天夢到今晚這桌少一個人。", "你們背後那個人從剛才就沒眨眼。"],
  心虛: ["我沒有打開那個檔案，它自己開的。", "錢我下個月一定補。"],
  火大: ["再問一次進度，我就把電腦關了。", "這不是協作，這是在拖我。"],
  無言: ["……好哦。", "我沒有要回這句。"],
  害怕: ["燈剛剛是不是自己滅的？", "不要回頭，先聽我說完。"],
  崩潰: ["我已經回覆到不知道自己是誰。", "再一封信我就地離職。"],
  噁心: ["這湯喝起來有點像隔夜襪子。", "我剛把掉到地上的料夾回去了。"],
};

export function linerEffect(idOrName: string): LinerEffect {
  return (
    LINER_EFFECTS.find((e) => e.id === idOrName || e.name === idOrName) ?? LINER_EFFECTS[0]!
  );
}

export function linerBotLine(effectName: string, salt: string): string {
  const pool = BOT_LINES[effectName] ?? BOT_LINES["搞笑"]!;
  let n = 0;
  for (let i = 0; i < salt.length; i++) n = (n + salt.charCodeAt(i) * (i + 1)) % 997;
  return pool[n % pool.length]!;
}
