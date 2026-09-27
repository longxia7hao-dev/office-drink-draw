# 公司酒局／五告哞聊

派對喝酒遊戲。

- 倉庫：https://github.com/longxia7hao-dev/office-drink-draw
- 線上站：https://longxia7hao-dev.github.io/office-drink-draw/
- 日常改遊戲：只動 `grok-src`（工作分支，可以更新）
- `gh-pages` 是編譯後靜態站；`main` 是較舊的版本

## 上鎖還原點

### 最新可玩備份：V13.3（覆蓋 grok-src）

- 分支 [`grok-src`](https://github.com/longxia7hao-dev/office-drink-draw/tree/grok-src)
- 分支 [`v13.3`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v13.3)
- 分支 [`backup/v13.3`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v13.3)
- 標籤 [`v13.3`](https://github.com/longxia7hao-dev/office-drink-draw/releases/tag/v13.3)

V13.3 含：角色卡只留圖、名字與技能說明；補休「可免一次」改由玩家自己決定哪次免；工作室開場拉長，讀取條跑滿先出音樂，手機需點「點擊開始遊戲」；我從來沒有加入 Ready 與受罰角色圖；誰最可能不能投自己，除了本人大家都投同一人才喝。

### 仍上鎖、沒有被覆蓋

- V9.7：[`v9.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v9.7)／[`backup/v9.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v9.7)
- V6.6：[`v6.6`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v6.6)／[`backup/v6.6`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v6.6)
- V4.1：[`v4.1`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v4.1)／[`backup/v4.1`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v4.1)
- V2.7：[`v2.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v2.7)／[`backup/v2.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v2.7)
- V2.0：[`v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v2.0)／[`backup/v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v2.0)

舊版都保留。這次只更新可覆寫的 `grok-src`，並另存 V13.3。

## 遊戲壞了怎麼接回

接最新備份：

```bash
git fetch origin
git checkout v13.3
```

zip：https://github.com/longxia7hao-dev/office-drink-draw/archive/refs/tags/v13.3.zip

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
