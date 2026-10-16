# A012 prompts

Tool: built-in image_gen.imagegen. Flat green backgrounds; no seed exposed.

## spear

References: assets/source/A004-rat-raider-rig/spear.png, assets/source/A003-harbor-props/rat-cutlass.png

```text
Use case: style-transfer. Redraw the isolated spear in image 1 to match the chunky worn hand-painted finish of the cutlass in image 2. Deliver ONE spear only, vertical, point up, centered and fully visible on perfectly flat #00FF00 green, tall portrait canvas. Preserve long straight wooden shaft, leather wraps at two hand positions, red torn rag tied just under iron head. Make the head broader, hand-forged iron with large chipped edges and warm cream lit facets, bold near-black brown outline, simplified confident brush planes like the cutlass. Long shaft about 75 percent of overall length, iron spearhead about 20 percent. Upper-left light, no cast shadow, no text, no hands, no string, no scenery. Strong readable silhouette at 160 pixels tall. Keep shaft absolutely vertical.
```

## bow

References: assets/source/A004-rat-raider-rig/bow.png, assets/art/enemies/rat-archer.png, assets/source/A003-harbor-props/rat-cutlass.png

```text
Use case: style-transfer. Redraw the isolated short rat recurve bow from image 1, matching the art bible archer bow in image 2 and the chunky worn painted finish and bold outlines of image 3 cutlass. ONE bow only, vertical, belly facing right: grip and limbs bulge right, string nocks at upper left and lower left. NO STRING anywhere, no arrow, no hands. Thick golden brown weathered wood, angular chipped worn edges, warm cream highlights upper left, brown leather wrapped center handle, pale ochre wraps near the nocks. Symmetric compact recurve silhouette with outward recurved tips. Fully visible, fills most of tall portrait canvas on perfectly flat #00FF00 green, no shadow, no labels, no border. Painted cartoon fantasy game item, strong dark brown outline, broad clean brush facets not fine noisy texture. Bow itself only.
```

## arrow

References: assets/source/A004-rat-raider-rig/arrow.png, assets/art/enemies/rat-archer.png, assets/source/A003-harbor-props/rat-cutlass.png

```text
Use case: style-transfer. Redraw image 1 as ONE isolated crude rat archer arrow, exactly HORIZONTAL with iron POINT RIGHT and nock at LEFT. Match chunky worn painted fantasy style of cutlass image 3 and hood colors of archer image 2. Straight wooden shaft, chunky chipped triangular forged iron arrowhead, leather binding below head, ochre yellow and warm cream feather fletching near left end with muted brick-red accent, a visible string notch at the leftmost end. Bold dark brown outline, warm broad painted facets, upper-left lighting. Full arrow completely visible spanning most of wide landscape canvas. Perfect flat #00FF00 green background, no cast shadow, no bow, no string, no hands, no labels, no text. Clean simple strong silhouette readable at about 50 pixels long.
```

## Near pinch edit

Input: A010 hand-front-grip crop [180,1120,460,1380], uniformly enlarged 3x; keyed for viewing.

```text
Use case: precise-object-edit. Edit this cropped approved rat near hand into a bowstring PINCH hand. Keep the wrist cuff on the RIGHT absolutely unchanged, same shape, scale, position, leather color, highlights and outlines. Keep the lower three curled fingers and their visible painted shapes unchanged. Change ONLY the top thumb and index finger so their pads meet in a narrow pinch at the LEFT upper side of the fist; paint in the previously hidden small skin bridge where the grip slot used to be. Thumb comes down to meet curled index at a clearly defined narrow contact point suitable for a bowstring. No hole for a weapon handle, no weapon, no string. Same warm orange pink rat skin, same broad painted highlights and dark outline, upper-left light. Exact same framing and orientation as the input, cuff at right. Flat #00FF00 background replacing transparency; no shadow, no other objects. This is a minimal local pose correction, not a new hand design.
```

Preparation: normalize green background; register hand edit to the input crop with uniform scaling. Composite only thumb/index patch and hidden grip-slot palm onto the unchanged A010 hand. Cuff and lower fingers stay original. No body pixels repainted. See prepare.py for exact masks and review transforms.
