# A007 — Harbor Market stage kit

Branch: `a007-harbor-stage-kit`. State: **source; human look approval pending**.

## Delivered

- `far.png`: transparent sky, distant sea/headland/lighthouse/sails, 2172 × 724.
- `back-1.png`: market entrance arch, 2048 × 768.
- `back-2.png`: busy stalls and moored blue ship, 1983 × 793.
- `back-3.png`: warehouse double-door encounter area, 2048 × 768.
- `floor.png`: empty limestone walking surface, timber/stone dock face and water below, 2172 × 724.
- `front-post.png`, `front-net.png`, `front-lamp.png`: three separate transparent foreground pieces, all at least 1024 px on the long side.
- `review.png`: 960 × 540 mock frame, existing-market comparison, all three segments side by side, repeated floor, every source on grey.
- `frame.png`: standalone full-size mock frame for close inspection.
- `review-layout.json`: measured review layout; `prompt.md`: exact eight built-in imagegen prompts and settings.

Generated PNGs were copied unchanged, preserving their alpha. No keying, painting, seam repair, code changes, or runtime imports were performed. The old character standees in the review are scale references, not new character deliveries.

## Scale and alignment used in review

The game-size mock viewport is **960 × 540**. Floor back edge is **y=390**, front lip approximately **y=510**, giving **120 px** of nominal walkable depth. Individual lip stones vary by several pixels. Mouse visible height is **130 px**, feet at y=390; Rat visible height is **136 px**, feet at y=510. No perspective size change between lanes.

Back segments are shown at **1440 px wide**. Full source canvases are resized vertically so their bottom scenery baseline lands at y=390: measured native baselines are y=700 / 742 / 703 for segments 1 / 2 / 3. Resulting drawn heights are 428 / 417 / 426 px. These are independent horizontal and vertical scales; the review compresses the source scenery vertically to fit the gameplay frame. Source canvases were not normalized to 1440 × 540. Their transparent margin continues beneath the scenery. Segment 2's mock placement is x=-240, y=0. The wide strip places segments at x=0 / 1440 / 2880 without overlap or additional covers, so actual joins are visible.

Floor source walking area ends near native y=370. Review drawing size is **1440 × 235**, at y=390, making that area approximately 120 px deep. This uses independent horizontal and vertical scaling too. The 960 × 540 viewport crops most of the dock face; the wide strip shows the full face and water. Floor top meets the scenery baseline; minor uneven source bases can reveal a narrow sliver of distant water.

Far is shown at **1920 × 640**, starting x=-200, y=-190 behind scenery. A flat blue review-only fill supplies the sky. Far's native width exceeds the 1920 px minimum. Foreground pieces should stay low and sparse: suggested visible heights post 48 px, net 45 px, lamp 64 px (measure after trimming transparent margins). The mock uses one post near the bottom edge, x=790, y=492, cropped by the screen edge.

## Known limitations / acceptance gaps

- **Floor is an approximate repeat, not a verified seamless tile.** The model followed the repeating motif but the left/right stones, ropes and water do not match exactly. The wide review shows three repeats without seam concealment. A seam may be visible while scrolling. No code workaround is proposed.
- Back edge posts are similar rather than identical. They do not form a perfect shared divider when placed flush; joins are readable in the wide strip. Heights/bases are approximately aligned, not pixel-perfect.
- Far is **not seamless**: land height and wave marks differ at the two edges. It is usable as a finite wide parallax layer; unlimited repetition needs an art revision.
- Floor texture retains stronger contrast than the low-contrast request, and its small dock-face post caps slightly rise into the front-lip boundary. There are no freestanding props on the walking surface.
- Back art has mild translucent antialiasing and occasional faint edge colour; verify against the final sky in import. The brown/black appearance in the image generator's preview is transparent in the saved PNGs.
- The floor's generated walking area did not occupy the requested 60% of its canvas. The review's measured resize gives the gameplay depth, but sources are not a uniform one-scale kit. Import sizing requires the explicit measurements above; human approval does not imply game integration approval.

Nothing listed in the packet is missing. Exact tiling, perfectly hidden joins, and uniform source scale remain imperfect. This is the best generated source pass, delivered for the requested human gate.

## Review question

Does this retain the same Harbor Market look, and is the deeper dock a place you want to fight through? Please judge the overall look using `frame.png` and the segment sequence using `review.png`; the seam limitations above remain open.
