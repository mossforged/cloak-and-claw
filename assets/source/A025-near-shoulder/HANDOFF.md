# A025 — near shoulder rides the arm

Branch: `a025-near-shoulder`. Unattended runner retry: correct folder verified, existing branch retained, no checkout/pull/branch switch or push. A024 and A020 inputs are now present. This delivery replaces the earlier missing-input report.

## Delivered

Eight replacement PNGs, all on the unchanged 1536×2304 source canvases:

- `arm-near-upper.png`: A024 arm, with a rounded metal/leather shoulder pad carried by the arm.
- `arm-near-cocked.png`, `arm-near-raised.png` (A024 current raised arm), `arm-near-mouth.png`, `arm-near-smear-h.png`, `arm-near-smear-o.png`: existing keys with the same pad oriented toward each key's upper arm; original fist, bracer, limb paint and item-grip locations retained outside the shoulder repair.
- `torso.png`, `torso-jerkin.png`: fixed shoulder plate removed; completed outlined vest/jerkin and fur beneath the moving pad.

Also: `rig-source.json`, `reference.png`, `prompt.md` (two exact built-in image-tool prompts), `self-check.json`, `review.png` (all eight drawings and 130 px harbor assembly), `review-paint.png`, and `shoulder-sweep.jpg`. Every review has a small normal-git JPG in `docs/screens/A025/`, plus source-pixel shoulder detail panels for all five angles and a reference JPG. Phone JPGs use quality 80, longest side ≤2000 px. No generated atlases or discarded variants are delivered. Only A025 files and its assets-ledger row were edited.

## Shoulder geometry and import

The user's joint points refer to the existing trimmed game drawings, not the full source canvas. Original importer trim origins are upper arm [378,1052], torso [456,1005], stored-image scale 0.4. Therefore:

- Near upper arm source pivot = [378 + 102/0.4, 1052 + 15/0.4] = **[633,1089.5]**.
- Torso source attachment = [456 + 54.5/0.4, 1005 + 33.5/0.4] = **[592.25,1088.75]**.
- The upper outer rim is a fitted circular arc of radius **139 source px**, centered on that upper-arm pivot. Uniform donor registration gives maximum measured arc departure **1.237 source px** (about 0.12 screen px at the inherited character scale). The source shoulder center stays fixed when rotated.
- The five whole-arm keys retain their existing **[555,1174] source shoulder pivots**, and each pad's arc is centered on that key's pivot. A key's trimmed-image coordinates differ from those of `arm-near-upper`; copying the upper arm's local point to a whole-arm key would detach its shoulder. Their other joint centers and grip points remain unchanged.

**Q draw order:** `arm-near-upper` now band 810, over torso 600 and torso gear 650, under the existing near forearm/cuff 820. Hide `shoulder-near` in Q; its separate cover is unnecessary and would duplicate the new pad. **Retain it in the other views** with their existing bands/visibility: those torso cuts still carry their old shoulder treatment and were outside this packet's repaint scope. Global removal is not established by this Q sweep.

**Code must explicitly honor the independent pivot/attachment in `jointPointOverride` and `attachCanvas`.** The generic source importer derives a shared canvas joint and does not currently read `attachCanvas`. Blindly merging this fragment would place the arm incorrectly. This is a source-data handoff, not an importer change. Whole-arm swaps use their own retained source pivot, attached at the same new torso shoulder anchor. Existing unrelated pivots/anchors, grips, split-hand data, canvases and all non-Q view settings remain inherited. The Q jerkin remains a replacement torso drawing; A020 tint masks are not newly certified for the repainted chest.

## Checks and limitations

- Inspected the assembled base and jerkin at **−61, −30, 0, +30, +59°** on the user's shoulder points, with the arm over the chest and the separate Q cap hidden. Source shoulder crops and complete 136 px bodies are supplied. All ten assemblies have positive shoulder/torso overlap; visually the shoulder stays connected, with finished cloth/leather exposed beneath it. This is a static source check, not a runtime seam-test pass.
- All eight final cuts have one 8-connected foreground component. Generated flecks were removed. Source dimensions and flat green exterior checked; preservation counts are in `self-check.json`.
- **Exact rest/master paint requirement is not met.** The circular pad was repainted by the tool, its outline is rounder/larger than the master's original asymmetrical plate, the user-set shoulder attachment changes the arm's rest placement, and the chest beneath it is newly finished. The comparison shows A017 master / inherited A024 source rest / A025 user-joint rest. Absolute RGB counts in `self-check.json` include inherited kit/master differences as well as this shoulder change. No zero-difference paint pass is claimed.
- The completed armhole has a fairly broad sleeve/vest rim visible with the arm raised. Thin inherited collar/bandana edge fringing remains on the ordinary Q torso outside the shoulder edit. The generated shoulder pad retains the original design but is not an exact pixel transfer of its metal interior. These are visible art limitations, not missing user instructions.
- Code still needs to import with the explicit shoulder override, check whole-arm keys in their actual poses, rerun the posed seam/exposure checks, and show the result in the Fitting Room. Other views were not repainted or cleared. No runtime or human-approval pass is claimed.

No question requires the user's answer during this unattended run. Git LFS is installed; source parts use LFS and review PNGs/phone JPGs use normal git. Final path-scoped commit succeeded after the earlier index/LFS refresh failures. The runner is responsible for pushing. No push was attempted.
