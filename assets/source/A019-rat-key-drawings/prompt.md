# A019 exact image-tool prompts

Tool: built-in `image_gen.imagegen`, edit mode, one target per call, `transparent_background: false`. No seeds exposed.

Inputs are original A018 limb cuts (derived from A017), rigidly reposed at native scale; each edit receives its own 1024-square crop. Outputs are registered back to that crop, and only joint/bend regions are accepted. Native pixels outside those regions are restored. Detached specks are removed; green background is normalized. Final canvases are 1536 x 2304. No code or runtime workaround is delivered.

## arm-near-cocked.png

Crop origin on A018 canvas: [140, 710, 1164, 1734]. Repair circles (canvas x, y, radius): [[410, 1078, 100], [480, 960, 75]].

```text
Use case: precise-object-edit. Edit target: the attached cut-and-reposed A018 rat limb on a 1024 square crop. A wound-back attack arm: elbow above and LEFT/behind the shoulder, fist at ear level, knuckles forward/right. Preserve the already reposed leather bracer, fur, and closed grip. Repair ONLY the elbow and wrist joins; smooth hidden seams, not a new limb. Keep all original paint outside the bend/hidden-area repair. Do not redesign, rescale, translate, recenter, or add any body/head/gear. Keep the limb at EXACTLY the same pixel coordinates and size inside this 1024x1024 image. Warm painted cartoon, bold dark outlines, upper-left lighting, matching this source exactly. Remove detached scraps floating outside the limb. Flat exact #00FF00 background, no text, no shadows.
```

## arm-near-raised.png

Crop origin on A018 canvas: [285, 612, 1309, 1636]. Repair circles (canvas x, y, radius): [[555, 1000, 100], [555, 862, 75]].

```text
Use case: precise-object-edit. Edit target: the attached cut-and-reposed A018 rat limb on a 1024 square crop. A straight vertical overhead arm with closed handle-gripping fist at the top. Repair ONLY elbow and wrist transitions. Keep the original fur and bracer, exact straight-up silhouette and shoulder position. No handle or weapon. Keep all original paint outside the bend/hidden-area repair. Do not redesign, rescale, translate, recenter, or add any body/head/gear. Keep the limb at EXACTLY the same pixel coordinates and size inside this 1024x1024 image. Warm painted cartoon, bold dark outlines, upper-left lighting, matching this source exactly. Remove detached scraps floating outside the limb. Flat exact #00FF00 background, no text, no shadows.
```

## arm-far-raised-back.png

Crop origin on A018 canvas: [530, 747, 1554, 1771]. Repair circles (canvas x, y, radius): [[800, 1115, 95], [875, 997, 70]].

```text
Use case: precise-object-edit. Edit target: the attached cut-and-reposed A018 rat limb on a 1024 square crop. Full bow-draw arm, elbow LEFT/behind shoulder at shoulder height, forearm coming up and RIGHT to a fist at the jaw. Repair ONLY elbow/wrist transitions of this cut-and-reposed limb. Preserve original fur, leather wraps, fist and scale. No bow or string. Keep all original paint outside the bend/hidden-area repair. Do not redesign, rescale, translate, recenter, or add any body/head/gear. Keep the limb at EXACTLY the same pixel coordinates and size inside this 1024x1024 image. Warm painted cartoon, bold dark outlines, upper-left lighting, matching this source exactly. Remove detached scraps floating outside the limb. Flat exact #00FF00 background, no text, no shadows.
```

## arm-far-guard.png

Crop origin on A018 canvas: [605, 929, 1629, 1953]. Repair circles (canvas x, y, radius): [[1040, 1328, 95], [875, 1230, 70]].

```text
Use case: precise-object-edit. Edit target: the attached cut-and-reposed A018 rat limb on a 1024 square crop. Shield guard arm: forearm folds across the chest toward LEFT, fist closed around an absent shield strap. Repair ONLY the elbow and wrist joins in the existing reposed arm. Preserve fur and leather detail, no shield. Keep all original paint outside the bend/hidden-area repair. Do not redesign, rescale, translate, recenter, or add any body/head/gear. Keep the limb at EXACTLY the same pixel coordinates and size inside this 1024x1024 image. Warm painted cartoon, bold dark outlines, upper-left lighting, matching this source exactly. Remove detached scraps floating outside the limb. Flat exact #00FF00 background, no text, no shadows.
```

## leg-near-kneeling.png

Crop origin on A018 canvas: [206, 1270, 1230, 2294]. Repair circles (canvas x, y, radius): [[584, 1745, 120], [476, 1745, 105]].

