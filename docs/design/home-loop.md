# The home loop (mission -> abbey -> mission)

Living design doc for the stronghold loop. Background: `docs/studies/2026-10-16-mission-and-home-base-games.md`. The hook is in `docs/handoffs/game-brief.md`. Decisions are logged in `docs/decisions.md`; this doc gathers them in one place. Placeholder names ("the abbey") until the user names things.

## Rules we hold to (the five failures we avoid)
1. **No home timers, ever.** Nothing decays, ticks or needs upkeep while away; no mission is gated on stockpiling.
2. **No currency sprawl.** One building currency, plus gear and the rescued folk themselves.
3. **No required grind.** The first mission is fun with zero upgrades; rescues unlock options more often than raw stats; stat bonuses are small, village-wide, and can double as accessibility help.
4. **No chores that undercut warmth.** Home time is people and choices, not meters to refill.
5. **No permanently missable rescues.** A rumor board points to anyone skipped.

## Settled (user, 2026-10-16)
- All 15 study recommendations accepted, with gear allowed to grow (below).
- **Co-op players share one abbey** and its progress.
- **Missions:** hand-crafted at first; procedural generation later if it can be made reliable. Build missions from modular pieces (zones, encounters, captives as data) so that path stays open.
- **Allies:** can be **downed in a mission in a way that needs a fix** back home; **never killed permanently except by the story**.
- **Reformed vermin** can join the abbey.
- **Cast size:** not decided; too early.

## The loop (target shape)
- **Mission (10-20 min):** a hand-made stage with a goal (often a rescue), loot and building currency on the way.
- **Abbey (a few minutes, one walkable room):** rescued folk appear near their building; one real decision each visit (what to rebuild, who comes along, what to equip, which rumor to chase); reactive lines from residents about the last mission.
- **Every rescue:** one visible change (a resident by a ruined building slot that gets restored) and one playable change (a vendor, an assist, a move, an ally). About 1 in 3-4 rescues is an adventurer; the rest are services or village-wide boons.
- **Season close ("Winter at the abbey") every 4-6 missions:** promotions, a big rebuild beat, story.
- **Hub lines are data rows with conditions** (rescued X, Y went down, Z revived you, boss beaten).

## Gear (the lead's view on "more gear eventually")
Agree that gear should grow; the study's lesson isn't "few slots" but **every item matters and reads at a glance** (no stat soup, no appraisal fees). So:
- **Start:** weapon + one ring.
- **Slots unlock as the abbey grows** (a rescued smith, tailor, jeweler): armour or cloak, a charm, a familiar (Castle Crashers' animal orbs fit the world), maybe a second ring. Each unlock is itself a rescue reward.
- **Each item has one clear effect** shown immediately; fewer, stronger items (Dead Cells).
- **Visible gear:** armour, cloaks and helmets are gear overlays on the rig (rig standard section 7), so equipping changes how the hero looks. That's a big payoff we already have the tools for.
- Weapons are the same items whether held or on the floor (decision 2026-10-16).

## Downed allies (the lead's view)
Agree with "downed, needs a fix, never killed except by story." Caution: if the fix is a **rare item**, it becomes a second currency and a grind (failures 2 and 3). Proposed instead: a downed ally comes home **wounded** and either sits out the next mission or is tended at once by the abbey's healer (a rescued healer makes it free and instant; before that, it costs a little building currency). Still a real cost, no farming.

## Open
- Total cast size; how adventurers are chosen per mission; the first 3-5 rescued folk and what each gives.
- What a failed mission costs (retreat home and retry, per the earlier lean).
- More helping verbs after revive + potion toss (shield cover, carrying a captive out, team throws).
