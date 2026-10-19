# A020 exact image-tool prompts

Tool: built-in `image_gen.imagegen`, green backgrounds (`transparent_background: false`), one call per drawing/variant. No CLI or API fallback. No model, seed or pixel-size controls were exposed.

A011 images are approved design references; current A018/A022/A023 drawings are fit targets. Temporary reference crops were assembled with Pillow only. Final generated images were uniformly resampled to the target crop rectangle and placed back on the 1536×2304 canvas; green pixels were standardized to #00FF00. No shape warping, anatomy drawing, or runtime workaround was used.

Material masks are grayscale pixel selections derived from the final RGB source images, not newly painted illustrations. There are four named material masks per drawing, including explicit empty masks. They remain an imperfect selection pass (see HANDOFF and tint sheet).

## gear-jerkin.png

Fit target: `assets/source/A023-rat-complete-kit/torso.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-jerkin.png`.

First, fitted-on-body edit (current torso only):

```text
Edit this exact rat torso. Put a short wide brown diamond-quilted leather sleeveless jerkin over its belly, with gold piping, two gold buckles at right side of image, side lacing and tiny flap pocket at left. Preserve exact existing pose, proportions and framing, the big metal shoulder pad, the red scarf and brown fur. The jerkin fits snugly around the EXISTING WIDE BELLY; hem ends at the same existing belly outline. Do not make a tall human vest. Do not move or redraw the body. Preserve flat green background. This is a fitted-on-body image, include existing torso, no head or limbs.
```

Then, extraction edit of that generated image:

```text
Precise extraction edit of THIS IMAGE. Keep the newly painted quilted brown leather jerkin pixel-positioned exactly where it is. Remove every other object to flat #00FF00 green: remove all rat fur, the shoulder armor, the red scarf, neck, belly fur, everything except jerkin including its lacing, gold edging, two buckles and pocket. DO NOT RECENTER OR ENLARGE the jerkin. Keep SAME CANVAS, SAME MARGINS and SAME LOCATION. Extend its outlined bottom hem down over the last strip of belly fur to the original torso bottom edge. The result is only the short wide curved fitted leather vest overlay, lower chest to belly, top edge cut around scarf and shoulder. Absolutely no rat anatomy or red scarf left. No shadow, no text.
```

## gear-jerkin-side.png

Fit target: `assets/source/A023-rat-complete-kit/torso-side.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-jerkin.png`.

```text
Use case: precise-object-edit. Asset: gear-jerkin-side. Image 1 is exact current body fit target (torso-side); Image 2 is approved gear design reference, not size reference. Redraw just ONE jerkin OVERLAY to dress image 1 in its exact pose. brown diamond-quilted sleeveless leather jerkin, gold piping, two gold buckles on camera-facing right, side lacing and small pocket. Back shows diamond quilted back, no front buckles. Match target body perspective torso-side; wide short hunched rat torso, not human body. Keep image 1 framing and proportions, shoulder and waist positions locked. Output gear ONLY on flat #00FF00; remove body, fur, scarf, pauldron, all existing clothing, no character. Leave neck and arm openings green. Fit hem over target belly edge, no fur peeking below. Preserve design details and palette from image 2. Bold dark outlines, upper-left lighting, warm painted cartoon. No text or shadow. Source crop rectangle [200,800,1200,1600] in 1536x2304 canvas. Maintain exact target framing.
```

## gear-jerkin-back.png

Fit target: `assets/source/A023-rat-complete-kit/torso-back.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-jerkin-back-ref.png`.

```text
Precise fit redraw gear-jerkin-back, correct torso-back perspective. Image 1 is current SHORT WIDE torso target; image 2 is approved REAR jerkin. Fit new overlay to exact shoulders and belly of image1. BACK VIEW: diamond-quilted brown leather with a vertical CENTRAL CROSS-LACED SEAM, small leather tabs at lower hem; absolutely NO FRONT BUCKLES, NO SIDE POCKET, no V-front. Both shoulder openings foreshortened to this back view. Gold piping, stitched leather, upper-left light, bold dark warm cartoon outlines. Output EMPTY GEAR ONLY with no body/fur/scarf/armor. Place at same position in image1 frame, matching short squat torso, keep all green margins. Green #00FF00 outside overlay. Do not reproduce tall narrow old reference shape. Source target rectangle [200,800,1200,1600] on1536x2304.
```

## gear-jerkin-front.png

Fit target: `assets/source/A023-rat-complete-kit/torso-front.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-jerkin.png`.

```text
Precise fit redraw gear-jerkin-front, correct torso-front perspective. Image 1 is current SHORT WIDE torso target; image 2 is approved front jerkin. Fit new overlay to exact shoulders and belly of image1. DIRECT FRONT VIEW: equal left and right shoulders. Deep V neckline, two gold buckles in front, small hip pocket. Gold piping, stitched leather, upper-left light, bold dark warm cartoon outlines. Output EMPTY GEAR ONLY with no body/fur/scarf/armor. Place at same position in image1 frame, matching short squat torso, keep all green margins. Green #00FF00 outside overlay. Do not reproduce tall narrow old reference shape. Source target rectangle [200,800,1200,1600] on1536x2304.
```

## gear-jerkin-away.png

Fit target: `assets/source/A023-rat-complete-kit/torso-away.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-jerkin-back-ref.png`.

