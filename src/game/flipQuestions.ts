/** 翻牌對戰 — 無厘頭問題庫（正體中文） */

export interface FlipQuestion {
  id: string
  /** 題目（越無厘頭越好） */
  q: string
  /** 兩個選項 */
  options: [string, string]
  /** 正確選項索引 0 | 1 */
  correct: 0 | 1
}

export const FLIP_QUESTIONS: FlipQuestion[] = [
  {
    id: 'fq01',
    q: '開會時投影片突然黑掉，最合理的解釋是？',
    options: ['投影機在摸魚', '宇宙管理員按了暫停'],
    correct: 1,
  },
  {
    id: 'fq02',
    q: '冰箱裡的便當會自己長腳逃走，因為？',
    options: ['它不想被微波', '它考上了外派'],
    correct: 0,
  },
  {
    id: 'fq03',
    q: '鍵盤上的空白鍵為什麼叫空白？',
    options: ['因為它心裡很空', '因為它負責製造沉默'],
    correct: 1,
  },
  {
    id: 'fq04',
    q: '周一早上鬧鐘響三遍，代表？',
    options: ['時間在求饒', '你跟床簽了加班合約'],
    correct: 1,
  },
  {
    id: 'fq05',
    q: '影印機卡紙的真正原因是？',
    options: ['紙張想休息五分鐘', '它在抗議被印太多 KPI'],
    correct: 0,
  },
  {
    id: 'fq06',
    q: '咖啡機吐出氣泡音，其實是在？',
    options: ['說饒舌', '報今日運勢'],
    correct: 0,
  },
  {
    id: 'fq07',
    q: '電梯門關太慢，是因為？',
    options: ['它在等遲到的靈魂', '門縫在談戀愛'],
    correct: 0,
  },
  {
    id: 'fq08',
    q: '滑鼠游標一直轉圈，代表電腦在？',
    options: ['冥想', '偷偷看連續劇'],
    correct: 1,
  },
  {
    id: 'fq09',
    q: '會議室冷氣為什麼總是太冷？',
    options: ['為了凍結愚蠢發言', '冷氣在練冰系魔法'],
    correct: 0,
  },
  {
    id: 'fq10',
    q: '同事說「我五分鐘就好」，五分鐘等於？',
    options: ['一個小時代', '量子不確定時間'],
    correct: 1,
  },
  {
    id: 'fq11',
    q: '自動販賣機吃幣不吐貨，是因為？',
    options: ['它在存退休金', '它覺得你不夠潮'],
    correct: 0,
  },
  {
    id: 'fq12',
    q: 'Wi‑Fi 名稱叫「別連我」，你應該？',
    options: ['連得更用力', '對它鞠躬道歉'],
    correct: 0,
  },
  {
    id: 'fq13',
    q: '廁所衛生紙用完時，宇宙會？',
    options: ['播放尷尬配樂', '派一隻鴿子送紙'],
    correct: 0,
  },
  {
    id: 'fq14',
    q: '簡報第 87 頁還在講前言，代表講者？',
    options: ['誤入時空迴圈', '把結局藏在前言裡'],
    correct: 0,
  },
  {
    id: 'fq15',
    q: '辦公椅發出怪聲是因為？',
    options: ['它想換跑道當鼓手', '它在模仿你的薪水'],
    correct: 0,
  },
  {
    id: 'fq16',
    q: '螢幕保護程式出現熱帶魚，真相是？',
    options: ['魚在代班', '電腦在度假你不行'],
    correct: 1,
  },
  {
    id: 'fq17',
    q: '「差不多就好」在公司語代表？',
    options: ['絕對要重做三遍', '已經完美到不行'],
    correct: 0,
  },
  {
    id: 'fq18',
    q: '雨傘忘在公司，雨傘現在？',
    options: ['加入了另一個部門', '正在開自己的傘派對'],
    correct: 1,
  },
  {
    id: 'fq19',
    q: '為什麼打字會突然跳去上一行？',
    options: ['游標想逃家', '鍵盤在玩捉迷藏'],
    correct: 0,
  },
  {
    id: 'fq20',
    q: '中午便當店排到隊尾，代表你？',
    options: ['被命運選為苦行僧', '其實是隱形人'],
    correct: 0,
  },
  {
    id: 'fq21',
    q: '群組訊息已讀不回，對方其實？',
    options: ['正在練習隱形術', '被訊息吸進黑洞'],
    correct: 1,
  },
  {
    id: 'fq22',
    q: '白板筆沒水了還硬寫，寫出來的是？',
    options: ['空氣藝術', '隱形 KPI'],
    correct: 0,
  },
  {
    id: 'fq23',
    q: '下班卡刷不過，系統認為你？',
    options: ['還欠宇宙一小時', '其實是影分身'],
    correct: 0,
  },
  {
    id: 'fq24',
    q: '會議室電視遙控器失蹤，它去了？',
    options: ['異次元沙發縫', '跟電池私奔'],
    correct: 0,
  },
  {
    id: 'fq25',
    q: '「這個需求很簡單」說完之後會？',
    options: ['長出十七個子需求', '立刻世界和平'],
    correct: 0,
  },
  {
    id: 'fq26',
    q: '印表機燈一直閃橘燈，是在？',
    options: ['發出求救摩斯密碼', '慶祝週年慶'],
    correct: 0,
  },
  {
    id: 'fq27',
    q: '為什麼耳機線總會打結？',
    options: ['它在練習魔術', '它嫉妒無線耳機'],
    correct: 1,
  },
  {
    id: 'fq28',
    q: '週五下午開會的真正目的是？',
    options: ['測試誰還有靈魂', '幫周末暖身延遲'],
    correct: 0,
  },
  {
    id: 'fq29',
    q: '雲端硬碟顯示同步中……其實在？',
    options: ['跟雲聊天', '把檔案帶去旅行'],
    correct: 1,
  },
  {
    id: 'fq30',
    q: '「我傳檔案給你了」但你沒收到，檔案？',
    options: ['卡在平行宇宙信箱', '變成了幽靈附件'],
    correct: 0,
  },
  {
    id: 'fq31',
    q: '公司盆栽突然暴斃，最可能是？',
    options: ['聽太多會議自殺', '被 PowerPoint 曬傷'],
    correct: 0,
  },
  {
    id: 'fq32',
    q: '為什麼螺絲總會多一顆或少一顆？',
    options: ['螺絲有自己的工會', '組裝精靈在抽成'],
    correct: 0,
  },
  {
    id: 'fq33',
    q: '深夜加班螢幕反光裡出現臉，那是？',
    options: ['你的未來自己來催進度', '鍵盤幽靈求放假'],
    correct: 0,
  },
  {
    id: 'fq34',
    q: '「順便」兩個字在主管嘴裡等於？',
    options: ['一座小山的工作量', '真的只是順便'],
    correct: 0,
  },
  {
    id: 'fq35',
    q: '手機掉進沙發縫，沙發其實？',
    options: ['開了一間手機旅館', '在徵收保護費'],
    correct: 0,
  },
]

export function getFlipQuestion(id: string): FlipQuestion {
  return FLIP_QUESTIONS.find((q) => q.id === id) ?? FLIP_QUESTIONS[0]!
}
