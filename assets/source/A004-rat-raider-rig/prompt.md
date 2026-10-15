# A004 exact generation prompts

Tool: built-in `image_gen.imagegen`. Opaque green requested; no seed or model controls exposed. One call per asset; two targeted edits. An initial arm-back-upper call failed and was retried with the later prompt listed below.

Reference inputs: original `assets/art/enemies/rat-raider.png` for identity; A002 `reference.png` for camera angle; A003 `rat-cutlass.png` for the weapon. All initial part calls used this task's generated reference as identity/style input. Edits used the preceding generated part.

## Call 1: reference

```text
Use case: stylized-concept. Create reference.png, a single full-body Rat Raider game character on flat exact #00FF00 green. Input 1 defines rat identity: scruffy brown fur, large pink ears, cream muzzle, black nose, scar on cheek, red neck bandana with tails, patched tan ragged vest, diagonal leather strap, broad belt with gold square buckle and side pouch, olive patched ragged trousers, brown wrapped ankles, bare clawed pink-brown feet, long pink tail. Input 2 defines the exact three-quarter camera angle toward viewer, facing right, BOTH eyes visible, neutral fighting stance. Rat is slightly taller and rangier than this mouse. Near hand down-left grips notched cutlass matching input 3; far claw hand open at right. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Whole silhouette with ample margin; 1024x1536 portrait canvas. Keep rat threatening with a closed-mouth sneer, not cute. No shield.
```

## Call 2: head

```text
Use case: stylized-concept. Asset head.png for cutout game rig. Reference input is identity, anatomy, style and lighting authority. Complete isolated head including both ears, sneering closed mouth, cream muzzle scar, both eyes visible. No neck scarf or torso. Draw ONE isolated part, centered on flat exact #00FF00 green, generous empty margin, portrait 1024x1536. Keep warm painted cartoon shading, bold dark outline and light upper left identical to reference. Same right-facing three-quarter camera angle, no shadow, text, labels or extra objects. Round and extend hidden joint ends in local material colour, no coloured joint dots. Preserve proportions from reference; use most of canvas for detail; mechanical scale fitting will follow.
```

## Call 3: torso

```text
Use case: stylized-concept. Asset torso.png for cutout game rig. Reference input is identity, anatomy, style and lighting authority. Isolated torso only: red neck bandana FRONT triangle (no trailing tails), patched tan vest, diagonal leather strap, belt gold buckle and hip pouch, ragged skirt hem. No head, arms, legs or tail. Shoulder ends are rounded matching tan vest. Draw ONE isolated part, centered on flat exact #00FF00 green, generous empty margin, portrait 1024x1536. Keep warm painted cartoon shading, bold dark outline and light upper left identical to reference. Same right-facing three-quarter camera angle, no shadow, text, labels or extra objects. Round and extend hidden joint ends in local material colour, no coloured joint dots. Preserve proportions from reference; use most of canvas for detail; mechanical scale fitting will follow.
```

## Call 4: scarf-tail

```text
Use case: stylized-concept. Asset scarf-tail.png for cutout game rig. Reference input is identity, anatomy, style and lighting authority. Only the two red bandana tails and small knot, trailing left. No head, body or other parts. Draw ONE isolated part, centered on flat exact #00FF00 green, generous empty margin, portrait 1024x1536. Keep warm painted cartoon shading, bold dark outline and light upper left identical to reference. Same right-facing three-quarter camera angle, no shadow, text, labels or extra objects. Round and extend hidden joint ends in local material colour, no coloured joint dots. Preserve proportions from reference; use most of canvas for detail; mechanical scale fitting will follow.
```

## Call 5: tail

```text
Use case: stylized-concept. Asset tail.png for cutout game rig. Reference input defines identity, anatomy, style and lighting. Only the full curved pink rat tail, with rounded thick base and thin curved tip. No body or other parts. ONE isolated part centered on exact #00FF00 green with generous margin, portrait 1024x1536. Warm painted cartoon, bold dark outline, upper-left light identical to reference. Same right-facing three-quarter angle, no shadow, labels or extras. Rounded extended hidden joints in local material colour. Preserve anatomical proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 6: arm-front-upper

```text
Use case: stylized-concept. Asset arm-front-upper.png for cutout game rig. Reference input defines identity, anatomy, style and lighting. Only near upper arm from shoulder to elbow, scruffy brown fur with cream inner stripe and patched leather shoulder pad. Rounded extended fur joint ends, no markers. No forearm, hand or body. ONE isolated part centered on exact #00FF00 green with generous margin, portrait 1024x1536. Warm painted cartoon, bold dark outline, upper-left light identical to reference. Same right-facing three-quarter angle, no shadow, labels or extras. Rounded extended hidden joints in local material colour. Preserve anatomical proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 7: arm-front-lower

