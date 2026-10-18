# A023 exact prompts

Tool: built-in `image_gen.imagegen` (no CLI). Source: approved A017 master; isolated A022 cuts for seam/view repair; registered A023 cuts for targeted refinements. No seeds exposed.

Postprocessing: green-key extraction, largest 8-connected component, mechanical cropping, uniform scale registration, source-paint cut/translation for hidden seam extensions, source-paint restoration, static composition. No procedural drawing or runtime code. Generated raw outputs/discards are excluded. New drawings are reference-guided repaint; strict visible master-pixel preservation is not achieved.

## 1. torso-front

```text
Use case: identity-preserve. Production cutout sprite edit for Cloak & Claw. Reference image is the approved Rat Raider master, not a redesign. Produce ONLY a detached torso-front part: chest turned toward camera, both shoulders visible, near shoulder forward, frontal chest about 45 degrees beyond the reference three-quarter view. Include its red neck scarf, brown leather vest with diagonal strap and gold fastenings, cream chest fur, near metal/leather pauldron. No head, no arms, no hands, no pelvis/belt, no legs, no tail. Match the master's exact warm paint, bold dark outline, upper-left light, proportions and details. Complete only newly revealed surfaces. One connected shape. Flat exact #00FF00 background, no shadow, no text. Canvas 1536x2304; torso occupies approximately x450..1010 y1030..1430, waist pivot at (776,1382). Keep huge green margin, DO NOT enlarge part to fill canvas. Hidden neck/shoulder/waist overlap ends are plain continuations of material, never balls/discs. This is torso-front.png.
```

## 2. torso-away

```text
Use case: identity-preserve. Asset: torso-away. Edit the reference approved Rat Raider master into this single game rig part: ONLY detached torso, back three-quarter turned away for a wound-back swing, more back leather vest and scarf visible, near shoulder pulled back. No belt or limbs. Torso approximately 560 by 400 native pixels. Match the master's warm painted cartoon, exact colors, proportions, bold dark outlines, upper-left lighting and costume construction. Preserve source paint where visible, paint only revealed anatomy. One connected isolated piece on flat exact #00FF00. No text, shadow, other parts or accessories. Canvas1536x2304 with generous green margins. Keep detached part small at its native character scale, do not fill canvas. Hidden overlap ends continue material, never balls/discs/holes.
```

## 3. torso-hunched

```text
Use case: identity-preserve. Asset: torso-hunched. Edit the reference approved Rat Raider master into this single game rig part: ONLY detached three-quarter torso, shoulders rounded forward/down, neck lowered, compressed chest, for block/cower/chop. Same vest, cream belly, scarf and pauldron; no limbs/head/belt. Torso 560 by 370 native pixels. Match the master's warm painted cartoon, exact colors, proportions, bold dark outlines, upper-left lighting and costume construction. Preserve source paint where visible, paint only revealed anatomy. One connected isolated piece on flat exact #00FF00. No text, shadow, other parts or accessories. Canvas1536x2304 with generous green margins. Keep detached part small at its native character scale, do not fill canvas. Hidden overlap ends continue material, never balls/discs/holes.
```

## 4. torso-lean-back

```text
Use case: identity-preserve. Asset: torso-lean-back. Edit the reference approved Rat Raider master into this single game rig part: ONLY detached three-quarter torso, arched backward chest, neck pulled left/back, for hurt and overhead windup. Same vest, cream belly, scarf and pauldron. No limbs/head/belt. Torso 560 by 450 native pixels. Match the master's warm painted cartoon, exact colors, proportions, bold dark outlines, upper-left lighting and costume construction. Preserve source paint where visible, paint only revealed anatomy. One connected isolated piece on flat exact #00FF00. No text, shadow, other parts or accessories. Canvas1536x2304 with generous green margins. Keep detached part small at its native character scale, do not fill canvas. Hidden overlap ends continue material, never balls/discs/holes.
```

## 5. pelvis-side

```text
Use case: identity-preserve. Asset pelvis-side. Reference approved Rat Raider master. Extract/redraw ONLY this single part: ONLY detached pelvis/waistband/upper seat, true right profile. Brown belt, pouch, patched ragged olive-brown trousers upper seat only, NO thighs/legs, no torso. Tail root tucks under seat, do not include tail. About 440 by 250 native pixels. Match exact master paint palette, outfit details, bold dark outline and upper-left light. Preserve visible source paint; complete revealed surfaces only. ONE connected part, flat #00FF00 background, no text or shadow. Canvas1536x2304, generous green margins. NO head, arms, chest or feet. Trousers seat only ends just below hip joints, not full pants.
```

## 6. pelvis-front

```text
Use case: identity-preserve. Asset pelvis-front. Reference approved Rat Raider master. Extract/redraw ONLY this single part: ONLY detached pelvis/waistband/upper seat facing camera, belt buckle frontal, pouch on image left. Patched ragged olive-brown trousers upper seat only, no thighs/legs or torso. No tail, root hidden under seat. About 500 by 250 native pixels. Match exact master paint palette, outfit details, bold dark outline and upper-left light. Preserve visible source paint; complete revealed surfaces only. ONE connected part, flat #00FF00 background, no text or shadow. Canvas1536x2304, generous green margins. NO head, arms, chest or feet. Trousers seat only ends just below hip joints, not full pants.
```

## 7. pelvis-back

```text
Use case: identity-preserve. Asset pelvis-back. Reference approved Rat Raider master. Extract/redraw ONLY this single part: ONLY detached pelvis/waistband/upper seat viewed directly from behind; brown belt wraps around ragged olive-brown trouser seat. No front buckle at center back. Clean outlined pink tail root at center seat lower edge, pointing down for foreground tail attachment. NO legs or torso. About 500 by 250 native pixels. Match exact master paint palette, outfit details, bold dark outline and upper-left light. Preserve visible source paint; complete revealed surfaces only. ONE connected part, flat #00FF00 background, no text or shadow. Canvas1536x2304, generous green margins. NO head, arms, chest or feet. Trousers seat only ends just below hip joints, not full pants.
```

## 8. head-front

```text
Use case: identity-preserve. Asset head-front. Reference approved Rat Raider master, edit target. ONLY detached same rat head, facing directly toward camera, turn midpoint. Both ears, same fur tuft, scar on image left cheek, cream muzzle, buck teeth, eyebrows and brown eyes. No scarf or body. Keep head proportions, not a different rat. Native head about 800 by 600 pixels. EXACT same character identity, warm painted palette, bold dark outlines, upper-left light. Preserve source paint wherever possible. One connected isolated head on exact flat #00FF00, no shadows or text. Canvas1536x2304, generous green margin. No torso, neck scarf, weapons, limbs or accessories.
```

## 9. head-drink

```text
Use case: identity-preserve. Asset head-drink. Reference approved Rat Raider master, edit target. ONLY detached same rat head in right-facing three-quarter view, eyes shut, head tipped back, muzzle and lips raised ready for a bottle neck. No bottle, no body/scarf. Preserve ears scar muzzle tuft and colors. Native head about 800 by 600 pixels. EXACT same character identity, warm painted palette, bold dark outlines, upper-left light. Preserve source paint wherever possible. One connected isolated head on exact flat #00FF00, no shadows or text. Canvas1536x2304, generous green margin. No torso, neck scarf, weapons, limbs or accessories.
```

## 10. head-shout

```text
Use case: identity-preserve. Asset head-shout. Reference approved Rat Raider master, edit target. ONLY detached same rat head in same right-facing three-quarter view, shouting/rallying, mouth wide open, visible buck teeth and tongue, fierce command expression. Keep exact head silhouette ears fur scar and palette. No scarf/body. Native head about 800 by 600 pixels. EXACT same character identity, warm painted palette, bold dark outlines, upper-left light. Preserve source paint wherever possible. One connected isolated head on exact flat #00FF00, no shadows or text. Canvas1536x2304, generous green margin. No torso, neck scarf, weapons, limbs or accessories.
```

## 11. arm-far-raised

```text
Use case: identity-preserve. Asset arm-far-raised. Reference approved Rat Raider master. ONLY detached FAR whole arm straight up, upper arm brown/cream fur, leather wrist bracer, pink closed fist at top. Shoulder at bottom extends as plain fur for hidden overlap; NO round ball cap. No body or weapon. Arm native length 450px, thickness 140px. Same exact warm painted palette, bold dark outlines, upper-left light, anatomy and costume details. Single isolated connected part on flat #00FF00 background. NO head or body, no text/shadow, canvas1536x2304 green margins. Hidden ends are extended plain material without visible joint discs.
```

## 12. shoulder-far

