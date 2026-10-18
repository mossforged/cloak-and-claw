// T026 r5 anatomy rule test (rig standard 5b.1): for every rigged fighter and every frame key of every viewer clip (the
// pose seam test's frames: tools/bench/pose-seams.js poseFrames), each cover pair in src/data/rigs/anatomy.js holds on
// the draw list as drawn. A break fails with the fighter, the frame and the pair named, unless the rig's pair is waived.
import { poseFrames } from '../tools/bench/pose-seams.js';
import { coverPairs, WAIVED, HAND_TABLES, GRIP_DRAWING } from '../src/data/rigs/anatomy.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { MODELS, rigOf } from '../src/viewer/models.js';

let failed = 0, frames = 0, checked = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const used = new Set(), seen = new Set();
const overlayOrders = (rig, part) => Object.values(rig.grips ?? {}).map((g) => g.order?.[part]).filter((o) => o != null);
for (const id of MODELS) {
  const rig = rigOf(id), pairs = coverPairs(rig);
  check(pairs.some((p) => p.joint === 'near ankle'), `${id}: the cover rules find its parts`);
  for (const fk of poseFrames(id)) {
    frames++;
    const by = Object.fromEntries(fk.cell.L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
    for (const p of pairs) {
      const ts = p.tops.map((n) => by[n]).filter(Boolean), u = by[p.under], t = ts[0];
      if (!t || !u) continue;   // a whole-limb swap or a view hides one of the pair
      if (p.overlay && overlayOrders(rig, p.under).includes(u.order)) continue;
      checked++;
      if (ts.some((x) => x.order > u.order)) continue;
      const key = `${id} | ${p.top} / ${p.under}`;
      if (WAIVED[key]) { used.add(key); continue; }
      if (seen.has(`${key} | ${fk.clip}`)) continue;   // one failure per clip and pair
      seen.add(`${key} | ${fk.clip}`);
      check(false, `${id} ${fk.label}: ${p.joint} broken (${p.rule}): ${p.top} ${t.order} not over ${p.under} ${u.order}`);
    }
  }
}
// T028 r2 hand table (5b.2): every hold uses a drawing named in its rig's table for that hand; a hold with no row fails.
// Holds in a frame: the drawing the held item hangs from (a hand's grip drawing, or the whole-arm drawing carrying it) and
// every hand showing a grip drawing (the far hand on a shaft, the bow hand, the pinch). Split grips: the item is never
// drawn over the solid face of its hand (the face over the item, the under piece below it).
let holds = 0;
for (const id of MODELS) {
  const T = HAND_TABLES[FIGHTERS[id]?.art?.rig ?? id] ?? HAND_TABLES[id], rig = rigOf(id);
  if (!T) { console.log(`NOTE ${id}: no hand table (rig standard 5b.2 table comes with its rebuild)`); continue; }
  for (const r of T) check(rig.parts[r.drawing] || Object.values(rig.parts).some((p) => p.swaps?.[r.drawing]), `${id}: hand table drawing ${r.drawing} exists`);
  const seenHold = new Set();
  for (const fk of poseFrames(id)) {
    const L = fk.cell.L.filter((e) => e.m && !e.line), item = fk.cell.held?.part && L.find((e) => e.name === fk.cell.held.slot);
    if (!item) continue;
    const used = [];
    for (const e of L) {
      if (/^hand-(near|far)$/.test(e.name) && GRIP_DRAWING.test(e.swap ?? '')) used.push([e.name.slice(5), e.swap, e]);
      if (e.p?.swaps?.[e.swap]?.carry?.held) used.push([e.name.includes('near') ? 'near' : 'far', e.swap, e]);
    }
    const parent = fk.cell.held.part.parent, pe = L.find((e) => e.name === parent);
    if (pe && !pe.swap) used.push([parent.slice(5), parent, pe]);   // the bare default fist holding the item
    for (const [hand, drawing, e] of used) {
      holds++;
      const key = `${id} | ${hand} | ${drawing}`;
      if (seenHold.has(key)) continue;
      seenHold.add(key);
      check(T.some((r) => r.hand === hand && r.drawing === drawing), `${id} ${fk.label}: ${hand} hand holds in ${drawing}: no row in the hand table`);
      const under = L.find((x) => x.name === `${e.name}:under`);
      if (e.p?.swaps?.[drawing]?.under && e.name === parent) {
        check(e.order > item.order, `${id} ${fk.label}: ${drawing} face drawn over the held item (${e.order} vs ${item.order})`);
        check(under && under.order < item.order, `${id} ${fk.label}: ${drawing} under piece drawn below the held item`);
      }
    }
  }
}
// the rat itself waives nothing
check(Object.keys(WAIVED).every((k) => k.startsWith('mouse-fighter |')), 'only the mouse (rebuild pending) has waivers');
for (const k of Object.keys(WAIVED)) if (!used.has(k)) console.log(`NOTE waiver no longer needed: ${k}`);
console.log(failed ? `${failed} failures` : `ALL OK (${frames} frame keys, ${checked} cover pairs, ${holds} holds; ${used.size} mouse waivers in use)`);
process.exit(failed ? 1 : 0);
