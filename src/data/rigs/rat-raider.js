// Rat Raider cutout rig (T026): rebuilt from the setup-pose master (A017) as A018's base parts + A019's whole-limb key
// drawings and two replacement parts (near upper arm, far thigh: rounder caps), on the rig standard. Parts and points
// straight from the importer, one uniform scale, no per-part scale fudges:
//   python3 tools/rig_from_source.py assets/source/A018-rat-parts/rig-source.json \
//     --merge assets/source/A019-rat-key-drawings/rig-source.json --id rat-raider --art assets/art/enemies/rat-raider/rig
// rest 0 = the A017 master: standing straight, arms hanging, fists closed (all his poses start from there). Points are in
// each image's own px; a joint's attach (on the parent) and pivot (on the child) are the same master canvas point.
// order = the standard's depth bands; T026 r2: the near upper arm (and its whole-arm keys) at 590, under the torso's vest
// edge as A010 had it (A018 said 810: its shoulder cap showed over the vest); forearm and hand stay in front (820, 840).
// Cuts are keyed without detached islands (importer, T026 r2), on the same trim boxes, so every point here holds.
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
  'hand-near-grip': { part: 'hand-near', at: [44.96, 26.14], axis: -16.0 },
  'hand-near-grip-overhand': { part: 'hand-near', at: [50.6, 39.72], axis: -95.0 },
  'hand-near-pinch': { part: 'hand-near', at: [51.02, 59.06], axis: -100.0 },
  'hand-far-grip': { part: 'hand-far', at: [45.42, 47.42], axis: 85.0 },
  'hand-far-grip-overhand': { part: 'hand-far', at: [48.9, 44.8], axis: -5.0 },
  'hand-far-shield': { part: 'hand-far', at: [54.02, 47.01], axis: -5.0 },
};
const AX = HANDS['hand-near-grip'].axis, SLOT = HANDS['hand-near-grip'].at, RING = HANDS['hand-far-grip'].at;
const OVER = HANDS['hand-far-grip-overhand'], PINCH = HANDS['hand-near-pinch'].at;
const EAR = [132, 198];      // full draw: string to the jaw line, under the cheek behind the mouth (head px, A010's: same head)
// T026: torso gear and body masks wait for A020 (drawn on A010's body); head gear, face details and head masks carry over
export const HIDDEN_GEAR = ['gear-jerkin', 'gear-sash', 'gear-quiver'];
const views = Object.fromEntries(Object.entries(VIEWS).filter(([g]) => !HIDDEN_GEAR.includes(g)));
const masks = Object.fromEntries(Object.entries(MASKS).filter(([img]) => !img.endsWith('head-neutral.png') && /\/rig\/head[^/]*\.png$|\/gear\/gear-(hood|helmet|captain)/.test(img)));
// T026 r2: A022 cleaned the back head's islands, so its cut starts 27.6 px further in: its fur mask cropped to match
// (the A010 viewer rig keeps the original)
const BACK = P + 'head-back.png';
masks[BACK] = { ...masks[BACK], fur: 'assets/art/enemies/rat-raider/masks/head-back-a022-fur-mask.png' };

