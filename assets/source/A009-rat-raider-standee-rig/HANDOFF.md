# A009 — Rat Raider standee-based source rig

Branch: `a009-rat-raider-standee-rig`. State: `source`; human look review pending.

## Delivery

- All 22 requested part PNGs, including byte-identical `head.png` / `head-neutral.png`, fifteen body/limb/hand pieces, and six expression heads. S has the standee's short muzzle and large ears; R has a modestly longer muzzle and visible incisors. Both hurt heads retain squeezed-shut eyes and a gritted wince.
- `reference.png`: high-resolution redraw using the original art-bible standee as the image input, with its low wide crouch, brown fur, big ears, patched clothing, belt/pouch, thick limbs and wrapped feet.
- `assembled-s.png`, `assembled-r.png`: actual delivered parts at their delivered placements, without a weapon. These expose the real fitting result rather than substituting the generated reference.
- `review.png`: original standee, both actual assemblies and T011 variant C at equal silhouette height; exact-size 960 × 540 Harbor Market panel; all distinct parts on grey. `review-game-size.png` is the separate panel, Mouse Fighter 130 px, rats 136 px. The review sword reuses A004's existing sword, uniformly resized and rotated; no new weapon source is delivered.
- `fit-check.png`: each part over the faded reference, plus both actual assemblies over the faded original standee at equal body height.
- `prompt.md`: exact built-in imagegen prompts, including corrective attempts. `generation-inputs.json`: selected outputs and prompt provenance. `generated/`: selected unresampled tool outputs. `part-layout.json`: source placement/scale/rotation metadata. `prepare.py`: mechanical keying, uniform fitting and review preparation only; not a runtime rig or game-code change.

## Canvas, scale and measurements

Every individual part, reference and assembled preview uses the same **1536 × 2304 opaque exact #00FF00 canvas**. The reference is uniformly scaled to approximately **1350 px body height** and placed at `(20,650)`. The actual assembly is about 2% taller because the near boot sits slightly lower. Use silhouette height rather than canvas height to import. No anisotropic resizing, code-drawn anatomy, runtime thickening or game changes were used.

The following near-side thickness checks use corresponding landmarks and transverse foreground spans. Numbers are percentages of body height: original standee ≈467 px, source reference normalized to 1350 px. `measurements.json` records the pixel probes, directions and placement adjustments. These are local silhouette measurements, not claims of exact anatomical registration.

| Width | Standee | Redrawn reference | Delivered part |
|---|---:|---:|---:|
| Upper arm, including shoulder clothing | 14.2% | 15.1% | 14.4% |
| Wrapped forearm | 11.8% | 11.2% | 11.0% |
| Distal patched thigh | 13.7% | 14.1% | 16.2% |
| Wrapped calf | 9.4% | 10.1% | 9.2% |
| Near foot/boot width | 18.0% | 20.1% | 18.9% |

The redraw and fitted parts are substantially shorter and fuller than A004/A005. Thickness revisions were generated as new artwork; final preparation only rotates, uniformly scales and positions the pieces. Hidden joint ends overlap in the static assembly. Joint fit has not been tested in motion.

## Remaining fit and look limitations

- This is a close redraw and fitted set of separate drawings, not a pixel-aligned dissection. The torso/belt/hem, near knee, far elbow, scarf curve and feet positions differ from the standee. The near foot is lower and the distal near thigh is about 18% broader by the sampled measure. Rounded joint caps and seams can still become visible during rotation; inspect the fit sheet before import.
- Fur and leather are somewhat warmer/brighter than the original. Neutral is a closed-mouth sneer, whereas the original standee is shouting; compare S snarl for the closest expression match. S snarl still has prominent teeth, so S/R differ less in snarl than in neutral/hurt. Ear and cheek contours vary slightly across expressions despite a common top and head height.
- Torso-back is a stylized rear three-quarter view and retains short furry shoulder sockets. The head and body part layers need their own new anatomical anchors: matching A004's names and canvas does **not** mean A004's old joint coordinates fit this crouch unchanged.
- Grip and pinch hands are supplied, with the near grip separated from its forearm. Weapon hole/string attachment and the shortened far forearm swaps still need fitting during import. No spear/bow animation or gear refit was attempted.
- Mechanical keying may omit fine whisker/antialias pixels or leave small green edge fringes. Final production edge cleanup belongs to import. The generated reference's far claw is very close to its raw image edge; the separate delivered parts have clear canvas margins.

No requested file is missing. All part dimensions, green canvas corners, unclipped delivered bounds, head alias identity and edit scope were checked. Review, fit sheet and game-size panel were visually inspected. Only this A009 source folder and A009's row in `docs/assets.md` changed.

## Human look gate

Does the assembled rat match the standee's character, bulk and crouch closely enough? Which head set should be used: **S** or **R**? Gear refit and game import follow after that choice. Source delivery is not look approval.