```text
Precise fit redraw gear-jerkin-away, correct torso-away perspective. Image 1 is current SHORT WIDE torso target; image 2 is approved REAR jerkin. Fit new overlay to exact shoulders and belly of image1. BACK VIEW: diamond-quilted brown leather with a vertical CENTRAL CROSS-LACED SEAM, small leather tabs at lower hem; absolutely NO FRONT BUCKLES, NO SIDE POCKET, no V-front. Both shoulder openings foreshortened to this back view. Gold piping, stitched leather, upper-left light, bold dark warm cartoon outlines. Output EMPTY GEAR ONLY with no body/fur/scarf/armor. Place at same position in image1 frame, matching short squat torso, keep all green margins. Green #00FF00 outside overlay. Do not reproduce tall narrow old reference shape. Source target rectangle [200,800,1200,1600] on1536x2304.
```

## gear-jerkin-hunched.png

Fit target: `assets/source/A023-rat-complete-kit/torso-hunched.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-jerkin.png`.

```text
Use case: precise-object-edit. Asset: gear-jerkin-hunched. Image 1 is exact current body fit target (torso-hunched); Image 2 is approved gear design reference, not size reference. Redraw just ONE jerkin OVERLAY to dress image 1 in its exact pose. brown diamond-quilted sleeveless leather jerkin, gold piping, two gold buckles on camera-facing right, side lacing and small pocket. Back shows diamond quilted back, no front buckles. Match target body perspective torso-hunched; wide short hunched rat torso, not human body. Keep image 1 framing and proportions, shoulder and waist positions locked. Output gear ONLY on flat #00FF00; remove body, fur, scarf, pauldron, all existing clothing, no character. Leave neck and arm openings green. Fit hem over target belly edge, no fur peeking below. Preserve design details and palette from image 2. Bold dark outlines, upper-left lighting, warm painted cartoon. No text or shadow. Source crop rectangle [200,800,1200,1600] in 1536x2304 canvas. Maintain exact target framing.
```

## gear-jerkin-lean-back.png

Fit target: `assets/source/A023-rat-complete-kit/torso-lean-back.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-jerkin.png`.

```text
Use case: precise-object-edit. Asset: gear-jerkin-lean-back. Image 1 is exact current body fit target (torso-lean-back); Image 2 is approved gear design reference, not size reference. Redraw just ONE jerkin OVERLAY to dress image 1 in its exact pose. brown diamond-quilted sleeveless leather jerkin, gold piping, two gold buckles on camera-facing right, side lacing and small pocket. Back shows diamond quilted back, no front buckles. Match target body perspective torso-lean-back; wide short hunched rat torso, not human body. Keep image 1 framing and proportions, shoulder and waist positions locked. Output gear ONLY on flat #00FF00; remove body, fur, scarf, pauldron, all existing clothing, no character. Leave neck and arm openings green. Fit hem over target belly edge, no fur peeking below. Preserve design details and palette from image 2. Bold dark outlines, upper-left lighting, warm painted cartoon. No text or shadow. Source crop rectangle [200,800,1200,1600] in 1536x2304 canvas. Maintain exact target framing.
```

## gear-sash.png

Fit target: `assets/source/A023-rat-complete-kit/torso.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-sash.png`.

```text
Use case: precise-object-edit. Draw gear-sash, ONE separate gear overlay. Image 1 is the exact current rat torso target (torso), image 2 approved sash design. red folded waist sash, brown leather belt with gold buckle on front, red knot and ragged tails on camera-left hip. Back shows belt rear and hip knot, no front buckle. Redraw to fit WAIST OF IMAGE 1, at its precise waist location and angle. Target width and foreshortening are immutable; never copy old reference dimensions. Output only the sash and belt, NO body or torso or fur or scarf or pauldron. Green #00FF00 everywhere outside gear. Keep target framing, margins and original position. View facing right, camera-side knot. Thick dark outlined warm cartoon painting with upper-left light. No shadow or text. Target image crop [200,800,1200,1600] on original 1536x2304.
```

## gear-sash-side.png

Fit target: `assets/source/A023-rat-complete-kit/torso-side.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-sash.png`.

```text
Use case: precise-object-edit. Draw gear-sash-side, ONE separate gear overlay. Image 1 is the exact current rat torso target (torso-side), image 2 approved sash design. red folded waist sash, brown leather belt with gold buckle on front, red knot and ragged tails on camera-left hip. Back shows belt rear and hip knot, no front buckle. Redraw to fit WAIST OF IMAGE 1, at its precise waist location and angle. Target width and foreshortening are immutable; never copy old reference dimensions. Output only the sash and belt, NO body or torso or fur or scarf or pauldron. Green #00FF00 everywhere outside gear. Keep target framing, margins and original position. View facing right, camera-side knot. Thick dark outlined warm cartoon painting with upper-left light. No shadow or text. Target image crop [200,800,1200,1600] on original 1536x2304.
```

## gear-sash-back.png

Fit target: `assets/source/A023-rat-complete-kit/torso-back.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-sash.png`.

```text
Use case: precise-object-edit. Draw gear-sash-back, ONE separate gear overlay. Image 1 is the exact current rat torso target (torso-back), image 2 approved sash design. red folded waist sash, brown leather belt with gold buckle on front, red knot and ragged tails on camera-left hip. Back shows belt rear and hip knot, no front buckle. Redraw to fit WAIST OF IMAGE 1, at its precise waist location and angle. Target width and foreshortening are immutable; never copy old reference dimensions. Output only the sash and belt, NO body or torso or fur or scarf or pauldron. Green #00FF00 everywhere outside gear. Keep target framing, margins and original position. View from behind: no front buckle visible, hip knot still at same anatomical side. Thick dark outlined warm cartoon painting with upper-left light. No shadow or text. Target image crop [200,800,1200,1600] on original 1536x2304.
```

## gear-sash-front.png

Fit target: `assets/source/A023-rat-complete-kit/torso-front.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-sash.png`.

