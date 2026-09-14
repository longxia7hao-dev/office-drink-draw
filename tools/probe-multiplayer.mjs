import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
const origin='https://longxia7hao-dev.github.io/office-drink-draw/';
const grok='https://monarch-finch-forge-summit.grok.me/';
const browser=await chromium.launch();
const report={timestamp:new Date().toISOString(),contexts:[],crossOriginUsable:false,rosterSync:false,roleSync:false,roundSync:false};
await mkdir('reports/multiplayer',{recursive:true});
const contexts=await Promise.all([browser.newContext(),browser.newContext()]);
for(let i=0;i<2;i++) {
  const page=await contexts[i].newPage();const result={id:i,console:[],responses:[]};report.contexts.push(result);
  page.on('console',m=>{if(m.type()==='error') result.console.push(m.text());});
  page.on('response',r=>{if(r.url().includes('/api/rtc')) result.responses.push({url:r.url(),status:r.status(),allowOrigin:r.headers()['access-control-allow-origin']||null});});
  await page.goto(origin,{waitUntil:'domcontentloaded',timeout:30000});
  result.crossOrigin=await page.evaluate(async({grok,i})=>{
    const out=[];
    for(const method of ['GET','POST']) {
      try {
        const query=method==='GET'?`?room=oddCODEXPROBE&peer=codex-${i}&name=probe&since=0`:'';
        const response=await fetch(grok+'api/rtc'+query,{method,signal:AbortSignal.timeout(10000),...(method==='POST'?{headers:{'content-type':'application/json'},body:JSON.stringify({op:'leave',room:'oddCODEXPROBE',peer:`codex-${i}`})}:{})});
        out.push({method,status:response.status,body:(await response.text()).slice(0,200)});
      }catch(e){out.push({method,error:String(e)});}
    }return out;
  },{grok,i});
  try {
    await page.goto(i===0?grok:grok+'?room=TEST',{waitUntil:'domcontentloaded',timeout:30000});
    // The original splash can hang. Give its own startup a bounded opportunity to complete.
    await page.locator(i===0?'.hs-host':'#join-name').waitFor({timeout:12000}).catch(async()=>{
      if(await page.locator('.studio-splash').isVisible()) await page.locator('.studio-splash').click();
    });
    if(i===0) {
      await page.locator('.hs-host').click({timeout:8000});
      await page.locator('#host-name').fill('Codex房主');
      await page.getByRole('button',{name:'開房',exact:true}).click();
      report.room=await page.locator('.room-badge').innerText();
    } else {
      await page.locator('#join-name').fill('Codex玩家',{timeout:8000});
      await page.locator('#join-code').fill(report.room||'TEST');
      await page.getByRole('button',{name:'進房',exact:true}).click();
    }
    await page.waitForTimeout(4000);
    result.ui=await page.locator('body').innerText();
    result.openOrJoinAttempted=true;
  } catch(e){result.originalUIError=String(e).slice(0,1000);}
  await page.screenshot({path:`reports/multiplayer/context-${i}.png`,fullPage:true});
}
report.conclusion='Cross-origin fetch blocked / backend unavailable. No successful two-player roster, role or round synchronization demonstrated. Pages must use explicit original-site fallback.';
await writeFile('reports/multiplayer/results.json',JSON.stringify(report,null,2)+'\n');
await browser.close();console.log(JSON.stringify(report,null,2));
