# T029 - Every rehearsal move on the finished rat (Code)

**Modules:** `src/data/rigs/rat-raider*.js`, `src/data/rehearsal/rat-raider.js`, `src/data/moves/`, `src/viewer/rehearse*.js`, `tools/pass-bar.mjs`, tests. **Read:** `docs/design/rigs/rat-raider-rehearsal.md` (every move, key by key), `docs/design/rig-standard.md` 5b (anatomy rules), `docs/design/rigs/rat-raider.md` (hand table, cover table), `docs/screens/T030/pass-bar.md`. **Needs:** T030 (merged). **Autonomy:** auto-ok up to the report; the user looks once on his phone at the end of round 1.

The rat is approved in play (user, 2026-10-18: "the rat is good to go"). The rehearsal sheet (T028) still shows stand-in poses: it checked that every drawing exists, not the motion. This task poses the moves for real, so any rat type can be given any of them as data.

## Round 1: moving and attacking
1. **Pass bar tune first** (`tools/pass-bar.mjs`): the seam measure counts open space under a raised or swung arm (armpit, between the arm and the torso) as a seam gap. Count only gaps between two pieces that meet at a joint (the pair's pivot within reach), not daylight between a limb and the body. Rerun on main's moves; list which T030 misses this clears and which remain (`docs/screens/T029/pass-bar-tune.md`).
2. **Hand-table check** (deferred from T026): add to the anatomy rule test that every hold in every pose uses the drawing the hand table names for that hand (near grips show the back of the hand, far grips the palm side, split grips `[under, item, face]`). A wrong drawing fails with the pose, hand and hold named.
3. **Pose every move in the rehearsal's Moving and Attacking sections**, key by key, as the rehearsal names them: views (chest and hip), depth switches, drawings, swaps. Moves are data (the existing move format); a move the current fighters don't use is still posed and playable in the viewer. Follow the user's grip lines for every held item. Where a key needs a drawing the rig lacks, show it as a red box on the sheet and list it; don't invent art.
4. **Rehearsal sheet:** each key shows the posed frame, not the stand-in; each move links to its clip in the viewer.
5. **Pass bar** over the new moves, same bar as T030 (zero flags in idle, walk, turning slash, turn-around; under 20 game px² per piece elsewhere). Report misses as a list (piece, move, frame, size) for the lead; fix in pose data what pose data can fix.

Out of scope (round 2 and 3): grabs, hurt and down, lifting and throwing, drinking, magic; gear (A020, in parallel on Art).

## Acceptance
- Headless: `npm test` 0 failed; hand-table check; pass-bar report.
- Windowed: `docs/screens/T029/views.json` with viewer links for: the rehearsal sheet, turning slash, backhand, spin finisher, overhead chop, spear thrust, dash attack, jump attack, block, bow draw, dodge roll, run, skid stop. Phone JPGs of the sheet in `docs/screens/T029/`.
- Human (user, phone): does he turn into his attacks? Does anything look pieced together? Do the moves read as the move named?
