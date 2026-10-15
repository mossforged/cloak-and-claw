// Mouse Fighter cutout rig (parts from A001, sliced by tools/slice_sheet.py at scale 0.5).
// All points are in the part image's own pixels: [x, y] from its top-left.
//   pivot:  the point the part rotates around (its joint).
//   attach: where that pivot sits on the parent image.
//   rest:   degrees that turn the image so its bone hangs straight down (limbs), points
//           forward (sword) or stands up (torso, head). Pose angles are added on top.
//   scale:  per-part size fudge, a number or [across, along] the bone (only this image, not children).
//           The shield is squashed across so it reads as angled, like the standee's.
//   upright: the part ignores its parents' rotation (the shield stays held up whatever the arm does).
//   order:  draw order, low first.
// Facing right; angles in degrees, + = clockwise (torso/head lean forward, hanging limbs swing back).
const P = 'assets/art/heroes/mouse-fighter/rig/';

export default {
  id: 'mouse-fighter',
  scale: 0.32,      // part px -> screen px
  rootY: 33,        // hip height above the feet, screen px, in the stance pose
  parts: {
    torso: { img: P + 'torso.png', pivot: [75, 140], scale: [1.3, 0.95], order: 9 },
    head: { img: P + 'head.png', parent: 'torso', attach: [88, 22], pivot: [95, 138], scale: 1.22, order: 10 },
    'scarf-tail': { img: P + 'scarf-tail.png', parent: 'torso', attach: [42, 26], pivot: [72, 40], order: 8 },
    tail: { img: P + 'tail.png', parent: 'torso', attach: [40, 126], pivot: [122, 100], scale: 0.9, order: 7 },

    'arm-front-upper': { img: P + 'arm-front-upper.png', parent: 'torso', attach: [24, 56], pivot: [75, 18], rest: -30, scale: [1.1, 0.66], order: 12 },
    'arm-front-lower': { img: P + 'arm-front-lower.png', parent: 'arm-front-upper', attach: [18, 118], pivot: [78, 15], rest: -25, scale: [1.1, 0.7], order: 14 },
    sword: { img: P + 'sword.png', parent: 'arm-front-lower', attach: [38, 106], pivot: [30, 32], rest: -41, order: 13 },

    'arm-back-upper': { img: P + 'arm-back-upper.png', parent: 'torso', attach: [124, 50], pivot: [18, 20], rest: 26, scale: [1.1, 0.66], order: 1 },
    'arm-back-lower': { img: P + 'arm-back-lower.png', parent: 'arm-back-upper', attach: [63, 113], pivot: [18, 17], rest: 21, scale: [1.1, 0.7], order: 2 },
    shield: { img: P + 'shield.png', parent: 'arm-back-lower', attach: [55, 108], pivot: [77, 78], scale: [0.55, 0.82], upright: true, order: 11 },

    'leg-back-upper': { img: P + 'leg-back-upper.png', parent: 'torso', attach: [52, 130], pivot: [30, 20], rest: 18, scale: [1, 0.5], order: 3 },
    'leg-back-lower': { img: P + 'leg-back-lower.png', parent: 'leg-back-upper', attach: [65, 125], pivot: [40, 20], scale: [0.95, 0.56], order: 4 },
    'leg-front-upper': { img: P + 'leg-front-upper.png', parent: 'torso', attach: [100, 130], pivot: [62, 22], rest: -20, scale: [1, 0.5], order: 5 },
    'leg-front-lower': { img: P + 'leg-front-lower.png', parent: 'leg-front-upper', attach: [25, 125], pivot: [48, 20], scale: [0.95, 0.56], order: 6 },
  },
};
