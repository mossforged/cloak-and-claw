// T028 views and depth: a rig without views lays out exactly as before (pre-T028 fixture, mouse and the rat with its
// views, springs and carry stripped); torso / pelvis views re-attach children to the view's points and set the bands
// (S, F near arm in front; BQ near arm and its held item behind; B far arm in front, legs and tail swapped); pose band
// overrides; shoulder caps (shown only in front, turn a share of the arm); the slide between views; the turn-around
// through F; the depth switch on the named key; the turning slash; springs; the carry socket.
import { readFileSync } from 'node:fs';
import { RIGS } from '../src/data/rigs/index.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { rigFrame, heldOf } from '../src/render/rig.js';
import { layoutRig, apply } from '../src/render/rig-layout.js';
import { targetPose, channelsOf } from '../src/render/rig-pose.js';
import { viewLayer, anchorsOf, viewRig } from '../src/render/rig-views.js';
import { RIG_MOTION } from '../src/data/rig-motion.js';
import { socketPoints } from '../src/render/sockets.js';
import { carryLayer } from '../src/render/carry.js';

let failed = 0;
const check = (c, msg) => { if (!c) { failed++; console.log('FAIL:', msg); } };
const near = (a, b, e = 1e-6) => Math.hypot(a[0] - b[0], a[1] - b[1]) < e;
const fighter = (def, o = {}) => ({ def, state: 'idle', t: 0, mf: 0, move: null, z: 0, vz: 0, facing: 1, id: 1, x: 0, y: 0, stun: 10, grab: { knee: -1 }, ...o });
const strip = (rig) => { const { bodyViews, springs, carry, ...r } = rig; return r; };
const rat = RIGS['rat-raider'], def = FIGHTERS['rat-raider'], S = { ...channelsOf(rat), ...rat.poses.stance };
const by = (L) => Object.fromEntries(L.map((e) => [e.name, e]));
const idx = (L, n) => L.findIndex((e) => e.name === n);

// 1. no views = exactly the pre-T028 layout: the mouse (no views) against the fixture made on the T026 base; T028 r2: the
// rats' drawings changed with A023 (fixture values no longer theirs), so each rat cell is laid out with and without its
// bodyViews instead: a pose that names no view lays out exactly as the rig without views
{
  const old = JSON.parse(readFileSync(new URL('./fixtures/t028-pre-views-layouts.json', import.meta.url)));
  const r3 = (v) => Math.round(v * 1000) / 1000;
  const layout = (d, rig, st, t) => {
    const M = d.moves[st], f = fighter(d, { state: st, t: +t, z: st === 'jump' ? 20 : 0 });
    if (M) Object.assign(f, { state: M.air ? 'jump' : 'attack', move: M, moveKey: st, mf: +t, t: +t });
    if (st === 'idle') f.t = 0;
    const mem = {}, time = st === 'idle' ? +t : 1;
    rigFrame(f, rig, time - 1 / 60, mem);
    return rigFrame(f, rig, time, mem).L.map((e) => [e.name, e.order, e.img ?? null, ...(e.m ?? []).map(r3)]);
  };
  let n = 0;
  for (const [key, fixture] of Object.entries(old)) {
    const [id, c] = key.split('|'), [st, t] = c.split(':'), d = FIGHTERS[id], R = RIGS[d.art.rig];
    check(id !== 'mouse-fighter' || !R.bodyViews, 'mouse: no views');
    const { bodyViews, ...noViews } = R;
    const want = id === 'mouse-fighter' ? fixture : layout(d, noViews, st, t);
    check(JSON.stringify(layout(d, R, st, t)) === JSON.stringify(want), `${key}: lays out exactly as without views`);
    n++;
  }
  check(n >= 40, `no-view cells: ${n} frames`);
}

