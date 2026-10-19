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
