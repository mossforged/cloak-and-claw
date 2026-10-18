// T030 (A023 round 5): the rat's trouser seat. A pelvis child at band 540 with exactly the pelvis' transform in every
// view and pose (no joint of its own: a thigh turning never moves it), over both thigh tops (anatomy 'seat over thigh
// tops'), its own drawing per pelvis view (Q and BQ seat, S seat-side, F seat-front), hidden in B. The exposure check
// leaves this surface cover out of the hidden-paint zones (the thighs' finished cloth under it is not hidden paint).
import { RIGS } from '../src/data/rigs/index.js';
import { layoutRig } from '../src/render/rig-layout.js';
import { channelsOf } from '../src/render/rig-pose.js';
import { COVERS, SURFACE_COVERS, coverPairs } from '../src/data/rigs/anatomy.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const same = (a, b) => a.every((v, i) => Math.abs(v - b[i]) < 1e-9);
const views = (t, p) => ({ '@view.torso': t, '@view.pelvis': p });

for (const id of ['rat-raider', 'rat-spearman', 'rat-archer']) {
  const rig = RIGS[id], seat = rig.parts.seat;
  check(seat && seat.parent === 'pelvis' && seat.order === 540, `${id}: seat is a pelvis child at band 540`);
  check(same(seat.attach, rig.parts.pelvis.pivot), `${id}: the seat hangs on the pelvis pivot (the A023 canvas point 774, 1460)`);
  check(!/"seat[."]/.test(JSON.stringify(rig.poses)), `${id}: no pose turns the seat (it has no joint of its own)`);
  const thighs = { ...channelsOf(rig), 'leg-near-upper': 40, 'leg-far-upper': -35, pelvis: 12 };
  for (const [t, p, want] of [['Q', 'Q', 'seat'], ['S', 'S', 'seat-side'], ['F', 'F', 'seat-front'], ['BQ', 'Q', 'seat'], ['B', 'B', null]]) {
    for (const j of [channelsOf(rig), thighs]) {
      const L = layoutRig(rig, j, views(t, p)).filter((e) => e.m), by = Object.fromEntries(L.map((e) => [e.name, e]));
      const s = by.seat;
      if (!want) { check(!s, `${id} ${t}: seat hidden in B`); continue; }
      check(s && (s.swap ?? 'seat') === want, `${id} ${t}: seat drawing ${want} (got ${s?.swap ?? s?.name})`);
      if (!s) continue;
      // same transform as the pelvis: the seat's matrix is the pelvis' times a fixed offset, so the linear part matches
      check(same(s.m.slice(0, 4), by.pelvis.m.slice(0, 4)), `${id} ${t}: seat turns exactly with the pelvis`);
      const i = L.indexOf(s);
      for (const th of ['leg-near-upper', 'leg-far-upper']) if (by[th] && by[th].order < 540) check(L.indexOf(by[th]) < i, `${id} ${t}: seat over ${th}`);
    }
  }
  check(coverPairs(rig).some((c) => c.rule === 'seat over thigh tops' && c.under === 'leg-far-upper'), `${id}: anatomy rule seat over the far thigh top`);
}
check(COVERS.filter((c) => c.surface).length === 1 && SURFACE_COVERS.has('seat') && SURFACE_COVERS.size === 1, 'only the seat is a surface cover');
check(!RIGS['mouse-fighter'].parts.seat, 'the mouse has no seat (old case unchanged)');

console.log(failed ? `${failed} failures` : 'seat: all checks passed');
process.exit(failed ? 1 : 0);
