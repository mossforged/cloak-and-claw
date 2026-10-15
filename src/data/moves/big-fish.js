// Big fish moves (floor weapon kit, T010): one wide spinning slap that sends rats flying. Comedy.
// fx.word: a pop-up word at the impact.
export const BIG_FISH = {
  fishSlap: {
    rig: 'slash2', windup: 10, active: 6, recovery: 20,
    damage: 8, knockdown: true, launch: { vx: 10, vz: 8.5 }, hitbox: { x: -20, z: 15, w: 140, h: 85 }, knockback: 8, depth: 22,
    hitstop: 10, shake: 9, lunge: 2.4,
    pose: { windup: { rot: 0.08, sx: 1.04, sy: 0.96, dx: -5 }, active: { rot: 0.14, sx: 1.1, sy: 0.92, dx: 8, dy: 2 } },
    fx: { slash: { r: 80, from: 150, to: 420, cx: 8, cz: 58, flat: 0.32, wrap: true, big: true }, word: 'SLAP!' },
  },
};