```text
Use case: precise-object-edit. Draw gear-sash-front, ONE separate gear overlay. Image 1 is the exact current rat torso target (torso-front), image 2 approved sash design. red folded waist sash, brown leather belt with gold buckle on front, red knot and ragged tails on camera-left hip. Back shows belt rear and hip knot, no front buckle. Redraw to fit WAIST OF IMAGE 1, at its precise waist location and angle. Target width and foreshortening are immutable; never copy old reference dimensions. Output only the sash and belt, NO body or torso or fur or scarf or pauldron. Green #00FF00 everywhere outside gear. Keep target framing, margins and original position. View facing right, camera-side knot. Thick dark outlined warm cartoon painting with upper-left light. No shadow or text. Target image crop [200,800,1200,1600] on original 1536x2304.
```

## gear-sash-away.png

Fit target: `assets/source/A023-rat-complete-kit/torso-away.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-sash.png`.

```text
Use case: precise-object-edit. Draw gear-sash-away, ONE separate gear overlay. Image 1 is the exact current rat torso target (torso-away), image 2 approved sash design. red folded waist sash, brown leather belt with gold buckle on front, red knot and ragged tails on camera-left hip. Back shows belt rear and hip knot, no front buckle. Redraw to fit WAIST OF IMAGE 1, at its precise waist location and angle. Target width and foreshortening are immutable; never copy old reference dimensions. Output only the sash and belt, NO body or torso or fur or scarf or pauldron. Green #00FF00 everywhere outside gear. Keep target framing, margins and original position. View from behind: no front buckle visible, hip knot still at same anatomical side. Thick dark outlined warm cartoon painting with upper-left light. No shadow or text. Target image crop [200,800,1200,1600] on original 1536x2304.
```

## gear-sash-hunched.png

Fit target: `assets/source/A023-rat-complete-kit/torso-hunched.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-sash.png`.

```text
Use case: precise-object-edit. Draw gear-sash-hunched, ONE separate gear overlay. Image 1 is the exact current rat torso target (torso-hunched), image 2 approved sash design. red folded waist sash, brown leather belt with gold buckle on front, red knot and ragged tails on camera-left hip. Back shows belt rear and hip knot, no front buckle. Redraw to fit WAIST OF IMAGE 1, at its precise waist location and angle. Target width and foreshortening are immutable; never copy old reference dimensions. Output only the sash and belt, NO body or torso or fur or scarf or pauldron. Green #00FF00 everywhere outside gear. Keep target framing, margins and original position. View facing right, camera-side knot. Thick dark outlined warm cartoon painting with upper-left light. No shadow or text. Target image crop [200,800,1200,1600] on original 1536x2304.
```

## gear-sash-lean-back.png

Fit target: `assets/source/A023-rat-complete-kit/torso-lean-back.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-sash.png`.

```text
Use case: precise-object-edit. Draw gear-sash-lean-back, ONE separate gear overlay. Image 1 is the exact current rat torso target (torso-lean-back), image 2 approved sash design. red folded waist sash, brown leather belt with gold buckle on front, red knot and ragged tails on camera-left hip. Back shows belt rear and hip knot, no front buckle. Redraw to fit WAIST OF IMAGE 1, at its precise waist location and angle. Target width and foreshortening are immutable; never copy old reference dimensions. Output only the sash and belt, NO body or torso or fur or scarf or pauldron. Green #00FF00 everywhere outside gear. Keep target framing, margins and original position. View from behind: no front buckle visible, hip knot still at same anatomical side. Thick dark outlined warm cartoon painting with upper-left light. No shadow or text. Target image crop [200,800,1200,1600] on original 1536x2304.
```

## gear-quiver.png

Fit target: `assets/source/A023-rat-complete-kit/torso.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-quiver.png`.

```text
Use case: precise-object-edit. Draw gear-quiver, one EMPTY separate quiver overlay. Image 1 exact current torso target torso, image 2 approved quiver design. brown leather cylindrical arrow quiver with gold buckled straps, stitched leather and three pale feathered arrows. Rides diagonally behind shoulder, arrows above camera-left shoulder, bottom near far waist. Redraw appropriate torso view with perspective following shoulder and waist in target. Keep exact target framing: place arrow tops above camera-left shoulder, quiver bottom at opposite lower waist behind body. Camera/front side view: quiver will be layered BEHIND torso; include complete hidden tube so it does not pop away. Output ONLY quiver and arrows, absolutely no torso, fur, arms, scarf, straps across front of body or character. #00FF00 flat green everywhere else. Preserve brown leather, gold buckles, stitch and pale feathers. Bold dark outline warm cartoon paint, light upper left, no text or shadow. Target crop [200,800,1200,1600] from 1536x2304. Do not recenter or enlarge.
```

## gear-quiver-side.png

Fit target: `assets/source/A023-rat-complete-kit/torso-side.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-quiver.png`.

```text
Use case: precise-object-edit. Draw gear-quiver-side, one EMPTY separate quiver overlay. Image 1 exact current torso target torso-side, image 2 approved quiver design. brown leather cylindrical arrow quiver with gold buckled straps, stitched leather and three pale feathered arrows. Rides diagonally behind shoulder, arrows above camera-left shoulder, bottom near far waist. Redraw appropriate torso-side view with perspective following shoulder and waist in target. Keep exact target framing: place arrow tops above camera-left shoulder, quiver bottom at opposite lower waist behind body. Camera/front side view: quiver will be layered BEHIND torso; include complete hidden tube so it does not pop away. Output ONLY quiver and arrows, absolutely no torso, fur, arms, scarf, straps across front of body or character. #00FF00 flat green everywhere else. Preserve brown leather, gold buckles, stitch and pale feathers. Bold dark outline warm cartoon paint, light upper left, no text or shadow. Target crop [200,800,1200,1600] from 1536x2304. Do not recenter or enlarge.
```

## gear-quiver-back.png

