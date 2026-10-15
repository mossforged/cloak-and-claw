# A006 — Mouse Fighter guard, turn and bracing swaps

Branch: `a006-mouse-fighter-touchup`. Source delivery; human look review pending.

## Delivered

- Seven separate PNGs: `shield-face`, `arm-back-guard`, `head-brace`, `torso-side`, `torso-back-full`, `head-back`, `arm-front-raised`.
- `review.png`: each A002 predecessor beside its replacement on grey; the arm comparisons include both old segments. Large rough assemblies of guard, cast and rear mid-spin, plus all three at 130 px total silhouette height over Harbor Market. Comparison thumbnails are normalized for inspection, not a scale chart.
- `reference.png`: rough assembled guard on the same green canvas, for the asset contract. It is not a replacement neutral reference.
- `prompt.md`: exact prompts and built-in imagegen settings. `generated/`: untouched tool outputs. `generation-inputs.json`: prompts and source paths. `part-layout.json`: source placement and uniform scale metadata, not runtime pivots.

## Canvas and fit

All seven delivery parts use A002's **1226 × 1283** canvas. Shield height is 433 px, matching A002; it is now nearly circular (428 × 433). Heads match A002's 673 px silhouette width. Both torsos match A002's 458 px total height. The complete guard arm is 300 px tall; the complete raised arm is 390 px tall. Exact placements and sizes are in `part-layout.json`.

The drawings were generated separately, then mechanically keyed, cropped, uniformly scaled and positioned. No anatomical repainting, nonuniform stretching, animation, or game import was performed. Canvas background is exact #00FF00 outside artwork; tiny green antialias remnants may need the normal importer edge cleanup. Sources meet the 1024 px long-side requirement by canvas, as A002 does.

## Known flaws / acceptance gaps

- **Exact joint agreement is approximate, not guaranteed.** Existing A002 parts were themselves estimated fits. These are new drawings, not pixel-aligned edits of a cut-apart rig. Inspect shoulder, neck, wrist and belt overlaps during import. Source canvas placement is provided, not verified runtime pivot data.
- Brace head has visible gritted teeth and lowered brows, but the eyes remain larger/more open and the chin less tucked than requested. Its ear-to-chin height is 474 px versus A002 neutral's 459 px, so the neck anchor needs review.
- The rear head has no facial features or pink inner ears, making the rear turn explicit. Its scarf knot extends below the skull; the rear torso also includes a scarf knot/tails. These overlap in the rough assembly and can read as doubled folds. Hide the old separate scarf-tail when using either torso with built-in tails; assess the head/torso scarf overlap visually.
- Rear torso is square to the viewer with plain belt back and no front buckle. It retains the A002 crossed harness and round gold harness fitting; that detail is similar to A002's old back torso. Most of the new rear readability comes from the head and ear backs.
- Side torso is much narrower with a right-facing profile, but the visible shoulder and strap retain a small amount of three-quarter perspective. Sleeve stubs are built into the torsos; complete arms include sleeves too. Shoulder overlap needs tuning, especially overhead.
- Complete arms replace both upper and lower segments; do not draw the old lower segment alongside them. The raised glove is a closed gripping fist with no weapon attached. Sword placement has only been checked in a static rough assembly.
- Review assemblies are illustrations of part fit, not approved poses: they reuse front-view A002 legs, tail, weapons and arm drawings, including in the back pose. Guard is raised but not deeply crouched. Wrist/grip, sleeve and scarf overlaps still need an in-rig check. At 130 px, cast is shown at the same total silhouette height including its sword, so its body appears smaller.

No requested part is missing. Exact matching scale and attachment geometry remain partially unmet; this is the best source attempt, with gaps disclosed for review. Only this delivery folder and the A006 asset-list row changed.

## Human gate

Do the guard, overhead cast and true back view read clearly as Mouse Fighter in `review.png`? State `source` means delivered, not approved for import or approved in-game.
