# T026 - Import the rebuilt Rat Raider (A018) for the whole rat family (Code)

**Modules:** `tools/rig_from_source.py`, `src/data/rigs/rat-*.js` (rig + poses + spearman/archer variants), `src/data/rigs/rat-raider-gear.js` (head gear by the A017 offset), `assets/art/enemies/rat-raider/rig/`, `tools/rig-hulls.mjs` -> `hulls.js`, `tools/bench/families.js` + `stretch-known.js`, tests. **Read:** `docs/design/rigs/rat-raider.md` (rig sheet + pose budget), `assets/source/A018-rat-parts/` (`rig-source.json`, `HANDOFF.md`), `assets/source/A017-rat-setup-master/head-offset.json`, `docs/design/rig-standard.md`. **Needs:** T024, T025, **T027 (viewer)** merged; A018 merged (done). Show the user the result in the viewer, the old rat beside the new one. **Autonomy:** human-gated (the user plays the rats).

The rat is rebuilt from a neutral setup-pose master (decision 2026-10-17). A018 is his new body: 19 parts with rounded joints, hands for every hold (side, overhand, pinch, shield), side and back torsos, and the approved heads unchanged. This task puts him in the game as the raider, spearman and archer, with every move he has today.

## Do
1. **Import** A018 with the importer (`--height 136`, uniform scale, report any fudge over 5%), replacing the A010 rig. A018's `rig-source.json` carries `grips` and explicit `sockets`: use them (compare with the importer's derived sockets and report differences).
2. **Head gear and face details:** A011's hood, helmet, captain hat and face details move by A017's head offset (dx -114, dy -50 source px, scaled). Torso gear (jerkin, quiver, sash) and body masks were drawn for the old torso: **hide them** until A020 refits them; keep the cloth/fur tints working on what remains (heads, gear on the head). Note in the report how the rats read without jerkin and quiver.
3. **Pose every current rat move on the new body** (rig sheet pose budget): menace idle as a crouch posed from the setup master, walk on the floor-line rule (the 9-key pattern, no variant toggles), cutlass slash with its telegraph, spear thrust with **both hands overhand** (T025 grip modes now have `hand-near-grip-overhand`), bow draw to the jaw, hurt, knockdown / thrown / lying, get-up (until A019's kneeling leg: the current get-up), grabbed, weapon drop. Where a pose needs an A019 drawing (kneeling, cocked arm, raised-back arm, folded leg, toe-off), use the nearest rigid pose for now and list it.
4. **Stretch strip and hold test** on the new rat family; update `stretch-known.js` (the lead's provisional run flagged only: near shoulder with the arm straight up, expected until A019's raised arm; lying: shoulder 9.3 px and far hip 3.3 px). Remove the old rat's known flags that no longer apply.
5. Bot runs: sim unchanged (render only); numbers identical to main.

## Acceptance
- Headless: tests pass; stretch + hold tests with only the listed known flags; bot numbers identical.
- Windowed: `docs/screens/T026/`: the three rats at game size beside the A010 rats; stance, walk filmstrip, each attack's windup and strike, hurt, knockdown, get-up; spearman overhand low; archer at full draw.
- Human: do the rats still look like our rats and fight like them? Are the overhand spear and the full bow draw better than before?

Out of scope: A019 key drawings (next art task), torso gear refit (A020), new kits and moves (the flexibility test, after A019 + A020).

## Addendum (lead, 2026-10-17): A019 is merged, import it in this task
- Merge A019's fragment (nine whole-limb/foot swaps with `hide`, `itemGrip`, `slotDirection`) and its two replacement parts (`arm-near-upper`, `leg-far-upper`, same pivots) into the rat. Images resolve from `assets/source/A019-rat-key-drawings/` (LFS).
- Wire the pose-budget states that waited on them (rig sheet): telegraph + cutlass wind-up on `arm-near-cocked`; full bow draw on `arm-far-raised-back` (far forearm and fist drawn **in front of** the torso and head while drawing: add the overlay band); `arm-far-guard` for the shield-bearer's block (rat shield item comes with the flexibility test; wire the pose); `arm-near-raised` for arms-up; get-up on `leg-near-kneeling`; squat / land / lying on `leg-far-folded`; jump tuck on `leg-near-kneeup`; walk push-off and thrust lunge on the toe-off feet.
- **Toe-off feet:** Art drew them steep (toes nearly straight down); the ankle must lift 98 px (near) / 127 px (far) source for the ball to meet the floor. Use them only at the push-off key, let the floor-line rule lift the ankle, and report in the viewer whether they read as a push-off or a tiptoe.
- Stretch strip: confirm the lying shoulder (was 9.3 px) and far hip (3.3 px) are cleared by the replacements; the arms-up shoulder flag should go with `arm-near-raised`.
- Human check in the viewer (phone): wind-up, full draw, guard, kneel, squat, jump tuck, walk.

## Round 2 (lead, 2026-10-17): the user's review
User, in the viewer: "the old one had torso to arm to hand connections that look right, it looks like a single piece of art. The arms and hands on the new rat are twisted and strange. It doesn't hold weapons correctly. When it walks a gap is visible between butt and tail. And yes overall it's probably a bit hunched down, height wise, but that's a smaller issue." Screens: `docs/screens/A022/problems-*.jpg`. Causes in the art (A018/A019 hands with punched holes and wrist discs, a fur-ball shoulder, a jagged tail root, stray scraps) go to **A022**. Code's part, on this branch, now:
1. **Draw order:** upper arms behind the torso (near 590 < torso 600, as A010 had it) so the vest edge covers the shoulder; tail behind the pelvis with its root under the trouser seat; whole-arm keys keep the arm's band except where the packet says otherwise (bow draw forearm in front).
2. **Island filter in the importer:** drop detached islands (any connected piece apart from the main shape, after keying), list each one dropped in the report.
3. **Paint check (new G2 test, rig standard section 8):** render the rest pose at source scale and compare with the master colour for colour (e.g. mean and 95th-percentile per-pixel difference inside the silhouette, plus the largest connected region of strong difference); a map image per body in `docs/screens/T026/`; `npm test` fails above a threshold you set from the A010 rat (which the user called "a single piece of art"). Run it on A010 vs its master, current A018+A019 vs A017, and later A022.
4. **Stance:** less hunched: raise the idle/menace crouch toward the master height (keep the menace); report the height vs A010.
5. **Walk tail gap:** add stretch cells for the tail root at pelvis +-10 degrees.
6. Then **wait for A022**, re-import it, and put the viewer links for the same views in `views.json` again. Do not merge until the user approves in the viewer.
