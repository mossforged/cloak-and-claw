// Rat Raider cutout rig (T011): A004 body/arms/torso/tail/bandana/cutlass + grip/pinch forearms, A005 heads and legs,
// all cut from one 1536x2304 canvas and keyed by tools/key_green.py --scale 0.4. Points were measured on that canvas,
// so a joint's attach (on the parent) and pivot (on the child) are the same canvas point, except the near elbow, where
// the forearm is pulled up onto the end of the upper arm (A004's gap). rest = minus the bone's angle in the reference,
// so all-zero joints redraw the A005 reference; poses (rat-raider-poses.js) bend him into his fighting crouch.
// Same field meanings as rigs/mouse-fighter.js. "front" = the near limb (behind his body as he faces right), "back" = far.
// T011 round 2 (user: "not crouching", "arms and legs are skinny"; variant C): legs drawn ~1.5x thicker and 0.75x shorter, arms
// ~1.4x thicker, head 1.15x, torso 1.1x, closer to the art bible's chunky proportions. A stopgap: matching the standee needs parts
// drawn to its proportions (lead's call).
// slots: grip type -> where a held weapon goes. A string replaces that part's drawing (the cutlass); an object adds the
//   weapon as a new part on `parent` at `attach` (the far fist, for the bow).
// grips: per grip type, the far forearm swaps to a closed fist and a second hand is placed by IK (render/rig-grip.js):
//   ik.arm = [upper, lower] joints it bends; ik.hand = the hand's point in the lower arm's own px (pivot space, whichever drawing shows);
//   hide = parts not drawn meanwhile (the cutlass while the near hand draws a bow string);
//   ik.to = the point on the weapon art it must reach (kit art: `grip2` on a spear shaft, `nock` on a bow string).
const P = 'assets/art/enemies/rat-raider/rig/';

export default {
  id: 'rat-raider',
  scale: 0.3,       // part px -> screen px
  rootY: 26,        // hip height above the feet in the crouch stance (screen px)
  slots: {
    'one-hand': 'sword',
    'two-hand': 'sword',
    bow: { parent: 'arm-back-lower', attach: [55, 60], order: 2.5 },
  },
  grips: {
    'two-hand': { swap: { 'arm-back-lower': 'arm-back-lower-grip' }, ik: { arm: ['arm-back-upper', 'arm-back-lower'], hand: [55, 60], to: 'grip2' } },
    bow: { swap: { 'arm-back-lower': 'arm-back-lower-grip' }, hide: ['sword'], ik: { arm: ['arm-front-upper', 'arm-front-lower'], hand: [55, 88], to: 'nock' } },
  },
  parts: {
    torso: { img: P + 'torso.png', pivot: [82, 189], scale: 1.1, order: 9, swaps: { 'torso-back': { img: P + 'torso-back.png', offset: [10.4, 0] } } },
    head: { img: P + 'head-neutral.png', parent: 'torso', attach: [92, 35], pivot: [78, 146], scale: 1.15, order: 10,
      swaps: {
        'head-snarl': { img: P + 'head-snarl.png', offset: [0.8, -3.2] },
        'head-hurt': { img: P + 'head-hurt.png', offset: [0, 0] },
      } },
    'scarf-tail': { img: P + 'scarf-tail.png', parent: 'head', attach: [30, 96], pivot: [94, 39], scale: 1.15, order: 8 },
    tail: { img: P + 'tail.png', parent: 'torso', attach: [36, 119], pivot: [88, 16], scale: 1.1, order: 3 },

    'arm-front-upper': { img: P + 'arm-front-upper.png', parent: 'torso', attach: [28, 27], pivot: [45, 25], rest: -27, scale: [1.45, 0.95], order: 12 },
    'arm-front-lower': { img: P + 'arm-front-lower.png', parent: 'arm-front-upper', attach: [13, 89], pivot: [14, 11], rest: 25, scale: [1.4, 0.95], order: 14 },
    sword: { img: P + 'sword.png', parent: 'arm-front-lower', attach: [51, 90], pivot: [32, 36], rest: -47, order: 13 },

    'arm-back-upper': { img: P + 'arm-back-upper.png', parent: 'torso', attach: [148, 47], pivot: [7, 6], rest: 33, scale: [1.45, 0.95], order: 1 },
    'arm-back-lower': { img: P + 'arm-back-lower.png', parent: 'arm-back-upper', attach: [38, 54], pivot: [7, 9], rest: 55, scale: [1.4, 0.95], order: 2,
      swaps: {
        'arm-back-lower-grip': { img: P + 'arm-back-lower-grip.png', offset: [14.4, 0] },     // closed fist (spear shaft, bow grip)
        'arm-back-lower-pinch': { img: P + 'arm-back-lower-pinch.png', offset: [2.4, 0] },   // string pinch (unused yet)
      } },

    'leg-back-upper': { img: P + 'leg-back-upper.png', parent: 'torso', attach: [132, 185], pivot: [14, 12], rest: 36, scale: [1.55, 0.74], order: 5 },
    'leg-back-lower': { img: P + 'leg-back-lower.png', parent: 'leg-back-upper', attach: [66, 84], pivot: [21, 6], rest: 6, scale: [1.45, 0.76], order: 4 },
    'leg-front-upper': { img: P + 'leg-front-upper.png', parent: 'torso', attach: [35, 193], pivot: [73, 7], rest: -43, scale: [1.55, 0.74], order: 7 },
    'leg-front-lower': { img: P + 'leg-front-lower.png', parent: 'leg-front-upper', attach: [8, 75], pivot: [38, 7], rest: -11, scale: [1.45, 0.76], order: 6 },
  },
};

// A008 gear overlays (same canvas): pinned to the head or torso at their crop corner, no joint of their own.
const SC = { head: 1.15, torso: 1.1 };   // drawn at their parent's scale
const pin = (img, parent, attach, order) => ({ img: P + img, parent, attach, pivot: [0, 0], scale: SC[parent], order });
export const GEAR = {
  hood: pin('gear-hood.png', 'head', [-1.6, -2], 10.5),
  helmet: pin('gear-helmet.png', 'head', [19.2, -3.6], 10.5),
  hat: pin('gear-captain-hat.png', 'head', [-15.6, -60.4], 10.5),
  quiver: pin('gear-quiver.png', 'torso', [-78.8, -11.6], 0.5),
  jerkin: pin('gear-jerkin.png', 'torso', [-0.4, 5.2], 9.5),
  sash: pin('gear-sash.png', 'torso', [-13.2, 127.6], 9.6),
};
