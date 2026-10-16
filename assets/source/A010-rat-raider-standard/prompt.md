# A010 image provenance

Tool: built-in `image_gen.imagegen` (image edits with referenced local images). All calls used `transparent_background: false`; the tool did not expose seeds or model settings. Final sources are keyed and placed on exact #00FF00, 1536 × 2304 canvases.

The user selected **R, slightly rattier**, in this session. `prompt-a009.md` and `generation-inputs-a009.json` preserve inherited A009 provenance. A009 raw `generated/` files are intentionally omitted. Visible body pixels were cut from the unchanged `reference.png`; tool repairs supply hidden overlap material. Expression and view swaps are edits of the supplied master/head drawings. The standee blade, guard and pommel are extracted from `assets/art/enemies/rat-raider.png`; only the hidden grip is painted.

## Exact prompts

### 1. master-back initial

Input(s): reference.png, assembled-r.png (A009 selected R assembly, staging only).

```text
Use case: identity-preserve. Edit target: image 1 is the approved Rat Raider master, image 2 the selected R slightly rattier head/assembly. Create master-back.png: the SAME stocky rat seen from behind in exactly the same low wide crouch, same scale and overall placement on the 1536 x 2304 canvas, silhouette about 1350 pixels tall, feet at y=1990. Keep thick limbs, large round ears with a notch, brown fur, patched olive trousers, brown leather shoulder vest and belt/pouch, red neck scarf, wrapped paws and pink tail. Show rear of head (no face) and back of torso (no chest bib); rear three-quarter view, facing screen right. Arms spread as reference. Preserve character proportions, clothing textures and bold painted outlines from master; this is a view change drawn over the approved character, not a new design. No sword. Upper-left lighting, pure #00FF00 background, no floor line or ground shadow, no labels.
```

### 2. effort

Input(s): A009 head-neutral-r.png.

```text
Use case: identity-preserve. Edit only the facial expression of the isolated selected R Rat Raider head in image 1: gritted teeth and clenched jaw, lowered brows, both eyes narrowed but open, bracing with effort. Preserve EXACT ear shapes, notches, fur outline, scar, cheek color, slightly long rat muzzle and two incisors, canvas placement and head size. Same 3/4 view facing right, upper-left light, bold dark painted outline. Only the head, no neck clothing or body, pure #00FF00 green background. Do not invent a different head.
```

### 3. ko

Input(s): A009 head-neutral-r.png.

```text
Use case: identity-preserve. Edit only the facial expression of the isolated selected R Rat Raider head in image 1: knocked out, both eyes completely shut, relaxed brows, jaw slack slightly with small visible incisors, dazed but no symbols. Preserve EXACT ear shapes, notches, fur outline, scar, cheek color, slightly long rat muzzle, canvas placement and head size. Same 3/4 view facing right, upper-left light, bold dark painted outline. Only the head, no clothing or body, pure #00FF00 background. Do not invent a different head.
```

### 4. side

Input(s): reference.png.

```text
Use case: identity-preserve. Image 1 is the approved Rat Raider master. Draw over this exact character to create ONLY its isolated torso turned side-on facing right for a horizontal sword cut. Keep original brown leather shoulder jerkin, red triangular neck scarf, diagonal leather strap, gold buckles, belt and pouch, cream belly fur, stocky proportions and master size. No head, arms, hands, legs, tail, or weapons. Round filled shoulder and neck sockets and hidden waist beyond belt. Maintain painterly textures and bold outline, upper-left light. Centered on pure #00FF00 background, no shadows or labels. This is a rotated view of the master torso, not a new character or costume.
```

### 5. hand-front-open

Input(s): hand-front-grip.png.

```text
Use case: precise-object-edit. Edit the target paw only: open the curled fingers into a chunky open rat paw, with the palm facing camera, four short thick fingers with dark claws and a short thumb. Keep the exact brown fur/pink-brown skin/leather wrist wrap, thick palm proportions, painted texture and outline. Keep wrist on the RIGHT, fingertips on the LEFT, same scale and placement. Paint a rounded complete wrist extension hidden inside the forearm. Isolated cutout on pure #00FF00 green, upper-left light, bold dark painted outline, no ground shadow, no extra items, no labels.
```

### 6. hand-back-fist

Input(s): hand-back-open.png.