```text
Use case: stylized-concept. Asset arm-front-lower.png for cutout game rig. Reference input defines identity, anatomy, style and lighting. Only near forearm with brown leather wraps and closed gripping fist, empty central grip for cutlass handle. Rounded elbow extension in fur colour. No weapon, upper arm or body. ONE isolated part centered on exact #00FF00 green with generous margin, portrait 1024x1536. Warm painted cartoon, bold dark outline, upper-left light identical to reference. Same right-facing three-quarter angle, no shadow, labels or extras. Rounded extended hidden joints in local material colour. Preserve anatomical proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 8: arm-back-upper

```text
Use case: stylized-concept. Asset arm-back-upper.png for cutout game rig. Reference input defines identity, anatomy, style and lighting. Only far upper arm shoulder to elbow, scruffy brown fur cream inner stripe, rounded extended fur ends. No forearm, hand or body. ONE isolated part centered on exact #00FF00 green with generous margin, portrait 1024x1536. Warm painted cartoon, bold dark outline, upper-left light identical to reference. Same right-facing three-quarter angle, no shadow, labels or extras. Rounded extended hidden joints in local material colour. Preserve anatomical proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 9: arm-back-lower

```text
Use case: stylized-concept. Asset arm-back-lower.png for cutout game rig. Reference input defines identity, anatomy, style and lighting. Only far forearm with brown wrapped cuff and open clawed hand, fingers curved threateningly, pointing right. Rounded elbow extension in fur colour. No upper arm or body. ONE isolated part centered on exact #00FF00 green with generous margin, portrait 1024x1536. Warm painted cartoon, bold dark outline, upper-left light identical to reference. Same right-facing three-quarter angle, no shadow, labels or extras. Rounded extended hidden joints in local material colour. Preserve anatomical proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 10: leg-front-upper

```text
Use case: stylized-concept. Asset leg-front-upper.png for cutout game rig. Reference input defines identity, anatomy, style and lighting. Only near thigh in olive ragged trousers with large stitched grey patch and tan frayed patch, rounded extended hip and knee ends in olive cloth. No shin or body. ONE isolated part centered on exact #00FF00 green with generous margin, portrait 1024x1536. Warm painted cartoon, bold dark outline, upper-left light identical to reference. Same right-facing three-quarter angle, no shadow, labels or extras. Rounded extended hidden joints in local material colour. Preserve anatomical proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 11: arm-back-upper

```text
Use case: stylized-concept. Asset arm-back-upper.png for cutout game rig. Reference input defines identity anatomy style lighting. Only far upper arm shoulder to elbow, scruffy brown fur cream inner stripe, rounded extended fur ends. No forearm, hand or body. ONE isolated part centered on exact #00FF00 green, generous margins, 1024x1536 portrait. Warm painted cartoon, bold dark outline, upper-left light. Same right-facing three-quarter angle. No shadow text labels or extras. Rounded extended hidden joints in local material colour. Preserve reference proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 12: leg-front-lower

```text
Use case: stylized-concept. Asset leg-front-lower.png for cutout game rig. Reference input defines identity anatomy style lighting. Only near shin ankle and bare clawed foot, brown ankle leather wraps, pink-brown toes, pointing right in three-quarter view. Rounded upper joint brown fur. No thigh or body. ONE isolated part centered on exact #00FF00 green, generous margins, 1024x1536 portrait. Warm painted cartoon, bold dark outline, upper-left light. Same right-facing three-quarter angle. No shadow text labels or extras. Rounded extended hidden joints in local material colour. Preserve reference proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 13: leg-back-upper