```text
Use case: identity-preserve. Asset shoulder-far. Reference approved Rat Raider master. ONLY detached far shoulder cap, brown fur shoulder with brown leather vest edge (far side has NO large metal pauldron), small stitched leather trim. Lower edge finished outline, top extends beneath torso vest. No arm/head/body. Small piece about 170 by 150 native pixels. Same exact warm painted palette, bold dark outlines, upper-left light, anatomy and costume details. Single isolated connected part on flat #00FF00 background. NO head or body, no text/shadow, canvas1536x2304 green margins. Hidden ends are extended plain material without visible joint discs.
```

## 13. shoulder-near

```text
Use case: identity-preserve. Asset shoulder-near. Reference approved Rat Raider master. ONLY detached near shoulder cap: master's metal-topped brown stitched leather pauldron with gold ring, small vest edge. Cap lower edge fully dark outlined and finished, top plain overlap beneath vest. No arm/head/body/scarf. Small piece about 240 by 180 native pixels. Same exact warm painted palette, bold dark outlines, upper-left light, anatomy and costume details. Single isolated connected part on flat #00FF00 background. NO head or body, no text/shadow, canvas1536x2304 green margins. Hidden ends are extended plain material without visible joint discs.
```

## 14. arm-near-smear-h

```text
Use case: identity-preserve. Asset arm-near-smear-h. Reference approved Rat Raider master. ONLY detached NEAR whole arm on fast horizontal swing arc toward right. Brown/cream fur upper arm, stitched brown leather bracer, pink side grip fist at right end, open-ended narrow cutlass grip slit, NO weapon. Swept tapered painterly motion extensions must connect into single silhouette, no separate speed lines, no giant ball shoulder. Native width 610px height220px. Same exact master warm paint, thick dark outlines, anatomy, pink skin and glove/bracer design, upper-left light. ONE connected isolated part, exact flat #00FF00 background, no other anatomy or items, no text/shadow. Canvas1536x2304 green margins. No round wrist or shoulder discs.
```

## 15. arm-near-smear-o

```text
Use case: identity-preserve. Asset arm-near-smear-o. Reference approved Rat Raider master. ONLY detached NEAR whole arm on fast descending overhead arc, shoulder upper left, bracer and pink side grip fist at lower right. Narrow open-ended cutlass grip slit, NO weapon. Swept tapered painterly motion extensions connect in single silhouette. No discs or detached speed lines. Native 400px width 540px height. Same exact master warm paint, thick dark outlines, anatomy, pink skin and glove/bracer design, upper-left light. ONE connected isolated part, exact flat #00FF00 background, no other anatomy or items, no text/shadow. Canvas1536x2304 green margins. No round wrist or shoulder discs.
```

## 16. hand-near-palm

```text
Use case: identity-preserve. Asset hand-near-palm. Reference approved Rat Raider master. ONLY detached NEAR rat hand, flat open palm facing viewer, four fingers plus thumb splayed, pink skin dark claws, brown fingerless leather glove back/edge. Wrist at top with long narrow leather hidden end, no bracer/disc. Native hand 180px wide 200px tall. Same exact master warm paint, thick dark outlines, anatomy, pink skin and glove/bracer design, upper-left light. ONE connected isolated part, exact flat #00FF00 background, no other anatomy or items, no text/shadow. Canvas1536x2304 green margins. No round wrist or shoulder discs.
```

## 17. hand-far-palm

```text
Use case: identity-preserve. Asset hand-far-palm. Reference approved Rat Raider master. ONLY detached FAR rat hand, flat open palm facing outward, pink skin dark claws, brown fingerless leather glove edge. Fingers splayed, far hand mirrored anatomical thumb relative near. Wrist at top long narrow hidden leather end, no bracer/disc. Native hand160px by190px. Same exact master warm paint, thick dark outlines, anatomy, pink skin and glove/bracer design, upper-left light. ONE connected isolated part, exact flat #00FF00 background, no other anatomy or items, no text/shadow. Canvas1536x2304 green margins. No round wrist or shoulder discs.
```

## 18. foot-near-out

```text
Use case: identity-preserve. Asset foot-near-out. Reference approved Rat Raider master. ONLY detached NEAR rat foot planted flat, turned outward toward camera, same brown leather ankle wrap and pink three toes dark claws. Plain ankle hidden overlap at top. Native foot300px by190px. Keep EXACT master proportions, paint colors, brown leather wraps, pink toes and black claws. Thick dark outline upper-left lighting, no ground shadow. One isolated connected foot on flat exact #00FF00, no leg/body, no text. Canvas1536x2304 with green margins.
```

## 19. foot-near-heel

```text
Use case: identity-preserve. Asset foot-near-heel. Reference approved Rat Raider master. ONLY detached NEAR rat foot with same brown leather ankle wrap, pink three toes dark claws, heel on ground and toes lifted upward for heel-strike. Right facing three-quarter. Plain ankle hidden overlap at top, no circles. Native foot300px by190px. Keep EXACT master proportions, paint colors, brown leather wraps, pink toes and black claws. Thick dark outline upper-left lighting, no ground shadow. One isolated connected foot on flat exact #00FF00, no leg/body, no text. Canvas1536x2304 with green margins.
```

## 20. foot-far-heel

```text
Use case: identity-preserve. Asset foot-far-heel. Reference approved Rat Raider master. ONLY detached FAR rat foot with same brown leather ankle wrap, pink three toes dark claws, heel on ground and toes lifted upward for heel-strike. Right facing three-quarter. Plain ankle overlap, no circles. Native foot290px by180px. Keep EXACT master proportions, paint colors, brown leather wraps, pink toes and black claws. Thick dark outline upper-left lighting, no ground shadow. One isolated connected foot on flat exact #00FF00, no leg/body, no text. Canvas1536x2304 with green margins.
```

## 21. arm-near-mouth

```text
Use case: identity-preserve. Asset arm-near-mouth. Reference approved Rat Raider master. ONLY detached NEAR whole arm bent strongly, elbow forward to right, side-grip fist up at lips height to right of shoulder for drinking. Shoulder bottom left extends as plain brown/cream fur hidden overlap; leather bracer and pink side-grip fist top right. Narrow open-ended bottle grip slit; no item, head, body or pauldron, no circular shoulder. Native extent460px by330px. Match EXACT master anatomy, warm fur/pink skin, stitched fingerless brown glove and bracer details, bold dark outline upper-left light. One connected isolated part on flat exact #00FF00. No extra anatomy/body, no text/shadow. Canvas1536x2304 green margins. Hidden wrist/shoulder ends extend plain material, no visible discs/balls.
```

## 22. hand-near-cup

```text
Use case: identity-preserve. Asset hand-near-cup. Reference approved Rat Raider master. ONLY detached NEAR rat hand cupped palm UP, open curled fingers cradling invisible orb, thumb visible, pink skin dark claws, brown fingerless glove. NO orb/effect. Wrist enters from upper left with long narrow hidden end, no disc/bracer. Native hand200px by160px. Match EXACT master anatomy, warm fur/pink skin, stitched fingerless brown glove and bracer details, bold dark outline upper-left light. One connected isolated part on flat exact #00FF00. No extra anatomy/body, no text/shadow. Canvas1536x2304 green margins. Hidden wrist/shoulder ends extend plain material, no visible discs/balls.
```

## 23. hand-far-cup

```text
Use case: identity-preserve. Asset hand-far-cup. Reference approved Rat Raider master. ONLY detached FAR rat hand cupped palm UP, open curled fingers cradling invisible orb, far-side thumb anatomy, pink skin dark claws, brown fingerless glove. NO orb/effect. Wrist enters from upper right with long narrow hidden end, no disc/bracer. Native hand180px by150px. Match EXACT master anatomy, warm fur/pink skin, stitched fingerless brown glove and bracer details, bold dark outline upper-left light. One connected isolated part on flat exact #00FF00. No extra anatomy/body, no text/shadow. Canvas1536x2304 green margins. Hidden wrist/shoulder ends extend plain material, no visible discs/balls.
```

## 24. hand-near-point

```text
Use case: identity-preserve. Asset hand-near-point. Reference approved Rat Raider master. ONLY detached NEAR rat hand pointing index finger toward right, other fingers curled, pink skin dark claws, brown fingerless leather glove. Wrist at upper left with long narrow hidden overlap end, no disc/bracer. Native hand230px by150px. Match EXACT master anatomy, warm fur/pink skin, stitched fingerless brown glove and bracer details, bold dark outline upper-left light. One connected isolated part on flat exact #00FF00. No extra anatomy/body, no text/shadow. Canvas1536x2304 green margins. Hidden wrist/shoulder ends extend plain material, no visible discs/balls.
```

