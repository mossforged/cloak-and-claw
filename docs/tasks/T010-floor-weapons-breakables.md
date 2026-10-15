# T010 - Floor weapons, breakables and food (code builder)

**Modules:** new `src/sim/props.js` (breakables, pickups, held weapons), `src/data/items/` (new: weapons, food), `src/data/stages/harbor-market.js` (prop placement), `src/sim/fighter.js` / `combat.js` (held weapon moves; thrown weapon), `src/render/` (prop drawing, debris, held-weapon attach on the rig and standee), `src/log/runlog.js`, `src/data/lab-schema.js`, tests. **Read:** `src/sim/CONTRACT.md`, `src/render/CONTRACT.md`, `src/data/CONTRACT.md`, `docs/decisions.md` (floor weapons + breakables: yes; weapon-kit assembly line), `docs/design/lessons.md`, `assets/source/A003-harbor-props/HANDOFF.md`, `assets/source/BIBLE-items/HANDOFF.md`.
**Needs:** T009 merged. **Autonomy:** human-gated (feel). T011 (rat weapon kits) builds on the held-weapon system made here, so make it generic.

The user loves floor weapons and enemies dropping their weapons. Breakable crates with food inside are the classic genre reward (the "roast chicken in a barrel").

## Do
1. **Import art:** from `assets/source/A003-harbor-props/`: crate, barrel, all debris, rat-cutlass, plank-club, big-fish; from `assets/source/BIBLE-items/`: berry-pie, cheese-wedge (others later). Into `assets/art/props/` and `assets/art/items/`.
2. **Breakables:** stage data lists props (type, x, y). Crates and barrels sit on the belt as obstacles (fighters can't walk through them), take hits (a few `hp`), and on break: debris pieces fly and tumble with gravity and fade (render-only), a crunch effect, and they drop their contents (data per prop: food or weapon, or a weighted random pick).
3. **Food:** lying on the floor; picked up by standing over it and pressing **H** (the grab button doubles as "pick up" when an item is underfoot and no enemy is in grab range). Cheese heals a little, berry pie a lot (data). Juicy pickup: a pop, a heal number, a short sparkle. (River City Ransom-style permanent stat growth comes in Stage 6, not now.)
4. **Weapons on the floor:** cutlass, plank-club, big-fish. Picking one up (H) puts it in Mouse Fighter's sword hand (sword hidden while holding; shield stays). Each weapon is a **weapon kit** in data: image, grip type (`one-hand` for all three here), its own moves (e.g. club: slower, big knockback, knocks down on the 2nd hit; fish: wide swing, huge knockback, comedy; cutlass: fast), and **durability** (hits before it breaks, with a break effect). **H while holding** throws it forward as a spinning projectile (damage + knockdown on the first enemy hit), then it drops.
5. **Enemies drop weapons:** a cutlass Rat Raider who is knocked out drops his cutlass (chance in data, default high). Dropped weapons stay a while, then blink and vanish.
6. **Generic held-weapon attach** for the rig (hand bone + per-weapon grip offset/rotation in data) and the standee (simple overlay). T011 will reuse it for rat spears and bows.
7. **Run log:** count breaks, food eaten, weapon pickups, throws, weapon breaks.
8. **Harbor Market:** place 2 crates and 1 barrel; a plank-club inside one crate, food in the others; the big-fish in the barrel.

## Acceptance
- Headless: `npm test` passes; tests: a crate breaks after its hp and drops its item; pickup with H only when standing on an item; food heals and is consumed; weapon moves replace sword moves while held and return after it breaks or is thrown; a thrown weapon knocks down the first enemy; props block movement; old case (no props in a stage) = old result.
- Windowed (JPG): `docs/screens/T010/`: crate breaking with debris, holding the fish mid-swing, a thrown club hitting a rat, a rat's dropped cutlass on the floor.
- Human: are smashing crates and fighting with the fish and club fun?

Out of scope: enemies picking up weapons, two-handed and bow kits (T011), RPG stat growth, coins and shops.
