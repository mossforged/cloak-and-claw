// Draws one fighter as a standee: a flat image that leans, squashes, hops, flashes and falls over.
// Pose numbers come from move.pose (data/moves); state poses are here.
import { phaseOf } from '../sim/fighter.js';
import { RULES } from '../data/rules.js';
import { JUICE } from '../data/juice.js';
import { silhouette } from './tint.js';
import { drawHeldStandee } from './props.js';
import { squatOf, squashOf } from './jump-squat.js';
import { braceWeight } from './brace.js';

const ZERO = { rot: 0, sx: 1, sy: 1, dx: 0, dy: 0, cy: 0 };   // cy: turn around this height above the feet (0 = feet)
export const BLOCK_LEAN = 0.08;   // standee's forward lean while blocking (the rig's joints lean on their own)
const lerp = (a, b, t) => a + (b - a) * t;

// T015: the standee's breath while blocking (JUICE.brace): taller and leaning in a touch on the in-breath, same cycle and
// fade-in as the rig's loop (none during blockstun). The rig keeps only the jolt, so it takes this back out (rig.js).
export function braceOf(f, time) {
  const B = JUICE.brace, w = braceWeight(f, B), b = Math.sin(2 * Math.PI * time / B.breath);
  return { rot: B.lean * w * b, squash: B.squash * w * (b + 1) / 2 };
}
const easeOut = (t) => 1 - (1 - t) ** 3;
const mix = (a, b, t) => {
  a = { ...ZERO, ...a }; b = { ...ZERO, ...b };
  return { rot: lerp(a.rot, b.rot, t), sx: lerp(a.sx, b.sx, t), sy: lerp(a.sy, b.sy, t), dx: lerp(a.dx, b.dx, t), dy: lerp(a.dy, b.dy, t), cy: lerp(a.cy, b.cy, t) };
};

function movePose(f) {
  const [ph, p] = phaseOf(f), P = f.move.pose ?? {};
  if (ph === 'windup') return mix(ZERO, P.windup, easeOut(p));
  if (ph === 'active') return mix(P.windup, P.active, easeOut(Math.min(1, p * 2.5)));
  return mix(P.active, ZERO, easeOut(p));
}

export function poseOf(f, time) {
  const K = RULES.knockdown, LIE = -1.5;
  if (f.move) return movePose(f);
  switch (f.state) {
    case 'idle': { const b = Math.sin(time * 3 + f.id) * 0.018; return { ...ZERO, sy: 1 + b, sx: 1 - b }; }
    case 'walk': { const s = Math.sin(f.t * 0.24); return { ...ZERO, dy: -Math.abs(s) * 5, rot: s * 0.05 }; }
    case 'block': {   // braced forward into the shield, crouched; jolts back on a blocked hit (blockstun); breathes (T015)
      const k = f.t < f.stun ? 1 - f.t / f.stun : 0, b = braceOf(f, time);
      return { ...ZERO, rot: BLOCK_LEAN - 0.2 * k + b.rot, dx: -6 * k, sx: 1.03 * (1 - b.squash / 2), sy: 0.96 * (1 + b.squash) };
    }
    case 'toss': {   // winds back, then pitches forward as the weapon leaves the hand
      const T = f.def.toss, k = f.t < T.wind ? f.t / T.wind : Math.max(0, 1 - (f.t - T.wind) / T.recovery);
      return { ...ZERO, rot: f.t < T.wind ? -0.2 * k : 0.18 * k, sx: 1 + 0.04 * k, sy: 1 - 0.04 * k };
    }
    case 'pickup': {   // dips down to the floor and back up
      const T = f.def.pickup, n = T.stow + T.reach, k = f.t < n ? Math.max(0, (f.t - T.stow * 0.5) / (n - T.stow * 0.5)) : 1 - (f.t - n) / T.rise;
      return { ...ZERO, rot: 0.25 * k, sy: 1 - 0.15 * k, sx: 1 + 0.05 * k };
    }
    case 'grabbing': return { ...ZERO, rot: 0.06, dx: 2 };
    case 'throw': {   // leans back into the wind, then pitches forward on the release
      const w = f.def.throw.wind, k = f.t < w ? f.t / w : Math.max(0, 1 - (f.t - w) / f.def.throw.recovery);
      return { ...ZERO, rot: f.t < w ? -0.22 * k : 0.2 * k, sx: 1 + 0.05 * k, sy: 1 - 0.05 * k };
    }
    case 'grabbed': {   // pulled up by the collar; doubles over on each knee (t restarts on a strike); tips over as he is hoisted to throw
      const j = f.t < 10 ? 1 - f.t / 10 : 0, H = JUICE.held, tip = Math.min(H.tipMax, f.z * H.tip);
      return { ...ZERO, rot: H.lean - H.jerk * j + tip, dy: -3 * j, sx: 1 + 0.06 * j, sy: 1 - 0.08 * j, cy: tip ? f.def.body.h * 0.5 : 0 };
    }
    case 'thrown': return { ...ZERO, rot: -f.t * JUICE.thrownSpin, cy: f.def.body.h * 0.5 };   // tumbles round his middle
    case 'jump': return { ...ZERO, rot: f.vz > 0 ? -0.1 : 0.08, sx: 1 - f.vz * 0.008, sy: 1 + f.vz * 0.012 };
    case 'hurt': { const k = 1 - f.t / Math.max(1, f.stun); return { ...ZERO, rot: -0.25 * k, dx: f.t < 8 ? (f.t % 2 ? 3 : -3) : 0, sx: 1 + 0.05 * k, sy: 1 - 0.05 * k }; }
    case 'knockdown': return { ...ZERO, rot: Math.max(LIE, -f.t * 0.13) };
    case 'down': return { ...ZERO, rot: LIE, sy: f.t < 6 ? 0.85 : 1 };
    case 'getup': return { ...ZERO, rot: LIE * (1 - easeOut(f.t / K.getupFrames)) };
    case 'dead': case 'downed': return { ...ZERO, rot: LIE };
    case 'revive': { const k = Math.min(1, f.t / 8); return { ...ZERO, rot: 0.25 * k, sy: 1 - 0.15 * k, sx: 1 + 0.05 * k }; }   // T022: crouched over his friend
    case 'potionToss': {   // as a weapon toss, on the potion's timings
      const T = RULES.potions, k = f.t < T.wind ? f.t / T.wind : Math.max(0, 1 - (f.t - T.wind) / T.recovery);
      return { ...ZERO, rot: f.t < T.wind ? -0.2 * k : 0.18 * k, sx: 1 + 0.04 * k, sy: 1 - 0.04 * k };
    }
    case 'drink': return { ...ZERO, rot: -0.12 * Math.min(1, f.t / 8) };
  }
  return ZERO;
}

