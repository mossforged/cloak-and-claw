# A008 — Rat Raider gear layers

Branch: `a008-rat-gear-layers`. State: `source`. Human look approval pending.

## Delivered

Eight transparent RGBA overlays on the A004/A005 **1536 × 2304** canvas: hood, hood-back, quiver; helmet, jerkin, jerkin-back; captain hat and sash. All requested filenames are present. Headgear uses the same file and placement on neutral, snarl and hurt; no expression-specific variant is needed for this static fit.

`review.png` includes all eight pieces on grey, large assembled plain/archer/spearman/captain looks, back-torso fit studies, all nine headgear/expression combinations, and a Harbor Market panel. `review-game-size.png` is the unscaled 960 × 540 stage panel: rat body 136 px, Mouse Fighter 130 px. All rat bodies share one scale; gear adds height rather than shrinking the wearer. Weapons are omitted to judge gear silhouettes alone.

`reference.png` / `reference-plain.png`, `reference-archer.png`, `reference-spearman.png`, `reference-captain.png` are actual source-part composites, not generated stand-ins. `fit-hood-back.png` and `fit-jerkin-back.png` show the back overlays on A004 torso-back. `prompt.md` contains all nine exact built-in imagegen prompts, reference roles and preparation notes; generation-input JSON files retain the eight initial requests.

## Attachment and offsets

**Do not center trimmed gear independently.** Full canvases already align: overlay source origin `[0,0]` on the corresponding A004 torso / torso-back or A005 head source origin `[0,0]`. Use the parent's transform. These are descriptive source coordinates, not runtime pivots.

`part-layout.json` records uniform source scale, translation, full alpha bounds, visible bounds measured at alpha >= 16, parent and crop offsets. Original parent visible-bound origins: A005 neutral head `[590,818]`; A004 torso `[554,1097]`; A004 torso-back `[580,1097]`. Table offsets below locate each alpha-16 cropped overlay relative to that parent origin. Recompute if import uses different cropping. Preserve absolute canvas alignment across expressions; do not re-center around each expression's silhouette.

| File | Parent | Crop offset x,y |
|---|---|---|
| `gear-hood.png` | head | `[-3, -4]` |
| `gear-helmet.png` | head | `[49, -8]` |
| `gear-captain-hat.png` | head | `[-38, -150]` |
| `gear-hood-back.png` | torso-back | `[-4, -283]` |
| `gear-quiver.png` | torso | `[-197, -29]` |
| `gear-jerkin.png` | torso | `[-1, 13]` |
| `gear-jerkin-back.png` | torso-back | `[-3, 2]` |
| `gear-sash.png` | torso | `[-33, 319]` |

Draw quiver behind torso/arms/head, attached to torso; its arrows and left side remain visible. Draw front jerkin / sash over torso but under arms and head. Draw hood / helmet / captain hat over head. Hood-back includes a raised hood and shoulder cowl; it is positioned against torso-back, as requested, and is not an additional layer to combine with the front hood.

## Known flaws / acceptance gaps

- Hood ear slits expose both ears. Helmet and tricorn obscure too much of the far ear; tricorn also covers much of the near ear. The ears-out requirement is therefore only partly met on those two pieces. Both eyes / hurt expression remain readable.
- Hood lower face rim crowds the incisors and the open snarl's lower edge. It works as one shared piece in the static expression strip, but may need refinement in animation.
- Torso fitting is approximate: underlying tunic hems, pouch and small shoulder edges remain visible. Front/back leather colours and quilting differ modestly. The back hood has no A005 rear-head counterpart to validate against; its fit check shows the requested torso-back only. No pixel-perfect moving-joint fit is claimed.
- Original A004 near elbow separation, rounded joint ends and shoulder overlap remain in these assemblies. This task does not revise bodies or arms.
- Generated alpha is preserved, including faint stray/edge pixels; visible-bound measurements are provided because full nonzero-alpha bounds can extend beyond the apparent silhouette. Existing keyed review parts may show slight green fringes. No ground shadow is baked into gear.
- Same-scale game panel gives captain extra height from the feather and hood extra neck bulk. Their silhouettes differ at game size, but human judgment remains open on whether these are enemies you want to fight.

No requested file is missing. Canvas size, RGBA transparency, unclipped visible bounds, all three expression fits, actual-size comparison and changed-file scope were checked. No runtime art, code, tests or tools were changed. Source delivery does not imply approval or import.
