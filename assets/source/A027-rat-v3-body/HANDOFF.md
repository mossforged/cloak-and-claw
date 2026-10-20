# A027 — rat v3 body, best-attempt source delivery

Branch: `a027-rat-v3-body`. **Not ready to import (`importReady: false`).** All 15 requested new pieces are saved, assembled with A026’s actual six pieces. The whole rest silhouette passes 95%; visible construction/finish defects prevent the sweep gate from passing.

## Delivered and setup

Folder check passed; git-lfs 3.8.0 available. Runner’s existing task branch was retained: no checkout, pull, branch switch or push. Art is entirely from A017’s master regions, new built-in image_gen hidden material, and the six accepted A026 parts. No A018/A023/A025 stand-ins.

Saved `torso.png`, `pelvis.png`, `seat.png`, `belt.png`, `head.png`, `scarf-tail.png`, `arm-far-upper.png`, `arm-far-lower.png`, `hand-far.png`, `leg-far-upper.png`, `leg-far-lower.png`, `foot-far.png`, `tail-1.png`, `tail-2.png`, `tail-3.png`: 1536 × 2304 RGB, green #00FF00, master placement/scale. Also `rig-source.json` (all 21 pieces; external near paths reference A026), `reference.png`, `rest.jpg`, `points.jpg`, 17 `sweep-<joint>.jpg`, `review.png`/`review.jpg`, `self-check.json`, exact `prompt.md`, this handoff. Phone JPEGs for every review sheet are in `docs/screens/A027/`, quality 80, longest side ≤2000px. No raw tool outputs or discarded variants committed.

Three A026 PNGs were replaced in place: `arm-near-upper`, `arm-near-lower`, `leg-near-upper`. Their exact original foreground masks and all fitted points/rest placements are unchanged. Local RGB repair bands target shoulder top/inner pad, inner elbow and thigh top/hem. These are partial paint cleanups, not a claim every leftover edge disappeared. `hand-near`, `leg-near-lower` and `foot-near` are unchanged. The old A026 review/manifest files are historical; A027 supplies the current assembly/measurements and uses the updated -113 elbow limit.

## Whole-rat rest and per-piece visible silhouettes

Whole-rat visible silhouette IoU: **97.771%**. Rest, source/master/difference views and all values are in `rest.jpg`. The master-visible paint is deliberately retained. There are no stand-ins or rest-pose offsets; the near shoulder stays at (573.4,1087.6), without the old (-36,-22) slide. Full rounded hidden pieces expose some extra material at rest (notably the right hip and forearm); silhouette similarity is not paint/contour certification.

Per-piece IoU uses manually traced material ownership after actual layer occlusion; traces/interstices and wrap ownership introduce uncertainty. It penalizes stealing a neighbor’s exposed region even when the whole union matches. Scores are not directly comparable to A026’s legacy-body-context measurements.

| Piece | Visible IoU |
| --- | ---: |
| `tail-3` | 88.58% |
| `tail-2` | 94.33% |
| `tail-1` | 95.35% |
| `scarf-tail` | 98.43% |
| `arm-far-upper` | 57.77% |
| `arm-far-lower` | 50.54% |
| `hand-far` | 90.80% |
| `leg-far-lower` | 43.22% |
| `foot-far` | 94.14% |
| `leg-far-upper` | 74.86% |
| `pelvis` | 72.10% |
| `leg-near-lower` | 76.51% |
| `foot-near` | 91.37% |
| `leg-near-upper` | 97.01% |
| `seat` | 86.40% |
| `torso` | 83.46% |
| `belt` | 96.45% |
| `head` | 97.93% |
| `arm-near-upper` | 97.26% |
| `arm-near-lower` | 99.84% |
| `hand-near` | 97.91% |

The far shin, far forearm and far upper arm are the weakest per-piece silhouettes. The new pelvis/seat/torso also alter exposed material ownership. Their low scores must not be hidden by the whole-rat pass.

## Sweeps

17 sheets × 5 samples = 85 poses. All are rendered from delivered PNGs, with fixed draw order, exact shared pivots and whole descendant chains. Each includes a 390 × 390 source-pixel crop at 1:1 and a full rat whose foreground is 136px tall. Near ranges come from the current fitted JSON, far ranges mirror them; neck ±20, waist ±15, tails ±40. **All 85 have nonzero local parent/child overlap, but visible gap/notch/contour failures remain.** Overlap is not proof of a clean joint and no continuous-motion/in-game certification is claimed.

