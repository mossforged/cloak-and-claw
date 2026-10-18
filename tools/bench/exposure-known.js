// Exposed hidden paint and straight cut edges known at T028 r3 (tests/exposure.test.mjs), written by
// tools/exposure-known.mjs, each with the fix it needs (Art's repair list: A023 round 4 for the rat). The test fails on a
// flag not listed here or one worse than listed (exposure: over 2 game px^2 or 10%; cut: over 1 px); fix the pose or the
// art, rerun the writer and check the diff. Strip of the worst frames: node tools/exposure-strip.mjs <id>.
// Key: 'fighter | clip | piece < cover' (exposed: game px^2 of the piece's hidden paint on top; cover = the piece that
// hid it at rest) or 'fighter | clip | cut piece' (game px long); clip = idle, walk, views (each body view standing),
// rehearsal (the sheet's stand-in keys) or * (worst over every other viewer clip). Value: [px, fix, worst frame].
const FOOT_TOP = 'foot top (hidden under the shin) is wider than the shin: narrow it to the shin hem, or widen the hem, so it stays covered as the ankle turns';
const THIGH_TOP = 'thigh top (hidden under the seat / apron) shows as the thigh swings: trim it to the seat outline or paint it as trouser cloth';
const SEAT = 'pelvis paint under the thigh (reconstruction) shows as the thigh swings: paint it as finished seat cloth with its seam';
const KNEE = 'knee: thigh hem / shin top hidden paint shows as the knee bends: round the shin top, longer trouser hem';
const WRIST = 'wrist end hidden under the bracer shows as the fist turns: shorter, rounded wrist end in the hand drawing';
const SHOULDER = 'upper-arm top hidden under the torso / cap shows as the arm swings: rounded shoulder end, painted as fur';
const ELBOW = 'elbow: forearm top / upper-arm end hidden paint shows as the elbow bends: round both ends';
const CHEST = 'torso paint under the arm (views where the arm draws in front) shows as the arm swings: finish it as chest';
const NECK = 'torso top under the head shows as the head turns: finish the collar / neck fur under the head';
const WAIST = 'waist: torso hem / pelvis top hidden under the belt or jerkin shows as the torso bends: finish it as cloth';
const SCARF = 'scarf tail root hidden under the torso shows as the scarf swings: shorter root, or paint it as cloth';
const TAIL = 'tail root hidden under the pelvis shows as the tail swings: shorter, tapered root';
const CUT = 'straight cut edge showing: outline or round the cut, or extend the piece that covers it';
const OTHER = 'see the strip';
const MOUSE = 'mouse: waits for the mouse rebuild (rig lock-down order, after the rat)';
export const KNOWN = {
  'mouse-fighter | * | arm-far-upper < torso': [4.5, MOUSE, 'pick up (Plank Club) @17'],
  'mouse-fighter | * | arm-near-lower < hand-near': [23.5, MOUSE, 'grab + knee x3 @7'],
  'mouse-fighter | * | arm-near-upper < torso': [110.8, MOUSE, 'slash3 @7'],
  'mouse-fighter | * | cut arm-near-lower': [4.5, MOUSE, 'revive a friend @14'],
  'mouse-fighter | * | cut arm-near-upper': [5.3, MOUSE, 'reach @48'],
  'mouse-fighter | * | cut pelvis': [8.5, MOUSE, 'slash2 @17'],
  'mouse-fighter | * | foot-far < leg-far-lower': [9, MOUSE, 'back throw @36'],
  'mouse-fighter | * | leg-far-upper < torso': [49.3, MOUSE, 'jumpSquat @2'],
  'mouse-fighter | * | leg-near-upper < torso': [334.8, MOUSE, 'knee @5'],
  'mouse-fighter | * | pelvis < leg-near-upper': [88.8, MOUSE, 'jump @9'],
  'mouse-fighter | * | pelvis < torso': [202.5, MOUSE, 'back throw @37'],
  'mouse-fighter | walk | cut leg-near-upper': [5.5, MOUSE, 'walk (in place) @4'],
  'mouse-fighter | walk | foot-far < leg-far-lower': [9.3, MOUSE, 'walk (in place) @9'],
  'mouse-fighter | walk | foot-near < leg-near-lower': [8, MOUSE, 'walk (in place) @13'],
  'mouse-fighter | walk | leg-far-upper < torso': [16.5, MOUSE, 'walk (in place) @24'],
  'mouse-fighter | walk | leg-near-upper < torso': [25.5, MOUSE, 'walk (in place) @16'],
  'rat-raider | * | arm-far-upper < torso': [9.3, SHOULDER, 'grabbed + kneed @5'],
  'rat-raider | * | arm-near-upper < torso': [132, SHOULDER, 'cast @9'],
  'rat-raider | * | cut arm-far-upper': [5.3, CUT, 'grabbed + kneed @5'],
  'rat-raider | * | cut foot-far': [4, CUT, 'walk across @25'],
  'rat-raider | * | cut hand-far': [4.2, CUT, 'thrown @41'],
  'rat-raider | * | cut hand-near': [4.6, CUT, 'thrown @47'],
  'rat-raider | * | cut head': [4.6, CUT, 'knockdown, get up @40'],
  'rat-raider | * | cut leg-near-upper': [5.3, CUT, 'getup @4'],
  'rat-raider | * | cut pelvis': [4, CUT, 'grabbed + kneed @77'],
  'rat-raider | * | foot-far < leg-far-lower': [21.5, FOOT_TOP, 'walk across @25'],
  'rat-raider | * | hand-near < arm-near-lower': [4.8, WRIST, 'thrown @47'],
  'rat-raider | * | leg-far-upper < pelvis': [9, THIGH_TOP, 'turn around (x2) @24'],
  'rat-raider | rehearsal | arm-near-upper < torso': [244, SHOULDER, 'Overhead chop (club, axe): strike'],
  'rat-raider | rehearsal | cut arm-near-upper': [4.9, CUT, 'Overhead chop (club, axe): strike'],
  'rat-raider | rehearsal | cut foot-far': [4, CUT, 'Run (chase, flee): push-off 2'],
  'rat-raider | rehearsal | cut hand-near': [5.3, CUT, 'Skid stop: brace'],
  'rat-raider | rehearsal | cut leg-far-upper': [4.6, CUT, 'Jump rise / apex / fall: rise'],
  'rat-raider | rehearsal | foot-far < leg-far-lower': [32.5, FOOT_TOP, 'Run (chase, flee): push-off 2'],
  'rat-raider | rehearsal | hand-near < arm-near-lower': [19.5, WRIST, 'Skid stop: brace'],
  'rat-raider | rehearsal | leg-far-upper < pelvis': [17.8, THIGH_TOP, 'Dagger throw: follow'],
  'rat-raider | rehearsal | pelvis < leg-near-upper': [92.5, SEAT, 'Dagger stab: stab'],
  'rat-raider | rehearsal | scarf-tail < torso': [147.8, SCARF, 'Thrown (victim): mid-spin (back)'],
  'rat-raider | rehearsal | torso < arm-far-upper': [30.3, CHEST, 'Thrown (victim): mid-spin (back)'],
  'rat-raider | rehearsal | torso < arm-near-upper': [76, CHEST, 'Dagger stab: draw back'],
  'rat-raider | rehearsal | torso < belt': [46.8, WAIST, 'Stagger (heavy): knee'],
  'rat-raider | rehearsal | torso < head': [23.8, NECK, 'Overhead chop (club, axe): wind (lean back)'],
  'rat-raider | views | leg-far-upper < pelvis': [6.3, THIGH_TOP, 'view: F'],
  'rat-raider | walk | cut foot-far': [4, CUT, 'walk (in place) @25'],
  'rat-raider | walk | foot-far < leg-far-lower': [21.5, FOOT_TOP, 'walk (in place) @25'],
  'rat-spearman | * | arm-near-upper < torso': [125, SHOULDER, 'cast @7'],
  'rat-spearman | * | cut foot-far': [4.6, CUT, 'knockdown @3'],
  'rat-spearman | * | cut pelvis': [4, CUT, 'grabbed + kneed @77'],
  'rat-spearman | * | cut scarf-tail': [5.7, CUT, 'knockdown @5'],
  'rat-spearman | * | foot-far < leg-far-lower': [68.8, FOOT_TOP, 'knockdown @3'],
  'rat-spearman | * | leg-far-upper < pelvis': [9, THIGH_TOP, 'turn around (x2) @24'],
  'rat-spearman | * | scarf-tail < torso': [68, SCARF, 'spearThrust @40'],
  'rat-spearman | rehearsal | pelvis < leg-near-upper': [99.3, SEAT, 'Spear thrust: lunge'],
  'rat-spearman | views | arm-near-upper < torso': [20, SHOULDER, 'view: B'],
  'rat-spearman | views | leg-far-upper < pelvis': [5.8, THIGH_TOP, 'view: F'],
  'rat-spearman | walk | cut foot-far': [4, CUT, 'walk (in place) @25'],
  'rat-spearman | walk | foot-far < leg-far-lower': [21.5, FOOT_TOP, 'walk (in place) @25'],
  'rat-archer | * | arm-near-upper < torso': [49.5, SHOULDER, 'cast @7'],
  'rat-archer | * | cut arm-far-lower': [4.2, CUT, 'bowShot @55'],
  'rat-archer | * | cut foot-far': [4, CUT, 'walk across @25'],
  'rat-archer | * | cut head': [4.2, CUT, 'knockdown @3'],
  'rat-archer | * | cut leg-far-upper': [4.6, CUT, 'down @5'],
  'rat-archer | * | cut pelvis': [4, CUT, 'turn around (x2) @30'],
  'rat-archer | * | cut scarf-tail': [6, CUT, 'knockdown @3'],
  'rat-archer | * | foot-far < leg-far-lower': [21.5, FOOT_TOP, 'walk across @25'],
  'rat-archer | * | leg-far-upper < pelvis': [9, THIGH_TOP, 'turn around (x2) @24'],
  'rat-archer | * | scarf-tail < torso': [19.8, SCARF, 'knockdown @3'],
  'rat-archer | idle | cut pelvis': [4, CUT, 'idle @85'],
  'rat-archer | rehearsal | pelvis < leg-near-upper': [4.3, SEAT, 'Bow draw / aim / release: draw'],
  'rat-archer | rehearsal | pelvis < torso': [4.3, WAIST, 'Bow draw / aim / release: release'],
  'rat-archer | rehearsal | torso < arm-near-upper': [62, CHEST, 'Bow draw / aim / release: release'],
  'rat-archer | rehearsal | torso < belt': [11, WAIST, 'Bow draw / aim / release: draw'],
  'rat-archer | views | leg-far-upper < pelvis': [6.3, THIGH_TOP, 'view: F'],
  'rat-archer | walk | cut foot-far': [4, CUT, 'walk (in place) @25'],
  'rat-archer | walk | foot-far < leg-far-lower': [21.5, FOOT_TOP, 'walk (in place) @25'],
};