## 25. torso-away

```text
Edit this isolated torso cut, not a full character: turn chest away into BACK THREE QUARTER, showing the leather vest BACK and red scarf collar, near shoulder pulled back. NO HEAD, NO EARS, NO FACE, no limbs, no belt. Keep same torso size, master colors, bold dark outlines and canvas. Omit long scarf tails as they are a separate part. One connected torso on flat #00FF00. No text/shadow. Plain hidden neck/waist overlaps. Do not recreate the missing head.
```

## 26. repair-wrist

```text
Edit ONLY the upper hidden leather wrist end of this far fist: extend its narrow brown glove wrist upward-left by 140 source pixels toward forearm bracer, tapering width about70 source pixels, no disc or circle. Keep every visible finger/fist/glove pixel and exact position unchanged. Same 1536x2304 canvas and exact #00FF00 green. No other parts, no text, no shadow.
```

## 27. repair-shoulder

```text
Edit ONLY top hidden plain brown fur end of this upper arm: extend its narrow shoulder end upward-right by 90 source pixels beneath torso vest. A tapered continuation of fur, no round ball/disc, no pauldron. Preserve ALL visible original arm pixels and bracer exactly in place. Same 1536x2304 canvas and exact #00FF00 background. No other anatomy, no text/shadow.
```

## 28. pelvis-side

```text
Edit ONLY this pelvis into a TRUE RIGHT PROFILE SIDE view: narrow waist seen from side, one hip/seat silhouette, pouch at rear left, belt buckle mostly hidden at right edge, NO frontal crotch or two symmetrical thighs. Keep same rat outfit paint colors/line weight. Detached waistband and upper seat only, 440px wide by240px high at native scale on1536x2304 exact #00FF00. Tail root hidden under seat. No tail/torso/legs/head/text/shadow.
```

## 29. arm-near-smear-o

```text
Remove ONLY the metal/leather shoulder pauldron and gold fastenings from this overhead smear arm. Replace them with continuing plain brown/cream upper-arm fur and tapered connected motion paint. Keep the wrist bracer, fist, arc, scale and placement unchanged. This is a whole-arm swap under a SEPARATE shoulder cap: no shoulder armor allowed. One connected part, flat exact #00FF00, no text/shadow.
```

## 30. shoulder-near

```text
Refine this CUT FROM MASTER near pauldron into a usable small shoulder-cap piece. Preserve the master metal/leather pauldron paint and gold ring. Remove the red scarf scrap at top-left and extra chest leather/gold second button at lower-right. Finish the LOWER pauldron edge with its natural bold dark outline following the stitched leather rim. Top hidden edge may remain plain cropped continuation. No arm, fur ball or visible circle. Keep canvas1536x2304 and all retained pauldron pixels/placement, flat exact #00FF00, no text/shadow.
```


## Final cut decisions

The generated repair-wrist and repair-shoulder attempts were discarded. The nine delivered repairs instead extend cuts of native A022 paint beneath restored unchanged original foreground. The near cap started as an A017 pauldron cut and received a targeted imagegen lower-outline refinement. Both smear fists were replaced by A022 hand-near-grip cutouts (horizontal key rotates that hand 62 degrees about its measured grip; overhead keeps the original slot direction). Generated camera-facing/leaning torso lower ends were clipped at the hidden belt overlap, y1385. Far palm was rotated 180 degrees before registration to put its wrist at the common attachment end. Final connected-component cleanup uses the importer spill threshold corresponding to alpha >20.
# Round 2 — exact prompts

Built-in `image_gen.imagegen`, edit mode, green backgrounds; no seed exposed. References: A017 master-back and existing A023/cropped native-fist parts. Crop/registration and layer splitting use Pillow; final canvases remain 1536 × 2304. Raw outputs are excluded from git.

## back

```text
Use case: precise-object-edit. Edit target: attached rat master back view. Keep this exact rat, palette, bold outlines, upper left light, scale, costume and neutral stance. Fix back anatomy only: both feet must be viewed from behind with rounded leather HEELS toward the camera, toes pointing away and mostly hidden; rear calf/shin leather wraps continue into heel footwear; arms hang naturally at either side seen from behind. Head looking slightly right as now. Keep back trousers and crossed vest straps. Flat exact #00FF00 background, no shadow. This is the anatomical reference for cutout game rig back-view parts. Preserve source paint outside ankle/foot corrections.
```

## away

```text
Use case: precise-object-edit. Edit the isolated torso target (image 1), using rat back master (image 2) for actual anatomy. Deliver ONLY the isolated torso on flat #00FF00 green. Correct back-three-quarter torso, chest facing AWAY to screen right, broad back surface visible; near shoulder pulled BACK on screen LEFT, not a giant pauldron across the front-right. Neck opening top center-right, vest waist below. No head, arms, hands, legs or loose scarf tail. The near arm will attach behind the torso at its left edge; far shoulder at right edge. Red scarf at neckline, brown leather stitched vest with crossing back straps. Preserve rat style, thick dark outline, warm paint, upper-left lighting. Clean waist continuing 70px below belt attachment, no belt or buckle baked in, no duplicate shoulder trim/button. Full isolated torso occupies center 60% of canvas, ample green around.
```

## neargrip

Input: `/private/tmp/r2-hand-near-fist.png` (temporary crop from the existing source).

```text
Use case: precise-object-edit. Edit this exact cut from the rat master's near fist into a weapon grip seen from the BACK OF THE HAND. Keep leather fingerless glove on the whole back, knuckles below, thumb curling at right edge. Solid unbroken glove back, no green gap or slot anywhere through hand. Object will pass BEHIND the hand, do not draw object. Do not show palm. Keep exact paint style and silhouette size. Isolated hand only, no forearm, green #00FF00 background. Tiny hidden fingertip wrap may protrude at lower edge for splitting later.
```

## fargrip

Input: `/private/tmp/r2-hand-far-grip.png` (temporary crop from the existing source).

```text
Use case: precise-object-edit. Edit this rat hand to show the PALM SIDE unmistakably: fleshy central palm pad, thumb crossing diagonally from left, four curled fingers stacked down right wrapping around an invisible upright handle. No leather covering central palm; leather fingerless glove remains at wrist and outer edge. Remove striped long wrist extension, end just above cuff. No object drawn, no green hole through palm. Preserve exact cartoon style and hand proportion. Isolated on #00FF00 green.
```

## cocked

Input: `/private/tmp/r2-arm-near-cocked.png` (temporary crop from the existing source).

```text
Use case: precise-object-edit. Edit ONLY the fist at the upper left of this whole arm. Replace the current palm-side grip with BACK OF HAND, solid brown leather fingerless glove back above a row of curled knuckles, thumb at right edge. No green gap through fist, weapon passes behind. Preserve every other pixel of forearm, bracer, upper fur arm and exact pose, size and position. Green #00FF00 background.
```

## raised

Input: `/private/tmp/r2-arm-near-raised.png` (temporary crop from the existing source).

```text
Use case: precise-object-edit. Edit ONLY the top fist of this raised rat arm: camera sees BACK OF HAND with solid brown leather fingerless glove back, knuckles up-left, thumb at right. No palm facing camera, no green gap or slot through fist; weapon will pass behind. Preserve every other pixel of forearm, bracer, fur arm and exact pose, position, scale. #00FF00 background.
```

## farbow

Input: `/private/tmp/r2-arm-far-raised-back.png` (temporary crop from the existing source).

```text
Use case: precise-object-edit. Edit ONLY the top fist on this far rat arm so the camera clearly sees the PALM SIDE gripping a bow: visible fleshy palm pad, thumb from left crossing to center, curled fingers along right side. Brown fingerless glove only at wrist and hand outer edge. No green hole through hand. Invisible bow handle would run diagonally lower-left to upper-right between thumb and fingers. Preserve exact forearm, bracer, fur upper arm, pose, size, position. #00FF00 green background.
```

## Shoulder caps

One call per side; suffix `Side: near.` or `Side: far.`

```text
undefined
```

Processing: the native fist edit supplies both near grips; the overhand rotates the same solid knuckle face. Pinch and far overhand keep existing paint, split into two layers. Whole-arm edits are accepted above a wrist mask only; original forearm/upper-arm pixels are restored below. Back reference is cut into rear arms, legs, heels, torso and seat, each translated onto inherited pivots. `viewJointPositions.B` records the rear setup positions used in the proof. Hidden extensions use native material under original paint; default thighs are clipped to rest torso/belt coverage to avoid exposed patches. New view paint and cap paint are reference-guided redraws and are not pixel-identical master cuts.

