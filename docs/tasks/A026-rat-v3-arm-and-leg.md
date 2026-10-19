# A026 - Rat v3, round 1: the near arm and near leg, each piece drawn on its own (Art)

**Read:** `docs/design/rigs/rat-v3-plan.md` (why, and the drawing rules), `docs/design/rigs/rat-v3-skeleton.json` (the user's skeleton, in master.png pixels) and `docs/screens/rat-v3-skeleton.jpg`, `assets/source/A017-rat-setup-master/master.png` (the approved rat: look, colours, costume), `docs/design/rig-standard.md` 5b (covers), `assets/source/A025-near-shoulder/` (the shoulder pad on the arm: the approach that worked). **Needs:** nothing. **Autonomy:** auto-ok up to the handoff; the user checks it in the Fitting Room. **Deliver to:** `assets/source/A026-rat-v3-arm-leg/` (LFS) + phone JPGs in `docs/screens/A026/`.

The user decided to redraw the rat (2026-10-19): "the body parts need to be drawn individually, to have smooth edges, and the right joint/limb endings". Every lesson so far came from parts cut out of one painting; this round proves the new way on two limbs before the whole body.

## The skeleton is the law
The user tapped each joint once on master.png (`rat-v3-skeleton.json`). Each piece turns on those points and nothing else. **One point per joint**: the child's pivot and the parent's attach are the same skeleton point, so limb lengths can't drift.

## Draw (six pieces)
| Piece | From | To | Notes |
|---|---|---|---|
| `arm-near-upper` | shoulder-near | elbow-near | includes the shoulder pad and the round of the shoulder (it draws over the torso, as A025) |
| `arm-near-lower` | elbow-near | wrist-near | the forearm with its bracer |
| `hand-near` | wrist-near | hand-near-tip | the closed fist as the master shows it |
| `leg-near-upper` | hip-near | knee-near | the trouser thigh |
| `leg-near-lower` | knee-near | ankle-near | the shin with the boot wrap |
| `foot-near` | ankle-near | toe-near | the foot |

Rules for every piece:
1. **Drawn on its own canvas** (1536 x 2304, #00FF00, the master's scale), sitting exactly where the master shows it, so all six assembled at rest look like the master (same silhouette, colours, line weight). Painted whole and clean: outline all round, smooth edges, no cut lines, nothing borrowed from a neighbour.
2. **Round joint ends centred on the skeleton point.** At each joint, the end that tucks under the neighbouring piece is a round cap whose centre is the joint point (radius about the limb's half-width there), painted as finished fur, cloth or leather. Turned anywhere in the user's range it looks the same and never shows a gap.
3. **Covers:** forearm over the upper arm at the elbow; bracer over the hand at the wrist; trouser hem (thigh) over the shin at the knee; boot wrap (shin) over the foot top at the ankle; the shoulder pad (arm) over the torso; the hip under the seat / trousers. The covering piece's edge is outlined and finished; the covered end is the round cap.
4. Same look as the master: this rat, these colours and costume; no redesign.

## Self-check before delivering
- `rest.jpg`: the six pieces over the current torso and pelvis at rest, beside master.png (they should match).
- `sweep-<joint>.jpg` for the six joints: the piece below the joint turned through the user's limits (`limits_deg`: shoulder -61..59, elbow -73..5, wrist -42..17, hip -23..25, knee -23..51, ankle -19..40) in 5 steps, full size and 136 px. No gap, no unfinished paint, the cover always on top.
- Style check: the six pieces side by side with the master crop each came from.

## Deliver
The six PNGs, `rig-source.json` (each piece: canvas, pivot = its skeleton point, parent, draw order per the covers), the self-check images, `prompt.md`, `HANDOFF.md`; phone JPGs in `docs/screens/A026/`.

## Round 2 (lead, 2026-10-19): right size, no tube ends
Round 1 (`a026-rat-v3-arm-leg`, 11d033e) proved the method half-way: each piece is clean and whole, the style broadly matches, and the elbow sweep holds together through the full range (forearm over upper arm, no gap). Two things failed, both fixable:
1. **Size and shape drifted.** Drawn from scratch, the pieces came out smaller and narrower than the master (small shoulder pad and fist, thin thigh), so the rest assembly doesn't match. **Start each piece from the master's own region** (cut along the outline, not across the limb), then extend and repaint only what the master hides: the round end that tucks under the neighbour, and any edge that was touching another part. At rest the six pieces must cover the master's own limb silhouette (silhouette overlap 95% or better per piece; report the number).
2. **Tube ends.** The hidden ends were drawn as cut cylinders with a visible end face and rim (elbow, cuff tops, hip top, the shin's pink cap). A tucked end is a **dome**: fur or cloth that rounds off, shaded darker as it goes under, with no flat face, rim or cuff edge. It is never seen at rest and only its curve shows in a bend.
3. **Body context:** use the A025 torso (now on main, `assets/source/A025-near-shoulder/`) for the shoulder sweep, and the current pelvis + seat for the hip; no torso cut-out holes in the review sheets.
Same skeleton, limits, covers and self-checks as round 1; add the silhouette numbers to `rest.jpg`.

## Round 3 (lead, 2026-10-19): the cover moves with the part it wraps; the user's new joint points
Round 2 (`a026-rat-v3-arm-leg`, 9eb47f3) is a real improvement: the master paint is kept, the sizes match, and the user bent all six in the Fitting Room and opened most ranges well past the old limits. Do the following on top of round 2's pieces (don't start over):
1. **The wrap belongs to the piece it wraps** (the user's call, same rule as the shoulder pad on the arm). Two covers are on the wrong piece today:
   - **Wrist:** the bracer's bottom cuff (the band at the wrist) is painted on the forearm, over the hand, so the hand slides out from under it when it bends. Move that cuff onto **hand-near**; the hand now draws **over** the forearm's lower end. The forearm's lower end becomes a plain dome (leather or fur, no rim) that tucks inside the cuff, centred on the wrist point.
   - **Ankle:** the boot wrap at the ankle is painted on the shin, over the foot, so the heel and strap poke out at positive turns. Move the wrap that hugs the ankle and foot onto **foot-near**; the foot now draws **over** the shin's lower end, which becomes a plain dome tucked inside the wrap, centred on the ankle point.
   - At rest, the hand and foot must still look exactly like the master (the cuff and the wrap in the same place); only which piece owns them changes.
2. **The user's joint points (new pivots):** `docs/design/rigs/rat-v3-joints-r2.json` (master px): shoulder 573.4, 1087.6; elbow 489.4, 1303.6 (about 50 px lower than the skeleton); wrist 411.2, 1427.6; hip 640.4, 1476.6; knee 633.2, 1661; ankle 571.2, 1799. Each hidden dome is centred on its new point.
3. **New ranges for the sweeps:** shoulder −116..76, elbow −101..5, wrist −49..9, hip −23..34, knee −23..70, ankle −19..40.
4. **Knee:** the shin's hidden top is a dome centred on the knee point that stays under the trouser hem through −23..70 (round 2 stops short of the point).
5. **Clean-up:** remove the stray cut and registration edges (shoulder pad top and inner edge, thigh top, hem), and the doubled contours at the wrist cuff and ankle strap.
6. Covers now: arm over torso; forearm over upper arm; **hand over forearm**; seat over thigh; thigh over shin; **foot over shin**.

Same self-checks, but put the new limits and points in `sweep-*.jpg`, and in `rest.jpg` report the visible silhouette of the six assembled against the master's limb region (not only retained pixels). `importReady: true` when rest matches and no sweep shows a gap, tube face or doubled outline.
