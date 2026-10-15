# The belt-scroller: a genre study for Tales of Cloak & Claw

*Study, 2026-10-14. Not a decision document: anything we settle goes to `docs/decisions.md`.*

## Where the project stood

- **Stage 1** (standee combat in one arena) built and waiting for its gate; the user has not played it yet.
- **Last tasks:** none under the new workflow. Written and queued: T001 tuning lab, T002 run log, A001 Mouse Fighter rig parts.
- **Being discussed:** the four design pillars (confirmed), League of Legends-style hero kits (parked for Stage 8), the stage plan through Stage 8.
- **Why this study:** the user wants to know the genre well before making the big calls (run structure, defence, progression, enemy roster).

---

## 1. The short version

1. **The genre's core pleasure is crowd control.** You are outnumbered, and you win by positioning, by using enemies against each other and by turning a mob into a line you can hit. The best games give you few buttons but many ways to manage a crowd: throws, sweeps, knockdowns that bowl over others, weapons, a panic button.
2. **Fun comes from feel first, content second.** Hit-stop, knockback and sound sell a punch. Arcade classics had few animation frames and still felt heavy. (This is our Pillar 1.)
3. **Enemies are the real level design.** A stage is a sequence of enemy combinations. Each enemy type asks a different question (block me, chase me, dodge me, grab me), and mixing them is where depth comes from.
4. **Every great entry is remembered for one big idea:** Golden Axe's mounts and thieves, River City Ransom's shops and stat growth, Streets of Rage 4's health-for-power trade, Castle Crashers' levelling and pets, Absolum's roguelite runs.
5. **There are four broad structures:** a straight arcade run, a run with RPG growth, a roguelite, and an open map. They differ hugely in how much art and level content they need. For a small team making its own art, the roguelite and "arcade run with growth" structures give the most replay per image drawn.

---

## 2. A short history

### Origins (1984–1987): from one line to a floor
- **Kung-Fu Master** (Irem, 1984): one character walks one flat line punching waves of enemies. All the rhythm, none of the depth.
- **Renegade** (Technōs, 1986): you can move **up and down as well as left and right**, so enemies can surround you. This is the belt.
- **Double Dragon** (Technōs, 1987): two-player co-op, weapons dropped by enemies (bats, whips, knives), grabs and knees, and a bit of **friendly fire** that made co-op funny. It set the template almost everyone copied.

### The arcade golden age (1989–1997)
- **Final Fight** (Capcom, 1989): huge sprites and big crowds. Three heroes with **different stat profiles** (Haggar slow and strong, Guy fast, Cody balanced). The **desperation move**: a spin attack that clears everyone around you but costs a little health. That one trade (safety now, cost later) shaped the genre for 30 years.
- **Golden Axe** (Sega, 1989): fantasy setting, **magic** powered by potion pots (more pots, bigger spell), **mounts** you knock riders off and steal, and **little thieves** who run in during breaks to steal or drop potions. Fantasy plus chaos plus a reason to chase things.
- **Teenage Mutant Ninja Turtles** (Konami, 1989): four-player arcade co-op, bright characters, objects and enemies hurled at the screen. Proved the genre as a social party game.
- **The Simpsons** (Konami, 1991): same formula with team-up moves when two players stand close together.
- **Knights of the Round** (Capcom, 1991): heroes **level up** during a run, gaining armour and weapon upgrades: the first RPG growth in an arcade brawler.
- **Streets of Rage 1 and 2** (Sega, 1991–92): tight console design, specials that cost health, and a legendary club soundtrack. Part 2 is often called the best of the classic era.
- **Dungeons & Dragons: Tower of Doom / Shadow over Mystara** (Capcom, 1993–96): **classes** (fighter, cleric, elf, dwarf, thief, magic-user), spells, an item inventory, shops, **branching paths** and treasure. The deepest arcade brawlers ever made, and the closest ancestor of our game.
- **Guardian Heroes** (Treasure, 1996): three depth lanes you hop between, levelling, a branching story, and a huge amount of character.
- **Battle Circuit** (Capcom, 1997): fighting-game inputs and between-stage upgrade shopping.

