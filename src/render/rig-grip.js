// Weapon grips on a rig (T011): a held kit whose grip type has an entry in `rig.grips` (two-hand spear, bow) swaps in
// its hand drawings (T018: the far `hand-far` grip or pinch) and bends one arm with 2-bone IK so its hand lands on a point of the weapon art: `grip2`
// on a spear shaft, or the bow's `nock` pulled back by how far the bow is drawn (the hand reaches it as the draw starts). A bow also gets its drawn string (two
// lines from the tips to the hand) and, while drawing, the shot's arrow nocked on it. Drawing only; pure (tests use it).
// T020: the IK hand can also turn to close round the shaft (`align`), parts can change draw order while gripping
// (`order`), and a bow can be drawn back to a point on the body (`anchor`: the ear) instead of a fixed `pull`.
// T025: the weapon is a node of its own (render/weapon-node.js): when a pose places it or names a grip mode, the grip
// hand is put on it first and the second hand reaches the node's grip markers; otherwise the old hand-led frame.
import { layoutRig, withHeldHand } from './rig-layout.js';
import { phaseOf } from '../sim/fighter.js';
import { at, reach } from './rig-ik.js';
import { modesOf, nodeActive, placeNode } from './weapon-node.js';
import { GRIP_MODES, GRIP_BAND } from '../data/grip-modes.js';

export { at, reach };

const D = Math.PI / 180;
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / D;
const wrap = (d) => ((d + 540) % 360) - 180;
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lin = (m, v) => [m[0] * v[0] + m[2] * v[1], m[1] * v[0] + m[3] * v[1]];
const inv = (m) => { const d = m[0] * m[3] - m[1] * m[2]; return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d]; };

// How far a bow is drawn (0..1): eases back over the shot move's windup, snaps forward on the loose.
export function drawOf(f) {
  if (!f.move?.shot) return 0;
  const [ph, p] = phaseOf(f);
  return ph === 'windup' ? 1 - (1 - p) ** 2 : 0;
}

// T020: the far fist closes round the shaft. Screen angles (degrees) of the held weapon's handle (grip -> gripEnd) and of
// the IK hand's own axis `G.align` (its px). T028 r5: a grip's `along` (a line in the item's px) replaces the handle: the
// bow's string hand lies along the arrow, which runs along the bow's forward axis, not up the bow's handle.
function axesOf(L, held, G, wm) {
  const h = L.find((e) => e.name === G.ik.end).base, w = wm(L), A = held.kit.art, v = G.along ?? [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]];
  return [ang([0, 0], lin(w, v)), ang([0, 0], lin(h, [Math.cos(G.align * D), Math.sin(G.align * D)])), h];
}
// Solved in one go: the fist's axis goes along the shaft (the smaller turn, or the other way round if the arm can't
// reach the wrist spot for that one: the ring holds either way; or as `G.wrist` says: forearm 'above' / 'below' the
// shaft); out of reach, the fist slides along the shaft toward the other hand; the arm is IK'd to put the wrist where the turned
// fist's ring sits on the target, then the fist turns about the wrist onto the shaft line.
function alignGrip(rig, joints, swap, held, G, target, wm, wrist2 = G.wrist) {
  const end = G.ik.end, pivot = rig.parts[end].pivot, wrist = { ...G.ik, hand: pivot };
  let L = layoutRig(rig, joints, swap, held);
  const [shaft, axis] = axesOf(L, held, G, wm), T0 = target(L), P = at(rig, L, end, pivot), R = at(rig, L, end, G.ik.hand);
  let d = wrap(shaft - axis), T = T0;
  if (Math.abs(d) > 90) d = wrap(d + 180);
  const v = [R[0] - P[0], R[1] - P[1]], wristAt = (t) => [T[0] - (Math.cos(t * D) * v[0] - Math.sin(t * D) * v[1]), T[1] - (Math.sin(t * D) * v[0] + Math.cos(t * D) * v[1])];
  const S = at(rig, L, G.ik.arm[0], rig.parts[G.ik.arm[0]].pivot), E = at(rig, L, G.ik.arm[1], rig.parts[G.ik.arm[1]].pivot);
  const len = dist(S, E) + dist(E, P), out = (t) => dist(S, wristAt(t)) - len;
  if (wrist2) { if ((wristAt(d)[1] > T[1]) !== (wrist2 === 'below')) d = wrap(d + 180); }   // the forearm from below / above the shaft
  else if (out(d) > 0 && out(d + 180) < out(d)) d = wrap(d + 180);
  // out of reach: the fist slides back along the shaft (toward the other hand's grip) until the arm reaches
  const back = [Math.cos(shaft * D), Math.sin(shaft * D)];
  for (let k = 1; out(d) > 0 && k <= 80; k++) T = [T0[0] - back[0] * k, T0[1] - back[1] * k];
  // T025: a fist told to come from above (below) that can't reach anywhere along the shaft (the shaft at the shoulder's
  // height) closes from the other side instead of letting go of the shaft
  if (wrist2 && out(d) > 0) {
    const d2 = wrap(d + 180);
    let k = 0;
    for (T = T0; out(d2) > 0 && k < 80; k++) T = [T0[0] - back[0] * k, T0[1] - back[1] * k];
    if (out(d2) <= 0) d = d2;
    else for (k = 1, T = T0; out(d) > 0 && k <= 80; k++) T = [T0[0] - back[0] * k, T0[1] - back[1] * k];
  }
  const goal = axis + d;   // the fist axis' screen angle when done
  let j = joints;
  for (let i = 0; i < 2; i++) j = reach(rig, j, swap, held, wrist, () => wristAt(d));
  let [, axis2, h] = axesOf(layoutRig(rig, j, swap, held), held, G, wm);
  j = { ...j, [end]: j[end] + Math.sign(h[0] * h[3] - h[1] * h[2]) * wrap(goal - axis2) };
  // T028 r4: a body squashed across (the turn-around) turns a joint by less or more on screen than its angle: more
  // passes close the rest (an unsquashed rig is exact after the first, so these change nothing there)
  for (let i = 0; i < 5 && rig.gripLines; i++) {
    [, axis2, h] = axesOf(layoutRig(rig, j, swap, held), held, G, wm);
    j = { ...j, [end]: j[end] + Math.sign(h[0] * h[3] - h[1] * h[2]) * wrap(goal - axis2) };
  }
  return j;
}

