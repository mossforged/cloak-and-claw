# T028 - Views, depth switching and the rehearsal sheet (Code)

**Modules:** `src/render/rig*.js` (layout, draw order, grip), `src/data/rigs/` (rig format: views, anchors, band tables), `tools/rig_from_source.py` (anchors), `src/viewer/` (rehearsal mode), `tools/bench/` (stretch strip per view), tests. **Read:** `docs/design/rigs/rat-raider-rehearsal.md` (the spec: view table and every move's keys), `docs/design/rig-standard.md` sections 4 and 6 (revised), `docs/tasks/A023-rat-complete-kit.md` (what art is coming and its `anchors` format). **Needs:** T026 merged. **Autonomy:** human-gated (the user judges the rehearsal sheet and the turning slash on his phone).

The T026 review found the rat can't turn into a swing: the torso never changes view and the near arm is always behind the body at the shoulder. The rehearsal (lead, 2026-10-17) turns that into runtime requirements. Build them against the drawings we have (Q, the A018 side and back torsos, the back head); A023 adds the rest, and T029 imports it.

## Do
1. **Views.** A rig declares views for `torso` and `pelvis` (Q, S, F, BQ, B; see the rehearsal's table). Each view = a drawing + `anchors` (torso: `neck`, `shoulder_near`, `shoulder_far`, `waist`; pelvis: `waist`, `hip_near`, `hip_far`, `tail_root`) + a band table. When a pose picks a view (`view: { torso: 'F', pelvis: 'Q' }`), the children re-attach to that view's anchors (blend their positions over the swap frame so nothing jumps). Until A023 lands, derive anchors for the A018 side and back torsos yourself (measure them; report the numbers) and use the side torso as the stand-in for F and BQ.
2. **Depth switching.** Each view's band table sets which limbs draw in front of the body (rehearsal table: S and F bring the near arm wholly in front; BQ puts it wholly behind; B brings the far arm in front and swaps the legs and tail). A pose can also override bands per part (`order: { 'arm-far-guard': 850 }`: the shield guard in front of the chest). Inside a move, the switch happens on a named key (the frame where the hand passes the edge of the body), never as a blend. The held weapon follows its hand's band.
3. **Shoulder caps.** Optional parts (`shoulder-near`, `shoulder-far`) parented to their upper arm, rotating with it by a factor (data, lab slider), shown only in views where that arm draws in front.
4. **Turn-around** through F: scale crossing zero with F for two frames at the midpoint (front torso, pelvis and head when A023 lands; side as the stand-in now).
4b. **Carry sockets:** a held hero or a two-hand object (crate, barrel) is placed and turned at a carry point between the two hands each key, with its own band (between the torso and the near arm); throws release it along the last key's motion. A one-hand item at the mouth (drinking) uses the existing weapon node.
5. **Springs** for the tail segments and the scarf (study recommendation 10): rotation-only, driven by the parent's velocity, with inertia / strength / damping in `src/data/` and lab sliders; defaults that read as weight, not bounce; off switch per rig.
6. **Rehearsal sheet** (viewer mode, phone): `viewer.html?rehearse=rat-raider` lays out every move in the rehearsal file as a contact sheet of its keys at game size, each labelled with its views and the drawings it uses; a drawing that isn't game-ready yet shows as a labelled red box at its part's position. Data: `src/data/rehearsal/rat-raider.js` transcribes the rehearsal tables. This sheet is the new check before art for every new body (rig standard 9c).
7. **The turning slash now:** re-pose the raider's cutlass slash per the rehearsal (wind-up turned away with the arm behind -> strike with the arm in front -> recover), with the stand-in drawings, so the user sees the turn before A023 lands. Old cases: a rig with no views behaves exactly as today (all current tests and bot numbers unchanged).
8. Stretch strip: each view, each limb at 90 and 150 degrees, with the view's draw order; the hold test in each view.

## Acceptance
- Headless: tests pass; bot numbers identical; a rig without views lays out pixel-identical to main.
- Windowed: `docs/screens/T028/` (JPG): the rehearsal sheet; the slash filmstrip new vs old. Viewer links in `views.json`, including the rehearsal sheet.
- Human: does the rat turn into the slash? Is the rehearsal sheet readable on the phone?

Out of scope: importing A023 and posing every rehearsal move (T029), gear (A020).
