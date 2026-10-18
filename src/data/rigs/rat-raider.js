// Rat Raider cutout rig (T026): rebuilt from the setup-pose master (A017) as A018's base parts + A019's whole-limb key
// drawings and two replacement parts (near upper arm, far thigh: rounder caps), on the rig standard. Parts and points
// straight from the importer, one uniform scale, no per-part scale fudges:
//   python3 tools/rig_from_source.py assets/source/A018-rat-parts/rig-source.json \
//     --merge assets/source/A019-rat-key-drawings/rig-source.json --merge assets/source/A022-rat-joint-repair/rig-source.json \
//     --merge assets/source/A023-rat-complete-kit/rig-source.json --id rat-raider --art assets/art/enemies/rat-raider/rig
// T028 r2: A023 rounds 1-2 imported: every torso / pelvis view (rat-raider-views.js), front / shout / drink heads, shoulder
// caps (`cap`), the belt (pelvis child at 640 over the torso; hidden in B), longer feet and thighs (hidden tops), the back
// view's limb cuts, palms / cups / point, smear and mouth arms, and the split grips (`under`: render/grip-split.js).
// T028 r3: A023 round 3 imported the same way (angled back feet and their shins, whole back thumb, back pelvis and far
// thigh without baked tail paint, torso-away redrawn): only those swaps' offsets moved; BQ points in rat-raider-views.js.
// rest 0 = the A017 master: standing straight, arms hanging, fists closed (all his poses start from there). Points are in
// each image's own px; a joint's attach (on the parent) and pivot (on the child) are the same master canvas point.
// order = the standard's depth bands; T026 r2: the near upper arm (and its whole-arm keys) at 590, under the torso's vest
// edge as A010 had it (A018 said 810: its shoulder cap showed over the vest); forearm and hand stay in front (820, 840).
// T026 r5 (rig standard 5b.1, shin over foot): feet at 515 / 215, just under their shins (A018 said 530 / 230: the boot
// top showed over the trouser hem); toe swaps inherit the band. Cover pairs: src/data/rigs/anatomy.js.
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
import { BODY_VIEWS } from './rat-raider-views.js';

const P = 'assets/art/enemies/rat-raider/rig/';
// T028 r2: A023's split grips (5b.2): the handle line through each pair (A023 `grips`), pointed at the item's head: the
// near side grip and the pinch hold the item up out of the upright fist (A023 lists those lines downward), the far grip
// down the fist (the bow's top limb out the other end, as A022), both overhand grips forward along the shaft.
const HANDS = {
  'hand-near-grip': { part: 'hand-near', at: [41.6, 27.2], axis: -90.0 },
  'hand-near-grip-overhand': { part: 'hand-near', at: [48.8, 35.6], axis: 0.0 },
  'hand-near-pinch': { part: 'hand-near', at: [50.8, 56.4], axis: -90.0 },
  'hand-far-grip': { part: 'hand-far', at: [62.8, 72.8], axis: 90.0 },
  'hand-far-grip-overhand': { part: 'hand-far', at: [61.6, 84.8], axis: 0.0 },
  'hand-far-shield': { part: 'hand-far', at: [66.82, 87.01], axis: -5.0 },
  // A023 contact points (no handle): palms, cups, the pointing finger
  'hand-near-palm': { part: 'hand-near', at: [46.4, 57.2], axis: 0.0 },
  'hand-far-palm': { part: 'hand-far', at: [50.0, 74.8], axis: 0.0 },
  'hand-near-cup': { part: 'hand-near', at: [53.6, 57.2], axis: 0.0 },
  'hand-far-cup': { part: 'hand-far', at: [42.0, 76.8], axis: 0.0 },
  'hand-near-point': { part: 'hand-near', at: [69.6, 25.2], axis: 0.0 },
};
const AX = HANDS['hand-near-grip'].axis, SLOT = HANDS['hand-near-grip'].at, RING = HANDS['hand-far-grip'].at;
const OVER = HANDS['hand-far-grip-overhand'], PINCH = HANDS['hand-near-pinch'].at;
const EAR = [132, 198];      // full draw: string to the jaw line, under the cheek behind the mouth (head px, A010's: same head)
// T026: torso gear and body masks wait for A020 (drawn on A010's body); head gear, face details and head masks carry over
export const HIDDEN_GEAR = ['gear-jerkin', 'gear-sash', 'gear-quiver'];
// T028 r2: A023's new heads (front, shout, drink) wear no head gear or face detail until A020 draws them for every view
const NEW_HEADS = ['head-front', 'head-shout', 'head-drink'], PENDING = 'a020-pending';
const onNewHeads = (G) => (G.on === 'head' ? { ...G, views: { ...G.views, ...Object.fromEntries(NEW_HEADS.map((h) => [h, PENDING])) } } : G);
const views = Object.fromEntries(Object.entries(VIEWS).filter(([g]) => !HIDDEN_GEAR.includes(g)).map(([g, G]) => [g, onNewHeads(G)]));
const masks = Object.fromEntries(Object.entries(MASKS).filter(([img]) => !img.endsWith('head-neutral.png') && /\/rig\/head[^/]*\.png$|\/gear\/gear-(hood|helmet|captain)/.test(img)));
// T026 r2: A022 cleaned the back head's islands, so its cut starts 27.6 px further in: its fur mask cropped to match
// (the A010 viewer rig keeps the original)
const BACK = P + 'head-back.png';
masks[BACK] = { ...masks[BACK], fur: 'assets/art/enemies/rat-raider/masks/head-back-a022-fur-mask.png' };

