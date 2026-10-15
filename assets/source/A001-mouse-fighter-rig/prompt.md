# A001 generation record

Tool: built-in `image_gen.imagegen`; default settings, no seed exposed; opaque background requested. Generated sources preserved without repainting.

## reference.png

Inputs: `docs/concepts/art-bible/contact-sheet.jpg` (style), `assets/art/heroes/mouse-fighter.png` (identity).

```text
Use case: stylized-concept
Asset type: painted cartoon game character rig reference, A001 Mouse Fighter.
Input images: first is art-bible style reference; second is the existing Mouse Fighter identity reference. Preserve the second character's identity, proportions, costume, materials and bold outlines.
Primary request: redraw the same grey Mouse Fighter as a full-body SIDE VIEW FACING RIGHT in a relaxed neutral standing stance suitable for a paper-doll rig. Large pink ears, cream muzzle, brown eyes, grey fur, red scarf with knot and short loose tail extending behind, blue tunic with gold trim, brown belt with gold buckle and small leather pouch, brown boots with pink toes, pink mouse tail curling behind. Short steel sword with gold crossguard held LOW in the near/front hand, angled forward and down, clearly away from legs. Round wood shield with gold rim and boss on far/back arm, readable and away from torso. Arms slightly away from body, knees relaxed, feet level. Upper-left warm light, warm painted shading, bold dark contour, readable at 130 pixels high.
Composition: portrait canvas, character at least 1100 pixels tall, whole silhouette with generous clear margin, same chibi proportions as reference (large head and ears, short body).
Background: perfectly flat solid #00FF00. No green anywhere in character. No ground, no ground shadow, no text, no labels, no frame, no extra objects. This is one assembled character, not a parts sheet.
```

## parts-sheet.png

Input: generated `reference.png` (identity/style).

```text
Use case: stylized-concept
Asset type: A001 Mouse Fighter cutout rig PARTS SHEET for a 2D game.
Input image 1 is the assembled character identity/style reference. Make the SAME mouse's disassembled parts, matching its painted detail, grey fur, red scarf, blue gold-trim tunic, brown leather boots/gloves, pink toes and tail, steel sword, gold fittings. Warm upper-left lighting and bold dark outlines.
Primary request: one LARGE landscape sheet, ideally 3840 by 2560 pixels, containing EXACTLY FOURTEEN separate nonoverlapping rig pieces in a spacious 5-column by 3-row grid. Flat pure #00FF00 background, no green in character. No text or labels. Empty green gap around EVERY piece. All parts at one common scale: head including ears is about 600 pixels tall, assembled mouse would be 1300 pixels tall; torso about 480 tall, upper limbs about 230, lower arms about 300, lower legs boots about 300, sword about 620 long, shield about 550 diameter. DO NOT enlarge small pieces to fill cells. Each part complete with rounded extended joint caps, no amputated flat ends. NO connected limbs and NO attached weapons.
Grid row 1 left to right:
1 HEAD with both pink ears and cream muzzle, right-facing side/slight three-quarter view, NO scarf or neck.
2 TORSO alone with blue tunic, gold trim, red scarf wrap AND knot, brown belt buckle pouch and chest straps; NO head arms legs or loose scarf tails.
3 SCARF-TAIL red loose cloth fluttering left, independent.
4 TAIL pink curving mouse tail alone.
5 SWORD full short steel blade plus gold crossguard and brown hilt, NO hand.
Grid row 2 left to right:
6 ARM FRONT UPPER: blue sleeve with gold cuff plus grey upper arm; round shoulder and elbow.
7 ARM FRONT LOWER: grey forearm, brown bracer and gloved closed hand with EMPTY grip space for sword hilt, no sword.
8 ARM BACK UPPER: matching blue sleeve gold cuff grey upper arm, slightly darker far-side.
9 ARM BACK LOWER: grey forearm brown bracer and brown gloved hand, no shield.
10 SHIELD circular FACE-ON round wooden shield, gold rim rivets and central gold boss, no arm or hand.
Grid row 3 left to right:
11 LEG FRONT UPPER: grey furry thigh with rounded hip and knee ends, no boot.
12 LEG FRONT LOWER: grey shin, brown strapped boot and pink toes facing right, rounded knee cap.
13 LEG BACK UPPER: grey furry thigh, rounded hip and knee, slightly darker far-side.
14 LEG BACK LOWER: grey shin, brown boot with pink toes facing right, rounded knee, slightly darker far-side.
15 EMPTY cell.
Avoid extra parts, duplicates, assembled figures, scenic elements, shadows on background, captions, labels, borders. The art must be independently sliceable; no two parts touch.
```

## review.png

Pillow composition of preview copies only: green-key preview over mid-grey, plus reference scaled to 130 px silhouette height over Harbor Market. No source repainting or source slicing. Sources retain generated backgrounds and dimensions.
