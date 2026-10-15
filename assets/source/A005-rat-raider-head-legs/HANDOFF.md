# A005 — Rat Raider head and leg revision

Branch: `a005-rat-raider-head-legs`. State: `source`; human look approval pending.

## Delivered

- `head-neutral.png`, byte-identical alias `head.png`, `head-snarl.png`, `head-hurt.png`: longer tapering muzzle, prominent paired front incisors, lower silhouette, rear-set ears and scruffy cheeks. Brown/cream fur, black nose and star cheek scar retained. Neutral and snarl show both eyes; hurt keeps the squeezed-shut eyes and gritted wince from A004.
- `leg-front-upper.png`, `leg-front-lower.png`, `leg-back-upper.png`, `leg-back-lower.png`: fuller thighs and substantially broader calves, patched olive trousers and brown ankle wraps retained. Four initial leg drawings were rejected after scale fitting; selected width revisions are documented in prompt.md.
- `reference.png`: the actual new neutral head and legs mechanically layered on A004's unchanged torso, arms, scarf tails, tail and cutlass. The separate A004 red bandana tails remain in use; do not replace that part with a head image.
- `review.png`: all three new heads beside A004 heads and the original art-bible rat; all four old/new leg pairs at one common scale; a larger actual-parts assembly; Harbor Market comparison with Mouse Fighter at 130 px and old/new rats at 136 px, including new hurt expression.
- `prompt.md`: built-in imagegen, exact eleven prompts, input roles and mechanical preparation. `part-layout.json`: source-image transforms and estimated joint correspondences, for inspection, not runtime rig pivots.

## Canvas and fitting

Each part and reference uses A004's **1536 × 2304 opaque exact #00FF00 canvas**. The part names match A004. Fit uses uniform scale, rotation and translation; anatomy was generated, not widened in code. Heads use the same transform across expressions. Leg joint centers were estimated from A004's drawings and fitted in place. Measure character silhouette, not the mostly empty canvas, for game scale.

## Known flaws / acceptance gaps

- Joint positions and anatomical agreement are **approximate**, not verified pixel-perfect drop-in pivots. Rounded caps remain visible at the near knee; attachment overlap needs review during import/animation. The existing A004 near elbow gap and shoulder overlap are also visible in the assembly; arms/torso were outside this revision.
- Ears are smaller relative to the elongated head, but the near ear remains fairly round and larger than the requested decisive reduction. The neutral eyes also remain fairly large. The snarl retains canine-like side teeth alongside the requested long front incisors. Human judgment is needed on whether the silhouette now reads sufficiently as a rat.
- The hurt expression preserves the squeezed eyes and gritted wince, but it is a redraw, not the same pixels; the long incisors change the mouth silhouette.
- Calves are markedly fuller and somewhat warmer/oranger than A004; thigh widening is more restrained. Feet are slightly smaller, and their outlines/placement differ modestly despite matching the joint estimates. This does not guarantee unchanged floor contact in animated poses.
- Mechanical green selection can lose fine whisker/edge pixels and leave slight green fringes. Production edge cleanup belongs to import. No ground shadow is included.

No requested file is missing. PNG canvases, unclipped bounds, green corners, neutral alias identity, file scope and review composition were checked. No runtime assets, game code, tools, animation, weapon hold or A004 source files were changed.

## Human gate

Is this the rat you want to fight? Start with review.png, especially the exact-size stage panel and hurt comparison. Source delivery is ready for review; it does not imply approval to import.
