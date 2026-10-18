// Stretch test cells per body view (T028, split out of bench/stretch.js): each view in rig.bodyViews
// (render/rig-views.js) with its own joint points and draw order: the stance, each elbow (torso views) or knee (pelvis
// views) at 90 and 150 degrees, and each held item of the family in it with the hold flags (its rig's default grip mode).
// h = stretch.js's helpers { still, custom, flexed, heldFor }. Pure.
export function viewCells(rig, family, S, h) {
  for (const [slot, V] of Object.entries(rig.bodyViews ?? {})) for (const code of Object.keys(V)) {
    if (code === 'Q' || !(V[code].swap || V[code].anchors || V[code].bands)) continue;   // a stand-in that draws as Q
    const sw = { [`@view.${slot}`]: code }, tag = `view ${slot} ${code}`, lo = slot === 'torso' ? 'arm' : 'leg';
    h.custom(tag, S, sw);
    for (const side of ['near', 'far']) for (const deg of [90, 150]) {
      const n = `${lo}-${side}-lower`;
      if (rig.parts[n]) h.custom(`${tag}: ${side} ${lo === 'arm' ? 'elbow' : 'knee'} ${deg}`, { ...S, [n]: S[n] + h.flexed(n, deg, lo === 'leg') }, sw);
    }
    if (slot !== 'torso') continue;
    for (const [r, d] of family) {
      const own = d.kit ?? d.art?.held, held = own && h.heldFor(r, d);
      if (held) h.custom(`${tag}: ${d.name ?? d.id} ${own}`, h.still(r), sw, { rig: r, def: d, held, grip: r.holds?.[own]?.grip ?? 'side', flags: { twoHand: held.grip === 'two-hand' } });
    }
  }
}
