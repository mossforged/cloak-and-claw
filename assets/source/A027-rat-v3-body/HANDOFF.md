# A027 Round 2 — fitted v4 source repair, best attempt

Branch: `a027-rat-v3-body`. **`importReady: false`.** Saved Round 2 under all original PNG names. Rest passes the whole-rat silhouette threshold, but the strict no-notch/no-exposed-edge/no-doubled-outline sweep gate is not met. This is a partial visual repair, not an import approval.

## Setup and delivered files

Correct folder verified with `pwd`; git-lfs 3.8.0 available. Runner task branch retained; `main` verified as an ancestor before art work. No branch switch, checkout, pull or push. All 17 fitted points and ranges come directly from `docs/design/rigs/rat-v3-joints-v4.json`, including the lower near shoulder, moved far elbow, zero lower far elbow/wrist limits, neck +61, near knee +87 and tail tip -3..7. Former proposed shoulder/tail points are now accepted, with no proposal flags. No user points were moved.

A027 retains its 15 PNG names: torso, pelvis, seat, belt, head, scarf-tail; far upper/lower arm and hand; far upper/lower leg and foot; tail-1..3. Thirteen have repaired paint/contours; belt and scarf-tail remain the accepted Round-1 pieces. All 21 parts are actual A026+A027 sources, 1536 × 2304 RGB on exact #00FF00, at master placement/scale. No stand-ins.

A026's original reviews/manifest remain historical; the A027 all-21 rig and sheets are the current delivery. A026's three painted repairs are `arm-near-upper.png`, `arm-near-lower.png`, `leg-near-upper.png`. All six near foreground masks are unchanged. Near hand/shin/foot foreground pixels are unchanged; only their inherited keyed background fringe was normalized to green (257/619/446 pixels). No costume or foreground redraw in those three files. Near-thigh hidden orange-patch paint is replaced with olive only under the seat's rest occlusion.

Saved: `rig-source.json`, `reference.png`, `rest.jpg`, `silhouette.jpg` (all 21 exposed per-piece masks), `points.jpg`, 17 `sweep-<joint>.jpg`, extra `neck-detail.jpg` at the original +10/+20 failure angles, `review.png`/`review.jpg` (all components and 130px assembly over Harbor Market), `self-check.json`, exact prompts/processing in `prompt.md`, and this handoff. Phone copies of every review plus reference are in `docs/screens/A027/`, quality 80, longest side ≤2000px. No raw outputs, discarded variants or processing scripts delivered.

## What changed, and what remains

Neck: rebuilt smooth closed lower-neck paint and repaired torso collar/neck fragments; no jagged fragment breakup in the reviewed -20..61 samples or the extra +10/+20 check. Face/ears/whiskers retain literal original paint; back-fur edge and lower neck use the clean tool result. The final +10/+20 recheck is free of the inherited red back-fur flecks. The current simple layer order still puts the head contour over the collar; no separate scarf overlay or runtime workaround was invented.

Shoulder: torso hidden shoulder extended upward and finished in brown fur around the lower fitted point; near arm hidden-top paint repaired with its original accepted mask retained. Coverage is stronger, but it is **not** a certified circular hidden top centered on the new point. Broad torso edge exposure and the recess above the pad remain. This central Round-2 requirement is incomplete.

Far limbs: removed forearm/hand/shin paint bars and neighboring scraps; upper arm now draws over the forearm's closed elbow cap, with hand still over wrist. Both remain behind torso. This asset draw-order adjustment is explicit in the manifest and must be used by the importer. Far shin widened through its lower middle; ankle top shortened to a shallow closed cap. Far thigh uses the true master cloth hem, excluding thin wires and detached scrap. A few attached red/registration tips and mismatched shin exposure remain.

Tail: removed proximal trouser scrap, repaired all three continuous contours and closed ends, repainted the distal cap cross-lines coral on tail-1/2. No grey breaks/old black cross-lines in reviewed samples; rounded band/color transitions remain visible.

Body/seat: registration paint repaired, right pelvis bulge reduced, hidden near-thigh duplicate patch partly removed. The seat seam, waist second outline and torso/pelvis material ownership still fail finish/rest checks. Some per-piece rest scores regress; the whole-rat pass must not conceal them.

