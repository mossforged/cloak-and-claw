# A025 - Rat Raider: the near shoulder rides the arm (Art)

**Read:** `docs/design/rig-standard.md` 5b, `docs/design/rigs/joint-points-rat.json` (the user's joint points, 2026-10-19), `assets/source/A023-rat-complete-kit/` (torso views, `shoulder-near` cap), `assets/source/A024-rat-limb-repairs/` (current arm ends), `assets/source/A020-rat-gear-every-view/` (jerkin torso swaps). **Needs:** nothing. **Autonomy:** auto-ok up to the handoff; the user checks it in the Fitting Room. **Deliver to:** `assets/source/A025-near-shoulder/` (LFS) + phone JPGs in `docs/screens/A025/`.

The user set the rat's joints by hand in the Fitting Room (tap the matching point on each piece, lock, bend). His finding at the shoulder: "you don't want to have the arm totally over the torso necessarily, but you can't have it totally behind it because then as you rotate through, it's not just behind the shoulder pad, it's behind the chest, which doesn't make sense ... either have to have a separate shoulder cover that goes over the shoulder joint, or it has to be a part of the arm, rather than a part of the torso." He also saw "jagged parts coming off the shoulder" on the chest piece.

Pro rigs do the second: the shoulder (pauldron, sleeve top) belongs to the arm and draws over the chest; the chest under it is finished. So:
1. **`arm-near-upper`** (and every near whole-arm key: `arm-near-cocked`, `arm-near-raised`, `arm-near-mouth`, `arm-near-smear-h`, `arm-near-smear-o`): the shoulder pad and the round of the shoulder become part of the arm's top, drawn over the torso. Its top end is a finished, outlined shape (the pad's rim), turning on the user's shoulder point (`joint-points-rat.json`, `shoulder-near.pivot` on the arm, `.attach` on the torso).
2. **`torso`** (three-quarter) and the jerkin torso swap `torso-jerkin`: remove the near shoulder pad and the jagged edge where the arm was cut away; paint the chest and vest edge that the arm's top now covers as finished cloth / fur, far enough that it stays good with the arm swung the user's full range (-61 to +59 degrees from rest).
3. The `shoulder-near` cap becomes unnecessary in the three-quarter view; say whether it should go for the other views too.
4. Same canvases; keep every other pivot. Visible paint at rest stays as the master shows it (the pad just moves from the torso drawing to the arm drawing).

## Self-check
- `shoulder-sweep.jpg`: torso + arm assembled on the user's points, the arm at -61, -30, 0, +30, +59 degrees, full size and 136 px; no gap, no jagged edge, the pad always over the chest.
- Rest assembly vs the master (paint check).

## Deliver
The PNGs (same names), a `rig-source.json` fragment if order or pivots change (the arm now draws over the torso in Q), `HANDOFF.md`, phone JPGs.