# Round 3 exact prompts

Tool: built-in `image_gen.imagegen`, edit mode. No seed exposed. All calls use flat green backgrounds. Mechanical processing: green-key extraction, largest 8-connected component, source cut masks, uniform scale and pivot registration, layer composition. No procedural paint. Raw generations remain outside the repository.

## 1

```text
Use case: identity-preserve. Edit reference 1 (approved rat back master), with reference 2 (current isolated torso) only as size/cut guidance. Redraw ONLY an isolated BACK THREE QUARTER torso, halfway between right-facing three-quarter and full back. Camera sees the broad BACK of brown leather vest with crossed straps, near shoulder blade and red scarf knot at upper LEFT; chest almost entirely hidden at RIGHT edge. The shoulder nearer camera is pulled BACK on screen LEFT; its arm will attach BEHIND the torso there. Opposite shoulder on screen RIGHT is foreshortened. Back leather plane must be unmistakeable: asymmetric diagonal back view, no frontal cream belly, no front chest breastplate, no symmetrical straight back. Include near small metal/leather pauldron at upper left shoulder, same costume as master. NO head, ears, arms, hands, belt, legs, tail, or loose scarf tails. Plain short hidden neck and waist continuation. Same warm painted cartoon, thick dark outlines, upper-left light and colors. Detached torso alone centered, about 540w by 470h native proportions, generous margin on flat exact #00FF00 green; no shadow/text.
```

## 2

```text
Edit this isolated torso to read unequivocally as the BACK of a leather vest turned diagonally away to screen right. Replace the front-looking V-shaped chest seams with a plain broad leather BACK PANEL and two leather straps crossing in a clear X across shoulder blades, like the approved rat back reference (second image). Keep scarf knot on screen LEFT at back of neck and small pauldron on screen LEFT. Rotate back plane farther away, right shoulder receding and narrower, left shoulder blade broad. NO cream chest/belly showing on front; lower short fur is back waist fur. No arms, head, belt, legs, tails, text or shadows. Preserve exact style, colors, detached torso and green background. A real three-quarter rear view between side and full rear.
```

## 3

```text
Precise-object-edit of this exact cropped rat back hip. REMOVE the pink tail completely, including black outline, from the LEFT hip. Reconstruct the hidden olive brown trouser fabric underneath where tail was covering the left thigh and seat. Give the left hip/seat a natural clean dark outlined silhouette curving from underneath the upper fur/vest near x160 y130 down to left thigh edge around x80 y330. Green background outside the trousers. Preserve all other visible pixels: belt, pouch, fur fringe, patch stitches, pants legs, skin and boots. Do not add any tail, pink streak, tail stub, extra object or text. Same size crop and exact #00FF00 background. This will be cut into pelvis and thigh rig parts; separate tail art goes behind these trousers.
```


Round 3 inputs: call 1 = A017 `master-back.png` and preceding A023 `torso-away.png`; call 2 = call 1 result and A017 `master-back.png`; call 3 = a native-scale crop `(430,1330,950,1830)` of the round-2 back drawing, with green outside the character. Call 2 supplies the final torso; call 3 is accepted only inside the tail-removal mask. Feet and rear shins are recut from A017 master-back; the clipped thumb is recut with a wider boundary from the accepted round-2 back drawing. No grip art changes. All intermediate images/scripts stay outside git.

# Round 4 exact prompts

Tool: built-in `image_gen.imagegen`, edit mode, `transparent_background=false`; no seed exposed. Each input is a native crop of the pulled-main source cut, with green margins. Crop coordinates are (left, top, right, bottom) on the 1536 × 2304 canvas. Mechanical postprocessing only: green key, uniform scale / translation registration, original-paint restoration through overlap and cut-end masks, largest 8-connected component cleanup, static source composition. No stretched texture fills or procedural repaint. Raw outputs and temporary scripts are excluded. Shared ankle ends apply only above the ankle to matching swaps; every whole-arm and whole-leg pose uses its own edited target. Grip face/under pieces and grip markers stay unchanged.

## foot-near

Input: pulled-main `foot-near.png`, native crop `[434, 1630, 857, 2001]`.

```text
Use case: precise-object-edit. Production rig cutout repair; reference is the edit target. Replace ONLY tall rectangular/stretched extension above leather ankle with a NARROW tapered rounded leather-wrap ankle end, about HALF current extension width, ending just below its current top. Paint real curved overlapping brown leather bands with highlights, grain, fine stitches and bold dark outline around rounded top. Keep entire lower boot, pink toes/claws and visible ankle unchanged. No rectangular column, flat fill or repeated stretched pixels. Match EXACT warm painted cartoon style, palette, upper-left lighting and bold dark outlines. Same composition and part scale within crop; keep all original visible material registered. One connected isolated piece on exact flat #00FF00 green. No shadow, text or other pieces. Finish hidden material professionally; it may show during rotation.
```

## hand-far

Input: pulled-main `hand-far.png`, native crop `[950, 1268, 1254, 1638]`.

```text
Use case: precise-object-edit. Production rig cutout repair; reference is the edit target. Replace ONLY long stretched striped wrist extension above fist with a SHORT narrow wrist end, half its current length, 60 percent current width, tapered to rounded end. Paint real brown leather fingerless glove cuff, natural creases grain and stitching, thick dark outline. Keep entire fist fingers thumb glove face and claws unchanged. No striped stretching, no hole, no object. Match EXACT warm painted cartoon style, palette, upper-left lighting and bold dark outlines. Same composition and part scale within crop; keep all original visible material registered. One connected isolated piece on exact flat #00FF00 green. No shadow, text or other pieces. Finish hidden material professionally; it may show during rotation.
```

## arm-near-upper

Input: pulled-main `arm-near-upper.png`, native crop `[334, 1002, 706, 1423]`.

```text
Use case: precise-object-edit. Production rig cutout repair; reference is the edit target. Replace ONLY stretched diagonal upper shoulder stalk with a short tapered fully painted warm brown fur shoulder end, rounded with small natural fur tufts and dark outline. Keep cream middle fur and lower brown bracer unchanged. Shoulder end stays along existing up-right axis, narrower than body of arm, no flat column or circle/disc. Round and outline elbow cut at lower bracer. Match EXACT warm painted cartoon style, palette, upper-left lighting and bold dark outlines. Same composition and part scale within crop; keep all original visible material registered. One connected isolated piece on exact flat #00FF00 green. No shadow, text or other pieces. Finish hidden material professionally; it may show during rotation.
```

## torso

Input: pulled-main `torso.png`, native crop `[410, 956, 1100, 1517]`.

```text
Use case: precise-object-edit. Production rig cutout repair; reference is the edit target. Finish this isolated torso's hidden cut surfaces only. At top complete a rounded neck/collar opening using red scarf and warm brown neck fur, repair straight upper shoulder cuts with short fur/leather rounded outlined contours. At bottom REMOVE the baked belt/buckle below cream belly and replace its whole region with CONTINUING cream waist fur in a short rounded tapered hem, fully painted fur strands and bold outline. Fill reconstruction gaps beneath shoulder and waist as actual fur or vest leather. Preserve all visible chest, straps, buttons, scarf, pauldron pixels and positions. No head arms hips belt buckle or extra objects. Match EXACT warm painted cartoon style, palette, upper-left lighting and bold dark outlines. Same composition and part scale within crop; keep all original visible material registered. One connected isolated piece on exact flat #00FF00 green. No shadow, text or other pieces. Finish hidden material professionally; it may show during rotation.
```

## torso-side

Input: pulled-main `torso-side.png`, native crop `[514, 936, 1022, 1476]`.

```text
Use case: precise-object-edit. Edit target: this isolated rat torso cutout, torso-side. Replace ONLY flat/stretched rectangular lower waist extension with continuing real waist fur/leather, painted to same detail as main torso, tapered rounded fully outlined end at same lower height. Round and finish straight cut edges at upper neck/collar/shoulders with short real fur and scarf material. Keep all already visible chest/back costume paint unchanged. Do not add a belt or head. Preserve torso's pose and size. It is a joint overlap for a professional animated cutout rig; hidden material will show during twists. Match exact warm painted cartoon palette, texture, bold dark outlines, upper-left light. One connected part in original framing and scale on flat exact #00FF00 background. No additional anatomy, text, shadow or objects.
```

## torso-front

Input: pulled-main `torso-front.png`, native crop `[430, 960, 1090, 1476]`.