// T028 r4: how far (screen px) the second fist's grip centre sits off the shaft line; past LET_GO it lets go
const LET_GO = 1;
function offShaft(rig, L, held, G, wm) {
  const h = L.find((e) => e.name === G.ik.end), A = held.kit.art, w = wm(L);
  if (!h) return 0;
  const P = apply(h.base, ...G.ik.hand), g = apply(w, ...A.grip), u = lin(w, [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]]);
  return Math.abs((P[0] - g[0]) * u[1] - (P[1] - g[1]) * u[0]) / Math.hypot(...u);
}

// How far back (bow image px) full draw pulls the string: to the grip's `anchor` (T020: the ear; the anchor seen along
// the bow's forward axis), else the item's `pull`.
function pullOf(rig, G, A, L, bow) {
  if (!G.anchor) return A.pull;
  return Math.max(0, A.nock[0] - apply(inv(bow), ...at(rig, L, G.anchor.part, G.anchor.at))[0]);
}

// T025 overlay band: grip hands drawn over their weapon (data/grip-modes.js GRIP_BAND); also a whole-arm drawing that
// carries it at its fist (the mouse's cocked arm, whose draw order is still blending up as the swap comes in).
function band(L, slot, hands) {
  const w = slot && L.find((e) => e.name === slot);
  if (!w) return L;
  const grips = (e) => hands.includes(e.name) || e.p?.swaps?.[e.swap]?.carry?.[slot];
  if (!L.some((e) => grips(e) && e.order <= w.order)) return L;
  return L.map((e) => (grips(e) && e.order <= w.order ? { ...e, order: w.order + GRIP_BAND } : e)).sort((a, b) => a.order - b.order);
}

