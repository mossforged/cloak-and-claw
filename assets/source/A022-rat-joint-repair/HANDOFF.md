# A022 — Rat joint repair

Branch: `a022-rat-joint-repair`. State: **source; Code re-import and user review in the phone viewer pending**.

## Delivery

25 replacement PNG cuts, all on the unchanged 1536 × 2304 source canvas, exact green background, unchanged attachment pivots and filenames. Resolve this delivery after A018 and A019. Earlier folders are untouched.

- Shoulders: `arm-near-upper`, `arm-far-upper`, `arm-near-cocked`, `arm-near-raised`, `arm-far-raised-back`, `arm-far-guard`. The large A019 near shoulder ball is removed; shorter plain-fur ends tuck beneath the torso. The four whole arms also carry repaired hands and wrist blends.
- Hands: `hand-near`, `hand-far`, both `-fist`, `-open`, `-grip`, `-grip-overhand`, plus `hand-near-pinch`, `hand-far-shield`. Default fists restore A017 native colors in their cut masks; variants edit those fists. The A010 grip supplies the side-on finger/slot reference. No circular wrist cap remains on these hands. Side grips have narrow open-ended slits; overhand grips have a crosswise slit before wrist registration. Shield fist closes toward the palm, with its strap mostly occluded.
- `torso`: master-colored shoulder/vest edge restored and extended over the upper-arm attachment; generated circles and detached scraps reduced. The existing side/back views cover the shorter shoulder ends in the static angle check and are retained unchanged.
- `tail-1`: pink outlined root extended up/right beneath the seat, without trouser paint. Lower tail paint retained.
- Forearms: `arm-near-lower`, `arm-far-lower` lose disconnected scraps and the glove-colored round extension beyond each wrist plane. Native bracer paint remains, ending at the unchanged wrist pivot and overlapping the shorter hand wrist. This prevents the old lower-arm cap from looking like extra fingers when the new hand follows a weapon. Rest paint metrics are unchanged by this trim.
- Cleanup-only replacements: `pelvis`, `leg-far-lower`, `head-back`. These only lose disconnected foreground islands. Back head's main shape is unchanged; this is the packet's explicit all-cut cleanup exception to keeping heads.

Also delivered: `rig-source.json` fragment, exact prompts in `prompt.md`, `rest-diff.png`, comprehensive `review.png`, six detailed review PNGs, and seven phone JPGs under `docs/screens/A022/` (quality 82, longest edge ≤2000).

## Import notes

Merge this fragment after both previous fragments. Each image referenced by this fragment resolves in A022. All original pivots, parents, names and canvas dimensions are retained. Do not revert A019's separate far-thigh repair or its whole-leg keys.

The near upper arm now has band **590**, behind torso 600. Hand bases are **815 near / 115 far**, underneath their lower-arm bracers (820 / 120). Apply these band changes as well as the images so wrist ends stay hidden. Weapon-node and two-handed far-hand overlay behavior still belongs to Code; these are source depth declarations, not a runtime patch.

`grips` measures centers and two-point directions in full source canvas coordinates for all six attachment hands. Four whole-arm swaps retain their `of`, `hide`, shoulder pivot and joint centers, and update `itemGrip` / `slotDirection` for the replaced hands. The guard's closed-fist strap center is an attachment marker rather than an empty cut-through slot.

## Checks and evidence

- Checked all **36 A018 cut PNGs** and **11 A019 cut PNGs** using an 8-connected foreground component pass; 13 A018 files contained islands, none of the A019 cuts did. A019's later near-upper replacement supersedes the dirty A018 near-upper cut. All 25 final A022 cuts contain exactly **one** component, with no detached pixels of any size under the documented green-key mask. Review, reference and difference composites intentionally contain many shapes and are excluded from the one-part requirement.
- Shared dimensions and pivots verified. Only the source folder, its phone review copies and the A022 state row in `docs/assets.md` change.
- Rest reassembled in declared depth order, using A018 plus A019's latest parts and A022 replacements. `rest-diff.png` is the full-canvas absolute RGB difference from A017 `master.png`, without contrast gain.
- **24,803 / 804,523 interior pixels differ strongly: 3.0829%.** Interior = A017 foreground eroded by 3 px; strong = maximum channel difference >40/255. Master uncovered = **1.2770%**; parts outside master = **1.2597%**, both relative to master foreground. **20,109 of the strong differences (81.1%) occur below source y1820**, where the inherited feet were translated for the shared floor; above y1820 the interior strong difference is **0.6293%**. This is not a zero-difference paint pass.
- `review-shoulders` shows each of six shoulders at -60°, 0°, 90°, 150° behind the front torso, plus paired upper arms behind unchanged side/back torsos at those angles. It isolates attachment areas; some distant hands are cropped out. Head omitted to expose the cuts.
- `review-tail` rotates the pelvis -10°, 0°, +10° while holding the tail fixed, which keeps the extended root under the seat. Lower tail segment cut edges are inherited and still visible at source zoom.
- `review-hands` compares each hand to A010 and A018. `review-holds` shows cutlass side grip, spear overhand and bow/nock holds, also at 136 px standing height over Harbor Market. Static source assemblies use rigid limbs and weapon-aligned hand slots; they do not establish any runtime stretch/hold test result. Bow review uses a foreground item and far-hand overlay so the grasp can be inspected.

## Limitations and next gate

The exact master-color acceptance is **not fully met**: remaining differences are quantified above, chiefly inherited foot registration, with some scarf/cut contours and repaired shoulder/hand transitions. The tool repainted visible hand anatomy and whole-arm wrist blends; original visible elbow/bracer/body pixels were restored outside accepted repair areas, but this is not a strict hidden-paint-only result. Shoulder edge repair and slit orientation must be judged in motion. Side/back torsos were not repainted or extended because the static shorter-shoulder check showed coverage; motion may reveal another angle needing repair.

No source inventory item is missing. No runtime seam-clearance, full hold-test pass or human approval is claimed. Gear, masks, weapons, game art and code remain outside A022.

Next: Code re-imports A022 including its grip markers and depth declarations, reruns the paint/stretch/hold checks, then the user judges in the phone viewer. Review question: does the rat read as one piece of art through motion, with natural wrist joins, correct weapon holds and no butt–tail gap?
