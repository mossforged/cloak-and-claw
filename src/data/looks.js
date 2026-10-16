// Individual looks (T019, rig standard 7a): each enemy picks a face detail, cloth tints, a fur shift and a size when it
// spawns (sim/looks.js, own rng), drawn by render/looks.js. Render only: no sim number depends on a look.
// LOOKS: global strengths (lab sliders, 'Rat looks'). sat = how much of a palette colour's saturation a tint keeps (0 = grey cloth,
//   1 = the palette as written); mix = how far cloth moves toward the tint (1 = all the way, shading kept);
//   fur = max brightness / warmth shift (share of 1) on fur masks; size = max render scale change (+-).
// Palettes: dyed-cloth colours (hex), earthy and muted so rats sit in the art bible's world. A tint keeps each pixel's
// shading: the pixels a mask selects are recoloured so their average lands on the palette colour.
export const LOOKS = { sat: 0.9, mix: 1, fur: 0.06, size: 0.04 };

export const PALETTES = {
  bandana: ['#b81c12', '#9a1a14', '#a83414', '#7e1818', '#b02a10'],   // signature red stays red: the art's red is very saturated, so vary darker (brick, maroon, rust), not greyer (reads pink)
  trousers: ['#4f5338', '#5b4a35', '#4a4f52', '#5e5440', '#454a3a', '#5a4038'],   // faded green, brown, slate, ochre-grey
  hood: ['#4f5e36', '#5d6440', '#3f5642', '#5f5236', '#4b5a3c'],   // the archer's greens (one brown)
  jerkin: ['#6a4630', '#5a4a3c', '#4a5566', '#7a5532', '#54473c'],   // leather browns, one slate blue
  sash: ['#a82014', '#a8501a', '#8a1c1c', '#94401a'],   // captain: deep reds and a rust
};

// Mask -> tint channel by the image it masks (rig images and gear overlays). Not listed = untinted cloth.
export const CHANNELS = {
  torso: 'bandana', 'torso-side': 'bandana', 'torso-back': 'bandana', 'scarf-tail': 'bandana',
  pelvis: 'trousers', 'leg-front-upper': 'trousers', 'leg-back-upper': 'trousers',
  'gear-hood': 'hood', 'gear-hood-hurt': 'hood', 'gear-hood-back': 'hood',
  'gear-jerkin': 'jerkin', 'gear-jerkin-side': 'jerkin', 'gear-jerkin-back': 'jerkin',
  'gear-sash': 'sash', 'gear-sash-side': 'sash', 'gear-sash-back': 'sash',
};

// Per enemy type (fighter def `look`): face detail weights (overlay group or 'none'), and the palette per tint channel.
const RAT = { bandana: PALETTES.bandana, trousers: PALETTES.trousers };
export const RAT_LOOKS = {
  raider: { details: { none: 3, 'detail-eyepatch': 1, 'detail-scar2': 1, 'detail-ear-notch': 1, 'detail-earring': 1 }, tints: RAT },
  archer: { details: { none: 3, 'detail-eyepatch': 1, 'detail-scar2': 1 }, tints: { ...RAT, hood: PALETTES.hood } },   // the hood covers the ears
  spearman: { details: { none: 3, 'detail-eyepatch': 1, 'detail-scar2': 1, 'detail-ear-notch': 1, 'detail-earring': 1 }, tints: { ...RAT, jerkin: PALETTES.jerkin } },
  captain: { details: { none: 1, 'detail-eyepatch': 2, 'detail-scar2': 1, 'detail-earring': 2 }, tints: { ...RAT, sash: PALETTES.sash } },   // no captain enemy yet
};

// Gear loadouts (overlay groups from rigs/rat-raider-gear.js), worn by every rat of the type.
export const LOADOUTS = {
  archer: ['gear-hood', 'gear-quiver'],
  spearman: ['gear-helmet', 'gear-jerkin'],
  captain: ['gear-captain-hat', 'gear-sash'],
};
