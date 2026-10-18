# A023 Round 4 — finished hidden material and rear tail root

Branch: `a023-r4-rat-hidden-paint`. Based on pulled main `0420f03`; exposure list read from `origin/t028-views-and-depth` (`9ad1a73`). Source delivery only; push for review, do not merge.

## Delivered

60 repaired existing cuts plus `tail-root-back.png`. All sources are 1536 × 2304 PNG on exact green. Same inherited pivots and original grip metadata; split grip faces and under-pieces are unchanged.

- Seven torso views: completed collar/neck, shoulder cut surfaces and waist ends. Removed the hidden baked belt remnant from the Q torso; the separate belt remains the cover.
- Four pelvis views: finished trouser cloth / waist overlap, rounded seat ends and seams.
- Split upper arms, whole-arm keys, rear arms and shoulder caps: rounded, outlined fur/leather ends following each pose's own angle.
- Default and gesture hands: finished short cuffs; long stretched far-wrist columns removed. Existing finger/palm/grip paint restored outside the cuff masks.
- Q and rear thighs plus kneeling, knee-up and folded keys: finished olive-brown cloth at the hip, replacing flat blocks. Ankle ends on default, toe, heel, out and rear feet: tapered leather wraps, narrower than the former columns.
- Scarf root: red cloth in place of baked shoulder/metal fragments. Rear head: finished clipped neck edge. Q tail overlap: continued banded skin; separate B/BQ tail root ends on the seat.

`review.png` contains every repaired part, before/after on grey, with actual 130 px source assemblies on Harbor Market. Refreshed `views.png`, `turn.png`, `review-views.png`, `review-back.png`; new `review-r4-overview.png`. Phone: `docs/screens/A023/r4-overview.jpg`, `r4-parts-01.jpg` onward, and one equal-scale before/after hidden-area crop per repaired piece as `r4-<piece>.jpg`. All phone JPGs quality 82 and long side <=2000. Exact imagegen prompts and native crop coordinates: `prompt.md`.

## Import notes — rear tail supersedes round 3

- Merge this fragment after A018/A019/A022 and the earlier A023 fragments. Honor each entry's `source`; inherited drawings repaired here now resolve to A023.
- In B and BQ, use `tail-root-back` for `tail-1`; source pivot `(492,1540)`, next tail joint `(442,1708)` unchanged. Q/S/F keep the repaired ordinary `tail-1`.
- B root attaches at `(780,1505)` on `pelvis-back`; BQ at `(560,1505)` on the existing Q pelvis. The root ends on the painted seat, rather than disappearing behind the trouser leg.
- B/BQ tail bands are **550/560/570**, above the seat and thigh bands, below torso 600. Do not retain round-3 300/310/320. `round4Tail` records the full recipe.
- BQ still uses the Q pelvis drawing. The generic importer only emits non-arm swaps for an existing pelvis view: Code must explicitly carry BQ's tail swap/attachment/bands into its current view data. No runtime files or importer changes are delivered here.

## Validation and remaining gate

61 cuts checked: one 8-connected foreground component, 1536 × 2304 canvas, exact-green corner and inherited pivots unchanged. Original `grips` metadata is identical; whole-arm grip neighborhoods were checked separately. Detailed per-cut results and mask diagnostics are in `rig-source.json` → `round4Validation`.

The requested motion pass has **not been measured**: Code must import this source and run the T028 exposure/cut-edge and seam checks. Required: zero flags in idle, walk, turning slash and turn-around; every other move below 20 game px² per piece. These static source proofs do not establish that pass, and no pose or motion acceptance is claimed.

T028's current exposure check counts any pixels hidden at rest that later show, regardless of RGB or whether the material is now finished. Repainting can improve the drawing while retaining an area flag; the shortened/narrowed ends also need Code's geometry measurement. Do not treat the repaint as permission to waive a remaining flag.

Masked restoration preserves approved paint away from overlap/cut areas. Component cleanup removed residual cut scraps outside the masks on these cuts (source pixels): `{"torso": 1875, "leg-near-kneeup": 31, "pelvis-front": 167, "arm-near-smear-h": 11, "arm-near-smear-o": 1, "arm-near-mouth": 1, "hand-near-cup": 2, "leg-far-upper-back": 3}`. This is a local redraw of hidden surfaces and cut contours, not a promise of pixel-identical paint throughout every newly exposed region. Extreme-angle transitions and the new tail depth/attachment still require the viewer check. No requested source drawing is intentionally omitted; the runtime pass remains outstanding.
