# A016 - Mouse Fighter: the six missing key drawings (Art)

**Read:** `docs/design/rigs/mouse-fighter.md` (the rig sheet: this packet fills its "ordered: A016" rows), `docs/design/rig-standard.md` sections 4-6, `assets/source/A013-mouse-fighter-standard/` (`reference.png`, `rig-source.json`, the existing part and swap images, `HANDOFF.md`), `docs/studies/2026-10-17-rig-art-inventory.md` section 3a. **Needs:** A013 merged (done). **Autonomy:** human-gated (the user judges them in the stretch strip and in motion).
**Deliver to:** `assets/source/A016-mouse-key-drawings/` (source images go through Git LFS automatically; run `git lfs version` first, see AGENTS.md).

The study found the Mouse Fighter is short exactly six whole-limb drawings, each used by a dozen states (walk push-off, jump squat, landing, get-up, grab knee, every heavy wind-up). This packet adds them. **Same character, same canvas, same pivots: these are swaps of existing parts, cut and inpainted from the A013 master, never a fresh generation of a limb.**

## Drawings (all on the A013 canvas 1536 x 2304, #00FF00, same light, same outline weight)

| File | Swap of | What it shows | Pivot |
|---|---|---|---|
| `foot-front-toe.png` (near foot, toe-off) | `foot-front` | heel lifted, weight on the ball of the foot, toes bent, sole visible under the heel | the ankle point of `foot-front` |
| `foot-back-toe.png` (far foot, toe-off) | `foot-back` | same for the far foot | the ankle point of `foot-back` |
| `leg-back-folded.png` (whole far leg) | replaces `leg-back-upper` + `leg-back-lower` + `foot-back` as one drawing (`hide` the three) | knee fully bent, shin tucked under the thigh, foot flat under the hip; as in a deep squat or lying on the side | the hip point of `leg-back-upper` |
| `leg-front-kneeup.png` (whole near leg) | replaces `leg-front-upper` + `leg-front-lower` + `foot-front` | knee raised to hip height, shin hanging, foot pointing down: the grab knee and the jump tuck | the hip point of `leg-front-upper` |
| `leg-front-kneeling.png` (whole near leg) | replaces the same three | kneeling: thigh upright, shin flat on the floor, top of the foot down; the get-up and the revive | the hip point of `leg-front-upper` |
| `arm-front-cocked.png` (whole near arm) | replaces `arm-front-upper` + `arm-front-lower` + `hand-front`, carries the sword (as `arm-front-raised` does) | wound back past 90 degrees: elbow high and behind, fist by the ear, blade pointing up-back; the top of a big overhead or slash3 wind-up | the shoulder point of `arm-front-upper` |

Rules: cut from the master where the master has the part; inpaint only what's hidden or bent (the bent knee, the raised heel), one joint-width past the visible edge; rounded joint ends; nothing drawn from scratch. Whole-limb drawings carry `hide` lists and, for the arm, `itemGrip` / `slotDirection` like `arm-front-raised` in A013's `rig-source.json`.

## Deliver
- The six PNGs; `rig-source.json` fragment (`swaps` entries only, measured pivots, `hide` lists) that merges into A013's.
- `review.png`: each drawing in place on the faded master (the rest of the rig at rest) at full size, and the six poses they enable at game size (130 px) over Harbor Market: walk push-off, jump squat, grab knee, kneeling get-up, slash3 wind-up, lying.
- `prompt.md`, `HANDOFF.md`.

## Acceptance
- Bench: each swap drops in on its pivot with no scale fudge (Code checks when importing).
- Human: in the stretch strip and in motion (T024/T025): does the walk push off, does the squat and landing read, does the kneel and the knee read, does the wind-up look wound?

Out of scope: polish drawings (overhand grip, palms, pinch, hunched torso, smears), gear, masks, code.
