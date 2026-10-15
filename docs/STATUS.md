# Status

**Stage 2 (feel pass + crowd tools) in progress.** Stage 1 gate passed 2026-10-14 (tag `stage-1`). Last code task: T008 spin slash (merged 2026-10-15; user OK on round 2). Last art task: A004 Rat Raider rig + weapon kit (merged; user look check pending).

## Next
   **User:** play slash2 (the spin) and C (cast pose plays once). **Code builder:** T009 grab and throw.
   **Art builder:** free. **User:** A004 look check.
   **Code builder:** free until the lead writes the Stage 2 crowd-tool packets.
2. **User:** try the lab (`/lab.html`): can you tune the combo the way you want in under 10 minutes?
4. **Lead:** write T009 grab/throw and T010 floor weapons + breakables; after A004, the rat rig import task.

## Stage plan
| Stage | What | Gate question for the user |
|---|---|---|
| 1 | Standee combat in one arena (**passed**) | After 10 minutes: is hitting rats fun even with flat standees? What feels off? |
| 2 | Tuning lab + feel pass (T001, then tuning tasks from the playtest); block, grab/throw, floor weapons and breakables | Do the combo, jump and rats feel right now? Does blocking and throwing make crowds fun to manage? |
| 3 | Cutout rig for Mouse Fighter (**done**: A001, T003, A002, T005; user: "a big improvement"). Follow-ups parked | Does the rig look alive enough that you want every character rigged? (No = pose swaps instead) |
| 4 | Enemy variety (Rat Archer, Skeletal Mouse) + run log (T002) | Does a 10-minute run have variety and readable threats? |
| 5 | Scrolling stage with layered art + touch controls | Does moving through a stage feel like Golden Axe? |
| 6 | RPG layer: stats grow, food/shop between stages, lives | Do you want "one more run" to get stronger? |
| 7 | Sound, builds for fresh testers | Do new players get it without coaching? |
| 8 | Second hero with own move set, local co-op (up to 3 players) | Do two heroes feel truly different? |

## What builders need now
- Code: `docs/tasks/T009-grab-throw.md`. Next: T010 floor weapons + breakables (uses A003). Next to write: T009 grab/throw, T010 floor weapons + breakables (after A003 look check).
- Art: none queued (A004 merged).

## Open questions (for the user)
- The hook (study 2026-10-15, user thinking it over; tests later): leaning toward AI allies on screen in solo so solo and co-op are one system, plus swap/assist with a slotted benched hero. Merciful Blade out; Kit Brawler undecided. New candidate from the user: **teamwork as the core verb** (revive, tossed potions, cover, rescue, rallies, bonds). Not urgent: revisit once core systems are locked down.

