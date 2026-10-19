// Anatomy cover rules (T026 r5; rig standard 5b.1, study 2026-10-18 "Joint rules from real rigs"): at each joint, which
// piece is drawn on top. Checked by name over every frame key of every viewer clip (tests/anatomy.test.mjs), on the
// draw list as drawn (pose order overrides, grip bands and whole-limb swaps included; a pair with a hidden piece skips).
// `{s}` = near and far. overlay: the standard's exception (section 6): a far hand on a two-handed item draws in the
// grip's overlay band above the shaft (the rig's grips[mode].order), so it is never hidden; the wrist rule skips it.
// T028 r2: knee, waist (the belt cover over both; B hides the belt and skips) and shoulder (`top` may list several pieces:
// the rule holds when any one drawn is over the under piece: the torso's edge, or the shoulder cap where the view brings
// the arm in front). The hand-table check (5b.2): HAND_TABLES below.
// T028 r3 (user, 2026-10-18): a rule with `side` holds only in those views: 'front' = three-quarter, side and front
// (and H / LB), 'back' = the chest turned away or back (BQ, B) or the back hips (B): from behind the tail lies over the seat.
// by: 'pelvis' = judged by the hip view alone (the hip rules: BQ keeps the three-quarter hips and their legs' depth).
export const BACK_VIEWS = ['BQ', 'B'];
export const sideOf = (swap, by) => ((by !== 'pelvis' && BACK_VIEWS.includes(swap?.['@view.torso'])) || BACK_VIEWS.includes(swap?.['@view.pelvis']) ? 'back' : 'front');
export const COVERS = [
  { joint: 'ankle', top: 'leg-{s}-lower', under: 'foot-{s}', rule: 'shin over foot' },
  { joint: 'knee', top: 'leg-{s}-lower', under: 'leg-{s}-upper', rule: 'shin over thigh' },
  { joint: 'elbow', top: 'arm-{s}-lower', under: 'arm-{s}-upper', rule: 'forearm over upper arm' },
  { joint: 'wrist', top: 'arm-{s}-lower', under: 'hand-{s}', rule: 'hand under its forearm or bracer', overlay: true },
  { joint: 'shoulder', top: ['torso', 'shoulder-{s}'], under: 'arm-{s}-upper', rule: 'torso edge or shoulder cap over the upper arm' },
  { joint: 'tail root', top: 'pelvis', under: 'tail', rule: 'pelvis over the tail root', side: 'front' },
  { joint: 'tail root', top: 'tail', under: 'pelvis', rule: 'tail over pelvis (seen from behind)', side: 'back' },
  { joint: 'near hip', top: 'torso', under: 'leg-near-upper', rule: 'near thigh under the torso', side: 'front', by: 'pelvis' },
  { joint: 'far hip', top: 'pelvis', under: 'leg-far-upper', rule: 'pelvis over the far thigh', side: 'front', by: 'pelvis' },
  // from behind the legs trade depth (B: the far leg is nearest): the mirrored pair
  { joint: 'near hip', top: 'pelvis', under: 'leg-near-upper', rule: 'pelvis over the near thigh (seen from behind)', side: 'back', by: 'pelvis' },
  { joint: 'far hip', top: 'torso', under: 'leg-far-upper', rule: 'far thigh under the torso (seen from behind)', side: 'back', by: 'pelvis' },
  // T030 (A023 r5): the trouser seat, locked to the pelvis, lies over both thigh tops at the crotch (Q, S, F, BQ: the
  // three-quarter hips; B hides it, the back pelvis has its own seat). surface: it lies over the thighs' finished cloth
  // (shown before it came), so the hidden-paint zones are measured without it (tools/bench/exposure.js); in a frame it
  // still covers whatever it is drawn over.
  { joint: 'crotch', top: 'seat', under: 'leg-{s}-upper', rule: 'seat over thigh tops', side: 'front', by: 'pelvis', surface: true },
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
// T029: each row's `holds` names the holds that must use its drawing: `grip` (the item's grip type: one-hand, two-hand,
// bow), `role` ('item' = the hand the item hangs from, 'second' = a two-hander's other fist or the bow's string hand),
// `mode` (grip mode, data/grip-modes.js; default any); `carry` rows are whole-arm drawings, any of which may carry the
// item its hand holds. `holdDrawings(T, hold)` = the drawings a hold may use (tests/anatomy.test.mjs: any other fails).
const ONE = ['one-hand', 'two-hand'];
const RAT_HANDS = [
  { hold: 'weapon upright in front (guard), at the side, swung in front', hand: 'near', face: 'back', drawing: 'hand-near-grip', holds: [{ grip: ONE, role: 'item', mode: 'side' }] },
  { hold: 'overhand on a shaft, reverse dagger', hand: 'near', face: 'back', drawing: 'hand-near-grip-overhand', holds: [{ grip: ONE, role: 'item', mode: 'overhand' }] },
  { hold: 'bow string pinched at the jaw', hand: 'near', face: 'back', drawing: 'hand-near-pinch', holds: [{ grip: ['bow'], role: 'second' }] },
  { hold: 'cocked behind the head (wind-up)', hand: 'near', face: 'back', drawing: 'arm-near-cocked', carry: true },
  { hold: 'raised overhead with the weapon', hand: 'near', face: 'back', drawing: 'arm-near-raised', carry: true },
  { hold: 'flask at the lips', hand: 'near', face: 'back', drawing: 'arm-near-mouth', carry: true },
  // T029: A023's smear arms carry the weapon on the strike frame (the user's grip lines include them); face as the grip
  { hold: 'swung in a horizontal smear (strike frame)', hand: 'near', face: 'back', drawing: 'arm-near-smear-h', carry: true },
  { hold: 'swung in an overhead smear (strike frame)', hand: 'near', face: 'back', drawing: 'arm-near-smear-o', carry: true },
  { hold: 'weapon held in front (two-hand, bow at arm\'s length)', hand: 'far', face: 'palm', drawing: 'hand-far-grip', holds: [{ grip: ['bow'], role: 'item' }] },
  { hold: 'overhand on a shaft', hand: 'far', face: 'palm', drawing: 'hand-far-grip-overhand', holds: [{ grip: ['two-hand'], role: 'second' }] },
  { hold: 'shield strap', hand: 'far', face: 'hidden / knuckles', drawing: 'hand-far-shield', holds: [{ grip: ['shield'], role: 'strap' }] },   // T029 r2: A021's round shield (render/strap.js)
  { hold: 'shield guard arm', hand: 'far', face: 'knuckles', drawing: 'arm-far-guard', carry: true },
  { hold: 'raised back holding the bow', hand: 'far', face: 'palm', drawing: 'arm-far-raised-back', carry: true },
  { hold: 'raised', hand: 'far', face: 'palm', drawing: 'arm-far-raised', carry: true },
];
export const HAND_TABLES = { 'rat-raider': RAT_HANDS, 'rat-spearman': RAT_HANDS, 'rat-archer': RAT_HANDS };
// The table's rule of faces (5b.2): near holds show the back of the hand, far holds the palm side (a shield hand is hidden)
export const FACE = { near: 'back', far: 'palm' };
// hold: { hand: 'near' | 'far', role, grip, mode, carried (a whole-arm drawing carries the item) } -> the rows it may use
export function holdRows(T, { hand, role, grip, mode, carried }) {
  if (carried) return T.filter((r) => r.hand === hand && r.carry);
  return T.filter((r) => r.hand === hand && r.holds?.some((h) => h.role === role && h.grip.includes(grip) && (!h.mode || h.mode === mode)));
}
// drawings that hold a handle (a hand drawing named as a grip, or a whole-arm drawing carrying the held item)
export const GRIP_DRAWING = /-(grip|grip-overhand|pinch|shield)$/;
// covers that lie over finished surface (rule `surface`): parts the hidden-paint zones leave out
export const SURFACE_COVERS = new Set(COVERS.filter((c) => c.surface).flatMap((c) => [c.top].flat()));
