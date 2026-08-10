'use strict';

const fs = require('fs');
const zlib = require('zlib');

// Ceilings for the files package.json points "browser" at. They exist because
// a bundle regression passes every functional test: 4.6.0 shipped a browser
// bundle 19 KB gzip heavier than exceljs 4.4.0, and nothing in the suite
// noticed. The cause was two transitive dependencies moving back to
// readable-stream 2, which stopped them deduplicating against the top-level
// copy -- see the overrides block in package.json.
//
// Headroom over the measured size is about 2%. Raising a number here is a
// legitimate thing to do; doing it without saying why in the commit message
// is not.
//
// The gzip figure is not machine-independent: it comes from whatever zlib the
// running Node was built against, so the same bytes measure differently across
// versions. dist/exceljs.min.js came to 263,883 bytes on Node 26 and 264,624 on
// Node 20 while the raw size was identical at 971,502. Changing the Node
// version in the bundle-size CI job therefore moves this number on its own, and
// can trip a tight ceiling with no real regression behind it. The raw size is
// the machine-independent one, and it is the one that demonstrates the build is
// reproducible.
const BUDGETS = [
  {file: 'dist/exceljs.min.js', raw: 990000, gzip: 269000},
  {file: 'dist/exceljs.bare.min.js', raw: 901000, gzip: 247500},
];

function format(bytes) {
  return bytes.toLocaleString('en-US');
}

function check(budget) {
  if (!fs.existsSync(budget.file)) {
    console.warn(`MISSING ${budget.file} -- run \`npm run build\` first`);
    return false;
  }

  const contents = fs.readFileSync(budget.file);
  const raw = contents.length;
  const gzip = zlib.gzipSync(contents, {level: 9}).length;

  const failures = [
    ['raw', raw, budget.raw],
    ['gzip', gzip, budget.gzip],
  ].filter(([, actual, ceiling]) => actual > ceiling);

  const verdict = failures.length ? 'OVER' : 'ok';
  console.warn(
    `${verdict.padEnd(5)} ${budget.file}  raw ${format(raw)} / ${format(
      budget.raw
    )}  gzip ${format(gzip)} / ${format(budget.gzip)}`
  );

  failures.forEach(([label, actual, ceiling]) => {
    console.warn(`      ${label} exceeds budget by ${format(actual - ceiling)} bytes`);
  });

  return failures.length === 0;
}

const passed = BUDGETS.map(check).every(Boolean);

if (!passed) {
  console.warn('');
  console.warn('Bundle size budget exceeded. Either find what grew, or raise');
  console.warn('the budget in scripts/check-bundle-size.js and say why.');
  process.exitCode = 1;
}
