// Mouse Fighter action poses (grab/throw, weapon toss, pickup), split out of mouse-fighter-poses.js
// (same format; see that file's header). Spread into the pose set at the same spot, so nothing changes.
export const ACTION_POSES = {
  // Grab and throw (T009). grabbing: sword fist forward at the rat's collar (blade up along the forearm), shield
  // braced low, wide stance. knee: drives the back knee up into him while yanking him down. throwWind: heaves him
  // up and back; throwWindBack: twists round (body narrows and mirrors) to send him over the shoulder; throwRelease: flings him.
  grabbing: {
    torso: 12, head: -2, dy: 3,
    'arm-front-upper': -105, 'arm-front-lower': 5, sword: -45,
    'arm-back-upper': -55, 'arm-back-lower': -50, shield: 6,
    'leg-back-upper': -60, 'leg-back-lower': 44, 'leg-front-upper': 58, 'leg-front-lower': -62,
    tail: 10, 'scarf-tail': 10,
  },
  knee: {
    swap: { head: 'head-shout' },
    torso: 18, head: 4, dy: -4,
    'arm-front-upper': -40, 'arm-front-lower': -10, sword: -60,
    'arm-back-upper': -60, 'arm-back-lower': -30, shield: 10,
    'leg-back-upper': -100, 'leg-back-lower': 90, 'leg-front-upper': 30, 'leg-front-lower': -36,
    'leg-back-upper.order': 9.5, 'leg-back-lower.order': 9.4,   // the knee comes up in front of the tunic
    tail: -15, 'scarf-tail': -20,
  },
  throwWind: {
    torso: -14, head: -10, dy: 2,
    'arm-front-upper': -130, 'arm-front-lower': -20, sword: 30,
    'arm-back-upper': -120, 'arm-back-lower': -30, shield: 0,
    'leg-back-upper': -40, 'leg-back-lower': 30, 'leg-front-upper': 70, 'leg-front-lower': -70,
    tail: 25, 'scarf-tail': 30,
  },
  throwWindBack: {
    swap: { torso: 'torso-back' }, sx: -1,
    torso: -16, head: -12, dy: 2,
    'arm-front-upper': 170, 'arm-front-lower': -20, sword: -230,
    'arm-back-upper': -150, 'arm-back-lower': -20, shield: 0,
    'leg-back-upper': -40, 'leg-back-lower': 30, 'leg-front-upper': 70, 'leg-front-lower': -70,
    tail: 30, 'scarf-tail': 35,
  },
  throwRelease: {
    swap: { head: 'head-shout' },
    torso: 18, head: 6, dx: 4,
    'arm-front-upper': -95, 'arm-front-lower': 0, sword: 80,
    'arm-back-upper': -20, 'arm-back-lower': -40, shield: 10,
    'leg-back-upper': -58, 'leg-back-lower': 36, 'leg-front-upper': 52, 'leg-front-lower': -50,
    tail: -25, 'scarf-tail': -30,
  },
  // Weapon toss (T010, H while holding a floor weapon): toss = cocked back overhead, tossRelease = arm whipped
  // forward, hand open. Wind lasts def.toss.wind frames, then the release eases back to idle over toss.recovery.
  toss: {
    torso: -10, head: -6, dy: 1,
    'arm-front-upper': 150, 'arm-front-lower': -30, sword: -200,
    'arm-back-upper': -20, 'arm-back-lower': -40, shield: 4,
    'leg-back-upper': -50, 'leg-back-lower': 40, 'leg-front-upper': 66, 'leg-front-lower': -66,
    tail: 15, 'scarf-tail': 15,
  },
  tossRelease: {
    swap: { head: 'head-shout' },
    torso: 16, head: 4, dx: 4,
    'arm-front-upper': -95, 'arm-front-lower': 0, sword: 80,
    'arm-back-upper': 10, 'arm-back-lower': -30, shield: 10,
    'leg-back-upper': -58, 'leg-back-lower': 36, 'leg-front-upper': 52, 'leg-front-lower': -50,
    tail: -20, 'scarf-tail': -25,
  },
  // Weapon pickup (T010 round 2): stow = sword arm swept back to the hip, blade down and behind (sheathing it, or
  // flicking the held weapon away); reach = crouched, leaning in, hand down at the weapon on the floor in front.
  // pickup state: idle -> stow over def.pickup.stow frames, -> reach over .reach, -> idle over .rise.
  stow: {
    torso: 8, head: -2, dy: 2,
    'arm-front-upper': 52, 'arm-front-lower': -30, sword: 120,
    'arm-back-upper': -50, 'arm-back-lower': -60, shield: 6,
    'leg-back-upper': -52, 'leg-back-lower': 36, 'leg-front-upper': 50, 'leg-front-lower': -54,
    tail: 10, 'scarf-tail': 10,
  },
  reach: {   // legs solved so both boots stay flat on the floor at this crouch (tests/rig.test.mjs)
    torso: 28, head: -22, dy: 12,
    'arm-front-upper': -40, 'arm-front-lower': -25, sword: 45,
    'arm-back-upper': -90, 'arm-back-lower': -40, shield: 10,
    'leg-back-upper': -133, 'leg-back-lower': 93, 'leg-front-upper': 52, 'leg-front-lower': -80,
    tail: -10, 'scarf-tail': -20,
  },
};
