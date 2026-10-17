// Draws a fighter as a cutout rig: parts in a hierarchy, posed by rig-pose.js, drawn into a
// buffer that is then placed like a standee (same lean/squash/flip, shadow, flash and tints).
import { phaseOf } from '../sim/fighter.js';
import { poseOf, BLOCK_LEAN, braceOf } from './standee.js';
import { rigJoints, drawLayer, squatLayer } from './rig-pose.js';
import { squatOf } from './jump-squat.js';
import { gripLayout } from './rig-grip.js';
import { braceLayer } from './brace.js';
import { feelLayer, bendSteps, bendStrips } from './weapon-feel.js';
import { ITEMS } from '../data/items/index.js';
import { LOOKS } from '../data/looks.js';
import { gearLayout, gearOf, lookImage } from './looks.js';
import { socketPoints, keepSockets } from './sockets.js';
import { layoutRig } from './rig-layout.js';
import { floorLayer, restDy, grounded, lying } from './floor.js';

export { layoutRig };

const RES = 2;                                   // buffer px per screen px (keeps parts sharp)
const BOX = { w: 300, h: 260, ox: 150, oy: 200 };  // buffer area in screen px; (ox, oy) = feet
const D = Math.PI / 180;
const memory = new WeakMap();                    // fighter -> pose blend memory (render-only)

// The held weapon in a rig's hand slot (T010): the kit's image, grip point and size on the slot part's bone.
// A broken weapon is an empty hand until its swing ends. null = nothing held (the slot part draws as usual).
// Empty hand too while the sword is sheathed: picking up (after the stow, or all along when swapping weapons)
// and the first half of a sword draw (sheathed = mem.sheathed from drawLayer).
// T011: a fighter with a `kit` (enemy weapon kit, items/*.js) holds it whenever he holds nothing else (T018: or the item
// named by art.held, a look-only weapon: the Rat Raider's cutlass). A slot given as
// { parent, attach, order, rest?, upright? } adds the weapon as a new part `held` there (upright: the bow stays straight
// up) instead of replacing a part. grip/kit go to render/rig-grip.js (second hand, bow string). T020: turned by restIn.
// T018: once a knocked-out fighter has dropped his kit (f.dropped, def.drop = that item), his hand is empty: what he
// swung is what lies on the floor.
export function heldOf(f, rig, sheathed = false) {
  const K = f.def?.kit ?? f.def?.art?.held, W = f.weapon ?? (K && { def: ITEMS[K] }), one = rig.slots?.['one-hand'];
  const pk = f.state === 'pickup' && !W && (f.pickup?.swap || f.t >= f.def.pickup.stow);
  if (!W) return one && (pk || sheathed) ? { slot: one, part: null } : null;
  const spec = rig.slots?.[W.def.grip];
  if (!spec) return null;
  const slot = typeof spec === 'string' ? spec : 'held', kit = W.def, grip = kit.grip;
  if (W.broken || (!f.weapon && f.dropped && f.def.drop?.item === kit.id)) return { slot, part: null, grip, kit };
  const A = kit.art, mount = typeof spec === 'string' ? {} : spec;   // T018: a slot's own `rest` turns the item in the hand
  const k = A.px / rig.scale, ax = rig.axes?.[grip];
  // T020: a slot with flip 'hold' draws the item flipped across the handle axis while not attacking (the raider's
  // cutlass: tip curving back as he holds it, as drawn once he swings; user's pick). Reflection across angle ax =
  // flip y, then turn rest - 2 ax: the handle stays in the fist.
  if (mount.flip === 'hold' && !f.move && ax != null) return { slot, grip, kit, part: { ...mount, img: A.img, pivot: A.grip, rest: restIn(rig, kit) - 2 * ax, scale: [k, -k] } };
  return { slot, grip, kit, part: { ...mount, img: A.img, pivot: A.grip, rest: restIn(rig, kit), scale: k } };
}

// T020: the handle runs through the fist. rig.axes[grip type] = the slot axis: the direction (degrees, in the slot
// parent's own px) the closed hand holds a handle, pointing out toward the weapon's head; art.gripEnd = a point along
// the item's handle from its grip toward its head. The item is turned so the two match; the pose then turns hand and
// weapon together. Without both: the slot's and item's `rest` as before.
export const handleAngle = (A) => Math.atan2(A.gripEnd[1] - A.grip[1], A.gripEnd[0] - A.grip[0]) / D;
export function restIn(rig, kit) {
  const ax = rig.axes?.[kit.grip], A = kit.art, spec = rig.slots?.[kit.grip];
  if (ax != null && A.gripEnd) return ax - handleAngle(A);
  return (typeof spec === 'string' ? 0 : spec?.rest ?? 0) + (A.rest ?? 0);
}

let buf, tintBuf;
const canvas = () => { const c = document.createElement('canvas'); c.width = BOX.w * RES; c.height = BOX.h * RES; return c; };

function tinted(color) {
  tintBuf ??= canvas();
  const g = tintBuf.getContext('2d');
  g.globalCompositeOperation = 'copy'; g.drawImage(buf, 0, 0);
  g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, tintBuf.width, tintBuf.height);
  return tintBuf;
}

