// Wrist limits (T029 r3; lab: "Wrists"). Render only. How far (degrees, either way) a hand may turn from its natural
// angle on its forearm. A grip that needs more turns the forearm and upper arm (render/wrist.js), or the held item,
// never the wrist. Per hand; a rig id key overrides `default` for that rig (rat-raider, rat-spearman, ...).
// neutral: a hand drawing's natural angle on the forearm, degrees from as it sits on the setup canvas (0 = as drawn: the
//   forearm meets the base of the hand). A drawing made for a foreshortened forearm sits on the hanging forearm turned:
//   e.g. an overhand fist drawn knuckles to the camera with its shaft along the forearm; its neutral is where the
//   forearm meets the wrist end of the fist instead (judged on tools/wrist-sheet.mjs). Rule for grip drawings: a fist
//   closes round a handle across the palm, so at its neutral the user's grip line runs across the forearm: the rat's
//   side grip (line across the hanging forearm) is 0; the near overhand fist and the far (bow) grip have their lines
//   along the hanging forearm, so they sit +90 (the side the approved spearman idle and archer stance use). The pinch
//   holds the arrow along the forearm (full draw: elbow back, forearm along the arrow): 0.
// turn: cost per degree a two-handed item (or a bow) turns; turn1: the same for an item in one hand; trade: cost per px the hand (and item) moves;
// gap: a second hand off its shaft (or past its own grip), per px; slide2: a second hand sliding back along the shaft; armTurn: cost per degree the arm turns; elbowFlip: cost of an elbow bending the other way on screen (null: never); elbowMax: the deepest elbow bend (deg) the solve may make (the elbow seams open past it), unless the pose bent it more; step: degrees between the item turns
// tried. on: false = no limits (before / after sheets: tools/pose-strip.mjs --no-wrists).
export const WRISTS = {
  on: true,
  default: { near: 45, far: 45 },
  // T035: the widest end of the user's ranges (near -49..9, far 0..59: rig.limits); T039: a rig with `limits` keeps its
  // wrists inside its own range (wristRange); its A028 grip drawings are registered on the hanging forearm (neutral 0)
  'rat-v3': { near: 49, far: 59, neutral: {} },
  neutral: { 'hand-near-grip-overhand': 90, 'hand-far-grip': 90 },
  turn: 2.5,
  turn1: 1,
  trade: 0.5,
  gap: 8,
  slide2: 1.2,
  armTurn: 0.05,
  elbowFlip: 15,
  elbowMax: 110,
  step: 2,
};

export const wristLimit = (rig, hand) => (WRISTS[rig?.id] ?? WRISTS.default)[hand] ?? WRISTS.default[hand] ?? 45;
// the drawing's natural angle on the forearm (its swap name, or the hand part's own name)
export const neutralOf = (rig, drawing) => (WRISTS[rig?.id]?.neutral ?? WRISTS.neutral)[drawing] ?? 0;
// T039: the range a hand's turn (from its neutral) stays in: the rig's own [lo, hi] (rat v3's limits), else +-wristLimit
export const wristRange = (rig, hand) => rig?.limits?.[`hand-${hand}`] ?? [-wristLimit(rig, hand), wristLimit(rig, hand)];
