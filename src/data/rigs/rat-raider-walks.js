// Rat Raider walk variants (T018 round 2; user: the round-1 walk is "very scuttly" next to the upright mouse).
// Round 3 (user: C best, "is more upright possible?"): D/E/F push further from C. TEMPORARY: V in game cycles them (render/walk-test.js) so the user can pick in motion; the pick becomes the rat's
// `walk` and this file and the key go. Each variant holds only the channels it changes (cadence, hips, lean, legs);
// arms, tail and hand swaps stay in rat-raider-poses.js `walk` (spearman/archer keep their own arms).
// Legs: 2-bone IK on an ankle path (planted sweep back, lifted arc forward) fitted to one wave per joint, feet kept level
// (tests/rat-rig.test.mjs: no skating, no sinking). Walk speed 2.0 px/frame, so stride = 60 / speed px.
export const WALKS = {
  C: {   // upright: 1.8 steps/s (close to the mouse's 1.55), torso pulled back past the master's hunch, head level
    label: 'C upright',
    speed: 1.8, dy: 3, torso: [-6, 1.5, 0, 2], head: [4, 1.5, 0.1, 2],
    'leg-front-upper': [3.5, 27.4, 0.739], 'leg-front-lower': [-106.3, 60.7, 0.776], 'foot-front': [102.8, 87.6, 0.265],
    'leg-back-upper': [7, 44.8, 0.251], 'leg-back-lower': [97.7, 16.5, 0.005], 'foot-back': [-104.7, 48.2, 0.695],
  },
  D: {   // C's legs and cadence, leaning further back: torso 8 degrees more upright than C, head tipped to keep the face level
    label: 'D upright lean',
    speed: 1.8, dy: 3, torso: [-14, 1.5, 0, 2], head: [10, 1.5, 0.1, 2],
    'leg-front-upper': [3.5, 27.4, 0.739], 'leg-front-lower': [-106.3, 60.7, 0.776], 'foot-front': [102.8, 87.6, 0.265],
    'leg-back-upper': [7, 44.8, 0.251], 'leg-back-lower': [97.7, 16.5, 0.005], 'foot-back': [-104.7, 48.2, 0.695],
  },
  E: {   // D's lean with the hips at the master crouch's height (feet planted closer under him)
    label: 'E taller',
    speed: 1.8, dy: 0, torso: [-14, 1.5, 0, 2], head: [10, 1.5, 0.1, 2],
    'leg-front-upper': [-6, 31.3, 0.75], 'leg-front-lower': [-110.9, 47.9, 0.788], 'foot-front': [116.9, 78.7, 0.273],
    'leg-back-upper': [10.8, 40.3, 0.259], 'leg-back-lower': [79.2, 16.5, 0.979], 'foot-back': [-90, 40.6, 0.694],
  },
  F: {   // tallest: hips 2 px above the master crouch, the most upright lean; 2.0 steps/s (the far leg can't make C's long stride this high)
    label: 'F tallest',
    speed: 2.0, dy: -2, torso: [-18, 1.5, 0, 2], head: [13, 1.5, 0.1, 2],
    'leg-front-upper': [-7.9, 26.8, 0.744], 'leg-front-lower': [-108.7, 36.4, 0.795], 'foot-front': [116.6, 62.4, 0.273],
    'leg-back-upper': [12.7, 34.6, 0.266], 'leg-back-lower': [69.8, 18.1, 0.982], 'foot-back': [-82.6, 35.4, 0.683],
  },
};
export const WALK_DEFAULT = 'D';
export const walkOf = (k) => { const { label, ...w } = WALKS[k]; return w; };
