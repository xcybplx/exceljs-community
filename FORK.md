# Changes from upstream exceljs 4.4.0

Every change to library behaviour is recorded here, with the upstream issue or
pull request that reported or diagnosed it. Fixes are implemented independently;
this file exists so credit for the diagnosis is not lost, and so the reasoning
behind each change can be found later.

## Unreleased (4.5.0)

### Project

- Renamed the package to `exceljs-community` and pointed repository metadata at
  the new home. Upstream history, MIT licence and original author attribution
  are preserved.
- Split the 205 KB README: the API reference moved to `docs/api.md`, the upstream
  changelog to `docs/history-upstream.md`. The new README covers what the project
  is and what is promised of it.

No library behaviour has changed yet.

## Not planned for 4.5.0

- **`minimatch` (upstream exceljs#3024).** The npm advisory covers
  `minimatch <=3.1.3`; the production dependency tree resolves `3.1.5` and
  `5.1.9`, which are not affected. The report originated from `pnpm audit`,
  which applies a wider range. Nothing to fix in the code.
- **`archiver` 5 → 7 (upstream exceljs#2715).** `inflight@1.0.6` is present in
  the production tree, but npm assigns it no advisory — it is a memory leak and
  a maintenance burden, not a vulnerability. Deferred to 4.6.0, where it will be
  described as such.
