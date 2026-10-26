// Who leads a held item (T041; research: docs/design/rigs/research-cutout-rigging.md items 1, 2). Render only.
// 'hand': the item hangs on the fist holding it and goes where the hand goes (one-handers: cutlass, dagger, axe, club;
//   the behaviour before T041). 'item': a key poses the item itself (its grip point and its angle) and both arms reach
//   their grip lines on it inside the rig's limits (render/item-lead.js; spear, staff, bow). Only keys that pose the item
//   (`item: { at, rot, from }`, rat v3's own poses) use it; every other key is hand-led as before.
// types: per grip type (the item's `grip`: data/items). moves: per move key, overriding the type (none yet).
// search: when an arm can't reach its grip at the key's place, the item moves the least distance that lets both reach:
//   rings of `step` px out to `max` px, `dirs` directions on each, then the rings inside the first that holds every `fine`
//   px, `fineDirs` directions; a hand counts as on its grip within `tol` px and its
//   wrist inside its range within `tolDeg` degrees. Past `max`, the place that misses least. Before the item moves, the
//   second fist may slide back along the shaft toward the first by up to `slide` px (`slideStep` px steps, `slideCost` per
//   px: the least slide wins), as the hand-led grip's second fist does (data/wrists.js slide2). trace: tools only.
export const ITEM_LEAD = {
  types: { 'one-hand': 'hand', 'two-hand': 'item', bow: 'item' },
  moves: {},
  search: { step: 2, max: 40, dirs: 16, fine: 0.5, fineDirs: 48, tol: 0.5, tolDeg: 0.5, slide: 16, slideStep: 1, slideCost: 0.05 },
  trace: null,   // tools: an array to collect each solve in
};

export const leadOf = (grip, moveKey) => ITEM_LEAD.moves[moveKey] ?? ITEM_LEAD.types[grip] ?? 'hand';
