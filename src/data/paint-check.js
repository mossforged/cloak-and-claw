// Paint check numbers (T026 round 2, rig standard 8: tools/bench/paint.js, tests/paint.test.mjs).
// art: the importer's cut scale (canvas px -> cut px; the check's grid). edge: px of the master's silhouette edge left out
// (antialiasing, 1-px drift). strong: a per-pixel colour difference (mean |RGB|, 0..255) that reads as different paint.
// limit: the most a body may differ, set from the A010 rat (the user: "a single piece of art"): share of strong pixels
// and the largest solid strong region (game px^2: its core after eroding `solid` px, so edge slivers don't count).
export const PAINT = {
  art: 0.4, edge: 2, strong: 60, solid: 2,
  limit: { strongShare: 0.01, region: 12 },   // A010 at rest: 0.92% strong, largest solid region 11 game px^2 (T026 r2)
  // T028 r4: known over the limit, Art to fix (the test fails if a body gets worse than this): A023 round 4's repaint of
  // the pelvis (trouser seat, flap) and the far thigh changed paint that shows at rest (without the pelvis 0.92%, without
  // the far thigh 1.13%; round 3 passed). Map: docs/screens/T028/r4-paint-rat.jpg.
  known: { rat: { strongShare: 0.0168, region: 14, why: 'A023 r4 pelvis + far thigh repaint shows at rest (Art)' } },
};
