// Weapon feel (T017): a held weapon kit's `feel` (data/items/*.js) adds springy life to its image on the rig. Pure but
// for one bus listener; render memory only (mem = the fighter's rig memory), never touches the fighter.
// wobble: the weapon lags its hand like a floppy thing on a spring: the hand's change of turn (and the body's bob) kicks a
//   damped spring whose angle is added to the slot joint (degrees, clamped to `max`). Settles over a few `period`s.
// squash: each hit the holder lands squashes the weapon along its length (`.sx`) and fattens it (`.sy`), then it
//   stretches back past rest and settles over `time` s. Its clock only runs while his swing moves on, so it holds squashed
//   through the hit-stop freeze and springs back as he comes round.
// bend: the weapon is drawn in `segs` slices from the grip to its far end, each turned a little more (a floppy body):
//   it sags `droop` degrees (end to end) when held level, none when hanging straight, and takes `flop` of the wobble as
//   bend instead of a turn at the hand. Drawn by rig.js from bendStrips (mem.flop = the wobble share in degrees).
import { bus } from '../core/events.js';

const impacts = new WeakMap();   // attacker -> hits landed so far (from 'hit' events)
bus.on('hit', ({ attacker }) => attacker && impacts.set(attacker, (impacts.get(attacker) ?? 0) + 1));

// The slot part's world turn from its parents' joints (the hand's angle), degrees.
export function handAngle(rig, slot, joints) {
  let a = 0;
  for (let p = rig.parts[slot]?.parent; p; p = rig.parts[p].parent) a += joints[p] ?? 0;
  return a;
}

const STEP = 1 / 240;
// One frame of the wobble spring; returns the angle offset. s = mem.wob.
export function stepWobble(W, s, hand, dy, time) {
  const dt = Math.min(0.1, time - s.t);
  if (!(dt > 0)) return s.a;
  const hv = (hand - s.hand) / dt, yv = (dy - s.dy) / dt;
  s.v -= W.gain * (hv - s.hv) + W.bob * (yv - s.yv);   // the hand speeds up -> the floppy end lags behind
  Object.assign(s, { t: time, hand, hv, dy, yv });
  const w = (2 * Math.PI) / W.period, n = Math.ceil(dt / STEP), h = dt / n;
  for (let i = 0; i < n; i++) { s.v += (-w * w * s.a - 2 * W.damping * w * s.v) * h; s.a += s.v * h; }
  if (Math.abs(s.a) > W.max) { s.a = Math.sign(s.a) * W.max; s.v *= -0.3; }
  return s.a;
}

// Squash curve: 1 at the hit, swinging through a stretch (negative) and back to 0 by k = 1.
export const squashCurve = (k) => (k >= 1 || k < 0 ? 0 : (1 - k) ** 2 * Math.cos(3 * Math.PI * k));

export function feelLayer(rig, f, joints, time, mem) {
  const W = f.weapon, F = W && !W.broken && W.def.feel, slot = F && rig.slots?.[W.def.grip];
  if (typeof slot !== 'string') { mem.wob = null; return joints; }
  const out = { ...joints };
  if (F.wobble) {
    const hand = handAngle(rig, slot, joints) * Math.sign(joints.sx ?? 1), dy = joints.dy ?? 0;
    mem.wob ??= { a: 0, v: 0, t: time, hand, hv: 0, dy, yv: 0 };
    const a = stepWobble(F.wobble, mem.wob, hand, dy, time), flop = F.bend?.flop ?? 0;
    out[slot] += a * (1 - flop);
    mem.flop = a * flop;
  }
  if (F.squash) {
    const n = impacts.get(f) ?? 0, dt = Math.max(0, Math.min(0.1, time - (mem.sqT ?? time)));
    if (mem.sqAge !== undefined && (!f.move || f.mf !== mem.sqMf)) mem.sqAge += dt;   // frozen in hit-stop
    if (mem.hits !== undefined && n !== mem.hits) mem.sqAge = 0;
    Object.assign(mem, { hits: n, sqT: time, sqMf: f.mf });
    const S = F.squash, e = mem.sqAge === undefined ? 0 : S.amount * squashCurve(mem.sqAge / S.time);
    out[`${slot}.sx`] *= 1 - e; out[`${slot}.sy`] *= 1 + e * 0.8;
  }
  return out;
}

// Bend in image degrees for a held weapon drawn with image matrix m: gravity sag (nose toward the floor, whatever way
// it points or is mirrored) plus the wobble's flop share.
export function bendOf(B, m, flop = 0) {
  const det = Math.sign(m[0] * m[3] - m[1] * m[2]) || 1, level = Math.cos(Math.atan2(m[1], m[0]));
  return det * B.droop * level + flop;
}

// Slices of an image bent by `deg` degrees in total, from the pivot's x to its right edge (the part behind the grip stays
// stiff): [{ sx, sw, t }] = source x and width of each slice and its matrix in image px (apply after the part's matrix).
export function bendStrips(w, h, pivot, deg, segs) {
  const out = [{ sx: 0, sw: pivot[0] + 1, t: [1, 0, 0, 1, 0, 0] }], step = (deg * Math.PI) / 180 / segs, len = (w - pivot[0]) / segs;
  let t = [1, 0, 0, 1, 0, 0];
  for (let i = 0; i < segs; i++) {
    const x0 = pivot[0] + i * len, c = Math.cos(step), s = Math.sin(step);
    // t = t * (translate(x0, py) * rotate(step) * translate(-x0, -py))
    const r = [c, s, -s, c, x0 - c * x0 + s * pivot[1], pivot[1] - s * x0 - c * pivot[1]];
    t = [t[0] * r[0] + t[2] * r[1], t[1] * r[0] + t[3] * r[1], t[0] * r[2] + t[2] * r[3], t[1] * r[2] + t[3] * r[3],
      t[0] * r[4] + t[2] * r[5] + t[4], t[1] * r[4] + t[3] * r[5] + t[5]];
    out.push({ sx: x0, sw: Math.min(len + 1.5, w - x0), t });   // 1.5 px overlap: no seams between slices
  }
  return out;
}
