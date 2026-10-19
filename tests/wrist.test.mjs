// T029 r3 wrist test (no known list): every hand, every frame of every viewer clip and every rehearsal key, of every
// rigged fighter: the hand turned at most its limit (data/wrists.js) from its drawing's natural angle on the forearm, and
// its pivot on the forearm's wrist point (0.5 px). A failure names the fighter, clip, frame, hand and angle. Also: no
// whole-arm drawing holds a two-handed item beside its fist (the raised far arm only if the shaft goes through it); the
// wrist pass leaves an in-limit layout exactly as it was and turns a hand past the limit back inside it, item and all.
import { wristFrames } from '../tools/bench/wrist.js';
import { MODELS } from '../src/viewer/models.js';
import { wristLimit, WRISTS, inside } from '../src/data/wrists.js';
import { limitWrists, turnOf } from '../src/render/wrist.js';
import { RIGS } from '../src/data/rigs/index.js';
import { layoutRig, apply } from '../src/render/rig-layout.js';
import { channelsOf } from '../src/render/rig-pose.js';

let failed = 0, hands = 0, frames = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const seen = new Set();
for (const id of MODELS) {
  for (const f of wristFrames(id)) {
    frames++;
    for (const w of f.w) {
      hands++;
      const lim = wristLimit(f.rig, w.hand, w.swap ?? `hand-${w.hand}`), key = `${id} ${f.clip} ${w.hand}`;
      if (seen.has(key)) continue;   // the first failing frame per clip and hand
      const ok = inside(w.bend, lim, 0.5) && w.off <= 0.5;   // T034: a limit may be [lo, hi] (the rat's near wrist)
      if (!ok) seen.add(key);
      check(ok, `${id} ${f.label}: ${w.hand} hand ${w.swap ?? '(own drawing)'} turned ${w.bend.toFixed(1)} deg on the forearm (limit ${lim}), wrist point ${w.off.toFixed(2)} px off`);
    }
    // a whole-arm drawing carrying no item while the item is two-handed: its fist must lie on the shaft
    const H = f.held, item = H?.part && f.L.find((e) => e.name === H.slot), A = H?.kit?.art;
    if (!item || H.kit.grip !== 'two-hand' || !A?.gripEnd) continue;
    for (const e of f.L) {
      const s = e.p?.swaps?.[e.swap];
      if (!s?.grip || !s.hide?.some((n) => /^hand-/.test(n)) || s.carry?.[H.slot] && e.name === H.part.parent) continue;
      if (e.name === H.part.parent) continue;   // the arm holding the item itself
      const P = apply(e.m, ...s.grip), g = apply(item.m, ...A.grip), q = apply(item.m, ...A.gripEnd), u = [q[0] - g[0], q[1] - g[1]];
      const off = Math.abs((P[0] - g[0]) * u[1] - (P[1] - g[1]) * u[0]) / Math.hypot(...u), k = `${id} ${f.clip} ${e.swap}`;
      if (off > 2 && !seen.has(k)) { seen.add(k); check(false, `${id} ${f.label}: ${e.swap}'s fist ${off.toFixed(1)} px off the ${H.kit.id} (an empty raised fist beside the held item)`); }
    }
  }
}
console.log(`wrists: ${hands} hands in ${frames} frames of ${MODELS.length} fighters`);

// the pass: an in-limit layout comes back exactly; a hand turned past the limit comes back inside it, on its wrist
{
  const rat = RIGS['rat-raider'], j = channelsOf(rat), L = layoutRig(rat, j, {});
  check(limitWrists(rat, L) === L, 'wrist pass: a layout with every wrist inside its limit is returned as is');
  const L2 = layoutRig(rat, { ...j, 'hand-near': 120, 'hand-far': -100 }, {}), out = limitWrists(rat, L2);
  for (const h of ['hand-near', 'hand-far']) {
    const H = out.find((e) => e.name === h), F = out.find((e) => e.name === H.p.parent), t = turnOf(rat, F, H);
    const P = apply(H.base, ...H.p.pivot), W = apply(F.base, ...H.p.attach);
    check(inside(t, wristLimit(rat, h.slice(5), H.swap ?? h), 0.01) && Math.hypot(P[0] - W[0], P[1] - W[1]) < 1e-6, `wrist pass: ${h} turned past the limit comes back to it on its wrist (${t.toFixed(1)})`);
  }
  WRISTS.on = false;
  check(limitWrists(rat, L2) === L2, 'wrist pass off (WRISTS.on false): the layout as is');
  WRISTS.on = true;
}
console.log(failed ? `${failed} failures` : 'all wrist checks passed');
process.exit(failed ? 1 : 0);
