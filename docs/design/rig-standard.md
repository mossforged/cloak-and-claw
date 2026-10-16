# Rig standard (cutout characters)

Every rigged character follows this. Art packets cite it and only list what differs. Background and sources: `docs/studies/2026-10-16-how-pros-build-2d-rigs.md`.

**Status: PROPOSED (lead, 2026-10-16), waiting for the user's yes.** Mouse Fighter predates it and is not retrofitted until a move needs it.

## 1. The four gates (in order; nothing skips ahead)

| Gate | Who makes it | What the user judges |
|---|---|---|
| **G1 Master** | art builder | Is this the character? (the master beside the standee, at full size and game size) |
| **G2 Parts** | art builder, then the code builder's rig bench | Do the parts reassemble into the master? (automatic overlay; no visible drift) |
| **G3 Motion test** | code builder (rig bench, standard strip) | Does it look alive in motion? Which moves need key drawings? |
| **G4 Libraries and gear** | art builder | Key drawings, gear overlays, colour tints, each checked in motion |

G1 is cheap and catches the expensive mistake (a different character). Don't draw parts before G1 passes.

## 2. The master (G1)
- Start from the character's **approved standee** (art bible) as an input image. **Redraw that character; don't design a new one.** Same proportions, limb thickness, outfit, colours.
- **Master pose:** three-quarter view facing right (style contract), in the character's **game stance** (the rat crouches, the mouse stands), with arms and legs slightly apart so no limb hides another, the weapon in the near hand, and hands visible.
- Also deliver `master-back.png`: the same character from behind (for the back torso and back-of-head swaps).
- Canvas **1536 x 2304, #00FF00**, character silhouette about **1350 px tall** (as A004/A005), feet on a marked floor line.
- The master is the single source of truth. Every later image is cut from it or drawn over it.

## 3. Standard biped part list (fixed names)
Names are identical for every biped, so poses, weapon kits and gear transfer between bodies. "front" = near (camera side), "back" = far.

| Group | Parts |
|---|---|
| Core | `pelvis`, `torso`, `head` |
| Near arm | `arm-front-upper`, `arm-front-lower`, `hand-front` |
| Far arm | `arm-back-upper`, `arm-back-lower`, `hand-back` |
| Near leg | `leg-front-upper`, `leg-front-lower`, `foot-front` |
| Far leg | `leg-back-upper`, `leg-back-lower`, `foot-back` |
| Cloth / tail (as the character has them) | `tail` (or `tail-1`, `tail-2`), `scarf-tail`, `cape`, `ear-back` etc. |

About **15 core parts plus 1 to 3 extras**. Hands, feet and pelvis are always separate (the lesson from every professional example).

## 4. Minimum swap library (planned up front)
Same canvas; each swap shares its part's pivot so it drops in place.

| Part | Required drawings |
|---|---|
| `hand-front`, `hand-back` | `open`, `fist`, `grip` (closed round a handle, hole for the shaft), plus `pinch` for bow users. Name: `hand-front-grip.png` |
| `head` | `neutral`, `attack` (shout or snarl), `hurt`, `effort` (gritted, bracing), `ko` (eyes shut or dazed), `back` (back of the head) |
| `torso` | `three-quarter` (default), `side` (turned side-on, for horizontal cuts), `back` |
| feet | `flat` (default); `toe` (push-off) optional |

That's about 18 base parts and 14 to 16 swaps, roughly **35 images per character**: still small next to Don't Starve's ~155 or Streets of Rage 4's ~1,000 frames.

**Key drawings** (whole limbs or poses drawn for one move, like A006's raised arm) are **not** in the base kit. They are ordered only after G3 shows the rig can't sell a move. Each one is listed in the character's pose budget (section 9).

## 5. Drawing rules (G2)
1. **Cut, don't regenerate.** Each part is cut from the master along its joint lines. Use the image tool only to **paint in what was hidden** (shoulder under the sleeve, thigh under the tunic, the hip behind the near leg). A limb must never be generated from scratch, because separate generations drift into a different character.
2. **Hidden areas painted** at least one joint-width past the visible edge.
3. **Round joints:** the overlapping end is close to a circle around the pivot, with the outline continuing past the overlap so it never breaks when bent.
4. **Pivots marked:** each part's pivot and its attach point on the parent go in `part-layout.json` as **measured canvas points**, not estimates.
5. **Uniform scale only.** No stretching. If the rig needs a size fudge over 5% on any part, the art goes back.
6. **Swaps share the pivot** of the part they replace (same joint point on the canvas).
7. Light from upper left, bold dark outline, no ground shadow (style contract).

## 6. Draw order (depth bands)
`hand-back`, `arm-back-*`, far weapon (100s) < `leg-back-*`, `foot-back` (200s) < `tail`, cape back (300s) < `pelvis` (400) < `leg-front-*`, `foot-front` (500s) < `torso` (600) < gear on torso (650) < `head` (700) < gear on head (750) < `arm-front-*`, `hand-front`, held weapon (800s). Swaps and gear inherit their part's band.

## 7. Gear and colour (G4)
- Gear overlays are drawn **over the approved master** (head and torso as they will be in game), after G3.
- Each gear piece must fit every head swap; deliver named variants where it can't (`gear-helmet-hurt.png`).
- **Colour variants by tint in code:** mark recolourable regions (clothes, bandana) as a separate grey mask layer per part (`torso-mask.png`) so code can tint them without repainting.

## 8. Rig bench and motion test (G2, G3; code builder's tool)
- **Fit overlay:** load the source parts and `part-layout.json`, assemble at rest, and draw them over the faded master; flag drift in proportion or position.
- **Standard motion strip:** stance, idle breath, walk cycle, attack (windup, strike, follow-through), hurt, knockdown, get-up; played live at game size beside the standee, with an exported strip image for the review.
- The user judges G3 here, in motion, before anything is imported into the game.

## 9. Per-character rig sheet (one file per character: `docs/design/rigs/<id>.md`)
Holds: standee reference; master status; part list (marking any extras); swap library status; **pose budget** (each move: which swaps and key drawings it uses); gear and tint regions; and which gate it has passed.

## 10. Rig art packet checklist (lead)
- [ ] Cites this standard; names only the differences (extra parts, character-specific swaps).
- [ ] One gate per packet: G1 master, G2 parts, or G4 libraries. G3 is a code task.
- [ ] Standee named as the input image; master is a redraw, not a new design.
- [ ] Review shows the result beside the standee at full size **and** at game size.
- [ ] Gear and variants wait until the body passes G3.
