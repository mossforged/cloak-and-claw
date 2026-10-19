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
  'mouse-fighter | * | arm-far-upper < torso': [30.8, MOUSE, 'block @70'],
  'mouse-fighter | * | arm-near-lower < hand-near': [5, MOUSE, 'slash1 @5'],
  'mouse-fighter | * | arm-near-upper < torso': [110.8, MOUSE, 'slash3 @7'],
  'mouse-fighter | * | cut arm-far-upper': [4.6, MOUSE, 'block @70'],
  'mouse-fighter | * | cut arm-near-upper': [5.4, MOUSE, 'knockdown, get up @48'],
  'mouse-fighter | * | cut pelvis': [8.5, MOUSE, 'slash2 @17'],
  'mouse-fighter | * | foot-far < leg-far-lower': [9, MOUSE, 'back throw @36'],
  'mouse-fighter | * | leg-far-upper < torso': [48.8, MOUSE, 'jumpSquat @2'],
  'mouse-fighter | * | leg-near-upper < torso': [357.3, MOUSE, 'grab + knee x3 @20'],
  'mouse-fighter | * | pelvis < torso': [202.5, MOUSE, 'back throw @37'],
  'mouse-fighter | walk | cut leg-near-upper': [5.5, MOUSE, 'walk (in place) @4'],
  'mouse-fighter | walk | foot-far < leg-far-lower': [9.3, MOUSE, 'walk (in place) @9'],
  'mouse-fighter | walk | foot-near < leg-near-lower': [8, MOUSE, 'walk (in place) @13'],
  'mouse-fighter | walk | leg-far-upper < torso': [16.5, MOUSE, 'walk (in place) @24'],
  'mouse-fighter | walk | leg-near-upper < torso': [25.5, MOUSE, 'walk (in place) @16'],
  'rat-raider | * | arm-far-upper < torso': [9.3, SHOULDER, 'grabbed + kneed @5'],
  'rat-raider | * | arm-near-upper < arm-near-lower': [15, ELBOW, 'run @71'],
  'rat-raider | * | arm-near-upper < torso': [115.5, SHOULDER, 'rally @65'],
  'rat-raider | * | cut arm-far-upper': [5.3, CUT, 'grabbed + kneed @5'],
  'rat-raider | * | cut arm-near-upper': [4.2, CUT, 'spin @12'],
  'rat-raider | * | cut foot-far': [6.4, CUT, 'grabbed + kneed @78'],
  'rat-raider | * | cut foot-near': [7.8, CUT, 'thrown @56'],
  'rat-raider | * | cut hand-near': [6.4, CUT, 'jumpSquat @3'],
  'rat-raider | * | cut head': [5.3, CUT, 'rally @63'],
  'rat-raider | * | cut leg-far-upper': [6.7, CUT, 'down @5'],
  'rat-raider | * | cut scarf-tail': [5.3, CUT, 'down @51'],
  'rat-raider | * | foot-far < leg-far-lower': [54.3, FOOT_TOP, 'knockdown, get up @114'],
  'rat-raider | * | leg-far-upper < pelvis': [18, THIGH_TOP, 'spin @46'],
  'rat-raider | * | leg-near-upper < pelvis': [30.8, THIGH_TOP, 'dodgeRoll @19'],
  'rat-raider | * | pelvis < leg-near-upper': [13.8, SEAT, 'knockdown @2'],
  'rat-raider | * | pelvis < torso': [33.5, WAIST, 'spin @38'],
  'rat-raider | * | scarf-tail < torso': [24, SCARF, 'dodgeRoll @13'],
  'rat-raider | * | torso < arm-near-upper': [78.8, CHEST, 'daggerStab @8'],
  'rat-raider | * | torso < belt': [5.3, WAIST, 'overheadChop @1'],
  'rat-raider | * | torso < head': [16.3, NECK, 'kick @33'],
  'rat-raider | idle | cut foot-near': [5.5, CUT, 'idle @54'],
  'rat-raider | rehearsal | arm-near-upper < torso': [96, SHOULDER, 'Victory / taunt: raise'],
  'rat-raider | rehearsal | cut arm-near-upper': [4.5, CUT, 'Slash 3 spin (finisher): back (mid-spin)'],
  'rat-raider | rehearsal | cut foot-near': [5, CUT, 'Menace idle + fidget: idle a'],
  'rat-raider | rehearsal | cut head': [4.6, CUT, 'Dodge roll: roll (back) 2'],
  'rat-raider | rehearsal | cut leg-far-upper': [4, CUT, 'Jump rise / apex / fall: apex'],
  'rat-raider | rehearsal | leg-far-upper < pelvis': [20.5, THIGH_TOP, 'Forward throw (rat throws): heave'],
  'rat-raider | rehearsal | leg-near-upper < pelvis': [90.5, THIGH_TOP, 'Thrown (victim): mid-spin (back)'],
  'rat-raider | rehearsal | scarf-tail < torso': [158, SCARF, 'Slash 3 spin (finisher): back (mid-spin)'],
  'rat-raider | rehearsal | torso < arm-far-upper': [30.3, CHEST, 'Thrown (victim): mid-spin (back)'],
  'rat-raider | rehearsal | torso < head': [29.5, NECK, 'Stagger (heavy): knee'],
  'rat-raider | views | arm-near-upper < torso': [29.8, SHOULDER, 'view: LB'],
  'rat-raider | views | cut foot-near': [5, CUT, 'view: Q'],
  'rat-raider | views | leg-far-upper < pelvis': [4.5, THIGH_TOP, 'view: F'],
  'rat-raider | walk | cut foot-far': [4, CUT, 'walk (in place) @4'],
  'rat-raider | walk | cut foot-near': [5, CUT, 'walk (in place) @3'],
  'rat-raider | walk | foot-far < leg-far-lower': [43.5, FOOT_TOP, 'walk (in place) @2'],
  'rat-spearman | * | arm-far-upper < torso': [14, SHOULDER, 'staffOverhead @14'],
  'rat-spearman | * | arm-near-upper < arm-near-lower': [13.5, ELBOW, 'staffOverhead @6'],
  'rat-spearman | * | arm-near-upper < torso': [100.5, SHOULDER, 'cast @7'],
  'rat-spearman | * | cut foot-far': [6.4, CUT, 'grabbed + kneed @78'],
  'rat-spearman | * | cut foot-near': [7.8, CUT, 'thrown @56'],
  'rat-spearman | * | cut hand-near': [4.6, CUT, 'hurt @35'],
  'rat-spearman | * | cut leg-far-upper': [6.7, CUT, 'down @5'],
  'rat-spearman | * | cut scarf-tail': [5.3, CUT, 'down @51'],
  'rat-spearman | * | foot-far < leg-far-lower': [47.3, FOOT_TOP, 'knockdown, get up @114'],
  'rat-spearman | * | leg-far-upper < pelvis': [4.5, THIGH_TOP, 'jump @5'],
  'rat-spearman | * | scarf-tail < torso': [21.8, SCARF, 'down @51'],
  'rat-spearman | idle | cut foot-near': [5.5, CUT, 'idle @54'],
  'rat-spearman | views | cut foot-near': [5, CUT, 'view: Q'],
  'rat-spearman | views | torso < belt': [7.3, WAIST, 'view: LB'],
  'rat-spearman | walk | cut foot-far': [4, CUT, 'walk (in place) @4'],
  'rat-spearman | walk | cut foot-near': [5, CUT, 'walk (in place) @3'],
  'rat-archer | * | cut foot-far': [6.4, CUT, 'grabbed + kneed @78'],
  'rat-archer | * | cut foot-near': [7.8, CUT, 'thrown @56'],
  'rat-archer | * | cut hand-near': [4, CUT, 'thrown @133'],
  'rat-archer | * | cut leg-far-upper': [6.7, CUT, 'down @5'],
  'rat-archer | * | cut scarf-tail': [5.3, CUT, 'down @51'],
  'rat-archer | * | foot-far < leg-far-lower': [54.3, FOOT_TOP, 'knockdown, get up @114'],
  'rat-archer | * | leg-far-upper < pelvis': [5.8, THIGH_TOP, 'down @3'],
  'rat-archer | * | pelvis < leg-near-upper': [14, SEAT, 'knockdown @2'],
  'rat-archer | * | scarf-tail < torso': [18.8, SCARF, 'walk across @27'],
  'rat-archer | idle | cut foot-near': [5.5, CUT, 'idle @54'],
  'rat-archer | rehearsal | cut foot-near': [4.5, CUT, 'Bow draw / aim / release: draw'],
  'rat-archer | views | arm-near-upper < torso': [262.5, SHOULDER, 'view: B'],
  'rat-archer | views | cut foot-near': [5, CUT, 'view: Q'],
  'rat-archer | views | leg-far-upper < pelvis': [4.5, THIGH_TOP, 'view: F'],
  'rat-archer | walk | cut foot-far': [4, CUT, 'walk (in place) @4'],
  'rat-archer | walk | cut foot-near': [5, CUT, 'walk (in place) @3'],
  'rat-archer | walk | foot-far < leg-far-lower': [43.5, FOOT_TOP, 'walk (in place) @2'],
};
