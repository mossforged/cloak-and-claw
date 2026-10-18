// Anatomy cover rules (T026 r5; rig standard 5b.1, study 2026-10-18 "Joint rules from real rigs"): at each joint, which
// piece is drawn on top. Checked by name over every frame key of every viewer clip (tests/anatomy.test.mjs), on the
// draw list as drawn (pose order overrides, grip bands and whole-limb swaps included; a pair with a hidden piece skips).
// `{s}` = near and far. overlay: the standard's exception (section 6): a far hand on a two-handed item draws in the
// grip's overlay band above the shaft (the rig's grips[mode].order), so it is never hidden; the wrist rule skips it.
// The hand-table check (each hold uses its named drawing) comes with T029, when the split grips exist.
export const COVERS = [
  { joint: 'ankle', top: 'leg-{s}-lower', under: 'foot-{s}', rule: 'shin over foot' },
  { joint: 'elbow', top: 'arm-{s}-lower', under: 'arm-{s}-upper', rule: 'forearm over upper arm' },
  { joint: 'wrist', top: 'arm-{s}-lower', under: 'hand-{s}', rule: 'hand under its forearm or bracer', overlay: true },
  { joint: 'tail root', top: 'pelvis', under: 'tail', rule: 'pelvis over the tail root' },
  { joint: 'near hip', top: 'torso', under: 'leg-near-upper', rule: 'near thigh under the torso' },
  { joint: 'far hip', top: 'pelvis', under: 'leg-far-upper', rule: 'pelvis over the far thigh' },
];

// Breaks waived until a rebuild, by 'rig | top / under': the reason. The test fails on any other break and notes a
// waiver no frame needs any more.
const MOUSE = 'mouse: waits for the mouse rebuild (rig lock-down order, after the rat); A013 bands';
export const WAIVED = {
  'mouse-fighter | arm-near-lower / arm-near-upper': MOUSE,
  'mouse-fighter | arm-near-lower / hand-near': MOUSE,
  'mouse-fighter | arm-far-lower / hand-far': MOUSE,
  'mouse-fighter | torso / leg-near-upper': 'mouse: the knee-up thigh is drawn in front of the tunic (T024 grab knee); its rebuild needs a thigh that stays under at the hip',
};

// The cover pairs of a rig: [{ joint, top, under, rule, overlay }] for the parts it has.
export function coverPairs(rig) {
  const has = (n) => !!rig.parts[n];
  return COVERS.flatMap((c) => (c.top.includes('{s}') ? ['near', 'far'] : [null]).map((s) => ({
    ...c, joint: s ? `${s} ${c.joint}` : c.joint, top: c.top.replace('{s}', s), under: c.under.replace('{s}', s) })))
    .filter((c) => has(c.top) && has(c.under));
}
