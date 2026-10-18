# A023 - Rat Raider: complete kit (views, turns, polish drawings) (Art)

**Read:** `docs/design/rigs/rat-raider-rehearsal.md` (**the reason for every drawing below**), `docs/design/rigs/rat-raider.md`, `docs/design/rig-standard.md` sections 4, 5 (rule 3: hidden overlaps, never a visible circle) and 6, `assets/source/A017-rat-setup-master/` (master + back view), `assets/source/A018-rat-parts/`, `A019-rat-key-drawings/`, `A022-rat-joint-repair/` (the current parts: match them exactly). **Needs:** nothing. **Autonomy:** human-gated (the user judges in the viewer on his phone after Code imports). **Deliver to:** `assets/source/A023-rat-complete-kit/` (LFS) + phone JPG copies in `docs/screens/A023/`.

The user wants one enemy with everything a brawler body needs, at the polish level, so we never go back for missing pieces. The move rehearsal walked every move key by key; the gap it found is **views**: the rat can't turn his chest toward you or away from you, so every swing is an arm sweeping across a still body. This task draws the views and the remaining polish drawings. Same canvas (1536 x 2304, #00FF00), same scale, same palette and line weight as the master; every drawing cut **from the master's own paint** where the master shows it, inpainted only where it doesn't.

## Draw
**Torso and pelvis views** (each with the joint points below):
1. `torso-front`: chest turned toward the camera (about 45 degrees past three-quarter): both shoulders visible, near shoulder forward. Strike frames, turn-around, throws.
2. `torso-away`: chest turned away (back three-quarter): near shoulder pulled back, more of the back and the scarf showing. Wind-ups and telegraphs.
3. `torso-hunched`: three-quarter, shoulders rounded forward and down. Block, dodge, get-up, chop strike, cower.
4. `torso-lean-back`: three-quarter, chest arched back. Overhead wind-up, hurt snap, skid, kick.
5. `pelvis-side`, `pelvis-front`, `pelvis-back`: the trousers' waistband and seat from those angles; the **tail root tucks under the seat** in side and front; in back the seat and tail root face the camera with the root drawn clean and outlined (it draws in front there).

