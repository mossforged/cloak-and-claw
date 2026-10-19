// Rehearsal sheet frames (T028), pure: each key of a move rehearsal (data/rehearsal/*.js) as the rig draws it today: its
// stand-in pose (rigFrame, as the game draws it), the key's chest / hip views and every drawing it names that the rig
// has; a drawing the rig doesn't have yet (or a view's `standIn`) becomes a labelled box at its part's place.
import { FIGHTERS } from '../data/fighters/index.js';
import { ITEMS } from '../data/items/index.js';
import { RIGS } from '../data/rigs/index.js';
import HULLS from '../data/rigs/hulls.js';
import { rigFrame, rigMemory } from '../render/rig.js';
import { createSlot } from './sandbox.js';
import { FPS } from '../config.js';
import { gripLayout } from '../render/rig-grip.js';
import { carryLayer } from '../render/carry.js';
import { gearLayout } from '../render/looks.js';
import { apply } from '../render/rig-layout.js';
import { throughAt } from '../render/rig-pose.js';

// 'F/Q' -> { torso: 'F', pelvis: 'Q' }; one code = both, a hip view the rig lacks = Q
export function parseView(rig, v) {
  const [t, p = t] = v.split('/'), V = rig.bodyViews ?? {};
  return { torso: t, pelvis: V.pelvis?.[p] ? p : 'Q' };
}
// Is a drawing game-ready on this rig: a swap of one of its parts, or a part of its own (a shoulder cap)?
export const swapPart = (rig, name) => Object.keys(rig.parts).find((n) => rig.parts[n].swaps?.[name]) ?? null;
export const ready = (rig, name) => !!(rig.parts[name] || swapPart(rig, name));
// The parts a drawing stands for (where its box goes); `joint`: a small box on that part's pivot (shoulder caps)
export function placeOf(name) {
  const side = /-near/.test(name) ? 'near' : 'far';
  if (/^shoulder-/.test(name)) return { parts: [`arm-${side}-upper`], joint: true };
  if (/^arm-/.test(name)) return { parts: [`arm-${side}-upper`, `arm-${side}-lower`, `hand-${side}`, 'held'] };
  if (/^leg-/.test(name)) return { parts: [`leg-${side}-upper`, `leg-${side}-lower`, `foot-${side}`] };
  const m = name.match(/^(hand|foot)-(near|far)/);
  if (m) return { parts: [`${m[1]}-${m[2]}`] };
  return { parts: [name.split('-')[0]] };
}

// T029: the sim frame of a move's named key (posed moves: exactly on the key). name: windup, through, through.<i> (a
// list of through keys), strike, recover
export function keyMf(rig, M, key, name) {
  const T = rig.poses.timing, R = rig.poses.moves?.[M.rig ?? key], X = R?.through;
  if (!isNaN(+name)) return +name;   // a sim frame
  const [n, i] = name.split('.');
  // T029: exactly on the key (was the nearest whole frame: the windup's last, the through key's rounded)
  if (n === 'through') return M.windup + throughAt(Array.isArray(X) ? X.length : 1, +(i ?? 0)) * T.strikeIn * M.active;
  return { windup: M.windup - 1e-3, strike: M.windup + M.active - 1,
    // T028 r2: a rig move with its own `recover` key passes it at the middle of the recovery
    recover: M.windup + M.active + Math.round((R?.recover ? 0.5 : 0.7) * M.recovery) }[n] ?? M.windup - 1;
}
function fighterFor(def, rig, ref) {
  const [a, b] = ref.split(':'), f = { def, state: 'idle', t: 0, mf: 0, move: null, z: 0, vz: 0, facing: 1, id: 1, x: 0, y: 0, stun: 10, grab: { knee: -1 } };
  const M = def.moves[a] ?? def.rehearsal?.[a];
  if (M) {
    const at = keyMf(rig, M, a, b ?? 'windup');
    // T029 r2: the move's own items (the dagger stab's dagger, the bash's shield on the far strap)
    const items = { ...(M.item && { weapon: { def: ITEMS[M.item], uses: 999, hit: false, broken: false } }), ...(M.strap && { strap: { def: ITEMS[M.strap] } }) };
    return { f: Object.assign(f, { state: M.air ? 'jump' : 'attack', move: M, moveKey: a, mf: at, t: at }, items), time: 0 };
  }
  if (a === 'walk') return { f: Object.assign(f, { state: 'walk', t: +b * 60 / rig.poses.walk.speed }), time: 0 };
  if (a === 'idle') return { f, time: +(b ?? 0) };
  if (['hurt', 'knockdown', 'down', 'getup'].includes(a)) return { f: Object.assign(f, { state: a, t: a === 'getup' ? 999 : 30 }), time: 0 };
  if (a === 'held') return { f: Object.assign(f, { state: 'grabbed' }), time: 0 };
  if (b != null && rig.poses[a]?.speed) return { f, time: +b / rig.poses[a].speed, pose: a };   // T029: a cycle pose at a share of its cycle ('run:0.25')
  return { f, time: 0, pose: a };   // a named rig pose (jump, jumpSquat, cast, ...)
}

