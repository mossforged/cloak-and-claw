# A008 — exact generation prompts

Tool: built-in `image_gen.imagegen`; `transparent_background: true` on every call. No seed or model controls exposed. One call per asset, plus one front-jerkin correction. Reference files are inputs for shape, perspective and style; output is isolated gear.

## gear-hood

Reference: `assets/source/A005-rat-raider-head-legs/head-neutral.png`

```text
Use case: precise-object-edit. Asset: isolated transparent game-rig gear overlay. Reference image is the existing rat head: use its three-quarter angle facing right, skull proportions, warm hand-painted cartoon finish, bold dark brown outlines and upper-left light. Output ONLY the requested clothing, no rat, fur, skin, ears, face, mannequin, text, shadow or other objects. Empty face and ear holes must be genuinely transparent. Show entire item large with clear margin. Make a short muted olive-brown cloth archer hood fitted to this rat head. Two open ear slits let BOTH existing ears poke through; large near ear at upper left, smaller far ear upper right. A broad open face frames both eyes and long muzzle without covering them. Short ragged drape around rear cheeks and neck, stitched seams, a few worn patches. Do not include ears or a face in the holes. Hood should wrap around the crown between the ears and around left/back cheek.
```

## gear-helmet

Reference: `assets/source/A005-rat-raider-head-legs/head-neutral.png`

```text
Use case: precise-object-edit. Asset: isolated transparent game-rig gear overlay. Reference image is the existing rat head: use its three-quarter angle facing right, skull proportions, warm hand-painted cartoon finish, bold dark brown outlines and upper-left light. Output ONLY the requested clothing, no rat, fur, skin, ears, face, mannequin, text, shadow or other objects. Empty face and ear holes must be genuinely transparent. Show entire item large with clear margin. Make a dented open-faced iron skull cap fitted to this rat head, a low rounded dome between the two ears, ear notches on either side keep both ears completely visible. Short rolled brow rim above both eyes, small rivets, battered iron, modest warm reflected highlights. No nose guard, no cheek plates obscuring face, no horns. Skull cap overlay only.
```

## gear-captain-hat

Reference: `assets/source/A005-rat-raider-head-legs/head-neutral.png`

```text
Use case: precise-object-edit. Asset: isolated transparent game-rig gear overlay. Reference image is the existing rat head: use its three-quarter angle facing right, skull proportions, warm hand-painted cartoon finish, bold dark brown outlines and upper-left light. Output ONLY the requested clothing, no rat, fur, skin, ears, face, mannequin, text, shadow or other objects. Empty face and ear holes must be genuinely transparent. Show entire item large with clear margin. Make a battered dark brown tricorn captain hat with muted gold edging and one sweeping ochre feather leaning upper left. Fit its brim above this rat's brows and below the tops of his ears, with ear notches so both ears remain visible behind. Strong triangular silhouette, creased leather, worn patch, tiny brass fastening. Output hat and feather ONLY; no head or ears.
```

## gear-hood-back

Reference: `assets/source/A004-rat-raider-rig/torso-back.png`

```text
Use case: precise-object-edit. Asset: isolated transparent game-rig clothing overlay. Reference image defines the existing rat torso shape, three-quarter angle, warm painted cartoon style, bold dark brown outlines and upper-left light. Output ONLY requested gear, no body, fur, skin, mannequin, background, text or shadow. Holes and surrounding space genuinely transparent. Show entire item large with clear margins. Back view of a short muted olive-brown archer hood. Empty rounded hood dome with two open ear slits at top sides, cloth falls into a short shoulder cowl over upper back. Three-quarter back view matching reference. Ragged stitched cloth, worn patches. Raised hood and cowl only, no torso, ears or head.
```

## gear-quiver

Reference: `assets/source/A004-rat-raider-rig/torso.png`

```text
Use case: precise-object-edit. Asset: isolated transparent game-rig clothing overlay. Reference image defines the existing rat torso shape, three-quarter angle, warm painted cartoon style, bold dark brown outlines and upper-left light. Output ONLY requested gear, no body, fur, skin, mannequin, background, text or shadow. Holes and surrounding space genuinely transparent. Show entire item large with clear margins. Slim worn brown leather back quiver holding three wooden arrows with cream fletching. Sits diagonally on back: arrow fletchings protrude up-left behind near shoulder; tubular case trails down-right behind upper torso. Quiver and arrows ONLY, no torso, no strap looping across front, no bow. Compact readable silhouette.
```

