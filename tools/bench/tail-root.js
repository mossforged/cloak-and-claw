// Tail-root check (T026 round 2, split out of stretch.js): the walk's butt / tail gap. The tail root's end (its drawn
// pixels farthest out past the pivot, away from tail-2 or, one-piece, from its tip) must tuck under the body drawn in
// front of it (rig standard 5.3: overlaps hide under the neighbour); most of it in sight is a flag. Pure.
// covers(entry, screenPoint) and alphaOf(img) are the stretch test's.
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const BODY = /^(pelvis|torso|leg-|foot-)/, ROOT_PX = 1.5;   // ROOT_PX: depth of the tail root's end band (screen px)
// how far point P is from the nearest pixel of the entries (rings of 0.25 px out to 16; 16 if none)
function offBody(covers, list, P) {
  if (list.some((e) => covers(e, P))) return 0;
  for (let R = 0.25; R <= 16; R += 0.25) for (let a = 0; a < 48; a++) if (list.some((e) => covers(e, [P[0] + R * Math.cos(a * Math.PI / 24), P[1] + R * Math.sin(a * Math.PI / 24)]))) return R;
  return 16;
}

export function tailRootFlags(rig, drawn, e, cell, covers, alphaOf) {
  const out = [];
  const A = alphaOf(e.img), front = drawn.filter((o) => o.order > e.order && BODY.test(o.name));
  const P = apply(e.base, rig.parts.tail.pivot), kid = Object.keys(rig.parts).find((c) => rig.parts[c].parent === 'tail');
  const all = [];
  for (let y = 0; y < A.h; y += 2) for (let x = 0; x < A.w; x += 2) if (A.alpha[y * A.w + x] > 127) all.push(apply(e.m, [x + 0.5, y + 0.5]));
  const far = (Q) => Math.hypot(Q[0] - P[0], Q[1] - P[1]);   // a one-piece tail (the mouse): away = toward its tip
  const C = kid ? apply(e.base, rig.parts[kid].attach) : all.reduce((a, b) => (far(b) > far(a) ? b : a)), n = Math.hypot(P[0] - C[0], P[1] - C[1]) || 1, u = [(P[0] - C[0]) / n, (P[1] - C[1]) / n];
  const px = all.map((Q) => [Q, (Q[0] - C[0]) * u[0] + (Q[1] - C[1]) * u[1]]);
  const top = Math.max(...px.map(([, d]) => d)), end = px.filter(([, d]) => d > top - ROOT_PX).map(([Q]) => Q);
  const shows = end.filter((Q) => !front.some((o) => covers(o, Q)));
  if (shows.length > end.length / 2) {   // the cut end in sight (rig standard 5.3: overlaps hide under the neighbour)
    const gap = Math.min(...shows.map((Q) => offBody(covers, front, Q))) * cell.k;
    out.push({ text: `tail root end shows (${Math.round(100 * shows.length / end.length)}%, ${gap.toFixed(1)} px off the body)`, at: apply(cell.view, P) });
  }
  return out;
}
