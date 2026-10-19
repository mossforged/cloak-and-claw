# T032: rat gear import, lists for the lead

Imported by `python3 tools/gear_swaps_from_source.py assets/source/A020-rat-gear-every-view/rig-source.json --id rat-raider`
(game images in `assets/art/enemies/rat-raider/gear-a020/`, data in `src/data/rigs/rat-raider-gear-a020.js`, the rat's
gear in `src/data/rigs/rat-raider-dress.js`). Full numbers per point: `lineup.json`.

## Line-up (game px, after the import's fixes)
Check: around each joint point (heads: the neck; torsos: neck, both shoulders, waist) the shift that lays the most dressed
pixels on the same bare fur / skin. Gear pixels match nowhere, so only the anatomy left uncovered decides.

**Over 2 game px, for Art:**
| Swap | Point | Off by | Why |
|---|---|---|---|
| head-back-helmet | neck | 3.3 | the helmeted back head is drawn bigger than the bare one (ears larger and spread wider); a scale, not a shift, so no offset fixes it. Weak match (28% of the bare fur round the neck) |

**Fixed in the import** (shift folded into the swap's offset; neck matched on at least 40% of the bare fur): head-helmet
1.0 / -1.0, head-hat 0.8 / -1.0, head-attack-helmet 0.6 / -0.4, head-back-hat 0.6 / 0.2, head-effort-hat 0.4 / -0.6,
head-effort-helmet 1.8 / -0.2, head-hurt-hat 0.4 / -2.0, head-hurt-helmet 1.2 / -0.6, head-notch 1.2 / -0.8 (game px
x / y). Every other swap was already within 0.5 px.

**Torsos (jerkin): all within 0.5 game px**, no fix needed. The waist point is under the jerkin on every view (and the
neck on torso-away): nothing bare to line up there, listed as covered.

**Under the hood:** head-back-hood and head-drink-hood cover the neck completely (no bare fur to measure).

**Seams with gear on** (pose seam test; the gear is drawn in the test since the archer and spearman wear it):
- archer cast @8: torso / head 8 px. The hood-attack collar leaves a sliver of shoulder fur open under the raised
  arm (A020's own note: hood collars change neck coverage, worst on drink / shout / attack). Known list rewritten.
- spearman (jerkin): waist +1 px in idle and walk (5.5 -> 6.5, 5 -> 6), far armpit +1 in the thrust; his worst neck seam
  falls 7.5 -> 2.5. Archer and spearman idle / walk neck seams are closed by the hood and helmet.
- Pass bar: 32 / 54 clips pass, the same clips as T030 (`pass-bar.md`).

## Recolour
Bare drawings: exactly as before T032 (the head fur masks from A011; nothing else had masks on the rebuilt rat).
A020's masks are not imported (tint sheet failed: `semanticTintPass: false`, every drawing in `unresolvedDrawings`), so
**every new drawing shows as drawn, no tint**:
- Heads (27): head-hood, head-attack-hood, head-effort-hood, head-hurt-hood, head-ko-hood, head-back-hood,
  head-front-hood, head-shout-hood, head-drink-hood; the same nine with -helmet and with -hat.
- Ear notch: head-notch.
- Torsos (7): torso-jerkin, torso-side-jerkin, torso-back-jerkin, torso-front-jerkin, torso-away-jerkin,
  torso-hunched-jerkin, torso-lean-back-jerkin.
- Overlays (19): gear-sash (+ -side, -back, -front, -away, -hunched, -lean-back), gear-quiver (+ -side, -back, -away,
  -hunched, -lean-back), detail-eyepatch-front / -drink, detail-scar2-front / -drink, detail-earring-front / -drink.

What that changes in play: archers' hoods no longer vary in colour (A011's hood overlay had a cloth mask; the hood is now a
whole drawing in A020's olive). The look still picks a hood colour (seeded runs unchanged); it just isn't applied.

## Coverage gaps (bare drawing shows, listed in tests/gear.test.mjs)
- Ear notch: neutral head only (A020); on the other eight heads the notched rat shows the bare drawing.
  A011's painted notch overlays on the other heads are retired.
- No eyepatch / scar / earring on the shout head (A020 drew front and drink only).
- Quiver hidden on the front torso (A020: front occlusion not proven).
- Hood covers earring and notch (data rule `COVERS` in `src/data/looks.js`; archers never roll those). Helmet or hat with
  the notch: the headwear wins, the notch is lost. Other details (eyepatch, scar) draw over the headwear drawing; on the
  helmet the eyepatch strap crosses the helmet rim.