export function drawShadow(ctx, f) {
  const k = Math.max(0.45, 1 - f.z / 180), rx = f.def.body.w * 0.9 * k;
  ctx.fillStyle = `rgba(20,12,30,${0.32 * k})`;
  ctx.beginPath(); ctx.ellipse(f.x, f.y, rx, rx * 0.28, 0, 0, Math.PI * 2); ctx.fill();
}

// flash: 0..1 white overlay. tint: optional color overlay (e.g. hurt red).
export function drawStandee(ctx, f, assets, time, flash = 0) {
  const art = f.def.art, img = assets.get(art[f.pose] ?? art.idle);
  const p = { ...poseOf(f, time) }, q = squashOf(squatOf(f, time));   // T014 jump squat: squashed before/at take-off and on landing
  p.sx *= q.sx; p.sy *= q.sy;
  const h = art.height, w = img.width * (h / img.height);
  const flip = f.facing * (art.facing ?? 1);
  let alpha = 1;
  if (f.state === 'dead') alpha = f.t % 8 < 4 ? 1 : 0.25;
  if (f.invuln > 0 && f.state === 'idle') alpha = f.invuln % 6 < 3 ? 1 : 0.55;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(f.x + p.dx * f.facing, f.y - f.z + p.dy - p.cy);
  ctx.rotate(p.rot * f.facing);
  ctx.translate(0, p.cy);
  ctx.scale(p.sx * flip, p.sy);
  const x = -w * art.anchorX, y = -h;
  ctx.drawImage(img, x, y, w, h);
  drawHeldStandee(ctx, f, assets, art.facing ?? 1);   // T010: a held floor weapon over the hand
  if (f.state === 'hurt' || f.state === 'knockdown' || (f.state === 'grabbed' && f.t < 8)) {
    ctx.globalAlpha = alpha * 0.28; ctx.drawImage(silhouette(img, '#ff3b30'), x, y, w, h);
  }
  if (f.move?.fx?.telegraph && phaseOf(f)[0] === 'windup') {
    ctx.globalAlpha = 0.25 + 0.25 * Math.sin(time * 40); ctx.drawImage(silhouette(img, '#ffd23f'), x, y, w, h);
  }
  if (flash > 0) { ctx.globalAlpha = flash; ctx.drawImage(silhouette(img, '#ffffff'), x, y, w, h); }
  ctx.restore();
}
