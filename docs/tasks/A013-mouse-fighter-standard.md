# A013 - Mouse Fighter to the rig standard: master + parts (Art)

**Read:** `docs/design/rig-standard.md` (**approved; this packet follows it**), `docs/style-contract.md`, `docs/handoffs/asset-contract.md`, `assets/art/heroes/mouse-fighter.png` (**the standee: the target**), `assets/source/A002-mouse-fighter-rig-3q/` and `assets/source/A006-mouse-fighter-touchup/` (the current parts and swaps, for the swap ideas he already uses), `assets/source/A010-rat-raider-standard/` (**the model to follow**: how the rat was cut from one master, `rig-source.json`, `cutlass-grip-check.png`), `docs/screens/T016/` (the rig bench on the current mouse).
**Autonomy:** human-gated (look). **Deliver to:** `assets/source/A013-mouse-fighter-standard/` on branch `a013-mouse-fighter-standard`.

## Why
The Mouse Fighter is the character the player looks at most, and he's the last one built the old way. The rig bench shows it: 12.7% of his drawing isn't covered by his parts (the rat: 2.8%), the sword sits 44% outside the drawing, the front boot points backwards, and his fists and boots are painted onto his forearms and shins. That blocks things we need now: weapons held in line with the fist (T020's alignment covers the mouse too), a gripping hand for the grab knee, planted feet, and a second hero and co-op later, which will all reuse the standard part names. The rat proved the method: one master, parts cut from it, measured joints.

Do **G1 (master) and G2 (parts) in one delivery**, as A010 did for the rat; the user judges both together.

## Make
1. **Master** (`reference.png`, 1536 x 2304 #00FF00, silhouette about 1350 px tall, feet on a marked floor line): the **standee** Mouse Fighter redrawn at full size in his game stance (upright, feet apart, sword in the near hand, shield on the far arm, both hands visible). Redraw the standee's character, don't design a new one: grey fur, big pink ears, red scarf, blue tunic with gold trim, brown belt and pouches, brown boots. Also `master-back.png`.
2. **Standard biped parts**, cut from the master (paint only what's hidden, round joints, outlines past the overlap): `pelvis`, `torso`, `head`, `arm-front-upper`, `arm-front-lower`, `hand-front`, `arm-back-upper`, `arm-back-lower`, `hand-back`, `leg-front-upper`, `leg-front-lower`, `foot-front`, `leg-back-upper`, `leg-back-lower`, `foot-back`, plus extras `tail`, `scarf-tail`.
3. **Swap library:**
   - hands: `hand-front-open`, `-fist`, `-grip` (closed round a handle, slot for the shaft); `hand-back-open`, `-fist`, `-grip`, and `hand-back-shield` (gripping the shield's inner strap).
   - heads: `head-neutral`, `head-attack` (his shout), `head-hurt`, `head-effort` (his gritted bracing face from A006), `head-ko`, `head-back`.
   - torsos: `torso` (three-quarter), `torso-side`, `torso-back`.
   - arms (he blocks and casts): `arm-front-raised` (whole raised arm), `arm-back-guard` (shield arm raised in guard). As A006, but cut to the new master.
4. **Shield and sword are items, not body parts.** Redraw nothing for them; deliver the hands so the existing shield (A002) and sword sit right: a `shield-check.png` and `sword-grip-check.png` like A010's cutlass check (handle through the grip slot, in line with it).
5. **`rig-source.json`** in the standard's format (parts, parents, measured joint points, bands, swaps). Also record each grip hand's **slot direction** (two points along the slot) so code can line weapons up with the fist (T020).
6. **Review:** the assembled mouse beside the standee at full size and at game size (130 px) over Harbor Market next to a new rat (136 px); all parts and swaps on grey; the grip and shield checks. Plus `prompt.md`, `HANDOFF.md`.

## Acceptance
- At game size he reads as the standee's Mouse Fighter, same proportions and outfit.
- Every standard part name present; parts reassemble onto the master (the lead runs the bench: target close to the rat's 2.8% / 3.5%).
- Sword and shield sit right in the hands.
- Human: is this our hero?

Out of scope: recolour masks and face details (he's unique), new moves, importing (Code does that after approval).

## Addendum (lead, 2026-10-16, after the user's review): one more foot, same branch
User: "it looks good." One note: "in his stance, his forward foot points forward, which is good. his back foot also points forward, whereas in the standee it's more toward the camera."
In the standee the back foot is turned out toward the viewer (about 45 degrees), the classic braced fighting stance; in the master both feet point forward, which reads more like walking.
Fix with a swap, not a new master (that's what separate feet are for):
1. **`foot-back-out.png`**: the back boot turned out toward the camera as in the standee (toes pointing down-left of forward, sole partly hidden), same canvas, **same ankle pivot** as `foot-back`. Paint it as a turned view of the same boot (cuff, buckle, toes), not a new design.
2. Optional, only if it reads better: `foot-front-out.png` (slightly turned) for very wide stances.
3. Add it to `rig-source.json` swaps (`of: "foot-back"`), and a small review: the master stance with `foot-back` vs `foot-back-out` beside the standee, at full size and game size.
Code then uses the turned-out back foot in stance, idle, block and other planted poses, and the forward foot when walking.

## Addendum 2 (lead, 2026-10-16): wrong foot, the lead's wording
User: the new drawing turned his **left** foot (far side, the leading foot, which correctly points forward), but it's his **right** foot (near side, camera side, the trailing foot) that turns toward the camera in the standee.
The mistake was in addendum 1: it said "back foot" meaning the trailing foot in his stance, but in the rig standard `foot-back` means the **far** foot. In this stance the trailing foot is the **near** one, `foot-front`.
1. Make **`foot-front-out.png`**: the **near** (right, camera-side) boot turned out toward the camera as in the standee, same canvas, **same ankle pivot as `foot-front`**, a turned view of the same boot.
2. Remove `foot-back-out` from `rig-source.json` (keep or delete the file; it's unused). Add the swap `foot-front-out` (`of: "foot-front"`).
3. Review as before: standee, master with `foot-front`, master with `foot-front-out`, full size and game size.
