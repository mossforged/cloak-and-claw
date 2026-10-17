# A016 — Mouse Fighter key drawings

Branch: `a016-mouse-key-drawings`. State: **source; static review delivered, human stretch-strip and motion gates open**.

Delivered the six named PNGs, `rig-source.json` containing only the six `swaps` entries, `review.png`, and `prompt.md`. Every part is on the exact A013 1536 × 2304 green canvas. Pivot coordinates exactly equal the A013 ankle, hip or shoulder values, and each pivot is inside opaque material. Whole limbs replace their upper slot and hide its lower/hand/foot children. Replacing the upper slot itself is implicit in `of`; do not hide that slot as well.

Merge the fragment's `swaps` into A013's manifest. Resolve these six image paths relative to A016; keep old images relative to A013. These filenames deliberately retain the packet's front/back vocabulary; T024 may alias front = near, back = far. No alternate runtime scale is required.

`arm-front-cocked` includes measured `itemGrip` and `slotDirection`, using the same convention as A013's raised arm. It contains the arm and closed fist only. The unchanged A002 sword remains a separate item attached to the fist; the review uses that item, not a newly painted sword. The closed glove occludes the handle. The whole-arm replacement inherits A013 upper-arm band 590, so Code must inspect torso/head occlusion and item following in the stretch strip; the old hand must not also draw.

`review.png` has six **1:1 full source-canvas** overlays on a faded A013 body master, with gold pivot rings and the original floor line y2050. Faded original limbs are registration guides, not extra drawn limbs in the swaps. It also includes each isolated silhouette on grey and a native 960 × 540 Harbor Market panel with the six requested static poses. These are actual part assemblies, at one uniform source scale chosen so the neutral mouse body is 130 px tall. Squat/kneel/lying naturally occupy less height. Static poses are illustrations of use, not an exported Code stretch strip or evidence of motion approval.

## Preparation and limitations

The inputs were cut A013 parts, rigidly articulated on their original canvas and sent to the image tool as cropped edit targets, with A013's approved master as identity reference. Two isolated kneeling edits failed output moderation; an edit of the full master produced the kneeling leg, which was polygon-cut and registered. Exact prompts, guide transforms, selected-image registration, cut polygon, and cap preparation are in `prompt.md`. No raw/discarded tool files are committed.

**The strict original-pixel/inpaint-only rule is not fully met.** Although these are edits of the actual master cuts rather than independent limb designs, the tool repainted visible fur/leather beyond the requested hidden/bent joint areas. Small original proximal patches are restored through a soft silhouette-clipped mask, but most edited visible surfaces are repainted. Treat this as the packet's best-attempt delivery and review the material/shape continuity. Rounded overlap is present at each pivot, but a complete one-joint-width circular cap is not guaranteed on every silhouette.

The knee-up edit initially duplicated the boot cuff. A targeted edit removed the duplicate; the distal boot was then cut and uniformly registered at x0.70 around the knee to recover its source length. The thigh retains its separate source registration; no nonuniform stretching is used. A subtle join below the knee and the boot's long shaft need close review at game size.

Toe-off toes extend roughly 65–67 source pixels below A013's neutral floor if the ankle is left at its rest position. This is expected contact geometry for a raised ankle: Code must lift the ankle/solve the leg for ball contact in the push-off pose. The full-canvas overlays deliberately expose this instead of moving the pivot or hiding the difference. The folded far leg is tightly compressed; its shin is mostly occluded, so the bend may read as a tucked boot until seen in motion. The cocked elbow is more wound than the raised-arm swap, but whether it gives enough heavy-attack anticipation remains a human motion judgment.

Static checks passed: six RGB PNGs with exact canvas size and #00FF00 outer background; all six inherited pivots match A013 exactly and overlap opaque parent-joint material; all `of`/`hide` names resolve; whole-limb hide lists and arm socket fields are present. Git LFS tracks the six part PNGs; the review and text stay in normal git.

No required filename is missing. No runtime, importer, game assets, other documents, gear or masks were changed. Code's T024/T025 import, stretch checks, floor IK, item-following, and the user's motion acceptance remain outstanding. Review question: do the toe-off, folded squat, raised knee, kneel, and cocked wind-up read clearly in motion without visible seams?
