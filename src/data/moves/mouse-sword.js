// Mouse Fighter's moves. One object per move.
// Timing (frames): windup -> active (hitbox live) -> recovery.
// hitbox: relative to the fighter's feet; x = distance in front, z = height above ground.
// combo: pressing attack after frame `comboFrom` queues `next`, which starts as soon as active ends.
// pose: how the standee leans/squashes in each phase (rot radians, +forward; sx/sy scale; dx/dy px).
// fx.slash: swoosh arc (degrees, 0 = straight ahead, -90 = up, 180 = behind); flat < 1 squashes it into a
//   level ellipse for a sweep across the body (the near side is the bottom of the ellipse).
export const MOUSE_SWORD = {
  slash1: {
    windup: 5, active: 4, recovery: 12, comboFrom: 2, next: 'slash2',
    damage: 6, hitbox: { x: 10, z: 30, w: 80, h: 70 }, knockback: 2.5, hitstun: 18,
    hitstop: 4, shake: 2.5, lunge: 1.8,
    pose: { windup: { rot: -0.14, sx: 0.95, sy: 1.04, dx: -5 }, active: { rot: 0.16, sx: 1.07, sy: 0.95, dx: 7 } },
    fx: { slash: { r: 52, from: -110, to: 30, cx: 26, cz: 62 } },
  },
  slash2: {
    windup: 5, active: 4, recovery: 12, comboFrom: 2, next: 'slash3',
    damage: 6, hitbox: { x: 10, z: 20, w: 82, h: 70 }, knockback: 2.5, hitstun: 18,
    hitstop: 4, shake: 2.5, lunge: 1.8,
    pose: { windup: { rot: 0.05, sx: 1.03, sy: 0.97, dx: -3 }, active: { rot: 0.1, sx: 1.06, sy: 0.96, dx: 6, dy: 2 } },
    fx: { slash: { r: 50, from: 170, to: -20, cx: 22, cz: 62, flat: 0.32 } },
  },
  slash3: {
    windup: 10, active: 5, recovery: 22,
    damage: 12, knockdown: true, hitbox: { x: 5, z: 15, w: 95, h: 90 }, knockback: 4,
    hitstop: 9, shake: 8, lunge: 3.2,
    pose: { windup: { rot: -0.26, sx: 0.92, sy: 1.08, dx: -8 }, active: { rot: 0.32, sx: 1.12, sy: 0.9, dx: 12 } },
    fx: { slash: { r: 64, from: -150, to: 60, cx: 24, cz: 60, big: true } },
  },
  jumpSlash: {
    air: true, windup: 3, active: 12, recovery: 6,
    damage: 8, hitbox: { x: 0, z: -10, w: 80, h: 80 }, knockback: 3.5, hitstun: 20,
    hitstop: 5, shake: 4,
    pose: { windup: { rot: -0.2 }, active: { rot: 0.45, sx: 1.05, sy: 0.95 } },
    fx: { slash: { r: 56, from: -60, to: 120, cx: 20, cz: 40 } },
  },
};
