// Test helper (T023): where a rig's boots touch down. Feet are separate parts on the rig standard and a swap (the
// turned-out near boot) has its own drawing, so a foot's sole is the bottom middle of whichever image the layout draws,
// measured from where that same point sits in the master pose (the master stands flat on the floor line, y = 0).
import { readFileSync } from 'node:fs';
import { layoutRig } from '../src/render/rig.js';

const size = (img) => { const b = readFileSync(img); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const FEET = ['foot-near', 'foot-far'];
const point = (L, n) => { const e = L.find((x) => x.name === n), [w, h] = size(e.img), m = e.m; return [m[0] * (w / 2) + m[2] * (h - 3) + m[4], m[1] * (w / 2) + m[3] * (h - 3) + m[5]]; };
const ankle = (rig, L, n) => { const m = L.find((x) => x.name === n).base, [x, y] = rig.parts[n].pivot; return m[0] * x + m[2] * y + m[4]; };
// { 'foot-near': [x, y], 'foot-far': [x, y] }: x = the ankle (same point whichever boot drawing shows), y = the sole's
// height off the floor line (- = above).
export function solePoints(rig, joints, swap = {}) {
  const L = layoutRig(rig, joints, swap), M = layoutRig(rig, {}, swap);
  return Object.fromEntries(FEET.map((n) => [n, [ankle(rig, L, n), point(L, n)[1] - point(M, n)[1]]]));
}
export const soles = (rig, joints, swap) => Object.fromEntries(Object.entries(solePoints(rig, joints, swap)).map(([n, p]) => [n, p[1]]));
