# A024 — Rat limb end repairs

Branch: `a024-rat-limb-repairs`. Source-only delivery. Built-in image tool, two repair-atlas edits; exact prompts in `prompt.md`. Nine modified source PNGs and the unchanged `arm-far-lower.png` carry-forward. Same 1536 × 2304 canvases, positions, scale, pivots, grip lines and split-hand faces. No torso or pelvis edits. No rig-source fragment is required: **no pivot moved**. Inherit the A023 rig and replace the modified PNGs by name.

## Each repair

1. **Near overhand wrist:** added a fur wrist continuation underneath the existing bracer, keeping original glove paint. All five split grips were checked with both layers at −45°, 0°, +45° on their actual forearms. All 15 assemblies overlap at the cuff; no other grip required an edit. The far overhand under-layer's existing striped extension is inherited, not newly painted.
2. **Raised shoulders:** repainted only the named shoulder ends on `arm-near-raised`, `arm-near-upper`, `arm-far-upper` as finished outlined fur. The raised fist/bracer and original visible arm paint outside the repair areas are retained.
3. **Back shoulders:** refinished the hidden top ends of `arm-near-upper-back` and `arm-far-upper-back`. The near end is constrained by the translated back torso; the far end by its cap/forearm. Visible original back-view paint is retained.
4. **Scarf:** finished the root with red cloth and its outline, preserving the exposed tail. Root geometry remains largely the same; this is a material/edge repair, not a shortened scarf.
5. **Far foot:** narrowed and rounded the hidden leather tab. At source y=1720/1730/1740, foreground widths went from 51/66/71 to 23/47/50 px. Lower boot and toes remain unchanged. Whether this stays under the shin in the knockdown requires the posed import check.
6. **Cut edges:** refinished the covered upper-arm and thigh end regions, scarf root and far-foot top. **Incomplete: `arm-far-lower` remains byte-identical to A022.** The tool supplied elbow/wrist fur edits, but these changed exposed pixels in the Q rest assembly. They were rejected to honor visible-paint preservation. Its exposed wrist cut is still outstanding; no runtime clearance is claimed for this or the other cut-run flags.

## Self-check results

- `review-paint.png`: direct source Q rest assembly uses A023 Q view bands (shoulder caps hidden, shin over foot, seat present). **Before vs after: 0 changed RGB pixels.** This preserves A023 rest paint exactly.
- Absolute master comparison is **not a clean master match**: 72,331 of 843,587 master foreground pixels differ by more than 32 RGB levels in both the before and after assemblies (8.57%). These inherited differences did not grow. The comparison is a source-space check, not the game's importer/render test.
- `wrists.jpg`: **15/15 assembled split grips have source-pixel overlap with the forearm** at the three requested angles. Both hand layers are included; measuring only the face layer incorrectly reports far-hand gaps. The near overhand's added fur is visible at some extreme angles but the cuff stays connected.
- All ten source cuts: 1536 × 2304, keyed green background, one 8-connected foreground component each. Introduced flecks were removed; original silhouette neighbourhoods restored wherever a donor detached a tip.
- Original visible paint outside named end masks: 0 changed source pixels. Raised-arm fist and bracer are outside its shoulder repair mask. Pivots and grip data were not edited.
- Before/after crops: `review-<part>.png`, with matching small phone JPGs. Overview: `review.png`, including the repaired rest assembly at 130 px tall on gray. `review-rest-delta.png` is the zero-change rest map. Every review image also has a JPG in `docs/screens/A024/`, quality about 80, long side ≤2000.
- The overview uses gray, rather than the harbor image, because this run was restricted to the packet's named inputs.
- Machine-readable measurements and inherited pivots: `self-check.json`. Exact prompts and masking method: `prompt.md`. Raw generated atlases and discarded variants are excluded.

## Still required

The forearm cut repair above is unfinished. Code must import the nine changed cuts and rerun the T029 posed exposure/cut-edge and seam checks: rally/cast/chop, staff overhead, dodge roll, spin, and folded far ankle. Source checks do not establish that the numeric exposure flags pass. Torso/pelvis flags remain outside A024 scope. No question needs an unattended answer.

Commit preparation was attempted with `git add assets/source/A024-rat-limb-repairs docs/screens/A024` and failed: `.git/index.lock: Operation not permitted`. All deliverables remain on disk for the runner to commit and push. `git check-attr` confirms source PNGs use LFS; review PNGs and phone JPGs use normal git. The sandbox prevented staging, so `git lfs status` cannot list these new assets yet. No branch switch or push was attempted.
