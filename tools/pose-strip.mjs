// Pose filmstrip (T024): fighter states drawn as the game draws them (render/rig.js rigFrame: floor-line rule, standee
// lean, lying rest) with each boot's floor line, headless, as a JPG (tools/stretch_render.py).
// Usage: node tools/pose-strip.mjs <fighter id> <out.jpg> <title> <cell> [<cell> ...]
//   cell: state[:t[:z]] (walk:<0..1 of a stride>), a named pose (=name, e.g. =cast), or move:<frame> (e.g. slash3:14)
import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { rigFrame } from '../src/render/rig.js';
import { floorLine } from '../src/data/rigs/biped-floor.js';

const [id, out, title, ...specs] = process.argv.slice(2), def = FIGHTERS[id], rig = RIGS[def.art.rig];
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
const cells = specs.map((spec) => {
  const [a, b = 0, z = 0] = spec.split(':'), m = def.moves[a];
  const f = { def, state: a, t: +b, mf: 0, move: null, z: +z, vz: 0, facing: 1, id: 1, x: 0, y: 0, stun: 10, grab: { knee: -1 } };
  let pose;
  if (a.startsWith('=')) { f.state = 'idle'; pose = a.slice(1); }
  else if (m) Object.assign(f, { state: m.air ? 'jump' : 'attack', move: m, moveKey: a, mf: +b, t: +b });
  else if (a === 'walk') f.t = +b * 60 / rig.poses.walk.speed;
  const mem = {};
  rigFrame(f, rig, -1, mem, pose); const fr = rigFrame(f, rig, 0, mem, pose), p = fr.p, k = fr.k;
  const c = Math.cos(p.rot), s = Math.sin(p.rot), V = [p.sx * k * c, p.sx * k * s, -p.sy * k * s, p.sy * k * c, p.dx, p.dy - f.z];
  return { label: spec, flags: [], marks: [], floor: true, lying: ['down', 'dead'].includes(f.state),
    parts: fr.L.filter((e) => e.m && !e.line).map((e) => ({ img: e.img, m: mul(V, e.m) })),
    lines: ['foot-near', 'foot-far'].map((n) => ({ foot: n, y: floorLine(rig, n) })) };
});
const json = out.replace(/\.jpg$/, '.json');
writeFileSync(json, JSON.stringify({ title, zoom: 1.5, cells }));
const r = spawnSync('python3', ['tools/stretch_render.py', json, out], { encoding: 'utf8' });
spawnSync('rm', [json]);
if (r.status) { console.error(r.stderr); process.exit(1); }
console.log(`wrote ${out}: ${cells.length} cells`);
