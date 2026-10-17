# A018 — Rat Raider base parts (G2 source)

Branch: `a018-rat-parts`. State: **source; G2 stretch strip and human review pending**.

## Delivery

19 base parts: pelvis, torso, head; upper/lower near and far arms, hands; upper/lower near and far legs, feet; tail-1/2/3 and scarf-tail. Ten named hand swaps (fist/open/grip/grip-overhand both sides, near pinch, far shield), torso-side/back, five carried head expressions, reference.png, rig-source.json, review.png and exact image-tool prompts. 38 PNGs total; all source canvases 1536×2304 on #00FF00. The reference is the unchanged approved A017 front master.

The JSON records shared canvas pivots, parents, standard depth bands, grip centers/axes, sockets, circular overlap radii and foot translations. Pivots are measured cut-joint centers interpreted under the clothing, not coordinates from a runtime rig. All grips use the standard `of`, `center`, `direction` fields; supplemental degrees are also recorded. Sockets use source-canvas coordinates. The current importer derives its own sockets, so Code should compare these explicit attachment points during T026.

## Checks

- Rest silhouette against A017: **0.847% master uncovered / 1.250% parts outside**, under the ~4% packet targets. Foreground mask: green >180 and greater than red/blue by 1.3× is excluded. These are silhouette scores, not a claim of paint identity or seam clearance in motion.
- All six heads: **zero changed pixels** after the single translation (-114,-50), including the original edge fringe. Head-neutral is `head.png`. No scale/rotation/repaint.
- Both soles: **y=1950**, inclusive last solid pixel. Near foot moved -1 source px; far foot +26 source px. The far ankle pivot moved with its foot. Both shin/ankle overlaps remain source artwork, with no stretching.
- Source dimensions, required part/swap references, head identity and soles checked independently.
- Temporary import through `tools/rig_from_source.py --height 136` writes only under `/private/tmp/a018/`; no game art, code or tools are delivered or modified.
- Review inspected at full character scale and game size. No runtime stretch-strip pass claimed; Code runs that on import.

## Limitations / best attempt

- The image tool did not preserve the joint sheet's visible pixels. The body therefore remains native master cuts, with separately generated circular material patches beneath them. Registered master pixels are repeated over the overlap where needed to keep a front-drawn cap from covering the approved belt/shoulder/boot detail. **This is not a fully anatomical hidden-area inpaint**: deep bends can reveal adjacent garment texture and dark overlap edges. Shoulder, hip and ankle joins need special attention in the stretch strip.
- The immutable-head requirement conflicts with repainting its neck end. Heads remain exact; the rounded collar/neck support is on the torso instead. The tilted-head seam must be checked by Code.
- Some detached master contour pixels remain in individual cuts. Green fringe inherited from the approved head is deliberately untouched. A small tail cap bulge and the moved far boot's upper edge remain visible at source scale.
- The tool repainted visible leather/fur in the torso side/back swaps and introduced sleeve-like fur stubs. Side is a three-quarter-to-side drawing rather than a strict profile. These are best-attempt view drawings, not pixel-preserving back cuts; inspect shoulder coverage and silhouette in the view swaps.
- Open/grip/pinch/shield hands are repainted from the master's fists. The overhand grip reads as knuckles crossing the handle; its shaft opening is mostly occluded. Slot axes are source markers for the intended holds; cutlass/spear/bow alignment and shaft visibility still need the T025/T026 weapon-node check.
- No 90°/150° seam result or human approval is claimed. The explicit joint radii are intended to provide circular overlap, but the two-pixel motion seam target is unverified.

No required filename is missing. Whole-limb keys and toe-off feet remain A019; gear and masks remain A020. Weapons, game import and code changes are outside this delivery.

Next gate: Code imports this source for the G2 stretch strip, then the user judges whether the reassembled rat still matches A017 and holds the cutlass, spear and bow. Do not stack A019 keys on these cuts until that gate passes.