// Layout entries (layoutRig's, plus { order, line: [points] } for a bow string), with the grip applied.
// force (T025, hold sheet and tests): { grip, grip2 } grip modes overriding the pose's.
export function gripLayout(rig, joints, swap, held, f, force) {
  const G0 = held?.part && rig.grips?.[held.grip], modes = modesOf(rig, held, swap, force);
  // T026: a whole-limb drawing (A019 raised / cocked arm) that hides the arm the grip bends: no second-hand IK this frame
  const G = G0 && !Object.entries(swap).some(([p, k]) => rig.parts[p]?.swaps?.[k]?.hide?.some((h) => [...G0.ik.arm, G0.ik.end].includes(h))) ? G0 : null;
  const N = nodeActive(rig, joints, swap, held, modes);
  if (!G && !N) return band(layoutRig(rig, joints, swap, held), held?.part ? held.slot : typeof rig.slots?.['one-hand'] === 'string' && rig.slots['one-hand'], []);
  let sw = { ...withHeldHand(rig, swap, held), ...G?.swap }, j = joints, finish = (L) => L, Wn = null, Nm = N;
  if (N) {   // T025: the weapon node and its grip hand first (a mode's own hand drawing if the rig has one)
    const ms = GRIP_MODES[modes.grip]?.swap, cur = sw[N.hand] ?? N.hand, own = `${cur}-${ms}`;
    if (ms && rig.parts[N.hand].swaps?.[own]) {
      sw = { ...sw, [N.hand]: own };
      // T026: that drawing's own slot point and axis (rig.hands, the importer's grips), when the rig records them
      if (rig.hands?.[own]) Nm = { ...N, at: rig.hands[own].at, axis: rig.hands[own].axis };
    }
    const node = placeNode(rig, j, sw, held, Nm, modes.grip);
    j = node.joints; finish = node.finish; Wn = node.W;
  }
  if (!G) return band(finish(layoutRig(rig, j, sw, held)), N.slot, [N.hand]);
  const A = held.kit.art, k = A.nock ? drawOf(f) : 0, posed = j;
  const weapon = (L) => Wn ?? L.find((x) => x.name === held.slot).m, weaponPt = (L, xy) => apply(weapon(L), ...xy);
  const to = (L) => (A.nock ? [A.nock[0] - pullOf(rig, G, A, L, weapon(L)) * k, A.nock[1]] : A[G.ik.to]);
  for (let i = 0; i < 2; i++) j = reach(rig, j, sw, held, G.ik, (L) => weaponPt(L, to(L)));   // 2nd pass mops up the error
  const wrist2 = modes.grip2 ? GRIP_MODES[modes.grip2]?.wrist : G.wrist;   // T025: the second fist's mode (over / under the shaft)
  if (G.align != null) j = alignGrip(rig, j, sw, held, G, (L) => weaponPt(L, to(L)), weapon, wrist2);
  // T028 r4: on the user's lines a second fist that can't reach the shaft lets go (its own fist, posed) rather than
  // gripping beside it
  if (rig.gripLines && G.ik.to === 'grip2' && offShaft(rig, layoutRig(rig, j, sw, held), held, G, weapon) > LET_GO) {
    sw = { ...withHeldHand(rig, swap, held), ...(N ? { [N.hand]: sw[N.hand] } : {}) };
    delete sw[G.ik.end];
    for (const n of [...G.ik.arm, G.ik.end]) j = { ...j, [n]: posed[n] };
    return band(finish(layoutRig(rig, j, sw, held)), held.slot, [N?.hand]);
  }
  // a bow hand only goes to the string as the draw starts (over the first `A.reachIn` of it); at rest it stays posed
  const w = A.nock ? Math.min(1, k / A.reachIn) : 1;
  if (w < 1) for (const n of G.ik.arm) j[n] = posed[n] + (j[n] - posed[n]) * w;
  const L = band(finish(layoutRig(rig, j, sw, held)).filter((e) => !G.hide?.includes(e.name))
    .map((e) => (G.order?.[e.name] != null ? { ...e, order: G.order[e.name] } : e)), held.slot, [N?.hand, G.ik.to === 'grip2' && G.ik.end]);   // T020: e.g. the far fist over the shaft
  if (!A.tips || k <= 0) return L.sort((a, b) => a.order - b.order);
  const bow = L.find((x) => x.name === held.slot), Nk = weaponPt(L, to(L));
  const out = [...L, { name: 'string', order: G.string ?? bow.order + 0.1, line: [weaponPt(L, A.tips[0]), Nk, weaponPt(L, A.tips[1])] }];
  // arrow (T020: A012's points right): its nock on the string, nock -> tip along the bow's forward axis (the bow image's
  // +x), at its own size, mirrored with the body
  const S = f.move.shot.art, r = S.px / A.px, m = [bow.m[0] * r, bow.m[1] * r, bow.m[2] * r, bow.m[3] * r, 0, 0], [nx, ny] = apply(m, ...S.nock);
  m[4] = Nk[0] - nx; m[5] = Nk[1] - ny;
  out.push({ name: 'arrow', order: G.arrow ?? rig.parts[G.ik.arm[1]].order - 0.5, img: S.img, m });
  return out.sort((a, b) => a.order - b.order);
}
