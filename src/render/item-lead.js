// Item-led holds (T041), pure: on a key that poses the held item itself (`item: { at: [x, y], rot, from }`: its grip point
// rig px from the hips' or chest's point, x forward, and its handle's screen angle, 0 forward, - up; rat v3's own poses,
// data/rigs/rat-v3-poses.js), the item goes there and both arms reach their grip lines on it (the user's lines,
// rig.hands): the fist it hangs from on its grip, the second fist (a two-hander's grip2) on its own line along the shaft,
// each arm solved inside the rig's limits with its wrist's range counted (render/limits.js reachInLimits). If either arm
// can't reach at that place, the item moves the least distance that lets both (data/item-lead.js search); its angle
// stays the key's. Fading: channel 'item.lead' (the key's `itemLead`, 0..1): 0 = the arms as the rest of the frame put
// them, 1 = on the item. Who leads is data per grip type and per move (data/item-lead.js); a hand-led item (one-handers)
// or a key without an item pose is untouched. Run by render/retarget.js after its limbs (unmirrored, sx 1).
import { layoutRig } from './rig-layout.js';
import { limbGeometry, reachInLimits, limbInLimits, pivotOf } from './limits.js';
import { LIMIT_SOLVE as K } from '../data/limit-solve.js';
import { ITEM_LEAD } from '../data/item-lead.js';

const D = Math.PI / 180;
const wrap = (d) => ((((d + 180) % 360) + 360) % 360) - 180;
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const turn = (deg, [x, y], k = 1) => { const c = Math.cos(deg * D) * k, s = Math.sin(deg * D) * k; return [x * c - y * s, x * s + y * c]; };
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const byName = (L) => Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
const sideOf = (bend) => (Math.abs(bend) > K.bent ? Math.sign(bend) : 0);
const limbOf = (hand) => { const s = hand.replace('hand-', ''); return [`arm-${s}-upper`, `arm-${s}-lower`, hand]; };

// The key's item pose on layout B: { G (the grip point, screen px), a (handle angle), w (lead 0..1) }; null = none
export function itemPoseOf(rig, B, j) {
  const w = j['item.lead'] ?? 0;
  if (!(w > 1e-6) || !B.pelvis || !B.torso) return null;
  const c = j['item.chest'] / w, H = pivotOf(rig, B, 'pelvis'), C = rig.sockets?.chest ? apply(B.torso.base, rig.sockets.chest.at) : H;
  return { G: [H[0] + (C[0] - H[0]) * c + j['item.x'] / w, H[1] + (C[1] - H[1]) * c + j['item.y'] / w], a: j['item.rot'] / w, w: Math.min(1, w) };
}

// The hands on the item: [{ limb, at (grip point on the item, item px), line: { at, axis } (part px), turns }]; the first
// is the fist it hangs from (its slot's point and axis), the second a two-hander's grip2 fist (its grip drawing's line,
// either way round along the shaft, `wrist` 'above' first), which may slide back along the shaft toward the first fist
// (as the hand-led grip's second fist: render/wrist.js) by up to search.slide px before the item moves
function handsOn(rig, held) {
  const A = held.kit.art, one = held.part.parent, G = rig.grips?.[held.grip], end = G?.ik?.end, sw = end && G.swap?.[end];
  const out = [{ limb: limbOf(one), pt: A.grip, line: { at: held.part.attach, axis: rig.axes[held.grip] }, turns: [0] }];
  const { slide, slideStep } = ITEM_LEAD.search, slides = Array.from({ length: Math.floor(slide / slideStep) + 1 }, (_, i) => i * slideStep);
  if (G?.ik.to === 'grip2' && A.grip2 && rig.hands?.[sw]) out.push({ limb: limbOf(end), pt: A.grip2, line: rig.hands[sw], turns: [0, 180], slides, wrist: G.wrist });
  return out;
}

// One arm onto (wrist W, hand frame at screen angle th) inside the limits: px off and degrees past the wrist's range
function fit(rig, B, j, limb, W, th) {
  const [up, lo, end] = limb, L = rig.limits ?? {}, g = limbGeometry(rig, B, j, limb);
  const e0 = (j[end] ?? 0) + wrap(th - g.endTurn), r = reachInLimits(g, W, L[up], L[lo], sideOf(g.bend), { e0, lim: L[end], k: K.hold });
  const ew = wrap(e0 - wrap(r.up - g.ju) - wrap(r.lo - g.jl));
  return { err: r.err, over: L[end] ? Math.max(0, L[end][0] - ew, ew - L[end][1]) : 0 };
}

// Where each hand's wrist goes with the item's grip point at G, its handle at a: [{ limb, W, th, t, sl }] per way round
// and slide (least slide first)
function wristsAt(rig, B, held, H, G, a) {
  const A = held.kit.art, k = held.part.scale, hA = Math.atan2(A.gripEnd[1] - A.grip[1], A.gripEnd[0] - A.grip[0]) / D, u = turn(a, [1, 0]);
  return H.map((h) => {
    const s = Math.hypot(B[h.limb[2]].base[0], B[h.limb[2]].base[1]), piv = rig.parts[h.limb[2]].pivot;
    const P0 = add(G, turn(a - hA, [h.pt[0] - A.grip[0], h.pt[1] - A.grip[1]], k * s));
    return (h.slides ?? [0]).flatMap((sl) => h.turns.map((t) => {
      const th = a + t - h.line.axis, P = [P0[0] - sl * u[0], P0[1] - sl * u[1]];
      return { ...h, W: add(P, turn(th, [piv[0] - h.line.at[0], piv[1] - h.line.at[1]], s)), th, P, a: a + t, t, sl };
    }));
  });
}

