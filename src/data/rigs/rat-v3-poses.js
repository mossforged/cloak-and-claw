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

// The spearman (spear and staff): the near (back) fist low by the hip, the shaft along the forearm, point forward and up;
// the far fist rides the shaft on grip2 (the two-hand grip's IK, inside v3's limits)
const CARRY = { 'hand-near': at(-31, -53, -8) };
export const SPEARMAN = {
  stance: CARRY, idle: CARRY, walk: CARRY,
  moves: {
    spearThrust: { windup: { 'hand-near': at(-36, -52, -8) }, strike: { 'hand-near': at(-24, -54, -14) }, recover: { 'hand-near': at(-28, -54, -8) } },
    // the staff's two fists sit 42 px apart on the shaft, v3's far shoulder ~37 px in front of the near one and each arm
    // reaches ~30 px: with both fists on, the shaft points forward (never back or over the head), and the near fist's
    // grip line runs back along its forearm (near wrist -49..9): so the swing draws it back level, low behind the hip,
    // and the overhead raises it forward-up as far as the two fists allow (-37 deg), its head in front of the snout
    staffSwing: { windup: { 'hand-near': at(-44, -52, -20) }, strike: { 'hand-near': at(-26, -52, -6) } },
    staffOverhead: { windup: { 'hand-near': at(-24, -54, -38) }, strike: { 'hand-near': at(-24, -54, 14) } },
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
const put = (key, place) => (place && Object.keys(place).length ? { ...key, place } : key);
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