Fit target: `assets/source/A023-rat-complete-kit/torso-back.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-quiver.png`.

```text
Use case: precise-object-edit. Draw gear-quiver-back, one EMPTY separate quiver overlay. Image 1 exact current torso target torso-back, image 2 approved quiver design. brown leather cylindrical arrow quiver with gold buckled straps, stitched leather and three pale feathered arrows. Rides diagonally behind shoulder, arrows above camera-left shoulder, bottom near far waist. Redraw appropriate torso-back view with perspective following shoulder and waist in target. Keep exact target framing: place arrow tops above camera-left shoulder, quiver bottom at opposite lower waist behind body. Rear view: whole quiver on back surface, visible in front of torso. Output ONLY quiver and arrows, absolutely no torso, fur, arms, scarf, straps across front of body or character. #00FF00 flat green everywhere else. Preserve brown leather, gold buckles, stitch and pale feathers. Bold dark outline warm cartoon paint, light upper left, no text or shadow. Target crop [200,800,1200,1600] from 1536x2304. Do not recenter or enlarge.
```

## gear-quiver-away.png

Fit target: `assets/source/A023-rat-complete-kit/torso-away.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-quiver.png`.

```text
Use case: precise-object-edit. Draw gear-quiver-away, one EMPTY separate quiver overlay. Image 1 exact current torso target torso-away, image 2 approved quiver design. brown leather cylindrical arrow quiver with gold buckled straps, stitched leather and three pale feathered arrows. Rides diagonally behind shoulder, arrows above camera-left shoulder, bottom near far waist. Redraw appropriate torso-away view with perspective following shoulder and waist in target. Keep exact target framing: place arrow tops above camera-left shoulder, quiver bottom at opposite lower waist behind body. Rear view: whole quiver on back surface, visible in front of torso. Output ONLY quiver and arrows, absolutely no torso, fur, arms, scarf, straps across front of body or character. #00FF00 flat green everywhere else. Preserve brown leather, gold buckles, stitch and pale feathers. Bold dark outline warm cartoon paint, light upper left, no text or shadow. Target crop [200,800,1200,1600] from 1536x2304. Do not recenter or enlarge.
```

## gear-quiver-hunched.png

Fit target: `assets/source/A023-rat-complete-kit/torso-hunched.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-quiver.png`.

```text
Use case: precise-object-edit. Draw gear-quiver-hunched, one EMPTY separate quiver overlay. Image 1 exact current torso target torso-hunched, image 2 approved quiver design. brown leather cylindrical arrow quiver with gold buckled straps, stitched leather and three pale feathered arrows. Rides diagonally behind shoulder, arrows above camera-left shoulder, bottom near far waist. Redraw appropriate torso-hunched view with perspective following shoulder and waist in target. Keep exact target framing: place arrow tops above camera-left shoulder, quiver bottom at opposite lower waist behind body. Camera/front side view: quiver will be layered BEHIND torso; include complete hidden tube so it does not pop away. Output ONLY quiver and arrows, absolutely no torso, fur, arms, scarf, straps across front of body or character. #00FF00 flat green everywhere else. Preserve brown leather, gold buckles, stitch and pale feathers. Bold dark outline warm cartoon paint, light upper left, no text or shadow. Target crop [200,800,1200,1600] from 1536x2304. Do not recenter or enlarge.
```

## gear-quiver-lean-back.png

Fit target: `assets/source/A023-rat-complete-kit/torso-lean-back.png`, crop [200,800,1200,1600]. Design crop: `/tmp/a020/gear-quiver.png`.

```text
Use case: precise-object-edit. Draw gear-quiver-lean-back, one EMPTY separate quiver overlay. Image 1 exact current torso target torso-lean-back, image 2 approved quiver design. brown leather cylindrical arrow quiver with gold buckled straps, stitched leather and three pale feathered arrows. Rides diagonally behind shoulder, arrows above camera-left shoulder, bottom near far waist. Redraw appropriate torso-lean-back view with perspective following shoulder and waist in target. Keep exact target framing: place arrow tops above camera-left shoulder, quiver bottom at opposite lower waist behind body. Rear view: whole quiver on back surface, visible in front of torso. Output ONLY quiver and arrows, absolutely no torso, fur, arms, scarf, straps across front of body or character. #00FF00 flat green everywhere else. Preserve brown leather, gold buckles, stitch and pale feathers. Bold dark outline warm cartoon paint, light upper left, no text or shadow. Target crop [200,800,1200,1600] from 1536x2304. Do not recenter or enlarge.
```

## gear-hood.png

Fit target: `assets/source/A018-rat-parts/head.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-hood.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-hood. Image 1 is exact current rat HEAD head, image 2 is approved gear design. olive khaki stitched ragged cloth hood, ear openings, worn patch on rear lower edge, open face. Ears and face NOT drawn; leave green holes. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. Three-quarter view facing right. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-helmet.png

Fit target: `assets/source/A018-rat-parts/head.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-helmet.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-helmet. Image 1 is exact current rat HEAD head, image 2 is approved gear design. scratched dull steel rat helmet with gold rivets and dark brown edging, two large curved ear openings, no horns. Face and ears NOT drawn. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. Three-quarter view facing right. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-captain-hat.png

Fit target: `assets/source/A018-rat-parts/head.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-captain-hat.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-captain-hat. Image 1 is exact current rat HEAD head, image 2 is approved gear design. dark brown tricorn captain hat, gold piping, curled golden feather. Sits between rat ears, tipped to follow skull; face and ears NOT drawn. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. Three-quarter view facing right. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-hood-back.png

Fit target: `assets/source/A022-rat-joint-repair/head-back.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-hood.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-hood-back. Image 1 is exact current rat HEAD head-back, image 2 is approved gear design. olive khaki stitched ragged cloth hood, ear openings, worn patch on rear lower edge, open face. Ears and face NOT drawn; leave green holes. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. BACK view, gear seen from behind, rear stitching, never show front face opening. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-helmet-back.png

