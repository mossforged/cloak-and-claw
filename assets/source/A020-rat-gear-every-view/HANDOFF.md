# A020 — blocked: approved gear source reference missing

No drawings were made. No existing art, code, or manifests were changed. This is a blocker report, not an art delivery; A020 must remain requested.

## Input checks

- Workspace confirmed: `/Users/johniadarola/Projects/cloak-and-claw-art`.
- Runner-started session: no checkout, pull, branch creation, commit, or push performed. Files are left for the runner.
- Git LFS available: 3.8.0.
- Read STATUS, A020, the required contracts, and the packet's named rig references and source manifests.
- A020 names `assets/source/A019-rat-key-drawings/` as the source of current torso gear and masks. That directory contains limb drawings, two replacement body parts, reviews and text; no gear PNGs or masks. Its HANDOFF explicitly states: “Gear, masks, weapons and game/runtime changes remain outside A019.” Its manifest contains parts and swaps, but no approved gear overlays or masks.
- The named `src/data/rigs/rat-raider-gear.js` supplies runtime gear mappings and offsets. Its header says those mappings were generated from `assets/source/A011-rat-raider-finishing/rig-source.json`; this older source directory is not among A020's permitted references. No files there were inspected.

## Why stopped

A020 requires the same approved designs, matching palette and line weight, and expressly excludes new gear designs. The user also restricts reads to the packet's named files. Without an authorized approved gear image source, generating gear would invent visual information rather than extend the existing art. Per the unattended instruction, a question requiring the user is recorded here and work stops.

## Self-check results

Input validation failed on the approved gear/mask source reference. Fit, silhouette coverage, mask isolation, 136 px readability and motion continuity checks were not run because no assets were drawn. No fit/review images, phone JPGs, masks, or rig-source fragment are delivered. No image-tool call was made because no drawing was attempted.

## Question requiring the user or packet author

Which directory contains the approved gear drawings and masks that A020 must preserve, and may Art read it? Please correct or authorize that source reference (the runtime file names A011, while the packet names A019). The neutral attack/effort/KO head images needed for the fit check also are not present in A019 or A023; please name their approved source directory in the corrected packet.

## Remaining work

All requested drawing work remains: jerkin/sash for seven torso views as needed, visible quiver views, front/drink head gear and face details, expression fit variants where required, all A023/new-gear material masks, source registration fragment, fit/tint reviews, exact prompts, and phone JPGs. Resume after the reference correction; retain approved designs and native canvases.