```text
Use case: precise-object-edit. Edit target: this isolated rat torso cutout, torso-front. Replace ONLY flat/stretched rectangular lower waist extension with continuing real waist fur/leather, painted to same detail as main torso, tapered rounded fully outlined end at same lower height. Round and finish straight cut edges at upper neck/collar/shoulders with short real fur and scarf material. Keep all already visible chest/back costume paint unchanged. Do not add a belt or head. Preserve torso's pose and size. It is a joint overlap for a professional animated cutout rig; hidden material will show during twists. Match exact warm painted cartoon palette, texture, bold dark outlines, upper-left light. One connected part in original framing and scale on flat exact #00FF00 background. No additional anatomy, text, shadow or objects.
```

## torso-back

Input: pulled-main `torso-back.png`, native crop `[216, 910, 1081, 1476]`.

```text
Use case: precise-object-edit. Edit target: this isolated rat torso cutout, torso-back. Replace ONLY flat/stretched rectangular lower waist extension with continuing real waist fur/leather, painted to same detail as main torso, tapered rounded fully outlined end at same lower height. Round and finish straight cut edges at upper neck/collar/shoulders with short real fur and scarf material. Keep all already visible chest/back costume paint unchanged. Do not add a belt or head. Preserve torso's pose and size. It is a joint overlap for a professional animated cutout rig; hidden material will show during twists. Match exact warm painted cartoon palette, texture, bold dark outlines, upper-left light. One connected part in original framing and scale on flat exact #00FF00 background. No additional anatomy, text, shadow or objects.
```

## torso-away

Input: pulled-main `torso-away.png`, native crop `[450, 920, 1090, 1466]`.

```text
Use case: precise-object-edit. Edit target: this isolated rat torso cutout, torso-away. Finish the thin unfinished dark outline along the lower fur hem and collar. Keep ALL leather vest, straps, scarf, shoulders and their exact shapes unchanged. It is a joint overlap for a professional animated cutout rig; hidden material will show during twists. Match exact warm painted cartoon palette, texture, bold dark outlines, upper-left light. One connected part in original framing and scale on flat exact #00FF00 background. No additional anatomy, text, shadow or objects.
```

## torso-hunched

Input: pulled-main `torso-hunched.png`, native crop `[460, 980, 1040, 1476]`.

```text
Use case: precise-object-edit. Edit target: this isolated rat torso cutout, torso-hunched. Replace ONLY flat/stretched rectangular lower waist extension with continuing real waist fur/leather, painted to same detail as main torso, tapered rounded fully outlined end at same lower height. Round and finish straight cut edges at upper neck/collar/shoulders with short real fur and scarf material. Keep all already visible chest/back costume paint unchanged. Do not add a belt or head. Preserve torso's pose and size. It is a joint overlap for a professional animated cutout rig; hidden material will show during twists. Match exact warm painted cartoon palette, texture, bold dark outlines, upper-left light. One connected part in original framing and scale on flat exact #00FF00 background. No additional anatomy, text, shadow or objects.
```

## torso-lean-back

Input: pulled-main `torso-lean-back.png`, native crop `[425, 920, 965, 1476]`.

```text
Use case: precise-object-edit. Edit target: this isolated rat torso cutout, torso-lean-back. Replace ONLY flat/stretched rectangular lower waist extension with continuing real waist fur/leather, painted to same detail as main torso, tapered rounded fully outlined end at same lower height. Round and finish straight cut edges at upper neck/collar/shoulders with short real fur and scarf material. Keep all already visible chest/back costume paint unchanged. Do not add a belt or head. Preserve torso's pose and size. It is a joint overlap for a professional animated cutout rig; hidden material will show during twists. Match exact warm painted cartoon palette, texture, bold dark outlines, upper-left light. One connected part in original framing and scale on flat exact #00FF00 background. No additional anatomy, text, shadow or objects.
```

## pelvis

Input: pulled-main `pelvis.png`, native crop `[459, 1255, 1066, 1650]`.

```text
Use case: precise-object-edit. Production animated cutout rig part pelvis; input is edit target. Repair hidden top and bottom cut edges ONLY. Continue upper waist as real cloth/fur behind belt, rounded outline. Finish both lower trouser-seat ends as olive-brown woven cloth with folds and seams, rounded outlined overlaps. Remove green rectangular notch in cream apron by continuing cream fur. Preserve belt buckle pouch and visible apron. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## pelvis-side

Input: pulled-main `pelvis-side.png`, native crop `[515, 1280, 1055, 1705]`.

```text
Use case: precise-object-edit. Production animated cutout rig part pelvis-side; input is edit target. Replace flat brown top block with real woven olive-brown trouser waist material, textured folds and a rounded tapered outlined top. Finish bottom flat cut as short rounded trouser-seat cloth end with seams. Preserve visible belt pouch patch and all central cloth. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## pelvis-front

Input: pulled-main `pelvis-front.png`, native crop `[411, 1280, 1094, 1671]`.

```text
Use case: precise-object-edit. Production animated cutout rig part pelvis-front; input is edit target. Replace flat brown top block with real woven olive-brown trouser waist material, textured folds and a rounded tapered outlined top. Finish bottom straight cuts as two short rounded trouser-seat cloth ends with seams. Preserve visible belt buckle pouch apron patches. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## pelvis-back

Input: pulled-main `pelvis-back.png`, native crop `[475, 1265, 1083, 1646]`.

```text
Use case: precise-object-edit. Production animated cutout rig part pelvis-back; input is edit target. Finish top cut as rounded outlined waist continuation; finish both lower trouser seat ends as real olive brown cloth with creases and stitched seat seam, rounded outlined ends. Keep belt pouch and cream fur apron exactly as shown. No tail embedded, this is the seat only. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## arm-far-upper

Input: pulled-main `arm-far-upper.png`, native crop `[870, 1088, 1145, 1437]`.

```text
Use case: precise-object-edit. Production animated cutout rig part arm-far-upper; input is edit target. Finish upper shoulder tip as tapered rounded brown fur end, with natural tiny fur tufts and dark outline, narrower than main upper arm. Round and outline lower elbow cut. Preserve center brown/cream fur and bracer edge. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## leg-near-upper

Input: pulled-main `leg-near-upper.png`, native crop `[410, 1390, 848, 1853]`.

```text
Use case: precise-object-edit. Production animated cutout rig part leg-near-upper; input is edit target. Replace ONLY reconstructed blocky top of thigh and pink sliver at upper left with finished olive-brown trouser cloth, textured with natural folds, tapered rounded outlined top ending just below current top. No buckle buttons apron tail or leather on thigh top. Preserve ALL lower patches stitches fur hem pink knee and bracer. Round and outline bottom joint cut. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## leg-far-upper

Input: pulled-main `leg-far-upper.png`, native crop `[731, 1320, 1108, 1853]`.

```text
Use case: precise-object-edit. Production animated cutout rig part leg-far-upper; input is edit target. Replace ONLY flat brown rectangular top extension and overlapping apron/button above patch with continuing olive-brown trouser cloth, natural woven texture creases and short rounded tapered outlined top. Preserve lower patch stitches fur hem pink knee and bracer. Round and outline lower joint cut. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## foot-far

Input: pulled-main `foot-far.png`, native crop `[783, 1630, 1230, 2000]`.

```text
Use case: precise-object-edit. Production animated cutout rig part foot-far; input is edit target. Replace ONLY tall rectangular/stretched extension above leather ankle with NARROW tapered rounded leather-wrap ankle end, HALF current extension width, ending just below current top. Paint curved overlapping brown leather bands with highlights, grain, fine stitches and bold dark outline around rounded top. Keep entire lower boot pink toes claws and visible ankle unchanged. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## hand-near

Input: pulled-main `hand-near.png`, native crop `[256, 1357, 553, 1605]`.

```text
Use case: precise-object-edit. Production animated cutout rig part hand-near; input is edit target. Finish ONLY straight upper wrist cut of this fingerless-gloved fist with a short narrow rounded tapered leather wrist cuff, fully painted creases fine stitches and dark outline, slightly extending above current cut. Keep entire fist/glove face fingers thumb and claws unchanged. No hole object or bracer. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## scarf-tail

Input: pulled-main `scarf-tail.png`, native crop `[220, 921, 666, 1460]`.

```text
Use case: precise-object-edit. Production animated cutout rig part scarf-tail; input is edit target. Repair ONLY upper scarf root and right inner edge: remove ALL baked shoulder metal gold/leather fragments, replace by continuing RED woven scarf cloth with darker folds, texture and bold outline. Upper attachment ends in narrow rounded tapered cloth tip. Preserve long ragged red silhouette and holes; no armor body or shoulder. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## head-back

Input: pulled-main `head-back.png`, native crop `[520, 590, 1341, 1213]`.

