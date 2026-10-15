# T009 - Grab and throw (code builder)

**Modules:** `src/sim/fighter.js`, `src/sim/combat.js` (or a new `src/sim/grab.js` if fighter.js grows past ~200 lines), `src/sim/ai.js` (token release only), `src/data/fighters/*.js`, `src/data/rules.js`, `src/data/rigs/mouse-fighter-poses.js`, `src/render/effects.js`, `src/render/standee.js`, `src/log/runlog.js`, `src/data/lab-schema.js`. **Read:** `src/sim/CONTRACT.md`, `src/render/CONTRACT.md`, `docs/decisions.md` (throws: yes), `docs/design/lessons.md`.
**Needs:** T007 merged (block). **Autonomy:** human-gated (feel).

Throws are the genre's oldest crowd tool: grab one enemy and turn him into a weapon against the others (Double Dragon, Final Fight). The user chose yes to throws.

## Do
1. **Grab:** walking into an enemy's front or back while not attacking or blocking, within `grab.range`, grabs him if he's `throwable` (fighter data; Rat Raider yes). New states: `grabbing` (player) and `grabbed` (enemy). Grabbed enemies are helpless (the AI releases its attack token). Pressing attack within the first few frames instead of grabbing should still attack. Tune so a grab never happens by accident while comboing (e.g. only when not attacking for `grab.idleFrames`).
2. **While holding:** attack = a knee/pommel strike (up to `grab.maxStrikes`, the last one knocks down); attack + direction (or jump) = throw. The enemy breaks free after `grab.holdMax` frames (and stumbles back). The player can be hit by other enemies while holding; being hit drops the grab.
3. **Throw:** forward or backward (by held direction). The thrown enemy becomes a projectile: an arc (`throw.vx`, `throw.vz`), and spinning in render. Any other enemy he touches is knocked down with `throw.hitDamage` (crowd bowling); the thrown one lands knocked down with `throw.damage`.
4. **Invisible side walls** (lesson from SoR4, `docs/design/lessons.md`): a thrown or knocked-down fighter that reaches the floor's left/right edge bounces back instead of leaving the screen.
5. **Events:** `grab`, `throw`, `thrownHit` with payloads; document in MODULES.md and the sim contract. Effects: grab "clinch" flash, a whoosh trail on the thrown body, a big impact burst on `thrownHit`, hitstop/shake from data.
6. **Look:** rig poses `grabbing` (front arm forward, gripping), `knee`, `throw` (big wind and release; `torso-back` swap during the wind if it reads). The grabbed rat (standee) leans and jerks with each strike.
7. **Data + lab:** all numbers in fighter data (`grab: {...}`, `throw: {...}`) and `RULES` (wall bounce). Lab sliders as an option; defaults must feel good without tuning.
8. **Run log:** count grabs, throws and enemies hit by thrown bodies.
9. **AI check** (new hero abilities break old AI): make sure rats don't freeze, stack or keep attack tokens when a rat is grabbed; rats may keep attacking the player while he holds someone (that's the risk of a grab).

## Acceptance
- Headless: `npm test` passes; new tests: grab only when conditions are met; knee x3 knocks down; a throw knocks down another enemy in its path; break-free timer; wall bounce keeps fighters on the belt; the existing bot smoke run still defeats enemies (report if numbers shift and why).
- Windowed: `docs/screens/T009/`: grab pose, mid-throw with the trail, two rats bowled over.
- Human: is throwing a rat into his friends satisfying, and does grabbing ever happen when you didn't want it?

Out of scope: enemies grabbing the player, throwing allies, floor weapons (T010).
