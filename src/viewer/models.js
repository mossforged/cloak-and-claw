// Model viewer (T027): which characters it can show and what each can hold, wear and look like. Pure (Node tests use it).
// Everything comes from the registries: a fighter with a rig is a model, a new one shows up when it is registered.
import { FIGHTERS } from '../data/fighters/index.js';
import { RIGS } from '../data/rigs/index.js';
import { ITEMS } from '../data/items/index.js';
import { RAT_LOOKS, PALETTES } from '../data/looks.js';
import { GRIP_MODE_NAMES } from '../data/grip-modes.js';
import { SPEAR_HOLDS, withSpearHold } from '../data/rigs/rat-spearman-holds.js';

export const MODELS = Object.values(FIGHTERS).filter((d) => RIGS[d.art?.rig]).map((d) => d.id);
export const GRIPS = GRIP_MODE_NAMES;
export const SIZES = [1, 2, 3];
export const SPEEDS = [0.25, 0.5, 1];

// Versions of a rig to compare (view only): 'current' is the game's. The spearman's overhand hold variants (T025);
// an old rig kept beside a new one during an import goes here too.
const VERSIONS = { 'rat-spearman': Object.fromEntries(Object.keys(SPEAR_HOLDS).map((k) => [k, (rig) => withSpearHold(rig, k)])) };
export const versionsOf = (id) => ['current', ...Object.keys(VERSIONS[FIGHTERS[id].art.rig] ?? {})];
export function rigOf(id, version = 'current') {
  const r = FIGHTERS[id].art.rig, make = VERSIONS[r]?.[version];
  return make ? make(RIGS[r]) : RIGS[r];
}

// What a model can hold: 'own' (as the game draws it: the mouse's sword, a rat's kit or look weapon), 'empty' (a rat), every
// weapon or gear item whose grip type has a slot in its rig (not its own), and the potion (carried in the fist).
export function itemsFor(id) {
  const def = FIGHTERS[id], rig = RIGS[def.art.rig], own = def.kit ?? def.art.held;
  const fits = Object.values(ITEMS).filter((it) => ['weapon', 'gear'].includes(it.kind) && rig.slots?.[it.grip] && it.id !== own
    && !(it.kind === 'gear' && def.team === 'hero'));
  return ['own', ...(own ? ['empty'] : []), ...fits.map((it) => it.id), ...Object.values(ITEMS).filter((it) => it.kind === 'potion').map((it) => it.id)];
}
export const itemLabel = (id) => (id === 'own' ? 'Own' : id === 'empty' ? 'Empty hand' : ITEMS[id]?.name ?? id);

// Look options for bodies with variety (fighter `look`): face details, a palette per tint channel, fur and size steps,
// and the gear groups the rig has overlays for. null = no variety (the mouse).
export const STEPS = [-1, -0.5, 0, 0.5, 1];
export function looksFor(id) {
  const def = FIGHTERS[id], rig = RIGS[def.art.rig], L = def.look;
  if (!L) return null;
  const groups = Object.keys(rig.views ?? {});
  return {
    details: ['none', ...Object.keys(L.details ?? {}).filter((k) => k !== 'none')],
    tints: Object.fromEntries(Object.keys(L.tints ?? {}).map((ch) => [ch, L.tints[ch]])),
    gear: groups.filter((g) => g.startsWith('gear-')),
    defaultGear: def.art.gear ?? [],
  };
}

// The look the viewer draws: o = { detail, tint: { channel: palette index }, fur, size } (missing = the palette's first
// colour / 0). The same shape sim/looks.js picks, so render/looks.js tints it exactly as in the game.
export function lookOf(id, o = {}) {
  const opts = looksFor(id);
  if (!opts) return null;
  const tints = Object.fromEntries(Object.entries(opts.tints).map(([ch, list]) => [ch, list[(o.tint?.[ch] ?? 0) % list.length]]));
  return { detail: o.detail && o.detail !== 'none' ? o.detail : null, tints, fur: o.fur ?? 0, size: o.size ?? 0 };
}

// A random look (Randomise): a detail, a colour per channel, fur and size steps, from rng() in 0..1.
export function randomLook(id, rng = Math.random) {
  const opts = looksFor(id);
  if (!opts) return {};
  const pick = (list) => list[Math.floor(rng() * list.length)];
  return { detail: pick(opts.details), tint: Object.fromEntries(Object.entries(opts.tints).map(([ch, l]) => [ch, Math.floor(rng() * l.length)])),
    fur: pick(STEPS), size: pick(STEPS) };
}

// The def the viewer builds a fighter from: gear swapped when picked (render/looks.js gearOf reads def.art.gear);
// 'empty' takes a rat's kit / look weapon out of his hands. Sim numbers are the def's own.
export function defFor(id, { gear, item } = {}) {
  const def = FIGHTERS[id];
  if (!gear && item !== 'empty') return def;
  const art = { ...def.art, ...(gear && { gear }) };
  if (item === 'empty') delete art.held;
  return { ...def, art, ...(item === 'empty' && { kit: undefined }) };
}

// The other side's basic fighter, for clips that need someone to hit, grab or be grabbed: a hero faces a throwable rat.
export function partnerOf(id, throwable = false) {
  const team = FIGHTERS[id].team;
  return Object.values(FIGHTERS).find((d) => d.team !== team && (!throwable || d.throwable) && d.art?.rig)?.id ?? null;
}

export { PALETTES };
