# A026 Round 2 prompts

Tool: built-in image_gen (edits), one edit per piece. Inputs were 512×512 master-region cutouts, generated at tool-selected resolution. No seed control. Solid green background.

## Shared instruction

Use case: precise-object-edit. Edit this single master-region cutout into one finished rig part. Keep the visible original painting at exactly the same position, size, angle, silhouette, texture and color. This is not a redesign. Output 1024x1024 showing precisely the same 512x512 input framing doubled, solid #00FF00 background. Paint only missing hidden joint ends and clean edges formerly touching neighbors. Ends must be smoothly domed material, shaded darker toward the tucked end, bold dark outline. NO flat cross section, cylinder face, ellipse rim, hole, disk, tube opening or extra cuff. Upper-left light. Remove any tiny disconnected neighboring scraps. Do not recenter or enlarge the object.

## arm-near-upper

Only the shoulder pad and cream/brown fur upper arm. Remove the small bag scrap at lower right and chest strap along right side. Shoulder center in input (269.2,151.5), elbow (164.1,323.1). Complete the pad top previously hidden by the head, round shoulder underneath and rounded FUR elbow end under separate forearm. No red scarf, torso, bag, bracer or hand.

## arm-near-lower

Only orange-brown leather forearm bracer. Remove the detached gold/bag scrap on right and the cream fur beyond top cuff. Elbow center in input (264.1,133.1), wrist (178.6,282.5). Finish smooth rounded leather ends: elbow extends behind and wrist is the outlined bracer covering a separate hand. Retain all existing wrap folds. No hand or upper arm.

## hand-near

Only the closed fist, existing fingerless leather glove and pink curled fingers. Wrist center in input (218.6,192.5). Extend wrist UPWARD into a smooth modest domed pink/leather wrist rooted at that center, hidden beneath separate bracer. No extra sleeve, cuff, bracer, flat end face or rim. Keep fist silhouette unchanged.

## leg-near-upper

Only olive-brown patched trouser thigh. Remove pink tail sliver on left and cream belly sliver at upper right. Hip center in input (297.2,141.8); knee (283.1,331). Extend top as smooth rounded olive trouser dome centered on hip hidden under seat. Keep patch and all ragged trouser hem exactly as is; reconstruct only clipped outline edges. No belt, bag, belly fur, tail or shin.

## leg-near-lower

Only pink shin with orange leather ankle wrap. Knee center in input (283.1,151), ankle (221.1,289.1). Extend pink shin upward as solid shaded rounded dome centered at knee, to tuck well beneath thigh. No flat face or rim. Finish ankle wrap edge covering separate foot. No trouser remnants, foot or toes. Preserve existing wrap contour.

## foot-near

Only this exact broad pink rat foot with three dark claws and orange leather instep strap and heel. Ankle center in input (171.1,219.1). Extend ONLY top ankle in leather/pink as smooth shaded dome centered at that point, under separate shin wrap. No extra cuff, collar, hole or flat face. Preserve all toe, claw, sole and heel contours.

## Shin retry

Initial leg-near-lower request was rejected by the image service content filter. Successful retry:

Edit the supplied cartoon game sprite cutout: finish this single leather boot-wrap and short rat shin rig component. Match the existing warm painted cartoon and dark outline. Preserve the existing wrapped leather shape and all folds. Complete its missing upper joint behind the trouser leg as a smooth closed rounded dome with darker shading, without any flat end face, open rim or tube opening. Complete only the missing hidden edges. No foot, toes, trousers or other body parts. Solid #00FF00 green background. Keep the original framing and scale, 1024 square output.

## Processing

Master regions were cut with manually traced polygons; detached neighboring scraps were removed. Tool output was uniformly scaled by bounding width and aligned to the original crop. The original retained region was composited back over tool paint to preserve exact visible pixels. Tool paint supplies the completed ends and adjoining edges. No code-painted anatomy, stretching or runtime changes. Registration is approximate; skeleton pivots remain the exact user values. self-check.json records the polygons, source filenames and transforms. Full generated variants are not delivered.

## Review

Pillow: green keying, layering actual A025 torso and A023 pelvis/seat with A018 head/far limbs/tail, rigid clockwise rotations of the complete downstream chain, source-pixel joint crops, whole-character 136px previews, and a 130px Harbor Market review. Metrics distinguish retained-region coverage from whole-part IoU. Neither certifies cap circularity or continuously safe motion.