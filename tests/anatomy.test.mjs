// T026 r5 anatomy rule test (rig standard 5b.1): for every rigged fighter and every frame key of every viewer clip (the
// pose seam test's frames: tools/bench/pose-seams.js poseFrames), each cover pair in src/data/rigs/anatomy.js holds on
// the draw list as drawn. A break fails with the fighter, the frame and the pair named, unless the rig's pair is waived.
import { poseFrames } from '../tools/bench/pose-seams.js';
import { coverPairs, WAIVED } from '../src/data/rigs/anatomy.js';
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
      const t = by[p.top], u = by[p.under];
      if (!t || !u) continue;   // a whole-limb swap hides one of the pair
      if (p.overlay && overlayOrders(rig, p.under).includes(u.order)) continue;
      checked++;
      if (t.order > u.order) continue;
      const key = `${id} | ${p.top} / ${p.under}`;
      if (WAIVED[key]) { used.add(key); continue; }
      if (seen.has(`${key} | ${fk.clip}`)) continue;   // one failure per clip and pair
      seen.add(`${key} | ${fk.clip}`);
      check(false, `${id} ${fk.label}: ${p.joint} broken (${p.rule}): ${p.top} ${t.order} not over ${p.under} ${u.order}`);
    }
  }
}
// the rat itself waives nothing
check(Object.keys(WAIVED).every((k) => k.startsWith('mouse-fighter |')), 'only the mouse (rebuild pending) has waivers');
for (const k of Object.keys(WAIVED)) if (!used.has(k)) console.log(`NOTE waiver no longer needed: ${k}`);
console.log(failed ? `${failed} failures` : `ALL OK (${frames} frame keys, ${checked} cover pairs; ${used.size} mouse waivers in use)`);
process.exit(failed ? 1 : 0);
