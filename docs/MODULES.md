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
| `src/game.js` | Input -> sim step (skipped during hit-stop) -> render. Pause, debug toggle, rig toggle (R), cast test pose (C plays it once from idle, view only, via `render/view-pose.js`), restart, run log (saves on game over; L downloads on the game-over screen only, elsewhere L blocks). Exposes `window.game` (`world opts log`) | `createGame` |

## Core (engine plumbing, rarely changes)
| File | Purpose | Exports |
|---|---|---|
| `src/core/loop.js` | Fixed 60 step/sec loop | `startLoop(update, render)` |
| `src/core/input.js` | Keyboard + gamepad -> `{mx,my,attack,jump,grab,start,debug,pause,rig,cast,block,blockTap}` per step (`block` = held: L / RB; `blockTap` = pressed this step; `grab` = pressed: H / Y) | `initInput readControl` |
| `src/core/events.js` | Pub/sub bus | `bus.on bus.emit` |
| `src/core/assets.js` | Image loading; missing art -> labeled silhouette | `loadAssets collectArtPaths` |
| `src/core/rng.js` | Seeded RNG (repeatable tests) | `createRng` |

## Sim (pure logic, runs in Node)
| File | Purpose | Exports |
|---|---|---|
| `src/sim/world.js` | World state + one step: AI -> fighters -> separate -> props block -> hits (fighters, then props) -> thrown bodies -> KO drops -> items -> cleanup -> waves. `w.props`, `w.items`, `w.itemRng` (loot rolls on their own rng, so the fight's sequence never shifts) | `createWorld stepWorld` |
| `src/sim/fighter.js` | Fighter entity, state machine (idle walk block jumpStart jump attack hurt knockdown down getup dead; `jumpStart` = jump squat, only with the def's `jumpSquatMode` 'A': crouched `move.jumpSquat` frames, then take-off, an attack pressed meanwhile = the air attack (T014); grab states delegate to grab.js; `toss` to weapons.js). Moves come from `movesOf(f)` (a held weapon's kit replaces the fighter's own); `f.moveKey` = current move's key; move phases, physics. `block` = held `control.block`, only for defs with a `block` config; `f.stun` = blockstun. Thrown/knocked-down fighters bounce off the floor's side edges (`RULES.wallBounce`; 0 = old clamp) | `createFighter updateFighter startMove phaseOf setState canAct HELPLESS` |
| `src/sim/grab.js` | Grab and throw (T009), for defs with `grab`/`throw` configs: pressing grab (H / Y) with a `throwable` enemy in reach in front (or on the side you push toward) -> holder `grabbing` (never automatic), held `grabbed` (helpless, can't be hit); attack = knee (the `maxStrikes`-th knocks down), attack + direction or jump = `throw` (wind, release, recovery); held one breaks free after `holdMax`; a hit on the holder drops him. Thrown body (`thrown`) knocks down each enemy it touches and lands knocked down. `f.grab`, `f.heldBy`, `f.thrower` | `tryGrab stepGrabbing stepThrow landThrown releaseGrab resolveThrown` |
| `src/sim/combat.js` | Hitbox/hurtbox overlap with depth tolerance, damage, hurt vs knockdown (`move.launch` = own knockdown speed); frontal hits on a blocker become a block (chip, pushback, blockstun, attacker shoved back); a hit on a holder drops the grab; a landed move wears a held weapon | `resolveHits applyHit vulnerable hitboxOf hurtboxOf` |
| `src/sim/ai.js` | Enemy brains (`brawler`), attack-token fairness (grabbed/thrown rats are helpless: token dropped), enemy separation (a grabbed rat is pinned, others step aside; thrown ones fly through); a rat a prop pushed (`f.blockedBy`) steps round it on the side with room | `thinkAI separate` |
| `src/sim/props.js` | Breakable props and floor items (T010). Props: solid obstacles (fighters on the ground pushed out; jumps above `body.h` pass), hit once per move by hero-team swings, thrown bodies and tossed weapons; at 0 hp break and drop their contents (id or weighted pick). Items: `pop` (falling) -> `floor` (weapons vanish after `RULES.items.floorLife`, blinking) ; `fly` = tossed weapon, knocks down the first enemy (or damages the first prop), costs a use, bounces off and drops. KO'd enemies with `drop` leave their weapon | `createProps spawnItem hitProps blockProps stepItems dropOnKO` |
| `src/sim/weapons.js` | Held weapons (T010), for defs with `pickup`/`toss`: `f.weapon = {def, uses, hit, broken}`; kit moves replace the fighter's (`movesOf attackOf airAttackOf`); a move that lands costs a use, at 0 `weaponBreak` (empty hand finishes the swing). Grab button: holding -> eat food underfoot, else swap for a weapon underfoot (old one flicked aside behind him; only one is ever held), else toss (state `toss`); empty-handed -> grab an enemy in reach first, else eat / pick up the item underfoot. Weapon pickup = state `pickup` (def.pickup stow, reach, rise frames; in hand at the end of the reach; a hit before then leaves it on the floor). A knockdown knocks the weapon loose (`RULES.items.dropOnKnockdown`) | `movesOf attackOf airAttackOf itemUnder pressGrab stepToss stepPickup wearWeapon settleWeapon` |
| `src/sim/waves.js` | Spawns stage waves, loops them tougher | `stepWaves` |

## Render (reads state, never changes it)
| File | Purpose | Exports |
|---|---|---|
| `src/render/renderer.js` | Draw order: backdrop, stage, shadows (fighters, props), landed debris, floor items, far half of wrap swooshes, fighters + props + flying items by depth (rig if `art.rig` and `opts.rig`, else standee), effects, prop effects, HUD, debug | `createRenderer` |
| `src/render/props.js` | Props (bottom centre on their spot, shudder after a hit), floor items (soft glow under them, weapons blink before vanishing; spinning with ghosts in flight), held weapon on a standee (`art.hand`, swung by move phase) | `drawProp drawPropShadow drawItem drawHeldStandee` |
| `src/render/prop-fx.js` | Effects from `propHit propBreak eat pickup itemLand weaponBreak` and `hit` with `move.fx.word`: chips, dust, debris pieces that tumble/bounce/fade (airborne in front, landed on the floor layer), crunch flash, heal number + sparkles, weapon snapping in two, pop-up words (one per swing) | `createPropFx` |
| `src/render/standee.js` | Fighter drawn as a standee: lean/squash/hop per state (block = braced forward lean, jolts back in blockstun; `BLOCK_LEAN` is undone by the rig; grabbed = pulled up by the collar, doubles over on each knee, tips over when hoisted; thrown = tumbles round his middle, pose `cy`) and move phase, flips, flashes, tints | `drawStandee drawShadow poseOf` |
| `src/render/rig.js` | Fighter drawn as a cutout rig: part hierarchy -> buffer, then placed like a standee (lean, flip, flash, tints). Draws swap images (`layoutRig(rig, joints, swap, held)` returns each part's `img`); a swap may `hide` other parts and `carry` children onto points of its image (whole-arm drawings carrying the shield / sword, T012); optional held pose (`cast`). Held weapon: `heldOf(f, rig)` puts the kit's image, grip point (pivot) and size (`art.px / rig.scale`) on the rig's slot part for its grip type (`rig.slots`, e.g. one-hand -> sword); broken = empty hand; also empty while the sword is sheathed (pickup after the stow, a whole swap, first half of a sword draw) | `drawRig layoutRig heldOf` |
| `src/render/rig-pose.js` | Rig pose per state/move phase (waves, windup/through/strike, easing, overshoot) and blending from the last drawn pose; part swaps per pose/phase (switch at once, strike swaps last `timing.swapBack` of recovery); optional pose override. A `through` pose's swaps show only mid-swing (`timing.throughSwap`; slash2's one back-view drawing). Channels: joint angles, dx/dy, `sx` whole-body width (-1 mirrored; slash2's mid-spin), per-part `.sx/.sy` stretch and `.order`. Grab poses: `grabbing`, `knee` (from `grab.knee` frames), `throwWind`/`throwWindBack` (mirrors) then `throwRelease`. Weapon `toss` then `tossRelease`; `pickup` = `stow` (sword swept back to the hip) -> `reach` (crouch, boots flat) -> idle. `squatLayer`: joints pulled toward the `jumpSquat` crouch (T014). `drawLayer`: arm-only sword draw (to the `stow` arm and back up over `timing.drawSword`) after a held weapon is thrown or breaks; `mem.sheathed` hides the sword for its first half. A weapon kit move uses the rig move pose named by its `rig` field (club2 -> slash3). Pure | `targetPose rigJoints drawLayer squatLayer channelsOf jointsOfRig` |
| `src/render/effects.js` | Slash swooshes (optionally `flat` for level sweeps; `wrap` goes round the body, far side drawn behind via `drawBack`), sparks, rings, damage numbers, dust; block clang (bright sparks toward the attacker, shield-side flash, double ring, then a star glint on the shield rim); grab clinch flash, whoosh trail on a thrown body, big impact burst on `thrownHit` (from events) | `createEffects drawSlash` |
| `src/render/jump-squat.js` | Jump squat look (T014): how crouched (0..1) a fighter is drawn: A's `jumpStart`, legs extending over `JUICE.jumpSquat.rise` frames after take-off (A, B), landing squash (B only); 0 when the def's mode is off/absent. Rig mixes toward its `jumpSquat` pose (`squatLayer`), standee squashes | `squatOf squashOf` |
| `src/render/view-pose.js` | View-only test pose on the hero (C = `cast`): plays once for `timing.castHold` s, only from idle, dropped on leaving idle. Pure | `stepViewPose` |
| `src/render/juice.js` | Screen shake + hit-stop counters (from events; `block` uses the blocker's `block.hitstop/shake`; `grab` the holder's `grab.hitstop/shake`; `thrownHit` the thrower's `throw.hitstop/shake`; `propHit`/`propBreak`/`weaponBreak` from `JUICE.props` / `JUICE.weaponBreak`) | `createJuice` |
| `src/render/hud.js` | Portrait, health bars, held weapon + hits left, wave banner, KOs/XP, build label (`BUILD` in config.js), hints, game over (3 run-log lines), pause | `drawHud drawPaused` |
| `src/render/debug.js` | Overlay: floor belt, prop footprints + hp, item pickup zones + state, hurtboxes, hitboxes, states (+ held weapon), AI tokens | `drawDebug` |
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
| `grabs` `throws` | Player `grab` / `throw` events (knees and the thrown body's landing are player `hit` events) |
| `thrownHits` | Enemies knocked down by a body the player threw; their damage counts in `damageDealt` |
| `breaks` | Props the player broke (swing, thrown body or tossed weapon) |
| `foodEaten` `healed` | Food eaten; hp actually restored |
| `weaponPickups` `weaponThrows` `weaponBreaks` | Floor weapons picked up, tossed, worn out (a tossed weapon's hit is a player `hit` event) |

## Lab (tuning page, `lab.html`; never loaded by index.html)
| File | Purpose | Exports |
|---|---|---|
| `src/lab/main.js` | Lab entry: same boot as `src/main.js`, debug on, builds panel, exposes `window.game.lab` | |
| `src/lab/tweaks.js` | Pure model: expands `LAB_SCHEMA` into fields (optional `label`), writes live data objects, defaults snapshot, change list/format, save/load | `createTweaks fieldsOf allFields getPath setPath roundTo` |
| `src/lab/tools.js` | Wraps `game.update`: slow motion, passive rats (holds `ai.cool`), respawn wave. No sim changes | `createLabTools` |
| `src/lab/panel.js` | DOM side panel built from the schema; localStorage persistence | `buildPanel loadSaved` |

## Data (all tuning lives here)
| File | Purpose |
|---|---|
| `src/data/rules.js` | Gravity, hit depth, max simultaneous attackers, knockdown timings, wave delay, side-wall bounce; `items` (item gravity, toss gravity, floorLife/blink, dropOnKnockdown, pop speed); `footprint` (share of body width props block) |
| `src/data/juice.js` | Shake, flash, number, spark, dust, slash look; block clang + glint; grab clinch, held-rat lean, thrown spin, trail, impact; props (hit/break feel, debris), items (floor glow, toss ghosts, pickup pop), weaponBreak; jumpSquat (rise/land frames, landing depth, standee squash) |
| `src/data/controls.js` | Key and gamepad bindings |
| `src/data/moves/*.js` | Move sets: timing, hitbox, damage, knockback, `launch` (knockdown speed), hitstop, shake, pose, fx (`word`: pop-up word); weapon kit moves (`cutlass`, `plank-club`, `big-fish`) add `rig`: which rig move pose they borrow |
| `src/data/fighters/*.js` + `index.js` | Fighter defs: art, body, stats (RPG hooks), speeds (`move.jumpSquat` = squat frames), `jumpSquatMode` ('off' / 'A' sim squat / 'B' look only; T014, user picked A), `block` (optional: walkSpeed, chip, pushback, stun, attackerPush, hitstop, shake), `grab` + `throw` (optional, the holder's numbers), `throwable` (can be grabbed), `pickup` + `toss` (can pick up floor items and throw a held weapon), `drop` (enemy: weapon left on KO + chance), `art.hand` (standee weapon spot), moves, AI params. Registry in index |
| `src/data/items/*.js` + `index.js` | Floor items (T010). Weapon kits: art (img, `px` size, `grip` point, `rest`), `grip` type, `durability`, moves + `attack`/`airAttack`, `toss` (damage, spin, feel). Food: art, `heal`. Registry `ITEMS` |
| `src/data/props/*.js` + `index.js` | Breakable props (crate, barrel): art (+ debris), `body` (w, d = depth blocked, h), `hp` (hits), `drops` (id, `{id: weight}` or null). Registry `PROPS` |
| `src/data/lab-schema.js` | Which data fields the tuning lab shows (`ROOTS` file -> object, `LAB_SCHEMA` sections/sliders, incl. a Stage section for the floor belt + art placement). New tunable = one line here |
| `src/data/rigs/*.js` + `index.js` | Cutout rigs: parts (image, parent, pivot, attach, rest, scale, order, `swaps` = alternate drawings with offset, optional `hide` parts and `carry` children), `slots` (grip type -> part a held weapon replaces) and `-poses.js` (stance, idle/walk waves, state poses, move windup/through/strike, `swap: {part: name}` per pose, test poses like `cast`, blend timing). Registry in index |
| `src/data/stages/*.js` + `index.js` | Stage art placement, backdrop, floor belt, start point, `props` (type, x, y, drops override), waves. Registry in index |

## Tests and tools
| File | Purpose |
|---|---|
| `tests/run.mjs` | `npm test`: runs every `tests/*.test.mjs`; a file that fails to load counts as a failure |
| `tests/sim-smoke.test.mjs` | Bot plays 3 min x 3 seeds headless; checks NaN, fairness, progress |
| `tests/lab.test.mjs` | Lab schema names only existing fields (or ones with a fallback), defaults inside slider ranges, tweak model set/format/reset/load |
| `tests/rat-telegraph.test.mjs` | A player at the rat's attack spot who steps out of the lane 15 frames into the windup escapes the swing; old numbers still catch them |
| `tests/data.test.mjs` | Every fighter/move/stage/wave/art path resolves; rig parts, parents and pose joints resolve |
| `tests/rig.test.mjs` | Rig pose per state, move windup/strike reached, blend start/end, layout order, feet on the ground, walk stride matches walk speed, slash2 spin slash (blade flat behind then in front, one back-view torso frame mid-spin, sim numbers unchanged, swoosh wraps), grab/knee/throw pose keys and the back-throw mirror; A006 swaps (T012): block guard arm + face-on shield + brace head with the shield carried on the fist and blockstun shove, true back view mid-spin and side-on torso on the flat cut, cast on the whole raised arm; whole-limb swaps name known hide/carry parts |
| `tests/view-pose.test.mjs` | C cast pose plays once for castHold from idle, never latches, ignored/dropped outside idle |
| `tests/block.test.mjs` | Frontal hit on a blocker: chip only, no hurt/knockdown, `block` event, attacker shoved; chip never KOs; hit from behind lands; no attacking while blocking; blockstun; rats can't block |
| `tests/grab.test.mjs` | Grab only on the grab button with a throwable rat in reach in front (walking into him, standing next to him or mashing a combo never grabs; not behind, out of depth, too far, attacking/invulnerable; attack wins a same-frame press); knee x3 knocks down; forward throw arcs and bowls a rat over; back and jump throws; break free at holdMax; a hit drops the grab; wall bounce (0 = old clamp); AI tokens/separation round a grabbed rat; grab-and-throw bot 3 min x 3 seeds |
| `tests/standee.test.mjs` | Every standee state (incl. toss) and move-phase pose (incl. weapon kit moves) has finite channels (a missing one makes the fighter vanish) |
| `tests/props.test.mjs` | Crates break after their hp and drop their item (enemy swings don't); H picks up only what's underfoot (an enemy in grab reach wins; walking over never picks up; the pickup takes stow+reach frames); H on a weapon while holding one swaps (old one behind him, out of reach, uses kept); a hit mid-pickup leaves it on the floor; food heals (capped) and is gone, also while holding; weapon moves replace the sword's and return after a break or toss; a tossed weapon knocks down only the first enemy and drops with a use spent; props block (jump clears; rats step round); KO drops (~chance) blink out after floorLife, food stays; knockdown knocks the weapon loose; no props: drops never change the fight; weapon bot 3 min x 3 seeds |
| `tests/jump-squat.test.mjs` | Jump squat (T014): off takes off on the press frame; B's sim trace = off's; A takes off `move.jumpSquat` frames later on the same arc, crouched in `jumpStart`, attack in the squat = air attack; jumping bot 3 min x 3 seeds: off = B exactly, A clean; render crouch per mode (off never, B landing squash); rig `jumpSquat` boots on the floor |
| `tests/runlog.test.mjs` | Bot runs 3 min x 3 seeds; log matches independently counted events (hits, damage, swings, knockdowns, windups cut); idle 1-hp run logs 1 knockdown |
| `tests/bot.mjs` | Scripted player used by tests |
| `tools/key_green.py` | Green-screen keyer for new art; `--scale S` keeps parts cut from one canvas at relative size and prints each trim box (seeds rig attach points) |
| `tools/slice_sheet.py` | Slices a green parts sheet into keyed, trimmed part PNGs by name (reading order) |
| `tools/rig-preview.html` | Rig pose sheet for fitting and screenshots: `/tools/rig-preview.html?cells=standee,idle,slash3:windup,cast&zoom=3` (states, named poses, `move:windup/strike/<frame>`, `walk:<0..1>`; `dots` shows pivots, `fx` draws move swooshes; `held=<item>` puts a floor weapon in the hand and allows its kit moves as cells) |

## Events (sim -> render)
| Event | Payload | Listeners |
|---|---|---|
| `swing` | `{f, move}` move's active frames begin | effects (slash), run log |
| `hit` | `{attacker, target, move, damage, x, y, z, ko, targetPhase}` (`targetPhase`: target's move phase before the hit, `none` if idle) | effects, juice, run log |
| `block` | `{attacker, target, move, damage, x, y, z}` frontal hit stopped by the shield (`damage` = chip, x = shield face) | effects (clang, glint), juice, run log |
| `land` | `{f, heavy}` landed from jump / knockdown | effects (dust), juice |
| `jump` | `{f}` | (none yet; audio later) |
| `defeated` | `{f}` fighter finished their down state at 0 hp | (none yet) |
| `grab` | `{f, target, x, y, z}` f grabbed target (x/z = the grip) | effects (clinch), juice, run log |
| `throw` | `{f, target, dir, back}` the body leaves f's hands (dir ±1; back = thrown behind) | effects (trail), run log |
| `thrownHit` | `{thrower, body, target, damage, x, y, z, ko}` a thrown body knocked target down | effects (impact), juice, run log |
| `propHit` | `{by, prop, x, y, z}` a prop took a hit (`by` = the hero who caused it) | prop fx (chips), juice |
| `propBreak` | `{by, prop, x, y}` a prop broke (its drop is spawned) | prop fx (debris, crunch), juice, run log |
| `itemLand` | `{item}` an item settled on the floor | prop fx (dust) |
| `pickup` | `{f, item, x, y}` f picked up a weapon (`item` = its def) | prop fx, run log |
| `eat` | `{f, item, heal, x, y}` f ate food (`heal` = hp actually restored) | prop fx (heal number), run log |
| `weaponThrow` | `{f, item}` a held weapon left f's hand (`item` = the flying item) | run log |
| `weaponBreak` | `{f, weapon, x, y, z}` a weapon wore out (held or tossed) | prop fx (snaps in two), juice, run log |
| `weaponDrop` | `{f, item, aside?}` f's weapon left the hand without a throw: knocked loose, or flicked aside (`aside`) when swapping for another | (none yet) |
| `wave` | `{n}` | hud banner |
| `gameOver` | `{wave, kos}` | game.js (saves run log) |

## Coordinates
x = left/right, y = depth on the floor belt (bigger = nearer the camera, drawn later), z = height above ground. Screen position = (x, y - z). Timings are frames at 60 fps.
