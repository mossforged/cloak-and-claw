# A013 — exact image prompts

Tool: built-in `image_gen.imagegen`; opaque flat green output (`transparent_background=false`). No seed or quality setting was exposed. Each source image was inspected before use.

## Front master

Input identity reference: `assets/art/heroes/mouse-fighter.png`. Output: `raw-master.png`.

```text
Use case: identity-preserve. Asset type: painted 2D game character rig MASTER, single full body on pure #00FF00 green.
Input image: the approved Mouse Fighter standee, identity and style reference.
Redraw EXACTLY this hero at high resolution, same proportions and outfit: warm grey fur, enormous pink ears, cream muzzle, two brown eyes visible, red scarf, royal blue short tunic with gold edging, brown cross-body strap, gold-buckled brown belt and left hip pouch, short grey furry legs, brown open-toed boots with pink toes. Bold dark outlines, warm painted cel shading, upper-left lighting. No new costume details.
Pose: upright alert heroic game stance, three-quarter facing RIGHT about 30 degrees toward viewer, feet apart, knees only slightly bent. Keep his large head and compact stocky body. Near arm extends to LEFT of body, elbow slightly bent, brown gloved near hand holds sword angled upward LEFT, matching reference. Far arm extends RIGHT, far gloved hand clearly VISIBLE just inward of the existing oval gold-rim wood shield, shield positioned out to the RIGHT of the body so it hides no torso or leg. Both eyes and both hands visible. Near boot at left should point slightly RIGHT toward camera, never backwards. Pink tail curling behind him on left, scarf tails behind left shoulder. Mouth closed in a determined confident small smile.
Composition: 1536 x 2304 portrait canvas, character including sword about 1350 pixels tall, centered in lower middle, feet at y=2050, large blank green margins. A tiny short dark floor registration dash at far left and far right at y=2050, NOT underneath feet. No cast shadow, no floor, no text, no labels, no gradients in green. One character only. Preserve the standee identity closely.
```

## Boot correction / selected master

Edit target: `raw-master.png`. Output: `raw-boot-edit.png`, used as the complete selected master.

```text
Use case: precise-object-edit. Edit this exact Mouse Fighter master. Change ONLY the near/front foot at the lower LEFT: turn its brown open-toed boot and pink toes to point toward the RIGHT and slightly toward the viewer, aligned like the far foot rather than pointing backward to the left. Keep ankle and shin position, floor height, leg thickness, same boot leather trim and toes. Do not change anything else: head, ears, face, scarf, torso, hands, weapons, other boot, tail, stance, canvas, background and scale remain identical. Flat #00FF00 background, no shadow.
```

## back

Input identity reference: `raw-master.png`. Output: `raw-back.png`.

```text
Use case: identity-preserve. Edit target: supplied Mouse Fighter master. Draw the SAME Mouse Fighter from BEHIND, matching proportions, large ears, grey fur, red scarf, blue tunic with gold trim, brown crossed back harness, gold fastener and belt and left hip pouch, brown boots with pink toes, pink tail. Same upright feet-apart stance and limb thickness, upper-left light, bold dark outline warm painted game art. No sword or shield so all arms and gloved hands visible. Exact pure #00FF00 flat background, no shadow, no text. Full body only, portrait 1024x1536. Keep scale and placement as supplied.
```

## heads

Input identity reference: `raw-master.png`. Output: `raw-heads.png`.

```text
Use case: identity-preserve. Input is exact character master. Make a cutout expression sheet of ONLY the SAME Mouse Fighter HEAD, no scarf, no neckwear, no body: enormous pink left ear, smaller right ear, warm grey fur, cream muzzle, same two brown eyes visible and pink nose, facing right in three-quarter view. Four separated heads in a 2x2 grid, identical size, proportions, ear silhouette and angle. Top left ATTACK shouting with mouth wide open and focused eyebrows; top right HURT eyes pinched shut mouth pained; bottom left EFFORT gritted visible teeth determined bracing brows; bottom right KO eyes shut and mouth slack. Preserve exact identity and painted bold dark outline style of reference. Pure #00FF00 background, generous green gaps, no shadow, no text, no labels, no other parts. Square sheet 1536x1536.
```

## hands

Input identity reference: `raw-master.png`. Output: `raw-hands.png`.

