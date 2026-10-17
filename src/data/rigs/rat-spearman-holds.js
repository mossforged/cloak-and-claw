// Rat Spearman hold variants (T025, view only): the spear on the weapon node (render/weapon-node.js) with the back
// (near) fist overhand, for the user to compare with the T020 pick E (underhand, the default). `?spear=B` (or C, D)
// in the game / hold sheet lays one over the spearman's rig. With A010's grip hand turned over, the overhand fist's
// wrist sits under the shaft, so his short near arm holds it no lower than his chest (grip ~66 px up vs E's 53);
// a low overhand needs the planned `hand-near-grip-overhand` drawing (picked up automatically when it exists).
// Each: holds = grip modes for the spear (both fists), poses = pose fields laid over his own.
export const SPEAR_HOLDS = {
  B: { label: 'overhand, level at the chest', holds: { grip: 'overhand', grip2: 'overhand' },
    poses: { stance: { weapon: { rot: -8 } }, idle: { weapon: { rot: -8 } }, walk: { weapon: { rot: -8 } } } },
  C: { label: 'overhand, point down (low guard)', holds: { grip: 'overhand', grip2: 'overhand' },
    poses: { stance: { weapon: { rot: 12 } }, idle: { weapon: { rot: 12 } }, walk: { weapon: { rot: 12 } }, hurt: { weapon: { rot: 16 } } } },
  D: { label: 'overhand, deeper crouch, point down', holds: { grip: 'overhand', grip2: 'overhand' },
    poses: { stance: { dy: 6, weapon: { rot: 8 } }, idle: { dy: 6, weapon: { rot: 8 } }, walk: { weapon: { rot: 8 } }, hurt: { weapon: { rot: 16 } } } },
};

// The spearman rig with variant k laid over it (k unknown or absent: the rig as is).
export function withSpearHold(rig, k) {
  const V = SPEAR_HOLDS[k];
  if (!V) return rig;
  const poses = { ...rig.poses };
  for (const [n, p] of Object.entries(V.poses)) poses[n] = { ...poses[n], ...p };
  return { ...rig, holds: { ...rig.holds, 'rat-spear': V.holds }, poses };
}
