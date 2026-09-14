import {chromium,webkit,expect} from '@playwright/test';
import {writeFile,readFile} from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:4173/office-drink-draw/';
const report={version:JSON.parse(await readFile('version.json','utf8')).version,base,timestamp:new Date().toISOString(),results:[]};
for(const engine of [chromium,webkit]) {
  const browser=await engine.launch();const context=await browser.newContext({viewport:{width:375,height:667},isMobile:true,hasTouch:true});
  const page=await context.newPage(),requests=[];
  page.on('request',r=>requests.push(r.url()));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.locator('.studio-splash').waitFor();
  const initialFrames=new Set(requests.filter(u=>u.includes('/studio/f'))).size;
  expect(initialFrames).toBeLessThanOrEqual(6);
  await page.locator('.studio-splash').press('Enter');
  await expect(page.locator('.hs-solo')).toBeVisible();
  const audioBeforeOtherInteraction=requests.filter(u=>u.includes('/audio/')).length;
  // The trusted Enter key is an audio-unlocking interaction. A separate idle navigation must fetch none.
  await page.reload({waitUntil:'domcontentloaded'});requests.length=0;
  await expect(page.locator('.hs-solo')).toBeVisible();await page.waitForTimeout(1000);
  expect(requests.filter(u=>u.includes('/audio/'))).toHaveLength(0);
  await context.route('**/assets/mobile-*.js',r=>r.abort());
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#load-error')).toBeVisible();
  await context.unroute('**/assets/mobile-*.js');
  await page.getByRole('button',{name:'重新載入',exact:true}).click();
  await expect(page.locator('.hs-solo')).toBeVisible();await expect(page.locator('#load-error')).toBeHidden();
  report.results.push({engine:engine.name(),initialIntroFrames:initialFrames,keyboardSkip:true,idleAudioRequests:0,scriptFailureAndReload:true,audioRequestsAfterTrustedEnter:audioBeforeOtherInteraction});
  await browser.close();
}
await writeFile('reports/edge-results.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
