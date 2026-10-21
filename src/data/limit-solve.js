// T035 r2: the limit-aware two-bone solve (render/limits.js reachInLimits) behind rat v3's retarget by position
// (render/retarget.js), its floor-line fix (render/floor.js floorInLimits) and its drag-to-pose. Render only.
// step / fine: degrees between the elbow / knee turns tried (a coarse sweep of the range, then a fine one round the best).
// bent / side: past `bent` degrees of bend, a solve on the other side of the source's elbow / knee costs `side` px (so the
//   limb keeps the side it bends to unless only the other side reaches).
// stay: px per degree a solve's elbow / knee moves from its turn (only breaks ties: at rest, the rest pose).
// tilt: px a solve costs per degree it would push the foot past its ankle range (the clamp tips the foot off its floor).
// hold: T040, the same for a hand placed with its item's angle (rat v3's own poses): px per degree past the wrist range.
// Floor fix (render/floor.js floorInLimits: the sole on its line): onLine = px off the line a foot may stay before the fix
//   looks along the line, up to slide px in slideStep steps (a trailing leg past its hip limit slides rather than sink);
//   slideCost = cost per px the ankle lands away from the rule's x, tiltCost = per degree the foot ends off its wanted tilt
//   (being off the line costs 1 per px).
// planted: T038, in a key posed off the floor (`aloft`) on the ground, a foot raised less than this (px) is planted: the
//   floor fix puts it on its line (render/floor.js aloftInLimits).
export const LIMIT_SOLVE = { step: 1, fine: 0.05, bent: 5, side: 3, stay: 0.001, tilt: 0.5, hold: 2, onLine: 0.3, slide: 24, slideStep: 0.5, slideCost: 0.1, tiltCost: 0.05, planted: 0.5 };
