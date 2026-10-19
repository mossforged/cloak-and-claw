# A026 Round 2 — master-region edits, source delivery

Branch: `a026-rat-v3-arm-leg`. **Best attempt, not ready to import; the 95% silhouette gate is not certified.** Six replacement PNGs, exact v3 skeleton manifest, reference, rest/style/review sheets, six sweeps, measurements and prompts are saved. Phone copies are in `docs/screens/A026/`.

## Setup

Folder check passed; git-lfs 3.8.0 available. Contrary to the runner preamble, HEAD initially lacked both the Round 2 packet and A025. Local main (`c6f7416`) contained them, so main was merged into this branch without switching branches or pulling. The only conflict was docs/assets.md; both A025 and A026 rows were retained. No push performed.

## Construction and silhouette checks

Each piece starts with a manually traced region of A017 master.png. Image-tool edits completed hidden ends and adjacent boundaries. Detached neighbor scraps and identifiable tail/skin/belly remnants were removed from retained masks. Generated outputs enlarged/recentered the regions despite framing instructions; they were uniformly registered back by width, with top or bottom alignment, then the retained master pixels were restored exactly. No stretching, code-painted anatomy or runtime workaround.

**The retained-region coverage is 100% by construction; it is not an independent segmentation or proof that the full rest silhouette matches.** Whole-part IoU below includes the hidden extensions and any extra exposed paint. These two numbers are deliberately reported separately. The trace polygons and registrations are in self-check.json. A clean 95% assembled visible silhouette result has not been established.

| Piece | Retained master-region coverage | Whole-part silhouette IoU | Remaining visual issue |
| --- | ---: | ---: | --- |
| arm-near-upper | 100.0% | 82.036% | Pad/fur size retained; fur elbow dome replaces tube face. Shoulder top/inner pad outline still has registration and cut-edge artifacts; cap circularity/center not certified. |
| arm-near-lower | 100.0% | 70.970% | Original wraps retained, closed leather top. Generated lower wrap produces doubled edge/stitch contours near wrist; small edge remnants remain. |
| hand-near | 100.0% | 88.616% | Original closed fist preserved; solid domed wrist, no flat end face. Dome can protrude beside the bracer in wrist bends. |
| leg-near-upper | 100.0% | 88.650% | Original patch and hem preserved; rounded cloth hip top. Top registration and hem outline show seams; existing seat carries another patch over this one in assembly. |
| leg-near-lower | 100.0% | 88.078% | Master boot wrap/pink region retained. Hidden tool dome came back leather; pink-to-leather boundary and exact knee-centered dome remain unresolved. |
| foot-near | 100.0% | 72.795% | Original toes, claws and heel preserved; solid ankle dome without tube face. Foot ankle/heel protrudes beyond shin wrap at positive turns; doubled leather contours. |

The image service rejected the first shin request with a content-filter response. A clearer cartoon boot-component request succeeded. Both exact prompts are in prompt.md. No raw generated outputs or discarded variants are delivered.

## Rest and style

rest.jpg uses the **actual A025 torso**, actual current A023 pelvis and seat, and A018 head/far limbs/tail, all at their shared source-canvas positions. No erased-master holes. The v3 pivot points stay exactly as the user's skeleton; legacy A025 independent shoulder pivot/attach overrides were not applied.

The limb widths, fist and trouser patch now retain the master paint rather than Round 1's narrow redraws. Rest is still a visual FAIL: extra edge/overlap lines, doubled seat/thigh patch, and the legacy torso's fuller belly differ from master. The rear red scarf is absent from the separately assembled context. Those context differences are not painted into the delivered limbs. Warm palette, upper-left light and dark outline broadly match, but cleanup/outline consistency remains partial. review.png shows all six beside their original regions plus a 130px assembly over Harbor Market; reference.png is the green-background assembly.

## Six sweeps

Five evenly spaced samples each; positive clockwise. Each source sheet contains 1:1 master-pixel joint detail and ~136px whole-character previews. Complete downstream chains rotate about exact v3 points. Cover bands: forearm over upper arm and hand, thigh over shin, shin over foot, seat over thigh, shoulder pad over torso. Head remains above shoulder. Overlap values are alpha intersections, **not a gap/finish certification**; continuous motion and runtime were not tested.

| Joint | Angles (degrees) | Alpha overlap (source px²) | Visual result |
| --- | --- | --- | --- |
| Shoulder | -61, -31, -1, 29, 59 | 59,057; 55,731; 41,911; 33,439; 25,377 | Connected to actual A025 torso at every sample. Pad-top/inner-edge fragments and protruding upper-arm paint at extremes: PARTIAL/FAIL visual gate. |
| Elbow | -73, -53.5, -34, -14.5, 5 | 10,989; 10,331; 9,774; 9,420; 8,340 | Forearm above upper arm; rounded fur end, no previous leather tube face. Connected, but overlap/edge finish still visible: PARTIAL. |
| Wrist | -42, -27.25, -12.5, 2.25, 17 | 9,953; 9,028; 8,767; 8,476; 7,914 | Bracer above hand at all five. No open face; doubled cuff contours and wrist-side bulge: FAIL finish. |
| Hip | -23, -11, 1, 13, 25 | 37,220; 33,833; 30,434; 26,573; 23,165 | Actual seat covers top at all five. Legacy seat/thigh patch overlap and exposed side/outline artifacts: FAIL visual match. |
| Knee | -23, -4.5, 14, 32.5, 51 | 3,110; 2,656; 3,588; 5,428; 7,376 | Thigh above shin; all samples intersect. Dome is not established at exact knee center; leather/pink transition and hem edges remain visible: FAIL clean construction. |
| Ankle | -19, -4.25, 10.5, 25.25, 40 | 15,073; 16,640; 16,795; 15,848; 15,224 | Shin above foot, connected. Closed ankle dome is covered, but heel/strap protrusion and double contour grow at positive extremes: FAIL finish. |

## Left for the next pass

Clean exposed cut/registration edges and the doubled wrist/ankle contours; reconstruct a true knee-centered hidden shin dome; reconcile the legacy seat/body context with the retained master limb paint; then measure the assembled visible silhouette with independently reviewed region masks. Do not treat the 100% retained-pixel coverage as a passed 95% silhouette review. No user-only design question: the existing design, skeleton and cover decisions are clear. `importReady` remains false.
