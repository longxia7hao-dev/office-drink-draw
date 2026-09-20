# 專案共享筆記

## 專案是什麼
公司酒局 GitHub Pages 手機修正與部署，保留現有 production 功能。

## 目前狀態
- 最後更新：2026-09-20（Codex）
- Grok 於 gh-pages 部署 `5a4235a` 後，公開站真機出現「載入失敗」；已在 `codex/mobile-overhaul` 合併最新 gh-pages 後，恢復已驗證的穩定手機 hotfix，並以 fast-forward 推回 gh-pages。
- 已部署版本：e7dcce1979ad0338；恢復提交：dcaa6c6；公開報告提交待補。
- 本機重新驗證：30 項手機回歸通過、0 失敗；edge 檢查通過（Chromium/WebKit 初始工作室圖 6 張、700ms 內換幀、tap 後音訊請求 2、閒置音訊 0）。公開站 smoke 6/6 通過；HTML 與 app/css/runtime/original bundle SHA-256 確認為新部署，無舊快取。
- 工作室開場目前為短影格動畫，跑完自動進入主選單，可點擊跳過；貓叫音效保留在使用者點擊後載入／播放，符合手機瀏覽器限制。
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
- 2026-09-20｜Codex｜重新部署成功：GitHub Pages run 35501919932 成功；公開站版本 e7dcce1979ad0338，`NO_WRITE=1 node tools/check-deployment.mjs` 新版資產 hash 通過，公開 smoke 6/6 通過。
- 2026-09-20｜Codex｜Grok gh-pages 部署後真機回報載入失敗；已合併最新 gh-pages、不重寫歷史，恢復穩定手機 hotfix 與測試工具／報告／舊 bundle。本機 `npm test` 30 passed / 12 skipped，`node tools/verify-edges.mjs` 通過；準備重新部署並做公開 smoke。
- 2026-09-15｜Codex｜部署追加修正到 gh-pages：Pages Action 34932872288 成功；公開站版本 e7dcce1979ad0338，6 項公開 smoke 與資產 hash 比對全通過。多人連線狀態未改變，仍為外部後端／CORS 限制。
- 2026-09-15｜Codex｜待部署版本 e7dcce1979ad0338：手機直向首頁滿寬並允許垂直捲動；工作室恢復 8 張／8fps 短動畫與 tap 後貓叫；完整 Playwright 手機矩陣 30 passed / 0 failed / 12 skipped，edge 檢查通過。
- 2026-09-15｜Codex｜開始追加修正：手機直向首頁改為滿寬可垂直捲動，恢復低負載工作室短動畫與互動後貓叫音效。
- 2026-09-15｜Codex｜部署追加修正到 gh-pages：Pages Action 34931799890 成功；公開站版本 32e7996af5d96d41，6 項公開 smoke 與資產 hash 比對全通過。多人連線狀態未改變，仍為外部後端／CORS 限制。
- 2026-09-15｜Codex｜待部署版本 32e7996af5d96d41：移除工作室幀動畫與首頁 home-party/home-idle 動畫，首頁用柔化背景滿版並取消行動版外框；完整 Playwright 手機矩陣 30 passed / 0 failed / 12 skipped，edge 檢查通過。
- 2026-09-15｜Codex｜開始追加修正：依真機截圖與回報，移除工作室與主頁非必要幀動畫，調整首頁滿版背景，並補強動畫資源請求測試。
- 2026-09-15｜Codex｜5a2945e 以正常 fast-forward 部署 gh-pages，Pages Action 34896479112 成功；公開版本 0aca4c0401b36f66，6 項公開站 smoke 與新舊資產雜湊比對全通過。補存驗證報告，程式與資產不再變更。
- 2026-09-15｜Codex｜最終版 0aca4c0401b36f66：Chromium/WebKit 五尺寸、低動態、省流量與單機完整回合全通過；JSON、截圖與雙 context CORS/500 證據已產出。準備部署。
- 2026-09-15｜Codex｜完成 production hotfix、手機流程與 RTC 實測工具；修復觸控點擊穿透、選角重疊、房號輸入與音樂停止下載，最終驗證中。
- 2026-09-14｜Codex｜fetch、檢查提交與成功的 Pages Actions；從最新 gh-pages 建立乾淨工作分支。
