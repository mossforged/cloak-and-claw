# A009 exact generation prompts

Tool: built-in `image_gen.imagegen` (`image_gen__imagegen`), not the CLI/API fallback. `transparent_background: false` for every call. PNG output. Seed and model/version settings were not exposed. Selected raw images are in `generated/`; selected output paths and every successful prompt are in `generation-inputs.json`.

Input roles: the initial reference uses `assets/art/enemies/rat-raider.png` as the identity/pose target. Base parts use the generated assembled reference plus that original standee; initial hurt heads additionally use A005 head-hurt only as an expression guide. The retried far upper arm uses the assembled reference alone. Corrective edits use the preceding output for that part; the S hurt correction uses the S neutral head as target and the prior hurt output as expression guide.

Preparation: Pillow/NumPy mechanically select green background (G > 100, G > 1.5R, G > 1.5B), crop, rotate where recorded, uniformly resize and place each part on the 1536 × 2304 exact-green source canvas. No anisotropic stretching or anatomy painting. Review compositions reuse existing stage, Mouse Fighter, original Rat Raider, T011 screen crop and A004 sword. `prepare.py` and `part-layout.json` record the process. Mechanical preparation does not call a generation API.

## Assembled reference

Use case: identity-preserve. Redraw the attached rat-raider standee at high resolution, preserving this EXACT character and EXACT silhouette proportions and pose. Image 1 is the sole character reference. Warm painted cartoon game art with bold dark outlines. Stocky brown rat, enormous round pink ears, short broad cream muzzle, cheek star scar, red neckerchief and trailing red scarf, patched leather shoulder armor, belt and pouch, ragged olive patched shorts, thick short arms and thighs, chunky brown wrapped boots with pink toes. Same very low wide crouch: hips low, knees bent outward, torso hunched forward, head thrust forward. Near arm extends toward left holding the existing cutlass, far claw extends right. Preserve the sword from the reference rather than redesigning it. Both eyes visible, three-quarter toward viewer facing right. Upper-left light. Flat exact #00FF00 green background, no shadow, no scene, no text. Full silhouette unclipped with generous margin. Do not make taller, leaner, muscular, long-snouted, orange, or weasel-like. Match the original brown palette and chunky boot thickness.

## Initial isolated part requests (far upper arm includes its successful retry)

### torso-back

Use case: precise-object-edit. Cutout rig source part torso-back. Image 1 is the exact assembled target; image 2 is the original standee identity. Extract/redraw ONE isolated anatomical piece, completing only hidden attachment ends. Rear three-quarter counterpart of only the same broad short torso: leather harness back, brown fur, red scarf collar, broad belt, pouch at side, ragged hem. NO face/head, limbs, trailing scarf or tail. Hunched posture. Match this character's stocky proportions and original width/length ratio exactly, not a new design. Keep the orientation it has in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short, same local material.

### torso

Use case: precise-object-edit. Cutout rig source part torso. Image 1 is the exact assembled target; image 2 is the original standee identity. Extract/redraw ONE isolated anatomical piece, completing only hidden attachment ends. Only the torso from under chin to crotch: red triangular neck scarf, broad brown furry belly, leather diagonal harness, gold buckle belt, left pouch, ragged tan belly hem. Preserve crouched forward lean. NO head, ears, arms, shoulder pad, legs, tail or trailing scarf. Small rounded fur shoulder attachments and rounded hip overlap ends. Match this character's stocky proportions and original width/length ratio exactly, not a new design. Keep the orientation it has in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short, same local material.

### scarf-tail

Use case: precise-object-edit. Cutout rig source part scarf-tail. Image 1 is the exact assembled target; image 2 is the original standee identity. Extract/redraw ONE isolated anatomical piece, completing only hidden attachment ends. Only the two red ragged scarf tails trailing left behind the neck in the reference, knot at right. NO neck bib, body, head or other parts. Match this character's stocky proportions and original width/length ratio exactly, not a new design. Keep the orientation it has in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short, same local material.

### tail

Use case: precise-object-edit. Cutout rig source part tail. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only the thick pink segmented curved tail from the reference, left curling tip, thicker root at right. Exact curve and thickness. Nothing else. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### arm-front-upper

Use case: precise-object-edit. Cutout rig source part arm-front-upper. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only near upper arm, image-left sword arm: chunky brown and cream furry short upper arm pointing from upper-right shoulder to lower-left elbow, with its single patched metal/leather shoulder pad at upper-right. Thick as standee. No torso, scarf, forearm, fist or weapon. Rounded extended elbow end. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### arm-front-lower