Fit target: `assets/source/A022-rat-joint-repair/head-back.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-helmet.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-helmet-back. Image 1 is exact current rat HEAD head-back, image 2 is approved gear design. scratched dull steel rat helmet with gold rivets and dark brown edging, two large curved ear openings, no horns. Face and ears NOT drawn. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. BACK view, gear seen from behind, rear stitching, never show front face opening. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-captain-hat-back.png

Fit target: `assets/source/A022-rat-joint-repair/head-back.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-captain-hat.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-captain-hat-back. Image 1 is exact current rat HEAD head-back, image 2 is approved gear design. dark brown tricorn captain hat, gold piping, curled golden feather. Sits between rat ears, tipped to follow skull; face and ears NOT drawn. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. BACK view, gear seen from behind, rear stitching, never show front face opening. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-hood-hurt.png

Fit target: `assets/source/A018-rat-parts/head-hurt.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-hood.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-hood-hurt. Image 1 is exact current rat HEAD head-hurt, image 2 is approved gear design. olive khaki stitched ragged cloth hood, ear openings, worn patch on rear lower edge, open face. Ears and face NOT drawn; leave green holes. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. Three-quarter view facing right. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-helmet-hurt.png

Fit target: `assets/source/A018-rat-parts/head-hurt.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-helmet.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-helmet-hurt. Image 1 is exact current rat HEAD head-hurt, image 2 is approved gear design. scratched dull steel rat helmet with gold rivets and dark brown edging, two large curved ear openings, no horns. Face and ears NOT drawn. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. Three-quarter view facing right. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-captain-hat-hurt.png

Fit target: `assets/source/A018-rat-parts/head-hurt.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-captain-hat.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-captain-hat-hurt. Image 1 is exact current rat HEAD head-hurt, image 2 is approved gear design. dark brown tricorn captain hat, gold piping, curled golden feather. Sits between rat ears, tipped to follow skull; face and ears NOT drawn. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. Three-quarter view facing right. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-hood-front.png

Fit target: `assets/source/A023-rat-complete-kit/head-front.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-hood.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-hood-front. Image 1 is exact current rat HEAD head-front, image 2 is approved gear design. olive khaki stitched ragged cloth hood, ear openings, worn patch on rear lower edge, open face. Ears and face NOT drawn; leave green holes. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. Direct FRONT view, both ear holes visible, symmetrical skull, camera-side feather on image left. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-helmet-front.png

Fit target: `assets/source/A023-rat-complete-kit/head-front.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-helmet.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-helmet-front. Image 1 is exact current rat HEAD head-front, image 2 is approved gear design. scratched dull steel rat helmet with gold rivets and dark brown edging, two large curved ear openings, no horns. Face and ears NOT drawn. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. Direct FRONT view, both ear holes visible, symmetrical skull, camera-side feather on image left. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-captain-hat-front.png

Fit target: `assets/source/A023-rat-complete-kit/head-front.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-captain-hat.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-captain-hat-front. Image 1 is exact current rat HEAD head-front, image 2 is approved gear design. dark brown tricorn captain hat, gold piping, curled golden feather. Sits between rat ears, tipped to follow skull; face and ears NOT drawn. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. Direct FRONT view, both ear holes visible, symmetrical skull, camera-side feather on image left. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-hood-drink.png

Fit target: `assets/source/A023-rat-complete-kit/head-drink.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-hood.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-hood-drink. Image 1 is exact current rat HEAD head-drink, image 2 is approved gear design. olive khaki stitched ragged cloth hood, ear openings, worn patch on rear lower edge, open face. Ears and face NOT drawn; leave green holes. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. This head tips backward nose up: rotate and foreshorten gear to match tilted skull, keep ears clear and never cover upturned muzzle. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-helmet-drink.png

Fit target: `assets/source/A023-rat-complete-kit/head-drink.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-helmet.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-helmet-drink. Image 1 is exact current rat HEAD head-drink, image 2 is approved gear design. scratched dull steel rat helmet with gold rivets and dark brown edging, two large curved ear openings, no horns. Face and ears NOT drawn. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. This head tips backward nose up: rotate and foreshorten gear to match tilted skull, keep ears clear and never cover upturned muzzle. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## gear-captain-hat-drink.png

Fit target: `assets/source/A023-rat-complete-kit/head-drink.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-captain-hat.png`.

```text
Use case: precise-object-edit. Draw one gear overlay gear-captain-hat-drink. Image 1 is exact current rat HEAD head-drink, image 2 is approved gear design. dark brown tricorn captain hat, gold piping, curled golden feather. Sits between rat ears, tipped to follow skull; face and ears NOT drawn. Redraw to FIT THE SKULL of image 1 precisely, at its exact size and position. This head tips backward nose up: rotate and foreshorten gear to match tilted skull, keep ears clear and never cover upturned muzzle. Output ONLY EMPTY HEADWEAR on flat #00FF00 green. REMOVE all head, ears, eyes, face, neck and fur. Leave face and ear openings green. Do NOT draw an entire rat or furry ears. Keep target image 1 framing, green margins and relative location; never recenter or enlarge. Source crop [300,300,1450,1350] on 1536x2304. Bold dark outline, warm painted cartoon, upper-left light, no shadow or text.
```

## detail-eyepatch-front.png

Fit target: `assets/source/A023-rat-complete-kit/head-front.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/detail-eyepatch.png`.

