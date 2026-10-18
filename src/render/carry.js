// Carry socket (T028, rehearsal: lifting and throwing): a two-hand object (crate, barrel) or a held hero sits at the
// rig's `carry` socket (halfway between the fists, render/sockets.js) and turns with the line between them, drawn in its
// own band (rig.carry.order: between the torso and the near arm). A pose names the object with `carry: '<prop or item
// id>'` (render/rig-pose.js swapOf -> '@carry'); a held hero is placed by the holder's socket instead (socketOf(f, 'carry')
// + carryTurn). carryMotion = how the socket moved over the last frame (px per frame, world), so a throw can release the
// object along the last key's motion. Pure but for the per-fighter memory.
import { PROPS } from '../data/props/index.js';
import { ITEMS } from '../data/items/index.js';
import { socketPoints } from './sockets.js';
import { layoutRig, mul, rot, tr, sc } from './rig-layout.js';

const D = Math.PI / 180;
const rests = new WeakMap();   // rig -> the fists' line angle in the master (degrees)
const lineOf = (P, s) => { const [a, b] = s.between.map((n) => P[n]); return a && b ? Math.atan2(b[1] - a[1], b[0] - a[0]) / D : null; };

// How far the fists' line has turned from the master's (degrees), or null without a carry socket / a hidden fist.
export function carryTurn(rig, L) {
  const s = rig.sockets?.carry;
  if (!s?.between) return null;
  if (!rests.has(rig)) rests.set(rig, lineOf(socketPoints(rig, layoutRig(rig, {})), s) ?? 0);
  const a = lineOf(socketPoints(rig, L), s);
  return a == null ? null : a - rests.get(rig);
}

// Adds the carried object's drawing to a layout (entries as layoutRig's) when the swap list names one.
export function carryLayer(rig, L, swap) {
  const id = swap?.['@carry'], A = (PROPS[id] ?? ITEMS[id])?.art;
  if (!A || !rig.carry) return L;
  const P = socketPoints(rig, L).carry, a = carryTurn(rig, L);
  if (!P || a == null) return L;
  const [cx, cy] = A.carry ?? A.grip ?? [0, 0];   // the object's own hold point (image px), else its grip / top-left
  const m = mul(mul(mul(tr(...P), rot(a + (rig.carry.turn ?? 0))), sc(A.px)), tr(-cx, -cy));
  return [...L, { name: 'carried', order: rig.carry.order, img: A.img, m, base: m, p: {} }].sort((x, y) => x.order - y.order);
}

// The carry socket's motion over the last frame (world px), kept in render memory: a throw releases along it.
export function carryMotion(mem, world) {
  const last = mem.carryAt;
  mem.carryAt = world;
  return last && world ? [world[0] - last[0], world[1] - last[1]] : [0, 0];
}
