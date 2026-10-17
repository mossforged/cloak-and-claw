# A021 - Four new weapon items: dagger, round shield, hand axe, staff (Art)

**Read:** `docs/design/rig-standard.md` section 5a (weapons are items: held art = floor art, handle axis, grip markers), `docs/style-contract.md`, the existing items for style and scale: `assets/source/A003-harbor-props/` (rat cutlass, plank club) and `assets/source/A012-rat-spear-bow/` (`weapons.json` is the format to follow, `review-game-size.png`), `assets/source/A018-rat-parts/` (`reference.png`, the rebuilt rat, for scale; his grip hands `hand-near-grip.png`, `hand-near-grip-overhand.png`, `hand-far-shield.png`), `docs/design/rigs/rat-raider.md` (the flexibility test these feed). **Needs:** nothing. **Autonomy:** human-gated (the user looks at them on his phone). **Deliver to:** `assets/source/A021-weapon-items/` (LFS) + phone copies in `docs/screens/A021/`.

These are the weapons for the rat's **flexibility test**: proof that a new weapon is one drawing plus a few measured points, with no new body art. They are items, not body parts: the same drawing lies on the floor and sits in any character's hand, so they must work for the rats now and the mouse and a bigger hero later. Rustic and scavenged, matching the cutlass and spear (worn iron, wrapped grips, lashings), not shiny knightly gear.

## The four items (one PNG each, flat #00FF00, canvas like A012's 1024 x 1536 or wider for the staff; drawn **pointing right**, handle at left, three-quarter-flat so it reads both lying on the floor and held)
| File | What | Size at game scale (rat = 136 px tall) | Grip |
|---|---|---|---|
| `dagger.png` | short, broad blade, wrapped grip, small crossguard; a rat's back-alley knife | ~40 px long | one hand: `grip` (fist centre on the handle), `gripEnd` (along the handle toward the blade), `tip` |
| `shield.png` | small round buckler: planks, an iron rim and boss, a scrap of red cloth or paint; seen face-on at a slight three-quarter angle | ~48 px across (smaller than the mouse's) | far hand on a strap: `grip` (strap point the fist closes on, at the left rim like the mouse shield), `gripEnd` (down the strap); the strap itself mostly hidden behind the face |
| `axe.png` | one-handed hand axe: notched iron head, wooden haft with a leather wrap | ~60 px long | one hand: `grip`, `gripEnd`, `tip` (the head's cutting edge centre) |
| `staff.png` | long walking staff: knotted, gnarled wood, a few charms or a bound stone at the top (caster's staff and a quarterstaff in one) | ~150 px long (taller than the rat) | two hands: `grip`, `grip2` (second hand ~40 px game further along), `gripEnd`, `tip` (the head, also the magic socket) |

## Points (in `weapons.json`, A012's format: full source PNG pixels, measured)
For every item: `img`, `canvas`, `grip`, `gripEnd`, `tip` (or for the shield: `grip`, `gripEnd`, `center`), `grip2` (staff), `rest` (degrees that turn the drawing to lie flat on the floor), `stow` (where it hangs on a belt or back: the item point that sits on the socket), `reviewScale` (source -> game px for the sizes above).

## Deliver
- The four PNGs, `weapons.json`, `prompt.md`, `HANDOFF.md`.
- `review.png` (source scale): each item with its points marked; then **in the rebuilt rat's hands at game size** (A018 parts at rest, posed only by placing the grip hand on the grip point: dagger in the near side grip, axe in the near side grip, shield on the far shield hand, staff in both hands), and each item **lying on the floor** at game size over Harbor Market.
- **Phone copies:** `docs/screens/A021/review.jpg` (and any close-ups) as JPG quality ~80, long side <= 2000 px.

## Acceptance
- Same painted style, outline weight and light as the cutlass and spear; sizes as listed; points measured, not estimated.
- Human (on the phone): do these look like they belong in the same world as the cutlass and spear, and like things a rat would carry?

Out of scope: hand drawings, body art, code (Code wires them as items and kits in the flexibility test).