## Rest match and per-piece silhouettes

Whole-rat IoU: **96.771%**, independently recomputed from saved PNGs; Round 1 was 97.771%. Above the 95% gate, a 1.000 percentage-point regression. No rest-pose offsets.

Per-piece values compare actual exposed masks after layer occlusion to traced master material ownership. Round 1 mistakenly assigned a rectangular brown hem strip to the far shin: 4,455 pixels are returned to the far thigh, leaving a manually traced 2,285px skin strip. Corrected and uncorrected values are both saved; this correction does not change whole-rat IoU. Tracing uncertainty is material, and these scores do not certify hidden paint.

| Piece | Round 1 legacy | Round 2 legacy | Round 2 corrected |
| --- | ---: | ---: | ---: |
| `tail-3` | 88.58% | 82.06% | 82.06% |
| `tail-2` | 94.33% | 88.42% | 88.42% |
| `tail-1` | 95.35% | 84.59% | 84.59% |
| `scarf-tail` | 98.43% | 98.12% | 98.12% |
| `arm-far-lower` | 50.54% | 58.39% | 58.39% |
| `arm-far-upper` | 57.77% | 74.42% | 74.42% |
| `hand-far` | 90.80% | 83.82% | 83.82% |
| `leg-far-lower` | 43.22% | 20.57% | 51.75% |
| `foot-far` | 94.14% | 97.37% | 97.37% |
| `leg-far-upper` | 74.86% | 69.57% | 76.16% |
| `pelvis` | 72.10% | 64.35% | 64.35% |
| `leg-near-lower` | 76.51% | 76.51% | 76.51% |
| `foot-near` | 91.37% | 91.37% | 91.37% |
| `leg-near-upper` | 97.01% | 95.74% | 95.74% |
| `seat` | 86.40% | 82.52% | 82.52% |
| `torso` | 83.46% | 79.01% | 79.01% |
| `belt` | 96.45% | 96.45% | 96.45% |
| `head` | 97.93% | 96.05% | 96.05% |
| `arm-near-upper` | 97.26% | 97.26% | 97.26% |
| `arm-near-lower` | 99.84% | 99.84% | 99.84% |
| `hand-near` | 97.91% | 97.91% | 97.91% |

The far forearm improves against the same trace (50.54 → 58.39), but remains weak. Far shin is 51.75 on the corrected trace, 20.57 on the old hem-contaminated trace. Pelvis (64.35) and torso (79.01) remain worse than Round 1 (72.10/83.46). These are unresolved failures, not an improved rest-match claim.

## Sweeps

17 joints × five v4 samples = 85 main poses, plus two original neck-failure checks. Fixed source painter order, rigid transforms and full descendant chains; each main sheet has source-pixel 1:1 detail and a full figure at 136px foreground height. All 85 main poses have nonzero local parent/child overlap, minimum 563px² at the far shoulder. Overlap proves contact only; no continuous or in-game certification.

