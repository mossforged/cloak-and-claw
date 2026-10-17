// Tail and scarf springs (T028, study recommendation 10): rotation only. Each sprung part's joint trails the sideways
// speed of the point it hangs from (the fighter's own motion plus the body's), pulled back toward the pose and damped:
// weight, not bounce. Numbers in data/rig-motion.js (lab); a rig opts in with `springs: { parts: { <part>: gain } }`
// (`off: true` = off for that rig). Render memory only (mem.springs); a first frame, a skipped one (> 0.1 s) or a facing
// flip only re-measures. Layered after the floor rule, before the grip (render/rig.js rigFrame). Pure given mem.
import { RIG_MOTION } from '../data/rig-motion.js';
import HULLS from '../data/rigs/hulls.js';
import { layoutRig, apply } from './rig-layout.js';

// the bone's far end in its own px: its first child's attach, else the middle of its drawing's hull
function tipOf(rig, name) {
  const child = Object.values(rig.parts).find((c) => c.parent === name);
  if (child) return child.attach;
  const h = HULLS[rig.parts[name].img];
  if (h?.length) return [h.reduce((a, q) => a + q[0], 0) / h.length, h.reduce((a, q) => a + q[1], 0) / h.length];
  return [0, 0];
}

export function springLayer(rig, f, joints, swap, mem, time, k = 1) {
  const S = rig.springs, R = RIG_MOTION.springs;
  if (!S || S.off || !R.on) return joints;
  const st = (mem.springs ??= {}), dt = time - (st.t ?? time), fresh = !(dt > 0 && dt <= 0.1) || st.facing !== f.facing;
  st.t = time; st.facing = f.facing;
  const L = layoutRig(rig, joints, swap), byName = Object.fromEntries(L.map((e) => [e.name, e]));
  const out = { ...joints }, w = 2 * Math.sqrt(R.strength) * R.damping;
  for (const [name, gain] of Object.entries(S.parts)) {
    const e = byName[name], p = rig.parts[name];
    if (!e) { delete st[name]; continue; }
    const [px, py] = apply(e.base, ...p.pivot), [cx, cy] = apply(e.base, ...tipOf(rig, name));
    // the joint in the fighter's own frame (x toward his facing), in screen px
    const pos = [px * k + f.x * f.facing, py * k + f.y - f.z], s = (st[name] ??= { a: 0, v: 0, pos });
    if (!fresh) {
      const vel = [(pos[0] - s.pos[0]) / dt, (pos[1] - s.pos[1]) / dt], len = Math.hypot(cx - px, cy - py) || 1;
      const dir = [(cx - px) / len, (cy - py) / len], side = dir[0] * vel[1] - dir[1] * vel[0];
      s.v += (R.strength * (-R.inertia * gain * side - s.a) - w * s.v) * dt;   // goal: trail the sideways speed
      s.a = Math.max(-R.max, Math.min(R.max, s.a + s.v * dt));
    }
    s.pos = pos;
    out[name] = (out[name] ?? 0) + s.a;
  }
  return out;
}
