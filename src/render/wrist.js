// Wrist limits (T029 r3): a hand turns at most its limit (data/wrists.js) from its drawn rest angle on the forearm. Run
// on a finished layout (render/rig-grip.js gripLayout, before the bow string), so every way a hand gets its angle (pose
// joints, the weapon node, the second hand's grip) is caught. Pure.
// A hand past its limit:
//   - holding something (the item hangs from it, or it is the second hand on a two-hander): the item turns about its
//     grip by d and the arm is solved to the hand's new angle: the forearm's direction is picked inside the limit, the
//     upper arm reaches the elbow that leaves (2-bone, the elbow keeps its bend side); where the arm can't reach the
//     wrist exactly, the item moves with the hand by what's left. The d (and forearm pick) with the least cost wins:
//     |d| + WRIST.trade * px moved + WRIST.armTurn * the arm's turn, summed over the item's hands.
//   - empty: the hand alone turns back to its limit (nothing held to keep in line).
// Whatever is still past (a squashed body during the turn-around) is turned back about the wrist, item and all: never
// the wrist past its limit. The hand's pivot stays on the forearm's wrist point.
import { mul, rot, tr, apply } from './rig-layout.js';
import { WRISTS, wristLimit, neutralOf, rangeOf, inside, clampIn } from '../data/wrists.js';
import { turnRange, excess } from '../data/pose-limits.js';

const D = Math.PI / 180;
const inv = (m) => { const d = m[0] * m[3] - m[1] * m[2]; return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d]; };
const wrap = (d) => ((d + 540) % 360) - 180;
const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) / D;
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const about = (P, deg) => mul(mul(tr(P[0], P[1]), rot(deg)), tr(-P[0], -P[1]));
const u = (deg) => [Math.cos(deg * D), Math.sin(deg * D)];
export const HANDS = /^hand-(near|far)$/;

// The hand's turn on its forearm in degrees (0 = as drawn on it): rotation of the hand's base frame seen from the
// forearm's base frame (in the forearm's px: a mirrored body measures as an upright one), less the parts' rest turns.
export function bendOf(F, H) {
  const M = mul(inv(F.base), H.base), flip = Math.sign(M[0] * M[3] - M[1] * M[2]) || 1;
  return wrap(Math.atan2(M[1] - flip * M[2], M[0] + flip * M[3]) / D + (F.p.rest ?? 0) - (H.p.rest ?? 0));
}

// The hand's turn from its drawing's natural angle on the forearm (data/wrists.js neutral): what the limit bounds.
export const turnOf = (rig, F, H) => wrap(bendOf(F, H) - neutralOf(rig, H.swap ?? H.name));

// One arm's state on screen: shoulder S, elbow E, wrist W; lengths; bend; the hand's and forearm's screen angles.
function armOf(by, H, rig) {
  const F = by[H.p.parent], U = F && by[F.p.parent];
  if (!F || !U || !/-lower$/.test(F.name)) return null;
  const S = apply(U.base, ...U.p.pivot), E = apply(F.base, ...F.p.pivot), W = apply(F.base, ...H.p.attach);
  const flip = Math.sign(F.base[0] * F.base[3] - F.base[1] * F.base[2]) || 1, side = Math.sign((E[0] - S[0]) * (W[1] - S[1]) - (E[1] - S[1]) * (W[0] - S[0]));
  // T034: the elbow's and shoulder's turns on their parents and their ranges (a body with hand-placed joints: the rat's near arm)
  const T = by[U.p.parent], er = WRISTS.armRanges && turnRange(rig, F.name), sr = WRISTS.armRanges && T && turnRange(rig, U.name);
  return { H, F, U, S, E, W, lu: dist(S, E), lf: dist(E, W), flip, side, bend: turnOf(rig, F, H), lim: wristLimit(rig, H.name.slice(5), H.swap ?? H.name),
    fu: ang(S, E), ff: ang(E, W), er, et: er && bendOf(U, F), sr, st: sr && bendOf(T, U) };
}

