# T039 - v3 uses its hands, heads and feet (Code)

**Modules:** `tools/rig_from_source.py` (re-run), `src/data/rigs/rat-v3*.js`, `tools/v3-missing.mjs`, the grip-line data (`src/data/rigs/grip-lines.js` and a v3 lines file), tests. **Read:** `assets/source/A028-rat-v3-kit/rig-source.json` (`swaps`: each with `replaces`, `joint`, `pairedWith` for split grips, `handleLine` on the grip hands in canvas px, `items`), A028 HANDOFF, T035 (import command, retarget), `docs/screens/T035/missing.md`. **Needs:** A028 (merged). **Autonomy:** auto-ok up to the report.

## Do
1. **Import A028's 31 swaps and its three body repairs** (arm-near-upper, torso, leg-far-lower replace the A027 ones) into `rat-v3` with the round 1 command. Each swap sits on its joint (wrist, neck, ankle) exactly like the drawing it replaces; split grips as the raider's (`[under, item, face]`).
2. **Moves use them:** every pose key that names a hand, head or foot drawing v3 now has uses it on v3 (the raider's names map 1:1). Regenerate `missing.md`: what's left should be only other views and whole-limb drawings.
3. **Held items on v3:** until the user draws his lines, hold items on the grip hands by Art's `handleLine` (direction: toward the item's head as the raider's lines run; pick the end by the hand's `items` and the old line's direction, and list your choice per hand). Make the source of the lines swappable: the user is drawing his own in the "Rat v3 Grip Lines" page; the lead will drop his lines in as `docs/design/rigs/grip-lines-rat-v3.json` (same format as `grip-lines-rat.json`, plus each hand's `origin` (canvas px of the image's top-left) and `scale`), and a re-run should switch to them.
4. Refresh `views.json` (side by side turning slash, overhead chop with the axe, spear thrust, shield bash, hurt and knockdown, drink) and strips; the raider's own clips unchanged.

## Acceptance
`npm test` 0 failed (T035's limit and joint tests over the swaps too; held item inside each grip fist); the new missing list; strips and links.