```text
Use case: precise-object-edit. Reference: Mouse Fighter master, preserve brown leather gloves and bold painted style. Draw ONLY six separate glove cutouts arranged 3 columns x 2 rows, each with round wrist cuff extension and same hand size. TOP ROW near right hand viewed from camera with wrist coming from RIGHT: open palm with five fingers pointing left; closed fist; gripping fist with thumb wrapping around an EMPTY vertical narrow shaft slot (pure green hole through center, 18% hand width). BOTTOM ROW far left glove with wrist coming from LEFT, same three variants: open palm fingers right; closed fist; grip with visible vertical shaft slot. Warm brown leather, gold stitching, dark outlines, upper-left lighting. No forearms, no weapons, no objects, no labels. Pure #00FF00 flat green background, ample gaps, square 1536x1536. Each fist is a compact fist like the master, not an oversized gauntlet.
```

## support

Input identity reference: `raw-master.png`. Output: `raw-support.png`.

```text
Use case: precise-object-edit. Use supplied Mouse Fighter master as exact identity and style reference. Create a separated rig support sheet on pure flat #00FF00, bold dark outlines, upper-left light. 2 columns x 2 rows, no labels, no shadows. TOP LEFT: only his torso turned side-on facing RIGHT, red scarf, blue tunic gold trim, diagonal brown strap, belt gold buckle and pouch, complete tunic hem, rounded blue shoulder sockets, no head no arms no legs. TOP RIGHT: only his near arm raised VERTICALLY, whole arm from round blue sleeve shoulder at bottom to cream furry elbow, brown bracer and brown gripping gloved hand at top with green shaft slot. BOTTOM LEFT: only his far arm bent in raised shield GUARD, whole arm from blue sleeve shoulder at right to cream furry elbow at lower left to brown gloved fist at upper left gripping invisible shield strap; no shield, no weapon. BOTTOM RIGHT: torso FRONT three-quarter matching input exactly but with no arms, no head, complete scarf, tunic and belt and hem, including hidden blue cloth under where near upper arm overlaps. Do not redesign outfit or change glove/fur colors. All four images separated widely.
```

## Hidden joint painting

Edit target: `joint-fill-input.png`, actual master cutouts registered into a grid. `joint-fill-map.json` preserves that input grid registration. Output: `raw-joint-fill.png`.

```text
Use case: precise-object-edit. This is an actual CUT PARTS atlas from one approved game master, arranged FIVE COLUMNS and FOUR ROWS, 17 occupied cells. Preserve every cell position, size and scale; do not rearrange. Paint ONLY the missing hidden joint material around cut edges, keeping visible artwork unchanged. Extend cut shoulders, elbows, wrists, knees, ankles and hips by about 25 pixels with ROUND caps and dark outlines; no flat chopped edges. Complete missing blue tunic upper shoulders and neckline in row1 col2; complete blue pelvis in row1 col3, removing incidental grey thigh slivers. Row1 col4 blue sleeve/cream furry upper arm; row1 col5 brown forearm leather bracer, remove gold sword contamination. Row2 col1 near brown gripping glove: complete wrist at RIGHT, remove red scarf and gold weapon scraps, retain EMPTY shaft hole. Row2 col2 far blue sleeve/cream upper arm; row2 col3 brown bracer with ROUND elbow/wrist, remove shield gold; row2 col4 far glove fist with full RIGHT edge and wrist at LEFT, remove gold shield. Row2 col5 grey thigh: complete rounded hidden hip and knee, remove blue hem. Row3 col1 brown shin boot upper, round both ankle and knee. Row3 col2 brown boot foot toes right, round hidden ankle at top. Row3 col3 grey far thigh rounded ends, remove blue tunic and boot scraps. Row3 col4 brown far shin, round ends. Row3 col5 brown far foot, round ankle. Row4 col1 pink tail complete round root at right. Row4 col2 two red scarf tail fragments: connect into one red scarf-tail with hidden red cloth behind the occluding hand, round root at top RIGHT. Row1 col1 head: remove stray pixels on left, complete hidden round grey neck under chin; do not change face or ears. Empty cells remain green. Keep strict FIVE COLUMN grid, same registration, pure #00FF00 background, 1536 square. No labels, weapons, bodies, shadows or new design.
```

## Source preparation

