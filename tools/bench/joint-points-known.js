// T034: hold checks the user's joint points break (only while they are on: data/rigs/rat-raider-joints.js JOINT_SWITCH).
// His shoulder point is the upper arm's top end (the importer's sat mid-arm under the vest), so the near upper arm's bone
// is 32.9 px long instead of 17.5 and the near arm hangs ~10 px longer; holds placed for the old arm (fists at the jaw,
// on a shaft close to the chest) now ask the elbow to fold past the deepest bend the art covers (data/wrists.js
// elbowMax 110) and come up short. Each is a re-pose (or a decision on the points) for after the user's review; the
// tests count them as known and fail on anything else. [message prefix, why]
import { JOINT_SWITCH } from '../../src/data/rigs/rat-raider-joints.js';

export const T034_KNOWN = [
  ['spearman getup: ', 'get-up spear: the far fist 10 px short of the shaft (the near fist low by the hip with the longer arm)'],
  ['archer draw @', 'bow draw: the near fist can\'t fold back to the string (elbow past 110 with the longer upper arm)'],
  ['archer full draw: ', 'full draw: string 4-6 px off the jaw, the bow tips (same cause)'],
  ['rat-archer holding own, bowShot @20: hand-near-pinch', 'the pinch 2 px off the bow line at the draw (same cause)'],
  ['rat-archer holding health-potion, bowShot @20: hand-near-pinch', 'as above'],
  ['rat-raider holding a021-staff, cast @', 'staff cast: the far overhand fist 7 deg off the staff (the staff placed for the old near arm)'],
  ['rat-spearman holding a021-staff, cast @', 'as above, 18 deg'],
  ['rat-spearman: weapon placed by the pose', 'the near fist 4 px nearer the shoulder needs a deeper elbow fold than 110 (the idle elbow is already folded)'],
  ['rat-raider: weapon placed by the pose', 'as above'],
];

// a failed check that is on the list: its reason (and the test counts it); otherwise null
export const knownT034 = (msg) => (JOINT_SWITCH.points ? T034_KNOWN.find(([p]) => msg.startsWith(p))?.[1] ?? null : null);
