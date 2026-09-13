var dt=Object.defineProperty;var ct=(t,e,s)=>e in t?dt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var O=(t,e,s)=>ct(t,typeof e!="symbol"?e+"":e,s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();const T=[{id:"manager",name:"主管",emoji:"👔",tag:"BOSS UP",drink:"喝 1 杯",skillName:"打小報告",skillDesc:"指定一位「上班族」喝 2 杯",skillKind:"pick_drink2",color:"#FF3D71",accent:"#FFE566"},{id:"worker",name:"上班族",emoji:"💼",tag:"9to5",drink:"喝 1 杯",skillName:"摸魚",skillDesc:"純喝 1 杯，沒有特殊技能（但人多勢眾）",skillKind:"none",color:"#4ECDC4",accent:"#FFF"},{id:"ceo",name:"老闆",emoji:"🕶️",tag:"BIG SHOT",drink:"喝 1 杯",skillName:"老闆發話",skillDesc:"全場一起喝 1，或指定一人喝 2",skillKind:"boss_choice",color:"#FFD700",accent:"#1A1A1A"},{id:"intern",name:"實習生",emoji:"🐣",tag:"ROOKIE",drink:"抿半杯 或 喝 1",skillName:"喊救命",skillDesc:"整場遊戲可使用 1 次：把這次喝酒傳給別人",skillKind:"intern_pass",color:"#A78BFA",accent:"#FFF"},{id:"sales",name:"業務",emoji:"🤝",tag:"DEAL",drink:"喝 1 杯",skillName:"請客",skillDesc:"指定一人跟你一起各喝 1 杯",skillKind:"treat",color:"#FF8C42",accent:"#FFF"},{id:"hr",name:"人資",emoji:"📋",tag:"HR",drink:"喝 1 杯",skillName:"調職",skillDesc:"與一人互換角色，或全體重新抽角色",skillKind:"transfer",color:"#38BDF8",accent:"#FFF"},{id:"accountant",name:"會計",emoji:"🧮",tag:"TAX",drink:"喝 1 杯",skillName:"報帳",skillDesc:"指定一人多喝 1；自己可改為半杯",skillKind:"tax",color:"#34D399",accent:"#1A1A1A"},{id:"engineer",name:"工程師",emoji:"💻",tag:"SHIP IT",drink:"喝 1 杯",skillName:"緊急上線",skillDesc:"自己喝 1，可指定一人這輪免抽（延後）",skillKind:"deploy",color:"#60A5FA",accent:"#FFF"},{id:"overtime",name:"加班狗",emoji:"🐕",tag:"OT",drink:"喝 2 杯",skillName:"加班免抽",skillDesc:"這輪喝 2，下一輪抽籤時自動跳過你",skillKind:"overtime",color:"#F472B6",accent:"#FFF"}];function F(t){return T.find(e=>e.id===t)??T[1]}function et(t,e){const s=[...T];for(let a=s.length-1;a>0;a--){const i=e(a+1);[s[a],s[i]]=[s[i],s[a]]}const o=[];for(let a=0;a<t;a++)a<s.length?o.push(s[a].id):o.push("worker");for(let a=o.length-1;a>0;a--){const i=e(a+1);[o[a],o[i]]=[o[i],o[a]]}return o}function pt(t){let e=1779033703^t.length;for(let s=0;s<t.length;s++)e=Math.imul(e^t.charCodeAt(s),3432918353),e=e<<13|e>>>19;return e=Math.imul(e^e>>>16,2246822507),e=Math.imul(e^e>>>13,3266489909),(e^=e>>>16)>>>0}function P(t){let e=typeof t=="string"?pt(t):t>>>0;return e===0&&(e=1),()=>{e|=0,e=e+1831565813|0;let s=Math.imul(e^e>>>15,1|e);return s=s+Math.imul(s^s>>>7,61|s)^s,((s^s>>>14)>>>0)/4294967296}}function B(t,e){return Math.floor(t()*e)}function U(t,e){for(let s=t.length-1;s>0;s--){const o=B(e,s+1);[t[s],t[o]]=[t[o],t[s]]}return t}function M(){return`s-${Date.now().toString(36)}-${Math.floor(Math.random()*1e9).toString(36)}`}const V=[{id:"fq01",q:"開會時投影片突然黑掉，最合理的解釋是？",options:["投影機在摸魚","宇宙管理員按了暫停"],correct:1},{id:"fq02",q:"冰箱裡的便當會自己長腳逃走，因為？",options:["它不想被微波","它考上了外派"],correct:0},{id:"fq03",q:"鍵盤上的空白鍵為什麼叫空白？",options:["因為它心裡很空","因為它負責製造沉默"],correct:1},{id:"fq04",q:"周一早上鬧鐘響三遍，代表？",options:["時間在求饒","你跟床簽了加班合約"],correct:1},{id:"fq05",q:"影印機卡紙的真正原因是？",options:["紙張想休息五分鐘","它在抗議被印太多 KPI"],correct:0},{id:"fq06",q:"咖啡機吐出氣泡音，其實是在？",options:["說饒舌","報今日運勢"],correct:0},{id:"fq07",q:"電梯門關太慢，是因為？",options:["它在等遲到的靈魂","門縫在談戀愛"],correct:0},{id:"fq08",q:"滑鼠游標一直轉圈，代表電腦在？",options:["冥想","偷偷看連續劇"],correct:1},{id:"fq09",q:"會議室冷氣為什麼總是太冷？",options:["為了凍結愚蠢發言","冷氣在練冰系魔法"],correct:0},{id:"fq10",q:"同事說「我五分鐘就好」，五分鐘等於？",options:["一個小時代","量子不確定時間"],correct:1},{id:"fq11",q:"自動販賣機吃幣不吐貨，是因為？",options:["它在存退休金","它覺得你不夠潮"],correct:0},{id:"fq12",q:"Wi‑Fi 名稱叫「別連我」，你應該？",options:["連得更用力","對它鞠躬道歉"],correct:0},{id:"fq13",q:"廁所衛生紙用完時，宇宙會？",options:["播放尷尬配樂","派一隻鴿子送紙"],correct:0},{id:"fq14",q:"簡報第 87 頁還在講前言，代表講者？",options:["誤入時空迴圈","把結局藏在前言裡"],correct:0},{id:"fq15",q:"辦公椅發出怪聲是因為？",options:["它想換跑道當鼓手","它在模仿你的薪水"],correct:0},{id:"fq16",q:"螢幕保護程式出現熱帶魚，真相是？",options:["魚在代班","電腦在度假你不行"],correct:1},{id:"fq17",q:"「差不多就好」在公司語代表？",options:["絕對要重做三遍","已經完美到不行"],correct:0},{id:"fq18",q:"雨傘忘在公司，雨傘現在？",options:["加入了另一個部門","正在開自己的傘派對"],correct:1},{id:"fq19",q:"為什麼打字會突然跳去上一行？",options:["游標想逃家","鍵盤在玩捉迷藏"],correct:0},{id:"fq20",q:"中午便當店排到隊尾，代表你？",options:["被命運選為苦行僧","其實是隱形人"],correct:0},{id:"fq21",q:"群組訊息已讀不回，對方其實？",options:["正在練習隱形術","被訊息吸進黑洞"],correct:1},{id:"fq22",q:"白板筆沒水了還硬寫，寫出來的是？",options:["空氣藝術","隱形 KPI"],correct:0},{id:"fq23",q:"下班卡刷不過，系統認為你？",options:["還欠宇宙一小時","其實是影分身"],correct:0},{id:"fq24",q:"會議室電視遙控器失蹤，它去了？",options:["異次元沙發縫","跟電池私奔"],correct:0},{id:"fq25",q:"「這個需求很簡單」說完之後會？",options:["長出十七個子需求","立刻世界和平"],correct:0},{id:"fq26",q:"印表機燈一直閃橘燈，是在？",options:["發出求救摩斯密碼","慶祝週年慶"],correct:0},{id:"fq27",q:"為什麼耳機線總會打結？",options:["它在練習魔術","它嫉妒無線耳機"],correct:1},{id:"fq28",q:"週五下午開會的真正目的是？",options:["測試誰還有靈魂","幫周末暖身延遲"],correct:0},{id:"fq29",q:"雲端硬碟顯示同步中……其實在？",options:["跟雲聊天","把檔案帶去旅行"],correct:1},{id:"fq30",q:"「我傳檔案給你了」但你沒收到，檔案？",options:["卡在平行宇宙信箱","變成了幽靈附件"],correct:0},{id:"fq31",q:"公司盆栽突然暴斃，最可能是？",options:["聽太多會議自殺","被 PowerPoint 曬傷"],correct:0},{id:"fq32",q:"為什麼螺絲總會多一顆或少一顆？",options:["螺絲有自己的工會","組裝精靈在抽成"],correct:0},{id:"fq33",q:"深夜加班螢幕反光裡出現臉，那是？",options:["你的未來自己來催進度","鍵盤幽靈求放假"],correct:0},{id:"fq34",q:"「順便」兩個字在主管嘴裡等於？",options:["一座小山的工作量","真的只是順便"],correct:0},{id:"fq35",q:"手機掉進沙發縫，沙發其實？",options:["開了一間手機旅館","在徵收保護費"],correct:0},{id:"tw01",q:"捷運門快關時有人狂奔，車門心裡在想？",options:["再給你 0.3 秒當人生轉折","我是門不是情感支援"],correct:0},{id:"tw02",q:"夜市攤車突然播「謝謝再光臨」其實是？",options:["在逼你買第二份炸雞","在跟隔壁攤宣戰"],correct:0},{id:"tw03",q:"便利商店關東煮湯飄香，真正目的是？",options:["催眠你拿走兩個御飯糰","召喚加班靈魂"],correct:0},{id:"tw04",q:"假新聞標題：「台北盆地宣布自立為盆地共和國」下一步是？",options:["發盆地護照給蚊子","跟高雄簽自由貿易（賣黑輪）"],correct:1},{id:"tw05",q:"颱風假放一天，大家第一反應其實是？",options:["瞬間變氣象專家","先約火鍋再看風雨"],correct:0},{id:"tw06",q:"YouBike 車柱顯示「無車」代表？",options:["車去參加車聚了","宇宙提醒你該走路減肥"],correct:1},{id:"tw07",q:"假新聞：「珍珠奶茶列入世界遺產」最大衝擊是？",options:["吸管要申遺編號","粉圓開始收門票"],correct:1},{id:"tw08",q:"排隊名店前面的人突然離隊，是因為？",options:["手機電量比胃口先死","被隔壁攤的香氣綁架"],correct:0},{id:"tw09",q:"高鐵廣播「列車即將進站」翻譯成人話是？",options:["請把自拍桿收回異次元","請把行李從走道移開（拜託）"],correct:1},{id:"tw10",q:"假新聞：「小籠包投票選出新市長」政見會是？",options:["湯汁透明化","免費加醋政策"],correct:0},{id:"tw11",q:"梅雨季鞋子發霉，鞋子留下遺言：",options:["早說要通風","來生要當雨鞋"],correct:1},{id:"tw12",q:"夜市射氣球老闆說「差一點」其實是？",options:["差一點讓你破產","差一點揭穿磁場作弊"],correct:0},{id:"tw13",q:"假新聞：「101 點燈拼出上班族哭臉」解讀？",options:["周一限定燈光秀","電梯壞了的集體回憶"],correct:0},{id:"tw14",q:"超商美式咖啡 49 元，咖啡豆的心情是？",options:["我也很努力過","至少比會議好喝"],correct:1},{id:"tw15",q:"假新聞：「機車雙載改成三重奏合法」配套是？",options:["後座要帶卡拉OK","安全帽改成派對燈"],correct:0},{id:"tw16",q:"路邊停車格顯示「收費中」但你看不到收費員，因為？",options:["收費員隱身練功","格子本身會吸錢"],correct:1}];function ut(t){return V.find(e=>e.id===t)??V[0]}function ft(){return{phase:"home",mode:null,players:[],seed:M(),drawCount:0,lastResult:null,roomCode:null,isHost:!0,isOnline:!1,myPlayerId:null,skillPending:!1,ceremonyStep:0,flip:null}}function Q(t,e){const s=P(e+":roles"),o=et(t.length,a=>B(s,a));return t.map((a,i)=>{const l=o[i];return{id:`p${i}`,name:a.trim()||`玩家${i+1}`,roleId:l,hasPass:l==="intern",skipNext:!1}})}function st(t){return F(t.roleId)}function mt(t){const e=P(`${t.seed}:draw:${t.drawCount}`),s=t.players.filter(l=>!l.skipNext),o=s.length>0?s:t.players,a=o[B(e,o.length)];for(const l of t.players)l.skipNext&&(l.skipNext=!1);const i=st(a);return{playerId:a.id,mode:"draw_one",message:`${a.name}（${i.name}）中籤！`,drinkHint:i.drink,skillKind:i.skillKind}}function bt(t){const e=P(`${t.seed}:order:${t.drawCount}`),s=t.players.map(a=>a.id);U(s,e);const o=s.map(a=>t.players.find(i=>i.id===a).name);return{playerId:s[0],mode:"drink_order",message:"乾杯順序出爐！",drinkHint:o.map((a,i)=>`${i+1}. ${a}`).join(" → "),skillKind:"none",order:s}}function ht(t){const e=P(`${t.seed}:team:${t.drawCount}`),s=t.players.map(d=>d.id);U(s,e);const o=Math.ceil(s.length/2),a=s.slice(0,o),i=s.slice(o),l=d=>t.players.find(r=>r.id===d).name;return{playerId:a[0],mode:"team_toast",message:"分隊完成！兩隊乾杯！",drinkHint:"🔥 A隊 vs ❄️ B隊",skillKind:"none",teams:[{name:"🔥 HEAT 隊",members:a.map(l)},{name:"❄️ ICE 隊",members:i.map(l)}]}}function N(t,e,s,o){const a=t.lastResult;if(!a)return"";const i=t.players.find(d=>d.id===a.playerId),l=s?t.players.find(d=>d.id===s):void 0;switch(e){case"pick_drink2":return l?`📢 ${i==null?void 0:i.name} 打小報告！${l.name} 喝 2 杯！`:"請選擇目標";case"boss_choice":return o==="all"?"🕶️ 老闆發話：全場一起喝 1 杯！":l?`🕶️ 老闆點名：${l.name} 喝 2 杯！`:"請選擇";case"intern_pass":return i&&(i.hasPass=!1),l?`🐣 ${i==null?void 0:i.name} 喊救命！喝酒傳給 ${l.name}！`:"請選擇傳給誰";case"treat":return l?`🤝 ${i==null?void 0:i.name} 請客！${i==null?void 0:i.name} 與 ${l.name} 各喝 1！`:"請選擇請客對象";case"transfer":if(o==="redraw"){const d=P(`${t.seed}:redraw:${t.drawCount}`),r=et(t.players.length,c=>B(d,c));return t.players.forEach((c,m)=>{c.roleId=r[m],c.hasPass=c.roleId==="intern"}),"📋 人資宣布：全體重新抽角色！"}if(i&&l){const d=i.roleId;return i.roleId=l.roleId,l.roleId=d,i.hasPass=i.roleId==="intern",l.hasPass=l.roleId==="intern",`📋 調職！${i.name} ⇄ ${l.name}`}return"請選擇";case"tax":return l?`🧮 報帳！${l.name} 多喝 1；${i==null?void 0:i.name} 改半杯`:"請選擇";case"deploy":return l&&(l.skipNext=!0),l?`💻 緊急上線！${i==null?void 0:i.name} 喝 1；${l.name} 下輪免抽`:`${i==null?void 0:i.name} 喝 1 杯（可選延後對象）`;case"overtime":return i&&(i.skipNext=!0),`🐕 ${i==null?void 0:i.name} 加班！喝 2 杯，下輪免抽`;default:return`${i==null?void 0:i.name} ${F((i==null?void 0:i.roleId)??"worker").drink}`}}function vt(t){const e=P(`${t.seed}:flip:${t.drawCount}`),s=V.map(a=>a.id);U(s,e);const o=t.players.length>0?t.players[0].id:null;t.mode="flip_battle",t.phase="flip_battle",t.flip={deck:s,index:0,sub:"countdown",countdown:3,votes:{},readyIds:[],answererId:o,drinkerIds:[],tie:!1,majoritySide:null},t.skillPending=!1,t.lastResult=null}function yt(t){const e=t.flip;if(!e||e.deck.length===0)return null;const s=e.deck[e.index%e.deck.length];return s?ut(s):null}function gt(t){var e,s;t.flip&&(t.flip.sub="choose",t.flip.countdown=0,t.flip.votes={},t.flip.drinkerIds=[],t.flip.tie=!1,t.flip.majoritySide=null,t.flip.readyIds=[],t.flip.answererId=((e=t.players.find(o=>!(o.id in t.flip.votes)))==null?void 0:e.id)??((s=t.players[0])==null?void 0:s.id)??null)}function kt(t){return t.flip?t.players.length===0?!0:t.players.every(e=>e.id in t.flip.votes):!1}function wt(t){const e=t.flip;if(!e)return;let s=0,o=0;for(const i of t.players){const l=e.votes[i.id];l===0?s+=1:l===1&&(o+=1)}if(s===0&&o===0){e.tie=!0,e.majoritySide=null,e.drinkerIds=[];return}if(s===o){e.tie=!0,e.majoritySide=null,e.drinkerIds=[];return}e.tie=!1;const a=s<o?0:1;e.majoritySide=a===0?1:0,e.drinkerIds=t.players.filter(i=>e.votes[i.id]===a).map(i=>i.id)}function $t(t,e){var a;if(!t.flip||t.flip.sub!=="choose")return;const s=t.flip,o=s.answererId??((a=t.players.find(i=>!(i.id in s.votes)))==null?void 0:a.id)??t.myPlayerId;if(o&&!(o in s.votes)){if(s.votes[o]=e,!kt(t)){const i=t.players.find(l=>!(l.id in s.votes));s.answererId=(i==null?void 0:i.id)??null;return}wt(t),s.sub="result",s.readyIds=[],s.answererId=null}}function K(t,e){!t.flip||t.flip.sub!=="result"||t.flip.readyIds.includes(e)||t.flip.readyIds.push(e)}function L(t){return t.flip?t.players.length===0?!0:t.players.every(e=>t.flip.readyIds.includes(e.id)):!1}function It(t){var s;if(!t.flip)return;const e=(t.flip.index+1)%t.flip.deck.length;t.flip.index=e,t.flip.sub="countdown",t.flip.countdown=3,t.flip.votes={},t.flip.readyIds=[],t.flip.drinkerIds=[],t.flip.tie=!1,t.flip.majoritySide=null,t.flip.answererId=((s=t.players[0])==null?void 0:s.id)??null,t.drawCount+=1}function qt(t){const e=t.flip;let s=0,o=0;if(!e)return{a:s,b:o};for(const a of t.players){const i=e.votes[a.id];i===0?s+=1:i===1&&(o+=1)}return{a:s,b:o}}const xt={};function St(t){return{phase:t.phase,mode:t.mode,players:t.players,seed:t.seed,drawCount:t.drawCount,lastResult:t.lastResult,skillPending:t.skillPending,ceremonyStep:t.ceremonyStep,flip:t.flip}}function jt(t,e){t.phase=e.phase,t.mode=e.mode,t.players=e.players,t.seed=e.seed,t.drawCount=e.drawCount,t.lastResult=e.lastResult,t.skillPending=e.skillPending,t.ceremonyStep=e.ceremonyStep,t.flip=e.flip??null}function Pt(){const t=xt;if(t.VITE_WS_URL)return t.VITE_WS_URL;const e=typeof location<"u"?location:null;return e?e.hostname==="localhost"||e.hostname==="127.0.0.1"?`ws://${e.hostname}:8787`:`${e.protocol==="https:"?"wss:":"ws:"}//${e.hostname}:8787`:"ws://localhost:8787"}class Ot{constructor(e,s){O(this,"ws",null);O(this,"handlers");O(this,"url");O(this,"reconnectTimer",null);this.handlers=e,this.url=s??Pt()}get connected(){var e;return((e=this.ws)==null?void 0:e.readyState)===WebSocket.OPEN}connect(){var e,s,o,a,i,l;if(!(this.ws&&(this.ws.readyState===WebSocket.OPEN||this.ws.readyState===WebSocket.CONNECTING))){(s=(e=this.handlers).onStatus)==null||s.call(e,"connecting");try{this.ws=new WebSocket(this.url)}catch{(a=(o=this.handlers).onStatus)==null||a.call(o,"error"),(l=(i=this.handlers).onError)==null||l.call(i,"無法連線到房間伺服器");return}this.ws.onopen=()=>{var d,r;return(r=(d=this.handlers).onStatus)==null?void 0:r.call(d,"open")},this.ws.onclose=()=>{var d,r;(r=(d=this.handlers).onStatus)==null||r.call(d,"closed")},this.ws.onerror=()=>{var d,r,c,m;(r=(d=this.handlers).onStatus)==null||r.call(d,"error"),(m=(c=this.handlers).onError)==null||m.call(c,"連線失敗（可改用單機模式，或確認已啟動 npm run server）")},this.ws.onmessage=d=>{try{const r=JSON.parse(String(d.data));this.handle(r)}catch{}}}}handle(e){var s,o,a,i,l,d,r,c,m,I;switch(e.type){case"created":(o=(s=this.handlers).onCreated)==null||o.call(s,e.code,e.playerId);break;case"joined":(i=(a=this.handlers).onJoined)==null||i.call(a,e.code,e.playerId,e.isHost);break;case"roster":(d=(l=this.handlers).onRoster)==null||d.call(l,e.players,e.hostId);break;case"state":(c=(r=this.handlers).onState)==null||c.call(r,e.state);break;case"error":(I=(m=this.handlers).onError)==null||I.call(m,e.message);break}}send(e){var s,o;if(!this.ws||this.ws.readyState!==WebSocket.OPEN){(o=(s=this.handlers).onError)==null||o.call(s,"尚未連上伺服器");return}this.ws.send(JSON.stringify(e))}create(e){this.connect();const s=()=>{var o;((o=this.ws)==null?void 0:o.readyState)===WebSocket.OPEN?this.send({type:"create",name:e}):setTimeout(s,50)};s()}join(e,s){this.connect();const o=()=>{var a;((a=this.ws)==null?void 0:a.readyState)===WebSocket.OPEN?this.send({type:"join",code:e,name:s}):setTimeout(o,50)};o()}sync(e){this.send({type:"sync",state:e})}disconnect(){var e;this.reconnectTimer!=null&&(clearTimeout(this.reconnectTimer),this.reconnectTimer=null),(e=this.ws)==null||e.close(),this.ws=null}}function p(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function b(t){return`<div class="wall-bg"></div>${t}`}function G(){return b(`
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
  `)}function Ct(t,e){const s=t.map((o,a)=>`
      <div class="player-chip">
        <span class="num">${a+1}</span>
        <input data-name-idx="${a}" value="${p(o)}" maxlength="12" aria-label="玩家${a+1}" />
        <button class="chip-btn" data-action="remove-player" data-idx="${a}" ${t.length<=2?"disabled":""} type="button">✕</button>
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
  `)}function Et(t,e,s){const o=e.length>0?e.map(a=>`
        <div class="player-chip">
          <span class="status-dot ${a.connected?"on":"off"}"></span>
          <strong>${p(a.name)}</strong>
          ${a.id===t.myPlayerId?'<span class="tag-pill" style="font-size:0.6rem">YOU</span>':""}
        </div>`).join(""):t.players.map(a=>`
        <div class="player-chip"><span class="num">★</span><strong>${p(a.name)}</strong></div>`).join("");return b(`
    <div class="screen" data-screen="lobby">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        ${t.roomCode?`<span class="room-badge">${p(t.roomCode)}</span>`:""}
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">房間</h1>
      <p class="hint">
        <span class="status-dot ${s==="open"?"on":"off"}"></span>
        連線：${p(s)} · 房主為抽籤權威
      </p>
      <div class="sticker">
        <p style="margin:0;font-weight:800">把房間碼或網址分給同事加入。</p>
        <p class="hint" style="margin-bottom:0">網址可帶 <code>?room=${p(t.roomCode??"")}</code></p>
      </div>
      <div class="player-list" style="margin-top:12px">${o}</div>
      <div class="btn-row">
        ${t.isHost?'<button class="btn btn-lg" data-action="start-online" type="button">🎤 開始發角色</button>':'<p class="hint">等待房主開始…</p>'}
      </div>
    </div>
  `)}function Ft(t){const e=t.map(s=>{const o=st(s);return`
        <div class="role-card" style="box-shadow:4px 4px 0 ${o.color}">
          <span class="drip" style="background:${o.color}"></span>
          <span class="emoji">${o.emoji}</span>
          <div class="name">${p(s.name)}</div>
          <div class="tag">${p(o.tag)} · ${p(o.name)}</div>
          <div class="skill"><strong style="color:${o.color}">${p(o.skillName)}</strong><br/>${p(o.skillDesc)}<br/><span style="color:var(--spray-lime)">${p(o.drink)}</span></div>
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
  `)}function Nt(){const t=T.map(e=>`
    <div class="role-card" style="box-shadow:4px 4px 0 ${e.color}">
      <span class="drip" style="background:${e.color}"></span>
      <span class="emoji">${e.emoji}</span>
      <div class="name">${p(e.name)}</div>
      <div class="tag">${p(e.tag)}</div>
      <div class="skill"><strong style="color:${e.color}">${p(e.skillName)}</strong><br/>${p(e.skillDesc)}<br/><span style="color:var(--spray-lime)">${p(e.drink)}</span></div>
    </div>`).join("");return b(`
    <div class="screen" data-screen="roles-preview">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="home" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        <span class="tag-pill">ROSTER</span>
      </div>
      <h1 class="graffiti-title" style="font-size:2rem">全角色</h1>
      <div class="role-grid">${t}</div>
    </div>
  `)}function z(t){const e=t.isOnline&&!t.isHost;return b(`
    <div class="screen" data-screen="modes">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="back-roles" style="width:auto;min-height:40px;padding:8px 12px">←</button>
        ${t.roomCode?`<span class="room-badge">${p(t.roomCode)}</span>`:'<span class="tag-pill">MODE</span>'}
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
          <div class="m-desc">無厘頭題目 · 蓋牌倒數翻開 · 少數方喝</div>
        </button>
      </div>
    </div>
  `)}function _t(t){const e=["搖罐中…","噴漆上牆…","揭開標籤！"];return b(`
    <div class="screen" data-screen="drawing">
      <div class="ceremony">
        <div class="boombox">🎧</div>
        <div class="graffiti-title" style="font-size:1.8rem">${e[Math.min(t,e.length-1)]}</div>
        <p class="hint">街頭儀式進行中</p>
      </div>
      <div class="spray-burst" id="spray-burst"></div>
    </div>
  `)}function Rt(t){const e=t.lastResult;if(!e)return z(t);const s=t.players.find(i=>i.id===e.playerId),o=s?F(s.roleId):null;if(e.mode==="drink_order"&&e.order){const i=e.order.map((l,d)=>{const r=t.players.find(c=>c.id===l);return`<li style="animation-delay:${d*.08}s">${d+1}. ${p(r.name)} <span style="color:var(--muted)">（${p(F(r.roleId).name)}）</span></li>`}).join("");return b(`
      <div class="screen" data-screen="reveal">
        <div class="ceremony" style="justify-content:flex-start;padding-top:24px">
          <div class="reveal-name">順序出爐</div>
          <ul class="order-list" style="padding:0;width:100%">${i}</ul>
        </div>
        <div class="btn-row">
          <button class="btn btn-lg" data-action="again" type="button">再來一輪</button>
          <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
        </div>
      </div>
    `)}if(e.mode==="team_toast"&&e.teams){const i=e.teams.map(l=>`
      <div class="team">
        <h3>${p(l.name)}</h3>
        <div>${l.members.map(d=>p(d)).join(" · ")}</div>
      </div>`).join("");return b(`
      <div class="screen" data-screen="reveal">
        <div class="ceremony" style="justify-content:flex-start;padding-top:24px">
          <div class="reveal-name">分隊乾杯</div>
          <div class="team-box">${i}</div>
          <div class="reveal-drink">兩隊互敬 · 乾！</div>
        </div>
        <div class="btn-row">
          <button class="btn btn-lg" data-action="again" type="button">再分一次</button>
          <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
        </div>
      </div>
    `)}const a=e.skillKind!=="none"&&t.skillPending;return b(`
    <div class="screen" data-screen="reveal">
      <div class="ceremony">
        <div class="tag-pill" style="transform:rotate(-6deg)">HIT!</div>
        <div class="reveal-name shake">${p((s==null?void 0:s.name)??"?")}</div>
        <div style="font-size:2.5rem">${(o==null?void 0:o.emoji)??"💥"}</div>
        <div class="graffiti-sub">${p((o==null?void 0:o.name)??"")} · ${p((o==null?void 0:o.tag)??"")}</div>
        <div class="reveal-drink">${p(e.drinkHint)}</div>
        ${o&&o.skillKind!=="none"?`<div class="sticker" style="width:100%;margin-top:8px">
                <strong style="color:var(--spray-pink)">${p(o.skillName)}</strong>
                <p class="hint" style="margin:4px 0 0">${p(o.skillDesc)}</p>
              </div>`:""}
      </div>
      <div class="btn-row">
        ${a?`<button class="btn btn-pink btn-lg" data-action="use-skill" type="button">⚡ 發動技能</button>
               <button class="btn btn-lime" data-action="skip-skill" type="button">直接喝 · 跳過技能</button>`:`<button class="btn btn-lg" data-action="again" type="button">🎲 再抽一次</button>
               <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>`}
      </div>
      <div class="spray-burst" id="spray-burst"></div>
    </div>
  `)}function Tt(t){const e=t.lastResult;if(!e)return z(t);const s=t.players.find(r=>r.id===e.playerId),o=s?F(s.roleId):null,a=t.players.filter(r=>r.id!==e.playerId),i=t.players.filter(r=>r.roleId==="worker"&&r.id!==e.playerId),l=(r,c)=>r.map(m=>`<button class="chip-btn" data-action="${c}" data-target="${m.id}" type="button">${p(m.name)}</button>`).join("")||'<p class="hint">沒有可選對象</p>';let d="";switch(e.skillKind){case"pick_drink2":d=`<p class="hint">指定一位「上班族」喝 2</p><div class="targets">${l(i.length?i:a,"skill-target")}</div>`;break;case"boss_choice":d=`
        <button class="btn btn-pink" data-action="skill-opt" data-opt="all" type="button">全場喝 1</button>
        <p class="hint">或指定一人喝 2：</p>
        <div class="targets">${l(a,"skill-target")}</div>`;break;case"intern_pass":d=(s==null?void 0:s.hasPass)===!1?'<p class="error-banner">救命已用完</p>':`<p class="hint">把這次喝酒傳給誰？</p><div class="targets">${l(a,"skill-target")}</div>`;break;case"treat":d=`<p class="hint">請客對象（各喝 1）</p><div class="targets">${l(a,"skill-target")}</div>`;break;case"transfer":d=`
        <button class="btn btn-cyan" data-action="skill-opt" data-opt="redraw" type="button">全體重抽角色</button>
        <p class="hint">或與一人互換：</p>
        <div class="targets">${l(a,"skill-target")}</div>`;break;case"tax":d=`<p class="hint">誰多喝 1？（你改半杯）</p><div class="targets">${l(a,"skill-target")}</div>`;break;case"deploy":d=`
        <p class="hint">可指定一人下輪免抽（也可跳過）</p>
        <div class="targets">${l(a,"skill-target")}</div>
        <button class="btn btn-lime" data-action="skill-opt" data-opt="selfonly" type="button">只自己喝 1</button>`;break;case"overtime":d='<button class="btn btn-pink btn-lg" data-action="skill-opt" data-opt="ot" type="button">確認加班：喝 2，下輪免抽</button>';break;default:d='<button class="btn" data-action="skip-skill" type="button">完成</button>'}return b(`
    <div class="screen" data-screen="skill">
      <div class="top-bar">
        <span class="tag-pill">SKILL</span>
      </div>
      <h1 class="graffiti-title" style="font-size:1.8rem">${p((o==null?void 0:o.skillName)??"技能")}</h1>
      <div class="skill-panel sticker">
        ${d}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" data-action="skip-skill" type="button">取消技能</button>
      </div>
    </div>
  `)}function At(t){return b(`
    <div class="screen" data-screen="result">
      <div class="ceremony">
        <div class="reveal-name" style="font-size:1.6rem">技能發動</div>
        <div class="sticker" style="width:100%">
          <p style="margin:0;font-size:1.2rem;font-weight:900;line-height:1.5">${p(t)}</p>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn btn-lg" data-action="again" type="button">🎲 再抽</button>
        <button class="btn btn-ghost" data-action="to-modes" type="button">換模式</button>
      </div>
    </div>
  `)}function Ht(t){const e=t.flip,s=yt(t);if(!e||!s)return b(`
      <div class="screen" data-screen="flip">
        <p class="hint">題庫載入中…</p>
        <button class="btn btn-ghost" data-action="to-modes" type="button">回模式</button>
      </div>
    `);const o=e.answererId?t.players.find(h=>h.id===e.answererId):null,i=!(t.isOnline&&!t.isHost),l=e.sub!=="countdown",d=e.index+1,r=e.deck.length,c=qt(t),m=s.correct===0?"A":"B",I=s.options[s.correct],at=e.sub==="countdown"?`<div class="flip-countdown" aria-live="polite">
           <span class="flip-cd-num">${e.countdown>0?e.countdown:"翻！"}</span>
           <span class="flip-cd-label">蓋牌倒數</span>
         </div>`:"",lt=[0,1].map(h=>{const x=s.options[h];let v="flip-card";l?v+=" face-up":v+=" face-down",e.sub==="result"&&(e.tie||e.majoritySide!=null&&(h===e.majoritySide?v+=" is-majority":v+=" is-minority"),s.correct===h&&(v+=" is-official"));const y=!i||e.sub!=="choose"?"disabled":"",g=h===0?"🔥":"❄️",D=h===0?c.a:c.b,rt=e.sub==="result"?`<span class="flip-vote-n">${D} 票</span>`:"";return`
        <button class="${v}" data-action="flip-pick" data-choice="${h}" ${y} type="button">
          <div class="flip-card-inner">
            <div class="flip-face flip-back">
              <span class="flip-back-tag">STREET</span>
              <span class="flip-back-ico">${g}</span>
              <span class="flip-back-sub">蓋牌</span>
            </div>
            <div class="flip-face flip-front">
              <span class="flip-opt-label">${h===0?"A":"B"}</span>
              <span class="flip-opt-text">${p(x)}</span>
              ${rt}
            </div>
          </div>
        </button>`}).join("");let J="";e.sub==="choose"&&(J=`
      <div class="sticker flip-ready-box" style="width:100%;margin-top:8px">
        <p style="margin:0 0 8px;font-weight:900">選邊進度（收齊才結算）</p>
        <div class="ready-list">${t.players.map(x=>{const v=x.id in e.votes,y=e.answererId===x.id;return`<div class="ready-chip ${v?"on":y?"turn":"off"}">
          <span class="status-dot ${v?"on":"off"}"></span>
          <strong>${p(x.name)}</strong>
          <span class="ready-label">${v?"已選":y?"輪到選":"還沒選"}</span>
        </div>`}).join("")}</div>
        ${o?`<p class="hint" style="margin:10px 0 0">傳手機給 <strong style="color:var(--spray-pink)">${p(o.name)}</strong> 選 A 或 B</p>`:""}
        <p class="hint" style="margin-bottom:0">規則：跟大家不一樣的<strong>少數方</strong>喝；平手免喝。</p>
      </div>`);let S="";if(e.sub==="result"){const h=e.drinkerIds.map(y=>{var g;return(g=t.players.find(D=>D.id===y))==null?void 0:g.name}).filter(Boolean).map(y=>p(y));e.tie?S=`<div class="flip-result ok">
           <div class="flip-result-title">平手免喝！</div>
           <p class="hint" style="margin:0">A ${c.a} ： B ${c.b} · 少數不成立，這輪放過</p>
         </div>`:h.length===0?S=`<div class="flip-result ok">
           <div class="flip-result-title">全場同邊！</div>
           <p class="hint" style="margin:0">沒有少數方 · 全員免喝 🍻</p>
         </div>`:S=`<div class="flip-result bad">
           <div class="flip-result-title">少數方喝！</div>
           <p class="hint" style="margin:0">${h.join("、")} · 跟大家不一樣 · 乾一口 🍻</p>
           <p class="hint" style="margin:6px 0 0">票數 A ${c.a} ： B ${c.b}</p>
         </div>`,S+=`
      <div class="flip-official sticker" style="width:100%;margin-top:8px">
        <div class="flip-q-label">官方答案（趣味｜不決定誰喝）</div>
        <p style="margin:4px 0 0;font-weight:800">${m}. ${p(I)}</p>
      </div>`;const x=new Set(e.readyIds),v=t.players.map(y=>{const g=x.has(y.id);return`<div class="ready-chip ${g?"on":"off"}">
          <span class="status-dot ${g?"on":"off"}"></span>
          <strong>${p(y.name)}</strong>
          <span class="ready-label">${g?"已就緒":"還沒按"}</span>
          ${i&&!g?`<button class="chip-btn alt" data-action="flip-ready" data-player="${y.id}" type="button">下一題 ✓</button>`:""}
        </div>`}).join("");S+=`
      <div class="sticker flip-ready-box" style="width:100%;margin-top:8px">
        <p style="margin:0 0 8px;font-weight:900">下一題就緒狀況</p>
        <div class="ready-list">${v}</div>
        ${i?`<button class="btn btn-lg" style="margin-top:12px" data-action="flip-ready-all" type="button">下一題</button>
               <p class="hint" style="margin-bottom:0">傳手機：每人按一次「下一題」；名單會顯示誰好了／誰還沒。全到齊自動進下一題。</p>`:'<p class="hint" style="margin-bottom:0">等待房主／大家按下一題…</p>'}
      </div>`}return b(`
    <div class="screen" data-screen="flip">
      <div class="top-bar">
        <button class="btn btn-ghost" data-action="to-modes" style="width:auto;min-height:40px;padding:8px 12px" type="button">←</button>
        <span class="tag-pill">FLIP ${d}/${r}</span>
      </div>
      <div class="flip-q sticker">
        <div class="flip-q-label">無厘頭題</div>
        <p class="flip-q-text">${p(s.q)}</p>
      </div>
      ${at}
      <div class="flip-cards ${l?"revealed":"hidden-opts"}">${lt}</div>
      ${J}
      ${S}
      <div class="spray-burst" id="spray-burst"></div>
      <p class="footer-note">少數方喝 · 平手免喝 · 請理性飲酒</p>
    </div>
  `)}function Bt(){return b(`
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
  `)}function Dt(){return b(`
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
  `)}const A=document.querySelector("#app"),n=ft();let w=["玩家1","玩家2","玩家3","玩家4"],nt="idle",H=[],C="",$=null,_=null,it=null,R=null;const E=new Ot({onStatus:t=>{nt=t,n.phase==="lobby"&&u()},onCreated:(t,e)=>{n.roomCode=t,n.myPlayerId=e,n.isHost=!0,n.isOnline=!0,n.phase="lobby",W(t),u()},onJoined:(t,e,s)=>{n.roomCode=t,n.myPlayerId=e,n.isHost=s,n.isOnline=!0,n.phase="lobby",W(t),u()},onRoster:t=>{H=t,u()},onState:t=>{n.isHost||(jt(n,t),u(),n.phase==="reveal"&&q())},onError:t=>{alert(t)}});function W(t){const e=new URL(location.href);t?e.searchParams.set("room",t):e.searchParams.delete("room"),history.replaceState(null,"",e.toString())}function f(){n.isOnline&&n.isHost&&E.connected&&E.sync(St(n))}function u(){let t="";switch(n.phase){case"home":t=G();break;case"setup":t=Ct(w,n.isOnline);break;case"lobby":t=Et(n,H,nt);break;case"roles":t=Ft(n.players);break;case"mode_select":t=z(n);break;case"drawing":t=_t(n.ceremonyStep);break;case"reveal":t=Rt(n);break;case"skill":t=Tt(n);break;case"result":t=At(C);break;case"flip_battle":t=Ht(n);break;default:t=G()}R==="join"&&(t=Bt()),R==="host-name"&&(t=Dt()),R==="roles-preview"&&(t=Nt()),A.innerHTML=t}function k(t){R=t}function j(){_!=null&&(window.clearInterval(_),_=null)}function Y(){n.isOnline&&!n.isHost||(j(),$!=null&&(window.clearInterval($),$=null),vt(n),f(),u(),q(),ot())}function ot(){j(),!(!n.flip||n.flip.sub!=="countdown")&&(n.isOnline&&!n.isHost||(_=window.setInterval(()=>{if(!n.flip||n.flip.sub!=="countdown"){j();return}n.flip.countdown>1?(n.flip.countdown-=1,f(),u()):(j(),gt(n),f(),u(),q())},1e3)))}function X(){n.isOnline&&!n.isHost||(It(n),f(),u(),q(),ot())}function Z(t){n.isOnline&&!n.isHost||(it=t,n.mode=t,n.phase="drawing",n.ceremonyStep=0,n.skillPending=!1,f(),u(),q(),$!=null&&window.clearInterval($),$=window.setInterval(()=>{n.ceremonyStep+=1,n.ceremonyStep>=3?($!=null&&window.clearInterval($),$=null,Kt()):(f(),u(),q())},700))}function Kt(){const t=it??n.mode;if(!t||t==="flip_battle")return;let e;t==="draw_one"?e=mt(n):t==="drink_order"?e=bt(n):e=ht(n),n.lastResult=e,n.drawCount+=1,n.phase="reveal",n.skillPending=t==="draw_one"&&e.skillKind!=="none",f(),u(),q()}function q(){const t=document.getElementById("spray-burst");if(!t)return;const e=["💥","✨","🔥","🧢","🎤","⭐","💧","🎨"];for(let s=0;s<14;s++){const o=document.createElement("span");o.textContent=e[s%e.length];const a=10+Math.random()*80,i=20+Math.random()*50;o.style.left=`${a}%`,o.style.top=`${i}%`,o.style.setProperty("--dx",`${(Math.random()-.5)*160}px`),o.style.setProperty("--dy",`${-80-Math.random()*120}px`),o.style.setProperty("--rot",`${(Math.random()-.5)*120}deg`),o.style.animationDelay=`${Math.random()*.2}s`,t.appendChild(o),window.setTimeout(()=>o.remove(),1200)}}A.addEventListener("click",t=>{var o,a,i,l,d;const e=t.target.closest("[data-action]");if(!e)return;const s=e.dataset.action;if(s)switch(s){case"home":k(null),j(),n.phase="home",n.flip=null,n.isOnline=!1,n.roomCode=null,E.disconnect(),W(null),u();break;case"solo":k(null),n.isOnline=!1,n.isHost=!0,n.phase="setup",u();break;case"host":k("host-name"),u();break;case"join":k("join"),u();break;case"roles-preview":k("roles-preview"),u();break;case"do-host":{const r=((o=document.getElementById("host-name"))==null?void 0:o.value.trim())||"房主";k(null),E.create(r),n.phase="lobby",u();break}case"do-join":{const r=((a=document.getElementById("join-name"))==null?void 0:a.value.trim())||"玩家",c=(i=document.getElementById("join-code"))==null?void 0:i.value.trim().toUpperCase();if(!c||c.length<4){alert("請輸入 4 碼房間碼");return}k(null),E.join(c,r),n.phase="lobby",u();break}case"add-player":w.length<12&&(w.push(`玩家${w.length+1}`),u());break;case"remove-player":{const r=Number(e.dataset.idx);w.length>2&&(w.splice(r,1),u());break}case"confirm-setup":{A.querySelectorAll("[data-name-idx]").forEach(c=>{const m=Number(c.dataset.nameIdx);w[m]=c.value.trim()||`玩家${m+1}`}),n.seed=M(),n.players=Q(w,n.seed),n.drawCount=0,n.lastResult=null,n.phase="roles",f(),u();break}case"start-online":{if(!n.isHost)return;const r=H.map(c=>c.name);if(r.length<2){alert("至少需要 2 人");return}n.seed=M(),n.players=Q(r,n.seed),n.players.forEach((c,m)=>{const I=H[m];I&&(c.id=I.id,c.name=I.name)}),n.myPlayerId=n.myPlayerId,n.drawCount=0,n.lastResult=null,n.phase="roles",f(),u();break}case"to-modes":k(null),j(),n.phase="mode_select",n.skillPending=!1,n.flip=null,f(),u();break;case"back-roles":n.phase="roles",f(),u();break;case"mode":{const r=e.dataset.mode;r==="flip_battle"?Y():Z(r);break}case"flip-pick":{if(n.isOnline&&!n.isHost)return;const r=Number(e.dataset.choice);if(r!==0&&r!==1)return;$t(n,r),f(),u(),q();break}case"flip-ready":{if(n.isOnline&&!n.isHost)return;const r=e.dataset.player;if(!r)return;K(n,r),f(),u(),L(n)&&window.setTimeout(()=>{L(n)&&X()},350);break}case"flip-ready-all":{if(n.isOnline&&!n.isHost)return;if(n.isOnline&&n.myPlayerId)K(n,n.myPlayerId);else{const r=n.players.find(c=>!n.flip.readyIds.includes(c.id));r&&K(n,r.id)}f(),u(),L(n)&&window.setTimeout(()=>X(),350);break}case"again":n.mode==="flip_battle"?Y():n.mode&&Z(n.mode);break;case"use-skill":n.phase="skill",f(),u();break;case"skip-skill":n.skillPending=!1,n.phase="reveal",f(),u();break;case"skill-target":{const r=e.dataset.target,c=((l=n.lastResult)==null?void 0:l.skillKind)??"none";C=N(n,c,r),n.skillPending=!1,n.phase="result",f(),u();break}case"skill-opt":{const r=e.dataset.opt,c=((d=n.lastResult)==null?void 0:d.skillKind)??"none";r==="selfonly"?C=N(n,"deploy"):r==="ot"?C=N(n,"overtime"):C=N(n,c,void 0,r),n.skillPending=!1,n.phase="result",f(),u();break}}});A.addEventListener("change",t=>{const e=t.target;if(e.matches("[data-name-idx]")){const s=Number(e.dataset.nameIdx);w[s]=e.value}});const Lt=new URLSearchParams(location.search),tt=Lt.get("room");tt?(k("join"),u(),window.setTimeout(()=>{const t=document.getElementById("join-code");t&&(t.value=tt.toUpperCase())},0)):u();