```text
Use case: precise-object-edit. Production animated cutout rig part head-back; input is edit target. Repair ONLY straight vertical and lower cut at lower LEFT neck edge, replace cut red scarf scrap with matching natural warm brown fur tufts and bold dark outline curved rounded neck end. Keep ALL head face ears muzzle hair silhouette and positions unchanged. Do not draw body scarf arms or neck column. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## tail-1

Input: pulled-main `tail-1.png`, native crop `[356, 1413, 626, 1783]`.

```text
Use case: precise-object-edit. Production animated cutout rig part tail-1; input is edit target. Repair this single pink rat tail part. Make the bottom-left broad cut end into a rounded tapered attachment root with bold continuous dark outline, natural pink skin folds and transverse skin bands, no flat cut or extension. Complete missing green notches on right inner edge with pink tail material and outline. Keep same curve thickness color and small upper tip. No body seat fur objects. One connected shape. Keep original part position, pose, scale and all visible paint outside requested areas. Match exact warm painted cartoon palette texture bold dark outlines and upper-left light. Finished material in every overlap, never flat fill/stretch/rectangular ends or discs. One isolated connected part, same framing, exact flat #00FF00 green, no shadows/text/other pieces.
```

## arm-near-cocked

Input: pulled-main `arm-near-cocked.png`, native crop `[276, 804, 696, 1269]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-near-cocked. Repair ONLY shoulder attachment end opposite the fist: replace any rectangular flat brown stalk or straight cut with a SHORT tapered rounded warm brown FUR ending, painted natural strands, shading and continuous dark outline, blending along this particular arm's own angle. Do not attach another arm segment. Preserve EXACT pose, fist face, fingers, wrist, leather bracer, elbow and all central fur. Keep motion blur on smear pieces. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## arm-near-raised

Input: pulled-main `arm-near-raised.png`, native crop `[404, 717, 706, 1263]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-near-raised. Repair ONLY shoulder attachment end opposite the fist: replace any rectangular flat brown stalk or straight cut with a SHORT tapered rounded warm brown FUR ending, painted natural strands, shading and continuous dark outline, blending along this particular arm's own angle. Do not attach another arm segment. Preserve EXACT pose, fist face, fingers, wrist, leather bracer, elbow and all central fur. Keep motion blur on smear pieces. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## arm-far-raised-back

Input: pulled-main `arm-far-raised-back.png`, native crop `[703, 822, 1042, 1269]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-far-raised-back. Repair ONLY shoulder attachment end opposite the fist: replace any rectangular flat brown stalk or straight cut with a SHORT tapered rounded warm brown FUR ending, painted natural strands, shading and continuous dark outline, blending along this particular arm's own angle. Do not attach another arm segment. Preserve EXACT pose, fist face, fingers, wrist, leather bracer, elbow and all central fur. Keep motion blur on smear pieces. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## arm-far-guard

Input: pulled-main `arm-far-guard.png`, native crop `[694, 1087, 1142, 1427]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-far-guard. Repair ONLY shoulder attachment end opposite the fist: replace any rectangular flat brown stalk or straight cut with a SHORT tapered rounded warm brown FUR ending, painted natural strands, shading and continuous dark outline, blending along this particular arm's own angle. Do not attach another arm segment. Preserve EXACT pose, fist face, fingers, wrist, leather bracer, elbow and all central fur. Keep motion blur on smear pieces. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## arm-far-raised

Input: pulled-main `arm-far-raised.png`, native crop `[840, 736, 1080, 1260]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-far-raised. Repair ONLY shoulder attachment end opposite the fist: replace any rectangular flat brown stalk or straight cut with a SHORT tapered rounded warm brown FUR ending, painted natural strands, shading and continuous dark outline, blending along this particular arm's own angle. Do not attach another arm segment. Preserve EXACT pose, fist face, fingers, wrist, leather bracer, elbow and all central fur. Keep motion blur on smear pieces. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## arm-near-smear-h

Input: pulled-main `arm-near-smear-h.png`, native crop `[435, 1020, 1211, 1290]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-near-smear-h. Repair ONLY shoulder attachment end opposite the fist: replace any rectangular flat brown stalk or straight cut with a SHORT tapered rounded warm brown FUR ending, painted natural strands, shading and continuous dark outline, blending along this particular arm's own angle. Do not attach another arm segment. Preserve EXACT pose, fist face, fingers, wrist, leather bracer, elbow and all central fur. Keep motion blur on smear pieces. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## arm-near-smear-o

Input: pulled-main `arm-near-smear-o.png`, native crop `[445, 1040, 978, 1671]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-near-smear-o. Repair ONLY shoulder attachment end opposite the fist: replace any rectangular flat brown stalk or straight cut with a SHORT tapered rounded warm brown FUR ending, painted natural strands, shading and continuous dark outline, blending along this particular arm's own angle. Do not attach another arm segment. Preserve EXACT pose, fist face, fingers, wrist, leather bracer, elbow and all central fur. Keep motion blur on smear pieces. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## arm-near-mouth

Input: pulled-main `arm-near-mouth.png`, native crop `[450, 900, 1150, 1502]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-near-mouth. Repair ONLY shoulder attachment end opposite the fist: replace any rectangular flat brown stalk or straight cut with a SHORT tapered rounded warm brown FUR ending, painted natural strands, shading and continuous dark outline, blending along this particular arm's own angle. Do not attach another arm segment. Preserve EXACT pose, fist face, fingers, wrist, leather bracer, elbow and all central fur. Keep motion blur on smear pieces. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## arm-near-upper-back

Input: pulled-main `arm-near-upper-back.png`, native crop `[415, 1044, 767, 1455]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-near-upper-back. Finish ONLY clipped upper shoulder and lower elbow ends as fully painted rounded tapered fur ends, narrow shoulder with natural brown fur tufts continuous dark outline. Remove tiny red scarf or armor fragments cut into top end, replace by matching brown fur. Keep ALL central brown/cream fur and bracer unchanged. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## arm-far-upper-back

Input: pulled-main `arm-far-upper-back.png`, native crop `[792, 1099, 1076, 1450]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-far-upper-back. Finish ONLY clipped upper shoulder and lower elbow ends as fully painted rounded tapered fur ends, narrow shoulder with natural brown fur tufts continuous dark outline. Remove tiny red scarf or armor fragments cut into top end, replace by matching brown fur. Keep ALL central brown/cream fur and bracer unchanged. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## arm-near-lower-back

Input: pulled-main `arm-near-lower-back.png`, native crop `[327, 1203, 599, 1491]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-near-lower-back. Finish ONLY straight top and bottom cut edges of this forearm/bracer as rounded tapered natural fur/leather/wrist ends with continuous bold dark outline. Keep ALL central leather bands stitching and their pose unchanged. Do not add a fist or shoulder. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## arm-far-lower-back

Input: pulled-main `arm-far-lower-back.png`, native crop `[898, 1244, 1159, 1500]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target arm-far-lower-back. Finish ONLY straight top and bottom cut edges of this forearm/bracer as rounded tapered natural fur/leather/wrist ends with continuous bold dark outline. Keep ALL central leather bands stitching and their pose unchanged. Do not add a fist or shoulder. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## hand-near-back

Input: pulled-main `hand-near-back.png`, native crop `[273, 1343, 518, 1585]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target hand-near-back. Finish ONLY clipped top wrist edge as a short narrow rounded tapered glove/leather wrist end, outlined naturally with small creases. Keep complete thumb, fingers and glove face identical. Do not redraw hand face or add long bracer. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## hand-far-back

Input: pulled-main `hand-far-back.png`, native crop `[992, 1352, 1233, 1575]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target hand-far-back. Finish ONLY clipped top wrist edge as a short narrow rounded tapered glove/leather wrist end, outlined naturally with small creases. Keep complete thumb, fingers and glove face identical. Do not redraw hand face or add long bracer. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## leg-near-upper-back

Input: pulled-main `leg-near-upper-back.png`, native crop `[464, 1390, 837, 1801]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target leg-near-upper-back. Finish ONLY clipped upper thigh end as continuing olive-brown trouser fabric, rounded tapered top with natural folds woven texture and continuous dark outline. No belt apron or pouch at thigh top. Finish bottom knee cut with small rounded outlined skin/leather end. Keep all patch stitches trouser hem and middle fabric untouched. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## leg-far-upper-back

