// The rebuilt rat's gear (T032): A020 round 3, imported by tools/gear_swaps_from_source.py (rat-raider-gear-a020.js),
// with A011's face details kept on the heads they were drawn for (rat-raider-gear.js).
// dress / dressed: whole-drawing gear (hood, helmet, captain hat, jerkin; the ear notch on the neutral head only): the
//   part's current drawing picks its dressed swap, drawn at the swap's offset on the part's own image (render/looks.js);
//   a drawing with no dressed swap shows bare.
// views / overlays: sash and quiver per torso view (A020; quiver hidden in F: occlusion not proven), face details
//   (eyepatch, scar2, earring) from A011 on the neutral / attack / hurt / effort / KO / back heads and from A020 on the
//   front and drink heads; none on the shout head yet. A011's head-gear overlays and painted ear notch are retired.
// masks: exactly as before T032 (A011 head fur masks): the new swaps and overlays show as drawn (A020 masks parked).
import { OVERLAYS as A011, VIEWS as A011_VIEWS, MASKS } from './rat-raider-gear.js';
import { DRESS, SWAPS, OVERLAYS, VIEWS } from './rat-raider-gear-a020.js';

const P = 'assets/art/enemies/rat-raider/rig/';
const none = (on) => `none-${on}`;   // a view that shows no overlay
const DETAILS = ['detail-eyepatch', 'detail-scar2', 'detail-earring'];
const orNone = (G) => ({ ...G, views: Object.fromEntries(Object.entries(G.views).map(([d, o]) => [d, o ?? none(G.on)])) });

export const views = {
  ...Object.fromEntries(DETAILS.map((g) => [g, { on: 'head', views: { ...A011_VIEWS[g].views, 'head-shout': none('head'), ...VIEWS[g].views } }])),
  'gear-sash': orNone(VIEWS['gear-sash']),
  'gear-quiver': orNone(VIEWS['gear-quiver']),
};
export const overlays = { ...A011, ...OVERLAYS, [none('head')]: { on: 'head' }, [none('torso')]: { on: 'torso' } };
export const dress = DRESS, dressed = SWAPS;

export const masks = Object.fromEntries(Object.entries(MASKS).filter(([img]) => !img.endsWith('head-neutral.png') && /\/rig\/head[^/]*\.png$/.test(img)));
// T026 r2: A022 cleaned the back head's islands, so its cut starts 27.6 px further in: its fur mask cropped to match
// (the A010 viewer rig keeps the original)
masks[P + 'head-back.png'] = { ...masks[P + 'head-back.png'], fur: 'assets/art/enemies/rat-raider/masks/head-back-a022-fur-mask.png' };
