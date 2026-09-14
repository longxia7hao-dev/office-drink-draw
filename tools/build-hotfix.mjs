// Reproducible surgical patch of the immutable 0042c6d production bundle.
// main is a different, older application. Never rebuild this deployment from main.
import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {format} from 'prettier';
import {transform} from 'esbuild';
const hash = s => createHash('sha256').update(s).digest('hex');
const original = await readFile('assets/index-B-oJsHNQ.js', 'utf8');
if(hash(original)!=='a204d113582da84efdec0731a669447669f76bae73c2eeba1ce39dd33f18dac6') throw Error('Production baseline changed; review patches before rebuilding');
let app = await format(original, {parser:'babel'});
const vendorPrefix=app.slice(0,app.indexOf('\nfunction w()'));
function replace(old, next) {
  if (app.split(old).length !== 2) throw Error(`Patch anchor not unique: ${old.slice(0,90)}`);
  app = app.replace(old,next);
}
function fn(name, nextName, body) {
  const start=app.indexOf(`\nfunction ${name}(`)+1, end=app.indexOf(`\nfunction ${nextName}(`,start)+1;
  if(start<=0 || end<=0) throw Error(`Missing function ${name}`);
  app=app.slice(0,start)+body+'\n'+app.slice(end);
}
fn('H','Si', `function H(handler) {
  const last=_.useRef(0), current=_.useRef(handler);
  current.current=handler;
  return {onClick:(event)=>{
    event.stopPropagation();
    const now=Date.now();
    if(now-last.current>=400){last.current=now;current.current();}
  }};
}`);
replace('var Mt = null;', `const mobile = window.ODD;
var Mt = null;`);
replace('function Nt() {', 'function Nt() {\n  if (!mobile.interacted || Lt) return null;');
replace('function P() {','function P() {\n  if (!mobile.interacted) return;');
replace('let t = new Audio(Ft[e]);','let t = new Audio();\n  t.src = Ft[e];');
replace('(t.preload = `auto`)', '(t.preload = `none`)');
replace('function Vt(e) {','function Vt(e) {\n  if (!mobile.interacted || Lt) return null;');
replace('  (Vt(`main`), Vt(`flip`));\n  let e = Vt(zt);','  if (!mobile.interacted) return;\n  let e = Vt(zt);');
fn('Wt','Gt', 'function Wt() {}');
replace('function qt() {','function qt() {\n  if (!mobile.interacted || Lt) return null;');
replace('  Lt = !1;\n  try {\n    localStorage.removeItem(Pt);', '  try { Lt = localStorage.getItem(Pt) === `1`; } catch {}\n  try {\n    if (!Lt) localStorage.removeItem(Pt);');
replace('  let e = It[zt];\n  return (e && (Lt ? e.pause() : e.play().catch(() => {})), Lt);', '  if (Lt) { for (const track of Object.values(It)) { track.pause(); track.removeAttribute(`src`); track.load(); } } else Ut();\n  return Lt;');
replace('  if (!e) return;\n  if (((e.muted = Lt), Lt)) {', '  if (!e) return;\n  if (!e.getAttribute(`src`) && !Lt) e.src = Ft[zt];\n  if (((e.muted = Lt), Lt)) {');
fn('Ai','U', `function Ai() {
  // Only six intro frames initially. Animation requests subsequent frames on demand.
  return ki || (ki = Promise.all((mobile.lite() ? kt.slice(0,1) : kt.slice(0,6)).map(Di)));
}`);
replace('if (!r || e.length < 2) return;', 'if (!r || mobile.lite() || e.length < 2) return;');
replace('              l.current?.();\n              return;', '              window.clearInterval(s);\n              l.current?.();\n              return;');
replace('    (Ai(), Yt());\n    let e = 0;\n    for (let t of kt) {', '    Ai();\n    let e = 0;\n    for (let t of []) {');
replace('    onPointerDown: () => {\n      (P(), Yt(), i());\n    },', '    onClick: (event) => {\n      event.stopPropagation();\n      (P(), Yt(), i());\n    },');
replace('window.setTimeout(() => i(), 3200)', 'window.setTimeout(() => i(), mobile.lite() ? 0 : 1600)');
replace('    tabIndex: 0,\n    onClick:', '    tabIndex: 0,\n    "aria-label": `跳過開場`,\n    onKeyDown: (event) => { if (event.key === `Enter` || event.key === ` `) { event.preventDefault(); i(); } },\n    onClick:');
replace('      o.current || e.length < 2','      o.current || mobile.lite() || e.length < 2');
replace('  );\nfunction jt(e)', '  ).filter((_, index) => index % 2 === 0);\nfunction jt(e)');
replace('                fps: 4,','                fps: 2,');
// Replace all signaling requests through one configurable, bounded fetch helper.
app=app.replaceAll('fetch(`/api/rtc`,', 'window.ODD.rtcFetch(``,');
replace('fetch(`/api/rtc?${e}`)', 'window.ODD.rtcFetch(`?${e}`)');
replace('  everPolled = !1;', '  everPolled = !1;\n  failedAt = Date.now();\n  failureTimer = null;');
replace('  async join() {\n    try {', '  async join() {\n    this.failureTimer = setInterval(() => { if (!this.closed && Date.now() - this.failedAt > 10000) this.fail(); }, 500);\n    try {');
replace('  close() {\n    ((this.closed = !0),', '  fail() {\n    this.opts.onDisconnected?.();\n    this.close();\n    window.ODD.connectionError();\n  }\n  close() {\n    clearInterval(this.failureTimer);\n    ((this.closed = !0),');
replace('    let n = await t.json();\n    if (this.closed) return;', '    let n = await t.json();\n    if (!Array.isArray(n.peers) || !Array.isArray(n.signals)) throw Error(`Invalid signaling response`);\n    this.failedAt = Date.now();\n    if (this.closed) return;');
replace('        onConnected: () => s(!0),', '        onConnected: () => s(!0),\n        onDisconnected: () => s(!1),');
replace('          e ? `已接通` : `連線中`,','          e ? `已接通` : s ? `連線失敗` : `連線中`,');
// Retain hooks unconditionally; route every host/join entry through an explicit fallback screen.
replace('function ua({ presetCode: e }) {', 'function ua({ presetCode: e }) {\n  if (!mobile.endpoint) return (0,B.jsx)(OnlineFallback, {joining:true,presetCode:e});');
replace('function da() {\n  let [e, t]', 'function da() {\n  if (!mobile.endpoint) return (0,B.jsx)(OnlineFallback, {joining:false});\n  let [e, t]');
const additions = await readFile('tools/ui-hotfix.js','utf8');
replace('var Da = new URLSearchParams', `${additions}\nvar Da = new URLSearchParams`);
replace('  (0, B.jsx)(_.StrictMode, { children: (0, B.jsx)(Ea, { presetRoom: Da }) }),', '  (0, B.jsx)(HotfixBoundary, { children: (0, B.jsx)(_.StrictMode, { children: (0, B.jsx)(Ea, { presetRoom: Da }) }) }),');
if(!app.startsWith(vendorPrefix)) throw Error('Refusing to change the embedded vendor runtime');
const output=(await transform(app,{minify:true,target:'es2020',legalComments:'eof'})).code;
const filename=`assets/mobile-${hash(output).slice(0,12)}.js`;
await writeFile(filename,output);
const css=await readFile('tools/mobile.css','utf8');
const cssFile=`assets/mobile-${hash(css).slice(0,12)}.css`;
await writeFile(cssFile,css);
const runtime=await readFile('tools/runtime.js','utf8');
const runtimeFile=`assets/runtime-${hash(runtime).slice(0,12)}.js`;
await writeFile(runtimeFile,runtime);
let html=await readFile('tools/index.template.html','utf8');
const version=hash(output+css+runtime).slice(0,16);
html=html.replaceAll('__APP__',filename).replaceAll('__CSS__',cssFile).replaceAll('__RUNTIME__',runtimeFile).replaceAll('__VERSION__',version);
await writeFile('index.html',html);
await writeFile('404.html',html);
await writeFile('version.json',JSON.stringify({version,baseCommit:'0042c6d7cba0e211f06da5aa8ea6f5a05aee3a9d',originalSHA256:hash(original),app:filename,css:cssFile,runtime:runtimeFile},null,2)+'\n');
console.log(`Built ${version}: ${filename}`);
