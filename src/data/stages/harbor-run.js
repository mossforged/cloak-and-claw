// Stage (T013): the Harbor Market as a scrolling, layered stage (A007 art). World x runs 0..camera.length; y as in the arena.
// layers (drawn by render/layers.js): far (parallax), back segments end to end, floor tile, decor (props on the back
// edge covering segment joins, low foreground pieces in front of the fighters). Coordinates are world px at parallax 1.
const A = 'assets/art/stages/harbor/';
export default {
  id: 'harbor-run', name: 'Harbor Market',
  backdrop: { sky: ['#6fb0e6', '#d6ecf8'], horizon: 400, sea: ['#4d93c4', '#1c4f7c'] },
  floor: { left: 30, right: 4409, top: 390, bottom: 510 },   // walkable belt over the whole stage; the camera narrows it to the screen
  playerStart: { x: 260, y: 450 },
  // camera (sim/camera.js): view width 960 (config VIEW); follows the player once he passes `follow` px from the screen's
  // left edge, never scrolls back, at most catchUp px/frame (hero walks 2.7); `edge` = how far inside the screen edges
  // fighters are kept; length = stage width.
  camera: { length: 4439, follow: 460, edge: 30, catchUp: 4 },
  layers: {
    far: { src: A + 'far.webp', x: 0, y: 92, parallax: 0.3 },
    // back segments: images end to end in `sequence`, each overlapping the last by `overlap` px; bottom edge at `base`
    back: {
      base: 392, overlap: 4,
      segments: {
        'back-1': { src: A + 'back-1.webp', w: 1119 },   // market entrance arch
        'back-2': { src: A + 'back-2.webp', w: 1090 },   // stalls and the moored ship
        'back-3': { src: A + 'back-3.webp', w: 1123 },   // warehouse doors
      },
      sequence: ['back-1', 'back-2', 'back-3', 'back-1'],
    },
    // floor: one tile (A007 floor, seam cross-faded by tools/tile_fade.py) repeated; top at `y`; shade = black overlay so fighters read
    // backfill = px of the same stone drawn behind the back art's base (darkened by backfillShade): fills the gaps between
    // its uneven feet, which otherwise show the far sea as a blue strip along the lane
    floor: { src: A + 'floor.webp', y: 386, shade: 0.18, backfill: 40, backfillShade: 0.35 },
    // decor pieces: art (anchorX = share of the width at the base point), drawn h px tall with the base at (x, y)
    pieces: {
      post: { src: A + 'front-post.webp', anchorX: 0.5 },
      net: { src: A + 'front-net.webp', anchorX: 0.5 },
      lamp: { src: A + 'front-lamp.webp', anchorX: 0.62 },   // the post under the lantern
    },
    // layer 'back' = standing on the floor's back edge (parallax 1, behind fighters): these cover the segment joins.
    // layer 'front' = parallax `frontParallax`, drawn over the fighters, low and sparse; fade = alpha while a fighter is behind one.
    frontParallax: 1.15, fade: 0.4,
    decor: [
      { piece: 'post', layer: 'back', x: 1117, y: 404, h: 120 },
      { piece: 'lamp', layer: 'back', x: 2203, y: 404, h: 150 },
      { piece: 'post', layer: 'back', x: 3322, y: 404, h: 120 },
      { piece: 'post', layer: 'front', x: 900, y: 560, h: 66 },
      { piece: 'net', layer: 'front', x: 2050, y: 556, h: 52 },
      { piece: 'lamp', layer: 'front', x: 3250, y: 562, h: 78 },
      { piece: 'post', layer: 'front', x: 4300, y: 560, h: 66 },
    ],
  },
  // breakables, as in the arena (x, y on the belt)
  props: [
    { type: 'crate', x: 760, y: 420 },
    { type: 'barrel', x: 1650, y: 488, drops: 'big-fish' },
    { type: 'crate', x: 2560, y: 418, drops: 'plank-club' },
    { type: 'crate', x: 3150, y: 486 },
    { type: 'barrel', x: 3780, y: 420 },
  ],
  // wave zones (sim/zones.js): reaching x (the centre of the locked screen) locks the camera; enemies walk in from the
  // screen edges, at most RULES.enemyCap at once; cleared = unlock + GO. After the last zone, walking to `end` loops the
  // stage tougher (like the arena's wave loop).
  zones: [
    { x: 1000, enemies: ['rat-raider', 'rat-raider', 'rat-raider'] },
    { x: 1900, enemies: ['rat-raider', 'rat-spearman', 'rat-raider', 'rat-raider'] },
    { x: 2780, enemies: ['rat-raider', 'rat-archer', 'rat-raider', 'rat-spearman', 'rat-raider'] },
    { x: 3940, enemies: ['rat-spearman', 'rat-raider', 'rat-raider', 'rat-spearman', 'rat-raider', 'rat-raider'] },   // finale: two types, six rats (5 at once)
  ],
  end: 4300,
  waves: [],
};
