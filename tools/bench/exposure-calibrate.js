// T028 r4 calibration of the unfinished-paint measure (tools/bench/exposure.js FLAT_SD; tests/exposure.test.mjs): A023
// round 3's cuts of the pieces whose hidden blocks the r3 strips showed (tools/fixtures/a023-r3/, as T028 r3 imported
// them, with their round 3 pivots) laid into the same frames in place of round 4's repaint (the same canvas point on
// screen: the r3 drawing's matrix = the r4 one moved by the pivot change). Round 3 must flag, round 4 must pass. Pure
// but for readRGBA (the caller's).
import { frameExposure } from './exposure.js';
import { poseFrames } from './pose-seams.js';

const FIX = 'tools/fixtures/a023-r3/';
// piece -> round 3 pivot (own px) and the clips its block showed in (T028 r3 list / the lead's walk frame 2)
export const R3_PIECES = {
  'foot-near': { pivot: [31.6, 69.2], clips: ['walk', 'walkAcross'] },
  'foot-far': { pivot: [33.6, 77.2], clips: ['walk', 'walkAcross'] },
  'hand-far': { pivot: [42.8, 53.2], swap: 'hand-far-open', offset: [8.8, 8.0], clips: ['hurt'] },   // the far wrist (r3 list: hurt)
};
const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
// the rig with the piece's round 3 drawing (its children's points moved with the pivot), for the hidden zones
export function withR3(rig, name, root = '') {
  const p = rig.parts[name], P3 = R3_PIECES[name].pivot, d = [P3[0] - p.pivot[0], P3[1] - p.pivot[1]];
  const sw = R3_PIECES[name].swap, img = root + FIX + (sw ?? name) + '.png';
  const parts = { ...rig.parts, [name]: { ...p, pivot: P3, ...(sw ? { swaps: { ...p.swaps, [sw]: { ...p.swaps[sw], img, offset: R3_PIECES[name].offset } } } : { img, swaps: undefined }) } };
  for (const [c, q] of Object.entries(rig.parts)) if (q.parent === name) parts[c] = { ...q, attach: [q.attach[0] + d[0], q.attach[1] + d[1]] };
  return { ...rig, parts };
}
// per frame of the piece's clips: { label, r4, r3 } unfinished px^2 of that piece (0 = not flagged), r4edged: round 4
// flagged only for a straight cut run beside it (a real cut end left, not unfinished fill)
export function calibrate(name, readRGBA, ref, root = '') {
  const out = [], P = R3_PIECES[name];
  for (const fk of poseFrames(P.id ?? 'rat-raider', P.clips)) {
    const c = fk.cell, e = c.L.find((x) => x.name === name && (x.swap ?? null) === (P.swap ?? null));
    if (!e) continue;
    // the r3 drawing on the same canvas point: its image px = r4's + (r4 pivot - offset) - (r3 pivot - offset)
    const rig3 = withR3(c.rig, name, root), p = c.rig.parts[name], o4 = P.swap ? p.swaps[P.swap].offset : [0, 0], o3 = P.offset ?? [0, 0];
    const d = [p.pivot[0] - o4[0] - P.pivot[0] + o3[0], p.pivot[1] - o4[1] - P.pivot[1] + o3[1]];
    const img3 = P.swap ? rig3.parts[name].swaps[P.swap].img : rig3.parts[name].img;
    const L3 = c.L.map((x) => (x === e ? { ...x, img: img3, m: mul(x.m, [1, 0, 0, 1, d[0], d[1]]), p: rig3.parts[name] } : x));
    const hit = (cell) => frameExposure(cell, readRGBA, { ref }).exposed.find((x) => x.part === name), e4 = hit(c);
    out.push({ label: fk.label, r4: e4?.px2 ?? 0, r4edged: !!e4?.edged && e4.flat < 0.3, r3: hit({ ...c, rig: rig3, L: L3 })?.px2 ?? 0 });
  }
  return out;
}
