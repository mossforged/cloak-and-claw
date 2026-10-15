# A004 — Rat Raider source rig and weapon kit

Branch: `a004-rat-raider-rig`. State: `source`; human look review is pending.

## Delivered

- `reference.png`: assembled right-facing, camera-facing three-quarter rat, both eyes visible, neutral sneer, cutlass in near hand and open far claw. Scar, scruffy brown fur, red bandana, patched clothing, belt and pouch match the existing raider. Taller/rangier than A002's mouse at review scale.
- Thirteen main parts: `head`, `torso`, `scarf-tail`, `tail`, `sword`, `arm-front-upper`, `arm-front-lower`, `arm-back-upper`, `arm-back-lower`, `leg-front-upper`, `leg-front-lower`, `leg-back-upper`, `leg-back-lower`. No shield.
- Four swaps: `torso-back`, `head-neutral` (byte-identical to `head`), `head-snarl`, `head-hurt`.
- Six kit parts: `hand-front-grip`, `arm-back-lower-grip`, `arm-back-lower-pinch`, `spear`, `bow`, `arrow`. The two far forearm variants use the alternatives explicitly allowed by the addendum; there are no separate far-hand files.
- `review.png`: all 23 parts on grey; large reference/current-rat comparison; mouse at 130 px, new rat at 136 px and old rat at 136 px over Harbor Market; rough two-handed spear and bow-draw assemblies using the delivered parts.
- `spear-mockup.png`, `bow-mockup.png`: larger versions of those static fitting studies.
- `fit-check.png`: every part at delivered scale/placement over a faded reference, exposing fit differences.
- `reference-original.png`: unmodified 1024 × 1536 generated reference. Use `reference.png` for the common canvas.
- `prompt.md`: built-in imagegen tool, exact prompts, inputs and preparation method. `part-layout.json`: placements, uniform scales and rotations; descriptive source metadata, not runtime pivots.

## Canvas and scale

`reference.png` and all 23 individual part PNGs share a **1536 × 2304** opaque #00FF00 canvas. The original reference is placed at **(200, 650)** without rescaling. Its silhouette is 1350 px tall; spear content is **2025 px** tall (1.5×), with both points and rag inside the canvas. The extra headroom accommodates that weapon without shrinking the rat. Do not scale by total canvas height when importing: the game-size comparison measures the character silhouette.

Parts were generated individually, keyed mechanically for placement, then uniformly resampled against estimated reference anatomy. No anisotropic stretching or hand-painted code substitute was used. Sword artwork is the exact approved A003 cutlass, rotated and uniformly resized. Joint extensions use local fur, cloth or leather colours.

## Known limitations / acceptance gaps

- **Exact same-scale anatomical agreement is approximate, not fully met.** The isolated limbs are slimmer than the reference, particularly the thighs and far gripping forearm. Near shin and tail placements were adjusted to connect in the static assemblies, so the stance, foot positions and tail curve differ from the reference. These are separate generated drawings, not a pixel-aligned dissection. Inspect `fit-check.png` before import.
- Heads share total silhouette width and upper placement, but snarl is taller and lowers the jaw; muzzle/ear proportions and whisker reach vary. Swapping needs anchor review. Hurt intentionally closes both eyes.
- Torso and near upper arm both contain shoulder-pad detail. The rough assemblies show the resulting duplicate pad and exposed rounded joint caps. Torso-back retains a visible belt buckle and pouch at the oblique side; it is a stylized rear-quarter view. A targeted edit removed its duplicated bandana tails.
- Near lower arm includes its original fist. `hand-front-grip` is a separate wrist/cuff overlay and is **not a clean wrist-only swap** on that fused drawing; the mockup shows the overlap. Far grip and pinch replace the complete far lower arm. The shaft passes behind the fingers; precise layer/attachment fit has not been tested in motion.
- Weapon assemblies are deliberately rough rigid-part placements. Exposed elbow caps, shoulder overlap, approximate wrist angles and forearm layering remain. They demonstrate size and grip intent, not finished animation.
- `bow.png` has an undrawn straight string as requested. The draw mockup adds a V-shaped string guide while the original straight string remains visible; it is a scale/pose study, not a finished drawn-bow asset.
- Mechanical green selection may lose fine whisker/antialias pixels and leave small green edge fringes. The export backgrounds are exact green; final production edge cleanup belongs to import.

No requested image is missing. Common canvas, files, neutral-head identity, spear ratio and unclipped bounds were checked, and review/fit/mockup images were visually inspected. No game code, runtime rig, animation or game-ready asset was changed. Only this source folder and A004's row in `docs/assets.md` changed.

## Human gate

Is this the rat you want to fight? Review `review.png` and the fit limitations above before authorizing import. Source delivery does not imply look approval.
