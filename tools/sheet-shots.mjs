// T029 r3: phone JPGs of the rehearsal sheet, each scrolled to a move (tools/phone-shot.mjs; serve the repo first:
// python3 tools/serve.py). node tools/sheet-shots.mjs <out dir> [port] -> sheet-1.jpg ... (the top, then each move below)
import { spawnSync } from 'node:child_process';

const [dir, port = 8000] = process.argv.slice(2);
const MOVES = [null, 'Slash 1 (forehand cut)', 'Slash 3 spin (finisher)', 'Dagger stab', 'Spear thrust', 'Staff two-hand swing', 'Bow draw'];
MOVES.forEach((m, i) => {
  const js = m ? `[...document.querySelectorAll('h3, h2, div, span, b')].find((e) => e.childElementCount < 4 && e.textContent.trim().startsWith(${JSON.stringify(m)}))?.scrollIntoView()` : 'void 0';
  const r = spawnSync('node', ['tools/phone-shot.mjs', `http://localhost:${port}/viewer.html?rehearse=rat-raider`, `${dir}/sheet-${i + 1}.jpg`, '--wait', '6000', '--eval', js], { encoding: 'utf8' });
  process.stdout.write(r.stdout + r.stderr);
});
