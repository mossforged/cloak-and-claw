// Breakable prop (T010); fields: see crate.js.
const P = 'assets/art/props/';
export default {
  id: 'barrel', name: 'Barrel',
  art: { img: P + 'barrel.png', px: 0.4, carry: [67, 80], debris: [P + 'barrel-debris-1.png', P + 'barrel-debris-2.png', P + 'barrel-debris-3.png'], debrisPx: 0.46 },
  body: { w: 50, d: 16, h: 64 },
  hp: 4,
  drops: { 'cheese-wedge': 2, 'berry-pie': 1 },
};
