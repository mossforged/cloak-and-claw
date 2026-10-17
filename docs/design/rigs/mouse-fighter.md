# Rig sheet: Mouse Fighter (hero)

> **2026-10-17: to be rebuilt from a setup-pose master after the rat** (rig standard section 2 revised). A013's master is his standee pose; A016's drawings are fitted to it and are superseded. Head, sword and shield carry over. This sheet will be redone for the new master; its pose budget still applies.

The per-character sheet the rig standard (section 9) requires. **Art packets for this character reference this sheet, not the generic list.** A move packet may only name drawings marked game-ready here. Background: `docs/studies/2026-10-17-rig-art-inventory.md`.

- **Standee:** `assets/art/heroes/mouse-fighter.png` (art bible). **Master:** A013 `reference.png` + `master-back.png`, canvas 1536 x 2304, floor y 2050, uniform scale x0.4 in game (130 px).
- **Gates:** G1 master passed (user, 2026-10-16). G2 parts passed (bench 0.1% uncovered / 3.1% outside). G3 motion: in game via T023 (review open). G4 gear: none yet (he has no gear overlays; sword and shield are items).
- **Names:** A013 delivered with `front/back` names; T024 renames to `near/far`. Both are given below until the rename lands.

## Parts (17, A013, game-ready after T023)
pelvis, torso, head; arm-near-upper/lower (`arm-front-*`), hand-near (`hand-front`); arm-far-upper/lower (`arm-back-*`), hand-far (`hand-back`); leg-near-upper/lower, foot-near; leg-far-upper/lower, foot-far; tail; scarf-tail.

## Swap and key-drawing library

| Slot | Drawing | State | Used by |
|---|---|---|---|
| head | neutral, attack, hurt, effort, ko, back | game-ready (A013) | everything; back = spin, back throw |
| torso | three-quarter, side, back | game-ready (A013) | side = horizontal cut, thrust kits; back = spin, back throw |
| hand-near | open, fist, grip | game-ready (A013) | grab, throws / knee, hurt / weapons |
| hand-far | open, fist, grip, shield | game-ready (A013) | - / - / two-hand kits / default |
| arm-near | whole raised arm (carries the sword) | game-ready (A013) | cast, overhead |
| arm-far | whole guard arm (carries the shield) | game-ready (A013) | block, brace |
| foot-near | flat, out-turned | game-ready (A013) | out-turned in planted poses |
| foot-far | flat | game-ready (A013) | |
| **foot-near toe-off** | heel raised, weight on the ball | **source (A016 merged); import T024** | walk, run, every stepping attack, block shuffle, lunge |
| **foot-far toe-off** | same, far foot | **source (A016 merged); import T024** | walk push-off, slash3, jump take-off |
| **leg-far folded** | whole far leg, knee fully bent, foot under the hip | **source (A016 merged); import T024** | jump squat, land, crouch pickup, knockdown lying, jump tuck |
| **leg-near knee-up** | whole near leg raised, knee at hip height | **source (A016 merged); import T024** | grab knee, jump tuck, jump slash |
| **leg-near kneeling** | whole near leg kneeling, shin on the floor | **source (A016 merged); import T024** | get-up, revive hold, downed, stun |
| **arm-near cocked** | whole near arm wound back past 90 degrees, elbow high, fist by the ear | **source (A016 merged); import T024** | slash3 wind-up, club overhead wind-up, charge attack, telegraphs |
| hand-near grip-overhand | handle across the fist, seen from the front | polish, not ordered | overhand spear / club holds |
| hand-near / hand-far flat palm | | polish, not ordered | block (far), push |
| hand-near pinch | | polish, not ordered | potion, bow |
| torso hunched / twisted | | polish, not ordered | block, cross cut, hip toss |
| head front-ish, shout | | polish, not ordered | turn midpoint, victory |
| smear arms | | polish, not ordered | after the effect kit's slash arcs |
| joint patches (elbow x2, knee x2) | | only if the stretch strip shows gaps | |

## Pose budget (state -> drawings)

| State | Drawings | Status |
|---|---|---|
| idle, walk, back-walk | neutral head, fists/grip, flat feet; **toe-off feet** (walk) | walk waits on A016 for push-off; works today without |
| jump squat, land | **folded far leg**, flat near foot | A016 |
| jump, jump slash | **knee-up near leg**, folded far leg, grip | A016 |
| slash1 | grip, attack head, toe-off rear foot | ok (toe-off A016) |
| slash2 (spin) | back torso, back head, attack head | game-ready |
| slash3 | **cocked arm** wind-up, attack head, side torso optional | A016 |
| horizontal cut / thrust kits | side torso, grip | game-ready |
| block, brace, block hit, block shuffle | guard arm, effort head, (toe-off for the shuffle) | game-ready (shuffle A016) |
| hurt, knockdown, down | hurt head, ko head, folded legs when lying | ko ok; lying waits on A016 |
| get-up, revive hold, downed | **kneeling leg** | A016 |
| grab, knee, forward throw, back throw | open hands -> fists, **knee-up leg**, back torso + head (back throw) | knee A016 |
| pickup / stow / draw | folded legs, open hand, grip | A016 for the crouch |
| cast | raised near arm, effort head | game-ready (pose still "not totally natural"; aim-blend is polish) |
| potion toss / drink | open hand (pinch is polish) | ok |
| weapon kits (cutlass, club, fish) | grip; cocked arm for club overhead | A016 |

## Items and sockets
- Sword and shield are items held in `hand-near` grip / `hand-far` shield (T023). Floor weapons use the same grip; handle axis + grip markers per item come with T025.
- Sockets to declare (T024): `hand_near`, `hand_far`, `weapon_tip`, `chest`, `head_top`, `feet`, `mouth`, `tail_tip`.

## Variety and gear
None planned for the hero beyond later gear overlays (weapon + ring at first; visible armour/cloak later). Tint masks: not delivered with A013; order with the first gear task.

## Open
- Stretch strip (T024) will confirm the joint cuts and whether any patch caps are needed.
- Mouse's out-turned foot is a polish item that shipped early; keep.
