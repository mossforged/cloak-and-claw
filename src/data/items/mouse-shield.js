// Mouse Fighter's round shield (T023): a hero's gear item, never on the floor. The A002 drawing (keyed x0.4, unchanged),
// strapped on A013's far fist (item-fits.json): grip = the strap point the fist closes on (left rim, the inner strap is
// hidden behind the face), gripEnd = down the strap, px = 1.1473 source->canvas x 0.10358 canvas->screen. Drawn as the
// rig's `shield` part on hand-back (rigs/mouse-fighter.js).
export default {
  id: 'mouse-shield', name: 'Round shield', kind: 'gear',
  art: { img: 'assets/art/items/mouse-shield.png', px: 0.29711, grip: [9.6, 88.0], gripEnd: [9.6, 102.0] },
  grip: 'shield',
};