```text
Use case: precise-object-edit. Edit target: the attached cut-and-reposed A018 rat limb on a 1024 square crop. Kneeling leg with upright thigh, shin extending horizontally LEFT behind the knee, and ankle/foot pointed back with TOP of foot down on the floor. Preserve original patched trousers, leather ankle wraps, pink toes and claws. Repair ONLY knee and ankle bends, retain limb lengths and placement. No floor drawn. Keep all original paint outside the bend/hidden-area repair. Do not redesign, rescale, translate, recenter, or add any body/head/gear. Keep the limb at EXACTLY the same pixel coordinates and size inside this 1024x1024 image. Warm painted cartoon, bold dark outlines, upper-left lighting, matching this source exactly. Remove detached scraps floating outside the limb. Flat exact #00FF00 background, no text, no shadows.
```

## leg-near-kneeup.png

Crop origin on A018 canvas: [368, 1270, 1392, 2294]. Repair circles (canvas x, y, radius): [[865, 1520, 110], [865, 1630, 85]].

```text
Use case: precise-object-edit. Edit target: the attached cut-and-reposed A018 rat limb on a 1024 square crop. Knee lifted RIGHT to hip height, shin hanging down, foot pointing toes down. Preserve the reposed patched trousers, wraps and claws, repair ONLY knee and ankle joins. Do not shorten or compress the limb. Keep all original paint outside the bend/hidden-area repair. Do not redesign, rescale, translate, recenter, or add any body/head/gear. Keep the limb at EXACTLY the same pixel coordinates and size inside this 1024x1024 image. Warm painted cartoon, bold dark outlines, upper-left lighting, matching this source exactly. Remove detached scraps floating outside the limb. Flat exact #00FF00 background, no text, no shadows.
```

## leg-far-folded.png

Crop origin on A018 canvas: [629, 1270, 1653, 2294]. Repair circles (canvas x, y, radius): [[1095, 1632, 105], [985, 1690, 85]].

```text
Use case: precise-object-edit. Edit target: the attached cut-and-reposed A018 rat limb on a 1024 square crop. Deep squat folded leg: thigh goes forward/right, knee fully bent, shin returns LEFT beneath the thigh to an intact full-size boot/foot under the hip. Repair ONLY knee and ankle joins, do not squash the boot; shin must remain readable and sole horizontal. Keep all original paint outside the bend/hidden-area repair. Do not redesign, rescale, translate, recenter, or add any body/head/gear. Keep the limb at EXACTLY the same pixel coordinates and size inside this 1024x1024 image. Warm painted cartoon, bold dark outlines, upper-left lighting, matching this source exactly. Remove detached scraps floating outside the limb. Flat exact #00FF00 background, no text, no shadows.
```

## foot-near-toe.png

Crop origin on A018 canvas: [303, 1613, 1327, 2637]. Repair circles (canvas x, y, radius): [[723, 2008, 115]].

```text
Use case: precise-object-edit. Edit target: the attached cut-and-reposed A018 rat limb on a 1024 square crop. Toe-off foot: heel raised, weight on the ball, toes flex so their pads rest horizontally on the floor. This is the existing foot rotated heel-up. Change ONLY the ball/toe bend; preserve leather heel, ankle cuff, original claw count, toe colors, exact size. No ground shadow or floor. Keep all original paint outside the bend/hidden-area repair. Do not redesign, rescale, translate, recenter, or add any body/head/gear. Keep the limb at EXACTLY the same pixel coordinates and size inside this 1024x1024 image. Warm painted cartoon, bold dark outlines, upper-left lighting, matching this source exactly. Remove detached scraps floating outside the limb. Flat exact #00FF00 background, no text, no shadows.
```

## foot-far-toe.png

Crop origin on A018 canvas: [657, 1633, 1681, 2657]. Repair circles (canvas x, y, radius): [[1077, 2028, 115]].

```text
Use case: precise-object-edit. Edit target: the attached cut-and-reposed A018 rat limb on a 1024 square crop. Toe-off foot: heel raised, weight on the ball, toes flex so their pads rest horizontally on the floor. This is the existing foot rotated heel-up. Change ONLY the ball/toe bend; preserve leather heel, ankle cuff, original claw count, toe colors, exact size. No ground shadow or floor. Keep all original paint outside the bend/hidden-area repair. Do not redesign, rescale, translate, recenter, or add any body/head/gear. Keep the limb at EXACTLY the same pixel coordinates and size inside this 1024x1024 image. Warm painted cartoon, bold dark outlines, upper-left lighting, matching this source exactly. Remove detached scraps floating outside the limb. Flat exact #00FF00 background, no text, no shadows.
```

## arm-near-upper.png

Crop origin on A018 canvas: [195, 814, 1219, 1838]. Repair circles (canvas x, y, radius): [[555, 1174, 155]].

