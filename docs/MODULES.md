# Module map

Each `src/<module>/CONTRACT.md` states what the module owns and must not do. This page is the index.

One line per file: what it does and what it exports. **Read this instead of the code** to find where a change goes.

## Entry and glue
| File | Purpose | Exports |
|---|---|---|
| `index.html` | Canvas + loads `src/main.js` | |
| `src/main.js` | Sizes canvas, loads art referenced by data, starts loop | |
| `src/config.js` | View size (960x540), FPS, start stage/hero | `VIEW FPS START_STAGE START_HERO` |
| `lab.html` | Tuning lab page: game canvas + side panel, loads `src/lab/main.js` | |
| `src/game.js` | Input -> sim step (skipped during hit-stop) -> render. Pause, debug toggle, rig toggle (R), cast test pose toggle (C, view only), restart, run log (saves on game over; L downloads on the game-over screen only, elsewhere L blocks). Exposes `window.game` (`world opts log`) | `createGame` |

## Core (engine plumbing, rarely changes)
| File | Purpose | Exports |
|---|---|---|
| `src/core/loop.js` | Fixed 60 step/sec loop | `startLoop(update, render)` |
| `src/core/input.js` | Keyboard + gamepad -> `{mx,my,attack,jump,start,debug,pause,rig,cast,block,blockTap}` per step (`block` = held: L / RB; `blockTap` = pressed this step) | `initInput readControl` |
| `src/core/events.js` | Pub/sub bus | `bus.on bus.emit` |
| `src/core/assets.js` | Image loading; missing art -> labeled silhouette | `loadAssets collectArtPaths` |
| `src/core/rng.js` | Seeded RNG (repeatable tests) | `createRng` |

## Sim (pure logic, runs in Node)
| File | Purpose | Exports |
|---|---|---|
| `src/sim/world.js` | World state + one step: AI -> fighters -> separate -> hits -> cleanup -> waves | `createWorld stepWorld` |
| `src/sim/fighter.js` | Fighter entity, state machine (idle walk block jump attack hurt knockdown down getup dead), move phases, physics. `block` = held `control.block`, only for defs with a `block` config; `f.stun` = blockstun | `createFighter updateFighter startMove phaseOf setState canAct HELPLESS` |
| `src/sim/combat.js` | Hitbox/hurtbox overlap with depth tolerance, damage, hurt vs knockdown; frontal hits on a blocker become a block (chip, pushback, blockstun, attacker shoved back) | `resolveHits hitboxOf hurtboxOf` |
| `src/sim/ai.js` | Enemy brains (`brawler`), attack-token fairness, enemy separation | `thinkAI separate` |
| `src/sim/waves.js` | Spawns stage waves, loops them tougher | `stepWaves` |

