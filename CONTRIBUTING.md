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

Node 18 or newer. The build (grunt + browserify + Babel) is known to work on
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

## Pull requests

- Describe what breaks, and how the test demonstrates it.
- Don't change the package version — that happens at release time.
- If you are porting a fix reported elsewhere, say where. Diagnoses get credited.
- All contributions are released under the project's MIT licence.
