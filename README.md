# 公司酒局／五告哞聊

派對喝酒遊戲。

- 倉庫：https://github.com/longxia7hao-dev/office-drink-draw
- 線上站：https://longxia7hao-dev.github.io/office-drink-draw/
- 日常改遊戲：只動 `grok-src`（工作分支，可以更新）
- `gh-pages` 是編譯後靜態站；`main` 是較舊的版本

## 上鎖還原點

### 最新可玩備份：V9.7（覆蓋 grok-src）

- 分支 [`grok-src`](https://github.com/longxia7hao-dev/office-drink-draw/tree/grok-src)
- 分支 [`v9.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v9.7)
- 分支 [`backup/v9.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v9.7)
- 標籤 [`v9.7`](https://github.com/longxia7hao-dev/office-drink-draw/releases/tag/v9.7)

V9.7 含：角色技能（摸魚加倍、新人指派、能者多勞、替你擋酒可選一次、緊急備援分攤、風險對沖連罰轉給別人）、記分板狀態、二選一／誰最可能／真心話可放技能、色卡一般與進階分開、對對碰調換在牌不夠時停用、iPhone X 不捲動、連線準備 READY 噴漆。

### 仍上鎖、沒有被覆蓋

- V6.6：[`v6.6`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v6.6)／[`backup/v6.6`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v6.6)
- V4.1：[`v4.1`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v4.1)／[`backup/v4.1`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v4.1)
- V2.7：[`v2.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v2.7)／[`backup/v2.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v2.7)
- V2.0：[`v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v2.0)／[`backup/v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v2.0)

V2.0、V2.7 有 GitHub 規則鎖住，不能覆寫。V4.1、V6.6 這次也保留。只覆蓋可更新的 `grok-src`，並另存 V9.7。

## 遊戲壞了怎麼接回

接最新備份：

```bash
git fetch origin
git checkout v9.7
```

zip：https://github.com/longxia7hao-dev/office-drink-draw/archive/refs/tags/v9.7.zip

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
