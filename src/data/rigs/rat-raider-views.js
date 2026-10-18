// Rat Raider body views (T028; rehearsal table, rig standard 4 and 6; render/rig-views.js reads them). T028 r2: A023's
// drawings and joint points (rounds 1-2), written by the importer (tools/rig_from_source.py bodyViews): anchors in the
// torso's / pelvis' own px (as `attach`), each view's bands, the drawings it brings for other parts (front head, back
// head, the back view's limb cuts) and, in B, where those cuts hang (`attach`: A023 viewJointPositions.B on each parent's
// own px). B hides the separate belt (the back pelvis has its own rear belt). Bands: S and F the near arm wholly in front;
// BQ wholly behind; B the far arm in front, the legs and tail swapped (feet still under their shins, 5b.1).
// T028 r3: A023 round 3 (BQ torso-away redrawn, its points remeasured). T028 r4: A023 round 4 re-trimmed the torso and
// pelvis drawings (their points moved with their pivots: torso +1.6, +0.4, pelvis 0, +6 own px) and the back limb
// cuts' joints are A023 r4's viewJointPositions.
const NEAR_FRONT = { 'arm-near-upper': 800 };   // near arm wholly in front (forearm 820, hand 815 already are)
const NEAR_BEHIND = { 'arm-near-upper': 140, 'arm-near-lower': 150, 'hand-near': 145 };
const FAR_FRONT = { 'arm-far-upper': 800, 'arm-far-lower': 820, 'hand-far': 815, 'arm-near-upper': 110, 'arm-near-lower': 120, 'hand-near': 115 };
const LEGS_SWAPPED = { 'leg-near-upper': 210, 'leg-near-lower': 220, 'foot-near': 215, 'leg-far-upper': 510, 'leg-far-lower': 520,
  'foot-far': 515 };
// T028 r3 (user, 2026-10-18): seen from behind (B, BQ) the tail comes out of the seat over the trousers (A017's back
// reference), so it draws over the pelvis (anatomy: 'tail over pelvis' in these views); in B also over the far leg,
// which the back view brings nearest, and under the jerkin flap (torso 600). A023 r3 drew it under (300): overridden.
// T028 r4: A023 round 4's rear tail root (`tail-root-back`, a finished root ending on the seat) in B and BQ, bands
// 550 / 560 / 570 (over the seat and the thighs, under the torso 600; A023 round4Tail); its root on the seat: B (780, 1505)
// on pelvis-back, BQ (560, 1505) on the three-quarter pelvis (A017 canvas -> pelvis px). BQ is a torso view, so it carries
// the tail's drawing and point itself (the importer only writes them for a pelvis view).
const TAIL_OVER = { tail: 550, 'tail-2': 560, 'tail-3': 570 }, REAR_TAIL = { tail: 'tail-root-back' };
const WAIST = [128.0, 150.8], HIPS = [106.8, 36.8];
// T030 (A023 r5): the seat cover's own drawing per pelvis view (Q and BQ: `seat`); B hides it (the back pelvis has its seat).
const SEAT_S = { seat: 'seat-side' }, SEAT_F = { seat: 'seat-front' };

export const BODY_VIEWS = {
  torso: {
    Q: {},
    S: { swap: 'torso-side', anchors: { neck: [165.6, 46.0], shoulder_near: [79.6, 46.0], shoulder_far: [177.6, 56.0], waist: WAIST }, bands: NEAR_FRONT },
    F: { swap: 'torso-front', anchors: { neck: [133.6, 52.0], shoulder_near: [39.6, 78.0], shoulder_far: [195.6, 58.0], waist: WAIST },
      bands: NEAR_FRONT, swaps: { head: 'head-front' } },
    BQ: { swap: 'torso-away', anchors: { neck: [139.6, 70.0], shoulder_near: [37.6, 62.0], shoulder_far: [210.4, 66.0], waist: WAIST }, bands: { ...NEAR_BEHIND, ...TAIL_OVER }, swaps: REAR_TAIL,
      attach: { tail: [20.4, 86.0] } },
    B: { swap: 'torso-back', anchors: { neck: [149.6, 78.0], shoulder_near: [217.6, 74.0], shoulder_far: [25.6, 74.0], waist: WAIST },
      bands: FAR_FRONT,
      swaps: { head: 'head-back', 'arm-near-upper': 'arm-near-upper-back', 'arm-near-lower': 'arm-near-lower-back', 'hand-near': 'hand-near-back',
        'arm-far-upper': 'arm-far-upper-back', 'arm-far-lower': 'arm-far-lower-back', 'hand-far': 'hand-far-back' },
      attach: { 'arm-near-lower': [110.8, 104.8], 'hand-near': [57.2, 68.8], 'arm-far-lower': [-9.6, 72.8], 'hand-far': [7.2, 71.2] } },
    H: { swap: 'torso-hunched', anchors: { neck: [159.6, 86.0], shoulder_near: [53.6, 78.0], shoulder_far: [189.6, 86.0], waist: WAIST } },
    LB: { swap: 'torso-lean-back', anchors: { neck: [105.6, 30.0], shoulder_near: [45.6, 50.0], shoulder_far: [163.6, 70.0], waist: WAIST } },
  },
  pelvis: {
    Q: {},
    S: { swap: 'pelvis-side', anchors: { waist: HIPS, hip_near: [96.4, 96.0], hip_far: [130.4, 88.0], tail_root: [36.4, 96.0] }, swaps: SEAT_S },
    F: { swap: 'pelvis-front', anchors: { waist: HIPS, hip_near: [48.4, 96.0], hip_far: [160.4, 96.0], tail_root: [94.4, 88.0] }, swaps: SEAT_F },
    B: { swap: 'pelvis-back', anchors: { waist: HIPS, hip_near: [162.4, 92.0], hip_far: [48.4, 92.0], tail_root: [108.4, 86.0] },
      bands: { ...LEGS_SWAPPED, ...TAIL_OVER }, hide: ['belt', 'seat'],
      swaps: { 'leg-near-upper': 'leg-near-upper-back', 'leg-far-upper': 'leg-far-upper-back', 'leg-near-lower': 'leg-near-lower-back',
        'leg-far-lower': 'leg-far-lower-back', 'foot-near': 'foot-near-back', 'foot-far': 'foot-far-back', ...REAR_TAIL },
      attach: { 'leg-near-lower': [73.2, 123.6], 'foot-near': [37.6, 66.8], 'leg-far-lower': [46.4, 140.0], 'foot-far': [28.0, 74.8] } },
  },
};
