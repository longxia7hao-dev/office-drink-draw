function OnlineFallback({joining,presetCode}) {
  const [room,setRoom] = _.useState(presetCode || new URLSearchParams(location.search).get('room') || '');
  const close=I(s=>s.setOverlay);
  const url=new URL('https://monarch-finch-forge-summit.grok.me/');
  if(room.trim()) url.searchParams.set('room',room.trim().toUpperCase());
  return B.jsxs(V,{children:[
    B.jsx('button',{className:'btn btn-ghost',onClick:()=>close(null),'aria-label':'返回',children:'返回'}),
    B.jsx('h1',{className:'graffiti-title',children:joining?'加入連線版':'前往連線版開房'}),
    B.jsx('p',{className:'sticker',children:'此網站提供單機練習。GitHub Pages 沒有連線後端，原站目前也不允許這裡跨網域連線。多人遊戲請前往原 Grok 版；若原站服務異常，請稍後再試。'}),
    B.jsx('label',{className:'field',htmlFor:'online-room',children:'房號（加入房間時填寫）'}),
    B.jsx('input',{id:'online-room',maxLength:6,value:room,autoCapitalize:'characters',onChange:e=>setRoom(e.target.value.toUpperCase()),placeholder:'ABCD'}),
    B.jsx('a',{className:'btn btn-lg',href:url.href,children:joining?'前往原 Grok 連線版加入':'前往原 Grok 連線版開房'}),
    B.jsx('button',{className:'btn btn-ghost',onClick:()=>{close(null);I.getState().startSolo();},children:'留在這裡單機練習'})
  ]});
}
class HotfixBoundary extends _.Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){window.ODD.showError();}
  render(){return this.state.failed?null:this.props.children;}
}
window.addEventListener('odd:connection-error',()=>I.getState().setNotice('連線失敗或逾時。請返回重試，或使用原 Grok 連線版；單機練習仍可使用。'));
// Bound the wait for a remote host / data channel as well as the HTTP signaling request.
let peerDeadline=null;
I.subscribe((state,previous)=>{
  if(state.isOnline && state.phase==='lobby' && (!previous.isOnline || previous.phase!=='lobby')) {
    clearTimeout(peerDeadline);
    peerDeadline=setTimeout(()=>{
      const s=I.getState();
      if(s.isOnline && s.phase==='lobby' && !s.isHost && !s.roster.some(p=>p.id!==s.myPlayerId && p.connected)) window.ODD.connectionError();
    },15000);
  } else if(!state.isOnline || state.phase!=='lobby') clearTimeout(peerDeadline);
});