**Heads:** 6. `head-front` (turn midpoint; same head, facing the camera); 7. `head-shout` (mouth wide, rallying); 7b. `head-drink` (eyes shut, head tipped back, lips ready at a bottle's neck). Same head canvas and neck point as the six carried heads.

**Shoulder caps:** 8. `shoulder-near`: the near shoulder with its pauldron and vest edge as the master shows it, as its own small piece that sits **on top of the upper arm** when the arm swings in front of the body (front and side views). 9. `shoulder-far`: the same for the far shoulder (back view, shield guard). The cap's lower edge tucks under nothing: it is outlined and finished; its top continues under the torso's vest edge.

**Arms, hands, feet:** 10. `arm-far-raised` (whole far arm straight up, fist closed; two-hand overhead, cower); 11-12. `arm-near-smear-h`, `arm-near-smear-o` (whole near arm stretched into a motion blur along a horizontal and an overhead arc, fist and cutlass hand at the end; one frame each); 13-14. `hand-near-palm`, `hand-far-palm` (flat open palm facing out: block, push, grab reach, cower); 15-16. `foot-near-heel`, `foot-far-heel` (heel strike: toes up, heel on the floor); 17. `foot-near-out` (turned out, planted). Feet and hands cut from A017's own feet and fists like A022's.

**Added (lifting, throwing, drinking, magic; see the rehearsal):** 18. `arm-near-mouth`: whole near arm bent with the elbow forward and the fist at the mouth in a side grip (drinking; also wiping the mouth with the back of the fist), carrying the item like the A019 arm keys (`itemGrip`, `slotDirection`); 19-20. `hand-near-cup`, `hand-far-cup`: open hand cupped palm up (holding an orb or flame, charging a spell, lifting from beneath); 21. `hand-near-point`: index finger pointing, other fingers curled (commands, curses).

**Only if Code's stretch strip shows gaps after import:** elbow and knee patches (x4). Don't draw them now.

**Repairs from T026's stretch strip:** the six far hands (`hand-far*`): lengthen the hidden wrist end so it stays under the far bracer when the hand turns over a shaft (Code measured gaps up to 10.5 px). `arm-near-upper` and its whole-arm keys: lengthen the hidden plain-fur end under the vest (a 2.5-5 px crack opens with the arm swung forward). Same files, same pivots.

## Joint points (the new part of `rig-source.json`)
For **every torso view** (three-quarter, side, back, front, away, hunched, lean-back) record `anchors`: `neck`, `shoulder_near`, `shoulder_far`, `waist` in that drawing's canvas pixels; for **every pelvis view** (three-quarter, side, front, back): `waist`, `hip_near`, `hip_far`, `tail_root`. Include A018's existing side and back torsos. Code re-attaches the head, arms, legs and tail to these points when a view swaps in, so they must sit where the joint truly is in that drawing.

## Self-check before delivering
- One connected piece per cut (8-connected, after keying); same canvas; pivots unchanged on repaired files.
- `views.png`: the rat assembled in each view (Q, S, F, away, B) from the parts and their anchors, beside the master, at full size and at 136 px. In F and S the near arm drawn in front with the near cap; in B the far arm in front with the far cap.
- `turn.png`: a slash strip assembled by hand (away + cocked arm behind -> front + arm in front with the cap -> three-quarter) so the turn reads before Code imports it.
- Paint check as A022 (rest assembly vs master, colour for colour) for the repaired files.
- No visible circles, discs, holes or balls at any joint.

## Deliver
The PNGs above, a `rig-source.json` fragment (parts, swaps, `anchors`, bands as the rehearsal's view table suggests, `grips` for any hand you touch), `views.png`, `turn.png`, `review.png` (every new drawing beside the master region it comes from), `prompt.md`, `HANDOFF.md`; phone JPGs (quality ~80, long side <= 2000 px) in `docs/screens/A023/`.

## Acceptance
- Every view reads as the same rat as the master; joints hidden; the turn strip reads as a body turning into a swing.
- Human (viewer, phone, after T029): does he turn into his attacks? Does anything look pieced together?

Out of scope: gear and masks for the new views (A020 after this), weapons, code.

## Round 2 (lead, 2026-10-17): repairs, collected; start when the lead says (after Code's pose seam test and T028's rehearsal sheet)
A023 merged as source 2026-10-17 (24 drawings, anchors, view bands; Q/S/F read as the same rat; F is strong). Collected for one repair pass:
1. **Hips and waist** (user, T026 round 3: "a gap between his leg and hips"; `docs/screens/T026/r3-user-review-gaps.jpg`): `leg-near-upper`, `leg-far-upper` (and the whole-leg keys): lengthen the hidden top of each thigh so it stays under the pelvis's trousers across hip angles from about -30 to +60 degrees; `torso` and `pelvis` (and every torso / pelvis view you draw): the torso's lower edge and the pelvis's top must overlap under the belt by at least 40 source px, so the waist never opens when the chest turns or leans. Same files, same pivots; Code may report more joints from its new pose seam test, which the lead will add here.
2. **Seat-to-thigh** transitions on `pelvis-front` and `pelvis-back` (your HANDOFF: abrupt where the new pelvis meets the Q thighs).
3. **Shoulder caps:** remove the doubled trim / button edge against the baked shoulder on each torso view.
4. **Turned-away (BQ) and back (B) views** (user, 2026-10-18: "the art is fine, but obviously the rightmost two are doing very strange things anatomically"; `docs/screens/A023/views.jpg`). Redraw `torso-away` so the near shoulder is pulled back and the near arm goes behind the body (not folded across the chest). For B, the inherited forward-facing legs, feet and arms are the problem: draw back-view pieces on the same pivots: `leg-near-upper-back`, `leg-near-lower-back`, `leg-far-upper-back`, `leg-far-lower-back`, `foot-near-back`, `foot-far-back` (heels toward the camera), and back-view arm pieces if the forearms/bracers still read front-on. Prove both views assembled beside a real back-view reference pose; they must read anatomically at a glance.
5. Anything Code's pose seam test (T026 r4) and rehearsal sheet (T028) report; the lead lists them here before you start.
