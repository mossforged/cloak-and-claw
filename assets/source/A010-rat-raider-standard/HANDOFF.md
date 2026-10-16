# A010 — Rat Raider standard source kit

Branch: `a010-rat-raider-standard`. State: **source; G2 human look review pending**.

The user chose **R, slightly rattier**, in this session. Only that head set is delivered. This branch starts from main and carries A009 forward into this folder; A009 itself does not need merging.

## Delivered

- All 15 standard core part names, separate pelvis, wrapped feet and hands, plus tail and scarf-tail.
- Seven hand swaps: front open/fist/grip; back open/fist/grip/pinch. `hand-front.png` defaults to grip; `hand-back.png` defaults to open. The near grip has an open shaft slot; the far grip has an enclosed shaft hole.
- Six R heads: neutral, attack, hurt, effort, KO and back. `head.png` is the neutral alias. The inherited R hurt expression is unchanged. Snarl is now named `head-attack.png`.
- Default, side and rear torso drawings, and `master-back.png` as the rear-view source.
- `sword.png`: the original standee's chipped blade, gold guard and pommel, extracted at a uniform 2.895 source-pixel scale. The image tool painted only the hand-hidden leather grip. It replaces the old A004 review sword.
- `reference.png`: byte-identical approved A009 master. Visible body material is cut from that master at its original coordinates. New hidden joint paintings sit beneath the adjoining original layers. The selected R head, hand swaps and separate sword intentionally differ from the original master drawing.
- `part-layout.json`: measured source-canvas seam centers, parent attachment points, depth, bounds and swap pivots. `pivots.png` marks those landmarks on the master. All parts use a 1536 × 2304 canvas, with the original foot baseline at y=1997.
- `assembled-clean.png`: actual rest assembly on green. `assembled.png`: that assembly over the faded master on grey. No fitted standee is substituted for the assembly.
- `review.png`: full-size comparison, sword comparison, rear/view drawings, every named part and swap on grey, and the Harbor Market panel. `review-game-size.png` is the exact 960 × 540 panel: Mouse Fighter 130 px, standee and assembled rat 136 px.
- `prompt.md`, inherited `prompt-a009.md`, generation provenance, cut polygons, preparation transforms and measurements. No raw `generated/` directory is included.

## Known limitations / standard exceptions

- **Motion has not passed G3.** Hidden caps were painted from the cut pieces, but full circular coverage and a complete joint-width of extension are not guaranteed at every shoulder, wrist, hip and knee. Some hidden hip/cloth boundaries still carry master clothing material. Inspect these while bending the rig; a faithful resting assembly alone cannot validate them.
- **Front upper-arm depth is 590**, below the torso at 600, so the torso covers the shoulder-pad seam. This differs from the standard near-arm 800 band and needs review before import. The forearm, hand and weapon remain in the 800 band.
- The rear master and side torso are view-change edits of the approved character. Their clothing folds, ear/neck contours and fitted view proportions remain approximate. Back head and torso are cut from the rear master and uniformly registered to the common swap canvas; the transforms are recorded. They are not pixel-identical alternative rotations of the front drawing.
- Pivot points are picked on visible cuff, cloth and neck seams to the nearest source pixel. The anatomical center behind an occluding garment is interpreted from that seam; these are not A009's old target-box estimates. Rotation should be checked on the rig bench.
- The near hand's straight shaft slot and the diagonal cutlass handle are a close static fit, not a validated weapon animation attachment. The two wrists and their cuff overlaps also need the motion check.
- Fine whiskers and edges can retain keying softness. Sources use exact green backgrounds; final production keying belongs to import.

No required filename is missing. Gear refit, tint masks, face-detail overlays, spear/bow redraws and motion-strip implementation are outside A010.

## Review question

Does the R assembly still read as the standee's rat, and does the restored standee cutlass look right? Review the depth exception and joint limitations above before treating G2 as passed.
