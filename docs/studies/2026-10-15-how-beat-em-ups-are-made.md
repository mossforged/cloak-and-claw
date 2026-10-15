# How beat 'em ups are made: lessons from the people who made them

*Study, 2026-10-15. Not a decision document: anything we adopt goes to `docs/decisions.md`.*

## Where the project stood

- **Stage 2** (feel pass + crowd tools) in progress. Stage 1 gate passed; the Stage 3 rig work is done (A001, T003, A002, T005: user called it "a big improvement").
- **Last tasks merged:** T006 floor lane (code), A003 harbor props (art, look check pending).
- **Queued:** T007 shield block, T008 spin slash (code); A004 Rat Raider rig parts (art).
- **Just decided:** target belt depth about 120 px; the lab is a core tool, but builders ship working defaults.
- **Why this study:** the user asked what developers of these games have said about how they're made (tips, shortcuts and warnings), and floated a future **enemy design workspace** for assembly-line enemy creation.

---

## 1. Who said what (sources at the end)

The richest first-hand accounts come from the **Streets of Rage 4** team (Guard Crush Games did programming and engine, Lizardcube art, DotEmu design and production; three years), the same core team's **Absolum** (2025), **The Behemoth** on Castle Crashers, **Akira Nishitani** and the Capcom team on Final Fight, and **George Kamitani** of Vanillaware (Odin Sphere, Dragon's Crown). Where this study adds general genre practice that isn't from a named source, it says so.

---

## 2. Tools and iteration speed

- **Make iteration as fast as possible.** Guard Crush (SoR4) chose its language partly because it compiles quickly. Its editor watches files, so an image saved in a paint program appears in the running game immediately.
- **Put the tools inside the game,** not in a separate edit mode: **slow motion, pause and frame-step** were what made hitboxes, AI and collisions tunable (Guard Crush).
- **A reusable genre engine pays off for years.** Guard Crush built its beat 'em up engine over roughly ten years of Streets of Fury before SoR4 and Absolum. Their founders say they make beat 'em ups partly *because* they "had the right technology."
- **Let the tools take the boring parts off the artist.** The Behemoth's export tools meant their artist never thought about image sizes or transparency; on their previous game the programmer lost weeks hand-converting art.

**For us:** the lab is exactly this kind of in-game tool. Worth adding next: **frame-step** (advance one frame at a time while paused) and **auto-reload of data and art files** without restarting. The enemy design workspace (section 8) is the natural next step.

---

## 3. Combat feel