## Render (reads state, never changes it)
| File | Purpose | Exports |
|---|---|---|
| `src/render/renderer.js` | Draw order: backdrop, stage, shadows, fighters by depth (rig if `art.rig` and `opts.rig`, else standee), effects, HUD, debug | `createRenderer` |
| `src/render/standee.js` | Fighter drawn as a standee: lean/squash/hop per state (block = braced lean back, jolts in blockstun) and move phase, flips, flashes, tints | `drawStandee drawShadow poseOf` |
| `src/render/rig.js` | Fighter drawn as a cutout rig: part hierarchy -> buffer, then placed like a standee (lean, flip, flash, tints). Draws swap images (`layoutRig(rig, joints, swap)` returns each part's `img`); optional held pose (`cast`) | `drawRig layoutRig` |
| `src/render/rig-pose.js` | Rig pose per state/move phase (waves, windup/through/strike, easing, overshoot) and blending from the last drawn pose; part swaps per pose/phase (switch at once, strike swaps last `timing.swapBack` of recovery); optional pose override. Channels: joint angles, dx/dy, per-part `.sx/.sy` stretch and `.order`. Pure | `targetPose rigJoints channelsOf jointsOfRig` |
| `src/render/effects.js` | Slash swooshes (optionally `flat` for level sweeps), sparks, rings, damage numbers, dust; block clang (bright sparks toward the attacker, shield-side flash, double ring) (from events) | `createEffects` |
| `src/render/juice.js` | Screen shake + hit-stop counters (from events; `block` uses the blocker's `block.hitstop/shake`) | `createJuice` |
| `src/render/hud.js` | Portrait, health bars, wave banner, KOs/XP, hints, game over, pause | `drawHud drawPaused` |
| `src/render/debug.js` | Overlay: floor belt, hurtboxes, hitboxes, states, AI tokens | `drawDebug` |
| `src/render/backdrop.js` | Sky, clouds, sea; stage cutout | `drawBackdrop drawStage` |
| `src/render/tint.js` | Cached solid-colour silhouettes | `silhouette` |

## Log (run summaries; never changes gameplay state)
| File | Purpose | Exports |
|---|---|---|
| `src/log/runlog.js` | Counts one run from bus events (Node-safe). `begin(world)` starts a run, `summary()` returns the fields below | `createRunLog summaryLines` |
| `src/log/store.js` | Browser only: last 20 runs in localStorage (`cloak-and-claw.runs`), `L` downloads `runs-YYYY-MM-DD.json` | `saveRun loadRuns downloadRuns` |

Run log fields (one object per run; the player only):
| Field | Meaning |
|---|---|
| `at` | ISO time the run was saved (null headless) |
| `frames` `seconds` | Sim duration (frames at 60/s; hit-stop and pause not counted) |
| `wave` `kos` `xp` | From `world` at the end |
| `damageDealt` | Sum of `damage` on the player's `hit` events |
| `damageTaken` | Sum of `damage` on hits the player received |
| `hitsLanded` | Player `hit` events (one per enemy struck) |
| `swings` `swingsByMove` | Player `swing` events, total and per move key |
| `whiffs` | Swings that struck nobody |
| `knockdowns` | Times the player was knocked down |
| `windupsInterrupted` | Player hits on an enemy that was in its move's windup |
| `blocks` | Hits the player blocked (chip damage counts in `damageTaken`) |

## Lab (tuning page, `lab.html`; never loaded by index.html)
| File | Purpose | Exports |
|---|---|---|
| `src/lab/main.js` | Lab entry: same boot as `src/main.js`, debug on, builds panel, exposes `window.game.lab` | |
| `src/lab/tweaks.js` | Pure model: expands `LAB_SCHEMA` into fields, writes live data objects, defaults snapshot, change list/format, save/load | `createTweaks fieldsOf allFields getPath setPath roundTo` |
| `src/lab/tools.js` | Wraps `game.update`: slow motion, passive rats (holds `ai.cool`), respawn wave. No sim changes | `createLabTools` |
| `src/lab/panel.js` | DOM side panel built from the schema; localStorage persistence | `buildPanel loadSaved` |

## Data (all tuning lives here)
| File | Purpose |
|---|---|
| `src/data/rules.js` | Gravity, hit depth, max simultaneous attackers, knockdown timings, wave delay |
| `src/data/juice.js` | Shake, flash, number, spark, dust, slash look |
| `src/data/controls.js` | Key and gamepad bindings |
| `src/data/moves/*.js` | Move sets: timing, hitbox, damage, knockback, hitstop, shake, pose, fx |
| `src/data/fighters/*.js` + `index.js` | Fighter defs: art, body, stats (RPG hooks), speeds, `block` (optional: walkSpeed, chip, pushback, stun, attackerPush, hitstop, shake), moves, AI params. Registry in index |
| `src/data/lab-schema.js` | Which data fields the tuning lab shows (`ROOTS` file -> object, `LAB_SCHEMA` sections/sliders, incl. a Stage section for the floor belt + art placement). New tunable = one line here |
| `src/data/rigs/*.js` + `index.js` | Cutout rigs: parts (image, parent, pivot, attach, rest, scale, order, `swaps` = alternate drawings with offset) and `-poses.js` (stance, idle/walk waves, state poses, move windup/through/strike, `swap: {part: name}` per pose, test poses like `cast`, blend timing). Registry in index |
| `src/data/stages/*.js` + `index.js` | Stage art placement, backdrop, floor belt, start point, waves. Registry in index |

## Tests and tools
| File | Purpose |
|---|---|
| `tests/run.mjs` | `npm test`: runs every `tests/*.test.mjs`; a file that fails to load counts as a failure |
| `tests/sim-smoke.test.mjs` | Bot plays 3 min x 3 seeds headless; checks NaN, fairness, progress |
| `tests/lab.test.mjs` | Lab schema names only existing fields (or ones with a fallback), defaults inside slider ranges, tweak model set/format/reset/load |
| `tests/rat-telegraph.test.mjs` | A player at the rat's attack spot who steps out of the lane 15 frames into the windup escapes the swing; old numbers still catch them |
| `tests/data.test.mjs` | Every fighter/move/stage/wave/art path resolves; rig parts, parents and pose joints resolve |
| `tests/rig.test.mjs` | Rig pose per state, move windup/strike reached, blend start/end, layout order, feet on the ground, walk stride matches walk speed, slash2 stretch/order channels |
| `tests/block.test.mjs` | Frontal hit on a blocker: chip only, no hurt/knockdown, `block` event, attacker shoved; chip never KOs; hit from behind lands; no attacking while blocking; blockstun; rats can't block |
| `tests/runlog.test.mjs` | Bot runs 3 min x 3 seeds; log matches independently counted events (hits, damage, swings, knockdowns, windups cut); idle 1-hp run logs 1 knockdown |
| `tests/bot.mjs` | Scripted player used by tests |
| `tools/key_green.py` | Green-screen keyer for new art; `--scale S` keeps parts cut from one canvas at relative size and prints each trim box (seeds rig attach points) |
| `tools/slice_sheet.py` | Slices a green parts sheet into keyed, trimmed part PNGs by name (reading order) |
| `tools/rig-preview.html` | Rig pose sheet for fitting and screenshots: `/tools/rig-preview.html?cells=standee,idle,slash3:windup,cast&zoom=3` (states, named poses, `move:windup/strike/<frame>`, `walk:<0..1>`; `dots` shows pivots) |

## Events (sim -> render)
| Event | Payload | Listeners |
|---|---|---|
| `swing` | `{f, move}` move's active frames begin | effects (slash), run log |
| `hit` | `{attacker, target, move, damage, x, y, z, ko, targetPhase}` (`targetPhase`: target's move phase before the hit, `none` if idle) | effects, juice, run log |
| `block` | `{attacker, target, move, damage, x, y, z}` frontal hit stopped by the shield (`damage` = chip, x = shield face) | effects (clang), juice, run log |
| `land` | `{f, heavy}` landed from jump / knockdown | effects (dust), juice |
| `jump` | `{f}` | (none yet; audio later) |
| `defeated` | `{f}` fighter finished their down state at 0 hp | (none yet) |
| `wave` | `{n}` | hud banner |
| `gameOver` | `{wave, kos}` | game.js (saves run log) |

## Coordinates
x = left/right, y = depth on the floor belt (bigger = nearer the camera, drawn later), z = height above ground. Screen position = (x, y - z). Timings are frames at 60 fps.