```text
Use case: precise-object-edit. Edit the target paw only: curl the claw fingers into a tightly closed chunky fist, thumb over curled fingers. Keep wrist LEFT, knuckles RIGHT, exact brown/pink-brown rat skin, leather wrist wrap, thick palm proportions, painted texture and outline. Paint a rounded complete wrist extension hidden inside the forearm. No weapon or shaft. Isolated cutout on pure #00FF00 green, upper-left light, bold dark painted outline, no ground shadow, no extra items, no labels.
```

### 7. hand-back-grip

Input(s): hand-back-open.png.

```text
Use case: precise-object-edit. Edit the target paw only: curl the claw fingers into a chunky handle-gripping fist with a clearly open small oval GREEN hole through the center for an inserted weapon shaft. Keep wrist LEFT, knuckles RIGHT, exact brown/pink-brown rat skin, leather wrist wrap, thick palm proportions, painted texture and outline. Paint a rounded complete wrist extension hidden inside the forearm. No weapon or shaft. Isolated cutout on pure #00FF00 green, upper-left light, bold dark painted outline, no ground shadow, no extra items, no labels.
```

### 8. hand-back-pinch

Input(s): hand-back-open.png.

```text
Use case: precise-object-edit. Edit the target paw only: pose thumb and first two fingers in a bow-string pinch, other fingers curled. Keep wrist LEFT, fingertips RIGHT, exact brown/pink-brown rat skin, leather wrist wrap, thick palm proportions, painted texture and outline. Paint a rounded complete wrist extension hidden inside the forearm. No bow or string. Isolated cutout on pure #00FF00 green, upper-left light, bold dark painted outline, no ground shadow, no extra items, no labels.
```

### 9. sword

Input(s): sword.png.

```text
Use case: precise-object-edit. Edit the standee's cutlass only: remove the rat hand/fingers entirely from the handle and paint in only the hidden brown leather wrapped cylindrical grip, connecting original gold crossguard to original gold pommel. Preserve EXACT chipped blade silhouette, its facets and colors, every chip, original gold guard and pommel unchanged. No redesign, no new blade. Keep existing sword direction, size and position. Isolated cutout on pure #00FF00 green, upper-left light, bold dark painted outline, no ground shadow, no extra items, no labels.
```

### 10. hand-front-grip

Input(s): /Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A010-rat-raider-standard/hand-front-grip.png.

```text
Use case: precise-object-edit. Change only the closed paw's finger grip: add a small clearly open oval GREEN hole through the curl of the fingers for an inserted weapon shaft. No shaft painted. Preserve same chunky paw, exact wrist wrap on RIGHT, knuckles on LEFT, same pose and same scale. Round wrist end. Pure #00FF00 green background, no ground shadow, no text.
```

### 11. side2

Input(s): /Users/johniadarola/.codex/generated_images/01a142db-ebb0-79b1-bd12-95a8054d50a3/exec-94cf61f9-b3d0-46a2-be8c-634ecdbbdd8e.png.

```text
Use case: precise-object-edit. Turn ONLY this exact torso into a TRUE SIDE PROFILE looking RIGHT. Right edge is the chest, left edge is the back. Show ONE narrow shoulder socket on camera side, narrow red scarf triangle seen from its side, diagonal leather strap and same belt/pouch. The torso must be visibly narrower than the reference in three-quarter view. Remove trailing scarf tails (a separate rig part). No head, arms, hands or legs. Preserve stocky costume, brown leather/silver pad/gold trim/cream fur, upper-left light and bold outlines. Pure #00FF00 green background, no ground shadow, no text.
```

### 12. back2

Input(s): /private/tmp/a010-back-raw.png.

```text
Use case: precise-object-edit. Change ONLY the ears of this rear-view rat: show the BROWN FUR BACKS of both ears, with a narrow pink rim at most. We are viewing him FROM BEHIND; inner pink ear bowls must NOT face camera. Keep ALL other character details, clothing, crouch, silhouette, scale and placement unchanged. Pure #00FF00 green background, no ground shadow, no text.
```

### 13. pelvis hidden repair

Input(s): pelvis.png (master-cut staging version).

```text
Use case: precise-object-edit. Complete this cut hip/seat of trousers UNDERLAY: remove gold belt, cream belly fur and crossing leather straps from this cutout, paint hidden continuous patched olive fabric covering both hips and crotch, rounded hip joint ends. Keep stocky low wide crouch, same image location and size. Do not add legs or torso. This fills the area hidden beneath the torso and upper thighs. Edit target is a polygon CUT FROM the approved master; keep visible central drawing, paint only occluded material and remove the specified neighboring fragments. Keep part placement, scale, orientation on canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 14. arm-front-upper hidden repair

Input(s): arm-front-upper.png (master-cut staging version).

```text
Use case: precise-object-edit. Repair only hidden joint ends of this master-cut near upper arm: remove the torso belt strap fragment at the lower-right cut; continue existing fur/leather shoulder with a complete circular rounded shoulder at the RIGHT end, and round fur at the LEFT elbow end. Preserve central leather shoulder pad, gold rivet, cream arm fur and brown leather wraps. Do not add forearm or hand. Edit target is a polygon CUT FROM the approved master; keep visible central drawing, paint only occluded material and remove the specified neighboring fragments. Keep part placement, scale, orientation on canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 15. arm-front-lower hidden repair

