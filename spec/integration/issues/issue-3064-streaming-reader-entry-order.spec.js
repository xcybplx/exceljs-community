const {PassThrough} = require('stream');

const ExcelJS = verquire('exceljs');

// The reader parses every part of the archive from one streaming pass, and the
// writer stores xl/workbook.xml last. Until 4.5.0, iterate-stream paused the
// stream around every yield; unzipper keeps working while paused and emits
// 'end' regardless, so whatever it had not yet delivered was dropped. The entry
// lost was usually the workbook, leaving this.model undefined and making
// _parseWorksheet throw on this.model.sheets.
//
// It is a race, so one read proves nothing. Upstream 4.4.0 fails every read of
// this workbook here, but the count is what makes the test honest rather than
// lucky. See lib/utils/iterate-stream.js and the issue 1328 spec next door,
// which covers the same fix from the row-data side.
const SHEETS = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
const READS = 10;

describe('github issues: streaming reader and archive entry order', () => {
  let buffer;

  before(async () => {
    const workbook = new ExcelJS.Workbook();
    SHEETS.forEach((name, i) => workbook.addWorksheet(name).addRow([`a${i}`]));
    buffer = await workbook.xlsx.writeBuffer();
  });

  it('issue 3064 - reads every worksheet on every pass', async function() {
    this.timeout(30000);

    const seen = [];
    for (let i = 0; i < READS; i += 1) {
      const stream = new PassThrough();
      stream.end(Buffer.from(buffer));
      const reader = new ExcelJS.stream.xlsx.WorkbookReader(stream, {});

      const names = [];
      // eslint-disable-next-line no-await-in-loop
      for await (const worksheet of reader) {
        names.push(worksheet.name);
        // Draining the rows is what makes the consumer await between entries,
        // which is the condition the dropped-entry bug needed.
        // eslint-disable-next-line no-await-in-loop
        for await (const row of worksheet) {
          expect(row.values).to.not.be.undefined();
        }
      }
      seen.push(names);
    }

    expect(seen).to.deep.equal(new Array(READS).fill(SHEETS));
  });
});
