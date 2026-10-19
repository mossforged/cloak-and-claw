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

## Round 2 (lead, 2026-10-19): dress the part, don't draw gear separately
Round 1 (`a020-rat-gear-every-view`, 49eb7ce) was an honest best attempt and the report is right: gear drawn as separate pieces doesn't land on the body (belly fur under the jerkin hem, ear holes beside the ears, an oversized eyepatch), and masks picked by the image tool select the wrong materials. Change the method, keep the designs:
1. **Dress the drawing itself.** For each body drawing a gear piece covers, edit **that drawing** with the image tool so the rat is wearing the A011 gear in it (same canvas, same pose, same pivot, the gear following that drawing's own shape and perspective: hood over these ears, jerkin over this belly). Then **the overlay is the difference**: every pixel of the dressed drawing that differs from the undressed one, plus the dressed silhouette where the gear sticks out past the body. Keep the overlay one connected, outlined piece. It fits by construction; check it by compositing overlay over body against the dressed drawing (must match within JPEG noise).
2. **Ear holes and face details** come out of step 1 too (the hood drawn round these ears; the eyepatch drawn on the camera-side eye at the right size). Ear notch: draw it as a notched ear swap of each head (`head-*-notch`) rather than a painted rim, if the overlay can't remove the ear tip.
3. **Masks by colour, not by the image tool.** For each drawing, pick the material regions from its own palette: sample each material (fur, cloth, trim, leather) on the master by hand, then select by colour distance with a small tolerance, cleaned (fill holes, drop specks under 20 px), and hand-fix what's left. The tint sheet must show each material changing alone on every view; list any drawing you couldn't separate.
4. Do the jerkin and the hood across all their views first and prove the method on them (`fit-jerkin.jpg`, `fit-hood.jpg`, both full-size cells and 136 px); then the rest.
Deliver on the same branch with a new HANDOFF section; `importReady: true` only when the fit and tint checks pass.

## Round 3 (lead, 2026-10-19): keep the dressed drawings as whole swaps
Round 2's dressed drawings are good (lead, `round2-gear-hood.jpg`, `round2-gear-jerkin-front.jpg`): the hood sits round these ears, the jerkin follows this belly, same pose and palette. The overlay failed only because the gear **removes** body pixels (fur tufts and whiskers past the hood, belly fur past the hem) and an overlay can only add. So:
1. **Gear that hides body silhouette is a whole-drawing swap, not an overlay:** hood, helmet, captain hat (one dressed head per head drawing: `head-hood`, `head-attack-hood`, ... `head-back-hood`, the same for helmet and hat) and the jerkin (`torso-jerkin`, `torso-side-jerkin`, ... seven). Use round 2's 7 jerkins and 9 hoods as they are if each keeps the original's pivot, canvas and outline weight; draw the helmet and hat heads the same way. Each swap must line up with its undressed drawing at the neck (heads) and at the shoulders, neck and waist anchors (torsos): check by flicking between them at 136 px.
2. **Gear that only adds stays an overlay**, by the round 2 difference method: sash, quiver, eyepatch, scar, earring (check each: overlay over body matches the dressed drawing). If one removes pixels, it becomes a swap too; say which.
3. **Masks from the difference, then colour.** For each dressed swap, the gear region is exactly where it differs from the undressed drawing (that's the cloth / leather side); fur is the rest, selected as round 2 did. Split trim from cloth or leather by colour **inside the gear region only**, where the brown fur no longer collides. Body masks (undressed drawings): fur vs cloth by the A017 master's own regions if colour alone collides; list any you can't separate.
4. Ear notch: `-notch` swaps of the neutral head only for now.
Deliver: the swaps, overlays, masks, `rig-source.json` (swaps named per head and torso view, overlays as before), `fit.jpg` (each swap beside its undressed drawing, and flicker strips at 136 px), tints; `importReady: true` when the swaps line up and the tint sheet passes.
