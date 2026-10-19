# A024 prompts

Tool: built-in `image_gen.imagegen` (two local atlas edits; green background).

The first target atlas was cropped directly from the current A023 PNGs and the inherited A022 `arm-far-lower.png`. The second target was cells 7–10 of the same atlas. Generated donors were registered by translation, then pasted only into named hidden ends. All source pixels outside repair masks were restored exactly. Chroma cleanup and removal of introduced detached flecks used no painted substitute. Original silhouette neighbourhoods were restored where a donor detached an existing tip. No canvas, pivot, grip line, torso or pelvis was changed. Raw atlases and discarded variants are excluded from delivery.

## Prompt 1 (exact)

Use case: precise-object-edit. Edit target: this 10-cell production sprite repair atlas. Preserve exact 2000x1080 sheet dimensions, cell positions, scale, orientation, labels and flat pure #00FF00 background. Keep all existing visible art and detailed paint unchanged. Make only small local repairs at the hidden attachment ends, using the same bold dark outline, warm orange rat fur, cream tufts, orange leather and red cloth. No new limbs, objects, discs or geometric joint balls.
1 top left hand-near-grip-overhand: extend a slender, naturally tapered fur wrist stalk from the existing wrist at the upper left of this glove, upward-left roughly 65 px toward the absent bracer. Keep glove knuckles and fingers exactly unchanged. The wrist stalk must connect smoothly into the glove, with dark outlined fur edge.
2 top second arm-near-upper: finish its upper-right shoulder end as a rounded natural fur/sleeve end, eliminate any flat cut; only the shoulder tip region.
3 top middle raised near arm: finish the bottom shoulder end as shaded fur with dark outline, natural rounded shoulder, no disc. Keep entire bracer and fist unchanged.
4 top fourth far upper arm: finish only top shoulder tip as rounded fur with shaded tufts and outline.
5 top right back near upper arm: finish upper shoulder top as rounded natural fur, dark continuous edge.
6 bottom left back far upper arm: finish upper shoulder top and eliminate tiny red sliver at its right edge using matching fur and dark outline.
7 bottom second scarf: finish the upper-right root with dark red folded cloth, a short rounded tucked attachment end, eliminate any straight severed edge there; preserve remainder of scarf.
8 bottom middle foot: narrow the uppermost boot stalk from its top down about 65px to two-thirds original width, centered on the existing stalk, rounded outlined top; preserve boot and toes below this top.
9 bottom fourth thigh: finish only the upper rounded trouser cap and its straight right cut edge with consistent ochre cloth shading and dark outline, preserving pants and patches.
10 bottom right forearm: round and outline the little straight cut at the upper-left cream fur end and lower-right wrist edge. Keep the bracer paint unchanged.
Local repair only; retain the atlas grid exactly and untouched green everywhere else.

## Prompt 2 (exact)

Use case precise-object-edit. This is a four-cell sprite repair atlas, edit target. Keep identical 1600x540 atlas layout, exact sprite locations and sizes, labels, green #00FF00 field, and every detail outside the small repair tips.
Left scarf: only upper-right attachment tip: make it a short rounded dark-outlined folded RED CLOTH end. No floating marks.
Second foot: only the topmost 70 pixels of the upright leather ankle stalk (currently approx x487..558,y252..322): make it dramatically narrower, about HALF its present width, centered on x520, with a smooth rounded dark outlined LEATHER top. A narrow leather hidden tab, not fur. Blend into the existing boot below y330. Preserve all toes and lower boot pixel locations.
Third trouser thigh: finish only the upper 70 pixels of the rounded cap with matching brown/ochre TROUSER FABRIC and continuous dark outline. NO FUR at its top. Cloth folds, not hair. Keep patch placement exactly. Also round/outline the straight little notch/cut edge where bottom thigh meets the visible lower knee patch; avoid extending either end or adding new anatomy.
Right bracer forearm: finish BOTH the upper-left elbow fur tip and the lower-right wrist cut as short natural cream/orange fur tufts with continuous dark outline. No extra hands. Maintain existing bracer exactly.
All edits tiny and local. Do not resize, shift or redesign any sprite.

