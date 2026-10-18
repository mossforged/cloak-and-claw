// Joint-band gaps (T026 r4): the see-through slivers where two parts meet in a real pose (the user's review: crotch,
// waist, near shoulder), which the stretch measure's core disc (stretch.js crack: a crack inside the joint's filled core,
// within 8 px of the pivot, drawing on both sides) misses when the sliver opens to the outside or sits off the pivot.
// Pure (no DOM): covers(e, P) is the caller's (is screen point P on entry e's drawing).
// A point P round the joint (parent p, child c; BOX px each way, STEP apart) is joint territory when nothing drawn covers it
// and each of the two drawings, carried back to rest with P riding along, says the other one covered it there: P is
// joint territory from both sides (the overlap that hid the cut ends opened). Open space the pose makes (between the legs,
// behind a swung arm) rides with at most one of them. Limit: under an arm raised off the torso, the armpit passes the
// both-sides test too (the arm lay against the torso at rest), so wide shoulder flags (over ~9 px) in arms-up poses are
// mostly open space: check them in the strip (tools/pose-seam-strip.mjs).
// Width = the narrowest span across the gap (4 axes) between the two drawings, each side within MAX px (as the stretch
// measure's crack: open space with no drawing that close on both sides is not a seam); the flag is the widest point's, over gaps of at least MIN_AREA px^2.
export const BOX = 20, STEP = 0.5, MAX = 8, MIN_AREA = 2;

const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const inv = (m) => { const d = m[0] * m[3] - m[1] * m[2]; return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[3] * m[4]) / d, (m[1] * m[4] - m[0] * m[5]) / d]; };
const toRest = (posed, rest) => { const i = inv(posed.m); return (P) => apply(rest.m, apply(i, P)); };

// J: the joint pivot (screen px); p, c: posed entries; rp, rc: the same parts at rest; drawn: every posed entry; out: unit
// vector to the outer side of the bend (stretch.js outward; null = nearly straight). -> { px, at, pts } (the widest gap point and its width, screen px; every gap point) or null.
export function jointGap(J, p, c, rp, rc, drawn, covers, out = null) {
  const viaP = toRest(p, rp), viaC = toRest(c, rc), n = Math.round((2 * BOX) / STEP) + 1;
  const hit = (P) => drawn.some((e) => covers(e, P)), pair = (P) => covers(p, P) || covers(c, P);
  const reach = (P, dx, dy) => { for (let d = STEP; d <= MAX; d += STEP) if (pair([P[0] + dx * d, P[1] + dy * d])) return d; return Infinity; };
  // W: width of each see-through point between the two (0 = drawn, inner crease or open space; NaN = not measured yet)
  const W = new Float32Array(n * n).fill(NaN), T = new Uint8Array(n * n), pt = (i) => [J[0] - BOX + (i % n) * STEP, J[1] - BOX + Math.floor(i / n) * STEP];
  const width = (i) => {
    if (!Number.isNaN(W[i])) return W[i];
    const P = pt(i);
    let w = Infinity;
    if (!(out && (P[0] - J[0]) * out[0] + (P[1] - J[1]) * out[1] < 0) && !hit(P))   // the inner crease of a bend is anatomy
      for (const [dx, dy] of [[1, 0], [0, 1], [Math.SQRT1_2, Math.SQRT1_2], [Math.SQRT1_2, -Math.SQRT1_2]]) w = Math.min(w, reach(P, dx, dy) + reach(P, -dx, -dy));
    return (W[i] = w < Infinity ? w : 0);   // drawing on both sides nowhere within MAX: open space, not a seam
  };
  // joint territory first (a few lookups a point): most joints have none and stop here
  const seeds = [];
  for (let i = 0; i < n * n; i++) { const P = pt(i); if (covers(rc, viaP(P)) && covers(rp, viaC(P))) { T[i] = 1; seeds.push(i); } }
  // each slit (8-neighbour see-through points) that reaches into joint territory; one smaller than MIN_AREA px^2 is a
  // nick between fur tips, not a seam; its width = the widest of its territory points
  let best = null;
  const pts = [], seen = new Uint8Array(n * n);
  for (const s0 of seeds) {
    if (seen[s0] || !width(s0)) continue;
    const comp = [s0];
    seen[s0] = 1;
    for (let k = 0; k < comp.length; k++) {
      const i = comp[k], x = i % n, y = (i - x) / n;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy, j = yy * n + xx;
        if (xx >= 0 && yy >= 0 && xx < n && yy < n && !seen[j] && width(j)) { seen[j] = 1; comp.push(j); }
      }
    }
    if (comp.length * STEP * STEP < MIN_AREA) continue;
    for (const i of comp) {
      if (!T[i]) continue;
      pts.push(pt(i));
      if (!best || W[i] > best.px) best = { px: W[i], at: pt(i) };
    }
  }
  return best && { ...best, pts };
}
