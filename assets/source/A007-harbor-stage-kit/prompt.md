# A007 generation prompts

Tool: built-in `image_gen.imagegen`; one call per asset. Style reference for every call: `assets/art/stages/harbor-market.png`. `referenced_image_paths` contained that file. `transparent_background=true` except floor (`false`). No seeds exposed. PNGs are unmodified generated sources; review uses crop/resize/compositing only, no repainting or seam repair.

## far.png

```text
Use case: stylized-concept. Asset type: separate parallax background PNG for a warm painted cartoon belt-scroller. Reference image is /Users/johniadarola/Projects/cloak-and-claw-art/assets/art/stages/harbor-market.png: match its rich hand-painted bold dark outlines, muted blue and warm ochre palette, upper-left sunlight. Generate ONLY a very wide distant harbor layer: calm blue-green sea, low far headlands, a small distant lighthouse and two tiny distant sails. No near ship, buildings, dock, floor or foreground. No sky: genuinely transparent above the silhouetted distant headland and sail edges. Sea fills lower portion to bottom, level horizontal horizon. Wide 3:1 panorama, at least 1920 pixels wide. Calm low-contrast detail, left and right edges matching open water for repeat. No text or border. Save generated image.
```

## back-1.png

```text
Use case: stylized-concept. Asset type: individual back scenery layer for scrolling 2D belt-scroller, one PNG. Input image is style and prop reference: preserve the Harbor Market's warm painted cartoon, bold dark outlines, amber limestone, terracotta roofs, blue shutters, blue-and-cream awnings, gold lanterns, rope and timber, upper-left sunlight. Wide 8:3 canvas, intended 1440x540 game pixels. Side-on stage elevation with slightly visible tops as in reference. GENUINELY TRANSPARENT background and empty sky. This is ONLY the vertical BACK scenery: every building, stall counter, barrel and moored ship terminates along the SAME level horizontal baseline exactly 90% down the image, with transparent margin beneath. NO walkable pavement, dock face, water or foreground. Bottom baseline straight, no perspective vanishing slope. Edge dividers: identical thick timber mooring post at each extreme left and right edge, top near half image height, bases at baseline, each half clipped by image edge, for joining segments. Dense inviting scenery, no characters, no text.
Subject: Market entrance: a broad pale stone arch with a small anchor emblem at left third, a cream cottage and blue shutters, one blue-and-cream fish stall, coiled ropes and modest crates behind the baseline. Leave open transparent views above and through arch.
```

## back-2.png

```text
Use case: stylized-concept. Asset type: individual back scenery layer for scrolling 2D belt-scroller, one PNG. Input image is style and prop reference: preserve the Harbor Market's warm painted cartoon, bold dark outlines, amber limestone, terracotta roofs, blue shutters, blue-and-cream awnings, gold lanterns, rope and timber, upper-left sunlight. Wide 8:3 canvas, intended 1440x540 game pixels. Side-on stage elevation with slightly visible tops as in reference. GENUINELY TRANSPARENT background and empty sky. This is ONLY the vertical BACK scenery: every building, stall counter, barrel and moored ship terminates along the SAME level horizontal baseline exactly 90% down the image, with transparent margin beneath. NO walkable pavement, dock face, water or foreground. Bottom baseline straight, no perspective vanishing slope. Edge dividers: identical thick timber mooring post at each extreme left and right edge, top near half image height, bases at baseline, each half clipped by image edge, for joining segments. Dense inviting scenery, no characters, no text.
Subject: Central busy market: blue-and-cream striped fish and produce stalls at left and right, warm cream cottages and terracotta rooftops. A large moored blue wooden sailing ship with cream sails and blue anchor emblem behind center, like the reference. Barrels, crates and glowing lanterns clustered behind the baseline.
```

## back-3.png

```text
Use case: stylized-concept. Asset type: individual back scenery layer for scrolling 2D belt-scroller, one PNG. Input image is style and prop reference: preserve the Harbor Market's warm painted cartoon, bold dark outlines, amber limestone, terracotta roofs, blue shutters, blue-and-cream awnings, gold lanterns, rope and timber, upper-left sunlight. Wide 8:3 canvas, intended 1440x540 game pixels. Side-on stage elevation with slightly visible tops as in reference. GENUINELY TRANSPARENT background and empty sky. This is ONLY the vertical BACK scenery: every building, stall counter, barrel and moored ship terminates along the SAME level horizontal baseline exactly 90% down the image, with transparent margin beneath. NO walkable pavement, dock face, water or foreground. Bottom baseline straight, no perspective vanishing slope. Edge dividers: identical thick timber mooring post at each extreme left and right edge, top near half image height, bases at baseline, each half clipped by image edge, for joining segments. Dense inviting scenery, no characters, no text.
Subject: End of pier warehouse: broad weathered honey-stone warehouse with terracotta roof, imposing closed timber double doors at center right as a future boss entrance. Small blue-and-cream stall at left, dock winch, barrels and crates near warehouse walls. Keep blue shutters, lanterns and nautical rope accents.
```

## floor.png

```text
Use case: stylized-concept. Create ONE separate floor strip PNG for the referenced warm cartoon Harbor Market. Match amber limestone, bold dark painted outlines, timber and rope, upper-left sunlight. Very wide 3:1 image, at least 1920 px wide. Exact layout: top 60% of image is a flat EMPTY walkable stone dock surface, from a straight horizontal back edge at y=0 to a straight front lip at y=60%; bottom 40% is vertical stone dock front face reinforced with timber, small rope loops and narrow blue-green water strip at bottom. Perspective as reference, viewed from slightly above, stones softly shaded low contrast. HORIZONTALLY TILEABLE: matching left/right edges with no unique endcaps or posts. No big props, raised stones, stairs, railing, posts, vegetation, characters, sky or back scenery. All walking surface is level unobstructed honey stone. Image fills rectangular canvas completely, no transparency required. Designed to resize to 1440x200: walking surface then EXACTLY 120 px and dock face 80 px.
```

## front-post.png

```text
Use case: stylized-concept. Single separate foreground prop cutout PNG: a low stout timber mooring post, two coils of thick rope, small iron band at base. Same warm painted cartoon Harbor Market style as reference, bold dark outlines, upper-left sun. Three-quarter viewed slightly from above. Whole object centered with generous TRANSPARENT margin, no background, floor, shadow or other objects. Intended only 48 px tall at game size, sparse and squat so it covers feet only.
```

## front-net.png

```text
Use case: stylized-concept. Single separate foreground prop cutout PNG: low horizontal bundled fishing net hanging between two SHORT timber mooring stubs, muted tan rope, a few small floats. Same warm painted cartoon Harbor Market style as reference, bold dark outlines, upper-left sun. Whole object centered with generous TRANSPARENT margin, no background, floor, shadow or other objects. Intended only 45 px tall and 160 px wide at game size; keep low and sparse so it covers feet only.
```

## front-lamp.png

```text
Use case: stylized-concept. Single separate foreground prop cutout PNG: low dock lantern on a SHORT stout timber bollard with rope wrapped round base, small gold glowing nautical lantern with dark iron frame. Same warm painted cartoon Harbor Market style as reference, bold dark outlines, upper-left sun. Whole object centered with generous TRANSPARENT margin, no background, floor, shadow or other objects. Intended only 64 px tall at game size; squat base and small lamp so mostly feet are occluded. No tall lamppost.
```