| Joint | Five angles | Min local overlap, px² | Reviewed result |
| --- | --- | ---: | --- |
| `neck` | -20, 0.25, 20.5, 40.75, 61 | 24,245 | Original jagged cheek/scarf fragments removed. Smooth closed lower-neck fur stays connected through +61; additional +10/+20 detail sheet checks the original failure angles. Single head contour still draws over collar in the existing piece order. |
| `waist` | -4, 0.75, 5.5, 10.25, 15 | 26,344 | Connected through -4..15. Old horizontal paint bar is repaired, but a second lower-torso outline/fur strip remains visible beneath the belt. |
| `shoulder-near` | -116, -70.25, -24.5, 21.25, 67 | 22,388 | Exact lower pivot (595.8,1203.2), no rest offset. Extended torso fur and repainted hidden arm top improve coverage; broad torso contour remains exposed at negative turns and a grey recess above the pad under scarf remains at positive turns. Original near-arm mask retained: a full circular cap centered on the lower pivot is not certified. Strict shoulder gate remains open. |
| `hip-near` | -23, -8.75, 5.5, 19.75, 34 | 21,057 | Connected. Seat registration paint repaired and hidden duplicated orange patch repainted olive, but a clipped/abrupt olive-to-patch boundary and contour/stitch mismatch remain as the thigh turns under the seat. |
| `shoulder-far` | -116, -68, -20, 28, 76 | 563 | Accepted point retained. Connected in all samples, but minimum local overlap is only 563 px²; narrow shoulder attachment and inner torso registration fringe remain. No new fitting proposal. |
| `elbow-far` | 0, 31, 62, 93, 124 | 6,911 | New point and 0..124 used. Forearm paint bar removed; upper arm covers the closed hidden forearm top. Connected, no visible flat opening in these samples. This is a source-layer order change documented in manifest. |
| `wrist-far` | 0, 14.75, 29.5, 44.25, 59 | 5,860 | 0..59 used. Cuff belongs to and turns with hand; hard paint bar and loose leather projection removed. Closed overlap throughout the five samples. |
| `hip-far` | -23, -8.75, 5.5, 19.75, 34 | 16,967 | Connected. Reduced right pelvis bulge, but the pelvis/thigh boundary still produces a conspicuous second cloth contour; rest material ownership is not reconciled. |
| `knee-far` | -23, 0.25, 23.5, 46.75, 70 | 12,641 | Smooth coral shin has no trouser paint bar. Thin detached hem wires/scrap removed; a few attached red/registration tips remain at the trouser edge. Rest shin exposure is still too small (51.75% corrected IoU). |
| `ankle-far` | -19, -4.25, 10.5, 25.25, 40 | 2,989 | Wrap turns with foot and cap is shallower; connected through -19..40. No open tube, but leather cap/rim transition and the attached hem tips above it remain visible. |
| `tail-root` | -40, -20, 0, 20, 40 | 1,447 | Stray trouser scrap removed. Closed hidden root stays behind pelvis/near thigh through ±40. |
| `tail-mid` | -40, -20, 0, 20, 40 | 1,544 | Closed painted ends overlap through ±40. Black distal cap cross-line removed; coral paint/band transition remains visible as a rounded joint, with no grey break in these samples. |
| `tail-end` | -3, -0.5, 2, 4.5, 7 | 1,634 | Uses -3..7 exactly. Closed tip root and coral join paint remove the old notch and black cross-line in the sampled range; hooked tip retained. |
| `elbow-near` | -113, -83.5, -54, -24.5, 5 | 5,965 | Points/mask unchanged; inner elbow paint improved. Inherited thin pointed/cut contour remnants still appear at bends, especially near the fur/bracer edge. |
| `wrist-near` | -49, -34.5, -20, -5.5, 9 | 10,935 | Points/mask unchanged, cuff follows hand. Inherited doubled cuff-side contours/strap fragments remain. |
| `knee-near` | -23, 4.5, 32, 59.5, 87 | 19,908 | New maximum +87 used, connected. Near thigh top/hem paint repaired, but inherited thin hem/registration tips and differently exposed shin persist. |
| `ankle-near` | -1, 9.25, 19.5, 29.75, 40 | 10,699 | New -1..40 used; wrap follows foot, connected. Inherited wrap-rim line projects at positive turns. |

## Validation and runner handoff

All 21 PNG dimensions/RGB/keyed backgrounds passed. All 17 v4 pivot/attach/range pairs match the law exactly. Six near masks unchanged; three near foregrounds unchanged. Whole-rat IoU recomputed independently. 17 main sweep sheets/85 overlapping samples plus +10/+20 neck details; phone copies present and within size limit. `review.png` and phone JPEGs are normal git; part images are LFS. Git-lfs status recognizes the changed source images. Source-only changes; no code, tools, tests or imported game art touched. The A027 asset row remains `source`.

No user-only design question blocks this delivery. Remaining work is art finish/geometry: near shoulder cap and exposed torso edge; seat/waist contours; pelvis/torso rest ownership; far shin exposure and tiny hem tips; inherited near elbow/cuff/ankle edges. Best attempt under the packet's tool-limit rule. The fitted joint decisions remain accepted.

Commit and Git LFS staging succeeded on the task branch. No push was performed; runner handles push. The earlier read-only diff attempt hit a transient sandbox denial in `.git/lfs/tmp`, but the final staging and art commit completed successfully.
