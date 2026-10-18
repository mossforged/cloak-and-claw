# A023 Round 3 — rear fixes and turned-away torso

Branch: `a023-r3-rat-back-fixes`. Based on pulled main `03a06cf`. Source delivery; pushed for review, **do not merge automatically**.

## Delivered

- `foot-near-back.png`, `foot-far-back.png`: recut from the approved A017 back reference, with heel toward camera and toes angled right. Matching `leg-near-lower-back.png` and `leg-far-lower-back.png` recuts remove the old straight-away heel painted into the lower shin. Feet continue to y1680 in anatomical B setup, 65 source px above y1745, hidden under shin/thigh.
- `hand-near-back.png`: viewer-right B hand. Wider recut from the accepted round-2 rear drawing retains the whole thumb. Arm drawings and approved split grip pairs are untouched.
- `pelvis-back.png`, `leg-far-upper-back.png`: local inpainting removes baked-in pink tail paint and reconstructs hidden cloth. Separate tail images are unchanged. The B tail bands now sit **below pelvis** and the rear tail anchor is `(490,1525)`, so the outlined tail emerges beside the trousers with its end covered. This supersedes the older view table's instruction to put the back tail in front.
- `torso-away.png`: reference-guided back-panel redraw, crossed straps and back scarf knot, near shoulder drawn back. Same inherited torso pivot; updated neck/shoulder anchors. Q hips and existing neutral head are retained for the twisted wind-up; head looks back toward the right-hand target. No new pelvis-away or head drawing.

Eight changed cut PNGs, updated `rig-source.json`, `views.png`, `turn.png`, `review.png`, `review-views.png`, `review-back.png`, `review-r3-back.png`, `review-r3-turn.png`, exact prompts in `prompt.md`. Phone copies: `docs/screens/A023/r3-back.jpg` and `r3-turn.jpg`; overview and B/BQ copies refreshed. All new review JPGs are quality 82, long side <=2000.

## Import and reproduce the proofs

Merge the fragment after prior A018/A019/A022/A023 data; honor each source path. All cut images are 1536 × 2304 on exact green, and all repaired pivots are unchanged. No runtime files were edited.

- Use the existing B `viewSwaps` and `viewJointPositions` for rear limbs; source pivots differ from assembled rear positions. Keep shin above foot and cuff above hand.
- B `tail-1/2/3` bands are 300/310/320, below pelvis 400. Apply the updated pelvis-back tail anchor. Do not retain the old 430/440/450 tail bands.
- `torso-away` neck `(805,1180)`, near shoulder `(550,1160)`, far shoulder `(982,1170)`, waist `(776,1382)`. Pivot remains `(776,1382)`. Near arm is entirely behind torso. `reviewPoses.BQ` records the source proof's cocked-arm transform; this is a static pose recipe, not a runtime change.
- `turn.png` / `review-r3-turn.png` show Q → BQ → B at native cut scale and 136 px character height. `review.png` also shows 130 px assemblies over harbor art. These images are composed from delivered parts, not painted-over full characters.

## Validation and limitations

All eight changed cuts pass single 8-connected foreground, same-canvas, exact-green corner and unchanged-pivot checks. The new torso's central neutral overlap with the retained Q pelvis is at least **87 source px** (40 required). `round3Validation` records results. Scope is A023 sources, A023 phone copies and the A023 asset row only.

The turned-away torso and tail-covered cloth are reference-guided repaint, not pixel-identical master paint. BQ retains Q hips and head for a torso-twist wind-up; the turn's anatomical readability still needs the user's viewer judgment. Hidden straight cut edges require the stated overlaps. Existing Q ankle notches and inherited rear head/scarf junction are outside this round. Runtime motion, extreme rotations, tail attachment and every rehearsal move still need Code's import and seam checks; no runtime or human-acceptance claim is made. No requested source drawing is intentionally omitted.