- **Responsiveness beats animation length.** If an animation is slow, shorten it; when a hit connects, the next combo step should start immediately (Lizardcube, SoR4). Fighting games are the benchmark for smoothness.
- **Big characters + few moves can still hit hard.** Final Fight had "few attack patterns", but big sprites gave "a strong impact" (Nishitani). Don't over-build move lists; build impact.
- **Make dodging deliberate:** SoR4 **shrinks the player's hit area in depth while moving up or down**, so stepping out of a lane feels like a real dodge (DotEmu). *Directly useful with our narrow 63 px belt.*
- **Panic moves that cost health "don't feel that good"** unless you can earn the health back by keeping up the attack (SoR4: regain it by hitting; get hit first and it's lost for good). This rewards aggression.
- **Partial-screen "star" moves** replaced the old screen-clearing police call: powerful, but not a full reset (SoR4).
- **Keep enemies on screen:** invisible side walls make knocked enemies bounce back instead of flying off (SoR4).
- **Characters are distinct through pace.** SoR4 removed running and rolling from the main heroes so speed itself becomes a character trait (fast and agile vs slow and powerful). Absolum went the other way (run, jump, dash for every hero) and had to rework many classic genre elements to fit the faster rhythm.
- **"Find the fun first, balance second"** (Jordi Asensio, Absolum).

---

## 4. Enemies and encounters

- **Cap the crowd.** SoR4 limits on-screen enemies to **five** on standard difficulties so each encounter stays readable and memorable, and can be learned by replaying (DotEmu).
- **Design enemies to work together,** and design levels around those combinations (SoR4, following SoR2).
- **Cut enemies that are frustrating rather than hard.** SoR4 left out a flying enemy who was immune to combos. *Warning for our Cave Bat:* flying is fine; flying and hard to hit back is not.
- **Level design is mostly enemy timing and placement,** and it needs constant iteration to keep one fighting system interesting across a whole game (Guard Crush).
- **New hero abilities break old AI.** SoR4 had to change enemy AI because one character's long-range grab beat many behaviours. Expect this when we add throws and new heroes.
- **Surprise helps.** Final Fight added an enemy who drops Molotov cocktails "to create something unexpected" (Nishitani). Fast, evasive enemies were designed from images of how they should *move* first.
- **Cheap roster expansion is classic:** Final Fight's El Gato is a palette swap of Holly Wood with slightly different behaviour. *General genre practice:* colour variants with tweaked stats and AI multiply the roster at almost no art cost.

---

## 5. Difficulty and failure

- **"Challenging, but not punishing"** (Guard Crush). Challenge is what makes the genre worth playing; without it, it's walking right and mashing. It should reward positioning, using the full move set and learning enemy patterns.
- **Restart the current stage, not the whole game,** so a death costs minutes, and you retry right away (SoR4).
- **Offer an easy mode and optional assists** (SoR4's assists cost score, so finishing stays possible without removing the challenge).
- **Arcade vs home:** Nishitani noted Japanese players tried to get far on one coin while American players happily continued. Our lives (decided) sit in between.

---

## 6. Co-op

- **"Balancing a 4-player co-op mode is almost impossible"** (Guard Crush). SoR4 made small tweaks instead, like reduced damage per extra player.
- **Shredder's Revenge** scales the crowd: more players means more enemies and more aggressive bosses.
- **Absolum kept co-op at two players** because its timing systems (deflects, clashes) lose clarity with four, and it simplified online play.
- **Visual clutter** from several players' effects was a known Castle Crashers problem they partly accepted.
- *For us:* the user wants up to **three** players. Plan for clarity early (outline colours per player, effect limits) and scale crowds per player rather than rebalancing everything.

---

## 7. Art, animation and scope

- **Animation and gameplay are designed together.** SoR4 held a kickoff, defined each move's *function* before the art pass, and let animation and gameplay adjust each other (DotEmu). *That's our task packet plus lab loop.*
- **Reuse frames.** Reusing existing frames gave every new SoR4 character an air special almost for free.
- **Tune by extremes:** for one character the team pushed speed and power sliders to the maximum to separate her fast and slow move sets (DotEmu). *Our lab sliders do exactly this.*
- **Vanillaware:** the director builds a striking **screen image first**, then designs the game around it. Rough character sheets and basic poses go to animators, who make them as "cool" as possible. Art is drawn at **double size** and scaled down. They let strong art reshape the concept (Dragon's Crown went outdoors because the background artists kept painting outdoor scenes). Warning: high-res 2D is risky; a discarded direction can waste months.
- **Absolum built levels from long backgrounds cut into reusable pieces.** Zones start familiar (forest, village, mines) and get stranger as the game goes on. *A modular stage kit suits our Stage 5 layered stages.*
- **The perspective is harder than it looks:** characters stay the same size while walking "into" the background, which makes the genre hard to draw and design (Asensio).
- **One artist keeps the style consistent but becomes a bottleneck** (The Behemoth). *Our equivalent: the style contract keeps AI-generated art consistent.*
- **Even "light" RPG elements add a huge balancing load** (Dan Paladin, Castle Crashers): per-level stat balancing made the game far bigger than it looks. *Warning for our Stage 6. Lean on bot simulations.*
- **Fix the weakest element first, then polish the player, then content;** avoid "loose bolts", where great mechanics sit on weak levels (The Behemoth).
- **Cut what doesn't reach the bar:** SoR4 dropped a hub structure and a motorcycle stage, which needed costly special animation and felt too different to have comparable depth. Muramasa (Vanillaware) lost four bosses to cuts.
- **Small teams, long marinating.** The Behemoth stayed at about 9 people and found that adding people barely shortens a 2–3 year game; ideas need time. Vanillaware was 21 people, nearly all artists.
- **Study the originals critically:** the hardest part of SoR4 was separating what made the classics work from their frustrations, setting nostalgia aside (DotEmu).
- **Show it to strangers:** event demos (PAX) were a major source of SoR4's balancing feedback; a queue of smiling players during 10-minute sessions validated their changes.
- **Music** fitted to level segments, not just looped; guest composers gave each boss an identity while one composer kept the stages coherent (SoR4).

---

## 8. The enemy design workspace (the user's idea)

An "assembly line" for enemies would extend the lab. A sketch:

1. **Compose:** pick a body (rig or standee + colour variant), stats, a move set from a move library, and AI brain parameters (range, aggression, cooldowns, telegraph length).
2. **Test bench:** spawn it in an arena against (a) the user, (b) a dummy that blocks or dodges on cue, and (c) a bot player.
3. **Measure automatically:** time to kill, damage dealt per minute, how often its swing can be escaped at human reaction time (as in our T004 test), how often it hits through a block.
4. **Readability checks:** telegraph length above a minimum, silhouette distinct from other enemies, effects not hiding it.
5. **Export:** one data file + registry line, ready to commit.

What it needs first: a **move library** shared between fighters, **colour-variant support**, and the **escape-time and bot metrics** turned into reusable test helpers. Realistically after Stage 4 (enemy variety), when there are several enemies to compare. Parked in STATUS.

---

## 9. Lessons to adopt, ranked by payoff for us

| # | Lesson | Where it lands |
|---|---|---|
| 1 | Shrink the depth hit area while moving vertically (deliberate dodges) | Small code task; helps our 63 px belt now |
| 2 | Cap on-screen enemies (start at 5; per-player scaling later) | Rules data + wave design |
| 3 | Lab: frame-step + live reload | Lab extension |
| 4 | Invisible side walls: knocked enemies bounce back | Small code task |
| 5 | Colour-variant enemies with tweaked stats/AI | Stage 4 roster at almost no art cost |
| 6 | Panic move only if its health cost is recoverable by attacking | When we add a special |
| 7 | Restart at the current stage; easy mode; assists | Stage 6–7 |
| 8 | Keep RPG growth small; balance with bot runs | Stage 6 |
| 9 | Cut frustrating enemies (flying + hard to hit back) | Stage 4 review rule |
| 10 | Modular stage pieces; start familiar, get stranger | Stage 5 art brief |
| 11 | Co-op: scale crowd per player, per-player outlines, effect limits | Stage 8 |
| 12 | Show builds to strangers early | Stage 7 |

---

## Sources

- [The making of Streets of Rage 4, by the people who made it happen (Nintendo Life)](https://www.nintendolife.com/news/2020/06/feature_the_making_of_streets_of_rage_4_by_the_people_who_made_it_happen)
- [Streets of Rage 4: how three studios revived a legendary series (PlayStation Blog)](https://blog.playstation.com/2020/04/30/streets-of-rage-4-how-three-studios-revived-a-legendary-series/)
- [Interview: Streets of Rage 4 (Last Minute Continue)](https://lastminutecontinue.com/interview/interview-streets-of-rage-4/)
- [Absolum interview (Inverse)](https://www.inverse.com/gaming/absolum-interview-beat-em-up-roguelite-arcade-streets-of-rage-4-guard-crush)
- [Absolum: interview with the founders (Netto's Game Room)](https://www.nettosgameroom.com/2025/12/absolum-interview-with-founders-of.html?m=1)
- [Shredder's Revenge: interview with Frédéric Gémus (MegaVisions)](https://www.megavisions.net/pax-east-2022-interview-with-frederic-gemus-on-designing-tmnt-shredders-revenge/)
- [Final Fight development column (Capcom Fighters Network)](https://game.capcom.com/cfn/sfv/column/132673?lang=en)
- [Taunting the Behemoth: Tom Fulp and Dan Paladin (Game Developer)](https://gamedeveloper.com/design/taunting-the-behemoth-tom-fulp-and-dan-paladin-cry-out)
- [King of 2D: Vanillaware's George Kamitani (Game Developer)](https://www.gamedeveloper.com/business/king-of-2d-vanillaware-s-george-kamitani)
- [How Vanillaware's games embrace change from pitch to release (Game Developer)](https://gamedeveloper.com/design/how-vanillaware-s-games-embrace-change-from-pitch-to-release)
- Some details are summaries of these interviews rather than direct quotes; items marked "general genre practice" are the lead's knowledge, not a named source.
