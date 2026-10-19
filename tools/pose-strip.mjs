// Pose filmstrip (T024): fighter states drawn as the game draws them (render/rig.js rigFrame: floor-line rule, standee
// lean, lying rest) with each boot's floor line, headless, as a JPG (tools/stretch_render.py).
// Usage: node tools/pose-strip.mjs <fighter id> <out.jpg> <title> <cell> [<cell> ...] [--zoom N] [--a010]
//   --no-wrists (T029 r3): without the wrist limits (render/wrist.js), for before / after sheets
//   --gear g,g (T032 r2): wear that gear (render/looks.js groups) instead of the fighter's own loadout
//   --zoom: scale (default 1.5; 1 = game size); --a010 (T026): draw a rat with its old A010 rig (rigs/a010/)
//   cell: state[:t[:z]] (walk:<0..1 of a stride>), a named pose (=name, e.g. =cast), or move:<frame> (e.g. slash3:14)
import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { rigFrame } from '../src/render/rig.js';
import { floorLine } from '../src/data/rigs/biped-floor.js';
import { RAT_A010 } from '../src/data/rigs/a010/index.js';
import { keyMf } from '../src/viewer/rehearse-frames.js';
import { ITEMS } from '../src/data/items/index.js';
import { WRISTS } from '../src/data/wrists.js';

const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i < 0 ? null : args.splice(i, 2)[1]; };
const zoom = +(opt('--zoom') ?? 1.5), old = args.includes('--a010') && args.splice(args.indexOf('--a010'), 1);
if (args.includes('--no-wrists')) { WRISTS.on = false; args.splice(args.indexOf('--no-wrists'), 1); }   // T029 r3: the frame before wrist limits
const gear = opt('--gear');   // T032 r2: --gear gear-hood,gear-jerkin wears that gear instead of the fighter's loadout
const [id, out, title, ...specs] = args, def0 = FIGHTERS[id], def = gear ? { ...def0, art: { ...def0.art, gear: gear.split(',') } } : def0, rig = old ? RAT_A010[def.art.rig] : RIGS[def.art.rig];
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
const cells = specs.map((spec) => {
  const [a, b0 = 0, z = 0] = spec.split(':'), m = def.moves[a] ?? def.rehearsal?.[a];
  const b = m && isNaN(+b0) ? keyMf(rig, m, a, b0) : +b0;   // T029: move:<key name> (windup, through.1, strike, recover)
  const f = { def, state: a, t: +b, mf: 0, move: null, z: +z, vz: 0, facing: 1, id: 1, x: 0, y: 0, stun: 10, grab: { knee: -1 } };
  let pose, time = 0;
  if (a.startsWith('=')) { f.state = 'idle'; pose = a.slice(1); time = rig.poses[pose]?.speed ? +b / rig.poses[pose].speed : 0; }   // =run:0.25 (share of a cycle)
  else if (m) Object.assign(f, { state: m.air ? 'jump' : 'attack', move: m, moveKey: a, mf: +b, t: +b },   // T029 r2: + the move's own items
    m.item && { weapon: { def: ITEMS[m.item], uses: 999, hit: false, broken: false } }, m.strap && { strap: { def: ITEMS[m.strap] } });
  else if (a === 'walk') f.t = +b * 60 / rig.poses.walk.speed;
  const mem = {};
  rigFrame(f, rig, time - 1, mem, pose); const fr = rigFrame(f, rig, time, mem, pose), p = fr.p, k = fr.k;
  const c = Math.cos(p.rot), s = Math.sin(p.rot), V = [p.sx * k * c, p.sx * k * s, -p.sy * k * s, p.sy * k * c, p.dx, p.dy - f.z];
  return { label: spec, flags: [], marks: [], floor: true, lying: ['down', 'dead'].includes(f.state),
    parts: fr.L.filter((e) => e.m && !e.line).map((e) => ({ img: e.img, m: mul(V, e.m) })),
    lines: ['foot-near', 'foot-far'].map((n) => ({ foot: n, y: floorLine(rig, n) })) };
});
const json = out.replace(/\.jpg$/, '.json');
writeFileSync(json, JSON.stringify({ title, zoom, cells }));
const r = spawnSync('python3', ['tools/stretch_render.py', json, out], { encoding: 'utf8' });
spawnSync('rm', [json]);
if (r.status) { console.error(r.stderr); process.exit(1); }
console.log(`wrote ${out}: ${cells.length} cells`);
