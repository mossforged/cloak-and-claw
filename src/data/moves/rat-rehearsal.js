// T029: every move of the rat body's rehearsal (docs/design/rigs/rat-raider-rehearsal.md, Moving and Attacking) that the
// rat types don't use yet, as data in the usual move format, so any rat type can be given one (moves + its rig pose in
// rigs/rat-raider-moves.js / -attacks.js). Fighter defs list them as `rehearsal` (sim/fighter.js startMove finds them;
// no brain starts one); the viewer plays each (clips.js, group Rehearsal). Their rig keys: windup, through (one key or a
// list), strike, recover (render/rig-pose.js).
// kind 'motion' = no hit (a footwork or show move: no hitbox, no damage). Timings and hit numbers follow the rat's slash (rat-blade.js): readable
// windups, a little faster for the light cuts, slower for the heavy ones.
// T029 r2: `item` = the item the move is posed with in the near hand, `strap` = one on the far hand's strap (A021's, items/
// a021-items.js): the viewer and the rehearsal sheet put them on him (no rat type carries them in a fight yet). The dagger
// throw looses the dagger as a shot (sim/shots.js), the same drawing turning over in flight (`spin`, rad per frame).
const HIT = (damage, hitbox, o = {}) => ({ damage, hitbox, knockback: 3, hitstun: 20, hitstop: 6, shake: 5, ...o });
const LEAN = (w, a) => ({ windup: { rot: w, sx: 0.96, sy: 1.04, dx: -4 }, active: { rot: a, sx: 1.05, sy: 0.96, dx: 4 } });
const STILL = { windup: { rot: 0, sx: 1, sy: 1, dx: 0 }, active: { rot: 0, sx: 1, sy: 1, dx: 0 } };
const motion = (windup, active, recovery, o = {}) => ({ kind: 'motion', windup, active, recovery, pose: STILL, ...o });

export const RAT_REHEARSAL = {
  // Moving
  fidget: motion(20, 30, 24),                                  // menace idle's fidget: a shout
  skidStop: motion(6, 10, 22, { lunge: 3 }),                   // braking out of a run
  jumpUp: motion(10, 34, 14),                                  // squat, rise, apex, fall, land, settle (a hop in place)
  dodgeHop: motion(8, 16, 12, { lunge: -2.4 }),                // a short back-hop out of the lane
  dodgeRoll: motion(8, 24, 12, { lunge: -2.2 }),              // tucked roll back past the camera (back view mid-roll)
  // Attacking
  backhand: { windup: 18, active: 6, recovery: 22, ...HIT(7, { x: 6, z: 34, w: 66, h: 56 }), lunge: 1, pose: LEAN(0.1, -0.12), fx: { slash: { r: 48, from: 30, to: -110, cx: 22, cz: 62 } } },
  spin: { windup: 26, active: 12, recovery: 26, ...HIT(10, { x: -30, z: 28, w: 110, h: 60 }, { knockback: 5 }), lunge: 1.4, pose: LEAN(-0.1, 0.1),
    fx: { slash: { r: 54, from: -180, to: 180, cx: 4, cz: 60, wrap: true } } },
  overheadChop: { item: 'a021-axe', windup: 36, active: 6, recovery: 30, ...HIT(12, { x: 12, z: 10, w: 64, h: 86 }, { knockback: 4, hitstop: 8, shake: 7 }), lunge: 1, pose: LEAN(-0.2, 0.22),
    fx: { slash: { r: 52, from: -100, to: 70, cx: 22, cz: 66 }, telegraph: true } },
  daggerStab: { item: 'a021-dagger', windup: 16, active: 5, recovery: 18, ...HIT(6, { x: 24, z: 40, w: 54, h: 36 }, { knockback: 2 }), lunge: 1.6, pose: LEAN(-0.06, 0.06),
    fx: { slash: { r: 80, from: -4, to: 4, cx: -20, cz: 62, flat: 0.2 } } },
  daggerThrow: { item: 'a021-dagger', windup: 22, active: 4, recovery: 22, pose: LEAN(-0.12, 0.1),
    shot: { art: { img: 'assets/art/items/a021-dagger.png', px: 0.25, nock: [0, 21], tip: [159, 21], spin: 0.45 }, x: 40, z: 64, speed: 8, depth: 12, range: 420,
      damage: 5, knockback: 2, hitstun: 18, hitstop: 5, shake: 3 } },
  jumpAttack: { windup: 22, active: 8, recovery: 20, ...HIT(11, { x: 10, z: 10, w: 64, h: 80 }, { knockback: 4, hitstop: 7, shake: 6 }), lunge: 2.2, pose: LEAN(-0.1, 0.16),
    fx: { slash: { r: 50, from: -110, to: 60, cx: 22, cz: 70 }, telegraph: true } },
  dashAttack: { windup: 14, active: 10, recovery: 22, ...HIT(8, { x: 14, z: 30, w: 60, h: 56 }), lunge: 4.5, pose: LEAN(0.12, 0.18),
    fx: { slash: { r: 60, from: -20, to: 20, cx: 10, cz: 60, flat: 0.3 } } },
  kick: { windup: 14, active: 6, recovery: 18, ...HIT(6, { x: 18, z: 20, w: 50, h: 40 }, { knockback: 5 }), pose: LEAN(-0.12, -0.06) },
  guard: motion(10, 50, 14, { strap: 'a021-shield' }),                                 // block: the guard held (loop), a hit jolts it back, lowered
  shieldBash: { strap: 'a021-shield', windup: 18, active: 6, recovery: 22, ...HIT(5, { x: 10, z: 30, w: 50, h: 70 }, { knockback: 7 }), lunge: 2.4, pose: LEAN(-0.08, 0.1) },
  rally: motion(16, 40, 20),                                   // captain rally: raise the blade, shout
};
// the spearman's staff work (two-handed; T029 r2: with A021's staff, `item`)
export const SPEAR_REHEARSAL = {
  staffSwing: { item: 'a021-staff', windup: 24, active: 6, recovery: 26, ...HIT(9, { x: 20, z: 30, w: 90, h: 50 }, { knockback: 4 }), lunge: 1, pose: LEAN(-0.1, 0.12),
    fx: { slash: { r: 70, from: -60, to: 40, cx: 10, cz: 60, flat: 0.4 } } },
  staffOverhead: { item: 'a021-staff', windup: 34, active: 6, recovery: 30, ...HIT(12, { x: 20, z: 10, w: 80, h: 86 }, { knockback: 4, hitstop: 8, shake: 7 }), lunge: 1, pose: LEAN(-0.2, 0.22),
    fx: { slash: { r: 70, from: -100, to: 40, cx: 20, cz: 66 }, telegraph: true } },
};