```text
Use case precise-object-edit. One face detail overlay detail-eyepatch-front. Image 1 is exact head head-front placement target. Image 2 approved face detail design. single brown stitched leather eyepatch with narrow strap, covers only camera-side eye (left of image in front view), other eye uncovered. No eye or fur drawn. Front head: camera side is image-left eye/cheek/ear. Draw detail at exact correct ANATOMICAL LOCATION on image 1, then REMOVE EVERY PIXEL OF HEAD except the new detail: only overlay on #00FF00 green. Do not draw fur, skin, eyes or anatomy. Keep same target framing and relative size. Detail is small, does not fill image. Keep gold/pink/brown design from reference, bold dark outlines. No shadow or text. Original source crop [300,300,1450,1350] in 1536x2304.
```

## detail-scar2-front.png

Fit target: `assets/source/A023-rat-complete-kit/head-front.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/detail-scar2.png`.

```text
Use case precise-object-edit. One face detail overlay detail-scar2-front. Image 1 is exact head head-front placement target. Image 2 approved face detail design. two small pale pink angular scars with dark outlines on camera-side cheek. No fur or face drawn. Front head: camera side is image-left eye/cheek/ear. Draw detail at exact correct ANATOMICAL LOCATION on image 1, then REMOVE EVERY PIXEL OF HEAD except the new detail: only overlay on #00FF00 green. Do not draw fur, skin, eyes or anatomy. Keep same target framing and relative size. Detail is small, does not fill image. Keep gold/pink/brown design from reference, bold dark outlines. No shadow or text. Original source crop [300,300,1450,1350] in 1536x2304.
```

## detail-ear-notch-front.png

Fit target: `assets/source/A023-rat-complete-kit/head-front.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/detail-ear-notch.png`.

```text
Use case precise-object-edit. One face detail overlay detail-ear-notch-front. Image 1 is exact head head-front placement target. Image 2 approved face detail design. tiny pink dark outlined angular inner ear notch overlay at outer camera-side ear edge. Do not paint green into ear, represent only the torn-rim detail. Front head: camera side is image-left eye/cheek/ear. Draw detail at exact correct ANATOMICAL LOCATION on image 1, then REMOVE EVERY PIXEL OF HEAD except the new detail: only overlay on #00FF00 green. Do not draw fur, skin, eyes or anatomy. Keep same target framing and relative size. Detail is small, does not fill image. Keep gold/pink/brown design from reference, bold dark outlines. No shadow or text. Original source crop [300,300,1450,1350] in 1536x2304.
```

## detail-earring-front.png

Fit target: `assets/source/A023-rat-complete-kit/head-front.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/detail-earring.png`.

```text
Use case precise-object-edit. One face detail overlay detail-earring-front. Image 1 is exact head head-front placement target. Image 2 approved face detail design. single thick gold hoop earring at bottom of camera-side ear. No ear or fur drawn. Front head: camera side is image-left eye/cheek/ear. Draw detail at exact correct ANATOMICAL LOCATION on image 1, then REMOVE EVERY PIXEL OF HEAD except the new detail: only overlay on #00FF00 green. Do not draw fur, skin, eyes or anatomy. Keep same target framing and relative size. Detail is small, does not fill image. Keep gold/pink/brown design from reference, bold dark outlines. No shadow or text. Original source crop [300,300,1450,1350] in 1536x2304.
```

## detail-eyepatch-drink.png

Fit target: `assets/source/A023-rat-complete-kit/head-drink.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/detail-eyepatch.png`.

```text
Use case precise-object-edit. One face detail overlay detail-eyepatch-drink. Image 1 is exact head head-drink placement target. Image 2 approved face detail design. single brown stitched leather eyepatch with narrow strap, covers only camera-side eye (left of image in front view), other eye uncovered. No eye or fur drawn. Drinking head tipped backward nose up: camera side is large ear at image-left and visible near cheek. Draw detail at exact correct ANATOMICAL LOCATION on image 1, then REMOVE EVERY PIXEL OF HEAD except the new detail: only overlay on #00FF00 green. Do not draw fur, skin, eyes or anatomy. Keep same target framing and relative size. Detail is small, does not fill image. Keep gold/pink/brown design from reference, bold dark outlines. No shadow or text. Original source crop [300,300,1450,1350] in 1536x2304.
```

## detail-scar2-drink.png

Fit target: `assets/source/A023-rat-complete-kit/head-drink.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/detail-scar2.png`.

```text
Use case precise-object-edit. One face detail overlay detail-scar2-drink. Image 1 is exact head head-drink placement target. Image 2 approved face detail design. two small pale pink angular scars with dark outlines on camera-side cheek. No fur or face drawn. Drinking head tipped backward nose up: camera side is large ear at image-left and visible near cheek. Draw detail at exact correct ANATOMICAL LOCATION on image 1, then REMOVE EVERY PIXEL OF HEAD except the new detail: only overlay on #00FF00 green. Do not draw fur, skin, eyes or anatomy. Keep same target framing and relative size. Detail is small, does not fill image. Keep gold/pink/brown design from reference, bold dark outlines. No shadow or text. Original source crop [300,300,1450,1350] in 1536x2304.
```

## detail-ear-notch-drink.png

Fit target: `assets/source/A023-rat-complete-kit/head-drink.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/detail-ear-notch.png`.

```text
Use case precise-object-edit. One face detail overlay detail-ear-notch-drink. Image 1 is exact head head-drink placement target. Image 2 approved face detail design. tiny pink dark outlined angular inner ear notch overlay at outer camera-side ear edge. Do not paint green into ear, represent only the torn-rim detail. Drinking head tipped backward nose up: camera side is large ear at image-left and visible near cheek. Draw detail at exact correct ANATOMICAL LOCATION on image 1, then REMOVE EVERY PIXEL OF HEAD except the new detail: only overlay on #00FF00 green. Do not draw fur, skin, eyes or anatomy. Keep same target framing and relative size. Detail is small, does not fill image. Keep gold/pink/brown design from reference, bold dark outlines. No shadow or text. Original source crop [300,300,1450,1350] in 1536x2304.
```

