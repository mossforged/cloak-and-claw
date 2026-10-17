# A022 - Rat Raider: joint repair (shoulders, hands, tail root, clean cuts) (Art)

**Read:** `docs/design/rig-standard.md` section 5 rule 3 (**rewritten 2026-10-17: joint overlaps are hidden under the neighbouring piece, never a visible circle**), `docs/design/rigs/rat-raider.md`, `assets/source/A017-rat-setup-master/master.png`, `assets/source/A018-rat-parts/` and `assets/source/A019-rat-key-drawings/` (the parts being repaired), and the model to copy for grips: `assets/source/A010-rat-raider-standard/hand-front-grip.png`. The user's review screenshots and the lead's comparison: `docs/screens/A022/problems-*.jpg` (on main). **Needs:** nothing. **Autonomy:** human-gated (the user judges in the viewer on his phone). **Deliver to:** `assets/source/A022-rat-joint-repair/` (LFS) + phone copies in `docs/screens/A022/`.

The user reviewed the rebuilt rat in motion (T026): the body and key poses are an improvement, but "the old one had torso to arm to hand connections that look right, it looks like a single piece of art. The arms and hands on the new rat are twisted and strange. It doesn't hold weapons correctly. When it walks a gap is visible between butt and tail." The lead found why:
- **Hands** (A018): every grip hand is a fist seen from the knuckles with a **round hole punched through it**, and each hand carries a **hard-edged disc** of bracer/wrist at its top. The working A010 grip hand is a fist seen from the side, wrapped round the handle, with a narrow slot.
- **Shoulder** (A019 `arm-near-upper`): the cap became a **large round ball of fur** with no outline, drawn in front of the vest.
- **Tail root** (A018 `tail-1`): a jagged top with scraps of trouser in it; nothing tucks under the trousers, so a gap opens when he walks.
- **Stray scraps:** small detached red/orange flecks in several cuts float beside the body.

This was partly the lead's wording ("a near-circle around the pivot"). The rule is now: **the overlap is hidden underneath the neighbouring piece; nothing you can see is a geometric circle.**

## Repair (same canvas, same pivots, same names; replace the files)
1. **Shoulders (`arm-near-upper`, `arm-far-upper`, and the shoulder end of every whole-arm key: `arm-near-cocked`, `arm-near-raised`, `arm-far-raised-back`, `arm-far-guard`):** the visible top of the arm matches the master's shoulder exactly where the master shows it; above that, the hidden end continues as plain sleeve/fur **under** the torso's vest edge and scarf (the arm draws behind the torso: band 590 < torso 600). If the vest edge does not cover the joint across arm angles from about -60 to +150 degrees, extend the **torso's** vest/shoulder edge (on `torso.png`, `torso-side`, `torso-back`) so it does, matching the master. No circle, no disc, no unoutlined ball.
2. **Hands, all of them** (`hand-near` / `hand-far`: fist, open, grip, grip-overhand, pinch, shield): cut from **A017's own fists** and edited only as far as each hold needs. The **wrist end tucks under the forearm's bracer** (the bracer on `arm-*-lower` covers the joint); no disc. **Grip** = seen from the side (thumb toward the viewer), fingers wrapped round a handle, the handle's path a narrow **slot** through the fist (like A010), not a round hole. **Grip-overhand** = the same fist rolled so the knuckles face the viewer and the thumb wraps over the top, slot running across. **Pinch** = thumb and forefinger pinching an arrow nock. **Shield** = closed on a strap, knuckles forward. Mark each grip hand's slot centre and direction in `rig-source.json` `grips`.
3. **Tail root (`tail-1`):** a clean, outlined, rounded root that tucks **under** the trouser seat on `pelvis` (tail band behind the pelvis); no trouser scraps on the tail. Check the gap at walk angles of the pelvis (about +-10 degrees).
4. **Clean every cut:** no detached pixels or islands of any size outside each part's main shape (run a connected-components check on every PNG in A018, A019 and this delivery; deliver cleaned replacements of any A018/A019 file that has them, same name).
5. Keep everything else: heads, legs, feet, torsos (except the vest-edge extension), whole-leg keys.

## Self-check before delivering (the new rule)
Reassemble the rat at rest on the master's canvas and compare it **colour for colour** with `master.png` (not just the outline): deliver `rest-diff.png`, the absolute difference image, and report the share of interior pixels that differ strongly. Painted discs, holes and balls show up here; the T026 review proved an outline match isn't enough.

## Deliver
Repaired PNGs (same names), the updated `rig-source.json` fragment (grips), `rest-diff.png`, `review.png` (old A010 hand / new hand side by side for every hand; each shoulder at arm angles -60, 0, 90, 150 degrees over the torso; tail root at pelvis +-10 degrees; the rat at game size holding cutlass, spear (overhand) and bow), `prompt.md`, `HANDOFF.md`; phone copies `docs/screens/A022/review.jpg` etc.

## Acceptance
- No visible circles, discs, holes or balls at any joint; no floating scraps; the rest assembly matches the master colour for colour except under covered overlaps.
- Human (viewer, phone, after Code re-imports): does he read as one piece of art like the old rat, and hold his weapons properly?

Out of scope: gear and masks (A020), weapons, code.
