# T033: A024 limb repairs imported (4 of 9) — before / after

Pass bar: `pass-bar-before.md` (47 / 73) -> `pass-bar-after.md` (**49 / 73**). Exposure list (rat family, worst frame per
piece): `exposure-list-before.md` -> `exposure-list-after.md` (unchanged: every piece's worst frame comes from a drawing held
back, see below). Wrist test (`tests/wrist.test.mjs`): passes before and after. `npm test` 41 / 41.

## How it was decided
Each of A024's nine changed drawings was imported **alone** (same importer, an A024 fragment merged after A023; points from
the importer) and the exposure and seam known lists rerun. A drawing that raised any flag was held back; the four that only
lowered flags (or left them as they were) are imported. Known lists were regenerated only where a number went down
(one +0.2 px² on the archer's scarf in the walk across, 18.8 -> 19, kept at the old 18.8: within the test's tolerance).

## Imported
| Drawing | What it changed |
|---|---|
| `arm-near-raised` | raised shoulder: raider 151.8 -> 118.3 px² (rally 151.8 -> 105.8, cast 125.5 -> 118.3); spearman cast 124 -> 0 (worst left 4.5, grabbed); archer cast 49.8 -> 0 (worst left 25, knockdown). **Spearman cast and archer cast now pass the bar.** |
| `hand-near-grip-overhand` | wrist fur under the bracer: the cuff gap at the as-drawn angle is closed (`wrist-overhand.jpg`, in-limit range 45-135); spearman wrist seam (staff swing) 12.5 px -> gone. The new fur shows as a tuft beside the fist at 90 and 135 (look for the user). |
| `arm-far-upper-back` | no flag moved (finished top for the back view) |
| `scarf-tail` | root as cloth: rehearsal spin 158 -> 157.5 px² (no real change); archer walk across 18.8 -> 19 |

## Held back (A023 round 5 cuts kept), with what each did when imported alone
| Drawing | Better | Worse |
|---|---|---|
| `foot-far` (narrowed tab) | knockdown 54.5 gone | **walk (in place / across) @7: new 59.3 px² + 4 px cut** (bar clip; the shorter top shows in the crotch gap), spin rehearsal new 27.3, cut 5 -> 6 (held @2) |
| `leg-far-upper` | — | new knee flags (walk @14 5.5-5.8 px², bar clip; dodge roll 9; staff swing 10; kneed 8), thigh top: raider spin 17.8 -> 20.3, forward throw 20.5 -> 25.3, spearman staffOverhead 9.5 -> 15 |
| `arm-far-upper` | raider far shoulder 9.3 and cut 5.3 gone | spearman staffOverhead 35.5 -> 39.8 (cut 4.5 -> 5.9); seams torso / far upper arm: raider 4.5 -> 11.5 (falls, held), spearman 8.5 -> 11.5, archer new 12.5 (bow shot); spearman elbow 5.5 -> 7 |
| `arm-near-upper` | daggerStab side chest 33.3 gone | new elbow flags (jumpUp 6.5, lying face-down 5.8); archer near shoulder 49.8 -> 53.3; spearman new cut 4.2 (turn); archer turn elbow seam 10.5 -> 15.8 |
| `arm-near-upper-back` | spearman B view 13.8 -> 13 | **archer B view: new 88.5 px² at the elbow** + 4.9 px cut; raider rehearsal new 5.8 |

`arm-far-lower`: byte-identical to A022 (Art's handoff), nothing to import; its cuff cut (4.2, archer bowShot) stays.

## T029 r3 flags: cleared / left
- Cleared: spearman cast shoulder (124), archer cast shoulder (49.8), spearman staff-swing wrist seam (12.5), near overhand cuff gap (wrist sheet).
- Lower but left: raider rally / cast shoulder (151.8 / 125.5 -> 105.8 / 118.3).
- Left (drawing held back): overhead chop near shoulder 204 (`arm-near-upper`), staffOverhead far shoulder 35.5 (`arm-far-upper`), knockdown far foot 54.5 (`foot-far`), forward-throw thigh top 20.5 and cut 6.7 (`leg-far-upper`) (the r2 dodge-roll back arm 29.8 was already gone before this import), spin scarf ~158 and dodge-roll scarf 24 (imported, unchanged), `arm-far-lower` cut 4.2.

## Images
- `wrist-overhand.jpg`: the near overhand fist turned 45 / 90 / 135 on its forearm (its in-limit range), A023 above, A024 below.
- `shoulders.jpg`: spearman cast, every key, exposure check overlay (red = unfinished paint): A023 above (124 px² at @8), A024 below (none).
