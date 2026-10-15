# Status

**Stage 2 (feel pass + crowd tools) in progress.** Stage 1 gate passed 2026-10-14 (tag `stage-1`). Last code task: T001 tuning lab (merged 2026-10-14). Last art task: A001 (merged, look approved).

## Next
1. **Code builder:** T003 Mouse Fighter rig, so the user can see it move.
2. **User:** try the lab (`/lab.html`): can you tune the combo the way you want in under 10 minutes?
3. **Art builder:** free (A001 done). Next art waits on seeing the rig move.
4. **Lead:** write Stage 2 packets: floor lane matched to the stage art, block, grab/throw, floor weapons and breakables.

## Stage plan
| Stage | What | Gate question for the user |
|---|---|---|
| 1 | Standee combat in one arena (**passed**) | After 10 minutes: is hitting rats fun even with flat standees? What feels off? |
| 2 | Tuning lab + feel pass (T001, then tuning tasks from the playtest); block, grab/throw, floor weapons and breakables | Do the combo, jump and rats feel right now? Does blocking and throwing make crowds fun to manage? |
| 3 | Cutout rig for Mouse Fighter (A001 + rig task) | Does the rig look alive enough that you want every character rigged? (No = pose swaps instead) |
| 4 | Enemy variety (Rat Archer, Skeletal Mouse) + run log (T002) | Does a 10-minute run have variety and readable threats? |
| 5 | Scrolling stage with layered art + touch controls | Does moving through a stage feel like Golden Axe? |
| 6 | RPG layer: stats grow, food/shop between stages, lives | Do you want "one more run" to get stronger? |
| 7 | Sound, builds for fresh testers | Do new players get it without coaching? |
| 8 | Second hero with own move set, local co-op | Do two heroes feel truly different? |

## What builders need now
- Code: `docs/tasks/T003-mouse-rig.md`, then `T004-rat-telegraph.md` (small, auto-ok). Queued: `T002-run-log.md` (auto-ok).
- Art: nothing queued (A001 done).

## Open questions (for the user)
- None right now.

## Parked
- Pose-swap images as a cheap animation upgrade (fallback if the rig disappoints).
- Touch controls for phone play (Stage 5).
- Art bible items (pie, cheese, potions, chest, coins) as pickups and RPG rewards (Stage 6).
- Bramble Brute as the first boss.
- Lab boot code duplicates `src/main.js` (T001 note); merge the two if the lab grows in Stage 3.
- League of Legends-style hero kits (passive + three cooldown abilities + an ultimate, on top of the basic combo), like Dungeon Fighter Online. User is a big LoL fan. Idea only, for Stage 8 heroes; mind button count.

## Last session
2026-10-14 code: T003 Mouse Fighter rig on branch `t003-mouse-rig` (tools/slice_sheet.py, src/data/rigs/, src/render/rig.js + rig-pose.js, R toggles rig/standee, tests/rig.test.mjs); no sim changes. Screens in docs/screens/T003/.
2026-10-14 code: T003 round 2 from user notes: angled upright shield, stockier build, slower matched stride, slash2 is now a flat sweep across the body (flat swoosh). slash2 is now a backhand cut outward (user's pick); a true horizontal cut waits on back-view torso art. Human check still open; no combo GIF.
2026-10-14 lead: merged T001 (tuning lab). User's lab check still open.
2026-10-14 lead: merged A001 (source art; user approved the look). Wrote T003 (rig) so the user can see it move.
2026-10-14 lead: Stage 1 gate passed (user: striking and knockback feel good). Lane/background mismatch noted for Stage 2.
2026-10-14 code: T001 tuning lab on branch `t001-tuning-lab` (lab.html, src/lab/, src/data/lab-schema.js, tests/lab.test.mjs); no sim changes. Screens in docs/screens/T001/.
2026-10-14 code: needs the user's human check: tune the combo in the lab in under 10 minutes.
2026-10-14 lead: user answered the six genre-study questions (decisions.md); block, throws and floor weapons added to Stage 2.
2026-10-14 lead: genre study written (docs/studies). A private lore appendix went to the user only, not the repo.
2026-10-15 lead: set up the workflow (guides, contracts, CI, test runner, data test, brief, decisions, packets T001, T002, A001). Details in `docs/history.md`.
