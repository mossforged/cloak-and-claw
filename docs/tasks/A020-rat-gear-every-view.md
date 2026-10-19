# A020 - Rat Raider: gear and masks for every view (Art)

**Read:** `docs/design/rigs/rat-raider.md` (Variety and gear), `docs/design/rigs/rat-raider-rehearsal.md` (Gear cost), `docs/design/rig-standard.md` 5b, `src/data/rigs/rat-raider-gear.js` (today's gear overlays and offsets), **`assets/source/A011-rat-raider-finishing/` (the approved gear designs and masks: hood, helmet, captain hat, jerkin, sash, quiver, face details, `gear-fitting.json`, `masks.json`)**, and the current body: `assets/source/A018-rat-parts/` (head, head-attack, head-effort, head-hurt, head-ko, head-back), `A022-rat-joint-repair/`, `A023-rat-complete-kit/` (every view drawing; match them exactly). **Needs:** nothing (A023 merged; the user approved the rat 2026-10-18). **Autonomy:** auto-ok up to the handoff; the user looks after Code imports. **Deliver to:** `assets/source/A020-rat-gear-every-view/` (LFS) + phone JPGs in `docs/screens/A020/`.

The rat now turns: seven torso drawings, four pelvis views, front, shout and drinking heads. Gear exists only for the three-quarter, side and back drawings, so a hooded or jerkined rat loses his gear the moment he turns. Same gear designs (the user approved them); new drawings for the new views. Same canvas per part, same palette and line weight.

## Round 1 correction (lead, 2026-10-19)
Your first run stopped correctly: the packet named A019 for the gear, which was wrong. **The approved gear is A011.** A011 was drawn on the old rat body (before the A017 master), so every A011 gear drawing is a design reference, not a part to reuse as is: **redraw each gear piece to fit the current body (A018/A022/A023 drawings) in every view it covers, the three-quarter, side and back included**, keeping A011's design, colours and details. The neutral, attack, effort, hurt and KO heads are in A018 (`head.png` is the neutral head); the back head in A022; front, shout and drink in A023. Masks: redraw for the current body's drawings (A011's masks are the old body's).

## Draw
1. **Jerkin** for all seven torso views: `torso`, `torso-side`, `torso-back`, `torso-front`, `torso-away`, `torso-hunched`, `torso-lean-back`.
2. **Sash** for the same seven torso views.
3. **Quiver** for each torso view where it shows (at least Q, side, back, away); hidden where the body covers it, listed in the handoff.
4. **Hood, helmet, captain hat** for the neutral head, `head-back`, `head-hurt`, `head-front` and `head-drink` (tipped back). Check `head-shout`, `head-attack`, `head-effort`, `head-ko` with the neutral head's gear; draw a variant only where it doesn't fit.
5. **Face details** (eyepatch, scar, ear notch, earring) for `head-front` and `head-drink`; one-sided details stay on the camera side.
6. **Recolour masks** (fur, cloth, trim, leather; max four per part, A011's `masks.json` format) for every current body drawing (A018, A022, A023) and every new gear drawing.

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
