// Individual looks (T019, rig standard 7a): picked once when an enemy spawns, from the def's `look` (data/looks.js), on
// the world's own `lookRng` so the fight's rng never shifts (bot numbers are the same with or without looks). The look is
// render only: { detail: overlay group or null, tints: { channel: palette colour }, fur: -1..1, size: -1..1 }
// (fur and size are scaled by LOOKS in render, so lab sliders act on every rat at once). No sim code reads it.
const STEPS = [-1, -0.5, 0, 0.5, 1];   // fur/size in a few steps, so rats share tinted images (render/looks.js cache)

function weighted(rng, table) {
  const entries = Object.entries(table), total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rng.next() * total;
  for (const [k, w] of entries) if ((r -= w) < 0) return k;
  return entries[entries.length - 1][0];
}

export function pickLook(def, rng) {
  const L = def.look;
  if (!L) return null;
  const tints = {};
  for (const [ch, list] of Object.entries(L.tints ?? {})) tints[ch] = list[Math.floor(rng.next() * list.length)];
  const detail = L.details ? weighted(rng, L.details) : 'none';
  const step = () => STEPS[Math.floor(rng.next() * STEPS.length)];
  return { detail: detail === 'none' ? null : detail, tints, fur: step(), size: step() };
}