### The RPG branch (1989)
- **River City Ransom** (Technōs, NES, 1989): instead of a straight line, a **connected town** you roam. Money from beaten gangs, **shops and food that permanently raise stats**, **books that teach new moves**, and a password save. Small, funny and endlessly replayable. Our Pillar 3 comes from here.

### Decline and the move to 3D (late 1990s–2000s)
Arcades faded, and brawling turned into 3D "character action" (Devil May Cry, God of War) and "musou" mass-battle games (Dynasty Warriors). The **2D belt-scroller nearly vanished in the West**, but survived in Korea as online games such as **Dungeon Fighter Online** (2005): classes with cooldown skill bars, passives and "awakening" ultimates (the League-style kit idea).

### The indie and modern revival (2008–now)
- **Castle Crashers** (The Behemoth, 2008): cartoon art, **XP and four stats** to raise, unlockable weapons, **animal orb pets** that help you, a block button and an overworld node map. It revived the genre and showed **cartoon art plus RPG growth** can carry a whole game.
- **Scott Pilgrim vs. the World** (Ubisoft, 2010): River City Ransom-style shops and stats with superb pixel art.
- **Dragon's Crown** (Vanillaware, 2013): D&D-style classes, loot, skill trees, a dungeon-delving loop and a procedurally varied post-game dungeon.
- **River City Girls** (WayForward, 2019): modern River City Ransom with an open town, shops and equipment.
- **Streets of Rage 4** (Lizardcube / Guard Crush, 2020): **juggles and wall bounces** for long combos, and specials that cost health which you **earn back by keep hitting without getting hit**. Deep for experts, easy for beginners.
- **TMNT: Shredder's Revenge** (Tribute, 2022): six-player co-op, distinct move sets, a light levelling layer.
- **Absolum** (Guard Crush / Supamonks / Dotemu, 2025): the genre's biggest recent success. A **roguelite**: four classes, light and heavy attacks, mana-powered "Arcana" specials, **dodge/parry timing**, randomized passive boons ("Rituals") lost on death, branching paths and a hub between runs. Critics praised the crunchy combat; complaints were difficulty spikes and repetition.
- **On the horizon (2026):** a He-Man retro brawler (Bitmap Bureau), Scott Pilgrim EX (Tribute), Rushing Beat X (adding auto-combos, counters and a rage mode to a 1993 game), and Mayhem Brawler 2 (roguelite runs with branching paths and RPG upgrades). The roguelite-with-classes direction is clearly where the genre is heading.

---

## 3. Why these games are fun

| Pleasure | What delivers it |
|---|---|
| **Power fantasy against a crowd** | Knockdowns that bowl over others, throws into groups, wide sweeps, a panic button |
| **Impact you can feel** | Hit-stop, screen shake, knockback, sound, enemy reactions (the "crunch") |
| **Readable cause and effect** | Big silhouettes, telegraphed swings, clear "I got hit because I stood there" |
| **Tourism** | Every stage is a new place with its own gimmick: a moving train, an elevator, a boat, a burning village |
| **Couch co-op chaos** | Shared screen, combined attacks, fighting over the food on the floor |
| **Short, complete sessions** | A full game in 30 to 60 minutes; "one more go" |
| **Mastery hidden in simplicity** | Two buttons, but expert players juggle, crowd-herd and never get hit |
| **Growth** (RPG branch) | Watching numbers and moves improve; choices about what to buy or learn |

---

## 4. The combat levers

These are the dials every belt-scroller sets. Each says what it gives and what it costs.

### 4.1 Controls
- **Classic:** attack + jump (+ a special). Combos come from repeated presses; direction + attack gives variants (back attack, dash attack).
- **Modern:** light + heavy attacks, dash or dodge, special/skill buttons. Richer, but every button must earn its place, and keyboard and phone play suffer from too many.
- *Our state:* attack + jump. A third button (defence or special) is the most natural next step.

