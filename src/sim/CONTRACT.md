# sim: game rules (pure logic)

**Owns:** world state, fighter state machine and physics, hit detection and damage, enemy AI, waves, breakable props, floor items and held weapons, projectiles (arrows).
**Does not own:** anything visual; tuning numbers (those are in `src/data/`).

**Public API:** `createWorld(stageId, heroId, seed)`, `stepWorld(world, control)`; helpers `phaseOf`, `hitboxOf`, `hurtboxOf`, `HELPLESS` are read by render/debug. The `hit` payload carries `targetPhase` for the run log (src/log).
**Emits:** `swing hit block land jump defeated wave gameOver grab throw thrownHit propHit propBreak itemLand pickup eat weaponThrow weaponBreak weaponDrop shot` (payloads in docs/MODULES.md). Knees, a thrown body's landing and a tossed weapon's hit are ordinary `hit` events from the holder/thrower.

**Rules:**
- Never imports from `src/render/`, never touches `window`, `document` or `performance`. Must run in Node (`npm test`).
- Deterministic given a seed: use `world.rng`, never `Math.random`.
- Every fighter is driven through `f.control` (input or AI write the same shape). `control.block` (held) only works for fighters whose def has a `block` config; a hit from the side the blocker faces emits `block` instead of `hit`.
- Grab/throw (`grab.js`) only for fighters whose def has `grab`/`throw` configs, on enemies marked `throwable`. `grabbed` and `thrown` are in `HELPLESS` and can't be hit by moves; only a thrown body hits via `thrownHit`.
- Props and items (`props.js`, `weapons.js`, T010): only hero-team hits break props; props block fighters on the ground. Loot rolls (crate picks, KO drop chance) use `world.itemRng`, never `world.rng`, so loot never changes the fight. Picking up, eating and tossing only for defs with `pickup` / `toss`; while `f.weapon` is held its kit's moves replace the fighter's (`movesOf`). A stage without `props` and a world where nothing is picked up behave exactly as before T010.
- Arrows (`shots.js`, T011): a move with a `shot` has no hitbox; the arrow hits through `applyHit` with a stand-in attacker (a block shoves the arrow, never the far-away archer). Brawler AI with no `slack`/`brain: 'archer'` behaves exactly as before; a stage with only cutlass rats gives the pre-T011 numbers.
- Jump squat (T014, hero uses A): only a def with `jumpSquatMode: 'A'` gets the `jumpStart` crouch before take-off; 'B', 'off' and no field = the old jump, frame for frame.
- Scrolling stages (T013, `camera.js`, `zones.js`): `w.cam` (x, locked), `w.run` (zone, locked, queue, cleared, loop) and `w.bounds` (walkable belt inside the camera view) live in the world; render only reads them. Everything clamps to `w.bounds`; on an arena `w.bounds` is `stage.floor` itself and `w.cam`/`w.run` are null, so arena results are unchanged.
- Units: pixels and frames (60/s). x = left/right, y = depth, z = height.
