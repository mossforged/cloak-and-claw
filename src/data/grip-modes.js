// Grip modes (T025): how a hand holds a weapon node, as data. The hand drawing copies the weapon's rotation: its slot
// axis (rig.axes) is laid along the handle with the slot point on the grip marker, then turned per mode about the grip.
// side: as the fist is drawn (the pre-T025 hold). turns: the hand turns tried (0 = as drawn, 180 = fist turned over
// about the grip); wrist: which side of the shaft the wrist must end on ('above' = the fist over the shaft, forearm from
// above; 'below' = under it; judged by the fist drawing's middle), so overhand / underhand pick whichever turn puts the wrist there. mirror: the fist
// reflected across the line perpendicular to the shaft (reverse: the head comes out of the little-finger end, the fist
// stays on its side). swap: the hand drawing used when the rig has one named '<hand>-<swap>' (e.g.
// hand-near-grip-overhand); none exist yet, so the grip drawing is turned. The second hand of a two-hander (far fist)
// takes only `wrist` (render/rig-grip.js alignGrip).
export const GRIP_MODES = {
  side: { turns: [0] },
  overhand: { turns: [0, 180], wrist: 'above', swap: 'overhand' },
  underhand: { turns: [0, 180], wrist: 'below', swap: 'underhand' },
  reverse: { turns: [0], mirror: true },
};
export const GRIP_MODE_NAMES = Object.keys(GRIP_MODES);
// T028 r4: a rig with the user's grip lines (rig.gripLines) holds every item by those lines, so it keeps only the modes
// that pick a hand drawing of their own (side, and overhand where '<grip hand>-overhand' exists); turns and mirrors would
// take the handle off the drawn line. Other rigs: every mode.
export const modesFor = (rig) => (rig?.gripLines
  ? GRIP_MODE_NAMES.filter((m) => m === 'side' || (GRIP_MODES[m].swap && rig.hands?.[`${rig.heldHand?.['hand-near'] ?? 'hand-near-grip'}-${GRIP_MODES[m].swap}`]))
  : GRIP_MODE_NAMES);
// Draw order (rig standard 6): a hand gripping a weapon (the grip hand on the node, a two-hander's second fist) never
// draws under it: one that would is lifted to the weapon's order + GRIP_BAND (the 850 overlay band over a held item at
// 830-835), so the spearman never "loses an arm". Rigs may still set their own (rat grips['two-hand'].order).
export const GRIP_BAND = 15;
