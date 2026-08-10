# Changes from upstream exceljs 4.4.0

Every change to library behaviour is recorded here, with the upstream issue or
pull request that reported or diagnosed it. Fixes are implemented independently;
this file exists so credit for the diagnosis is not lost, and so the reasoning
behind each change can be found later.

## 5.0.0

### Fixed

#### StreamBuf.pipe() never returned its destination

Not an upstream report — found while upgrading `archiver`, and present in
`exceljs` since the class was written.

`Readable.pipe` returns its destination so callers can chain or wrap the result.
`lib/utils/stream-buf.js` returned nothing. No consumer inside ExcelJS ever used
the return value, so the defect stayed invisible: the streaming writer calls
`this.zip.pipe(this.stream)` and discards it.

`archiver@8` made it visible. Its `normalizeInputSource` wraps every appended
source in a `PassThrough` — `return source.pipe(new PassThrough())` — and the
`undefined` it got back failed the library's own stream check, so every
`append()` of a `StreamBuf` was rejected with "input source must be valid Stream
or Buffer instance". Every streaming write failed.

`pipe()` now returns the destination. The unit test covering it was confirmed
red against the old behaviour before being kept.

### Changed

#### Node 22.12 is the new floor, and archiver 8 is the reason

The declared floor had been `>=8.3.0`, which was never true — `tmp` required
14.14 and `excel.js` threw below 10. Replacing fiction with an accurate number
was overdue on its own; `archiver@8` forced a specific one.

archiver 8 ships as ESM only. The streaming writer is CommonJS and reaches it
through `require(esm)`, a capability Node gained in 22.12 and backported to
20.19. Nothing supported is left below that line: Node 18 went end-of-life in
April 2025, Node 20 in April 2026.

archiver 8 also replaced its callable factory with one class per format, so
`archiver('zip', options)` became `new ZipArchive(options)`. That is confined to
one line of `lib/stream/xlsx/workbook-writer.js`; no ExcelJS API changed.

#### unzipper 0.12 removes the last deprecated transitive dependencies

Upstream [#2715](https://github.com/exceljs/exceljs/issues/2715) is about
`inflight` and `glob@7` sitting in the production tree — a memory leak and a
deprecation rather than a vulnerability, which is why 4.5.0 deferred it.

unzipper 0.12 replaced the unmaintained `fstream` with `fs-extra`, and `fstream`
was the whole chain: `fstream` → `rimraf@2` → `glob@7` → `inflight`. With
`archiver@8` having already dropped its own copy, both are now gone entirely and
the production tree falls from 114 packages to 93.

## 4.6.0

### Added

#### Named exports, and the mismatch that hid the lack of them

`index.d.ts` declared `Workbook` and 105 other named exports; the package
delivered none. The CommonJS entry builds its export object at runtime with
`Object.assign`, so `cjs-module-lexer` — the static analyser Node uses to offer
named exports from CommonJS — found nothing, and an ES module importing the
package received a namespace of `default` and `module.exports` alone.

Every layer was individually defensible and the combination was not: the types
promised, the runtime did not deliver, and no test could see the gap because the
suite loads files by path and never resolves the package by name.

`index.mjs` now states the exports outright. `package.json` gained an `exports`
map so that entry is used for `import` while `require` keeps reaching
`excel.js`, and `index.d.ts` gained the default export it had never declared
plus `ModelContainer`, exported since long before this fork and never described.

Verified against a packed tarball rather than the working tree: the same import
statement type-checks under `module: node16` and runs. Before, those two were
mutually exclusive.

`spec/end-to-end/module-exports.spec.js` covers the four ways in and asserts
that the hand-written list in `index.mjs` matches the CommonJS entry exactly, so
it cannot drift unnoticed.

## 4.5.1

No change to library behaviour. Corrects the description of `exceljs#1328` in
the 4.5.0 notes, and moves the `got` devDependency to 11.8.5 — a test-only
dependency that never reaches anyone installing this package.

## 4.5.0

### Fixed

#### Streaming reader dropped archive entries

Caught by the regression test added in
[exceljs#1328](https://github.com/exceljs/exceljs/pull/1328) (merged 2020). That
pull request fixed a different fault and left the test behind; the test then
passed on Linux, which is what upstream CI ran, and failed on macOS and Windows
for the next six years without anyone seeing it.

`WorkbookReader` returned unresolved `{sharedString: N}` references instead of
cell values when a workbook stored its worksheet before `sharedStrings.xml` —
the layout produced by several spreadsheet applications.

Root cause was not in the reader but in `lib/utils/iterate-stream.js`, which
paused the stream around each `yield`. Sources like unzipper's entry stream keep
working while paused and emit `end` once their input is exhausted, so any entry
not yet delivered was dropped silently. The reader's own workaround — writing
the early worksheet to a temp file — was itself the delay that triggered the
loss, so the mechanism meant to fix the ordering caused the bug.

The failure is timing-dependent, which is why it reproduced on macOS and Windows
but not on Linux, where the write usually won the race. A 5 ms delay in the
consumer was enough to reproduce it anywhere.

Fix: do not pause the stream around the yield. Verified with the existing
`spec/integration/issues/issue-1328-xlsx-worksheet-reader-date.spec.js`, red
before and green after. Two further integration failures in the same area
disappeared with it. Peak heap over a 200,000-row read was unchanged
(82 MB before, 80 MB after).

### Changed

#### uuid is no longer a dependency

The library asked `uuid` for one thing: a version 4 value for the `x14Id`
attribute of a conditional formatting extension, requested with no arguments.
That identifier has to be unique inside a workbook; it is not a security token.

`uuid@8` carries GHSA-w5hq-g745-h8pq, which cannot be reached from here — it
requires a caller-supplied buffer — but it surfaced in every consumer audit.
Upgrading was not available either: from 11.1.1 onwards `uuid` ships ES2021
syntax that the browser build cannot process, and 12.0.0 drops CommonJS.

`lib/utils/uuid.js` now generates the value directly, preferring
`crypto.randomUUID` and otherwise assembling it from 16 random bytes per
RFC 4122. Generated identifiers keep the same shape, so files are unchanged.
`npm audit --omit=dev` is clean and the production dependency count drops from
eight to seven.

### Project

- Renamed the package to `exceljs-community` and pointed repository metadata at
  the new home. Upstream history, MIT licence and original author attribution
  are preserved.
- Split the 205 KB README: the API reference moved to `docs/api.md`, the upstream
  changelog to `docs/history-upstream.md`. The new README covers what the project
  is and what is promised of it.
- `grunt build` now fails when minification fails. `grunt-terser` logged the
  error and carried on, leaving the previous `dist/*.min.js` in place and the
  build green — and `package.json` points browser consumers at that file. The
  gruntfile drives `terser` itself now, on version 5.

## Not planned for 4.5.0

- **`minimatch` (upstream exceljs#3024).** The npm advisory covers
  `minimatch <=3.1.3`; the production dependency tree resolves `3.1.5` and
  `5.1.9`, which are not affected. The report originated from `pnpm audit`,
  which applies a wider range. Nothing to fix in the code.
- **`archiver` 5 → 7 (upstream exceljs#2715).** `inflight@1.0.6` is present in
  the production tree, but npm assigns it no advisory — it is a memory leak and
  a maintenance burden, not a vulnerability. Deferred to 4.6.0, where it will be
  described as such.
