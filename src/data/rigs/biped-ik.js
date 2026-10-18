// Pose authoring helper for standard-biped rigs (T023): turns a pose written as places and directions into the usual
// joint angles (degrees added to the master pose, rigs/*-poses.js). Pure math on the rig's own data, run once when the
// pose files load; the game then sees plain joint numbers. Only for rigs on the standard (rest 0 = master, uniform scale).
//   pose(rig, spec): spec keys
//     hand:   { at: [x, y] | off: [x, y], dir, bend?, up? }  near grip fist: its slot (rig.hands['hand-near-grip']) at screen point
//             (x forward, y down, feet at 0,0, before the pose's sx mirror; `off` = from the shoulder instead), blade pointing `dir` (screen degrees: 0 =
//             forward, -90 = up, 90 = down; unwrapped: a swing turns from one pose's dir to the next's the way the
//             numbers run). bend -1 = elbow the other way from the master's. up = the upper arm's direction to
//             unwrap next to (default dir: the arm follows the blade round).
//     shield: { at | off, turn = 0, bend? }  far fist's strap point; turn = the shield's tilt (degrees, + = top forward... as
//             drawn, clockwise) from the master.
//     feet:   { near: [x, lift, turn], far: [...] }  ankle x (screen px) and height off its planted height; turn =
//             the foot's tilt from flat (+ = toes down, facing right). Legs are bent by IK to put the ankles there.
//     anything else (pelvis, torso, head, dx, dy, tail, swap, '<part>.order', raw joints) passes through as given.
//     wholeArm: { swap, dir }  (T024) a whole near-arm drawing (A016 cocked) turned so its carried item points `dir`.
//     lift:   { 'foot-near': px }  (T024) names a foot's height off its floor line outright (a whole-leg drawing: its
//             lowest point's; default 0 = on the floor, the leg turned at the hip until it touches).
//   T024 floor-line rule: each foot placed off the floor gets a '<foot>.lift' channel = how far its drawing ends up above
//   its floor line (rigs/biped-floor.js); in play the legs are re-solved so the foot sits exactly that high (0 = planted,
//   render/floor.js). The foot's tilt is its own key: the IK target never changes it.
//   walkWaves(rig, opts): the walk's leg joints as waves (one per joint, rigs/*-poses.js format) fitted to IK on an
//     ankle path: planted sweep back at walk speed, lifted arc forward (3 harmonics each).
import { liftOf, floorLine, turnToFloor, wholeLeg } from './biped-floor.js';
import HULLS from './hulls.js';

const D = Math.PI / 180;
const ang = (v) => Math.atan2(v[1], v[0]) / D;
const len = (v) => Math.hypot(v[0], v[1]);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const turn = (deg, [x, y]) => { const c = Math.cos(deg * D), s = Math.sin(deg * D); return [x * c - y * s, x * s + y * c]; };
const near = (a, ref) => a + 360 * Math.round((ref - a) / 360);   // a, unwrapped to within 180 of ref
const wrap = (a) => near(a, 0);

// From a part's pivot to a child's attach point, in the part's own px (at rest 0 = the master pose).
const bone = (rig, child) => { const c = rig.parts[child], p = rig.parts[c.parent]; return sub(c.attach, p.pivot); };

// World turns (sum of joints up the chain) -> screen points of part pivots, feet at 0,0. A parent's `<part>.sx/.sy`
// scales where its children attach (render/rig.js shape), e.g. a narrowed pelvis brings the hips together.
function placer(rig, j, R) {
  const at = {};
  const of = (n) => {
    if (at[n]) return at[n];
    const p = rig.parts[n];
    if (!p.parent) return (at[n] = [j.dx ?? 0, (j.dy ?? 0) - rig.rootY]);
    const b = bone(rig, n), v = turn(R(p.parent), [b[0] * (j[`${p.parent}.sx`] ?? 1), b[1] * (j[`${p.parent}.sy`] ?? 1)]), o = of(p.parent);
    return (at[n] = [o[0] + rig.scale * v[0], o[1] + rig.scale * v[1]]);
  };
  return of;
}

