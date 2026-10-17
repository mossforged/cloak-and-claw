// Builds the GitHub Pages site (T027, .github/workflows/pages.yml): main at the root, and every remote branch not yet
// merged into main under preview/<branch>/, plus previews.json for the review hub (reviews.html).
//   node tools/pages/build-site.mjs [outDir=_site] [--remote origin]
// A preview copy holds the game, the viewer and lab pages, src/, assets/art/, tools/bench/ (the viewer's stretch check),
// docs/tasks/ and that branch's own docs/screens/<TASK>/. assets/source/ (LFS, Pages can't serve it) is never copied.
// Reads the git refs only (no checkout): run after fetching every branch (actions/checkout fetch-depth 0).
import { execSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2), out = args.find((a) => !a.startsWith('--')) ?? '_site';
const remote = args.includes('--remote') ? args[args.indexOf('--remote') + 1] : 'origin';
const git = (cmd, o = {}) => execSync(`git ${cmd}`, { encoding: 'utf8', maxBuffer: 1 << 26, ...o });
const has = (ref, path) => git(`ls-tree --name-only ${ref} -- "${path}"`).trim() !== '';
const when = (ref) => new Date(+git(`log -1 --format=%ct ${ref}`).trim() * 1000).toISOString();   // UTC, sorts as text
const IMG = /\.(jpe?g|png|gif|webp)$/i;
const PREVIEW = ['index.html', 'viewer.html', 'lab.html', 'reviews.html', 'README.md', 'src', 'assets/art', 'tools/bench', 'docs/tasks'];

function extract(ref, dir, paths) {
  mkdirSync(dir, { recursive: true });
  const list = paths.filter((p) => p === '.' || has(ref, p)).map((p) => `"${p}"`).join(' ');
  if (!list) return;
  execSync(`git archive --format=tar ${ref} -- ${list} ":(exclude)assets/source" | tar -x -C "${dir}"`, { stdio: 'inherit' });
}

// T027 -> the task packet's title and its Human acceptance question (as text), its screens
export const taskOf = (branch) => { const m = /^([at])(\d{3})/i.exec(branch.replace(/^.*\//, '')); return m ? m[1].toUpperCase() + m[2] : null; };
export function packetOf(text) {
  const lines = text.split('\n'), title = (lines.find((l) => l.startsWith('# ')) ?? '').replace(/^#\s*/, '');
  const human = lines.filter((l) => /^-\s*\**Human\b/i.test(l)).map((l) => l.replace(/^-\s*\**Human[^:]*:\**\s*/i, '').trim());
  return { title, human };
}

function preview(branch) {
  const ref = `${remote}/${branch}`, slug = branch.replace(/[^\w.-]+/g, '-'), task = taskOf(branch), dir = join(out, 'preview', slug);
  const screens = task ? `docs/screens/${task}` : null;
  extract(ref, dir, [...PREVIEW, ...(screens ? [screens] : [])]);
  const packetFile = task && git(`ls-tree --name-only ${ref} docs/tasks/`).split('\n').find((f) => f.startsWith(`docs/tasks/${task}-`));
  const packet = packetFile ? packetOf(git(`show ${ref}:${packetFile}`)) : { title: '', human: [] };
  const shots = screens && has(ref, screens) ? git(`ls-tree -r --name-only ${ref} -- ${screens}`).split('\n').filter((f) => IMG.test(f)) : [];
  // T026: optional docs/screens/<TASK>/views.json = [{ label, q }]: viewer links with the exact state (q = its URL query)
  let views = [];
  try { if (screens && has(ref, `${screens}/views.json`)) views = JSON.parse(git(`show ${ref}:${screens}/views.json`)); } catch { views = []; }
  return {
    branch, task, path: `preview/${slug}/`, title: packet.title, human: packet.human,
    packet: packetFile ?? null, time: when(ref), commit: git(`log -1 --format=%h ${ref}`).trim(),
    subject: git(`log -1 --format=%s ${ref}`).trim().slice(0, 140), viewer: has(ref, 'viewer.html'), screens: shots, views,
  };
}

export function build() {
  rmSync(out, { recursive: true, force: true });
  extract(`${remote}/main`, out, ['.']);
  writeFileSync(join(out, '.nojekyll'), '');
  const open = git(`branch -r --no-merged ${remote}/main --format='%(refname:short)'`).split('\n').map((b) => b.trim())
    .filter((b) => b && b.startsWith(`${remote}/`) && !b.endsWith('/HEAD')).map((b) => b.slice(remote.length + 1)).filter((b) => b !== 'main');
  const previews = open.map(preview).sort((a, b) => b.time.localeCompare(a.time));
  const main = { branch: 'main', path: '', time: when(`${remote}/main`), commit: git(`log -1 --format=%h ${remote}/main`).trim(),
    subject: git(`log -1 --format=%s ${remote}/main`).trim().slice(0, 140), viewer: has(`${remote}/main`, 'viewer.html') };
  writeFileSync(join(out, 'previews.json'), JSON.stringify({ built: new Date().toISOString(), main, previews }, null, 1));
  console.log(`site: main + ${previews.length} preview(s): ${previews.map((p) => p.branch).join(', ') || 'none'}`);
}

if (import.meta.url === `file://${process.argv[1]}`) build();
