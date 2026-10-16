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
  // grab/throw (T009): clinch flash at the grip; the held rat leans (rad, + = toward the holder; he is pulled up by the collar) and doubles over on each knee (jerk);
  // a thrown body spins thrownSpin rad/frame and leaves a whoosh trail (points kept, gap = newest points left bare so the streak stops short of him, width, alpha); thrownHit = big impact burst.
  grab: { flashR: 34, life: 9, ringR: 24 },
  held: { lean: -0.16, jerk: -0.3, tip: 0.025, tipMax: 1.8 },   // tip: rad per px he is lifted during the throw wind
  thrownSpin: 0.32,
  trail: { points: 16, gap: 3, width: 26, alpha: 0.85, color: 'rgba(255,255,240,', edge: 'rgba(255,214,110,', lines: 3 },
  impact: { sparks: 26, speed: 9, life: 20, ringR: 64, flashR: 70 },
  // props + items (T010): a hit shudders the prop for `wobble` frames and throws chips; a break throws its debris
  // (debrisSpeed px/frame out, debrisLift up; they tumble, bounce, lie for debrisLife frames and fade) with a crunch flash.
  props: { hitstop: 3, shake: 2.5, breakHitstop: 6, breakShake: 8, wobble: 12, chips: 8, debrisSpeed: 6, debrisLift: 8.5, debrisLife: 80, flashR: 60 },
  items: { glow: 0.6, glowMax: 90, ghosts: 3, ringR: 26, sparkles: 8 },   // floor glow under pickups (glowMax: widest px, for a spear/bow lying turned, T020); ghosts behind a tossed weapon; eat/pickup pop
  weaponBreak: { hitstop: 6, shake: 6, life: 40 },
  // jump squat (T014, render only; see fighters' jumpSquatMode): legs extend from the crouch over `rise` frames after take-off
  // (A and B); both squash on landing (A since T011) for `land` frames, `landDepth` of the full crouch. Standee: squashX/squashY at full crouch.
  jumpSquat: { rise: 5, land: 8, landDepth: 0.7, squashX: 1.1, squashY: 0.82 },
  // arrows in flight (T011, render/shots.js): drawn `size` x the nocked arrow so they read at a glance, with a light
  // `glow` (blur px) round them and a speed streak `streak` px long behind (`width`, `alpha`)
  shot: { size: 1.1, glow: 7, streak: 60, width: 3, alpha: 0.6 },   // T020: size 1.5 -> 1.1, the A012 arrow is longer (same ~75 px in flight)
  // bracing breath while blocking (T015, standee; the rig's loop is data/rigs/*-brace.js): fade-in frames (after entering
  // block or a blocked hit), s per breath, squash = height gained on the in-breath (width gives back half), lean = rad in
  brace: { fade: 14, breath: 1.4, squash: 0.02, lean: 0.012 },
  // weapon feel (T017): a heavy weapon's hit (move.fx.dust puffs) kicks up dust at the target's feet (spread px each side,
  // speed px/frame out, r px, life frames, colour); drops = water flicked off the fish on its swing (from dx behind / dy above his feet)
  impactDust: { spread: 30, speed: 3.4, r: 16, life: 32, color: '150,118,84' },   // color: rgb, darker than landing dust so it reads on stone
  drops: { dx: 10, dy: 50, speed: 6, spread: 2.2, gravity: 0.45, life: 28 },
  koHitstop: 6, koShake: 6, heavyLandShake: 3,
  // T021 player slots: canvas filter on a slot's hero and HUD portrait (the test hero on slots 1, 2 = a tinted Mouse
  // Fighter, no new art) and the slot's P1/P2/P3 tag colour
  heroes: { filter: ['none', 'hue-rotate(150deg) saturate(1.2)', 'hue-rotate(250deg) saturate(1.1)'], tag: ['#ffd23f', '#6fd3ff', '#ff8adf'] },
  // T022 helping (render/helping.js, prop-fx.js): timer ring over a downed hero (r px, z = height over his feet, `warn` =
  // share of time left where it turns red and pulses), revive ring (r, width) round him while a friend holds grab, the
  // prompt shown to a friend in reach; revive pop (flash r, rings, 'Up!' word); heal burst (ring r, green sparkles);
  // the potion drawn in hand while tossing/drinking (px, at x/z from the feet); lob ghosts behind a potion in flight.
  help: { timer: { r: 15, z: 46, warn: 0.3 }, revive: { r: 34, width: 7 }, prompt: true,
    up: { flashR: 90, ringR: 52, word: 'Up!' }, heal: { ringR: 40, sparkles: 12 }, hand: { px: 0.26, x: 24, z: 84 }, ghosts: 4 },
};
