# T026 - Import the rebuilt Rat Raider (A018) for the whole rat family (Code)

**Modules:** `tools/rig_from_source.py`, `src/data/rigs/rat-*.js` (rig + poses + spearman/archer variants), `src/data/rigs/rat-raider-gear.js` (head gear by the A017 offset), `assets/art/enemies/rat-raider/rig/`, `tools/rig-hulls.mjs` -> `hulls.js`, `tools/bench/families.js` + `stretch-known.js`, tests. **Read:** `docs/design/rigs/rat-raider.md` (rig sheet + pose budget), `assets/source/A018-rat-parts/` (`rig-source.json`, `HANDOFF.md`), `assets/source/A017-rat-setup-master/head-offset.json`, `docs/design/rig-standard.md`. **Needs:** T024, T025 merged; A018 merged (done). **Autonomy:** human-gated (the user plays the rats).

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
