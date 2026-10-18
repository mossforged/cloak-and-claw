# A023 Round 2 — Rat repairs

Branch: `a023-r2-rat-repairs`. Source delivery only; **do not merge automatically**. Built from main `0664c16` after pulling. Earlier A018/A019/A022 source folders are untouched.

## Round 2 items 1–9

1. Extended both default thighs and all three whole-leg keys with hidden native cloth. Default thigh extensions are clipped beneath the resting torso/belt to avoid exposed cloth patches. Every torso and pelvis view has a deeper waist overlap; minimum central neutral overlap across all 28 combinations is 96 source px (requirement 40). `review-hips` isolates -30/0/+60 degree thigh rotations. This is a source joint proof, not a complete posed move.
2. Front seat now continues into native upper-thigh material instead of a horizontal cropped edge. Back seat and rear thighs are cut from the same back drawing.
3. Both shoulder caps are simplified fur/leather joint covers, with no duplicate metal trim or button row. The torso owns its baked pauldron. Show the cap only when the swung upper arm needs it; otherwise keep it hidden.
4. Replaced `torso-away`; near shoulder attaches at the left/back edge and the wind-up arm is behind the body. Added all six requested back leg/foot cuts, plus rear upper/lower arms and hands for both sides. `torso-back` and `pelvis-back` use the matching back reference. Feet show heels toward camera. `review-back` compares the actual assembled BQ/B cuts with A017's back reference. Back head is still the inherited, unchanged head-back.
5. The packet's `tools/bench/pose-seams-known.js` and pose-seam phone sheets are absent from this pulled main; no additional lead-listed joint list is present. No runtime tests or code were modified. Full T026/T028/T029 rehearsal is still required.
6. Five split grip pairs: solid knuckle-side near side/overhand; existing near pinch split; new palm-side far grip; accepted far overhand split. Every pair includes `<name>-under`, same original hand pivot, handle centre/direction and layer order in `grips`. `review-grips` shows actual under → handle → face sandwiches. There is no shaft slot cut through either near grip back. Near grip edits start with the native-master fist, not a text-only generated hand.
7. Added `belt.png`, a separate actual-master belt/buckle cut, child of pelvis at `(774,1460)`, band 640 above torso 600. Keep it pelvis-bound when the torso leans. The B view already has a rear belt on its seat: use that, not a front buckle over the back.
8. Extended all seven flat/toe/heel/out feet and both rear feet. Tops are at or above y1680, at least 65 source px above the shared y1745 knee/hem reference. Existing foot extensions are 80–142 px beyond their old upper bounds. Shin bands are above feet in all views.
9. Repaired only the embedded fist regions of `arm-near-cocked`, `arm-near-raised` (back of glove/knuckles) and `arm-far-raised-back` (palm). Forearm/upper-arm paint outside the wrist masks remains inherited, apart from replacing striped hidden near-shoulder extension material with native fur. `arm-near-mouth`, `arm-far-guard`, `arm-far-raised` are untouched.

## Import notes

Merge this fragment after A018, A019, A022 and A023 round 1. Honor every entry's `source` path. New/repaired files are all in A023, on the unchanged 1536 × 2304 canvas and inherited pivots. No earlier source files or runtime files were changed.

- `viewSwaps.B` selects all twelve rear limb cuts. **`viewJointPositions.B` records their anatomical rear setup positions**, used by the proof, while each image's pivot stays the inherited part pivot. Pose/attach these positions before rehearsing B; using Q lower-limb offsets will misalign the rear cuts. The maps are source metadata for Code to import, not implemented runtime behavior.
- `grips[name].order` is `[under, held-item, face]`. The under image shares the hand pivot and must move with the same hand transform. It is not another independently posed hand. Do not put a weapon over a solid near-hand back.
- `belt` is a normal `parts` entry. B uses its native rear belt; other views use the separate cover. Avoid drawing the buckle twice. Caps hide when the torso itself closes the shoulder.
- Whole-arm swaps retain inherited `hide`, `itemGrip`, `slotDirection` and joint metadata. Embedded grip positions must be checked with actual cutlass/club/bow art in the viewer.

## Files and reviews

52 repaired/added cut PNGs (inventory below), updated `rig-source.json`, exact built-in imagegen prompts in `prompt.md`, all-source inventory `review.png`, readable `review-summary.png`, `review-back`, `review-grips`/`review-hands`, `review-hips`, `review-waist`, `review-arms`, `review-feet`, `review-rest`, `review-views`, `views.png`, `turn.png`. Existing untouched round-1 assets and `reference.png` remain in the kit. Every review image has a quality-82 JPG copy in `docs/screens/A023/`, longest side <=2000; the readable entry is `review-summary.jpg`.

## Validation and limitations

All 52 cuts pass same-canvas, unchanged-pivot and single 8-connected foreground component checks after green keying. Source backgrounds are normalized to exact #00FF00. Neutral waist overlap and foot-top measurements are source checks; they do not establish every motion frame or every extreme lean.

Rest paint comparison: strong RGB differences (>40 in any channel) inside the eroded master silhouette are 2.6681%; 14,989 rest pixels change from the preceding assembled sources. `review-rest` shows master, before and after. This is not a pixel-identical-master claim.

**Visible-paint preservation is not complete for the new back/away views and shoulder covers:** imagegen repainted those reference-guided surfaces. Hand edits also repaint the intended finger/glove regions. Rear cuts have straight hidden cut edges and must remain overlapped. Foot tongues and near-shoulder extensions contain stretched native material intended only under covers; they may expose unattractive paint at unsupported rotations. BQ's inherited ankle edge, wrist joins in the raised keys, cap transitions, seat transitions and all actual weapon holds still need the phone viewer and full move rehearsal. No G3/human acceptance or zero-runtime-seam claim is made. Nothing in the round-2 drawing inventory is intentionally omitted; runtime verification from item 5 remains open.

## Repaired/added image inventory

- `leg-near-upper.png`
- `leg-far-upper.png`
- `leg-near-kneeling.png`
- `leg-near-kneeup.png`
- `leg-far-folded.png`
- `foot-near.png`
- `foot-far.png`
- `foot-near-toe.png`
- `foot-far-toe.png`
- `foot-near-heel.png`
- `foot-far-heel.png`
- `foot-near-out.png`
- `torso.png`
- `torso-side.png`
- `torso-back.png`
- `torso-front.png`
- `torso-hunched.png`
- `torso-lean-back.png`
- `pelvis.png`
- `pelvis-side.png`
- `pelvis-front.png`
- `pelvis-back.png`
- `belt.png`
- `shoulder-near.png`
- `shoulder-far.png`
- `leg-near-upper-back.png`
- `leg-far-upper-back.png`
- `leg-near-lower-back.png`
- `leg-far-lower-back.png`
- `foot-near-back.png`
- `foot-far-back.png`
- `arm-near-upper-back.png`
- `arm-near-lower-back.png`
- `hand-near-back.png`
- `arm-far-upper-back.png`
- `arm-far-lower-back.png`
- `hand-far-back.png`
- `torso-away.png`
- `hand-near-grip.png`
- `hand-near-grip-overhand.png`
- `hand-far-grip.png`
- `hand-near-grip-under.png`
- `hand-near-grip-overhand-under.png`
- `hand-near-pinch.png`
- `hand-near-pinch-under.png`
- `hand-far-grip-under.png`
- `hand-far-grip-overhand.png`
- `hand-far-grip-overhand-under.png`
- `arm-near-cocked.png`
- `arm-near-raised.png`
- `arm-far-raised-back.png`
- `arm-near-upper.png`
