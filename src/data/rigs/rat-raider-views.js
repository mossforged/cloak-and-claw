// Rat Raider body views (T028; rehearsal table, rig standard 4 and 6; render/rig-views.js reads them). T028 r2: A023's
// drawings and joint points (rounds 1-2), written by the importer (tools/rig_from_source.py bodyViews): anchors in the
// torso's / pelvis' own px (as `attach`), each view's bands, the drawings it brings for other parts (front head, back
// head, the back view's limb cuts) and, in B, where those cuts hang (`attach`: A023 viewJointPositions.B on each parent's
// own px). B hides the separate belt (the back pelvis has its own rear belt). Bands: S and F the near arm wholly in front;
// BQ wholly behind; B the far arm in front, the legs and tail swapped (feet still under their shins, 5b.1).
// T028 r3: A023 round 3 (BQ torso-away redrawn, its points remeasured); the B tail root on the seat under the jerkin flap
// ([40, 80] pelvis-back px: where A017's back reference has it; A023 r3's (490,1525) put it beside the trousers, under).
const NEAR_FRONT = { 'arm-near-upper': 800 };   // near arm wholly in front (forearm 820, hand 815 already are)
const NEAR_BEHIND = { 'arm-near-upper': 140, 'arm-near-lower': 150, 'hand-near': 145 };
const FAR_FRONT = { 'arm-far-upper': 800, 'arm-far-lower': 820, 'hand-far': 815, 'arm-near-upper': 110, 'arm-near-lower': 120, 'hand-near': 115 };
const LEGS_SWAPPED = { 'leg-near-upper': 210, 'leg-near-lower': 220, 'foot-near': 215, 'leg-far-upper': 510, 'leg-far-lower': 520,
  'foot-far': 515, tail: 530, 'tail-2': 540, 'tail-3': 550 };
// T028 r3 (user, 2026-10-18): seen from behind (B, BQ) the tail comes out of the seat over the trousers (A017's back
// reference), so it draws over the pelvis (anatomy: 'tail over pelvis' in these views); in B also over the far leg,
// which the back view brings nearest, and under the jerkin flap (torso 600). A023 r3 drew it under (300): overridden.
const TAIL_OVER = { tail: 450, 'tail-2': 460, 'tail-3': 470 };
const WAIST = [126.4, 150.4], HIPS = [106.8, 30.8];

export const BODY_VIEWS = {
  torso: {
    Q: {},
    S: { swap: 'torso-side', anchors: { neck: [164.0, 45.6], shoulder_near: [78.0, 45.6], shoulder_far: [176.0, 55.6], waist: WAIST }, bands: NEAR_FRONT },
    F: { swap: 'torso-front', anchors: { neck: [132.0, 51.6], shoulder_near: [38.0, 77.6], shoulder_far: [194.0, 57.6], waist: WAIST },
      bands: NEAR_FRONT, swaps: { head: 'head-front' } },
    BQ: { swap: 'torso-away', anchors: { neck: [138.0, 69.6], shoulder_near: [36.0, 61.6], shoulder_far: [208.8, 65.6], waist: WAIST }, bands: { ...NEAR_BEHIND, ...TAIL_OVER } },
    B: { swap: 'torso-back', anchors: { neck: [148.0, 77.6], shoulder_near: [216.0, 73.6], shoulder_far: [24.0, 73.6], waist: WAIST },
      bands: FAR_FRONT,
      swaps: { head: 'head-back', 'arm-near-upper': 'arm-near-upper-back', 'arm-near-lower': 'arm-near-lower-back', 'hand-near': 'hand-near-back',
        'arm-far-upper': 'arm-far-upper-back', 'arm-far-lower': 'arm-far-lower-back', 'hand-far': 'hand-far-back' },
      attach: { 'arm-near-lower': [108.4, 104.8], 'hand-near': [57.2, 68.8], 'arm-far-lower': [-8.0, 72.4], 'hand-far': [7.2, 71.2] } },
    H: { swap: 'torso-hunched', anchors: { neck: [158.0, 85.6], shoulder_near: [52.0, 77.6], shoulder_far: [188.0, 85.6], waist: WAIST } },
    LB: { swap: 'torso-lean-back', anchors: { neck: [104.0, 29.6], shoulder_near: [44.0, 49.6], shoulder_far: [162.0, 69.6], waist: WAIST } },
  },
  pelvis: {
    Q: {},
    S: { swap: 'pelvis-side', anchors: { waist: HIPS, hip_near: [96.4, 90.0], hip_far: [130.4, 82.0], tail_root: [36.4, 90.0] } },
    F: { swap: 'pelvis-front', anchors: { waist: HIPS, hip_near: [48.4, 90.0], hip_far: [160.4, 90.0], tail_root: [94.4, 82.0] } },
    B: { swap: 'pelvis-back', anchors: { waist: HIPS, hip_near: [162.4, 86.0], hip_far: [48.4, 86.0], tail_root: [40.0, 80.0] },
      bands: LEGS_SWAPPED, hide: ['belt'],
      swaps: { 'leg-near-upper': 'leg-near-upper-back', 'leg-far-upper': 'leg-far-upper-back', 'leg-near-lower': 'leg-near-lower-back',
        'leg-far-lower': 'leg-far-lower-back', 'foot-near': 'foot-near-back', 'foot-far': 'foot-far-back' },
      attach: { 'leg-near-lower': [73.2, 122.0], 'foot-near': [37.6, 66.8], 'leg-far-lower': [45.2, 150.0], 'foot-far': [28.0, 74.8] } },
  },
};
