// Rat Raider cutout rig (T018): A010 (head R) on the rig standard (docs/design/rig-standard.md): standard part names,
// separate pelvis, hands and feet. Parts and points come straight from A010's rig-source.json via the importer
// (python3 tools/rig_from_source.py assets/source/A010-rat-raider-standard/rig-source.json --id rat-raider
//  --art assets/art/enemies/rat-raider/rig): keyed at x0.4, one uniform scale, rest 0 = the A010 master pose (his
// fighting crouch, cutlass cocked up behind). No per-part scale fudges. Points are in each image's own px; a joint's
// attach (on the parent) and pivot (on the child) are the same master canvas point. order = the standard's depth bands
// (the near upper arm at 590, under the torso, is A010's reviewed exception: the torso hides the shoulder seam).
// Same field meanings as rigs/mouse-fighter.js. "front" = the near limb, "back" = far.
// slots: grip type -> where a held weapon goes: a string replaces that part's drawing; an object adds the weapon as a
//   new part `held` on `parent` at `attach` (parent px), drawn at `order`, turned `rest` degrees from the item's own
//   forward (its art.rest) in the hand's frame, or `upright` (keeps its own angle whatever the hand does: the bow).
//   Cutlass and spear sit in the near grip hand's shaft slot (A010 cutlass-grip-check: canvas [330, 1274], handle
//   drawn just behind the hand, the A003 item turned -75 degrees in the master pose); the bow goes through the far grip
//   hand's hole (canvas [1442, 1314]), held out in front.
// grips: per grip type, the hand swaps it puts on, and IK (render/rig-grip.js): ik.arm = [upper, lower] joints it bends;
//   ik.end = the part whose point ik.hand (that part's own px) must reach ik.to on the weapon art (spear `grip2`, bow
//   `nock`); arrow / string = draw order of a nocked arrow and the drawn string (in front of the body).
// tint (T018 stopgap until A011's refitted gear): spearman/archer recolour the whole figure a little (rigs/rat-*.js).
const P = 'assets/art/enemies/rat-raider/rig/';
const SLOT = [55.2, 50.8];   // the near grip hand's shaft slot, hand-front px

