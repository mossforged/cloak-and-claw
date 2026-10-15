# A006 — exact image prompts

Tool: built-in `image_gen.imagegen`; seven independent edits, one per part. `transparent_background: false`. No seed exposed.

Input 1: `../A002-mouse-fighter-rig-3q/reference.png` (identity/style reference). Input 2: existing isolated part named below (edit target).

## shield-face.png

Input 2: `../A002-mouse-fighter-rig-3q/shield.png`.

Exact prompt:

```text
Use case: precise-object-edit. Production cutout rig swap for Mouse Fighter. Input 1 is the assembled A002 identity/style reference; input 2 is the existing isolated part to replace. Match exactly its warm painted cartoon finish, bold almost-black outlines, brown-grey fur, cream muzzle/fur, blue tunic with tan hem, red scarf, brown leather, gold hardware, upper-left light. Flat solid #00FF00 background, no shadow, no labels, no extra parts. Draw ONLY the requested isolated part, no body attached. Keep natural anatomy at A002 scale. Use the same portrait canvas and anatomical placement as input 2 where possible; do not zoom to fill canvas. Rounded overlapping attachment ends. Replace the oblique shield with its true FACE-ON view: perfectly circular wooden round shield, gold riveted rim and single boss exactly centered. Preserve shield height and center; width expands to equal height. Entire shield visible with green margin.
```

## arm-back-guard.png

Input 2: `../A002-mouse-fighter-rig-3q/arm-back-upper.png`.

Exact prompt:

```text
Use case: precise-object-edit. Production cutout rig swap for Mouse Fighter. Input 1 is the assembled A002 identity/style reference; input 2 is the existing isolated part to replace. Match exactly its warm painted cartoon finish, bold almost-black outlines, brown-grey fur, cream muzzle/fur, blue tunic with tan hem, red scarf, brown leather, gold hardware, upper-left light. Flat solid #00FF00 background, no shadow, no labels, no extra parts. Draw ONLY the requested isolated part, no body attached. Keep natural anatomy at A002 scale. Use the same portrait canvas and anatomical placement as input 2 where possible; do not zoom to fill canvas. Rounded overlapping attachment ends. Draw one complete shield arm from rounded shoulder to closed gloved fist, bent sharply up into a raised guard. Blue short sleeve, cream fur, leather bracer and glove. Shoulder at upper-right of the isolated shape, elbow below it, forearm runs diagonally up-left across chest toward fist. Shield NOT attached. Approximately 300px wide and 300px high on 1226x1283 canvas, shoulder near (875,620), fist near (700,540).
```

## head-brace.png

Input 2: `../A002-mouse-fighter-rig-3q/head.png`.

Exact prompt:

```text
Use case: precise-object-edit. Production cutout rig swap for Mouse Fighter. Input 1 is the assembled A002 identity/style reference; input 2 is the existing isolated part to replace. Match exactly its warm painted cartoon finish, bold almost-black outlines, brown-grey fur, cream muzzle/fur, blue tunic with tan hem, red scarf, brown leather, gold hardware, upper-left light. Flat solid #00FF00 background, no shadow, no labels, no extra parts. Draw ONLY the requested isolated part, no body attached. Keep natural anatomy at A002 scale. Use the same portrait canvas and anatomical placement as input 2 where possible; do not zoom to fill canvas. Rounded overlapping attachment ends. Change only the head expression: eyes narrowed but OPEN, gritted white teeth, chin tucked for bracing behind a shield. Keep exact ears, skull, fur colors, muzzle shape and three-quarter right-facing angle. No scarf or torso. Same head silhouette and scale.
```

## torso-side.png

Input 2: `../A002-mouse-fighter-rig-3q/torso.png`.

Exact prompt:

```text
Use case: precise-object-edit. Production cutout rig swap for Mouse Fighter. Input 1 is the assembled A002 identity/style reference; input 2 is the existing isolated part to replace. Match exactly its warm painted cartoon finish, bold almost-black outlines, brown-grey fur, cream muzzle/fur, blue tunic with tan hem, red scarf, brown leather, gold hardware, upper-left light. Flat solid #00FF00 background, no shadow, no labels, no extra parts. Draw ONLY the requested isolated part, no body attached. Keep natural anatomy at A002 scale. Use the same portrait canvas and anatomical placement as input 2 where possible; do not zoom to fill canvas. Rounded overlapping attachment ends. Replace torso with TRUE right-facing SIDE PROFILE of same short blue tunic torso. Narrow silhouette, same red neck scarf, same belt height, brown diagonal strap and side pouch. No head, no arms, no legs. Visible near shoulder sleeve opening is oriented for an overhead raised sword arm. True 90-degree side view, no front-facing buckle dominating. Keep torso height 458px and neck/waist vertical locations.
```

