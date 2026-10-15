// Lab-only tools around the normal game: slow motion, passive rats, respawn wave.
// They wrap game.update and poke the world between steps, so src/sim stays unchanged.

export function createLabTools(game) {
  const s = { speed: 1, passive: false, acc: 0 };

  // Rats never take an attack token while passive (ai.js only grants one when cool <= 0).
  const calm = (w) => { for (const f of w.fighters) if (f.ai) { f.ai.token = false; f.ai.cool = 999; } };

  return {
    state: s,
    // Called once per real step (60/s); runs the game step `speed` times on average.
    update() {
      s.acc += s.speed;
      while (s.acc >= 1) {
        s.acc -= 1;
        if (s.passive) calm(window.game.world);
        game.update();
      }
    },
    setSpeed(v) { s.speed = v; s.acc = 0; },
    setPassive(on) {
      s.passive = on;
      if (!on) for (const f of window.game.world.fighters) if (f.ai) f.ai.cool = 30;
    },
    // Clears enemies, refills the hero (reviving after a game over) and replays the current wave.
    respawnWave() {
      const w = window.game.world, p = w.player;
      w.fighters = w.fighters.filter((f) => f.team === 'hero');
      Object.assign(p, { hp: p.maxHp, state: 'idle', t: 0, move: null, z: 0, vz: 0, invuln: 60 });
      w.over = false;
      w.wave = Math.max(0, w.wave - 1);
      w.waveTimer = 1;
    },
  };
}
