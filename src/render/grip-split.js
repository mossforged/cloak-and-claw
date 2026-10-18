// Split grips (T028 r2; rig standard 5b.2): a grip drawing with an `under` piece (A023: the fingers or thumb that wrap
// behind the handle) draws as [under, held item, face]: the under piece shares the hand's transform (same pivot, same
// matrix as the face) and goes just under the held item (or just under the hand when it holds nothing), so the handle
// passes between the two and never over the solid back of the hand. Runs on the final draw list (after grips, the weapon
// node and gear moved the hands). A rig without `under` pieces gets its list back unchanged. Pure.
import { mul, swapMatrix } from './rig-layout.js';

export const UNDER = ':under';

export function splitGrips(L, held) {
  const item = held?.part ? L.find((e) => e.name === held.slot && e.m) : null, add = [];
  for (const e of L) {
    const s = e.swap && e.p?.swaps?.[e.swap], u = s?.under && e.p.swaps[s.under];
    if (!u || !e.base) continue;
    const order = Math.min(item ? item.order : e.order, e.order) - 1;
    add.push({ name: e.name + UNDER, of: e.name, p: e.p, order, img: u.img, swap: s.under, m: mul(e.base, swapMatrix(u)), base: e.base });
  }
  return add.length ? [...L, ...add].sort((a, b) => a.order - b.order) : L;
}
