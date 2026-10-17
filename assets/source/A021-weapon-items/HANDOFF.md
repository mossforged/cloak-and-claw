# A021 — Four weapon items

Branch: `a021-weapon-items`. Source delivery for human phone review; not approved or imported.

## Delivered

- `dagger.png`, `shield.png`, `axe.png`, `staff.png`: individual flat #00FF00 sources. Dagger/axe/staff 1774 × 887; shield 1254 × 1254. Weapons point right with handles at left. Upper-left lighting, no painted ground shadow or hands.
- `weapons.json`: A012-style `weapons` map, full canvas dimensions, measured grip/axis/tip or shield centre, staff second grip, floor angle, stow anchor and review scale for every item.
- `review.png`: all items at 1:1 source pixels on grey with attachment markers; actual 960 × 540 held/floor panel over Harbor Market, rebuilt rat at 136 px.
- `prompt.md`: built-in imagegen tool and exact four prompts plus technical preparation.
- Phone JPGs in `docs/screens/A021/`: `review.jpg` (1600 × 1800), `game-size.jpg` (960 × 540), `held-closeup.jpg` (1920 × 310, nearest-neighbour 2× detail).

## Measurements and import

Review lengths come from keyed silhouette bounds: dagger 40 px wide, shield 48 px tall (45.5 px wide from perspective), axe 60 px wide, staff 150 px wide. Staff grips are 39.84 game pixels apart. Source images retain their full canvases. After key/trim, subtract the trim origin from every marker before applying one uniform scale. Do not infer scale from the source canvas width.

All floor `rest` angles are zero: source weapons are already horizontal; shield lies face-up using this same image. Angles use image coordinates, clockwise positive. Shield `gripEnd` follows the strap downward; other items' axes run toward the head. Staff `tip` is the bound stone centre/magic socket. Axe `tip` is the cutting-edge centre, not the haft end. Stow anchors are attachment choices measured on the drawn item, not additional visible fittings.

## Fit review and limits

The review assembles existing A018 parts in their setup positions, substitutes the existing near grip/far shield hands, and registers those hands and items with the measured points. Dagger/axe hands rotate at the wrist to show the item silhouettes. For the staff only, the existing upper/lower arms rotate inward to reach both grips: the setup wrists are about 71 px apart, whereas the requested grip spacing is about 40 px. No limb is stretched and no body/hand art is added. Both staff fists draw over the shaft. This is a static attachment demonstration; Code must validate the real poses, grip modes and motion in the viewer.

The buckler has a more visibly oval perspective than a perfectly face-on disc. Its strap loop remains visible just outside the left rim; the rest is behind the face. The dagger has a chunky wrapped hilt relative to its short blade. These are deliberate rustic silhouettes for phone review. Floor items have no additional perspective redraw or flattening: held art equals floor art.

Nothing required is missing. Runtime import and human look approval remain open. Review question: do these belong with the existing cutlass and spear, and look like things a rat would carry?