Input(s): arm-front-lower.png (master-cut staging version).

```text
Use case: precise-object-edit. Repair only hidden joint ends of this master-cut near forearm: erase any pink finger/thumb at left cut, extend brown leather wrist wraps to a complete rounded cap at LEFT wrist and RIGHT elbow. Preserve original short thick forearm proportions, leather wrap texture/color. No hand. Edit target is a polygon CUT FROM the approved master; keep visible central drawing, paint only occluded material and remove the specified neighboring fragments. Keep part placement, scale, orientation on canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 16. arm-back-upper hidden repair

Input(s): arm-back-upper.png (master-cut staging version).

```text
Use case: precise-object-edit. Repair only hidden joint ends of this master-cut far upper arm: remove small gold clothing fragment at top-left, complete upper-arm fur and a circular rounded shoulder cap at LEFT; rounded elbow at RIGHT. Preserve central brown and cream fur and thick upper-arm silhouette. No forearm or hand. Edit target is a polygon CUT FROM the approved master; keep visible central drawing, paint only occluded material and remove the specified neighboring fragments. Keep part placement, scale, orientation on canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 17. arm-back-lower hidden repair

Input(s): arm-back-lower.png (master-cut staging version).

```text
Use case: precise-object-edit. Repair only hidden joint ends of this master-cut far forearm: erase any pink fingers/thumb at right cut, complete brown leather wraps with circular rounded elbow at LEFT and wrist at RIGHT. Preserve original short thick forearm, leather texture/color. No hand. Edit target is a polygon CUT FROM the approved master; keep visible central drawing, paint only occluded material and remove the specified neighboring fragments. Keep part placement, scale, orientation on canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 18. leg-front-upper hidden repair

Input(s): leg-front-upper.png (master-cut staging version).

```text
Use case: precise-object-edit. Remove tail, belly-fur and belt fragments along top. Repair hidden HIP at upper RIGHT with rounded olive trouser fabric cap; repair KNEE at lower LEFT with rounded matching trouser fabric cap. Keep the original central large stitched grey patch and thick crouched thigh, exact orientation and placement. No shin or foot. Edit target is a polygon CUT FROM the approved master; paint only hidden joint ends and remove specified neighboring fragments. Keep drawing location, scale, orientation on the full canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 19. leg-back-upper hidden repair

Input(s): leg-back-upper.png (master-cut staging version).

```text
Use case: precise-object-edit. Remove belt/strap fragments at top-left and pink shin below. Repair hidden HIP at upper LEFT with rounded olive trouser fabric cap and KNEE at lower RIGHT with rounded matching trouser fabric cap. Keep central tan stitched patch and thick crouched thigh, exact orientation and placement. No shin or foot. Edit target is a polygon CUT FROM the approved master; paint only hidden joint ends and remove specified neighboring fragments. Keep drawing location, scale, orientation on the full canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 20. leg-front-lower hidden repair

Input(s): leg-front-lower.png (master-cut staging version).

```text
Use case: precise-object-edit. Remove olive trouser fragments at upper cut and pink foot at lower cut. Repair round hidden KNEE at upper RIGHT (pink rat skin) and round ANKLE at lower LEFT (brown leather wrapped cap). Preserve central shin skin and brown wrappings. No thigh or foot. Edit target is a polygon CUT FROM the approved master; paint only hidden joint ends and remove specified neighboring fragments. Keep drawing location, scale, orientation on the full canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 21. leg-back-lower hidden repair

Input(s): leg-back-lower.png (master-cut staging version).

