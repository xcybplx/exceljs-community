import 'regenerator-runtime/runtime';

import { expect } from 'chai';
import { PassThrough } from 'stream';
// Resolved the way a consumer resolves it: types through the package's `types`
// entry, runtime through `main`. Importing ../../index instead would have
// pointed at a source file no consumer ever loads.
import ExcelJS, { Workbook, ValueType } from '../..';

describe('typescript', () => {
  it('can be imported by name', () => {
    const wb = new Workbook();
    const ws = wb.addWorksheet('blort');
    ws.getCell('A1').value = 7;
    expect(ws.getCell('A1').type).to.equal(ValueType.Number);
    expect(new ExcelJS.Workbook()).to.be.instanceOf(Workbook);
  });

  it('can create and buffer xlsx', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('blort');
    ws.getCell('A1').value = 7;
    const buffer = await wb.xlsx.writeBuffer({
      useStyles: true,
      useSharedStrings: true,
    });

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('blort');
    expect(ws2.getCell('A1').value).to.equal(7);
  });
  it('can create and stream xlsx', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('blort');
    ws.getCell('A1').value = 7;

    // createInputStream() has thrown a deprecation error since 4.0; read()
    // is its replacement. See UPGRADE-4.0.md.
    const stream = new PassThrough();
    await wb.xlsx.write(stream);
    stream.end();

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.read(stream);
    const ws2 = wb2.getWorksheet('blort');
    expect(ws2.getCell('A1').value).to.equal(7);
  });
});
