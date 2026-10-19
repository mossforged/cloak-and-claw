// T029 r2: a second carried item on the far hand's strap (A021's round shield), beside whatever the near hand holds.
// f.strap = { def } (the viewer and the rehearsal sheet set it from a rehearsal move's `strap`; a fighter def may name
// art.strap). The rig gets the item as one more part, `shield`, hung on the far hand at its strap drawing's grip line
// (rig.hands['hand-far-shield']) and turned so the item's own line (rig.itemLines: the user's) runs along it, exactly as
// the hold sheet draws it; the far hand always shows the strap drawing (rig.strapHand: it can't let go); a far whole-arm
// drawing (the guard arm) carries it at its own grip line (carry / turn, as the held item); it draws `rides` bands over
// whatever it hangs from (render/rig-layout.js). A rig without a strap hand or a line for the item: no strap. Pure.
import { ITEMS } from '../data/items/index.js';

const D = 180 / Math.PI, RIDES = 10, HAND = 'hand-far-shield';
const angle = (A) => Math.atan2(A.gripEnd[1] - A.grip[1], A.gripEnd[0] - A.grip[0]) * D;
const cache = new WeakMap();

export const strapOf = (f) => f?.strap?.def ?? (f?.def?.art?.strap ? ITEMS[f.def.art.strap] : null);

// The rig with the strapped item as a part (memoized per rig and item); the rig itself when there is none to strap.
export function strapRig(rig, item) {
  const H = rig.hands?.[HAND], A = item && (rig.itemLines?.[item.id] ?? item.art);
  if (!item || !H || !A?.gripEnd) return rig;
  const per = cache.get(rig) ?? cache.set(rig, new Map()).get(rig);
  if (per.has(item.id)) return per.get(item.id);
  const parts = { ...rig.parts, shield: { img: item.art.img, parent: H.part, attach: H.at, pivot: A.grip, rest: H.axis - angle(A), scale: item.art.px / rig.scale,
    order: rig.parts[H.part].order + RIDES, rides: RIDES, strap: item.id } };
  for (const [name, p] of Object.entries(rig.parts)) {   // far whole-arm keys carry it at their own line
    const sw = Object.entries(p.swaps ?? {}).filter(([, s]) => s.carryHand === H.part);
    if (sw.length) parts[name] = { ...p, swaps: { ...p.swaps, ...Object.fromEntries(sw.map(([k, s]) => [k, { ...s, carry: { ...s.carry, shield: s.grip }, turn: { ...s.turn, shield: s.axis - H.axis } }])) } };
  }
  const out = { ...rig, parts, strapHand: { [H.part]: HAND } };
  per.set(item.id, out);
  return out;
}

// After the grip bands (render/rig-grip.js lifts a whole-arm drawing over the held item): a riding part goes back over
// whatever carries it. L: layout entries in draw order.
export function rideLayer(L) {
  if (!L.some((e) => e.p?.rides != null)) return L;
  const at = Object.fromEntries(L.map((e) => [e.name, e.order]));
  return L.map((e) => (e.p?.rides != null && at[e.p.parent] != null ? { ...e, order: Math.max(e.order, at[e.p.parent] + e.p.rides) } : e)).sort((a, b) => a.order - b.order);
}
