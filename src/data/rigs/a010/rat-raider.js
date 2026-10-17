// Rat Raider cutout rig (T018): A010 (head R) on the rig standard (docs/design/rig-standard.md): standard part names,
// separate pelvis, hands and feet. Parts and points come straight from A010's rig-source.json via the importer
// (python3 tools/rig_from_source.py assets/source/A010-rat-raider-standard/rig-source.json --id rat-raider
//  --art assets/art/enemies/rat-raider/rig): keyed at x0.4, one uniform scale, rest 0 = the A010 master pose (his
// fighting crouch, cutlass cocked up behind). No per-part scale fudges. Points are in each image's own px; a joint's
// attach (on the parent) and pivot (on the child) are the same master canvas point. order = the standard's depth bands
// (the near upper arm at 590, under the torso, is A010's reviewed exception: the torso hides the shoulder seam).
// Same field meanings as rigs/mouse-fighter.js. Limb names: near = the camera side, far = away (T024; was front/back).
// slots: grip type -> where a held weapon goes: a string replaces that part's drawing; an object adds the weapon as a
//   new part `held` on `parent` at `attach` (parent px), drawn at `order`, turned `rest` degrees from the item's own
//   forward (its art.rest) in the hand's frame, or `upright` (keeps its own angle whatever the hand does: the bow).
//   Cutlass and spear sit in the near grip hand's shaft slot (A010 cutlass-grip-check: canvas [330, 1274], handle
//   drawn just behind the hand); the bow goes through the far grip hand's hole (canvas [1443, 1365]), held out in front.
// axes (T020): slot axis per grip type, degrees in the slot parent's px, pointing to the weapon's head (render/rig.js
//   restIn turns the item so its handle runs along it). Near grip hand: its slot is cut straight up the fist (-90,
//   measured on A010 hand-near-grip). Far grip hand: a ring of claws, the handle across the forearm (wrist -> ring
//   centre is 2 degrees, so -88: the bow stands straight up with the hand level). T020 round 2: the cutlass sits 10 deg back
//   of the cut slot (user's pick by eye: the knuckle rows lean). flip 'hold': the item drawn flipped across that axis
//   except during a move (render/rig.js heldOf).
// grips: per grip type, the hand swaps it puts on, and IK (render/rig-grip.js): ik.arm = [upper, lower] joints it bends;
//   ik.end = the part whose point ik.hand (that part's own px) must reach ik.to on the weapon art (spear `grip2`, bow
//   `nock`); arrow / string = draw order of a nocked arrow and the drawn string (in front of the body).
//   T020: align = the IK hand's own axis (its px), turned to lie along the shaft (two-hand: the far fist closes round
//   it); order = draw orders while gripping (the far fist in front of the spear, fingers over the shaft); anchor = the
//   full-draw point { part, at (its px) }: the bow is drawn back to it (the ear) instead of the item's `pull`.
// overlays / views / masks (T019): A011 gear, face details and recolour masks (rigs/rat-raider-gear.js, generated);
//   which groups a rat wears = its fighter's art.gear + its look's detail (data/looks.js), drawn by render/looks.js.
import { OVERLAYS, VIEWS, MASKS } from './rat-raider-gear.js';

const P = 'assets/art/enemies/rat-raider/rig-a010/';
const SLOT = [55.2, 50.8];   // the near grip hand's shaft slot, hand-near px
const RING = [64.8, 62.1];   // the far grip hand's ring of claws (shaft hole), hand-far px
const PINCH = [31.2, 17.2];  // A012 near pinch: thumb and finger meet (canvas [270, 1190]), hand-near px
const EAR = [132, 198];      // full draw: string to the jaw line, under the cheek behind the mouth (head px)

