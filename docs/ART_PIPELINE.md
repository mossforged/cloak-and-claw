# Art pipeline (for Codex / ComfyUI / any art tool)

Art agents only add files under `assets/` and edit the `art:` block in `src/data/fighters/*.js` or `src/data/stages/*.js`.
No code changes are needed to swap art: data points at image paths, and missing images show a labeled placeholder.

## Style rules (all art)
- Match the art bible: warm painted cartoon, **bold dark outlines**, readable silhouette.
- Light from the **upper left**, every image.
- Background: flat pure green `#00FF00` (keyed with `tools/key_green.py`), or transparent PNG. No green on the character itself.
- No ground shadow (the game draws its own).
- Characters **face right**, seen from the side (slight 3/4 is fine). The game mirrors them to face left.
- Same scale and the same feet height across every image of one character.

## Keying and placing
```
python3 tools/key_green.py input.png assets/art/heroes/mouse-fighter.png 520
```
(trims to content, max 520 px). Then set in the fighter's data file:
`art: { idle: '<path>', height: <on-screen px>, facing: 1, anchorX: <feet centre, 0..1 of width> }`.
Check with the debug overlay (` key): the white cross should sit between the feet.

## Folder layout
```
assets/art/heroes/<id>.png            single standee images (current)
assets/art/heroes/<id>/<pose>.png     pose swaps: idle, windup, strike, hurt, down
assets/rigs/<id>/reference.png        assembled character in the rig pose
assets/rigs/<id>/parts/<part>.png     separated body parts for the cutout rig (rung 1b)
assets/anim/<id>/<move>_<nn>.png      frame-by-frame sequences (later, if we go that way)
assets/art/stages/<id>.png            stage cutouts
```

## Option A: pose swaps (cheap upgrade, works with the current engine)
Five images per character, same scale and framing: `idle`, `windup` (sword drawn back), `strike` (sword swung through), `hurt` (recoiling), `down` (lying on back).
Add to data as `art: { idle, windup, strike, hurt, down, ... }`. Wiring the swaps into the renderer is a small code task.

## Option B: cutout rig parts (rung 1b)
**Request for Mouse Fighter.** Generate one sheet, at least 2048 px wide:

> Character parts sheet for a 2D cutout animation rig. Mouse Fighter: grey mouse, large pink ears, red scarf, blue tunic with gold trim, brown belt and boots, short sword, round wooden shield with gold rim. Same warm painted cartoon style with bold dark outlines as the reference. Side view facing right. Every body part drawn **separately with clear space between them**, none overlapping, on a flat pure green (#00FF00) background. Parts: head with ears (no neck), torso with tunic, belt and scarf knot, scarf tail, tail, front upper arm, front forearm with hand gripping the sword, back upper arm, back forearm with hand, round shield (face-on), front thigh, front shin with boot, back thigh, back shin with boot. Each limb part has **rounded, slightly extended ends at the joints** so it can rotate without gaps. Consistent light from upper left. No shadows.

Also generate **`reference.png`**: the same character assembled, side view facing right, standing neutral with arms slightly away from the body, same scale as the parts. This is how the parts get placed.

Separate PNGs per part are better than one sheet, if your tool can do that. Name them after the part list (`head.png`, `torso.png`, `arm-front-upper.png`, ...). A sheet is fine too: Claude will slice it.

## Option C: frame-by-frame animation (later)
If ComfyUI produces animation frames: PNG sequence per move, **fixed canvas size**, feet at the **same pixel** in every frame, named `<move>_<nn>.png` (e.g. `slash1_00.png`). The engine will need a small "flipbook" art mode for this. Ask Claude when there is a sequence to test.
