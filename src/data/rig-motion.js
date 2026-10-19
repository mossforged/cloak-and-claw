// Rig motion tunables (T028; lab: "Rig views, turn and springs"). Render only: no gameplay number lives here.
// capTurn: a shoulder cap turns this share of its upper arm's swing (0 = stays put on the torso, 1 = rides the arm).
// viewBlend: seconds over which the children slide from the old view's joint points to the new one's when a torso or
//   pelvis view swaps in (the drawing itself swaps at once). T029 r2: 0 = they snap with the drawing (a view changes on
//   a key; sliding the old view's points under the new drawing opened gaps on the switch frame: spin 222 px²).
// turn: the turn-around through the front view when a fighter's facing flips: one entry per frame, `sx` = the body's
//   width (crossing zero: the old facing narrows, the new one widens), `front` = the frames drawn in the F view.
// springs (rig standard: study recommendation 10): tail segments and scarf turn after their parent's velocity.
//   inertia = degrees of lag per px/s of the joint's sideways speed; strength = pull back toward the pose (1/s^2);
//   damping = share of critical damping (1 = settles without a bounce; below 1 swings past once); max = degrees.
//   on = false turns them off everywhere; a rig turns its own off with springs.off.
export const RIG_MOTION = {
  capTurn: 0.45,
  viewBlend: 0,
  turn: { sx: [-0.7, -0.9, 0.9, 0.7], front: [1, 2] },   // T028 r2: the F frames near full width (A023's front drawings face the camera; at 0.25 they were a sliver)
  springs: { on: true, inertia: 0.08, strength: 140, damping: 0.75, max: 28 },
};
