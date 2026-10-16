# Asset contract (Art)

## IDs and folders
- Every asset request has an ID: `A001`, `A002`... An ID is never reused; a revision is `A001-02`.
- Art delivers **only** to `assets/source/<ID>-<slug>/`, e.g. `assets/source/A001-mouse-fighter-rig/`.
- Code turns sources into game-ready files in `assets/art/` (keying with `tools/key_green.py`, trimming, resizing) and wires the data. Art never writes to `assets/art/` or `src/`.

## Each delivery folder contains
- The images, named exactly as the packet lists.
- `prompt.md`: tool used, the exact prompts, seeds/settings if any.
- `review.png`: all images side by side on a mid-grey background, plus one image composited at game size (about 130 px tall) over a screenshot or the stage art, so scale and readability can be judged in context.
- `HANDOFF.md`: what was made, what is missing, known flaws.

## States (tracked in `docs/assets.md`)
`requested` -> `source` (delivered) -> `game-ready` (imported by Code) -> `approved` (user saw it in game).

## Image rules
Follow `docs/style-contract.md`. Character art: three-quarter view toward the camera (about 30 degrees), facing right, flat #00FF00 background, light from upper left, no ground shadow, consistent scale. PNG. Sources at least 1024 px on the long side.

## Cutout rig parts (for rig requests)
- Each part drawn separately with clear space between parts; none overlapping.
- Limb parts have **rounded, slightly extended ends at joints** so they can rotate without gaps.
- Always include `reference.png`: the assembled character in the rig's neutral pose, same scale as the parts.
- Separate PNG per part is best; a single sheet is acceptable (Code slices it).

## Frame animation (later, e.g. ComfyUI)
PNG sequence per move, fixed canvas size, feet at the same pixel in every frame, named `<move>_<nn>.png`.
