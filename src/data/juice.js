// Feel tuning for render-side effects. Per-move hitstop/shake live on each move.
export const JUICE = {
  shake: { decay: 0.82, max: 16 },
  flashFrames: 5,                          // white flash on the target when hit
  numbers: { life: 48, rise: 1.1, font: '26px "Lilita One", sans-serif' },
  sparks: { count: 10, speed: 5, life: 16 },
  dust: { count: 8, life: 24 },
  slash: { life: 9, width: 14, color: 'rgba(255,255,240,0.95)', edge: 'rgba(255,214,110,0.9)' },
  // blocked hit: sparks off the shield (fanned back toward the attacker), white flash on the shield side, double clang ring,
  // then a star glint on the shield's upper rim (glint dx/dy: px forward of / above the blocker's feet; delay: frames after the clang)
  block: { sparks: 18, speed: 9, spread: 1.3, life: 16, flashLife: 8, flashR: 46, ringR: 30, ringLife: 14,
    glint: { dx: 46, dy: 78, size: 26, life: 20, delay: 3 } },
  koHitstop: 6, koShake: 6, heavyLandShake: 3,
};