Use case: precise-object-edit. Cutout rig source part arm-front-lower. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only near forearm from elbow on right to wrist on left, same slightly sloping horizontal orientation as image-left sword arm. Thick wrapped brown leather bracer, short chunky forearm. End at wrist, NO fist and NO weapon (separate grip hand will overlap it). Rounded extended joint ends. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### arm-back-lower

Use case: precise-object-edit. Cutout rig source part arm-back-lower. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only far lower arm on image-right: brown wrapped bracer and chunky open claw hand with black nails, extending from elbow bottom-left toward hand upper-right, exact reference. Rounded extended elbow end. NO upper arm or body. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### arm-back-lower-grip

Use case: precise-object-edit. Cutout rig source part arm-back-lower-grip. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only far lower arm on image-right: same thick brown wrapped bracer as reference, same elbow-left to hand-right orientation, but fist tightly gripping an empty vertical shaft hole. No shaft or weapon. Rounded extended elbow end. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### arm-back-lower-pinch

Use case: precise-object-edit. Cutout rig source part arm-back-lower-pinch. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only far lower arm on image-right: same thick brown wrapped bracer and proportions, same elbow-left to hand-right orientation; hand pinches an invisible bowstring between thumb and curled fingers. NO string, bow or arrow. Rounded extended elbow end. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### hand-front-grip

Use case: precise-object-edit. Cutout rig source part hand-front-grip. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only near sword gripping hand at image-left: chunky brown/pink fist curled around an empty diagonal hilt hole, black claws, small leather cuff at wrist on right. NO sword, hilt, bracer, forearm or body. Match reference hand exactly. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### leg-front-upper

Use case: precise-object-edit. Cutout rig source part leg-front-upper. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only near thigh on image-left: VERY broad short patched olive ragged trouser thigh, gray and orange stitched patches, hip upper-right to bent knee lower-left; same wide crouch angle as reference. Rounded extended joint ends. No shin, boot, torso or belt. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### leg-front-lower

Use case: precise-object-edit. Cutout rig source part leg-front-lower. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only near shin and whole boot on image-left: SHORT thick exposed pink/brown shin and broad brown leather wraps leading down-left into massive splayed foot with pink toes and dark nails. Exact crouched boot from reference, rounded extended knee cap. No thigh or trousers. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### leg-back-upper

Use case: precise-object-edit. Cutout rig source part leg-back-upper. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only far thigh on image-right: VERY broad short patched olive ragged trouser thigh, cream stitched patch; hip upper-left to bent knee right and slightly down. Low wide crouch. Rounded extended ends. NO shin/boot, torso/belt. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### leg-back-lower

Use case: precise-object-edit. Cutout rig source part leg-back-lower. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only far shin and whole boot on image-right: SHORT thick pink/brown shin and broad brown leather wraps leading down-right into massive broad foot with pink toes and dark nails. Exact crouched boot from reference, rounded extended knee cap. No thigh/trousers. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### head-neutral

Use case: precise-object-edit. Cutout rig source part head-neutral. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only standee head SET S: SAME big round ears, short broad cream muzzle, brown scruffy fur, cheek star scar, black nose, both eyes visible, ears unchanged. Neutral angry closed-mouth sneer, no long incisors, short muzzle exactly original. No scarf/torso. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### head-snarl

Use case: precise-object-edit. Cutout rig source part head-snarl. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only standee head SET S: SAME big round ears, short broad cream muzzle, brown scruffy fur, cheek star scar, black nose, both eyes visible. Mouth wide open snarling teeth bared as original standee. Preserve exact ear/head envelope. No scarf/torso. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### head-hurt

Use case: precise-object-edit. Cutout rig source part head-hurt. Image 1 is exact assembled target; image 2 is original standee identity. Image 3 supplies ONLY the squeezed-eye gritted hurt expression, not its long head shape. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only standee head SET S: SAME big round ears, SHORT broad cream muzzle, brown scruffy fur, cheek star scar, black nose. Eyes tightly SQUEEZED SHUT, eyebrows pained, mouth pulled sideways in a GRITTED TEETH WINCE as supplied hurt expression reference. Keep original SHORT head shape and large ears. No scarf/torso. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### head-neutral-r

Use case: precise-object-edit. Cutout rig source part head-neutral-r. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only head SET R: faithfully same brown standee head and big round ears, cheek star scar and both eyes, but muzzle JUST SLIGHTLY longer and two visible front incisors in a closed-mouth angry sneer. Modest rat cue, NOT long weasel muzzle. No scarf/torso. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### head-snarl-r

Use case: precise-object-edit. Cutout rig source part head-snarl-r. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only head SET R: faithfully same brown standee head and big round ears, cheek star scar and both eyes, muzzle JUST SLIGHTLY longer with paired visible front incisors, mouth wide open snarl with teeth bared. Modest rat cue, NOT weasel. No scarf/torso. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### head-hurt-r

