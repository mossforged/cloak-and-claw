# Joint rules from real rigs

*2026-10-18, lead. Study, not a decision; what was settled is in `docs/decisions.md`.*

## Where the project stood
Stage 4, rig lock-down (everything else paused). Last code task merged: T027 (model viewer). Last art task merged: A023 (rat complete kit, source). On branches: T026 round 4 (new rat import: cutlass guard, closed idle gaps, pose seam test) and T028 v1 (views, depth switching, rehearsal sheet). The user's look at round 4: idle "almost perfect" except the sword hand shows its palm; a grey line where the walking foot meets the trousers; a waist gap opening in the slash. He said the process "just doesn't seem to be working": the lead keeps missing anatomy he sees at once. He asked for a full parts list from a real game-ready character, to make sure we cover the standard bases, and for anatomy rules that can be checked by name. He called this "the final test of this type of rigging".

## What we looked at
Six official characters from Spine, the most used 2D cutout animation tool, all built by its artists as reference rigs and shipped with its runtimes: the **sword hero** (flat painted pieces, no bending, closest to ours), the **goblins** (dagger, spear and shield; two characters on one skeleton), **Spineboy**, the **raptor** rider, and the **mix-and-match** dress-up girl/boy. We read each one's full skeleton file: every slot (a place a drawing goes), every drawing that can fill it, and the **draw order** (which slot is painted over which).

Not available here: files from a commercial game (the GitHub search we would need is blocked in this session, and Darkest Dungeon's modding notes describe folders, not parts). The Spine examples are still real, complete rigs made by the people who build the tool.

We read these same files on 2026-10-16 ("How pros build 2D rigs"), but only counted parts. The answers to all three of the user's findings were in the **draw order**, which we didn't look at.

## The part lists, compressed
| Character | Body slots | Hands | Joint cover pieces | Bends with meshes? |
|---|---|---|---|---|
| Sword hero | thigh, shin, foot x2; upper arm, forearm, hand x2; body, head | far hand split: **hand2 behind the sword, `fingers` in front of the handle** | **mantles** over the near shoulder | body only; limbs flat like ours |
| Goblins | pelvis, torso, neck, head; shoulder, arm, hand, upper leg, lower leg, foot x2 | near hand split: **`right-hand-thumb` behind the item, `right-hand` over it** | separate **shoulder** pieces | yes, almost everything |
| Spineboy | thigh, shin, foot x2; upper arm x2, bracer x2; near fist | near fist open / closed | **bracers** over both wrists | feet, front shin, torso |
| Raptor rider | same as Spineboy + raptor | near hand open / closed / **holding the gun** | bracers, a **knee** cap | raptor limbs |
| Mix-and-match | arms and legs as single bending pieces, hands, body, body-up | hand-fingers per side | **inner sleeve behind the arm + sleeve in front**, boot ribbons, collar | arms, legs, body |

Our rat already has more drawings than any of these: per-view torsos and pelvises, whole-limb keys, two dozen hand and foot swaps. **The gap is not missing parts. It's three construction rules every one of them follows and we don't.**

## Rule 1: the shin always covers the foot
In all four that have separate feet (hero, goblins, Spineboy, raptor), **the shin is painted over the foot**, and the foot's top continues up underneath it. Our rat paints each foot over its shin (`foot-near` 530 over `leg-near-lower` 520; far 230 over 220). That's the grey line in the walk: the foot's top edge sits on top of the trouser leg instead of under it. The user saw exactly this ("the foot is being rendered over the pants instead of under them").

## Rule 2: a held weapon sits between two hand pieces
No example draws a gripping hand as one fist with the weapon behind it. The **sword hero** paints the far hand in three layers: hand, then the sword, then the fingers over the handle. The **goblins** do the mirror for the near hand: thumb, then the item, then the hand over it. Whichever side of the hand faces the camera is the piece in front; the part of the hand that wraps round the far side of the handle is a separate piece behind it. The raptor rider adds a third option: a drawing of the hand already holding the gun, as a swap.

Our grip hands are single fists with a slot and the weapon tucked behind (`one-hand` 812 under `hand-near` 815). That's why holds have looked "twisted" since T026. It's also why the palm showed: nothing in our standard said which face of the hand the camera sees, and the A022 packet described every grip as "thumb toward the viewer".

## Rule 3: joints get cover pieces
Spineboy and the raptor have **bracers** as their own pieces over the wrist; the hero has a **mantle** over the shoulder; the goblins have **shoulders**; the dress-up rig has a **sleeve** in front of the arm and an inner sleeve behind it. A cover piece hides a joint through its whole range, so the two pieces it joins never need to line up exactly. Our rat bakes the bracers into the forearm, the belt into the pelvis, and the trouser hem into the leg, so every joint depends on two cut edges meeting. The slash's waist gap is that: the chest tips forward and the torso's lower edge lifts off the pelvis with nothing over the line.

## Also worth knowing
- **Most of these rigs bend their limbs as meshes** (a drawing that bends like rubber instead of a rigid piece): the goblins almost entirely, Spineboy's shins and feet, the dress-up rig's arms and legs. That's the other way pros avoid seams. We chose no meshes (2026-10-17); only the sword hero is flat like us, and it leans on covers and the split hand.
- **Shared slot names** let one skeleton wear many bodies (goblin and goblin girl; the dress-up rig's 32 swappable clothes, hair and face pieces). We already do this.

## What this changes (proposed; the user agreed to written rules and an early anatomy pass on 2026-10-18)
1. **Anatomy rules written into the rig standard** (section 5b), each checkable by name from the rig data: which piece covers which at every joint, which face of each hand shows for each hold, the split grip, cover pieces, hidden length through the full range.
2. **The rat sheet gets a hand table** (every hold x near/far: which face shows and which drawing it uses), for the user's anatomy pass before Art draws.
3. **Code:** foot under the shin now (a draw-order change, no art); a test that fails when a pose breaks a written rule.
4. **Art (A023 round 2):** split grip hands drawn to the hand table, a belt cover piece over the waist, foot tops extended under the shin, and bracers as their own pieces if the seam test still flags the wrists.

## Sources
- [Spine runtimes: example characters](https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/examples) (hero, goblins, spineboy, raptor, mix-and-match): skeleton JSON read directly; slots, attachments, draw order and mesh types listed by script.
- [Darkest Dungeon hero porting tutorial](https://gamepretty.com/darkest-dungeon-hero-porting-tutorial/): folder structure only.
- Our data: `src/data/rigs/rat-raider.js` (T026 round 4 branch), `assets/source/A018`, `A019`, `A022`, `A023` `rig-source.json`.
