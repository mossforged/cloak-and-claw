// Rig sockets (T024, rig standard 9a): named points effects and items attach to (hand_near, hand_far, weapon_tip, chest,
// head_top, feet, mouth, tail_tip), declared in each rig's `sockets` (tools/rig_from_source.py derives them from the
// pivots and drawings). drawRig keeps each fighter's last drawn sockets in world px; effects ask with socketOf and fall
// back to their own numbers for standees. Render only.
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const ankles = new WeakMap();   // rig -> { foot: master ankle height above the floor line, screen px }

// The far end of a held item from its grip (art.tip, else where the handle line leaves the drawing). size(img) -> [w, h].
export function tipOf(A, size) {
  if (A.tip ?? A.tips) return A.tip ?? A.tips[0];   // a bow: its upper tip
  if (!A.gripEnd || !size?.(A.img)) return null;
  const [w, h] = size(A.img), d = [A.gripEnd[0] - A.grip[0], A.gripEnd[1] - A.grip[1]], n = Math.hypot(...d);
  const u = [d[0] / n, d[1] / n], ks = [];
  for (let i = 0; i < 2; i++) if (u[i]) ks.push(((u[i] > 0 ? [w, h][i] : 0) - A.grip[i]) / u[i]);
  const k = Math.min(...ks);
  return [A.grip[0] + u[0] * k, A.grip[1] + u[1] * k];
}

// Socket points in rig space (screen px, feet at 0,0, facing right) for one drawn layout L (layoutRig / gripLayout entries).
// A socket on a part a whole-limb swap hides (the fist under the raised arm) moves to that swap's `grip` point.
export function socketPoints(rig, L, held = null, size = null) {
  const out = {}, by = Object.fromEntries(L.filter((e) => e.m).map((e) => [e.name, e]));
  for (const [name, s] of Object.entries(rig.sockets ?? {})) {
    if (s.item) {   // the held item, else the rig's own weapon part (the mouse's sword: a part with its item `art`)
      const own = !held && rig.parts[rig.slots?.['one-hand']], e = held?.part ? by[held.slot] : own && by[rig.slots['one-hand']];
      const tip = e && tipOf(held?.part ? held.kit.art : own.art, size);
      if (tip) out[name] = apply(e.m, tip);
    } else if (s.parts) {
      if (!ankles.has(rig)) ankles.set(rig, {});
      const H = ankles.get(rig);
      const pts = s.parts.map((n) => by[n] && apply(by[n].base, rig.parts[n].pivot).map((v, i) => v + (i ? (H[n] ??= ankleHeight(rig, n)) : 0))).filter(Boolean);
      if (pts.length) out[name] = [pts.reduce((a, p) => a + p[0], 0) / pts.length, Math.max(...pts.map((p) => p[1]))];
    } else if (by[s.part]) out[name] = apply(by[s.part].base, s.at);
    else {
      const e = L.find((x) => x.p?.swaps?.[x.swap]?.hide?.includes(s.part) && x.p.swaps[x.swap].grip);
      if (e) out[name] = apply(e.m, e.p.swaps[e.swap].grip);
    }
  }
  return out;
}
// How far a foot's ankle sits above the floor line in the master (screen px; standard rigs: rest 0, one scale).
function ankleHeight(rig, n) {
  const chain = [];
  for (let p = n; p; p = rig.parts[p].parent) chain.unshift(p);
  let y = -rig.rootY;
  for (let i = 1; i < chain.length; i++) {
    const c = rig.parts[chain[i]], q = rig.parts[chain[i - 1]];
    y += rig.scale * (c.attach[1] - q.pivot[1]);
  }
  return -y;
}

const memory = new WeakMap();   // fighter -> { name: [x, y] world px } as last drawn
export function keepSockets(f, local, toWorld) {
  const w = {};
  for (const [k, p] of Object.entries(local)) w[k] = toWorld(p);
  memory.set(f, w);
}
// A fighter's socket in world px (x, screen y with height folded in) as last drawn, or null (standee, not drawn yet).
export const socketOf = (f, name) => memory.get(f)?.[name] ?? null;
