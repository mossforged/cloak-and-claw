// Mouse Fighter cutout rig (T023): A013 on the rig standard (docs/design/rig-standard.md): standard part names, separate
// pelvis, hands and feet, a full swap library. Parts and points straight from A013's rig-source.json via the importer
// (python3 tools/rig_from_source.py assets/source/A013-mouse-fighter-standard/rig-source.json --id mouse-fighter
//  --art assets/art/heroes/mouse-fighter/rig --height 130): keyed at x0.4, one uniform scale, rest 0 = the A013 master
// pose (his standee stance: sword cocked up behind, shield out front). No per-part scale fudges. Points are in each
// image's own px; a joint's attach (on the parent) and pivot (on the child) are the same master canvas point. order =
// the standard's depth bands; A013's exception: the near upper arm (590) and forearm (580) sit under the torso (600) at
// rest to hide the sleeve seam (poses lift them where the arm crosses in front). Same field meanings as rigs/rat-raider.js.
// The default hand drawings are the grip hands (A013: hand-near = hand-near-grip, hand-far = the shield/grip fist).
// Sword and shield (T023) are his gear items (items/mouse-sword.js, mouse-shield.js), drawn as parts in the grip fists:
//   sword = the one-hand slot (a floor weapon replaces it there, same grip); its handle runs through hand-near's slot
//   (axes['one-hand'], A013 grips); shield strapped on the far fist (strap along the fist's slot).
// Whole-arm swaps (A013 hide / itemGrip / slotDirection): the drawing replaces the forearm and hand, and carries the item
//   at its fist (`carry`), turned so the handle runs along that fist's slot (`turn`).
import SWORD from '../items/mouse-sword.js';
import SHIELD from '../items/mouse-shield.js';

const P = 'assets/art/heroes/mouse-fighter/rig/';
const SCALE = 0.25896;
const D = 180 / Math.PI;
const handle = (A) => Math.atan2(A.gripEnd[1] - A.grip[1], A.gripEnd[0] - A.grip[0]) * D;
// A013 grips (importer's hands): slot centre (part px) and the direction it holds a handle toward the item's head
const HANDS = {
  'hand-near-grip': { part: 'hand-near', at: [43.2, 42.0], axis: -108.62 },
  'hand-far-grip': { part: 'hand-far', at: [54.4, 37.2], axis: -90.0 },
  'hand-far-shield': { part: 'hand-far', at: [54.4, 37.2], axis: 90.0 },
};
const AX = HANDS['hand-near-grip'].axis, SHIELD_AX = HANDS['hand-far-shield'].axis;
// a fist's slot is a line: turn by the smaller way (the shield's strap reads the same either way up)
const turnTo = (to, from) => ((((to - from) % 180) + 270) % 180) - 90;
const item = (A, parent, at, axis, order) => ({ img: A.img, parent, attach: at, pivot: A.grip, rest: axis - handle(A), scale: A.px / SCALE, order });

