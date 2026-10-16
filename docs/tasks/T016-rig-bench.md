# T016 - Rig bench: fit overlay + standard motion strip (Code)

**Modules:** `tools/rig-bench.html` (new; grow from `tools/rig-preview.html` or share its loader), a small `src/render/` helper only if the game's rig drawing needs a reusable entry point, `src/data/rigs/biped-poses.js` (new, the standard motion strip), `tests/`. **Read:** `docs/design/rig-standard.md` (**approved**; sections 1, 3, 5 rule 4, 6, 8), `src/render/CONTRACT.md`, `src/data/rigs/mouse-fighter.js`, `tools/rig-preview.html`.
**Needs:** T015 merged. **Autonomy:** auto-ok for the tool itself (objective checks); the user looks at the result.

The rig standard (approved 2026-10-16) puts two checks before art goes into the game: **G2**, do the parts reassemble into the master drawing, and **G3**, does the character look alive in motion. Both need a page that works straight from Art's source folder, before anything is imported. That page is the rig bench. Art's next delivery (A010, the rat redone to the standard) will be its first real job.

## Do
1. **Read a delivery** from `assets/source/<ID>-<slug>/rig-source.json` (format in standard section 5, rule 4): canvas, master image, floor line, parts with parent + joint point + draw band, swaps, overlays. URL: `tools/rig-bench.html?src=<ID>-<slug>`.
2. **Fit overlay (G2):** draw the master faded, then every part at its canvas position (rest pose = no rotation), with a toggle between: parts over master, master only, parts only, and a **difference view** that tints pixels where the parts and master disagree. Print a mismatch score (share of the master's silhouette not covered by parts, and of parts outside the master). Click a part name to highlight it and show its joint point.
3. **Motion strip (G3):** build a rig at runtime from `rig-source.json` (scale to game size, about 136 px tall) and play a **standard biped motion strip** from the new `src/data/rigs/biped-poses.js`, using the standard's part names (pelvis, hands, feet): stance, idle breath, walk cycle, a three-step attack (windup, strike, follow-through), hurt, knockdown, down, get-up. Plays live at game size beside the character's standee (`art.idle` of the matching fighter, if any); also a 1x game-size view over the Harbor Market floor. Swaps are exercised: attack head on strikes, hurt head on hurt, fist and grip hands where they fit.
4. **Export:** a button (and a `?export` mode for screenshots) that renders the strip as one image for reviews.
5. **Prove it on what exists:** write a `rig-source.json` for the Mouse Fighter's current parts (from `rigs/mouse-fighter.js`, mapping his parts to the nearest standard names; he has no pelvis, separate hands or feet: the bench must cope with missing standard parts by skipping their poses). Keep it in `tools/fixtures/` (not in `assets/source/`, which is Art's).
6. **Importer (draft only):** `tools/rig_from_source.py` writes a draft `src/data/rigs/<id>.js` from a `rig-source.json` (keyed and trimmed images, pivots converted to each image's own pixels). Not run on the rat yet; tested on the mouse fixture.

## Acceptance
- Headless: `npm test` passes, game unchanged (old case = old result); a test that loads the mouse fixture, builds the rig, and checks every part's joint lands on its parent's joint at rest; biped-poses data test (every pose names only standard parts).
- Windowed (JPG) in `docs/screens/T016/`: the fit overlay and difference view for the mouse fixture; the exported motion strip.
- Human: the user opens the bench on the mouse and sees a sensible fit view and motion strip. (The real test is A010.)

Out of scope: importing the rat into the game (a later task after A010 passes G2 and G3), editing poses in the bench, gear and variety overlays in motion (later).
