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
      return {
        scrollY: doc.scrollHeight > doc.clientHeight,
        scrollX: doc.scrollWidth > doc.clientWidth,
        clipped,
      };
    });
    const bad = report.scrollY || report.scrollX || report.clipped.length > 0;
    if (bad) failed = true;
    console.log(
      `${bad ? "FAIL" : "ok  "} ${size} · ${name}` +
        (report.scrollY ? " 縱向滾輪" : "") +
        (report.scrollX ? " 橫向滾輪" : "") +
        (report.clipped.length ? ` 被切掉的按鈕：${report.clipped.join("、")}` : ""),
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
