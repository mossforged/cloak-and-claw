# T032 - Import the rat's gear for every view (Code)

**Modules:** `tools/gear_from_source.py`, `src/data/rigs/rat-raider-gear.js` (generated), `src/render/` gear drawing, `src/data/fighters/rat-*.js` (gear picks), tests. **Read:** `assets/source/A020-rat-gear-every-view/HANDOFF.md` and its `rig-source.json` (round 3), `docs/tasks/A020-rat-gear-every-view.md` (round 3), `src/data/rigs/rat-raider-gear.js` (today's format). **Needs:** A020 round 3 (branch `a020-rat-gear-every-view`, merge it into this branch first). **Autonomy:** auto-ok up to the report; the user looks after.

A020 round 3 (lead review, 2026-10-19): the gear drawings are good: hood, helmet and captain hat drawn onto each of the nine heads, the jerkin onto each of the seven torsos (**whole-drawing swaps**: a hooded rat shows `head-attack-hood` where a bare one shows `head-attack`), and sash, quiver, eyepatch, scar, earring as overlays that reconstruct their dressed drawings exactly. Art marked it `importReady: false` for two reasons: some neck/outline drift on the swaps, and recolour masks that still mix materials. Import it anyway; the lead accepts the drawings and parks the masks.

## Do
1. **Gear swaps:** a gear pick (hood, helmet, hat; jerkin) maps every head / torso drawing to its dressed swap, so whichever drawing a pose or view asks for, the dressed one shows (`head-attack` -> `head-attack-hood`, `torso-front` -> `torso-front-jerkin`). Head gear and expression swaps combine; a missing combination falls back to the undressed drawing and is listed by a test.
2. **Overlays:** sash, quiver (band per view as the fragment gives; front hidden), eyepatch/scar/earring per head as before, now for the front and drink heads too. Ear notch: the `head-notch` swap on the neutral head only.
3. **Line-up check:** for each swap, the neck point (heads) and the shoulder, neck and waist anchors (torsos) against the undressed drawing, after trimming. Fix offsets in import; list anything over 2 game px for Art.
4. **Recolour:** cloth/fur tints keep working on undressed drawings exactly as today (old case, old result). On the new swaps and overlays use Art's masks only where the tint sheet passes; elsewhere no recolour for now (the drawing shows as drawn) and a list for the lead.
5. **Gear picks per rat type** (T019 kits: raider, spearman, archer, captain, ...) now dress every view.

## Acceptance
- Headless: `npm test` 0 failed; a test that every gear pick covers every head and torso drawing (or is listed); pass bar unchanged or better.
- Windowed: `docs/screens/T032/views.json`: a hooded, jerkined raider turning into the slash; the captain in the hat through the spin; the helmeted spearman's thrust; the rehearsal sheet with gear on.
- Human (user, phone): does the gear stay on when he turns?