export default {
  id: 'rat-raider',
  scale: 0.25260,   // part px -> screen px (136 px tall, as the standee)
  rootY: 43.144,    // pelvis pivot height above the feet in the master crouch (screen px)
  slots: {
    'one-hand': { parent: 'hand-front', attach: SLOT, order: 830, rest: -75 },
    'two-hand': { parent: 'hand-front', attach: SLOT, order: 830, rest: -75 },
    bow: { parent: 'hand-back', attach: [64.8, 62.1], order: 125, upright: true },
  },
  grips: {
    'two-hand': { swap: { 'hand-back': 'hand-back-grip' }, ik: { arm: ['arm-back-upper', 'arm-back-lower'], end: 'hand-back', hand: [64.8, 62.1], to: 'grip2' } },
    bow: { swap: { 'hand-back': 'hand-back-grip', 'hand-front': 'hand-front-pinch' }, arrow: 810, string: 805,
      ik: { arm: ['arm-front-upper', 'arm-front-lower'], end: 'hand-front', hand: [5.6, 61.2], to: 'nock' } },
  },
  parts: {
    'pelvis': { img: P + 'pelvis.png', pivot: [108.8, 44.0], order: 400 },
    'torso': { img: P + 'torso.png', parent: 'pelvis', attach: [108.8, 12.0], pivot: [157.6, 188.0], order: 600, swaps: { 'torso-side': { img: P + 'torso-side.png', offset: [76.8, 8.0] }, 'torso-back': { img: P + 'torso-back.png', offset: [28.4, 8.0] } } },
    'head': { img: P + 'head.png', parent: 'torso', attach: [181.6, 79.2], pivot: [118.4, 227.2], order: 700, swaps: { 'head-neutral': { img: P + 'head-neutral.png', offset: [0.0, 0.0] }, 'head-attack': { img: P + 'head-attack.png', offset: [-2.0, 0.0] }, 'head-hurt': { img: P + 'head-hurt.png', offset: [-3.2, 0.0] }, 'head-effort': { img: P + 'head-effort.png', offset: [2.0, 0.4] }, 'head-ko': { img: P + 'head-ko.png', offset: [1.6, 0.0] }, 'head-back': { img: P + 'head-back.png', offset: [0.4, 16.0] } } },
    'arm-front-upper': { img: P + 'arm-front-upper.png', parent: 'torso', attach: [83.6, 58.0], pivot: [86.8, 46.0], order: 590 },
    'arm-front-lower': { img: P + 'arm-front-lower.png', parent: 'arm-front-upper', attach: [20.8, 70.0], pivot: [43.6, 47.2], order: 820 },
    'hand-front': { img: P + 'hand-front.png', parent: 'arm-front-lower', attach: [7.6, 61.2], pivot: [87.2, 45.2], order: 840, swaps: { 'hand-front-open': { img: P + 'hand-front-open.png', offset: [-6.8, -14.0] }, 'hand-front-fist': { img: P + 'hand-front-fist.png', offset: [10.8, 9.2] }, 'hand-front-grip': { img: P + 'hand-front-grip.png', offset: [0.0, 0.0] },
      // T018 stopgap: A010 has a pinch only for the far hand; the near string hand borrows it turned 180 degrees (scale -1),
      // its wrist on this hand's wrist. A near pinch drawing is for A011.
      'hand-front-pinch': { img: P + 'hand-back-pinch.png', offset: [101.6, 83.2], scale: -1 } } },
    'arm-back-upper': { img: P + 'arm-back-upper.png', parent: 'torso', attach: [267.6, 118.0], pivot: [32.4, 22.0], order: 110 },
    'arm-back-lower': { img: P + 'arm-back-lower.png', parent: 'arm-back-upper', attach: [77.6, 40.0], pivot: [21.2, 30.8], order: 120 },
    'hand-back': { img: P + 'hand-back.png', parent: 'arm-back-lower', attach: [50.0, 30.8], pivot: [12.0, 60.4], order: 130, swaps: { 'hand-back-open': { img: P + 'hand-back-open.png', offset: [0.0, 0.0] }, 'hand-back-fist': { img: P + 'hand-back-fist.png', offset: [0.8, 18.0] }, 'hand-back-grip': { img: P + 'hand-back-grip.png', offset: [0.4, 20.8] }, 'hand-back-pinch': { img: P + 'hand-back-pinch.png', offset: [-2.4, 22.4] } } },
    'leg-front-upper': { img: P + 'leg-front-upper.png', parent: 'pelvis', attach: [65.6, 50.0], pivot: [158.4, 28.0], order: 510 },
    'leg-front-lower': { img: P + 'leg-front-lower.png', parent: 'leg-front-upper', attach: [38.4, 93.2], pivot: [84.0, 13.2], order: 520 },
    'foot-front': { img: P + 'foot-front.png', parent: 'leg-front-lower', attach: [42.0, 50.8], pivot: [75.6, 8.8], order: 530 },
    'leg-back-upper': { img: P + 'leg-back-upper.png', parent: 'pelvis', attach: [170.4, 44.0], pivot: [73.6, 29.6], order: 210 },
    'leg-back-lower': { img: P + 'leg-back-lower.png', parent: 'leg-back-upper', attach: [118.0, 97.6], pivot: [41.2, 4.8], order: 220 },
    'foot-back': { img: P + 'foot-back.png', parent: 'leg-back-lower', attach: [61.2, 38.8], pivot: [49.6, 10.0], order: 230 },
    'tail': { img: P + 'tail.png', parent: 'pelvis', attach: [-39.2, 46.0], pivot: [173.2, 74.4], order: 300 },
    'scarf-tail': { img: P + 'scarf-tail.png', parent: 'torso', attach: [105.6, 8.0], pivot: [144.0, 62.4], order: 550 },
  },
};
