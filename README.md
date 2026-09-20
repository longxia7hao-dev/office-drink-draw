# 公司酒局／五告哞聊

派對喝酒遊戲 **V2.0** 正式備份。**這份備份已上鎖，不能被覆寫。**

- 倉庫：https://github.com/longxia7hao-dev/office-drink-draw
- 線上站：https://longxia7hao-dev.github.io/office-drink-draw/
- **凍結還原點（禁止推送、強制覆蓋、刪除）**
  - 分支 [`v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/tree/v2.0)
  - 分支 [`backup/v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/tree/backup/v2.0)（第二份相同快照）
  - 標籤 [`v2.0`](https://github.com/longxia7hao-dev/office-drink-draw/releases/tag/v2.0)
  - 凍結 commit：`9c558271`
- 日常改遊戲：只動 `grok-src`（工作分支，可以更新）
- `gh-pages` 是編譯後靜態站；`main` 是較舊的版本

請不要關掉 GitHub 規則「Freeze V2.0 backup branches」與「Freeze V2.0 tag」。關掉就等於把保險拆掉。

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

## 遊戲壞了怎麼接回

用凍結的 tag／分支 `v2.0`，**不要**用被改過的 `grok-src`：

```bash
git fetch origin
git checkout v2.0
```

或直接下載這包 zip：https://github.com/longxia7hao-dev/office-drink-draw/archive/refs/tags/v2.0.zip
