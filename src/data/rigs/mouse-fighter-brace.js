// Bracing loop while blocking (T015, render only; src/render/brace.js): a slow living layer over the `block` pose.
// Angles in degrees, px in screen px, cycles in seconds. Not during blockstun (the `blockHit` shove); fades in after it.
//   fade:    frames to blend the loop in on entering block and after a blocked hit
//   breath:  s per breath. chest = torso stretch along the bone (0.035 lifts the head ~1.4 px), head = nod (deg)
//   shield:  deg on the guard arm and the shield, lagging the breath by `lag` of a cycle (not one rigid piece)
//   sway:    s per weight shift; hips = px side to side (boots stay planted: the legs bend to keep them)
//   swayFade: frames for the sway to stop/restart while he shuffle-walks behind the shield
//   sword:   deg; ready-grip twitch on two quick, uneven cycles (twitch s) so it never looks like a metronome
//   plant:   upper leg -> [lower leg, sole point in the lower leg's own px] (kept on the spot it has in the plain pose)
export default {
  fade: 14,
  breath: 1.4, chest: 0.035, head: 1.2,
  shield: 1.4, arm: 1, lag: 0.18,
  sway: 3.2, hips: 1, swayFade: 10,
  sword: 1.6, twitch: [0.53, 0.29],
  plant: { 'leg-back-upper': ['leg-back-lower', [38, 82]], 'leg-front-upper': ['leg-front-lower', [45, 94]] },
};
