# exceljs-community

Read, manipulate and write spreadsheet data and styles to XLSX and JSON.

A maintained continuation of [exceljs](https://github.com/exceljs/exceljs), which
has received no commits since January 2024 and no release since 4.4.0 in October
2023. This package picks up where 4.4.0 left off, as a drop-in replacement.

```sh
npm install exceljs-community
```

Changes since 4.4.0 are listed in [CHANGELOG.md](CHANGELOG.md), with the
reasoning behind each in [FORK.md](FORK.md).

## Why this fork exists

The upstream project accumulated 650+ open issues and 140+ open pull requests
with no maintainer to act on them. Several forks appeared — by MUI, protobi,
nuvo, DevExtreme and others — but each was created to solve its owner's specific
problems, and their maintainers
[stated publicly](https://github.com/exceljs/exceljs/issues/2764) that they did
not intend to take over maintenance of the library itself.

What was missing was not another set of patches. It was someone willing to say
the fork is permanent, and to say so in a way you can hold them to.

## Maintenance commitment

These promises are deliberately small, so that they hold even in a bad month:

1. **Security releases within 30 days** of a disclosed vulnerability in a
   production dependency.
2. **A response to new issues within 14 days.** A response is not a fix — it may
   be a question, a triage label, or an honest "not soon".
3. **No promises about features or bug-fix timelines.** Anything beyond the two
   points above happens when it happens.
4. **If maintenance stops, it will be announced.** Should this project become
   unmaintainable, that will be stated publicly in this README and in the issue
   tracker, along with an attempt to hand the repository to someone else.

The fourth point matters most. Upstream was not killed by a maintainer stepping
away — that is normal and nobody's fault. It was killed by the silence that
followed, which left users guessing for two years.

## Compatibility

The public API is identical to `exceljs@4.4.0`. Migration is one line in
`package.json`, with no changes to your code:

```diff
- "exceljs": "^4.4.0"
+ "exceljs-community": "^5.0.0"
```

**5.0.0 requires Node 22.12 or newer.** That is the only reason for the major
version; nothing in the API changed. If you are on an older Node, `^4.6.1`
remains available and is a drop-in replacement for `exceljs@4.4.0` down to
Node 14.14.

```js
const ExcelJS = require('exceljs-community');
// or
import ExcelJS from 'exceljs-community';
// or, since 4.6.0
import {Workbook, ValueType} from 'exceljs-community';
```

Named imports are new in 4.6.0. Before it, `index.d.ts` declared them and the
package did not deliver them, so TypeScript accepted `import {Workbook}` and the
built application got `undefined` — a mismatch that only appeared once bundled.
Deep imports such as `exceljs-community/lib/doc/workbook` and the documented
`exceljs-community/dist/es5` path keep working unchanged.

No breaking change to the API is planned. 5.0.0 raised the Node requirement and
changed nothing you call; any future major will exist for the same kind of
reason, and will say so in the same place.

### What the browser bundle does not have

`dist/exceljs.min.js` carries `Workbook` and the enums. `ModelContainer` and the
whole `stream` namespace are missing from it, because the streaming reader and
writer are built on Node streams and a Node zip library. `index.d.ts` describes
one package rather than one per environment, so it declares both — in the
browser they are `undefined`, and this has been true since long before the fork.

Nothing else differs: `Workbook`, `xlsx.load`, `xlsx.writeBuffer`, `csv` and
every enum behave the same on either entry.

### Test runners that resolve Node conditions

The `exports` map sends a bundler to `dist/exceljs.min.js` through the `browser`
condition and Node to `excel.js` through `require`. A test runner is neither:
Vitest and Jest resolve Node conditions even with `environment: 'jsdom'`, so a
test covering browser code takes the Node entry, reaches the streaming writer,
and lands on `archiver@8` — ESM-only since 5.0.0, and shipped inside a CommonJS
package:

```
SyntaxError: Cannot use import statement outside a module
 ❯ exceljs-community/lib/stream/xlsx/workbook-writer.js
```

The file fails while importing, so the runner reports no tests rather than a
failed one, which reads like a mistake in your own code. Point the runner at the
bundle the browser would have got anyway:

```ts
// vitest.config.ts
resolve: {alias: {'exceljs-community': 'exceljs-community/dist/exceljs.min.js'}}
```

`test.server.deps.inline: ['archiver']` — the fix the error message itself
suggests — does not work. Verified on Vitest 4.1.10 with `environment: 'jsdom'`;
the cause is how the resolver picks conditions, not anything specific to that
version, so expect Jest to behave the same way.

### Angular

`allowedCommonJsDependencies` in `angular.json` matches on the package name, and
this package has a different one. An entry left saying `exceljs` still builds,
which is the problem — the warning it was there to silence comes back, and
nothing fails:

```
▲ [WARNING] Module 'exceljs-community' used by '...' is not ESM
```

Nothing about the bundle changes; the allow-list filters diagnostics, not
bundling. What you lose is the warning itself, so the next CommonJS dependency
to enter the build arrives silently.

Rename the entry as part of the migration.

## Documentation

The full API reference lives in [docs/api.md](docs/api.md). It is inherited from
upstream and **has not yet been verified** against the current code — sections
are reviewed as the areas they describe are worked on. If something there
contradicts what you observe, that is worth an issue.

[docs/model.md](docs/model.md) describes the plain object model behind a
workbook, which is worth reading before manipulating one directly.
[docs/upgrade-4.0.md](docs/upgrade-4.0.md) is the migration guide from the 3.x
line, still accurate for anyone arriving from an old version.

Changes made here are listed in [CHANGELOG.md](CHANGELOG.md); the upstream
changelog up to 4.4.0 is archived in
[docs/history-upstream.md](docs/history-upstream.md).

## Contributing

Contributions are welcome, including bug reports with no fix attached — a
failing test that demonstrates a problem is a genuinely useful contribution.

One firm rule: **every fix ships with a regression test** that fails before the
change and passes after it. This library writes binary files, so "works on my
machine" is not evidence.

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to run the test suites.

## Credits

This library was created by [Guyon Roche](https://github.com/guyonroche) and
developed by many contributors over the years; their work is recorded in
[docs/history-upstream.md](docs/history-upstream.md) and in the commit history,
which is preserved here in full.

## License

MIT — unchanged from upstream. See [LICENSE](LICENSE).
