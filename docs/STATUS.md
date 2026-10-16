# Status

**Stage 2 (feel pass + crowd tools): gate question with the user. Stage 3 (rig) passed. Stage 4 (standards) started with T023.** Stage 1 passed 2026-10-14 (tag `stage-1`). Last code task merged: T022 helping in the fight. Last art task merged: A013 Mouse Fighter to the rig standard. Plan rewritten around the hook on 2026-10-16 (old plan and older notes in `docs/history.md`).

## Next
1. **Code:** T023 (import the new Mouse Fighter + attack footwork), in progress.
2. **Art:** A014 stronghold concept sheets (three directions, building spots in three states, props and ambient life). Concepts only, so no large-file setup needed.
3. **User:** answer the Stage 2 gate; play T023 when it lands. One-time Mac step: install large-file storage (`docs/handoffs/setup-mac.md`) before Art's next task.
4. **Lead:** review T023; draft the combatant standard (heroes + enemies), then the mission/stage standard.

## Stage plan (hook-based, 2026-10-16)
| Stage | What | Gate question for the user |
|---|---|---|
| 1 | Standee combat in one arena (**passed** 2026-10-14) | Is hitting rats fun even with flat standees? |
| 2 | Feel pass + crowd tools: lab, block, grab/throw, floor weapons, breakables, rat kits, scrolling stage, helping (T001-T022) | Do the combo, block, throws and floor weapons make crowds fun to manage? |
| 3 | Cutout rigs + rig standard (**passed**: user "a big improvement"; standard approved 2026-10-16) | Does the rig look alive enough to rig everyone? |
| 4 | **Standards before content:** new mouse in game (T023); combatant standard (stats, move sets, AI roles, footwork, enemy bench); one new enemy built through it end to end | Did a new enemy go from idea to fight cleanly, and does it ask you a new question? |
| 5 | **Run loop in grey box:** one mission with a goal (a rescue) -> a grey-box abbey room (the rescued appear, one decision) -> the next mission; mission/stage standard; failure = retreat and retry for now | After two missions, do you want to go out for the next rescue? |
| 6 | **Home loop, first slice:** 3-5 rescued folk with one visible and one playable change each, one building currency, weapon + ring gear, a rescued adventurer as AI ally, wounded-ally test | Does coming home feel warm and worth it? |
| 7 | **Second hero** (bigger animal, own move set, heavy throwables) + co-op of up to 3 played with people; more helping verbs | Do two heroes feel truly different, and is helping each other fun? |
| 8 | Sound, run logs on the loop, builds for fresh testers | Do new players get it without coaching? |
| 9 | **First season:** 4-6 hand-made missions with stage art at 120 px depth, Bramble Brute boss, "Winter at the abbey" close, touch controls | Does a season hold together and make you want the next? |

## What builders need now
- Code: `docs/tasks/T023-import-new-mouse.md`.
- Art: `docs/tasks/A014-stronghold-concepts.md`.

## Open questions (for the user)
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
2026-10-16 lead: wrote A014 (broad concept sheets for the stronghold home base; user's ask to keep Art busy). Concept packets deliver small JPGs to `docs/concepts/<ID>/` (Art guide updated).
2026-10-16 lead: user chose large-file storage for source art (option A): `.gitattributes` tracks new source images from A014 on (old folders and review sheets stay normal); Mac setup, Art guide and asset contract updated.
2026-10-16 lead: STATUS tidied (old notes, parked detail and old plan to history.md); stage plan rewritten around the hook (user approved the rewrite). Stage 2 gate question to the user.
