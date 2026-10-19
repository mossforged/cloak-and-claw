// T028 r4 grip alignment test (tools/bench/grip-align.js): for every rigged fighter with the user's grip lines and every
// item the viewer lets it hold, in every frame key of every viewer clip, each hand holding the item holds it on the
// user's line (within 1 px of the hand's grip centre, within 1 degree of the hand's line). One failure per clip and hold.
// Old cases: a rig without the lines has no holds here (its hold tests: weapon-hold.test.mjs).
import { poseFrames } from '../tools/bench/pose-seams.js';
import { gripHolds, gripMisses, ALIGN_PX, ALIGN_DEG } from '../tools/bench/grip-align.js';
import { MODELS, rigOf, itemsFor } from '../src/viewer/models.js';
import { knownT034 } from '../tools/bench/joint-points-known.js';   // T034: holds his joint points break (listed)

let failed = 0, holds = 0;
const check = (c, msg) => { if (!c && knownT034(msg)) console.log('known (T034):', msg); else if (!c) { failed++; console.log('FAIL:', msg); } };
const seen = new Set(), pairs = new Set();
for (const id of MODELS) {
  const rig = rigOf(id);
  if (!rig.gripLines) { check(gripHolds(rig, [], null).length === 0, `${id}: no user lines, no holds`); continue; }
  for (const item of itemsFor(id).filter((i) => i !== 'empty')) {
    for (const fk of poseFrames(id, null, item)) {
      const { L, held } = fk.cell, reached = held?.kit?.art?.reachIn != null && fk.cell.draw >= held.kit.art.reachIn;
      const hs = gripHolds(rig, L, held, { reached, sx: fk.cell.joints.sx ?? 1 });
      holds += hs.length;
      for (const h of hs) pairs.add(`${h.hand} x ${h.item}`);
      for (const h of gripMisses(hs)) {
        const key = `${id} ${item} ${fk.clip} ${h.hand}`;
        if (seen.has(key)) continue;
        seen.add(key);
        check(false, `${id} holding ${item}, ${fk.label}: ${h.hand} off the ${h.item} line ${h.px.toFixed(2)} px${h.deg != null ? `, ${h.deg.toFixed(2)} deg` : ''}`);
      }
    }
  }
}
check(holds > 0, 'holds were measured');
for (const p of ['hand-near-grip x rat-cutlass', 'hand-near-grip-overhand x rat-spear', 'hand-far-grip-overhand x rat-spear', 'hand-far-grip x rat-bow', 'arm-near-cocked x rat-cutlass'])
  check(pairs.has(p), `hold ${p} measured`);
console.log(`grip alignment: ${holds} holds, pairs: ${[...pairs].sort().join(', ')} (bar ${ALIGN_PX} px, ${ALIGN_DEG} deg)`);
console.log(failed ? `${failed} failures` : 'ok');
process.exit(failed ? 1 : 0);