Use case: precise-object-edit. Cutout rig source part head-hurt-r. Image 1 is exact assembled target; image 2 is original standee identity. Image 3 supplies ONLY the squeezed-eye gritted hurt expression, not its long head shape. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only head SET R: same big round ears, brown scruffy fur, cheek star scar; muzzle JUST SLIGHTLY longer, two visible front incisors. Eyes tightly SQUEEZED SHUT and GRITTED TEETH WINCE, same beloved pained expression supplied in hurt reference. Still short broad standee head, NOT weasel. No scarf/torso. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.

### arm-back-upper

Use case: precise-object-edit. Draw ONE isolated far UPPER ARM ONLY for the brown standee rat in the attached reference. Only far upper arm on image-right: short thick cream/brown fur shoulder-to-elbow sloping down-right, NO torso, fist or forearm. Rounded extended shoulder/elbow ends. Thick short proportions exactly reference. This is a SHORT THICK furry upper-arm segment with no clothing or metal shoulder pad; shoulder at upper-left and elbow at lower-right, diagonal down-right. Both ends rounded and slightly extended. Do not include bracer, forearm or hand. Match reference fur palette and chunky width. Warm painted cartoon, bold outline, upper-left light. Center with clear margins on flat #00FF00. No text or shadow.

## First corrective edits

### torso

Change ONLY the shoulder attachments on this isolated torso. Completely remove the large metal-and-leather shoulder pad at upper-left; it belongs to the separate arm part. Remove both projecting furry upper arm stubs; replace with SHORT rounded dark-brown shoulder sockets blending into torso outline, not visible tubes. Keep the red scarf bib, harness, belly, belt, buckle, pouch, ragged waist hem, colors, proportions, crouched lean, style unchanged. Flat #00FF00 background. Only torso, no head, arms or legs.

### torso-back

Turn this isolated torso so we see the BACK, not the chest. Remove front triangular scarf bib, front belt buckle and belly cream bib. Show brown furry back, crossed leather harness back straps, plain back belt, scarf collar at nape. Keep same broad short torso outline, crouched lean, brown palette, green background and no head or limbs. No additional shoulder pad or arm stubs.

### arm-front-lower

Keep ONLY the lower-left brown leather wrapped forearm bracer with its pink rounded wrist end. Completely REMOVE the large metal shoulder pad and all upper-arm fur at the right. Replace removed anatomy with flat #00FF00. Complete a small rounded brown elbow attachment end immediately at the right edge of the leather bracer. Result is ONE SHORT THICK leather wrapped forearm, wrist at left, elbow at right, no upper arm, no shoulder armor, no hand, no weapon. Center and enlarge this single piece, preserve same orientation, bold outline, warm colors, green background.

### leg-front-upper

Extract ONLY the large near trouser thigh on the LEFT with the orange and gray patches. Completely REMOVE the other thigh and its cream patch at the RIGHT, and REMOVE the crotch fabric joining them. Finish the top-right end of the selected left thigh as one simple rounded hip joint. Keep left thigh exactly as drawn from upper-right hip to lower-left knee, its very BROAD SHORT width and patches, colors, dark outline, orientation. Output ONE SINGLE THIGH, not trousers or two legs. Flat #00FF00, no other anatomy, plenty of margin.

### head-hurt

Image 1 is the EDIT TARGET: the short broad standee rat head, set S. Change ONLY the expression: eyes squeezed completely shut, brows pinched in pain, mouth pulled into a gritted-teeth wince as in Image 2 (expression guide only). Preserve Image 1's exact SHORT muzzle length, round ears, cheek scar, head silhouette, neck fur, nose position, colors and size. Do NOT copy Image 2's elongated muzzle or protruding front incisors. Set S has NO long protruding incisor teeth. Grit teeth inside its short mouth. Flat #00FF00 green background, no scarf/body or other anatomy.

## Generated thickness revisions

### arm-front-upper

Edit only this isolated rig part: Increase the fur arm diameter/thickness by 35%, keeping shoulder-to-elbow LENGTH and orientation unchanged. Broad short stocky upper arm, not elongated or cylindrical. Preserve the existing single shoulder pad, cream fur band, palette and dark outlines. Round elbow attachment. Keep all other identity, warm painted cartoon style, upper-left lighting, dark outline unchanged. One isolated piece centered with clear margin on flat #00FF00 background. No text or shadow. Do not add other anatomy.

### arm-front-lower

Edit only this isolated rig part: Increase forearm DIAMETER/thickness by 45%, keeping wrist-to-elbow LENGTH and angle unchanged. A very stout short wrapped leather bracer, not a long tube. Preserve wrap pattern, palette, round small attachment ends, no hand or shoulder armor. Keep all other identity, warm painted cartoon style, upper-left lighting, dark outline unchanged. One isolated piece centered with clear margin on flat #00FF00 background. No text or shadow. Do not add other anatomy.

