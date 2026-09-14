import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const screenshots=process.env.SCREENSHOT_DIR||'reports/screenshots';
test.beforeEach(async({context,page},info)=>{
  if(info.project.name.includes('save-data')) {
    await context.addInitScript(()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true,effectiveType:'2g',addEventListener(){}}}));
    await context.setExtraHTTPHeaders({'Save-Data':'on'});
    // Both engines get real latency; Chromium additionally receives network throttling.
    if(info.project.use.browserName==='chromium') {
      const cdp=await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:300,downloadThroughput:250*1024,uploadThroughput:50*1024});
    } else await context.route('**/art/**',async route=>{await new Promise(r=>setTimeout(r,300));await route.continue();});
  }
});
async function shot(page,info,name){await mkdir(screenshots,{recursive:true});await page.screenshot({path:`${screenshots}/${info.project.name}-${name}.png`,fullPage:true});}
async function noOverflow(page){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
async function inputs(page){
  expect(await page.locator('input,select,textarea').evaluateAll(els=>els.every(el=>parseFloat(getComputedStyle(el).fontSize)>=16))).toBe(true);
}
async function poster(page){
  await expect(page.locator('.home-poster')).toBeVisible();
  await expect.poll(()=>page.locator('.home-poster').evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
  const geometry=await page.locator('.home-poster-wrap').evaluate(e=>{
    const r=e.getBoundingClientRect(),im=e.querySelector('img').getBoundingClientRect();
    return {inside:r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,ratio:r.width/r.height,aligned:Math.abs(r.width-im.width)<1&&Math.abs(r.height-im.height)<1};
  });
  expect(geometry.inside).toBe(true);expect(geometry.aligned).toBe(true);expect(geometry.ratio).toBeCloseTo(750/1584,3);
  for(const button of await page.locator('.hs').all()) {
    const box=await button.boundingBox();expect(box.width).toBeGreaterThan(0);expect(box.height).toBeGreaterThan(0);
    expect(await button.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})).toBe(true);
  }
  await noOverflow(page);
}
test('home, every hotspot, overlays, solo setup/roles/full round, resize',async({page},info)=>{
  const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  await page.goto('./',{waitUntil:'domcontentloaded'});
  // The deadline is relative to splash mount, not slow network delivery of the application script.
  await expect(page.locator('.hs-solo')).toBeVisible({timeout:20000});
  await poster(page);await inputs(page);
  expect(requests.filter(u=>u.includes('/audio/'))).toHaveLength(0);
  expect(requests.filter(u=>u.includes('/art/roles/'))).toHaveLength(0);
  expect(new Set(requests.filter(u=>u.includes('/studio/f'))).size).toBeLessThan(30);
  expect(new Set(requests.filter(u=>u.includes('/home-idle/'))).size).toBeLessThan(24);
  if(/save-data|reduced-motion/.test(info.project.name)) expect(new Set(requests.filter(u=>u.includes('/home-idle/'))).size).toBeLessThanOrEqual(1);
  const viewport=await page.locator('meta[name=viewport]').getAttribute('content');
  expect(viewport).not.toContain('user-scalable=no');expect(viewport).not.toContain('maximum-scale');
  await shot(page,info,'home');
  await page.locator('.hs-music').tap();
  for(const [selector,title] of [['.hs-board','排行榜'],['.hs-set','設定'],['.hs-packs','題庫'],['.hs-roles','全角色'],['.hs-rules','怎麼玩']]) {
    await page.locator(selector).tap();await expect(page.locator('.screen')).toContainText(title);
    await noOverflow(page);await inputs(page);await shot(page,info,selector.slice(4));
    await page.getByRole('button',{name:'返回',exact:true}).click();await poster(page);
  }
  for(const selector of ['.hs-host','.hs-join']) {
    await page.locator(selector).tap();await expect(page.locator('.screen')).toContainText('GitHub Pages');
    await page.locator('#online-room').fill('AB12');await inputs(page);
    await expect(page.getByRole('link',{name:/前往原 Grok/})).toHaveAttribute('href','https://monarch-finch-forge-summit.grok.me/?room=AB12');
    await page.getByRole('button',{name:'返回',exact:true}).click();
  }
  await page.locator('.hs-solo').tap();await page.getByRole('textbox',{name:'你的暱稱'}).fill('手機測試');await inputs(page);
  await page.getByRole('button',{name:'2 位',exact:true}).click();await page.getByRole('button',{name:'罰一分',exact:true}).click();
  await page.getByRole('button',{name:'開始練習',exact:true}).click();
  await expect(page.getByRole('button',{name:'選定：主管',exact:true})).toBeVisible();
  expect(await page.locator('.role-hero').evaluate(e=>{
    const parts=['.hero-stage','.hero-name','.hero-tag','.hero-bio','.hero-skill'].map(s=>e.querySelector(s).getBoundingClientRect());
    return parts.every((r,i)=>i===0||r.top>=parts[i-1].bottom-1);
  })).toBe(true);
  await page.getByRole('button',{name:'選定：主管',exact:true}).click();
  await shot(page,info,'pick-role');
  await page.getByRole('button',{name:'鎖定角色',exact:true}).click();await noOverflow(page);
  await page.getByRole('button',{name:'選模式',exact:true}).click();await poster(page);await shot(page,info,'modes');
  await page.getByRole('button',{name:'多數決',exact:true}).tap();await poster(page);
  await page.getByRole('button',{name:'全部混搭',exact:true}).tap();
  await page.locator('.flip-card-3d').first().click();
  await expect(page.locator('.flip-result')).toBeVisible();await noOverflow(page);await shot(page,info,'round-result');
  await page.getByRole('button',{name:'下一題',exact:true}).click();await expect(page.locator('.flip-card-3d').first()).toBeEnabled();
  await page.getByRole('button',{name:'換模式',exact:true}).click();await page.getByRole('button',{name:'今晚結算',exact:true}).tap();
  await page.getByRole('button',{name:'回首頁',exact:true}).click();await poster(page);
  const {width,height}=info.project.use.viewport;
  await page.setViewportSize({width,height:height-90});await poster(page);
  await page.setViewportSize({width:height,height:width});await poster(page);
  await expect(page.locator('#landscape-hint')).toBeVisible();await shot(page,info,'landscape');
  expect(errors).toEqual([]);await expect(page.locator('#load-error')).toBeHidden();
});
test('configured endpoint fails within deadline and single-player remains usable',async({page,context},info)=>{
  test.skip(!['chromium-360x640','webkit-375x667'].includes(info.project.name),'Network fault test runs once per engine');
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/config.js',route=>route.fulfill({contentType:'text/javascript',body:"window.ODD_CONFIG={signalingEndpoint:location.origin+'/office-drink-draw/test-rtc'};"}));
  await context.route('**/test-rtc**',route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"test outage"}'}));
  await page.goto('./');await page.locator('.hs-host').waitFor();await page.locator('.hs-host').tap();
  await page.getByRole('button',{name:'開房',exact:true}).click();
  await expect(page.locator('.error-banner')).toContainText('連線失敗',{timeout:14000});
  await expect(page.locator('.screen')).toContainText('連線：連線失敗');
  await shot(page,info,'connection-error');
  await page.getByRole('button',{name:'返回',exact:true}).click();await page.locator('.hs-solo').tap();
  await expect(page.getByRole('button',{name:'開始練習',exact:true})).toBeVisible();expect(errors).toEqual([]);
});
test('startup skip/deadline, bounded preload, failure/reload and room deep link',async({page,context},info)=>{
  await context.route('**/art/ui/studio/**',route=>route.abort());
  await page.goto('./',{waitUntil:'domcontentloaded'});
  if(!/save-data|reduced-motion/.test(info.project.name)) {
    await page.locator('.studio-splash').waitFor();const start=Date.now();
    await page.locator('.studio-splash').tap();await expect(page.locator('.hs-solo')).toBeVisible();expect(Date.now()-start).toBeLessThan(1500);
    await page.reload({waitUntil:'domcontentloaded'});await page.locator('.studio-splash').waitFor();const deadline=Date.now();
    await expect(page.locator('.hs-solo')).toBeVisible();expect(Date.now()-deadline).toBeLessThan(2400);
  }
  await context.route('**/art/ui/home-poster.jpg',route=>route.abort());
  await page.reload({waitUntil:'domcontentloaded'});await expect(page.locator('#load-error')).toBeVisible({timeout:20000});
  await context.unroute('**/art/ui/home-poster.jpg');await page.getByRole('button',{name:'重新載入',exact:true}).click();
  await expect(page.locator('.hs-solo')).toBeVisible({timeout:20000});await expect(page.locator('#load-error')).toBeHidden();
  await page.goto('./?room=ZX90');await expect(page.locator('#online-room')).toHaveValue('ZX90',{timeout:20000});
  await expect(page.getByRole('link',{name:/前往原 Grok/})).toHaveAttribute('href','https://monarch-finch-forge-summit.grok.me/?room=ZX90');
});