## detail-earring-drink.png

Fit target: `assets/source/A023-rat-complete-kit/head-drink.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/detail-earring.png`.

```text
Use case precise-object-edit. One face detail overlay detail-earring-drink. Image 1 is exact head head-drink placement target. Image 2 approved face detail design. single thick gold hoop earring at bottom of camera-side ear. No ear or fur drawn. Drinking head tipped backward nose up: camera side is large ear at image-left and visible near cheek. Draw detail at exact correct ANATOMICAL LOCATION on image 1, then REMOVE EVERY PIXEL OF HEAD except the new detail: only overlay on #00FF00 green. Do not draw fur, skin, eyes or anatomy. Keep same target framing and relative size. Detail is small, does not fill image. Keep gold/pink/brown design from reference, bold dark outlines. No shadow or text. Original source crop [300,300,1450,1350] in 1536x2304.
```

## gear-hood-attack.png

Fit target: `assets/source/A018-rat-parts/head-attack.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-hood.png`.

```text
Precise-object-edit, gear-hood-attack, single headwear overlay. Image 1 CURRENT head-attack is exact fit target; image 2 A011 approved gear design. olive khaki stitched ragged cloth hood, ear openings, worn patch on rear lower edge, open face. Ears and face NOT drawn; leave green holes. This head has a wide open mouth and higher ears than neutral. Match gear to exact skull and ear positions, keep the open mouth/jaw/snout completely clear. The hood's face opening must leave the entire open jaw visible. Draw only EMPTY HEADWEAR in same image1 framing, no head, eyes, ears, fur, teeth, scarf or body. #00FF00 green in every opening and all margins. Preserve approved colors, gold feather/steel/olive cloth as appropriate. Upper-left light, bold dark outlines, no shadow or text. Keep target framing and margins. Original source crop [300,300,1450,1350] on1536x2304.
```

## gear-hood-shout.png

Fit target: `assets/source/A023-rat-complete-kit/head-shout.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-hood.png`.

```text
Precise-object-edit, gear-hood-shout, single headwear overlay. Image 1 CURRENT head-shout is exact fit target; image 2 A011 approved gear design. olive khaki stitched ragged cloth hood, ear openings, worn patch on rear lower edge, open face. Ears and face NOT drawn; leave green holes. This head has a wide open mouth and higher ears than neutral. Match gear to exact skull and ear positions, keep the open mouth/jaw/snout completely clear. The hood's face opening must leave the entire open jaw visible. Draw only EMPTY HEADWEAR in same image1 framing, no head, eyes, ears, fur, teeth, scarf or body. #00FF00 green in every opening and all margins. Preserve approved colors, gold feather/steel/olive cloth as appropriate. Upper-left light, bold dark outlines, no shadow or text. Keep target framing and margins. Original source crop [300,300,1450,1350] on1536x2304.
```

## gear-helmet-shout.png

Fit target: `assets/source/A023-rat-complete-kit/head-shout.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-helmet.png`.

```text
Precise-object-edit, gear-helmet-shout, single headwear overlay. Image 1 CURRENT head-shout is exact fit target; image 2 A011 approved gear design. scratched dull steel rat helmet with gold rivets and dark brown edging, two large curved ear openings, no horns. Face and ears NOT drawn. This head has a wide open mouth and higher ears than neutral. Match gear to exact skull and ear positions, keep the open mouth/jaw/snout completely clear. The hood's face opening must leave the entire open jaw visible. Draw only EMPTY HEADWEAR in same image1 framing, no head, eyes, ears, fur, teeth, scarf or body. #00FF00 green in every opening and all margins. Preserve approved colors, gold feather/steel/olive cloth as appropriate. Upper-left light, bold dark outlines, no shadow or text. Keep target framing and margins. Original source crop [300,300,1450,1350] on1536x2304.
```

## gear-captain-hat-shout.png

Fit target: `assets/source/A023-rat-complete-kit/head-shout.png`, crop [300,300,1450,1350]. Design crop: `/tmp/a020/gear-captain-hat.png`.

```text
Precise-object-edit, gear-captain-hat-shout, single headwear overlay. Image 1 CURRENT head-shout is exact fit target; image 2 A011 approved gear design. dark brown tricorn captain hat, gold piping, curled golden feather. Sits between rat ears, tipped to follow skull; face and ears NOT drawn. This head has a wide open mouth and higher ears than neutral. Match gear to exact skull and ear positions, keep the open mouth/jaw/snout completely clear. The hood's face opening must leave the entire open jaw visible. Draw only EMPTY HEADWEAR in same image1 framing, no head, eyes, ears, fur, teeth, scarf or body. #00FF00 green in every opening and all margins. Preserve approved colors, gold feather/steel/olive cloth as appropriate. Upper-left light, bold dark outlines, no shadow or text. Keep target framing and margins. Original source crop [300,300,1450,1350] on1536x2304.
```

# Superseded attempts (images not delivered)

## Initial jerkin attempt

```text
Use case: precise-object-edit. Draw one game rig overlay: A011 approved brown quilted leather jerkin redesigned ONLY in fit to the current torso. Image 1 is design reference (gold edging, deep V neck, diamond quilting, two gold buckles, side lacing and small flap pocket), image 2 is exact fit target on green, crop represents source canvas rectangle [360,850,1120,1550] on 1536x2304. Output ONLY the empty sleeveless jerkin, no body, no fur, no scarf, no pauldron, no under-body paint. Precisely match image 2 silhouette at waist and shoulders: wide hunched three-quarter torso facing right. The V neck leaves the red scarf above visible when composited. Keep output image the identical framing/aspect as target image 2; green background #00FF00. Bold dark outlined warm painted cartoon, upper-left light, no shadow, no text. Do not copy the old body's narrow tall proportions.
```