### leg-front-upper

Edit only this isolated rig part: Make this single thigh 30% BROADER across the leg, while keeping hip-to-knee LENGTH and diagonal angle unchanged. Short fat crouched trouser thigh with broad clothing silhouette, same orange/gray patches. No second leg or crotch. Preserve rounded ends. Keep all other identity, warm painted cartoon style, upper-left lighting, dark outline unchanged. One isolated piece centered with clear margin on flat #00FF00 background. No text or shadow. Do not add other anatomy.

### arm-back-upper

Edit only this isolated rig part: Make this furry upper arm 35% THICKER across its axis, keeping shoulder-to-elbow LENGTH and diagonal angle unchanged. Very short chunky far upper arm with rounded brown ends and cream fur, not an hourglass or thin sausage. No other anatomy. Keep all other identity, warm painted cartoon style, upper-left lighting, dark outline unchanged. One isolated piece centered with clear margin on flat #00FF00 background. No text or shadow. Do not add other anatomy.

## Shortened far forearms

### arm-back-lower

Edit target: this isolated arm-back-lower rat arm part. Keep ONLY the HAND and its immediately adjacent wrist bracer on the RIGHT. Completely REMOVE the extra cuff/stub at far LEFT and the long cream furry upper-arm section joining it. Replace removed anatomy with green background. Finish the remaining right wrist bracer at its left edge with a SHORT rounded elbow extension, so the final asset is one SHORT THICK FOREARM with ONE continuous leather wrap bracer and its hand. Keep the hand pose exactly unchanged, same orientation and fingers. Do not include any upper arm, second bracer, shoulder or weapon. Keep broad stocky width, warm painted style, bold outlines and #00FF00 background. Center the single completed piece with generous margin.

### arm-back-lower-grip

Edit target: this isolated arm-back-lower-grip rat arm part. Keep ONLY the HAND and its immediately adjacent wrist bracer on the RIGHT. Completely REMOVE the extra cuff/stub at far LEFT and the long cream furry upper-arm section joining it. Replace removed anatomy with green background. Finish the remaining right wrist bracer at its left edge with a SHORT rounded elbow extension, so the final asset is one SHORT THICK FOREARM with ONE continuous leather wrap bracer and its hand. Keep the hand pose exactly unchanged, same orientation and fingers. Do not include any upper arm, second bracer, shoulder or weapon. Keep broad stocky width, warm painted style, bold outlines and #00FF00 background. Center the single completed piece with generous margin.

### arm-back-lower-pinch

Edit target: this isolated arm-back-lower-pinch rat arm part. Keep ONLY the HAND and its immediately adjacent wrist bracer on the RIGHT. Completely REMOVE the extra cuff/stub at far LEFT and the long cream furry upper-arm section joining it. Replace removed anatomy with green background. Finish the remaining right wrist bracer at its left edge with a SHORT rounded elbow extension, so the final asset is one SHORT THICK FOREARM with ONE continuous leather wrap bracer and its hand. Keep the hand pose exactly unchanged, same orientation and fingers. Do not include any upper arm, second bracer, shoulder or weapon. Keep broad stocky width, warm painted style, bold outlines and #00FF00 background. Center the single completed piece with generous margin.

## Final clear pinch hand

### arm-back-lower-pinch

Change ONLY the hand pose on this isolated short wrapped forearm. Make a CLEAR PINCH for pulling a bowstring: thumb pad and index fingertip touch together, forming one tiny empty gap, with middle/ring fingers curled tightly into the palm. Black claw tips tucked back. This is NOT an open claw/grab hand. Preserve the exact wrist bracer, forearm size and orientation, brown/pink colors, bold outlines, lighting and green background. No bowstring, arrow, bow or extra anatomy. One part centered with margin.

## Initial far-upper-arm request without an output (retried above)

Use case: precise-object-edit. Cutout rig source part arm-back-upper. Image 1 is exact assembled target; image 2 is original standee identity. Extract/redraw ONE isolated anatomical piece, completing hidden attachment ends. Only far upper arm on image-right: short thick cream/brown fur shoulder-to-elbow sloping down-right, NO torso, fist or forearm. Rounded extended shoulder/elbow ends. Thick short proportions exactly reference. Match this character's stocky proportions and original width/length ratio exactly. Keep the orientation in reference. Warm painted cartoon, bold dark outlines, upper-left lighting, original muted brown palette. Center on flat #00FF00 green with clear margin; no shadow, text, diagram, duplicate or other anatomy. Joint extensions rounded and short in same local material.
