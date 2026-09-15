# 專案共享筆記

## 專案是什麼
公司酒局 GitHub Pages 手機修正與部署，保留現有 production 功能。

## 目前狀態
- 最後更新：2026-09-15（Codex）
- 本機修正與驗證完成，準備提交並部署：工作室／主頁非必要幀動畫已移除，主頁局部動畫破圖與未滿版問題已修正。
- 待部署版本：32e7996af5d96d41；前一版功能提交：5a2945e2a7711cd3165b68be6d3ce4c41f9d498b；前一版公開版本：0aca4c0401b36f66。
- 30 項手機回歸通過、0 失敗；edge 檢查通過（Chromium/WebKit 初始工作室圖 1 張、閒置音訊 0）。部署後需重新執行公開站 smoke 與 SHA-256 比對。
- 公開站：https://longxia7hao-dev.github.io/office-drink-draw/；報告入口 reports/index.html。
- 多人連線仍不可用：兩個 contexts 開房／加入同房，原站 HTTP 500，Pages 跨站 CORS 拒絕；已使用明確原站導引並保留房號。這是外部後端限制，不可宣稱已修復同步。

## 睿哥的指示與決策
- 不使用舊 main 覆蓋 gh-pages；不 force push、不刪舊 bundle。
- Chromium / WebKit 手機模擬與多人連線實測後才部署。

## 踩坑與注意事項
- 已檢查 refs、提交、Actions artifacts、source map 與本機常用專案目錄，未找到對應新版原始碼；採用 hash 驗證、只修改頂層 app 函式的可重建 production hotfix。
- 兩個獨立 browser contexts 實測 Pages→Grok GET/POST 均被 CORS 阻擋；原站開房／加入同房 signaling 回傳 HTTP 500，名單／選角／回合同步無法完成。證據在 reports/multiplayer/。
- 最終測試：30 passed / 0 failed；12 skipped 為相同的連線故障案例避免在每尺寸重跑（兩個引擎各驗證一次）。省流量服務快取設定已比照 GitHub Pages，測試通過。
- 僅 Playwright 手機模擬，沒有真機測試。
- 未發布的中間版 bundle 移至 /tmp/office-drink-draw-intermediate；原部署資產完全保留。

## 變更日誌（新的在上）
- 2026-09-15｜Codex｜待部署版本 32e7996af5d96d41：移除工作室幀動畫與首頁 home-party/home-idle 動畫，首頁用柔化背景滿版並取消行動版外框；完整 Playwright 手機矩陣 30 passed / 0 failed / 12 skipped，edge 檢查通過。
- 2026-09-15｜Codex｜開始追加修正：依真機截圖與回報，移除工作室與主頁非必要幀動畫，調整首頁滿版背景，並補強動畫資源請求測試。
- 2026-09-15｜Codex｜5a2945e 以正常 fast-forward 部署 gh-pages，Pages Action 34896479112 成功；公開版本 0aca4c0401b36f66，6 項公開站 smoke 與新舊資產雜湊比對全通過。補存驗證報告，程式與資產不再變更。
- 2026-09-15｜Codex｜最終版 0aca4c0401b36f66：Chromium/WebKit 五尺寸、低動態、省流量與單機完整回合全通過；JSON、截圖與雙 context CORS/500 證據已產出。準備部署。
- 2026-09-15｜Codex｜完成 production hotfix、手機流程與 RTC 實測工具；修復觸控點擊穿透、選角重疊、房號輸入與音樂停止下載，最終驗證中。
- 2026-09-14｜Codex｜fetch、檢查提交與成功的 Pages Actions；從最新 gh-pages 建立乾淨工作分支。
