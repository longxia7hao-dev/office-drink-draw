var nt=Object.defineProperty;var it=(t,e,s)=>e in t?nt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var j=(t,e,s)=>it(t,typeof e!="symbol"?e+"":e,s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function s(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(o){if(o.ep)return;o.ep=!0;const n=s(o);fetch(o.href,n)}})();const F=[{id:"manager",name:"主管",emoji:"👔",tag:"BOSS UP",drink:"喝 1 杯",skillName:"打小報告",skillDesc:"指定一位「上班族」喝 2 杯",skillKind:"pick_drink2",color:"#FF3D71",accent:"#FFE566"},{id:"worker",name:"上班族",emoji:"💼",tag:"9to5",drink:"喝 1 杯",skillName:"摸魚",skillDesc:"純喝 1 杯，沒有特殊技能（但人多勢眾）",skillKind:"none",color:"#4ECDC4",accent:"#FFF"},{id:"ceo",name:"老闆",emoji:"🕶️",tag:"BIG SHOT",drink:"喝 1 杯",skillName:"老闆發話",skillDesc:"全場一起喝 1，或指定一人喝 2",skillKind:"boss_choice",color:"#FFD700",accent:"#1A1A1A"},{id:"intern",name:"實習生",emoji:"🐣",tag:"ROOKIE",drink:"抿半杯 或 喝 1",skillName:"喊救命",skillDesc:"整場遊戲可使用 1 次：把這次喝酒傳給別人",skillKind:"intern_pass",color:"#A78BFA",accent:"#FFF"},{id:"sales",name:"業務",emoji:"🤝",tag:"DEAL",drink:"喝 1 杯",skillName:"請客",skillDesc:"指定一人跟你一起各喝 1 杯",skillKind:"treat",color:"#FF8C42",accent:"#FFF"},{id:"hr",name:"人資",emoji:"📋",tag:"HR",drink:"喝 1 杯",skillName:"調職",skillDesc:"與一人互換角色，或全體重新抽角色",skillKind:"transfer",color:"#38BDF8",accent:"#FFF"},{id:"accountant",name:"會計",emoji:"🧮",tag:"TAX",drink:"喝 1 杯",skillName:"報帳",skillDesc:"指定一人多喝 1；自己可改為半杯",skillKind:"tax",color:"#34D399",accent:"#1A1A1A"},{id:"engineer",name:"工程師",emoji:"💻",tag:"SHIP IT",drink:"喝 1 杯",skillName:"緊急上線",skillDesc:"自己喝 1，可指定一人這輪免抽（延後）",skillKind:"deploy",color:"#60A5FA",accent:"#FFF"},{id:"overtime",name:"加班狗",emoji:"🐕",tag:"OT",drink:"喝 2 杯",skillName:"加班免抽",skillDesc:"這輪喝 2，下一輪抽籤時自動跳過你",skillKind:"overtime",color:"#F472B6",accent:"#FFF"}];function C(t){return F.find(e=>e.id===t)??F[1]}function Z(t,e){const s=[...F];for(let o=s.length-1;o>0;o--){const n=e(o+1);[s[o],s[n]]=[s[n],s[o]]}const a=[];for(let o=0;o<t;o++)o<s.length?a.push(s[o].id):a.push("worker");for(let o=a.length-1;o>0;o--){const n=e(o+1);[a[o],a[n]]=[a[n],a[o]]}return a}function at(t){let e=1779033703^t.length;for(let s=0;s<t.length;s++)e=Math.imul(e^t.charCodeAt(s),3432918353),e=e<<13|e>>>19;return e=Math.imul(e^e>>>16,2246822507),e=Math.imul(e^e>>>13,3266489909),(e^=e>>>16)>>>0}function P(t){let e=typeof t=="string"?at(t):t>>>0;return e===0&&(e=1),()=>{e|=0,e=e+1831565813|0;let s=Math.imul(e^e>>>15,1|e);return s=s+Math.imul(s^s>>>7,61|s)^s,((s^s>>>14)>>>0)/4294967296}}function H(t,e){return Math.floor(t()*e)}function V(t,e){for(let s=t.length-1;s>0;s--){const a=H(e,s+1);[t[s],t[a]]=[t[a],t[s]]}return t}function K(){return`s-${Date.now().toString(36)}-${Math.floor(Math.random()*1e9).toString(36)}`}const L=[{id:"fq01",q:"開會時投影片突然黑掉，最合理的解釋是？",options:["投影機在摸魚","宇宙管理員按了暫停"],correct:1},{id:"fq02",q:"冰箱裡的便當會自己長腳逃走，因為？",options:["它不想被微波","它考上了外派"],correct:0},{id:"fq03",q:"鍵盤上的空白鍵為什麼叫空白？",options:["因為它心裡很空","因為它負責製造沉默"],correct:1},{id:"fq04",q:"周一早上鬧鐘響三遍，代表？",options:["時間在求饒","你跟床簽了加班合約"],correct:1},{id:"fq05",q:"影印機卡紙的真正原因是？",options:["紙張想休息五分鐘","它在抗議被印太多 KPI"],correct:0},{id:"fq06",q:"咖啡機吐出氣泡音，其實是在？",options:["說饒舌","報今日運勢"],correct:0},{id:"fq07",q:"電梯門關太慢，是因為？",options:["它在等遲到的靈魂","門縫在談戀愛"],correct:0},{id:"fq08",q:"滑鼠游標一直轉圈，代表電腦在？",options:["冥想","偷偷看連續劇"],correct:1},{id:"fq09",q:"會議室冷氣為什麼總是太冷？",options:["為了凍結愚蠢發言","冷氣在練冰系魔法"],correct:0},{id:"fq10",q:"同事說「我五分鐘就好」，五分鐘等於？",options:["一個小時代","量子不確定時間"],correct:1},{id:"fq11",q:"自動販賣機吃幣不吐貨，是因為？",options:["它在存退休金","它覺得你不夠潮"],correct:0},{id:"fq12",q:"Wi‑Fi 名稱叫「別連我」，你應該？",options:["連得更用力","對它鞠躬道歉"],correct:0},{id:"fq13",q:"廁所衛生紙用完時，宇宙會？",options:["播放尷尬配樂","派一隻鴿子送紙"],correct:0},{id:"fq14",q:"簡報第 87 頁還在講前言，代表講者？",options:["誤入時空迴圈","把結局藏在前言裡"],correct:0},{id:"fq15",q:"辦公椅發出怪聲是因為？",options:["它想換跑道當鼓手","它在模仿你的薪水"],correct:0},{id:"fq16",q:"螢幕保護程式出現熱帶魚，真相是？",options:["魚在代班","電腦在度假你不行"],correct:1},{id:"fq17",q:"「差不多就好」在公司語代表？",options:["絕對要重做三遍","已經完美到不行"],correct:0},{id:"fq18",q:"雨傘忘在公司，雨傘現在？",options:["加入了另一個部門","正在開自己的傘派對"],correct:1},{id:"fq19",q:"為什麼打字會突然跳去上一行？",options:["游標想逃家","鍵盤在玩捉迷藏"],correct:0},{id:"fq20",q:"中午便當店排到隊尾，代表你？",options:["被命運選為苦行僧","其實是隱形人"],correct:0},{id:"fq21",q:"群組訊息已讀不回，對方其實？",options:["正在練習隱形術","被訊息吸進黑洞"],correct:1},{id:"fq22",q:"白板筆沒水了還硬寫，寫出來的是？",options:["空氣藝術","隱形 KPI"],correct:0},{id:"fq23",q:"下班卡刷不過，系統認為你？",options:["還欠宇宙一小時","其實是影分身"],correct:0},{id:"fq24",q:"會議室電視遙控器失蹤，它去了？",options:["異次元沙發縫","跟電池私奔"],correct:0},{id:"fq25",q:"「這個需求很簡單」說完之後會？",options:["長出十七個子需求","立刻世界和平"],correct:0},{id:"fq26",q:"印表機燈一直閃橘燈，是在？",options:["發出求救摩斯密碼","慶祝週年慶"],correct:0},{id:"fq27",q:"為什麼耳機線總會打結？",options:["它在練習魔術","它嫉妒無線耳機"],correct:1},{id:"fq28",q:"週五下午開會的真正目的是？",options:["測試誰還有靈魂","幫周末暖身延遲"],correct:0},{id:"fq29",q:"雲端硬碟顯示同步中……其實在？",options:["跟雲聊天","把檔案帶去旅行"],correct:1},{id:"fq30",q:"「我傳檔案給你了」但你沒收到，檔案？",options:["卡在平行宇宙信箱","變成了幽靈附件"],correct:0},{id:"fq31",q:"公司盆栽突然暴斃，最可能是？",options:["聽太多會議自殺","被 PowerPoint 曬傷"],correct:0},{id:"fq32",q:"為什麼螺絲總會多一顆或少一顆？",options:["螺絲有自己的工會","組裝精靈在抽成"],correct:0},{id:"fq33",q:"深夜加班螢幕反光裡出現臉，那是？",options:["你的未來自己來催進度","鍵盤幽靈求放假"],correct:0},{id:"fq34",q:"「順便」兩個字在主管嘴裡等於？",options:["一座小山的工作量","真的只是順便"],correct:0},{id:"fq35",q:"手機掉進沙發縫，沙發其實？",options:["開了一間手機旅館","在徵收保護費"],correct:0},{id:"tw01",q:"捷運門快關時有人狂奔，車門心裡在想？",options:["再給你 0.3 秒當人生轉折","我是門不是情感支援"],correct:0},{id:"tw02",q:"夜市攤車突然播「謝謝再光臨」其實是？",options:["在逼你買第二份炸雞","在跟隔壁攤宣戰"],correct:0},{id:"tw03",q:"便利商店關東煮湯飄香，真正目的是？",options:["催眠你拿走兩個御飯糰","召喚加班靈魂"],correct:0},{id:"tw04",q:"假新聞標題：「台北盆地宣布自立為盆地共和國」下一步是？",options:["發盆地護照給蚊子","跟高雄簽自由貿易（賣黑輪）"],correct:1},{id:"tw05",q:"颱風假放一天，大家第一反應其實是？",options:["瞬間變氣象專家","先約火鍋再看風雨"],correct:0},{id:"tw06",q:"YouBike 車柱顯示「無車」代表？",options:["車去參加車聚了","宇宙提醒你該走路減肥"],correct:1},{id:"tw07",q:"假新聞：「珍珠奶茶列入世界遺產」最大衝擊是？",options:["吸管要申遺編號","粉圓開始收門票"],correct:1},{id:"tw08",q:"排隊名店前面的人突然離隊，是因為？",options:["手機電量比胃口先死","被隔壁攤的香氣綁架"],correct:0},{id:"tw09",q:"高鐵廣播「列車即將進站」翻譯成人話是？",options:["請把自拍桿收回異次元","請把行李從走道移開（拜託）"],correct:1},{id:"tw10",q:"假新聞：「小籠包投票選出新市長」政見會是？",options:["湯汁透明化","免費加醋政策"],correct:0},{id:"tw11",q:"梅雨季鞋子發霉，鞋子留下遺言：",options:["早說要通風","來生要當雨鞋"],correct:1},{id:"tw12",q:"夜市射氣球老闆說「差一點」其實是？",options:["差一點讓你破產","差一點揭穿磁場作弊"],correct:0},{id:"tw13",q:"假新聞：「101 點燈拼出上班族哭臉」解讀？",options:["周一限定燈光秀","電梯壞了的集體回憶"],correct:0},{id:"tw14",q:"超商美式咖啡 49 元，咖啡豆的心情是？",options:["我也很努力過","至少比會議好喝"],correct:1},{id:"tw15",q:"假新聞：「機車雙載改成三重奏合法」配套是？",options:["後座要帶卡拉OK","安全帽改成派對燈"],correct:0},{id:"tw16",q:"路邊停車格顯示「收費中」但你看不到收費員，因為？",options:["收費員隱身練功","格子本身會吸錢"],correct:1}];function ot(t){return L.find(e=>e.id===t)??L[0]}function lt(){return{phase:"home",mode:null,players:[],seed:K(),drawCount:0,lastResult:null,roomCode:null,isHost:!0,isOnline:!1,myPlayerId:null,skillPending:!1,ceremonyStep:0,flip:null}}function z(t,e){const s=P(e+":roles"),a=Z(t.length,o=>H(s,o));return t.map((o,n)=>{const r=a[n];return{id:`p${n}`,name:o.trim()||`玩家${n+1}`,roleId:r,hasPass:r==="intern",skipNext:!1}})}function tt(t){return C(t.roleId)}function rt(t){const e=P(`${t.seed}:draw:${t.drawCount}`),s=t.players.filter(r=>!r.skipNext),a=s.length>0?s:t.players,o=a[H(e,a.length)];for(const r of t.players)r.skipNext&&(r.skipNext=!1);const n=tt(o);return{playerId:o.id,mode:"draw_one",message:`${o.name}（${n.name}）中籤！`,drinkHint:n.drink,skillKind:n.skillKind}}function dt(t){const e=P(`${t.seed}:order:${t.drawCount}`),s=t.players.map(o=>o.id);V(s,e);const a=s.map(o=>t.players.find(n=>n.id===o).name);return{playerId:s[0],mode:"drink_order",message:"乾杯順序出爐！",drinkHint:a.map((o,n)=>`${n+1}. ${o}`).join(" → "),skillKind:"none",order:s}}function ct(t){const e=P(`${t.seed}:team:${t.drawCount}`),s=t.players.map(d=>d.id);V(s,e);const a=Math.ceil(s.length/2),o=s.slice(0,a),n=s.slice(a),r=d=>t.players.find(l=>l.id===d).name;return{playerId:o[0],mode:"team_toast",message:"分隊完成！兩隊乾杯！",drinkHint:"🔥 A隊 vs ❄️ B隊",skillKind:"none",teams:[{name:"🔥 HEAT 隊",members:o.map(r)},{name:"❄️ ICE 隊",members:n.map(r)}]}}function _(t,e,s,a){const o=t.lastResult;if(!o)return"";const n=t.players.find(d=>d.id===o.playerId),r=s?t.players.find(d=>d.id===s):void 0;switch(e){case"pick_drink2":return r?`📢 ${n==null?void 0:n.name} 打小報告！${r.name} 喝 2 杯！`:"請選擇目標";case"boss_choice":return a==="all"?"🕶️ 老闆發話：全場一起喝 1 杯！":r?`🕶️ 老闆點名：${r.name} 喝 2 杯！`:"請選擇";case"intern_pass":return n&&(n.hasPass=!1),r?`🐣 ${n==null?void 0:n.name} 喊救命！喝酒傳給 ${r.name}！`:"請選擇傳給誰";case"treat":return r?`🤝 ${n==null?void 0:n.name} 請客！${n==null?void 0:n.name} 與 ${r.name} 各喝 1！`:"請選擇請客對象";case"transfer":if(a==="redraw"){const d=P(`${t.seed}:redraw:${t.drawCount}`),l=Z(t.players.length,p=>H(d,p));return t.players.forEach((p,f)=>{p.roleId=l[f],p.hasPass=p.roleId==="intern"}),"📋 人資宣布：全體重新抽角色！"}if(n&&r){const d=n.roleId;return n.roleId=r.roleId,r.roleId=d,n.hasPass=n.roleId==="intern",r.hasPass=r.roleId==="intern",`📋 調職！${n.name} ⇄ ${r.name}`}return"請選擇";case"tax":return r?`🧮 報帳！${r.name} 多喝 1；${n==null?void 0:n.name} 改半杯`:"請選擇";case"deploy":return r&&(r.skipNext=!0),r?`💻 緊急上線！${n==null?void 0:n.name} 喝 1；${r.name} 下輪免抽`:`${n==null?void 0:n.name} 喝 1 杯（可選延後對象）`;case"overtime":return n&&(n.skipNext=!0),`🐕 ${n==null?void 0:n.name} 加班！喝 2 杯，下輪免抽`;default:return`${n==null?void 0:n.name} ${C((n==null?void 0:n.roleId)??"worker").drink}`}}function pt(t){const e=P(`${t.seed}:flip:${t.drawCount}`),s=L.map(o=>o.id);V(s,e);const a=t.players.length>0?t.players[0].id:null;t.mode="flip_battle",t.phase="flip_battle",t.flip={deck:s,index:0,sub:"choose",votes:{},readyIds:[],answererId:a,drinkerIds:[],tie:!1,majoritySide:null},t.skillPending=!1,t.lastResult=null}function ut(t){const e=t.flip;if(!e||e.deck.length===0)return null;const s=e.deck[e.index%e.deck.length];return s?ot(s):null}function ft(t){return t.flip?t.players.length===0?!0:t.players.every(e=>e.id in t.flip.votes):!1}function mt(t){const e=t.flip;if(!e)return;let s=0,a=0;for(const n of t.players){const r=e.votes[n.id];r===0?s+=1:r===1&&(a+=1)}if(s===0&&a===0){e.tie=!0,e.majoritySide=null,e.drinkerIds=[];return}if(s===a){e.tie=!0,e.majoritySide=null,e.drinkerIds=[];return}e.tie=!1;const o=s<a?0:1;e.majoritySide=o===0?1:0,e.drinkerIds=t.players.filter(n=>e.votes[n.id]===o).map(n=>n.id)}function bt(t,e){var o;if(!t.flip||t.flip.sub!=="choose")return;const s=t.flip,a=s.answererId??((o=t.players.find(n=>!(n.id in s.votes)))==null?void 0:o.id)??t.myPlayerId;if(a&&!(a in s.votes)){if(s.votes[a]=e,!ft(t)){const n=t.players.find(r=>!(r.id in s.votes));s.answererId=(n==null?void 0:n.id)??null;return}mt(t),s.sub="result",s.readyIds=[],s.answererId=null}}function B(t,e){!t.flip||t.flip.sub!=="result"||t.flip.readyIds.includes(e)||t.flip.readyIds.push(e)}function D(t){return t.flip?t.players.length===0?!0:t.players.every(e=>t.flip.readyIds.includes(e.id)):!1}function ht(t){var s;if(!t.flip)return;const e=(t.flip.index+1)%t.flip.deck.length;t.flip.index=e,t.flip.sub="choose",t.flip.votes={},t.flip.readyIds=[],t.flip.drinkerIds=[],t.flip.tie=!1,t.flip.majoritySide=null,t.flip.answererId=((s=t.players[0])==null?void 0:s.id)??null,t.drawCount+=1}function vt(t){const e=t.flip;let s=0,a=0;if(!e)return{a:s,b:a};for(const o of t.players){const n=e.votes[o.id];n===0?s+=1:n===1&&(a+=1)}return{a:s,b:a}}const yt={};function gt(t){return{phase:t.phase,mode:t.mode,players:t.players,seed:t.seed,drawCount:t.drawCount,lastResult:t.lastResult,skillPending:t.skillPending,ceremonyStep:t.ceremonyStep,flip:t.flip}}function kt(t,e){t.phase=e.phase,t.mode=e.mode,t.players=e.players,t.seed=e.seed,t.drawCount=e.drawCount,t.lastResult=e.lastResult,t.skillPending=e.skillPending,t.ceremonyStep=e.ceremonyStep,t.flip=e.flip??null}function wt(){const t=yt;if(t.VITE_WS_URL)return t.VITE_WS_URL;const e=typeof location<"u"?location:null;return e?e.hostname==="localhost"||e.hostname==="127.0.0.1"?`ws://${e.hostname}:8787`:`${e.protocol==="https:"?"wss:":"ws:"}//${e.hostname}:8787`:"ws://localhost:8787"}class $t{constructor(e,s){j(this,"ws",null);j(this,"handlers");j(this,"url");j(this,"reconnectTimer",null);this.handlers=e,this.url=s??wt()}get connected(){var e;return((e=this.ws)==null?void 0:e.readyState)===WebSocket.OPEN}connect(){var e,s,a,o,n,r;if(!(this.ws&&(this.ws.readyState===WebSocket.OPEN||this.ws.readyState===WebSocket.CONNECTING))){(s=(e=this.handlers).onStatus)==null||s.call(e,"connecting");try{this.ws=new WebSocket(this.url)}catch{(o=(a=this.handlers).onStatus)==null||o.call(a,"error"),(r=(n=this.handlers).onError)==null||r.call(n,"無法連線到房間伺服器");return}this.ws.onopen=()=>{var d,l;return(l=(d=this.handlers).onStatus)==null?void 0:l.call(d,"open")},this.ws.onclose=()=>{var d,l;(l=(d=this.handlers).onStatus)==null||l.call(d,"closed")},this.ws.onerror=()=>{var d,l,p,f;(l=(d=this.handlers).onStatus)==null||l.call(d,"error"),(f=(p=this.handlers).onError)==null||f.call(p,"連線失敗（可改用單機模式，或確認已啟動 npm run server）")},this.ws.onmessage=d=>{try{const l=JSON.parse(String(d.data));this.handle(l)}catch{}}}}handle(e){var s,a,o,n,r,d,l,p,f,q;switch(e.type){case"created":(a=(s=this.handlers).onCreated)==null||a.call(s,e.code,e.playerId);break;case"joined":(n=(o=this.handlers).onJoined)==null||n.call(o,e.code,e.playerId,e.isHost);break;case"roster":(d=(r=this.handlers).onRoster)==null||d.call(r,e.players,e.hostId);break;case"state":(p=(l=this.handlers).onState)==null||p.call(l,e.state);break;case"error":(q=(f=this.handlers).onError)==null||q.call(f,e.message);break}}send(e){var s,a;if(!this.ws||this.ws.readyState!==WebSocket.OPEN){(a=(s=this.handlers).onError)==null||a.call(s,"尚未連上伺服器");return}this.ws.send(JSON.stringify(e))}create(e){this.connect();const s=()=>{var a;((a=this.ws)==null?void 0:a.readyState)===WebSocket.OPEN?this.send({type:"create",name:e}):setTimeout(s,50)};s()}join(e,s){this.connect();const a=()=>{var o;((o=this.ws)==null?void 0:o.readyState)===WebSocket.OPEN?this.send({type:"join",code:e,name:s}):setTimeout(a,50)};a()}sync(e){this.send({type:"sync",state:e})}disconnect(){var e;this.reconnectTimer!=null&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null),(e=this.ws)==null||e.close(),this.ws=null}}function c(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function b(t){return`<div class="wall-bg"></div>${t}`}function J(){return b(`
    <div class="screen" data-screen="home">
      <div class="top-bar">
        <span class="tag-pill">公司酒局.docx</span>
        <span class="tag-pill danger-pill">18+</span>
      </div>
      <h1 class="graffiti-title">公司酒局</h1>
      <div class="graffiti-sub">Office Drink Draw · Word / Excel UI</div>
      <div class="street-row" aria-hidden="true">📄 📊 📎 ✏️ ✅</div>
      <div class="sticker">
        <p style="margin:0;font-weight:800;line-height:1.5">
          Word／Excel 辦公室介面風 · 上班族抽籤喝酒<br/>
          <span class="accent-link">抽籤儀式 · 角色技能 · 翻牌少數方 · 可單機／開房</span>
        </p>
      </div>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="solo">單機開打</button>
        <button class="btn btn-cyan btn-lg" data-action="host">開房間（連線）</button>
        <button class="btn btn-pink" data-action="join">加入房間</button>
        <button class="btn btn-ghost" data-action="roles-preview">看角色技能</button>
      </div>
      <p class="footer-note">請理性飲酒 · 未成年勿玩</p>
    </div>
  `)}function qt(t,e){const s=t.map((a,o)=>`
      <div class="player-chip">
        <span class="num">${o+1}</span>
        <input data-name-idx="${o}" value="${c(a)}" maxlength="12" aria-label="玩家${o+1}" />
        <button class="chip-btn" data-action="remove-player" data-idx="${o}" ${t.length<=2?"disabled":""} type="button">✕</button>
      </div>`).join("");return b(`
    <div class="screen" data-screen="setup">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">${e?"ONLINE SETUP":"SOLO SETUP"}</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">組隊</h1>
      <p class="hint">2–12 人。每個人會拿到一個街頭辦公室角色。</p>
      <div class="player-list">${s}</div>
      <button class="btn btn-lime" data-action="add-player" ${t.length>=12?"disabled":""} type="button">＋ 加一位</button>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="confirm-setup" type="button">🔥 鎖定陣容</button>
      </div>
    </div>
  `)}function It(t,e,s){const a=e.length>0?e.map(o=>`
        <div class="player-chip">
          <span class="status-dot ${o.connected?"on":"off"}"></span>
          <strong>${c(o.name)}</strong>
          ${o.id===t.myPlayerId?'<span class="tag-pill" style="font-size:0.6rem">YOU</span>':""}
        </div>`).join(""):t.players.map(o=>`
        <div class="player-chip"><span class="num">★</span><strong>${c(o.name)}</strong></div>`).join("");return b(`
    <div class="screen" data-screen="lobby">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        ${t.roomCode?`<span class="room-badge">${c(t.roomCode)}</span>`:""}
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">房間</h1>
      <p class="hint">
        <span class="status-dot ${s==="open"?"on":"off"}"></span>
        連線：${c(s)} · 房主為抽籤權威
      </p>
      <div class="sticker">
        <p style="margin:0;font-weight:800">把房間碼或網址分給同事加入。</p>
        <p class="hint" style="margin-bottom:0">網址可帶 <code>?room=${c(t.roomCode??"")}</code></p>
      </div>
      <div class="player-list" style="margin-top:12px">${a}</div>
      <div class="btn-row">
        ${t.isHost?'<button class="btn btn-lg" data-action="start-online" type="button">🎤 開始發角色</button>':'<p class="hint">等待房主開始…</p>'}
      </div>
    </div>
  `)}function xt(t){const e=t.map(s=>{const a=tt(s);return`
        <div class="role-card" style="box-shadow:4px 4px 0 ${a.color}">
          <span class="drip" style="background:${a.color}"></span>
          <span class="emoji">${a.emoji}</span>
          <div class="name">${c(s.name)}</div>
          <div class="tag">${c(a.tag)} · ${c(a.name)}</div>
          <div class="skill"><strong style="color:${a.color}">${c(a.skillName)}</strong><br/>${c(a.skillDesc)}<br/><span style="color:var(--spray-lime)">${c(a.drink)}</span></div>
        </div>`}).join("");return b(`
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
  `)}function St(){const t=F.map(e=>`
    <div class="role-card" style="box-shadow:4px 4px 0 ${e.color}">
      <span class="drip" style="background:${e.color}"></span>
      <span class="emoji">${e.emoji}</span>
      <div class="name">${c(e.name)}</div>
      <div class="tag">${c(e.tag)}</div>
      <div class="skill"><strong style="color:${e.color}">${c(e.skillName)}</strong><br/>${c(e.skillDesc)}<br/><span style="color:var(--spray-lime)">${c(e.drink)}</span></div>
    </div>`).join("");return b(`
    <div class="screen" data-screen="roles-preview">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">ROSTER</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">全角色</h1>
      <div class="role-grid">${t}</div>
    </div>
  `)}function W(t){const e=t.isOnline&&!t.isHost;return b(`
    <div class="screen" data-screen="modes">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="back-roles" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        ${t.roomCode?`<span class="room-badge">${c(t.roomCode)}</span>`:'<span class="tag-pill">MODE</span>'}
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
          <div class="m-desc">選項一開始就亮 · 全員選完揭少數方喝</div>
        </button>
      </div>
    </div>
  `)}function Pt(t){const e=["搖罐中…","噴漆上牆…","揭開標籤！"];return b(`
    <div class="screen" data-screen="drawing">
      <div class="ceremony">
        <div class="boombox">🎧</div>
        <div class="graffiti-title" style="font-size:1.8rem">${e[Math.min(t,e.length-1)]}</div>
        <p class="hint">街頭儀式進行中</p>
      </div>
      <div class="spray-burst" id="spray-burst"></div>
    </div>
  `)}function jt(t){const e=t.lastResult;if(!e)return W(t);const s=t.players.find(n=>n.id===e.playerId),a=s?C(s.roleId):null;if(e.mode==="drink_order"&&e.order){const n=e.order.map((r,d)=>{const l=t.players.find(p=>p.id===r);return`<li style="animation-delay:${d*.08}s">${d+1}. ${c(l.name)} <span style="color:var(--muted)">（${c(C(l.roleId).name)}）</span></li>`}).join("");return b(`
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
    `)}if(e.mode==="team_toast"&&e.teams){const n=e.teams.map(r=>`
      <div class="team">
        <h3>${c(r.name)}</h3>
        <div>${r.members.map(d=>c(d)).join(" · ")}</div>
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
    `)}const o=e.skillKind!=="none"&&t.skillPending;return b(`
    <div class="screen" data-screen="reveal">
      <div class="ceremony">
        <div class="tag-pill" style="transform:rotate(-6deg)">HIT!</div>
        <div class="reveal-name shake">${c((s==null?void 0:s.name)??"?")}</div>
        <div style="font-size:2.5rem">${(a==null?void 0:a.emoji)??"💥"}</div>
        <div class="graffiti-sub">${c((a==null?void 0:a.name)??"")} · ${c((a==null?void 0:a.tag)??"")}</div>
        <div class="reveal-drink">${c(e.drinkHint)}</div>
        ${a&&a.skillKind!=="none"?`<div class="sticker" style="width:100%;margin-top:8px">
                <strong style="color:var(--spray-pink)">${c(a.skillName)}</strong>
                <p class="hint" style="margin:4px 0 0">${c(a.skillDesc)}</p>
              </div>`:""}
      </div>
      <div class="btn-row">
        ${o?`<button class="btn btn-pink btn-lg" data-action="use-skill" type="button">⚡ 發動技能</button>
               <button class="btn btn-lime" data-action="skip-skill" type="button">直接喝 · 跳過技能</button>`:`<button class="btn btn-lg" data-action="again" type="button">🎲 再抽一次</button>
               <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>`}
      </div>
      <div class="spray-burst" id="spray-burst"></div>
    </div>
  `)}function Ot(t){const e=t.lastResult;if(!e)return W(t);const s=t.players.find(l=>l.id===e.playerId),a=s?C(s.roleId):null,o=t.players.filter(l=>l.id!==e.playerId),n=t.players.filter(l=>l.roleId==="worker"&&l.id!==e.playerId),r=(l,p)=>l.map(f=>`<button class="chip-btn" data-action="${p}" data-target="${f.id}" type="button">${c(f.name)}</button>`).join("")||'<p class="hint">沒有可選對象</p>';let d="";switch(e.skillKind){case"pick_drink2":d=`<p class="hint">指定一位「上班族」喝 2</p><div class="targets">${r(n.length?n:o,"skill-target")}</div>`;break;case"boss_choice":d=`
        <button class="btn btn-pink" data-action="skill-opt" data-opt="all" type="button">全場喝 1</button>
        <p class="hint">或指定一人喝 2：</p>
        <div class="targets">${r(o,"skill-target")}</div>`;break;case"intern_pass":d=(s==null?void 0:s.hasPass)===!1?'<p class="error-banner">救命已用完</p>':`<p class="hint">把這次喝酒傳給誰？</p><div class="targets">${r(o,"skill-target")}</div>`;break;case"treat":d=`<p class="hint">請客對象（各喝 1）</p><div class="targets">${r(o,"skill-target")}</div>`;break;case"transfer":d=`
        <button class="btn btn-cyan" data-action="skill-opt" data-opt="redraw" type="button">全體重抽角色</button>
        <p class="hint">或與一人互換：</p>
        <div class="targets">${r(o,"skill-target")}</div>`;break;case"tax":d=`<p class="hint">誰多喝 1？（你改半杯）</p><div class="targets">${r(o,"skill-target")}</div>`;break;case"deploy":d=`
        <p class="hint">可指定一人下輪免抽（也可跳過）</p>
        <div class="targets">${r(o,"skill-target")}</div>
        <button class="btn btn-lime" data-action="skill-opt" data-opt="selfonly" type="button">只自己喝 1</button>`;break;case"overtime":d='<button class="btn btn-pink btn-lg" data-action="skill-opt" data-opt="ot" type="button">確認加班：喝 2，下輪免抽</button>';break;default:d='<button class="btn" data-action="skip-skill" type="button">完成</button>'}return b(`
    <div class="screen" data-screen="skill">
      <div class="top-bar">
        <span class="tag-pill">SKILL</span>
      </div>
      <h1 class="graffiti-title" style="font-size:1.8rem">${c((a==null?void 0:a.skillName)??"技能")}</h1>
      <div class="skill-panel sticker">
        ${d}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" data-action="skip-skill" type="button">取消技能</button>
      </div>
    </div>
  `)}function Nt(t){return b(`
    <div class="screen" data-screen="result">
      <div class="ceremony">
        <div class="reveal-name" style="font-size:1.6rem">技能發動</div>
        <div class="sticker" style="width:100%">
          <p style="margin:0;font-size:1.2rem;font-weight:900;line-height:1.5">${c(t)}</p>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="again" type="button">🎲 再抽</button>
        <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
      </div>
    </div>
  `)}function Ct(t){const e=t.flip,s=ut(t);if(!e||!s)return b(`
      <div class="screen" data-screen="flip">
        <p class="hint">題庫載入中…</p>
        <button class="btn btn-ghost" data-action="to-modes" type="button">回模式</button>
      </div>
    `);const a=e.answererId?t.players.find(h=>h.id===e.answererId):null,n=!(t.isOnline&&!t.isHost),r=e.index+1,d=e.deck.length,l=vt(t),p=s.correct===0?"A":"B",f=s.options[s.correct],q=[0,1].map(h=>{const I=s.options[h];let y="flip-card face-up";e.sub==="result"&&(e.majoritySide!=null&&!e.tie&&(h===e.majoritySide?y+=" is-majority":y+=" is-minority"),s.correct===h&&(y+=" is-official"));const v=!n||e.sub!=="choose"?"disabled":"",g=h===0?l.a:l.b,A=e.sub==="result"?`<span class="flip-vote-n">${g} 票</span>`:'<span class="flip-vote-n muted">選項已公開</span>';return`
        <button class="${y}" data-action="flip-pick" data-choice="${h}" ${v} type="button">
          <div class="flip-card-inner">
            <div class="flip-face flip-front">
              <span class="flip-opt-label">${h===0?"A":"B"}</span>
              <span class="flip-opt-text">${c(I)}</span>
              ${A}
            </div>
          </div>
        </button>`}).join("");let U="";e.sub==="choose"&&(U=`
      <div class="sticker flip-ready-box" style="width:100%;margin-top:8px">
        <p style="margin:0 0 8px;font-weight:900">選邊進度（收齊才結算）</p>
        <div class="ready-list">${t.players.map(I=>{const y=I.id in e.votes,v=e.answererId===I.id;return`<div class="ready-chip ${y?"on":v?"turn":"off"}">
          <span class="status-dot ${y?"on":"off"}"></span>
          <strong>${c(I.name)}</strong>
          <span class="ready-label">${y?"已選":v?"輪到選":"還沒選"}</span>
        </div>`}).join("")}</div>
        ${a?`<p class="hint" style="margin:10px 0 0">傳手機給 <strong style="color:var(--spray-pink)">${c(a.name)}</strong> 選 A 或 B</p>`:""}
        <p class="hint" style="margin-bottom:0">規則：跟大家不一樣的<strong>少數方</strong>喝；平手免喝。</p>
      </div>`);let S="";if(e.sub==="result"){const h=e.drinkerIds.map(v=>{var g;return(g=t.players.find(A=>A.id===v))==null?void 0:g.name}).filter(Boolean).map(v=>c(v));e.tie?S=`<div class="flip-result ok">
           <div class="flip-result-title">平手免喝！</div>
           <p class="hint" style="margin:0">A ${l.a} ： B ${l.b} · 少數不成立，這輪放過</p>
         </div>`:h.length===0?S=`<div class="flip-result ok">
           <div class="flip-result-title">全場同邊！</div>
           <p class="hint" style="margin:0">沒有少數方 · 全員免喝 🍻</p>
         </div>`:S=`<div class="flip-result bad">
           <div class="flip-result-title">少數方喝！</div>
           <p class="hint" style="margin:0">${h.join("、")} · 跟大家不一樣 · 乾一口 🍻</p>
           <p class="hint" style="margin:6px 0 0">票數 A ${l.a} ： B ${l.b}</p>
         </div>`,S+=`
      <div class="flip-official sticker" style="width:100%;margin-top:8px">
        <div class="flip-q-label">官方答案（趣味｜不決定誰喝）</div>
        <p style="margin:4px 0 0;font-weight:800">${p}. ${c(f)}</p>
      </div>`;const I=new Set(e.readyIds),y=t.players.map(v=>{const g=I.has(v.id);return`<div class="ready-chip ${g?"on":"off"}">
          <span class="status-dot ${g?"on":"off"}"></span>
          <strong>${c(v.name)}</strong>
          <span class="ready-label">${g?"已就緒":"還沒按"}</span>
          ${n&&!g?`<button class="chip-btn alt" data-action="flip-ready" data-player="${v.id}" type="button">下一題 ✓</button>`:""}
        </div>`}).join("");S+=`
      <div class="sticker flip-ready-box" style="width:100%;margin-top:8px">
        <p style="margin:0 0 8px;font-weight:900">下一題就緒狀況</p>
        <div class="ready-list">${y}</div>
        ${n?`<button class="btn btn-lg" style="margin-top:12px" data-action="flip-ready-all" type="button">下一題</button>
               <p class="hint" style="margin-bottom:0">傳手機：每人按一次「下一題」；名單會顯示誰好了／誰還沒。全到齊自動進下一題。</p>`:'<p class="hint" style="margin-bottom:0">等待房主／大家按下一題…</p>'}
      </div>`}return b(`
    <div class="screen" data-screen="flip">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="to-modes" style="width:auto;min-height:40px;padding:8px 12px" type="button">←</button>
        <span class="tag-pill">FLIP ${r}/${d}</span>
      </div>
      <div class="flip-q sticker">
        <div class="flip-q-label">工作表 · 題目</div>
        <p class="flip-q-text">${c(s.q)}</p>
      </div>
      <p class="hint flip-ux-hint">FLIP-004：兩選項一開始就看得見；全員選完才揭誰是少數方。</p>
      <div class="flip-cards revealed">${q}</div>
      ${U}
      ${S}
      <div class="spray-burst" id="spray-burst"></div>
      <p class="footer-note">少數方喝 · 平手免喝 · 請理性飲酒</p>
    </div>
  `)}function _t(){return b(`
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
  `)}function Et(){return b(`
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
  `)}const R=document.querySelector("#app"),i=lt();let w=["玩家1","玩家2","玩家3","玩家4"],et="idle",T=[],O="",$=null,st=null,E=null;const N=new $t({onStatus:t=>{et=t,i.phase==="lobby"&&u()},onCreated:(t,e)=>{i.roomCode=t,i.myPlayerId=e,i.isHost=!0,i.isOnline=!0,i.phase="lobby",M(t),u()},onJoined:(t,e,s)=>{i.roomCode=t,i.myPlayerId=e,i.isHost=s,i.isOnline=!0,i.phase="lobby",M(t),u()},onRoster:t=>{T=t,u()},onState:t=>{i.isHost||(kt(i,t),u(),i.phase==="reveal"&&x())},onError:t=>{alert(t)}});function M(t){const e=new URL(location.href);t?e.searchParams.set("room",t):e.searchParams.delete("room"),history.replaceState(null,"",e.toString())}function m(){i.isOnline&&i.isHost&&N.connected&&N.sync(gt(i))}function u(){let t="";switch(i.phase){case"home":t=J();break;case"setup":t=qt(w,i.isOnline);break;case"lobby":t=It(i,T,et);break;case"roles":t=xt(i.players);break;case"mode_select":t=W(i);break;case"drawing":t=Pt(i.ceremonyStep);break;case"reveal":t=jt(i);break;case"skill":t=Ot(i);break;case"result":t=Nt(O);break;case"flip_battle":t=Ct(i);break;default:t=J()}E==="join"&&(t=_t()),E==="host-name"&&(t=Et()),E==="roles-preview"&&(t=St()),R.innerHTML=t}function k(t){E=t}function Q(){i.isOnline&&!i.isHost||($!=null&&(window.clearInterval($),$=null),pt(i),m(),u(),x())}function G(){i.isOnline&&!i.isHost||(ht(i),m(),u(),x())}function Y(t){i.isOnline&&!i.isHost||(st=t,i.mode=t,i.phase="drawing",i.ceremonyStep=0,i.skillPending=!1,m(),u(),x(),$!=null&&window.clearInterval($),$=window.setInterval(()=>{i.ceremonyStep+=1,i.ceremonyStep>=3?($!=null&&window.clearInterval($),$=null,Ft()):(m(),u(),x())},700))}function Ft(){const t=st??i.mode;if(!t||t==="flip_battle")return;let e;t==="draw_one"?e=rt(i):t==="drink_order"?e=dt(i):e=ct(i),i.lastResult=e,i.drawCount+=1,i.phase="reveal",i.skillPending=t==="draw_one"&&e.skillKind!=="none",m(),u(),x()}function x(){const t=document.getElementById("spray-burst");if(!t)return;const e=["📊","📄","📎","✏️","📌","🗂️","💾","✅"];for(let s=0;s<14;s++){const a=document.createElement("span");a.textContent=e[s%e.length];const o=10+Math.random()*80,n=20+Math.random()*50;a.style.left=`${o}%`,a.style.top=`${n}%`,a.style.setProperty("--dx",`${(Math.random()-.5)*160}px`),a.style.setProperty("--dy",`${-80-Math.random()*120}px`),a.style.setProperty("--rot",`${(Math.random()-.5)*120}deg`),a.style.animationDelay=`${Math.random()*.2}s`,t.appendChild(a),window.setTimeout(()=>a.remove(),1200)}}R.addEventListener("click",t=>{var a,o,n,r,d;const e=t.target.closest("[data-action]");if(!e)return;const s=e.dataset.action;if(s)switch(s){case"home":k(null),i.phase="home",i.flip=null,i.isOnline=!1,i.roomCode=null,N.disconnect(),M(null),u();break;case"solo":k(null),i.isOnline=!1,i.isHost=!0,i.phase="setup",u();break;case"host":k("host-name"),u();break;case"join":k("join"),u();break;case"roles-preview":k("roles-preview"),u();break;case"do-host":{const l=((a=document.getElementById("host-name"))==null?void 0:a.value.trim())||"房主";k(null),N.create(l),i.phase="lobby",u();break}case"do-join":{const l=((o=document.getElementById("join-name"))==null?void 0:o.value.trim())||"玩家",p=(n=document.getElementById("join-code"))==null?void 0:n.value.trim().toUpperCase();if(!p||p.length<4){alert("請輸入 4 碼房間碼");return}k(null),N.join(p,l),i.phase="lobby",u();break}case"add-player":w.length<12&&(w.push(`玩家${w.length+1}`),u());break;case"remove-player":{const l=Number(e.dataset.idx);w.length>2&&(w.splice(l,1),u());break}case"confirm-setup":{R.querySelectorAll("[data-name-idx]").forEach(p=>{const f=Number(p.dataset.nameIdx);w[f]=p.value.trim()||`玩家${f+1}`}),i.seed=K(),i.players=z(w,i.seed),i.drawCount=0,i.lastResult=null,i.phase="roles",m(),u();break}case"start-online":{if(!i.isHost)return;const l=T.map(p=>p.name);if(l.length<2){alert("至少需要 2 人");return}i.seed=K(),i.players=z(l,i.seed),i.players.forEach((p,f)=>{const q=T[f];q&&(p.id=q.id,p.name=q.name)}),i.myPlayerId=i.myPlayerId,i.drawCount=0,i.lastResult=null,i.phase="roles",m(),u();break}case"to-modes":k(null),i.phase="mode_select",i.skillPending=!1,i.flip=null,m(),u();break;case"back-roles":i.phase="roles",m(),u();break;case"mode":{const l=e.dataset.mode;l==="flip_battle"?Q():Y(l);break}case"flip-pick":{if(i.isOnline&&!i.isHost)return;const l=Number(e.dataset.choice);if(l!==0&&l!==1)return;bt(i,l),m(),u(),x();break}case"flip-ready":{if(i.isOnline&&!i.isHost)return;const l=e.dataset.player;if(!l)return;B(i,l),m(),u(),D(i)&&window.setTimeout(()=>{D(i)&&G()},350);break}case"flip-ready-all":{if(i.isOnline&&!i.isHost)return;if(i.isOnline&&i.myPlayerId)B(i,i.myPlayerId);else{const l=i.players.find(p=>!i.flip.readyIds.includes(p.id));l&&B(i,l.id)}m(),u(),D(i)&&window.setTimeout(()=>G(),350);break}case"again":i.mode==="flip_battle"?Q():i.mode&&Y(i.mode);break;case"use-skill":i.phase="skill",m(),u();break;case"skip-skill":i.skillPending=!1,i.phase="reveal",m(),u();break;case"skill-target":{const l=e.dataset.target,p=((r=i.lastResult)==null?void 0:r.skillKind)??"none";O=_(i,p,l),i.skillPending=!1,i.phase="result",m(),u();break}case"skill-opt":{const l=e.dataset.opt,p=((d=i.lastResult)==null?void 0:d.skillKind)??"none";l==="selfonly"?O=_(i,"deploy"):l==="ot"?O=_(i,"overtime"):O=_(i,p,void 0,l),i.skillPending=!1,i.phase="result",m(),u();break}}});R.addEventListener("change",t=>{const e=t.target;if(e.matches("[data-name-idx]")){const s=Number(e.dataset.nameIdx);w[s]=e.value}});const Rt=new URLSearchParams(location.search),X=Rt.get("room");X?(k("join"),u(),window.setTimeout(()=>{const t=document.getElementById("join-code");t&&(t.value=X.toUpperCase())},0)):u();
