# T042 - CI tests red since T039: LFS sources the v3 tests read (Code)

**Modules:** `.github/workflows/tests.yml`, the v3 tests that read `assets/source/` PNGs. **Needs:** nothing. **Autonomy:** auto-ok.

The `tests` workflow has failed on main since T039 (2026-10-21). Locally the same failure appears when the A026-A028 source PNGs are LFS pointers (`tests/rat-v3-swaps.test.mjs`: "only 8-bit non-interlaced PNGs (depth undefined)" on `assets/source/A026-rat-v3-arm-leg/hand-near.png`). CI only pulls two masters.
1. Find every test that reads `assets/source/` files; pull exactly those in CI (keep the LFS bandwidth small: list the files, not whole folders, if that's cheap to maintain; otherwise the v3 folders).
2. A test that needs an LFS file and finds a pointer fails with a clear message ("run git lfs pull -I <path>"), not a PNG decode error.
3. Get main's `tests` workflow green; report the run.