// Two-bone IK: upper -> lower -> end, with the end part's world turn endR and its point `pt` (own px) on target T.
// Returns world turns for upper and lower. bend 1 = the master's elbow side.
export function limb(rig, up, lo, end, S, T, endR, pt, bend = 1, ref) {
  const b1 = bone(rig, lo), b2 = bone(rig, end), k = rig.scale;
  const W = sub(T, turn(endR, [k * (pt[0] - rig.parts[end].pivot[0]), k * (pt[1] - rig.parts[end].pivot[1])]));
  const l1 = k * len(b1), l2 = k * len(b2), v = sub(W, S);
  const d = Math.max(Math.abs(l1 - l2) + 0.01, Math.min(l1 + l2 - 0.01, len(v)));
  const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))) / D;
  const side = -Math.sign(b1[0] * b2[1] - b1[1] * b2[0]) * bend || bend;
  const dir1 = near(ang(v) + side * a, ref ?? ang(b1));   // bone direction on screen, unwrapped next to ref
  const E = [S[0] + l1 * Math.cos(dir1 * D), S[1] + l1 * Math.sin(dir1 * D)];
  const dir2 = near(ang(sub(W, E)), dir1);
  return [dir1 - ang(b1), dir2 - ang(b2)];
}

export function pose(rig, spec) {
  const { hand, shield, feet, lift, wholeArm, kneeForward, ...j } = spec;
  const R = { pelvis: j.pelvis ?? 0 };
  R.torso = R.pelvis + (j.torso ?? 0);
  const world = (n) => R[n] ?? 0, place = placer(rig, j, world), H = rig.hands;
  const target = (h, up) => h.at ?? [place(up)[0] + h.off[0], place(up)[1] + h.off[1]];
  if (hand) {
    const g = H['hand-near-grip'], endR = hand.dir - g.axis;
    [R['arm-near-upper'], R['arm-near-lower']] = limb(rig, 'arm-near-upper', 'arm-near-lower', 'hand-near',
      place('arm-near-upper'), target(hand, 'arm-near-upper'), endR, g.at, hand.bend, hand.up ?? hand.dir);
    j['arm-near-upper'] = R['arm-near-upper'] - R.torso;   // unwrapped too: the arm swings round the way the blade does
    j['arm-near-lower'] = R['arm-near-lower'] - R['arm-near-upper'];
    j['hand-near'] = endR - R['arm-near-lower'];   // unwrapped: the blade's world turn is exactly hand.dir
  }
  if (wholeArm) {   // T024: a whole near-arm drawing (cocked, raised) turned so the item it carries points `dir`
    const sw = rig.parts['arm-near-upper'].swaps[wholeArm.swap];
    j.swap = { ...j.swap, 'arm-near-upper': wholeArm.swap };
    j['arm-near-upper'] = wholeArm.dir - sw.axis - R.torso;
  }
  if (shield) {
    const g = rig.shieldRef ?? H['hand-far-shield'], endR = shield.turn ?? 0;   // T028 r4: a rig may pin this reference apart from its shield hold
    [R['arm-far-upper'], R['arm-far-lower']] = limb(rig, 'arm-far-upper', 'arm-far-lower', 'hand-far',
      place('arm-far-upper'), target(shield, 'arm-far-upper'), endR, g.at, shield.bend);
    j['arm-far-upper'] = wrap(R['arm-far-upper'] - R.torso);
    j['arm-far-lower'] = wrap(R['arm-far-lower'] - R['arm-far-upper']);
    j['hand-far'] = wrap(endR - R['arm-far-lower']);
  }
  for (const [side, v] of Object.entries(feet ?? {})) {
    const up = `leg-${side}-upper`, lo = `leg-${side}-lower`, ft = `foot-${side}`, [x, lift = 0, tilt = 0] = v;
    const y = planted(rig, ft) - lift;
    // T024 kneeForward: the knee forward (facing right) whichever side the master's nearly straight leg kinks to
    const sols = (kneeForward ? [1, -1] : [1]).map((b) => limb(rig, up, lo, ft, place(up), [x, y], tilt, rig.parts[ft].pivot, b));
    const kneeX = ([a]) => place(up)[0] + rig.scale * turn(a, bone(rig, lo))[0];
    const [r1, r2] = sols.length < 2 || kneeX(sols[0]) >= kneeX(sols[1]) - 1e-6 ? sols[0] : sols[1];
    j[up] = wrap(r1 - R.pelvis); j[lo] = wrap(r2 - r1); j[ft] = wrap(tilt - r2);
  }
  for (const side of Object.keys(feet ?? {})) {
    const ft = `foot-${side}`, h = liftOf(rig, j, ft, j.swap?.[ft]);
    if (h > 0.05) j[`${ft}.lift`] = h;
  }
  for (const side of ['near', 'far']) {   // a whole-leg drawing (kneeling, folded) turns at the hip onto its floor line
    const w = wholeLeg(rig, j.swap, side), ft = `foot-${side}`, h = lift?.[ft] ?? 0;
    if (!w || `leg-${side}-upper` in spec) continue;   // a hip angle given (air, lying): as posed
    j[`leg-${side}-upper`] = turnToFloor(rig, j, `leg-${side}-upper`, w, floorLine(rig, ft) - h);
    if (h > 0) j[`${ft}.lift`] = h;
  }
  for (const [ft, h] of Object.entries(lift ?? {})) if (!wholeLeg(rig, j.swap, ft.slice(5))) j[`${ft}.lift`] = h;   // named lift wins
  for (const k of Object.keys(j)) if (typeof j[k] === 'number') j[k] = Math.round(j[k] * 100) / 100;
  return j;
}

