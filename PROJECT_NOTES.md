# 專案共享筆記

## 專案是什麼
公司酒局 GitHub Pages 手機修正與部署，保留現有 production 功能。

## 目前狀態
- 最後更新：2026-09-15（Codex）
- 進行中：Codex 在 codex/mobile-overhaul，基底 0042c6d；手機、載入與連線 fallback 已修正；最終版本 0aca4c0401b36f66 已通過 30 項測試及雙引擎啟動邊界檢查，準備正常 fast-forward 部署，尚未完成公開站 smoke。

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
- 2026-09-15｜Codex｜最終版 0aca4c0401b36f66：Chromium/WebKit 五尺寸、低動態、省流量與單機完整回合全通過；JSON、截圖與雙 context CORS/500 證據已產出。準備部署。
- 2026-09-15｜Codex｜完成 production hotfix、手機流程與 RTC 實測工具；修復觸控點擊穿透、選角重疊、房號輸入與音樂停止下載，最終驗證中。
- 2026-09-14｜Codex｜fetch、檢查提交與成功的 Pages Actions；從最新 gh-pages 建立乾淨工作分支。
