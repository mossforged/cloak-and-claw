// Wrist measure (T029 r3): for each hand a layout draws, how far it is turned from its drawn rest angle on its
// forearm (the hand's own frame against the forearm's, in the forearm's px: a mirrored or squashed body measures the
// same as an upright one) and how far its pivot sits off the forearm's wrist point (screen px). A hand a whole-arm
// drawing carries (the raised arm's fist) rides that drawing: measured against it. wrists() is pure; wristFrames()
// plays every viewer clip (Node, no DOM).
import { createSlot } from '../../src/viewer/sandbox.js';
import { clipsFor } from '../../src/viewer/clips.js';
import { rigOf } from '../../src/viewer/models.js';
import { rigFrame, rigMemory } from '../../src/render/rig.js';
import { FPS } from '../../src/config.js';
import { rehearsalFrames } from './pose-seams.js';
import { bendOf, turnOf, HANDS } from '../../src/render/wrist.js';

const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
export { bendOf, HANDS };

// [{ hand, forearm, swap, bend (deg from its drawing's neutral, data/wrists.js), raw (deg from as drawn), off (px) }]
// for each hand in layout L
export function wrists(L, rig) {
  const by = Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
  const out = [];
  for (const H of Object.values(by)) {
    if (!HANDS.test(H.name) || !by[H.p.parent]) continue;
    const F = by[H.p.parent], P = apply(H.base, ...H.p.pivot), W = apply(F.base, ...H.p.attach);
    out.push({ hand: H.name.slice(5), forearm: F.name, swap: H.swap, bend: turnOf(rig, F, H), raw: bendOf(F, H), off: Math.hypot(P[0] - W[0], P[1] - W[1]) });
  }
  return out;
}

// Every frame of every viewer clip (no dedup) and every rehearsal key of fighter id: [{ clip, n, label, w: wrists(L), L, held, rig }]
export function wristFrames(id, only = null) {
  const out = [], slot = createSlot(), rig = rigOf(id);
  for (const c of clipsFor(id).filter((c) => !only || only.includes(c.key))) {
    slot.load({ f: id, v: 'current', anim: c.key, item: 'own', grip: '', look: {}, gear: null });
    const sb = slot.seek(0), mem = rigMemory(sb.hero);
    for (let n = 0; n <= slot.len; n++) {
      if (n) slot.step();
      const fr = rigFrame(sb.hero, rig, sb.n / FPS, mem, sb.pose ?? undefined);
      out.push({ clip: c.key, n, label: `${c.label} @${n}`, w: wrists(fr.L, rig), L: fr.L, held: fr.held, rig });
    }
  }
  if (!only) for (const r of rehearsalFrames(id)) if (r.clip === 'rehearsal') out.push({ clip: 'rehearsal', n: 0, label: `rehearsal ${r.label}`, w: wrists(r.cell.L, r.cell.rig), L: r.cell.L, held: r.cell.held, rig: r.cell.rig });
  return out;
}
