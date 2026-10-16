# T022 - Helping in the fight: AI ally, picking up a downed friend, tossing potions (Code)

**Modules:** `src/sim/ally.js` (new: ally brain), `src/sim/fighter.js` (downed state), `src/sim/revive.js` (new), `src/sim/props.js` / `src/sim/weapons.js` (potion carry + toss), `src/data/items/health-potion.js` (new), `src/data/rules.js`, `src/data/controls.js`, `src/render/` (downed marker, revive ring, potion arc + heal burst, ally HUD), tests. **Read:** `docs/handoffs/game-brief.md` (**the hook**), `docs/decisions.md` (2026-10-16), `src/sim/CONTRACT.md`, `src/render/CONTRACT.md`, `assets/source/BIBLE-items/` (`health-potion.png`).
**Needs:** T021 merged (several heroes, per-slot control, `controller: 'ai'` slot). **Autonomy:** human-gated (feel).

The hook (user, 2026-10-16): **community and helping**. Rescued adventurers fight beside you as **AI allies**, so solo and co-op are one game, and much of the fighting is heroes helping each other. The user picked the first two helping verbs to try: **picking up a downed friend** and **tossing potions**. This task builds both, plus a first AI ally, so they can be felt in solo play and in co-op.

## Do
1. **Downed, not dead (when a team has more than one hero):** at 0 HP a hero falls **downed** (on the floor, can't act, a timer ring over him, ~10 s in data). Enemies ignore downed heroes (no beating on the fallen). If the timer runs out he stays down for the rest of the fight (what that costs is the user's later call: leave a clear hook point, no penalty yet). All heroes downed = game over as now. A lone hero with no ally dies exactly as today (old case = old result).
2. **Pick up a downed friend:** stand next to him and **hold** the interact button (H, the grab/pickup button; pad Y) for about 1.2 s (data); a filling ring shows progress; being hit cancels it. He gets up with a share of his health (data, e.g. 35%) and a moment of invulnerability. Getting a friend up should feel like a small heroic beat: a short flash, a "Up!" pop, maybe a hand-clasp pose if cheap.
3. **Potions:** `health-potion` item (art: `assets/source/BIBLE-items/health-potion.png`, keyed by Code), dropped by some crates and some enemies (data weights). Pick it up with H as with food, but it's **carried** (one potion slot per hero, shown on his HUD) instead of used at once. A new **use** button (keyboard U, pad LB, in `controls.js`):
   - tap: **toss** it in an arc to the ally in front of you (or nearest if none in front); it heals on landing near him (small splash radius, so a moving target still gets it), or lands on the floor as a pickup if no one is there;
   - hold: drink it yourself.
   Healing numbers in data; the heal shows as a green burst and a rising number.
4. **First AI ally:** a second hero slot with `controller: 'ai'`, for now a tinted Mouse Fighter (placeholder until rescued adventurers have their own art). Simple, readable brain:
   - stays near the player-hero (leash distance), fights the nearest enemy that's not engaging the player, uses the hero's moves and block;
   - **helps**: goes to pick up a downed friend first (if no enemy is about to hit him), tosses his potion to a hero below a health threshold, drinks it himself if low and alone;
   - never steals the player's kill-feel: lower damage or fewer attacks than a human (data), and he obeys the enemies' fairness rules (he doesn't stun-lock).
   Start it with `?ally=1` (or a lab toggle); default off in normal play until the user decides.
5. Enemies: count downed heroes as not targetable; an enemy targeting a hero who gets downed picks a new target.
6. Lab sliders for the new numbers (optional); build label `t022 helping v1`.

## Acceptance
- Headless: `npm test` passes; **solo with no ally = main's bot numbers exactly**; new tests: a downed hero is revived by holding the button for the set time; a hit cancels it; enemies don't attack downed heroes; a tossed potion heals the ally it lands near; the AI ally revives a downed player-hero in a scripted fight; two scripted heroes + one ally clear `harbor-run`.
- Windowed (JPG) in `docs/screens/T022/`: a downed hero with the timer ring; a revive in progress; a potion in mid-arc; the AI ally fighting beside the player.
- Human: play solo with `?ally=1` and with two people. Does picking a friend up feel good and worth the risk? Does tossing a potion feel like helping? Is the ally helpful without stealing the fight?

Out of scope: rescued adventurers' art and own move sets, more helping verbs (shield cover, friend toss, team lift: later), failure costs, the home base.

## Addendum (lead, 2026-10-16, from the study "Mission and home-base games")
Dragon's Crown's AI allies became "boss fodder", "getting torn to shreds" by big attacks. So the ally brain's **first rule is to step out of telegraphed danger**: when an enemy is in windup and the ally is inside that attack's reach and lane, he moves out of the lane (or blocks, if he can) before doing anything else. Add a test: an ally standing in a rat's lane during a windup has left the lane by the strike frame.
