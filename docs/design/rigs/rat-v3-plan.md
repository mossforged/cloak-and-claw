# Rat v3: a from-scratch rebuild, drawn for the rig (draft, lead, 2026-10-19)

**Status: draft for a decision.** Decide after T033 (limb repairs), T034 (the user's joint points) and A025 (shoulder on the arm) are reviewed. If the joints on the user's points still look pieced together, this replaces further patching.

**User (2026-10-19):** "I sort of fear we might need to redo the art from scratch incorporating all of these ... the next pass, if we do it, the body parts need to be drawn individually, to have smooth edges, and the right joint/limb endings."

## Why
The current rat was cut up from one finished painting (A017) before we knew how cutout joints have to be built. Every lesson since (covers, split grips, finished hidden paint, the shoulder on the arm, wrist limits, the user's joint points) has been a patch on drawings that weren't made for it.

## Drawing rules (what changes)
1. **Each piece drawn on its own**, not cut from a master: its own canvas, a clean outline all round, smooth edges, no cut lines.
2. **Joint ends are round, centred on the joint point.** Where a piece turns under or over another, its end is a circle-like cap whose centre is the joint point, so it looks the same at every angle (the GitHub example's trick, dressed as fur, cloth or a cuff rather than a visible disc).
3. **Joint points come first.** The user places them on a simple template of the body in the Fitting Room before Art draws; Art draws each piece around those points (the point is marked on every delivery).
4. **The shoulder belongs to the arm**, drawn over the chest; the hip and seat the same way at the thigh tops (the seat cover). The chest and hips under them are finished paint.
5. **Covers by design:** bracers over the hands' wrists, shin hems over the foot tops, belt over the waist (rig standard 5b), unless the user picks otherwise in the Fitting Room.
6. **Same design, same look:** the approved rat (A017) stays the reference for colours, costume and face; only the construction changes.
7. **Far limbs** are the same drawings shaded darker in code, not separate paintings, unless a view needs its own.

## Order of work
1. **Template:** Code makes a plain grey body template (the rat's proportions, one piece per part). The user sets joint points and limits on it in the Fitting Room (about 15 minutes).
2. **Art, round 1:** the three-quarter view, every piece drawn individually to the template, with the round ends, plus an assembled check strip bent through the user's limits.
3. **Fitting Room check:** the user locks and bends each joint on the real drawings; gaps are flagged per joint and angle.
4. **Code import:** the moves already exist as data, so the rat plays every rehearsal move at once; pass bar and wrist test.
5. **Art, round 2:** the other views (side, front, turned away, back) on the same rules; gear redrawn as dressed swaps (A020's method).
6. **Then the mouse** on the same process; this run is the trial of it.

## Cost (estimate)
Two to three Art rounds and two Code rounds for the three-quarter rat, another Art round per batch of views. User time: the template session, one Fitting Room pass, one before/after look per round. The risk is the image tool keeping a consistent style across individually drawn pieces; round 1 proves it on the arm and leg first.
