const JSZip = require('jszip');

const ExcelJS = verquire('exceljs');

// CT_Worksheet is a sequence, and <legacyDrawing>, which anchors the VML shapes
// behind notes, must come directly after <drawing>: before <picture>,
// <tableParts> and <extLst>. The writer appended it after everything else, so
// a sheet with both a table and a note was out of schema order and Excel
// refused it, repairing the sheet down to nothing. The fix is upstream PR 2079.
describe('github issues', () => {
  it('issue 1369 - note in a sheet with a table', async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Test');
    worksheet.addTable({
      name: 'Table1',
      ref: 'A1',
      headerRow: true,
      columns: [{name: 'Foo'}, {name: 'Bar'}],
      rows: [
        ['foo', 'bar'],
        ['foo', 'bar'],
      ],
    });
    worksheet.getCell('B2').note = 'Test Note';

    const zip = await JSZip.loadAsync(await workbook.xlsx.writeBuffer());
    const xml = await zip.file('xl/worksheets/sheet1.xml').async('string');

    const tail = xml.match(/<(drawing|legacyDrawing|picture|tableParts|extLst)\b/g).map(tag => tag.slice(1));
    expect(tail).to.deep.equal(['legacyDrawing', 'tableParts']);
  });
});
