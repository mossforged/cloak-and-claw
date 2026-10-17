# A019 - Rat Raider: whole-limb key drawings and toe-off feet (Art)

**Read:** `docs/design/rigs/rat-raider.md` (library table and pose budget), `docs/design/rig-standard.md` sections 4-5, `assets/source/A018-rat-parts/` (`rig-source.json`, parts, `HANDOFF.md`), `assets/source/A017-rat-setup-master/master.png`. **Needs:** A018 merged (done; the lead's stretch strip: 2 of 28 cells flagged, elbows/knees/hips clean). **Autonomy:** human-gated (judged in the stretch strip and in motion after import). **Deliver to:** `assets/source/A019-rat-key-drawings/` (LFS).

The rat's base parts hold up at every bend. This task adds the drawings rigid parts can't make: the whole-limb key drawings his moves and the flexibility test need. Every one is drawn **on the A018 canvas, on A018's pivots**, from the A017 master's limbs (cut, re-posed, inpainted at the bend), never a fresh limb design.

## Drawings
| File | Replaces (`hide`) | Pose | Pivot (A018) | Used by |
|---|---|---|---|---|
| `arm-near-cocked.png` | arm-near-upper, -lower, hand-near | wound back past 90 degrees: **elbow up and behind the shoulder**, fist level with the ear, knuckles forward (A016's mouse version came out as a raised flexed arm with the elbow low: that's not it) | near shoulder | telegraphs, cutlass and club wind-ups, jump attack |
| `arm-near-raised.png` | same | straight up, fist closed round a handle (carries the item: `itemGrip`, `slotDirection`) | near shoulder | overhead club slam, arms-up |
| `arm-far-raised-back.png` | arm-far-upper, -lower, hand-far | raised to shoulder height and drawn back, elbow behind, fist at the jaw (the bow draw) | far shoulder | archer full draw |
| `arm-far-guard.png` | same | forearm across the chest at shoulder height, fist closed on a shield strap (carries the shield: `itemGrip`) | far shoulder | block, shield bash |
| `leg-near-kneeling.png` | leg-near-upper, -lower, foot-near | kneeling: thigh upright, shin flat on the floor behind, top of the foot down | near hip | get-up, stun |
| `leg-near-kneeup.png` | same | knee raised to hip height, shin hanging, toes down | near hip | jump tuck, dodge hop |
| `leg-far-folded.png` | leg-far-upper, -lower, foot-far | knee fully bent, foot under the hip, sole on the floor (not a squashed boot: the shin must read) | far hip | squat, land, lying, dodge |
| `foot-near-toe.png`, `foot-far-toe.png` | (swap of the foot) | heel raised, weight on the ball, toes bent | ankle | walk push-off, lunge, thrust |

**Fixes to A018 (small, same task):** round the top of `arm-near-upper` further under the vest and scarf, and the top of `leg-far-upper` under the pelvis: the stretch strip's lying pose opened the shoulder 9.3 px and the far hip 3.3 px. Deliver them as replacement `arm-near-upper.png` / `leg-far-upper.png` with unchanged pivots.

## rig-source.json
A fragment with these `swaps` (img, of, hide, itemGrip, slotDirection) and the two replacement parts, near/far names.

## Deliver
The PNGs, the fragment, `review.png` (each drawing in place on the faded A018 rest assembly at full size; then at game size over Harbor Market: telegraph wind-up, overhead slam, full bow draw, shield guard, kneeling get-up, jump tuck, squat, walk push-off), `prompt.md`, `HANDOFF.md`.

## Acceptance
- Pivots exactly A018's; uniform scale; the stretch strip on import shows no new seam over 2 px and the two lying flags gone.
- Human (in motion, after Code imports): does the wind-up look wound back, does the archer draw fully, does the kneel and the squat read?

Out of scope: torso gear and masks (A020), weapons, code.
