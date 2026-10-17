# A018 - Rat Raider: base parts, hands and torso views cut from the A017 master (Art)

**Read:** `docs/design/rigs/rat-raider.md` (rig sheet), `docs/design/rig-standard.md` sections 3-6 (near/far names, drawing rules, bands), `assets/source/A017-rat-setup-master/` (`master.png`, `master-back.png`, `head-offset.json`, `HANDOFF.md`), A010's head files (`assets/source/A010-rat-raider-standard/head-*.png`), `tools/bench/stretch-known.js` (what the stretch test found wrong with the old cuts). **Needs:** A017 (merged, G1 passed: "the rat looks great"). **Autonomy:** human-gated after the stretch strip (G2). **Deliver to:** `assets/source/A018-rat-parts/` (LFS; `git lfs version` first).

This is G2 of the rat rebuild: cut the body into the standard parts from the setup-pose master, plus the hand and torso drawings every weapon and move needs. The whole-limb key drawings (kneeling, knee-up, folded, cocked, raised, guard, toe-off feet) come next in A019, **after** Code's stretch strip shows these cuts hold up, so we never stack key drawings on a bad cut again.

## Parts (near/far names; all on the A017 canvas 1536 x 2304, #00FF00, cut from `master.png`)
`pelvis`, `torso`, `head` (A010 `head-neutral` at the A017 offset, unchanged), `arm-near-upper`, `arm-near-lower`, `hand-near`, `arm-far-upper`, `arm-far-lower`, `hand-far`, `leg-near-upper`, `leg-near-lower`, `foot-near`, `leg-far-upper`, `leg-far-lower`, `foot-far`, `tail-1`, `tail-2`, `tail-3`, `scarf-tail`.
- **Trousers:** waistband and seat on `pelvis`; each trouser leg on its thigh, overlapping the pelvis piece.
- **Feet on one floor:** A017's far sole sits ~27 px above the near sole. Cut the feet so both soles rest on **y 1950** (move the far foot part down; record it), no stretching.

## Every joint end is rounded (the stretch test will measure this)
The T024 stretch strip found gaps of 3-15 px on the old cuts at every bend. For **every** child part, the end at its pivot is a near-circle around the pivot, extended across the joint by at least one joint-width, with the outline continuing round it, and the hidden area inpainted: **shoulders** (top of each upper arm, painted under the vest and scarf), **elbows**, **wrists**, **hips** (top of each thigh, painted under the pelvis), **knees**, **ankles**, **neck** (bottom of the head into the collar), tail joints. Bench target: no seam over 2 px at 90 and 150 degrees.

## Swaps in this task (same canvas, same pivot as their part)
| Slot | Drawings |
|---|---|
| hand-near | `fist` (default), `open`, `grip` (side hold, closed round a handle with a hole for the shaft), `grip-overhand` (handle across the fist, seen from the front), `pinch` (arrow nock) |
| hand-far | `fist` (default), `open`, `grip`, `grip-overhand`, `shield` (closed on a strap, seen from the knuckles) |
| torso | `side` (turned side-on), `back` (from `master-back.png`) |
| head | A010's `attack`, `hurt`, `effort`, `ko`, `back` moved by the A017 offset, **unchanged pixels** |

Hands are drawn from the master's fists (cut, then repainted only as far as the grip needs); every grip hand marks its **slot axis** (the direction the handle runs through the fist) in `rig-source.json` `grips`.

## rig-source.json
`canvas`, `master`, `floorY` (1950), `parts` (img, parent, **measured** pivot, band per standard section 6), `swaps` (img, of), `grips` (per grip hand: slot centre + axis), `sockets` (`hand_near`, `hand_far`, `chest`, `head_top`, `feet`, `mouth`, `tail_tip`), near/far names.

## Deliver
- The PNGs above, `rig-source.json`, `review.png` (parts reassembled over the faded master at full size; each hand swap in place; the rat at 136 px over Harbor Market), `prompt.md`, `HANDOFF.md`.

## Acceptance
- Bench fit: master uncovered and parts outside both under ~4% (A010: 2.8% / 3.5%); uniform scale; heads pixel-identical to A010.
- Stretch strip (Code runs it on import): no seam over 2 px at 90/150 degrees; both soles on the floor line.
- Human (after Code's import): does the reassembled rat still look like A017, and does he hold the cutlass, spear and bow?

Out of scope: whole-limb key drawings and toe-off feet (A019), gear and masks (A020), weapons, code.