```text
Use case: stylized-concept. Asset leg-back-upper.png for cutout game rig. Reference input defines identity anatomy style lighting. Only far thigh in olive ragged trousers with tan stitched patch, rounded extended hip and knee ends olive cloth. No shin or body. ONE isolated part centered on exact #00FF00 green, generous margins, 1024x1536 portrait. Warm painted cartoon, bold dark outline, upper-left light. Same right-facing three-quarter angle. No shadow text labels or extras. Rounded extended hidden joints in local material colour. Preserve reference proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 14: leg-back-lower

```text
Use case: stylized-concept. Asset leg-back-lower.png for cutout game rig. Reference input defines identity anatomy style lighting. Only far shin ankle and bare clawed foot, brown ankle wraps, pink-brown toes pointing right in three-quarter view. Rounded upper joint brown fur. No thigh or body. ONE isolated part centered on exact #00FF00 green, generous margins, 1024x1536 portrait. Warm painted cartoon, bold dark outline, upper-left light. Same right-facing three-quarter angle. No shadow text labels or extras. Rounded extended hidden joints in local material colour. Preserve reference proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 15: torso-back

```text
Use case: stylized-concept. Asset torso-back.png for cutout game rig. Input image defines identity anatomy style lighting. Only same torso turned away in rear three-quarter view, patched tan vest back, diagonal leather harness, red bandana collar, same broad belt and pouch, ragged skirt. NO face, head, limbs or tail. Match front torso height. ONE isolated part centered on exact #00FF00 green, generous margins, 1024x1536 portrait. Warm painted cartoon, bold dark outline, upper-left light. Same right-facing three-quarter angle. No ground shadow text labels or extras. Rounded extended hidden joints in local material colour, never coloured joint markers. Match reference anatomy and proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 16: head-snarl

```text
Use case: stylized-concept. Asset head-snarl.png for cutout game rig. Input image defines identity anatomy style lighting. Only complete same head and ears, attack expression with teeth bared mouth wide shouting. Both eyes visible; same scar, ears and muzzle. No scarf or torso. ONE isolated part centered on exact #00FF00 green, generous margins, 1024x1536 portrait. Warm painted cartoon, bold dark outline, upper-left light. Same right-facing three-quarter angle. No ground shadow text labels or extras. Rounded extended hidden joints in local material colour, never coloured joint markers. Match reference anatomy and proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 17: head-hurt

```text
Use case: stylized-concept. Asset head-hurt.png for cutout game rig. Input image defines identity anatomy style lighting. Only complete same head and ears, hurt expression eyes squeezed mouth grimacing. Same scar ears muzzle. No scarf or torso. ONE isolated part centered on exact #00FF00 green, generous margins, 1024x1536 portrait. Warm painted cartoon, bold dark outline, upper-left light. Same right-facing three-quarter angle. No ground shadow text labels or extras. Rounded extended hidden joints in local material colour, never coloured joint markers. Match reference anatomy and proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 18: hand-front-grip

```text
Use case: stylized-concept. Asset hand-front-grip.png for cutout game rig. Input image defines identity anatomy style lighting. Only near closed gripping fist, brown-furred hand with short claws and brown leather wrist cuff; empty small vertical grip hole for shaft, NO SHAFT. Rounded wrist overlap. ONE isolated part centered on exact #00FF00 green, generous margins, 1024x1536 portrait. Warm painted cartoon, bold dark outline, upper-left light. Same right-facing three-quarter angle. No ground shadow text labels or extras. Rounded extended hidden joints in local material colour, never coloured joint markers. Match reference anatomy and proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 19: arm-back-lower-grip

