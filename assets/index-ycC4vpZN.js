var B=Object.defineProperty;var U=(e,t,s)=>t in e?B(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var k=(e,t,s)=>U(e,typeof t!="symbol"?t+"":t,s);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function s(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(i){if(i.ep)return;i.ep=!0;const n=s(i);fetch(i.href,n)}})();const P=[{id:"manager",name:"主管",emoji:"👔",tag:"BOSS UP",drink:"喝 1 杯",skillName:"打小報告",skillDesc:"指定一位「上班族」喝 2 杯",skillKind:"pick_drink2",color:"#FF3D71",accent:"#FFE566"},{id:"worker",name:"上班族",emoji:"💼",tag:"9to5",drink:"喝 1 杯",skillName:"摸魚",skillDesc:"純喝 1 杯，沒有特殊技能（但人多勢眾）",skillKind:"none",color:"#4ECDC4",accent:"#FFF"},{id:"ceo",name:"老闆",emoji:"🕶️",tag:"BIG SHOT",drink:"喝 1 杯",skillName:"老闆發話",skillDesc:"全場一起喝 1，或指定一人喝 2",skillKind:"boss_choice",color:"#FFD700",accent:"#1A1A1A"},{id:"intern",name:"實習生",emoji:"🐣",tag:"ROOKIE",drink:"抿半杯 或 喝 1",skillName:"喊救命",skillDesc:"整場遊戲可使用 1 次：把這次喝酒傳給別人",skillKind:"intern_pass",color:"#A78BFA",accent:"#FFF"},{id:"sales",name:"業務",emoji:"🤝",tag:"DEAL",drink:"喝 1 杯",skillName:"請客",skillDesc:"指定一人跟你一起各喝 1 杯",skillKind:"treat",color:"#FF8C42",accent:"#FFF"},{id:"hr",name:"人資",emoji:"📋",tag:"HR",drink:"喝 1 杯",skillName:"調職",skillDesc:"與一人互換角色，或全體重新抽角色",skillKind:"transfer",color:"#38BDF8",accent:"#FFF"},{id:"accountant",name:"會計",emoji:"🧮",tag:"TAX",drink:"喝 1 杯",skillName:"報帳",skillDesc:"指定一人多喝 1；自己可改為半杯",skillKind:"tax",color:"#34D399",accent:"#1A1A1A"},{id:"engineer",name:"工程師",emoji:"💻",tag:"SHIP IT",drink:"喝 1 杯",skillName:"緊急上線",skillDesc:"自己喝 1，可指定一人這輪免抽（延後）",skillKind:"deploy",color:"#60A5FA",accent:"#FFF"},{id:"overtime",name:"加班狗",emoji:"🐕",tag:"OT",drink:"喝 2 杯",skillName:"加班免抽",skillDesc:"這輪喝 2，下一輪抽籤時自動跳過你",skillKind:"overtime",color:"#F472B6",accent:"#FFF"}];function S(e){return P.find(t=>t.id===e)??P[1]}function M(e,t){const s=[...P];for(let i=s.length-1;i>0;i--){const n=t(i+1);[s[i],s[n]]=[s[n],s[i]]}const a=[];for(let i=0;i<e;i++)i<s.length?a.push(s[i].id):a.push("worker");for(let i=a.length-1;i>0;i--){const n=t(i+1);[a[i],a[n]]=[a[n],a[i]]}return a}function V(e){let t=1779033703^e.length;for(let s=0;s<e.length;s++)t=Math.imul(t^e.charCodeAt(s),3432918353),t=t<<13|t>>>19;return t=Math.imul(t^t>>>16,2246822507),t=Math.imul(t^t>>>13,3266489909),(t^=t>>>16)>>>0}function I(e){let t=typeof e=="string"?V(e):e>>>0;return t===0&&(t=1),()=>{t|=0,t=t+1831565813|0;let s=Math.imul(t^t>>>15,1|t);return s=s+Math.imul(s^s>>>7,61|s)^s,((s^s>>>14)>>>0)/4294967296}}function C(e,t){return Math.floor(e()*t)}function A(e,t){for(let s=e.length-1;s>0;s--){const a=C(t,s+1);[e[s],e[a]]=[e[a],e[s]]}return e}function R(){return`s-${Date.now().toString(36)}-${Math.floor(Math.random()*1e9).toString(36)}`}function J(){return{phase:"home",mode:null,players:[],seed:R(),drawCount:0,lastResult:null,roomCode:null,isHost:!0,isOnline:!1,myPlayerId:null,skillPending:!1,ceremonyStep:0}}function T(e,t){const s=I(t+":roles"),a=M(e.length,i=>C(s,i));return e.map((i,n)=>{const o=a[n];return{id:`p${n}`,name:i.trim()||`玩家${n+1}`,roleId:o,hasPass:o==="intern",skipNext:!1}})}function L(e){return S(e.roleId)}function q(e){const t=I(`${e.seed}:draw:${e.drawCount}`),s=e.players.filter(o=>!o.skipNext),a=s.length>0?s:e.players,i=a[C(t,a.length)];for(const o of e.players)o.skipNext&&(o.skipNext=!1);const n=L(i);return{playerId:i.id,mode:"draw_one",message:`${i.name}（${n.name}）中籤！`,drinkHint:n.drink,skillKind:n.skillKind}}function G(e){const t=I(`${e.seed}:order:${e.drawCount}`),s=e.players.map(i=>i.id);A(s,t);const a=s.map(i=>e.players.find(n=>n.id===i).name);return{playerId:s[0],mode:"drink_order",message:"乾杯順序出爐！",drinkHint:a.map((i,n)=>`${n+1}. ${i}`).join(" → "),skillKind:"none",order:s}}function X(e){const t=I(`${e.seed}:team:${e.drawCount}`),s=e.players.map(d=>d.id);A(s,t);const a=Math.ceil(s.length/2),i=s.slice(0,a),n=s.slice(a),o=d=>e.players.find(r=>r.id===d).name;return{playerId:i[0],mode:"team_toast",message:"分隊完成！兩隊乾杯！",drinkHint:"🔥 A隊 vs ❄️ B隊",skillKind:"none",teams:[{name:"🔥 HEAT 隊",members:i.map(o)},{name:"❄️ ICE 隊",members:n.map(o)}]}}function x(e,t,s,a){const i=e.lastResult;if(!i)return"";const n=e.players.find(d=>d.id===i.playerId),o=s?e.players.find(d=>d.id===s):void 0;switch(t){case"pick_drink2":return o?`📢 ${n==null?void 0:n.name} 打小報告！${o.name} 喝 2 杯！`:"請選擇目標";case"boss_choice":return a==="all"?"🕶️ 老闆發話：全場一起喝 1 杯！":o?`🕶️ 老闆點名：${o.name} 喝 2 杯！`:"請選擇";case"intern_pass":return n&&(n.hasPass=!1),o?`🐣 ${n==null?void 0:n.name} 喊救命！喝酒傳給 ${o.name}！`:"請選擇傳給誰";case"treat":return o?`🤝 ${n==null?void 0:n.name} 請客！${n==null?void 0:n.name} 與 ${o.name} 各喝 1！`:"請選擇請客對象";case"transfer":if(a==="redraw"){const d=I(`${e.seed}:redraw:${e.drawCount}`),r=M(e.players.length,c=>C(d,c));return e.players.forEach((c,m)=>{c.roleId=r[m],c.hasPass=c.roleId==="intern"}),"📋 人資宣布：全體重新抽角色！"}if(n&&o){const d=n.roleId;return n.roleId=o.roleId,o.roleId=d,n.hasPass=n.roleId==="intern",o.hasPass=o.roleId==="intern",`📋 調職！${n.name} ⇄ ${o.name}`}return"請選擇";case"tax":return o?`🧮 報帳！${o.name} 多喝 1；${n==null?void 0:n.name} 改半杯`:"請選擇";case"deploy":return o&&(o.skipNext=!0),o?`💻 緊急上線！${n==null?void 0:n.name} 喝 1；${o.name} 下輪免抽`:`${n==null?void 0:n.name} 喝 1 杯（可選延後對象）`;case"overtime":return n&&(n.skipNext=!0),`🐕 ${n==null?void 0:n.name} 加班！喝 2 杯，下輪免抽`;default:return`${n==null?void 0:n.name} ${S((n==null?void 0:n.roleId)??"worker").drink}`}}const Y={};function Q(e){return{phase:e.phase,mode:e.mode,players:e.players,seed:e.seed,drawCount:e.drawCount,lastResult:e.lastResult,skillPending:e.skillPending,ceremonyStep:e.ceremonyStep}}function Z(e,t){e.phase=t.phase,e.mode=t.mode,e.players=t.players,e.seed=t.seed,e.drawCount=t.drawCount,e.lastResult=t.lastResult,e.skillPending=t.skillPending,e.ceremonyStep=t.ceremonyStep}function ee(){const e=Y;if(e.VITE_WS_URL)return e.VITE_WS_URL;const t=typeof location<"u"?location:null;return t?t.hostname==="localhost"||t.hostname==="127.0.0.1"?`ws://${t.hostname}:8787`:`${t.protocol==="https:"?"wss:":"ws:"}//${t.hostname}:8787`:"ws://localhost:8787"}class te{constructor(t,s){k(this,"ws",null);k(this,"handlers");k(this,"url");k(this,"reconnectTimer",null);this.handlers=t,this.url=s??ee()}get connected(){var t;return((t=this.ws)==null?void 0:t.readyState)===WebSocket.OPEN}connect(){var t,s,a,i,n,o;if(!(this.ws&&(this.ws.readyState===WebSocket.OPEN||this.ws.readyState===WebSocket.CONNECTING))){(s=(t=this.handlers).onStatus)==null||s.call(t,"connecting");try{this.ws=new WebSocket(this.url)}catch{(i=(a=this.handlers).onStatus)==null||i.call(a,"error"),(o=(n=this.handlers).onError)==null||o.call(n,"無法連線到房間伺服器");return}this.ws.onopen=()=>{var d,r;return(r=(d=this.handlers).onStatus)==null?void 0:r.call(d,"open")},this.ws.onclose=()=>{var d,r;(r=(d=this.handlers).onStatus)==null||r.call(d,"closed")},this.ws.onerror=()=>{var d,r,c,m;(r=(d=this.handlers).onStatus)==null||r.call(d,"error"),(m=(c=this.handlers).onError)==null||m.call(c,"連線失敗（可改用單機模式，或確認已啟動 npm run server）")},this.ws.onmessage=d=>{try{const r=JSON.parse(String(d.data));this.handle(r)}catch{}}}}handle(t){var s,a,i,n,o,d,r,c,m,y;switch(t.type){case"created":(a=(s=this.handlers).onCreated)==null||a.call(s,t.code,t.playerId);break;case"joined":(n=(i=this.handlers).onJoined)==null||n.call(i,t.code,t.playerId,t.isHost);break;case"roster":(d=(o=this.handlers).onRoster)==null||d.call(o,t.players,t.hostId);break;case"state":(c=(r=this.handlers).onState)==null||c.call(r,t.state);break;case"error":(y=(m=this.handlers).onError)==null||y.call(m,t.message);break}}send(t){var s,a;if(!this.ws||this.ws.readyState!==WebSocket.OPEN){(a=(s=this.handlers).onError)==null||a.call(s,"尚未連上伺服器");return}this.ws.send(JSON.stringify(t))}create(t){this.connect();const s=()=>{var a;((a=this.ws)==null?void 0:a.readyState)===WebSocket.OPEN?this.send({type:"create",name:t}):setTimeout(s,50)};s()}join(t,s){this.connect();const a=()=>{var i;((i=this.ws)==null?void 0:i.readyState)===WebSocket.OPEN?this.send({type:"join",code:t,name:s}):setTimeout(a,50)};a()}sync(t){this.send({type:"sync",state:t})}disconnect(){var t;this.reconnectTimer!=null&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null),(t=this.ws)==null||t.close(),this.ws=null}}function p(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function b(e){return`<div class="wall-bg"></div>${e}`}function D(){return b(`
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
  `)}function se(e,t){const s=e.map((a,i)=>`
      <div class="player-chip">
        <span class="num">${i+1}</span>
        <input data-name-idx="${i}" value="${p(a)}" maxlength="12" aria-label="玩家${i+1}" />
        <button class="chip-btn" data-action="remove-player" data-idx="${i}" ${e.length<=2?"disabled":""} type="button">✕</button>
      </div>`).join("");return b(`
    <div class="screen" data-screen="setup">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">${t?"ONLINE SETUP":"SOLO SETUP"}</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">組隊</h1>
      <p class="hint">2–12 人。每個人會拿到一個街頭辦公室角色。</p>
      <div class="player-list">${s}</div>
      <button class="btn btn-lime" data-action="add-player" ${e.length>=12?"disabled":""} type="button">＋ 加一位</button>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="confirm-setup" type="button">🔥 鎖定陣容</button>
      </div>
    </div>
  `)}function ne(e,t,s){const a=t.length>0?t.map(i=>`
        <div class="player-chip">
          <span class="status-dot ${i.connected?"on":"off"}"></span>
          <strong>${p(i.name)}</strong>
          ${i.id===e.myPlayerId?'<span class="tag-pill" style="font-size:0.6rem">YOU</span>':""}
        </div>`).join(""):e.players.map(i=>`
        <div class="player-chip"><span class="num">★</span><strong>${p(i.name)}</strong></div>`).join("");return b(`
    <div class="screen" data-screen="lobby">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        ${e.roomCode?`<span class="room-badge">${p(e.roomCode)}</span>`:""}
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">房間</h1>
      <p class="hint">
        <span class="status-dot ${s==="open"?"on":"off"}"></span>
        連線：${p(s)} · 房主為抽籤權威
      </p>
      <div class="sticker">
        <p style="margin:0;font-weight:800">把房間碼或網址分給同事加入。</p>
        <p class="hint" style="margin-bottom:0">網址可帶 <code>?room=${p(e.roomCode??"")}</code></p>
      </div>
      <div class="player-list" style="margin-top:12px">${a}</div>
      <div class="btn-row">
        ${e.isHost?'<button class="btn btn-lg" data-action="start-online" type="button">🎤 開始發角色</button>':'<p class="hint">等待房主開始…</p>'}
      </div>
    </div>
  `)}function ae(e){const t=e.map(s=>{const a=L(s);return`
        <div class="role-card" style="box-shadow:4px 4px 0 ${a.color}">
          <span class="drip" style="background:${a.color}"></span>
          <span class="emoji">${a.emoji}</span>
          <div class="name">${p(s.name)}</div>
          <div class="tag">${p(a.tag)} · ${p(a.name)}</div>
          <div class="skill"><strong style="color:${a.color}">${p(a.skillName)}</strong><br/>${p(a.skillDesc)}<br/><span style="color:var(--spray-lime)">${p(a.drink)}</span></div>
        </div>`}).join("");return b(`
    <div class="screen" data-screen="roles">
      <div class="top-bar">
        <span class="tag-pill">CREW</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">角色卡</h1>
      <p class="hint">記住自己的技能。準備上牆噴漆揭示！</p>
      <div class="role-grid">${t}</div>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="to-modes" type="button">👉 選模式</button>
      </div>
    </div>
  `)}function ie(){const e=P.map(t=>`
    <div class="role-card" style="box-shadow:4px 4px 0 ${t.color}">
      <span class="drip" style="background:${t.color}"></span>
      <span class="emoji">${t.emoji}</span>
      <div class="name">${p(t.name)}</div>
      <div class="tag">${p(t.tag)}</div>
      <div class="skill"><strong style="color:${t.color}">${p(t.skillName)}</strong><br/>${p(t.skillDesc)}<br/><span style="color:var(--spray-lime)">${p(t.drink)}</span></div>
    </div>`).join("");return b(`
    <div class="screen" data-screen="roles-preview">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">ROSTER</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">全角色</h1>
      <div class="role-grid">${e}</div>
    </div>
  `)}function F(e){const t=e.isOnline&&!e.isHost;return b(`
    <div class="screen" data-screen="modes">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="back-roles" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        ${e.roomCode?`<span class="room-badge">${p(e.roomCode)}</span>`:'<span class="tag-pill">MODE</span>'}
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">選模式</h1>
      ${t?'<p class="hint">只有房主可以抽籤，你會同步看到結果。</p>':""}
      <div class="mode-grid">
        <button class="mode-card" data-action="mode" data-mode="draw_one" ${t?"disabled":""} type="button">
          <div class="m-title">🎲 抽一位喝酒</div>
          <div class="m-desc">Seed 公平亂數 · 街頭儀式大揭示 · 可發動技能</div>
        </button>
        <button class="mode-card" data-action="mode" data-mode="drink_order" ${t?"disabled":""} type="button">
          <div class="m-title">📜 喝杯順序</div>
          <div class="m-desc">洗牌排出誰先乾，誰壓軸</div>
        </button>
        <button class="mode-card" data-action="mode" data-mode="team_toast" ${t?"disabled":""} type="button">
          <div class="m-title">🤜 分隊乾杯</div>
          <div class="m-desc">隨機兩隊 · 對幹乾杯</div>
        </button>
      </div>
    </div>
  `)}function le(e){const t=["搖罐中…","噴漆上牆…","揭開標籤！"];return b(`
    <div class="screen" data-screen="drawing">
      <div class="ceremony">
        <div class="boombox">🎧</div>
        <div class="graffiti-title" style="font-size:1.8rem">${t[Math.min(e,t.length-1)]}</div>
        <p class="hint">街頭儀式進行中</p>
      </div>
      <div class="spray-burst" id="spray-burst"></div>
    </div>
  `)}function oe(e){const t=e.lastResult;if(!t)return F(e);const s=e.players.find(n=>n.id===t.playerId),a=s?S(s.roleId):null;if(t.mode==="drink_order"&&t.order){const n=t.order.map((o,d)=>{const r=e.players.find(c=>c.id===o);return`<li style="animation-delay:${d*.08}s">${d+1}. ${p(r.name)} <span style="color:var(--muted)">（${p(S(r.roleId).name)}）</span></li>`}).join("");return b(`
      <div class="screen" data-screen="reveal">
        <div class="ceremony" style="justify-content:flex-start;padding-top:24px">
          <div class="reveal-name">順序出爐</div>
          <ul class="order-list" style="padding:0;width:100%">${n}</ul>
        </div>
        <div class="btn-row">
          <button class="btn btn-lg" data-action="again" type="button">再來一輪</button>
          <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
        </div>
      </div>
    `)}if(t.mode==="team_toast"&&t.teams){const n=t.teams.map(o=>`
      <div class="team">
        <h3>${p(o.name)}</h3>
        <div>${o.members.map(d=>p(d)).join(" · ")}</div>
      </div>`).join("");return b(`
      <div class="screen" data-screen="reveal">
        <div class="ceremony" style="justify-content:flex-start;padding-top:24px">
          <div class="reveal-name">分隊乾杯</div>
          <div class="team-box">${n}</div>
          <div class="reveal-drink">兩隊互敬 · 乾！</div>
        </div>
        <div class="btn-row">
          <button class="btn btn-lg" data-action="again" type="button">再分一次</button>
          <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
        </div>
      </div>
    `)}const i=t.skillKind!=="none"&&e.skillPending;return b(`
    <div class="screen" data-screen="reveal">
      <div class="ceremony">
        <div class="tag-pill" style="transform:rotate(-6deg)">HIT!</div>
        <div class="reveal-name shake">${p((s==null?void 0:s.name)??"?")}</div>
        <div style="font-size:2.5rem">${(a==null?void 0:a.emoji)??"💥"}</div>
        <div class="graffiti-sub">${p((a==null?void 0:a.name)??"")} · ${p((a==null?void 0:a.tag)??"")}</div>
        <div class="reveal-drink">${p(t.drinkHint)}</div>
        ${a&&a.skillKind!=="none"?`<div class="sticker" style="width:100%;margin-top:8px">
                <strong style="color:var(--spray-pink)">${p(a.skillName)}</strong>
                <p class="hint" style="margin:4px 0 0">${p(a.skillDesc)}</p>
              </div>`:""}
      </div>
      <div class="btn-row">
        ${i?`<button class="btn btn-pink btn-lg" data-action="use-skill" type="button">⚡ 發動技能</button>
               <button class="btn btn-lime" data-action="skip-skill" type="button">直接喝 · 跳過技能</button>`:`<button class="btn btn-lg" data-action="again" type="button">🎲 再抽一次</button>
               <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>`}
      </div>
      <div class="spray-burst" id="spray-burst"></div>
    </div>
  `)}function re(e){const t=e.lastResult;if(!t)return F(e);const s=e.players.find(r=>r.id===t.playerId),a=s?S(s.roleId):null,i=e.players.filter(r=>r.id!==t.playerId),n=e.players.filter(r=>r.roleId==="worker"&&r.id!==t.playerId),o=(r,c)=>r.map(m=>`<button class="chip-btn" data-action="${c}" data-target="${m.id}" type="button">${p(m.name)}</button>`).join("")||'<p class="hint">沒有可選對象</p>';let d="";switch(t.skillKind){case"pick_drink2":d=`<p class="hint">指定一位「上班族」喝 2</p><div class="targets">${o(n.length?n:i,"skill-target")}</div>`;break;case"boss_choice":d=`
        <button class="btn btn-pink" data-action="skill-opt" data-opt="all" type="button">全場喝 1</button>
        <p class="hint">或指定一人喝 2：</p>
        <div class="targets">${o(i,"skill-target")}</div>`;break;case"intern_pass":d=(s==null?void 0:s.hasPass)===!1?'<p class="error-banner">救命已用完</p>':`<p class="hint">把這次喝酒傳給誰？</p><div class="targets">${o(i,"skill-target")}</div>`;break;case"treat":d=`<p class="hint">請客對象（各喝 1）</p><div class="targets">${o(i,"skill-target")}</div>`;break;case"transfer":d=`
        <button class="btn btn-cyan" data-action="skill-opt" data-opt="redraw" type="button">全體重抽角色</button>
        <p class="hint">或與一人互換：</p>
        <div class="targets">${o(i,"skill-target")}</div>`;break;case"tax":d=`<p class="hint">誰多喝 1？（你改半杯）</p><div class="targets">${o(i,"skill-target")}</div>`;break;case"deploy":d=`
        <p class="hint">可指定一人下輪免抽（也可跳過）</p>
        <div class="targets">${o(i,"skill-target")}</div>
        <button class="btn btn-lime" data-action="skill-opt" data-opt="selfonly" type="button">只自己喝 1</button>`;break;case"overtime":d='<button class="btn btn-pink btn-lg" data-action="skill-opt" data-opt="ot" type="button">確認加班：喝 2，下輪免抽</button>';break;default:d='<button class="btn" data-action="skip-skill" type="button">完成</button>'}return b(`
    <div class="screen" data-screen="skill">
      <div class="top-bar">
        <span class="tag-pill">SKILL</span>
      </div>
      <h1 class="graffiti-title" style="font-size:1.8rem">${p((a==null?void 0:a.skillName)??"技能")}</h1>
      <div class="skill-panel sticker">
        ${d}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" data-action="skip-skill" type="button">取消技能</button>
      </div>
    </div>
  `)}function de(e){return b(`
    <div class="screen" data-screen="result">
      <div class="ceremony">
        <div class="reveal-name" style="font-size:1.6rem">技能發動</div>
        <div class="sticker" style="width:100%">
          <p style="margin:0;font-size:1.2rem;font-weight:900;line-height:1.5">${p(e)}</p>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="again" type="button">🎲 再抽</button>
        <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
      </div>
    </div>
  `)}function ce(){return b(`
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
  `)}function pe(){return b(`
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
  `)}const O=document.querySelector("#app"),l=J();let f=["玩家1","玩家2","玩家3","玩家4"],W="idle",E=[],$="",g=null,z=null,j=null;const w=new te({onStatus:e=>{W=e,l.phase==="lobby"&&u()},onCreated:(e,t)=>{l.roomCode=e,l.myPlayerId=t,l.isHost=!0,l.isOnline=!0,l.phase="lobby",_(e),u()},onJoined:(e,t,s)=>{l.roomCode=e,l.myPlayerId=t,l.isHost=s,l.isOnline=!0,l.phase="lobby",_(e),u()},onRoster:e=>{E=e,u()},onState:e=>{l.isHost||(Z(l,e),u(),l.phase==="reveal"&&N())},onError:e=>{alert(e)}});function _(e){const t=new URL(location.href);e?t.searchParams.set("room",e):t.searchParams.delete("room"),history.replaceState(null,"",t.toString())}function h(){l.isOnline&&l.isHost&&w.connected&&w.sync(Q(l))}function u(){let e="";switch(l.phase){case"home":e=D();break;case"setup":e=se(f,l.isOnline);break;case"lobby":e=ne(l,E,W);break;case"roles":e=ae(l.players);break;case"mode_select":e=F(l);break;case"drawing":e=le(l.ceremonyStep);break;case"reveal":e=oe(l);break;case"skill":e=re(l);break;case"result":e=de($);break;default:e=D()}j==="join"&&(e=ce()),j==="host-name"&&(e=pe()),j==="roles-preview"&&(e=ie()),O.innerHTML=e}function v(e){j=e}function K(e){l.isOnline&&!l.isHost||(z=e,l.mode=e,l.phase="drawing",l.ceremonyStep=0,l.skillPending=!1,h(),u(),N(),g!=null&&window.clearInterval(g),g=window.setInterval(()=>{l.ceremonyStep+=1,l.ceremonyStep>=3?(g!=null&&window.clearInterval(g),g=null,ue()):(h(),u(),N())},700))}function ue(){const e=z??l.mode;if(!e)return;let t;e==="draw_one"?t=q(l):e==="drink_order"?t=G(l):t=X(l),l.lastResult=t,l.drawCount+=1,l.phase="reveal",l.skillPending=e==="draw_one"&&t.skillKind!=="none",h(),u(),N()}function N(){const e=document.getElementById("spray-burst");if(!e)return;const t=["💥","✨","🔥","🧢","🎤","⭐","💧","🎨"];for(let s=0;s<14;s++){const a=document.createElement("span");a.textContent=t[s%t.length];const i=10+Math.random()*80,n=20+Math.random()*50;a.style.left=`${i}%`,a.style.top=`${n}%`,a.style.setProperty("--dx",`${(Math.random()-.5)*160}px`),a.style.setProperty("--dy",`${-80-Math.random()*120}px`),a.style.setProperty("--rot",`${(Math.random()-.5)*120}deg`),a.style.animationDelay=`${Math.random()*.2}s`,e.appendChild(a),window.setTimeout(()=>a.remove(),1200)}}O.addEventListener("click",e=>{var a,i,n,o,d;const t=e.target.closest("[data-action]");if(!t)return;const s=t.dataset.action;if(s)switch(s){case"home":v(null),l.phase="home",l.isOnline=!1,l.roomCode=null,w.disconnect(),_(null),u();break;case"solo":v(null),l.isOnline=!1,l.isHost=!0,l.phase="setup",u();break;case"host":v("host-name"),u();break;case"join":v("join"),u();break;case"roles-preview":v("roles-preview"),u();break;case"do-host":{const r=((a=document.getElementById("host-name"))==null?void 0:a.value.trim())||"房主";v(null),w.create(r),l.phase="lobby",u();break}case"do-join":{const r=((i=document.getElementById("join-name"))==null?void 0:i.value.trim())||"玩家",c=(n=document.getElementById("join-code"))==null?void 0:n.value.trim().toUpperCase();if(!c||c.length<4){alert("請輸入 4 碼房間碼");return}v(null),w.join(c,r),l.phase="lobby",u();break}case"add-player":f.length<12&&(f.push(`玩家${f.length+1}`),u());break;case"remove-player":{const r=Number(t.dataset.idx);f.length>2&&(f.splice(r,1),u());break}case"confirm-setup":{O.querySelectorAll("[data-name-idx]").forEach(c=>{const m=Number(c.dataset.nameIdx);f[m]=c.value.trim()||`玩家${m+1}`}),l.seed=R(),l.players=T(f,l.seed),l.drawCount=0,l.lastResult=null,l.phase="roles",h(),u();break}case"start-online":{if(!l.isHost)return;const r=E.map(c=>c.name);if(r.length<2){alert("至少需要 2 人");return}l.seed=R(),l.players=T(r,l.seed),l.players.forEach((c,m)=>{const y=E[m];y&&(c.id=y.id,c.name=y.name)}),l.myPlayerId=l.myPlayerId,l.drawCount=0,l.lastResult=null,l.phase="roles",h(),u();break}case"to-modes":v(null),l.phase="mode_select",l.skillPending=!1,h(),u();break;case"back-roles":l.phase="roles",h(),u();break;case"mode":{const r=t.dataset.mode;K(r);break}case"again":l.mode&&K(l.mode);break;case"use-skill":l.phase="skill",h(),u();break;case"skip-skill":l.skillPending=!1,l.phase="reveal",h(),u();break;case"skill-target":{const r=t.dataset.target,c=((o=l.lastResult)==null?void 0:o.skillKind)??"none";$=x(l,c,r),l.skillPending=!1,l.phase="result",h(),u();break}case"skill-opt":{const r=t.dataset.opt,c=((d=l.lastResult)==null?void 0:d.skillKind)??"none";r==="selfonly"?$=x(l,"deploy"):r==="ot"?$=x(l,"overtime"):$=x(l,c,void 0,r),l.skillPending=!1,l.phase="result",h(),u();break}}});O.addEventListener("change",e=>{const t=e.target;if(t.matches("[data-name-idx]")){const s=Number(t.dataset.nameIdx);f[s]=t.value}});const me=new URLSearchParams(location.search),H=me.get("room");H?(v("join"),u(),window.setTimeout(()=>{const e=document.getElementById("join-code");e&&(e.value=H.toUpperCase())},0)):u();