### 4.2 Combos, hitstun and juggling
- **Hitstun** (how long a hit enemy is helpless) decides how easy combos are. Long stun = easy flowing combos; short stun = tense trading.
- **Juggles** (hitting enemies in the air), **wall bounces** and **hitting downed enemies** extend combos for expert play (Streets of Rage 4). They add depth but also make enemies feel like punching bags if overdone.
- *Our state:* 3-hit combo with a knockdown finisher, jump slash. No juggles.

### 4.3 Grabs and throws
Walk into an enemy to grab, then throw them into others: the oldest crowd-control tool (Double Dragon, Final Fight). Throws turn enemies into weapons and reward positioning. They're cheap to show with standees: the thrown enemy just becomes a spinning projectile.

### 4.4 The defensive tool (the biggest design decision)
How the player escapes a bad spot defines a game's character:

| Option | Example | Feel |
|---|---|---|
| **Health-cost panic move** | Final Fight, SoR | "Pay to escape." Forgiving, simple. |
| **Recoverable-health special** | Streets of Rage 4 | Rewards aggression: keep hitting to earn the health back |
| **Meter/potion magic** | Golden Axe, Absolum (mana) | Save it for emergencies; big screen-clearing moments |
| **Block** | Castle Crashers | Safe and readable; can be passive |
| **Dodge/roll** | Many modern | Mobile; risks making positioning trivial |
| **Parry (timed block)** | Absolum, Rushing Beat X | Skillful and exciting; needs clear telegraphs (which our rats already have) |

Our Mouse Fighter carries a **shield**, so a block-that-becomes-a-parry-when-timed fits the character, honours Pillar 2 (fair) and makes hits exciting (Pillar 1: a parry is a big hit-stop moment).

### 4.5 Weapons and the floor
Dropped weapons (Double Dragon knives, Final Fight pipes), breakable barrels hiding **food** (the classic "roast chicken in a barrel") and throwable objects make arenas into toolboxes. Cheap to add, big variety.

### 4.6 Enemy design (where depth really lives)
Classic archetypes, each asking the player a question:

| Archetype | The question it asks | Classic example |
|---|---|---|
| Grunt | "Can you handle numbers?" | Final Fight's thugs |
| Rusher / charger | "Can you sidestep?" | Dashing enemies, bulls |
| Ranged | "Will you close the distance?" | Knife throwers, archers |
| Shielded / armoured front | "Can you get behind me or break my guard?" | Riot police, knights |
| Heavy (super armour) | "Will you stop mashing?" | Andore, fat bruisers |
| Grabber | "Will you keep your distance?" | Wrestlers |
| Hit-and-run / evasive | "Can you corner me?" | Ninjas, acrobats |
| Flyer / jumper | "Can you hit up?" | Bats, birds |
| Area denial | "Can you move under pressure?" | Fire, poison puddles |
| Thief / bonus runner | "Will you chase?" | Golden Axe thieves |
| Reviver / necromancer | "Who do you kill first?" | Priests, summoners |

