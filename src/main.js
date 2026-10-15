// Entry point: size canvas, load art referenced by data, start the loop.
import { VIEW } from './config.js';
import { loadAssets, collectArtPaths } from './core/assets.js';
import { initInput } from './core/input.js';
import { startLoop } from './core/loop.js';
import { FIGHTERS } from './data/fighters/index.js';
import { STAGES } from './data/stages/index.js';
import { RIGS } from './data/rigs/index.js';
import { createGame } from './game.js';

const canvas = document.getElementById('game');
canvas.width = VIEW.w; canvas.height = VIEW.h;
const ctx = canvas.getContext('2d');

await document.fonts?.load('20px "Lilita One"').catch(() => {});
const assets = await loadAssets(collectArtPaths(FIGHTERS, STAGES, RIGS));
initInput();
const game = createGame(ctx, assets);
startLoop(game.update, game.render);
