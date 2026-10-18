// Hold test (T025): every held item on every body that can hold it, in every grip mode (data/grip-modes.js), drawn
// through the game's own rigFrame. Pure (no DOM): tests/weapon-hold.test.mjs runs it headless, tools/hold-strip.mjs
// draws the JPG, tools/hold-sheet.html shows it in the browser.
// Flags: the handle axis leaves the fist by over 2 px (the grip point off the fist's slot point, or the handle line off
// the slot line within a fist's width of it), the second fist of a two-hander off the shaft, or a grip hand drawn under
// the weapon.
import { FIGHTERS } from '../../src/data/fighters/index.js';
import { RIGS } from '../../src/data/rigs/index.js';
import { ITEMS } from '../../src/data/items/index.js';
import { rigFrame, forceGrip } from '../../src/render/rig.js';
import { nodeOf } from '../../src/render/weapon-node.js';
import { movesOf } from '../../src/sim/weapons.js';
import { GRIP_MODE_NAMES } from '../../src/data/grip-modes.js';

export const HOLD_PX = 2;   // how far the handle may leave the fist
const MODE_DRAWING = /-(overhand|underhand)$/;   // T026: hand drawings named for a grip mode (data/grip-modes.js swap)
const FIST = 5;             // half a fist's width along its slot (screen px): the handle line is checked out to here
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const lin = (m, [x, y]) => [m[0] * x + m[2] * y, m[1] * x + m[3] * y];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const D = Math.PI / 180;
// distance of P from the line through A along u (unit)
const off = (P, A, u) => Math.abs((P[0] - A[0]) * u[1] - (P[1] - A[1]) * u[0]);
const unit = (v) => { const n = Math.hypot(...v); return [v[0] / n, v[1] / n]; };

// Who holds what: [fighter id, item id or null (its own weapon)]. Rats only carry their kits in game; the raider also
// takes the floor weapons in his one-hand slot here, so every one-hander is checked on both bodies.
export const HOLDERS = {
  mouse: [['mouse-fighter', null], ['mouse-fighter', 'rat-cutlass'], ['mouse-fighter', 'plank-club'], ['mouse-fighter', 'big-fish']],
  rat: [['rat-raider', null], ['rat-raider', 'plank-club'], ['rat-raider', 'big-fish'], ['rat-spearman', null], ['rat-archer', null]],
};

// Hold flags for one drawn frame (layout L of rigFrame).
export function holdFlags(rig, L, held) {
  const N = nodeOf(rig, held), out = [], by = Object.fromEntries(L.filter((e) => e.m).map((e) => [e.name, e]));
  if (!N || !by[N.slot]) return out;
  const W = by[N.slot], A = N.art, g = apply(W.m, A.grip), u = unit(lin(W.m, [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]]));
  if ((W.m[0] * W.m[3] - W.m[1] * W.m[2]) === 0 || W.p?.scale?.[0] === 0) return out;
  // the fist holding it: the grip hand, or the whole-arm drawing that hides it (its own grip point and slot axis)
  let S, v, fist = by[N.hand];
  // T026: a grip mode's own hand drawing (A018 hand-near-grip-overhand) holds it at its own slot (rig.hands)
  const own = fist && MODE_DRAWING.test(fist.swap ?? '') && rig.hands?.[fist.swap], at = own ? own.at : N.at, ax = own ? own.axis : N.axis;
  if (fist) { S = apply(fist.base, at); v = unit(lin(fist.base, [Math.cos(ax * D), Math.sin(ax * D)])); }
  else {
    fist = L.find((e) => e.p?.swaps?.[e.swap]?.hide?.includes(N.hand) && e.p.swaps[e.swap].grip);
    if (!fist) return out;
    const s = fist.p.swaps[fist.swap];
    S = apply(fist.m, s.grip); v = unit(lin(fist.m, [Math.cos(s.axis * D), Math.sin(s.axis * D)]));
  }
  const gap = dist(g, S), lean = Math.max(...[-FIST, FIST].map((t) => off([S[0] + v[0] * t, S[1] + v[1] * t], g, u)));
  if (Math.max(gap, lean) > HOLD_PX) out.push({ text: `handle off the fist ${Math.max(gap, lean).toFixed(1)} px`, at: S });
  if (fist.order < W.order) out.push({ text: `${fist.name} under the weapon`, at: S });
  const G = held?.part && rig.grips?.[held.grip];
  if (G?.ik.to === 'grip2' && by[G.ik.end]) {   // the second fist: on the shaft line, over it
    const R = apply(by[G.ik.end].base, G.ik.hand), d = off(R, g, u);
    if (d > HOLD_PX) out.push({ text: `${G.ik.end} off the shaft ${d.toFixed(1)} px`, at: R });
    if (by[G.ik.end].order < W.order) out.push({ text: `${G.ik.end} under the shaft`, at: R });
  }
  return out;
}

