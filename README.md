# 公司酒局 Office Drink Draw

美式嘻哈街頭塗鴉風格的上班族抽籤喝酒遊戲（成人派對向）。

- 單機（一台手機傳著玩）開箱即用  
- 連線房間：房主開房碼，其他人加入，狀態同步  
- 角色技能、儀式感揭示、四種模式（含翻牌對戰）  

> 請理性飲酒。未滿法定飲酒年齡請勿使用。

---

## 藝術風格

**美式嘻哈街頭塗鴉（American hip-hop street graffiti）**  
噴漆滴流、磚牆／瀝青底、粗體街頭字、貼紙按鈕、霓虹／馬克筆高光。角色為街頭風辦公室誇張卡通，不是美漫線稿、也不是奇幻風。

---

## 怎麼玩（單機，免設定）

1. 用手機瀏覽器打開網站（或本機預覽）。
2. 點 **「單機開打」** → 輸入 2–12 人暱稱 → 鎖定陣容。
3. 看角色卡 → 選模式：
   - **抽一位喝酒**：公平亂數（seed）＋大揭示＋可發動技能  
   - **喝杯順序**：排出乾杯順序  
   - **分隊乾杯**：隨機兩隊互敬  
   - **翻牌對戰**：無厘頭題目 → 蓋牌 3 秒翻開 → 選一邊；選錯的喝；全員按「下一題」才進下一題  
4. 中籤後依角色技能互動（打小報告、老闆發話、喊救命…）。

---

## 角色一覽

| 角色 | 喝酒 | 技能 |
|------|------|------|
| 主管 | 1 | 打小報告：指定上班族喝 2 |
| 上班族 | 1 | （無特殊技能） |
| 老闆 | 1 | 全場喝 1，或指定一人喝 2 |
| 實習生 | 半杯或 1 | 喊救命：整場可傳一次 |
| 業務 | 1 | 請客：指定一人跟你各喝 1 |
| 人資 | 1 | 調職：互換或全體重抽 |
| 會計 | 1 | 報帳：指定多喝 1，自己半杯 |
| 工程師 | 1 | 緊急上線：自己喝 1，可讓一人下輪免抽 |
| 加班狗 | 2 | 加班：喝 2，下輪免抽 |

---

## 本機開發

```bash
npm install
npm run dev          # 前端 http://localhost:5173/office-drink-draw/
npm run build        # 產出 dist/
npm run preview      # 預覽正式建置
```

### 連線房間（可選）

房間需要一台跑 WebSocket 的電腦（房主裝置當權威）：

```bash
# 終端機 A：房間伺服器（預設埠 8787）
npm run server

# 終端機 B：前端
cp .env.example .env
# 編輯 .env：VITE_WS_URL=ws://你的電腦區網IP:8787
npm run dev
```

或一次開兩個：

```bash
npm run start:all
```

1. 房主點 **「開房間」** → 取得 4 碼房間碼。  
2. 其他人點 **「加入房間」**（或打開帶 `?room=ABCD` 的網址）。  
3. 房主按開始發角色；之後只有房主按抽籤，其他人畫面同步。

> GitHub Pages **只有靜態檔**，單機模式可直接玩；連線模式請自架 `npm run server`（或把 8787 反代成 `wss://` 並設定 `VITE_WS_URL`）。

---

## 部署到 GitHub Pages

本專案 `vite.config.ts` 的 `base` 預設為 `/office-drink-draw/`。

### 方法 A：用 gh-pages 分支

```bash
npm run build
# 把 dist/ 內容推到 gh-pages 分支
npx gh-pages -d dist
```

在 GitHub → Settings → Pages → Source 選 **gh-pages** 分支。

網站：`https://longxia7hao-dev.github.io/office-drink-draw/`

### 方法 B：GitHub Actions（可自行加 workflow）

建置指令：`VITE_BASE=/office-drink-draw/ npm run build`，上傳 `dist/`。

若要改連線伺服器位址，建置前設定：

```bash
VITE_WS_URL=wss://你的房間伺服器 npm run build
```

---

## 技術摘要

- Vite + TypeScript（vanilla）
- Seed-first Mulberry32 RNG，房主為權威
- `/server` 輕量 WebSocket 轉發（roster + sync）
- 手機直向 9:16 友善、大按鈕、揭示動畫

---

## 指令速查

| 指令 | 說明 |
|------|------|
| `npm run dev` | 本機前端 |
| `npm run build` | 正式建置（需通過） |
| `npm run server` | 房間 WebSocket |
| `npm run preview` | 預覽 dist |
