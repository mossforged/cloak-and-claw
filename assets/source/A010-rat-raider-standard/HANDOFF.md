# A010 — Rat Raider standard source kit

Branch: `a010-rat-raider-standard`. State: **source; rat look and bench motion approved (G2/G3), per the lead addendum dated 2026-10-16**.

The user chose **R, slightly rattier**, in this session. Only that head set is delivered. This branch starts from main and carries A009 forward into this folder; A009 itself does not need merging.

## Delivered

- All 15 standard core part names, separate pelvis, wrapped feet and hands, plus tail and scarf-tail.
- Seven hand swaps: front open/fist/grip; back open/fist/grip/pinch. `hand-front.png` defaults to grip; `hand-back.png` defaults to open. The near grip has an open shaft slot; the far grip has an enclosed shaft hole.
- Six R heads: neutral, attack, hurt, effort, KO and back. `head.png` is the neutral alias. The inherited R hurt expression is unchanged. Snarl is now named `head-attack.png`.
- Default, side and rear torso drawings, and `master-back.png` as the rear-view source.
- `sword.png` (**rejected provenance only; excluded from `rig-source.json`**): the original standee's chipped blade, gold guard and pommel, extracted at a uniform 2.895 source-pixel scale. The image tool painted only the hand-hidden leather grip. It replaces the old A004 review sword.
- `reference.png`: byte-identical approved A009 master. Visible body material is cut from that master at its original coordinates. New hidden joint paintings sit beneath the adjoining original layers. The selected R head, hand swaps and separate sword intentionally differ from the original master drawing.
- `part-layout.json`: measured source-canvas seam centers, parent attachment points, depth, bounds and swap pivots. `pivots.png` marks those landmarks on the master. All parts use a 1536 × 2304 canvas, with the original foot baseline at y=1997.
- `assembled-clean.png`: actual rest assembly on green. `assembled.png`: that assembly over the faded master on grey. No fitted standee is substituted for the assembly.
- `review.png`: full-size comparison, sword comparison, rear/view drawings, every named part and swap on grey, and the Harbor Market panel. `review-game-size.png` is the exact 960 × 540 panel: Mouse Fighter 130 px, standee and assembled rat 136 px.
- `prompt.md`, inherited `prompt-a009.md`, generation provenance, cut polygons, preparation transforms and measurements. No raw `generated/` directory is included.

## Known limitations / standard exceptions

- **The bench motion strip passed G3**, as recorded in the lead addendum. Hidden caps were painted from the cut pieces, but full circular coverage and a complete joint-width of extension are not guaranteed at every shoulder, wrist, hip and knee. Some hidden hip/cloth boundaries still carry master clothing material. Inspect these while bending the rig; a faithful resting assembly alone cannot validate them.
- **Front upper-arm depth is 590**, below the torso at 600, so the torso covers the shoulder-pad seam. This is the reviewed exception to the standard near-arm 800 band; watch the shoulder seam during the T018 import. The forearm, hand and weapon remain in the 800 band.
- The rear master and side torso are view-change edits of the approved character. Their clothing folds, ear/neck contours and fitted view proportions remain approximate. Back head and torso are cut from the rear master and uniformly registered to the common swap canvas; the transforms are recorded. They are not pixel-identical alternative rotations of the front drawing.
- Pivot points are picked on visible cuff, cloth and neck seams to the nearest source pixel. The anatomical center behind an occluding garment is interpreted from that seam; these are not A009's old target-box estimates. Rotation should be checked on the rig bench.
- The A003 item cutlass fits the unchanged near grip with the weapon behind the fingers. `cutlass-grip-check.png` shows the handle close-up, full assembly and game-size check; attachment settings are in `cutlass-grip-check.json`. Runtime weapon poses and the wrist overlap through them belong to T018.
- Fine whiskers and edges can retain keying softness. Sources use exact green backgrounds; final production keying belongs to import.

No required filename is missing. Gear refit, tint masks, face-detail overlays, spear/bow redraws and motion-strip implementation are outside A010.

## Addendum completed — 2026-10-16

- Added **`rig-source.json`**, the canonical bench/import manifest: 17 body/extra parts and 15 swaps, generated directly from `part-layout.json`. `file` maps to `img`, `pivot_canvas` to `pivot`, `depth` to `band`, and `replaces` to swap `of`. `master` is the actual filename `reference.png`; `floorY` is 1997. All measured points, parents and the reviewed 590 shoulder-band exception are preserved. No `dir` override is used. `part-layout.json` remains detailed provenance.
- **The rat holds the cutlass he drops:** `assets/source/A003-harbor-props/rat-cutlass.png`, imported as `assets/art/items/rat-cutlass.png`. `sword` is absent from the canonical manifest; its old PNG and older review images remain historical provenance. Use `cutlass-grip-check.png` for the current weapon fit.
- **Grip check: yes, the slot can take the A003 cutlass handle.** Checked using the existing item image, grip `[48,56]`, game scale `0.36`, and a 136 px rat. The unchanged hand's slot is at canvas `[330,1274]`, distinct from its wrist pivot `[410,1260]`. The handle is drawn behind the hand (example band 830, hand 840); fingers hide its wider sides and the slot reveals the leather grip. The preview uses a rigid -75 degree item rotation and uniform scale only, with no hand or weapon redraw. Code should attach from the item grip to the shaft slot, not the wrist pivot.
- Validation: the actual bench reader reports no errors or missing standard parts. Its standard strip keeps all 17 parts finite and joints connected across 289 sampled frames. The draft importer was exercised with all output directed to a temporary directory. These checks confirm manifest compatibility; T018 handles the game import.

The rat look and bench motion are approved. No further art approval question is pending for this addendum. Gear, recolour masks and face details are A011.