## Parked
- Pose-swap images as a cheap animation upgrade (fallback if the rig disappoints).
- Touch controls for phone play (Stage 5).
- Art bible items (pie, cheese, potions, chest, coins) as pickups and RPG rewards (Stage 6).
- Bramble Brute as the first boss.
- Rig follow-ups (Mouse Fighter art touch-up, A005 when queued): shield drawn facing the viewer, a raised-guard shield arm, a gritted-teeth bracing head (T007); a torso turned side-on a torso turned side-on / raised-arm torso so slash2 can be a true horizontal cut and the cast pose stops looking awkward (same root cause); feet ~5 px off the floor in knockdown and slash3 strike poses; optional shared shading layer over the assembled rig.
- Lab boot code duplicates `src/main.js` (T001 note); merge the two if the lab grows in Stage 3.
- Belt depth: the Harbor Market art only allows a 63 px belt (packet asked 85+). User: "we might need to eventually return to belt depth and then get the art to match the goal." Plan: when stages become layered (Stage 5), set the target belt depth first and brief the stage art to it. Also: feet overlap two front dock posts slightly; fighters look a bit smaller after the zoom.
- Companion / pet that fights alongside you (Castle Crashers' animal orbs). User likes it.
- Co-op party of up to **three** players (user), not just two; plan Stage 8 and belt depth for it.
- **Weapon kits** (decision 2026-10-15): the rat's grip hands, spear, bow and arrow were folded into A004; after it, a code task for weapon kits on the rig.
- **Enemy design workspace** (user): compose an enemy from body + stats + move library + AI params, test it on a bench vs dummy/bot, auto-measure (time to kill, escape time, block-through), export a data file. After Stage 4. Sketch in the 2026-10-15 study.
- Standing lessons checklist: `docs/design/lessons.md`. Lessons to schedule (2026-10-15 study, section 9): shrink depth hit area while moving vertically; cap on-screen enemies at 5; lab frame-step + live reload; invisible side walls; colour-variant enemies.
- Spin swoosh's far half draws behind all fighters, not just the attacker: fine with a few rats, may look odd in crowds (T008). Blade tip grazes the floor line ~1 frame early in slash2's windup.
- Parry: a timed block as a later skill layer (user's earlier idea; T007 report).
- Gamepad block (RB) untested.
- A 360-degree spin special that hits all around (crowd clearer, Final Fight style), building on T008's spin slash.
- League of Legends-style hero kits (passive + three cooldown abilities + an ultimate, on top of the basic combo), like Dungeon Fighter Online. User is a big LoL fan. Idea only, for Stage 8 heroes; mind button count.

## Last session
2026-10-15 lead: merged T008 round 2 (+ build label kept) and A004 (rat rig + spear/bow kit, source).
2026-10-15 lead: merged T008 (spin slash, view-only; cast key fixed).
2026-10-15 code: user OK'd T008 round 2 spin ("sounds good for now"); C cast fix confirmed working by the user. Branch `t008-spin-slash` ready for the lead to merge.
2026-10-15 code: T008 on branch `t008-spin-slash`: slash2 is a spin slash (windup low back; one back-view torso frame mid-active with the head looking back along the flat blade; flat cut in front), wrap-around swoosh with its far half behind him. Sim/timing/hitbox unchanged. C now plays the cast pose once (1 s, idle only).
2026-10-15 code: 8/8 tests (new tests/view-pose.test.mjs, rig test slash2 checks). Screens in docs/screens/T008/. Human check open: does slash2 read as a flat spinning cut?
2026-10-15 code: user request (outside T008, for the lead): small "build: t008 spin slash" label under the KO counter (`BUILD` in src/config.js, drawn by hud.js) so testers can tell versions apart. Lead: keep, change per task, or drop.
2026-10-15 code: T008 round 2 (user: "i dont see his back at all"): the torso-back drawing barely differs from the front at game size, and it showed for 1 frame. Now the windup narrows the body (twisting away) and the first 2 active frames mirror the whole body (new render-only rig channel `sx`, default 1) with the back torso; a hit-stop holds that frame. Build label "t008 spin slash v2".
2026-10-15 code: art that would sell the spin: a true back view (back of head with ears, tunic/scarf from behind) for A005. Variant sheet docs/screens/T008/4-*.png (top row picked).
2026-10-15 lead: merged T007 (shield block; sim change limited to fighters with a block config; user approved the readable pose, polish parked).
2026-10-15 lead: A003 props approved. Block pose polish deferred (mechanic first, pose must be readable).
2026-10-15 lead: study "What makes our game distinct?" (hooks); private lore appendix to the user only.
2026-10-15 lead: decided the body x colour x weapon kit x gear assembly line; wrote docs/design/lessons.md.
2026-10-15 lead: study "How beat 'em ups are made" (developer lessons); enemy design workspace parked.
2026-10-15 code: user approved T007 round 4 ("that's the best one so far. we're good to go"). Branch `t007-shield-block` ready for the lead to merge.
2026-10-15 code: T007 round 4 (lead: "shield forward, braced"): rig `block` now leans hard into the shield pushed up and out (drawn 1.12x, as if thrust at the viewer), face clear over the rim, sword cocked high; boots flat. Shield fights the art a little (see report), so a star glint now pops on the shield rim after each block (juice `block.glint`, lab Juice sliders).
2026-10-15 code: 7/7 tests. Screens 1, 3, 4 in docs/screens/T007/ replaced (standee pose unchanged, now shows the glint). Art that would help: a face-on/three-quarter shield and a raised-shield arm drawing.
2026-10-14 code: T007 round 3: block pose is now the user's "spartans behind their shield wall": hunched low behind the raised shield, eyes over the rim, sword arm tucked behind it with the point out past the edge; boots flat on the floor (new rig test). Rig screens replaced.
2026-10-14 code: T007 round 2: user likes the block mechanics but not the pose ("drops his sword and leans back"). New rig `block`: leaning into a raised shield (chin height), wide brace, sword cocked over the shoulder; standee leans forward and only jolts back on a blocked hit. Screens replaced. User idea for the lead: a parry later.
2026-10-14 code: T007 on branch `t007-shield-block`: hold L / RB blocks (state `block`, shuffle 0.6, facing locked); frontal hits -> `block` event (chip 0, pushback, 12f blockstun, attacker shoved and its lunge stops), from behind lands. Clang fx, rig `block` pose, standee lean, run log `blocks`, lab "Hero block" sliders. L downloads logs only on game over.
2026-10-14 code: 7/7 tests (new tests/block.test.mjs); bot run identical to main apart from the new `blocks: 0` field. Screens in docs/screens/T007/. Human check open: does blocking feel solid, rats fair?
2026-10-14 lead: merged T006 (belt 400..463, mild zoom; lab Stage sliders). Belt depth to be revisited with stage art (Stage 5). Cast-pose toggle bug folded into T008.
2026-10-14 code: T006 on branch `t006-floor-lane`: user picked framing "B mild zoom" from an in-game F-toggle test (toggle removed): art x -220 y -113 w 1400, floor 30..930 x 400..463 (63 px, under the packet's 85: the open floor in the art is shallow; deeper needed a zoom that cropped the market). Lab has a Stage section (floor + art sliders).
2026-10-14 code: T006 notes: feet at bottom edge slightly overlap the tops of the two front dock posts near x 560-740; fighters look relatively smaller after the zoom. User reported "stuck in cast" = the T005 C toggle (sticky by design; easy to hit by accident, lead's call). Screen in docs/screens/T006/.
2026-10-14 lead: merged T005 (rig 3/4 + swaps; 6/6 tests; sim and moves unchanged). Stage 3 rig work done; follow-ups parked.
2026-10-14 lead: merged A003 harbor props (source). Note: source PNGs are ~1.5 MB each; watch repo size (LFS threshold in decisions).
2026-10-14 lead: user approved A002's look ("I do like it"); T005 started.
2026-10-14 code: T005 human check (user): "a big improvement"; loves the expression swaps. Cast pose is awkward; user thinks it needs a different torso position, same root cause as the horizontal slash2 (art follow-up for the lead).
2026-10-14 code: T005 on branch `t005-rig-3q-swaps`: A002 parts imported (key_green --scale 0.4; A001 files removed), rig re-fit (wider legs, front boot mirrored), part swaps (`swaps` in rig data, `swap` in poses: slash3 windup torso-back, strikes head-shout, hurt/knockdown/down head-hurt), `cast` pose on C. No sim changes.
2026-10-14 code: tests/rig.test.mjs checks swap images/offsets/pose refs and when swaps show; new tools/rig-preview.html pose sheet. Screens in docs/screens/T005/ (no GIF; combo filmstrip instead). User's A002 look check was taken as given by "Do T005".
2026-10-14 lead: merged A002 (source; 18 parts + swaps; scale approximate per HANDOFF). Wrote T005.
2026-10-14 lead: merged T002 (run log; 6/6 test files; sim change is report-only `targetPhase` on `hit`). User to check that L downloads the JSON.
2026-10-14 code: T002 run log on branch `t002-run-log`: src/log/ (runlog.js counts from bus events, store.js keeps 20 runs in localStorage, L downloads JSON), 2-line summary under "Defeated!". Only sim change: `hit` payload gains `targetPhase` (for windups cut).
2026-10-14 code: new tests/runlog.test.mjs (bot 3 min x 3 seeds, log matches events; idle 1-hp run logs 1 knockdown). Screen in docs/screens/T002/. L download not clicked in the browser (needs a human).
2026-10-14 lead: merged T004 (rat windup 34, lunge 1.2; escape test). Art clone had pulled main into the old a001 branch (nothing pushed); guides now say: checkout main first.
2026-10-14 lead: user approved the rig system; switched art to three-quarter view (decision + style contract); wrote A002.
2026-10-14 code: T004 rat telegraph on branch `t004-rat-telegraph`: ratSlash windup 22->34, lunge 2.2->1.2; lab gains rat lunge + depth (fallback RULES.depthHit). New tests/rat-telegraph.test.mjs (dodging after 15 frames clears the lane by 36 px vs 16).
2026-10-14 code: smoke bot still clears waves (kos 33/33/32, hp 68/60/36 vs before 32/32/33, 68/20/52). Lab test now lets a fallback field be absent outside pick sections.
2026-10-14 lead: merged T003 (rig; 4/4 test files pass; move timing/hitboxes unchanged, only the slash2 swoosh shape). Art and code follow-ups from the builder parked below.
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
