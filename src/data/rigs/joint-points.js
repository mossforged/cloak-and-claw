// T034, pure: puts hand-placed joint points (the user's Fitting Room points, e.g. rat-raider-joints.js) on a rig.
// Each listed part gets its `pivot` (own px) and `attach` (parent px): at rest the part's pivot sits on the parent's attach,
// so the limb assembles as he fitted it (joint 0 = that rest). The points are on the base (Q view) drawings; every swap of
// a part shares them through its offset (rig-layout.js). A view that has its own point for a part (the S / F / BQ / B / H
// / LB shoulder and S / F / B hip anchors, the back view's limb cuts) keeps it: its point moves by the same amount as the
// pivot did, so the drawing sits exactly where it did in that view and turns about the new pivot.
// sw = { points, order }: points false = the rig as it was; order = the joints whose draw-order pick (orderPicks) applies.
import { ANCHOR_PARTS } from '../../render/rig-views.js';

const plus = (a, b, c) => [a[0] + b[0] - c[0], a[1] + b[1] - c[1]];

// one view's own points for parts (anchors by joint name, then its `attach` list), moved with their parts' pivots
function shiftView(rig, V, J) {
  const own = {};
  for (const [k, xy] of Object.entries(V.anchors ?? {})) own[ANCHOR_PARTS[k] ?? k] = xy;
  Object.assign(own, V.attach);
  const moved = Object.keys(J).filter((n) => own[n]);
  if (!moved.length) return V;
  return { ...V, attach: { ...V.attach, ...Object.fromEntries(moved.map((n) => [n, plus(own[n], J[n].pivot, rig.parts[n].pivot)])) } };
}

export function withJointPoints(rig, J, sw, orderPicks = () => ({})) {
  if (!sw.points && !sw.order?.length) return rig;
  const parts = { ...rig.parts };
  let bodyViews = rig.bodyViews;
  if (sw.points) {
    for (const [n, j] of Object.entries(J)) parts[n] = { ...parts[n], pivot: j.pivot, attach: j.attach };
    bodyViews = rig.bodyViews && Object.fromEntries(Object.entries(rig.bodyViews).map(([slot, codes]) => [slot,
      Object.fromEntries(Object.entries(codes).map(([code, V]) => [code, code === 'Q' ? V : shiftView(rig, V, J)]))]));
  }
  for (const [n, o] of Object.entries(orderPicks(sw.order ?? []))) parts[n] = { ...parts[n], order: o };
  return { ...rig, parts, bodyViews, jointPoints: sw.points ? J : null };
}
