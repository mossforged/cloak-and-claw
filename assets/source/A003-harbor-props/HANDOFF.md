# A003 — Harbor props

Branch: `a003-harbor-props`. Source delivery for human look review.

## Delivered

- `crate.png`, `crate-debris-1.png` through `crate-debris-4.png`.
- `barrel.png`, `barrel-debris-1.png` through `barrel-debris-3.png`.
- Floor weapons: `rat-cutlass.png`, `plank-club.png`, `big-fish.png`.
- `review.png`: all twelve sprites on grey, followed by the five intact props on Harbor Market beside the existing Mouse Fighter standee.
- `prompt.md`: tool, exact prompts, reference roles, and review preparation.

## Intended game scale

The review uses the standee at 130 px silhouette height. Crate is 55 px tall, barrel 64 px tall, cutlass and plank 91 px wide, fish 96 px wide. These sizes describe trimmed artwork, not the green source canvases. The stage panel is enlarged 1.5 times for inspection; grey thumbnails are independently fitted to their cells. These are art scale suggestions for the importer, not game data changes.

## Limits and review gate

No requested file is missing. Debris was generated separately using the same material and style specification; it is not an exact geometric fracture of the intact objects. Weapon handles, wood grain, and markings simplify at game size. The cutlass follows the Rat Raider's broad chipped gray blade, brass guard, and brown grip; it is a new floor-oriented drawing rather than a traced rotation of the standee sword.

Original generated PNGs retain opaque green backgrounds with small RGB variation and antialiased boundaries. Production keying, trimming, resizing, and edge cleanup belong to the code builder. The green is removed only in the review sheet. No ground shadows were added.

No game import or code changes were made. Asset state `source` means delivered; human approval of the look remains open. Review question: do these props fit the harbor and characters?
