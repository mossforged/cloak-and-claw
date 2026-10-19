# A020 — corrected-reference redraw, best-attempt source delivery

**Status: visual fit and material-selection checks FAILED. These files are reviewable source attempts, not a G4 pass or an import-ready kit.** `rig-source.json` explicitly records `importReady: false`. The earlier missing-reference blocker is resolved: A011 was read with the lead's authorization.

## What was drawn

All 47 selected gear/detail illustrations were redrawn with the built-in image tool, using A011's approved designs and the current A018/A022/A023 body targets. No old gear PNG was reused as a final part.

- Seven jerkins: Q, side, back, front, away, hunched, lean-back. The rear and away retries use A011's rear lacing design rather than front buckles.
- Seven red sash/belt overlays for the same torso views.
- Six quivers: Q, side, back, away, hunched, lean-back.
- Nineteen headwear drawings: hood, helmet and captain hat for neutral, back, hurt, front and drink; all three also have shout variants; the hood additionally has an attack variant. Neutral headwear is reviewed on effort/KO; helmet/hat additionally on attack.
- Eight face-detail overlays: eyepatch, extra scars, painted ear-notch rim and gold earring for front and drink.
- 552 grayscale material-selection masks: fur, cloth, trim and leather for each of 91 latest body drawings and 47 new overlays. Empty regions are explicitly present and identified. These are derived pixel selections, not image-tool-painted mask illustrations.

Sources use 1536 x 2304 canvases and pure #00FF00 background. Generated images were uniformly reduced back to their target crop frames and placed on the shared canvas; no nonuniform stretching or code drawing/deformation was used. The image tool did not consistently preserve the requested fit or material distinctions. Raw tool outputs and discarded variants are omitted.

## Files and review

The delivery directory contains the 47 named PNGs, 552 mask PNGs, `masks.json`, `rig-source.json`, `self-check.json`, `fit.png`, `reference.png`, `review.png`, `review-fit.png`, `review-tints.png`, this handoff and exact prompts in `prompt.md`.

`fit.png` contains 55 source-fit cases, one row per gear/detail group: riding part and gear at native part resolution, plus an assembled character uniformly scaled to 136 px. Assemblies inherit the source pivots and A023 torso anchors. They are static source checks, not runtime move validation. `review.png` has the full illustration gallery and a 130 px assembly over harbor-market.

There are 69 quality-80 JPG review copies in `docs/screens/A020/`, all at most 2000 px on their long side: gallery, native-fit overview, per-group rows, individual fitted overlays, reference and tint test. The individual fit JPGs are preferable to the very wide row overviews on a phone.

## Self-check results

| Check | Result |
| --- | --- |
| All 47 overlay PNGs saved, canvas 1536 x 2304, green corner | PASS |
| Four distinct grayscale material masks for each of 138 drawings, matching native canvas | PASS (file/structure check only) |
| Tint test on Q/front/back body and jerkin, four materials, no RGB changes outside the selected mask | PASS (24 mechanical isolation checks; does not establish correct material selection) |
| Phone JPGs <= 2000 px, quality 80 | PASS |
| Git LFS lists source PNGs; review PNGs and phone JPGs remain normal git | PASS |
| Exact hem, shoulder and ear coverage | FAIL |
| Same gear/perspective through every turn | FAIL / unverified |
| Semantically isolated fur/cloth/trim/leather regions | FAIL |
| Runtime turn into slash / moving captain | NOT RUN; source art only |

## Known failures and remaining work

