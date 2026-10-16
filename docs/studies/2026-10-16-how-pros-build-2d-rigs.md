# How professionals build 2D cutout characters, and what we change

*Study, 2026-10-16. Not a decision document: anything we adopt goes to `docs/decisions.md`. The resulting standard is `docs/design/rig-standard.md`.*

## Where the project stood

- **Stage 2** (feel pass + crowd tools) wrapping up; **Stage 4** (enemy variety) started.
- **Last tasks merged:** T011 rat rig + weapon kits (code, rat look a stopgap), A008 rat gear (art).
- **In review:** T013 scrolling Harbor Market (branch pushed, waiting for the user to play it).
- **Queued, now on hold:** A009, rat parts redrawn from the art-bible standee.
- **Why this study:** after four rounds of rat art (A004, A005, A008, the T011 stopgap) the rigged rat still doesn't match his standee. The user asked to stop and work out a systematic approach to drawing parts for rigs, using professional games (beat 'em ups especially: Dragon's Crown, Absolum, Marvel Cosmic Invasion) to learn how many pieces they use and how they build them.

---

## 1. Three ways professionals animate 2D characters

Every 2D action game picks one of these, and only one of them is open to us.

| Approach | Who | What it costs | For us? |
|---|---|---|---|
| **Frame by frame** (every frame is a full drawing) | Streets of Rage 4, Absolum, Marvel Cosmic Invasion (pixel art), Shredder's Revenge | SoR4: about **1,000 hand-drawn frames per playable character, 300 to 400 per enemy**. Absolum's animation studio had to cut frames per move hard to keep the game fast | No. Breaks pillar 4 (the art stays doable) |
| **Cutout rig with libraries** (few bones; each bone shows one of several drawings) | Don't Starve, Spine's example characters, Wildermyth's paper dolls, TV cutout animation (Toon Boom) | Roughly 15 to 20 parts, but **100+ drawings** once the alternate hands, faces and directions are counted | **Yes: this is our model** |
| **Per-move key drawings on a rig** (each big move gets its own painted parts, deformed between) | Vanillaware (Odin Sphere, Muramasa, Dragon's Crown), Darkest Dungeon | Kamitani: in 2D, one extra weapon means drawing that weapon's "animation pattern art" for **every** skill, and each colour variant across all patterns | Partly: we already do this in small doses (A006's raised arm, guard arm, true back) |

**About the three beat 'em ups the user named:** none of their studios has published a parts breakdown. Here is what is on record:

- **Dragon's Crown** (Vanillaware): characters are separate painted parts joined at the joints and deformed. Data rips of Odin Sphere and Muramasa show each part is a flat quad that the game moves, rotates and squeezes. Some parts are drawn in additive blend for glow, and some are grey masks tinted by code. Vanillaware uses its own Flash-like editor. Kamitani draws a set of basic poses, and the animators make them move.
- **Absolum** (Supamonks for Dotemu and Guard Crush): hand-drawn 2D animation by an animation studio. The art director says they had to "drastically" reduce frames per move and choose each frame carefully (anticipation, pauses, delays) to keep the game snappy. That is frame-by-frame thinking, not a rig.
- **Marvel Cosmic Invasion** (Tribute Games): pixel-art sprites, the same family as Shredder's Revenge. Nothing published about rigs.

So the two newest beat 'em ups are frame by frame, which is out of our reach. **Vanillaware is the only beat 'em up studio making rigged characters look hand-animated, and their method rests on drawing a lot of parts.**

---

## 2. How many pieces? Real part lists

The clearest numbers come from files anyone can open:

| Character | Bones / slots | Drawings | What the extra drawings are |
|---|---|---|---|
| **Spineboy** (Spine's flagship example) | 15 body parts: head, neck, torso, goggles; per arm: upper arm, forearm (bracer), plus a near **fist**; per leg: thigh, shin, **foot** | 21 body images | **Near fist open and closed**, 2 eye states, 3 mouths |
| **Spine "Goblins"** | 17 body parts: head, neck, torso, **pelvis**, plus left/right shoulder, arm, **hand**, upper leg, lower leg, **foot** | 19 per skin (adds closed eyes and clothing), 2 skins | Two characters share one skeleton by using **identical part names**; swapping the "skin" swaps every drawing |
| **Don't Starve Together** character template (Klei) | ~19 symbols: headbase, face, hair (+ hat versions), torso, **torso_pelvis**, arm_upper, arm_lower, **hand**, leg, **foot**, tail, skirt | **~155 images** | face 33, **hand 20**, tail 12, torso 11, pelvis 11, leg 11, foot 8, arm 7. The extra drawings per symbol cover different facings and poses |
| **Wildermyth** (paper doll) | 5 layer groups: body, head, main-hand item, stowed item, off-hand item | many per rig | **Separate arm drawings for one-handed vs two-handed poses**; each hand has **open, closed and book** grasps; **17 facial expressions**; items attach at a **grip point**; tint channels for skin, hair and clothing; draw order by numbered depth bands |
| **Our Mouse Fighter** | 14 parts | 24 images | 5 heads, 4 torsos, 2 whole-arm swaps, 2 shields |
| **Our Rat Raider** | 13 parts | 24 images | 3 heads, 1 back torso, 2 far-forearm swaps, 6 gear overlays |

**What this shows:** professionals don't use more bones than we do. They differ in three ways:

1. **Hands and feet are separate parts.** Every rig example has them; neither of our characters does. Our fists are painted onto the forearms and our boots onto the shins. That's why the rat's cutlass grip needed a workaround, the mouse can't plant his feet, and T009 parked a "gripping hand".
2. **A pelvis/hip part** (Goblins, Don't Starve) lets the legs swing without tearing the crotch open. We hang legs straight off the torso, which is where the crouch looks wrong.
3. **Libraries of alternate drawings** carry the expressiveness: hands (Don't Starve has 20), faces (33), torsos and directions. Rotating a bone does little; switching drawings does most of the work. Our part swaps (decided 2026-10-14, like Vanillaware) are the right idea. We've just been adding them one at a time, as each move failed.

---

## 3. How professionals draw the parts

From Spine's own guide to cutting assets, Toon Boom's cutout workflow, and the studios above:

- **One master drawing, then trace.** Toon Boom's method: trace the model drawing, one layer per part, completing hidden lines and filling gaps. **Parts are cut from the approved character, not drawn as new pictures.** This is the step we skipped: A004 drew a new, rangier rat as its reference, and each part was generated separately. Its own handoff says the limbs came out slimmer than the reference. Code then "fixed" the proportions with scale fudges (the rat's legs are stretched 1.55 x 0.74 in data). The pros never need that.
- **Paint what's hidden.** Hair behind the head, shoulder under the sleeve, the full upper arm under the torso edge. Hidden areas are what let a part rotate without holes.
- **Round joints.** The overlapping end of a limb should be as close to a circle as possible around the pivot, with the **outline continued past the overlap**, so the line never breaks when the joint bends.
- **Draw bendable parts straight and relaxed.** A straight limb bends either way; a pre-bent one only bends well one way.
- **Separate only what moves independently.** Spine's own rule: separate what you plan to animate, no more.
- **Shared names across bodies.** Spine's Goblins and Don't Starve both reuse one skeleton and one set of animations for many characters by keeping part names identical. That's our "body x colour x weapon kit x gear" assembly line (2026-10-15), and it only works if every body follows the same part list.
- **Grip points and grasp states for weapons.** Wildermyth attaches items at a grip point and switches the hand drawing (open/closed) and arm drawing (one/two-handed). Our T011 weapon kits do the same, so that part of our system matches professional practice.
- **Colour by tint, not repainting.** Vanillaware tints grey masks in code; Wildermyth tints marked layers. Kamitani notes that repainting colour variants across all poses is expensive.

---

## 4. Why our rigs went slapdash: an honest audit

| What happened | Root cause | The fix |
|---|---|---|
| Rat never matched his standee (A004, A005, T011 v2) | Parts weren't cut from the standee; a new rat was drawn, and each part was generated on its own | **Master first, then cut parts from it** (rig standard section 2) |
| Each art packet listed parts differently | No standard part list | **One biped part list** with fixed names for every character |
| Fists fused to forearms, boots to shins | Not in the list | **Hands and feet are separate parts** |
| Legs hang off the torso; crouch looks wrong | No pelvis | **Pelvis part** |
| Swaps added one by one after moves failed (T007 block, T008 spin, T012 cast) | No library planned up front | **Minimum swap library** per character, planned before drawing |
| Proportions fixed in code (scale fudges up to 1.55x) | Parts drawn at the wrong size | **Uniform scale only**; any fudge over 5% sends the art back |
| Joint fit "approximate" in every handoff | Pivots estimated, never measured | **Pivots marked in the source file** and checked by an automatic reassembly |
| Gear drawn before the head was settled (A008 before the rat was right) | Order of work | **Gear and variants come last**, after the body passes its motion test |
| User judged rigs from static mock-ups he found weak | Review image was a still assembly | **Motion test strip** (idle, walk, attack, hurt) before the look gate |

**One thing that's specific to us:** our art comes from an AI image tool, and separate generations drift: each part comes out a slightly different character. That makes "one master, cut the parts from it" even more important for us than for a studio with one painter. The art builder should generate the master once, then **cut** parts from it and use the tool only to **paint in the hidden areas** at the joints (inpainting), never to invent a limb from scratch.

---

## 5. What I recommend

1. **Adopt a rig standard** (written as `docs/design/rig-standard.md`) that every rig packet follows:
    - one biped part list of about 18 parts, adding hands, feet and a pelvis;
    - a minimum swap library (4 hands, 5 or 6 heads, 3 torsos);
    - per-move key drawings only when the motion test shows the rig can't fake a move;
    - drawing rules;
    - a four-gate workflow: master, parts with an automatic fit check, motion test, then gear.
2. **The rat goes first under the standard.** A009 is rewritten to it: master first (the standee redrawn at full size in a rig-ready stance, approved by the user), then parts cut from that master.
3. **A code task for the rig bench:** one page that loads any rig's source parts, reassembles them at rest over the master (showing any proportion drift as an overlay), and plays a standard motion strip. The user then judges art in motion before importing, ending the "rough mock-ups aren't great" problem.
4. **Leave the Mouse Fighter alone for now.** He works and you approved him. Retrofit his hands, feet and pelvis only when a move needs them (the grab knee and a gripping hand are already parked), or when the second hero arrives under the standard.
5. **Process note:** the standard adds two gates (master and motion test) before you approve a rig's look. That's slower per character, but it replaces the four rounds the rat took.

---

## Sources

- [Spine: How to cut your assets for animation](https://en.esotericsoftware.com/blog/How-to-cut-your-assets-for-animation) (hidden areas, round joints, outlines past overlaps, draw straight)
- Spine example projects, part lists read from their atlas files: [spine-runtimes examples](https://github.com/EsotericSoftware/spine-runtimes/tree/4.2/examples) (spineboy, goblins, raptor, mix-and-match)
- Don't Starve Together character template, folder and image counts: [Extended Sample Character](https://github.com/DragonWolfLeo/extendedsamplecharacter-dontstarvetogether)
- [Wildermyth wiki: Image layers](https://wildermyth.com/wiki/Image_layers) (layer groups, one/two-handed arms, grasp states, 17 expressions, tints, depth bands)
- [Toon Boom: How to build a cut-out character](https://docs.toonboom.com/help/harmony-11/workflow-network/Content/_CORE/Getting_Started/007_CT_Character_Building.html) and [About swapping drawings](https://docs.toonboom.com/help/harmony-21/premium/cut-out-animation/about-swap-drawing.html) (trace the model; hand and mouth libraries)
- [4Gamer interview with George Kamitani on Dragon's Crown](https://www.4gamer.net/games/134/G013480/20130726117/) (pattern art per skill per weapon, colour variants across all patterns)
- [Game Developer: King of 2D, George Kamitani](https://www.gamedeveloper.com/business/king-of-2d-vanillaware-s-george-kamitani) (basic poses handed to animators, in-house Flash-like editor, art drawn at double size)
- [VG Resource: Vanillaware ripping project](https://archive.vg-resource.com/thread-38430.html) (parts as quads, additive parts, tinted grey masks, Odin Sphere and Muramasa)
- [Siliconera: Odin Sphere, more than just a pretty picture](https://www.siliconera.com/odin-sphere-more-than-just-a-pretty-picture/) (characters as separate sprites joined at the joints)
- [Creative Bloq: How the world of Absolum was created](https://www.creativebloq.com/3d/video-game-design/how-the-new-fantasy-world-of-video-game-absolum-was-created-in-collaboration-with-an-animation-studio) (frames cut down per move, choosing frames carefully)
- [PlayStation Blog: How Streets of Rage 4's characters were redesigned](https://blog.playstation.com/archive/2020/04/23/how-streets-of-rages-iconic-characters-were-redesigned-for-the-ps4-sequel) (frame by frame in Photoshop, ~1,000 frames per playable character, 300 to 400 per enemy)
- [Wikipedia: Marvel Cosmic Invasion](https://en.wikipedia.org/wiki/Marvel_Cosmic_Invasion) (pixel-art beat 'em up by Tribute Games)
- Darkest Dungeon modding guides ([hero porting](https://steamcommunity.com/sharedfiles/filedetails/?id=2583339977)): each animation (combat, each move, defend, afflicted) is its own Spine skeleton with its own image sheet
