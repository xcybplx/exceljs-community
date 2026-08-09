const express = require('express');
const got = require('got');
const testutils = require('../utils/index');

const Excel = verquire('exceljs');

describe('Express', () => {
  let server;
  before(() => {
    const app = express();
    app.get('/workbook', (req, res) => {
      const wb = testutils.createTestBook(new Excel.Workbook(), 'xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx');
      wb.xlsx.write(res).then(() => {
        res.end();
      });
    });
    server = app.listen(3003);
  });

  after(() => {
    server.close();
  });

  it('downloads a workbook', async function() {
    this.timeout(5000);
    const res = got.stream('http://127.0.0.1:3003/workbook', {
      decompress: false,
    });
    const wb2 = new Excel.Workbook();
    await wb2.xlsx.read(res);
    testutils.checkTestBook(wb2, 'xlsx');
  });
});
