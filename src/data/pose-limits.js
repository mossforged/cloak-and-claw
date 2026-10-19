import { RAT_RANGES, RAT_BODY } from './rigs/rat-raider-joints.js';

// Drag-to-pose (T031; viewer.html?pose=<fighter>): the joint limits the pose page keeps a dragged limb inside, beside the
// wrist limits (data/wrists.js, which the game's renderer applies) and the elbow's deepest bend (WRISTS.elbowMax). View only:
// the game never reads these. Degrees from the part as drawn on its parent (0 = the master pose); a rig id key overrides
// `default` (rat-raider, rat-spearman, ...).
// ankle: a foot's turn on its shin, either way. neck: the head's turn on the chest, either way. knee: the deepest knee bend
//   (the angle between thigh and shin bones on screen). hipStep: px per search step when the dragged hips would pull a planted
//   foot out of reach (the hips stop where both legs still reach).
// handle: the round handles' radius (screen px); ring: the twist ring's radius (screen px) and its distance from its handle
// (rig px: along the forearm past a hand, forward and up from a foot); grab: how far from a handle a touch still takes it
// (screen px).
// T034 turns: a body with hand-placed joint points (the rat's near arm and leg, rigs/rat-raider-joints.js) has each joint's
//   [lo, hi] turn on its parent, degrees from rest (+ = clockwise on screen), keyed by the moving part: the pose page keeps a
//   drag inside them, the game's wrist solve (render/wrist.js) keeps the elbow and shoulder inside them, the limits test
//   (tests/joint-limits.test.mjs) checks every clip against them. Off with the old joint points.
const RAT = RAT_RANGES && { ankle: 60, neck: 40, knee: 150, turns: RAT_RANGES };

export const POSE_LIMITS = {
  default: { ankle: 60, neck: 40, knee: 150 },
  ...(RAT ? Object.fromEntries(RAT_BODY.map((id) => [id, RAT])) : {}),
  hipStep: 0.5,
  handle: 13,
  ring: { r: 9, off: 15 },
  grab: 30,
};

export const poseLimit = (rig, joint) => (POSE_LIMITS[rig?.id] ?? POSE_LIMITS.default)[joint] ?? POSE_LIMITS.default[joint];
// T034: a part's [lo, hi] turn on its parent (null: none); how far v lies outside a range (0 inside)
export const turnRange = (rig, part) => POSE_LIMITS[rig?.id]?.turns?.[part] ?? null;
export const excess = (v, [lo, hi]) => Math.max(0, lo - v, v - hi);
