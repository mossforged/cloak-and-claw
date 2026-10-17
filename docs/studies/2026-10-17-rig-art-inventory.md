# The rig art inventory: every drawing a brawler character needs, and the process that stops us finding gaps in motion

*Study, 2026-10-17. Not a decision document: what we adopt goes to `docs/decisions.md` and `docs/design/rig-standard.md`. Research notes behind it: five parallel research tracks (move inventories, professional part lists, gear/weapon/recolour systems, cutout walk/grip/bend techniques, effects and non-biped rigs) plus our own repo history.*

## Where the project stood

- **Stage 4** (repeatable rig pipeline + combatant standard) just started; the home loop and stronghold concepts (A014, A015) put on hold the same day. The user: lock down a robust, repeatable rigging system and the core combat before bigger-picture items.
- **Last merged:** T022 helping in the fight (code), A013 Mouse Fighter to the rig standard (art), A014 stronghold concepts (art, parked).
- **Pushed, not yet reviewed:** T023 (new Mouse Fighter imported, attack footwork).
- **Being discussed:** whether to switch to Spine (editor $379 Professional, community MCP, trial can't save) or keep our runtime and add what it lacks; the user's concern that "we're not generating all of the parts we need for a model to be able to do a wide range of the sorts of things we ask it to do", citing the walk (4 rounds, T018) and weapon grips (4 rounds, T020).
- **Why this study:** the user asked for the comprehensive list of art elements needed to build and animate heroes and enemies (attacks, movement, jumps, magic, generic motions), supporting clothing, item/weapon swaps, recolours and per-unit variety, using what we've learned and fixing the issues the process uncovered.

---

## 1. The finding in one paragraph

Our part list was never the problem. The standard's 17 rigid parts match professional cutout rigs: Spine's own Spineboy has 20 body image slots and alternate drawings in only three of them (fist, eye, mouth); Goblins has one drawing per part; the Spine "Hero" sword example performs its whole attack set with zero drawing swaps. Those rigs buy their range with **meshes, IK and whole-figure key art for signature moves** (Darkest Dungeon's attacks are "static sprites"; Wildermyth's paper doll carries an alternate whole arm just for its two-handed pose). Our runtime has no meshes, so the equivalent is a small set of **whole-limb key drawings for poses past what rigid parts can reach** (a folded leg, a kneeling leg, a knee-up leg, a cocked arm, toe-off feet) plus **per-view torsos** (side, back). The Mouse Fighter's 35 images lacked exactly six of those, and each of the six is used by a dozen states. That is why the walk, the grip, the block, the spin, the cast and the grab each cost 2 to 5 rounds. The other half of those rounds were **runtime problems in art's clothing**: feet off the floor line, a hand that should follow the weapon instead of the reverse, a far hand that should draw above the shaft. No drawing would have fixed those.

The process fix is equally specific: the per-character **rig sheet with a pose budget** that the standard already calls for (section 9) was never written, so Art drew from the generic list and the gaps surfaced in motion. Write it, gate every move on it, and add a **stretch test** to the bench so the rig's limits are found by a script, not by the user playing.

## 2. What the professionals actually ship (numbers)

| Rig | Bones / image slots | Alternate drawings | How big moves are done |
|---|---|---|---|
| Spineboy PRO (Spine example) | 67 / 20 body slots | front fist open+closed, 2 eyes, 3 mouths | meshes on torso, head, shin, feet; IK foot targets |
| Spineboy ESS | 18 / 20 | same | no meshes at all; still runs, jumps, shoots |
| Goblins (Spine) | 21 / 23 | none; weapons as a shared skin (dagger, spear, shield); a thumb overlay over held items | bones only |
| Hero (Spine sword example) | 44 / 31 | **zero** swaps in any animation, including attacks | bone keys + one body mesh for the head turn |
| Mix and Match (Spine) | 143 / 80 slots / 34 skins | whole wardrobe as skins | skin placeholders on fixed canvases |
| Wildermyth paper doll | layers with depth numbers | hands closed/open/book; **alternate upper+lower arm for the two-handed pose** | one-handed / two-handed rig modes; grip + stowed positions per weapon |
| Darkest Dungeon | several small Spine skeletons per hero | attacks are "static sprites of their attacks" | one key drawing per skill |
| Streets of Rage 4 (frame-by-frame) | ~1,000 frames per hero, 300-400 per enemy | n/a | hand-drawn |
| **Our Mouse Fighter (A013)** | 17 parts | 18 swaps (6 heads, 3+4 hands, 2 torsos, raised arm, guard arm, out-turned foot) | rigid parts + 2-bone IK |

Two conclusions. **We are already denser in swaps than any Esoteric example**, so "more hands and heads" is the wrong direction. And **the enemy-to-hero cost ratio is about one third** (SoR4), because enemies drop combos, grab chains, specials and item states; our grunt kit below follows that.

## 3. The master checklist

Counts are drawings (PNG files cut from the master or generated on the same canvas), not bones. **E** = essential: every move the game has today reads correctly. **P** = polish. Everything is drawn facing right and flipped in code. Names below use **near/far** (see section 7 on naming).

### 3a. Biped hero (Mouse Fighter; the badger later uses the same slots on a bigger canvas)

| Slot | Default | Essential alternates | Polish alternates | E / P |
|---|---|---|---|---|
| head | neutral (three-quarter) | attack, hurt, effort, ko, back | front-ish (turn midpoint), shout | 6 / 8 |
| face overlay | none | - | eyes-closed; per-unit marks (scar, patch) | 0 / 2 |
| torso | three-quarter | **side** (thrust, horizontal cut), **back** (spin, back throw, roll) | hunched (block, crouch), twisted toward camera (cross cut, hip toss) | 3 / 5 |
| pelvis | one | - | side | 1 / 2 |
| near arm (upper + lower) | two rigid pieces | **whole raised arm** (cast, overhead), **whole cocked arm** (wind-up past 90 degrees, telegraphs) | smear arm per swing family (horizontal, overhead) | 4 / 6 |
| near hand | open | fist, grip-side | **grip-overhand** (handle across the fist, seen from the front), pinch (bow), flat palm (block, push) | 3 / 6 |
| far arm (upper + lower) | two rigid pieces | **whole guard arm** (block), **whole raised arm** (two-hand cast, bow draw) | - | 4 / 4 |
| far hand | open | fist, grip-side | shield-strap, pinch, flat palm | 3 / 6 |
| near leg (upper + lower) | two rigid pieces | **whole knee-up leg** (grab knee, jump tuck, squat), **whole kneeling leg** (get-up, revive, downed, stun) | - | 4 / 4 |
| near foot | flat | **toe-off** (heel raised) | heel-strike, out-turned (stance) | 2 / 4 |
| far leg (upper + lower) | two rigid pieces | **whole folded leg** (squat, land, crouch, lying) | - | 3 / 3 |
| far foot | flat | **toe-off** | heel-strike | 2 / 3 |
| tail | 2-3 segments, rounded overlaps | - | - | 3 / 3 |
| scarf / cloth | 2 segments | - | - | 2 / 2 |
| joint patches | none | - | elbow x2, knee x2 fill caps | 0 / 4 |
| **Total** | | | | **40 / 62** |

**Against A013:** the mouse lacks the cocked near arm, the knee-up near leg, the kneeling near leg, the folded far leg and both toe-off feet. Those six are the whole list of what broke the walk stride, the attack footwork, the grab knee, the get-up and every heavy wind-up. (He has the out-turned foot, a polish item, because we asked for it before we knew what was essential.)

### 3b. Biped grunt (rat family, Skeletal Mouse)

Reuses the hero slots minus the scarf, and drops every alternate tied to a state it never enters (no back torso, no knee-up leg, no shout head). It must keep the telegraph and the **victim side of grabs**: an enemy without a thrown pose literally breaks (SoR2's prototype Donovan "turns into Galsia while airborne").

| Slot | Default | Essential | Polish | E / P |
|---|---|---|---|---|
| head | neutral | attack, hurt, ko | effort (telegraph) | 4 / 5 |
| torso | three-quarter | side (thrust types only) | - | 2 / 2 |
| pelvis | one | - | - | 1 / 1 |
| near arm (2) | rigid | whole cocked arm (telegraph) | - | 3 / 3 |
| near hand | fist | grip-side | open (weapon drop), pinch (archer) | 2 / 4 |
| far arm (2) | rigid | - | whole raised arm (two-hand weapon, bow) | 2 / 3 |
| far hand | fist | grip-side | shield-strap | 2 / 3 |
| legs (4 rigid) | rigid | kneeling leg (get-up) | folded leg (jumpers) | 5 / 6 |
| feet (2) | flat | toe-off x2 | - | 4 / 4 |
| tail | 2 segments | - | - | 2 / 2 |
| **Total** | | | | **27 / 33** |

A rat family (raider, spearman, archer, shield-bearer, captain) shares this body; each type is the weapon item plus one or two swaps and a colourway row. This is Final Fight's practice (Bred, Dug, Jake, Simons: one body, different trousers).

### 3c. Brute (Rat Brute, barrel thrower)

| Slot | Default | Essential | Polish | E / P |
|---|---|---|---|---|
| head | neutral | roar (telegraph, phase), hurt, ko | - | 4 / 4 |
| torso incl. belly | three-quarter | - | leaning back (slam wind-up) | 1 / 2 |
| pelvis | one | - | - | 1 / 1 |
| arms (2 x 2 rigid) | rigid | **both whole raised arms** (overhead lift, slam, barrel) | smear arm (slam) | 6 / 7 |
| fists (2) | closed | open x2 (grab reach, barrel release) | - | 4 / 4 |
| legs (4 rigid) | rigid | kneeling leg (stagger) | - | 5 / 5 |
| feet (2) | flat | - | toe-off | 2 / 3 |
| armour / shell overlay | intact | - | cracked, broken (HP thresholds) | 1 / 3 |
| **Total** | | | | **24 / 29** |

Brutes usually skip light hurt (super armour), so no hurt torso. The raised arms serve the barrel lift and are the slam telegraph held 20-30 frames.

### 3d. Caster and ranged (biped)

The hero kit with the arm emphasis inverted: **both whole raised arms essential** (cast loop, release), staff or orb as an item, an aura socket behind the body, a hood or hat overlay; minus the knee-up leg, back torso and smears. **About 30 drawings.** The ranged variant swaps the aura for the pinch hand and adds the **draw key**: far arm raised and pulled back, which is the drawing our archer lacked when the user said he "could be drawing the string back further". A **floating caster** (wisp, ghost) is far cheaper: robe, head, hood, two arms of two parts, staff, 2-3 wisp segments, aura: **7-11 drawings and no walk cycle**.

### 3e. Non-biped templates (planning estimates, synthesised from Spine's creature examples; no shipped animal brawler publishes its creature part lists)

| Template | Rigid parts | Swaps | Total | Walk / attack / hurt |
|---|---|---|---|---|
| Quadruped (fox, badger on all fours) | body incl. neck, head, jaw, ear, tail x2-3, four legs x2 pieces (12) | jaw open, eye pain, front-facing head (turn), paw spread (4) | ~16 | two key poses per step, back pair a quarter cycle behind the front; bite = hips forward + jaw swap; hurt = whole body rotates about the hip |
| Insect / beetle | shell, thorax, head, mandibles, antennae x2, 3 near + 3 far legs, wing-case halves (14) | mandibles open, curled legs, cracked shell, raised wing cases (4) | ~18 | tripod gait; charge = thorax down, mandible snap; hurt = flipped with curled legs |
| Serpent / adder | head, jaw, **one body segment reused 8-12x**, tail tip (4 unique) | jaw open (1) | **4-5** | chain-follow (Spine's Tank/Stretchyman pattern); strike = coil 20-30 frames then a 3-frame lunge |
| Bird / flyer | body, head, beak, tail fan, near wing, far wing, legs (8) | beak open, tail spread, 3-5 wing stroke frames per wing, tucked legs | ~18-21 | wing frames swapped in one slot (Spine's Dragon: nine region drawings per wing) |
| Floating caster | robe, head, hood, arms, staff, wisps (9-11) | hurt head, aura (2) | ~11-13 | sine hover, no walk |

Build order by cost: serpent (needs chain-follow), floating caster (no walk), quadruped, then beetle and bird once chain-follow and frame-swap slots exist.

### 3f. Boss (Bramble Brute)

The brute E kit at 2-3x resolution (24), plus three damageable slots with ordered intact/cracked/broken drawings (9), a phase-change head and torso (2), one or two whole-figure death keys (2), an entrance key (1), per-special key drawings (2-4): **about 40-45 drawings.** Spine's Alien shows the mechanics: breakable parts parented outside the head hierarchy so they fly off on death; damage states as alternatives in one slot; strength tiers as scale plus hue of the same rig.

### 3g. Sockets and canvases every body declares

Named attachment points so effects and items attach without per-character code: `hand_near`, `hand_far`, `weapon_tip`, `chest`, `head_top` (status markers), `feet` (shadow, dust, rings), `mouth` (breath, bite), `tail_tip`, `saddle` (mounts). **Fixed canvas per slot** (one head canvas, one torso canvas, one one-hand-weapon canvas, one two-hand-weapon canvas) so any alternate drops in without re-offsetting. Spine states the rule flatly: template images must match the size of every alternative; if sizes vary, use several templates.

## 4. The pose budget: every state mapped to the drawings it consumes

This is the table the standard's section 9 asked for and nobody wrote. Frame defaults are Rivals of Aether's documented values (jump squat 4, landing cancellable after 4, light flinch 24, heavy flinch 46, get-up 30 with 22 invulnerable, grab startup 8, item pickup 7), which transfer to a 60 Hz belt scroller.

### 4a. Hero states

| State | Tier | The rig does for free | Drawings consumed | Other view? | Feet off floor? |
|---|---|---|---|---|---|
| Idle loop | E | weight shift, breath | neutral head, fists, flat feet | no | no |
| Fidget after N s | P | 1-2 keys | effort or shout head | no | no |
| Walk (9 keys, last = first) | E | hip bob low/high on alternate keys, IK foot targets on the floor line, foot-tip rotation | **toe-off foot x2**; folded far leg at the passing key if the step is high | no | one foot at a time |
| Back-walk | E | walk reversed | none | no | no |
| Run | P | lean, long stride | toe-off feet; one key with both feet up | no | one key |
| Run stop / skid | P | brake pose + dust | none | no | no |
| Turn-around | P | scaleX through 0 at the midpoint | front-ish head and torso for 2 frames | front | no |
| Jump squat (4f) | E | crouch | **folded legs** | no | no |
| Jump rise / apex / fall | E | arms up, legs tuck then extend | knee-up leg, folded far leg | no | yes |
| Land (actionable f4) | E | absorb crouch | folded legs | no | no |
| Slash 1 (cut) | E | lead-arm swing, small step | grip hand, attack head, toe-off rear foot | no | no |
| Slash 2 (cross) | E | torso turns ~45 degrees toward camera | twisted torso (P) or three-quarter; cocked arm in the wind-up | partial | no |
| Slash 3 spin (finisher) | E | 3-4 key rotation | **back torso, back head**, attack head, smear arm (P) | **back** | yes |
| Horizontal cut / thrust (kits) | E | arm extends | **side torso**, grip-side hand | **side** | no |
| Jump slash | E | flying pose | knee-up leg, grip hand | no | yes |
| Dash attack / bash | P | forward lean | cocked arm, toe-off | no | low |
| Back attack | P | torso twist | none | no | no |
| Charge attack (hold + release) | P | arm cocked, tremble | cocked arm, effort head, charge glow fx | no | no |
| Block / brace loop / block hit | E | forearm up, recoil | **guard far arm**, brace (effort) head, flat palm (P), hunched torso (P) | no | no |
| Block shuffle footwork | E (user note) | small IK step | toe-off foot | no | no |
| Hurt light (12-24f) | E | head snap, lean, one foot slides | hurt head | no | no |
| Knockdown (air, bounce, lying) | E | whole-rig rotation, arms flung | ko head; lying = rotated rig with folded legs | no | yes, then floor |
| Downed (needs revive) | E | lying loop | ko head | no | no |
| Get-up (30f) | E | lying to kneel to idle | **kneeling leg** | no | no |
| Grab reach / hold | E | hands forward, open then closed | open hands, fists | no | no |
| Grab knee | E | hip thrust, one foot lifts | **knee-up leg**, grip hand on the sword arm | no | one foot |
| Forward throw (hip toss) | E | torso turns toward camera | front-ish torso (P) | partial | no |
| Back throw / suplex | E | hero arches back | back torso and head | **back** | yes |
| Pickup / stow / draw (7f) | E | crouch, hand opens then closes | folded legs, open hand, grip hand | no | no |
| Cast (loop + release) | E | arms raise, head tilts back | **whole raised near arm**, raised far arm for two-hand casts, effort head | no | no |
| Potion toss / drink | P | overhand release; bring to face | open hand, pinch hand | no | no |
| Revive hold | P | kneel beside ally | kneeling leg | no | no |
| Victory / taunt | P | arms raised, 2-4 keys | shout head | no | no |
| Dodge / roll | P | tucked roll, 3-4 keys | back torso and head mid-roll | back | yes |
| Stun / dizzy | P | wobble loop | ko head + stars fx | no | no |
| Burn / shock / freeze | P | tint or silhouette flash | none | no | no |

### 4b. Enemy states

| State | Tier | Free rig motion | Drawings consumed |
|---|---|---|---|
| Menace idle | E | fists up or weapon ready | neutral head, grip hand |
| Approach / circle / retreat | E | walk cycle, AI picks direction | toe-off feet |
| Telegraph hold (our rule: escapable at ~15 frames; 15-30f melee, 30-45f caster) | E | the attack's first key, held still | **cocked arm**, effort head. The single biggest saver: the wind-up is the attack's first frame held |
| Attack 1 / attack 2 (knockdown) | E | swing | grip hand, attack head, side torso for thrusts |
| Hurt | E | head snap | hurt head |
| Fall / thrown / death (one pose) | E | rotated rig | ko head |
| Get-up | E | kneel | kneeling leg |
| Grabbed hold / grabbed hurt | E | limp, feet planted, mirrors the grabber | hurt head |
| Ranged draw / aim / release | E (archer) | far arm raised and pulled back | **raised far arm**, pinch hand, open hand on release |
| Caster charge loop / release | E (caster) | both arms raised; the effect does the work | both raised arms, effort head, charge glow |
| Brute slam (3 keys) | E (brute) | 20-30f wind-up, 2-3f down, crouch | both raised arms, roar head, shockwave fx |
| Brute lift / heave | E (brute) | arms overhead, release | raised arms, open fists |
| Brute charge | P | lean, arms out | none |
| Block (shield grunt) | P | guard pose + recoil | guard arm, shield-strap hand |
| Boss phase change | E (boss) | kneel or roar | roar head, cracked armour states |
| Boss entrance / unique death | P | walk-in or drop-in; collapse | 1-3 whole-figure keys |

Three patterns fall out. **Only five hero states need a view other than three-quarter** (spin, back throw, roll, turn midpoint: back or front; the thrust family: side); no movement or hurt state does. **The same six key drawings recur across a dozen states each**: the folded leg (squat, land, pickup, lying, jump), the kneeling leg (get-up, revive, downed, stun), the cocked arm (every heavy wind-up and telegraph), the toe-off foot (walk, run, every stepping attack, block shuffle). Drawing those six once makes "attacks have no leg movement" a pose-data job on existing art. And **"feet float 5 px" is a pose-authoring bug**: a folded leg's IK target must still sit on the floor line; a stretch strip that draws the floor line catches it before review.

## 5. Drawing or runtime? Each of our problems, with the cheaper correct fix

| Problem (our history) | Drawing fix | Runtime fix | Verdict |
|---|---|---|---|
| Walk "scuttly"; far leg limits stride; no knee bend or push-off (T018, 4 rounds) | toe-off foot x2, folded far leg (3 files) | IK foot targets clamped to the floor line, foot-tip rotation keyed separately, hip bob low/high; a 9-key walk | both; the runtime half is free and comes first |
| Feet float 5 px in knockdown and slash3 | none | floor-line rule on IK targets in pose data; stretch overlay | runtime (pose data) |
| One grip hand per side, one angle; overhand fist impossible (T020) | grip-overhand hand per side (2), pinch (have), palm (2) | **weapon node parented to the rig root, grip markers on the weapon, the hand copies the weapon's rotation** (Spine's two-handed method), mix on only in armed states | runtime first: the overhand problem was the short near arm, which moving the weapon solves; then two overhand hands |
| Cutlass orientation needed a per-pose flip (T020 r4) | an angle-specific weapon drawing (1-2 per weapon) | handle-axis convention (grip at pivot, blade along +X) + per-pose flip flag (we have this) | convention first; a drawing only where the flip still reads wrong |
| "Spearman is missing an arm" (far arm hidden) | raised far arm (1) | draw-order band so the far hand on a two-hander draws above the shaft (Goblins' thumb overlay, Hero's `fingers` slot) | both, cheap |
| Block needed a guard arm and brace head (T007, 4 rounds) | guard arm, brace head (have) | none | drawing; now in the kit |
| Spin showed no back (T008) | back torso and head (have) | scaleX through 0 + mid-turn swap (have) | drawing + existing swap |
| Cast "isn't natural" (T012) | whole raised arm (have), effort head | additive pose blend to aim the arm at the target (Spine Owl pattern) | drawing first; aim-blend is polish |
| Grab knee (parked) | knee-up leg (1) | none | drawing |
| Seams open at deep bends | round the lower part's end across the joint (re-cut, 0 extra files); 4 patch caps (Toon Boom "patch articulation"); a bent-limb swap past 90 degrees (Spine staff's own advice) | meshes: Spine's forum says they get complicated and still lose volume at tight bends | drawings; defer meshes |
| No smear on fast swings | 1-2 smear arms per swing family | shared slash-arc effect (section 6) | effect art first (shared by all weapons); smears as polish |
| Tail, scarf, ears lag | tail in 2-4 rounded segments | rotation-only spring per segment driven by parent velocity (Spine physics: inertia, strength, damping), lab sliders; fall back to hand-keyed offsets if "too bouncy" (an experienced Spine user's preference) | small runtime add |
| Turn-around, front-ish head | front-ish head + torso (2) | scaleX through 0 (have); orbit the face features over a fixed head blob for round animal heads (Moho's fake turn) | runtime now; 2 drawings only if asymmetric gear makes the flip read wrong |
| Hand reaching back looks flat | none | scale X toward 0 + shear | runtime (pose data) |
| Shadows "abstract" | none | ellipse scaled by height on a translate-only shadow node (Spine Tank) | runtime |

**Cost order for our runtime:** floor-line rule + foot-tip rotation (no art, small code) > rounded joint ends (no extra files; re-cut) > weapon handle axis + grip markers + hand-follows-weapon (data + small code) > the six key drawings (6 files) > tail springs (small code) > weapon angle variants and smears > meshes last or never. At 130 px a bent-limb swap and a mesh are indistinguishable.

## 6. Weapons, gear, colour and variety: the art rules

Our decisions (held art = floor art; gear = overlays; colour = grey masks tinted in code; variety = face overlays, tint ranges, gear picks, a few percent of size) all match industry practice. The sources make them concrete.

**Weapons.** Each weapon image declares a handle axis (grip at the pivot, business end along +X), one grip marker for a one-hander and two for a two-hander, a stowed anchor (Wildermyth's high-back / mid-back / low-back), and a draw-order band so the near hand or a thin fingers overlay draws above the handle. Overhand, underhand and reverse grips then become weapon-node rotation plus a hand choice, not new art. Per weapon: one item drawing (held = floor), optionally one angle-specific drawing, one or two smears as polish; a bow also needs the arrow as its own attachment; a shield needs the far-hand strap drawing. **"Hand painted onto the weapon"** (the user's T020 question) is a real paper-doll shortcut but no authoritative source endorses it; it breaks when the same hand must appear unarmed in the same pose and bakes fur colour into the weapon. Keep hands separate (as decided).

**Gear overlays.** Spine's skin-placeholder model: animations key slots; each skin supplies one drawing (or none) per placeholder; a unit's look is composed at spawn from base + hair + clothes + weapon. The art rule every system shares (Spine, Klei's Don't Starve builds, LPC's frame-matched overlays): **a gear piece is one drawing per placeholder it covers, per view that placeholder has, on that placeholder's canvas and pivot.** A tunic over a torso with three views costs three drawings; a bracer on a rigid forearm costs one; a hood sits in a `headwear` slot with a transparent face window so every head expression shows through; a full helm replaces the face with nothing. Capes are two slots (behind the body, clasp in front) on an optional bone chain that exists only when the cape is worn. Oversize items get their own template canvas. **Bodies freeze before gear** (our A008 lesson; Soulbound locked its run cycle first "because all later gear must match").

**Recolour.** Of the three families (indexed-palette shaders, colour-match shaders, mask tinting), only mask tinting runs in canvas 2D (PIXI's fill, multiply, destination-atop trick, cached once per unit). The LPC generator is the best-documented mask scheme: up to **4 materials x 6 shades**, every item declaring which materials it uses. Our rule: each part is a greyscale shaded drawing plus per-material alpha masks (fur, primary cloth, trim, metal, leather; cap at four per part), eyes/teeth/outlines unmasked, tinted once at spawn into a cached offscreen canvas so each frame is still one `drawImage` per part. Multiply only darkens, so author mask layers in mid-greys and bake a dark copy under a light copy for light colourways (Spine's tint-black effect). **Filenames never carry colour** (`torso/side`, not `red-torso`).

**Per-unit variety.** From Final Fight to SoR4, one body is varied almost entirely by clothes and hair colour, with behaviour keyed to the colourway: SoR4 ships six named Galsias and three Donovans that way and players learn "yellow trousers catches weapons". Our recipe: a **colourway table per enemy type** (3-6 rows, each with stats and a behaviour note), optional small add-on placeholders (vest, hat, face mark) filled per unit, face-detail overlays as slot swaps, uniform scale of +-4% for individuals and 1.3-1.5x for elites (Spine's Alien ships four sizes with hue shifts). None of this adds art files.

## 7. The effect kit: eleven greyscale families, tinted per school

Magic = rig pose + separate effect art + tint (decided). Spine's Tank builds a whole explosion from **five greyscale puff images** duplicated, tinted and varied by scale, rotation and timing, plus one additive glow layer; Castle Crashers gives every knight the same five magic slots and changes only the element. A new school is a palette row.

| Family | Frames | Blend | Socket | Notes |
|---|---|---|---|---|
| Slash arc / swoosh | 3-5, one per arc shape (horizontal, overhead, uppercut, thrust) | normal + additive copy | `weapon_tip` / `hand_near` | tinted for infusions; replaces per-weapon smears for most swings |
| Impact burst | 4-6 light, 6-8 heavy, white flash frame first | additive | hit point | scale 0.7 / 1.0 / 1.4 by strength |
| Hit flash on target | 0 art | white `source-atop` redraw, 2-3 frames | - | runtime (have) |
| Dust and debris | 5-8 grey puffs | normal; shadows multiply | `feet` | Tank's five puffs cover land, run, skid, wall slam |
| Charge / telegraph glow | 4-6 loop or one sprite on a sine | additive | `hand_near`, `chest`, `weapon_tip` | inward particles + one white flash before release |
| Projectile core + trail + impact | 2-4 loop, stretched copy as trail | additive | `hand_near` / `mouth` | mirror with scaleX -1 |
| Area ground effect | telegraph ring (1) + 6-10 loop (flame, ice rise-shatter, poison drift) | normal + additive glow | target point `feet` | Dragon's Crown's Blizzard / Rock Press class |
| Buff aura | 4-6 soft loop behind the body | additive | `chest` / `feet` | loop length different from idle so they never phase-lock |
| Status marker | 4-frame icon loop | normal | `head_top` | Castle Crashers' green poison puff |
| Screen effects | 0 art | additive quad, shake, hit-stop | - | runtime (have) |
| Summon / spawn-in | reuse dust + glow | - | spawn point | no new art |

About **60-90 greyscale frames** for the whole kit, authored once facing right, tinted per school at load (fire orange with multiplied black smoke, poison green, frost pale blue, lightning white-yellow, shadow purple), spawned by family ID and socket from the move's data row. Special timeline: telegraph (held wind-up), 1-2 frames of flash and hit-stop, 4-8 active frames, optional loop, 10-20 frames of fade.

## 8. The process fixes

Every problem we hit traces to one of four missing pieces. All four are cheap.

1. **The per-character rig sheet with a pose budget, before any art request** (`docs/design/rigs/<id>.md`, standard section 9, never written). It is section 4 filtered to that character's state list, each required swap or key drawing named by slot, and it is the only document an art packet references. **Rule: a move packet whose pose budget names a drawing not yet game-ready is rejected at planning, not discovered in review.**
2. **A stretch test on the rig bench**, exported as one JPG: every limb at 90 and 150 degrees, arm straight up, each torso view, each foot and hand alternate, each hand holding each weapon overhand / underhand / reverse, a crouch and a lying pose with the floor line drawn, the rig at 0.96x, 1.04x and 1.4x. It catches seams, floating feet, hidden far arms and weapon orientation before any move is animated. It becomes G2's artefact.
3. **Naming.** The `foot-back` confusion is the ambiguity Spine's examples avoid by never mixing depth words with gait words. Proposal: **`near` / `far`** for camera depth in part names; `lead` / `trail` only in pose descriptions; `back` reserved for the back *view* of the torso and head. Role-based placeholder paths with no colour or character in them (`torso/side`, `hand_near/grip-overhand`, `headwear/hood`), prefixed by body (`rat-grunt/...`). Effects `fx/<family>/<frame>`, school as a tint parameter. **Cost:** a one-time rename in `rig-source.json`, the importer, the pose files and the bench (a Code task); the alternative is to keep `front/back` and live with the lesson line. The user decides.
4. **Gate order: body, then pose-budget swaps, then gear, then moves.** Body = one master, parts cut from it, hidden areas inpainted only, rounded joint ends on every cut, stretch strip passed. Then the pose-budget drawings. Then gear on the frozen canvases. Then moves, each packet citing its pose-budget rows and shipping a motion strip plus the stretch strip. Weapons gate separately on their handle-axis data and a grip test across every body that can hold them.

## 9. Recommendations, ranked

1. **Write the Mouse Fighter rig sheet and order the six missing drawings** (toe-off near and far feet, folded far leg, knee-up near leg, kneeling near leg, cocked near arm). Highest payoff per file: it fixes the walk stride, the attack footwork, the grab knee, the get-up and every heavy telegraph at once.
2. **Make the floor line a runtime rule.** IK foot targets clamp to the floor in every grounded state; foot-tip rotation is keyed separately; the stretch strip draws the floor. Zero art.
3. **Weapon handle axis + grip markers + hand follows weapon**, mix on only in armed states; then one grip-overhand hand per side. Resolves the overhand fist, the cutlass flip and the bow draw together, and keeps held art = floor art.
4. **Re-cut with rounded, overlapping joint ends**; patch caps only where the strip shows gaps. **No meshes.**
5. **Build the effect kit as greyscale families with sockets** before the next magic move: five puffs, four arcs, two bursts, a charge loop, a ring, an aura, a status icon.
6. **Adopt near/far naming and role-based paths** (user's call; one migration task).
7. **Freeze bodies before gear, gear before moves**, with the stretch strip as the gate artefact.
8. **Enemies as families on one body**: the rat family shares the 27-drawing kit plus items, 2-3 swaps and colourway rows with stat columns. The Skeletal Mouse is a tint-and-overlay variant of the mouse skeleton, not a new body.
9. **Non-bipeds in cost order**: serpent, floating caster, quadruped; beetle and bird once chain-follow and frame-swap slots exist.
10. **A rotation-only spring for tails and scarves**, with lab sliders, hand-keyed fallback.

**On Spine:** nothing above needs it. Every item is drawings on our canvases plus small additions to our runtime (floor-line IK rule, weapon node, draw-order overlay, springs). Spine would add meshes (which the evidence says to skip at our size) and a visual editor (worth testing only if the user wants to drag limbs himself).

## 10. Honest gaps

No published source gives a canonical hand-drawing count for a cutout action character. Vanillaware's part counts and swing method are undocumented in English. Don't Starve's full symbol list and the "~155 pieces" claim could not be verified. No classic beat 'em up publishes per-move frame data. The "~15 frames" telegraph figure is our own playtest rule (T004), not an industry number. The non-biped templates and the effect families are synthesised from Spine's example projects, not from a shipped animal brawler. The counts in section 3 are planning numbers to be corrected by the first stretch test.

## Sources (selected)

- Spine example exports (4.2): [Spineboy PRO](https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.2/examples/spineboy/export/spineboy-pro.json), [Spineboy ESS](https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.2/examples/spineboy/export/spineboy-ess.json), [Goblins](https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.2/examples/goblins/export/goblins-pro.json), [Hero](https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.2/examples/hero/export/hero-pro.json); example pages [Raptor](https://us.esotericsoftware.com/spine-examples-raptor.md), [Dragon](https://us.esotericsoftware.com/spine-examples-dragon.md), [Tank](https://us.esotericsoftware.com/spine-examples-tank.md), [Alien](https://us.esotericsoftware.com/spine-examples-alien.md), [Owl](https://us.esotericsoftware.com/spine-examples-owl.md), [Coin](https://us.esotericsoftware.com/spine-examples-coin.md), [Powerup](https://us.esotericsoftware.com/spine-examples-powerup.md)
- Spine docs and blog: [Skins](https://en.esotericsoftware.com/spine-skins), [Slots and tint black](https://en.esotericsoftware.com/spine-slots), [Mix and Match](https://en.esotericsoftware.com/spine-unity-mix-and-match), [Holding a two-handed weapon](https://eu.esotericsoftware.com/blog/Holding-a-two-handed-weapon), [Physics constraints](https://esotericsoftware.com/spine-physics-constraints); forum threads on [sharp bends](https://de.esotericsoftware.com/forum/d/26627-how-can-i-achieve-this-sharp-bend-that-effect), [mesh joints](https://ja.esotericsoftware.com/forum/d/7673-best-practices-for-rigging-mesh-joints), [feet on the ground](https://en.esotericsoftware.com/forum/d/18361-how-to-make-feet-stay-on-the-ground-on-walk-cycle), [turnarounds](https://ar.esotericsoftware.com/forum/d/24825-turnaround-images-and-bones), [hair secondary motion](https://ja.esotericsoftware.com/forum/d/7287-hair-secondary-motion-best-way)
- Toon Boom: [Fixing the articulations](https://docs.toonboom.com/help/harmony-12-2/premium/rigging/fix-articulations.html), [Patch articulation](https://docs.toonboom.com/help/harmony-12-2/advanced/rigging/patch-articulation.html); NotSlot Spine tutorials [walk](https://notslot.com/tutorials/2020/04/spine-8-direction-character-part-3), [sword](https://notslot.com/tutorials/2020/04/spine-8-direction-character-part-4); [Moho fake head turn](https://lesterbanks.com/2019/07/how-to-build-a-fake-3d-head-turn-with-moho/); [Live2D PSD prep](https://docs.live2d.com/en/cubism-editor-tutorials/psd/)
- Games: [Wildermyth image layers](https://wildermyth.com/wiki/Image_layers), [Darkest Dungeon modding guide](https://steamcommunity.com/sharedfiles/filedetails/?id=819597757), [Klei reskin guide](https://forums.kleientertainment.com/forums/topic/138126-guide-reskinning-creatures/), [LPC generator](https://opengameart.org/node/159745), [Soulbound devlog](https://soulbound.game/?p=2330), [SoR4 on PlayStation Blog](https://blog.playstation.com/archive/2020/04/23/how-streets-of-rages-iconic-characters-were-redesigned-for-the-ps4-sequel), [OpenBOR animation overview](https://chronocrash.com/openbor/wiki/index.php/Animation_Overview), [Rivals of Aether workshop](https://rivals2.com/workshop/?p=389), [TCRF SoR2 prototype](https://new.tcrf.net/Proto:Streets_of_Rage_2_(Genesis)), SoR wiki [Galsia](https://streetsofrage.fandom.com/wiki/Galsia) and [Donovan](https://streetsofrage.fandom.com/wiki/Donovan), Castle Crashers wiki [Orange Knight](https://castlecrashers.fandom.com/wiki/Orange_Knight) and [Poison](https://castlecrashers.fandom.com/wiki/Poison), [Dragon's Crown Sorceress skills](https://dragons-crown.fandom.com/wiki/Sorceress_Skills?oldid=8929), [Game Developer on telegraphing](https://gamedeveloper.com/design/enemy-attacks-and-telegraphing), [Animation Mentor quadruped walk](https://www.animationmentor.com/blog/tutorial-how-to-animate-a-quadruped-walk-cycle/), [Tutsplus explosion effects](https://design.tutsplus.com/tutorials/how-to-animate-explosion-effects--cms-30960), [Phaser CanvasTinter](https://unpkg.com/phaser@2.4.3/docs/src_pixi_renderers_canvas_utils_CanvasTinter.js.html)
