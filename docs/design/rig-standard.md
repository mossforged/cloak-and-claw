# Rig standard (cutout characters)

Every rigged character follows this. Art packets cite it and only list what differs. Background and sources: `docs/studies/2026-10-16-how-pros-build-2d-rigs.md`.

**Status: APPROVED by the user (2026-10-16); revised 2026-10-17** from `docs/studies/2026-10-17-rig-art-inventory.md` (near/far names, key-drawing library, pose budget required, stretch test, gate order). The Mouse Fighter follows it from A013/A016 on.

## 0. Purpose (agreed with the user, 2026-10-16)
Every rule below must serve one of these. A rule that serves none gets cut.
1. **Faithful:** a rigged character matches its approved art (the standee) on the first try.
2. **Modular variety at low cost:** recolours, clothing, helmets and hats, weapons and magic swap onto shared bodies without redrawing the character.
3. **Whole roster:** every enemy goes through it, so the cast stays consistent.
4. **Judged in motion:** the user judges at a few fixed checkpoints, in motion, not from static mock-ups. (How much of the user's time per character: still open.)
5. **Quality bar:** between "good enough to test without being put off" and Vanillaware polish.
6. **Doable:** tens of images per character, not hundreds of frames.
7. **Scope:** built for Cloak & Claw; if it works, it becomes a reusable skill for other games.

Not chosen: sprite sheets (frame-by-frame, as in Golden Axe or Streets of Rage 4). Each frame is a fresh image, so AI-generated frames drift; every helmet or weapon would have to be redrawn in every frame; and the image count runs to hundreds. Frames are used only for short effects (section 7b).

## 1. The four gates (in order; nothing skips ahead)

| Gate | Who makes it | What the user judges |
|---|---|---|
| **G1 Master** | Art | Is this the character? (the master beside the standee, at full size and game size) |
| **G2 Parts** | Art, then Code's rig bench | Do the parts reassemble into the master? (automatic overlay; no visible drift) |
| **G3 Motion test** | Code (rig bench, standard strip) | Does it look alive in motion? Which moves need key drawings? |
| **G4 Libraries and gear** | Art | Key drawings, gear overlays, colour tints, each checked in motion |

G1 is cheap and catches the expensive mistake (a different character). Don't draw parts before G1 passes.

## 2. The master (G1)
- Start from the character's **approved standee** (art bible) as an input image. **Redraw that character; don't design a new one.** Same proportions, limb thickness, outfit, colours.
- **Master pose = a neutral setup pose, not the game stance** (revised 2026-10-17; the old rule baked one action pose into every part). Three-quarter view facing right (style contract), upright in the character's natural posture (a rat may keep a slight hunch in the torso and neck), and:
  - **legs** both under the hips, roughly the same visible length, near leg slightly forward, knees bent about 10-20 degrees, feet flat on the floor line, no foreshortening;
  - **arms** hanging down and slightly away from the body (about 20-30 degrees), elbows slightly bent, nothing crossing the torso, hands as relaxed fists, fully visible;
  - **no held weapon** (weapons are items; the grip hands are drawn separately);
  - **cloth that crosses a joint** (baggy trousers, skirts, long sleeves) is drawn so it can be cut into a pelvis piece plus one piece per limb, with overlap, not as one shape spanning hip and thigh;
  - tail and cloth tails hanging naturally, in 2-3 segments' worth of length.
- The game stance (crouch, lunge, guard) is **posed by the rig** afterwards. The standee remains the identity reference beside the master in every review.
- Also deliver `master-back.png`: the same character from behind, in the same setup pose (for the back torso and back-of-head swaps).
- Canvas **1536 x 2304, #00FF00**, character silhouette about **1350 px tall**, feet on a marked floor line.
- The master is the single source of truth. Every later image is cut from it or drawn over it.
- Why: the rat's A010 master was a lunge with the sword arm wound back, so his near arm was cut short and folded (no low overhand grip, T020) and his legs came out at different lengths (the walk, T018); the mouse's wide stance forced a hip-narrowing hack (T023). Professional rigs are cut from a neutral setup pose (Spine's setup pose, Live2D's front-facing neutral).

## 3. Standard biped part list (fixed names)
Names are identical for every biped, so poses, weapon kits and gear transfer between bodies. **Depth words only:** `near` = the camera side, `far` = away from the camera. `lead` / `trail` are gait words used only in pose descriptions, never in part names. `back` is reserved for the back **view** (`head-back`, `torso-back`). (Decision 2026-10-17; A013 and earlier deliveries use `front/back` for near/far and the importer accepts both.)

| Group | Parts |
|---|---|
| Core | `pelvis`, `torso`, `head` |
| Near arm | `arm-near-upper`, `arm-near-lower`, `hand-near` |
| Far arm | `arm-far-upper`, `arm-far-lower`, `hand-far` |
| Near leg | `leg-near-upper`, `leg-near-lower`, `foot-near` |
| Far leg | `leg-far-upper`, `leg-far-lower`, `foot-far` |
| Cloth / tail (as the character has them) | `tail` (2-3 segments with rounded overlaps), `scarf-tail`, `cape`, `ear-far` etc. |

About **15 core parts plus 1 to 3 extras**. Hands, feet and pelvis are always separate. Placeholder paths never carry a colour or a character name (`torso/side`, not `red-torso`).

## 4. Swap and key-drawing library (planned up front, per the character's pose budget)
Same canvas; each swap shares its part's pivot so it drops in place. The study (2026-10-17) found that a rigid-part rig's missing category is not more hands or heads but **whole-limb key drawings for poses past the rigid-part limit** and **per-view torsos**. Every biped's sheet starts from this table and removes what its state list never uses (a grunt drops the back torso, knee-up leg and shout head).

| Slot | Essential (hero) | Polish |
|---|---|---|
| `head` | `neutral`, `attack`, `hurt`, `effort`, `ko`, `back` | `front` (turn midpoint), `shout`; 3-5 face-detail overlays (7a) |
| `torso` | `three-quarter` (default), `side` (thrusts), `back` (spin, back throw, roll), **`front`** (turned toward the camera: every swing's strike, turn-around, throws), **`away`** (back three-quarter: every wind-up and telegraph) | `hunched` (block, crouch, chop strike), `lean-back` (overhead wind-up, hurt snap) |
| `pelvis` | three-quarter, **`side`, `front`, `back`** (one per view the hips take) | - |
| shoulder caps | **`shoulder-near`, `shoulder-far`** (the shoulder top that shows when that arm swings in front of the body) | - |
| `hand-near`, `hand-far` | `open`, `fist`, **split grips** (5b rule 2: the face the camera sees, in front of the handle, plus the wrapping fingers or thumb behind it; one pair per hold in the character's hand table) | `grip-overhand`, `pinch` (bow, potion), `palm` (block, push), `shield` (far, shield users) |
| `arm-near` whole-limb | `raised` (cast, overhead; carries the item), `cocked` (wound past 90 degrees: heavy wind-ups, telegraphs) | `smear` per swing family |
| `arm-far` whole-limb | `guard` (block; carries the shield), `raised` (two-hand cast, bow draw) | - |
| `leg-near` whole-limb | `knee-up` (grab knee, jump tuck), `kneeling` (get-up, revive, downed, stun) | - |
| `leg-far` whole-limb | `folded` (squat, land, crouch, lying) | - |
| `foot-near`, `foot-far` | `flat`, `toe-off` (heel raised: walk, run, stepping attacks) | `heel-strike`, `out` (turned out, planted stances) |
| joint patches | - | elbow x2, knee x2 fill caps, only where the stretch strip shows a gap |

**Views (added 2026-10-17, the T026 lesson):** a body that swings anything turns its chest into the swing; a rigid rig whose torso never changes view can only sweep an arm across a still body. Every torso and pelvis view carries its own joint points (`anchors`) and its own draw order (section 6), and the turned views are **essential for every weapon user, grunts included**. The study rated the turned torso polish and dropped views from the grunt kit; both were wrong. The first full body (the rat) is built to the hero polish tier plus views: `rigs/rat-raider-rehearsal.md`.

Hero: **40 drawings essential, ~62 polished** (before views). Grunt: 27 / 33. Brute: 24 / 29. Caster: ~30. Floating caster: 7-11. Serpent: 4-5. Boss: 40-45. Full tables, non-biped templates and the per-state pose budget: study 2026-10-17, sections 3-4.

**Whole-limb drawings** replace their rigid parts for that pose (`hide` list in `rig-source.json`), carry the held item where the arm does (`itemGrip`, `slotDirection`), and are cut from the master and inpainted, never generated from scratch.

## 5. Drawing rules (G2)
1. **Cut, don't regenerate.** Each part is cut from the master along its joint lines. Use the image tool only to **paint in what was hidden** (shoulder under the sleeve, thigh under the tunic, the hip behind the near leg). A limb must never be generated from scratch, because separate generations drift into a different character.
2. **Hidden areas painted** at least one joint-width past the visible edge.
3. **Hidden overlaps (revised 2026-10-17):** at every joint the child's end continues **underneath** the neighbouring piece (the shoulder under the vest edge, the wrist under the bracer, the tail root under the trousers, the hip under the pelvis), so the overlap is never seen. Where the joint is visible the outline continues unbroken. **Nothing visible is a geometric circle, disc, hole or unoutlined ball** (the old wording, "a near-circle around the pivot", was painted literally on the rat in A018/A019: fur-ball shoulders, discs at the wrists). If no neighbour covers the joint across its range, extend the neighbour's edge (e.g. the torso's vest edge) to cover it. Grip hands follow 5b rule 2 (split around the handle, face per the hand table), never a round hole. (Supersedes "seen from the side with a narrow slot", 2026-10-18.)
4. **Pivots marked in `rig-source.json`** (one per delivery), as **measured canvas points**, not estimates. Because every part sits on the shared canvas exactly where it is in the master, a joint is one canvas point shared by parent and child:
   ```
   { "canvas": [1536, 2304], "master": "reference.png", "floorY": 2190,
     "parts": { "pelvis": { "img": "pelvis.png", "parent": null, "pivot": [760, 1640], "band": 400 },
                "leg-front-upper": { "img": "leg-front-upper.png", "parent": "pelvis", "pivot": [700, 1660], "band": 500 } },
     "swaps": { "hand-front-grip": { "img": "hand-front-grip.png", "of": "hand-front" } },
     "overlays": { "detail-eyepatch": { "img": "detail-eyepatch.png", "on": "head" } } }
   ```
   `pivot` = the joint where the part meets its parent (the root part's pivot is its centre of rotation). Swaps share their part's pivot. `band` = draw-order band (section 6). Code's rig bench (`tools/rig-bench.html?src=<ID>-<slug>`) and importer (`tools/rig_from_source.py`) read this file. Optional `dir`: a folder for the images when the file lives elsewhere (Code's test fixtures); Art's deliveries leave it out.
5. **Uniform scale only.** No stretching. If the rig needs a size fudge over 5% on any part, the art goes back.
6. **Swaps share the pivot** of the part they replace (same joint point on the canvas).
7. Light from upper left, bold dark outline, no ground shadow (style contract).

### 5a. Weapons (items)
Held art = floor art (decision 2026-10-16). Each item declares a **handle axis** (`grip` at the pivot, business end along +X via `gripEnd`), `grip2` for two-handers, `tip`, and a `stow` anchor. In game the weapon is a node of its own; the hands reach its grip markers and copy its rotation (T025), so overhand, underhand and reverse holds are data. Hands are never painted onto weapons. Per weapon: one drawing, optionally one angle-specific drawing where a flip reads wrong, smears as polish; a bow's arrow is its own attachment; a shield needs the far-hand `shield` drawing.

### 5b. Anatomy rules (added 2026-10-18; checked by name, not by eye)
Why: the lead's eye misses small anatomy (a palm where a hand's back should be, a foot painted over a trouser leg, a waist that opens). These rules come from the draw order of real rigs (study 2026-10-18, "Joint rules from real rigs") and can be checked from the rig data. Each character's rig sheet lists how it meets them; the user checks the sheet once, before Art draws (decision 2026-10-18).
1. **Who covers whom at each joint** (every view; per-view bands in section 6 keep these pairs):
   | Joint | On top | Underneath, extending up under it |
   |---|---|---|
   | ankle | shin (`leg-*-lower`, or the trouser hem) | foot |
   | knee | shin | thigh |
   | hip (three-quarter) | near thigh over the pelvis, its top hidden under the torso and belt cover; pelvis over the far thigh (as Spineboy; the real rigs differ here, so each view names it) | thigh tops |
   | waist | a **belt cover** (its own piece on the pelvis, drawn just above the torso) | torso's lower edge and pelvis top, both |
   | shoulder | torso edge or shoulder cap (whichever the view puts in front) | upper arm top |
   | elbow | forearm | upper arm |
   | wrist | bracer or cuff (forearm, or its own piece) | hand |
   | tail root (three-quarter, side, front) | pelvis | tail |
   | tail root (back, turned-away) | **tail**, its root painted as a finished end on the seat (user, 2026-10-18: "the tail should be rendered over the back view ... so it looks like it's ending on his body") | seat |
2. **Hands: which face the camera sees** (three-quarter, facing right). Every hold names one face per hand in the rig sheet's hand table, and every pose uses the drawing for that face. Default, to be confirmed per hold in the user's anatomy pass:
   - **Near hand holding something in front of or beside the body: the back of the hand** (knuckles toward the camera), the fingers wrapping out of sight behind the handle.
   - **Far hand holding something in front of the body: the palm side**, the fingers curling round the handle toward the camera.
   - Open-hand moves (palm push, block, cupped spell) show the palm by design; the table says so per move.
   - **The back of a hand is solid** (user, 2026-10-18): no gap or slot shows through it, and the held object passes **underneath** it, never on top.
   - A grip is **split around the handle**: the face in front of the handle is one piece, what wraps behind it is a second piece under the handle (Spine's sword hero and goblins). The handle never passes through a painted hole or slot.
3. **Cover pieces where a joint has no natural cover:** belt (waist), shoulder caps, bracers, trouser hems. A cover is its own small drawing on the parent's pivot, so the two pieces it joins never have to line up exactly.
4. **Hidden length through the full range:** every covered end continues underneath far enough to stay hidden at the joint's most extreme angle in the character's rehearsal (not just at rest). Measured by the pose seam test; the rig sheet lists each joint's range.
5. **Gaps block reviews:** a move with a seam-test flag is not sent to the user for a look until the flag is fixed or explained in the review note.

## 6. Draw order (depth bands)
`hand-far`, `arm-far-*`, far weapon (100s) < `leg-far-*`, `foot-far` (200s) < `tail`, cape back (300s) < `pelvis` (400) < `leg-near-*`, `foot-near` (500s) < `torso` (600) < gear on torso (650) < `head` (700) < gear on head (750) < `arm-near-*`, `hand-near`, held weapon (800s). Inside each limb the 5b covers hold: shin over foot, forearm over upper arm, cuff or bracer over hand. Swaps and gear inherit their part's band. **Exception:** the far hand on a two-handed item draws in an overlay band above the shaft (850), so it is never hidden.

**Per view (2026-10-17):** the bands above are the three-quarter view. Side and front bring the near arm wholly in front of the torso (800s) with its shoulder cap on top; away puts it wholly behind; back brings the far arm in front with its cap and swaps the legs' depth, the tail drawing in front of the pelvis. Inside a move the switch happens on a named key (the frame where the hand passes the edge of the body), never as a blend; a pose may also override a part's band (a shield guard in front of the chest). Table: `rigs/rat-raider-rehearsal.md`.

## 7. Gear and colour (G4)
- Gear overlays are drawn **over the approved master** (head and torso as they will be in game), after G3.
- Each gear piece must fit every head swap; deliver named variants where it can't (`gear-helmet-hurt.png`).
- **Colour variants by tint in code:** mark recolourable regions (clothes, bandana) as a separate grey mask layer per part (`torso-mask.png`) so code can tint them without repainting.

### 7a. Individual variety (so three archers don't look identical)
Classic beat 'em ups mostly reuse one drawing per enemy type and tell variants apart by colour and name (Final Fight's thugs are the same sprite in different colours). Our rig can do better cheaply, because a variety piece is one small image that works in every pose. Each enemy spawned picks a combination; code chooses at random from the type's allowed list (seeded, so runs replay the same).
- **Face details:** small overlays on the head that fit **every expression** of that head (neutral, attack, hurt, effort, KO): eye patch, extra scar, torn or notched ear, whisker style, an earring. 3 to 5 per body, drawn with the head swaps.
- **Fur and clothing tints:** a slight random shift on the fur and recolourable clothes within a range the type allows (masks from section 7).
- **Gear picks:** an optional piece from the type's gear list (a cap or no cap, a different belt).
- **Size:** a small render-only scale change (about plus or minus 4%); hit areas stay the same.
Enemy types still read at a glance by silhouette and gear (archer hood, spearman helmet); variety only makes members of the same type individual.

## 7b. Effects and magic
A spell or special move is three separate things, so one effect serves many characters:
1. **Pose** from the rig: a cast uses the `effort` head plus a raised or reaching arm from the swap library.
2. **Effect art,** drawn separately and never painted onto a body part: a short frame sequence (4 to 8 frames: charge, burst, projectile loop, impact) or a single glowing part the code scales, spins and fades. Glows and sparks are drawn on transparent/green, meant for **additive** blending (as Vanillaware draws its glows).
3. **Colour** by tint in code, so one drawing serves several schools of magic or enemy types (a fireball tinted blue becomes frost).
Effects attach to a named point on the rig (`hand-front` tip, weapon tip, chest), the same way held weapons use grip points.

## 8. Rig bench and motion test (G2, G3; Code's tool)
- **Fit overlay:** load the source parts and `rig-source.json`, assemble at rest, and draw them over the faded master; flag drift in proportion or position.
- **Standard motion strip:** stance, idle breath, walk cycle, attack (windup, strike, follow-through), hurt, knockdown, get-up; played live at game size beside the standee, with an exported strip image for the review.
- **Stretch strip (G2 artefact, T024):** every joint at 90 and 150 degrees, arm straight up, each torso view, each hand and foot alternate, each hand holding each item at every grip mode, a crouch and a lying pose with the **floor line drawn**, the rig at 0.96x / 1.04x / 1.4x; exported as one JPG and run headless in `npm test`, failing on a seam gap over 2 px, a foot below the floor, or a hidden far hand.
- **Paint check (G2, added 2026-10-17):** the rest assembly is compared with the master **colour for colour**, not only by outline; strong differences inside the silhouette (painted discs, holes, mismatched repaint) are flagged with a map. Every cut is also checked for detached islands. The T026 rat passed the outline fit and the stretch test but looked pieced together; this check catches that before the user sees it.
- **Floor-line rule:** in grounded states leg IK targets clamp to the floor; a pose lifts a foot only by naming it.
- The user judges G3 here, in motion, before anything is imported into the game.

## 9. Per-character rig sheet (one file per character: `docs/design/rigs/<id>.md`): **written before any art is requested**
Holds: standee reference; master status; part list (marking extras); the swap and key-drawing library with each drawing's state (ordered / source / game-ready); the **pose budget** (each state the character has or is planned to have -> the drawings it consumes, from the study's section 4 tables); items and sockets; gear and tint regions; gates passed. **Rule:** a move packet whose pose budget names a drawing that is not yet game-ready is rejected at planning, not discovered in review. Art packets reference the sheet, not the generic list. First sheet: `rigs/mouse-fighter.md`.

### 9a. Sockets
Every rig declares named attachment points for effects and items: `hand_near`, `hand_far`, `weapon_tip`, `chest`, `head_top`, `feet`, `mouth`, `tail_tip` (`saddle` for mounts). The importer derives defaults from pivots.

### 9c. Move rehearsal (before any body art; added 2026-10-17)
Before art is ordered for a body, every move it may ever do is walked **key by key**: which way the chest and hips face (view), which limbs are in front of the body, which drawings each key uses. Written as `rigs/<id>-rehearsal.md` and laid out by Code's rehearsal sheet (`viewer.html?rehearse=<id>`: every move's keys at game size, missing drawings as labelled red boxes, reviewed on the phone). Anything a key needs that the kit lacks is ordered with the body, not discovered in review. The rat's gaps (no turn, missing views) came from skipping this.

### 9b. Gate order
Rehearsal (9c) -> body (master, cut parts, rounded joint ends, stretch strip passed) -> pose-budget drawings -> gear on the frozen canvases -> moves (each packet citing its pose-budget rows, shipping a motion strip and the stretch strip). Weapons gate separately on handle-axis data and a grip test across every body that can hold them.

## 10. Rig art packet checklist (lead)
- [ ] Cites this standard and the character's rig sheet; names only the differences.
- [ ] Every drawing ordered is a row in the rig sheet's library with a state that consumes it.
- [ ] One gate per packet: G1 master, G2 parts, or G4 libraries. G3 is a code task.
- [ ] Standee named as the input image; master is a redraw, not a new design.
- [ ] Review shows the result beside the standee at full size **and** at game size.
- [ ] Gear and variants wait until the body passes G3.
