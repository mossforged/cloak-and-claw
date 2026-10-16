// The heroes (T021): w.heroes, order = player slot. Small helpers shared by world, ai, camera and zones.
// A lone hero at 0 hp goes 'dead' as always. T022: with more than one hero he goes 'downed' instead (sim/revive.js):
// friends can pick him up; when his timer runs out he is 'dead' for the rest of the fight (bleedOut, the failure hook).
// The game is over when no hero is up (downed and dead heroes are not up).
import { bus } from '../core/events.js';
import { setState } from './fighter.js';

// A slot's start spot: stage.heroStarts[slot]; slot 0 falls back to playerStart.
export const startOf = (stage, slot) =>
  stage.heroStarts?.[slot] ?? (slot === 0 ? stage.playerStart : { x: stage.playerStart.x - 60 * slot, y: stage.playerStart.y });

export const isUp = (h) => h.state !== 'dead' && h.state !== 'downed';
export const heroesUp = (w) => w.heroes.filter(isUp);

// The downed timer ran out: he stays down for the rest of the fight. What that costs (lives, the home base) is the
// user's later call; it goes here. No penalty yet.
export function bleedOut(h) {
  setState(h, 'dead');
  bus.emit('bledOut', { f: h });
}
