import { RAT_RANGES, RAT_BODY } from './rigs/rat-raider-joints.js';

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
// tried. armRanges (T034): the solve also keeps a hand-placed elbow / shoulder (data/pose-limits.js turns: the rat's near arm)
// no further outside its range than the pose had it (off: on, the spearman's walk and hurt holds lose the shaft by 9-16 px). on: false = no limits (before / after sheets: tools/pose-strip.mjs --no-wrists).
// T034: a limit is a number (either way) or [lo, hi] (degrees, + = clockwise on screen): the rat body's near wrist is the
// user's (rigs/rat-raider-joints.js, -42..+17 from the drawing's neutral; off with the old joint points).
export const WRISTS = {
  on: true,
  default: { near: 45, far: 45 },
  ...(RAT_RANGES ? Object.fromEntries(RAT_BODY.map((id) => [id, { near: RAT_RANGES['hand-near'], far: 45 }])) : {}),
  neutral: { 'hand-near-grip-overhand': 90, 'hand-far-grip': 90 },
  turn: 2.5,
  turn1: 1,
  trade: 0.5,
  gap: 8,
  slide2: 1.2,
  armTurn: 0.05,
  elbowFlip: 15,
  elbowMax: 110,
  armRanges: false,
  step: 2,
};

// T034: drawing = the hand drawing showing (swap name or part name). A [lo, hi] limit (the user's, set on the fist as it hangs)
// holds for the drawings that sit on the forearm as drawn (neutral 0); a drawing turned on it (the overhand fist, the far
// bow grip: neutral +90) keeps the default's either-way limit until he sets one for that hold.
export const wristLimit = (rig, hand, drawing = null) => {
  const lim = (WRISTS[rig?.id] ?? WRISTS.default)[hand] ?? WRISTS.default[hand] ?? 45;
  return Array.isArray(lim) && drawing && (WRISTS.neutral[drawing] ?? 0) !== 0 ? WRISTS.default[hand] ?? 45 : lim;
};
// the drawing's natural angle on the forearm (its swap name, or the hand part's own name)
export const neutralOf = (rig, drawing) => WRISTS.neutral[drawing] ?? 0;

// T034: a limit as [lo, hi]; v inside it (tol past either end); v clamped into it, eps short of the end it passed
export const rangeOf = (lim) => (Array.isArray(lim) ? lim : [-lim, lim]);
export const inside = (v, lim, tol = 0) => { const [lo, hi] = rangeOf(lim); return v >= lo - tol && v <= hi + tol; };
export const clampIn = (v, lim, eps = 0) => { const [lo, hi] = rangeOf(lim); return v > hi ? hi - eps : v < lo ? lo + eps : v; };