## torso-back-full.png

Input 2: `../A002-mouse-fighter-rig-3q/torso-back.png`.

Exact prompt:

```text
Use case: precise-object-edit. Production cutout rig swap for Mouse Fighter. Input 1 is the assembled A002 identity/style reference; input 2 is the existing isolated part to replace. Match exactly its warm painted cartoon finish, bold almost-black outlines, brown-grey fur, cream muzzle/fur, blue tunic with tan hem, red scarf, brown leather, gold hardware, upper-left light. Flat solid #00FF00 background, no shadow, no labels, no extra parts. Draw ONLY the requested isolated part, no body attached. Keep natural anatomy at A002 scale. Use the same portrait canvas and anatomical placement as input 2 where possible; do not zoom to fill canvas. Rounded overlapping attachment ends. Draw unmistakable TRUE REAR view of the short torso, shoulders and hips turned squarely AWAY from viewer. Red scarf with knot at nape and short tails, blue tunic plain back, leather diagonal shoulder strap, plain belt BACK without front buckle, tan hem. No chest clasp, no face, no head, no arms or legs. Same torso height and vertical placement as input 2.
```

## head-back.png

Input 2: `../A002-mouse-fighter-rig-3q/head.png`.

Exact prompt:

```text
Use case: precise-object-edit. Production cutout rig swap for Mouse Fighter. Input 1 is the assembled A002 identity/style reference; input 2 is the existing isolated part to replace. Match exactly its warm painted cartoon finish, bold almost-black outlines, brown-grey fur, cream muzzle/fur, blue tunic with tan hem, red scarf, brown leather, gold hardware, upper-left light. Flat solid #00FF00 background, no shadow, no labels, no extra parts. Draw ONLY the requested isolated part, no body attached. Keep natural anatomy at A002 scale. Use the same portrait canvas and anatomical placement as input 2 where possible; do not zoom to fill canvas. Rounded overlapping attachment ends. Draw TRUE BACK OF HEAD only, squarely AWAY from viewer, not looking over shoulder. Both large round mouse ears seen from BEHIND with fur-covered outer backs, no pink inner ears, no eyes, no muzzle or nose. Same warm grey-brown fur and characteristic tuft, rounded skull, small red scarf knot at nape. Keep original head width and height and placement. No torso.
```

## arm-front-raised.png

Input 2: `../A002-mouse-fighter-rig-3q/arm-front-upper.png`.

Exact prompt:

```text
Use case: precise-object-edit. Production cutout rig swap for Mouse Fighter. Input 1 is the assembled A002 identity/style reference; input 2 is the existing isolated part to replace. Match exactly its warm painted cartoon finish, bold almost-black outlines, brown-grey fur, cream muzzle/fur, blue tunic with tan hem, red scarf, brown leather, gold hardware, upper-left light. Flat solid #00FF00 background, no shadow, no labels, no extra parts. Draw ONLY the requested isolated part, no body attached. Keep natural anatomy at A002 scale. Use the same portrait canvas and anatomical placement as input 2 where possible; do not zoom to fill canvas. Rounded overlapping attachment ends. Draw one complete sword arm raised straight vertically OVERHEAD, from rounded blue short-sleeved shoulder at bottom to cream fur upper arm, leather bracer and closed brown glove gripping an absent sword at top. Match A002 glove gripping anatomy; no sword or handle attached. Straight extended elbow, fist above shoulder, narrow arm silhouette about 150px wide and 390px tall on 1226x1283 canvas, shoulder at (510,625), fist near (510,270). No torso.
```

## Source preparation

Generated PNGs retained in `generated/`. Green was mechanically isolated; artwork cropped, uniformly scaled and placed on A002's 1226 × 1283 canvas. No repainting or anisotropic stretching. `part-layout.json` records positions and sizes. Background outside artwork is exact #00FF00. Review assemblies use these parts and existing A002 parts, with static translations and rotations only; they are not animation or runtime rig changes.

