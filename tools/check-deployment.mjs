import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const base='https://longxia7hao-dev.github.io/office-drink-draw/';
const expected=JSON.parse(await readFile('version.json','utf8'));
const sha=data=>createHash('sha256').update(data).digest('hex');
const result={timestamp:new Date().toISOString(),base,version:expected.version,checks:[]};
for(const suffix of ['',`?verify=${expected.version}`]) {
  const response=await fetch(base+suffix,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,200);
  const html=await response.text();assert(html.includes(`name="odd-version" content="${expected.version}"`),'Public HTML is stale');
  result.checks.push({url:base+suffix,status:response.status,versionMatches:true,lastModified:response.headers.get('last-modified')});
}
for(const file of ['version.json',expected.app,expected.css,expected.runtime,'assets/index-B-oJsHNQ.js','assets/index-C-opy5tM.css']) {
  const response=await fetch(base+file,{signal:AbortSignal.timeout(20000)});assert.equal(response.status,200);
  const remote=Buffer.from(await response.arrayBuffer()),local=await readFile(file);
  assert.equal(sha(remote),sha(local),`Public ${file} differs from tested artifact`);
  result.checks.push({file,status:response.status,sha256:sha(remote),matchesTestedArtifact:true});
}
if(!process.env.NO_WRITE) await writeFile('reports/deployment-check.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
