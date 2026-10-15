# A002 — Mouse Fighter three-quarter source rig

Branch: `a002-mouse-fighter-rig-3q`. Source delivery for human look review.

## Delivered

- `reference.png`: assembled neutral reference, facing right toward the camera, both eyes visible, low sword, far elliptical shield, short sturdy legs. 1226 × 1283.
- Fourteen separate PNGs: `head`, `torso`, `scarf-tail`, `tail`, `sword`, `shield`, `arm-front-upper`, `arm-front-lower`, `arm-back-upper`, `arm-back-lower`, `leg-front-upper`, `leg-front-lower`, `leg-back-upper`, `leg-back-lower`.
- `torso-back.png`, `head-neutral.png`, `head-shout.png`, `head-hurt.png`. Neutral is byte-identical to `head.png`.
- `review.png`: all eighteen parts on grey, assembled reference, and reference / current standee side by side at 130 px silhouette height over Harbor Market. Part thumbnail sizes are normalized for inspection.
- `fit-check.png`: every individual part at its delivered placement and scale over a faded reference. These are comparison overlays, not an assembled rig.
- `parts-sheet.png`, `swaps-sheet.png`: original unresampled generated boards; prefer separate PNGs for import.
- `prompt.md`: exact prompts, input roles, tool and preparation method. `part-layout.json`: reproducible extraction boxes, uniform scale factors, and source canvas positions, not runtime pivot data.

## Scale and fit

All individual part PNGs use the reference's 1226 × 1283 canvas. Artwork was isolated mechanically and uniformly resampled against reference anatomy; the generated sheets themselves are NOT at reference scale. No anisotropic stretching or repainting was applied. All image canvases meet the 1024 px long-side minimum; small part content does not individually reach 1024 px.

The exact same-scale acceptance criterion is only approximated, not fully met. The overlay check exposes these differences:

- Head / neutral closely follows the reference ear and face envelope. Shout and hurt match the neutral head's full silhouette width; ear-to-chin height and muzzle contour vary, so swapping can shift the chin. They need anchor review.
- Front and back torso share height; back silhouette and sleeve widths differ. Front torso includes sleeve stubs, and separate upper arms include sleeves too. Overlap must be assessed visually.
- All eight limb pieces are estimated anatomical scale. Thighs, shins, and forearms are slimmer than the reference; isolated limbs have straighter orientations. Their individual positions in the canvas are approximate, and the legs do not exactly reproduce the reference's feet positions. They are not a pixel-aligned cut-apart drawing.
- Sword and shield broadly match reference dimensions. Shield remains an angled ellipse. Tail and scarf-tail use the same anatomical size range but differ in curvature / drape; scarf-tail retains a small knot-like fold.

## Art review

Camera-facing angle, two-eye face, upper-left light, dark outlines, short-legged assembled silhouette, and angled shield are present. No bright blue joint dots remain. Some joint extensions still look like rounded brown caps in isolation; they must be covered to assess whether they disappear in movement. Joint concealment has not been tested in an animated rig.

Sources have opaque green backgrounds. The generated originals contain small green RGB variation; individual canvases outside the extracted artwork are exact #00FF00. Source preparation used a hard color-key selection, which can omit extremely fine whisker / antialias pixels. Production edge cleanup remains with the importer.

No requested image is missing. Exact geometric scale / attachment agreement remains the principal acceptance gap. No rig code, animation, game imports, or edits outside this delivery and A002's asset-list row were made.

## Human gate

Does the camera-facing angle and look in `review.png` match the Mouse Fighter you want to move with? Review the scale / fit gaps above before authorizing import. State `source` means delivered, not approved.
