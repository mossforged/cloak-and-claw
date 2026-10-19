// T029 r2: A021's four items (dagger, hand axe, staff, round shield) as game items: kind 'gear' (the rat body's own
// items, drawn by his rig on the user's grip lines like the hold sheet; not floor pickups, and no rat type carries one in a
// fight yet). The rehearsal moves name the item they are posed with (moves/rat-rehearsal.js `item`, `strap`): the viewer
// and the rehearsal sheet put it in his hand. Art and size: a021-holds.js (keyed at 4x the review size, px 0.25); grip,
// gripEnd and the staff's grip2 from the user's lines (rigs/rat-raider-grip-lines.js, fractions x the image's px); tip =
// the business end (image px); stow as rat-cutlass.js. The shield's grip is the strap (grip type 'shield': the far hand's
// strap, render/strap.js), worn as a second item beside whatever the near hand holds.
import { A021_HOLDS } from './a021-holds.js';
import { ITEMS as LINES } from '../rigs/rat-raider-grip-lines.js';
import { itemLine } from '../rigs/grip-lines.js';

const item = (id, art, extra = {}) => {
  const H = A021_HOLDS[id];
  return { id, name: H.name, kind: 'gear', grip: H.grip, art: { ...H.art, ...itemLine({ ITEMS: LINES }, id, H.size), ...art }, ...extra };
};
export const DAGGER = item('a021-dagger', { tip: [159, 21], stow: 'hip' });
export const AXE = item('a021-axe', { tip: [236, 52], stow: 'hip' });
export const STAFF = item('a021-staff', { tip: [598, 36], stow: 'back' });
export const SHIELD = { ...item('a021-shield', {}), name: 'Round shield' };
