// The heroes (T021): w.heroes, order = player slot. Small helpers shared by world, ai, camera and zones.
// Co-op: a hero at 0 hp stays 'dead' (fighter.js never removes heroes); the game is over when none is up.
// Revive / lives hook: bring a hero back to 'idle' (hp, invuln) here; nothing else assumes a dead hero stays dead.

// A slot's start spot: stage.heroStarts[slot]; slot 0 falls back to playerStart.
export const startOf = (stage, slot) =>
  stage.heroStarts?.[slot] ?? (slot === 0 ? stage.playerStart : { x: stage.playerStart.x - 60 * slot, y: stage.playerStart.y });

export const heroesUp = (w) => w.heroes.filter((h) => h.state !== 'dead');
