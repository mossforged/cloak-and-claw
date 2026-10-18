// Standing height (T026 round 2): the top of a fighter's drawn body (screen px above the feet, head included, held items
// and gear not) in a state, as the game draws it (render/rig.js rigFrame). alphaOf(img) -> { w, h, alpha }. Pure.
import { rigFrame } from '../../src/render/rig.js';

const BODY = /^(pelvis|torso|head|arm-|hand-|leg-|foot-|tail|scarf)/;
export function heightOf(def, rig, alphaOf, state = 'idle', t = 0) {
  const f = { def, state, t, mf: 0, move: null, z: 0, vz: 0, facing: 1, id: 1, x: 0, y: 0, stun: 10, grab: { knee: -1 } }, mem = {};
  rigFrame(f, rig, -1, mem); const fr = rigFrame(f, rig, 0, mem), p = fr.p, k = fr.k;
  const c = Math.cos(p.rot), s = Math.sin(p.rot), V = [p.sx * k * c, p.sx * k * s, -p.sy * k * s, p.sy * k * c, p.dx, p.dy];
  let top = Infinity;
  for (const e of fr.L) {
    if (!e.m || e.line || !BODY.test(e.name)) continue;
    const A = alphaOf(e.img); if (!A) continue;
    const m = e.m;
    for (let y = 0; y < A.h; y += 2) for (let x = 0; x < A.w; x += 2) if (A.alpha[y * A.w + x] > 127) {
      const X = m[0] * x + m[2] * y + m[4], Y = m[1] * x + m[3] * y + m[5];
      top = Math.min(top, V[1] * X + V[3] * Y + V[5]);
    }
  }
  return -top;
}
