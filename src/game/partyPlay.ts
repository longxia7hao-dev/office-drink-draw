/** 4 核心電玩派對：多數決 / 誰最可能 / 真心話 / 反應挑戰 + 混亂事件 */

export const PUNISH_PRESETS = ["喝一口", "喝一杯", "做 10 下", "真心話一題", "罰一分"] as const;

export const WHO_QUESTIONS: { id: string; q: string }[] = [
  { id: "w01", q: "誰最可能喝醉後打給前任？" },
  { id: "w02", q: "誰最可能明天上班遲到？" },
  { id: "w03", q: "誰最不適合交往？" },
  { id: "w04", q: "誰最會裝沒事？" },
  { id: "w05", q: "誰最可能先睡著？" },
  { id: "w06", q: "誰最可能把秘密講出去？" },
  { id: "w07", q: "誰最可能下一題耍賴？" },
  { id: "w08", q: "誰今晚最有可能先受罰？" },
  { id: "w09", q: "誰最會選最爛的選項？" },
  { id: "w10", q: "誰最可能已讀不回？" },
  { id: "w11", q: "誰最會在酒局講幹話？" },
  { id: "w12", q: "誰最可能把錢包忘在桌上？" },
  { id: "w13", q: "誰最不適合當情侶？" },
  { id: "w14", q: "誰最可能突然認真？" },
  { id: "w15", q: "誰最會拖人下水？" },
  { id: "w16", q: "誰最可能唱 KTV 搶麥？" },
  { id: "w17", q: "誰最會裝可憐逃罰？" },
  { id: "w18", q: "誰最可能把這局當認真比賽？" },
  { id: "w19", q: "誰最需要被點名？" },
  { id: "w20", q: "誰最可能偷偷改規則？" },
  { id: "w21", q: "誰最會對別人的戀情很好奇？" },
  { id: "w22", q: "誰最可能明天不記得今晚？" },
  { id: "w23", q: "誰最不適合保守秘密？" },
  { id: "w24", q: "誰最可能先告白？" },
  { id: "w25", q: "誰最會嘴別人自己沒事？" },
  { id: "w26", q: "誰最可能把手機解鎖給別人看？" },
  { id: "w27", q: "誰最需要喝一口冷靜？" },
  { id: "w28", q: "誰最可能在群組已讀整晚？" },
  { id: "w29", q: "誰最會選邊站？" },
  { id: "w30", q: "誰最可能把懲罰轉給別人？" },
  { id: "w31", q: "誰今晚氣場最亂？" },
  { id: "w32", q: "誰最可能被這題點到？" },
];

export type TruthCat = "一般" | "友情" | "曖昧" | "情侶" | "18+";

