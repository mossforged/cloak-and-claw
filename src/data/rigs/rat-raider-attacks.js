// Rat Raider rehearsal, Attacking (T029): docs/design/rigs/rat-raider-rehearsal.md key by key (rat-raider-kit.js P).
// The turning slash (ratSlash, Slash 1) and its held wind-up (the telegraph) stay in rat-raider-poses.js. Sim timings and
// hits: moves/rat-rehearsal.js. hand: the cutlass fist from the near shoulder + the blade's screen direction (0 forward,
// -90 up); wholeArm: a whole near-arm drawing turned so the blade points `dir` (A023 draws each blade at: cocked -11,
// raised -50, smear-h 100, smear-o 152 screen deg, the user's grip lines); shield: the far fist's reference point.
// Items: every key holds the raider's cutlass (the dagger, round shield, club and staff are A021 hold-sheet drawings, not
// game items yet): the dagger stab takes it in the overhand (reverse) grip, the throw lets it go (`free`), the block and
// the bash raise the empty guard arm (no shield to carry).
import { P, NEAR, FAR, FEET, CROUCH, HOLD, TAIL, FIST } from './rat-raider-kit.js';

const V = (torso, pelvis) => ({ torso, ...(pelvis && { pelvis }) });
const SIDE = V('S', 'S'), FRONT = V('F', 'F');
const GUARD = { 'arm-far-upper': 'arm-far-guard' }, GUARD_FRONT = { 'arm-far-upper': 805 };   // the guard arm drawn in front of the chest
const LUNGE = { near: [FEET.near[0] - 6, 9.8, 0], far: [FEET.far[0] + 6, 0, 0] };   // ratSlash's lunge: trailing toe, lead boot forward

