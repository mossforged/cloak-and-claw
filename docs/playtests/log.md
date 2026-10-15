# Playtest log

The user's feedback in their own words, dated, newest first. The lead adds entries; builders read them.

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