1. **Jerkin fit:** the extracted Q jerkin follows the belly better than the first separate-vest attempts, but a strip of belly fur still protrudes below its hem. Other views still put empty shoulder-hole rims over existing pauldron/fur paint, and side/hunched/lean-back dimensions do not exactly follow the torso. Away's corrected rear-laced vest reads too symmetrically and insufficiently turned. The revised Q front also reads redder than the approved brown palette. No body part was altered to hide these errors.
2. **Headwear:** ear openings do not consistently follow the current ears. Most clearly, drink hood's far opening floats beside the far ear, and its face edge encroaches on the upturned muzzle. Neutral/expression reuse, rear coverage and the new shout variants must be redrawn where the individual fits show interference. Presence of a variant is not a fit pass.
3. **Face details:** the front eyepatch is oversized/too central and reaches across the eye line rather than covering only the camera-side eye. Some earring/scar/notch scales and attachment points are approximate. The drink earring attaches to the camera-side ear but reads large. These are not accepted one-sided-detail fits.
4. **Ear notch:** the supplied piece is a painted torn-rim accent, as an overlay cannot remove the underlying ear silhouette. It is not a true cut notch. No green stencil or runtime workaround was invented.
5. **Masks:** the tint sheet still shows incorrect material assignments and incomplete regions. The torso cloth selection catches parts of brown fur/leather; fur masks miss much of the brown shoulder fur and some belly pixels; trim may catch warm fur/leather pixels. Pixel isolation is mathematically valid, but material isolation is not. All 91 body and 47 gear sets need a semantic selection repair before recolour use.
6. **Quiver:** Q/side/hunched/lean-back use band 90 behind the torso; back/away use band 660 over the back surface. Perspective and shoulder placement remain approximate. Front is explicitly hidden in the fragment under an **unverified** full-body-occlusion assumption, not a demonstrated fit; whether arrow tips should remain visible needs a source redraw/fit check. Turn continuity therefore does not pass.
7. **Review limit:** full-size fit cells show the native riding part, with a separate 136 px source assembly. The complete character is not repeated at full 1536 x 2304 size in every fit cell. Source assemblies are not a replacement for Code's runtime rehearsal or anatomy checks.

The packet expressly allows the best attempt when the image tool cannot meet a rule. This delivery uses that exception; it must not be reported as meeting acceptance. The next work is targeted redraw/selection repair, not a request to stretch these parts or compensate in game code.

## Registration and handoff

The fragment lists each overlay's riding slot, exact drawing, source path, untrimmed offset [0,0], inherited pivot, band and four masks. `gearViews` lists explicit view/expression coverage. Code must derive trimmed-image offsets from these source canvases rather than reuse old A011 runtime offsets. Body sources identify the latest file of each name across A018/A022/A023. No game code, weapons, body drawings or upstream source files were changed. Only A020 source/review files and A020's asset-table row were written.

Runner session: kept branch `a020-rat-gear-every-view`; no checkout, pull, branch switch or push. Git LFS 3.8.0 is available; staging succeeded. The art delivery and failure report are committed for the runner to push.

## Anything only the user can answer

No design clarification is needed. A011 supplies the approved look and the corrected packet supplies the body/head references. The remaining problems are technical art fit/selection problems. Human approval of a moving, hooded/jerkined captain remains a later gate after the art is corrected and Code imports it; no approval is requested for the current failed fits.


# Round 2 — method proof failed; do not import

## Jerkin and hood first

Edited the actual current riding drawings with the built-in image tool: all seven torso views in the A011 jerkin, and all nine current head expressions/views in the A011 hood. Delivered 16 selected dressed references (`dressed-gear-*.png`) and their 16 literal pixel-difference overlays (the ordinary `gear-jerkin*.png` and `gear-hood*.png`). Effort and KO now have their own hood attempts because a difference carrying repainted facial anatomy cannot safely ride another expression. All canvases remain 1536×2304 on the original source coordinates and pivots. Front hood was retried to remove an unwanted second head; the rejected output is not delivered.

The method does **not** pass. Dressing helps place the clothing around the belly and ears, but the image tool changes exposed anatomy and silhouette edges too. The difference therefore contains repainted shoulder, scarf, fur, face or ears instead of a single clean outlined gear piece. A transparent additive overlay cannot erase original-body pixels outside the dressed silhouette. No green eraser, body replacement, stencil or runtime compensation has been invented. Side/away/lean-back jerkin attempts still expose fur under their hems; the back and away designs add front-style buckle details contrary to the approved back design. Hood cloth varies browner than the olive reference and some stitches/ear rims drift.

## The rest

The packet explicitly requires proving jerkin and hood before proceeding to the rest. That prerequisite failed, so sash, quiver, helmet, captain hat and face-detail art/masks remain the failed Round 1 delivery; none is newly certified. The ear-notch head swaps have **not** been made. Quiver front occlusion remains unverified. There is no claim that all Round 2 drawing work is complete. The review gallery labels these unchanged assets `R1 HOLD`; revised gear is `R2 FAIL`.

## Fit checks

