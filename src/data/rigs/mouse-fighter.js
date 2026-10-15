// Mouse Fighter cutout rig (three-quarter parts from A002, keyed by tools/key_green.py --scale 0.4).
// All points are in the part image's own pixels: [x, y] from its top-left.
//   pivot:  the point the part rotates around (its joint).
//   attach: where that pivot sits on the parent image.
//   rest:   degrees that turn the image so its bone hangs straight down (limbs), points
//           forward (sword) or stands up (torso, head). Pose angles are added on top.
//   scale:  per-part size fudge, a number or [across, along] the bone (only this image, not children).
//           Negative across mirrors the image (the front boot is drawn toes-back in A002).
//   upright: the part ignores its parents' rotation (the shield stays held up whatever the arm does).
//   order:  draw order, low first.
//   swaps:  alternate drawings a pose can switch to (`swap: { part: name }` in rigs/*-poses.js).
//           offset/scale place the swap image in the part's own pixels, so pivot and attach points
//           stay put: a swap pixel (x, y) lands on offset + scale * (x, y).
// slots: grip type -> the part a held weapon replaces (T010): the weapon is drawn on that part's bone, joint and
//           draw order with its own image, grip point (pivot) and size; the part's own drawing is hidden meanwhile.
// Facing right; angles in degrees, + = clockwise (torso/head lean forward, hanging limbs swing back).
const P = 'assets/art/heroes/mouse-fighter/rig/';

export default {
  id: 'mouse-fighter',
  scale: 0.29,      // part px -> screen px
  rootY: 33,        // hip height above the feet, screen px, in the stance pose
  slots: { 'one-hand': 'sword' },
  parts: {
    torso: { img: P + 'torso.png', pivot: [100, 150], order: 9,
      swaps: { 'torso-back': { img: P + 'torso-back.png', offset: [10, 0] } } },
    head: { img: P + 'head-neutral.png', parent: 'torso', attach: [95, 8], pivot: [140, 170], order: 10,
      swaps: {
        'head-shout': { img: P + 'head-shout.png', offset: [0, -8] },
        'head-hurt': { img: P + 'head-hurt.png', offset: [0, -8] },
      } },
    'scarf-tail': { img: P + 'scarf-tail.png', parent: 'torso', attach: [28, 30], pivot: [62, 25], order: 8 },
    tail: { img: P + 'tail.png', parent: 'torso', attach: [40, 130], pivot: [152, 96], order: 7 },

    'arm-front-upper': { img: P + 'arm-front-upper.png', parent: 'torso', attach: [30, 64], pivot: [58, 16], rest: -45, order: 12 },
    'arm-front-lower': { img: P + 'arm-front-lower.png', parent: 'arm-front-upper', attach: [20, 54], pivot: [58, 16], rest: -32, order: 14 },
    sword: { img: P + 'sword.png', parent: 'arm-front-lower', attach: [24, 70], pivot: [165, 40], rest: -144, order: 13 },

    'arm-back-upper': { img: P + 'arm-back-upper.png', parent: 'torso', attach: [160, 60], pivot: [12, 14], rest: 42, order: 1 },
    'arm-back-lower': { img: P + 'arm-back-lower.png', parent: 'arm-back-upper', attach: [48, 54], pivot: [12, 12], rest: 32, order: 2 },
    shield: { img: P + 'shield.png', parent: 'arm-back-lower', attach: [45, 64], pivot: [60, 85], upright: true, order: 11 },

    'leg-back-upper': { img: P + 'leg-back-upper.png', parent: 'torso', attach: [136, 146], pivot: [16, 12], rest: 24, scale: [1.5, 0.78], order: 4 },
    'leg-back-lower': { img: P + 'leg-back-lower.png', parent: 'leg-back-upper', attach: [46, 78], pivot: [24, 10], rest: 7, scale: [1.3, 1], order: 3 },
    'leg-front-upper': { img: P + 'leg-front-upper.png', parent: 'torso', attach: [64, 146], pivot: [44, 12], rest: -22, scale: [1.5, 0.78], order: 6 },
    'leg-front-lower': { img: P + 'leg-front-lower.png', parent: 'leg-front-upper', attach: [16, 80], pivot: [56, 12], rest: -10, scale: [-1.3, 1], order: 5 },
  },
};