// T028 views: rat-raider-views.js (A023's drawings and joint points)

export default {
  id: 'rat-raider',
  scale: 0.25185,   // part px -> screen px (136 px tall, as the standee and A010)
  rootY: 49.363,    // pelvis pivot height above the feet in the master (screen px)
  overlays: { ...OVERLAYS, [PENDING]: { on: 'head' } }, views, masks,
  bodyViews: BODY_VIEWS,
  springs: { parts: { tail: 0.6, 'tail-2': 0.8, 'tail-3': 1, 'scarf-tail': 0.8 } },   // T028 (gains; numbers in data/rig-motion.js)
  carry: { order: 660 },   // T028 carry band: over the torso (and its gear), under the near arm
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
    'two-hand': { swap: { 'hand-far': 'hand-far-grip-overhand' }, align: OVER.axis, order: { 'hand-far': 845, 'arm-far-lower': 848 }, wrist: 'above',
      ik: { arm: ['arm-far-upper', 'arm-far-lower'], end: 'hand-far', hand: OVER.at, to: 'grip2' } },
    bow: { swap: { 'hand-far': 'hand-far-grip', 'hand-near': 'hand-near-pinch' }, arrow: 810, string: 805, anchor: { part: 'head', at: EAR },
      ik: { arm: ['arm-near-upper', 'arm-near-lower'], end: 'hand-near', hand: PINCH, to: 'nock' } },
  },
  // A018's own sockets (rig-source `sockets`; importer compared them with its derived ones: chest 49 and mouth 114
  // canvas px apart, the rest within 9); feet, weapon_tip: render/sockets.js
  sockets: { hand_near: { part: 'hand-near', at: [41.6, 27.2] }, hand_far: { part: 'hand-far', at: [62.8, 72.8] }, chest: { part: 'torso', at: [132.0, 101.6] }, head_top: { part: 'head', at: [80.0, 0.8] }, mouth: { part: 'head', at: [276.0, 204.0] }, tail_tip: { part: 'tail-3', at: [4.4, 4.0] }, feet: { parts: ['foot-near', 'foot-far'] }, weapon_tip: { item: 'tip' },
    carry: { between: ['hand_near', 'hand_far'] } },   // T028 carry socket (render/carry.js)
  parts: {
    'pelvis': { img: P + 'pelvis.png', pivot: [106.0, 62.0], order: 400, swaps: { 'pelvis-side': { img: P + 'pelvis-side.png', offset: [22.4, 10.0] },
        'pelvis-front': { img: P + 'pelvis-front.png', offset: [-19.2, 10.0] },
        'pelvis-back': { img: P + 'pelvis-back.png', offset: [6.4, 4.0] } } },
    'torso': { img: P + 'torso.png', parent: 'pelvis', attach: [106.8, 30.8], pivot: [126.4, 150.4], order: 600, swaps: { 'torso-side': { img: P + 'torso-side.png', offset: [41.6, -8.0] },
        'torso-back': { img: P + 'torso-back.png', offset: [-77.6, -18.4] },
        'torso-front': { img: P + 'torso-front.png', offset: [8.0, 1.6] },
        'torso-away': { img: P + 'torso-away.png', offset: [16.0, -14.4] },
        'torso-hunched': { img: P + 'torso-hunched.png', offset: [20.0, 9.6] },
        'torso-lean-back': { img: P + 'torso-lean-back.png', offset: [6.0, -14.4] } } },
    'head': { img: P + 'head.png', parent: 'torso', attach: [168.0, 77.6], pivot: [152.0, 240.0], order: 700, swaps: { 'head-attack': { img: P + 'head-attack.png', offset: [-2.0, 0.0] },
        'head-hurt': { img: P + 'head-hurt.png', offset: [-3.2, 0.0] },
        'head-effort': { img: P + 'head-effort.png', offset: [2.0, 0.4] },
        'head-ko': { img: P + 'head-ko.png', offset: [1.6, 0.0] },
        'head-back': { img: P + 'head-back.png', offset: [28.0, 16.0] },
        'head-front': { img: P + 'head-front.png', offset: [-8.0, -26.4] },
        'head-shout': { img: P + 'head-shout.png', offset: [0.0, -14.4] },
        'head-drink': { img: P + 'head-drink.png', offset: [0.0, -25.2] } } },
    'arm-near-upper': { img: P + 'arm-near-upper.png', parent: 'torso', attach: [38.0, 67.2], pivot: [68.4, 48.8], order: 590, swaps: { 'arm-near-cocked': { img: P + 'arm-near-cocked.png', offset: [-27.2, -83.2], hide: ["arm-near-lower", "hand-near"], grip: [61.29, 32.36], axis: 175.2,
        carry: { held: [61.29, 32.36] }, turn: { held: 175.2 - AX } },
        'arm-near-raised': { img: P + 'arm-near-raised.png', offset: [24.0, -118.0], hide: ["arm-near-lower", "hand-near"], grip: [33.53, 32.12], axis: 144.52,
        carry: { held: [20.4, 32.0] }, turn: { held: 135.0 - AX } },
        'arm-near-smear-h': { img: P + 'arm-near-smear-h.png', offset: [36.4, 3.2], hide: ["arm-near-lower", "hand-near"], grip: [248.0, 40.8], axis: 90.0 },
        'arm-near-smear-o': { img: P + 'arm-near-smear-o.png', offset: [40.4, 11.2], hide: ["arm-near-lower", "hand-near"], grip: [148.0, 187.2], axis: 0.0 },
        'arm-near-mouth': { img: P + 'arm-near-mouth.png', offset: [42.4, -44.8], hide: ["arm-near-lower", "hand-near"], grip: [218.0, 44.0], axis: -45.0 },
        'arm-near-upper-back': { img: P + 'arm-near-upper-back.png', offset: [28.4, 12.8] } } },
    'arm-near-lower': { img: P + 'arm-near-lower.png', parent: 'arm-near-upper', attach: [25.2, 103.2], pivot: [41.2, 24.8], order: 820, swaps: { 'arm-near-lower-back': { img: P + 'arm-near-lower-back.png', offset: [9.2, -2.0] } } },
    'hand-near': { img: P + 'hand-near.png', parent: 'arm-near-lower', attach: [22.8, 76.8], pivot: [38.0, 13.2], order: 815, swaps: { 'hand-near-fist': { img: P + 'hand-near-fist.png', offset: [0.0, 0.0] },
        'hand-near-open': { img: P + 'hand-near-open.png', offset: [11.6, 8.8] },
        'hand-near-grip': { img: P + 'hand-near-grip.png', offset: [4.0, -0.4], under: 'hand-near-grip-under' },
        'hand-near-grip-overhand': { img: P + 'hand-near-grip-overhand.png', offset: [40.4, 0.4], under: 'hand-near-grip-overhand-under' },
        'hand-near-pinch': { img: P + 'hand-near-pinch.png', offset: [18.0, 6.4], under: 'hand-near-pinch-under' },
        'hand-near-palm': { img: P + 'hand-near-palm.png', offset: [7.6, 5.2] },
        'hand-near-cup': { img: P + 'hand-near-cup.png', offset: [5.6, 5.2] },
        'hand-near-point': { img: P + 'hand-near-point.png', offset: [9.6, 5.2] },
        'hand-near-back': { img: P + 'hand-near-back.png', offset: [2.8, -9.6] },
        'hand-near-grip-under': { img: P + 'hand-near-grip-under.png', offset: [12.8, 51.2] },
        'hand-near-grip-overhand-under': { img: P + 'hand-near-grip-overhand-under.png', offset: [52.8, 39.2] },
        'hand-near-pinch-under': { img: P + 'hand-near-pinch-under.png', offset: [23.6, 51.2] } } },
    'arm-far-upper': { img: P + 'arm-far-upper.png', parent: 'torso', attach: [200.0, 69.2], pivot: [16.0, 16.4], order: 110, swaps: { 'arm-far-raised-back': { img: P + 'arm-far-raised-back.png', offset: [-70.8, -110.4], hide: ["arm-far-lower", "hand-far"], grip: [75.74, 24.29], axis: -33.07 },
        'arm-far-guard': { img: P + 'arm-far-guard.png', offset: [-74.4, -4.4], hide: ["arm-far-lower", "hand-far"], grip: [18.75, 23.8], axis: 145.19 },
        'arm-far-raised': { img: P + 'arm-far-raised.png', offset: [-16.0, -144.8], hide: ["arm-far-lower", "hand-far"], grip: [33.2, 13.6], axis: 0.0 },
        'arm-far-upper-back': { img: P + 'arm-far-upper-back.png', offset: [-35.2, 0.4] } } },
    'arm-far-lower': { img: P + 'arm-far-lower.png', parent: 'arm-far-upper', attach: [47.2, 76.4], pivot: [23.2, 22.8], order: 120, swaps: { 'arm-far-lower-back': { img: P + 'arm-far-lower-back.png', offset: [-16.8, 4.8] } } },
    'hand-far': { img: P + 'hand-far.png', parent: 'arm-far-lower', attach: [50.8, 71.6], pivot: [42.8, 53.2], order: 115, swaps: { 'hand-far-fist': { img: P + 'hand-far-fist.png', offset: [0.0, 0.0] },
        'hand-far-open': { img: P + 'hand-far-open.png', offset: [8.8, 8.0] },
        'hand-far-grip': { img: P + 'hand-far-grip.png', offset: [33.6, 40.8], under: 'hand-far-grip-under' },
        'hand-far-grip-overhand': { img: P + 'hand-far-grip-overhand.png', offset: [31.2, 82.8], under: 'hand-far-grip-overhand-under' },
        'hand-far-shield': { img: P + 'hand-far-shield.png', offset: [3.6, 4.8] },
        'hand-far-palm': { img: P + 'hand-far-palm.png', offset: [16.0, 40.8] },
        'hand-far-cup': { img: P + 'hand-far-cup.png', offset: [12.0, 40.8] },
        'hand-far-back': { img: P + 'hand-far-back.png', offset: [12.8, 29.6] },
        'hand-far-grip-under': { img: P + 'hand-far-grip-under.png', offset: [12.0, 43.2] },
        'hand-far-grip-overhand-under': { img: P + 'hand-far-grip-overhand-under.png', offset: [5.2, 6.0] } } },
    'leg-near-upper': { img: P + 'leg-near-upper.png', parent: 'pelvis', attach: [51.6, 86.0], pivot: [71.2, 32.0], order: 510, swaps: { 'leg-near-kneeling': { img: P + 'leg-near-kneeling.png', offset: [-88.0, -28.0], hide: ["leg-near-lower", "foot-near"] },
        'leg-near-kneeup': { img: P + 'leg-near-kneeup.png', offset: [24.8, -38.4], hide: ["leg-near-lower", "foot-near"] },
        'leg-near-upper-back': { img: P + 'leg-near-upper-back.png', offset: [17.6, -4.0] } } },
    'leg-near-lower': { img: P + 'leg-near-lower.png', parent: 'leg-near-upper', attach: [49.6, 122.0], pivot: [35.6, 23.6], order: 520, swaps: { 'leg-near-lower-back': { img: P + 'leg-near-lower-back.png', offset: [9.6, 9.6] } } },
    'foot-near': { img: P + 'foot-near.png', parent: 'leg-near-lower', attach: [27.2, 66.8], pivot: [31.6, 69.2], order: 515, swaps: { 'foot-near-toe': { img: P + 'foot-near-toe.png', offset: [-5.2, 0.0] },
        'foot-near-heel': { img: P + 'foot-near-heel.png', offset: [-2.4, -5.6] },
        'foot-near-out': { img: P + 'foot-near-out.png', offset: [-1.6, -22.4] },
        'foot-near-back': { img: P + 'foot-near-back.png', offset: [-0.4, 0.0] } } },
    'leg-far-upper': { img: P + 'leg-far-upper.png', parent: 'pelvis', attach: [156.0, 86.0], pivot: [47.2, 60.0], order: 210, swaps: { 'leg-far-folded': { img: P + 'leg-far-folded.png', offset: [-2.8, 0.0], hide: ["leg-far-lower", "foot-far"] },
        'leg-far-upper-back': { img: P + 'leg-far-upper-back.png', offset: [-6.8, 25.2] } } },
    'leg-far-lower': { img: P + 'leg-far-lower.png', parent: 'leg-far-upper', attach: [54.4, 150.0], pivot: [31.2, 23.6], order: 220, swaps: { 'leg-far-lower-back': { img: P + 'leg-far-lower-back.png', offset: [-6.8, 9.6] } } },
    'foot-far': { img: P + 'foot-far.png', parent: 'leg-far-lower', attach: [31.2, 74.8], pivot: [33.6, 77.2], order: 215, swaps: { 'foot-far-toe': { img: P + 'foot-far-toe.png', offset: [-2.0, 0.0] },
        'foot-far-heel': { img: P + 'foot-far-heel.png', offset: [-1.2, 0.0] },
        'foot-far-back': { img: P + 'foot-far-back.png', offset: [-13.2, 0.0] } } },
    'tail': { img: P + 'tail.png', parent: 'pelvis', attach: [-6.8, 94.0], pivot: [34.4, 30.8], order: 300 },
    'tail-2': { img: P + 'tail-2.png', parent: 'tail', attach: [14.4, 98.0], pivot: [58.8, 16.0], order: 310 },
    'tail-3': { img: P + 'tail-3.png', parent: 'tail-2', attach: [22.0, 66.8], pivot: [48.0, 41.2], order: 320 },
    'scarf-tail': { img: P + 'scarf-tail.png', parent: 'torso', attach: [20.0, 9.6], pivot: [96.0, 23.6], order: 330 },
    'shoulder-near': { img: P + 'shoulder-near.png', parent: 'arm-near-upper', attach: [68.4, 48.8], pivot: [32.0, 37.6], order: 830, cap: true },
    'shoulder-far': { img: P + 'shoulder-far.png', parent: 'arm-far-upper', attach: [16.0, 16.4], pivot: [28.0, 27.6], order: 130, cap: true },
    'belt': { img: P + 'belt.png', parent: 'pelvis', attach: [106.0, 62.0], pivot: [85.6, 56.0], order: 640 },
  },
};