## Jerkin fit retry

```text
Use case precise-object-edit. EDIT IMAGE 1, the current rat torso. Replace its brown harness and exposed belly with the quilted brown leather jerkin from image 2. Absolutely preserve IMAGE 1's framing, exact shoulder positions, hunched short wide body width, waist position and angle. The vest must be SHORT AND WIDE to fit this body, not tall like reference 2. Preserve the red scarf and pauldron initially as fit guides, but in final output REMOVE EVERYTHING EXCEPT THE NEW JERKIN overlay: remove scarf, pauldron, fur, body and harness to pure flat #00FF00. Leave openings transparent green. Keep the jerkin located exactly where it belongs on IMAGE 1 canvas with identical green margins. Two gold buckles at camera right, gold piping, brown diamond quilting, side lacing and small flap pocket as approved. Bold dark outline warm cartoon upper-left lighting. ONE empty torso gear overlay only; no added body. Match exact target position, do not recenter or enlarge.
```

## gear-jerkin, superseded separate-overlay attempt

Inputs: `/tmp/a020/target-torso.png`, `/tmp/a020/gear-jerkin.png`.

```text
Use case: precise-object-edit. Asset: gear-jerkin. Image 1 is exact current body fit target (torso); Image 2 is approved gear design reference, not size reference. Redraw just ONE jerkin OVERLAY to dress image 1 in its exact pose. brown diamond-quilted sleeveless leather jerkin, gold piping, two gold buckles on camera-facing right, side lacing and small pocket. Back shows diamond quilted back, no front buckles. Match target body perspective torso; wide short hunched rat torso, not human body. Keep image 1 framing and proportions, shoulder and waist positions locked. Output gear ONLY on flat #00FF00; remove body, fur, scarf, pauldron, all existing clothing, no character. Leave neck and arm openings green. Fit hem over target belly edge, no fur peeking below. Preserve design details and palette from image 2. Bold dark outlines, upper-left lighting, warm painted cartoon. No text or shadow. Source crop rectangle [200,800,1200,1600] in 1536x2304 canvas. Maintain exact target framing.
```

## gear-jerkin-back, superseded separate-overlay attempt

Inputs: `/tmp/a020/target-torso-back.png`, `/tmp/a020/gear-jerkin.png`.

```text
Use case: precise-object-edit. Asset: gear-jerkin-back. Image 1 is exact current body fit target (torso-back); Image 2 is approved gear design reference, not size reference. Redraw just ONE jerkin OVERLAY to dress image 1 in its exact pose. brown diamond-quilted sleeveless leather jerkin, gold piping, two gold buckles on camera-facing right, side lacing and small pocket. Back shows diamond quilted back, no front buckles. Match target body perspective torso-back; wide short hunched rat torso, not human body. Keep image 1 framing and proportions, shoulder and waist positions locked. Output gear ONLY on flat #00FF00; remove body, fur, scarf, pauldron, all existing clothing, no character. Leave neck and arm openings green. Fit hem over target belly edge, no fur peeking below. Preserve design details and palette from image 2. Bold dark outlines, upper-left lighting, warm painted cartoon. No text or shadow. Source crop rectangle [200,800,1200,1600] in 1536x2304 canvas. Maintain exact target framing.
```

## gear-jerkin-away, superseded separate-overlay attempt

Inputs: `/tmp/a020/target-torso-away.png`, `/tmp/a020/gear-jerkin.png`.

```text
Use case: precise-object-edit. Asset: gear-jerkin-away. Image 1 is exact current body fit target (torso-away); Image 2 is approved gear design reference, not size reference. Redraw just ONE jerkin OVERLAY to dress image 1 in its exact pose. brown diamond-quilted sleeveless leather jerkin, gold piping, two gold buckles on camera-facing right, side lacing and small pocket. Back shows diamond quilted back, no front buckles. Match target body perspective torso-away; wide short hunched rat torso, not human body. Keep image 1 framing and proportions, shoulder and waist positions locked. Output gear ONLY on flat #00FF00; remove body, fur, scarf, pauldron, all existing clothing, no character. Leave neck and arm openings green. Fit hem over target belly edge, no fur peeking below. Preserve design details and palette from image 2. Bold dark outlines, upper-left lighting, warm painted cartoon. No text or shadow. Source crop rectangle [200,800,1200,1600] in 1536x2304 canvas. Maintain exact target framing.
```

## gear-jerkin-front, superseded separate-overlay attempt

Inputs: `/tmp/a020/target-torso-front.png`, `/tmp/a020/gear-jerkin.png`.

```text
Use case: precise-object-edit. Asset: gear-jerkin-front. Image 1 is exact current body fit target (torso-front); Image 2 is approved gear design reference, not size reference. Redraw just ONE jerkin OVERLAY to dress image 1 in its exact pose. brown diamond-quilted sleeveless leather jerkin, gold piping, two gold buckles on camera-facing right, side lacing and small pocket. Back shows diamond quilted back, no front buckles. Match target body perspective torso-front; wide short hunched rat torso, not human body. Keep image 1 framing and proportions, shoulder and waist positions locked. Output gear ONLY on flat #00FF00; remove body, fur, scarf, pauldron, all existing clothing, no character. Leave neck and arm openings green. Fit hem over target belly edge, no fur peeking below. Preserve design details and palette from image 2. Bold dark outlines, upper-left lighting, warm painted cartoon. No text or shadow. Source crop rectangle [200,800,1200,1600] in 1536x2304 canvas. Maintain exact target framing.
```
