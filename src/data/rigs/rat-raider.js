// Rat Raider cutout rig (T026): rebuilt from the setup-pose master (A017) as A018's base parts + A019's whole-limb key
// drawings and two replacement parts (near upper arm, far thigh: rounder caps), on the rig standard. Parts and points
// straight from the importer, one uniform scale, no per-part scale fudges:
//   python3 tools/rig_from_source.py assets/source/A018-rat-parts/rig-source.json \
//     --merge assets/source/A019-rat-key-drawings/rig-source.json --id rat-raider --art assets/art/enemies/rat-raider/rig
// rest 0 = the A017 master: standing straight, arms hanging, fists closed (all his poses start from there). Points are in
// each image's own px; a joint's attach (on the parent) and pivot (on the child) are the same master canvas point.
// order = the standard's depth bands (A018 needs no exceptions: the near arm draws over the torso at 810-840).
// Tail: three segments (A018 tail-1 is the standard's `tail`, tail-2 and tail-3 hang off it).
// The old A010 rig is kept for the viewer's compare slot only (rigs/a010/). Same field meanings as rigs/mouse-fighter.js.
// hands: the importer's grips (A018 `grips`): each grip drawing's slot centre (hand part px) and the direction it holds a
//   handle toward the item's head. heldHand (T026): A018's default hands are fists; the near one holds its item in the
//   side grip drawing (a pose may name another). A grip mode with its own drawing (overhand) uses that drawing's slot.
// slots / axes / grips: as rigs/a010/rat-raider.js (T018-T020), on A018's grip drawings. The spear's far fist closes
//   overhand on the shaft (hand-far-grip-overhand, A018's slot axis along it), the bow sits in the far grip fist.
// Whole-arm swaps (A019 hide / itemGrip / slotDirection): the drawing replaces the forearm and hand and carries the held
//   item at its fist (`carry`), turned so the handle runs along that fist's slot (`turn`).
// overlays / views / masks: A011's head gear and face details ride the heads unchanged (A018 heads are A010's pixel for
//   pixel, moved by A017's offset with the rest of the body, so their offsets in head px hold). The torso gear (jerkin,
//   sash, quiver) and every body mask were drawn for A010's torso and limbs: hidden until A020 refits them.
import { OVERLAYS, VIEWS, MASKS } from './rat-raider-gear.js';

const P = 'assets/art/enemies/rat-raider/rig/';
const HANDS = {
  'hand-near-grip': { part: 'hand-near', at: [54.8, 51.6], axis: -45.0 },
  'hand-near-grip-overhand': { part: 'hand-near', at: [45.6, 54.8], axis: 0.0 },
  'hand-near-pinch': { part: 'hand-near', at: [45.6, 59.2], axis: -45.0 },
  'hand-far-grip': { part: 'hand-far', at: [60.0, 52.0], axis: -45.0 },
  'hand-far-grip-overhand': { part: 'hand-far', at: [51.6, 55.6], axis: 0.0 },
  'hand-far-shield': { part: 'hand-far', at: [51.6, 60.4], axis: 0.0 },
};
const AX = HANDS['hand-near-grip'].axis, SLOT = HANDS['hand-near-grip'].at, RING = HANDS['hand-far-grip'].at;
const OVER = HANDS['hand-far-grip-overhand'], PINCH = HANDS['hand-near-pinch'].at;
const EAR = [132, 198];      // full draw: string to the jaw line, under the cheek behind the mouth (head px, A010's: same head)
// T026: torso gear and body masks wait for A020 (drawn on A010's body); head gear, face details and head masks carry over
export const HIDDEN_GEAR = ['gear-jerkin', 'gear-sash', 'gear-quiver'];
const views = Object.fromEntries(Object.entries(VIEWS).filter(([g]) => !HIDDEN_GEAR.includes(g)));
const masks = Object.fromEntries(Object.entries(MASKS).filter(([img]) => !img.endsWith('head-neutral.png') && /\/rig\/head[^/]*\.png$|\/gear\/gear-(hood|helmet|captain)/.test(img)));

