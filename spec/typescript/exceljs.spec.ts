import 'regenerator-runtime/runtime';

import { expect } from 'chai';
import { PassThrough } from 'stream';
import ExcelJS from '../../index';

describe('typescript', () => {
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
