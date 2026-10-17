// Stretch-strip flags known at T024, each with the art fix it needs (the lead turns these into art addenda). The test
// (tests/stretch.test.mjs) fails on any flag not listed here, or one that got more than 1 px worse; fix the art (or the
// pose) and delete its line. Key: 'body | cell | joint'; px = the gap measured when listed.
const ELBOW_CAP = 'patch cap / rounded end on the forearm across the elbow (rig standard 4: joint patches)';
const KNEE_CAP = 'patch cap / rounded end on the lower leg across the knee';
const SHOULDER = 'round the top of arm-near-upper (A013 cut it straight: the torso hides it at rest, but every pose that draws the arm over the tunic shows the cut)';
const HIP_FAR = 'rounded top on leg-far-upper under the pelvis (opens when the far thigh folds forward: kneel, lying)';
export const KNOWN = {
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
  'rat | near elbow 90 | arm-near-upper / arm-near-lower': [7.5, ELBOW_CAP],
  'rat | near elbow 150 | arm-near-upper / arm-near-lower': [7.3, ELBOW_CAP],
  'rat | far elbow 150 | arm-far-upper / arm-far-lower': [4.3, ELBOW_CAP],
  'rat | far knee 90 | leg-far-upper / leg-far-lower': [9.3, KNEE_CAP + ' (the far shin shows its cut end)'],
  'rat | far knee 150 | leg-far-upper / leg-far-lower': [5.3, KNEE_CAP],
  'rat | Rat Spearman: rat-spear (current grip) | arm-far-lower / hand-far': [12.5, 'wrist: the far grip fist turned hard round the shaft opens the wrist; rounded wrist end on hand-far-grip (or T025 grip modes)'],
  'rat | lying (floor) | torso / arm-far-upper': [4.5, 'rounded shoulder end on arm-far-upper'],
  'rat | lying (floor) | pelvis / leg-far-upper': [4.3, 'rounded top on leg-far-upper'],
};