| Joint | Five angles (degrees) | Minimum local overlap, px² | Visual result |
| --- | --- | ---: | --- |
| `neck` | -20, -10, 0, 10, 20 | 21,286 | Connected; cut/registration fragments beneath cheek and at scarf boundary still show as the head turns. Dome contour is not certified. |
| `waist` | -15, -7.5, 0, 7.5, 15 | 26,229 | Connected; generated lower chest dome exposes a second dark edge under belt and paint/seam transitions at extremes. |
| `shoulder-near` | -116, -68, -20, 28, 76 | 6,557 | No old torso slide. Brown fur replaces unsolicited second shoulder panel, but a grey notch remains above the pad at +28/+76; exposed hidden fur/strap boundary remains. FAIL. |
| `hip-near` | -23, -8.75, 5.5, 19.75, 34 | 20,958 | Seat stays above thigh and connection holds. Diagonal orange-patch/seat registration seam and doubled patch contours remain at bends. FAIL finish. |
| `shoulder-far` | -116, -68, -20, 28, 76 | 429 | Only 429 px² minimum local overlap; shallow attachment, jagged neck-side wedges and exposed cut paint at turns. FAIL finish, proposal needs fitting. |
| `elbow-far` | -113, -83.5, -54, -24.5, 5 | 5,614 | Connected closed component, but cap/material scale mismatch and exposed rim-like folded contours remain. No clean no-tube-face certification. |
| `wrist-far` | -49, -34.5, -20, -5.5, 9 | 5,268 | Cuff turns with hand; connected. Visible-paint ownership was corrected; outline/paint transitions at cuff remain. |
| `hip-far` | -23, -8.75, 5.5, 19.75, 34 | 23,226 | Connected; full hidden thigh cap retained. Pelvis/thigh double boundaries and excess generated hip exposure remain. |
| `knee-far` | -23, 0.25, 23.5, 46.75, 70 | 10,954 | Connected smooth closed shin reaches knee point. Hem scraps/registration and changed visible shin exposure remain. FAIL finish. |
| `ankle-far` | -19, -4.25, 10.5, 25.25, 40 | 5,138 | Wrap belongs to foot; connected. Tool top-opening retry selected, but top cap/outline transition remains visible. |
| `tail-root` | -40, -20, 0, 20, 40 | 1,402 | Root revised to (550,1515), minimum local overlap now 1402 px². Connected behind pelvis/near thigh; residual root-side material/contour transition remains. |
| `tail-mid` | -40, -20, 0, 20, 40 | 1,635 | Connected; rounded generated support retained. Original-to-generated paint transition and dark joining contour remain visible. |
| `tail-end` | -40, -20, 0, 20, 40 | 1,460 | Connected; curved tip retained. Negative turns expose a small notch/doubled outline at the join. FAIL finish. |
| `elbow-near` | -113, -83.5, -54, -24.5, 5 | 5,965 | New full -113..5 range used (A026 manifest was stale at -101). Connected; inner elbow cut/registration edge only partially repaired. |
| `wrist-near` | -49, -34.5, -20, -5.5, 9 | 10,935 | Original points/mask and cuff-on-hand retained. Connected; inherited cuff-side contour remnants remain. |
| `knee-near` | -23, 0.25, 23.5, 46.75, 70 | 19,908 | Original points/mask retained. Connected; thigh hem repairs partial, exposed shin paint/width differs from master strip. |
| `ankle-near` | -19, -4.25, 10.5, 25.25, 40 | 10,717 | Original points/mask and wrap-on-foot retained. Connected; inherited wrap-top/strap contour remnants remain. |

## Proposed points and manifest

All coordinates are master pixels, orange on `points.jpg`; cyan points are the user’s skeleton/fitted values. Proposed: **shoulder-far (958,1180); tail-root (550,1515); tail-mid (444,1709); tail-end (351,1815)**. The first tail-root proposal (515,1515) was too shallow: shifting its hidden root 35px right increased minimum local overlap from 26 to 1402px². The far shoulder remains shallow and should be checked first in the Fitting Room. These are proposals, not locked user decisions.

The skeleton has no explicit root. Manifest uses the user’s waist (806.2,1441.6) as the pelvis root alias and explicitly records that choice. Seat/belt ride pelvis; scarf rides torso. Torso is under near arm/head, seat over near thigh, far chains behind body, cuff with hand and wrap with foot on both sides. Torso’s unsolicited extra shoulder armor was removed with an image-tool retry; brown fur now fills that hidden surface. Domes are tool-painted and registered; perfect circularity/centering is not certified for every joint.

## Left / next review

The task’s no-gap/no-doubled-outline gate is not met. Most urgent: fill the near-shoulder upper notch through +28/+76 without changing its fitted rest position; finish neck-side registration fragments; reconcile seat/upper-thigh patch boundaries; fit and clean far shoulder/elbow/wrist material exposure; reconcile far shin/hem silhouette and cleanup; blend tail joining outlines and tip notch. Some inherited A026 cuff/ankle edges and its differently exposed shin remain. Isolated-part review also exposes hard horizontal registration/paint bars in the far forearm/hand and far shin, a remaining dark trouser-shaped scrap beside tail-1, thin dangling hem fragments under the far thigh, a clipped neck edge and cut boundaries in seat/pelvis. These are substantive unfinished-art defects, even though they are often hidden at rest. The source images make these problems reviewable; no code workaround was added.

No user-only design question blocked delivery. The only decisions for review are the proposed points and whether these new hidden surfaces are acceptable starting material. This is a best attempt under the asset contract’s tool-limit rule, not an import approval.

Final validation passed: all 21 source dimensions/RGB/green, all six near masks and fitted points unchanged, three untouched near PNGs byte-identical, 17 sweeps/85 samples, all review phone copies/dimensions, and independently recomputed whole-rat IoU 97.771%. Text whitespace check passed. LFS attributes confirmed for new part images; review.png and phone JPGs are normal git. Staging succeeded. Art is committed on the runner’s task branch; runner is responsible for push.

Commit `9779df4` contains the complete art delivery, manifest, sheets, prompts, asset row and initial reports. A subsequent staging attempt for the final HANDOFF/self-check defect descriptions was blocked by the sandbox (`.git/index.lock`: Operation not permitted); those two final text updates remain on disk for the runner to commit. No push was performed.
