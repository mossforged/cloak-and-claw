// T040: what rat v3's own poses (src/data/rigs/rat-v3-poses.js) are checked against, frame by frame, on the clips they
// pose: every limited joint inside the user's range as drawn, the held item in its grip fist, the held item's drawing off
// the head's drawing, and at the named keys the item angle / place the move names (spear thrust point within 20 deg of
// forward, slash wind-up blade above the shoulder, chop axe head above the head, guard shield centre below the eyes).
// Used by tests/rat-v3-own.test.mjs; run it to write the per-move table (move, key, target, got).
// Usage: node tools/v3-own-check.mjs [--out docs/screens/T040/table.md]
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { ITEMS } from '../src/data/items/index.js';
import { rigFrame } from '../src/render/rig.js';
import { bendOf } from '../src/render/wrist.js';
import { keyMf } from '../src/viewer/rehearse-frames.js';
import { readAlpha } from './bench/png.mjs';
import HULLS from '../src/data/rigs/hulls.js';
import V3, { V3_SPEARMAN } from '../src/data/rigs/rat-v3.js';
import { EYES } from '../src/data/rigs/rat-v3-poses.js';

const D = 180 / Math.PI, wrap = (d) => ((d + 540) % 360) - 180;
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const inv = (m) => { const d = m[0] * m[3] - m[1] * m[2]; return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d]; };
const by = (L) => Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));

// The clips v3 poses itself: [fighter, clip, rig]; idle / walk = the spearman's carry (state cycles)
export const CLIPS = [
  ['rat-spearman', 'idle', V3_SPEARMAN], ['rat-spearman', 'walk', V3_SPEARMAN], ['rat-spearman', 'spearThrust', V3_SPEARMAN],
  ['rat-spearman', 'staffSwing', V3_SPEARMAN], ['rat-spearman', 'staffOverhead', V3_SPEARMAN],
  ['rat-raider', 'ratSlash', V3], ['rat-raider', 'overheadChop', V3], ['rat-raider', 'guard', V3], ['rat-raider', 'shieldBash', V3],
];

// A fighter on frame n of a clip (a move's sim frame, idle's time, walk's frame), with the move's own items
function fighterAt(id, clip, n) {
  const def = FIGHTERS[id], M = def.moves[clip] ?? def.rehearsal?.[clip];
  const f = { def, state: 'idle', t: 0, mf: 0, move: null, z: 0, vz: 0, facing: 1, id: 1, x: 0, y: 0, stun: 10, grab: { knee: -1 } };
  if (clip === 'walk') return { f: Object.assign(f, { state: 'walk', t: n }), time: n / 60 };
  if (!M) return { f, time: n / 60 };
  return { f: Object.assign(f, { state: 'attack', move: M, moveKey: clip, mf: n, t: n },
    M.item && { weapon: { def: ITEMS[M.item], uses: 999, hit: false, broken: false } }, M.strap && { strap: { def: ITEMS[M.strap] } }), time: 0 };
}
// The frames of a clip as the viewer plays them (blend memory carried frame to frame)
export function framesOf(id, clip, rig) {
  const def = FIGHTERS[id], M = def.moves[clip] ?? def.rehearsal?.[clip], n = M ? M.windup + M.active + M.recovery : 60;
  const mem = {}, out = [];
  for (let i = 0; i <= n; i++) {
    const { f, time } = fighterAt(id, clip, i);
    out.push({ i, F: rigFrame(f, rig, time + (M ? i / 60 : 0), mem), swap: mem.swap });
  }
  return out;
}
// One key exactly (render memory warmed on the frame before), as tools/pose-strip.mjs draws it
export function keyFrame(id, clip, key, rig) {
  const def = FIGHTERS[id], M = def.moves[clip] ?? def.rehearsal?.[clip], mf = M ? keyMf(rig, M, clip, key) : +key, { f, time } = fighterAt(id, clip, mf), mem = {};
  rigFrame(f, rig, time - 1, mem);
  return rigFrame(f, rig, time, mem);
}

