// Anatomy cover rules (T026 r5; rig standard 5b.1, study 2026-10-18 "Joint rules from real rigs"): at each joint, which
// piece is drawn on top. Checked by name over every frame key of every viewer clip (tests/anatomy.test.mjs), on the
// draw list as drawn (pose order overrides, grip bands and whole-limb swaps included; a pair with a hidden piece skips).
// `{s}` = near and far. overlay: the standard's exception (section 6): a far hand on a two-handed item draws in the
// grip's overlay band above the shaft (the rig's grips[mode].order), so it is never hidden; the wrist rule skips it.
// T028 r2: knee, waist (the belt cover over both; B hides the belt and skips) and shoulder (`top` may list several pieces:
// the rule holds when any one drawn is over the under piece: the torso's edge, or the shoulder cap where the view brings
// the arm in front). The hand-table check (5b.2): HAND_TABLES below.
export const COVERS = [
  { joint: 'ankle', top: 'leg-{s}-lower', under: 'foot-{s}', rule: 'shin over foot' },
  { joint: 'knee', top: 'leg-{s}-lower', under: 'leg-{s}-upper', rule: 'shin over thigh' },
  { joint: 'elbow', top: 'arm-{s}-lower', under: 'arm-{s}-upper', rule: 'forearm over upper arm' },
  { joint: 'wrist', top: 'arm-{s}-lower', under: 'hand-{s}', rule: 'hand under its forearm or bracer', overlay: true },
  { joint: 'shoulder', top: ['torso', 'shoulder-{s}'], under: 'arm-{s}-upper', rule: 'torso edge or shoulder cap over the upper arm' },
  { joint: 'tail root', top: 'pelvis', under: 'tail', rule: 'pelvis over the tail root' },
  { joint: 'near hip', top: 'torso', under: 'leg-near-upper', rule: 'near thigh under the torso' },
  { joint: 'far hip', top: 'pelvis', under: 'leg-far-upper', rule: 'pelvis over the far thigh' },
  { joint: 'waist (chest)', top: 'belt', under: 'torso', rule: 'belt cover over the torso\'s lower edge' },
  { joint: 'waist (hips)', top: 'belt', under: 'pelvis', rule: 'belt cover over the pelvis top' },
];

// Breaks waived until a rebuild, by 'rig | top / under': the reason. The test fails on any other break and notes a
// waiver no frame needs any more.
const MOUSE = 'mouse: waits for the mouse rebuild (rig lock-down order, after the rat); A013 bands';
export const WAIVED = {
  'mouse-fighter | arm-near-lower / arm-near-upper': MOUSE,
  'mouse-fighter | arm-near-lower / hand-near': MOUSE,
  'mouse-fighter | arm-far-lower / hand-far': MOUSE,
  'mouse-fighter | torso / leg-near-upper': 'mouse: the knee-up thigh is drawn in front of the tunic (T024 grab knee); its rebuild needs a thigh that stays under at the hip',
  'mouse-fighter | torso / arm-near-upper': MOUSE + ' (sword arm brought in front of the tunic: no shoulder cap yet)',
  'mouse-fighter | torso / arm-far-upper': MOUSE + ' (shield arm brought in front of the tunic to block: no shoulder cap yet)',
  'mouse-fighter | leg-near-lower / leg-near-upper': MOUSE + ' (A013 thigh over the shin)',
  'mouse-fighter | leg-far-lower / leg-far-upper': MOUSE + ' (A013 thigh over the shin)',
};

const sided = (n, s) => n.replace('{s}', s);
// The cover pairs of a rig: [{ joint, tops: [names], top (the first), under, rule, overlay }] for the parts it has.
export function coverPairs(rig) {
  const has = (n) => !!rig.parts[n];
  return COVERS.flatMap((c) => ([c.top, c.under].flat().some((n) => n.includes('{s}')) ? ['near', 'far'] : [null]).map((s) => {
    const tops = [c.top].flat().map((n) => sided(n, s)).filter(has);
    return { ...c, joint: s ? `${s} ${c.joint}` : c.joint, tops, top: tops[0], under: sided(c.under, s) };
  })).filter((c) => c.tops.length && has(c.under));
}

// Hand tables (5b.2; docs/design/rigs/rat-raider.md "Anatomy check", the user's pass 2026-10-18): per rig family, every
// drawing a hand may hold an item in, with the face the camera sees. tests/anatomy.test.mjs: every hold in every clip
// frame uses a drawing in its rig's table (a hold with no row fails), and every row's drawing exists on the rig.
const RAT_HANDS = [
  { hold: 'weapon upright in front (guard), at the side, swung in front', hand: 'near', face: 'back', drawing: 'hand-near-grip' },
  { hold: 'overhand on a shaft, reverse dagger', hand: 'near', face: 'back', drawing: 'hand-near-grip-overhand' },
  { hold: 'bow string pinched at the jaw', hand: 'near', face: 'back', drawing: 'hand-near-pinch' },
  { hold: 'cocked behind the head (wind-up)', hand: 'near', face: 'back', drawing: 'arm-near-cocked' },
  { hold: 'raised overhead with the weapon', hand: 'near', face: 'back', drawing: 'arm-near-raised' },
  { hold: 'flask at the lips', hand: 'near', face: 'back', drawing: 'arm-near-mouth' },
  { hold: 'weapon held in front (two-hand, bow at arm\'s length)', hand: 'far', face: 'palm', drawing: 'hand-far-grip' },
  { hold: 'overhand on a shaft', hand: 'far', face: 'palm', drawing: 'hand-far-grip-overhand' },
  { hold: 'shield strap', hand: 'far', face: 'hidden / knuckles', drawing: 'hand-far-shield' },
  { hold: 'shield guard arm', hand: 'far', face: 'knuckles', drawing: 'arm-far-guard' },
  { hold: 'raised back holding the bow', hand: 'far', face: 'palm', drawing: 'arm-far-raised-back' },
  { hold: 'raised', hand: 'far', face: 'palm', drawing: 'arm-far-raised' },
];
export const HAND_TABLES = { 'rat-raider': RAT_HANDS, 'rat-spearman': RAT_HANDS, 'rat-archer': RAT_HANDS };
// drawings that hold a handle (a hand drawing named as a grip, or a whole-arm drawing carrying the held item)
export const GRIP_DRAWING = /-(grip|grip-overhand|pinch|shield)$/;
