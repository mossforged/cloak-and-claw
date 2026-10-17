# A019 — Rat Raider whole-limb keys and toe-off feet

Branch: `a019-rat-key-drawings`. State: **source; Code import, stretch-strip check and human motion review pending**.

## Delivered

Nine drawings: cocked and raised near arms; raised-back and guard far arms; kneeling and knee-up near legs; folded far leg; near/far toe-off feet. Two replacement parts: `arm-near-upper.png` and `leg-far-upper.png`. All eleven source PNGs use A018's 1536 × 2304 canvas and unchanged shoulder/hip/ankle pivots, flat #00FF00 background, no ground shadow.

Also included: `rig-source.json` fragment, exact image-tool prompts in `prompt.md`, and `review.png`. Phone copies are in `docs/screens/A019/`: overview, arms, legs/feet, joint fixes and game-size poses. The source-scale review places each drawing over a faded A018 rest assembly; gold crosses mark the unchanged attachment pivots, blue circles mark the reposed joints. The game strip uses a uniform scale corresponding to a 136 px standing rat.

## Construction and registration

The limbs are the A018 cuts derived from the approved A017 master, rigidly rotated and translated without stretching. The image tool repairs bends and supplies hidden overlap paint. Its repaint outside the repair regions is discarded; native reposed pixels are retained outside those regions. Detached scraps are removed. Repair circles and exact prompts are recorded in `prompt.md`.

The cocked near arm has the elbow above and behind the shoulder, with the fist at the lower ear. The raised near arm is vertical. The far draw arm returns its elbow behind the shoulder; the guard forearm crosses inward. The folded leg retains the original full-size foot and a separate visible shin. The toe-off feet point down from the unchanged ankle pivot; their toes bend toward a horizontal contact.

Merge the fragment into A018, resolving this fragment's image paths from A019. `of` selects the upper part being swapped; `hide` suppresses its lower part and hand/foot. The four arms include `itemGrip` and `slotDirection`, transformed from their A018 grip hand. The two replacement parts retain A018's parent, band and pivot. No reference PNG is duplicated: the approved rest reference remains A018's `reference.png`.

## Validation and limitations

- Source dimensions, all nine swap targets, hide references, unchanged pivots and four item attachment markers checked. All requested filenames are present.
- The hidden shoulder cap and far hip cap are enlarged toward the two lying-pose gaps. **The old 9.3 px / 3.3 px flags are not claimed cleared:** Code must rerun the stretch strip with the replacements. Inspect the enlarged near shoulder for a visible round bulge over the vest/scarf.
- Repairs are inpaints over reposed cuts, not a claim of pixel identity at bends. The kneeling shin/foot repair had to extend across visible paint to remove a gap and clipped toe edges: **the strict hidden-area-only rule is not fully met there**. Some inherited A018 joint texture and clothing edges remain visible at source scale. Rotated native shading follows the original cuts; review under motion lighting.
- The first cap edits did not extend enough; a second pass used circular magenta inpainting guides. The shoulder tool added an unwanted leather rim, removed by a third edit; only the inner radius 130 is accepted beneath the original cut (requested radius 155). Far hip accepts radius 118. The caps are best attempts, with exact pivots retained; review for overpainting and remaining seams. Whole-limb shoulders retain the reposed A018 caps and also require stretch checking.
- The bow-draw and guard arms need the forearm/fist visible in front of the torso/head where appropriate. The game review deliberately shows these keys above the body for attachment inspection; default far-upper depth alone can hide them. Final occlusion and item placement must be judged after import. No weapons are painted into these keys or added by this packet.
- Toe-off requires an explicitly raised ankle to keep the ball on the floor. The source ankle pivots have not been moved. Solid contact y is 2048 near / 2077 far, requiring ankle lifts of 98 / 127 source px to meet A018's y1950 floor (also recorded in the fragment). Apply the floor-line rule; do not compress the foot. The static push-off review is illustrative and does not establish the walk's floor clearance.
- Review poses are static source assemblies. Kneeling, squat, jump tuck, full draw and wind-up still require human review in motion. No new-seam-under-2-px result or human approval is claimed.

Nothing is missing from the requested source inventory. Gear, masks, weapons and game/runtime changes remain outside A019. Next: Code imports the fragment and replacements, runs the stretch strip (including lying), then the user judges wind-up, full draw, kneel and squat in the model viewer.
