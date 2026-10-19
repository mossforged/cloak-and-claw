// Stretch-strip flags known at T024 (rat: T026), each with the art fix it needs (the lead turns these into art addenda). The test
// (tests/stretch.test.mjs) fails on any flag not listed here, or one that got more than 1 px worse; fix the art (or the
// pose) and delete its line. Key: 'body | cell | joint'; px = the gap measured when listed.
const ELBOW_CAP = 'patch cap / rounded end on the forearm across the elbow (rig standard 4: joint patches)';
const KNEE_CAP = 'patch cap / rounded end on the lower leg across the knee';
const SHOULDER = 'round the top of arm-near-upper (A013 cut it straight: the torso hides it at rest, but every pose that draws the arm over the tunic shows the cut)';
const TURNED = 'hand-<side>-grip-overhand drawing (T025: the grip fist turned over on the weapon node opens the wrist; the overhand hand has its own cuff)';
const FAR_WRIST = 'as the current grip: rounded wrist end on hand-far-grip (the far fist turned hard round the shaft)';
const RAT_SHOULDER = 'A022 near upper arm (band 590): its hidden end under the vest is short; with the arm swung forward for a held item a crack opens at the shoulder core (check in motion; fix: longer plain-fur end under the torso)';
const RAT_UP = 'expected: a straight-up near arm under the vest needs arm-near-raised (cast uses it)';
const RAT_FAR_WRIST = 'A022 far hands (band 115, wrist under the bracer): the hidden wrist end is short; turned or lifted over the shaft (845) the wrist core opens (fix: longer wrist end under the far bracer)';
const HIP_FAR = 'rounded top on leg-far-upper under the pelvis (opens when the far thigh folds forward: kneel, lying)';
// T028: the view cells (the side torso standing in for S, F and BQ until A023)
const RAT_NEAR_WRIST = 'A022 near hand under the bracer at 150 degrees of elbow with the whole near arm in front (view bands): short hidden wrist end (A023 repair list: longer wrist ends)';
// T028 r2: A023's drawings (views, split grips, caps): new view cells and the bow / spear far grip in every torso view
const RAT_CAP = 'A023 near shoulder cap over the side-on arm in F with the spear held: the cap\'s lower edge (a larger cap, or capTurn in the lab)';
const RAT_FAR_CUFF = 'T028 r2: A023 far fists carry a long hidden cuff (round 2 extension) that only stays under the forearm with a straight wrist; the two-hand / bow IK bends that wrist ~90 degrees (elbow below the shaft) and the cuff shows: re-pose the far elbow above (T029) or a shorter far cuff (Art)';
// T028 r4: the user's grip lines turn fists to hold items on the drawn line, and A023 round 4 re-cut the hidden ends
const R4_BOW_FIST = 'T028 r4: the archer\'s far fist turned ~88 deg to stand the bow up on the user\'s lines (his bow line runs across the bow, toward the shot): the wrist opens under the bracer (confirm the bow line, or a far fist drawn round an upright bow: T029 / Art)';
const R4_NEAR_TURN = 'T028 r4: the near fist turned to the user\'s grip line (side grip ~87 deg, overhand ~91 deg from A023\'s estimate): the arm IK reaches a new wrist spot and the shoulder or wrist opens (re-pose in T029; a longer hidden end if it stays)';
const R4_BACK_KNEE = 'T028 r4: A023 round 4 back-view leg cuts (leg-near-upper-back / leg-near-lower-back re-cut): the knee core opens at 90 / 150 in B (Art: longer hidden knee ends in the back cuts)';
const R4_OTHER = 'T028 r4: see the strip';
export const KNOWN = {
  'rat | lying (floor) | arm-near-lower / hand-near': [13.0, R4_NEAR_TURN],
  'rat | getup (floor) | arm-near-lower / hand-near': [4.8, R4_NEAR_TURN],
  'rat | crouch: jump squat (floor) | arm-near-lower / hand-near': [5.0, R4_NEAR_TURN],
  'rat | Rat Archer: rat-bow (underhand) | arm-far-lower / hand-far': [6.0, R4_BOW_FIST],
  'rat | Rat Raider: rat-cutlass (overhand) | arm-near-lower / hand-near': [12.3, R4_NEAR_TURN],
  'rat | Rat Archer: rat-bow (current grip) | arm-far-lower / hand-far': [6.0, R4_BOW_FIST],
  'rat | view pelvis B: near knee 150 | leg-near-upper / leg-near-lower': [9.3, R4_BACK_KNEE],
  'rat | view pelvis B: near knee 90 | leg-near-upper / leg-near-lower': [3.3, R4_BACK_KNEE],
  'rat | view torso H: Rat Archer rat-bow | arm-far-lower / hand-far': [8.3, R4_BOW_FIST],
  'rat | view torso S: Rat Archer rat-bow | arm-far-lower / hand-far': [13.0, R4_BOW_FIST],
  'rat | view torso F: Rat Archer rat-bow | arm-far-lower / hand-far': [11.5, RAT_FAR_WRIST],
  'rat | view torso BQ: Rat Archer rat-bow | arm-far-lower / hand-far': [12.8, RAT_FAR_WRIST],
  'rat | view torso BQ: Rat Spearman rat-spear | arm-far-lower / hand-far': [14.8, RAT_FAR_WRIST + ' (T028 r3: A023 r3 moved the BQ far shoulder; the spear fist turned over the shaft, as in H and LB)'],
  'rat | view torso H: Rat Spearman rat-spear | arm-far-lower / hand-far': [15.5, RAT_FAR_WRIST],
  'rat | view torso LB: Rat Spearman rat-spear | arm-far-lower / hand-far': [12.5, RAT_FAR_WRIST],
  'rat | view torso LB: Rat Archer rat-bow | arm-far-lower / hand-far': [12.5, RAT_FAR_WRIST],
  'rat | Rat Archer: rat-bow (reverse) | arm-far-lower / hand-far': [5.5, RAT_FAR_WRIST],
  'rat | view torso S: Rat Spearman rat-spear | arm-far-lower / hand-far': [12.3, RAT_FAR_CUFF],
  'rat | view torso F: Rat Spearman rat-spear | arm-far-lower / hand-far': [13.8, RAT_FAR_CUFF],
  // T026: the rat rebuilt on A018 + A019 + A022 (every A010 rat flag cleared; A022's hands cleared the near wrist flags)
  // T026 r2 + A022 (round 2 re-import)
  'rat | arms straight up | torso / arm-near-upper': [6.8, RAT_UP],
  'rat | Rat Spearman: rat-spear (current grip) | torso / arm-near-upper': [8.8, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (current grip) | arm-far-lower / hand-far': [12.3, RAT_FAR_CUFF],
  'rat | Rat Archer: rat-bow (current grip) | torso / arm-near-upper': [4.3, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (overhand) | torso / arm-near-upper': [8.8, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (overhand) | arm-far-lower / hand-far': [12.3, RAT_FAR_CUFF],
  'rat | Rat Archer: rat-bow (overhand) | arm-far-lower / hand-far': [14.8, RAT_FAR_CUFF],   // T028 r5: the user's bow line (along the bow) holds the bow as the fist is drawn, so this mode turns the fist ~90 deg further
  'rat | Rat Archer: rat-bow (overhand) | torso / arm-near-upper': [4.3, RAT_SHOULDER],   // T026 r4 stance (the cutlass guard)
  'rat | Rat Spearman: rat-spear (underhand) | torso / arm-near-upper': [4.8, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (underhand) | arm-far-lower / hand-far': [16.0, RAT_FAR_CUFF],
  'rat | Rat Archer: rat-bow (underhand) | torso / arm-near-upper': [4.3, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (reverse) | torso / arm-near-upper': [5.0, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (reverse) | arm-far-lower / hand-far': [16.0, RAT_FAR_CUFF],
  'rat | Rat Archer: rat-bow (reverse) | torso / arm-near-upper': [4.3, RAT_SHOULDER],
  'rat | lying (floor) | torso / arm-near-upper': [12.5, RAT_SHOULDER],   // T026 r4: 7.0 before the new stance
  'mouse | near knee 90 | leg-near-upper / leg-near-lower': [6.0, KNEE_CAP],
  'mouse | near knee 150 | leg-near-upper / leg-near-lower': [3.3, KNEE_CAP],
  'mouse | near elbow 90 | arm-near-upper / arm-near-lower': [3.3, ELBOW_CAP],
  'mouse | near elbow 150 | arm-near-upper / arm-near-lower': [7.5, ELBOW_CAP],
  'mouse | far knee 90 | leg-far-upper / leg-far-lower': [4.3, KNEE_CAP],
  'mouse | far knee 150 | leg-far-upper / leg-far-lower': [4.0, KNEE_CAP],
  'mouse | arms straight up | torso / arm-far-upper': [8.8, 'expected: a straight-up arm needs the whole raised-arm drawing (near: arm-near-raised exists; far raised arm is polish, not ordered)'],
  'mouse | arms straight up | torso / arm-near-upper': [11.5, 'expected: use arm-near-raised for arm-up poses (cast does)'],
  'mouse | crouch: jump squat (floor) | torso / arm-near-upper': [8.3, SHOULDER],
  'mouse | reach (floor) | torso / arm-near-upper': [13.8, SHOULDER],
  'mouse | reach (floor) | torso / head': [2.3, 'rounded neck end on the head (shows when the head tips down 18 degrees)'],
  'mouse | downed (floor) | torso / arm-near-upper': [12.3, SHOULDER],
  'mouse | revive (floor) | torso / arm-near-upper': [15.5, SHOULDER],
  'mouse | revive (floor) | leg-far-upper / leg-far-lower': [6.0, KNEE_CAP],
  'mouse | revive (floor) | pelvis / leg-far-upper': [3.8, HIP_FAR],
  'mouse | getup (floor) | torso / arm-near-upper': [11.5, SHOULDER],
  'mouse | getup (floor) | leg-far-upper / leg-far-lower': [3.3, KNEE_CAP],
  'mouse | getup (floor) | pelvis / leg-far-upper': [5.3, HIP_FAR],
  'mouse | lying (floor) | torso / arm-near-upper': [8.5, SHOULDER],
  'mouse | lying (floor) | leg-near-upper / leg-near-lower': [3.5, KNEE_CAP],
  // T029 r3: the wrist limits turn the lying mouse's hands back, which changes the lying rest's turn (lowest points):
  // the near ankle's gap shows at the new angle (mouse rebuild)
  'mouse | lying (floor) | leg-near-lower / foot-near': [9.8, 'T029 r3: ankle core at the lying rest\'s new turn; rounded boot top under the shin (mouse rebuild)'],
  // T025 grip modes (the fist turned on the weapon node): a fist turned over against its forearm opens the wrist
  'mouse | Mouse Fighter: own weapon (overhand) | arm-near-lower / hand-near': [5.3, TURNED],
  'mouse | rat-cutlass (overhand) | arm-near-lower / hand-near': [6.5, TURNED],
  'mouse | plank-club (overhand) | arm-near-lower / hand-near': [6.5, TURNED],
  'mouse | big-fish (overhand) | arm-near-lower / hand-near': [5.3, TURNED],
};
