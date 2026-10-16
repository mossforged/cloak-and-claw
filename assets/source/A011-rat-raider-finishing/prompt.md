# A011 — exact generation prompts and preparation

Tool: built-in `image_gen.imagegen` (imagegen skill), transparent-background edit mode. No CLI/API fallback, explicit seed or model selector. Each named overlay was requested separately. A010 was used only as an alignment template; no body part was regenerated. Inputs are 1024 × 1024 crops at original source scale: head crop origin [500,400], torso crop origin [350,850]. A008 is the design reference where listed.

The tool returned square images at a different resolution. `prepare.py` normalizes each full generated canvas uniformly to 1024 × 1024, then places it back at its recorded crop origin on the 1536 × 2304 A010 canvas. Alpha below 16 is cleared to remove faint isolated specks; remaining alpha is retained. Source cutting and uniform fitting are recorded in `ear-cut-polygons.json` and `gear-fitting.json`. The captain hat is raised 95 source pixels. Hurt details and rear ear details use rigid registration offsets in `prepare.py`. Face-only detail rear layers are intentionally transparent because the face is hidden.

Masks: deterministic Pillow/NumPy selections from the actual approved part pixels and fitted gear. 8-bit grey PNG: black protects pixels, white accepts tint, grey edges soften the selection. Original torso masks select the red bandana; the recolourable vest is the new jerkin, with its own masks. Leather belts, metal and patches are largely protected. Fur masks select warm fur regions for small shifts; skin has no fur tint. Empty masks explicitly protect non-recolourable parts. The crowd samples use fixed example combinations recorded in `prepare.py`; they illustrate possible variation rather than runtime randomization.

Reviews are Pillow composites of unchanged A010 parts and the delivered overlays. The actual A003 item cutlass is fitted using A010's measured grip transform for plain/captain. The archer and spearman reviews judge gear without reposing the existing A004 weapons. No code, animation, stage or production assets were edited.

Rebuild with Pillow and NumPy available:

```sh
python3 assets/source/A011-rat-raider-finishing/prepare.py register variants masks manifest review
```

`register` needs the original generated files at the paths in `generation.json`. Final prepared PNGs are self-contained in this delivery; the manifest reuses A010 through relative paths. No raw generations are committed.

## gear-hood

Alignment template: `head-neutral`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-neutral.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-hood.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-hood. Image 1 is ONLY an alignment template, a 1024 square crop of the approved rat head. Image 2 is the OLD gear design reference, to redraw for image 1. A patched muted olive archer hood with two LARGE ear slits. Hood cloth arches between ears, narrow cheek side panels outside the face. Leave the ENTIRE eyes muzzle mouth chin and both big ears as transparent holes. No lower chin strap. Match the reference old hood design but refit to this MUCH wider head. Paint ONLY the isolated gear exactly where it would sit on image 1, at the SAME scale and position in a 1024x1024 canvas. Do not draw any rat, fur, skin, ears, eyes or face. Everything except the new gear must be transparent, including ear holes and face opening. Warm painted cartoon, bold dark outlines, upper-left light, no shadow, no text. The rat head itself must NOT be regenerated.
```

## gear-helmet

Alignment template: `head-neutral`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-neutral.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-helmet.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-helmet. Image 1 is ONLY an alignment template, a 1024 square crop of the approved rat head. Image 2 is the OLD gear design reference, to redraw for image 1. A battered steel spearman open helmet, low domed skull cap between the ears, bronze rivets, swept small brow lip. Two large open ear cutouts. Keep entire eyes and face uncovered. Match old helmet design refitted to this broad head. Paint ONLY the isolated gear exactly where it would sit on image 1, at the SAME scale and position in a 1024x1024 canvas. Do not draw any rat, fur, skin, ears, eyes or face. Everything except the new gear must be transparent, including ear holes and face opening. Warm painted cartoon, bold dark outlines, upper-left light, no shadow, no text. The rat head itself must NOT be regenerated.
```

## gear-captain-hat

