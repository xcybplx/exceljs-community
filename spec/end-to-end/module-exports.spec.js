const {execFileSync} = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '../..');
// eslint-disable-next-line import/no-dynamic-require
const {name: PACKAGE} = require(path.join(ROOT, 'package.json'));

// These check how the package resolves when required or imported by its name,
// which is the one thing verquire cannot do: it loads files by path and so
// skips the package.json entry points and exports map entirely. Every failure
// here is invisible to the rest of the suite and shows up only in a consumer's
// build — which is how exceljs#1328's neighbour, the interop gap, reached
// production undetected.

const consumers = [];

function consumer(type) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'exceljs-module-'));
  consumers.push(dir);
  fs.mkdirSync(path.join(dir, 'node_modules'), {recursive: true});
  fs.symlinkSync(ROOT, path.join(dir, 'node_modules', PACKAGE), 'dir');
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({name: 'consumer', version: '1.0.0', type})
  );
  return dir;
}

function run(dir, filename, source) {
  const file = path.join(dir, filename);
  fs.writeFileSync(file, source);
  return execFileSync(process.execPath, [file], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

describe('module exports', () => {
  after(() => {
    consumers.forEach(dir => fs.rmSync(dir, {recursive: true, force: true}));
  });

  describe('from CommonJS', () => {
    let dir;
    before(() => {
      dir = consumer('commonjs');
    });

    it('exposes Workbook on require', () => {
      const out = run(
        dir,
        'require.js',
        `console.log(typeof require('${PACKAGE}').Workbook);`
      );
      expect(out).to.equal('function');
    });

    it('exposes the enums on require', () => {
      const out = run(
        dir,
        'enums.js',
        `console.log(typeof require('${PACKAGE}').ValueType);`
      );
      expect(out).to.equal('object');
    });

    it('keeps deep requires working', () => {
      const out = run(
        dir,
        'deep.js',
        `console.log(typeof require('${PACKAGE}/lib/doc/workbook'));`
      );
      expect(out).to.equal('function');
    });

    it('keeps deep requires working with the extension spelled out', () => {
      const out = run(
        dir,
        'deep-ext.js',
        `console.log(typeof require('${PACKAGE}/lib/doc/workbook.js'));`
      );
      expect(out).to.equal('function');
    });

    // docs/api.md documents this path for older node versions, so it is public
    // API whether or not anyone remembers deciding that. Needs a build.
    it('keeps the documented dist/es5 entry working', () => {
      const out = run(
        dir,
        'es5.js',
        `console.log(typeof require('${PACKAGE}/dist/es5').Workbook);`
      );
      expect(out).to.equal('function');
    });
  });

  describe('from ES modules', () => {
    let dir;
    before(() => {
      dir = consumer('module');
    });

    it('exposes Workbook as a named export', () => {
      const out = run(
        dir,
        'named.js',
        `import {Workbook} from '${PACKAGE}';\nconsole.log(typeof Workbook);`
      );
      expect(out).to.equal('function');
    });

    it('exposes the enums as named exports', () => {
      const out = run(
        dir,
        'named-enums.js',
        `import {ValueType} from '${PACKAGE}';\nconsole.log(typeof ValueType);`
      );
      expect(out).to.equal('object');
    });

    it('exposes Workbook on the default export', () => {
      const out = run(
        dir,
        'default.js',
        `import ExcelJS from '${PACKAGE}';\nconsole.log(typeof ExcelJS.Workbook);`
      );
      expect(out).to.equal('function');
    });

    it('exposes Workbook through a dynamic import', () => {
      const out = run(
        dir,
        'dynamic.js',
        `const {Workbook} = await import('${PACKAGE}');\nconsole.log(typeof Workbook);`
      );
      expect(out).to.equal('function');
    });

    // index.mjs lists its exports by hand, because that is the only form a
    // resolver can read without guessing. A hand-written list rots, so this
    // fails the moment the CommonJS entry gains or loses anything.
    it('exports exactly what the CommonJS entry has', () => {
      const out = run(
        dir,
        'parity.js',
        `
          import {createRequire} from 'module';
          const ns = await import('${PACKAGE}');
          const cjs = createRequire(import.meta.url)('${PACKAGE}');
          const named = Object.keys(ns).filter(k => k !== 'default').sort();
          const have = Object.keys(cjs).sort();
          console.log(
            JSON.stringify(named) === JSON.stringify(have)
              ? 'same'
              : 'esm=' + named + ' cjs=' + have
          );
        `
      );
      expect(out).to.equal('same');
    });

    // ESM requires the extension for a file inside a package; that has always
    // been true here and is not something an exports map should paper over.
    // What matters is that adding one does not cut the path off entirely.
    it('keeps deep imports working', () => {
      const out = run(
        dir,
        'deep.js',
        `const wb = await import('${PACKAGE}/lib/doc/workbook.js');\nconsole.log(typeof wb.default);`
      );
      expect(out).to.equal('function');
    });
  });

  // index.d.ts is the third artifact that has to agree with the other two, and
  // it agreed with neither: it declared Anchor, config and PaperSize as values
  // the runtime has never had. `import {Anchor}` type-checked and arrived
  // undefined — the mismatch 4.6.0 fixed, running the other way.
  describe('from the type declarations', () => {
    let dir;
    before(() => {
      dir = consumer('commonjs');
    });

    // The compiler decides which names are values, rather than a pattern
    // reading the file, because the distinction that matters is not in the
    // text: `namespace stream` holds classes and is a value, `namespace config`
    // held a function and was one too, and the hundred `interface` declarations
    // around them are not. A regexp over `export` lines cannot see any of that.
    //
    // A `const enum` counts as a value here on purpose. TypeScript erases it,
    // so it can never reach the runtime, and a consumer compiling with
    // isolatedModules — which is every consumer on esbuild, Vite or Angular —
    // cannot even read one out of a published .d.ts. Failing is the point.
    it('promise exactly what the CommonJS entry has', () => {
      // TypeScript 7 is ESM-only and offers none of the compiler API to
      // require, so a bump past 6 turns this check into a TypeError about
      // undefined three lines down. Say which version broke it instead.
      if (typeof ts.createProgram !== 'function') {
        throw new Error(
          `typescript ${ts.version} exposes no compiler API to require; ` +
            'this check needs one to tell a declared value from a declared type'
        );
      }

      const declarations = path.join(ROOT, 'index.d.ts');
      const program = ts.createProgram([declarations], {
        target: ts.ScriptTarget.ES2017,
      });
      const checker = program.getTypeChecker();
      const module_ = checker.getSymbolAtLocation(
        program.getSourceFile(declarations)
      );
      const declared = checker
        .getExportsOfModule(module_)
        // SymbolFlags is a bit field; masking is how the compiler is asked.
        // eslint-disable-next-line no-bitwise
        .filter(symbol => (symbol.getFlags() & ts.SymbolFlags.Value) !== 0)
        .map(symbol => symbol.getName())
        // `export default` names the runtime object itself, and module.exports
        // is that object; there is no key for it to line up with.
        .filter(name => name !== 'default')
        .sort();

      const out = run(
        dir,
        'keys.js',
        `console.log(Object.keys(require('${PACKAGE}')).sort().join(','));`
      );

      expect(declared.join(',')).to.equal(out);
    });
  });
});
