// Mouse Fighter's own sword (T023): a hero's gear item, never on the floor. The A002 drawing (keyed x0.4, unchanged),
// fitted to A013's grip hand by Art (assets/source/A013-mouse-fighter-standard/item-fits.json): grip = the hilt point
// in the fist, gripEnd = along the handle toward the blade (A013 handleAxis), px = 1.2748 source->canvas x the rig's
// canvas->screen 0.10358. The rig draws it as its one-hand slot part (rigs/mouse-fighter.js `sword`); floor weapons
// replace it there with the same grip.
export default {
  id: 'mouse-sword', name: 'Sword', kind: 'gear',
  art: { img: 'assets/art/items/mouse-sword.png', px: 0.33012, grip: [164.4, 32.4], gripEnd: [141.6, 52.0] },
  grip: 'one-hand',
};
