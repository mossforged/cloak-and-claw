# A028 — v3 rat three-quarter swap kit, best attempt

Branch: `a028-rat-v3-kit`. **`importReady: false`.** All requested drawings and reviews are saved. The three original body faults are repaired: the complete 17-joint body checker passes. The swap checker passes 22 of 26 whole drawings; two wrist notches remain, and two open-jaw exterior concavities remain flagged. This is source delivery, not a claim that the complete kit passes the no-gap/no-jump gate.

## Delivery

`assets/source/A028-rat-v3-kit/`: 20 hand PNG layers (including five front/under pairs), six expression heads, five foot swaps; three body repair PNGs (`arm-near-upper`, `torso`, `leg-far-lower`); full 21-part base rig plus `swaps` in `rig-source.json`; `reference.png`; `review.png`/`review.jpg`; `swaps.jpg` and `swaps-2..4.jpg`; seven `swaps-fullsize-*.jpg`; `grips.jpg`; three five-sample sweep JPGs; `joint-check.jpg`/JSON; `joint-check-swaps.jpg`; `swaps-joint-check.json`; `swap-fit.json`; `self-check.json`; exact prompts in `prompt.md`; this handoff. Every review has a quality-80 phone JPEG in `docs/screens/A028/`, longest side <=2000. The full-size source comparison sheets are 1:1 source pixels; phone copies are reduced.

All part PNGs are RGB 1536x2304, exact green background, master placement. All user points and limits from `rat-v3-joints-v4.json` are unchanged. Every swap declares its base part, same canvas/pivot and zero offset. A shared numerical point alone does not certify a matched silhouette. `parts` contains the assembled base rig; `swaps` contains alternatives, never simultaneous body pieces. The three A028 repairs replace the corresponding A026/A027 pieces via this manifest. Historical sources were not overwritten.

Split pairs: near/far grip and overhand, plus near pinch. The `-under` owns cuff and palm behind the item; the named face owns foreground fingers. Compose both at the same pivot. Foreground-only pieces intentionally have no cuff. Near overhand uses the right finger stack as its foreground mask. `items` and provisional source-coordinate `handleLine` fields identify supported holds. Cyan handle lines appear on the complete grips and their under layers in `grips.jpg`; these are Art's proposals for the user's redrawing, not user-approved grip lines. Far shield is a strapped round-shield hand.

## Each swap at rest and through its joint

The compact sheets show base/swap at identical scale, the rat at 136px, and base/swap/base/swap strips around a fixed crosshair. The full-size sheets show the entire assembled rat at 1:1 source pixels. No compensating pose offsets were used. Slight cuff/rim contour and head-fur changes remain visible in the strips; exact no-jump fit is not certified.

| Swap PNG(s) | Rest fit / drawing | Nine-sample joint check |
| --- | --- | --- |
| `hand-near-open` | Seated on the accepted wrist; longer spread fingers intentional. Soft cuff transition remains. | Pass -49..9 |
| `hand-near-palm` | Same point; open palm faces camera. Cuff silhouette differs slightly from fist. | Pass -49..9 |
| `hand-near-back` | Correct opposite showing side: exposed knuckles/thumbnail left, glove panel right. Final cuff is rounder than base. | Pass -49..9 |
| `hand-near-cup` | Cuff contacts at rest; cupped fingers/thumb face up. Rounder crown than base. | **Fail: 264px notch at -34.5** |
| `hand-near-point` | Index extends right; glove/palm is wider than the neutral fist, fitted on the same wrist. | **Fail: 317px notch at -12.75** |
| `hand-near-pinch` + `hand-near-pinch-under` | Exact pixel-aligned pair; thumb/index loop, vertical item axis. | Pass -49..9 (pair) |
| `hand-near-grip` + `hand-near-grip-under` | Exact pair on same wrist; vertical shaft line through closed fingers. | Pass -49..9 (pair) |
| `hand-near-grip-overhand` + `hand-near-grip-overhand-under` | Horizontal grip, thumb above vertically stacked right knuckles; short cuff overlaps the upper thumb area and should be refined. | Pass -49..9 (pair) |
| `hand-far-open` | Shared far wrist; open fingers spread toward camera. | Pass 0..59 |
| `hand-far-palm` | Shared wrist; open palm, slightly broader cuff transition. | Pass 0..59 |
| `hand-far-back` | Closed back-of-hand orientation; same point and no translation. | Pass 0..59 |
| `hand-far-cup` | Supinated cupped palm; cuff follows hand, broader thumb spread intentional. | Pass 0..59 |
| `hand-far-grip` + `hand-far-grip-under` | Exact pair, palm behind item/fingers in front; vertical handle axis. | Pass 0..59 (pair) |
| `hand-far-grip-overhand` + `hand-far-grip-overhand-under` | Exact pair; curled knuckles under horizontal handle axis. | Pass 0..59 (pair) |
| `hand-far-shield` | Same wrist; cuff is longer/more tapered than base. Strap hand, not shaft grip. | Pass 0..59 |
| `head-attack` | Open snarl, accepted neck blended at same point. Ear/fur contours vary slightly. Neck stays seated. | **Flag: 400px jaw/shoulder concavity at -20** |
| `head-effort` | Gritted teeth; same neck point, slight skull/fur contour variation. | Pass -20..61 |
| `head-hurt` | Eyes squeezed closed/grimace; same neck point and collar contact. | Pass -20..61 |
| `head-ko` | Closed drooping eyes/slack mouth; same neck point. | Pass -20..61 |
| `head-shout` | Wide open mouth; same neck point, collar stays in contact. | **Flag: 284px jaw/far-arm concavity at +30.63** |
| `head-drink` | Upturned muzzle, eyes closed; same neck point. Small blended neutral-neck fur patch remains visible. | Pass -20..61 |
| `foot-near-heel` | Heel-strike design with raised toes; wrap retained around ankle, rim slightly rounder. | Pass -1..40 |
| `foot-near-toe` | Toe-contact orientation; wrap turns with foot, slightly narrower rim. | Pass -1..40 |
| `foot-near-out` | Turned-out forefoot, wider exposed claws; same ankle. | Pass -1..40 |
| `foot-far-heel` | Raised toes; joint is fixed but upper wrap is narrower/taller than base. Visible rest contour change. | Pass -19..40 |
| `foot-far-toe` | Toe-contact foot; shared ankle, narrower/taller wrap than base. Visible rest contour change. | Pass -19..40 |