// Limited joints outside the user's range as drawn (0.5 deg), as tests/rat-v3.test.mjs
export function limitFaults(rig, F) {
  const B = by(F.L), out = [];
  for (const [part, [lo, hi]] of Object.entries(rig.limits)) {
    const H = B[part], P = H && B[rig.parts[part].parent];
    if (!P) continue;
    const t = bendOf(P, H);
    if (t < lo - 0.5 || t > hi + 0.5) out.push(`${part} ${t.toFixed(1)} outside ${lo}..${hi}`);
  }
  return out;
}
const inHull = (P, pts) => [1, -1].some((s) => pts.every((a, i) => { const b = pts[(i + 1) % pts.length]; return s * ((b[0] - a[0]) * (P[1] - a[1]) - (b[1] - a[1]) * (P[0] - a[0])) >= -0.5 * Math.hypot(b[0] - a[0], b[1] - a[1]); }));
// The held item's grip point inside the fist drawing holding it (or its split grip's under piece), as T039
export function inFist(rig, F) {
  const B = by(F.L), I = F.held?.part && B[F.held.slot], H = I && B[F.held.part.parent];
  if (!H) return true;
  const G = apply(I.m, F.held.kit.art.grip), U = B[`${H.name}:under`];
  return !!rig.hands[H.swap] && [H, U].filter(Boolean).some((e) => inHull(G, HULLS[e.img].map((q) => apply(e.m, q))));
}
// The held item's handle angle on screen (grip -> gripEnd; 0 forward, - up) and its tip / head point
export function itemOf(F) {
  const e = F.held?.part && by(F.L)[F.held.slot], A = F.held?.kit?.art;
  if (!e) return null;
  const g = apply(e.m, A.grip), h = apply(e.m, A.gripEnd);
  return { angle: Math.atan2(h[1] - g[1], h[0] - g[0]) * D, grip: g, tip: A.tip && apply(e.m, A.tip), e };
}
// How many of the held item's opaque px (every 2nd) land on the head's opaque px
export function headOverlap(F) {
  const B = by(F.L), I = F.held?.part && B[F.held.slot], Hd = B.head;
  if (!I || !Hd) return 0;
  const a = readAlpha(I.img), h = readAlpha(Hd.img), m = inv(Hd.m);
  let n = 0;
  for (let y = 0; y < a.h; y += 2) for (let x = 0; x < a.w; x += 2) {
    if (a.alpha[y * a.w + x] < 128) continue;
    const [u, v] = apply(m, apply(I.m, [x + 0.5, y + 0.5])), U = Math.floor(u), V = Math.floor(v);
    if (U >= 0 && V >= 0 && U < h.w && V < h.h && h.alpha[V * h.w + U] >= 128) n++;
  }
  return n;
}
const pivot = (rig, B, n) => apply(B[n].base, rig.parts[n].pivot);
const eyesY = (B) => Math.min(...EYES.map((p) => apply(B.head.m, p)[1]));
const headTop = (rig, B) => apply(B.head.m, rig.sockets.head_top.at)[1];

// The named keys and what each must reach: got(F, rig) -> { got, ok }
export const TARGETS = [
  { fighter: 'rat-spearman', clip: 'spearThrust', key: 'strike', target: 'spear point within 20 deg of forward',
    got: (F) => { const a = itemOf(F).angle; return { got: `${a.toFixed(1)} deg`, ok: Math.abs(wrap(a)) <= 20 }; } },
  { fighter: 'rat-raider', clip: 'ratSlash', key: 'windup', target: 'blade above the shoulder line, behind the head',
    got: (F, rig) => { const B = by(F.L), it = itemOf(F), S = pivot(rig, B, 'arm-near-upper'), hx = apply(B.head.m, [0, 0])[0];
      return { got: `tip ${(S[1] - it.tip[1]).toFixed(1)} px above the near shoulder, ${(apply(B.head.m, [40, 0])[0] - it.tip[0]).toFixed(1)} px behind the head's back`, ok: it.tip[1] < S[1] && it.tip[0] < hx + 40 }; } },
  { fighter: 'rat-raider', clip: 'overheadChop', key: 'windup', target: 'axe head above the head',
    got: (F, rig) => { const B = by(F.L), it = itemOf(F), top = headTop(rig, B); return { got: `axe head ${(top - it.tip[1]).toFixed(1)} px above the head's top`, ok: it.tip[1] < top }; } },
  { fighter: 'rat-raider', clip: 'guard', key: 'strike', target: 'shield centre below the eyes, in front of the chest',
    got: (F) => { const B = by(F.L), s = B.shield, r = readAlpha(s.img), c = apply(s.m, [r.w / 2, r.h / 2]), e = eyesY(B);
      return { got: `centre ${(c[1] - e).toFixed(1)} px below the eyes`, ok: c[1] > e && s.order > B.torso.order }; } },
  { fighter: 'rat-raider', clip: 'guard', key: 'windup', target: 'shield centre below the eyes, in front of the chest',
    got: (F) => { const B = by(F.L), s = B.shield, r = readAlpha(s.img), c = apply(s.m, [r.w / 2, r.h / 2]), e = eyesY(B);
      return { got: `centre ${(c[1] - e).toFixed(1)} px below the eyes`, ok: c[1] > e && s.order > B.torso.order }; } },
];

// The table: per target key, and per clip the worst frame faults (limits, fist, head overlap)
export function table() {
  const rows = ['| Move | Key | Target | Got | Pass |', '|---|---|---|---|---|'];
  for (const T of TARGETS) {
    const rig = T.fighter === 'rat-spearman' ? V3_SPEARMAN : V3, r = T.got(keyFrame(T.fighter, T.clip, T.key, rig), rig);
    rows.push(`| ${T.clip} | ${T.key} | ${T.target} | ${r.got} | ${r.ok ? 'yes' : '**no**'} |`);
  }
  rows.push('', '| Fighter | Clip | Frames | Joints outside | Item out of its fist | Frames the item overlaps the head (worst px) |', '|---|---|---|---|---|---|');
  for (const [id, clip, rig] of CLIPS) {
    let lim = 0, fist = 0, head = 0, worst = 0;
    const fr = framesOf(id, clip, rig);
    for (const { F } of fr) {
      if (limitFaults(rig, F).length) lim++;
      if (!inFist(rig, F)) fist++;
      const o = headOverlap(F);
      if (o) { head++; worst = Math.max(worst, o); }
    }
    rows.push(`| ${id} | ${clip} | ${fr.length} | ${lim} | ${fist} | ${head}${head ? ` (${worst})` : ''} |`);
  }
  return rows.join('\n');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const i = process.argv.indexOf('--out'), out = i < 0 ? null : process.argv[i + 1], t = table();
  if (out) writeFileSync(out, `# T040: v3's own poses against their targets\n\nnode tools/v3-own-check.mjs --out ${out}\n\n${t}\n`);
  console.log(t);
}
