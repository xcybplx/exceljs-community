# Contributing

Bug reports without a fix are welcome. A failing test that demonstrates a problem
is a genuinely useful contribution: it can be picked up by someone else.

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

Run the suites individually rather than `npm test`, as the combined script stops at
the first failure and tells you nothing about the rest:

```shell
npm run test:unit          # 888 tests
npm run test:integration   # 195 tests
npm run test:end-to-end    # 12 tests
npm run test:typescript    # 3 tests
```

**Everything passes on a clean checkout.** If something fails for you, it is
either your change or your environment. It is not a known defect being lived
with. Earlier versions of this file listed four inherited failures in the
streaming reader and the TypeScript suite; all of them were fixed in 4.5.0 and
the list was stale, not accurate.

Also run `npm run build && npm run test:size` if you touch anything that reaches
the browser bundle. Functional tests pass at any bundle size, so they cannot
catch a size regression; see the section below for which dependencies that
applies to.

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
- Don't change the package version; that happens at release time.
- If you are porting a fix reported elsewhere, say where. Diagnoses get credited.
- All contributions are released under the project's MIT licence.
