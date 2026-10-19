import { JOINT_SWITCH } from './rigs/rat-raider-joints.js';

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
  // T030: A023 round 5's seat lies over the crotch and both thigh tops at rest, painted unlike the master there (1.68% ->
  // 2.17%, largest region unchanged at 14). Map: docs/screens/T030/paint-rat.jpg.
  // T034: on the user's joint points the rest no longer lays the near arm and leg on the master (his pivot / attach pairs
  // are different canvas points: the arm hangs ~10 px longer with the elbow open, the near shin and foot ~4 game px lower):
  // 10.98%, largest region 168 (the near foot). Old points: as T030. Map: docs/screens/T034/paint-rat.jpg.
  known: { rat: JOINT_SWITCH.points ? { strongShare: 0.1098, region: 168, why: 'T034: his joint points move the near arm and leg off the master at rest (his call)' }
    : { strongShare: 0.0217, region: 14, why: 'A023 r4 pelvis + far thigh repaint and the A023 r5 seat show at rest (Art)' } },
};
