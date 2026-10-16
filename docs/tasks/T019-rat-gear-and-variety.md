# T019 - Rat gear refit + individual variety in game (Code)

**Modules:** `src/data/rigs/rat-*.js` (gear overlays from A011), `src/data/fighters/rat-*.js` (loadouts, variety lists), `src/render/rig.js` / `src/render/tint.js` (overlays per head/torso swap, mask tints), `src/sim/waves.js` or spawn code (seeded variety pick; a per-fighter `look` field only, no gameplay effect), `assets/art/enemies/rat-raider/rig/`, `src/data/lab-schema.js` (optional), tests. **Read:** `docs/design/rig-standard.md` (sections 7, 7a), `assets/source/A011-rat-raider-finishing/` (HANDOFF, `rig-source.json` overlays + masks, `compatibility.json`), `src/render/CONTRACT.md`, `src/sim/CONTRACT.md`.
**Needs:** T018 merged, A011 merged. **Autonomy:** human-gated (look in game).

The user approved A011 ("very cool"): refitted gear (hood + quiver, helmet + jerkin, captain hat + sash) for the new rat, four face details, and recolour masks. This task brings them into the game: archers and spearmen get their real gear (replacing T018's temporary tint), and every rat that spawns gets its own look, so three archers don't look identical (rig standard 7a).

## Do
1. **Import the overlays** from A011's `rig-source.json` (`overlays`, `masks`); they share A010's canvas at [0,0], so they ride their part with no extra offsets. Follow `compatibility.json` for which overlay goes with which head/torso swap: head gear and face details switch to their `-hurt` / `-back` versions with the head; jerkin and sash switch to `-side` / `-back` with the torso.
2. **Loadouts:** archer = hood + quiver; spearman = helmet + jerkin; captain gear (hat + sash) wired as data for a later captain enemy. **Remove T018's temporary tints.**
3. **Individual variety** (standard 7a), picked once when an enemy spawns, with `world.rng`-derived seeds so a run replays the same looks; stored as a render-only `look` on the fighter (no sim effect; bot numbers identical):
   - **Face detail:** none, eyepatch, scar2, ear-notch or earring (data weights per type).
   - **Cloth tint:** a hue/saturation/brightness shift on the cloth masks, from a per-type palette list in data. **Default palette earthy and muted** (dyed-cloth browns, ochres, faded greens, slate blues, dull reds) so rats stay in the art bible's world; keep the type's signature colour readable (e.g. the bandana red stays red-ish on plain raiders). Lab sliders for saturation strength.
   - **Fur shift:** a slight brightness/warmth shift on the fur masks (small range).
   - **Size:** plus or minus 4%, render only (hit areas unchanged).
   - Skip empty masks (A011's manifest marks them `empty: true`).
4. **Performance:** pre-tint per look (cache the tinted part images per variant), not per frame.
5. **Bench:** the rig bench can show the overlays and a `?look=` option (optional, if cheap).
6. Build label `t019 rat looks v1`.

## Acceptance
- Headless: `npm test` passes; bot numbers identical to main (looks are render-only); a test that a seeded run gives the same looks every time; every overlay named in a loadout or variety list exists for every head/torso swap it can appear with.
- Windowed (JPG) in `docs/screens/T019/`: a wave of 4 to 5 rats with different looks; archer hood and spearman helmet in hurt and knockdown (gear follows the head swaps); a back-view frame (head turned) with gear.
- Human: in a fight, do the rats look like different individuals of the same people, and do the colours sit right in the world (not too loud)?

Out of scope: a captain enemy (gear only wired), new weapons, spear/bow redraws, Mouse Fighter variety.