## Sweeps

Five samples per requested example, with detail crops and 136px whole rat:

- `sweep-wrist-near.jpg`, near open hand: -49, -34.5, -20, -5.5, +9.
- `sweep-neck.jpg`, attack head: -20, +0.25, +20.5, +40.75, +61. Neck contact persists; the jaw/shoulder flag at -20 remains visible and is retained in the supplemental checker sheet.
- `sweep-ankle-far.jpg`, far toe foot: -19, -4.25, +10.5, +25.25, +40. Closed overlap persists, although its wrap silhouette differs at rest.

The Node checker separately checks every whole swap at nine samples, including the four flagged cases. Sweeps are sampled source assemblies, not an in-game animation certification.

## Joint checker and three original fixes

Run exactly:

`node tools/joint-check.mjs assets/source/A028-rat-v3-kit/rig-source.json --joints docs/design/rigs/rat-v3-joints-v4.json`

Final result: **exit 0, all 17 base joints pass, no PNG islands.** `joint-check.jpg` and its phone copy show the complete result. No checker code, threshold, point or range was changed.

- Near shoulder: generated upper-arm repair and baked finished torso fur extend the hidden shoulder/cheek support. The original -116/-93/+21 gap and -47/-25 seam flags clear. Final peak gap is 0.49 of threshold and seam 0.87. Intermediate support introduced a cheek notch; the final upper fur support closes it and the neutral neck passes again.
- Waist: the new lower torso has continuous cream belly paint rather than the second outline under the belt. -4..15 passes, including +15; seam peak 0.88 of threshold.
- Far ankle: widened/extended closed shin dome supplies coral skin under the rotating wrap. -19..40 passes, including +40; gap peak 0.88 of threshold.

Whole-swap results are separate in `swaps-joint-check.json` because the existing checker reads base `parts`, not the `swaps` table. Each alternative was substituted into a temporary complete rig; split pairs were composited first. **22/26 pass; four remain flagged.** `joint-check-swaps.jpg` shows all four actual flagged crops.

Cup and point wrist notches are **unacceptable remaining geometry faults**. Tool retries rounded the cuff and reduced the flags (cup 278 ->264, point 336 ->317) but did not remove them. I did not hide these by changing range or checker settings.

Attack and shout flags are **acceptable as intentional exterior jaw/shoulder negative space in my visual judgment**, not loss of neck contact: attack's flagged box is x940..994,y1148..1159 at -20, beside the open lower jaw above the far shoulder; shout's is x1015..1041,y1217..1247 at +30.63, beside the jaw and far arm. Both are far from the neck pivot, and the closed neck remains on the collar. The unmodified checker still fails them, so their flags and review crops remain explicit. This judgment does not make the entire delivery import-ready.

## Left / runner handoff

Finish the near cup and point's cuff-to-palm contours through their flagged angles. Refine near overhand's cuff/thumb overlap, far-foot wrap rest silhouettes, small cuff transitions and the drink neck blend. These are art finish/fit issues; no new runtime workaround or user point change is proposed. Full no-jump/no-gap certification is not achieved; `importReady` stays false under the packet's best-attempt rule. Nothing else requested is omitted. No user-only question blocks the next art repair.

Correct folder verified. Runner's branch retained; `git merge main` reported already up to date. Git LFS 3.8.0 available. Only A028 source, its phone review folder and its asset-table row were changed. No code, tools, tests, imported art or other docs changed. Work saved. Initial staging succeeded and Git LFS listed all new part PNGs. The final re-stage and commit were blocked by sandbox permission to create `.git/index.lock` (`Operation not permitted`, exit 128). No commit was created for this delivery. The runner must add the final working files, commit them and push, as authorized by the unattended fallback. The branch was not switched and no push was attempted.
