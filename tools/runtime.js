(() => {
  const config=window.ODD_CONFIG || {};
  let endpoint='';
  if(config.signalingEndpoint) {
    try {
      const url=new URL(config.signalingEndpoint,location.href);
      if(url.protocol==='https:' || (url.origin===location.origin && ['localhost','127.0.0.1'].includes(url.hostname))) endpoint=url.href.replace(/\/$/,'');
    } catch {}
  }
  const api=window.ODD={
    endpoint,interacted:false,
    lite:()=>matchMedia('(prefers-reduced-motion: reduce)').matches || !!navigator.connection?.saveData || /(^|-)2g$/.test(navigator.connection?.effectiveType || ''),
    async rtcFetch(query='',options={}) {
      if(!endpoint) throw Error('Multiplayer requires a configured signaling endpoint');
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),6000);
      try {return await fetch(endpoint+query,{...options,signal:controller.signal});}
      finally {clearTimeout(timer);}
    },
    connectionError:()=>window.dispatchEvent(new Event('odd:connection-error')),
    showError:()=>{
      const panel=document.getElementById('load-error');
      if(panel) panel.hidden=false;
    }
  };
  for(const event of ['pointerdown','touchstart','keydown']) {
    window.addEventListener(event,e=>{if(e.isTrusted) api.interacted=true;},{capture:true,passive:true});
  }
  function updateMotion(){document.documentElement.classList.toggle('lite-mode',api.lite());}
  updateMotion();
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change',updateMotion);
  navigator.connection?.addEventListener?.('change',updateMotion);
  window.addEventListener('error',event=>{
    if(event.target?.matches?.('script[data-app],img.home-poster') || event.error) api.showError();
  },true);
  window.addEventListener('unhandledrejection',()=>api.showError());
  window.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('reload-app').addEventListener('click',()=>location.reload());
    setTimeout(()=>{if(!document.querySelector('#root .app-shell')) api.showError();},12000);
  });
})();