- **Fairness tools:** attack tokens (only one or two enemies attack at once), long telegraphs, enemies that circle instead of all piling in. *We already do this (Pillar 2).*
- **Bosses:** a pattern to learn plus minions, health in layers, and often one rule-breaking trick (Golden Axe's Death Adder, a boss that blocks, a boss that steals).

### 4.7 Juice
Hit-stop, shake, flashes, sparks, damage numbers, knockback distance, slow motion on the final KO, and sound. Arcade games tuned these obsessively. *We have most of these; sound comes in Stage 7.*

---

## 5. The map and structure levers

| Structure | Example | Content cost | Replay | Session fit (30–60 min) |
|---|---|---|---|---|
| **Linear arcade run** with locked "clear this group" arenas | Final Fight, SoR | Medium: every stage hand-made | Low to medium (score, characters) | Excellent |
| **Arcade run + branching paths** | D&D, Guardian Heroes | Higher: more stages | Medium | Excellent |
| **Overworld node map** (pick next stage) | Castle Crashers | Medium | Medium | Good (save between) |
| **Open connected town** | River City Ransom, River City Girls | High: big map, backtracking | Medium to high | Saves needed |
| **Roguelite runs** (random boons, branching map, hub, meta-unlocks) | Absolum, Mayhem Brawler 2 | **Low per hour of play**: content is recombined | High | Excellent if a run is 30–60 min |

**Stage set pieces** do a lot of work cheaply: a moving boat or cart (scrolling background), an elevator (enemies arriving from above), a collapsing floor, hazards (water edges, pits, conveyor belts), foreground props that hide enemies, weather.

---

## 6. Progression: the RPG dial

From none to deep:
1. **None** (Final Fight): every run the same; mastery is the progression.
2. **In-run levelling** (Knights of the Round, D&D): grow during a run, reset after.
3. **Persistent stats and shops** (River City Ransom, Castle Crashers): food and purchases raise stats permanently; books or levels unlock moves.
4. **Loot and skill trees** (Dragon's Crown, Dungeon Fighter): equipment, class trees. Deep, but number-heavy (watch our "no heavy bookkeeping" taste).
5. **Roguelite boons + meta-progression** (Absolum): random passive upgrades each run, lost on death, plus slow permanent unlocks between runs.
6. **Cooldown skill kits** (Dungeon Fighter Online, the League model): passive + abilities + ultimate per hero. Strong identity per character; more buttons.

**Characters and differentiation** run on the same dial: stat profiles (Final Fight's three), full classes (D&D's six), or kits (DFO / League).

---

## 7. What made the greats different

| Game | Remembered for | Lesson for us |
|---|---|---|
| Double Dragon | Weapons, grabs, co-op | The floor is a toolbox |
| Final Fight | Big crowds, desperation move | A panic button with a cost |
| Golden Axe | Mounts, magic pots, thieves | Fantasy chaos and things worth chasing |
| River City Ransom | Shops, food stats, learnable moves | Growth that feels personal and funny |
| D&D Shadow over Mystara | Classes, spells, inventory, branches | Depth fits in a 45-minute run |
| Guardian Heroes | Lanes, levelling, branching story | Ambition, character |
| Castle Crashers | Cartoon art, XP, pets | Cartoon art + light RPG can carry a game |
| Streets of Rage 4 | Juggles, recoverable-health specials | Reward aggression, keep it readable |
| Dungeon Fighter Online | Cooldown kits, awakenings | Heroes as distinct kits |
| Absolum | Roguelite runs, parry, boons | Replay from recombination, not more art |

---

## 8. Directions we could take

**A. Pure arcade run.** Five or six hand-made stages, 30–45 minutes, score and lives. Cheapest to design, but needs the most stage art per hour of play and has the least "grow" (weak on Pillar 3).

**B. Arcade run + River City Ransom growth** (the current plan). Fixed stages; coins and food raise stats during the run; a shop between stages; learnable moves. Strong on Pillars 1–3. Replay is moderate.

**C. Roguelite with fixed stages.** Hand-made stages linked by a branching path map; each clear offers a choice of boons (a passive, a move upgrade, a stat); death ends the run; a hub between runs unlocks new boons and heroes. Most replay per piece of art (Pillar 4), strong growth inside each run (Pillar 3), natural 30–60 minute runs. Risk: repetition (Absolum's critics) and balancing boons (our bot runs help).

**D. Open connected world** (River City Ransom proper). Charming, but the most art and map work, plus saves and backtracking. Highest risk for us.

**Lead's suggestion (for discussion, not decided):** **B growing into C.** Build B first because it's what Stages 4–6 already plan. Then, if runs feel samey, add a branching path map and boon choices on top. That's a small step from B and it multiplies replay without new art. Keep League-style kits for when there's a second hero (Stage 8).

---

## 9. Ideas that fit Tales of Cloak & Claw

These use art we already have (the art bible) or that is easy to make. All are proposals.

### Combat
- **Shield parry for Mouse Fighter.** Hold to block (chip damage), tap just before a hit to parry: a big flash, hit-stop and the attacker staggered. Our rats' yellow windup flash already gives the timing cue.
- **Throws.** Grab a stunned rat and fling it into the others; the thrown body bowls them over. Cheap with standees: a spinning cutout.
- **Size matters.** In this world sizes are compressed but real: a mouse is about three-quarters of a rat's height. Small heroes could slide under high swings; big enemies can't be thrown, only staggered.
- **Food from the art bible.** Berry Pie and Cheese Wedge from broken crates heal and, River City Ransom style, give small permanent boosts. A Health Potion restores; a Mana Potion fills a special meter.
- **Panic move with a cost.** A shield-spin that clears a circle for a slice of health, regained by hitting without being hit (the Streets of Rage 4 rule): forgiving, and it rewards aggression.

### Enemies (all from the art bible)
| Enemy | Role | Question it asks |
|---|---|---|
| Rat Raider | Grunt | Numbers |
| Rat Archer | Ranged, retreats when approached | Close the distance |
| Stoat Duelist | Parries frontal hits; must be thrown, hit from behind or broken by a finisher | Positioning |
| Shield Beetle | Armoured front, charges in a straight line | Sidestep, then hit its back |
| Acidspitter Beetle | Leaves acid puddles | Move under pressure |
| Cavern Spider | Drops from above; webs slow you | Watch the shadows |
| Cave Bat | Flies above standing height | Jump attacks |
| Marsh Serpent | Lunges from the edge of the floor (water) | Don't hug the edge |
| Skeletal Mouse | Gets back up unless finished with a finisher | Who to focus |
| Bramble Brute | Boss: super armour, thorn bursts, summons | Pattern + adds |

### Golden Axe-style chaos
- **Mounts:** knock the rider off a **Shield Beetle** and ride it: a charging, armoured mount for a short while.
- **Thieves:** a tiny pickpocket scurries through between waves carrying a **Coin Purse** or potion; catch it for the loot (Golden Axe's thieves).
- **Treasure Chest** at the end of a stage: bonus coins, or a choice of boons (if we go roguelite).

### Stages (the three environments we have)
- **Harbor Market:** crates and barrels to break, hanging cargo nets, knock enemies off the dock into the water (instant KO, a Golden Axe-style ring-out).
- **Living Cavern Settlement:** dim light with glowing crystals, spiders dropping from above, mushroom platforms.
- **Woodland Aqueduct:** waterfalls and ruins, vines, a moving-raft section along the channel.

### Heroes later (Stage 8), as League-style kits
The five hero images (Mouse Fighter, Badger Guardian, Rabbit Mage, Fox Rogue, Squirrel Ranger) map neatly onto the classic five: balanced fighter, heavy tank, caster, fast rogue, ranged. Each could have a passive, three cooldown abilities and an ultimate, for example Badger Guardian's passive: "can't be knocked down while swinging".

---

## 10. Questions this raises for the user

1. Run structure: **B**, **C**, or B-then-C?
2. Defensive tool: shield block/parry, dodge, or a health-cost panic move (or two of these)?
3. Grabs and throws: yes or no?
4. Breakable crates with food and floor weapons: yes or no?
5. How combo-heavy: keep simple 3-hit combos, or add juggles for expert play?
6. Death: lives and continues (arcade), or a run ends on death (roguelite)?

None of these is urgent before the Stage 1 gate. The gate answer ("is hitting rats fun?") comes first.

---

## Sources

- [Final fight(s): The 25 best beat-'em-up games (AV Club)](https://www.avclub.com/best-beat-em-ups-of-all-time)
- [Absolum (Wikipedia)](https://en.wikipedia.org/wiki/Absolum)
- [Upcoming Beat 'Em Ups in 2026 (The Outerhaven)](https://www.theouterhaven.net/beat-em-ups-2026/)
- [Best belt scroller video games of all time (Glitchwave)](https://glitchwave.com/charts/top/game/all-time/g:belt-scroller/)
- Other history and design detail: the lead's general knowledge of the genre; release years given to the best of that knowledge.