// 2. views: children on the view's points, the view's drawing, bands
{
  const L = (sw, j = S, held = null) => layoutRig(rat, j, sw, held);
  const Q = by(L({})), Sd = by(L({ '@view.torso': 'S' }));
  check(Sd.torso.img.endsWith('torso-side.png'), 'S: the side torso drawn');
  const A = anchorsOf(rat, 'torso', 'S');
  check(near(apply(Sd.torso.base, ...A.head), apply(Sd.head.base, ...rat.parts.head.pivot)), 'S: the head hangs on the side torso\'s neck point');
  check(near(apply(Sd.torso.base, ...A['arm-near-upper']), apply(Sd['arm-near-upper'].base, ...rat.parts['arm-near-upper'].pivot)), 'S: near arm on the side torso\'s shoulder');
  check(near(apply(Sd.torso.base, ...A.torso), apply(Q.torso.base, ...rat.parts.torso.pivot)), 'S: the side torso\'s waist sits on the pelvis\' waist');
  const order = (sw, held) => L(sw, S, held);
  const LQ = order({}), LS = order({ '@view.torso': 'S' }), LF = order({ '@view.torso': 'F' });
  check(idx(LQ, 'arm-near-upper') < idx(LQ, 'torso'), 'Q: near upper arm under the vest');
  for (const [v, LL] of [['S', LS], ['F', LF]]) check(['arm-near-upper', 'arm-near-lower', 'hand-near'].every((n) => idx(LL, n) > idx(LL, 'torso')), `${v}: the whole near arm in front of the torso`);
  const held = heldOf(fighter(def), rat), LB = order({ '@view.torso': 'BQ' }, held);
  check(['arm-near-upper', 'arm-near-lower', 'hand-near', 'held'].every((n) => idx(LB, n) < idx(LB, 'torso')), 'BQ: the near arm and its cutlass wholly behind the body');
  check(by(LB).held.order < by(LB)['hand-near'].order && by(LB).held.order > by(LB)['arm-near-upper'].order, 'BQ: the cutlass keeps its place under the fist');
  const Bk = order({ '@view.torso': 'B', '@view.pelvis': 'B' });
  check(['arm-far-upper', 'arm-far-lower', 'hand-far'].every((n) => idx(Bk, n) > idx(Bk, 'torso')) && idx(Bk, 'arm-near-upper') < idx(Bk, 'torso'), 'B: far arm in front, near arm behind');
  check(idx(Bk, 'leg-near-upper') < idx(Bk, 'pelvis') && idx(Bk, 'leg-far-upper') > idx(Bk, 'pelvis') && idx(Bk, 'tail') > idx(Bk, 'pelvis'), 'B: legs swap depth, tail in front of the pelvis');
  check(by(Bk).head.img.endsWith('head-back.png'), 'B: the back head comes with the back torso');
  check(by(order({ '@view.torso': 'B', head: 'head-hurt' })).head.img.endsWith('head-hurt.png'), 'B: a pose\'s own head swap wins');
  const O = order({ '@order.arm-far-upper': 850 });
  check(idx(O, 'arm-far-upper') > idx(O, 'head'), 'pose band override: the far arm in front of the chest');
  check(JSON.stringify(order({ '@view.torso': 'Q' }).map((e) => [e.name, e.order, ...e.m])) === JSON.stringify(LQ.map((e) => [e.name, e.order, ...e.m])), 'Q named = no view');
  const R = viewRig(rat, { torso: 'S' });
  check(near(R.parts.head.attach, rat.bodyViews.torso.S.anchors.neck) && R.parts.head !== rat.parts.head && rat.parts.head.attach[0] === 169.6, 'viewRig: parts on the view\'s points, the rig untouched');
}

// 3. shoulder caps
{
  const capped = { ...rat, parts: { ...rat.parts, 'shoulder-near': { img: rat.parts.torso.img, parent: 'arm-near-upper', attach: [60, 20], pivot: [0, 0], order: 0, cap: true } } };
  const j = { ...S, 'arm-near-upper': S['arm-near-upper'] + 40 };
  check(!layoutRig(capped, j, {}).some((e) => e.name === 'shoulder-near'), 'cap: hidden while its arm is under the torso (Q)');
  const L = layoutRig(capped, j, { '@view.torso': 'S' }), c = by(L)['shoulder-near'], a = by(L)['arm-near-upper'];
  check(c && c.order === a.order + 5, 'cap: shown on top of its arm in S');
  const ang = (m) => Math.atan2(m[1], m[0]) * 180 / Math.PI, wrap = (d) => ((((d + 180) % 360) + 360) % 360) - 180, arm = wrap(40 + S['arm-near-upper']);
  check(Math.abs(wrap((ang(c.m) - ang(a.m)) + (1 - RIG_MOTION.capTurn) * arm)) < 1e-6, `cap: turns ${RIG_MOTION.capTurn} of the arm's swing`);
}

// 4. the slide between views, the turn-around through F
{
  const mem = {}, f = fighter(def), sw = (v) => ({ '@view.torso': v });
  viewLayer(rat, f, S, sw('Q'), mem, 0);
  const T = RIG_MOTION.viewBlend, mid = viewLayer(rat, f, S, sw('S'), mem, 1).swap;
  check(mid['@viewFrom.torso'] === 'Q' && mid['@viewMix.torso'] === 0, 'slide: starts from the old view');
  const half = viewLayer(rat, f, S, sw('S'), mem, 1 + T / 2).swap, L = by(layoutRig(rat, S, half));
  const want = anchorsOf(rat, 'torso', 'Q').head.map((v, i) => (v + anchorsOf(rat, 'torso', 'S').head[i]) / 2);
  check(near(apply(L.torso.base, ...want), apply(L.head.base, ...rat.parts.head.pivot)), 'slide: halfway, the head halfway between the two necks');
  check(!('@viewMix.torso' in viewLayer(rat, f, S, sw('S'), mem, 1 + T).swap), 'slide: done after viewBlend');
  const m2 = {}, g = fighter(def), seq = [];
  viewLayer(rat, g, S, {}, m2, 0);
  g.facing = -1;
  for (let i = 0; i < 6; i++) { const r = viewLayer(rat, g, S, {}, m2, 1 + i / 60); seq.push([r.joints.sx, r.swap['@view.torso'] ?? 'Q']); }
  check(JSON.stringify(seq.slice(0, 4).map((s) => s[0])) === JSON.stringify(RIG_MOTION.turn.sx) && seq[4][0] === 1, `turn: width crosses zero (${seq.map((s) => s[0]).join(' ')})`);
  check(seq.map((s) => s[1]).join(' ') === 'Q F F Q Q Q', `turn: F for two frames at the midpoint (${seq.map((s) => s[1]).join(' ')})`);
  const mouse = RIGS['mouse-fighter'], m3 = {}, h = fighter(FIGHTERS['mouse-fighter']), J = channelsOf(mouse);
  viewLayer(mouse, h, J, {}, m3, 0); h.facing = -1;
  check(viewLayer(mouse, h, J, {}, m3, 1).joints === J, 'turn: a rig without views never turns through F');
}

