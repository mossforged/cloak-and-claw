# Rig sheet: Rat Raider (grunt body: raider, spearman, archer, shield-bearer, captain)

The per-character sheet the rig standard requires (section 9). **Art packets for this body reference this sheet, not the generic list.** A move packet may only name drawings marked game-ready here. Background: `docs/studies/2026-10-17-rig-art-inventory.md` (grunt kit, section 3b; enemy states, 4b). Decision 2026-10-17: the body is rebuilt from a new setup-pose master; this is the test that the rig process is flexible.

- **Identity reference:** the art-bible standee (`assets/art/enemies/rat-raider.png`) and the approved A010 rat with **head R** (`assets/source/A010-rat-raider-standard/reference.png`). Look approved by the user 2026-10-16 ("much better, much closer to the standee").
- **Master:** A017 (to come): setup pose (rig standard section 2), canvas 1536 x 2304, #00FF00, ~1350 px tall, floor marked. In game ~136 px (uniform scale).
- **Gates:** G2 parts: A018 merged, lead stretch strip 2/28 flagged (2026-10-17); human look at T026. G1 master: **passed** 2026-10-17 (A017; user: "the rat looks great"). G2 parts + stretch strip: open (A018, then a Code import). G3 motion: open. G4 gear/masks refit: open (A019).
- **Names:** near/far (rig standard section 3).

## Carried over from A010/A011 (keep, do not redraw)
| Asset | Why it carries | Condition |
|---|---|---|
| head R x6: neutral, attack, hurt, effort, ko, back | approved; part-level drawings | A017 keeps the head at the **same size**; new neck pivot recorded, the six heads move by one offset |
| face details: eyepatch, scar, earring, ear notch (+ hurt/back variants) | drawn on the head canvas | move with the heads |
| head gear: hood, helmet, captain hat (+ hurt/back variants, masks) | drawn on the head canvas | move with the heads; check the neck/collar edge in the stretch strip |
| weapons: rat cutlass (A003), spear, bow, arrow (A012) | items; held art = floor art | unchanged; grip markers per item come with T025 |
| colourways and variety rules (T019 palettes, fur range, +-4% size) | code data | unchanged |

## Redone (A018 parts, A019 torso gear)
torso (three-quarter, side, back), pelvis, all arm and leg pieces, hands, feet, tail (3 segments), scarf tail; torso gear (jerkin, quiver, sash) and every body mask.

## Part list (A018)
pelvis, torso, head; arm-near-upper/lower, hand-near; arm-far-upper/lower, hand-far; leg-near-upper/lower, foot-near; leg-far-upper/lower, foot-far; tail-1, tail-2, tail-3; scarf-tail. **Trousers:** the waistband and seat belong to the pelvis; each trouser leg belongs to its thigh, overlapping the pelvis piece (no single shape spanning hip and thigh).

## Swap and key-drawing library (grunt kit, extended for this body's roles and the flexibility test)