`prepare.py` cuts visible pixels from the selected master and produces the joint input atlas. `finish.py` completes visible segmentation by growing cut masks only into unassigned original master pixels. It adds image-tool paint only beneath covered joints, registers view/expression/hand swaps by uniform scale, and builds every review from delivered pixels. The far bracer completes shield-hidden material. The default far hand intentionally uses the requested drawn grip swap, rather than overlaying an occluded master finger fragment at its wrist; the original cut is retained as provenance. Green normalization, cutting, scaling, rigid rotation, labels and review compositing use Pillow/numpy; no body or weapon art is drawn programmatically.

The whole selected boot edit is used to avoid a patch seam; the first master is provenance. The G2 target `master-body.png` independently removes the master weapon depictions using recorded polygons. `reference.png` retains them and adds floor ticks. The actual assembly instead holds the unchanged A002 items. All measured registration, cut polygons, hidden-fill bounds and item transforms are included.

## Addendum: turned-out back foot (2026-10-16; superseded by Addendum 2)

Tool: built-in `image_gen.imagegen`, `transparent_background=false`; no exposed seed or quality controls. Edit target: `foot-back.png`, cropped to [900,1840,1270,2080] and enlarged uniformly x3 as `/private/tmp/a013-foot-input.png`. Second input: `assets/art/heroes/mouse-fighter.png` (stance reference). Output preserved as `raw-foot-back-out.png`.

```text
Use case: precise-object-edit. Asset type: isolated boot view swap for a painted 2D cutout game rig. Image 1 is the EDIT TARGET, the existing brown open-toed mouse boot; Image 2 is stance direction reference only. Turn the SAME boot from its right-facing view about 45 degrees OUT toward the camera. Toes should aim diagonally DOWN-RIGHT, much more toward the viewer, rather than horizontally right. Show the front of the rounded three pink mouse toes and foreshorten the foot, with the sole mostly hidden. Keep the SAME warm brown leather, overlapping leather straps, small gold round buckle at ankle, pink toe colors, bold dark outlines, upper-left light and simple painted cartoon style. Keep its ankle attachment at the upper-left portion of the foot, with a rounded hidden ankle cap, so a shin can cover it. Draw ONLY the foot below the ankle, not a tall boot shaft, not a leg. Preserve the small boot's relative ankle-to-floor height; new foot is shorter horizontally than original. Pure flat #00FF00 background, no shadow, no floor, no labels. One single foot only, generously framed. This is a turned view of the original boot, no redesign.
```

`addendum.py` is historical provenance for the superseded far-foot attempt; use `addendum2.py` last for the corrected delivery.
## Addendum 2: near/trailing foot-front-out (2026-10-16)

Tool: built-in `image_gen.imagegen`, `transparent_background=false`; no exposed seed or quality settings. Edit target: `foot-front.png`, cropped [340,1870,690,2070] and uniformly enlarged x4 to `/private/tmp/a013-near-foot-input.png`. Second input: unchanged `assets/art/heroes/mouse-fighter.png` for stance direction. Output: `raw-foot-front-out.png`.

```text
Use case: precise-object-edit. Asset type: isolated near-foot view swap for a painted 2D game cutout rig. Image 1 is the EDIT TARGET, the existing near brown open-toed mouse boot. Image 2 is a stance reference: match the direction of the boot at the LOWER LEFT of that character (his near, trailing, camera-side foot), NOT the right-hand boot. Turn the SAME boot about 60 degrees outward toward the viewer so the toes point diagonally DOWN-LEFT in the image, as that reference foot does. The ankle stays upper-right of the toe cluster; the boot extends down-left from the ankle. This direction is critical: toes down-left, heel/ankle up-right, not right-facing. Preserve the same brown leather crossing straps, little round gold buckle on the visible outer ankle, three broad pink mouse toes, bold dark outline, upper-left lighting, simple warm painted cartoon style. Draw only the low foot below the ankle with a small rounded hidden ankle cap to overlap behind the shin. No tall boot shaft or leg. Same boot design, foreshortened turned perspective. Pure flat #00FF00 background, one single foot generously framed, no shadow, no floor, no labels.
```

`addendum2.py` keys the green and uses only uniform scale 0.24 plus translation, as recorded in `foot-front-out-registration.json`. Raw ankle point [1075,365] lands at the unchanged near ankle [477,1937]. No boot painting is drawn by code. The original shin covers the hidden cap. Run `addendum2.py` last when rebuilding; the historical `addendum.py` targets the incorrect far foot. The corrected review replaces the obsolete addendum panel in `review.png`.
