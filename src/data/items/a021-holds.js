// A021's four items (dagger, hand axe, staff, buckler), game-ready for the hold sheet only (T028 r4: the user drew their
// grip lines; tools/hold-lines-sheet.mjs): not floor items or kits yet (no moves; the flexibility test wires them, T029).
// Keyed and trimmed to the alpha box (tools/key_green.py --scale 4 x weapons.json reviewScale), so the user's fractions
// of the review-size image hold on them; px 0.25 = their review size on screen. size = the image's px.
const P = 'assets/art/items/';
export const A021_HOLDS = {
  'a021-dagger': { name: 'Dagger', art: { img: P + 'a021-dagger.png', px: 0.25 }, size: [160, 41], grip: 'one-hand' },
  'a021-axe': { name: 'Hand axe', art: { img: P + 'a021-axe.png', px: 0.25 }, size: [240, 92], grip: 'one-hand' },
  'a021-staff': { name: 'Staff', art: { img: P + 'a021-staff.png', px: 0.25 }, size: [600, 106], grip: 'two-hand' },
  'a021-shield': { name: 'Buckler', art: { img: P + 'a021-shield.png', px: 0.25 }, size: [182, 192], grip: 'shield' },
};
