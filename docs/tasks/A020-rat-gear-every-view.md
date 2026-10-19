# A020 - Rat Raider: gear and masks for every view (Art)

**Read:** `docs/design/rigs/rat-raider.md` (Variety and gear), `docs/design/rigs/rat-raider-rehearsal.md` (Gear cost), `docs/design/rig-standard.md` 5b, `src/data/rigs/rat-raider-gear.js` (today's gear overlays and offsets), `assets/source/A019-rat-key-drawings/` (current torso gear and masks), `assets/source/A023-rat-complete-kit/` (every view drawing; match them exactly). **Needs:** nothing (A023 merged; the user approved the rat 2026-10-18). **Autonomy:** auto-ok up to the handoff; the user looks after Code imports. **Deliver to:** `assets/source/A020-rat-gear-every-view/` (LFS) + phone JPGs in `docs/screens/A020/`.

The rat now turns: seven torso drawings, four pelvis views, front, shout and drinking heads. Gear exists only for the three-quarter, side and back drawings, so a hooded or jerkined rat loses his gear the moment he turns. Same gear designs (the user approved them); new drawings for the new views. Same canvas per part, same palette and line weight.

## Draw
1. **Jerkin** for `torso-front`, `torso-away`, `torso-hunched`, `torso-lean-back` (Q, side and back exist: check they still fit the A023 r5 torsos and redraw any that don't).
2. **Sash** for the same four torso views.
3. **Quiver** for each torso view where it shows (at least Q, side, back, away); hidden where the body covers it, listed in the handoff.
4. **Hood, helmet, captain hat** for `head-front` and `head-drink` (tipped back). Check `head-shout`, `head-attack`, `head-effort`, `head-ko` with today's neutral gear; draw a variant only where the neutral one doesn't fit.
5. **Face details** (eyepatch, scar, ear notch, earring) for `head-front` and `head-drink`; one-sided details stay on the camera side.
6. **Recolour masks** (fur, cloth, trim, leather; max four per part, as A019) for every A023 drawing and every new gear drawing.

## Self-check before delivering
- `fit.png`: every gear piece on every view it covers, assembled from the parts and anchors, at full size and at 136 px; one row per gear piece.
- Gear covers its body drawing exactly: no body paint peeking past a hem, no gear floating off the edge; edges that can show are outlined.
- Masks: a test tint per mask on three views so each region visibly changes alone.

## Deliver
The PNGs, a `rig-source.json` fragment (gear name, the drawing it rides, offset, band, masks), `fit.png`, `prompt.md`, `HANDOFF.md`; phone JPGs (quality ~80, long side <= 2000 px) in `docs/screens/A020/`.

## Acceptance
- Every gear piece reads as the same gear in every view; nothing pops on or off when he turns.
- Human (after Code imports): a hooded, jerkined captain turning into a slash keeps his gear.

Out of scope: code, weapons, new gear designs.
