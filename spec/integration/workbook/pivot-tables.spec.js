// *Note*: `fs.promises` not supported before Node.js 11.14.0;
// ExcelJS version range '>=8.3.0' (as of 2023-10-08).
const fs = require('fs');
const {promisify} = require('util');

const fsReadFileAsync = promisify(fs.readFile);

const JSZip = require('jszip');
const {SaxesParser} = require('saxes');

const ExcelJS = verquire('exceljs');

const PIVOT_TABLE_FILEPATHS = [
  'xl/pivotCache/pivotCacheRecords1.xml',
  'xl/pivotCache/pivotCacheDefinition1.xml',
  'xl/pivotCache/_rels/pivotCacheDefinition1.xml.rels',
  'xl/pivotTables/pivotTable1.xml',
  'xl/pivotTables/_rels/pivotTable1.xml.rels',
];

const TEST_XLSX_FILEPATH = './spec/out/wb.test.xlsx';

const TEST_DATA = [
  ['A', 'B', 'C', 'D', 'E'],
  ['a1', 'b1', 'c1', 4, 5],
  ['a1', 'b2', 'c1', 4, 5],
  ['a2', 'b1', 'c2', 14, 24],
  ['a2', 'b2', 'c2', 24, 35],
  ['a3', 'b1', 'c3', 34, 45],
  ['a3', 'b2', 'c3', 44, 45],
];

// =============================================================================
// Tests

describe('Workbook', () => {
  describe('Pivot Tables', () => {
    it('if pivot table added, then certain xml and rels files are added', async () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      worksheet2.addPivotTable({
        sourceSheet: worksheet1,
        rows: ['A', 'B'],
        columns: ['C'],
        values: ['E'],
        metric: 'sum',
      });

      return workbook.xlsx.writeFile(TEST_XLSX_FILEPATH).then(async () => {
        const buffer = await fsReadFileAsync(TEST_XLSX_FILEPATH);
        const zip = await JSZip.loadAsync(buffer);
        for (const filepath of PIVOT_TABLE_FILEPATHS) {
          expect(zip.files[filepath]).to.not.be.undefined();
        }
      });
    });

    it('escapes header names and values that contain XML special characters', async () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows([
        ['A & B', 'C<D', 'E "F"', 'Note'],
        ['x < y', 'c "1"', 5, 'Tom & Jerry'],
        ['x > y', 'c "1"', 7, '<b>'],
      ]);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      worksheet2.addPivotTable({
        sourceSheet: worksheet1,
        rows: ['A & B'],
        columns: ['C<D'],
        values: ['E "F"'],
        metric: 'sum',
      });

      const zip = await JSZip.loadAsync(await workbook.xlsx.writeBuffer());
      const xmlFiles = PIVOT_TABLE_FILEPATHS.filter(f => f.endsWith('1.xml'));
      const xmls = await Promise.all(
        xmlFiles.map(f => zip.file(f).async('string'))
      );
      const attributes = [];
      for (const xml of xmls) {
        const parser = new SaxesParser();
        parser.on('opentag', node =>
          attributes.push(...Object.values(node.attributes))
        );
        parser.write(xml).close();
      }
      expect(attributes).to.include.members([
        'A & B',
        'C<D',
        'E "F"',
        'x < y',
        'x > y',
        'c "1"',
        'Tom & Jerry',
        '<b>',
        'Sum of E "F"',
      ]);
    });

    it('if pivot table NOT added, then certain xml and rels files are not added', () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      workbook.addWorksheet('Sheet2');

      return workbook.xlsx.writeFile(TEST_XLSX_FILEPATH).then(async () => {
        const buffer = await fsReadFileAsync(TEST_XLSX_FILEPATH);
        const zip = await JSZip.loadAsync(buffer);
        for (const filepath of PIVOT_TABLE_FILEPATHS) {
          expect(zip.files[filepath]).to.be.undefined();
        }
      });
    });
  });
});
