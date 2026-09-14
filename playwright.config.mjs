import {defineConfig} from '@playwright/test';
const sizes=[[360,640],[375,667],[393,852],[412,915],[768,1024]];
const projects=['chromium','webkit'].flatMap(browserName=>[
  ...sizes.map(([width,height])=>({name:`${browserName}-${width}x${height}`,use:{browserName,viewport:{width,height},isMobile:true,hasTouch:true}})),
  {name:`${browserName}-reduced-motion`,use:{browserName,viewport:{width:375,height:667},isMobile:true,hasTouch:true,reducedMotion:'reduce'}},
  {name:`${browserName}-save-data-2g`,use:{browserName,viewport:{width:360,height:640},isMobile:true,hasTouch:true}}
]);
export default defineConfig({
  testDir:'tests',timeout:60000,expect:{timeout:10000},workers:2,fullyParallel:true,
  reporter:[['list'],['json',{outputFile:process.env.REPORT_FILE||'reports/mobile-results.json'}]],
  use:{baseURL:process.env.BASE_URL||'http://127.0.0.1:4173/office-drink-draw/',trace:'retain-on-failure'},projects
});
