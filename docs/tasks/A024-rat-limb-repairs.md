# A024 - Rat Raider: limb end repairs from the posed moves (Art)

**Read:** `docs/screens/T029/r3-exposure-list.md`, `docs/screens/T029/r2-art-only.md`, `docs/screens/T029/r3-wrist-sheet.jpg`, `docs/design/rig-standard.md` 5b, `assets/source/A023-rat-complete-kit/` (current drawings and pivots). **Needs:** nothing (T029 merged 2026-10-19). **Autonomy:** auto-ok up to the handoff. **Deliver to:** `assets/source/A024-rat-limb-repairs/` (LFS) + phone JPGs in `docs/screens/A024/`.

T029 posed every moving and attacking move and added wrist limits. What's left are a few limb ends that show in motion. Same canvas, pivots, visible paint and outline: change only the hidden ends and the cut edges named. **Don't touch torso or pelvis drawings** (the gear swaps in A020 were drawn on them; those repairs come later).

## Repair
1. **`hand-near-grip-overhand` wrist end** (Code, T029 r3: "a visible gap below the forearm's cuff at its as-drawn angle", `r3-wrist-sheet.jpg` row 2): extend the hidden wrist end up under the bracer so the hand stays joined across -45..+45 deg from its natural angle. Check the other grip hands on the same sheet (-45..+45) and fix any that open.
2. **Raised near arm's shoulder end** (`arm-near-raised`, and `arm-near-upper` when lifted past the torso: rally 152 px², cast 125, overhead chop 204): a rounded, finished shoulder end painted as fur and sleeve where the vest edge doesn't cover it. Same for `arm-far-upper` lifted (staff overhead 35.5).
3. **Upper arm tops for the back view** (dodge roll 29.8): finished for when the arm draws behind the back torso.
4. **`scarf-tail` root** (spin 158, roll 24): a shorter root or one painted as cloth, so it reads finished when the scarf swings.
5. **`foot-far` top** (knockdown 54.5): narrower than the shin hem so it stays under it when the leg folds.
6. **Straight cut edges** on `leg-far-upper`, `arm-near-upper`, `arm-far-upper`, `foot-far`, `scarf-tail`, `arm-far-lower` (4-7 game px): outline or round them.

## Self-check
- The A022/A023 paint check: rest assembly vs the master, colour for colour (visible paint unchanged).
- `wrists.jpg`: each grip hand turned -45, 0, +45 on its forearm, assembled, no gap at the cuff.
- Before/after crops of each repaired end.

## Deliver
The repaired PNGs (same names), a `rig-source.json` fragment if any pivot moves (it shouldn't), the self-check images, `HANDOFF.md`; phone JPGs in `docs/screens/A024/`.
