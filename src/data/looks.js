// Individual looks (T019, rig standard 7a): each enemy picks a face detail, cloth tints, a fur shift and a size when it
// spawns (sim/looks.js, own rng), drawn by render/looks.js. Render only: no sim number depends on a look.
// LOOKS: global strengths (lab sliders, 'Rat looks'). sat = how much of a palette colour's saturation a tint keeps (0 = grey cloth,
//   1 = the palette as written); mix = how far cloth moves toward the tint (1 = all the way, shading kept);
//   fur = max brightness / warmth shift (share of 1) on fur masks; size = max render scale change (+-).
// Palettes: dyed-cloth colours (hex), earthy and muted so rats sit in the art bible's world. A tint keeps each pixel's
// shading: the pixels a mask selects are recoloured so their average lands on the palette colour.
export const LOOKS = { sat: 0.9, mix: 1, fur: 0.12, size: 0.04 };

export const PALETTES = {
  bandana: ['#b81c12', '#6e1420', '#b4481a', '#8e2a14', '#561818', '#a0301e'],   // signature red stays red-ish: the art's red is very saturated, so vary by lightness and hue (red, wine, rust, brick, maroon), not greyer (reads pink)
  trousers: ['#8a7450', '#3a4250', '#5d6a3e', '#6b4830', '#a08c68', '#3e3430'],   // spread in lightness so rats tell apart at game size: ochre, dark slate, faded green, brown, canvas, near-black
  hood: ['#4f5e36', '#6e7444', '#2f4434', '#6a5636', '#3e4a52'],   // the archer's greens (one brown, one slate), light to dark
  jerkin: ['#6a4630', '#3e342c', '#4a5566', '#8a6236', '#5a3a2a'],   // leather browns, one slate blue, light to dark
  sash: ['#a82014', '#a8501a', '#8a1c1c', '#94401a'],   // captain: deep reds and a rust
};

// Mask -> tint channel by the image it masks (rig images and gear overlays). Not listed = untinted cloth.
export const CHANNELS = {
  torso: 'bandana', 'torso-side': 'bandana', 'torso-back': 'bandana', 'scarf-tail': 'bandana',
  pelvis: 'trousers', 'leg-near-upper': 'trousers', 'leg-far-upper': 'trousers',
  'gear-hood': 'hood', 'gear-hood-hurt': 'hood', 'gear-hood-back': 'hood',
  'gear-jerkin': 'jerkin', 'gear-jerkin-side': 'jerkin', 'gear-jerkin-back': 'jerkin',
  'gear-sash': 'sash', 'gear-sash-side': 'sash', 'gear-sash-back': 'sash',
};

// Per enemy type (fighter def `look`): face detail weights (overlay group or 'none'), and the palette per tint channel.
const RAT = { bandana: PALETTES.bandana, trousers: PALETTES.trousers };
export const RAT_LOOKS = {
  raider: { details: { none: 1, 'detail-eyepatch': 1, 'detail-scar2': 1, 'detail-ear-notch': 1, 'detail-earring': 1 }, tints: RAT },
  archer: { details: { none: 1, 'detail-eyepatch': 1, 'detail-scar2': 1 }, tints: { ...RAT, hood: PALETTES.hood } },   // the hood covers the ears
  spearman: { details: { none: 1, 'detail-eyepatch': 1, 'detail-scar2': 1, 'detail-ear-notch': 1, 'detail-earring': 1 }, tints: { ...RAT, jerkin: PALETTES.jerkin } },
  captain: { details: { none: 1, 'detail-eyepatch': 2, 'detail-scar2': 1, 'detail-earring': 2 }, tints: { ...RAT, sash: PALETTES.sash } },   // no captain enemy yet
};

// Gear loadouts (overlay groups from rigs/rat-raider-gear.js), worn by every rat of the type.
export const LOADOUTS = {
  archer: ['gear-hood', 'gear-quiver'],
  spearman: ['gear-helmet', 'gear-jerkin'],
  captain: ['gear-captain-hat', 'gear-sash'],
};