const boxOf = (L, rig, { parts, joint }) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const e of L.filter((x) => parts.includes(x.name) && x.m)) {
    const pts = joint ? [apply(e.base, ...rig.parts[e.name].pivot)].flatMap(([x, y]) => [[x - 6, y - 6], [x + 6, y + 6]]) : (HULLS[e.img] ?? []).map((p) => apply(e.m, ...p));
    for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  }
  if (x0 < Infinity) return [x0, y0, x1, y1];
  // a hand under a whole-arm drawing: a small box on that drawing's fist
  const e = L.find((x) => x.p?.swaps?.[x.swap]?.hide?.some((h) => parts.includes(h)) && x.p.swaps[x.swap].grip);
  if (!e) return null;
  const [x, y] = apply(e.m, ...e.p.swaps[e.swap].grip);
  return [x - 7, y - 7, x + 7, y + 7];
};

// T029: a posed key (a move's own key, a cycle pose, a viewer clip's frame) is drawn exactly as the game draws it (rigFrame,
// its own views and drawings); `off` lists what the rehearsal names that the frame doesn't show (a view, a drawing).
export const posed = (def, rig, ref) => {   // does a posed key's ref resolve
  const [a, b] = ref.split(':');
  return a.startsWith('@') || !!(def.moves[a] ?? def.rehearsal?.[a]) && !!rig.poses.moves?.[def.moves[a]?.rig ?? a] || (b != null && !!rig.poses[a]?.speed) || ['idle', 'walk'].includes(a);
};
function clipFrame(id, rig, ref, gear) {   // '@<clip>:<frame>': the viewer sandbox played to that frame (the turn-around's flip)
  const [a, n] = ref.slice(1).split(':'), slot = createSlot();
  slot.load({ f: id, v: 'current', anim: a, item: 'own', grip: '', look: {}, gear });
  const sb = slot.seek(0), mem = rigMemory(sb.hero);
  for (let i = 0; i <= +n; i++) { if (i) slot.step(); rigFrame(sb.hero, rig, sb.n / FPS, mem); }
  return { f: sb.hero, fr: rigFrame(sb.hero, rig, sb.n / FPS, mem), mem };
}
const shows = (L, n) => L.some((e) => e.m && !e.line && (e.swap === n || e.name === n));

// One key: { L (layout entries, rig space), p (standee placement), k, held, views, ready: [names], missing: [{ name, box }],
// posed, off: [names the posed frame doesn't show] }
// T032: gear = gear groups to wear (viewer.html?rehearse=<body>&gear=gear-hood,gear-jerkin), in place of the loadout (the
// viewer's Gear buttons); none = as before (a posed key wears the fighter's own loadout, as the game; a stand-in key bare).
export function keyFrame(sheet, key, gear = []) {
  const id = key.f ?? sheet.fighter, def = FIGHTERS[id], rig = RIGS[def.art.rig];
  if (key.posed) {
    let f, fr, mem = {};
    if (key.pose.startsWith('@')) ({ f, fr, mem } = clipFrame(id, rig, key.pose, gear.length ? gear : null));
    else {
      const F = fighterFor(gear.length ? { ...def, art: { ...def.art, gear } } : def, rig, key.pose);
      f = F.f; rigFrame(f, rig, F.time - 1 / 60, mem, F.pose); fr = rigFrame(f, rig, F.time, mem, F.pose);
    }
    const views = { torso: mem.swap['@view.torso'] ?? 'Q', pelvis: mem.swap['@view.pelvis'] ?? 'Q' }, want = parseView(rig, key.view);
    const missing = key.draw.filter((n) => !ready(rig, n));
    const off = [...key.draw.filter((n) => ready(rig, n) && !shows(fr.L, n)), ...Object.entries(want).filter(([s, c]) => views[s] !== c).map(([s, c]) => `${s} view ${c}`)];
    return { def, rig, L: fr.L, p: fr.p, k: fr.k, held: fr.held, views, swap: { ...mem.swap }, posed: true, off, ready: key.draw.filter((n) => ready(rig, n)),
      missing: missing.map((name) => ({ name, box: boxOf(fr.L, rig, placeOf(name)) })) };
  }
  const { f, time, pose } = fighterFor(def, rig, key.pose);
  const mem = {};
  rigFrame(f, rig, time - 1 / 60, mem, pose);
  const fr = rigFrame(f, rig, time, mem, pose), views = parseView(rig, key.view);
  const swap = Object.fromEntries(Object.entries(mem.swap).filter(([n]) => !/^@view/.test(n)));
  Object.assign(swap, { '@view.torso': views.torso, '@view.pelvis': views.pelvis }, key.carry && { '@carry': key.carry });
  const missing = new Set(key.draw.filter((n) => !ready(rig, n)));
  for (const n of key.draw) if (ready(rig, n) && swapPart(rig, n) && !rig.parts[n]) swap[swapPart(rig, n)] = n;
  for (const [slot, code] of Object.entries(views)) {
    const V = rig.bodyViews?.[slot]?.[code];
    if (code !== 'Q' && (!V || V.standIn)) missing.add(V?.standIn ?? `${slot} view ${code}`);
  }
  const L = gearLayout(rig, carryLayer(rig, gripLayout(rig, fr.joints, swap, fr.held, f), swap), gear);
  return { def, rig, L, p: fr.p, k: fr.k, held: fr.held, views, swap, posed: false, off: [], ready: key.draw.filter((n) => ready(rig, n)),
    missing: [...missing].map((name) => ({ name, box: boxOf(L, rig, placeOf(name)) })) };
}
