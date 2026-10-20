# A027 - Rat v3, round 2: the rest of the three-quarter body (Art)

**Read:** `docs/design/rigs/rat-v3-plan.md` (drawing rules), `docs/design/rigs/rat-v3-skeleton.json` (the user's skeleton, master.png px), `docs/design/rigs/rat-v3-joints-r2.json` (his fitted near-side points and ranges, incl. `round3_note`), `assets/source/A026-rat-v3-arm-leg/` (the six accepted pieces and their HANDOFF: the method that worked), `assets/source/A017-rat-setup-master/master.png` (the look). **Needs:** A026 (merged). **Autonomy:** auto-ok up to the handoff; the user checks it in the Fitting Room. **Deliver to:** `assets/source/A027-rat-v3-body/` (LFS) + phone JPGs in `docs/screens/A027/`.

The user bent all six A026 pieces in the Fitting Room after round 3 and saved every joint with no gaps flagged (2026-10-20). The method is proven: **start from the master's own region, extend and repaint only what the master hides, domed hidden ends centred on the joint point, and a wrap belongs to the piece it wraps.** Now the parts those limbs hang from, three-quarter view only.

## Draw (same method as A026 round 3)
| Piece | Turns on | Covers / covered by |
|---|---|---|
| `torso` (chest, jerkin-less body, front scarf knot) | waist | under the near arm (shoulder pad is on the arm), under the head at the neck; finished paint under the shoulder pad |
| `pelvis` (hips, trousers top) | root | under the torso at the waist; finished paint under the thigh tops |
| `seat` (trouser seat over the near thigh top) | rides the pelvis | over the near thigh's hidden top (the hip cover) |
| `belt` (belt, buckle, pouch) | rides the pelvis | over the waist seam between torso and pelvis |
| `head` (neutral) | neck | over the torso's neck end; the torso's neck is a dome under it |
| `scarf-tail` (the red scarf at the back) | rides the torso | behind the torso and near arm |
| `arm-far-upper`, `arm-far-lower`, `hand-far` | far shoulder, elbow-far, wrist-far | as the near arm (cuff on the hand), behind the torso |
| `leg-far-upper`, `leg-far-lower`, `foot-far` | hip-far, knee-far, ankle-far | as the near leg (wrap on the foot), behind the pelvis |
| `tail-1..3` | tail points (see below) | behind the pelvis and near leg |

1. **Points:** the skeleton's `neck`, `waist`, far-side and near-side points; the near side as fitted in `rat-v3-joints-r2.json`. Two points the user skipped: **shoulder-far** and the **tail** joints. Propose them (mark them on `points.jpg`); the user moves them in the Fitting Room if needed.
2. **The near arm fit:** on the old A025 torso the user slid the arm about 36 px left and 22 px up (`round3_note`). The new torso's shoulder must fit the arm **at its master position** so no slide is needed: the shoulder pad covers the torso edge at every angle in −116..76.
3. **Far limbs** are drawn (not near pieces flipped): the master shows them at their own angles and in shadow. Same domes and wrap rules.
4. **A026 clean-up** while you're in there: the leftover cut and registration edges at the inner elbow, the top and inner edge of the shoulder pad, the thigh top and hem (A026 round 3 HANDOFF list). Replace the A026 PNGs in place on this branch only if their rest silhouette and points are unchanged.
5. Same look: this rat, these colours, line weight and light. No redesign.

## Self-check before delivering
- `rest.jpg`: **every** piece (A026's six + these) assembled at rest beside master.png, with the visible-silhouette IoU per piece and the whole rat. No stand-in parts from A018/A023/A025 anywhere.
- `sweep-<joint>.jpg` for neck, waist, shoulder-near (on the new torso), hip-near (under the new seat), the far shoulder, elbow, wrist, hip, knee, ankle, and the tail joints: five samples through the range (near side: `rat-v3-joints-r2.json`; far side: the same ranges as the near side to start; neck −20..20, waist −15..15, tail −40..40), 1:1 detail and 136 px.
- `points.jpg`: every point on the master, the two proposed ones marked.

## Deliver
The PNGs (canvas 1536 x 2304, #00FF00, master scale, sitting where the master shows them), `rig-source.json` (all 21+ pieces: parent, pivot = skeleton point, draw order per the covers, the proposed points flagged), the self-check images, `prompt.md`, `HANDOFF.md`; phone JPGs in `docs/screens/A027/`. `importReady: true` when rest matches the master (whole-rat visible IoU >= 95%) and no sweep shows a gap, tube face or doubled outline.

Out of scope: other views, other heads and hand drawings, gear, code.

## Round 2 (lead, 2026-10-20): clean-up on the user's fitted joints
Round 1 (`a027-rat-v3-body`, 9779df4) is accepted in shape: the whole rat from new pieces matches the master at rest (97.8%), no stand-ins, and the user fitted all 17 joints in Fitting Room v4 with no gaps flagged. **His fit is now the law:** `docs/design/rigs/rat-v3-joints-v4.json` (pivots in master px and ranges). Changes from your round 1 to build around:
- **Near shoulder turns at (595.8, 1203.2)**, about 115 px below the old skeleton point (the user confirmed it). Rebuild the torso's hidden shoulder area and the arm's hidden top dome around that point so −116..67 shows no notch and no torso edge.
- Far elbow at (1015.4, 1317.8), range **0..124**; far wrist range **0..59**.
- Neck range −20..**61**; near knee −23..**87**; waist −4..15; near ankle −1..40; tail tip −3..7; the far shoulder and tail points you proposed are accepted as they are.

Fix (all your own round 1 list):
1. **Neck:** the back of the neck breaks into jagged fragments at +10..+20; with the range now up to +61 the head's hidden neck needs a full dome under the torso's collar and scarf, no fragments, no grey.
2. **Near shoulder notch** at positive turns (see above).
3. **Far limbs:** the paint bars and mismatched exposure in the far arm and leg sweeps; the far forearm's hidden top and the far shin are the worst (50% and 43% IoU).
4. **Tail joins:** the outlines across the joins and the stray scrap; each tail piece's hidden end a dome under the piece above it.
5. Seat, neck and hem registration edges; the pelvis and torso extras/missing areas at rest (72% and 83% IoU).

Same self-checks with the v4 ranges and points; `importReady: true` when rest stays >= 95% and no sweep shows a gap, fragment, tube face or doubled outline.