// 5. the turning slash: windup BQ (arm behind) until the named key, then F with the arm in front, Q after the follow
{
  const M = def.moves.ratSlash, P = rat.poses.moves.ratSlash, T = rat.poses.timing;
  const at = (mf) => { const f = fighter(def, { state: 'attack', move: M, moveKey: 'ratSlash', mf, t: mf }); const tp = targetPose(f, rat, 0); return { f, tp, L: layoutRig(rat, tp.joints, tp.swap, heldOf(f, rat)) }; };
  const w = at(M.windup - 1);
  check(w.tp.swap['@view.torso'] === 'BQ' && idx(w.L, 'arm-near-upper') < idx(w.L, 'torso') && idx(w.L, 'held') < idx(w.L, 'torso'), 'slash wind-up: turned away, cocked arm and cutlass behind the body');
  check(at(M.windup).tp.swap['@view.torso'] === 'BQ', `slash: the first swing frame still before the switch key (switchAt ${P.switchAt})`);
  const s = at(M.windup + 1);
  check(s.tp.swap['@view.torso'] === 'F' && idx(s.L, 'arm-near-upper') > idx(s.L, 'torso'), 'slash through key: chest toward the camera, the arm comes over in front');
  const k = at(M.windup + M.active - 1);
  check(k.tp.swap['@view.torso'] === 'F' && idx(k.L, 'held') > idx(k.L, 'torso'), 'slash strike: F, arm and cutlass in front');
  check(at(M.windup + M.active + Math.ceil(M.recovery * T.swapBack) + 1).tp.swap['@view.torso'] === undefined, 'slash recover: back to three-quarter after the follow-through');
}

// 6. springs: the tail trails motion, stays within max, settles; off = untouched
{
  const run = (rig, frames) => {
    const f = fighter(def, { state: 'walk' }), mem = {}, out = [];
    for (let i = 0; i < frames; i++) { f.t = i; f.x = i < 60 ? i * 2 : 120; f.state = i < 60 ? 'walk' : 'idle'; out.push(rigFrame(f, rig, i / 60, mem).joints); }
    return out;
  };
  const on = run(rat, 240), off = run({ ...rat, springs: { ...rat.springs, off: true } }, 240);
  const d = on.map((j, i) => Math.abs(j['tail-3'] - off[i]['tail-3']));
  check(Math.max(...d) > 1, `springs: the tail tip lags the motion (up to ${Math.max(...d).toFixed(1)} deg)`);
  check(d.every((v) => v <= RIG_MOTION.springs.max + 1e-9), 'springs: never past max');
  check(d.slice(-20).every((v) => v < 0.5), `springs: settle once he stands still (${d.at(-1).toFixed(2)} deg)`);
  check(on.every((j, i) => j.torso === off[i].torso && j['leg-near-upper'] === off[i]['leg-near-upper']), 'springs: only the sprung parts move');
}

// 7. carry socket: halfway between the fists, the crate there in its band, turned with the fists' line
{
  const sw = { '@carry': 'crate' }, L = carryLayer(rat, layoutRig(rat, S, sw), sw), c = by(L).carried, P = socketPoints(rat, L);
  check(c && c.order === rat.carry.order && idx(L, 'carried') > idx(L, 'torso'), 'carry: the crate drawn in the carry band, over the torso');
  check(near(P.carry, [(P.hand_near[0] + P.hand_far[0]) / 2, (P.hand_near[1] + P.hand_far[1]) / 2]), 'carry: socket halfway between the fists');
  check(near(apply(c.m, 80, 70), P.carry, 1e-6), 'carry: the crate\'s hold point on the socket');
  check(carryLayer(rat, layoutRig(rat, S, {}), {}).every((e) => e.name !== 'carried'), 'carry: nothing carried unless a pose names it');
}

console.log(failed ? `${failed} failed` : 'views: all passed');
process.exit(failed ? 1 : 0);
