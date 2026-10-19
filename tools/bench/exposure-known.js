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
  'rat-raider | * | arm-far-upper < arm-far-lower': [34.5, ELBOW, 'dodgeRoll @20'],
  'rat-raider | * | arm-far-upper < torso': [202.5, SHOULDER, 'shieldBash @4'],
  'rat-raider | * | arm-near-upper < torso': [151.8, SHOULDER, 'rally @4'],
  'rat-raider | * | cut arm-far-upper': [5.3, CUT, 'shieldBash @4'],
  'rat-raider | * | cut arm-near-upper': [6.4, CUT, 'jumpAttack @8'],
  'rat-raider | * | cut foot-far': [5, CUT, 'knockdown, get up @114'],
  'rat-raider | * | cut hand-far': [4.2, CUT, 'thrown @41'],
  'rat-raider | * | cut hand-near': [4.6, CUT, 'skidStop @5'],
  'rat-raider | * | cut head': [5.3, CUT, 'rally @63'],
  'rat-raider | * | cut leg-far-upper': [6.4, CUT, 'down @2'],
  'rat-raider | * | cut leg-near-upper': [4.2, CUT, 'dodgeRoll @15'],
  'rat-raider | * | cut torso': [6.7, CUT, 'spin @57'],
  'rat-raider | * | foot-far < leg-far-lower': [54.5, FOOT_TOP, 'knockdown, get up @114'],
  'rat-raider | * | foot-near < leg-near-lower': [8.8, FOOT_TOP, 'guard @4'],
  'rat-raider | * | hand-near < arm-near-lower': [11.3, WRIST, 'jumpUp @46'],
  'rat-raider | * | leg-far-upper < pelvis': [47.8, THIGH_TOP, 'daggerStab @1'],
  'rat-raider | * | leg-near-upper < pelvis': [12.5, THIGH_TOP, 'spin @36'],
  'rat-raider | * | pelvis < leg-far-upper': [222, SEAT, 'spin @37'],
  'rat-raider | * | pelvis < leg-near-upper': [9.3, SEAT, 'shieldBash @1'],
  'rat-raider | * | scarf-tail < torso': [159.3, SCARF, 'spin @36'],
  'rat-raider | * | torso < arm-near-upper': [45, CHEST, 'daggerStab @39'],
  'rat-raider | * | torso < belt': [13.5, WAIST, 'daggerThrow @22'],
  'rat-raider | * | torso < head': [142.8, NECK, 'spin @37'],
  'rat-raider | rehearsal | arm-near-upper < torso': [204, SHOULDER, 'Overhead chop (club, axe): strike'],
  'rat-raider | rehearsal | cut arm-near-upper': [4.6, CUT, 'Slash 2 (backhand): behind'],
  'rat-raider | rehearsal | cut hand-near': [5.3, CUT, 'Hurt light (front): snap back'],
  'rat-raider | rehearsal | cut head': [4.6, CUT, 'Dodge roll: roll (back) 2'],
  'rat-raider | rehearsal | cut leg-far-upper': [4, CUT, 'Jump rise / apex / fall: apex'],
  'rat-raider | rehearsal | hand-near < arm-near-lower': [19.5, WRIST, 'Hurt light (front): snap back'],
  'rat-raider | rehearsal | leg-far-upper < pelvis': [17.5, THIGH_TOP, 'Slash 3 spin (finisher): front'],
  'rat-raider | rehearsal | scarf-tail < torso': [158, SCARF, 'Slash 3 spin (finisher): back (mid-spin)'],
  'rat-raider | rehearsal | torso < arm-far-upper': [30.3, CHEST, 'Thrown (victim): mid-spin (back)'],
  'rat-raider | rehearsal | torso < belt': [46.8, WAIST, 'Stagger (heavy): knee'],
  'rat-raider | rehearsal | torso < head': [23.3, NECK, 'Throw the hero over the shoulder (back throw): lift'],
  'rat-raider | views | leg-far-upper < pelvis': [4.5, THIGH_TOP, 'view: F'],
  'rat-spearman | * | arm-far-upper < torso': [29.8, SHOULDER, 'staffOverhead @16'],
  'rat-spearman | * | arm-near-upper < torso': [126, SHOULDER, 'cast @7'],
  'rat-spearman | * | cut arm-far-upper': [4.1, CUT, 'staffOverhead @16'],
  'rat-spearman | * | cut arm-near-upper': [4.3, CUT, 'turn around (x2) @24'],
  'rat-spearman | * | cut foot-far': [5, CUT, 'knockdown, get up @114'],
  'rat-spearman | * | cut leg-far-upper': [10.3, CUT, 'down @5'],
  'rat-spearman | * | foot-far < leg-far-lower': [54.5, FOOT_TOP, 'knockdown, get up @114'],
  'rat-spearman | * | foot-near < leg-near-lower': [4.8, FOOT_TOP, 'staffSwing @48'],
  'rat-spearman | * | leg-far-upper < pelvis': [47, THIGH_TOP, 'spearThrust @1'],
  'rat-spearman | * | pelvis < leg-near-upper': [5.5, SEAT, 'spearThrust @80'],
  'rat-spearman | rehearsal | leg-far-upper < pelvis': [8.8, THIGH_TOP, 'Spear thrust: lunge'],
  'rat-spearman | views | arm-near-upper < torso': [20, SHOULDER, 'view: B'],
  'rat-archer | * | arm-near-upper < torso': [50, SHOULDER, 'cast @7'],
  'rat-archer | * | cut arm-far-lower': [4.2, CUT, 'bowShot @55'],
  'rat-archer | * | cut arm-near-upper': [4.6, CUT, 'knockdown, get up @103'],
  'rat-archer | * | cut foot-far': [5, CUT, 'knockdown, get up @114'],
  'rat-archer | * | cut hand-far': [4.2, CUT, 'thrown @41'],
  'rat-archer | * | cut leg-far-upper': [10.3, CUT, 'down @5'],
  'rat-archer | * | cut leg-near-upper': [5.3, CUT, 'getup @4'],
  'rat-archer | * | cut scarf-tail': [4.6, CUT, 'walk across @27'],
  'rat-archer | * | foot-far < leg-far-lower': [54.5, FOOT_TOP, 'knockdown, get up @114'],
  'rat-archer | * | leg-far-upper < pelvis': [6.8, THIGH_TOP, 'turn around (x2) @24'],
  'rat-archer | * | scarf-tail < torso': [18.8, SCARF, 'walk across @27'],
  'rat-archer | views | leg-far-upper < pelvis': [4.5, THIGH_TOP, 'view: F'],
};
