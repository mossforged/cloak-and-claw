// T036: an old Art round out of git history (LFS images smudged) into a scratch folder, keeping the
// assets/source/<folder> layout so a rig-source's '../A0NN-.../x.png' paths still resolve. Node + git + git-lfs.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const git = (args, input) => execFileSync('git', args, { input, maxBuffer: 1 << 28 });

// folders: e.g. ['A026-rat-v3-arm-leg', 'A027-rat-v3-body']; returns the scratch root (contains the folders)
export function extractRound(commit, folders, root = join(tmpdir(), 'joint-check', commit)) {
  for (const f of folders) {
    const dir = join(root, f);
    mkdirSync(dir, { recursive: true });
    const names = git(['ls-tree', '--name-only', commit, `assets/source/${f}/`]).toString().split('\n').filter((n) => /\.(png|json)$/.test(n));
    for (const n of names) {
      const out = join(dir, n.split('/').pop());
      if (existsSync(out)) continue;
      const blob = git(['show', `${commit}:${n}`]);
      writeFileSync(out, blob.subarray(0, 40).toString('latin1').startsWith('version https://git-lfs') ? git(['lfs', 'smudge'], blob) : blob);
    }
  }
  return root;
}
