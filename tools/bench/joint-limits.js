// Joint limits measure (T034): for a body with hand-placed joint ranges (data/pose-limits.js `turns`, the rat's near arm and
// leg), each ranged joint's turn on its parent as drawn (degrees from rest, + = clockwise on screen; a hand from its
// drawing's neutral, data/wrists.js) and how far past its range it is. Not measured (exempt): a joint whose part or parent
// shows a whole-limb drawing (the raised / cocked / smear / mouth arm keys, the knee-up and kneeling legs: drawn as a whole,
// the packet exempts them) or the back view's own limb cuts (`-back` drawings: their own points). jointTurns() is pure;
// limitFrames() plays every frame of every viewer clip and every rehearsal key (tools/bench/wrist.js wristFrames).
import { bendOf, turnOf } from '../../src/render/wrist.js';
import { turnRange, excess } from '../../src/data/pose-limits.js';
import { RAT_JOINTS } from '../../src/data/rigs/rat-raider-joints.js';
import { wristLimit, rangeOf } from '../../src/data/wrists.js';
import { wristFrames } from './wrist.js';

const whole = (e) => !!e?.p?.swaps?.[e.swap]?.hide?.length;
const back = (e) => /-back$/.test(e?.swap ?? '');

// [{ part, joint, turn, range, past (deg outside, 0 inside), exempt (why, or null), swap }] for layout L
export function jointTurns(L, rig) {
  const by = Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e])), out = [];
  for (const part of Object.keys(RAT_JOINTS)) {
    const E = by[part], P = E && by[E.p.parent];
    // the wrist: its limit for the drawing showing (data/wrists.js: his range on the drawings that hang as drawn)
    const range = turnRange(rig, part) && (/^hand-/.test(part) ? rangeOf(wristLimit(rig, part.slice(5), E?.swap ?? part)) : turnRange(rig, part));
    if (!range || !rig.parts[part]) continue;
    const joint = RAT_JOINTS[part].joint, row = { part, joint, range, turn: null, past: 0, swap: E?.swap ?? null };
    if (!E || !P) { out.push({ ...row, exempt: 'whole-limb drawing' }); continue; }
    if (whole(E) || whole(P)) { out.push({ ...row, exempt: 'whole-limb drawing' }); continue; }
    if (back(E) || back(P)) { out.push({ ...row, exempt: 'back view cut' }); continue; }
    const turn = /^hand-/.test(part) ? turnOf(rig, P, E) : bendOf(P, E);
    out.push({ ...row, turn, past: excess(turn, range), exempt: null });
  }
  return out;
}

// [{ clip, n, label, j: jointTurns }] for every frame and rehearsal key of fighter id (only: clip keys)
export const limitFrames = (id, only = null) => wristFrames(id, only).map((f) => ({ clip: f.clip, n: f.n, label: f.label, j: jointTurns(f.L, f.rig) }));

// worst frame per clip and joint: { 'fighter | clip | joint': { past, turn, n, label, range } } (past > tol only)
export function worstPast(id, frames, tol = 0.5) {
  const out = {};
  for (const f of frames) for (const r of f.j) {
    if (r.exempt || r.past <= tol) continue;
    const k = `${id} | ${f.clip} | ${r.joint}`;
    if (!out[k] || r.past > out[k].past) out[k] = { past: r.past, turn: r.turn, n: f.n, label: f.label, range: r.range };
  }
  return out;
}
