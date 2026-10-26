// Rat v3's own poses (T040): the moves the retarget can't carry onto v3 (render/retarget.js), because the raider's lean
// on whole-arm drawings (cocked, raised, guard) and wrist turns past v3's limits (near wrist -49..9: the user's, kept).
// Each key here adds `place: { <hand>: { at: [x, y], item } }` to the source's key (the raider's or the spearman's): that
// hand's wrist goes to `at` (rig px from the body's offset dx / dy, x forward, y down) and turns so its grip line (the
// user's: the held item's handle, or the shield's strap) runs at `item` degrees on screen (0 forward, - up); solved inside
// v3's limits (render/limits.js limbInLimits, as drag-to-pose). Everything else (torso, head, views, swaps, feet, the
// second fist on a two-hander's shaft) is the source's key, so the old rat's clips stay exactly as they are, and a key
// without a place here is retargeted as before. A key blending into one without a place mixes the two places.
// Where a key can't read as its move inside the limits, the note says which joint stops it.

// v3's eyes on its head drawings (head px, all the same size and place): the guard's shield stays below them
export const EYES = [[190, 148], [262, 146]];

const at = (x, y, item) => ({ at: [x, y], ...(item != null && { item }) });

// The spearman (spear and staff), T041: item-led (data/item-lead.js: two-handers). Each key poses the item itself:
// `item: { at: [x, y], rot, from }` = the grip point (where the near fist holds it) in rig px from the hips' point (the
// pelvis pivot) or the chest's (x forward, y down), and the shaft's screen angle (0 forward, - up); both fists then reach
// their grip lines on it inside v3's limits (render/item-lead.js), the item moved the least distance that lets both reach
// where a key asks for more (the notes say how far). The rest of each key (torso, head, views, feet) is the spearman's.
const held = (x, y, rot, from = 'hips') => ({ item: { at: [x, y], rot, from } });
// Each place sits inside the window where both fists hold at that angle (tools/item-lead-map.mjs <clip> <key> <angles>),
// at its low edge so the shaft passes under the snout. The window is small (about 8 x 20 px): its forward edge is the
// near wrist (-49..9: the near fist's grip line runs back along the forearm, so that fist stays ~40-50 px behind the
// hips' point), its low edge the far arm's reach to grip2 (the far fist slides back along the shaft up to 16 px first).
// Carried by the hip, point forward and a little up
const CARRY = held(-45, -6, -8);
export const SPEARMAN = {
  stance: CARRY, idle: CARRY, walk: CARRY,
  moves: {
    // drawn back (with the body's dx -4), driven out level at the enemy, back to the carry. Inside the limits the fists
    // move ~4 px forward of the wind-up: the reach of the thrust is the lunge
    spearThrust: { windup: held(-48, -6, -10), strike: held(-44, -12, 0), recover: held(-46, -8, -6) },
    // drawn back point up (level is out of reach behind the hip: the near wrist), swept through to level in front
    staffSwing: { windup: held(-48, -1, -20), strike: held(-44, -18, 2) },
    // raised forward-up (asked: over the head, which v3 can't: the near wrist -49 and near shoulder +67 cap the angle at
    // about -40 deg, and even with no limits the arms can't lift the staff's centre over the head, the centre lying
    // between the fists ~30 px from the shoulders: tools/item-lead-map.mjs --free. At -40 the shaft crosses the face, so
    // -30), then chopped down, head low in front
    staffOverhead: { windup: held(-38, 10, -30), strike: held(-40, -24, 10) },
  },
};