export default {
  id: 'rat-raider',
  scale: 0.25260,   // part px -> screen px (136 px tall, as the standee)
  rootY: 43.144,    // pelvis pivot height above the feet in the master crouch (screen px)
  overlays: OVERLAYS, views: VIEWS, masks: MASKS,
  slots: {
    'one-hand': { parent: 'hand-near', attach: SLOT, order: 830, flip: 'hold' },   // T020 r4: flipped while holding, as drawn when swinging (user's pick)
    'two-hand': { parent: 'hand-near', attach: SLOT, order: 830 },
    bow: { parent: 'hand-far', attach: RING, order: 125 },
  },
  axes: { 'one-hand': -100, 'two-hand': -90, bow: -88 },   // one-hand: the user's pick J (10 deg back of the cut slot: lines up with the knuckles)
  grips: {
    'two-hand': { swap: { 'hand-far': 'hand-far-grip' }, align: -88, order: { 'hand-far': 845 },
      ik: { arm: ['arm-far-upper', 'arm-far-lower'], end: 'hand-far', hand: RING, to: 'grip2' } },
    bow: { swap: { 'hand-far': 'hand-far-grip', 'hand-near': 'hand-near-pinch' }, arrow: 810, string: 805, anchor: { part: 'head', at: EAR },
      ik: { arm: ['arm-near-upper', 'arm-near-lower'], end: 'hand-near', hand: PINCH, to: 'nock' } },
  },
  // T024 sockets (rig standard 9a), from tools/rig_from_source.py --sockets (part px; feet, weapon_tip: render/sockets.js)
  sockets: { hand_near: { part: 'hand-near', at: [44.7, 42.6] }, hand_far: { part: 'hand-far', at: [48.7, 47.6] }, chest: { part: 'torso', at: [169.6, 133.6] }, head_top: { part: 'head', at: [79.7, 0.0] }, mouth: { part: 'head', at: [318.4, 187.1] }, tail_tip: { part: 'tail', at: [0.8, 47.6] }, feet: { parts: ['foot-near', 'foot-far'] }, weapon_tip: { item: 'tip' } },
  parts: {
    'pelvis': { img: P + 'pelvis.png', pivot: [108.8, 44.0], order: 400 },
    'torso': { img: P + 'torso.png', parent: 'pelvis', attach: [108.8, 12.0], pivot: [157.6, 188.0], order: 600, swaps: { 'torso-side': { img: P + 'torso-side.png', offset: [76.8, 8.0] }, 'torso-back': { img: P + 'torso-back.png', offset: [28.4, 8.0] } } },
    'head': { img: P + 'head.png', parent: 'torso', attach: [181.6, 79.2], pivot: [118.4, 227.2], order: 700, swaps: { 'head-neutral': { img: P + 'head-neutral.png', offset: [0.0, 0.0] }, 'head-attack': { img: P + 'head-attack.png', offset: [-2.0, 0.0] }, 'head-hurt': { img: P + 'head-hurt.png', offset: [-3.2, 0.0] }, 'head-effort': { img: P + 'head-effort.png', offset: [2.0, 0.4] }, 'head-ko': { img: P + 'head-ko.png', offset: [1.6, 0.0] }, 'head-back': { img: P + 'head-back.png', offset: [0.4, 16.0] } } },
    'arm-near-upper': { img: P + 'arm-near-upper.png', parent: 'torso', attach: [83.6, 58.0], pivot: [86.8, 46.0], order: 590 },
    'arm-near-lower': { img: P + 'arm-near-lower.png', parent: 'arm-near-upper', attach: [20.8, 70.0], pivot: [43.6, 47.2], order: 820 },
    'hand-near': { img: P + 'hand-near.png', parent: 'arm-near-lower', attach: [7.6, 61.2], pivot: [87.2, 45.2], order: 840, swaps: { 'hand-near-open': { img: P + 'hand-near-open.png', offset: [-6.8, -14.0] }, 'hand-near-fist': { img: P + 'hand-near-fist.png', offset: [10.8, 9.2] }, 'hand-near-grip': { img: P + 'hand-near-grip.png', offset: [0.0, 0.0] },
      // T020: A012's near pinch (A010 canvas, keyed x0.4 like the rest; trim [194, 1147])
      'hand-near-pinch': { img: P + 'hand-near-pinch.png', offset: [0.8, 0.0] } } },
    'arm-far-upper': { img: P + 'arm-far-upper.png', parent: 'torso', attach: [267.6, 118.0], pivot: [32.4, 22.0], order: 110 },
    'arm-far-lower': { img: P + 'arm-far-lower.png', parent: 'arm-far-upper', attach: [77.6, 40.0], pivot: [21.2, 30.8], order: 120 },
    'hand-far': { img: P + 'hand-far.png', parent: 'arm-far-lower', attach: [50.0, 30.8], pivot: [12.0, 60.4], order: 130, swaps: { 'hand-far-open': { img: P + 'hand-far-open.png', offset: [0.0, 0.0] }, 'hand-far-fist': { img: P + 'hand-far-fist.png', offset: [0.8, 18.0] }, 'hand-far-grip': { img: P + 'hand-far-grip.png', offset: [0.4, 20.8] }, 'hand-far-pinch': { img: P + 'hand-far-pinch.png', offset: [-2.4, 22.4] } } },
    'leg-near-upper': { img: P + 'leg-near-upper.png', parent: 'pelvis', attach: [65.6, 50.0], pivot: [158.4, 28.0], order: 510 },
    'leg-near-lower': { img: P + 'leg-near-lower.png', parent: 'leg-near-upper', attach: [38.4, 93.2], pivot: [84.0, 13.2], order: 520 },
    'foot-near': { img: P + 'foot-near.png', parent: 'leg-near-lower', attach: [42.0, 50.8], pivot: [75.6, 8.8], order: 530 },
    'leg-far-upper': { img: P + 'leg-far-upper.png', parent: 'pelvis', attach: [170.4, 44.0], pivot: [73.6, 29.6], order: 210 },
    'leg-far-lower': { img: P + 'leg-far-lower.png', parent: 'leg-far-upper', attach: [118.0, 97.6], pivot: [41.2, 4.8], order: 220 },
    'foot-far': { img: P + 'foot-far.png', parent: 'leg-far-lower', attach: [61.2, 38.8], pivot: [49.6, 10.0], order: 230 },
    'tail': { img: P + 'tail.png', parent: 'pelvis', attach: [-39.2, 46.0], pivot: [173.2, 74.4], order: 300 },
    'scarf-tail': { img: P + 'scarf-tail.png', parent: 'torso', attach: [105.6, 8.0], pivot: [144.0, 62.4], order: 550 },
  },
};
