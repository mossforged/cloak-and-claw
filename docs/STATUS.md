# Status

## Rung 1a: done (standee prototype)
- Mouse Fighter vs waves of Rat Raiders in Harbor Market (single-screen arena, belt movement).
- 3-hit sword combo (finisher knocks down), jump + jump slash, hurt / knockdown / get-up / defeat.
- Rats hover and take turns attacking (max 1 at a time), with a flashing windup you can interrupt.
- Juice: hit-stop, screen shake, white hit flash, red hurt tint, sparks, damage numbers, slash arcs, dust.
- HUD, wave banner, KOs/XP counter, game over + restart, pause, debug overlay (` key or `?debug`).
- Headless test (`npm test`).

## Next
1. **Playtest 1a and tune feel** (numbers in `src/data/moves/` and `src/data/rules.js`).
2. **Rung 1b: cutout rig** for Mouse Fighter. Needs the parts sheet (see `docs/ART_PIPELINE.md`). Build: rig data, rig renderer, pivot editor + move tuning page with sliders.
3. Rung 2: second enemy type (Rat Archer or Skeletal Mouse, which can share the mouse rig).

## Undecided / deferred
- Pose-swap images (attack/hurt/down) as a cheap upgrade before or alongside the rig.
- Touch controls for mobile.
- Audio (hooks: `swing`, `hit`, `jump`, `land`, `wave` events).
- River City Ransom-style RPG layer: XP is counted; stats (`power`, `defense`, `speed`) exist on fighters but nothing raises them yet.
- Scrolling stages (need layered stage art), more heroes with their own move sets.
- Name of the game (working title: Tales of Cloak & Claw).
