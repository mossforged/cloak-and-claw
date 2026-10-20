// T035 r2: how well rat v3 follows the raider's poses by position (render/retarget.js), every viewer clip: each hand's and
// foot's wrist / ankle as drawn vs its goal from the raider's (render/retarget.js goalOf), and every planted foot's
// gap to its floor line, for round 1 (joint angles copied) and round 2 (retargeted). Also the turning slash wind-up: the
// far fist against the chest on the raider, r1 and r2.
// Usage: node tools/v3-retarget.mjs [out.md]   (default docs/screens/T035/retarget.md)
import { writeFileSync } from 'node:fs';
import { clipsFor } from '../src/viewer/clips.js';
import { createSlot } from '../src/viewer/sandbox.js';
import { rigOf } from '../src/viewer/models.js';
import { rigFrame, rigMemory } from '../src/render/rig.js';
import { grounded } from '../src/render/floor.js';
import { floorLine } from '../src/data/rigs/biped-floor.js';
import { phaseOf } from '../src/sim/fighter.js';
import HULLS from '../src/data/rigs/hulls.js';
import V3, { V3_SPEARMAN } from '../src/data/rigs/rat-v3.js';
import { goalOf, LIMBS } from '../src/render/retarget.js';
import { limitLayer } from '../src/render/limits.js';
import { layoutRig } from '../src/render/rig-layout.js';

const out = process.argv[2] ?? 'docs/screens/T035/retarget.md';
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const by = (L) => Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
const pv = (rig, B, n) => apply(B[n].m === B[n].base ? B[n].m : B[n].base, B[n].p?.pivot ?? rig.parts[n].pivot);
const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
// round 1: the angles copied, the floor rule on the unlimited legs, then every joint clamped (as T035 r1 drew it)
const R1 = (r) => ({ ...r, retarget: undefined, limits: undefined });
const round1 = (rig, F, mem) => { const joints = limitLayer(rig, F.joints); return { ...F, joints, L: layoutRig(rig, joints, mem.swap) }; };
const r1Of = new Map([[V3, R1(V3)], [V3_SPEARMAN, R1(V3_SPEARMAN)]]);

// a drawn frame's ends against their goals (render/retarget.js goalOf on the source's drawn frame): px, each end both
// draw jointed; unmirrored frames only (a turn's mirror)
function errors(src, A, rig, B, sx) {
  const o = {};
  if (Math.abs(sx - 1) > 1e-6) return o;
  for (const limb of LIMBS) if (limb.every((n) => A[n] && B[n])) o[limb[2]] = d(goalOf(src, A, rig, B, limb), pv(rig, B, limb[2]));
  return o;
}
// planted feet (lift under 0.5 px): drawn bottom vs its floor line less the lift (px, + = below it), and which of the
// leg's joints sit at an end of their range
function gaps(f, rig, F) {
  if (!grounded(f) || F.joints['@aloft']) return [];
  const B = by(F.L), o = [];
  for (const ft of ['foot-near', 'foot-far']) {
    const lift = Math.max(0, F.joints[`${ft}.lift`] ?? 0);
    if (!B[ft] || !(HULLS[B[ft].img] ?? []).length || lift > 0.5) continue;
    const y = Math.max(...HULLS[B[ft].img].map((p) => apply(B[ft].m, p)[1])), leg = ft.replace('foot', 'leg');
    const at = [`${leg}-upper`, `${leg}-lower`, ft].filter((n) => rig.limits[n] && rig.limits[n].some((e) => Math.abs((F.joints[n] ?? 0) - e) < 0.5));
    o.push({ g: F.p.dy + F.p.sy * F.k * y - floorLine(rig, ft) + lift, at: at.map((n) => `${n} ${rig.limits[n].find((e) => Math.abs((F.joints[n] ?? 0) - e) < 0.5)}`) });
  }
  return o;
}