// Best arm for one hand whose wrist should land at Wd with the hand turned d (screen deg) from now:
// { cost, W (where the wrist ends), fu, ff (the arm's new screen angles), r (px off Wd) }. Px off Wd cost `across` each
// across the item's axis ax (a screen unit vector; none: every way), `along` each along it backward (the hand slides on
// the shaft, toward the item's grip end), `past` each along it forward.
function solveArm(a, Wd, d, ax, across, along, past = along, flips = false) {
  let best = null;
  const hs = a.flip * d;   // the hand's own turn, in the forearm's sense
  const [lo, hi] = rangeOf(a.lim);
  for (let b = lo; b <= hi + 1e-9; b += (hi - lo) / 36) {
    // bend = a.bend + hs - flip * dff  ->  dff = flip * (a.bend + hs - b)
    const ff = a.ff + a.flip * (a.bend + hs - b), f = u(ff), P = [Wd[0] - a.lf * f[0] - a.S[0], Wd[1] - a.lf * f[1] - a.S[1]];
    // the wrist spots tried: where the elbow circle meets the item's line through Wd (slid along it, exact), else the
    // nearest the arm gets to Wd
    const spots = [[0, 0]];
    if (ax) {
      const pa = P[0] * ax[0] + P[1] * ax[1], disc = pa * pa - (P[0] * P[0] + P[1] * P[1] - a.lu * a.lu);
      if (disc >= 0) for (const s of [-pa + Math.sqrt(disc), -pa - Math.sqrt(disc)]) spots.push([s * ax[0], s * ax[1]]);
    }
    for (const o of spots) {
      const Q = [a.S[0] + P[0] + o[0], a.S[1] + P[1] + o[1]];
      const fu = Math.abs(dist(a.S, Q)) < 1e-6 ? a.fu : ang(a.S, Q), elbow = wrap(ff - fu);
      if (Math.abs(elbow) > Math.max(WRISTS.elbowMax, Math.abs(wrap(a.ff - a.fu)))) continue;   // no deeper elbow bend than the art covers (or the pose had)
      // T034: elbow and shoulder inside their ranges, or no further out than the pose had them
      if (a.er && excess(a.et + a.flip * wrap(ff - fu - a.ff + a.fu), a.er) > excess(a.et, a.er) + 1e-6) continue;
      if (a.sr && excess(a.st + a.flip * wrap(fu - a.fu), a.sr) > excess(a.st, a.sr) + 1e-6) continue;
      // the elbow keeps its side, or pays for bending the other way on screen (the arm turned in depth: the archer's
      // string arm drawn back level with the arrow)
      const flipped = a.side && Math.sign(elbow) !== a.side && Math.abs(Math.sin(elbow * D)) > 0.1;
      if (flipped && (!flips || WRISTS.elbowFlip == null)) continue;   // only a second hand (the string arm drawn back)
      const E = [a.S[0] + a.lu * u(fu)[0], a.S[1] + a.lu * u(fu)[1]], W = [E[0] + a.lf * f[0], E[1] + a.lf * f[1]];
      const v = [W[0] - Wd[0], W[1] - Wd[1]], al = ax ? v[0] * ax[0] + v[1] * ax[1] : 0, r = Math.hypot(...v);
      const cost = across * Math.sqrt(Math.max(0, r * r - al * al)) + (al > 0 ? past * al : -along * al) + WRISTS.armTurn * (Math.abs(wrap(fu - a.fu)) + Math.abs(wrap(ff - a.ff))) + (flipped ? WRISTS.elbowFlip : 0);
      if (!best || cost < best.cost) best = { cost, W, fu, ff, r, E };
    }
  }
  return best;
}

const subtree = (L, name) => {
  const out = new Set([name]);
  for (let grew = true; grew;) { grew = false; for (const e of L) if (!out.has(e.name) && out.has(e.p?.parent)) { out.add(e.name); grew = true; } }
  return out;
};
const moveAll = (L, names, T) => L.map((e) => (names.has(e.name) ? { ...e, m: mul(T, e.m), base: mul(T, e.base) } : e));

// Puts one arm on its solution: upper arm about the shoulder, forearm onto the new elbow, hand subtree by T (screen).
function poseArm(L, a, s, Th) {
  const Tu = about(a.S, wrap(s.fu - a.fu)), Tf = mul(tr(s.E[0] - a.E[0], s.E[1] - a.E[1]), about(a.E, wrap(s.ff - a.ff)));
  const hand = subtree(L, a.H.name), fore = new Set([...subtree(L, a.F.name)].filter((n) => !hand.has(n)));
  const upper = new Set([...subtree(L, a.U.name)].filter((n) => !hand.has(n) && !fore.has(n)));
  return moveAll(moveAll(moveAll(L, upper, Tu), fore, Tf), hand, Th);
}

