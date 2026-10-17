# A017 — Rat setup-pose master (G1)

Branch: `a017-rat-setup-master`. State: **source; human G1 pending**.

Delivered `master.png`, `master-back.png`, `head-offset.json`, `review.png`, and exact tool prompts in `prompt.md`. Both masters are 1536 × 2304 with exact green backgrounds. Front silhouette is 1352 px tall; rear is 1280 px tall. The review compares the new master with A010 and the art-bible standee at source scale and at 136 px over Harbor Market, includes the rear master, and marks expected joints and floor.

## Head carry-over

The approved A010 neutral head is pasted without any repaint, rotation, scaling, or interpolation. The rear head is also carried over. Both use the same translation: **dx=-114, dy=-50**. All 306,987 non-green neutral-head pixels and 234,258 non-green rear-head pixels match exactly (zero changed pixels). Background green is excluded from the head comparison so the body can show behind it. A010's existing green edge fringe and isolated rear contour marks are retained; production keying can address fringe. All six heads and head gear should receive this one offset, subject to the later collar-fit check.

## Setup and checks

Both arms hang away from the belly with relaxed fists, and legs are under the hips with separate thigh clothing. Tail hangs down/back. Body and clothing are newly painted by image_gen; no body parts have been cut and no code changed. The torso keeps the slightly hunched rat character. The head size is unchanged, so its proportion to the new upright body is for G1 to judge.

Expected anatomical centers, interpreted under clothing, are in `head-offset.json` and marked on the review. Shoulder–elbow–wrist lengths are 323.4 / 328.9 px (1.67% difference); hip–knee–ankle lengths are 340.1 / 338.0 px (0.62%). These are G1 estimates, not final A018 pivots or a motion validation.

## Known flaws / best attempt

- The generator did not fully meet the shared floor rule. Front far sole is about 27 source px above the near sole (about 2.7 px at game size); rear soles are roughly 30 px above the front baseline. Floor guide **y=1950** is marked in review and recorded in JSON. No floor line is baked across the source artwork. This needs art review before parts are cut; no runtime or limb warp workaround is proposed.
- The scarf hangs lower than A010 but still flares diagonally behind the near arm. It may obscure some shoulder silhouette in the back view.
- The rear body is a separate view drawing: folds, hand silhouettes and torso details vary slightly, and the rear silhouette is about 5% shorter than the front. The head is exact, while body view registration remains approximate.
- Cloth separates at the crotch, but the later pelvis/thigh cuts still need hidden overlap painting. No claim of cut-ready hidden joint coverage is made at G1.
- The tool repainted the body to change the setup pose. Identity fidelity of the new body beside the standee requires the human check.

No required filename is missing. Parts, swaps, gear, masks, weapons, import and motion are outside this packet.

**G1 question: beside the standee and A010, is this still our rat?**