// One frame of a rig, everything but the pixels (pure; tests use it): final joints, the held item, the drawn layout (L),
// and how the standee places it (p: lean, squash, offsets; k: look size). mem = the fighter's render memory.
// pose: optional named pose to hold (view-only test poses such as `cast`).
export function rigFrame(f, rig, time, mem, pose) {
  // sword draw after a held weapon is thrown or breaks (not when swapped at a pickup or knocked loose)
  if (mem.hadWeapon && !f.weapon && ['idle', 'walk', 'toss', 'attack', 'jumpStart', 'jump', 'block'].includes(f.state)) mem.drawT0 = time;
  mem.hadWeapon = !!f.weapon;
  let joints = rigJoints(f, rig, time, mem, pose);
  if (!pose) joints = mem.last = braceLayer(rig, f, joints, time, mem, mem.swap);   // T015 bracing loop (kept in mem.last: no pop on leaving block)
  const sq = pose ? 0 : squatOf(f, time);
  joints = drawLayer(rig, time, mem, squatLayer(rig, joints, sq));   // T014 jump squat crouch
  if (sq > 0.5 && rig.poses.jumpSquat?.swap) mem.swap = { ...mem.swap, ...rig.poses.jumpSquat.swap };   // T024: its folded leg
  if (!pose) joints = feelLayer(rig, f, joints, time, mem);   // T017 held weapon wobble / impact squash
  const p = { ...poseOf(f, time) }, kneel = f.state === 'downed' && rig.poses.downed;
  if (kneel) Object.assign(p, { rot: 0, sx: 1, sy: 1 });   // T024: the rig kneels instead of lying flat
  if (f.move) p.rot *= rig.poses.timing.bodyLean;   // the joints already lean into the swing
  if (f.state === 'walk' && !f.move) { p.dy = 0; p.rot = 0; }   // the rig's own walk cycle bobs in step
  if (f.state === 'grabbing' || f.state === 'throw' || f.state === 'toss' || f.state === 'pickup') { p.rot = 0; p.dx = 0; p.sx = p.sy = 1; }   // the grab/knee/throw poses do it
  if (f.state === 'block') { p.rot -= BLOCK_LEAN + braceOf(f, time).rot; p.sx = p.sy = 1; }   // the block pose leans and crouches (and the brace loop breathes); keep only the jolt
  const k = 1 + (f.look?.size ?? 0) * LOOKS.size;   // T019: render-only size (hit areas unchanged)
  if (grounded(f) || kneel) {   // T024 floor-line rule: boots on their floor lines; the standee's lean turns the hips
    joints = floorLayer(rig, joints, mem.swap, { rot: 0, sx: p.sx * k, sy: p.sy * k, dy: p.dy }, p.rot);
    p.rot = 0;
  }
  const view = { rot: p.rot, sx: p.sx * k, sy: p.sy * k, dy: p.dy };
  const held = heldOf(f, rig, mem.sheathed);
  const L = gearLayout(rig, gripLayout(rig, joints, mem.swap, held, f), gearOf(f));   // T019 gear
  if (lying(f) && !kneel) {   // T024: the body rests on the floor (exactly, once down; never below it while falling or rising)
    const dy = restDy(L, view, f.z);
    p.dy = ['down', 'dead', 'downed'].includes(f.state) ? dy : Math.min(p.dy, dy);
  }
  return { joints, held, L, p, k };
}

export function drawRig(ctx, f, rig, assets, time, flash = 0, pose) {
  if (!memory.has(f)) memory.set(f, {});
  const mem = memory.get(f);
  const { held, L, p, k } = rigFrame(f, rig, time, mem, pose), B = !pose && held?.part && held.kit.feel?.bend;   // T017: a floppy held weapon
  buf ??= canvas();
  const g = buf.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, buf.width, buf.height);
  g.imageSmoothingQuality = 'high';
  for (const { name, img, m, line, p: part } of L) {
    g.setTransform(RES, 0, 0, RES, BOX.ox * RES, BOX.oy * RES);
    if (line) { g.strokeStyle = '#3a2a1e'; g.lineWidth = 0.8; g.beginPath(); line.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); continue; }
    g.transform(...m);
    const im = lookImage(assets, rig, img, name, f.look);   // T019: tinted per look (cached)
    if (!B || name !== held.slot) { g.drawImage(im, 0, 0); continue; }
    for (const { sx, sw, t } of bendStrips(im.width, im.height, part.pivot, bendSteps(B, m, mem.flop, mem.limp?.x ?? 1))) {
      g.save(); g.transform(...t); g.drawImage(im, sx, 0, sw, im.height, sx, 0, sw, im.height); g.restore();
    }
  }
  const c = Math.cos(p.rot * f.facing), sn = Math.sin(p.rot * f.facing), ax = p.sx * f.facing * k, ay = p.sy * k;   // T024: sockets in world px
  keepSockets(f, socketPoints(rig, L, held, (img) => { const im = assets.get(img); return im?.width ? [im.width, im.height] : null; }),
    ([x, y]) => [f.x + p.dx * f.facing + c * ax * x - sn * ay * y, f.y - f.z + p.dy + sn * ax * x + c * ay * y]);
  let alpha = 1;
  if (f.state === 'dead') alpha = f.t % 8 < 4 ? 1 : 0.25;
  if (f.invuln > 0 && f.state === 'idle') alpha = f.invuln % 6 < 3 ? 1 : 0.55;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(f.x + p.dx * f.facing, f.y - f.z + p.dy);
  ctx.rotate(p.rot * f.facing);
  ctx.scale(p.sx * f.facing * k, p.sy * k);
  const put = (img) => ctx.drawImage(img, -BOX.ox, -BOX.oy, BOX.w, BOX.h);
  put(buf);
  if (f.state === 'hurt' || f.state === 'knockdown') { ctx.globalAlpha = alpha * 0.28; put(tinted('#ff3b30')); }
  if (f.move?.fx?.telegraph && phaseOf(f)[0] === 'windup') { ctx.globalAlpha = 0.25 + 0.25 * Math.sin(time * 40); put(tinted('#ffd23f')); }
  if (flash > 0) { ctx.globalAlpha = flash; put(tinted('#ffffff')); }
  ctx.restore();
}
