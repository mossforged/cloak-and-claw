# Playtest log

The user's feedback in their own words, dated, newest first. The lead adds entries; builders read them.

## 2026-10-15 A006 Mouse Fighter touch-up parts
User: "I think I need to see it in action. The rough assemblies they did aren't great." -> T012 wires them in; judged in play.

## 2026-10-15 A005 Rat Raider look
User: "He still seems lankier than the art bible version, like his legs are more upright than the sort of crouched art bible version."
Lead: mostly pose, not proportion: the A005 reference is a neutral upright rig pose. Fix in the rig (T011): default stance = the art bible's fighting crouch (bent knees, wide feet, low hips, hunched forward, head out); shorten legs per part if needed. Art approved as is: user "yes that sounds good".

## 2026-10-15 A004 Rat Raider look
User: "He reads a bit more mouse head than rat to me, and his legs look pretty skinny. That said, I love his pained expression. The way he holds the spear is a bit strange."
Lead: head and legs -> art revision A005 (keep the hurt expression); spear hold -> rig placement in the rat's code task (rear hand low near the butt, front hand mid-shaft, point angled slightly up at the enemy).

## 2026-10-14 Belt depth in the lab
User tried floor top ~340, bottom ~460 (about 120 px) in the lab: "The numbers seem pretty good. It might be a bit much right now, but we don't know what sort of crowds we're going to get. And I do like the idea of having a companion, a pet... if this is going to be a party of three players, you're going to want room to maneuver." On the lab: "pretty amazing... we should continue to use that and develop it."

## 2026-10-14 T005 rig (three-quarter parts + part swaps)
User (relayed by the code builder): "a big improvement"; loves the expression swaps. The cast pose (sword raised) is awkward; he thinks it needs a different torso position, the same root cause as slash2 not being a true horizontal cut.
Lead note: feet sit ~5 px off the floor in the knockdown and slash3 strike poses (builder).

## 2026-10-14 Stage 3 question: the Mouse Fighter rig
User's words (lightly cleaned): "Overall I think they did a good job. It does seem flexible. I do like the system." Concerns: "it might be a little bit too profile. The standee is a little bit more towards the viewer, which allows you to see more of their face." Wants to test more kinds of poses ("thrusting a sword up in the air for a magical effect"). "We probably would need a back view so he could turn his torso for big swings." Leans on the lead for genre practice.
**Result: yes to the rig system, with a revision:** three-quarter art (A001-02), back torso + expression heads as part swaps (code task after A001-02).

## 2026-10-14 Rat telegraph too short
User's words: "If I'm in front of the rat and he starts to indicate a swing, I don't think there is enough time to get away even if I instantly try to."
Lead's check of the numbers: ratSlash windup 22 frames; a ~15-frame human reaction leaves ~7; leaving his lane takes ~9 frames (depth speed 1.9 vs depthHit 16), backing out of reach ~19 (his lunge 2.2 extends reach). Breaks Pillar 2.
Suggested to the user: try windup ~34 in the lab. **User: "that fixed it."** For the Stage 2 tuning task: lunge 2.2 -> ~1.2; consider a narrower depthHit for enemy moves; add lunge and depth to the lab schema.

## 2026-10-14 Stage 1 gate (standee combat)
User's words (lightly cleaned): "The actual feel of striking and the knockback and all that feels pretty good. Maybe we can test the numbers, but for a first pass it feels pretty great."
Issues he noted but set aside as not this stage's point: the walkable lane doesn't line up with the background art; the animations are janky.
**Gate result: passed.**
