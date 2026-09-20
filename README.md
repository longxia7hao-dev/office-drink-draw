# 公司酒局／五告哞聊

派對喝酒遊戲 **V2.0** 正式備份。

- 倉庫：https://github.com/longxia7hao-dev/office-drink-draw
- 線上站：https://longxia7hao-dev.github.io/office-drink-draw/
- 凍結標籤／分支：`v2.0`（這版請當還原點，不要覆寫）
- 日常原始碼：`grok-src`
- `gh-pages` 是編譯後靜態站；`main` 是較舊的版本

## V2.0 有什麼

- 11 角色（含秘書、老鳥）＋定稿技能，輸了才出現「使用技能」
- 二選一 16 題，每題換懲罰條件（多數／少數／落單 ×2／全員同一邊 ×2）
- 反應挑戰 60 拍、2 秒起跳 −0.1 秒、最快 0.8 秒；色卡＋進階貓／狗／牛
- 對對消 8／12／16 對，哞聊貓卡背，每局限換一次
- 最雷／最強頒獎
- 記分板顯示下次 ×2、免罰、補休、擋酒

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

## 還原

接回這版請用 tag `v2.0` 或分支 `v2.0`：

```bash
git fetch origin
git checkout v2.0
```
