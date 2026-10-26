# Cutout rigging research (lead, 2026-10-26)

Full write-up for the user: Claude doc "Cutout Rigging Research: what the pros do" (artifact RFGeka6SbwCgTbptnBWeEW). The parts that change our work:

1. **Two-handed weapons: the weapon leads, the arms follow.** Spine's own setup: the weapon is not a child of the body; it carries two grip points; each arm reaches its grip by IK and each hand turns with the weapon; both are faded in/out per move. Source: https://eu.esotericsoftware.com/blog/Holding-a-two-handed-weapon
2. **Per handling type, pick who leads:** "hands follow the item" or "item follows the hand", chosen per move. Source: https://esotericsoftware.com/blog/Holding-Items-Spine-Tips-10
3. **Joint volume: a helper at the joint** that swells/slides with the joint angle (Spine's developer); mesh warping loses volume in tight bends. Separate limb pieces with the lower piece drawn round over the joint = what we do. Source: https://ja.esotericsoftware.com/forum/d/7673-best-practices-for-rigging-mesh-joints
4. **Views: a separate rig per view** for complex characters (front / side / back), switched on the turn. Source: https://esotericsoftware.com/forum/d/26565-which-is-better-component-for-8-direction-animation
5. **Feel:** 1 frame of anticipation, 1 frame of overshoot past the strike pose, smears, follow-through on loose parts, a brief stretch at impact. Source: https://80.lv/articles/tips-on-making-fluid-and-powerful-animations
