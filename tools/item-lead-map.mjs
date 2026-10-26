// T041: where an item-led key (render/item-lead.js) can hold its item: for a key of rat v3's spearman, and a list of shaft
// angles, the grip points (rig px from the hips' point, as the key's `item.at`) where both fists reach their grip lines
// inside v3's limits. Prints per angle: how many grid points hold, their box, the most forward, highest and lowest, and an
// ASCII map (# = holds, + = the key's own place, o = where the solve put it). For writing the keys in rat-v3-poses.js.
// --free=<part,part>: the same with those joints' limits lifted (which joint stops a key).
// Usage: node tools/item-lead-map.mjs <clip> <key> [angles, e.g. -30,-10,0] [--map] [--free=arm-near-upper]
import { keyFrame } from './v3-own-check.mjs';
import { V3_SPEARMAN } from '../src/data/rigs/rat-v3.js';
import { ITEM_LEAD } from '../src/data/item-lead.js';
import { holdsAt } from '../src/render/item-lead.js';
import { pivotOf } from '../src/render/limits.js';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--')), flag = process.argv.includes('--map') ? '--map' : null;
const free = (process.argv.find((a) => a.startsWith('--free=')) ?? '--free=').slice(7).split(',').filter(Boolean);
const [clip = 'idle', key = '0', angs] = args;
ITEM_LEAD.trace = [];
keyFrame('rat-spearman', clip, isNaN(+key) ? key : +key, V3_SPEARMAN);
const s = ITEM_LEAD.trace.at(-1);
ITEM_LEAD.trace = null;
if (!s) { console.log('no item-led solve on that key'); process.exit(1); }
const { joints, B, held } = s, rig = free.length ? { ...s.rig, limits: { ...s.rig.limits, ...Object.fromEntries(free.map((p) => [p, [-180, 180]])) } } : s.rig, H = pivotOf(rig, B, 'pelvis'), rel = (P) => [P[0] - H[0], P[1] - H[1]].map((v) => +v.toFixed(1));
console.log(`${clip} ${key}: asked ${rel(s.G0)} at ${s.a.toFixed(1)} deg; solved ${rel(s.G)} (moved ${s.moved} px, ${s.ok ? 'both hold' : 'misses ' + s.miss.toFixed(1)})`);
// at the asked place: each fist's miss (px off its grip + degrees past its wrist range), so the note can say which stops it
const why = holdsAt(rig, B, joints, held, s.G0, s.a).hands.map((h) => `${h.limb[2]} ${h.good ? 'holds' : `misses ${h.cost.toFixed(1)}`}`).join(', ');
console.log(`  at the asked place: ${why}`);
const X = [-90, 40], Y = [-110, 30], st = 2;
for (const a of (angs ?? `${s.a}`).split(',').map(Number)) {
  const ok = [], rows = [];
  for (let y = Y[0]; y <= Y[1]; y += st) {
    let row = '';
    for (let x = X[0]; x <= X[1]; x += st) {
      const h = holdsAt(rig, B, joints, held, [H[0] + x, H[1] + y], a).ok, near = (P) => Math.abs(rel(P)[0] - x) < st / 2 + 0.01 && Math.abs(rel(P)[1] - y) < st / 2 + 0.01;
      if (h) ok.push([x, y]);
      row += near(s.G0) ? '+' : near(s.G) ? 'o' : x === 0 && y === 0 ? 'H' : h ? '#' : '.';
    }
    rows.push(`${String(y).padStart(5)} ${row}`);
  }
  if (!ok.length) { console.log(`  ${a} deg: nowhere`); continue; }
  const by = (f) => ok.reduce((p, q) => (f(q) < f(p) ? q : p));
  console.log(`  ${a} deg: ${ok.length} points, x ${Math.min(...ok.map((p) => p[0]))}..${Math.max(...ok.map((p) => p[0]))}, y ${Math.min(...ok.map((p) => p[1]))}..${Math.max(...ok.map((p) => p[1]))}; forward ${by((p) => -p[0])}, highest ${by((p) => p[1])}, lowest ${by((p) => -p[1])}`);
  if (flag === '--map') console.log(rows.join('\n'));
}
