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
export const POSE_LIMITS = {
  default: { ankle: 60, neck: 40, knee: 150 },
  hipStep: 0.5,
  handle: 13,
  ring: { r: 9, off: 15 },
  grab: 30,
};

export const poseLimit = (rig, joint) => (POSE_LIMITS[rig?.id] ?? POSE_LIMITS.default)[joint] ?? POSE_LIMITS.default[joint];
