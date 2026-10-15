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
| `src/game.js` | Input -> sim step (skipped during hit-stop) -> render. Pause, debug toggle, restart. Exposes `window.game` | `createGame` |

## Core (engine plumbing, rarely changes)
| File | Purpose | Exports |
|---|---|---|
| `src/core/loop.js` | Fixed 60 step/sec loop | `startLoop(update, render)` |
| `src/core/input.js` | Keyboard + gamepad -> `{mx,my,attack,jump,start,debug,pause}` per step | `initInput readControl` |
| `src/core/events.js` | Pub/sub bus | `bus.on bus.emit` |
| `src/core/assets.js` | Image loading; missing art -> labeled silhouette | `loadAssets collectArtPaths` |
| `src/core/rng.js` | Seeded RNG (repeatable tests) | `createRng` |

## Sim (pure logic, runs in Node)
| File | Purpose | Exports |
|---|---|---|
| `src/sim/world.js` | World state + one step: AI -> fighters -> separate -> hits -> cleanup -> waves | `createWorld stepWorld` |
| `src/sim/fighter.js` | Fighter entity, state machine (idle walk jump attack hurt knockdown down getup dead), move phases, physics | `createFighter updateFighter startMove phaseOf setState canAct HELPLESS` |
| `src/sim/combat.js` | Hitbox/hurtbox overlap with depth tolerance, damage, hurt vs knockdown | `resolveHits hitboxOf hurtboxOf` |
| `src/sim/ai.js` | Enemy brains (`brawler`), attack-token fairness, enemy separation | `thinkAI separate` |
| `src/sim/waves.js` | Spawns stage waves, loops them tougher | `stepWaves` |

## Render (reads state, never changes it)
| File | Purpose | Exports |
|---|---|---|
| `src/render/renderer.js` | Draw order: backdrop, stage, shadows, fighters by depth, effects, HUD, debug | `createRenderer` |
| `src/render/standee.js` | Fighter drawn as a standee: lean/squash/hop per state and move phase, flips, flashes, tints | `drawStandee drawShadow poseOf` |
| `src/render/effects.js` | Slash swooshes, sparks, rings, damage numbers, dust (from events) | `createEffects` |
| `src/render/juice.js` | Screen shake + hit-stop counters (from events) | `createJuice` |
| `src/render/hud.js` | Portrait, health bars, wave banner, KOs/XP, hints, game over, pause | `drawHud drawPaused` |
| `src/render/debug.js` | Overlay: floor belt, hurtboxes, hitboxes, states, AI tokens | `drawDebug` |
| `src/render/backdrop.js` | Sky, clouds, sea; stage cutout | `drawBackdrop drawStage` |
| `src/render/tint.js` | Cached solid-colour silhouettes | `silhouette` |

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
| `src/data/fighters/*.js` + `index.js` | Fighter defs: art, body, stats (RPG hooks), speeds, moves, AI params. Registry in index |
| `src/data/lab-schema.js` | Which data fields the tuning lab shows (`ROOTS` file -> object, `LAB_SCHEMA` sections/sliders). New tunable = one line here |
| `src/data/stages/*.js` + `index.js` | Stage art placement, backdrop, floor belt, start point, waves. Registry in index |

## Tests and tools
| File | Purpose |
|---|---|
| `tests/run.mjs` | `npm test`: runs every `tests/*.test.mjs`; a file that fails to load counts as a failure |
| `tests/sim-smoke.test.mjs` | Bot plays 3 min x 3 seeds headless; checks NaN, fairness, progress |
| `tests/lab.test.mjs` | Lab schema names only existing fields, defaults inside slider ranges, tweak model set/format/reset/load |
| `tests/data.test.mjs` | Every fighter/move/stage/wave/art path resolves |
| `tests/bot.mjs` | Scripted player used by tests |
| `tools/key_green.py` | Green-screen keyer for new art |

## Events (sim -> render)
| Event | Payload | Listeners |
|---|---|---|
| `swing` | `{f, move}` move's active frames begin | effects (slash) |
| `hit` | `{attacker, target, move, damage, x, y, z, ko}` | effects, juice |
| `land` | `{f, heavy}` landed from jump / knockdown | effects (dust), juice |
| `jump` | `{f}` | (none yet; audio later) |
| `defeated` | `{f}` fighter finished their down state at 0 hp | (none yet) |
| `wave` | `{n}` | hud banner |
| `gameOver` | `{wave, kos}` | (none yet) |

## Coordinates
x = left/right, y = depth on the floor belt (bigger = nearer the camera, drawn later), z = height above ground. Screen position = (x, y - z). Timings are frames at 60 fps.
