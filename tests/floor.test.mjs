// T024 floor-line rule: through the whole frame (pose blend, brace/squat layers, the standee's lean and squash), every
// grounded state puts each boot's drawing on that boot's floor line, raised only by the pose's named lift; lying rests the
// body on the floor (never under it while falling). Old case, old result: a pose already on its lines keeps its joints.
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { rigFrame } from '../src/render/rig.js';
import { floorLayer } from '../src/render/floor.js';
import { floorLine } from '../src/data/rigs/biped-floor.js';
import HULLS from '../src/data/rigs/hulls.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const heightOn = (p, k) => { const a = Math.sin(p.rot) * p.sx * k, b = Math.cos(p.rot) * p.sy * k; return ([x, y]) => p.dy + a * x + b * y; };
// lowest drawn point of each foot on screen (px from the feet line, - = above), as the frame places it
export function soleHeights(fr) {
  const h = heightOn(fr.p, fr.k), out = {};
  for (const e of fr.L) if (/^foot-/.test(e.name) && e.m) out[e.name] = Math.max(...(HULLS[e.img] ?? []).map((q) => h(apply(e.m, q))));
  return out;
}
const lowestBody = (fr) => { const h = heightOn(fr.p, fr.k); let lo = -Infinity; for (const e of fr.L) if (e.m && /^(pelvis|torso|head|leg-|foot-)/.test(e.name)) for (const q of HULLS[e.img] ?? []) lo = Math.max(lo, h(apply(e.m, q))); return lo; };

for (const id of ['mouse-fighter', 'rat-raider', 'rat-spearman', 'rat-archer']) {
  const def = Object.values(FIGHTERS).find((d) => d.art?.rig === id), rig = RIGS[id];
  const base = { def, t: 0, mf: 0, move: null, z: 0, facing: 1, id: 1, stun: 10, x: 0, y: 0 };
  const frames = [];   // [label, fighter, time]
  for (let i = 0; i < 24; i++) frames.push([`idle ${i}`, { state: 'idle' }, i * 0.11], [`walk ${i}`, { state: 'walk', t: i * 2.5 }, 0]);
  for (const st of ['block', 'hurt', 'grabbing', 'toss', 'pickup', 'revive'].filter((s) => s === 'hurt' || def.toss)) for (const t of [0, 3, 8, 20]) frames.push([`${st} ${t}`, { state: st, t, grab: { knee: -1 } }, 0]);
  for (const [key, m] of Object.entries(def.moves)) {
    if (m.air) continue;
    for (let mf = 0; mf < m.windup + m.active + m.recovery; mf += 2) frames.push([`${key} ${mf}`, { state: 'attack', move: m, moveKey: key, mf, t: mf }, 0]);
  }
  for (const [label, o, time] of frames) {
    const f = { ...base, ...o }, mem = {};
    // run the blend in: the frame before at the same state, then this one fully blended
    rigFrame(f, rig, time - 1, mem); const fr = rigFrame(f, rig, time, mem);
    const S = soleHeights(fr);
    for (const [foot, y] of Object.entries(S)) {
      const want = floorLine(rig, foot) - Math.max(0, fr.joints[`${foot}.lift`] ?? 0);
      if (!(Math.abs(y - want) <= 0.5)) { check(false, `${id} ${label}: ${foot} ${(want - y).toFixed(2)} px off its line (lift ${(fr.joints[`${foot}.lift`] ?? 0).toFixed(1)})`); break; }
    }
  }
  // lying: body rests on the floor; falling: never under it
  for (const [state, t, z] of [['down', 0, 0], ['down', 30, 0], ['dead', 5, 0], ['knockdown', 3, 20], ['knockdown', 14, 0], ['getup', 6, 0], ['getup', 20, 0]]) {
    const f = { ...base, state, t, z }, mem = {}, fr = (rigFrame(f, rig, -1, mem), rigFrame(f, rig, 0, mem)), lo = lowestBody(fr);
    if (state === 'down' || state === 'dead') check(Math.abs(lo) <= 0.5, `${id} ${state} t${t}: body rests on the floor (${lo.toFixed(2)})`);
    else check(Number.isFinite(lo) && lo <= z + 0.5, `${id} ${state} t${t} z${z}: body not under the floor (${(lo - z).toFixed(2)})`);
  }
}

// Old case, old result: a pose whose boots are already on their lines comes out of the floor layer unchanged.
{
  const rig = RIGS['mouse-fighter'], j = { ...rig.poses.idle, ...Object.fromEntries(Object.entries(rig.poses.idle).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])) };
  delete j.speed; delete j.swap;
  const out = floorLayer(rig, j, rig.poses.idle.swap);
  check(Object.keys(j).every((k) => Math.abs(out[k] - j[k]) <= 1e-6), 'floor layer: planted master stance unchanged');
}

console.log(failed ? `${failed} failures` : 'ALL OK');
process.exit(failed ? 1 : 0);
