# Status

**Stage 2 (feel pass + crowd tools): gate question with the user. Stage 3 (rig) passed. Stage 4 (standards) started with T023.** Stage 1 passed 2026-10-14 (tag `stage-1`). Last code task merged: T022 helping in the fight. Last art task merged: A013 Mouse Fighter to the rig standard. Plan rewritten around the hook on 2026-10-16 (old plan and older notes in `docs/history.md`).

## Next
1. **Code:** T023 (import the new Mouse Fighter + attack footwork), in progress.
2. **Art:** idle. A015 (oak stronghold) on hold with the home loop. Next art: the next body for the rig pipeline.
3. **User:** answer the Stage 2 gate; play T023 when it lands. One-time Mac step: install large-file storage (`docs/handoffs/setup-mac.md`) before Art's next task.
4. **Lead:** review T023; draft the combatant standard and the rig pipeline plan; pick the stress-test enemies with the user.

## Stage plan (combat core first, 2026-10-17)
| Stage | What | Gate question for the user |
|---|---|---|
| 1 | Standee combat in one arena (**passed** 2026-10-14) | Is hitting rats fun even with flat standees? |
| 2 | Feel pass + crowd tools: lab, block, grab/throw, floor weapons, breakables, rat kits, scrolling stage, helping (T001-T022) | Do the combo, block, throws and floor weapons make crowds fun to manage? |
| 3 | Cutout rigs + rig standard (**passed**: user "a big improvement"; standard approved 2026-10-16) | Does the rig look alive enough to rig everyone? |
| 4 | **Repeatable rig pipeline + combatant standard:** new mouse in game (T023); how heroes and enemies are defined (body, stats, moves, AI role, footwork); art-to-game import with automatic checks; shared pose library so a new body gets moves cheaply | Can a new body go from Art's delivery to fighting with little hand work, and does it hold up in motion? |
| 5 | **Combat variety stress test:** several enemy types chosen to break the pipeline (different bodies, sizes, weapons, abilities), each built through the standard; abilities = rig pose + effect art + tint | Does a 10-minute fight have variety and readable threats, and did each new enemy come in cleanly? |
| 6 | **Second hero** with own move set and abilities + co-op of up to 3 played with people; more helping verbs | Do two heroes feel truly different, and is helping each other fun? |
| 7 | Run loop in grey box: mission -> home room -> next mission (**on hold**, user 2026-10-17) | After two missions, do you want to go out for the next rescue? |
| 8 | Home loop, first slice (**on hold**) | Does coming home feel warm and worth it? |
| 9 | Sound, run logs, builds for fresh testers | Do new players get it without coaching? |
| 10 | First season of missions with stage art (**on hold**) | Does a season hold together? |

## What builders need now
- Code: `docs/tasks/T023-import-new-mouse.md`.
- Art: none queued (A015 on hold).

## Open questions (for the user)
- **Rig art inventory study** (`docs/studies/2026-10-17-rig-art-inventory.md`): adopt its process fixes? Rename parts near/far (one migration task) or keep front/back? Order the six missing mouse drawings (A016)? Keep our runtime vs test Spine?
- **Stage 2 gate** (above). Then the lead tags `stage-2` and `stage-3`.
- **Pillar 3** ("you grow by fighting... a run fits 30-60 minutes") was written for an arcade run. With mission -> home -> mission, growth comes from rescues and gear too. Reword it? (Lead's suggestion: "You grow by fighting and by the folk you save.")
- **What failure costs** (lean: retreat home and retry). Decide in Stage 5.
- **First rescued folk** and what each gives; cast size later.

## Parked (one line each; full notes in `docs/history.md`)
- **Feel/render:** floor shadows "a bit abstract"; spin swoosh far half behind all fighters; fish slap lands mid-spin; block shuffle has no footwork; feet ~5 px off floor in some poses; shared shading layer over rigs.
- **Spacing:** rats (and heroes) can overlap: rework `separate()` by body width, numbers in data (fold into Stage 4).
- **Helping balance:** downed time, revive hold, health back (lab: Helping). Potion drops only with 2+ heroes.
- **Rig follow-ups:** raised-knee leg + gripping hand for the grab knee; side-on torso for slash2/cast; bench strip rolls the head in knockdown.
- **Weapons:** grips stay separate hands (weapon-drawn hands only where a grip can't be faked); spearman drop decided with Stage 4 enemies; heavy throwables by size (props `weight`, fighters `size`).
- **Enemies:** enemy design workspace (after Stage 4); rat variety beyond +-4%; cap 5 on screen; colour variants.
- **Heroes/co-op:** LoL-style hero kits (passive + abilities + ultimate); companion/pet (Castle Crashers orbs); 360 spin special; parry as a skill layer; T021 test hero's bandana tint.
- **Lessons to schedule** (2026-10-15 study): shrink depth hit area while moving vertically; lab frame-step + live reload; invisible side walls.
- **Other:** pose swaps as fallback; art-bible items as rewards; lab boot code duplicates `src/main.js`; harbor stone backfill (brief clean ground edges); gamepad block untested.

## Last session
2026-10-17 lead: study "The rig art inventory" (5 research tracks + our history): the mouse lacked six whole-limb key drawings (toe-off feet x2, folded far leg, knee-up leg, kneeling leg, cocked arm) that a dozen states each use; half the painful rounds were runtime (floor-line rule, hand-follows-weapon, far-hand draw order). Proposes the rig sheet + pose budget, a stretch test, near/far naming, gate order. Waiting for the user's read.
2026-10-17 lead: user: hold off on meta progression (home loop, stronghold) until the rig system and core combat are locked down and tested against different enemies and abilities. Stage plan reordered; A015 on hold.
2026-10-17 lead: user on A014: "I think so far I like the ancient oak" (B). Wrote A015 (B refined: three layouts, hero at 130 px, animal-scale found objects, roots holding the walls, no invented emblems, animal silhouettes).
2026-10-16 lead: merged A014 (7 JPG sheets, 2.6 MB, scope clean). Art's pick: A for the first home, B the strongest landmark, C the most motion. Lead notes: architecture reads human-scale (needs animal-scale cues); home frames' style is flatter than the art bible; mouse undersized; payoff silhouettes look human; watch post and garden weak at game size. T023 branch pushed, review next.
2026-10-16 lead: wrote A014 (broad concept sheets for the stronghold home base; user's ask to keep Art busy). Concept packets deliver small JPGs to `docs/concepts/<ID>/` (Art guide updated).
2026-10-16 lead: user chose large-file storage for source art (option A): `.gitattributes` tracks new source images from A014 on (old folders and review sheets stay normal); Mac setup, Art guide and asset contract updated.
2026-10-16 lead: STATUS tidied (old notes, parked detail and old plan to history.md); stage plan rewritten around the hook (user approved the rewrite). Stage 2 gate question to the user.
