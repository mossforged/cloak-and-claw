# sim: game rules (pure logic)

**Owns:** world state, fighter state machine and physics, hit detection and damage, enemy AI, waves.
**Does not own:** anything visual; tuning numbers (those are in `src/data/`).

**Public API:** `createWorld(stageId, heroId, seed)`, `stepWorld(world, control)`; helpers `phaseOf`, `hitboxOf`, `hurtboxOf`, `HELPLESS` are read by render/debug. The `hit` payload carries `targetPhase` for the run log (src/log).
**Emits:** `swing hit block land jump defeated wave gameOver` (payloads in docs/MODULES.md).

**Rules:**
- Never imports from `src/render/`, never touches `window`, `document` or `performance`. Must run in Node (`npm test`).
- Deterministic given a seed: use `world.rng`, never `Math.random`.
- Every fighter is driven through `f.control` (input or AI write the same shape). `control.block` (held) only works for fighters whose def has a `block` config; a hit from the side the blocker faces emits `block` instead of `hit`.
- Units: pixels and frames (60/s). x = left/right, y = depth, z = height.