const rows = [], wind = {};
let cur = null;
const warm = (sb, t) => {
  for (const f of sb.w.fighters) if (f !== sb.hero) rigFrame(f, rigOf(f.def.id), t, rigMemory(f));
  const f = sb.hero, rig = sb.rig, src = rig.retarget;
  cur.mem2 ??= {}; cur.mem1 ??= {}; cur.memS ??= {};
  const P = sb.pose ?? undefined, F2 = rigFrame(f, rig, t, cur.mem2, P), F1 = round1(rig, rigFrame(f, r1Of.get(rig), t, cur.mem1, P), cur.mem1), FS = rigFrame(f, src, t, cur.memS, P);
  const A = by(FS.L);
  for (const [k, F] of [['r1', F1], ['r2', F2]]) {
    for (const [end, e] of Object.entries(errors(src, A, rig, by(F.L), F.joints.sx ?? 1))) { const s = (cur[k][end] ??= { sum: 0, n: 0, max: 0 }); s.sum += e; s.n++; s.max = Math.max(s.max, e); }
    for (const { g, at } of gaps(f, rig, F)) {
      if (Math.abs(g) > 0.5) cur[`${k}off`] = (cur[`${k}off`] ?? 0) + 1;
      if (Math.abs(g) > Math.abs(cur[`${k}gap`] ?? 0)) { cur[`${k}gap`] = g; cur[`${k}at`] = `frame ${sb.n}${at.length ? `: ${at.join(', ')}` : ''}`; }
    }
  }
  if (sb.clip.key === 'ratSlash' && f.move && phaseOf(f)[0] === 'windup') {   // the wind-up's last frame wins
    const chest = (R, X) => apply(X.torso.base, R.sockets.chest.at), fist = (R, X) => pv(R, X, 'hand-far');
    wind.n = sb.n;
    for (const [k, R, F] of [['raider', src, FS], ['r1', rig, F1], ['r2', rig, F2]]) { const X = by(F.L), c = chest(R, X), h = fist(R, X); wind[k] = [h[0] - c[0], h[1] - c[1]]; }
  }
};
const slot = createSlot({ warm });
for (const [id, rig] of [['rat-raider', V3], ['rat-spearman', V3_SPEARMAN]]) for (const c of clipsFor(id, 'own')) {
  if (id === 'rat-spearman' && !/spear|staff/i.test(c.key)) continue;
  cur = { clip: `${id === 'rat-spearman' ? 'spearman ' : ''}${c.key}`, r1: {}, r2: {} };
  slot.load({ f: id, v: 'v3', item: 'own', anim: c.key, grip: '', target: false, flip: false, look: {}, gear: null });
  slot.seek(slot.len);
  rows.push(cur);
}
const f1 = (x) => (x == null ? '-' : x.toFixed(1));
const cell = (s) => (s ? `${f1(s.sum / s.n)} / ${f1(s.max)}` : '-');
const ends = LIMBS.map((l) => l[2]);
const all = (k, end) => { const L = rows.map((r) => r[k][end]).filter(Boolean); return { sum: L.reduce((a, s) => a + s.sum, 0), n: L.reduce((a, s) => a + s.n, 0), max: Math.max(...L.map((s) => s.max)) }; };
const xy = (v) => (v ? `${f1(v[0])}, ${f1(v[1])}` : '-');
const worst = (k) => rows.reduce((m, r) => (Math.abs(r[`${k}gap`] ?? 0) > Math.abs(m) ? r[`${k}gap`] : m), 0);
const count = (k) => rows.reduce((n, r) => n + (r[`${k}off`] ?? 0), 0);
const lines = ['# T035 round 2: rat v3 retargeted by position', '',
  'GENERATED by `node tools/v3-retarget.mjs`. r1 = round 1 (the raider\'s joint angles copied, then clamped), r2 = round 2 (retargeted by position, legs solved onto the floor inside the limits).', '',
  `**Turning slash wind-up** (frame ${wind.n}), far fist (wrist) from the chest point (x forward, y down, px): raider ${xy(wind.raider)}; r1 ${xy(wind.r1)}; r2 ${xy(wind.r2)}.`, '',
  `**Hands and feet, all clips** (mean / worst px off where the raider puts them): ${ends.map((e) => `${e} r1 ${cell(all('r1', e))}, r2 ${cell(all('r2', e))}`).join('; ')}.`, '',
  `**Planted feet, all clips** (frames off the floor line by more than 0.5 px; worst, + = below): r1 ${count('r1')}, worst ${f1(worst('r1'))}; r2 ${count('r2')}, worst ${f1(worst('r2'))}.`, '',
  '## Planted feet', '', 'A foot planted (lift under 0.5 px) on a grounded frame: how many frames land more than 0.5 px off its line, the worst (px, + = sunk below), and for r2 the joints at an end of the user\'s range in that frame (the pose asks for more than the ranges give).', '',
  '| Clip | r1 frames | r1 worst | r2 frames | r2 worst | r2 worst frame |', '|---|---|---|---|---|---|',
  ...rows.filter((r) => r.r1gap != null || r.r2gap != null).map((r) => `| ${r.clip} | ${r.r1off ?? 0} | ${f1(r.r1gap)} | ${r.r2off ?? 0} | ${f1(r.r2gap)} | ${r.r2at ?? ''} |`), '',
  '## Hands and feet against the raider', '', 'Mean / worst px between v3\'s wrist or ankle as drawn and where the raider\'s puts it (its move from rest, in the torso / pelvis frame, scaled by limb length: render/retarget.js). Feet include the floor fix (the floor wins). A dash: the raider draws that limb whole (a whole-arm or whole-leg drawing), so v3 keeps its angles.', '',
  `| Clip | ${ends.map((e) => `${e} r1 | ${e} r2`).join(' | ')} |`, `|---|${ends.map(() => '---|---').join('|')}|`,
  ...rows.map((r) => `| ${r.clip} | ${ends.map((e) => `${cell(r.r1[e])} | ${cell(r.r2[e])}`).join(' | ')} |`), ''];
writeFileSync(out, lines.join('\n'));
console.log(lines.slice(4, 9).join('\n'));
console.log(`wrote ${out} (${rows.length} clips)`);