## gear-jerkin

Reference: `assets/source/A004-rat-raider-rig/torso.png`

```text
Use case: precise-object-edit. Asset: isolated transparent game-rig clothing overlay. Reference image defines the existing rat torso shape, three-quarter angle, warm painted cartoon style, bold dark brown outlines and upper-left light. Output ONLY requested gear, no body, fur, skin, mannequin, background, text or shadow. Holes and surrounding space genuinely transparent. Show entire item large with clear margins. Sleeveless padded dark umber leather jerkin overlay fitted exactly around reference chest, shoulders and waist. Large open neck hole exposes existing red scarf; open armholes, broad quilted leather panels and side lacing, short hip tabs. Three-quarter facing right, left side broader. Cover old tunic and straps, leave scarf and arms visible. No scarf or underlying torso drawn. Leather vest ONLY.
```

## gear-jerkin-back

Reference: `assets/source/A004-rat-raider-rig/torso-back.png`

```text
Use case: precise-object-edit. Asset: isolated transparent game-rig clothing overlay. Reference image defines the existing rat torso shape, three-quarter angle, warm painted cartoon style, bold dark brown outlines and upper-left light. Output ONLY requested gear, no body, fur, skin, mannequin, background, text or shadow. Holes and surrounding space genuinely transparent. Show entire item large with clear margins. BACK VIEW sleeveless padded dark umber leather jerkin fitted around reference torso-back. Large open neck hole, open armholes; quilted leather panels, central back seam, edge lacing, short hip tabs. Same three-quarter back angle. Cover tunic and strap, leave scarf and arms visible. No scarf or torso, just vest.
```

## gear-sash

Reference: `assets/source/A004-rat-raider-rig/torso.png`

```text
Use case: precise-object-edit. Asset: isolated transparent game-rig clothing overlay. Reference image defines the existing rat torso shape, three-quarter angle, warm painted cartoon style, bold dark brown outlines and upper-left light. Output ONLY requested gear, no body, fur, skin, mannequin, background, text or shadow. Holes and surrounding space genuinely transparent. Show entire item large with clear margins. Wide scarlet cloth sash wrapped around reference waist, same red as bandana. Broad horizontal waist wrap with dark brown leather belt over it, square brass buckle facing viewer slightly to right, cloth knot at left hip and two short ragged hanging ends. ONLY waist sash and belt, no torso, pouch, shoulder strap or scarf. Three-quarter elliptical waist.
```

## Front jerkin correction (selected)

Reference: generated front jerkin `exec-5b2ebf06-8b42-4f40-b263-41c447ed394b.png` (initial draft rejected for including scarf).

```text
Use case: precise-object-edit. Edit the supplied leather jerkin PNG. Remove ALL the red scarf cloth entirely: the entire triangular red chest area and neck opening must become genuinely transparent empty space, so an existing scarf beneath can show through. Also make the interior of both armholes genuinely transparent. Keep the leather vest shape, quilted panels, belts, buckles, colours, perspective and outline unchanged. Isolated vest ONLY on true transparency, no scarf, no body, no mannequin. Preserve the exact canvas dimensions and placement.
```

## Mechanical preparation and review

Generated RGBA is preserved, uniformly resized and translated onto the original 1536 × 2304 source canvas. No painting, warping, silhouette alteration, alpha thresholding or green-keying was applied to gear. Exact transforms and selected generation filenames are in `part-layout.json`. A004/A005 backgrounds were mechanically keyed only for review assembly. Separate transparent layers were composited in source coordinates; no runtime code was changed.

Review stage uses Harbor Market uniformly resized to 960 px wide. Rat body scale is 136 px by A005 reference silhouette height; all rats share that scale, so headgear adds height. Mouse reference silhouette is 130 px. Large assemblies are enlarged inspection views; the stage panel is actual size in `review-game-size.png`. No weapons are included in loadout assemblies, so gear differences can be judged alone.
