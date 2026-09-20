import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{
  try {
    let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(!pathname.startsWith('/office-drink-draw/')) {res.writeHead(404).end();return;}
    pathname=pathname.slice('/office-drink-draw/'.length)||'index.html';
    const target=path.resolve(pathname);
    if(!target.startsWith(process.cwd()+path.sep)) throw Error('Invalid path');
    const data=await readFile(target);
    // Model GitHub Pages' static asset cache; HTML/config remain fresh during development.
    const cache=/\.(png|jpg|webp|svg|mp3|mp4)$/.test(target)?'public, max-age=600':'no-store';
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':cache}).end(data);
  } catch {res.writeHead(404).end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('http://127.0.0.1:4173/office-drink-draw/'));
