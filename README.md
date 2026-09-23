# 公司酒局／五告哞聊

派對喝酒遊戲。

- 倉庫：https://github.com/longxia7hao-dev/office-drink-draw
- 線上站：https://longxia7hao-dev.github.io/office-drink-draw/
- 日常改遊戲：只動 `grok-src`（工作分支，可以更新）
- `gh-pages` 是編譯後靜態站；`main` 是較舊的版本

## 上鎖還原點

### 最新可玩備份：V4.1（覆蓋 grok-src）

- 分支 [`grok-src`](https://github.com/longxia7hao-dev/office-drink-draw/tree/grok-src)
- 分支 [`v4.1`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v4.1)
- 分支 [`backup/v4.1`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v4.1)
- 標籤 [`v4.1`](https://github.com/longxia7hao-dev/office-drink-draw/releases/tag/v4.1)

V4.1 含：選角對話框固定右上、模式縮圖（上 2／下 2）、對對碰 4×4／6×4／6×6、色卡每次打亂、牌面預載、開局拉霸抽先手。

### 仍上鎖、沒有被覆蓋

- V2.7：[`v2.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v2.7)／[`backup/v2.7`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v2.7)
- V2.0：[`v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v2.0)／[`backup/v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v2.0)

這兩個有 GitHub 規則鎖住，不能覆寫。這次只覆蓋可更新的 `grok-src`，並另存 V4.1。

## 遊戲壞了怎麼接回

接最新備份：

```bash
git fetch origin
git checkout v4.1
```

zip：https://github.com/longxia7hao-dev/office-drink-draw/archive/refs/tags/v4.1.zip

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