export default {
  id: 'mouse-fighter',
  scale: SCALE,     // part px -> screen px (130 px tall, as before)
  rootY: 40.398,    // pelvis pivot height above the feet in the master stance (screen px)
  hands: HANDS,
  slots: { 'one-hand': 'sword' },
  emptyHand: { 'hand-near': 'hand-near-open' },   // nothing in the sword hand (sheathed, thrown, broken): open, not a hollow grip
  axes: { 'one-hand': AX },
  parts: {
    'head': { img: P + 'head.png', parent: 'torso', attach: [159.2, 27.2], pivot: [176.0, 205.2], order: 700, swaps: { 'head-neutral': { img: P + 'head-neutral.png', offset: [0.0, 0.0] }, 'head-attack': { img: P + 'head-attack.png', offset: [4.0, 1.6] }, 'head-hurt': { img: P + 'head-hurt.png', offset: [3.2, 1.6] }, 'head-effort': { img: P + 'head-effort.png', offset: [4.0, 1.2] }, 'head-ko': { img: P + 'head-ko.png', offset: [3.2, 1.6] }, 'head-back': { img: P + 'head-back.png', offset: [-7.2, -2.4] } } },
    'torso': { img: P + 'torso.png', parent: 'pelvis', attach: [118.8, 0.8], pivot: [121.6, 140.0], order: 600, swaps: { 'torso-back': { img: P + 'torso-back.png', offset: [-0.4, -6.8], hide: ['scarf-tail'] }, 'torso-side': { img: P + 'torso-side.png', offset: [-22.8, 1.6], hide: ['scarf-tail'] } } },
    'pelvis': { img: P + 'pelvis.png', pivot: [116.4, 28.8], order: 400 },
    'arm-near-upper': { img: P + 'arm-near-upper.png', parent: 'torso', attach: [65.6, 58.4], pivot: [63.2, 56.8], order: 590, swaps: { 'arm-near-raised': { img: P + 'arm-near-raised.png', offset: [41.2, -57.6], hide: ['arm-near-lower', 'hand-near'], grip: [28.4, 21.2], axis: -90.0,
        carry: { sword: [28.4, 21.2] }, turn: { sword: turnTo(-90, AX) } } } },
    'arm-near-lower': { img: P + 'arm-near-lower.png', parent: 'arm-near-upper', attach: [4.8, 37.2], pivot: [42.0, 40.0], order: 580 },
    'hand-near': { img: P + 'hand-near.png', parent: 'arm-near-lower', attach: [15.6, 28.4], pivot: [70.4, 45.2], order: 840, swaps: { 'hand-near-grip': { img: P + 'hand-near-grip.png', offset: [0.0, 0.0] }, 'hand-near-open': { img: P + 'hand-near-open.png', offset: [-23.6, -5.6] }, 'hand-near-fist': { img: P + 'hand-near-fist.png', offset: [-15.2, 2.0] } } },
    'arm-far-upper': { img: P + 'arm-far-upper.png', parent: 'torso', attach: [207.6, 66.0], pivot: [20.0, 14.8], order: 110, swaps: { 'arm-far-guard': { img: P + 'arm-far-guard.png', offset: [-62.4, -59.6], hide: ['arm-far-lower', 'hand-far'], grip: [22.8, 22.4], axis: -90.0,
        carry: { shield: [22.8, 22.4] }, turn: { shield: turnTo(-90, SHIELD_AX) } } } },
    'arm-far-lower': { img: P + 'arm-far-lower.png', parent: 'arm-far-upper', attach: [33.6, 49.6], pivot: [6.8, 3.6], order: 120 },
    'hand-far': { img: P + 'hand-far.png', parent: 'arm-far-lower', attach: [9.2, 17.2], pivot: [7.6, 44.4], order: 140, swaps: { 'hand-far-shield': { img: P + 'hand-far-shield.png', offset: [0.0, 0.0] }, 'hand-far-open': { img: P + 'hand-far-open.png', offset: [-2.0, -8.0] }, 'hand-far-fist': { img: P + 'hand-far-fist.png', offset: [-0.4, 0.0] }, 'hand-far-grip': { img: P + 'hand-far-grip.png', offset: [0.0, 0.0] } } },
    'leg-near-upper': { img: P + 'leg-near-upper.png', parent: 'pelvis', attach: [59.6, 52.4], pivot: [76.8, 23.2], order: 530 },
    'leg-near-lower': { img: P + 'leg-near-lower.png', parent: 'leg-near-upper', attach: [22.4, 75.6], pivot: [38.4, 23.2], order: 520 },
    'foot-near': { img: P + 'foot-near.png', parent: 'leg-near-lower', attach: [29.6, 58.0], pivot: [42.4, 15.6], order: 510, swaps: { 'foot-near-out': { img: P + 'foot-near-out.png', offset: [-32.8, -11.2] } } },
    'leg-far-upper': { img: P + 'leg-far-upper.png', parent: 'pelvis', attach: [186.8, 62.0], pivot: [26.0, 23.2], order: 230 },
    'leg-far-lower': { img: P + 'leg-far-lower.png', parent: 'leg-far-upper', attach: [45.6, 71.2], pivot: [39.2, 22.4], order: 220 },
    'foot-far': { img: P + 'foot-far.png', parent: 'leg-far-lower', attach: [42.0, 53.2], pivot: [30.8, 15.2], order: 210 },
    'tail': { img: P + 'tail.png', parent: 'pelvis', attach: [5.2, 50.0], pivot: [162.8, 82.4], order: 300 },
    // scarf-tail: A013 painted the scarf as two pieces (knot behind the neck, the streaming tail) with the sword arm
    // covering the gap between them; split (tools/split_pieces.py) so the tail hangs off the knot's lower end and stays
    // joined whatever the arm does (T023 stopgap until Art joins them; the tail rides 15 px higher than in the master).
    'scarf-tail': { img: P + 'scarf-knot.png', parent: 'torso', attach: [53.6, 12.4], pivot: [209.6, 44.0], order: 590 },
    'scarf-tail-2': { img: P + 'scarf-tail-2.png', parent: 'scarf-tail', attach: [165, 40], pivot: [100, 98], order: 589 },
    sword: item(SWORD.art, 'hand-near', HANDS['hand-near-grip'].at, AX, 830),        // under the fist's fingers (840)
    shield: item(SHIELD.art, 'hand-far', HANDS['hand-far-shield'].at, SHIELD_AX, 150),  // its rim over the far fist (140)
  },
};