```text
Use case: precise-object-edit. Remove olive trouser fragments at upper cut and pink foot at lower-right cut. Repair round hidden KNEE at upper LEFT (pink rat skin) and round ANKLE at lower RIGHT (brown leather wrapped cap). Preserve central shin skin and brown wrappings. No thigh or foot. Edit target is a polygon CUT FROM the approved master; paint only hidden joint ends and remove specified neighboring fragments. Keep drawing location, scale, orientation on the full canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 22. foot-front hidden repair

Input(s): foot-front.png (master-cut staging version).

```text
Use case: precise-object-edit. Repair only cut ANKLE at upper RIGHT with complete rounded brown leather wrapping extending into the shin by one joint width. Keep original pink toes, dark claws and broad near foot outline, exact scale and orientation, no added shin or knee. Edit target is a polygon CUT FROM the approved master; paint only hidden joint ends and remove specified neighboring fragments. Keep drawing location, scale, orientation on the full canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 23. foot-back hidden repair

Input(s): foot-back.png (master-cut staging version).

```text
Use case: precise-object-edit. Repair only cut ANKLE at upper LEFT with complete rounded brown leather wrapping extending into the shin by one joint width. Keep original pink toes, dark claws and broad far foot outline, exact scale and orientation, no added shin or knee. Edit target is a polygon CUT FROM the approved master; paint only hidden joint ends and remove specified neighboring fragments. Keep drawing location, scale, orientation on the full canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 24. torso hidden repair

Input(s): torso.png (master-cut staging version).

```text
Use case: precise-object-edit. Remove the small mouth/teeth fragment at top-right cut edge, paint hidden neck fur there. Complete rounded hidden shoulder sockets and waist underneath the belt. Preserve all other central original master pixels, including triangular red scarf, leather jerkin, belt/pouch and belly fur. Remove trailing scarf tails if any. No head, arms, hands, hips or legs. Edit target is a polygon CUT FROM the approved master; paint only hidden joint ends and remove specified neighboring fragments. Keep drawing location, scale, orientation on the full canvas. Pure #00FF00 green background, upper-left light, bold dark outline, no shadow or text.
```

### 25. leg-front-lower retry

Input(s): leg-front-lower.png (master-cut staging version).

```text
Use case: precise-object-edit. Repair the two polygon-cut ends of this cartoon rat's leather-wrapped boot/shin game sprite into rounded overlapping joint caps. Keep the existing thick short boot shape, wrapping texture, colors and diagonal orientation. Remove little trouser and toe fragments crossing the cropped ends. Paint only material hidden at the cut ends; leave central artwork unchanged. No foot or upper leg attached. Keep same placement and scale on pure #00FF00 green canvas. Bold painted outline, upper-left light, no shadow, no labels.
```

### 26. leg-back-lower retry

Input(s): leg-back-lower.png (master-cut staging version).

```text
Use case: precise-object-edit. Repair the two polygon-cut ends of this cartoon rat's leather-wrapped boot/shin game sprite into rounded overlapping joint caps. Keep the existing thick short boot shape, wrapping texture, colors and diagonal orientation. Remove little trouser and toe fragments crossing the cropped ends. Paint only material hidden at the cut ends; leave central artwork unchanged. No foot or upper leg attached. Keep same placement and scale on pure #00FF00 green canvas. Bold painted outline, upper-left light, no shadow, no labels.
```

### 27. front grip correction

Input(s): hand-front-grip.png (first attempt).

```text
Use case: precise-object-edit. Correct this near-hand grip drawing only. The green circular hole currently appears punched through a finger: REMOVE that hole and restore the finger. Instead slightly uncurl the thumb so a narrow vertical GREEN shaft slot is visible BETWEEN the thumb and the curled fingers, near the base of the thumb, just LEFT of the leather wrist cuff (around 60 percent of the complete paw width from left). Draw fingers wrapping round that slot as if holding a cylindrical sword hilt, with the hilt itself removed. No hole through any individual finger. Keep the original chunky paw silhouette, cuff on RIGHT, fingers on LEFT, original scale, location, warm brown color and painted texture. Rounded complete cuff, bold dark outline, upper-left lighting, pure #00FF00 green background, no labels.
```

The first arm-back-lower hidden repair returned no image and was retried with the same prompt. Initial shin repairs returned tool errors; their successful retry prompts are included above. The first side torso, rear ears and front grip were replaced by the corrective edits above. Raw attempts remain outside the repository.

## A010 addendum — metadata and existing-item fit only

No image-generation calls or redraws. `rig-source.json` is a field-for-field conversion of the existing measured layout, excluding sword. `cutlass-grip-check.png` uses Pillow for deterministic keying, uniform scaling, rigid rotation and compositing of the unchanged hand/body sources and the already-imported A003 item. Exact attachment/scale settings are in `cutlass-grip-check.json`. Earlier sword prompts and reviews are historical provenance; the canonical manifest uses no sword part.