export default {
  id: 'rat-raider',
  scale: 0.25185,   // part px -> screen px (136 px tall, as the standee and A010)
  rootY: 49.363,    // pelvis pivot height above the feet in the master (screen px)
  overlays: OVERLAYS, views, masks,
  hands: HANDS,
  heldHand: { 'hand-near': 'hand-near-grip' },
  slots: {
    // T026 r2: A022's hands sit under their bracers (815 / 115), so the held item goes just behind the fist (812 / 112)
    'one-hand': { parent: 'hand-near', attach: SLOT, order: 812 },   // T026: no flip: on the grip the curved edge already faces back
    'two-hand': { parent: 'hand-near', attach: SLOT, order: 812 },
    bow: { parent: 'hand-far', attach: RING, order: 112 },
  },
  // T026 r2: A022 measured the far grip's slot pointing down the fist (85); the bow's top limb goes out the other end
  axes: { 'one-hand': AX, 'two-hand': AX, bow: HANDS['hand-far-grip'].axis - 180 },
  grips: {
    'two-hand': { swap: { 'hand-far': 'hand-far-grip-overhand' }, align: OVER.axis, order: { 'hand-far': 845 }, wrist: 'above',
      ik: { arm: ['arm-far-upper', 'arm-far-lower'], end: 'hand-far', hand: OVER.at, to: 'grip2' } },
    bow: { swap: { 'hand-far': 'hand-far-grip', 'hand-near': 'hand-near-pinch' }, arrow: 810, string: 805, anchor: { part: 'head', at: EAR },
      ik: { arm: ['arm-near-upper', 'arm-near-lower'], end: 'hand-near', hand: PINCH, to: 'nock' } },
  },
  // A018's own sockets (rig-source `sockets`; importer compared them with its derived ones: chest 49 and mouth 114
  // canvas px apart, the rest within 9); feet, weapon_tip: render/sockets.js
  sockets: { hand_near: { part: 'hand-near', at: [45.0, 26.1] }, hand_far: { part: 'hand-far', at: [45.4, 47.4] }, chest: { part: 'torso', at: [132.0, 101.6] }, head_top: { part: 'head', at: [80.0, 0.8] }, mouth: { part: 'head', at: [276.0, 204.0] }, tail_tip: { part: 'tail-3', at: [4.4, 4.0] }, feet: { parts: ['foot-near', 'foot-far'] }, weapon_tip: { item: 'tip' } },
  parts: {
    'pelvis': { img: P + 'pelvis.png', pivot: [106.0, 62.0], order: 400 },
    'torso': { img: P + 'torso.png', parent: 'pelvis', attach: [106.8, 30.8], pivot: [126.4, 150.4], order: 600, swaps: { 'torso-side': { img: P + 'torso-side.png', offset: [41.6, -8.0] }, 'torso-back': { img: P + 'torso-back.png', offset: [12.0, 5.2] } } },
    'head': { img: P + 'head.png', parent: 'torso', attach: [168.0, 77.6], pivot: [152.0, 240.0], order: 700, swaps: { 'head-attack': { img: P + 'head-attack.png', offset: [-2.0, 0.0] }, 'head-hurt': { img: P + 'head-hurt.png', offset: [-3.2, 0.0] }, 'head-effort': { img: P + 'head-effort.png', offset: [2.0, 0.4] }, 'head-ko': { img: P + 'head-ko.png', offset: [1.6, 0.0] }, 'head-back': { img: P + 'head-back.png', offset: [28.0, 16.0] } } },
    'arm-near-upper': { img: P + 'arm-near-upper.png', parent: 'torso', attach: [38.0, 67.2], pivot: [68.4, 21.6], order: 590, swaps: { 'arm-near-cocked': { img: P + 'arm-near-cocked.png', offset: [-27.2, -110.4], hide: ['arm-near-lower', 'hand-near'], grip: [61.29, 32.36], axis: 175.2,
        carry: { held: [61.29, 32.36] }, turn: { held: 175.2 - AX } }, 'arm-near-raised': { img: P + 'arm-near-raised.png', offset: [24.0, -145.2], hide: ['arm-near-lower', 'hand-near'], grip: [33.53, 32.12], axis: 144.5,
        carry: { held: [20.4, 32.0] }, turn: { held: 135.0 - AX } } } },
    'arm-near-lower': { img: P + 'arm-near-lower.png', parent: 'arm-near-upper', attach: [25.2, 76.0], pivot: [41.2, 24.8], order: 820 },
    'hand-near': { img: P + 'hand-near.png', parent: 'arm-near-lower', attach: [22.8, 76.8], pivot: [38.0, 13.2], order: 815, swaps: { 'hand-near-fist': { img: P + 'hand-near-fist.png', offset: [0.0, 0.0] }, 'hand-near-open': { img: P + 'hand-near-open.png', offset: [11.6, 8.8] }, 'hand-near-grip': { img: P + 'hand-near-grip.png', offset: [11.2, 5.6] }, 'hand-near-grip-overhand': { img: P + 'hand-near-grip-overhand.png', offset: [16.8, 9.2] }, 'hand-near-pinch': { img: P + 'hand-near-pinch.png', offset: [18.0, 6.4] } } },
    'arm-far-upper': { img: P + 'arm-far-upper.png', parent: 'torso', attach: [200.0, 69.2], pivot: [16.0, 16.4], order: 110, swaps: { 'arm-far-raised-back': { img: P + 'arm-far-raised-back.png', offset: [-70.8, -110.4], hide: ['arm-far-lower', 'hand-far'], grip: [75.74, 24.29], axis: -33.1 }, 'arm-far-guard': { img: P + 'arm-far-guard.png', offset: [-74.4, -4.4], hide: ['arm-far-lower', 'hand-far'], grip: [18.75, 23.8], axis: 145.2 } } },
    'arm-far-lower': { img: P + 'arm-far-lower.png', parent: 'arm-far-upper', attach: [47.2, 76.4], pivot: [23.2, 22.8], order: 120 },
    'hand-far': { img: P + 'hand-far.png', parent: 'arm-far-lower', attach: [50.8, 71.6], pivot: [30.0, 13.2], order: 115, swaps: { 'hand-far-fist': { img: P + 'hand-far-fist.png', offset: [0.0, 0.0] }, 'hand-far-open': { img: P + 'hand-far-open.png', offset: [10.8, 8.0] }, 'hand-far-grip': { img: P + 'hand-far-grip.png', offset: [12.4, 4.4] }, 'hand-far-grip-overhand': { img: P + 'hand-far-grip-overhand.png', offset: [14.4, 5.2] }, 'hand-far-shield': { img: P + 'hand-far-shield.png', offset: [12.8, 4.0] } } },
    'leg-near-upper': { img: P + 'leg-near-upper.png', parent: 'pelvis', attach: [51.6, 86.0], pivot: [71.2, 32.0], order: 510, swaps: { 'leg-near-kneeling': { img: P + 'leg-near-kneeling.png', offset: [-88.0, 0.0], hide: ['leg-near-lower', 'foot-near'] }, 'leg-near-kneeup': { img: P + 'leg-near-kneeup.png', offset: [38.0, -38.4], hide: ['leg-near-lower', 'foot-near'] } } },
    'leg-near-lower': { img: P + 'leg-near-lower.png', parent: 'leg-near-upper', attach: [49.6, 122.0], pivot: [35.6, 23.6], order: 520 },
    'foot-near': { img: P + 'foot-near.png', parent: 'leg-near-lower', attach: [27.2, 66.8], pivot: [31.6, 20.0], order: 530, swaps: { 'foot-near-toe': { img: P + 'foot-near-toe.png', offset: [-5.2, -1.2] } } },
    'leg-far-upper': { img: P + 'leg-far-upper.png', parent: 'pelvis', attach: [156.0, 86.0], pivot: [47.2, 47.2], order: 210, swaps: { 'leg-far-folded': { img: P + 'leg-far-folded.png', offset: [16.4, 16.0], hide: ['leg-far-lower', 'foot-far'] } } },
    'leg-far-lower': { img: P + 'leg-far-lower.png', parent: 'leg-far-upper', attach: [54.4, 137.2], pivot: [31.2, 23.6], order: 220 },
    'foot-far': { img: P + 'foot-far.png', parent: 'leg-far-lower', attach: [31.2, 74.8], pivot: [33.6, 20.4], order: 230, swaps: { 'foot-far-toe': { img: P + 'foot-far-toe.png', offset: [-2.0, -1.2] } } },
    'tail': { img: P + 'tail.png', parent: 'pelvis', attach: [-6.8, 94.0], pivot: [34.4, 30.8], order: 300 },
    'tail-2': { img: P + 'tail-2.png', parent: 'tail', attach: [14.4, 98.0], pivot: [58.8, 16.0], order: 310 },
    'tail-3': { img: P + 'tail-3.png', parent: 'tail-2', attach: [22.0, 66.8], pivot: [48.0, 41.2], order: 320 },
    'scarf-tail': { img: P + 'scarf-tail.png', parent: 'torso', attach: [20.0, 9.6], pivot: [96.0, 23.6], order: 330 },
  },
};
