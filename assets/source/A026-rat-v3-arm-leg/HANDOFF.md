# A026 Round 3 — best-attempt source delivery

Branch: `a026-rat-v3-arm-leg`. **Not ready to import (`importReady: false`).** The wrap ownership, new pivot/attach coordinates, new limits and knee extension are delivered. Cleanup and per-piece visible silhouette gates are not all passed.

## Setup and delivery

Folder check passed (`cloak-and-claw-art`); git-lfs 3.8.0 available. Runner had already merged main: HEAD `822cf82` includes the Round 3 packet and user points (`a1f2827`, `f8f37f1`); main was verified as an ancestor. No checkout, branch switch, pull or push was performed.

Built on Round 2's six pieces and master-region paint. Saved six 1536 x 2304 green-background PNGs; `rig-source.json`; `reference.png`; `rest.jpg`, `style.jpg`, `silhouette.jpg`, six `sweep-*.jpg`, `review.png`/`review.jpg`; `self-check.json`; exact prompts in `prompt.md`; this handoff. Phone copies of every review sheet are in `docs/screens/A026/`, quality 80, longest side at most 2000 px. No raw image-tool outputs or discarded variants are delivered.

Covers: arm over A025 torso; forearm over upper arm; **hand over forearm**; seat over thigh; thigh over shin; **foot over shin**. The wrist band was transferred into the hand, and the ankle/instep wrap into the foot. The parent ends use closed tool-painted material. All six manifest pivot/attach pairs use the user's new world points without moving the rest pose.

## Visible silhouettes against the master

The metric is intersection / union of the actually exposed assembled part silhouette and its traced master limb region after the cuff/wrap reassignment. Higher layers occlude each assembly independently. It counts extra exposed paint and missing area, unlike Round 2's retained-pixel metric. `silhouette.jpg` shows shared area in white, extras in orange and missing area in cyan. Manual master tracing and the legacy body context introduce uncertainty; these numbers are not an independent ground-truth segmentation.

| Piece | Visible IoU | Master-region coverage | Result |
| --- | ---: | ---: | --- |
| `arm-near-upper` | 92.92% | 98.43% | Master pad/fur retained; top hole repaired and fur-end cut blended. Extra elbow-end paint and residual inner registration edges remain; the exact fur-cap center is not certified. |
| `arm-near-lower` | 96.69% | 96.72% | Bottom cuff removed; plain leather wrist dome now under the hand. Master middle folds retained. The original angled inner boundary and small outline fragments remain; not a clean outline pass. |
| `hand-near` | 98.00% | 100.00% | Owns the transferred wrist band and draws above forearm. Fist/glove preserved. Small cuff-side/lace contour remnants remain. |
| `leg-near-upper` | 99.85% | 100.00% | Master patch, width and ragged hem preserved; top cloth repair added. Some thin hem artifacts remain. Legacy seat context repeats/overlaps the upper patch. |
| `leg-near-lower` | 51.19% | 79.16% | New complete smooth pink shin, closed round knee and ankle ends; image landmarks registered to the new knee and ankle. Visible strip is wider/differently exposed than the traced master sliver; paint transition remains. This piece fails the 95% visible silhouette gate. |
| `foot-near` | 97.64% | 99.75% | Owns ankle/instep wrap and draws above shin; toes, claws and heel retained. Upper wrap repaired with closed tool paint. Small strap/top-contour remnants still show at positive turns. |

Combined exposed near-limb union IoU: **96.46%**. This does **not** override the upper-arm and shin per-piece failures or the visible finish defects. The shin has only a small master-visible region between the trouser hem and wrap, so the width and changed wrap boundary heavily affect its score.

At rest the cuff, boot, fist, toes and patched thigh retain the master look. The A025 torso and A023 pelvis/seat are real complete source context, with A018 head/far limbs/tail. Their fuller belly, doubled seat/thigh patch and missing rear scarf differ from A017; these context assets were not altered.

## Six sweeps

Five evenly spaced samples per joint; positive clockwise. Complete downstream chains turn about the exact new user point. Every sheet labels its point and new limits, shows 1:1 source-pixel joint detail, and the full assembled rat at 136 px tall. All 30 samples have nonzero parent/child alpha overlap. That is a connectivity measurement, not proof of no local notch, exposed cap or bad contour. No continuous-motion or in-game certification is claimed.

| Joint / point (master px) | Angles (degrees) | Minimum overlap (source px²) | Visual result |
| --- | --- | ---: | --- |
| shoulder (573.4, 1087.6) | -116, -68, -20, 28, 76 | 19,701 | Connected at every sample using the actual A025 torso. Pad top is repaired, but inner/cap registration artifacts remain and old torso paint is exposed at extremes. PARTIAL. |
| elbow (489.4, 1303.6) | -101, -74.5, -48, -21.5, 5 | 6,078 | Connected at every sample, forearm in front. No flat tube face; round fur end visible at bends. Inner forearm cut edge/outline fragments remain. PARTIAL. |
| wrist (411.2, 1427.6) | -49, -34.5, -20, -5.5, 9 | 11,017 | Transferred cuff turns with hand, above the plain forearm end, at every sample. No sliding hand out of a stationary cuff. Cuff-side fragments and a hard forearm boundary remain. PARTIAL. |
| hip (640.4, 1476.6) | -23, -8.75, 5.5, 19.75, 34 | 20,225 | Seat remains above thigh at all five samples. Connection holds; legacy seat repeats the thigh patch and creates doubled costume contours. Context mismatch remains. PARTIAL. |
| knee (633.2, 1661) | -23, 0.25, 23.5, 46.75, 70 | 20,100 | New shin reaches above the new knee point; closed upper dome stays under the thigh through 70 degrees. All five connected. Exposed shin shape/color transition and hem remnants remain. PARTIAL. |
| ankle (571.2, 1799) | -19, -4.25, 10.5, 25.25, 40 | 10,863 | Wrap turns with foot above shin at all five samples, with closed shin end inside it. Heel/instep are now on the same moving piece. Top/strap outline fragments remain at positive turns. PARTIAL. |

## Left

Finish the forearm's angled inner edge and cuff-side scraps; finish the foot-wrap top/strap contours at positive bends; remove remaining shoulder/hem registration edges; refine the exposed shin width and paint transition to the master. Exact circular dome centers for all six parts are not certified, although manifest joint coordinates are exact and the new shin end landmarks are registered to knee/ankle. The current body/seat context also needs reconciliation by a later packet if the whole rest image must match A017.

The first shin edit returned fur and a clipped end. A smooth pink-shin retry was rejected at output by the image service safety system. A closed smooth suede-component edit succeeded, followed by a color-only coral-pink correction; final shin is closed at both ends and is the only selected shin delivered. Full prompts and processing are recorded in `prompt.md`. No runtime code workaround was introduced.

No user-only design question: the packet's decisions are clear. This is a best attempt under the asset rule for tool limitations, not an import approval. Runner is responsible for pushing; commit attempt result is recorded below.
