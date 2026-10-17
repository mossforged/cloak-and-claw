# A017 prompts

Tool: built-in image_gen (default built-in mode). No seed or model override exposed.

Input roles and exact prompts follow.

## Front generation
Inputs: A010/reference.png (outfit/style), A010/head-neutral.png (approved head reference), assets/art/enemies/rat-raider.png (identity standee).

Use case: identity-preserve. Asset: Rat Raider neutral rig setup master, NOT a combat pose. Input 1 A010 reference is outfit, painting style and stocky proportions reference. Input 2 approved neutral head is identity and head size reference, to be pasted unchanged later. Input 3 standee is identity reference.
Redraw this SAME stocky brown rat's BODY in a neutral setup pose, three-quarter toward camera facing right. Keep patched olive baggy shorts, leather chest straps, belt with gold buckle and small pouch, single patched leather shoulder pad, red neck bandana, cream belly fur, brown wrist and ankle wraps, big pink clawed feet, thick short limbs. Warm painted cartoon with bold dark outlines, upper left light.
POSE CRITICAL: both legs directly under hips, visible equal lengths, separated slightly, knees softly bent only 10-20 degrees, toes both point right, soles on same horizontal floor. No wide lunge. Both arms hang downward and outward 20-30 degrees away from torso with slight elbow bend, BOTH fully visible equal length, relaxed CLOSED fists beside thighs, clear green gap between arms and torso. No weapon. No fist across belly. Body slightly hunched at upper back only. Waistband/seat one clean hip region, each trouser leg wraps its own thigh, clear crotch division and no diagonal folds spanning both legs. Tail hangs down and back toward left in gentle curve, scarf tails hang behind left shoulder downward.
Layout: portrait 1536 x 2304 equivalent 2:3 aspect. Entire rat ~1350 pixels tall, from y650 to y2000, centered horizontally. Head should match input head scale (roughly 800 px wide) and position; body proportion stocky, not tall or thin. Flat exact #00FF00 background, no ground line, no shadow, no text. Head will be replaced by approved original pixels after generation; build clean neck junction below head. Only one front three-quarter rat, no second view.

## Pose correction
Input: first generated front.

Edit this setup master with ONLY these pose corrections. Preserve rat identity, body stockiness, outfit, painting, head, and arm positions.
1 Both feet point RIGHT, including the near foot at image left: show its heel on left and toes on right. Both soles at exact same floor height. Keep both legs under hips, not spread. Equal length legs, knees 15 degree bend.
2 Red scarf tails hang DOWN behind the image-left shoulder rather than blowing horizontally.
3 Pink tail hangs DOWN behind image-left hip then curls gently left near floor, rather than raised horizontally.
Keep no weapon, no shadow, flat pure #00FF00 background and portrait composition.

## Back generation
Inputs: corrected front, A010/master-back.png, A010/head-back.png.

Use case: identity-preserve. Draw the BACK VIEW of the supplied neutral setup-pose rat, preserving the same outfit, proportions and limb positions. Input 1 is the front setup master to turn around; input 2 old back master shows rear outfit design; input 3 approved rear head must carry over unchanged later.
Single stocky brown rat, three-quarter from BEHIND facing right, back of big round ears and head visible, no front face. Both arms hanging down and 20-30 degrees away from body, slight elbow bend, relaxed closed fists, BOTH fully visible equal lengths and clear green gaps from torso. Both legs underneath hips, equal lengths with knees only 15 degrees bent, both feet flat on SAME floor height, toes facing right. No wide action lunge. Preserve thick limbs, patched olive trousers, clean separate waistband/seat and thigh regions, brown wrist and ankle wraps, pink clawed feet, leather back harness and belt pouch, single patched shoulder pad. Red scarf tails hanging down behind shoulder, pink tail gently hanging down/back left and curving near floor. Match front master scale and framing precisely. Warm painted cartoon, bold dark outlines, upper left light, exact flat #00FF00 background, no ground shadow, no line or labels. Portrait 2:3, one character.

## Collar repair
Input: composed front master.

Precise-object-edit. Repair ONLY the neck-to-bandana junction of this rat: fill the tiny green wedges between the cheek/neck fur, shoulder pad and red scarf with matching brown fur or red scarf. The head itself is approved: preserve head identity, contours, expression and placement. Everything else must remain unchanged: body, pose, outfit, empty green background, feet and scale. No extra objects or shadows.

## Mechanical preparation
Generated canvases: 1024 x 1536. Body resized uniformly to 1229 x 1843 (rounded 1.2x), placed at (80,300) on 1536 x 2304. Green-dominant background normalized to exact #00FF00. Generated heads removed; approved A010 head-neutral and head-back foreground pixels pasted at offset (-114,-50), no resize, no rotation, no interpolation. Collar repair used only within a neck polygon; approved head pasted again afterwards. The rear head retains its original isolated contour marks. No part cutting. Review keying and resizing are preview only. No pose warps or limb stretching.
