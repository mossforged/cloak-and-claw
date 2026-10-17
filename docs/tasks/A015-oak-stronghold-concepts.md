# A015 - The oak stronghold: second concept pass (Art)

**Read:** `docs/tasks/A014-stronghold-concepts.md` and its sheets + `HANDOFF.md` in `docs/concepts/A014-stronghold/` (direction **B, the ancient oak**, is the user's favourite so far), `docs/design/home-loop.md`, `docs/style-contract.md`, `docs/concepts/art-bible/contact-sheet.jpg`, `assets/art/stages/harbor-market.png`, `assets/art/heroes/mouse-fighter.png` (the real hero standee, for scale).
**Autonomy:** human-gated (the user picks the layout and the pieces). **Needs:** A014 (merged).
**Deliver to:** `docs/concepts/A015-oak-stronghold/` (this packet's only output folder). **JPG, quality ~85, each sheet under 1 MB, whole folder under 10 MB.** Nothing in `assets/source/`, no raw tool outputs.

The user likes direction B: a huge hollow oak grown through old stone ruins. This pass narrows it to something we could build, and fixes what the lead saw in A014. The idea to lean into: **the oak split the old fortress, and now its roots hold the broken walls together.** The tree is quietly doing what the hero does: holding a fallen place together until folk come back. Make that visible (roots gripping stones, walls resting on roots), so the place is ours and not a generic tree house.

## Fix from A014
- **Animal scale.** A014 reads as a human-sized castle. Show that small animals live here: found objects in use (thimble lantern, cotton-spool table, button wheels, teacup planter, nutshell bowls, acorn-cap lids, a needle as a flagpole), plants that tower over the doors (clover, ferns, toadstools, dandelion heads), doors and steps sized to a 130 px mouse.
- **Hero at true size.** Paste `assets/art/heroes/mouse-fighter.png` scaled to **130 px tall** into every game frame, standing on the floor (A014's mouse was too small).
- **Style.** Match the art bible: painted, bold dark outlines, light from the upper left. A014's home frames were flatter and brighter; aim between them and the art-bible stages.
- **No invented emblems.** Banners and bunting in plain cloth colours (muted reds, blues, golds); no symbols or heraldry. The user picks any emblem later.
- **Residents** are grey silhouettes of **small animals** (you may grey out the art-bible heroes in `assets/art/heroes/` for shapes), never human figures.
- **Watch post and garden** need a big silhouette change at game size: e.g. the watch post climbs the trunk to a lookout platform in the branches; the garden goes from bare soil to tall bean poles and sunflowers over the wall.

## Sheets
1. `01-layouts.jpg`: **three layout options** for the one walkable home screen (960 x 540, side-on, floor about **120 px deep**, marked): (a) trunk centred behind the wall, building bays in the root arches either side; (b) trunk at one end as the landmark, bays along the wall toward the gate; (c) a courtyard inside a ring of roots. Mission exit at one side in each. Keep the canopy in the top third and behind everything (it will be its own background layer), so it never crowds the bays.
2. `02-home-frame.jpg`: your favourite layout as a full 960 x 540 frame, partly restored (some bays ruined, some cleared, some working), with the hero at 130 px, a front piece or two at the bottom edge.
3. `03-day-one-vs-full.jpg`: that frame twice, day one (empty ruin, cold) and fully restored (lights, smoke, bunting, residents' silhouettes).
4. `04-bays.jpg` (may be two sheets): the six spots (smithy, kitchen, healer, tailor, watch post, garden) **x three states** (ruined, cleared, working), redrawn as stone-and-root bays of this oak. Each working bay shows its job at a glance; leave a standing spot for its resident.
5. `05-animal-scale-kit.jpg`: the found-object and plant pieces, plus the keepers from A014: notice / rumor board, thimble lantern, communal fire, beetle with pebble, snail, birds, moths.
6. `prompt.md` and `HANDOFF.md` (your layout pick and why; what the tool struggled with).

## Acceptance
- All sheets present, JPG, size limits met, labelled; hero at 130 px in every game frame; floor depth marked.
- Human: which layout? Does it feel like small folk live here? Does the oak holding the walls together read? Which bays read clearly before/after at game size?

Out of scope: game-ready layers (next task, once a layout is picked), characters, UI, code.