`fit-jerkin.jpg` and `fit-hood.jpg` contain native-scale riding-part cells: original, dressed tool edit, original + literal difference, magenta mismatch map, and a 136 px source assembly using A023 anchors. Each row also has its own phone JPG. `fit.png` / `review-fit.png` provide the combined overview. Exact keyed compositing statistics, tolerances and component counts are in `fit-round2.json`. RGB difference threshold is 12; comparison tolerance is 24, with alpha-support differences always counted. Every comparison fails because original silhouette pixels remain. The unmatched count is not a material coverage or motion score.

| Drawing | Unmatched source pixels | Diff components ≥20 px | Fit |
|---|---:|---:|---|
| gear-jerkin | 3437 | 12 | FAIL |
| gear-hood | 2439 | 47 | FAIL |
| gear-jerkin-front | 1737 | 26 | FAIL |
| gear-jerkin-side | 984 | 16 | FAIL |
| gear-jerkin-back | 6529 | 85 | FAIL |
| gear-jerkin-away | 2344 | 21 | FAIL |
| gear-jerkin-hunched | 1238 | 40 | FAIL |
| gear-jerkin-lean-back | 1780 | 27 | FAIL |
| gear-hood-back | 1664 | 96 | FAIL |
| gear-hood-drink | 1325 | 43 | FAIL |
| gear-hood-hurt | 3927 | 65 | FAIL |
| gear-hood-shout | 2108 | 54 | FAIL |
| gear-hood-attack | 1687 | 52 | FAIL |
| gear-hood-effort | 3623 | 39 | FAIL |
| gear-hood-ko | 1073 | 61 | FAIL |
| gear-hood-front | 1599 | 69 | FAIL |

## Tint checks

Rebuilt 428 grayscale masks for 107 drawings: all 91 latest current body drawings across A018/A022/A023, plus the 16 revised gear attempts. The fragment has 560 mask entries in total; the other 132 masks belong to unchanged Round 1 gear. Samples were picked by hand on the approved A023 assembly and A011 designs, then selections made from each drawing's own RGB palette with small colour-distance tolerances. Small holes were closed and components below 20 px removed. Eighteen fur masks received hand-traced conservative mouth/teeth exclusions; coordinates and counts are in `palette-round2.json`. No image-tool material selections were used.

`review-tints-round2-01.png` through `review-tints-round2-18.png` show original plus each of the four independent test tints on **every revised drawing**; the same pages are small phone JPGs. `tint-isolation-round2.json` records the outside-mask change count for every tint (expected and checked zero). This proves application isolation only. **Material semantics fail:** similar brown cloth/leather/fur colours collide, leather selection reaches hand skin shadows, fur loses textured highlights/darks, and some metal/stitch or cream-fur colours mix. Mouth exclusions fix the most obvious tooth tint but can omit adjacent pale fur. The per-drawing unresolved/uncertified list is the full `drawings` array of `tint-round2.json`; no drawing is falsely certified from the zero-outside-mask check. Further region isolation and hand painting are still needed.

## Registration, files and readiness

`rig-source.json` includes the two extra hood expression attempts, links dressed references and literal-difference methods, updates mask metadata, and keeps **`importReady: false`**. Source offsets remain [0,0], source pivots unchanged. `review.png` contains the source gallery and 130 px assemblies over the harbor stage. Every new review image has a quality-80 JPG, long side ≤2000 px, in `docs/screens/A020/`. Full native fit JPGs and selected source PNGs use LFS; `review*.png`, JSON and text remain normal git. Exact prompts, processing thresholds, limitations and hand-fix provenance are in `prompt.md` and `palette-round2.json`. No raw tool outputs, discarded variants, code, upstream body art, or runtime assets were changed.

## Anything only the user can answer

None. A011 supplies the design and the packet supplies the method. Remaining failures are technical art fit and material-isolation problems, not missing design decisions. Human approval of the moving captain remains a later gate after a successful source repair and Code import.

## Runner session and repository checks

Stayed on `a020-rat-gear-every-view`; no checkout, pull, branch creation or push. Git LFS 3.8.0 is available, staging succeeded, and LFS status lists the selected dressed images, new hood expression overlays and native fit JPGs. File-reference, 1536×2304 canvas, phone long-side ≤2000, scope and `git diff --check` checks pass. All 428 independent tint applications change zero pixels outside their own masks; fit and material-semantic checks remain failed. Art is committing this diagnostic best-attempt round for the runner to push.