// opts: { art: the held item's art (grip, gripEnd), second: { hand, of } } a second hand gripping the item the hand `of` holds (two-hander, bow string hand).
export function limitWrists(rig, L, opts = {}) {
  if (!WRISTS.on || !L.some((e) => HANDS.test(e.name))) return L;
  const by = () => Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
  let B = by();
  const sec = opts.second && B[opts.second.hand] && B[opts.second.of] ? opts.second : null;
  for (const name of ['hand-near', 'hand-far']) {
    const H = B[name];
    if (!H || (sec && name === sec.hand)) continue;
    const a = armOf(B, H, rig);
    if (!a || inside(a.bend, a.lim, 0.01)) {
      if (!(sec && name === sec.of && a)) continue;
      const b2 = armOf(B, B[sec.hand], rig);
      if (!b2 || inside(b2.bend, b2.lim, 0.01)) continue;   // both hands of the item inside: nothing to do
    }
    const holds = subtree(L, name).size > 1 || (sec && sec.of === name);
    if (!holds) continue;   // empty hands: the clamp below
    const item = [...subtree(L, name)].find((n) => n !== name && B[n]?.p?.attach), G = item ? apply(H.base, ...B[item].p.attach) : a.W;
    const b = sec && sec.of === name ? armOf(B, B[sec.hand], rig) : null;
    // the item's axis on screen (its grip line), so moving the hand along it costs less than across it
    const I = item && B[item], A = I?.p?.art?.gripEnd ? I.p.art : opts.art, av = A?.gripEnd && I && [I.m[0] * (A.gripEnd[0] - A.grip[0]) + I.m[2] * (A.gripEnd[1] - A.grip[1]), I.m[1] * (A.gripEnd[0] - A.grip[0]) + I.m[3] * (A.gripEnd[1] - A.grip[1])];
    const ax0 = av && Math.hypot(...av) > 1e-6 ? ang([0, 0], av) : null, axOf = (dd) => (ax0 == null ? null : u(ax0 + dd));
    let best = null;
    const tc = b ? WRISTS.turn : WRISTS.turn1;   // an item in one hand turns more readily than one both hands hold
    turns: for (let d = 0; d <= 180; d += WRISTS.step) for (const dd of d ? [d, -d] : [0]) {
      if (best && tc * Math.abs(dd) >= best.cost) break turns;   // the turn alone already costs more
      const R = about(G, dd), s = solveArm(a, apply(R, ...a.W), dd, null, WRISTS.trade, WRISTS.trade);
      if (!s) continue;
      let cost = tc * Math.abs(dd) + s.cost, s2 = null;
      if (b) {
        const t = [s.W[0] - apply(R, ...a.W)[0], s.W[1] - apply(R, ...a.W)[1]], Wd2 = apply(R, ...b.W);
        // the second hand: off the shaft is a gap; it may slide back toward the first hand, not past its own grip; a hand on a
        // point (the bow's string) doesn't slide at all
        s2 = sec.slide === false ? solveArm(b, [Wd2[0] + t[0], Wd2[1] + t[1]], dd, null, WRISTS.gap, 0, 0, true)
          : solveArm(b, [Wd2[0] + t[0], Wd2[1] + t[1]], dd, axOf(dd), WRISTS.gap, WRISTS.slide2, WRISTS.gap, true);
        if (!s2) continue;
        cost += s2.cost;
      }
      if (!best || cost < best.cost) best = { cost, dd, s, s2, R };
    }
    if (WRISTS.trace) WRISTS.trace.push({ hand: name, bend: a.bend, second: b?.bend, best: best && { dd: best.dd, cost: best.cost, r: best.s.r, r2: best.s2?.r } });
    if (!best) continue;
    const Wd = apply(best.R, ...a.W), Th = mul(tr(best.s.W[0] - Wd[0], best.s.W[1] - Wd[1]), best.R);
    L = poseArm(L, a, best.s, Th);
    if (b) {   // the second hand: its forearm and upper arm to its solution, the hand where its wrist ends (in its limit)
      const Wd2 = apply(Th, ...b.W);
      L = poseArm(L, b, best.s2, mul(tr(best.s2.W[0] - Wd2[0], best.s2.W[1] - Wd2[1]), Th));
    }
    B = by();
  }
  return clampWrists(rig, L);
}

// Any hand still past its limit turns back about its wrist (with whatever it holds).
export function clampWrists(rig, L) {
  for (let pass = 0; pass < 6; pass++) {   // a squashed body (the turn-around) turns a hand by less or more on screen: repeat
    const B = Object.fromEntries(L.filter((e) => e.m && !e.line).map((e) => [e.name, e]));
    let moved = false;
    for (const name of ['hand-near', 'hand-far']) {
      const H = B[name], F = H && B[H.p.parent];
      if (!F || !/-lower$/.test(F.name)) continue;
      const bend = turnOf(rig, F, H), lim = wristLimit(rig, name.slice(5), H.swap ?? H.name);
      if (inside(bend, lim, 0.01)) continue;
      const flip = Math.sign(F.base[0] * F.base[3] - F.base[1] * F.base[2]) || 1, P = apply(F.base, ...H.p.attach);
      if (WRISTS.trace) WRISTS.trace.push({ clamp: name, bend });
      L = moveAll(L, subtree(L, name), about(P, flip * (clampIn(bend, lim, 0.05) - bend)));
      moved = true;
    }
    if (!moved) break;
  }
  return L;
}
