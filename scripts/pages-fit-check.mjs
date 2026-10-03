/**
 * 一屏檢查：確認手機直向不出現滾輪，而且畫面上的按鈕都沒有被切到視窗外。
 *
 * 用法：
 *   npm run pages:build
 *   npx vite preview --config vite.pages.config.ts --port 4999 &
 *   node scripts/pages-fit-check.mjs
 *
 * 任何一個尺寸出現滾輪或有按鈕被切掉就會以非 0 結束，方便接進 CI。
 */
import { chromium, devices } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4999/office-drink-draw/";
const SIZES = ["iPhone SE", "iPhone 13"];

const launchOpts = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const browser = await chromium.launch(launchOpts);
let failed = false;

for (const size of SIZES) {
  const ctx = await browser.newContext({ ...devices[size] });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.click(".studio-splash").catch(() => {});
  await page.waitForTimeout(1000);

  const steps = [
    ["主選單", async () => {}],
    ["練習設定", async () => page.click(".hs-solo")],
    ["選角色", async () => page.click("text=開始練習")],
  ];

  for (const [name, act] of steps) {
    await act();
    await page.waitForTimeout(1200);
    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const clipped = [];
      for (const el of document.querySelectorAll(".screen button, .screen .btn")) {
        const r = el.getBoundingClientRect();
        if (r.height > 0 && r.bottom > window.innerHeight + 1) {
          clipped.push(((el.innerText || el.ariaLabel || "") + "").trim().slice(0, 12));
        }
      }

      // 右上角浮動的音樂鈕會蓋住畫面最上面那一列，檢查有沒有東西壓在它底下。
      // 捲動容器裡的子元素 getBoundingClientRect 會超出容器範圍但實際上被裁切掉，
      // 所以要先跟所有會裁切的祖先取交集，拿到真正畫出來的範圍。
      const painted = (el) => {
        let r = el.getBoundingClientRect();
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const ov = getComputedStyle(a);
          if (ov.overflow === "visible" && ov.overflowX === "visible") continue;
          const c = a.getBoundingClientRect();
          r = {
            left: Math.max(r.left, c.left),
            right: Math.min(r.right, c.right),
            top: Math.max(r.top, c.top),
            bottom: Math.min(r.bottom, c.bottom),
          };
        }
        return r;
      };
      const covered = [];
      const fab = document.querySelector(".music-fab");
      const fabBox = fab && fab.getBoundingClientRect();
      if (fabBox && fabBox.width > 0) {
        const pad = 4; // 音樂鈕的 box-shadow 會外擴一點
        const vw = window.innerWidth;
        for (const el of document.querySelectorAll(".screen *")) {
          const g = el.getBoundingClientRect();
          if (!g.width || !g.height || g.width > vw * 0.55) continue;
          const hasInk =
            [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) ||
            getComputedStyle(el).borderTopWidth !== "0px";
          if (!hasInk) continue;
          const r = painted(el);
          if (r.right <= r.left || r.bottom <= r.top) continue;
          if (
            r.left < fabBox.right + pad &&
            r.right > fabBox.left - pad &&
            r.top < fabBox.bottom + pad &&
            r.bottom > fabBox.top - pad
          ) {
            covered.push(((el.textContent || el.className || "") + "").trim().slice(0, 12));
          }
        }
      }

      return {
        scrollY: doc.scrollHeight > doc.clientHeight,
        scrollX: doc.scrollWidth > doc.clientWidth,
        clipped,
        covered,
      };
    });
    const bad =
      report.scrollY || report.scrollX || report.clipped.length > 0 || report.covered.length > 0;
    if (bad) failed = true;
    console.log(
      `${bad ? "FAIL" : "ok  "} ${size} · ${name}` +
        (report.scrollY ? " 縱向滾輪" : "") +
        (report.scrollX ? " 橫向滾輪" : "") +
        (report.clipped.length ? ` 被切掉的按鈕：${report.clipped.join("、")}` : "") +
        (report.covered.length ? ` 被音樂鈕蓋住：${report.covered.join("、")}` : ""),
    );
  }

  if (errors.length) {
    failed = true;
    console.log(`FAIL ${size} · JS 錯誤：${errors.slice(0, 3).join(" | ")}`);
  }
  await ctx.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
