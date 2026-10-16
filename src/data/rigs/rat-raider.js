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
//   drawn just behind the hand); the bow goes through the far grip hand's hole (canvas [1443, 1365]), held out in front.
// axes (T020): slot axis per grip type, degrees in the slot parent's px, pointing to the weapon's head (render/rig.js
//   restIn turns the item so its handle runs along it). Near grip hand: its slot is cut straight up the fist (-90,
//   measured on A010 hand-front-grip). Far grip hand: a ring of claws, the handle across the forearm (wrist -> ring
//   centre is 2 degrees, so -88: the bow stands straight up with the hand level).
// grips: per grip type, the hand swaps it puts on, and IK (render/rig-grip.js): ik.arm = [upper, lower] joints it bends;
//   ik.end = the part whose point ik.hand (that part's own px) must reach ik.to on the weapon art (spear `grip2`, bow
//   `nock`); arrow / string = draw order of a nocked arrow and the drawn string (in front of the body).
//   T020: align = the IK hand's own axis (its px), turned to lie along the shaft (two-hand: the far fist closes round
//   it); order = draw orders while gripping (the far fist in front of the spear, fingers over the shaft); anchor = the
//   full-draw point { part, at (its px) }: the bow is drawn back to it (the ear) instead of the item's `pull`.
// overlays / views / masks (T019): A011 gear, face details and recolour masks (rigs/rat-raider-gear.js, generated);
//   which groups a rat wears = its fighter's art.gear + its look's detail (data/looks.js), drawn by render/looks.js.
import { OVERLAYS, VIEWS, MASKS } from './rat-raider-gear.js';

const P = 'assets/art/enemies/rat-raider/rig/';
const SLOT = [55.2, 50.8];   // the near grip hand's shaft slot, hand-front px
const RING = [64.8, 62.1];   // the far grip hand's ring of claws (shaft hole), hand-back px
const PINCH = [31.2, 17.2];  // A012 near pinch: thumb and finger meet (canvas [270, 1190]), hand-front px
const EAR = [132, 198];      // full draw: string to the jaw line, under the cheek behind the mouth (head px)

export default {
  id: 'rat-raider',
  scale: 0.25260,   // part px -> screen px (136 px tall, as the standee)
  rootY: 43.144,    // pelvis pivot height above the feet in the master crouch (screen px)
  overlays: OVERLAYS, views: VIEWS, masks: MASKS,
  slots: {
    'one-hand': { parent: 'hand-front', attach: SLOT, order: 830 },
    'two-hand': { parent: 'hand-front', attach: SLOT, order: 830 },
    bow: { parent: 'hand-back', attach: RING, order: 125 },
  },
  axes: { 'one-hand': -90, 'two-hand': -90, bow: -88 },
  grips: {
    'two-hand': { swap: { 'hand-back': 'hand-back-grip' }, align: -88, order: { 'hand-back': 845 },
      ik: { arm: ['arm-back-upper', 'arm-back-lower'], end: 'hand-back', hand: RING, to: 'grip2' } },
    bow: { swap: { 'hand-back': 'hand-back-grip', 'hand-front': 'hand-front-pinch' }, arrow: 810, string: 805, anchor: { part: 'head', at: EAR },
      ik: { arm: ['arm-front-upper', 'arm-front-lower'], end: 'hand-front', hand: PINCH, to: 'nock' } },
  },
  parts: {
    'pelvis': { img: P + 'pelvis.png', pivot: [108.8, 44.0], order: 400 },
    'torso': { img: P + 'torso.png', parent: 'pelvis', attach: [108.8, 12.0], pivot: [157.6, 188.0], order: 600, swaps: { 'torso-side': { img: P + 'torso-side.png', offset: [76.8, 8.0] }, 'torso-back': { img: P + 'torso-back.png', offset: [28.4, 8.0] } } },
    'head': { img: P + 'head.png', parent: 'torso', attach: [181.6, 79.2], pivot: [118.4, 227.2], order: 700, swaps: { 'head-neutral': { img: P + 'head-neutral.png', offset: [0.0, 0.0] }, 'head-attack': { img: P + 'head-attack.png', offset: [-2.0, 0.0] }, 'head-hurt': { img: P + 'head-hurt.png', offset: [-3.2, 0.0] }, 'head-effort': { img: P + 'head-effort.png', offset: [2.0, 0.4] }, 'head-ko': { img: P + 'head-ko.png', offset: [1.6, 0.0] }, 'head-back': { img: P + 'head-back.png', offset: [0.4, 16.0] } } },
    'arm-front-upper': { img: P + 'arm-front-upper.png', parent: 'torso', attach: [83.6, 58.0], pivot: [86.8, 46.0], order: 590 },
    'arm-front-lower': { img: P + 'arm-front-lower.png', parent: 'arm-front-upper', attach: [20.8, 70.0], pivot: [43.6, 47.2], order: 820 },
    'hand-front': { img: P + 'hand-front.png', parent: 'arm-front-lower', attach: [7.6, 61.2], pivot: [87.2, 45.2], order: 840, swaps: { 'hand-front-open': { img: P + 'hand-front-open.png', offset: [-6.8, -14.0] }, 'hand-front-fist': { img: P + 'hand-front-fist.png', offset: [10.8, 9.2] }, 'hand-front-grip': { img: P + 'hand-front-grip.png', offset: [0.0, 0.0] },
      // T020: A012's near pinch (A010 canvas, keyed x0.4 like the rest; trim [194, 1147])
      'hand-front-pinch': { img: P + 'hand-front-pinch.png', offset: [0.8, 0.0] } } },
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
