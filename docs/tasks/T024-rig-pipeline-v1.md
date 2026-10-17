# T024 - Rig pipeline v1: near/far names, floor-line rule, stretch test, sockets (Code)

**Modules:** `tools/rig_from_source.py`, `tools/rig-bench.html` + `tools/bench/`, `src/render/rig*.js`, `src/data/rigs/*` (names + pose files), `tests/`. **Read:** `docs/studies/2026-10-17-rig-art-inventory.md` sections 4, 5, 8; `docs/design/rig-standard.md` (updated 2026-10-17); `docs/design/rigs/mouse-fighter.md`; `src/render/CONTRACT.md`. **Needs:** T023 merged. **Autonomy:** auto-ok for the rename and the bench (objective: tests + strip); human-gated for the floor-line change (user looks at walk / knockdown / slash3 feet in game).

The study found half our art rounds were runtime problems: feet off the floor line, no automatic test of a rig's limits, and a naming ambiguity (`foot-back` = far, read as trailing) that turned the wrong foot. This task fixes those three and declares the sockets effects will attach to.

## Do
1. **Rename parts to near/far.** `arm-front-*` -> `arm-near-*`, `hand-front` -> `hand-near`, `*-back-*` (limbs, hands, feet) -> `*-far-*`. Head/torso `back` swaps keep their name (`back` = the back view). The importer accepts both spellings from `rig-source.json` (A013 and A016 use the old ones) and writes the new ones; pose files, swaps, grips, bands and tests use the new names only. Rig standard section 3 is the reference.
2. **Floor-line rule.** In every grounded state the leg IK targets clamp to the fighter's floor line (`y = 0` in fighter space); a pose may lift a foot only by naming it (`lift: { 'foot-near': px }`). Knockdown lying and slash3 strike no longer float 5 px (parked bug). Foot-tip rotation is its own channel, keyed separately from the IK target. Bot runs unchanged (render only).
3. **Stretch test** on the rig bench (`?src=<ID>&stretch`): one exported JPG strip that poses the rig at its limits: each knee and elbow at 90 and 150 degrees; arm straight up; each torso view; each foot and hand alternate; each hand holding each item the body can hold at overhand, underhand and reverse (via T025's grip modes when they land; until then the current grip); a crouch and a lying pose with the **floor line drawn**; the rig at 0.96x, 1.04x, 1.4x. Flag in the strip: any seam gap over 2 px at a joint, any foot below the floor line, any hidden far hand on a two-hander. The strip is the G2 artefact in the standard; `npm test` runs it headless for the mouse and the rat and fails on a flagged seam or floating foot.
4. **Sockets.** Every rig declares `sockets`: `hand_near`, `hand_far`, `weapon_tip` (from the held item's tip), `chest`, `head_top`, `feet`, `mouth`, `tail_tip`; the importer derives defaults from part pivots; effects and the potion/arrow code use them instead of per-character points.
5. **Import A016** when it lands (six swaps; `hide` lists for the whole-limb drawings) and wire the pose-budget states that waited on them: walk push-off (toe-off feet), jump squat / land (folded far leg), grab knee and jump tuck (knee-up), get-up / revive / downed (kneeling), slash3 and club wind-ups (cocked arm), lying (folded legs). If A016 is not merged yet, do 1-4 and leave 5 for an addendum.

## Acceptance
- Headless: all tests pass; stretch strips for mouse and rat produced with zero flags (or flags listed in the report with the art fix each needs); bot run numbers identical to main; rename leaves every pose byte-for-byte equivalent (a test loads old and new names and compares).
- Windowed: `docs/screens/T024/` stretch strips (mouse, rat), walk filmstrip with feet on the floor line, knockdown lying with the floor line.
- Human: walk, land, knockdown: are the feet planted? (And with A016: does the walk push off, does the squat read?)

Out of scope: weapon node / hand-follows-weapon (T025), tail springs, meshes, gear.
