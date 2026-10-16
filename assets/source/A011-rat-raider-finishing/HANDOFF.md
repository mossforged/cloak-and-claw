# A011 — Rat Raider finishing set

Branch: `a011-rat-raider-finishing`. State: **source; G4 human look review pending**.

## Delivered

- Archer: `gear-hood.png`, `gear-hood-hurt.png`, `gear-hood-back.png`, `gear-quiver.png`.
- Spearman: `gear-helmet.png`, `gear-helmet-hurt.png`, `gear-helmet-back.png`; `gear-jerkin.png`, `gear-jerkin-side.png`, `gear-jerkin-back.png`.
- Captain: `gear-captain-hat.png`, `gear-captain-hat-hurt.png`, `gear-captain-hat-back.png`; `gear-sash.png`, `gear-sash-side.png`, `gear-sash-back.png`.
- Four details: `detail-eyepatch`, `detail-scar2`, `detail-ear-notch`, `detail-earring`, each with default, `-hurt`, and `-back` PNGs. The rear eyepatch and scar files are intentionally transparent: the face is hidden. Rear ear details remain visible.
- Grey `<part>-mask.png` and `<part>-fur-mask.png` files for every A010 base part and swap. Additional masks cover the recolourable hood, jerkin and sash variants. See `masks.json`; empty black masks explicitly protect parts with no matching material.
- `rig-source.json`: unchanged A010 part geometry and pivots, with 28 overlays. `compatibility.json` selects the correct head/torso overlay variant. `validation.json` records canvas, file, alpha-support and view-map checks.
- `review.png`: plain/archer/spearman/captain beside Mouse Fighter over Harbor Market, the headgear on all six heads, every torso view, six example individuals, all four details on all six heads, isolated gear and grey-mask/tinted examples. `review-game-size.png` is the exact 960 × 540 panel; `review-parts.png` is the isolated-art/mask section.
- Actual source-part assemblies in `reference.png` and `reference-{plain,archer,spearman,captain}.png`. No generated substitute rat is used in reviews.
- `prompt.md`, exact generation records, input crops, fitting/cut records and `prepare.py`. Raw model outputs stay outside the repository.

No requested filename group is missing. Canvas is **1536 × 2304** throughout the import overlays and masks. The A010 body, head R, source floor y=1997, parent joints and depth exceptions are unchanged.

## Attachment and selection

Composite each full overlay canvas at **[0,0]** on the corresponding full A010 parent canvas. Do not center independently trimmed images. Preserve the crop-origin difference when importing. `on` is `head` or `torso`; inherited pivots are the measured A010 pivots. Headgear is band 750, details 740, torso gear 650. The quiver rides the torso but draws behind the figure at band 90.

Use one selected overlay per gear group. Default gear fits neutral, attack, effort and KO; hurt uses its named variant, and rear head uses `-back`. The jerkin and sash each have front, side and rear versions. The quiver is the same rigid rear layer across torso views. `compatibility.json` records the complete mapping, including the default `head` alias.

The manifest intentionally references `../A010-rat-raider-standard/` for its master, 17 parts and 15 swaps. Do not copy or redraw those parts. Its extra `masks` block and `compatibility.json` are handoff metadata; the existing bench reader does not implement tinting or gear selection.

Grey masks use black=protect, white=tint, grey=edge weight. Multiply a tint blend by the mask. Keep luminance/shading when tinting cloth. Use only small fur shifts (the examples use approximately 5% shifts). Base torso cloth masks select the red bandana; the new jerkin is the recolourable vest and has separate masks. Preserve skin, leather equipment and metal. All masks are clipped to their part's alpha.

The plain and captain previews use the **actual A003 floor-item cutlass**, with A010's recorded grip fit. Existing A004 spear/bow art is unchanged and is omitted from the archer/spearman static gear studies. Weapon posing/import remains Code's work.

## Fit checks and limitations

- Static fit was checked on all six heads, all three torso views, and at common game scale: rat body 136 px, Mouse Fighter 130 px. Gear adds height. The six individuals are fixed mock combinations, not a new runtime randomizer.
- **Moving gear has not been validated.** The existing rig bench explicitly lists overlays as “not in motion yet”; it animates the base parts only. G4 moving-gear review needs Code's overlay support. The standard source reader accepts this manifest with no errors or missing standard parts.
- Headgear fit is approximate around ear rims, especially the hurt head's smaller far ear. The hood's lower edge crowds an open mouth more than a bare head does. The low helmet brow intentionally shades part of the eyes. The captain hat partly obscures ears.
- Jerkin cuts, buckles and quilting vary between view drawings. Original harness, pouch, fur hems and small belt/shoulder edges can remain visible. The side sash is a uniformly fitted drawing rather than a perfect new perspective; a little of the underlying belt can peek through. These are art-fit limits, not requests to deform the body in code.
- The **ear-notch is a dark healed tear/fold marking**. It does not remove pixels from the underlying ear silhouette. Scar2 and the notch are deliberately small and subtle at 136 px; tint and major gear carry most crowd differentiation.
- Masks follow selected painted material pixels rather than a vector material separation. A few cloth highlights, stitches and mixed fur/clothing boundary pixels may retain the original hue. They are intended for the restrained sample palettes, not extreme hue inversion.
- Two initial hurt gear attempts stacked multiple pieces and were rejected. Only the replacement helmet/hat paintings are delivered. The rear hood's accidentally painted ears were cut out so the original A010 ears remain; the front jerkin's painted dark armhole interior was cut to expose the original shoulder.

No runtime art, game code, tests, tools, style contracts or status documents were changed.

## Review question

Are these the rats you want to fight, and does the six-rat crowd look varied enough? Please judge `review-game-size.png` first, then the enlarged fits in `review.png`.
