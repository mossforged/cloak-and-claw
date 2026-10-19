// T029 r3 wrist sheet: hand drawings on the forearm (every other joint 0: the A017 master, arm hanging), turned on the
// wrist by a few angles, so each drawing's natural angle on the forearm (data/wrists.js `neutral`) can be judged by eye;
// green = inside the wrist limit, red = past it. Headless JPG via tools/stretch_render.py.
// Usage: node tools/wrist-sheet.mjs <rig id> <out.jpg> [drawing ...] [--zoom N] [--turns -90,0,90]
import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { RIGS } from '../src/data/rigs/index.js';
import { layoutRig, mul, apply } from '../src/render/rig-layout.js';
import { wristLimit, neutralOf, inside } from '../src/data/wrists.js';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : args.splice(i, 2)[1]; };
const zoom = +opt('--zoom', 2), turns = opt('--turns', '-135,-90,-45,0,45,90,135,180').split(',').map(Number);
const [id, out, ...names] = args, rig = RIGS[id];
const all = ['hand-near', 'hand-far'].flatMap((h) => [h, ...Object.keys(rig.parts[h].swaps ?? {}).filter((k) => !/-under$/.test(k))]);
const pick = names.length ? all.filter((n) => names.includes(n)) : all;
const cells = pick.flatMap((s) => turns.map((t) => {
  const h = s.startsWith('hand-near') ? 'hand-near' : 'hand-far', over = !inside(t - neutralOf(rig, s), wristLimit(rig, h.slice(5), s));
  const L = layoutRig(rig, { [h]: t }, s === h ? {} : { [h]: s }, null).filter((e) => e.m && new RegExp(`^(arm-${h.slice(5)}-lower|${h})$`).test(e.name));
  const U = rig.parts[h].swaps?.[s]?.under;   // a split grip's under piece (render/grip-split.js), drawn first
  if (U) L.unshift(layoutRig(rig, { [h]: t }, { [h]: U }, null).find((e) => e.name === h));
  const F = L.find((e) => e.name !== h && e.m), W = apply(F.base, ...rig.parts[h].attach), k = 3;   // the wrist in the cell's middle, 3x
  const V = [k, 0, 0, k, -k * W[0], -110 - k * W[1]];
  return { label: `${s} ${t}`, flags: over ? ['past the limit'] : [], marks: [], floor: false, lines: [], parts: L.map((e) => ({ img: e.img, m: mul(V, e.m) })) };
}));
const json = out.replace(/\.jpg$/, '.json');
writeFileSync(json, JSON.stringify({ title: `${id}: hand drawings turned on the wrist (deg from as drawn)`, zoom, cells }));
const r = spawnSync('python3', ['tools/stretch_render.py', json, out], { encoding: 'utf8' });
spawnSync('rm', [json]);
if (r.status) { console.error(r.stderr); process.exit(1); }
console.log(`wrote ${out}: ${cells.length} cells`);
