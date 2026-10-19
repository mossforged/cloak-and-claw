# A026 — rat v3 near arm and leg, round 1

Branch: `a026-rat-v3-arm-leg`. Six pieces drawn individually with the built-in image tool, using A017 master.png as the reference for every call. Source delivery, **not ready to import**. No runtime or game-art files changed.

## Pieces

| File | Result and remaining flaw |
| --- | --- |
| arm-near-upper.png | Shoulder pad travels with arm; stitched orange leather, silver top, gold rivets and cream/brown fur retained. Too slender/small at the shoulder; tool added a visible leather elbow end face. |
| arm-near-lower.png | Separate outlined leather bracer/forearm. More cylindrical and longer-looking than master; distal cuff reads as an open/end face. |
| hand-near.png | Closed solid fist, pink fingers and stitched leather back. Smaller than master; tool added an overly long glove cuff and visible pink end face. |
| leg-near-upper.png | Olive trousers and orange/lavender stitched patches. Too narrow; rounded hip top remains visibly separate rather than hidden beneath the seat. |
| leg-near-lower.png | Finished pink upper shin and leather boot wrap. Taller boot wrap and more exposed pink upper shin than the master. |
| foot-near.png | Right-facing pink toes, three dark claws, orange leather strap and heel. Closest silhouette/material match; raised ankle cuff/end face protrudes when turned. |

All six are 1536×2304 RGB PNGs with flat #00FF00 background. The image tool ignored requested absolute scale/placement; each output was registered with a uniform similarity transform, never stretched. Exact transform measurements and source landmarks are in rig-source.json. Numeric pivots and distal attach points equal the user's skeleton values. **The visual landmarks were measured by eye: exact numeric pivots do not establish exact anatomical cap centres or circularity.** No circles, patches or anatomy were synthesized in code.

## Self-check results

**Rest match: FAIL.** rest.jpg shows the assembly beside the approved master. Shoulder/upper arm, fist and thigh are visibly narrower; the limb materials and cuff construction differ. This is a redraw trial, not a paint-for-paint or silhouette match.

**Body-context limitation:** the packet's A025-near-shoulder directory is absent. No separate current torso, pelvis or seat PNG is named in the allowed inputs. Review context therefore comes from A017 master.png with the old near limbs masked away for review only. The resulting grey voids and truncated scarf/tail are context-mask artifacts, not part of any delivered limb. Shoulder/hip parent coverage and rest compositing against the actual current torso/pelvis could not be certified. These sheets must not be treated as a parent seam test.

Each sweep has five evenly spaced samples, rotating the whole downstream chain around the exact pivot; positive is clockwise on screen. Upper source sheets contain 1:1 master-pixel joint crops, plus whole-character 136 px previews. Phone copies are downscaled copies of those sheets, so their small previews are reduced with the sheet. Rest at 0° is shown separately.

| Joint | Five sampled angles (degrees) | Result |
| --- | --- | --- |
| Shoulder | -61, -31, -1, 29, 59 | UNVERIFIED/FAIL gate: arm and pad rotate together, but context is incomplete and shoulder pad is undersized; no claim of torso coverage. |
| Elbow | -73, -53.5, -34, -14.5, 5 | Connectivity holds at all five; overlap 3,681–4,911 source px². Forearm remains above upper arm. FAIL visual finish: upper-arm leather end face shows around the joint. |
| Wrist | -42, -27.25, -12.5, 2.25, 17 | Connectivity holds at all five; overlap 1,911–2,566 source px². Bracer stays above hand. FAIL cover finish: pink/glove cuff face and double-cuff construction remain visible. |
| Hip | -23, -11, 1, 13, 25 | UNVERIFIED/FAIL gate: no actual seat cover in the permitted input set; exposed outlined hip top and narrow thigh. |
| Knee | -23, -4.5, 14, 32.5, 51 | Connectivity holds at all five; overlap 7,104–8,315 source px². Thigh stays above shin per A026. No obvious separation between the two parts at these samples, but the pink cap bulges and silhouette differs from master; not a clean visual pass. |
| Ankle | -19, -4.25, 10.5, 25.25, 40 | Connectivity holds at all five; overlap 5,775–6,140 source px². Shin stays above foot. FAIL cover finish: foot cuff protrudes past shin wrap at positive extremes. |

Overlap counts in self-check.json are only alpha-intersection/connectivity evidence; they do not prove no gap elsewhere, acceptable outline, or continuously safe motion between samples. There is no continuous-range or runtime test.

**Style: PARTIAL.** All six retain the warm painted cartoon, dark outlines, upper-left highlights and the rat's brown/cream/pink/orange/olive palette. No ground shadow, items or neighboring body parts in the source PNGs. Materials and patch colors are recognizable. Proportions, fine line weight after registration, extra cuff faces and less faithful patch construction keep this from matching the approved master closely enough.

## Files and handoff

Six PNGs; rig-source.json with exact skeleton points, external parents, registrations and cover bands; rest.jpg; sweep-shoulder/elbow/wrist/hip/knee/ankle.jpg; style.jpg; review.png plus review.jpg with a 130 px assembly over Harbor Market; self-check.json; prompt.md; HANDOFF.md. Phone JPGs in docs/screens/A026/. Raw tool outputs and discarded variants are not included. Asset row set to source.

The packet explicitly permits a best attempt when the tool cannot meet a rule. This delivery uses that allowance: **do not mark the round passed or import it as a locked rig.** It demonstrates recognizable independent pieces but does not solve the centered round-end construction and master proportions.

For the lead: provide the actual current torso/pelvis/seat filenames and restore the missing A025 reference before the next parent-coverage check. No user-only design question is needed; the existing skeleton/design decision is clear.
