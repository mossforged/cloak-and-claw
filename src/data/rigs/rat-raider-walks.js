// Rat Raider walk variants (T018 round 2; user: the round-1 walk is "very scuttly" next to the upright mouse).
// TEMPORARY: V in game cycles them (render/walk-test.js) so the user can pick in motion; the pick becomes the rat's
// `walk` and this file and the key go. Each variant holds only the channels it changes (cadence, hips, lean, legs);
// arms, tail and hand swaps stay in rat-raider-poses.js `walk` (spearman/archer keep their own arms).
// Legs: 2-bone IK on an ankle path (planted sweep back, lifted arc forward) fitted to one wave per joint, feet kept level
// (tests/rat-rig.test.mjs: no skating, no sinking). Walk speed 2.0 px/frame, so stride = 60 / speed px.
export const WALKS = {
  A: {   // round 1: scuttle. 2.8 steps/s, hips dropped 5 px, leaning well forward
    label: 'A scuttle (round 1)',
    speed: 2.8, dy: 5, torso: [10, 2, 0, 2], head: [-10, 2, 0.1, 2],
    'leg-front-upper': [19.5, 4.4, 0.55], 'leg-front-lower': [-72.7, 45.5, 0.769], 'foot-front': [53.3, 46.5, 0.254],
    'leg-back-upper': [-23.6, 17, 0.3], 'leg-back-lower': [88.9, 42.1, 0.201], 'foot-back': [-65.3, 56.8, 0.729],
  },
  B: {   // stride: 2.0 steps/s, longer steps with the feet under the hips, hips 2 px down, the stance's lean
    label: 'B stride',
    speed: 2.0, dy: 2, torso: [4, 1.5, 0, 2], head: [-4, 1.5, 0.1, 2],
    'leg-front-upper': [5.1, 19.6, 0.724], 'leg-front-lower': [-98.7, 49.1, 0.779], 'foot-front': [93.6, 67.9, 0.263],
    'leg-back-upper': [7.8, 37.8, 0.258], 'leg-back-lower': [89, 17.3, 0.004], 'foot-back': [-96.8, 41.2, 0.689],
  },
  C: {   // upright: 1.8 steps/s (close to the mouse's 1.55), torso pulled back past the master's hunch, head level
    label: 'C upright',
    speed: 1.8, dy: 3, torso: [-6, 1.5, 0, 2], head: [4, 1.5, 0.1, 2],
    'leg-front-upper': [3.5, 27.4, 0.739], 'leg-front-lower': [-106.3, 60.7, 0.776], 'foot-front': [102.8, 87.6, 0.265],
    'leg-back-upper': [7, 44.8, 0.251], 'leg-back-lower': [97.7, 16.5, 0.005], 'foot-back': [-104.7, 48.2, 0.695],
  },
};
export const WALK_DEFAULT = 'C';
export const walkOf = (k) => { const { label, ...w } = WALKS[k]; return w; };
