// Breakable prop (T010). Sits on the floor belt as an obstacle; only hero-team hits (and thrown bodies/weapons) break it.
// art: img, px = screen px per image px (T028: carry = image px a rig holds it by, at its carry socket); debris = pieces that fly when it breaks (debrisPx their size).
// body: w = width, d = depth on the belt (blocks movement), h = height (hit area; jumps above it pass over).
// hp: hits it takes. drops: what it leaves on break: an item id, { id: weight } for a weighted pick, or null.
// The stage's prop entry may override drops.
const P = 'assets/art/props/';
export default {
  id: 'crate', name: 'Crate',
  art: { img: P + 'crate.png', px: 0.4, carry: [80, 70], debris: [P + 'crate-debris-1.png', P + 'crate-debris-2.png', P + 'crate-debris-3.png', P + 'crate-debris-4.png'], debrisPx: 0.46 },
  body: { w: 60, d: 18, h: 55 },
  hp: 3,
  drops: { 'cheese-wedge': 3, 'berry-pie': 1 },
};
