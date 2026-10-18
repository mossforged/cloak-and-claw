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