Alignment template: `head-neutral`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-neutral.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-captain-hat.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-captain-hat. Image 1 is ONLY an alignment template, a 1024 square crop of the approved rat head. Image 2 is the OLD gear design reference, to redraw for image 1. A weathered dark brown captain tricorn, gold piping, one golden feather sweeping upper left. A low brim across forehead ABOVE the eyes; leave both giant ears mostly visible through cutouts. Match old hat design fitted to this broad head. Paint ONLY the isolated gear exactly where it would sit on image 1, at the SAME scale and position in a 1024x1024 canvas. Do not draw any rat, fur, skin, ears, eyes or face. Everything except the new gear must be transparent, including ear holes and face opening. Warm painted cartoon, bold dark outlines, upper-left light, no shadow, no text. The rat head itself must NOT be regenerated.
```

## gear-hood-back

Alignment template: `head-back`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-back.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-hood-back.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-hood-back. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part. Image 2 is the OLD gear design reference. Rear view of muted olive patched archer hood, two huge OPEN ear slits matching the template ears. Cover only back skull between and below ears. No shoulders or body. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## gear-helmet-back

Alignment template: `head-back`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-back.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-helmet.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-helmet-back. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part. Image 2 is the OLD gear design reference. BACK VIEW of battered steel skull cap, warm bronze rivets, two huge ear slots matching the template. No face, no body, no ears drawn. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## gear-captain-hat-back

Alignment template: `head-back`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-back.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-captain-hat.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-captain-hat-back. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part. Image 2 is the OLD gear design reference. BACK VIEW of dark brown tricorn captain hat with gold piping and golden feather upper left. Ears remain uncovered. Match old hat design. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## gear-jerkin

Alignment template: `torso`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-torso.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-jerkin.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-jerkin. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part. Image 2 is the OLD gear design reference. Broad stocky sleeveless quilted dark leather armoured jerkin, two bronze buckle fasteners. Fit exactly over this torso. Open neckline leaves the red scarf exposed. No arms or fur. Garment extends to upper belt, covering cream belly. Old design refitted to stocky torso. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## gear-jerkin-side

Alignment template: `torso-side`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-torso-side.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-jerkin.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-jerkin-side. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part. Image 2 is the OLD gear design reference. SIDE VIEW facing right of sleeveless quilted dark leather armoured jerkin with bronze buckles. Fit the narrower side torso exactly. Transparent arm opening at left shoulder, open neckline leaves scarf exposed. Cover cream belly. No arm or fur. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## gear-jerkin-back

Alignment template: `torso-back`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-torso-back.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-jerkin-back.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-jerkin-back. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part. Image 2 is the OLD gear design reference. BACK VIEW sleeveless quilted dark leather armoured jerkin with bronze buckle straps. Fit this stocky rear torso exactly, from shoulder top to just above belt; transparent arm openings. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## gear-sash

Alignment template: `torso`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-torso.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-sash.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-sash. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part. Image 2 is the OLD gear design reference. Wide crimson captain waist sash, folded red cloth with one golden buckle and short ragged hanging knot on left. Wrap exactly around this broad torso's EXISTING belt at y=600 to 710 in 1024 crop. No other torso clothing or body. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## gear-sash-side

Alignment template: `torso-side`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-torso-side.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-sash.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-sash-side. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part. Image 2 is the OLD gear design reference. SIDE VIEW crimson captain waist sash at the existing waist belt y=650 to 760 of this crop, follows narrow side waist. Golden buckle toward right, hanging knot on left. Only waist cloth. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## gear-sash-back

Alignment template: `torso-back`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-torso-back.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-sash.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-sash-back. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part. Image 2 is the OLD gear design reference. BACK VIEW crimson captain waist sash wrapping around existing belt at y=500 to 650 in crop. Folded red cloth and short hanging knot at right, NO front buckle on rear. Only waist cloth. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## gear-quiver

Alignment template: `torso`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-torso.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A008-rat-gear-layers/gear-quiver.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay gear-quiver. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part. Image 2 is the OLD gear design reference. Brown leather archer quiver with three pale feathered arrows. Fit behind template torso on LEFT: quiver extends diagonally from crop x=120,y=270 to x=420,y=680; arrow fletching rises to y=60 left of shoulder. Only quiver and arrows, no straps across the front. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## detail-eyepatch

Alignment template: `head-neutral`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-neutral.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay detail-eyepatch. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part.  A small dark brown oval leather eyepatch with thin strap, sized to cover only the big near eye at template x=570,y=600. Patch about 120 wide by 130 tall; thin strap leads toward left ear base and right brow. Keep muzzle free. ONLY eyepatch and strap. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## detail-scar2

Alignment template: `head-neutral`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-neutral.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay detail-scar2. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part.  A tiny second scar: two salmon healed slash marks with dark edges, on the FAR RIGHT cheek at template x=733,y=674, beside far eye and above nose. About 45x35 pixels. No eye, no fur drawn. ONLY scar strokes. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## detail-ear-notch

Alignment template: `head-neutral`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-neutral.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay detail-ear-notch. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part.  A small dark healed torn-ear notch detail on OUTER LEFT edge of near big ear at template x=155,y=450. Irregular dark V shaped split with salmon inner rim. About 45x55 pixels. ONLY scar/torn fold marking; don't paint background or an ear. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## detail-earring

Alignment template: `head-neutral`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-neutral.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout overlay detail-earring. Image 1 is ONLY an alignment template: a 1024x1024 crop of the approved rat part.  One small thick golden hoop earring with dark outline and upper-left glint, hanging from lower near ear at template x=225,y=544. About 65x85 pixels. ONLY gold hoop with transparent center; no rat ear drawn. Paint ONLY the isolated overlay exactly where it sits on image 1 at identical scale and position in a 1024x1024 canvas. Do not draw the underlying rat or existing clothing. Everything except the requested overlay is genuinely transparent, including openings. Warm painted cartoon, bold dark outlines, upper-left light, no ground shadow, no text. Do NOT regenerate the rat.
```

