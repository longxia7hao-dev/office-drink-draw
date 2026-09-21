# 公司酒局／五告哞聊

派對喝酒遊戲。倉庫裡有兩個**已上鎖、不能覆寫**的還原點。

- 倉庫：https://github.com/longxia7hao-dev/office-drink-draw
- 線上站：https://longxia7hao-dev.github.io/office-drink-draw/
- 日常改遊戲：只動 `grok-src`（工作分支，可以更新）
- `gh-pages` 是編譯後靜態站；`main` 是較舊的版本

## 上鎖還原點

### 最新：V2.7（現在這包）

- 分支 [`v2.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v2.7)
- 分支 [`backup/v2.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v2.7)（第二份相同快照）
- 標籤 [`v2.7`](https://github.com/longxia7hao-dev/office-drink-draw/releases/tag/v2.7)

V2.7 比 V2.0 多了：你提供的 11 張角色立繪（去背、不另加白邊）、選角全員卡片、立繪放大＋名字上移、懲罰粉紅框不被裁、積分列一次排開。

### 更早：V2.0（仍然上鎖）

- 分支 [`v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v2.0)
- 分支 [`backup/v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v2.0)
- 標籤 [`v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/releases/tag/v2.0)
- 凍結 commit：`9c558271`

請不要關掉 GitHub 規則「Freeze V2.0 …」與「Freeze V2.7 …」。關掉就等於把保險拆掉。

## V2.7／V2.0 共同有的

- 11 角色＋定稿技能，輸了才出現「使用技能」
- 二選一 16 題，每題換懲罰條件（多數／少數／落單 ×2／全員同一邊 ×2）
- 反應挑戰 60 拍、2 秒起跳 −0.1 秒、最快 0.8 秒
- 對對消 8／12／16 對，哞聊貓卡背
- 最雷／最強頒獎

## 開發

```bash
npm i
npm run dev
```

GitHub Pages 建置：

```bash
npm run pages:build
```

輸出在 `dist-pages/`，可直接放到 `gh-pages`。

## 遊戲壞了怎麼接回

接**最新可玩備份**用 `v2.7`：

```bash
git fetch origin
git checkout v2.7
```

zip：https://github.com/longxia7hao-dev/office-drink-draw/archive/refs/tags/v2.7.zip

若要更早那一版，改 checkout／下載 `v2.0`。不要用被改過的 `grok-src`。
