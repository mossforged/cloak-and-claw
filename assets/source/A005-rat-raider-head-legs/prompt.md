# A005 exact image generation prompts

Tool: built-in `image_gen.imagegen`; opaque background (`transparent_background: false`). No seed/model controls exposed. Eleven separate calls: seven initial parts, then four targeted leg-width edits. Initial leg passes were discarded after fit review. Generated images 1254 x 1254.

## head-neutral

Input(s): A004 head-neutral.png (edit target), A004 reference.png (identity/style).

```text
Use case: precise-object-edit. Revise the isolated Rat Raider head from input 1; input 2 is full-body style/identity reference. Create ONE isolated neutral sneering head, enlarged and centered to fill most of a 1024x1024 image on exact flat #00FF00 green, generous unclipped margin. Redraw anatomy to read unmistakably RAT: long pointed tapering wedge muzzle projecting well beyond brow, low flat skull, ears about HALF the original size and set farther back, narrow mean eyes with BOTH eyes visible in camera-facing right-facing three-quarter angle (30 degrees). Visible long paired FRONT INCISORS protrude in the sneer, no canine fangs. Scruffy jagged cheek fur, brown and cream palette, black nose, star-shaped cheek scar unchanged. Warm painted cartoon and bold dark outlines, upper-left light match A004. Head only, no scarf, bandana tails, neck or body; existing separate red scarf-tail part will be retained. Rounded neck attachment. No shadow, labels, extra objects. Keep threatening wiry rat identity, avoid cute rounded mouse skull and huge ears. Mechanical same-canvas fitting follows.
```

## head-snarl

Input(s): generated A005 neutral head (design), A004 head-snarl.png (expression).

```text
Use case: precise-object-edit. Input 1 is new Rat Raider head design authority. Input 2 is old snarl expression reference ONLY. Make head-snarl.png: redraw input 1 with an attack snarl, mouth WIDE open, long paired front incisors bared above and below, dark mouth and tongue visible. Preserve the long pointed tapered muzzle, low flat skull, smaller rear-set ears, scruffy brown cheek fur, cream muzzle, black nose and star cheek scar of input 1. Narrow mean eyes, BOTH visible, facing right at camera-facing three-quarter 30 degree angle. Do not revert to old round mouse anatomy. Warm painted cartoon, bold dark outlines, upper-left light. ONE isolated head centered filling most of square 1024x1024 canvas on flat exact #00FF00 green with generous unclipped margins. No neck scarf, tails, torso, ground shadow, text or extra parts. Keep head proportions and neck attachment consistent with input 1; only jaw opening changes.
```

## head-hurt

Input(s): generated A005 neutral head (design), A004 head-hurt.png (expression).

```text
Use case: precise-object-edit. Input 1 is NEW rat head anatomy/design authority, input 2 is A004 hurt head with the beloved expression to preserve. Make head-hurt.png: apply input 2's EXACT emotional expression to input 1's new rat shape: BOTH eyes tightly squeezed shut, eyebrows pinched in a pained gritted wince, lips drawn back with clenched teeth, NOT shouting, NOT angry open eyes. Preserve long pointed tapering snout, low flatter skull, smaller ears set back, scruffy brown cheek fur, cream muzzle, black nose, star cheek scar. Long front incisors visible as part of the gritted grimace. Warm painted cartoon, bold dark outlines, upper-left light identical to inputs. Right-facing camera-facing three-quarter 30 degree angle. ONE isolated head enlarged and centered filling most of a square 1024x1024 exact #00FF00 green canvas with generous unclipped margins. No scarf, bandana tails, torso, text, shadow or extras. Keep design proportions from input 1 and the squeezed-eye gritted wince from input 2.
```

## leg-front-upper

Input(s): A004 leg-front-upper.png (edit target).

```text
Use case: precise-object-edit. Revise input isolated near/front UPPER LEG for Rat Raider cutout rig. Enlarge this single part to occupy most of square 1024x1024 canvas with generous margin, exact flat #00FF00 background. Preserve EXACT existing bent pose and relative hip and knee joint centers: hip at upper right, thigh descends left to a bent knee at lower left, matching input, not vertical straight limb. Redraw with visibly heavier brawler thigh, about 40 percent thicker across the shaft, keeping segment lengths unchanged. Same olive ragged trousers, large stitched grey patch and tan patch, warm painted cartoon, dark bold outlines, upper-left light. Rounded slightly extended hip/knee ends in olive cloth with no hollow joint openings, no joint dots. Right-facing camera-facing three-quarter view. Only isolated thigh, no shin, body, text, shadow or extras. Preserve joints while adding muscle volume to sides; do not simply magnify entire thin part.
```

## leg-front-lower

Input(s): A004 leg-front-lower.png (edit target).

```text
Use case: precise-object-edit. Revise input isolated near/front LOWER LEG for Rat Raider cutout rig. Enlarge single part centered to occupy most of square 1024x1024 exact flat #00FF00 canvas with generous margin. Preserve EXACT existing pose and knee/ankle/foot relationships: rounded knee at upper right, thick calf descends diagonally left, ankle below left, bare clawed foot extends downward/right toward camera. Redraw calf as sturdy wiry brawler muscle, about 40 percent thicker across shaft than input while keeping knee-to-ankle length and foot size unchanged. Same brown scruffy fur, cream inner shin, brown layered leather ankle wraps, pink-brown bare toes with black claws. Rounded slightly extended upper knee end in fur. Warm painted cartoon, bold dark outlines, upper-left light, same camera-facing right-facing three-quarter angle. Only shin ankle and foot. No thigh, body, shadow, labels or extra objects. Add width to calf sides without lengthening limb or enlarging foot.
```

## leg-back-upper

