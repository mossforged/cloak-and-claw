// Shared combat/physics rules. Units: pixels and frames (60 frames = 1 second).
export const RULES = {
  gravity: 0.55,
  depthHit: 16,           // default: max depth (y) gap at which a hit still connects
  maxAttackers: 1,        // how many enemies may commit to attacking at once (fairness)
  hurtFriction: 0.85,     // knockback slowdown per frame while hurt
  knockdown: { vz: 6.5, vx: 4.5, downFrames: 45, getupFrames: 18, invulnAfter: 30 },
  waveDelay: 90,          // frames between clearing a wave and the next arriving
  deadLinger: 50,         // frames a defeated enemy blinks before vanishing
};