export default {
  id: 'rat-raider',
  scale: 0.25185,   // part px -> screen px (136 px tall, as the standee and A010)
  rootY: 49.363,    // pelvis pivot height above the feet in the master (screen px)
  overlays: OVERLAYS, views, masks,
  hands: HANDS,
  heldHand: { 'hand-near': 'hand-near-grip' },
  slots: {
    'one-hand': { parent: 'hand-near', attach: SLOT, order: 830 },   // T026: no flip: on A018's grip the curved edge already faces back
    'two-hand': { parent: 'hand-near', attach: SLOT, order: 830 },
    bow: { parent: 'hand-far', attach: RING, order: 125 },
  },
  axes: { 'one-hand': AX, 'two-hand': AX, bow: HANDS['hand-far-grip'].axis },
  grips: {
    'two-hand': { swap: { 'hand-far': 'hand-far-grip-overhand' }, align: OVER.axis, order: { 'hand-far': 845 }, wrist: 'above',
      ik: { arm: ['arm-far-upper', 'arm-far-lower'], end: 'hand-far', hand: OVER.at, to: 'grip2' } },
    bow: { swap: { 'hand-far': 'hand-far-grip', 'hand-near': 'hand-near-pinch' }, arrow: 810, string: 805, anchor: { part: 'head', at: EAR },
      ik: { arm: ['arm-near-upper', 'arm-near-lower'], end: 'hand-near', hand: PINCH, to: 'nock' } },
  },
  // A018's own sockets (rig-source `sockets`; importer compared them with its derived ones: chest 49 and mouth 114
  // canvas px apart, the rest within 9); feet, weapon_tip: render/sockets.js
  sockets: { hand_near: { part: 'hand-near', at: [54.8, 51.6] }, hand_far: { part: 'hand-far', at: [60.0, 52.0] }, chest: { part: 'torso', at: [122.0, 108.0] }, head_top: { part: 'head', at: [80.0, 0.8] }, mouth: { part: 'head', at: [276.0, 204.0] }, tail_tip: { part: 'tail-3', at: [4.4, 4.0] }, feet: { parts: ['foot-near', 'foot-far'] }, weapon_tip: { item: 'tip' } },
  parts: {
    'pelvis': { img: P + 'pelvis.png', pivot: [123.2, 62.0], order: 400 },
    'torso': { img: P + 'torso.png', parent: 'pelvis', attach: [124.0, 30.8], pivot: [116.4, 156.8], order: 600, swaps: { 'torso-side': { img: P + 'torso-side.png', offset: [31.6, -1.6] }, 'torso-back': { img: P + 'torso-back.png', offset: [2.0, 11.6] } } },
    'head': { img: P + 'head.png', parent: 'torso', attach: [158.0, 84.0], pivot: [152.0, 240.0], order: 700, swaps: { 'head-attack': { img: P + 'head-attack.png', offset: [-2.0, 0.0] }, 'head-hurt': { img: P + 'head-hurt.png', offset: [-3.2, 0.0] }, 'head-effort': { img: P + 'head-effort.png', offset: [2.0, 0.4] }, 'head-ko': { img: P + 'head-ko.png', offset: [1.6, 0.0] }, 'head-back': { img: P + 'head-back.png', offset: [0.4, 16.0] } } },
    'arm-near-upper': { img: P + 'arm-near-upper.png', parent: 'torso', attach: [28.0, 73.6], pivot: [68.4, 52.0], order: 810, swaps: { 'arm-near-cocked': { img: P + 'arm-near-cocked.png', offset: [-27.2, -70.8], hide: ['arm-near-lower', 'hand-near'], grip: [97.2, 20.4], axis: -135.0,
        carry: { held: [97.2, 20.4] }, turn: { held: -135.0 - AX } }, 'arm-near-raised': { img: P + 'arm-near-raised.png', offset: [31.2, -136.4], hide: ['arm-near-lower', 'hand-near'], grip: [20.4, 32.0], axis: 135.0,
        carry: { held: [20.4, 32.0] }, turn: { held: 135.0 - AX } } } },
    'arm-near-lower': { img: P + 'arm-near-lower.png', parent: 'arm-near-upper', attach: [25.2, 106.4], pivot: [74.4, 24.8], order: 820 },
    'hand-near': { img: P + 'hand-near.png', parent: 'arm-near-lower', attach: [56.0, 76.8], pivot: [38.0, 20.0], order: 840, swaps: { 'hand-near-fist': { img: P + 'hand-near-fist.png', offset: [0.0, 0.0] }, 'hand-near-open': { img: P + 'hand-near-open.png', offset: [-0.4, 0.0] }, 'hand-near-grip': { img: P + 'hand-near-grip.png', offset: [9.6, 0.0] }, 'hand-near-grip-overhand': { img: P + 'hand-near-grip-overhand.png', offset: [10.0, 0.0] }, 'hand-near-pinch': { img: P + 'hand-near-pinch.png', offset: [10.8, 0.0] } } },
    'arm-far-upper': { img: P + 'arm-far-upper.png', parent: 'torso', attach: [190.0, 75.6], pivot: [39.2, 19.6], order: 110, swaps: { 'arm-far-raised-back': { img: P + 'arm-far-raised-back.png', offset: [-47.6, -76.4], hide: ['arm-far-lower', 'hand-far'], grip: [88.58, 19.62], axis: -115.0 }, 'arm-far-guard': { img: P + 'arm-far-guard.png', offset: [-12.4, -24.0], hide: ['arm-far-lower', 'hand-far'], grip: [31.76, 25.07], axis: -150.0 } } },
    'arm-far-lower': { img: P + 'arm-far-lower.png', parent: 'arm-far-upper', attach: [70.4, 79.6], pivot: [23.2, 22.8], order: 120 },
    'hand-far': { img: P + 'hand-far.png', parent: 'arm-far-lower', attach: [50.8, 71.6], pivot: [44.4, 19.6], order: 130, swaps: { 'hand-far-fist': { img: P + 'hand-far-fist.png', offset: [0.0, 0.0] }, 'hand-far-open': { img: P + 'hand-far-open.png', offset: [8.8, 0.0] }, 'hand-far-grip': { img: P + 'hand-far-grip.png', offset: [18.8, 0.0] }, 'hand-far-grip-overhand': { img: P + 'hand-far-grip-overhand.png', offset: [17.6, 0.0] }, 'hand-far-shield': { img: P + 'hand-far-shield.png', offset: [18.4, 0.0] } } },
    'leg-near-upper': { img: P + 'leg-near-upper.png', parent: 'pelvis', attach: [68.8, 86.0], pivot: [71.2, 32.0], order: 510, swaps: { 'leg-near-kneeling': { img: P + 'leg-near-kneeling.png', offset: [-88.0, 0.0], hide: ['leg-near-lower', 'foot-near'] }, 'leg-near-kneeup': { img: P + 'leg-near-kneeup.png', offset: [38.0, -38.4], hide: ['leg-near-lower', 'foot-near'] } } },
    'leg-near-lower': { img: P + 'leg-near-lower.png', parent: 'leg-near-upper', attach: [49.6, 122.0], pivot: [35.6, 23.6], order: 520 },
    'foot-near': { img: P + 'foot-near.png', parent: 'leg-near-lower', attach: [27.2, 66.8], pivot: [31.6, 20.0], order: 530, swaps: { 'foot-near-toe': { img: P + 'foot-near-toe.png', offset: [-5.2, -1.2] } } },
    'leg-far-upper': { img: P + 'leg-far-upper.png', parent: 'pelvis', attach: [173.2, 86.0], pivot: [47.2, 47.2], order: 210, swaps: { 'leg-far-folded': { img: P + 'leg-far-folded.png', offset: [16.4, 16.0], hide: ['leg-far-lower', 'foot-far'] } } },
    'leg-far-lower': { img: P + 'leg-far-lower.png', parent: 'leg-far-upper', attach: [54.4, 137.2], pivot: [50.0, 23.6], order: 220 },
    'foot-far': { img: P + 'foot-far.png', parent: 'leg-far-lower', attach: [50.0, 74.8], pivot: [33.6, 20.4], order: 230, swaps: { 'foot-far-toe': { img: P + 'foot-far-toe.png', offset: [-2.0, -1.2] } } },
    'tail': { img: P + 'tail.png', parent: 'pelvis', attach: [10.4, 94.0], pivot: [34.4, 14.0], order: 300 },
    'tail-2': { img: P + 'tail-2.png', parent: 'tail', attach: [14.4, 81.2], pivot: [58.8, 16.0], order: 310 },
    'tail-3': { img: P + 'tail-3.png', parent: 'tail-2', attach: [22.0, 66.8], pivot: [48.0, 41.2], order: 320 },
    'scarf-tail': { img: P + 'scarf-tail.png', parent: 'torso', attach: [10.0, 16.0], pivot: [96.0, 23.6], order: 330 },
  },
};
