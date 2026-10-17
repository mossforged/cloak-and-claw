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
export const KNOWN = {
  // T026: the rat rebuilt on A018 + A019 + A022 (every A010 rat flag cleared; A022's hands cleared the near wrist flags)
  // T026 r2 + A022 (round 2 re-import)
  'rat | arms straight up | torso / arm-near-upper': [6.8, RAT_UP],
  'rat | hand-near-grip-overhand | arm-near-lower / hand-near': [2.3, RAT_FAR_WRIST],
  'rat | Rat Spearman: rat-spear (current grip) | torso / arm-near-upper': [3.5, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (current grip) | arm-far-lower / hand-far': [10.5, RAT_FAR_WRIST],
  'rat | Rat Archer: rat-bow (current grip) | torso / arm-near-upper': [2.8, RAT_SHOULDER],
  'rat | Rat Raider: rat-cutlass (overhand) | torso / arm-near-upper': [2.5, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (overhand) | torso / arm-near-upper': [3.5, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (overhand) | arm-far-lower / hand-far': [10.5, RAT_FAR_WRIST],
  'rat | Rat Archer: rat-bow (overhand) | arm-far-lower / hand-far': [3.3, RAT_FAR_WRIST],
  'rat | Rat Archer: rat-bow (overhand) | torso / arm-near-upper': [2.8, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (underhand) | torso / arm-near-upper': [4.8, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (underhand) | arm-far-lower / hand-far': [8.8, RAT_FAR_WRIST],
  'rat | Rat Archer: rat-bow (underhand) | torso / arm-near-upper': [2.8, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (reverse) | torso / arm-near-upper': [5.0, RAT_SHOULDER],
  'rat | Rat Spearman: rat-spear (reverse) | arm-far-lower / hand-far': [8.8, RAT_FAR_WRIST],
  'rat | Rat Archer: rat-bow (reverse) | torso / arm-near-upper': [2.8, RAT_SHOULDER],
  'rat | crouch: jump squat (floor) | arm-far-lower / hand-far': [3.0, RAT_FAR_WRIST],
  'rat | lying (floor) | torso / arm-near-upper': [7.0, RAT_SHOULDER],
  'rat | lying (floor) | arm-near-lower / hand-near': [7.0, RAT_FAR_WRIST],
  'rat | 1.4x (floor) | leg-near-lower / foot-near': [2.1, 'only at the 1.4x size step (variety is +-4%): a touch more overlap at the near ankle, low priority'],
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
  // T025 grip modes (the fist turned on the weapon node): a fist turned over against its forearm opens the wrist
  'mouse | Mouse Fighter: own weapon (overhand) | arm-near-lower / hand-near': [5.3, TURNED],
  'mouse | rat-cutlass (overhand) | arm-near-lower / hand-near': [6.5, TURNED],
  'mouse | plank-club (overhand) | arm-near-lower / hand-near': [6.5, TURNED],
  'mouse | big-fish (overhand) | arm-near-lower / hand-near': [5.3, TURNED],
};