| Slot | Drawing | Tier | State | Used by |
|---|---|---|---|---|
| head | neutral, attack, hurt, effort, ko, back | E | carried (A010) | everything; back = spin, back-throw victim |
| torso | three-quarter | E | source (A018) | default |
| torso | side | E | source (A018) | spear thrust, dagger stab, shield bash |
| torso | back | P (needed for the dodge roll option) | A018 | dodge roll, thrown |
| hand-near | fist, open, grip (side) | E | source (A018) | default / weapon drop, grab / cutlass, club |
| hand-near | grip-overhand | E (T020's missing hold) | source (A018) | spear (overhand), dagger reverse grip, club two-hand |
| hand-near | pinch | E (archer) | source (A018) | arrow nock and draw |
| hand-far | fist, open, grip (side) | E | source (A018) | default / bow release / spear back hand |
| hand-far | grip-overhand | E | source (A018) | spear, two-hand club |
| hand-far | shield (strap) | E (shield-bearer) | source (A018) | shield |
| arm-near whole-limb | cocked (wound back past 90 degrees: elbow up and **behind** the shoulder, fist level with the ear) | E | source (A018) | every telegraph, cutlass and club wind-ups, jump attack |
| arm-near whole-limb | raised (straight up, carries the item) | P | A018 | overhead club slam |
| arm-far whole-limb | raised-back (raised and drawn back: bow draw) | E (archer) | source (A018) | full bow draw (T020: "could be drawing the string back further") |
| arm-far whole-limb | guard (forearm across the chest, carries the shield) | E (shield-bearer) | source (A018) | block, shield bash |
| leg-near whole-limb | kneeling | E | source (A018) | get-up, stun |
| leg-near whole-limb | knee-up | E (flexibility test) | source (A018) | jump attack tuck, dodge hop |
| leg-far whole-limb | folded | E (flexibility test) | source (A018) | jump squat, land, dodge, lying |
| foot-near, foot-far | flat, toe-off | E | source (A018) | walk push-off, lunge, thrust |
| joint patches | elbow x2, knee x2 | only if the strip shows gaps | - | |

About **33 body drawings** plus the six carried heads.

## Pose budget (state -> drawings)

| State | Drawings | Notes |
|---|---|---|
| menace idle (hunched) | three-quarter torso, fists or grip | the crouch is posed by the rig from the setup master |
| approach / circle / retreat (walk) | toe-off feet | 9-key walk, floor-line rule (T024); no more "scuttle" vs "upright" variants |
| telegraph hold | **cocked near arm**, effort head | the attack's first key held still, escapable at ~15 frames |
| cutlass slash (raider) | grip, attack head, toe-off rear foot | |
| spear thrust (spearman) | side torso, **overhand grips both hands**, toe-off | T025 weapon node; far hand drawn above the shaft |
| bow draw / aim / release (archer) | **raised-back far arm**, near pinch, open hand on release | |
| block / shield bash (shield-bearer, new) | **guard far arm** + shield, side torso for the bash, toe-off | |
| hurt | hurt head | |
| knockdown / thrown / death / lying | ko head, **folded far leg** | one pose serves all four |
| get-up | **kneeling near leg** | |
| grabbed hold / grabbed hurt | hurt head | |
| weapon drop | open near hand | drops the weapon he held |
| **flexibility test** | | **no new body art allowed** |
| dodge hop (new) | folded far leg, knee-up near leg, effort head | a short back-hop out of the lane |
| jump attack (new) | knee-up, folded far leg, cocked arm -> grip | |
| club overhead (new kit) | cocked or raised near arm, overhand grips | club is the A003 item |
| dagger stab (new kit) | side torso, overhand (reverse) grip | needs a dagger item drawing only |
| shield + cutlass (new kit) | guard arm, shield hand, grip | needs a rat shield item drawing only |

## Items and sockets
Held items: rat cutlass, spear, bow (+arrow), and for the test a club (A003), a dagger and a round rat shield (item drawings only). Sockets: `hand_near`, `hand_far`, `weapon_tip`, `chest`, `head_top`, `feet`, `mouth`, `tail_tip`.

## Variety and gear
Colourways per type (raider, spearman, archer, shield-bearer, captain), face details, gear picks (hood, helmet, hat; jerkin, quiver, sash), +-4% size, fur range 0.12: as T019. Masks: fur, cloth, trim, leather per part (max four), redrawn for the new body in A019.

## Order of work
1. **A017** setup-pose master + back view: done, G1 passed.
2. **A018** base parts with rounded joint ends, hand swaps (incl. overhand, pinch, shield), torso side/back, carried heads; `rig-source.json` with grips and sockets.
3. **Code import** (T026): uniform scale, stretch strip clean (no seam over 2 px), every current rat move re-posed, walk on the floor-line rule.
4. **A019** whole-limb key drawings + toe-off feet (cocked near arm, raised near arm, raised-back far arm, guard far arm, kneeling and knee-up near legs, folded far leg, toe-off x2), cut on the A018 pivots.
5. **A020** torso gear (jerkin, quiver, sash) + all body masks refit.
6. **Flexibility test** (Code + A021 items: dagger, round shield, hand axe, staff): new kits and moves with no new body art.
