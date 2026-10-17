# A021 exact image prompts

Tool: built-in image_gen.imagegen. Four individual calls, transparent_background=false. No seed or size controls exposed. Each call used A003 rat-cutlass.png as a style reference, not an edit target. Generated dimensions: dagger/axe/staff 1774 x 887; shield 1254 x 1254.

## dagger

Use case: stylized-concept. Single game item sprite: a rat's back-alley dagger, short broad worn iron blade, brown leather wrapped grip, small battered iron crossguard. Match the warm painted cartoon style, thick dark brown outlines and broad angular highlights of the reference cutlass, but distinctly a short straight broad dagger with no gold ornament. Entire weapon horizontal, pommel at LEFT, blade tip pointing RIGHT, handle axis exactly horizontal. Slight three-quarter-flat face visible so same drawing works held or lying on floor. Isolated centered, fills width with safe margin, solid uniform #00FF00 background, no shadow, no hand, no text or markers, no other objects. Upper-left light; muted warm browns and worn grey iron. Landscape image.

## shield

Use case: stylized-concept. Single game item sprite: small rustic round rat buckler made of rough warm brown planks, battered dark iron rim and central iron boss, a small faded red painted slash across one plank. Warm painted cartoon, bold very dark brown outline, broad angular highlights matching reference cutlass. Face-on at slight three-quarter angle (round shield appears subtly oval), face visible, left rim has small visible brown strap loop for far hand, rest of strap hidden BEHIND face. No hand. Isolated centered whole item with safe margin on flat uniform #00FF00 green. Upper-left lighting, worn grey iron and leather, not shiny knight gear, no gold, no symbols, no text, no ground shadow, no extra objects. Square image.

## axe

Use case: stylized-concept. Single game item sprite: rustic one-handed rat hand axe, battered notched iron wedge head and wooden haft with dark brown leather wrapped grip. Match warm painted cartoon reference cutlass, bold dark brown outline and angular painted highlights. Entire axe lies horizontally, haft butt at LEFT, axe head at RIGHT; handle shaft axis exactly horizontal. Single blade extends downward from right end, curved cutting edge visible; no double blade. Three-quarter-flat view so same item can lie on floor or be held. Full item centered with safe margin, landscape image. Flat uniform #00FF00 backdrop, light upper left, muted warm brown wood/leather and worn grey iron, no gold, no hand, no shadow, no text, no markers, no other objects.

## staff

Use case: stylized-concept. Single game item sprite: long rustic walking staff for a scavenging rat caster, quarterstaff and caster staff in one. Knotted gnarled warm brown wood with a nearly straight horizontal central shaft, modest knots; a small dull blue-grey river stone bound into forked wood at the RIGHT head with rough leather lashings and a short red cloth scrap. Two subtle brown leather grip wraps on the shaft at about 30 percent and 57 percent of length; keep shaft continuous and unobstructed between grips. Staff butt at LEFT, head at RIGHT, axis exactly horizontal. No branching silhouette except tiny fork at head, no glowing magic. Warm painted cartoon with bold dark brown outline and angular brush highlights matching reference cutlass, upper-left light. Entire long narrow item across landscape image with safe margins on flat uniform #00FF00, no hands, no ground shadow, no text, no other objects.

## Technical preparation and review

Python/Pillow: normalize background pixels with green excess >95 to exact #00FF00; preserve painted foreground. No redrawing, stretching or rescaling of source items. Temporary keying and affine placement only for review. A018 source parts and existing grip hand swaps used; no new body or hand art. Grip markers measured in full source canvas coordinates.