// Screen y of a foot's ankle when it stands flat on the floor (the master's height above the feet line).
export function planted(rig, ft) {
  const of = placer(rig, {}, () => 0);
  return of(ft)[1];
}
// Screen point of a part's pivot in the master pose (feet at 0,0): where the master puts the ankles, hands, hips.
export const masterAt = (rig, part) => placer(rig, {}, () => 0)(part);

// Waves fitted to samples over one cycle: harmonics 1..H, as a list of waves that add up (rig-pose.js evalPose);
// the first carries the mean.
export function fitWave(vals, H = 3) {
  const N = vals.length, r = (x) => Math.round(x * 100) / 100, m = vals.reduce((a, v) => a + v, 0) / N, out = [];
  for (let h = 1; h <= H; h++) {
    let a = 0, b = 0;
    vals.forEach((v, i) => { const t = 2 * Math.PI * h * i / N; a += 2 * v * Math.sin(t) / N; b += 2 * v * Math.cos(t) / N; });
    out.push([h === 1 ? r(m) : 0, r(Math.hypot(a, b)), r((((Math.atan2(b, a) / (2 * Math.PI)) % 1) + 1) % 1), h]);
  }
  return out;
}

// Walk legs: speed cycles/s, walk px/s; each ankle sweeps back under its hip (planted half) and arcs forward lifted
// `lift` px (swing half); near and far half a cycle apart. dy = hips lowered (px). gather 0..1 = how far each stride's
// centre moves from under its own hip toward the middle of the two (wide 3/4 hips: 0 keeps each leg sweeping round its
// own spot, so the near foot never passes the far one; 1 = both feet step through under the body). Returns waves (lists of harmonics) for the leg joints.
// stride = px the planted foot sweeps (default walk / speed / 2: no skating); shorter = the boot slides a little.
// body = other pose channels held through the walk (e.g. 'pelvis.sx' narrowing the hips): the legs are fitted under it.
export function walkWaves(rig, { speed, walk, lift, dy = 0, reach = 0, gather = 0, stride, body = {}, N = 48 }) {
  const half = (stride ?? walk / speed / 2) / 2, x0 = (s) => placer(rig, body, () => 0)(`leg-${s}-upper`)[0], mid = (x0('near') + x0('far')) / 2;
  const hip = (s) => x0(s) + gather * (mid - x0(s)) + reach;
  const ankle = (s, u) => {
    if (u < 0.5) return [hip(s) + half - 4 * half * u, 0, 0];
    const k = (u - 0.5) * 2, e = k * k * (3 - 2 * k);
    return [hip(s) - half + 2 * half * e, lift * Math.sin(Math.PI * k), 8 * Math.sin(Math.PI * k)];
  };
  const out = {}, keys = ['leg-near-upper', 'leg-near-lower', 'foot-near', 'leg-far-upper', 'leg-far-lower', 'foot-far', 'foot-near.lift', 'foot-far.lift'];
  const series = Object.fromEntries(keys.map((k) => [k, []]));
  for (let i = 0; i < N; i++) {
    const u = i / N, j = pose(rig, { ...body, dy, feet: { near: ankle('near', u), far: ankle('far', (u + 0.5) % 1) } });
    for (const k of keys) series[k].push(k.endsWith('.lift') ? j[k] ?? 0 : near(j[k], series[k].at(-1) ?? j[k]));
  }
  for (const k of keys) out[k] = fitWave(series[k], k.endsWith('.lift') ? 6 : 3);   // lifts: sharper (planted half flat)
  return out;
}

// T024: the '<foot>.lift' waves a walk written as raw joint waves already has (how high each foot's drawing rises off its
// floor line over one cycle), so the floor-line rule keeps it as it was. pose = a wave pose (speed = cycles/s).
export function liftWaves(rig, pose, N = 48) {
  const val = (v, t) => (!Array.isArray(v) ? v : (Array.isArray(v[0]) ? v : [v]).reduce((a, w) => a + w[0] + w[1] * Math.sin(2 * Math.PI * ((pose.speed ?? 1) * t * (w[3] ?? 1) + (w[2] ?? 0))), 0));
  const feet = Object.keys(rig.parts).filter((n) => n.startsWith('foot-')), series = Object.fromEntries(feet.map((n) => [n, []]));
  for (let i = 0; i < N; i++) {
    const t = i / N / (pose.speed ?? 1), j = {};
    for (const [k, v] of Object.entries(pose)) if (k !== 'speed' && k !== 'swap') j[k] = val(v, t);
    for (const n of feet) series[n].push(liftOf(rig, j, n, pose.swap?.[n]));
  }
  return Object.fromEntries(feet.map((n) => [`${n}.lift`, fitWave(series[n], 6)]));
}

