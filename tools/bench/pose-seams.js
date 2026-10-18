// Pose seam test (T026 r4): the stretch strip (stretch.js) bends joints to set angles; the user's review found gaps in
// real poses it never tried. This plays every animation button the model viewer has for a fighter (src/viewer/clips.js,
// own item) through the viewer's sandbox (the real sim, rigFrame as drawRig draws it) and measures every frame key at
// every joint with two measures:
//   core: the stretch strip's seam measure (stretch.js flagsOf: a crack inside the joint's filled core round the pivot)
//   band: junction.js jointGap (a see-through sliver in the joint's overlap, open to the outside or off the pivot: the
//         review's crotch, waist and shoulder gaps, which the core measure never saw)
// Frame keys: a frame whose pose differs from every one already measured for this fighter (a joint turned over KEY_DEG,
// a swap, the held item, the standee's turn or scale): holds, slow drifts and clips sharing poses are measured once.
// Pure (no DOM): alphaOf is the caller's (Node: bench/png.mjs).
import { createSlot } from '../../src/viewer/sandbox.js';
import { clipsFor } from '../../src/viewer/clips.js';
import { rigOf } from '../../src/viewer/models.js';
import { rigFrame, rigMemory } from '../../src/render/rig.js';
import { layoutRig } from '../../src/render/rig-layout.js';
import { channelsOf } from '../../src/render/rig-pose.js';
import { flagsOf, covers, outward, SEAM_PX } from './stretch.js';
import { jointGap } from './junction.js';
import { FPS } from '../../src/config.js';

export const KEY_DEG = 4;
export const STRICT = ['idle', 'walk'];   // clips the known list keys one by one (the poses the user judges most)
export { SEAM_PX };
const ITEM = new Set(['sword', 'shield', 'held']);
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const viewOf = (p, k) => { const c = Math.cos(p.rot), s = Math.sin(p.rot); return [p.sx * k * c, p.sx * k * s, -p.sy * k * s, p.sy * k * c, p.dx, p.dy]; };
const sig = (fr, swap) => JSON.stringify([swap, fr.held?.slot ?? null, fr.held?.part?.img ?? null]);
const same = (a, b) => a.sig === b.sig && Math.abs(a.rot - b.rot) <= KEY_DEG * Math.PI / 180 && Math.abs(a.sx - b.sx) <= 0.03
  && Object.keys({ ...a.j, ...b.j }).every((k) => Math.abs((a.j[k] ?? 0) - (b.j[k] ?? 0)) <= (/\.|^d[xy]$/.test(k) ? 1 : KEY_DEG));

// Every frame key of every clip for fighter id (only: those clip keys): [{ clip, label, n, cell }] (cell as stretch.js
// builds them: rig, joints, swap, held, L, view, k).
export function poseFrames(id, only = null) {
  const out = [], keys = [], slot = createSlot(), rig = rigOf(id);
  for (const c of clipsFor(id).filter((c) => !only || only.includes(c.key))) {
    slot.load({ f: id, v: 'current', anim: c.key, item: 'own', grip: '', look: {}, gear: null });
    const sb = slot.seek(0), mem = rigMemory(sb.hero);
    for (let n = 0; n <= slot.len; n++) {
      if (n) slot.step();
      const fr = rigFrame(sb.hero, rig, sb.n / FPS, mem, sb.pose ?? undefined);
      const key = { j: fr.joints, rot: fr.p.rot, sx: fr.p.sx, sig: sig(fr, mem.swap) };
      if (keys.some((k) => same(key, k))) continue;
      keys.push(key);
      out.push({ clip: c.key, label: `${c.label} @${n}`, n,
        cell: { label: `${c.label} @${n}`, rig, joints: fr.joints, swap: { ...mem.swap }, held: fr.held, L: fr.L, view: viewOf(fr.p, fr.k), k: fr.k, p: fr.p } });
    }
  }
  return out;
}

// Seams over 2 px in one frame key: [{ joint: 'parent / child', px, at (screen px, feet at 0,0, as drawn), by: 'core'|'band' }].
export function frameSeams(cell, alphaOf) {
  const out = [], marks = [];
  const core = flagsOf(cell, alphaOf);   // only seam flags: the cells carry no floor / lying / hold checks
  core.forEach((f, i) => { const m = f.match(/^seam (.+): ([\d.]+) px$/); if (m) out.push({ joint: m[1], px: +m[2], at: cell.marks[i], by: 'core' }); });
  const { rig, L } = cell, drawn = L.filter((e) => e.m && !e.line), by = Object.fromEntries(drawn.map((e) => [e.name, e]));
  const rest = Object.fromEntries(layoutRig(rig, { ...channelsOf(rig) }, cell.swap, cell.held).filter((e) => e.m).map((e) => [e.name, e]));
  const carried = new Set(drawn.flatMap((e) => Object.keys(e.p?.swaps?.[e.swap]?.carry ?? {})));
  const cov = (e, P) => covers(alphaOf, e, P);
  for (const e of drawn) {
    const p = rig.parts[e.name]?.parent;
    if (!p || ITEM.has(e.name) || carried.has(e.name) || !by[p] || !rest[p] || !rest[e.name]) continue;
    const J = apply(e.base, rig.parts[e.name].pivot), k = cell.k;
    // the inner crease of a bend is anatomy at an elbow or knee (limb on limb); a hip, shoulder, waist or neck has none
    const g = jointGap(J, by[p], e, rest[p], rest[e.name], drawn, cov, /^(arm|leg)-/.test(p) ? outward(rig, by, e, p, J, alphaOf) : null);
    if (g && g.px * k > SEAM_PX) out.push({ joint: `${p} / ${e.name}`, px: +(g.px * k).toFixed(1), at: apply(cell.view, g.at), by: 'band' });
  }
  for (const s of out) marks.push(s.at);
  cell.marks = marks;
  return out;
}

// Every frame key's seams for fighter id, worst per (clip, joint): [{ clip, joint, px, by, label, cell }].
export function poseSeams(id, alphaOf, only = null) {
  const worst = new Map();
  for (const fk of poseFrames(id, only)) for (const s of frameSeams(fk.cell, alphaOf)) {
    const key = `${fk.clip} | ${s.joint}`, w = worst.get(key);
    if (!w || s.px > w.px) worst.set(key, { clip: fk.clip, joint: s.joint, px: s.px, by: s.by, label: fk.label, cell: fk.cell });
  }
  return [...worst.values()];
}
