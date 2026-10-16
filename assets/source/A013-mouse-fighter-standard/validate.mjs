// Exercise the existing bench reader and layout without writing game files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSource, buildRig, stripAt, stripLength, rigJointsOf, swapsOf } from '../../../tools/bench/source.js';
import { layoutRig } from '../../../src/render/rig.js';
const dir=path.dirname(fileURLToPath(import.meta.url));
const json=JSON.parse(fs.readFileSync(path.join(dir,'rig-source.json')));
const src=readSource(json,'assets/source/A013-mouse-fighter-standard/rig-source.json');
if(src.errors.length||src.missing.length)throw Error(JSON.stringify({errors:src.errors,missing:src.missing}));
for(const p of [...Object.values(json.parts),...Object.values(json.swaps)])if(!fs.existsSync(path.join(dir,p.img)))throw Error('Missing '+p.img);
const rig=buildRig(src,{top:pointTop(),height:130});
function pointTop(){return 798;}
let frames=0;
for(let t=0;t<stripLength();t+=1/30){
  const p=stripAt(t);const draw=layoutRig(rig,rigJointsOf(src,p.joints),swapsOf(src,p.swap));
  if(draw.length!==17)throw Error('Missing base parts');
  for(const d of draw)if(d.m.some(n=>!Number.isFinite(n)))throw Error('Nonfinite '+d.name);
  frames++;
}
const report={readerErrors:src.errors,missingStandardParts:src.missing,partCount:Object.keys(json.parts).length,swapCount:Object.keys(json.swaps).length,sampledMotionFrames:frames,allMatricesFinite:true,note:'Reader/layout compatibility only; visual motion approval remains G3. Source reader does not forward whole-arm hide/carry extension fields, so Code must apply them during import.'};
fs.writeFileSync(path.join(dir,'bench-validation.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