```text
Use case: precise-object-edit. Edit target: the attached cut-and-reposed A018 rat limb on a 1024 square crop. Extend ONLY the hidden upper joint into a fully round overlapping cap centered at pixel (360,360), radius 155 pixels. Match the adjacent brown fur / trouser fabric. Preserve ALL existing visible pixels and lower edge. Paint a complete round cap behind the original cut so the joint has no gaps when rotated. Flat green elsewhere. Keep all original paint outside the bend/hidden-area repair. Do not redesign, rescale, translate, recenter, or add any body/head/gear. Keep the limb at EXACTLY the same pixel coordinates and size inside this 1024x1024 image. Warm painted cartoon, bold dark outlines, upper-left lighting, matching this source exactly. Remove detached scraps floating outside the limb. Flat exact #00FF00 background, no text, no shadows.
```

## leg-far-upper.png

Crop origin on A018 canvas: [539, 1160, 1563, 2184]. Repair circles (canvas x, y, radius): [[899, 1520, 118]].

```text
Use case: precise-object-edit. Edit target: the attached cut-and-reposed A018 rat limb on a 1024 square crop. Extend ONLY the hidden upper joint into a fully round overlapping cap centered at pixel (360,360), radius 118 pixels. Match the adjacent brown fur / trouser fabric. Preserve ALL existing visible pixels and lower edge. Paint a complete round cap behind the original cut so the joint has no gaps when rotated. Flat green elsewhere. Keep all original paint outside the bend/hidden-area repair. Do not redesign, rescale, translate, recenter, or add any body/head/gear. Keep the limb at EXACTLY the same pixel coordinates and size inside this 1024x1024 image. Warm painted cartoon, bold dark outlines, upper-left lighting, matching this source exactly. Remove detached scraps floating outside the limb. Flat exact #00FF00 background, no text, no shadows.
```

## Accepted repair bounds and cap revision

The kneeling knee/ankle repair was widened to include the shin and foot below source y1680, x<750 after narrow masks left a gap and clipped toe edges. The tool repainted this visible area; this is a documented inpaint-only limitation. Other bend radii above reflect the accepted masks.

For the cap revision, a magenta circle was placed beneath the original cut as an inpainting guide. The near shoulder uses only the inner radius 130 of the requested radius 155 because the tool added an unwanted leather rim; the original visible cut remains on top. Far hip uses radius 118.

### arm-near-upper cap revision

```text
Use case: precise-object-edit. In this exact 1024x1024 cutout sprite target, replace ALL MAGENTA pixels with warm brown rat fur continuous with the neighboring original material. Magenta is an inpainting guide for the hidden joint: keep its entire circular outer silhouette, not the small old cap. The full cap is centered exactly (360,360), radius 155 pixels. Paint every magenta pixel, including the full upper semicircle. Do not shrink that circle. Bold dark outline around new circular edge, upper-left lighting, match existing cartoon paint. Keep all non-magenta original limb pixels and positions unchanged; no rescaling or recentering. Flat #00FF00 background, no magenta left, no text, no ground shadow.
```

### leg-far-upper cap revision

```text
Use case: precise-object-edit. In this exact 1024x1024 cutout sprite target, replace ALL MAGENTA pixels with brown trouser cloth continuous with the neighboring original material. Magenta is an inpainting guide for the hidden joint: keep its entire circular outer silhouette, not the small old cap. The full cap is centered exactly (360,360), radius 118 pixels. Paint every magenta pixel, including the full upper semicircle. Do not shrink that circle. Bold dark outline around new circular edge, upper-left lighting, match existing cartoon paint. Keep all non-magenta original limb pixels and positions unchanged; no rescaling or recentering. Flat #00FF00 background, no magenta left, no text, no ground shadow.
```

### arm-near-upper rim removal cap revision

```text
Use case: precise-object-edit. Edit ONLY the large circular shoulder cap in this rat arm cutout. REMOVE the entire leather ring/rim and EVERY gold stitch or stud around that large circular cap. Replace that ring and its trim with continuous warm BROWN FUR matching the central fur inside it. The large round cap must remain the SAME exact outer size and position, now entirely furry, with only a simple dark outer contour, no leather border. Keep the original narrow leather cuff at the lower-left wrist end unchanged and keep the smaller leather seam crossing the original upper arm unchanged. Do not add any shield or armor or new details. Keep the canvas and image framing unchanged, flat #00FF00 background, upper-left light, same cartoon paint.
```


Final cocked-arm scrap cleanup: the same first edit output was also accepted inside source circles (575,1100,r65) and (565,1040,r50) to remove inherited scarf slivers outside the upper arm. No new image generation.