// T024 walk (study 2026-10-17, 9-key pattern): hips low at each contact and high at each passing (`bob` px round `dy`),
// each ankle pinned to the floor through its planted half at exactly walk speed (stride = walk / speed / 2 unless given:
// shorter = the boot slides that much), stride centres gathered `gather` of the way from under each hip toward the
// middle (wide 3/4 hips stay as drawn: no pelvis narrowing), foot tilt keyed on its own: flat while planted, heel rising
// (`heel` deg) at the end of the stance, then the toe-off drawing (`toe`: swap per side) pushing off into the swing,
// toes up `strike` deg as it reaches for the next contact. Lifted `lift` px at mid-swing. Returns waves for the leg
// joints, '<foot>.lift' and dy, and `swapPhase` (render/rig-pose.js shows the toe-off drawings in their window).
export function walkCycle(rig, { speed, walk, lift = 5, dy = 0, bob = 0, gather = 0, stride, heel = 12, strike = 8, toe = {}, toeAt = [0.4, 0.62], N = 72 }) {
  const half = (stride ?? walk / speed / 2) / 2, of = placer(rig, {}, () => 0), x0 = (s) => of(`leg-${s}-upper`)[0];
  const mid = (x0('near') + x0('far')) / 2, centre = (s) => x0(s) + gather * (mid - x0(s));
  const reachDown = (ft, img, tilt) => {   // how far below the ankle the drawing reaches at this tilt (screen px)
    const p = rig.parts[ft], sw = p.swaps?.[img], H = HULLS[sw ? sw.img : p.img] ?? [], off = sw?.offset ?? [0, 0], k = sw?.scale ?? 1;
    return Math.max(...H.map(([x, y]) => rig.scale * turn(tilt, [off[0] + k * x - p.pivot[0], off[1] + k * y - p.pivot[1]])[1]));
  };
  const step = (s, u) => {   // [ankle x, sole height, tilt, swap]
    const tw = toe[s] && u >= toeAt[0] && u < toeAt[1] ? toe[s] : null;
    if (u < 0.5) {
      const k = Math.max(0, (u - 0.3) / 0.1);
      return [centre(s) + half - 4 * half * u, 0, tw ? 0 : heel * Math.min(1, k), tw];
    }
    const k = (u - 0.5) * 2, e = k * k * (3 - 2 * k);
    return [centre(s) - half + 2 * half * e, lift * Math.sin(Math.PI * k), tw ? 0 : heel * (1 - k) * 1.2 - strike * k, tw];
  };
  const keys = ['leg-near-upper', 'leg-near-lower', 'foot-near', 'leg-far-upper', 'leg-far-lower', 'foot-far'];
  const series = Object.fromEntries([...keys, 'foot-near.lift', 'foot-far.lift'].map((k) => [k, []]));
  for (let i = 0; i < N; i++) {
    const u = i / N, d = dy + bob * Math.cos(4 * Math.PI * u), feet = {}, swap = {};
    for (const [s, sh] of [['near', 0], ['far', 0.5]]) {
      const ft = `foot-${s}`, [x, h, tilt, sw] = step(s, (u + sh) % 1);
      const y = floorLine(rig, ft) - h - reachDown(ft, sw, tilt);
      feet[s] = [x, planted(rig, ft) - y, tilt];
      if (sw) swap[ft] = sw;
    }
    const j = pose(rig, { dy: d, feet, swap, kneeForward: true });
    for (const k of keys) series[k].push(near(j[k], series[k].at(-1) ?? j[k]));
    for (const s of ['near', 'far']) series[`foot-${s}.lift`].push(j[`foot-${s}.lift`] ?? 0);
  }
  const out = Object.fromEntries(Object.entries(series).map(([k, v]) => [k, fitWave(v, 6)]));
  out.dy = [[dy, bob, 0.25, 2]];
  out.swapPhase = Object.entries(toe).map(([s, sw]) => ({ part: `foot-${s}`, swap: sw, from: (toeAt[0] + (s === 'far' ? 0.5 : 0)) % 1, to: (toeAt[1] + (s === 'far' ? 0.5 : 0)) % 1 }));
  return out;
}
