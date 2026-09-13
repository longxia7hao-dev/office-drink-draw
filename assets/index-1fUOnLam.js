var at=Object.defineProperty;var lt=(t,e,n)=>e in t?at(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var P=(t,e,n)=>lt(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))i(l);new MutationObserver(l=>{for(const a of l)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(l){const a={};return l.integrity&&(a.integrity=l.integrity),l.referrerPolicy&&(a.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?a.credentials="include":l.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(l){if(l.ep)return;l.ep=!0;const a=n(l);fetch(l.href,a)}})();const T=[{id:"manager",name:"主管",emoji:"👔",tag:"BOSS UP",drink:"喝 1 杯",skillName:"打小報告",skillDesc:"指定一位「上班族」喝 2 杯",skillKind:"pick_drink2",color:"#FF3D71",accent:"#FFE566"},{id:"worker",name:"上班族",emoji:"💼",tag:"9to5",drink:"喝 1 杯",skillName:"摸魚",skillDesc:"純喝 1 杯，沒有特殊技能（但人多勢眾）",skillKind:"none",color:"#4ECDC4",accent:"#FFF"},{id:"ceo",name:"老闆",emoji:"🕶️",tag:"BIG SHOT",drink:"喝 1 杯",skillName:"老闆發話",skillDesc:"全場一起喝 1，或指定一人喝 2",skillKind:"boss_choice",color:"#FFD700",accent:"#1A1A1A"},{id:"intern",name:"實習生",emoji:"🐣",tag:"ROOKIE",drink:"抿半杯 或 喝 1",skillName:"喊救命",skillDesc:"整場遊戲可使用 1 次：把這次喝酒傳給別人",skillKind:"intern_pass",color:"#A78BFA",accent:"#FFF"},{id:"sales",name:"業務",emoji:"🤝",tag:"DEAL",drink:"喝 1 杯",skillName:"請客",skillDesc:"指定一人跟你一起各喝 1 杯",skillKind:"treat",color:"#FF8C42",accent:"#FFF"},{id:"hr",name:"人資",emoji:"📋",tag:"HR",drink:"喝 1 杯",skillName:"調職",skillDesc:"與一人互換角色，或全體重新抽角色",skillKind:"transfer",color:"#38BDF8",accent:"#FFF"},{id:"accountant",name:"會計",emoji:"🧮",tag:"TAX",drink:"喝 1 杯",skillName:"報帳",skillDesc:"指定一人多喝 1；自己可改為半杯",skillKind:"tax",color:"#34D399",accent:"#1A1A1A"},{id:"engineer",name:"工程師",emoji:"💻",tag:"SHIP IT",drink:"喝 1 杯",skillName:"緊急上線",skillDesc:"自己喝 1，可指定一人這輪免抽（延後）",skillKind:"deploy",color:"#60A5FA",accent:"#FFF"},{id:"overtime",name:"加班狗",emoji:"🐕",tag:"OT",drink:"喝 2 杯",skillName:"加班免抽",skillDesc:"這輪喝 2，下一輪抽籤時自動跳過你",skillKind:"overtime",color:"#F472B6",accent:"#FFF"}];function C(t){return T.find(e=>e.id===t)??T[1]}function Z(t,e){const n=[...T];for(let l=n.length-1;l>0;l--){const a=e(l+1);[n[l],n[a]]=[n[a],n[l]]}const i=[];for(let l=0;l<t;l++)l<n.length?i.push(n[l].id):i.push("worker");for(let l=i.length-1;l>0;l--){const a=e(l+1);[i[l],i[a]]=[i[a],i[l]]}return i}function ot(t){let e=1779033703^t.length;for(let n=0;n<t.length;n++)e=Math.imul(e^t.charCodeAt(n),3432918353),e=e<<13|e>>>19;return e=Math.imul(e^e>>>16,2246822507),e=Math.imul(e^e>>>13,3266489909),(e^=e>>>16)>>>0}function I(t){let e=typeof t=="string"?ot(t):t>>>0;return e===0&&(e=1),()=>{e|=0,e=e+1831565813|0;let n=Math.imul(e^e>>>15,1|e);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function S(t,e){return Math.floor(t()*e)}function U(t,e){for(let n=t.length-1;n>0;n--){const i=S(e,n+1);[t[n],t[i]]=[t[i],t[n]]}return t}function M(){return`s-${Date.now().toString(36)}-${Math.floor(Math.random()*1e9).toString(36)}`}const B=[{id:"fq01",q:"開會時投影片突然黑掉，最合理的解釋是？",options:["投影機在摸魚","宇宙管理員按了暫停"],correct:1},{id:"fq02",q:"冰箱裡的便當會自己長腳逃走，因為？",options:["它不想被微波","它考上了外派"],correct:0},{id:"fq03",q:"鍵盤上的空白鍵為什麼叫空白？",options:["因為它心裡很空","因為它負責製造沉默"],correct:1},{id:"fq04",q:"周一早上鬧鐘響三遍，代表？",options:["時間在求饒","你跟床簽了加班合約"],correct:1},{id:"fq05",q:"影印機卡紙的真正原因是？",options:["紙張想休息五分鐘","它在抗議被印太多 KPI"],correct:0},{id:"fq06",q:"咖啡機吐出氣泡音，其實是在？",options:["說饒舌","報今日運勢"],correct:0},{id:"fq07",q:"電梯門關太慢，是因為？",options:["它在等遲到的靈魂","門縫在談戀愛"],correct:0},{id:"fq08",q:"滑鼠游標一直轉圈，代表電腦在？",options:["冥想","偷偷看連續劇"],correct:1},{id:"fq09",q:"會議室冷氣為什麼總是太冷？",options:["為了凍結愚蠢發言","冷氣在練冰系魔法"],correct:0},{id:"fq10",q:"同事說「我五分鐘就好」，五分鐘等於？",options:["一個小時代","量子不確定時間"],correct:1},{id:"fq11",q:"自動販賣機吃幣不吐貨，是因為？",options:["它在存退休金","它覺得你不夠潮"],correct:0},{id:"fq12",q:"Wi‑Fi 名稱叫「別連我」，你應該？",options:["連得更用力","對它鞠躬道歉"],correct:0},{id:"fq13",q:"廁所衛生紙用完時，宇宙會？",options:["播放尷尬配樂","派一隻鴿子送紙"],correct:0},{id:"fq14",q:"簡報第 87 頁還在講前言，代表講者？",options:["誤入時空迴圈","把結局藏在前言裡"],correct:0},{id:"fq15",q:"辦公椅發出怪聲是因為？",options:["它想換跑道當鼓手","它在模仿你的薪水"],correct:0},{id:"fq16",q:"螢幕保護程式出現熱帶魚，真相是？",options:["魚在代班","電腦在度假你不行"],correct:1},{id:"fq17",q:"「差不多就好」在公司語代表？",options:["絕對要重做三遍","已經完美到不行"],correct:0},{id:"fq18",q:"雨傘忘在公司，雨傘現在？",options:["加入了另一個部門","正在開自己的傘派對"],correct:1},{id:"fq19",q:"為什麼打字會突然跳去上一行？",options:["游標想逃家","鍵盤在玩捉迷藏"],correct:0},{id:"fq20",q:"中午便當店排到隊尾，代表你？",options:["被命運選為苦行僧","其實是隱形人"],correct:0},{id:"fq21",q:"群組訊息已讀不回，對方其實？",options:["正在練習隱形術","被訊息吸進黑洞"],correct:1},{id:"fq22",q:"白板筆沒水了還硬寫，寫出來的是？",options:["空氣藝術","隱形 KPI"],correct:0},{id:"fq23",q:"下班卡刷不過，系統認為你？",options:["還欠宇宙一小時","其實是影分身"],correct:0},{id:"fq24",q:"會議室電視遙控器失蹤，它去了？",options:["異次元沙發縫","跟電池私奔"],correct:0},{id:"fq25",q:"「這個需求很簡單」說完之後會？",options:["長出十七個子需求","立刻世界和平"],correct:0},{id:"fq26",q:"印表機燈一直閃橘燈，是在？",options:["發出求救摩斯密碼","慶祝週年慶"],correct:0},{id:"fq27",q:"為什麼耳機線總會打結？",options:["它在練習魔術","它嫉妒無線耳機"],correct:1},{id:"fq28",q:"週五下午開會的真正目的是？",options:["測試誰還有靈魂","幫周末暖身延遲"],correct:0},{id:"fq29",q:"雲端硬碟顯示同步中……其實在？",options:["跟雲聊天","把檔案帶去旅行"],correct:1},{id:"fq30",q:"「我傳檔案給你了」但你沒收到，檔案？",options:["卡在平行宇宙信箱","變成了幽靈附件"],correct:0},{id:"fq31",q:"公司盆栽突然暴斃，最可能是？",options:["聽太多會議自殺","被 PowerPoint 曬傷"],correct:0},{id:"fq32",q:"為什麼螺絲總會多一顆或少一顆？",options:["螺絲有自己的工會","組裝精靈在抽成"],correct:0},{id:"fq33",q:"深夜加班螢幕反光裡出現臉，那是？",options:["你的未來自己來催進度","鍵盤幽靈求放假"],correct:0},{id:"fq34",q:"「順便」兩個字在主管嘴裡等於？",options:["一座小山的工作量","真的只是順便"],correct:0},{id:"fq35",q:"手機掉進沙發縫，沙發其實？",options:["開了一間手機旅館","在徵收保護費"],correct:0}];function rt(t){return B.find(e=>e.id===t)??B[0]}function ct(){return{phase:"home",mode:null,players:[],seed:M(),drawCount:0,lastResult:null,roomCode:null,isHost:!0,isOnline:!1,myPlayerId:null,skillPending:!1,ceremonyStep:0,flip:null}}function z(t,e){const n=I(e+":roles"),i=Z(t.length,l=>S(n,l));return t.map((l,a)=>{const o=i[a];return{id:`p${a}`,name:l.trim()||`玩家${a+1}`,roleId:o,hasPass:o==="intern",skipNext:!1}})}function tt(t){return C(t.roleId)}function dt(t){const e=I(`${t.seed}:draw:${t.drawCount}`),n=t.players.filter(o=>!o.skipNext),i=n.length>0?n:t.players,l=i[S(e,i.length)];for(const o of t.players)o.skipNext&&(o.skipNext=!1);const a=tt(l);return{playerId:l.id,mode:"draw_one",message:`${l.name}（${a.name}）中籤！`,drinkHint:a.drink,skillKind:a.skillKind}}function pt(t){const e=I(`${t.seed}:order:${t.drawCount}`),n=t.players.map(l=>l.id);U(n,e);const i=n.map(l=>t.players.find(a=>a.id===l).name);return{playerId:n[0],mode:"drink_order",message:"乾杯順序出爐！",drinkHint:i.map((l,a)=>`${a+1}. ${l}`).join(" → "),skillKind:"none",order:n}}function ut(t){const e=I(`${t.seed}:team:${t.drawCount}`),n=t.players.map(c=>c.id);U(n,e);const i=Math.ceil(n.length/2),l=n.slice(0,i),a=n.slice(i),o=c=>t.players.find(r=>r.id===c).name;return{playerId:l[0],mode:"team_toast",message:"分隊完成！兩隊乾杯！",drinkHint:"🔥 A隊 vs ❄️ B隊",skillKind:"none",teams:[{name:"🔥 HEAT 隊",members:l.map(o)},{name:"❄️ ICE 隊",members:a.map(o)}]}}function N(t,e,n,i){const l=t.lastResult;if(!l)return"";const a=t.players.find(c=>c.id===l.playerId),o=n?t.players.find(c=>c.id===n):void 0;switch(e){case"pick_drink2":return o?`📢 ${a==null?void 0:a.name} 打小報告！${o.name} 喝 2 杯！`:"請選擇目標";case"boss_choice":return i==="all"?"🕶️ 老闆發話：全場一起喝 1 杯！":o?`🕶️ 老闆點名：${o.name} 喝 2 杯！`:"請選擇";case"intern_pass":return a&&(a.hasPass=!1),o?`🐣 ${a==null?void 0:a.name} 喊救命！喝酒傳給 ${o.name}！`:"請選擇傳給誰";case"treat":return o?`🤝 ${a==null?void 0:a.name} 請客！${a==null?void 0:a.name} 與 ${o.name} 各喝 1！`:"請選擇請客對象";case"transfer":if(i==="redraw"){const c=I(`${t.seed}:redraw:${t.drawCount}`),r=Z(t.players.length,p=>S(c,p));return t.players.forEach((p,b)=>{p.roleId=r[b],p.hasPass=p.roleId==="intern"}),"📋 人資宣布：全體重新抽角色！"}if(a&&o){const c=a.roleId;return a.roleId=o.roleId,o.roleId=c,a.hasPass=a.roleId==="intern",o.hasPass=o.roleId==="intern",`📋 調職！${a.name} ⇄ ${o.name}`}return"請選擇";case"tax":return o?`🧮 報帳！${o.name} 多喝 1；${a==null?void 0:a.name} 改半杯`:"請選擇";case"deploy":return o&&(o.skipNext=!0),o?`💻 緊急上線！${a==null?void 0:a.name} 喝 1；${o.name} 下輪免抽`:`${a==null?void 0:a.name} 喝 1 杯（可選延後對象）`;case"overtime":return a&&(a.skipNext=!0),`🐕 ${a==null?void 0:a.name} 加班！喝 2 杯，下輪免抽`;default:return`${a==null?void 0:a.name} ${C((a==null?void 0:a.roleId)??"worker").drink}`}}function ft(t){const e=I(`${t.seed}:flip:${t.drawCount}`),n=B.map(l=>l.id);U(n,e);const i=t.players.length>0?t.players[S(e,t.players.length)].id:null;t.mode="flip_battle",t.phase="flip_battle",t.flip={deck:n,index:0,sub:"countdown",countdown:3,picked:null,readyIds:[],answererId:i},t.skillPending=!1,t.lastResult=null}function et(t){const e=t.flip;if(!e||e.deck.length===0)return null;const n=e.deck[e.index%e.deck.length];return n?rt(n):null}function bt(t){t.flip&&(t.flip.sub="choose",t.flip.countdown=0,t.flip.picked=null)}function mt(t,e){!t.flip||t.flip.sub!=="choose"||(t.flip.picked=e,t.flip.sub="result",t.flip.readyIds=[])}function K(t,e){!t.flip||t.flip.sub!=="result"||t.flip.readyIds.includes(e)||t.flip.readyIds.push(e)}function L(t){return t.flip?t.players.length===0?!0:t.players.every(e=>t.flip.readyIds.includes(e.id)):!1}function ht(t){if(!t.flip)return;const e=(t.flip.index+1)%t.flip.deck.length,n=I(`${t.seed}:flip-ans:${t.drawCount}:${e}`),i=t.players.length>0?t.players[S(n,t.players.length)].id:null;t.flip.index=e,t.flip.sub="countdown",t.flip.countdown=3,t.flip.picked=null,t.flip.readyIds=[],t.flip.answererId=i,t.drawCount+=1}function vt(t){var n;const e=et(t);return!e||((n=t.flip)==null?void 0:n.picked)==null?!1:t.flip.picked===e.correct}const yt={};function gt(t){return{phase:t.phase,mode:t.mode,players:t.players,seed:t.seed,drawCount:t.drawCount,lastResult:t.lastResult,skillPending:t.skillPending,ceremonyStep:t.ceremonyStep,flip:t.flip}}function kt(t,e){t.phase=e.phase,t.mode=e.mode,t.players=e.players,t.seed=e.seed,t.drawCount=e.drawCount,t.lastResult=e.lastResult,t.skillPending=e.skillPending,t.ceremonyStep=e.ceremonyStep,t.flip=e.flip??null}function wt(){const t=yt;if(t.VITE_WS_URL)return t.VITE_WS_URL;const e=typeof location<"u"?location:null;return e?e.hostname==="localhost"||e.hostname==="127.0.0.1"?`ws://${e.hostname}:8787`:`${e.protocol==="https:"?"wss:":"ws:"}//${e.hostname}:8787`:"ws://localhost:8787"}class $t{constructor(e,n){P(this,"ws",null);P(this,"handlers");P(this,"url");P(this,"reconnectTimer",null);this.handlers=e,this.url=n??wt()}get connected(){var e;return((e=this.ws)==null?void 0:e.readyState)===WebSocket.OPEN}connect(){var e,n,i,l,a,o;if(!(this.ws&&(this.ws.readyState===WebSocket.OPEN||this.ws.readyState===WebSocket.CONNECTING))){(n=(e=this.handlers).onStatus)==null||n.call(e,"connecting");try{this.ws=new WebSocket(this.url)}catch{(l=(i=this.handlers).onStatus)==null||l.call(i,"error"),(o=(a=this.handlers).onError)==null||o.call(a,"無法連線到房間伺服器");return}this.ws.onopen=()=>{var c,r;return(r=(c=this.handlers).onStatus)==null?void 0:r.call(c,"open")},this.ws.onclose=()=>{var c,r;(r=(c=this.handlers).onStatus)==null||r.call(c,"closed")},this.ws.onerror=()=>{var c,r,p,b;(r=(c=this.handlers).onStatus)==null||r.call(c,"error"),(b=(p=this.handlers).onError)==null||b.call(p,"連線失敗（可改用單機模式，或確認已啟動 npm run server）")},this.ws.onmessage=c=>{try{const r=JSON.parse(String(c.data));this.handle(r)}catch{}}}}handle(e){var n,i,l,a,o,c,r,p,b,h;switch(e.type){case"created":(i=(n=this.handlers).onCreated)==null||i.call(n,e.code,e.playerId);break;case"joined":(a=(l=this.handlers).onJoined)==null||a.call(l,e.code,e.playerId,e.isHost);break;case"roster":(c=(o=this.handlers).onRoster)==null||c.call(o,e.players,e.hostId);break;case"state":(p=(r=this.handlers).onState)==null||p.call(r,e.state);break;case"error":(h=(b=this.handlers).onError)==null||h.call(b,e.message);break}}send(e){var n,i;if(!this.ws||this.ws.readyState!==WebSocket.OPEN){(i=(n=this.handlers).onError)==null||i.call(n,"尚未連上伺服器");return}this.ws.send(JSON.stringify(e))}create(e){this.connect();const n=()=>{var i;((i=this.ws)==null?void 0:i.readyState)===WebSocket.OPEN?this.send({type:"create",name:e}):setTimeout(n,50)};n()}join(e,n){this.connect();const i=()=>{var l;((l=this.ws)==null?void 0:l.readyState)===WebSocket.OPEN?this.send({type:"join",code:e,name:n}):setTimeout(i,50)};i()}sync(e){this.send({type:"sync",state:e})}disconnect(){var e;this.reconnectTimer!=null&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null),(e=this.ws)==null||e.close(),this.ws=null}}function d(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function m(t){return`<div class="wall-bg"></div>${t}`}function J(){return m(`
    <div class="screen" data-screen="home">
      <div class="top-bar">
        <span class="tag-pill">STREET DRAW</span>
        <span class="tag-pill" style="transform:rotate(3deg);border-color:var(--spray-pink);color:var(--spray-pink)">18+</span>
      </div>
      <h1 class="graffiti-title">公司酒局</h1>
      <div class="graffiti-sub">OFFICE DRINK DRAW</div>
      <div class="street-row" aria-hidden="true">🧢 🎤 🎧 💥 🏙️</div>
      <div class="sticker">
        <p style="margin:0;font-weight:800;line-height:1.5">
          美式嘻哈街頭塗鴉風 · 上班族抽籤喝酒<br/>
          <span style="color:var(--spray-cyan)">儀式感大揭示 · 角色技能 · 可單機 / 可開房</span>
        </p>
      </div>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="solo">🎮 單機開打</button>
        <button class="btn btn-cyan btn-lg" data-action="host">📡 開房間（連線）</button>
        <button class="btn btn-pink" data-action="join">🔑 加入房間</button>
        <button class="btn btn-ghost" data-action="roles-preview">👀 看角色技能</button>
      </div>
      <p class="footer-note">請理性飲酒 · 未成年勿玩</p>
    </div>
  `)}function It(t,e){const n=t.map((i,l)=>`
      <div class="player-chip">
        <span class="num">${l+1}</span>
        <input data-name-idx="${l}" value="${d(i)}" maxlength="12" aria-label="玩家${l+1}" />
        <button class="chip-btn" data-action="remove-player" data-idx="${l}" ${t.length<=2?"disabled":""} type="button">✕</button>
      </div>`).join("");return m(`
    <div class="screen" data-screen="setup">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">${e?"ONLINE SETUP":"SOLO SETUP"}</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">組隊</h1>
      <p class="hint">2–12 人。每個人會拿到一個街頭辦公室角色。</p>
      <div class="player-list">${n}</div>
      <button class="btn btn-lime" data-action="add-player" ${t.length>=12?"disabled":""} type="button">＋ 加一位</button>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="confirm-setup" type="button">🔥 鎖定陣容</button>
      </div>
    </div>
  `)}function qt(t,e,n){const i=e.length>0?e.map(l=>`
        <div class="player-chip">
          <span class="status-dot ${l.connected?"on":"off"}"></span>
          <strong>${d(l.name)}</strong>
          ${l.id===t.myPlayerId?'<span class="tag-pill" style="font-size:0.6rem">YOU</span>':""}
        </div>`).join(""):t.players.map(l=>`
        <div class="player-chip"><span class="num">★</span><strong>${d(l.name)}</strong></div>`).join("");return m(`
    <div class="screen" data-screen="lobby">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        ${t.roomCode?`<span class="room-badge">${d(t.roomCode)}</span>`:""}
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">房間</h1>
      <p class="hint">
        <span class="status-dot ${n==="open"?"on":"off"}"></span>
        連線：${d(n)} · 房主為抽籤權威
      </p>
      <div class="sticker">
        <p style="margin:0;font-weight:800">把房間碼或網址分給同事加入。</p>
        <p class="hint" style="margin-bottom:0">網址可帶 <code>?room=${d(t.roomCode??"")}</code></p>
      </div>
      <div class="player-list" style="margin-top:12px">${i}</div>
      <div class="btn-row">
        ${t.isHost?'<button class="btn btn-lg" data-action="start-online" type="button">🎤 開始發角色</button>':'<p class="hint">等待房主開始…</p>'}
      </div>
    </div>
  `)}function xt(t){const e=t.map(n=>{const i=tt(n);return`
        <div class="role-card" style="box-shadow:4px 4px 0 ${i.color}">
          <span class="drip" style="background:${i.color}"></span>
          <span class="emoji">${i.emoji}</span>
          <div class="name">${d(n.name)}</div>
          <div class="tag">${d(i.tag)} · ${d(i.name)}</div>
          <div class="skill"><strong style="color:${i.color}">${d(i.skillName)}</strong><br/>${d(i.skillDesc)}<br/><span style="color:var(--spray-lime)">${d(i.drink)}</span></div>
        </div>`}).join("");return m(`
    <div class="screen" data-screen="roles">
      <div class="top-bar">
        <span class="tag-pill">CREW</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">角色卡</h1>
      <p class="hint">記住自己的技能。準備上牆噴漆揭示！</p>
      <div class="role-grid">${e}</div>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="to-modes" type="button">👉 選模式</button>
      </div>
    </div>
  `)}function St(){const t=T.map(e=>`
    <div class="role-card" style="box-shadow:4px 4px 0 ${e.color}">
      <span class="drip" style="background:${e.color}"></span>
      <span class="emoji">${e.emoji}</span>
      <div class="name">${d(e.name)}</div>
      <div class="tag">${d(e.tag)}</div>
      <div class="skill"><strong style="color:${e.color}">${d(e.skillName)}</strong><br/>${d(e.skillDesc)}<br/><span style="color:var(--spray-lime)">${d(e.drink)}</span></div>
    </div>`).join("");return m(`
    <div class="screen" data-screen="roles-preview">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">ROSTER</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">全角色</h1>
      <div class="role-grid">${t}</div>
    </div>
  `)}function V(t){const e=t.isOnline&&!t.isHost;return m(`
    <div class="screen" data-screen="modes">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="back-roles" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        ${t.roomCode?`<span class="room-badge">${d(t.roomCode)}</span>`:'<span class="tag-pill">MODE</span>'}
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">選模式</h1>
      ${e?'<p class="hint">只有房主可以抽籤，你會同步看到結果。</p>':""}
      <div class="mode-grid">
        <button class="mode-card" data-action="mode" data-mode="draw_one" ${e?"disabled":""} type="button">
          <div class="m-title">🎲 抽一位喝酒</div>
          <div class="m-desc">Seed 公平亂數 · 街頭儀式大揭示 · 可發動技能</div>
        </button>
        <button class="mode-card" data-action="mode" data-mode="drink_order" ${e?"disabled":""} type="button">
          <div class="m-title">📜 喝杯順序</div>
          <div class="m-desc">洗牌排出誰先乾，誰壓軸</div>
        </button>
        <button class="mode-card" data-action="mode" data-mode="team_toast" ${e?"disabled":""} type="button">
          <div class="m-title">🤜 分隊乾杯</div>
          <div class="m-desc">隨機兩隊 · 對幹乾杯</div>
        </button>
        <button class="mode-card" data-action="mode" data-mode="flip_battle" ${e?"disabled":""} type="button">
          <div class="m-title">🃏 翻牌對戰</div>
          <div class="m-desc">無厘頭題目 · 蓋牌倒數翻開 · 選錯的喝</div>
        </button>
      </div>
    </div>
  `)}function Pt(t){const e=["搖罐中…","噴漆上牆…","揭開標籤！"];return m(`
    <div class="screen" data-screen="drawing">
      <div class="ceremony">
        <div class="boombox">🎧</div>
        <div class="graffiti-title" style="font-size:1.8rem">${e[Math.min(t,e.length-1)]}</div>
        <p class="hint">街頭儀式進行中</p>
      </div>
      <div class="spray-burst" id="spray-burst"></div>
    </div>
  `)}function Ot(t){const e=t.lastResult;if(!e)return V(t);const n=t.players.find(a=>a.id===e.playerId),i=n?C(n.roleId):null;if(e.mode==="drink_order"&&e.order){const a=e.order.map((o,c)=>{const r=t.players.find(p=>p.id===o);return`<li style="animation-delay:${c*.08}s">${c+1}. ${d(r.name)} <span style="color:var(--muted)">（${d(C(r.roleId).name)}）</span></li>`}).join("");return m(`
      <div class="screen" data-screen="reveal">
        <div class="ceremony" style="justify-content:flex-start;padding-top:24px">
          <div class="reveal-name">順序出爐</div>
          <ul class="order-list" style="padding:0;width:100%">${a}</ul>
        </div>
        <div class="btn-row">
          <button class="btn btn-lg" data-action="again" type="button">再來一輪</button>
          <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
        </div>
      </div>
    `)}if(e.mode==="team_toast"&&e.teams){const a=e.teams.map(o=>`
      <div class="team">
        <h3>${d(o.name)}</h3>
        <div>${o.members.map(c=>d(c)).join(" · ")}</div>
      </div>`).join("");return m(`
      <div class="screen" data-screen="reveal">
        <div class="ceremony" style="justify-content:flex-start;padding-top:24px">
          <div class="reveal-name">分隊乾杯</div>
          <div class="team-box">${a}</div>
          <div class="reveal-drink">兩隊互敬 · 乾！</div>
        </div>
        <div class="btn-row">
          <button class="btn btn-lg" data-action="again" type="button">再分一次</button>
          <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
        </div>
      </div>
    `)}const l=e.skillKind!=="none"&&t.skillPending;return m(`
    <div class="screen" data-screen="reveal">
      <div class="ceremony">
        <div class="tag-pill" style="transform:rotate(-6deg)">HIT!</div>
        <div class="reveal-name shake">${d((n==null?void 0:n.name)??"?")}</div>
        <div style="font-size:2.5rem">${(i==null?void 0:i.emoji)??"💥"}</div>
        <div class="graffiti-sub">${d((i==null?void 0:i.name)??"")} · ${d((i==null?void 0:i.tag)??"")}</div>
        <div class="reveal-drink">${d(e.drinkHint)}</div>
        ${i&&i.skillKind!=="none"?`<div class="sticker" style="width:100%;margin-top:8px">
                <strong style="color:var(--spray-pink)">${d(i.skillName)}</strong>
                <p class="hint" style="margin:4px 0 0">${d(i.skillDesc)}</p>
              </div>`:""}
      </div>
      <div class="btn-row">
        ${l?`<button class="btn btn-pink btn-lg" data-action="use-skill" type="button">⚡ 發動技能</button>
               <button class="btn btn-lime" data-action="skip-skill" type="button">直接喝 · 跳過技能</button>`:`<button class="btn btn-lg" data-action="again" type="button">🎲 再抽一次</button>
               <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>`}
      </div>
      <div class="spray-burst" id="spray-burst"></div>
    </div>
  `)}function jt(t){const e=t.lastResult;if(!e)return V(t);const n=t.players.find(r=>r.id===e.playerId),i=n?C(n.roleId):null,l=t.players.filter(r=>r.id!==e.playerId),a=t.players.filter(r=>r.roleId==="worker"&&r.id!==e.playerId),o=(r,p)=>r.map(b=>`<button class="chip-btn" data-action="${p}" data-target="${b.id}" type="button">${d(b.name)}</button>`).join("")||'<p class="hint">沒有可選對象</p>';let c="";switch(e.skillKind){case"pick_drink2":c=`<p class="hint">指定一位「上班族」喝 2</p><div class="targets">${o(a.length?a:l,"skill-target")}</div>`;break;case"boss_choice":c=`
        <button class="btn btn-pink" data-action="skill-opt" data-opt="all" type="button">全場喝 1</button>
        <p class="hint">或指定一人喝 2：</p>
        <div class="targets">${o(l,"skill-target")}</div>`;break;case"intern_pass":c=(n==null?void 0:n.hasPass)===!1?'<p class="error-banner">救命已用完</p>':`<p class="hint">把這次喝酒傳給誰？</p><div class="targets">${o(l,"skill-target")}</div>`;break;case"treat":c=`<p class="hint">請客對象（各喝 1）</p><div class="targets">${o(l,"skill-target")}</div>`;break;case"transfer":c=`
        <button class="btn btn-cyan" data-action="skill-opt" data-opt="redraw" type="button">全體重抽角色</button>
        <p class="hint">或與一人互換：</p>
        <div class="targets">${o(l,"skill-target")}</div>`;break;case"tax":c=`<p class="hint">誰多喝 1？（你改半杯）</p><div class="targets">${o(l,"skill-target")}</div>`;break;case"deploy":c=`
        <p class="hint">可指定一人下輪免抽（也可跳過）</p>
        <div class="targets">${o(l,"skill-target")}</div>
        <button class="btn btn-lime" data-action="skill-opt" data-opt="selfonly" type="button">只自己喝 1</button>`;break;case"overtime":c='<button class="btn btn-pink btn-lg" data-action="skill-opt" data-opt="ot" type="button">確認加班：喝 2，下輪免抽</button>';break;default:c='<button class="btn" data-action="skip-skill" type="button">完成</button>'}return m(`
    <div class="screen" data-screen="skill">
      <div class="top-bar">
        <span class="tag-pill">SKILL</span>
      </div>
      <h1 class="graffiti-title" style="font-size:1.8rem">${d((i==null?void 0:i.skillName)??"技能")}</h1>
      <div class="skill-panel sticker">
        ${c}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" data-action="skip-skill" type="button">取消技能</button>
      </div>
    </div>
  `)}function Ct(t){return m(`
    <div class="screen" data-screen="result">
      <div class="ceremony">
        <div class="reveal-name" style="font-size:1.6rem">技能發動</div>
        <div class="sticker" style="width:100%">
          <p style="margin:0;font-size:1.2rem;font-weight:900;line-height:1.5">${d(t)}</p>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="again" type="button">🎲 再抽</button>
        <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
      </div>
    </div>
  `)}function Et(t){const e=t.flip,n=et(t);if(!e||!n)return m(`
      <div class="screen" data-screen="flip">
        <p class="hint">題庫載入中…</p>
        <button class="btn btn-ghost" data-action="to-modes" type="button">回模式</button>
      </div>
    `);const i=e.answererId?t.players.find(v=>v.id===e.answererId):null,a=!(t.isOnline&&!t.isHost),o=e.sub!=="countdown",c=e.index+1,r=e.deck.length,p=e.sub==="countdown"?`<div class="flip-countdown" aria-live="polite">
           <span class="flip-cd-num">${e.countdown>0?e.countdown:"翻！"}</span>
           <span class="flip-cd-label">蓋牌倒數</span>
         </div>`:"",b=[0,1].map(v=>{const D=n.options[v],E=e.picked===v,F=n.correct===v;let y="flip-card";o?y+=" face-up":y+=" face-down",e.sub==="result"&&(F&&(y+=" is-correct"),E&&!F&&(y+=" is-wrong"),E&&(y+=" is-picked"));const q=!a||e.sub!=="choose"?"disabled":"";return`
        <button class="${y}" data-action="flip-pick" data-choice="${v}" ${q} type="button">
          <div class="flip-card-inner">
            <div class="flip-face flip-back">
              <span class="flip-back-tag">STREET</span>
              <span class="flip-back-ico">${v===0?"🔥":"❄️"}</span>
              <span class="flip-back-sub">蓋牌</span>
            </div>
            <div class="flip-face flip-front">
              <span class="flip-opt-label">${v===0?"A":"B"}</span>
              <span class="flip-opt-text">${d(D)}</span>
            </div>
          </div>
        </button>`}).join("");let h="";if(e.sub==="result"&&e.picked!=null){const v=vt(t),D=i?d(i.name):"選錯的人";h=v?`<div class="flip-result ok">
           <div class="flip-result-title">答對了！</div>
           <p class="hint" style="margin:0">免喝 · 街頭知識＋1</p>
         </div>`:`<div class="flip-result bad">
           <div class="flip-result-title">選錯的喝！</div>
           <p class="hint" style="margin:0">${D} · 乾一口 🍻</p>
         </div>`;const E=new Set(e.readyIds),F=t.players.map(y=>{const q=E.has(y.id);return`<div class="ready-chip ${q?"on":"off"}">
          <span class="status-dot ${q?"on":"off"}"></span>
          <strong>${d(y.name)}</strong>
          <span class="ready-label">${q?"已就緒":"還沒按"}</span>
          ${a&&!q?`<button class="chip-btn alt" data-action="flip-ready" data-player="${y.id}" type="button">下一題 ✓</button>`:""}
        </div>`}).join("");h+=`
      <div class="sticker flip-ready-box" style="width:100%;margin-top:8px">
        <p style="margin:0 0 8px;font-weight:900">下一題就緒狀況</p>
        <div class="ready-list">${F}</div>
        ${a?`<button class="btn btn-lg" style="margin-top:12px" data-action="flip-ready-all" type="button">下一題</button>
               <p class="hint" style="margin-bottom:0">傳手機：每人按一次「下一題」；名單會顯示誰好了／誰還沒。全到齊自動進下一題。</p>`:'<p class="hint" style="margin-bottom:0">等待房主／大家按下一題…</p>'}
      </div>`}return m(`
    <div class="screen" data-screen="flip">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="to-modes" style="width:auto;min-height:40px;padding:8px 12px" type="button">←</button>
        <span class="tag-pill">FLIP ${c}/${r}</span>
      </div>
      <div class="flip-q sticker">
        <div class="flip-q-label">無厘頭題</div>
        <p class="flip-q-text">${d(n.q)}</p>
        ${i?`<p class="hint" style="margin:8px 0 0">本輪點名作答：<strong style="color:var(--spray-pink)">${d(i.name)}</strong></p>`:""}
      </div>
      ${p}
      <div class="flip-cards ${o?"revealed":"hidden-opts"}">${b}</div>
      ${h}
      <div class="spray-burst" id="spray-burst"></div>
      <p class="footer-note">選錯的喝 · 請理性飲酒</p>
    </div>
  `)}function Ft(){return m(`
    <div class="screen" data-screen="join">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">JOIN</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">加入</h1>
      <label class="field">你的暱稱</label>
      <input id="join-name" maxlength="12" placeholder="例如：小明" />
      <label class="field">房間碼</label>
      <input id="join-code" maxlength="4" placeholder="ABCD" style="text-transform:uppercase;letter-spacing:0.3em;font-size:1.4rem;text-align:center" />
      <div class="btn-row">
        <button class="btn btn-lg btn-cyan" data-action="do-join" type="button">進房</button>
      </div>
      <p class="hint">需房主已執行 <strong>npm run server</strong>，且你的裝置能連到同一個 WS 位址。</p>
    </div>
  `)}function Nt(){return m(`
    <div class="screen" data-screen="host-name">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">HOST</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">開房</h1>
      <label class="field">房主暱稱</label>
      <input id="host-name" maxlength="12" placeholder="例如：阿豪" />
      <div class="btn-row">
        <button class="btn btn-lg" data-action="do-host" type="button">建立房間</button>
      </div>
      <p class="hint">請先在電腦執行 <strong>npm run server</strong>（預設 ws://該機:8787）。手機連同一 Wi‑Fi，並用 <strong>VITE_WS_URL</strong> 指向該位址。</p>
    </div>
  `)}const H=document.querySelector("#app"),s=ct();let k=["玩家1","玩家2","玩家3","玩家4"],st="idle",A=[],O="",w=null,_=null,nt=null,R=null;const j=new $t({onStatus:t=>{st=t,s.phase==="lobby"&&u()},onCreated:(t,e)=>{s.roomCode=t,s.myPlayerId=e,s.isHost=!0,s.isOnline=!0,s.phase="lobby",W(t),u()},onJoined:(t,e,n)=>{s.roomCode=t,s.myPlayerId=e,s.isHost=n,s.isOnline=!0,s.phase="lobby",W(t),u()},onRoster:t=>{A=t,u()},onState:t=>{s.isHost||(kt(s,t),u(),s.phase==="reveal"&&$())},onError:t=>{alert(t)}});function W(t){const e=new URL(location.href);t?e.searchParams.set("room",t):e.searchParams.delete("room"),history.replaceState(null,"",e.toString())}function f(){s.isOnline&&s.isHost&&j.connected&&j.sync(gt(s))}function u(){let t="";switch(s.phase){case"home":t=J();break;case"setup":t=It(k,s.isOnline);break;case"lobby":t=qt(s,A,st);break;case"roles":t=xt(s.players);break;case"mode_select":t=V(s);break;case"drawing":t=Pt(s.ceremonyStep);break;case"reveal":t=Ot(s);break;case"skill":t=jt(s);break;case"result":t=Ct(O);break;case"flip_battle":t=Et(s);break;default:t=J()}R==="join"&&(t=Ft()),R==="host-name"&&(t=Nt()),R==="roles-preview"&&(t=St()),H.innerHTML=t}function g(t){R=t}function x(){_!=null&&(window.clearInterval(_),_=null)}function Q(){s.isOnline&&!s.isHost||(x(),w!=null&&(window.clearInterval(w),w=null),ft(s),f(),u(),$(),it())}function it(){x(),!(!s.flip||s.flip.sub!=="countdown")&&(s.isOnline&&!s.isHost||(_=window.setInterval(()=>{if(!s.flip||s.flip.sub!=="countdown"){x();return}s.flip.countdown>1?(s.flip.countdown-=1,f(),u()):(x(),bt(s),f(),u(),$())},1e3)))}function G(){s.isOnline&&!s.isHost||(ht(s),f(),u(),$(),it())}function X(t){s.isOnline&&!s.isHost||(nt=t,s.mode=t,s.phase="drawing",s.ceremonyStep=0,s.skillPending=!1,f(),u(),$(),w!=null&&window.clearInterval(w),w=window.setInterval(()=>{s.ceremonyStep+=1,s.ceremonyStep>=3?(w!=null&&window.clearInterval(w),w=null,_t()):(f(),u(),$())},700))}function _t(){const t=nt??s.mode;if(!t||t==="flip_battle")return;let e;t==="draw_one"?e=dt(s):t==="drink_order"?e=pt(s):e=ut(s),s.lastResult=e,s.drawCount+=1,s.phase="reveal",s.skillPending=t==="draw_one"&&e.skillKind!=="none",f(),u(),$()}function $(){const t=document.getElementById("spray-burst");if(!t)return;const e=["💥","✨","🔥","🧢","🎤","⭐","💧","🎨"];for(let n=0;n<14;n++){const i=document.createElement("span");i.textContent=e[n%e.length];const l=10+Math.random()*80,a=20+Math.random()*50;i.style.left=`${l}%`,i.style.top=`${a}%`,i.style.setProperty("--dx",`${(Math.random()-.5)*160}px`),i.style.setProperty("--dy",`${-80-Math.random()*120}px`),i.style.setProperty("--rot",`${(Math.random()-.5)*120}deg`),i.style.animationDelay=`${Math.random()*.2}s`,t.appendChild(i),window.setTimeout(()=>i.remove(),1200)}}H.addEventListener("click",t=>{var i,l,a,o,c;const e=t.target.closest("[data-action]");if(!e)return;const n=e.dataset.action;if(n)switch(n){case"home":g(null),x(),s.phase="home",s.flip=null,s.isOnline=!1,s.roomCode=null,j.disconnect(),W(null),u();break;case"solo":g(null),s.isOnline=!1,s.isHost=!0,s.phase="setup",u();break;case"host":g("host-name"),u();break;case"join":g("join"),u();break;case"roles-preview":g("roles-preview"),u();break;case"do-host":{const r=((i=document.getElementById("host-name"))==null?void 0:i.value.trim())||"房主";g(null),j.create(r),s.phase="lobby",u();break}case"do-join":{const r=((l=document.getElementById("join-name"))==null?void 0:l.value.trim())||"玩家",p=(a=document.getElementById("join-code"))==null?void 0:a.value.trim().toUpperCase();if(!p||p.length<4){alert("請輸入 4 碼房間碼");return}g(null),j.join(p,r),s.phase="lobby",u();break}case"add-player":k.length<12&&(k.push(`玩家${k.length+1}`),u());break;case"remove-player":{const r=Number(e.dataset.idx);k.length>2&&(k.splice(r,1),u());break}case"confirm-setup":{H.querySelectorAll("[data-name-idx]").forEach(p=>{const b=Number(p.dataset.nameIdx);k[b]=p.value.trim()||`玩家${b+1}`}),s.seed=M(),s.players=z(k,s.seed),s.drawCount=0,s.lastResult=null,s.phase="roles",f(),u();break}case"start-online":{if(!s.isHost)return;const r=A.map(p=>p.name);if(r.length<2){alert("至少需要 2 人");return}s.seed=M(),s.players=z(r,s.seed),s.players.forEach((p,b)=>{const h=A[b];h&&(p.id=h.id,p.name=h.name)}),s.myPlayerId=s.myPlayerId,s.drawCount=0,s.lastResult=null,s.phase="roles",f(),u();break}case"to-modes":g(null),x(),s.phase="mode_select",s.skillPending=!1,s.flip=null,f(),u();break;case"back-roles":s.phase="roles",f(),u();break;case"mode":{const r=e.dataset.mode;r==="flip_battle"?Q():X(r);break}case"flip-pick":{if(s.isOnline&&!s.isHost)return;const r=Number(e.dataset.choice);if(r!==0&&r!==1)return;mt(s,r),f(),u(),$();break}case"flip-ready":{if(s.isOnline&&!s.isHost)return;const r=e.dataset.player;if(!r)return;K(s,r),f(),u(),L(s)&&window.setTimeout(()=>{L(s)&&G()},350);break}case"flip-ready-all":{if(s.isOnline&&!s.isHost)return;if(s.isOnline&&s.myPlayerId)K(s,s.myPlayerId);else{const r=s.players.find(p=>!s.flip.readyIds.includes(p.id));r&&K(s,r.id)}f(),u(),L(s)&&window.setTimeout(()=>G(),350);break}case"again":s.mode==="flip_battle"?Q():s.mode&&X(s.mode);break;case"use-skill":s.phase="skill",f(),u();break;case"skip-skill":s.skillPending=!1,s.phase="reveal",f(),u();break;case"skill-target":{const r=e.dataset.target,p=((o=s.lastResult)==null?void 0:o.skillKind)??"none";O=N(s,p,r),s.skillPending=!1,s.phase="result",f(),u();break}case"skill-opt":{const r=e.dataset.opt,p=((c=s.lastResult)==null?void 0:c.skillKind)??"none";r==="selfonly"?O=N(s,"deploy"):r==="ot"?O=N(s,"overtime"):O=N(s,p,void 0,r),s.skillPending=!1,s.phase="result",f(),u();break}}});H.addEventListener("change",t=>{const e=t.target;if(e.matches("[data-name-idx]")){const n=Number(e.dataset.nameIdx);k[n]=e.value}});const Rt=new URLSearchParams(location.search),Y=Rt.get("room");Y?(g("join"),u(),window.setTimeout(()=>{const t=document.getElementById("join-code");t&&(t.value=Y.toUpperCase())},0)):u();
