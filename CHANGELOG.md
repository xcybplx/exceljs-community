# Changelog

Releases of `exceljs-community`, which continues `exceljs` from where it stopped
at 4.4.0. Upstream's own history is archived in
[docs/history-upstream.md](docs/history-upstream.md).

This file says what changed. [FORK.md](FORK.md) says why, and credits the people
who reported and diagnosed each problem upstream.

Every release is a drop-in replacement for `exceljs@4.4.0` unless an entry says
otherwise in as many words.

## 4.5.0 — 2026-08-09

The first release under the new name. The API, the module shape and the
supported Node versions are unchanged from `exceljs@4.4.0`; switching should be
a matter of changing the dependency name.

### Fixed

- **The streaming reader no longer drops entries from the archive.**
  `WorkbookReader` returned unresolved `{sharedString: N}` references instead of
  cell values when a workbook stored its worksheet before `sharedStrings.xml` —
  a layout several spreadsheet applications produce. Affects any code reading
  through `ExcelJS.stream.xlsx.WorkbookReader`.

  The cause was not in the reader but in the stream iterator, which paused the
  stream around each `yield`. Sources that keep working while paused emitted
  `end` regardless, and whatever had not been delivered was lost silently. The
  failure was timing-dependent, which is why it appeared on macOS and Windows
  far more often than on Linux.

  Reported upstream as
  [exceljs#1328](https://github.com/exceljs/exceljs/issues/1328), open since
  2020. Two further reader failures in the same area turned out to share this
  cause and are fixed with it.

### Changed

- **Renamed to `exceljs-community`.** The upstream git history, the MIT licence
  and the original author's attribution are preserved. Repository metadata,
  issue tracker and homepage point at the new home.

- **`uuid` is no longer a dependency.** The library asked it for one thing — a
  version 4 value for a conditional formatting attribute — which it now
  generates itself, preferring `crypto.randomUUID`. Generated values keep the
  same shape, so written files are unchanged. `npm audit --omit=dev` is clean
  and the production dependency count drops from eight to seven.

### Documentation

- The 205 KB README was split: the API reference now lives in
  [docs/api.md](docs/api.md) and the upstream changelog in
  [docs/history-upstream.md](docs/history-upstream.md). The README covers what
  this project is and what is promised of it, including the maintenance
  commitment.

- Added [SECURITY.md](SECURITY.md) with a private reporting route, and
  [CONTRIBUTING.md](CONTRIBUTING.md).

### Internal

- `grunt build` now fails when minification fails. It used to log the error,
  exit 0 and leave the previous `dist/*.min.js` in place — and `package.json`
  points browser consumers at that file, so a stale bundle could have been
  published without anyone noticing.

- Continuous integration runs on Node 18, 20, 22 and 24 across Linux, macOS and
  Windows. The `exceljs#1328` failure only ever reproduced off Linux, so the
  matrix keeps all three.
