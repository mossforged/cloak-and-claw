# A012 — Rat spear, bow, arrow and near pinch

Branch: `a012-rat-spear-bow`. Delivery is source art; human look approval pending.

## Delivered

- `spear.png`: vertical point-up raider spear, chipped iron, long wrapped wooden shaft, red rag. 1024 × 1536.
- `bow.png`: vertical short recurve, belly right, wrapped handle, no string. 1024 × 1536.
- `arrow.png`: horizontal point-right arrow, iron head, ochre/cream fletching with brick-red accents. See `weapons.json` for its exact canvas dimensions.
- `hand-front-pinch.png`: 1536 × 2304 A010 canvas, wrist pivot **[410,1260]**. Original near cuff and lower fingers retained; localized generated thumb/index and hidden palm patch. Pinch contact **[270,1190]**.
- `weapons.json`: measured full-source attachment coordinates, orientations, and review scales.
- `rig-source.json`: small swap extension (`of: "hand-front"`); merge this swap into A010/A011. Its `extends` field documents the base; it does not claim the current importer automatically resolves inheritance.
- `review.png`: gray sheet with all assets, old/new comparison, enlarged held mock-ups, 1× stage review and floor comparison beside A003 cutlass.
- `review-game-size.png`, `review-floor.png`, `reference-spearman.png`, `reference-archer.png`: separate review images. References are transparent oversampled scene canvases, not new character masters.
- `review-points.png`: attachment markers on the full source canvases. `reference.png`: unchanged approved A010 master copied for shared-canvas reference.
- `prompt.md`: exact built-in imagegen prompts and reference paths. `raw-*.png`, `generation.json`, `prepare.py`: provenance and repeatable source preparation. `validation.json`: measured static mock-up transforms and reach checks.

## Import notes for Code

All points in `weapons.json` refer to the **full delivered PNG**, before trimming. Subtract the keyer's trim origin and then apply its uniform import scale to every point. If import scale is `k`, the item rendering `px` corresponding to the review is `reviewScale / k`. Do not copy the old A004 pixel coordinates or old rendering `px` unchanged.

Source pixels → screen pixels in review: spear **0.115**, bow **0.065**, arrow **0.035**. Spear silhouette about 170 px, bow about 95 px, arrow about 68 px long; rat body 136 px. The same scales/drawings are used held and on the floor. No part is stretched. Source arm reach is checked mathematically; the review poses are static source mock-ups, not replacements for runtime poses.

Bow string: draw from `tips[0]` through the pulled `nock` to `tips[1]`. The review pulls 400 source pixels (26 screen pixels) farther left from rest. Near pinch contact is placed on that drawn nock; far grip is centered on the handle. The bow image contains no string.

**Arrow orientation changed by packet:** this source points right. Existing `src/render/rig-grip.js` describes and rotates a point-up arrow. Code must account for the new horizontal art when importing both nocked and flying arrows; this delivery does not edit game code.

## Validation / limitations

- Inspected the source drawings, localized hand composite, gray comparisons, and actual-size Harbor Market mock-ups.
- All four source PNGs meet the long-side resolution minimum and use green backgrounds. Hand canvas/pivot match A010; cuff and lower-finger retained regions are checked pixel-for-pixel.
- Both posed arms reach their attachment targets with unchanged segment lengths; uniform scales only.
- The localized pinch paint has a slight palm transition visible when greatly enlarged. At game size it reads as a curled pinch; judge the near-hand pose in the review and again during Code's draw animation.
- No requested files are missing. Human look approval and runtime motion remain pending. No game files changed.

Human review question: do these weapons look right in the new rats' hands?
