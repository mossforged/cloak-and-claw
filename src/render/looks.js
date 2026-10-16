// Gear and individual looks on a rig (T019, rig standard 7 and 7a).
// Gear: overlay groups (a fighter's art.gear loadout + its look's face detail) ride their part (`on`: head or torso).
//   The part's current drawing (its swap, or the part itself) picks the group's variant (rig.views: the hood's `-hurt`
//   with the hurt head, the jerkin's `-side` / `-back` with those torsos); the overlay image shares the part's canvas, so
//   it sits at its offset in the part's own image px. A hidden part hides its gear.
// Tints: images with masks (rig.masks) are recoloured once per look and cached (never per frame): cloth toward the
//   look's palette colour for the mask's channel (data/looks.js CHANNELS), keeping each pixel's shading; fur a little
//   lighter/warmer or darker/cooler. tintPixels is pure (tests use it).
import { LOOKS, CHANNELS } from '../data/looks.js';

const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];

// Overlay groups a fighter wears: its loadout, then its look's face detail.
export const gearOf = (f) => [...(f.def?.art?.gear ?? []), ...(f.look?.detail ? [f.look.detail] : [])];

// The overlay drawing a group shows with its part's current drawing (null: none, e.g. the rear eyepatch).
export function overlayFor(rig, group, drawing) {
  const G = rig.views?.[group];
  const o = G && rig.overlays[G.views[drawing] ?? G.views[G.on]];
  return o?.img ? o : null;
}

// Layout entries (layoutRig's, which carry each part's `base` matrix) plus the gear overlays, in draw order.
export function gearLayout(rig, L, groups) {
  if (!groups.length || !rig.views) return L;
  const out = [...L];
  for (const g of groups) {
    const on = rig.views[g]?.on, e = L.find((x) => x.name === on);
    const o = e && overlayFor(rig, g, e.swap ?? on);
    if (o) out.push({ name: g, order: o.order, img: o.img, on, m: mul(e.base, [1, 0, 0, 1, ...o.offset]) });
  }
  return out.sort((a, b) => a.order - b.order);
}

// Colour helpers (0..1 channels).
export const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
export function rgbHsl(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}
export function hslRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h * 6) % 2) - 1)), m = l - c / 2, k = Math.floor(h * 6) % 6;
  const [r, g, b] = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][k];
  return [r + m, g + m, b + m];
}

// Recolours RGBA pixels in place. cloth/fur: grey mask pixels (RGBA, same size; R used) or null.
// t = { color: palette hex or null, clothL / clothS: mean lightness / saturation the cloth mask selects, fur: -1..1 }.
// Cloth: hue from the colour; each pixel's own saturation scaled so the mean lands on the colour's (x K.sat) and its
// lightness shifted so the mean lands on the colour's (shading and the art's punch kept);
// blended by mask x K.mix. Fur: brightness x (1 + fur x K.fur), warmer when lighter; blended by mask.
export function tintPixels(px, cloth, fur, t, K = LOOKS) {
  const T = t.color && rgbHsl(...hexRgb(t.color)), dl = T ? T[2] - (t.clothL ?? T[2]) : 0, ks = T ? (T[1] / (t.clothS || T[1] || 1)) * K.sat : 0;
  const fb = (t.fur ?? 0) * K.fur;
  for (let i = 0; i < px.length; i += 4) {
    if (!px[i + 3]) continue;
    const mc = T && cloth ? (cloth[i] / 255) * K.mix : 0, mf = fur && fb ? fur[i] / 255 : 0;
    if (!mc && !mf) continue;
    let r = px[i] / 255, g = px[i + 1] / 255, b = px[i + 2] / 255;
    if (mc) {
      const [, s, l] = rgbHsl(r, g, b), [nr, ng, nb] = hslRgb(T[0], Math.min(1, s * ks), Math.min(1, Math.max(0, l + dl)));
      r += (nr - r) * mc; g += (ng - g) * mc; b += (nb - b) * mc;
    }
    if (mf) {
      const k = 1 + fb * mf, w = fb * 0.5 * mf;
      r *= k * (1 + w); g *= k; b *= k * (1 - w);
    }
    px[i] = r * 255; px[i + 1] = g * 255; px[i + 2] = b * 255;   // Uint8ClampedArray clamps
  }
  return px;
}

// Browser: the image to draw for `path` with this look (the original when it has no masks or no look). Cached per
// image + the parts of the look that touch it + LOOKS (a lab slider change rebuilds lazily).
const cache = new Map(), maskPx = new Map();
let cacheK = '';
const pixelsOf = (img) => {
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0);
  return [c, g, g.getImageData(0, 0, c.width, c.height)];
};
const maskOf = (assets, path) => {
  if (!path) return null;
  if (!maskPx.has(path)) { const im = assets.get(path); maskPx.set(path, im?.width ? pixelsOf(im)[2].data : null); }
  return maskPx.get(path);
};

export function lookImage(assets, rig, path, name, look) {
  const img = assets.get(path), M = look && rig.masks?.[path];
  if (!M || !img?.width) return img;
  const color = (M.cloth && look.tints?.[CHANNELS[name]]) || null, fur = M.fur ? look.fur : 0;
  if (!color && !fur) return img;
  const K = `${LOOKS.sat}|${LOOKS.mix}|${LOOKS.fur}`;
  if (K !== cacheK) { cache.clear(); cacheK = K; }
  const key = `${path}|${color}|${fur}`;
  if (!cache.has(key)) {
    const [c, g, d] = pixelsOf(img), cl = maskOf(assets, M.cloth), fu = maskOf(assets, M.fur);
    if (cl && cl.length !== d.data.length) console.warn('[looks] mask size differs', M.cloth);
    tintPixels(d.data, cl?.length === d.data.length ? cl : null, fu?.length === d.data.length ? fu : null, { color, clothL: M.clothL, clothS: M.clothS, fur });
    g.putImageData(d, 0, 0);
    cache.set(key, c);
  }
  return cache.get(key);
}
