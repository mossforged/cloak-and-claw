# A017 - Rat Raider: the setup-pose master (Art)

**Read:** `docs/design/rigs/rat-raider.md` (the rig sheet), `docs/design/rig-standard.md` section 2 (**revised 2026-10-17: the master is a neutral setup pose, not the game stance**), `docs/style-contract.md`, the art-bible standee `assets/art/enemies/rat-raider.png`, and A010: `assets/source/A010-rat-raider-standard/reference.png`, `master-back.png`, `head-neutral.png` (and the other head files), `HANDOFF.md`.
**Autonomy:** human-gated (G1: "is this still our rat?"). **Needs:** nothing. **Deliver to:** `assets/source/A017-rat-setup-master/` (source images go through Git LFS; run `git lfs version` first).

We are rebuilding the Rat Raider's body so he can take any weapon and any new move. A010's master was an action pose (sword arm wound back behind him, deep lunge), so his near arm was cut short and folded and his legs came out at different lengths. This task draws **the same rat** in a neutral setup pose; the rig will pose his crouch and every attack afterwards. **This is G1 only: the master and its back view. Do not cut parts yet.**

## The head stays exactly as approved
Head R is approved and its six drawings, face details and head gear carry over. So:
- Use `head-neutral.png` from A010 **as is**: same pixels, same size. Place it on the new master (you may move it as a whole); do not regenerate or redraw the head.
- Record where you placed it: `head-offset.json` = the x/y move from A010's head position to the new one (so Code moves all six heads and the head gear by that one offset). No rotation, no scale.

## Setup pose (rig standard section 2)
- Three-quarter view facing right, as the standee. A slight rat hunch in the upper back and neck is fine (it's his character); the **limbs** must be neutral:
- **Legs:** both under the hips, the same visible length, the near leg a little forward of the far leg, knees bent 10-20 degrees, both feet flat on the floor line, toes pointing right. No lunge, no foreshortening.
- **Arms:** hanging down and slightly away from the body (20-30 degrees), elbows slightly bent, nothing crossing the torso or the belly, **relaxed fists**, fully visible, no weapon.
- **Trousers:** same patched, baggy look, but the cloth must be cuttable: waistband and seat as one region on the hips, each trouser leg wrapping its own thigh, with no fold that runs from the hip across the thigh into the other leg. Knee wraps and foot wraps as in A010.
- **Tail:** hanging down and back in a gentle curve (it will be cut into three segments). **Bandana tail:** hanging behind the shoulder.
- Same outfit, colours, limb thickness and proportions as A010 (stocky, thick limbs, big round ears).

## Deliver
- `master.png` (front, three-quarter) and `master-back.png` (from behind, same setup pose, head turned so the back of the head shows as in A010's `head-back`). Canvas 1536 x 2304, #00FF00, ~1350 px tall, floor line marked (record its y).
- `head-offset.json`.
- `review.png`: (1) new master beside A010's reference and the standee at full size; (2) all three at game size (~136 px) over Harbor Market; (3) the new master with the expected joint points marked (shoulders, elbows, wrists, hips, knees, ankles, neck, tail root) so the lead can check the limbs are equal and unfolded.
- `prompt.md` (tool + exact prompts, inputs), `HANDOFF.md` (what the tool struggled with).

## Acceptance
- Head pixels identical to A010 `head-neutral.png` (offset only).
- Near and far legs within ~5% of each other in visible length; arms likewise; nothing folded or hidden.
- Human: beside the standee and A010, **is this still our rat?**

Out of scope: cutting parts, swaps, gear, masks, weapons, code (that's A018 and after).