```text
Use case: stylized-concept. Asset arm-back-lower-grip.png for cutout game rig. Input image defines identity anatomy style lighting. Only far forearm and closed gripping fist with leather wraps matching reference cuff, empty small vertical grip hole for spear shaft NO SHAFT. Rounded extended elbow in brown fur. No upper arm or body. ONE isolated part centered on exact #00FF00 green, generous margins, 1024x1536 portrait. Warm painted cartoon, bold dark outline, upper-left light. Same right-facing three-quarter angle. No ground shadow text labels or extras. Rounded extended hidden joints in local material colour, never coloured joint markers. Match reference anatomy and proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 20: arm-back-lower-pinch

```text
Use case: stylized-concept. Asset arm-back-lower-pinch.png for cutout game rig. Input image defines identity anatomy style lighting. Only far forearm and hand pinching an invisible bowstring between two curled fingers, thumb opposed, brown leather cuff and fur. No bowstring or weapon or upper arm or body. ONE isolated part centered on exact #00FF00 green, generous margins, 1024x1536 portrait. Warm painted cartoon, bold dark outline, upper-left light. Same right-facing three-quarter angle. No ground shadow text labels or extras. Rounded extended hidden joints in local material colour, never coloured joint markers. Match reference anatomy and proportions; use most of canvas for detail; mechanical scale fitting follows.
```

## Call 21: spear

Inputs: `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A004-rat-raider-rig/reference.png`

```text
Use case: stylized-concept. Asset spear.png for cutout game rig. Input image defines rat world style and lighting. Only a straight vertical rough-hewn raider spear, narrow long wooden shaft, iron leaf point at top, red rag tied just below head, iron butt. Entire spear visible. Its total length should be about 1.5 times full rat silhouette height. No hands or other parts. ONE isolated object centered on flat exact #00FF00 green, ample margin, 1024x1536 portrait. Warm painted cartoon, bold dark outline, light upper left. No ground shadow, hands, text labels or extras. Whole object unclipped.
```

## Call 22: bow

Inputs: `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A004-rat-raider-rig/reference.png`

```text
Use case: stylized-concept. Asset bow.png for cutout game rig. Input image defines rat world style and lighting. Only short raider recurve bow, upright with curved wood stave on right and straight taut UNDRAWN string on left, wrapped central grip, warm wood and dark tips. No hand arrow or other objects. ONE isolated object centered on flat exact #00FF00 green, ample margin, 1024x1536 portrait. Warm painted cartoon, bold dark outline, light upper left. No ground shadow, hands, text labels or extras. Whole object unclipped.
```

## Call 23: arrow

Inputs: `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A004-rat-raider-rig/reference.png`

```text
Use case: stylized-concept. Asset arrow.png for cutout game rig. Input image defines rat world style and lighting. Only one straight vertical arrow, iron arrowhead at top, wooden shaft, feather fletching at bottom. No bow or hand. ONE isolated object centered on flat exact #00FF00 green, ample margin, 1024x1536 portrait. Warm painted cartoon, bold dark outline, light upper left. No ground shadow, hands, text labels or extras. Whole object unclipped.
```

## Call 24: arm-back-lower-grip

Inputs: `/Users/johniadarola/.codex/generated_images/01a14053-68bc-7083-899f-04388f6df777/exec-4c4dc480-0ffa-4baa-aefd-5ee0dbfb8006.png`

```text
Use case: precise-object-edit. Edit only the fist of this cutout forearm. Remove the small cylindrical wooden tube sticking above the closed fist. Replace it with a small EMPTY vertical shaft-gripping gap inside the curled fingers, green visible through empty grip. It is an empty gripping fist, no weapon, tube, socket or handle. Keep identical forearm, cuff, fur, lighting, outline, angle, proportions, green background and canvas.
```

## Call 25: torso-back

Inputs: `/Users/johniadarola/.codex/generated_images/01a14053-68bc-7083-899f-04388f6df777/exec-42c12f0c-273c-42c9-92ed-3bcde011b7a0.png`

```text
Use case: precise-object-edit. Edit only the red bandana tails protruding at the upper left of this isolated rear torso. Remove the trailing tails and knot, leaving only the red neck collar wrap. Keep torso shape, back view, shoulder pad, belt, pouch, harness, patches, light upper left, exact green background and canvas unchanged. No head or limbs.
```

## Source preparation and review

The generated reference was retained as `reference-original.png`. The import reference and all separate parts were placed on opaque exact #00FF00 1536 × 2304 canvases. Original reference pixels were offset by (200, 650), without scaling. Green selection used G > 110 and G > 1.35 × R and B. The selected art was uniformly resized (never stretched), rotated for stance where recorded, and placed using `part-layout.json`. Heads were normalized by total silhouette width; most other pieces were fit to estimated anatomy boxes. Spear length is 1.5 × original rat silhouette height. `head-neutral.png` is an exact copy of `head.png`.

`sword.png` uses the approved A003 cutlass, uniformly resized and rotated clockwise 62 degrees; no new sword generation. Review thumbnails are normalized for inspection. The stage panel compares actual silhouette heights: mouse 130 px, new rat 136 px, old rat 136 px. `fit-check.png` shows each delivered part over a faint reference. Weapon mockups mechanically layer and rotate the actual parts; bow draw has an added string guide while the delivered bow retains its straight undrawn string. Mockups are static fitting studies, with no runtime rig or pivot code.
