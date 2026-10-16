# A013 — Mouse Fighter standard source kit

Branch: `a013-mouse-fighter-standard`. State: **source; initial look accepted by user; turned-foot addendum ready for review**. No game import or visual motion approval is claimed.

Delivered: front and rear masters, all 15 standard biped parts plus tail/scarf-tail, 17 swaps (six expression/view heads, seven hand variants, side/rear torsos and two whole-arm drawings), measured `rig-source.json`, `item-fits.json`, source provenance and reproducible preparation scripts. Every part and swap uses a 1536 × 2304 canvas, a common uniform scale and y=2050 floor. The near boot now points forward/right.

`reference.png` is the selected full master with its generated sword/shield depictions and floor registration ticks. **Those depictions are not new item deliveries.** `master-body.png` is the same independently masked drawing with those items removed, used as the manifest's G2 master so items do not count as missing body material. `assembled-body.png` and `assembled-clean.png` are actual delivered-part assemblies, the latter holding the unchanged A002 sword and angled shield. No fitted standee is substituted for these assemblies.

`review.png` compares standee/master/assembly, includes the rear/view drawings, every part and swap on grey, and the 960 × 540 Harbor Market panel. The panel is also `review-game-size.png`: the mouse body (ears to soles) is 130 px, the A010 rat 136 px. The sword tip can extend above the body. `sword-grip-check.png` and `shield-check.png` show enlarged attachments; the near handle runs through the slot and the shield's existing strap point attaches at the far glove's slot. The shield faces outward, so its inner strap itself is occluded. Item art is neither redrawn nor copied into this kit.

Visible body pixels are cut from the complete selected `raw-boot-edit.png`. Initial polygons and an original-pixel-only edge completion finish the visible segmentation. Image-tool joint paint is restricted to occluded overlaps at rest; the far forearm completes material previously hidden by the shield; the default far hand uses the requested drawn grip swap. All transformations are uniform scale and rigid rotation. Details are in `prepare.py`, `finish.py`, `cut-polygons.json`, `joint-fill-map.json` and `preparation-transforms.json`. `prompt.md` records every exact prompt and tool input.

Limitations to review in motion:

- Hidden ends are extended where the returned painting could be covered at rest, but **a complete circular cap and one full joint-width of hidden painting are not guaranteed at every shoulder, hip, cuff or ankle**. Some cut pieces still carry neighbouring cloth/fur edge material. A faithful rest silhouette does not establish a clean bend. If a bent joint fails the look, return it for an art correction.
- Near upper arm band **590**, near forearm **580**, torso **600** preserve the overlapping sleeve at rest. This is a larger exception than the rat's shoulder-only 590 exception; near hands/items stay in the 800s. Upper legs are 530/230 and feet 510/210, so thigh and shin art cover the adjoining caps. Watch depth when an arm crosses the torso.
- Rear and side views, expressions, gloves and whole-arm drawings were registered to the new master with uniform scaling. They are view/swap paintings, not pixel-identical rotations. The side torso includes painted scarf tails; avoid drawing a second scarf-tail over that view. The rear head includes a little scarf at its lower edge. The default far hand intentionally uses the new grip swap rather than the occluded master fragment, because overlaying both produced a doubled fist. The original cut is retained as `hand-back-master-cut.png` for provenance; this is a deliberate hand-library substitution and differs slightly from the master.
- Whole-arm swaps name `hide`, `itemGrip` and `slotDirection` extension fields. The present bench reader/importer do not forward these fields into runtime swaps. Code must preserve those attachment instructions when importing; the generic G3 strip alone does not validate the whole-arm substitutions. The raised arm is a closed fist, with its handle hidden behind the fingers rather than an exposed hole.
- Fine whiskers and keyed edges may retain softness. Final game keying/trim belongs to Code.

`validation.json` records independent body-silhouette coverage and whether each measured pivot overlaps both drawings. `bench-validation.json` records the existing reader and sampled layout compatibility. The draft importer was exercised with all output under `/private/tmp`, leaving game files untouched. These are static/structural checks, not visual G3 approval.

No required filename is missing. Recolour masks, face-detail overlays, new moves and game integration are out of scope.

Human review: **is this our hero?** After the look is accepted, review bends and the standard motion strip on the rig bench before importing.

Final static measurements: **0.12%** of the independent body master is uncovered; **3.12%** of part silhouette lies outside it (primarily the completed far glove). All 17 pivots overlap their own part and, where applicable, its parent. Existing bench reader: no errors or missing standard parts; 289 sampled strip frames have finite transforms. Draft import at uniform x0.4 succeeds with output confined to `/private/tmp`.

## Addendum — turned-out back foot (2026-10-16)

Delivered `foot-back-out.png`, same 1536 × 2304 green canvas and exact **[1009, 1940] ankle pivot** as `foot-back`. Registered in `rig-source.json` as a swap `of: "foot-back"`; inherits parent and band 210. The painted view brings the toes toward the camera, foreshortens the boot and preserves its brown leather straps, gold fastening and three pink toes. Its higher hidden cap sits behind the original shin; no replacement master was made.

`review-foot-back-out.png` compares the approved standee and actual part assemblies using the forward and turned foot, with enlarged foot details and a native 960 × 540 game panel. The separate native panel is `review-foot-back-out-game-size.png`; both mouse assemblies have 130 px bodies. This comparison is appended to `review.png`. `assembled-foot-back-out.png` is the actual new assembly with unchanged A002 items. The exact image prompt and reproducible uniform registration are in `prompt.md`, `addendum.py`, and `foot-back-out-registration.json`; raw painting retained as `raw-foot-back-out.png`.

Code: use `foot-back-out` in stance, idle, block and other planted poses; retain `foot-back` for walking. No optional front-foot swap was needed. This is a painted perspective swap, so it intentionally differs from the original master's foot silhouette. Static ankle overlap is checked; G3 visual motion review remains with Code. No required addendum deliverable is missing.