// The raider's turning slash wind-up, overhead chop, guard and shield bash. REST: the idle's cutlass (up behind the ear),
// as v3's own place, so a move blends between v3's places only; READY: the cutlass up behind the head (slash wind-up).
const REST = { 'hand-near': at(-28, -68, -112) }, READY_REST = REST, READY = { 'hand-near': at(-40, -50, -130) };
export const RAIDER = {
  moves: {
    // wind-up: the elbow folded to its limit (-113) lifts the fist to the shoulder, the blade up behind the head; strike:
    // the cutlass's grip line, like the spear's, runs back along the forearm, so the blade can only reach forward from a
    // fist at the hip (near wrist -49..9): the cut ends low in front, the blade level (retargeted, it crossed the face)
    // From the rest (-112, up behind the ear, as the idle) to the wind-up, over the top (through keys) to the strike, the
    // blade held level and low through the recover key, then up to the rest. Known: rising back to the rest the blade
    // passes over the ear and cheek (the near wrist -49..9 can't take it down and round behind; the near shoulder can't
    // take the fist behind the head), as it does on the way up at the first through key.
    ratSlash: {
      rest: { 'hand-near': at(-28, -68, -112) }, windup: { 'hand-near': at(-40, -50, -130) },
      through: [{ 'hand-near': at(-46, -50, -100) }, { 'hand-near': at(-38, -48, -45) }],
      strike: { 'hand-near': at(-30, -42, 10) }, recover: { 'hand-near': at(-28, -36, -25) },
    },
    // Wind-up: the axe as high as v3 can raise it, up behind the head at ear height (its head ~34 px under the head's top:
    // the near shoulder's +67 limit stops the upper arm ~30 deg above level, and the near wrist keeps the haft back along
    // the forearm); then over the top (through) to the strike level and low in front, as the slash.
    overheadChop: {
      rest: { 'hand-near': at(-28, -68, -112) }, windup: { 'hand-near': at(-30, -60, -135) },
      through: { 'hand-near': at(-46, -50, -95) }, strike: { 'hand-near': at(-30, -42, 10) },
    },
    // Guard: the round shield held out in front of the far shoulder, its rim at the chin (the eyes over it); at the
    // chest's own x the far arm only reaches it down at the hips (far shoulder -116..76, elbow 0..124), so it sits a
    // little forward of the snout. The cutlass ready up behind the head (the slash wind-up's hold). A hit jolts it back.
    guard: {
      rest: READY_REST, windup: { ...READY, 'hand-far': at(20, -82, -12) }, strike: { ...READY, 'hand-far': at(20, -78, -24) },
    },
    // Shield bash: held up (tilted back) in the wind-up, driven forward and down with the lunge, back to the guard. The
    // far arm holds the shield at chin height only in a small band (x 20..32, y -84..-72), so the push is mostly the lunge.
    shieldBash: {
      rest: READY_REST, windup: { ...READY, 'hand-far': at(20, -84, -30) }, strike: { ...READY, 'hand-far': at(34, -76, -10) },
      recover: { ...READY, 'hand-far': at(24, -80, -20) },
    },
  },
};

// poses with v3's places merged into the keys that have them (a key: a pose; moves: { clip: { windup, through, strike,
// recover } }, through may be a list). Keys without a place are the same objects.
// T041: an entry `{ item, itemLead? }` (an item-led key) is merged as it is, not as a place
const put = (key, place) => (place?.item ? { ...key, ...place } : place && Object.keys(place).length ? { ...key, place } : key);
export function withOwn(poses, own) {
  const out = { ...poses };
  for (const [k, place] of Object.entries(own)) if (k !== 'moves' && poses[k]) out[k] = put(poses[k], place);
  if (own.moves) {
    out.moves = { ...poses.moves };
    for (const [clip, keys] of Object.entries(own.moves)) {
      const M = { ...poses.moves[clip] };
      // rest: a place laid over the rest pose the move starts from and returns to (render/rig-pose.js), so the blends in and
      // out run between v3's own places (the retarget mid-swing would turn the blade through the face)
      for (const [k, place] of Object.entries(keys)) M[k] = k === 'rest' || k === 'restBack' ? { place } : Array.isArray(M[k]) ? M[k].map((x, i) => put(x, place[i])) : put(M[k], place);
      out.moves[clip] = M;
    }
  }
  return out;
}
export const PLACES = ['hand-near', 'hand-far'];