## gear-hood-hurt

Alignment template: `head-hurt`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-hurt.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/gear-hood.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Image 1 is a 1024 square alignment template of the approved rat HURT head. Image 2 is the already approved-design gear-hood isolated overlay for neutral. Redraw ONLY this same gear to fit the HURT head exactly: ears are smaller and lie lower, eyes are squeezed shut, cheek and muzzle flare out. Keep the same olive hood / steel helmet / brown gold-feather captain hat design as image 2. Ear holes must align to image 1. Hood must have an EXTRA WIDE open face aperture so no cloth crosses mouth teeth or chin. Helmet and hat sit ABOVE eyebrows and leave face fully clear. ONLY isolated gear on transparent canvas at exact template position and scale. No rat pixels, fur, eyes, mouth or ears drawn; no text or shadow. Warm painted cartoon and bold outlines, upper-left light.
```

## gear-helmet-hurt

Alignment template: `head-hurt`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-hurt.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/gear-helmet.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout gear. Draw ONLY ONE STEEL HELMET. No hood, no hat, no feather, no cloth. A battered open steel dome with riveted brow and two large ear cutouts. The rim must stay ABOVE the squeezed eyebrows and leave the muzzle free. Image 1 is the approved HURT-head alignment template. Image 2 is the ONLY gear design to draw. Refit that one piece to image 1, preserving its design. Return an isolated transparent overlay at exactly the template's position and scale in a square canvas. All rat pixels and face pixels must be absent: no ears, no fur, no body. Bold cartoon outlines, upper-left painted light. No text.
```

## gear-captain-hat-hurt

Alignment template: `head-hurt`. Reference images, in order:

- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/input-head-hurt.png`
- `/Users/johniadarola/Projects/cloak-and-claw-art/assets/source/A011-rat-raider-finishing/gear-captain-hat.png`

Transparent background: true.

Exact prompt:

```text
Use case: precise-object-edit. Game cutout gear. Draw ONLY ONE BROWN TRICORN HAT WITH GOLDEN FEATHER. No hood, no helmet, no olive cloth, no scarf. Narrow curved gold-edged brim ABOVE the eyebrows, ears uncovered, golden feather sweeps upper left. Image 1 is the approved HURT-head alignment template. Image 2 is the ONLY gear design to draw. Refit that one piece to image 1, preserving its design. Return an isolated transparent overlay at exactly the template's position and scale in a square canvas. All rat pixels and face pixels must be absent: no ears, no fur, no body. Bold cartoon outlines, upper-left painted light. No text.
```

## Rejected hurt gear attempts

The first helmet-hurt and captain-hat-hurt attempts stacked other gear onto the requested piece. They were rejected and are not delivered as final art. Exact initial prompts and output paths are retained in `hurt-initial-generations.json`; the successful hood-hurt request from that file remains selected. Replacement prompts are listed above.
