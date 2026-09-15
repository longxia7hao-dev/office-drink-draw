# 公司酒局 Office Drink Draw（Grok 原始碼）

派對喝酒遊戲。線上站：https://longxia7hao-dev.github.io/office-drink-draw/

這個分支 `grok-src` 才是 React + Vite 原始碼。`gh-pages` 只有編譯後的靜態檔，`main` 是較舊的版本。

## 開發

```bash
npm i
npm run dev
```

GitHub Pages 建置：

```bash
npm run pages:build
```

輸出在 `dist-pages/`，內容就是可以直接放上 `gh-pages` 的完整站台：
`%BASE_URL%` 由 Vite 的 `base` 換成 `/office-drink-draw/`，建置時另外自動產生
`.nojekyll`（站上有 `__grok/` 這種底線開頭的目錄，少了它 Jekyll 會整個忽略）
與 `404.html`（SPA fallback，內容同 `index.html`）。

## 產品重點

- 手機直向、不出現滾輪、一屏完整顯示
- 4 大模式：多數決、指人票選、真心話/喝、反應挑戰；可插混亂事件
- 懲罰由房主在開局時選，文案一律套用該懲罰詞（不寫死「喝一杯」）
- 1200 題／12 類；模式與題庫由房主選
- 練習模式是電腦模擬
- 角色自選，已選不能重複
- 工作室開場 MP4 自動播（iPhone 不要播放鍵）
- 主選單滿版海報；右邊沙發微微往復；左邊三個按鈕上的人不要動
- 音樂進遊戲就播

## 部署

推到 `gh-pages` 分支即可上線。不要 force push 刪歷史。