export const TRUTH_QUESTIONS: { id: string; cat: TruthCat; q: string }[] = [
  { id: "t01", cat: "一般", q: "最近一次說謊是為了什麼？" },
  { id: "t02", cat: "一般", q: "你現在口袋／包包裡最不想被翻到的東西？" },
  { id: "t03", cat: "一般", q: "你最不想跟在場誰當室友？" },
  { id: "t04", cat: "一般", q: "你最近一次社死是什麼？" },
  { id: "t05", cat: "一般", q: "你手機相簿第三張是什麼？不准跳過。" },
  { id: "t06", cat: "一般", q: "你最後悔的一筆衝動消費？" },
  { id: "t07", cat: "一般", q: "你最常裝懂的一件事？" },
  { id: "t08", cat: "一般", q: "說一個你從來沒告訴過在場的人的習慣。" },
  { id: "t09", cat: "友情", q: "在場誰讓你最想翻白眼？為什麼？" },
  { id: "t10", cat: "友情", q: "你跟在場誰最不熟，卻裝很熟？" },
  { id: "t11", cat: "友情", q: "你幫朋友圓過最扯的謊是什麼？" },
  { id: "t12", cat: "友情", q: "你覺得誰最需要被修理一下？" },
  { id: "t13", cat: "友情", q: "你有沒有在背後吐槽過在場的人？" },
  { id: "t14", cat: "友情", q: "如果只能刪掉一位朋友的聯絡人，你會糾結誰？" },
  { id: "t15", cat: "友情", q: "誰的秘密你其實知道，但還沒戳破？" },
  { id: "t16", cat: "友情", q: "你最想跟誰去旅行、最不想跟誰？" },
  { id: "t17", cat: "曖昧", q: "現在對誰最有感覺？可以是不在場。" },
  { id: "t18", cat: "曖昧", q: "你最近一次心動是因為什麼？" },
  { id: "t19", cat: "曖昧", q: "你有沒有對朋友動過歪念？" },
  { id: "t20", cat: "曖昧", q: "你會不會跟朋友的前任約會？" },
  { id: "t21", cat: "曖昧", q: "在場如果要選一個假交往，你選誰？" },
  { id: "t22", cat: "曖昧", q: "你最吃哪一種？講具體。" },
  { id: "t23", cat: "曖昧", q: "你傳過最晚的「在嗎」是幾點、給誰？" },
  { id: "t24", cat: "曖昧", q: "有沒有人以為你喜歡他，但其實沒有？" },
  { id: "t25", cat: "情侶", q: "你跟另一半／暗戀對象吵過最蠢的一次？" },
  { id: "t26", cat: "情侶", q: "你做過最見不得人的查崗是什麼？" },
  { id: "t27", cat: "情侶", q: "如果現任／暗戀對象看到你手機，最怕看到哪則？" },
  { id: "t28", cat: "情侶", q: "你覺得愛情跟面子哪個重要？舉例。" },
  { id: "t29", cat: "情侶", q: "你有沒有隱瞞過一筆感情史？" },
  { id: "t30", cat: "情侶", q: "分手後你做過最爛的一件事？" },
  { id: "t31", cat: "情侶", q: "你能接受另一半跟誰單獨吃飯？點名。" },
  { id: "t32", cat: "情侶", q: "講一個你絕對不會承認的佔有慾。" },
  { id: "t33", cat: "18+", q: "你最近一次臉紅，是因為什麼畫面？" },
  { id: "t34", cat: "18+", q: "你看過最不想承認的搜尋紀錄類型？" },
  { id: "t35", cat: "18+", q: "你敢不敢說你的雷？說一個就好。" },
  { id: "t36", cat: "18+", q: "在場誰的氣場最危險？為什麼？" },
  { id: "t37", cat: "18+", q: "你有沒有對不該心動的人心動過？" },
  { id: "t38", cat: "18+", q: "你能接受的最邊緣玩法，用三個字形容。" },
  { id: "t39", cat: "18+", q: "你最後悔傳出去的一句話或一張圖？" },
  { id: "t40", cat: "18+", q: "今晚如果要接吻挑戰，你最怕抽到誰？" },
];

export interface ChaosCard {
  id: string;
  title: string;
  desc: string;
  double: boolean;
  drag: boolean;
  shieldLowest: boolean;
}

export const CHAOS_CARDS: ChaosCard[] = [
  { id: "c1", title: "拖人陪罰", desc: "本回合受罰的人，可以再點一個人一起受罰。", double: false, drag: true, shieldLowest: false },
  { id: "c2", title: "懲罰加倍", desc: "本回合所有懲罰 ×2。", double: true, drag: false, shieldLowest: false },
  { id: "c3", title: "免死金牌", desc: "目前懲罰次數最低的人，本回合免疫。", double: false, drag: false, shieldLowest: true },
  { id: "c4", title: "火上加油", desc: "懲罰加倍，而且還可以拖人。", double: true, drag: true, shieldLowest: false },
  { id: "c5", title: "群眾壓力", desc: "本回合受罰者可拖一人；金牌給最慘的人。", double: false, drag: true, shieldLowest: true },
  { id: "c6", title: "安靜風暴", desc: "沒有特殊效果？騙你的，懲罰加倍。", double: true, drag: false, shieldLowest: false },
  { id: "c7", title: "幸運兒", desc: "懲罰最少的人這回合完全免疫。", double: false, drag: false, shieldLowest: true },
  { id: "c8", title: "混亂加成", desc: "加倍＋拖人。派對開始失控。", double: true, drag: true, shieldLowest: false },
];

export function getWho(id: string) {
  return WHO_QUESTIONS.find((q) => q.id === id) ?? WHO_QUESTIONS[0]!;
}

export function getTruth(id: string) {
  return TRUTH_QUESTIONS.find((q) => q.id === id) ?? TRUTH_QUESTIONS[0]!;
}

export function getChaos(id: string) {
  return CHAOS_CARDS.find((c) => c.id === id) ?? CHAOS_CARDS[0]!;
}
