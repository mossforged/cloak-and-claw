// Impact (T041; research: docs/design/rigs/research-cutout-rigging.md item 5). Render only: one frame of overshoot past
// the strike pose and a brief stretch of the striking limb at the hit frame, then settle (render/impact.js). A rig opts
// in with `impact: { <move key>: entry }` (rat v3: V3_IMPACT); a move without one plays exactly as before (the raider's
// clips are unchanged). The hit frame: the first active frame on the strike pose (timing.strikeIn of the active phase).
// over: share of the last stretch of the swing (the key before the strike -> the strike) carried on past the strike,
//   on the hit frame only; the strike blend itself then eases in without its back-overshoot (timing.overshoot).
// stretch: the striking limb's bones longer along their length by this share on the hit frame (<= 0.08), fading over
//   `frames` frames (1 or 2). limb: the bones stretched.
export const IMPACT = { over: 0.15, stretch: 0.06, frames: 2 };

const NEAR = ['arm-near-upper', 'arm-near-lower'], FAR = ['arm-far-upper', 'arm-far-lower'];
const on = (limb, extra) => ({ limb, ...extra });
// rat v3's attacks (the raider's and the spearman's moves it plays): the weapon arm; the shield bash: the shield arm
export const V3_IMPACT = {
  ratSlash: on(NEAR), overheadChop: on(NEAR), spearThrust: on(NEAR), staffSwing: on(NEAR), staffOverhead: on(NEAR),
  shieldBash: on(FAR),
};
export const impactOf = (rig, key) => (rig.impact?.[key] ? { ...IMPACT, ...rig.impact[key] } : null);