Input: pulled-main `leg-far-upper-back.png`, native crop `[724, 1393, 1080, 1806]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target leg-far-upper-back. Finish ONLY clipped upper thigh end as continuing olive-brown trouser fabric, rounded tapered top with natural folds woven texture and continuous dark outline. No belt apron or pouch at thigh top. Finish bottom knee cut with small rounded outlined skin/leather end. Keep all patch stitches trouser hem and middle fabric untouched. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## hand-far-open

Input: pulled-main `hand-far-open.png`, native crop `[982, 1298, 1279, 1643]`.

```text
Use case: precise-object-edit. Production animated rat cutout rig, target hand-far-open. Replace ALL long striped stretched leather above wrist with a short narrow rounded tapered glove cuff, fully painted brown leather grain creases fine stitches dark outline. Remove striped side scrap. Keep open palm fingers thumb and their exact pose untouched. Hidden ends may show in motion: no flat fill, stretching, blocks, circles or joint discs. Match original warm painted cartoon palette and bold dark line weight, upper-left light. Keep original part registered at SAME position scale angle and dimensions inside crop. One connected isolated piece on exact #00FF00 green, no text shadow body or accessories.
```

## hand-near-open

Input: pulled-main `hand-near-open.png`, native crop `[295, 1389, 529, 1649]`.

```text
Use case: precise-object-edit. Repair one isolated cartoon rat rig part hand-near-open. Finish ONLY clipped wrist attachment end as a SHORT narrow tapered rounded leather cuff with natural grain creases stitching and continuous dark outline. Follow this exact hand's wrist direction; do not change palm, thumb, fingers, knuckles, claws or visible glove face. Do not add a second cuff, bracer, object or hole. Keep exact original position, scale, proportions and pose in crop. Every hidden surface is finished paint, no flat/stretched blocks or straight unoutlined cuts. Match original warm painted cartoon palette and bold outlines, upper-left lighting. One connected part on flat exact #00FF00 green with no text/shadow/body/other pieces.
```

## hand-near-palm

Input: pulled-main `hand-near-palm.png`, native crop `[285, 1380, 550, 1677]`.

```text
Use case: precise-object-edit. Repair one isolated cartoon rat rig part hand-near-palm. Finish ONLY clipped wrist attachment end as a SHORT narrow tapered rounded leather cuff with natural grain creases stitching and continuous dark outline. Follow this exact hand's wrist direction; do not change palm, thumb, fingers, knuckles, claws or visible glove face. Do not add a second cuff, bracer, object or hole. Keep exact original position, scale, proportions and pose in crop. Every hidden surface is finished paint, no flat/stretched blocks or straight unoutlined cuts. Match original warm painted cartoon palette and bold outlines, upper-left lighting. One connected part on flat exact #00FF00 green with no text/shadow/body/other pieces.
```

## hand-far-palm

Input: pulled-main `hand-far-palm.png`, native crop `[1000, 1380, 1250, 1606]`.

```text
Use case: precise-object-edit. Repair one isolated cartoon rat rig part hand-far-palm. Finish ONLY clipped wrist attachment end as a SHORT narrow tapered rounded leather cuff with natural grain creases stitching and continuous dark outline. Follow this exact hand's wrist direction; do not change palm, thumb, fingers, knuckles, claws or visible glove face. Do not add a second cuff, bracer, object or hole. Keep exact original position, scale, proportions and pose in crop. Every hidden surface is finished paint, no flat/stretched blocks or straight unoutlined cuts. Match original warm painted cartoon palette and bold outlines, upper-left lighting. One connected part on flat exact #00FF00 green with no text/shadow/body/other pieces.
```

## hand-near-cup

Input: pulled-main `hand-near-cup.png`, native crop `[280, 1380, 570, 1643]`.

```text
Use case: precise-object-edit. Repair one isolated cartoon rat rig part hand-near-cup. Finish ONLY clipped wrist attachment end as a SHORT narrow tapered rounded leather cuff with natural grain creases stitching and continuous dark outline. Follow this exact hand's wrist direction; do not change palm, thumb, fingers, knuckles, claws or visible glove face. Do not add a second cuff, bracer, object or hole. Keep exact original position, scale, proportions and pose in crop. Every hidden surface is finished paint, no flat/stretched blocks or straight unoutlined cuts. Match original warm painted cartoon palette and bold outlines, upper-left lighting. One connected part on flat exact #00FF00 green with no text/shadow/body/other pieces.
```

## hand-far-cup

Input: pulled-main `hand-far-cup.png`, native crop `[990, 1380, 1265, 1599]`.

```text
Use case: precise-object-edit. Repair one isolated cartoon rat rig part hand-far-cup. Finish ONLY clipped wrist attachment end as a SHORT narrow tapered rounded leather cuff with natural grain creases stitching and continuous dark outline. Follow this exact hand's wrist direction; do not change palm, thumb, fingers, knuckles, claws or visible glove face. Do not add a second cuff, bracer, object or hole. Keep exact original position, scale, proportions and pose in crop. Every hidden surface is finished paint, no flat/stretched blocks or straight unoutlined cuts. Match original warm painted cartoon palette and bold outlines, upper-left lighting. One connected part on flat exact #00FF00 green with no text/shadow/body/other pieces.
```

## hand-near-point

Input: pulled-main `hand-near-point.png`, native crop `[290, 1380, 605, 1586]`.

```text
Use case: precise-object-edit. Repair one isolated cartoon rat rig part hand-near-point. Finish ONLY clipped wrist attachment end as a SHORT narrow tapered rounded leather cuff with natural grain creases stitching and continuous dark outline. Follow this exact hand's wrist direction; do not change palm, thumb, fingers, knuckles, claws or visible glove face. Do not add a second cuff, bracer, object or hole. Keep exact original position, scale, proportions and pose in crop. Every hidden surface is finished paint, no flat/stretched blocks or straight unoutlined cuts. Match original warm painted cartoon palette and bold outlines, upper-left lighting. One connected part on flat exact #00FF00 green with no text/shadow/body/other pieces.
```

## leg-near-kneeling

Input: pulled-main `leg-near-kneeling.png`, native crop `[200, 1330, 838, 1916]`.

```text
Use case: precise-object-edit. Repair one isolated cartoon rat rig part leg-near-kneeling. Replace ONLY flat rectangular upper hip extension and scrap apron/button at attachment with continuing olive-brown trouser cloth, fully painted woven texture folds and a SHORT rounded tapered outlined end following the thigh's existing pose. Keep entire visible thigh patches stitches knee shin foot and pose exactly unchanged. No extra limb or fur/apron at upper attachment. Keep exact original position, scale, proportions and pose in crop. Every hidden surface is finished paint, no flat/stretched blocks or straight unoutlined cuts. Match original warm painted cartoon palette and bold outlines, upper-left lighting. One connected part on flat exact #00FF00 green with no text/shadow/body/other pieces.
```

## leg-near-kneeup

Input: pulled-main `leg-near-kneeup.png`, native crop `[482, 1304, 1017, 1914]`.

```text
Use case: precise-object-edit. Repair one isolated cartoon rat rig part leg-near-kneeup. Replace ONLY flat rectangular upper hip extension and scrap apron/button at attachment with continuing olive-brown trouser cloth, fully painted woven texture folds and a SHORT rounded tapered outlined end following the thigh's existing pose. Keep entire visible thigh patches stitches knee shin foot and pose exactly unchanged. No extra limb or fur/apron at upper attachment. Keep exact original position, scale, proportions and pose in crop. Every hidden surface is finished paint, no flat/stretched blocks or straight unoutlined cuts. Match original warm painted cartoon palette and bold outlines, upper-left lighting. One connected part on flat exact #00FF00 green with no text/shadow/body/other pieces.
```

## leg-far-folded

Input: pulled-main `leg-far-folded.png`, native crop `[734, 1330, 1288, 1807]`.

```text
Use case: precise-object-edit. Repair one isolated cartoon rat rig part leg-far-folded. Replace ONLY flat rectangular upper hip extension and scrap apron/button at attachment with continuing olive-brown trouser cloth, fully painted woven texture folds and a SHORT rounded tapered outlined end following the thigh's existing pose. Keep entire visible thigh patches stitches knee shin foot and pose exactly unchanged. No extra limb or fur/apron at upper attachment. Keep exact original position, scale, proportions and pose in crop. Every hidden surface is finished paint, no flat/stretched blocks or straight unoutlined cuts. Match original warm painted cartoon palette and bold outlines, upper-left lighting. One connected part on flat exact #00FF00 green with no text/shadow/body/other pieces.
```

## shoulder-near

Input: pulled-main `shoulder-near.png`, native crop `[435, 1040, 720, 1296]`.

```text
Use case: precise-object-edit. Repair one isolated cartoon rat rig part shoulder-near. Finish ONLY top attachment edge of this little shoulder cover as naturally curved short leather/fur continuation with bold dark outline. Preserve all visible fur, leather trim and lower outline exactly. No button, extra armor, limb or disc. Keep exact original position, scale, proportions and pose in crop. Every hidden surface is finished paint, no flat/stretched blocks or straight unoutlined cuts. Match original warm painted cartoon palette and bold outlines, upper-left lighting. One connected part on flat exact #00FF00 green with no text/shadow/body/other pieces.
```

## shoulder-far

Input: pulled-main `shoulder-far.png`, native crop `[850, 1070, 1085, 1308]`.

```text
Use case: precise-object-edit. Repair one isolated cartoon rat rig part shoulder-far. Finish ONLY top attachment edge of this little shoulder cover as naturally curved short leather/fur continuation with bold dark outline. Preserve all visible fur, leather trim and lower outline exactly. No button, extra armor, limb or disc. Keep exact original position, scale, proportions and pose in crop. Every hidden surface is finished paint, no flat/stretched blocks or straight unoutlined cuts. Match original warm painted cartoon palette and bold outlines, upper-left lighting. One connected part on flat exact #00FF00 green with no text/shadow/body/other pieces.
```

## tail-root-back

Inputs: `tail-1.png` native crop `[356,1413,626,1783]`, and the pre-round-4 rear source assembly as anatomy context. A first attempt returned no usable output; the accepted retry is below. Uniform two-landmark registration puts the root on `(492,1540)` and the continuation on `(442,1708)`; no existing Q tail paint is used for the new B/BQ drawing.

```text
Use case: precise-object-edit. Repair a cartoon rat TAIL sprite for a fantasy brawler cutout game. Keep exactly the curved tail segment shown, on green background. At UPPER RIGHT, shorten the thin tapered extension so its new endpoint lies near the middle of the reference's right edge rather than the top. Make that endpoint a naturally outlined, softly curved tail-to-body attachment, with the same transverse tail scale bands and painted shading as the rest. This end will be placed over brown trouser fabric in a rear view. Preserve lower-left curved segment and its native position. Fill the small missing green notches along the inner curve as matching tail skin with a continuous black outline. No other anatomy, object, text or shadow. Same warm cartoon style, original framing and exact #00FF00 background.
```


## Round 5 — seat covers and remaining cut ends (2026-10-18)

Tool: built-in `image_gen.imagegen`, edit mode, one referenced local crop per call, `transparent_background=false`; no seed exposed. Final artwork normalized back to the exact native crop coordinates below; original 1536 × 2304 canvases retained. An initial concurrent attempt ended in a content-filter rejection; none of that attempt was used. The successful clothing/sprite edit prompts are recorded verbatim below.

Local Pillow compositing selects the imagegen paint; no material or extension was procedurally drawn. For repairs, all pixels outside the recorded masks are restored from pulled main, with a 5 px material-only feather at mask joins. Exact-green keying and connected-component checks follow. For each seat, retain the corresponding original pelvis paint exactly, add generated cloth only below each column’s original hem, then cut the new cover below canvas y=1470. The unchanged pelvis beneath supplies the matching concealed top overlap; only the new lower contour can show. No tool outputs or temporary scripts are committed.

### foot-far

Reference/edit target: `foot-far.png` from pulled main, native crop [780, 1600, 1100, 1910]. Masked repair polygon: [[832, 1680], [998, 1680], [997, 1760], [830, 1760]].

```text
Isolated fantasy game costume/sprite asset repair. Non-realistic cartoon illustration. Use case: precise-object-edit. Game cutout repair. Edit only the top 90 pixels of the leather ankle wrap: replace the nearly straight horizontal cut top by a smoothly rounded domed leather cap with a continuous bold dark outline and curved wrap seam. No flat cut line. Keep position, width, lower foot and all other pixels unchanged. Flat exact #00FF00 green background, original warm painted cartoon style. Same framing and canvas aspect. No shadow, text or extra objects.
```

### arm-near-upper

Reference/edit target: `arm-near-upper.png` from pulled main, native crop [380, 980, 760, 1390]. Masked repair polygon: [[470, 980], [760, 980], [760, 1200], [570, 1235], [500, 1180]].

```text
Isolated fantasy game costume/sprite asset repair. Non-realistic cartoon illustration. Use case: precise-object-edit. Game cutout repair. Edit only the brown fur shoulder tip in the upper right, above the cream fur: make it a complete rounded shoulder joint with flowing orange-brown fur strokes and natural tapered tufts, bold continuous dark silhouette. Eliminate the broad flat orange patch with textured directional fur. Keep contour approximately same, same pivot/pose. Preserve all cream fur, leather cuff, and lower arm unchanged. Flat exact #00FF00 green background, original warm painted cartoon style. Same framing and canvas aspect. No shadow, text or extra objects.
```

### arm-near-raised

Reference/edit target: `arm-near-raised.png` from pulled main, native crop [380, 980, 760, 1390]. Masked repair polygon: [[430, 1110], [710, 1105], [730, 1300], [430, 1300]].

```text
Isolated fantasy game costume/sprite asset repair. Non-realistic cartoon illustration. Use case: precise-object-edit. Game cutout repair. Edit only the brown fur shoulder end at the bottom of this inverted arm crop: finish the hidden shoulder as round warm brown fur, layered directional tufts with highlights/shadows and a continuous bold dark outline. Eliminate broad featureless orange fill. Keep cream fur, top leather cuff, pose and alignment exactly unchanged. Flat exact #00FF00 green background, original warm painted cartoon style. Same framing and canvas aspect. No shadow, text or extra objects.
```

### scarf-tail

Reference/edit target: `scarf-tail.png` from pulled main, native crop [240, 941, 646, 1440]. Masked repair polygon: [[505, 935], [660, 935], [660, 1035], [555, 1080], [505, 1020]].

```text
Isolated fantasy game costume/sprite asset repair. Non-realistic cartoon illustration. Use case: precise-object-edit. Game cutout repair. Edit only the root at the upper right end: make the cut end a rounded tapered point of folded red cloth, continuous bold dark outline, rich red fold highlights/shadows. Keep lower ragged tail, holes, silhouette, scale, alignment unchanged. Flat exact #00FF00 green background, original warm painted cartoon style. Same framing and canvas aspect. No shadow, text or extra objects.
```

### pelvis

Reference/edit target: `pelvis.png` from pulled main, native crop [440, 1320, 1070, 1750]. Extracted as `seat.png`, on the pelvis pivot (774,1460).

```text
Use case: precise-object-edit. Isolated fantasy cartoon clothing asset on green background. Edit target: this olive canvas shorts costume with leather utility belt and hanging cream fabric tab. Preserve all existing artwork and alignment. Add a continuous broad rounded olive fabric panel BELOW the existing lower edge, extending down about 80 reference pixels to close the gap between the two shorts hems behind the cream fabric tab. Shade with matching directional olive canvas folds, thick dark silhouette outline. The new extension is narrower than total garment width. Preserve original canvas aspect and position. Flat exact #00FF00 background. No character, skin, anatomy or text; clothing only.
```

### pelvis-side

Reference/edit target: `pelvis-side.png` from pulled main, native crop [440, 1320, 1070, 1750]. Extracted as `seat-side.png`, on the pelvis pivot (774,1460).

```text
Use case: precise-object-edit. Isolated fantasy cartoon clothing asset on green background. Edit target: this olive canvas shorts costume with leather utility belt and hanging cream fabric tab. Preserve all existing artwork and alignment. Add a continuous broad rounded olive fabric panel BELOW the existing lower edge, extending down about 80 reference pixels to close the gap between the two shorts hems behind the cream fabric tab. Shade with matching directional olive canvas folds, thick dark silhouette outline. The new extension is narrower than total garment width. Preserve original canvas aspect and position. Flat exact #00FF00 background. No character, skin, anatomy or text; clothing only.
```

### pelvis-front

Reference/edit target: `pelvis-front.png` from pulled main, native crop [440, 1320, 1070, 1750]. Extracted as `seat-front.png`, on the pelvis pivot (774,1460).

```text
Use case: precise-object-edit. Isolated fantasy cartoon clothing asset on green background. Edit target: this olive canvas shorts costume with leather utility belt and hanging cream fabric tab. Preserve all existing artwork and alignment. Add a continuous broad rounded olive fabric panel BELOW the existing lower edge, extending down about 80 reference pixels to close the gap between the two shorts hems behind the cream fabric tab. Shade with matching directional olive canvas folds, thick dark silhouette outline. The new extension is narrower than total garment width. Preserve original canvas aspect and position. Flat exact #00FF00 background. No character, skin, anatomy or text; clothing only.
```
