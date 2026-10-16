# T021 - Engine supports more than one hero (Code)

**Modules:** `src/sim/world.js`, `src/sim/ai.js`, `src/sim/camera.js`, `src/sim/zones.js`, `src/core/input.js`, `src/data/controls.js`, `src/render/hud.js`, `src/render/debug.js`, `src/log/runlog.js`, `src/lab/tools.js`, `src/game.js`, `src/data/rules.js` (new numbers), tests. **Read:** `src/sim/CONTRACT.md`, `src/render/CONTRACT.md`, `src/log/CONTRACT.md`, `docs/design/lessons.md` (co-op lessons).
**Needs:** T020 merged. **Autonomy:** mostly auto-ok (objective: old case = old result); one human check at the end.

The user decided (2026-10-16) to make the engine handle **more than one hero now**, before more content. Whatever the hook turns out to be (local co-op for up to 3 players, AI allies on screen, swap/assist heroes), the engine needs it, and today "the player" is assumed in about 17 places across 9 files (`w.player` in AI targeting, camera, zones, input, HUD, debug, run log, lab, view poses). This task removes that assumption **without changing how the one-player game plays**.

## Do
1. **World:** `w.heroes` (array, order = player slot) replaces `w.player`. Keep `w.player` only as a read-only alias for `w.heroes[0]` if that eases the change, and mark it deprecated in the contract; nothing new may use it. A hero carries `slot` (0..2) and `controller` (`'human'` with a pad/keyboard index, or `'ai'` for later allies; this task needs only `'human'` plus a test-only scripted controller).
2. **Spawning:** `createWorld({ heroes: [id, ...] })`; stage data gets `heroStarts` (2 to 3 spots staggered in depth near the old `playerStart`, which stays as slot 0's spot).
3. **Input:** per-slot control objects. Slot 0 = today's keyboard + first gamepad (unchanged). Slot 1 and 2 = gamepads 2 and 3 (and an optional second keyboard layout in data, e.g. arrows + numpad, off by default). Read each slot independently.
4. **Enemy AI targets a hero, not "the player":** each enemy picks a target (nearest living hero in reach of its lane, sticky for a while so it doesn't flicker; numbers in data). The **attack-token limit (`maxAttackers`) stays global** (fairness rule): with more heroes it may scale (`maxAttackersPerHero`, default so 1 hero = exactly today). Archers keep away from their target. Grab/throw, props, items and shots already use `team`; check they never assume one hero.
5. **Camera:** follows the heroes' centre, clamped so every living hero stays on screen; when they spread too far, the leading hero is held at the edge (Golden Axe co-op style). Locked zones keep all heroes inside. With one hero the camera moves exactly as now.
6. **Zones / stage loop / game over:** a zone starts when any hero reaches it; the loop moves all heroes; game over when **all** heroes are down (with lives later). A downed hero in co-op stays down for now (revive belongs to the hook decision; leave a clear hook point).
7. **HUD:** one portrait + health bar per hero (slot 0 where it is now; slots 1 and 2 along the top). Shows only the heroes present.
8. **Run log / debug / lab / view poses:** per hero (run log keeps slot 0's numbers in the same fields as today, adds a `heroes` array); `game.js` cast/view pose per hero.
9. **Test hero:** a second hero for testing = Mouse Fighter with a tint (no new art), started with `?heroes=2` (or a lab toggle). Not exposed in normal play yet.
10. Contracts, `docs/MODULES.md`, build label `t021 multi-hero v1`.

## Acceptance
- Headless: `npm test` passes; **one-hero runs give exactly main's bot numbers** (all existing bot tests unchanged); new tests: two scripted heroes clear `harbor-run` (no stuck zone, camera keeps both on screen, enemies split targets, never more attackers than the token limit allows); game over only when both are down; per-slot input mapping.
- Windowed (JPG) in `docs/screens/T021/`: two heroes in a locked zone fight with both health bars; camera holding the leading hero when they spread apart.
- Human: with a second gamepad (or the optional second keyboard layout), can two people play a stage? With one player, does everything feel exactly as before?

Out of scope: AI allies' behaviour, revive, swap/assist, a second hero with its own moves, friendly fire, balance for co-op (crowd/damage scaling: a later task).