Input(s): A004 leg-back-upper.png (edit target).

```text
Use case: precise-object-edit. Revise input isolated far/back UPPER LEG for Rat Raider cutout rig. Enlarge single part to occupy most of square 1024x1024 canvas with generous margin, exact flat #00FF00 background. Preserve EXACT existing bent pose and relative hip and knee joint centers: hip at upper left, thigh descends right to bent knee at lower right. Redraw as heavier wiry brawler thigh, about 40 percent thicker across shaft, preserving segment lengths. Same olive ragged trousers with tan stitched patch, jagged cloth hem, rounded extended hip and knee ends in olive cloth, no hollow openings or joint dots. Warm painted cartoon, bold dark outlines, upper-left light, same camera-facing right-facing three-quarter angle. Only isolated far thigh, no shin/body/text/shadow/extras. Add width at sides without lengthening.
```

## leg-back-lower

Input(s): A004 leg-back-lower.png (edit target).

```text
Use case: precise-object-edit. Revise input isolated far/back LOWER LEG for Rat Raider cutout rig. Enlarge single part centered to occupy most of square 1024x1024 exact flat #00FF00 canvas with generous margin. Preserve EXACT existing pose and knee/ankle/foot relationships: rounded knee at upper left, calf descends slightly left to ankle, foot extends RIGHT. Redraw calf with sturdy wiry brawler muscle about 40 percent thicker across shaft than input, keeping knee-to-ankle length and foot size unchanged. Same brown scruffy fur, cream inner shin, brown layered leather ankle wraps, pink-brown bare toes black claws. Rounded slightly extended upper knee end in fur. Warm painted cartoon, bold dark outlines, upper-left light, camera-facing right-facing three-quarter angle. Only shin ankle and foot. No thigh/body/shadow/labels/extras. Add calf width without lengthening limb or enlarging foot.
```

## Mechanical preparation

Pillow/numpy selected green-dominant pixels (G > 1.3R, G > 1.3B, G > 80). Artwork was uniformly scaled/rotated and translated onto opaque exact #00FF00 1536 x 2304 canvases. Head variants use identical transforms. Limbs use two-point similarity fitting to hand-estimated original joint centers, recorded in part-layout.json. No anatomy was drawn or widened in code. head.png is byte-identical to head-neutral.png. reference.png layers the delivered parts with the untouched A004 body/scarf/arms/tail/cutlass. review.png uses mechanical keying/compositing; comparison thumbnails are normalized, leg pairs use a common 0.8 scale, and stage characters are measured by silhouette height.

## leg-front-upper width revision (selected)

Input: preceding generated leg-front-upper.

```text
Use case: precise-object-edit. EDIT this isolated Rat Raider thigh. Keep exact pose, hip and knee center locations, limb length, patches, olive trousers, lighting and style. Make the THIGH SHAFT TWICE AS THICK across its middle, adding broad heavy brawler muscle volume to BOTH sides. Dramatic stout thigh, no thin tubular shaft. Hip and knee caps also 50 percent broader, centered on unchanged joints. Preserve bent near-leg pose upper-right hip to lower-left knee and grey/tan sewn patches. One isolated part on exact flat #00FF00, same square canvas, no text/shadow/body/extra parts. Bold dark outline, warm cartoon paint. This is a width/anatomy edit, do not magnify the whole image or lengthen the segment.
```

## leg-front-lower width revision (selected)

Input: preceding generated leg-front-lower.

```text
Use case: precise-object-edit. EDIT this isolated Rat Raider lower leg. Keep exact knee center, ankle center, foot position, segment length, wraps, brown/cream fur, lighting and style. Make CALF SHAFT TWICE AS THICK across its middle, broad sturdy brawler muscle volume on BOTH sides. Rounded upper knee cap 50 percent broader centered on unchanged joint. Keep ankle wraps and foot unchanged. Preserve near-leg diagonal pose and bare pink-brown toes/black claws. One isolated part on exact flat #00FF00, same square canvas, no text/shadow/body/extra parts. Bold dark outline, warm cartoon paint. Width/anatomy edit only, do not magnify whole image or lengthen segment. Calf should look stout and muscular rather than thin.
```

## leg-back-upper width revision (selected)

Input: preceding generated leg-back-upper.

```text
Use case: precise-object-edit. EDIT this isolated Rat Raider far thigh. Keep exact pose, hip and knee center locations, limb length, tan sewn patch, olive trousers, lighting and style. Make THIGH SHAFT TWICE AS THICK across middle, broad heavy brawler muscle on BOTH sides. Dramatic stout thigh, no thin tubular shaft. Hip and knee caps 50 percent broader centered on unchanged joints. Preserve bent far-leg pose upper-left hip to lower-right knee. One isolated part on exact flat #00FF00, same square canvas, no text/shadow/body/extras. Bold dark outline, warm cartoon paint. Width/anatomy edit only, do not magnify whole image or lengthen segment.
```

## leg-back-lower width revision (selected)

Input: preceding generated leg-back-lower.

```text
Use case: precise-object-edit. EDIT this isolated Rat Raider far lower leg. Keep exact knee center, ankle center, foot position, segment length, wraps, brown/cream fur, lighting and style. Make CALF SHAFT TWICE AS THICK across its middle, broad sturdy brawler muscle volume on BOTH sides. Rounded upper knee cap 50 percent broader centered on unchanged joint. Keep ankle wraps and foot unchanged. Preserve far-leg pose with foot pointing right and bare pink-brown toes/black claws. One isolated part on exact flat #00FF00, same square canvas, no text/shadow/body/extras. Bold dark outline, warm cartoon paint. Width/anatomy edit only, do not magnify whole image or lengthen segment. Calf should look stout and muscular rather than thin.
```
