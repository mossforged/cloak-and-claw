# A023 — Rat complete kit

Branch: `a023-rat-complete-kit`. State: **source; T028/T029 import and human phone-viewer review pending**.

## Delivered

24 new drawings, each on the 1536 × 2304 green source canvas:

- Torso: `torso-front`, `torso-away`, `torso-hunched`, `torso-lean-back`.
- Pelvis: `pelvis-side`, `pelvis-front`, `pelvis-back`.
- Heads: `head-front`, `head-shout`, `head-drink`; neck pivot remains `(880,1200)`.
- Shoulder overlays: `shoulder-near`, `shoulder-far`.
- Whole arms: `arm-far-raised`, `arm-near-mouth`, `arm-near-smear-h`, `arm-near-smear-o`.
- Hands: `hand-near-palm`, `hand-far-palm`, `hand-near-cup`, `hand-far-cup`, `hand-near-point`.
- Feet: `foot-near-heel`, `foot-far-heel`, `foot-near-out`.

Nine replacements: the six `hand-far*` files from A022, `arm-near-upper`, `arm-near-cocked`, `arm-near-raised`. Original foreground paint and pivots are unchanged; only hidden material extends. Earlier source folders are untouched.

Also: `rig-source.json`, exact `prompt.md`, unchanged A017 master as `reference.png`, full-resolution `views.png` and `turn.png`, comprehensive `review.png`, and detailed `review-views`, `review-arms`, `review-hands`, `review-feet`, `review-rest` sheets. There are 13 phone JPGs in `docs/screens/A023/`, quality 82, longest edge ≤2000. Each assembled view has its own readable phone JPG as well as the five-view overview.

No elbow/knee patches were drawn: the packet explicitly defers them until Code's stretch strip shows a need. Gear, masks, weapons, runtime and other docs are outside this delivery.

## Import

Merge the fragment after A018, A019 and A022. **Honor each entry's `source` folder.** Existing Q torso/pelvis entries point to A022; side/back torsos point to A018. Those entries add anchors and do not replace their images. Every new/repaired PNG lives in A023.

- `anchors` includes neck, both shoulders and waist for all seven torso drawings; waist, both hips and tail root for all four pelvis drawings. Coordinates are absolute source-canvas pixels. The common waist reference `(776,1382)` is distinct from the inherited pelvis pivot `(774,1460)`; preserve pivots and align the attachment references when swapping views.
- `views` groups torso and pelvis choices separately. `viewBands` declares Q/S/F/BQ/B ordering, cap visibility and the back-view leg/tail depth swap. `poseBandOverrides` records shield/beam foreground requirements. These are source declarations for T028, not an assertion that the current importer already supports that schema.
- Shoulder caps follow their upper arm, at its original shoulder pivot, and show only when that arm is in front. Whole-arm swaps hide the separate forearm/hand and inherit the upper arm's depth.
- Every touched far weapon grip retains A022's measured marker. New palm/cup/point grip records are **contact sockets**, not weapon openings. Whole-arm `itemGrip`/`slotDirection` markers are supplied. Smear ends use A022's actual side-grip hand cut; the overhead smear's duplicate pauldron was removed.
- New feet have `contactY:1950`; retain the swap's original ankle pivot and pose the ankle height for that contact rather than shifting the floor.
- In B, the pelvis contains a short outlined tail root. Overlay the existing tail at the new `tail_root`; do not leave the Q tail attachment on the outer hip.

The proofs use the declared per-view anchors and bands to attach the existing parts. They include Q, S, F, BQ and B beside the master at native canvas resolution and at 136 px. The slash strip is BQ/Q + cocked near arm behind → F/F + horizontal smear in front and near cap → Q/Q recovery. It is a static art proof, not a runtime clip or a completed rehearsal of every move.

## Verification

- 33 final cut PNGs: same 1536 × 2304 canvas, exact #00FF00 background, one 8-connected foreground component after keying (importer spill threshold, alpha >20). Reference and composite review images are intentionally excluded from the single-piece check.
- All nine repairs preserve every original foreground RGB pixel. Far wrist hidden ends extend about `(-55,-100)` source pixels; near shoulder extensions about `(+52,-68)`, clipped to narrow hidden-material regions. No disc or ball patches were added.
- The final Q rest assembly changes **174 pixels** versus A022's rest. Its strong interior RGB difference from the master is **3.0608%** (master foreground eroded by 3 px; any RGB channel differs by >40). This carries the existing foot registration/paint differences; it is not a zero-difference claim. `review-rest.png` shows master, A022 rest, A023 rest and absolute master difference without contrast gain.
- Phone export size and source-file scope checked. LFS tracks source PNGs; `review*.png` and phone JPGs stay in normal git. Runtime paint/stretch/hold tests require Code's import.

## Known limitations / human gate

**Strict “cut from the master's own paint, inpaint hidden areas only” is not achieved for the new views and key drawings.** Imagegen repainted visible anatomy and costume surfaces. The source-paint-only result applies to the nine seam repairs; the new poses are reference-guided best attempts. The exact prompts and processing decisions are retained.

At source zoom, the front/back seat-to-thigh transitions still show abrupt changes where the newly painted pelvis meets inherited Q thighs. The back proof also inherits forward-facing foot/leg surfaces, with the requested depth swap; no unrequested back-leg drawings were invented. Shoulder caps can show a doubled trim/button edge against the baked shoulder on a torso view. The out-turned near foot turns only modestly toward the camera. The drinking arm/head and new hand contact markers need a posed bottle/lift/cast check; the static sheets do not establish lip contact, every grasp, or clearance at extreme rotations. T029 should expose these issues before this body is called locked.

Nothing from the required 24-drawing inventory is missing. Human acceptance is still open: after T028/T029, does the rat turn into the swing, do the cap/wrist/seat transitions read as one piece, and can the drinking/lifting/casting keys reach their intended contacts?