// The best way to hold the item at G: { ok, miss, hands: [{ limb, W, th }] }. quick: stop at the first hand that can't
// (the search only needs ok; its miss then counts that hand alone)
function holdAt(rig, B, j, held, H, G, a, quick = false) {
  const S = ITEM_LEAD.search;
  let miss = 0, ok = true;
  const hands = wristsAt(rig, B, held, H, G, a).map((ways) => {
    if (quick && !ok) return null;
    let best = null;
    for (const w of ways) {
      if (best?.good && w.sl > best.sl) break;   // the least slide that holds
      const f = fit(rig, B, j, w.limb, w.W, w.th), good = f.err <= S.tol && f.over <= S.tolDeg;
      // the far forearm from the side the grip names (over the shaft) when both ways hold
      const u = [Math.cos(w.a * D), Math.sin(w.a * D)], above = (w.W[0] - w.P[0]) * u[1] - (w.W[1] - w.P[1]) * u[0] > 0 === u[0] >= 0;
      const cost = f.err + f.over + S.slideCost * w.sl + (w.wrist && above !== (w.wrist === 'above') ? 0.01 : 0);
      if (!best || (good && !best.good) || (good === best.good && cost < best.cost)) best = { ...w, good, cost };
    }
    if (!best.good) ok = false;
    miss += best.cost;
    return best;
  });
  return { ok, miss, hands };
}

// Can both hands hold the item at G, angle a? (tools/item-lead-map.mjs maps a key's region)
export const holdsAt = (rig, B, j, held, G, a) => holdAt(rig, B, j, held, handsOn(rig, held), G, a);

// The item's place and its hands' wrists for this frame (null = not item-led): { G, G0, a, w, moved, ok, hands }
export function solveItem(rig, j, B, held) {
  const P = held?.part && rig.hands && itemPoseOf(rig, B, j);
  if (!P) return null;
  const S = ITEM_LEAD.search, H = handsOn(rig, held);
  let best = null, any = null;
  const ring = (r, dirs) => {
    for (let i = 0; i < (r ? dirs : 1); i++) {
      const t = (2 * Math.PI * i) / dirs, G = [P.G[0] + r * Math.cos(t), P.G[1] + r * Math.sin(t)], h = holdAt(rig, B, j, held, H, G, P.a, true);
      if (h.ok && (!best || r < best.moved || h.miss < best.miss)) best = { G, moved: r, miss: h.miss };
      if (!any || h.miss < any.miss) any = { G, moved: r, miss: h.miss };
    }
  };
  // coarse rings out to the first place that holds, then the rings just inside it finely (the least move)
  let r = 0;
  for (; r <= S.max && !best; r += S.step) ring(r, S.dirs);
  if (best?.moved > 0) for (let q = best.moved - S.step + S.fine; q <= best.moved + 1e-9; q += S.fine) ring(q, S.fineDirs);
  const c = best ?? any;
  return { ...holdAt(rig, B, j, held, H, c.G, P.a), G: c.G, moved: +c.moved.toFixed(2), G0: P.G, a: P.a, w: P.w, H };
}

// The held item's grip point and handle angle as drawn on joints j
function itemOn(rig, j, held) {
  const I = byName(layoutRig(rig, j, {}, held))[held.slot], A = held.kit.art, g = apply(I.m, A.grip), e = apply(I.m, A.gripEnd);
  return { G: g, a: Math.atan2(e[1] - g[1], e[0] - g[0]) / D };
}

// joints with both arms on the item (mixed by its lead), or as given
export function itemLeadLayer(rig, joints, B, held) {
  const s = solveItem(rig, joints, B, held);
  if (!s) return joints;
  let out = joints, L = B;
  for (const [i, h0] of s.hands.entries()) {
    // the second fist onto the item where the first fist actually put it (its own miss not added to the second's)
    const I = i && itemOn(rig, out, held), h = i ? wristsAt(rig, L, held, [{ ...h0, turns: [h0.t], slides: [h0.sl] }], I.G, I.a)[0][0] : h0;
    out = limbInLimits(rig, L, out, h.limb, h.W, h.th, undefined, true).joints;
    L = byName(layoutRig(rig, out));
  }
  if (ITEM_LEAD.trace) ITEM_LEAD.trace.push({ ...s, rig, joints, B, held, after: itemOn(rig, out, held) });   // tools/item-lead-map.mjs
  if (s.w >= 1) return out;
  const mixed = { ...joints };
  for (const h of s.hands) for (const p of h.limb) mixed[p] = (joints[p] ?? 0) + wrap((out[p] ?? 0) - (joints[p] ?? 0)) * s.w;
  return mixed;
}