export const ATTACKS = {
  // Slash 2 (backhand): from the forehand's end (arm across in front, chest toward the camera) the blade sweeps out
  // forward (side-on, the near arm still in front) and on round behind him (turned away: the arm wholly behind the body)
  backhand: {
    windup: P({ ...CROUCH, view: V('F'), swap: { ...FIST, head: 'head-effort' }, dx: 2, dy: 6, pelvis: 5, torso: 18, head: -14,
      hand: { off: [22, 12], dir: 170 }, shield: { off: [-2, 18], turn: 20 }, ...TAIL(-15, 0, 10), 'scarf-tail': -15 }),
    through: P({ ...CROUCH, view: V('S'), swap: { ...FIST, head: 'head-attack' }, dx: 4, dy: 4, pelvis: 4, torso: 10, head: -12,
      hand: { off: [30, 0], dir: -5 }, shield: { off: [8, 18], turn: 0 }, feet: LUNGE, ...TAIL(-5, 5, 10) }),
    strike: P({ ...CROUCH, view: V('BQ'), swap: { ...FIST, head: 'head-attack', 'foot-near': 'foot-near-toe' }, dx: 2, dy: 4, pelvis: 2, torso: -4, head: -8,
      hand: { off: [-14, -6], dir: -170 }, shield: { off: [20, 12], turn: -30 }, feet: LUNGE, ...TAIL(15, 15, 15), 'scarf-tail': 15 }),
  },
  // Slash 3 (spin finisher): cocked (three-quarter) -> side-on, the blade out level -> his back to the camera mid-spin with
  // the horizontal smear arm -> facing the camera, the blade sweeping through in front -> back to three-quarter (rest)
  spin: {
    windup: P({ ...CROUCH, swap: { ...FIST, head: 'head-effort' }, dx: -4, torso: -8, head: -2, wholeArm: { swap: 'arm-near-cocked', dir: -410 },
      shield: { off: [20, 12], turn: -40 }, feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, ...TAIL(15, 20, 20), 'scarf-tail': 20 }),
    through: [
      P({ ...CROUCH, view: SIDE, swap: { ...FIST, head: 'head-attack' }, dy: 3, pelvis: 2, torso: 4, head: -10, hand: { off: [28, -4], dir: -20 },
        shield: { off: [6, 16], turn: 0 }, ...TAIL(0, 10, 15), 'scarf-tail': 20 }),
      P({ ...CROUCH, view: V('B', 'B'), swap: { head: 'head-back', 'hand-far': 'hand-far-fist' }, dy: 4, pelvis: 0, torso: 4, head: -6,
        wholeArm: { swap: 'arm-near-smear-h', dir: 100 }, shield: { off: [8, 18], turn: 0 }, ...TAIL(-20, 10, 15), 'scarf-tail': 35 }),
    ],
    strike: P({ ...CROUCH, view: FRONT, swap: FIST, dx: 4, dy: 7, pelvis: 5, torso: 16, head: -16,
      hand: { off: [26, 14], dir: 30 }, shield: { off: [0, 18], turn: 20 }, feet: LUNGE, ...TAIL(-25, -10, 0), 'scarf-tail': -30 }),
    recover: P({ ...CROUCH, swap: FIST, dx: 2, dy: 4, pelvis: 4, torso: 10, head: -10, hand: { off: [8, 28], dir: 20 }, shield: { off: [10, 22], turn: 0 }, ...TAIL(-15, 0, 10) }),
  },
  // Overhead chop: leaning back with the raised near arm, the blade back over his head -> chest pitched forward (hunched),
  // the overhead smear arm coming down in front -> the follow-through low in front, still hunched
  overheadChop: {
    windup: P({ ...CROUCH, view: V('LB'), swap: { ...FIST, head: 'head-effort' }, dx: -4, dy: 0, pelvis: -2, torso: -8, head: -2,
      wholeArm: { swap: 'arm-near-raised', dir: -90 }, shield: { off: [22, 4], turn: -60 }, feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, ...TAIL(15, 20, 20) }),
    through: P({ ...CROUCH, view: V('H'), swap: { ...FIST, head: 'head-attack' }, dx: 2, dy: 6, pelvis: 5, torso: 14, head: -16,
      wholeArm: { swap: 'arm-near-smear-o', dir: 152 }, shield: { off: [8, 18], turn: 0 }, feet: LUNGE, ...TAIL(-10, 0, 10) }),
    strike: P({ ...CROUCH, view: V('H'), swap: { ...FIST, head: 'head-attack', 'foot-near': 'foot-near-toe' }, dx: 5, dy: 10, pelvis: 7, torso: 20, head: -20,
      hand: { off: [24, 24], dir: 70 }, shield: { off: [-2, 18], turn: 20 }, feet: LUNGE, ...TAIL(-25, -10, 0), 'scarf-tail': -25 }),
  },
  // Dagger stab: side-on chest and hips, the blade taken in the reverse (overhand) grip: drawn back by the shoulder ->
  // driven forward and down in front -> back
  daggerStab: {
    windup: P({ ...CROUCH, view: SIDE, grip: 'overhand', swap: { ...FIST, head: 'head-effort' }, dx: -4, torso: 2, head: -6, hand: { off: [8, -12], dir: 110 },
      shield: { off: [14, 14], turn: -30 }, feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, ...TAIL(10, 15, 20) }),
    strike: P({ ...CROUCH, view: SIDE, grip: 'overhand', swap: { ...FIST, head: 'head-attack', 'foot-near': 'foot-near-toe' }, dx: 4, dy: 8, torso: 14, head: -16,
      hand: { off: [30, 14], dir: 60 }, shield: { off: [4, 18], turn: 0 }, feet: LUNGE, ...TAIL(-25, -10, 0), 'scarf-tail': -25 }),
    recover: P({ ...CROUCH, view: SIDE, grip: 'overhand', swap: FIST, dx: 2, dy: 4, torso: 8, head: -10, hand: { off: [10, 14], dir: 90 },
      shield: { off: [10, 20], turn: 0 }, ...TAIL(-10, 0, 10) }),
  },
  // Dagger throw: cocked behind (turned away) -> chest toward the camera, the arm whipped forward, the blade let go from
  // the open hand -> follow-through, open hand still out
  daggerThrow: {
    windup: P({ ...CROUCH, view: V('BQ'), swap: { ...FIST, head: 'head-effort' }, dx: -4, torso: -12, head: 0, wholeArm: { swap: 'arm-near-cocked', dir: -410 },
      shield: { off: [22, 10], turn: -50 }, feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, ...TAIL(15, 20, 20), 'scarf-tail': 20 }),
    strike: P({ ...CROUCH, view: V('F'), free: true, swap: { ...FIST, head: 'head-attack', 'hand-near': 'hand-near-open' }, dx: 4, dy: 6, pelvis: 4, torso: 14, head: -14,
      hand: { off: [44, -6], dir: -10 }, shield: { off: [0, 18], turn: 20 }, feet: LUNGE, ...TAIL(-20, -5, 5) }),
    recover: P({ ...CROUCH, view: V('F'), free: true, swap: { ...FIST, 'hand-near': 'hand-near-open' }, dx: 2, dy: 6, pelvis: 4, torso: 16, head: -12,
      hand: { off: [24, 16], dir: 40 }, shield: { off: [4, 20], turn: 10 }, ...TAIL(-15, 0, 10) }),
  },
  // Jump attack: rising with the arm cocked (knee up, far leg folded) -> top, turned away -> the chop down in front
  // (chest toward the camera, overhead smear arm) -> landing on the folded far leg
  jumpAttack: {
    windup: P({ ...CROUCH, aloft: true, swap: { ...FIST, head: 'head-effort', 'leg-near-upper': 'leg-near-kneeup', 'leg-far-upper': 'leg-far-folded' }, dy: -26,
      pelvis: -4, torso: -4, head: -6, 'leg-near-upper': -20, 'leg-far-upper': 6, wholeArm: { swap: 'arm-near-cocked', dir: -400 }, shield: { off: [18, 0], turn: -60 }, ...TAIL(20, 15, 10) }),
    through: P({ ...CROUCH, aloft: true, view: V('BQ'), swap: { ...FIST, head: 'head-effort', 'leg-near-upper': 'leg-near-kneeup', 'leg-far-upper': 'leg-far-folded' }, dy: -40,
      pelvis: -6, torso: -10, head: -2, 'leg-near-upper': -14, 'leg-far-upper': 10, wholeArm: { swap: 'arm-near-cocked', dir: -420 }, shield: { off: [22, 2], turn: -60 }, ...TAIL(25, 15, 10) }),
    strike: P({ ...CROUCH, aloft: true, view: V('F'), swap: { ...FIST, head: 'head-attack', 'leg-near-upper': 'leg-near-kneeup', 'leg-far-upper': 'leg-far-folded' }, dy: -18,
      pelvis: 6, torso: 18, head: -18, 'leg-near-upper': -6, 'leg-far-upper': 18, wholeArm: { swap: 'arm-near-smear-o', dir: 152 }, shield: { off: [4, 16], turn: 10 }, ...TAIL(-10, 0, 10) }),
    recover: P({ ...CROUCH, view: V('H'), swap: { ...FIST, 'leg-far-upper': 'leg-far-folded' }, dy: 14, pelvis: 6, torso: 18, head: -18, feet: { near: FEET.near },
      hand: { off: [22, 22], dir: 60 }, shield: { off: [8, 20], turn: -10 }, ...TAIL(-20, 10, 15) }),
  },
  // Dash attack: hunched, driving off the trailing toe with the blade out front -> the hit at full stretch
  dashAttack: {
    windup: P({ ...CROUCH, view: V('H'), swap: { ...FIST, head: 'head-effort', 'foot-near': 'foot-near-toe' }, dx: -2, dy: 8, pelvis: 8, torso: 16, head: -18,
      hand: { off: [16, 14], dir: -30 }, shield: { off: [6, 18], turn: -20 }, feet: { near: [FEET.near[0] - 8, 9.8, 0], far: [FEET.far[0] + 4, 0, 0] }, ...TAIL(-20, -10, 0), 'scarf-tail': -30 }),
    strike: P({ ...CROUCH, view: V('H'), swap: { ...FIST, head: 'head-attack', 'foot-near': 'foot-near-toe' }, dx: 6, dy: 10, pelvis: 8, torso: 20, head: -22,
      hand: { off: [32, 10], dir: 0 }, shield: { off: [-2, 18], turn: 20 }, feet: { near: [FEET.near[0] - 12, 9.8, 0], far: [FEET.far[0] + 8, 0, 0] }, ...TAIL(-30, -15, -5), 'scarf-tail': -35 }),
  },
  // Kick (unarmed in the rehearsal; he keeps the cutlass up): leaning back, near knee chambered up (knee-up drawing), far
  // boot on its toe -> the near leg driven out straight and rigid -> back down
  kick: {
    windup: P({ ...CROUCH, view: V('LB'), aloft: true, swap: { ...FIST, head: 'head-effort', 'leg-near-upper': 'leg-near-kneeup', 'foot-far': 'foot-far-toe' }, dx: -4, dy: 0, pelvis: -6, torso: -6, head: -4,
      'leg-near-upper': -40, hand: HOLD, shield: { off: [20, 6], turn: -60 }, feet: { far: [FAR + 2, 12, 0] }, ...TAIL(10, 15, 20) }),
    strike: P({ ...CROUCH, view: V('LB'), aloft: true, swap: { ...FIST, head: 'head-attack', 'foot-far': 'foot-far-toe' }, dx: -2, dy: 2, pelvis: -12, torso: -8, head: -6,
      hand: { off: [-4, 10], dir: -120 }, shield: { off: [22, 4], turn: -60 }, feet: { near: [NEAR + 42, 34, -70], far: [FAR + 2, 12, 0] }, ...TAIL(20, 20, 20) }),
  },
  // Block (shield): hunched, the guard arm across in front of the chest (drawn over it: pose band) with its shoulder cap,
  // effort head, trailing boot turned out; a hit jolts the guard back; lowered on the way out
  guard: {
    windup: P({ ...CROUCH, view: V('H'), swap: { ...GUARD, head: 'head-effort', 'foot-near': 'foot-near-out' }, order: GUARD_FRONT, dy: 6, pelvis: 6, torso: 14, head: -16,
      'arm-far-upper': -20, hand: HOLD, ...TAIL(-15, 10, 15) }),
    strike: P({ ...CROUCH, view: V('H'), swap: { ...GUARD, head: 'head-effort', 'foot-near': 'foot-near-out' }, order: GUARD_FRONT, dx: -4, dy: 6, pelvis: 2, torso: 6, head: -10,
      'arm-far-upper': -30, hand: { off: [-2, 14], dir: -115 }, ...TAIL(0, 15, 20) }),
  },
  // Shield bash: side-on chest and hips, the guard arm drawn back -> driven forward off the trailing toe -> back
  shieldBash: {
    windup: P({ ...CROUCH, view: SIDE, swap: { ...GUARD, head: 'head-effort' }, order: GUARD_FRONT, dx: -4, torso: 0, head: -6, 'arm-far-upper': -10,
      hand: HOLD, feet: { near: FEET.near, far: [FEET.far[0] - 2, 2, 10] }, ...TAIL(10, 15, 20) }),
    strike: P({ ...CROUCH, view: SIDE, swap: { ...GUARD, head: 'head-attack', 'foot-near': 'foot-near-toe' }, order: GUARD_FRONT, dx: 6, dy: 8, torso: 16, head: -16, 'arm-far-upper': -40,
      hand: HOLD, feet: LUNGE, ...TAIL(-25, -10, 0), 'scarf-tail': -25 }),
    recover: P({ ...CROUCH, view: SIDE, swap: { ...GUARD }, order: GUARD_FRONT, dx: 2, dy: 4, torso: 8, head: -10, 'arm-far-upper': -20, hand: HOLD, ...TAIL(-10, 0, 10) }),
  },
  // Captain rally: the blade raised (raised near arm), the shout head -> the shout, chin up, free fist clenched low
  rally: {
    windup: P({ ...CROUCH, swap: { ...FIST, head: 'head-shout' }, torso: 0, head: -10, wholeArm: { swap: 'arm-near-raised', dir: -60 }, shield: { off: [18, 20], turn: -40 }, ...TAIL(0, 15, 20) }),
    strike: P({ ...CROUCH, swap: { ...FIST, head: 'head-shout' }, dy: -1, torso: -6, head: -20, wholeArm: { swap: 'arm-near-raised', dir: -70 }, shield: { off: [16, 24], turn: -30 }, ...TAIL(10, 20, 20), 'scarf-tail': 10 }),
  },
};