const fighterOf = (def, item, o = {}) => ({ def, state: 'idle', t: 0, mf: 0, move: null, z: 0, vz: 0, facing: 1, id: 1, x: 0, y: 0, stun: 10, hp: 10,
  grab: { knee: -1 }, weapon: item ? { def: ITEMS[item], uses: 5, hit: false, broken: false } : null, ...o });

// Frames a holder is drawn in: every state and move phase (all = true), or the sheet's four (idle, walk, windup, strike).
export function holdFrames(id, item, all = false) {
  const def = FIGHTERS[id], f0 = fighterOf(def, item), moves = item ? movesOf(f0) : def.moves;
  const out = [['idle', {}], ['walk', { state: 'walk', t: 12 }]];
  if (all) out.push(['hurt', { state: 'hurt', t: 30, stun: 31 }], ['jump', { state: 'jump' }]);
  const keys = all ? Object.keys(moves) : [item ? ITEMS[item].attack : def.kit ? ITEMS[def.kit].attack : Object.keys(moves)[0]];
  for (const k of keys) {
    const m = moves[k], ph = all ? [0, m.windup - 1, m.windup + m.active - 1, m.windup + m.active + Math.floor(m.recovery / 2)] : [m.windup - 1, m.windup + m.active - 1];
    ph.forEach((mf, i) => out.push([all ? `${k}@${mf}` : `${k} ${i ? 'strike' : 'windup'}`, { state: m.air ? 'jump' : 'attack', move: m, moveKey: k, mf, t: mf }]));
  }
  return out.map(([label, o]) => [label, fighterOf(def, item, o)]);
}

// One frame as the game draws it, with grip modes forced.
export function holdFrame(f, modes) {
  const rig = RIGS[f.def.art.rig], mem = {};
  forceGrip(f, modes);
  rigFrame(f, rig, -1, mem); const fr = rigFrame(f, rig, 0, mem);
  forceGrip(f, null);
  return { rig, ...fr, flags: holdFlags(rig, fr.L, fr.held) };
}

// Strip cells for a body: holders x the sheet's frames x grip modes (T026: the T025 spear hold variants retired, the
// spearman holds overhand by default).
export function holdCells(body, all = false) {
  const cells = [];
  for (const [id, item] of HOLDERS[body]) {
    for (const mode of GRIP_MODE_NAMES) for (const [label, f] of holdFrames(id, item, all)) {
      const name = `${id.replace('-fighter', '').replace('rat-', '')} ${item ?? (FIGHTERS[id].kit ?? FIGHTERS[id].art.held ?? 'sword')}`.replace('rat-', '').replace('mouse-', '');
      cells.push(cellOf(holdFrame(f, { grip: mode }), `${name}: ${mode}, ${label}`, { id, item, mode, frame: label }));
    }
  }
  return cells;
}
// A drawn frame as a strip cell: parts and the bow string in screen px (feet at 0,0), flags with their points.
function cellOf(fr, label, o) {
  const p = fr.p, k = fr.k, c = Math.cos(p.rot), s = Math.sin(p.rot);
  const V = [p.sx * k * c, p.sx * k * s, -p.sy * k * s, p.sy * k * c, p.dx, p.dy];
  const mul = (m) => [V[0] * m[0] + V[2] * m[1], V[1] * m[0] + V[3] * m[1], V[0] * m[2] + V[2] * m[3], V[1] * m[2] + V[3] * m[3], V[0] * m[4] + V[2] * m[5] + V[4], V[1] * m[4] + V[3] * m[5] + V[5]];
  return { label, ...o, flags: fr.flags.map((x) => ({ ...x, at: apply(V, x.at) })),
    strokes: fr.L.filter((e) => e.line).map((e) => e.line.map((P) => apply(V, P))),   // the bow string
    parts: fr.L.filter((e) => e.m && !e.line).map((e) => ({ img: e.img, m: mul(e.m) })) };
}
