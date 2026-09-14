# 公司酒局：GitHub Pages production hotfix

公開站：https://longxia7hao-dev.github.io/office-drink-draw/

## 版本來源與維護

此分支以 `gh-pages` 的 `0042c6d7cba0e211f06da5aa8ea6f5a05aee3a9d` 為基底。
已檢查遠端所有分支、提交、Pages Actions 與產物：`main` 是另一個較舊版本，最新 Actions 只有 Pages 靜態產物，沒有對應新版原始碼或 source map。原 Grok 站公開的也是編譯產物。本機常用專案位置未找到對應來源。

因此採用可重建的 production hotfix，**不可用 main build 覆蓋此版本**。
`tools/build-hotfix.mjs` 驗證原 bundle SHA-256，再對指定的頂層應用函式做明確替換。
React/vendor、題庫、規則與角色資料保留原版。遇到基底 hash 或 patch anchor 改變時會停止建置。

原有 `assets/index-B-oJsHNQ.js`、`assets/index-C-opy5tM.css` 和所有美術／音訊資產完整保留。
新 JS、CSS 和啟動 runtime 採內容雜湊檔名，`version.json` 與 HTML 的 `odd-version` 可核對版本。

## 本機驗證

```sh
npm ci
npx playwright install chromium webkit
npm run build
npm run serve
# 另一個 terminal
npm test
npm run test:multiplayer
```

`npm test` 產生 `reports/mobile-results.json` 與 `reports/screenshots/`。
測試使用真實 UI 操作，不透過改寫遊戲 store 跳過設定、選角或結算。
尺寸：360×640、375×667、393×852、412×915、768×1024，各跑 Chromium 與 WebKit。
另測兩種引擎的 reduced-motion 與 saveData/2G，並在流程尾端改變視窗高度及轉橫向。

省流量測試同時注入 Network Information API 的 `saveData=true/effectiveType=2g` 和 Save-Data HTTP header。
Chromium 使用 CDP 節流（250 KiB/s、300 ms）；WebKit 使用圖片請求延遲（WebKit 不提供相同 CDP 節流 API）。這是 saveData／effectiveType=2g 條件模擬，並非真實 2G 電信網路量測。
這是 **Playwright 手機模擬測試，不是實體 iPhone、Android 或 iPad 真機測試**；網址列伸縮以 viewport 高度改變模擬。

## 多人連線

2026-09-14 及 2026-09-15 實測：從真正的 GitHub Pages origin，以兩個獨立 Chromium contexts 發送 GET／POST，均遭 CORS 阻擋。
在原 Grok 站分別以房主、玩家開房及加入同一房間，其 `/api/rtc` 回傳 HTTP 500。
因此未完成名單、角色或一輪遊戲同步，**不能宣稱多人連線可用**。
完整證據：`reports/multiplayer/results.json` 和兩個 context 的畫面。

GitHub Pages 預設顯示說明與原站連結，保留 URL `?room=` 及輸入的房號，並提供單機練習入口。
原 Grok 站本身也可能持續故障，此 repository 無法修復它的後端。

`config.js` 的 `signalingEndpoint` 可由維護者設定為自己可信任的 HTTPS signaling 服務。
服務必須實作原 RTC 協定，允許本網站 Origin 的 GET、POST 與 content-type 預檢。
沒有第三方代理、沒有公開憑證。每次 HTTP 請求 6 秒逾時，持續失敗約 10 秒停止，加入者等待 peer 約 15 秒顯示錯誤。
`configured endpoint` 自動測試是本機模擬 503 故障，**不是成功的多人連線測試**。

## 部署與復原

先完成 `npm test`，再確認 `origin/gh-pages` 未被其他人更新，以正常 push 做 fast-forward。
不得 force push，也不刪除舊 bundle。部署後核對 Actions、公開 HTML 的版本及三個新資產的 SHA-256，再執行公開站 smoke test。
若需復原，對本次 deployment commit 使用 `git revert <deployment-commit>`，建立新提交並正常推送；不要 reset 或重寫 gh-pages 歷史。

## 已完成的發布驗證（2026-09-15）

功能提交：`5a2945e2a7711cd3165b68be6d3ce4c41f9d498b`，公開版本：`0aca4c0401b36f66`。
30 項手機回歸通過（12 項重複故障案例略過），雙引擎啟動邊界檢查通過。
部署後直接對 GitHub Pages 執行的 6 項 Chromium/WebKit smoke tests 全通過。
公開 HTML 的普通 URL 和 cache-busting URL 均回傳新版本；新 JS、CSS、runtime 與保留的兩個舊 bundle 全部通過 SHA-256 比對。
報告入口：`reports/index.html`；公開站檢查：`reports/public-smoke.json`、`reports/deployment-check.json`。
