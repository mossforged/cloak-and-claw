// Phone-size screenshots (T027): opens a page in headless Chrome with a phone viewport (DevTools device emulation; a
// plain --window-size can't go below ~500 px wide on macOS), waits, optionally runs a script in the page, saves a JPG.
//   node tools/phone-shot.mjs <url> <out.jpg> [--size 390x844] [--scale 2] [--wait 3000] [--eval "js"] [--quality 80]
// Page errors and console errors / warnings are printed. Needs Google Chrome (CHROME=<path> to override) and Node 22 (built-in WebSocket).
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const [url, out] = args;
if (!url || !out) { console.log('usage: node tools/phone-shot.mjs <url> <out.jpg> [--size 390x844] [--scale 2] [--wait ms] [--eval js]'); process.exit(1); }
const [W, H] = opt('size', '390x844').split('x').map(Number), scale = +opt('scale', 2), wait = +opt('wait', 3000);
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, '--disable-gpu', '--hide-scrollbars',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'shot-'))}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(100);
    target = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json()).then((l) => l.find((t) => t.type === 'page')).catch(() => null);
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    if (d.method === 'Runtime.exceptionThrown') console.log('page error:', d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text);
    if (d.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(d.params.type)) console.log(`page ${d.params.type}:`, d.params.args.map((a) => a.value ?? a.description).join(' '));
  };
  const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: scale, mobile: W < 800 });
  await send('Emulation.setTouchEmulationEnabled', { enabled: W < 800 });
  await send('Page.navigate', { url });
  await sleep(wait);
  const js = opt('eval');
  if (js) { await send('Runtime.evaluate', { expression: js, awaitPromise: true }); await sleep(+opt('after', 800)); }
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: +opt('quality', 80) });
  writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
  console.log(`wrote ${out} (${W}x${H} @${scale}x)`);
  ws.close();
} finally { chrome.kill(); }
