// Lab entry (lab.html): the normal game plus the tuning panel. Same boot as src/main.js.
import { VIEW } from '../config.js';
import { loadAssets, collectArtPaths } from '../core/assets.js';
import { initInput } from '../core/input.js';
import { startLoop } from '../core/loop.js';
import { FIGHTERS } from '../data/fighters/index.js';
import { STAGES } from '../data/stages/index.js';
import { RIGS } from '../data/rigs/index.js';
import { ITEMS } from '../data/items/index.js';
import { PROPS } from '../data/props/index.js';
import { LAB_SCHEMA, ROOTS } from '../data/lab-schema.js';
import { createGame } from '../game.js';
import { createTweaks } from './tweaks.js';
import { createLabTools } from './tools.js';
import { buildPanel, loadSaved } from './panel.js';

const tweaks = createTweaks(LAB_SCHEMA, ROOTS);   // snapshot defaults before saved changes are applied
loadSaved(tweaks);

const canvas = document.getElementById('game');
canvas.width = VIEW.w; canvas.height = VIEW.h;
const ctx = canvas.getContext('2d');

await document.fonts?.load('20px "Lilita One"').catch(() => {});
const assets = await loadAssets(collectArtPaths(FIGHTERS, STAGES, RIGS, ITEMS, PROPS));
initInput();
const game = createGame(ctx, assets);
window.game.opts.debug = true;
const tools = createLabTools(game);
window.game.lab = { tweaks, tools };
buildPanel(document.getElementById('lab'), LAB_SCHEMA, tweaks, tools, window.game.opts);
startLoop(tools.update, game.render);
