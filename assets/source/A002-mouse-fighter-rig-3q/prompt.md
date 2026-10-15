# A002 exact generation prompts

Tool: built-in `image_gen.imagegen`; opaque green-background output. No seed/settings controls exposed. Three calls. Original tool outputs preserved as `reference.png`, `parts-sheet.png`, and `swaps-sheet.png`.

## Reference
Inputs: `assets/art/heroes/mouse-fighter.png` (primary), `docs/concepts/art-bible/contact-sheet.jpg` (style).

Use case: stylized-concept. Create reference.png, an assembled cutout-rig neutral reference for the Mouse Fighter.
Input image 1 is the PRIMARY character design and exact viewing-angle reference: existing game standee. Input image 2 is style bible only. Match image 1's stocky proportions, grey-brown fur, cream cheeks, huge pink ears, blue gold-trim tunic, red scarf, crossed leather strap, belt and pouch, leather bracers and open-toe boots, gold-rim wood shield, broad short sword.
Show whole character facing screen-right with chest turned toward camera exactly like image 1, BOTH eyes clearly visible; NOT profile. Short sturdy legs widely planted. Calm closed-mouth determined expression. Neutral stance with arms slightly away from torso. Near arm on image-left holds sword low, blade directed down-left/outward away from legs; far arm image-right bears shield at same narrow elliptical angle as standee. Clear limb separation. Upper-left light, painted warm cartoon shading and bold near-black outlines exactly like standee. Flat uniform pure #00FF00 background, no shadow, no ground, no text. Large source illustration 1536px tall with generous green margin, full ears tail sword and shield uncropped. Head should not grow relative to standee. No joint balls or visible mechanical joints.

## Parts sheet
Inputs: delivered reference (primary), A001 `parts-sheet.png` (inventory only).

Use case: stylized-concept. Production disassembled cutout character rig board, based on input image 1, which is the exact assembled reference. Input image 2 is only a guide to the 14-part inventory; improve angle, caps, proportions and shield from that old sheet.
Produce ONLY fourteen separated painted parts, on perfectly flat pure #00FF00, no labels or text, no assembled figure. Match input 1 exactly: both eyes visible head, three-quarter chest facing camera, short sturdy thighs and shins, sword low, far shield elliptical. Preserve exact design, warm painted shading, upper-left light, bold dark outlines. Parts must all be at ONE COMMON SCALE to each other, matching input 1 anatomy. Do not fill equal-sized cells with unequal anatomy; limbs must remain MUCH smaller than head. Large landscape 3072 x 2048 canvas, spacious green gaps between pieces.
Layout rows:
TOP ROW: head (detached at neck, neutral closed mouth, both eyes), torso (scarf wrap, blue tunic, leather cross strap, belt gold buckle and pouch, no head arms legs scarf tails), scarf-tail (red cloth tails only, attachment hidden, no duplicate large knot), tail (long curling pink mouse tail, plain tapered attachment).
MIDDLE ROW: arm-front-upper (near arm, blue short sleeve and short cream fur bicep); arm-front-lower (near fur forearm and brown leather bracer with empty closed gloved sword grip, no sword); arm-back-upper (far sleeve and short fur bicep); arm-back-lower (far bracer and closed hand, no shield); sword (complete broad short steel sword gold guard brown handle gold pommel).
BOTTOM ROW: leg-front-upper (short stocky grey-brown fur thigh); leg-front-lower (short fur shin, brown open toe boot and pink three toes); leg-back-upper (short stocky far thigh); leg-back-lower (short far shin and boot); shield (gold-rim wood round shield seen at narrow tilted ellipse EXACTLY as input 1, not face on).
Each limb ends with a plain rounded slightly extended attachment in matching fur or sleeve material, NO spherical beads, no blue or bright joint dots. No bright highlights on joint ends; they tuck under other parts. No scenery, no shadows, no duplicate pieces, no inter-part overlap. Keep full silhouettes in green margins.

## Swap sheet
Inputs: delivered reference (primary), existing game standee (style).

Use case: stylized-concept. Three alternate cutout-rig parts for Mouse Fighter. Input image 1 is exact character design, scale and paint reference. Input image 2 is original standee for style.
Make ONE landscape 1536x1024 board on perfectly flat pure #00FF00 with exactly THREE isolated pieces, no text, no overlap, generous gaps. LEFT: head-shout, same head ears fur shape and camera-facing three-quarter screen-right angle as input 1, BOTH eyes visible, fierce open-mouth battle cry with teeth and tongue. CENTER: head-hurt, identical same-scale same-angle head with both eyes squeezed shut and mouth wincing, no blood. RIGHT: torso-back only, no head or limbs, blue gold-trim tunic and leather belt/pouch, torso turned three-quarter AWAY from camera while facing screen-right, visible back, red scarf wrap and small scarf knot visible at nape, scarf tails omitted because separate rig part; leather shoulder strap continues across back. Match front torso silhouette height and short broad stocky proportions. Head pieces identical scale and ear silhouette, torso anatomical size consistent with heads (torso neck-to-hem roughly same height as ears-to-chin of head). Flat rounded concealed neck/shoulder ends, no shiny colored joint knobs. Upper-left light, warm painted shading, strong near-black outlines, grey-brown fur cream muzzle huge pink ears. No body fragments attached to heads. No assembly, ground, shadow or scenery.

## Source preparation and review

Pillow/NumPy performed mechanical component isolation from green, uniform resampling per part, placement onto 1226 × 1283 green canvases, and preview composition. No generative repainting or rig/game code changes. Exact crop boxes, uniform scale factors, and canvas positions are in `part-layout.json`. Per-part scales were estimated against the assembled reference, not solved as exact geometric matches. Head-neutral is a byte-identical copy of head. Original generated sheets are retained without resampling. Each individual part has a 1283 px long canvas side; its drawn content is smaller.

Review key: green pixels G>90, G>1.4R, G>1.3B removed for grey/stage previews only. Stage rendered 960 × 540 with reference and current standee each 130 px silhouette height. Grey part thumbnails are fit to cells for inspection and do not depict their relative scales. `fit-check.png` overlays each actual placed part on a faded reference using the common canvas.

