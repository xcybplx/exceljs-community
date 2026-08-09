# Changelog

Releases of `exceljs-community`, which continues `exceljs` from where it stopped
at 4.4.0. Upstream's own history is archived in
[docs/history-upstream.md](docs/history-upstream.md).

This file says what changed. [FORK.md](FORK.md) says why, and credits the people
who reported and diagnosed each problem upstream.

Every release is a drop-in replacement for `exceljs@4.4.0` unless an entry says
otherwise in as many words.

## 4.6.1 — 2026-08-09

Not a security release. No API changes: the browser bundle gets smaller, the
build becomes reproducible, and one thing this fork had been shipping without
saying so is written down.

### Fixed

- **The browser bundle was 19 KB gzip heavier than `exceljs@4.4.0`**, even
  though this fork had *removed* a dependency in 4.5.0.

  `browserify-sign` and `hash-base` both published releases that moved their
  own `readable-stream` dependency from `^3` back to `^2` — `browserify-sign`
  in 4.2.3, `hash-base` in 3.1.1. On the 3.x line they deduplicated against the
  `readable-stream` this package already depends on. On 2.x they each pull a
  private copy, so the bundle carried four complete implementations of Node's
  streams instead of two: about 103 KB of source.

  An `overrides` block pins both to their last release on the 3.x line.
  `browserify-sign@4.2.2` is also the release that fixed GHSA-x9w5-v3q2-3rhw,
  so the pin gives up no security fix, and it resolves the same
  `elliptic@6.6.1` that the newer releases do.

  `dist/exceljs.min.js` goes from 275,420 to 263,898 bytes gzip.
  `exceljs@4.4.0`, for reference, is 256,110.

### Changed

- **`package-lock.json` is now committed and CI installs with `npm ci`.**

  It had been suppressed twice over, both inherited from upstream: `.npmrc`
  carried `package-lock=false`, and `.gitignore` listed the file. Because
  `dist/` is generated at publish time and has never been in the repository,
  the browser bundle was resolved from caret ranges on whatever day the release
  happened — two releases built from identical source could ship different
  bundles, which is exactly how the regression above arrived unnoticed.

  npm does not publish lockfiles, so nothing changes for anyone installing this
  package.

### Added

- **A size budget for the browser bundles**, enforced in CI by
  `npm run test:size`. A bundle that grows passes every functional test in this
  repository; this is the only check that would have caught the regression
  above.

### Disclosed

- **This package contains pivot table support that `exceljs@4.4.0` never
  shipped.** No code changed in this release; what changed is that it is now
  stated.

  The fork's base is upstream's `master`, not the `4.4.0` tag. That brings six
  files (`lib/doc/pivot-table.js`, `lib/xlsx/xform/book/workbook-pivot-cache-xform.js`
  and four under `lib/xlsx/xform/pivot-table/`) which are wired into `Workbook`.
  This is upstream's own code, merged after 4.4.0 and never released, so it has
  been through no upstream release and no upstream issue cycle.

  The 4.4.0 public API is unchanged and every existing call still behaves the
  same way, so "drop-in replacement" holds. Two consequences are worth knowing
  anyway: `Workbook#toJSON()` now emits a `pivotTables` key that 4.4.0 did not,
  which matters if you round-trip the model through JSON; and this code is the
  bulk of the browser bundle's remaining 7.8 KB gzip difference from 4.4.0.

## 4.6.0 — 2026-08-09

### Added

- **Named imports.** `import {Workbook, ValueType} from 'exceljs-community'`
  now works, in Node and in every bundler, alongside the default import and
  `require`.

  It did not before, and the way it failed was the problem. `index.d.ts` has
  always declared `Workbook` and 105 other named exports, so TypeScript accepted
  the import. The package delivered none of them: the CommonJS entry assembles
  its exports at runtime with `Object.assign`, which Node's static analyser
  cannot read, so `await import('exceljs-community')` yielded a namespace of
  exactly `default` and `module.exports`. Type-checking passed, the build
  produced `undefined`, and nothing in between said a word.

  The fix is an ES module entry that states its exports rather than leaving them
  to be inferred, reached through a new `exports` map. `index.d.ts` also gains
  the default export it never declared, and `ModelContainer`, which the package
  has always exported and the declarations never mentioned.

### Compatibility

An `exports` map restricts a package to the paths it lists, so the documented
ways in were mapped deliberately and each has a test: `require` and `import` of
the package, deep paths under `lib/` with and without the `.js` extension, and
`dist/es5`, which `docs/api.md` documents for older Node versions.

If you reach for a path inside this package that is not covered, that is a bug
here — please report it.

`index.ts` is gone from the package. It re-exported the ES5 build for a
TypeScript entry point that nothing resolved to: types come from `index.d.ts`
and code from the entries above, so it shipped in every tarball unused.

### Internal

- The lint backlog is cleared: 0 errors, from 35 before the repository was
  tidied. Mostly module paths that named a `.js` extension the resolver adds
  anyway, or omitted a `.json` one it does not.

## 4.5.1 — 2026-08-09

**Not a security release, and nothing in the library changed.** This exists to
correct the 4.5.0 notes, which ship inside the package.

### Documentation

- Corrected what `exceljs#1328` is. The 4.5.0 entry called it a report that had
  been open since 2020. It is a pull request, merged in 2020, which fixed a
  different fault and left behind the regression test that catches this one.
  That test passed on Linux — the platform upstream CI ran — and failed on macOS
  and Windows for six years without being seen.

### Internal

- `got`, used by a single end-to-end test, moved from 9 to 11.8.5, clearing
  [GHSA-pfrx-2q88-qq97](https://github.com/advisories/GHSA-pfrx-2q88-qq97). It
  is a devDependency: nothing that depends on this package installs it, and no
  published code changes because of it. Calling this a security fix for users
  would be untrue. It also retired a workaround the test had carried since got 9.

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

  The regression test that catches it has been in the repository since 2020,
  added by [exceljs#1328](https://github.com/exceljs/exceljs/pull/1328). It
  passed on Linux, which is what upstream CI ran, and had been failing on macOS
  and Windows ever since. Two further reader failures in the same area turned
  out to share this cause and are fixed with it.

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
