# Contributing

Bug reports without a fix are welcome. A failing test that demonstrates a problem
is a genuinely useful contribution — it can be picked up by someone else.

## The one firm rule

**Every fix ships with a regression test** that fails before the change and
passes after it. This library writes binary files that other software has to
open; "works on my machine" is not evidence that it does.

## Getting set up

```shell
npm install
npm run build
```

Node 22.12 or newer. The floor is not arbitrary: archiver 8 is ESM-only and the
streaming writer reaches it from CommonJS through `require(esm)`, which Node
gained in 22.12. The build (grunt + browserify + Babel) is known to work on
Node 26.

## Running the tests

Run the suites individually rather than `npm test` — the combined script stops at
the first failure and tells you nothing about the rest:

```shell
npm run test:unit          # 883 tests, all passing
npm run test:integration   # see known failures below
npm run test:end-to-end
npm run test:typescript
```

### Known failures, inherited from 4.4.0

These fail on a clean checkout and are **not** caused by your change:

| Suite | Test | Area |
|---|---|---|
| integration | `issue 1328 – should emit row with Date Object` | streaming reader returns unresolved `sharedString` references |
| integration | `pull request 1431 – streaming reader should handle rich text within shared strings` | same |
| integration | `WorkbookReader` | same |
| typescript | `can create and stream xlsx` | the test itself calls the deprecated `XLSX#createInputStream`, which throws |

If your change makes any of these behave differently — including making them
pass — say so in the pull request. It may be a real fix, but it needs explaining
rather than assuming.

Browser tests (`test:jasmine`, `test:browser`) need Chromium via Puppeteer, whose
install script npm 11 does not run by default. They are not required for most
contributions.

## Dependencies that cannot move yet

Two production dependencies are deliberately held back, and both are held back
by browserify rather than by anything in this package. Please don't "helpfully"
bump them.

**`fast-csv` stays on 4.** browserify parses with acorn 7, which understands
ES2020 and no more. That ceiling cannot be lifted by upgrading: browserify 17,
module-deps 6.2.3 and detective 5.2.1 are all the newest releases that exist and
the chain still ends at `acorn@^7`. `@fast-csv/format` 5 uses class fields, so
16 of its 24 files fail to parse.

**`readable-stream` stays on 3.** This one is not syntax but deduplication. The
`overrides` block pins `browserify-sign` and `hash-base` to their last releases
on the readable-stream 3.x line precisely so they share our copy. Moving our own
dependency to 4 leaves them behind and the bundle then carries three stream
implementations instead of two: measured at 294,072 bytes gzip against 263,892,
which would undo the 4.6.1 reduction and then some. Forcing the whole tree onto
4 with an override is not a way out either -- it removes 76 packages and takes
browserify itself with it, so the build stops running at all.

Both unblock the same way, by replacing browserify with a bundler that parses
current syntax. Until then the size budget in `scripts/check-bundle-size.js` is
what stops these from landing by accident.

## Pull requests

- Describe what breaks, and how the test demonstrates it.
- Don't change the package version — that happens at release time.
- If you are porting a fix reported elsewhere, say where. Diagnoses get credited.
- All contributions are released under the project's MIT licence.
