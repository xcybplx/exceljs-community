# ExcelJS API reference

> **Inherited documentation.** Carried over from exceljs 4.4.0 and not yet
> verified against the current code. Sections are reviewed as the areas they
> describe are worked on. If anything here contradicts observed behaviour,
> please [open an issue](https://github.com/xcybplx/exceljs-community/issues).

For the upstream changelog, see [history-upstream.md](history-upstream.md).

# Contents

<ul>
  <li><a href="#importing">Importing</a></li>
  <li>
    <a href="#interface">Interface</a>
    <ul>
      <li><a href="#create-a-workbook">Create a Workbook</a></li>
      <li><a href="#set-workbook-properties">Set Workbook Properties</a></li>
      <li><a href="#workbook-views">Workbook Views</a></li>
      <li><a href="#add-a-worksheet">Add a Worksheet</a></li>
      <li><a href="#remove-a-worksheet">Remove a Worksheet</a></li>
      <li><a href="#access-worksheets">Access Worksheets</a></li>
      <li><a href="#worksheet-state">Worksheet State</a></li>
      <li><a href="#worksheet-properties">Worksheet Properties</a></li>
      <li><a href="#page-setup">Page Setup</a></li>
      <li><a href="#headers-and-footers">Headers and Footers</a></li>
      <li>
        <a href="#worksheet-views">Worksheet Views</a>
        <ul>
          <li><a href="#frozen-views">Frozen Views</a></li>
          <li><a href="#split-views">Split Views</a></li>
        </ul>
      </li>
      <li><a href="#auto-filters">Auto Filters</a></li>
      <li><a href="#columns">Columns</a></li>
      <li><a href="#rows">Rows</a>
        <ul>
          <li><a href="#add-rows">Add Rows</a></li>
          <li><a href="#handling-individual-cells">Handling Individual Cells</a></li>
          <li><a href="#merged-cells">Merged Cells</a></li>
          <li><a href="#insert-rows">Insert Rows</a></li>
          <li><a href="#splice">Splice</a></li>
          <li><a href="#duplicate-a-row">Duplicate Row</a></li>
        </ul>
      </li>
      <li><a href="#defined-names">Defined Names</a></li>
      <li><a href="#data-validations">Data Validations</a></li>
      <li><a href="#cell-comments">Cell Comments</a></li>
      <li><a href="#tables">Tables</a></li>
      <li><a href="#styles">Styles</a>
        <ul>
          <li><a href="#number-formats">Number Formats</a></li>
          <li><a href="#fonts">Fonts</a></li>
          <li><a href="#alignment">Alignment</a></li>
          <li><a href="#borders">Borders</a></li>
          <li><a href="#fills">Fills</a></li>
          <li><a href="#rich-text">Rich Text</a></li>
        </ul>
      </li>
      <li><a href="#conditional-formatting">Conditional Formatting</a></li>
      <li><a href="#outline-levels">Outline Levels</a></li>
      <li><a href="#images">Images</a></li>
      <li><a href="#sheet-protection">Sheet Protection</a></li>
      <li><a href="#file-io">File I/O</a>
        <ul>
          <li><a href="#xlsx">XLSX</a>
            <ul>
              <li><a href="#reading-xlsx">Reading XLSX</a></li>
              <li><a href="#writing-xlsx">Writing XLSX</a></li>
            </ul>
          </li>
          <li><a href="#csv">CSV</a>
            <ul>
              <li><a href="#reading-csv">Reading CSV</a></li>
              <li><a href="#writing-csv">Writing CSV</a></li>
            </ul>
          </li>
          <li><a href="#streaming-io">Streaming I/O</a>
            <ul>
              <li><a href="#streaming-xlsx">Streaming XLSX</a></li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li><a href="#browser">Browser</a></li>
  <li>
    <a href="#value-types">Value Types</a>
    <ul>
      <li><a href="#null-value">Null Value</a></li>
      <li><a href="#merge-cell">Merge Cell</a></li>
      <li><a href="#number-value">Number Value</a></li>
      <li><a href="#string-value">String Value</a></li>
      <li><a href="#date-value">Date Value</a></li>
      <li><a href="#hyperlink-value">Hyperlink Value</a></li>
      <li>
        <a href="#formula-value">Formula Value</a>
        <ul>
          <li><a href="#shared-formula">Shared Formula</a></li>
          <li><a href="#formula-type">Formula Type</a></li>
          <li><a href="#array-formula">Array Formula</a></li>
        </ul>
      </li>
      <li><a href="#rich-text-value">Rich Text Value</a></li>
      <li><a href="#boolean-value">Boolean Value</a></li>
      <li><a href="#error-value">Error Value</a></li>
    </ul>
  </li>
  <li><a href="#config">Config</a></li>
  <li><a href="#known-issues">Known Issues</a></li>
  <li><a href="history-upstream.md">Release History (upstream archive)</a></li>
</ul>

# Importing[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
const ExcelJS = require('exceljs');
```

## ES5 Imports[⬆](#contents)<!-- Link generated with jump2header -->

To use the ES5 transpiled code, for example for node.js versions older than 10, use the dist/es5 path.

```javascript
const ExcelJS = require('exceljs/dist/es5');
```

**Note:** The ES5 build has an implicit dependency on a number of polyfills which are no longer
 explicitly added by exceljs.
 You will need to add "core-js" and "regenerator-runtime" to your dependencies and
 include the following requires in your code before the exceljs import:

```javascript
// polyfills required by exceljs
require('core-js/modules/es.promise');
require('core-js/modules/es.string.includes');
require('core-js/modules/es.object.assign');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');

const ExcelJS = require('exceljs/dist/es5');
```

For IE 11, you'll also need a polyfill to support unicode regex patterns. For example,

```js
const rewritePattern = require('regexpu-core');
const {generateRegexpuOptions} = require('@babel/helper-create-regexp-features-plugin/lib/util');

const {RegExp} = global;
try {
  new RegExp('a', 'u');
} catch (err) {
  global.RegExp = function(pattern, flags) {
    if (flags && flags.includes('u')) {
      return new RegExp(rewritePattern(pattern, flags, generateRegexpuOptions({flags, pattern})));
    }
    return new RegExp(pattern, flags);
  };
  global.RegExp.prototype = RegExp.prototype;
}
```

## Browserify[⬆](#contents)<!-- Link generated with jump2header -->

ExcelJS publishes two browserified bundles inside the dist/ folder:

One with implicit dependencies on core-js polyfills...
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.js"></script>
<script src="exceljs.js"></script>
```

And one without...
```html
<script src="--your-project's-pollyfills-here--"></script>
<script src="exceljs.bare.js"></script>
```


# Interface[⬆](#contents)<!-- Link generated with jump2header -->

## Create a Workbook[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
const workbook = new ExcelJS.Workbook();
```

## Set Workbook Properties[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
workbook.creator = 'Me';
workbook.lastModifiedBy = 'Her';
workbook.created = new Date(1985, 8, 30);
workbook.modified = new Date();
workbook.lastPrinted = new Date(2016, 9, 27);
```

```javascript
// Set workbook dates to 1904 date system
workbook.properties.date1904 = true;
```

## Set Calculation Properties[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// Force workbook calculation on load
workbook.calcProperties.fullCalcOnLoad = true;
```

## Workbook Views[⬆](#contents)<!-- Link generated with jump2header -->

The Workbook views controls how many separate windows Excel will open when viewing the workbook.

```javascript
workbook.views = [
  {
    x: 0, y: 0, width: 10000, height: 20000,
    firstSheet: 0, activeTab: 1, visibility: 'visible'
  }
]
```

## Add a Worksheet[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
const sheet = workbook.addWorksheet('My Sheet');
```

Use the second parameter of the addWorksheet function to specify options for the worksheet.

For Example:

```javascript
// create a sheet with red tab colour
const sheet = workbook.addWorksheet('My Sheet', {properties:{tabColor:{argb:'FFC0000'}}});

// create a sheet where the grid lines are hidden
const sheet = workbook.addWorksheet('My Sheet', {views: [{showGridLines: false}]});

// create a sheet with the first row and column frozen
const sheet = workbook.addWorksheet('My Sheet', {views:[{state: 'frozen', xSplit: 1, ySplit:1}]});

// Create worksheets with headers and footers
const sheet = workbook.addWorksheet('My Sheet', {
  headerFooter:{firstHeader: "Hello Exceljs", firstFooter: "Hello World"}
});

// create new sheet with pageSetup settings for A4 - landscape
const worksheet =  workbook.addWorksheet('My Sheet', {
  pageSetup:{paperSize: 9, orientation:'landscape'}
});
```

## Remove a Worksheet[⬆](#contents)<!-- Link generated with jump2header -->

Use the worksheet `id` to remove the sheet from workbook.

For Example:

```javascript
// Create a worksheet
const sheet = workbook.addWorksheet('My Sheet');

// Remove the worksheet using worksheet id
workbook.removeWorksheet(sheet.id)
```

## Access Worksheets[⬆](#contents)<!-- Link generated with jump2header -->
```javascript
// Iterate over all sheets
// Note: workbook.worksheets.forEach will still work but this is better
workbook.eachSheet(function(worksheet, sheetId) {
  // ...
});

// fetch sheet by name
const worksheet = workbook.getWorksheet('My Sheet');

// fetch sheet by id
// INFO: Be careful when using it!
// It tries to access to `worksheet.id` field. Sometimes (really very often) workbook has worksheets with id not starting from 1.
// For instance It happens when any worksheet has been deleted.
// It's much more safety when you assume that ids are random. And stop to use this function.
// If you need to access all worksheets in a loop please look to the next example.
const worksheet = workbook.getWorksheet(1);

// access by `worksheets` array:
workbook.worksheets[0]; //the first one;

```

It's important to know that `workbook.getWorksheet(1) != Workbook.worksheets[0]` and `workbook.getWorksheet(1) != Workbook.worksheets[1]`,
because `workbook.worksheets[0].id` may have any value.

## Worksheet State[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// make worksheet visible
worksheet.state = 'visible';

// make worksheet hidden
worksheet.state = 'hidden';

// make worksheet hidden from 'hide/unhide' dialog
worksheet.state = 'veryHidden';
```

## Worksheet Properties[⬆](#contents)<!-- Link generated with jump2header -->

Worksheets support a property bucket to allow control over some features of the worksheet.

```javascript
// create new sheet with properties
const worksheet = workbook.addWorksheet('sheet', {properties:{tabColor:{argb:'FF00FF00'}}});

// create a new sheet writer with properties
const worksheetWriter = workbookWriter.addWorksheet('sheet', {properties:{outlineLevelCol:1}});

// adjust properties afterwards (not supported by worksheet-writer)
worksheet.properties.outlineLevelCol = 2;
worksheet.properties.defaultRowHeight = 15;
```

**Supported Properties**

| Name             | Default    | Description |
| ---------------- | ---------- | ----------- |
| tabColor         | undefined  | Color of the tabs |
| outlineLevelCol  | 0          | The worksheet column outline level |
| outlineLevelRow  | 0          | The worksheet row outline level |
| defaultRowHeight | 15         | Default row height |
| defaultColWidth  | (optional) | Default column width |
| dyDescent        | 55         | TBD |

### Worksheet Metrics[⬆](#contents)<!-- Link generated with jump2header -->

Some new metrics have been added to Worksheet...

| Name              | Description |
| ----------------- | ----------- |
| rowCount          | The total row size of the document. Equal to the row number of the last row that has values. |
| actualRowCount    | A count of the number of rows that have values. If a mid-document row is empty, it will not be included in the count. |
| columnCount       | The total column size of the document. Equal to the maximum cell count from all of the rows |
| actualColumnCount | A count of the number of columns that have values. |


## Page Setup[⬆](#contents)<!-- Link generated with jump2header -->

All properties that can affect the printing of a sheet are held in a pageSetup object on the sheet.

```javascript
// create new sheet with pageSetup settings for A4 - landscape
const worksheet =  workbook.addWorksheet('sheet', {
  pageSetup:{paperSize: 9, orientation:'landscape'}
});

// create a new sheet writer with pageSetup settings for fit-to-page
const worksheetWriter = workbookWriter.addWorksheet('sheet', {
  pageSetup:{fitToPage: true, fitToHeight: 5, fitToWidth: 7}
});

// adjust pageSetup settings afterwards
worksheet.pageSetup.margins = {
  left: 0.7, right: 0.7,
  top: 0.75, bottom: 0.75,
  header: 0.3, footer: 0.3
};

// Set Print Area for a sheet
worksheet.pageSetup.printArea = 'A1:G20';

// Set multiple Print Areas by separating print areas with '&&'
worksheet.pageSetup.printArea = 'A1:G10&&A11:G20';

// Repeat specific rows on every printed page
worksheet.pageSetup.printTitlesRow = '1:3';

// Repeat specific columns on every printed page
worksheet.pageSetup.printTitlesColumn = 'A:C';
```

**Supported pageSetup settings**

| Name                  | Default       | Description |
| --------------------- | ------------- | ----------- |
| margins               |               | Whitespace on the borders of the page. Units are inches. |
| orientation           | 'portrait'    | Orientation of the page - i.e. taller (portrait) or wider (landscape) |
| horizontalDpi         | 4294967295    | Horizontal Dots per Inch. Default value is -1 |
| verticalDpi           | 4294967295    | Vertical Dots per Inch. Default value is -1 |
| fitToPage             |               | Whether to use fitToWidth and fitToHeight or scale settings. Default is based on presence of these settings in the pageSetup object - if both are present, scale wins (i.e. default will be false) |
| pageOrder             | 'downThenOver'| Which order to print the pages - one of ['downThenOver', 'overThenDown'] |
| blackAndWhite         | false         | Print without colour |
| draft                 | false         | Print with less quality (and ink) |
| cellComments          | 'None'        | Where to place comments - one of ['atEnd', 'asDisplayed', 'None'] |
| errors                | 'displayed'   | Where to show errors - one of ['dash', 'blank', 'NA', 'displayed'] |
| scale                 | 100           | Percentage value to increase or reduce the size of the print. Active when fitToPage is false |
| fitToWidth            | 1             | How many pages wide the sheet should print on to. Active when fitToPage is true  |
| fitToHeight           | 1             | How many pages high the sheet should print on to. Active when fitToPage is true  |
| paperSize             |               | What paper size to use (see below) |
| showRowColHeaders     | false         | Whether to show the row numbers and column letters |
| showGridLines         | false         | Whether to show grid lines |
| firstPageNumber       |               | Which number to use for the first page |
| horizontalCentered    | false         | Whether to center the sheet data horizontally |
| verticalCentered      | false         | Whether to center the sheet data vertically |

**Example Paper Sizes**

| Name                          | Value     |
| ----------------------------- | --------- |
| Letter                        | undefined |
| Legal                         |  5        |
| Executive                     |  7        |
| A3                            |  8        |
| A4                            |  9        |
| A5                            |  11       |
| B5 (JIS)                      |  13       |
| Envelope #10                  |  20       |
| Envelope DL                   |  27       |
| Envelope C5                   |  28       |
| Envelope B5                   |  34       |
| Envelope Monarch              |  37       |
| Double Japan Postcard Rotated |  82       |
| 16K 197x273 mm                |  119      |

## Headers and Footers[⬆](#contents)<!-- Link generated with jump2header -->

Here's how to add headers and footers.
The added content is mainly text, such as time, introduction, file information, etc., and you can set the style of the text.
In addition, you can set different texts for the first page and even page.

Note: Images are not currently supported.

```javascript

// Create worksheets with headers and footers
var sheet = workbook.addWorksheet('sheet', {
  headerFooter:{firstHeader: "Hello Exceljs", firstFooter: "Hello World"}
});
// Create worksheets with headers and footers
var worksheetWriter = workbookWriter.addWorksheet('sheet', {
  headerFooter:{firstHeader: "Hello Exceljs", firstFooter: "Hello World"}
});
// Set footer (default centered), result: "Page 2 of 16"
worksheet.headerFooter.oddFooter = "Page &P of &N";

// Set the footer (default centered) to bold, resulting in: "Page 2 of 16"
worksheet.headerFooter.oddFooter = "Page &P of &N";

// Set the left footer to 18px and italicize. Result: "Page 2 of 16"
worksheet.headerFooter.oddFooter = "&LPage &P of &N";

// Set the middle header to gray Aril, the result: "52 exceljs"
worksheet.headerFooter.oddHeader = "&C&KCCCCCC&\"Aril\"52 exceljs";

// Set the left, center, and right text of the footer. Result: “Exceljs” in the footer left. “demo.xlsx” in the footer center. “Page 2” in the footer right
worksheet.headerFooter.oddFooter = "&Lexceljs&C&F&RPage &P";

// Add different header & footer for the first page
worksheet.headerFooter.differentFirst = true;
worksheet.headerFooter.firstHeader = "Hello Exceljs";
worksheet.headerFooter.firstFooter = "Hello World"
```

**Supported headerFooter settings**

| Name              | Default   | Description |
| ----------------- | --------- | ----------- |
| differentFirst    | false     | Set the value of differentFirst as true, which indicates that headers/footers for first page are different from the other pages |
| differentOddEven  | false     | Set the value of differentOddEven as true, which indicates that headers/footers for odd and even pages are different |
| oddHeader         | null      | Set header string for odd(default) pages, could format the string |
| oddFooter         | null      | Set footer string for odd(default) pages, could format the string |
| evenHeader        | null      | Set header string for even pages, could format the string |
| evenFooter        | null      | Set footer string for even pages, could format the string |
| firstHeader       | null      | Set header string for the first page, could format the string |
| firstFooter       | null      | Set footer string for the first page, could format the string |

**Script Commands**

| Commands     | Description |
| ------------ | ----------- |
| &L           | Set position to the left |
| &C           | Set position to the center |
| &R           | Set position to the right |
| &P           | The current page number |
| &N           | The total number of pages |
| &D           | The current date |
| &T           | The current time |
| &G           | A picture |
| &A           | The worksheet name |
| &F           | The file name |
| &B           | Make text bold |
| &I           | Italicize text |
| &U           | Underline text |
| &"font name" | font name, for example &"Aril" |
| &font size   | font size, for example 12 |
| &KHEXCode    | font color, for example &KCCCCCC |

## Worksheet Views[⬆](#contents)<!-- Link generated with jump2header -->

Worksheets now support a list of views, that control how Excel presents the sheet:

* frozen - where a number of rows and columns to the top and left are frozen in place. Only the bottom right section will scroll
* split - where the view is split into 4 sections, each semi-independently scrollable.

Each view also supports various properties:

| Name              | Default   | Description |
| ----------------- | --------- | ----------- |
| state             | 'normal'  | Controls the view state - one of normal, frozen or split |
| rightToLeft       | false     | Sets the worksheet view's orientation to right-to-left |
| activeCell        | undefined | The currently selected cell |
| showRuler         | true      | Shows or hides the ruler in Page Layout |
| showRowColHeaders | true      | Shows or hides the row and column headers (e.g. A1, B1 at the top and 1,2,3 on the left |
| showGridLines     | true      | Shows or hides the gridlines (shown for cells where borders have not been defined) |
| zoomScale         | 100       | Percentage zoom to use for the view |
| zoomScaleNormal   | 100       | Normal zoom for the view |
| style             | undefined | Presentation style - one of pageBreakPreview or pageLayout. Note pageLayout is not compatible with frozen views |

### Frozen Views[⬆](#contents)<!-- Link generated with jump2header -->

Frozen views support the following extra properties:

| Name              | Default   | Description |
| ----------------- | --------- | ----------- |
| xSplit            | 0         | How many columns to freeze. To freeze rows only, set this to 0 or undefined |
| ySplit            | 0         | How many rows to freeze. To freeze columns only, set this to 0 or undefined |
| topLeftCell       | special   | Which cell will be top-left in the bottom-right pane. Note: cannot be a frozen cell. Defaults to first unfrozen cell |

```javascript
worksheet.views = [
  {state: 'frozen', xSplit: 2, ySplit: 3, topLeftCell: 'G10', activeCell: 'A1'}
];
```

### Split Views[⬆](#contents)<!-- Link generated with jump2header -->

Split views support the following extra properties:

| Name              | Default   | Description |
| ----------------- | --------- | ----------- |
| xSplit            | 0         | How many points from the left to place the splitter. To split vertically, set this to 0 or undefined |
| ySplit            | 0         | How many points from the top to place the splitter. To split horizontally, set this to 0 or undefined  |
| topLeftCell       | undefined | Which cell will be top-left in the bottom-right pane. |
| activePane        | undefined | Which pane will be active - one of topLeft, topRight, bottomLeft and bottomRight |

```javascript
worksheet.views = [
  {state: 'split', xSplit: 2000, ySplit: 3000, topLeftCell: 'G10', activeCell: 'A1'}
];
```

## Auto filters[⬆](#contents)<!-- Link generated with jump2header -->

It is possible to apply an auto filter to your worksheet.

```javascript
worksheet.autoFilter = 'A1:C1';
```

While the range string is the standard form of the autoFilter, the worksheet will also support the
following values:

```javascript
// Set an auto filter from A1 to C1
worksheet.autoFilter = {
  from: 'A1',
  to: 'C1',
}

// Set an auto filter from the cell in row 3 and column 1
// to the cell in row 5 and column 12
worksheet.autoFilter = {
  from: {
    row: 3,
    column: 1
  },
  to: {
    row: 5,
    column: 12
  }
}

// Set an auto filter from D3 to the
// cell in row 7 and column 5
worksheet.autoFilter = {
  from: 'D3',
  to: {
    row: 7,
    column: 5
  }
}
```

## Columns[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// Add column headers and define column keys and widths
// Note: these column structures are a workbook-building convenience only,
// apart from the column width, they will not be fully persisted.
worksheet.columns = [
  { header: 'Id', key: 'id', width: 10 },
  { header: 'Name', key: 'name', width: 32 },
  { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 }
];

// Access an individual columns by key, letter and 1-based column number
const idCol = worksheet.getColumn('id');
const nameCol = worksheet.getColumn('B');
const dobCol = worksheet.getColumn(3);

// set column properties

// Note: will overwrite cell value C1
dobCol.header = 'Date of Birth';

// Note: this will overwrite cell values C1:C2
dobCol.header = ['Date of Birth', 'A.K.A. D.O.B.'];

// from this point on, this column will be indexed by 'dob' and not 'DOB'
dobCol.key = 'dob';

dobCol.width = 15;

// Hide the column if you'd like
dobCol.hidden = true;

// set an outline level for columns
worksheet.getColumn(4).outlineLevel = 0;
worksheet.getColumn(5).outlineLevel = 1;

// columns support a readonly field to indicate the collapsed state based on outlineLevel
expect(worksheet.getColumn(4).collapsed).to.equal(false);
expect(worksheet.getColumn(5).collapsed).to.equal(true);

// iterate over all current cells in this column
dobCol.eachCell(function(cell, rowNumber) {
  // ...
});

// iterate over all current cells in this column including empty cells
dobCol.eachCell({ includeEmpty: true }, function(cell, rowNumber) {
  // ...
});

// add a column of new values
worksheet.getColumn(6).values = [1,2,3,4,5];

// add a sparse column of values
worksheet.getColumn(7).values = [,,2,3,,5,,7,,,,11];

// cut one or more columns (columns to the right are shifted left)
// If column properties have been defined, they will be cut or moved accordingly
// Known Issue: If a splice causes any merged cells to move, the results may be unpredictable
worksheet.spliceColumns(3,2);

// remove one column and insert two more.
// Note: columns 4 and above will be shifted right by 1 column.
// Also: If the worksheet has more rows than values in the column inserts,
//  the rows will still be shifted as if the values existed
const newCol3Values = [1,2,3,4,5];
const newCol4Values = ['one', 'two', 'three', 'four', 'five'];
worksheet.spliceColumns(3, 1, newCol3Values, newCol4Values);

```

## Rows[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// Get a row object. If it doesn't already exist, a new empty one will be returned
const row = worksheet.getRow(5);

// Get multiple row objects. If it doesn't already exist, new empty ones will be returned
const rows = worksheet.getRows(5, 2); // start, length (>0, else undefined is returned)

// Get the last editable row in a worksheet (or undefined if there are none)
const row = worksheet.lastRow;

// Set a specific row height
row.height = 42.5;

// make row hidden
row.hidden = true;

// set an outline level for rows
worksheet.getRow(4).outlineLevel = 0;
worksheet.getRow(5).outlineLevel = 1;

// rows support a readonly field to indicate the collapsed state based on outlineLevel
expect(worksheet.getRow(4).collapsed).to.equal(false);
expect(worksheet.getRow(5).collapsed).to.equal(true);


row.getCell(1).value = 5; // A5's value set to 5
row.getCell('name').value = 'Zeb'; // B5's value set to 'Zeb' - assuming column 2 is still keyed by name
row.getCell('C').value = new Date(); // C5's value set to now

// Get a row as a sparse array
// Note: interface change: worksheet.getRow(4) ==> worksheet.getRow(4).values
row = worksheet.getRow(4).values;
expect(row[5]).toEqual('Kyle');

// assign row values by contiguous array (where array element 0 has a value)
row.values = [1,2,3];
expect(row.getCell(1).value).toEqual(1);
expect(row.getCell(2).value).toEqual(2);
expect(row.getCell(3).value).toEqual(3);

// assign row values by sparse array  (where array element 0 is undefined)
const values = []
values[5] = 7;
values[10] = 'Hello, World!';
row.values = values;
expect(row.getCell(1).value).toBeNull();
expect(row.getCell(5).value).toEqual(7);
expect(row.getCell(10).value).toEqual('Hello, World!');

// assign row values by object, using column keys
row.values = {
  id: 13,
  name: 'Thing 1',
  dob: new Date()
};

// Insert a page break below the row
row.addPageBreak();

// Iterate over all rows that have values in a worksheet
worksheet.eachRow(function(row, rowNumber) {
  console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
});

// Iterate over all rows (including empty rows) in a worksheet
worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
  console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
});

// Iterate over all non-null cells in a row
row.eachCell(function(cell, colNumber) {
  console.log('Cell ' + colNumber + ' = ' + cell.value);
});

// Iterate over all cells in a row (including empty cells)
row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
  console.log('Cell ' + colNumber + ' = ' + cell.value);
});

// Commit a completed row to stream
row.commit();

// row metrics
const rowSize = row.cellCount;
const numValues = row.actualCellCount;
```

## Add Rows[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// Add a couple of Rows by key-value, after the last current row, using the column keys
worksheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});

// Add a row by contiguous Array (assign to columns A, B & C)
worksheet.addRow([3, 'Sam', new Date()]);

// Add a row by sparse Array (assign to columns A, E & I)
const rowValues = [];
rowValues[1] = 4;
rowValues[5] = 'Kyle';
rowValues[9] = new Date();
worksheet.addRow(rowValues);

// Add a row with inherited style
// This new row will have same style as last row
// And return as row object
const newRow = worksheet.addRow(rowValues, 'i');

// Add an array of rows
const rows = [
  [5,'Bob',new Date()], // row by array
  {id:6, name: 'Barbara', dob: new Date()}
];
// add new rows and return them as array of row objects
const newRows = worksheet.addRows(rows);

// Add an array of rows with inherited style
// These new rows will have same styles as last row
// and return them as array of row objects
const newRowsStyled = worksheet.addRows(rows, 'i');
```
| Parameter | Description | Default Value |
| -------------- | ----------------- | -------- |
| value/s    | The new row/s values |  |
| style            | 'i' for inherit from row above, 'i+' to include empty cells, 'n' for none | *'n'* |

## Handling Individual Cells[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
const cell = worksheet.getCell('C3');

// Modify/Add individual cell
cell.value = new Date(1968, 5, 1);

// query a cell's type
expect(cell.type).toEqual(Excel.ValueType.Date);

// use string value of cell
myInput.value = cell.text;

// use html-safe string for rendering...
const html = '<div>' + cell.html + '</div>';

```

## Merged Cells[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// merge a range of cells
worksheet.mergeCells('A4:B5');

// ... merged cells are linked
worksheet.getCell('B5').value = 'Hello, World!';
expect(worksheet.getCell('B5').value).toBe(worksheet.getCell('A4').value);
expect(worksheet.getCell('B5').master).toBe(worksheet.getCell('A4'));

// ... merged cells share the same style object
expect(worksheet.getCell('B5').style).toBe(worksheet.getCell('A4').style);
worksheet.getCell('B5').style.font = myFonts.arial;
expect(worksheet.getCell('A4').style.font).toBe(myFonts.arial);

// unmerging the cells breaks the style links
worksheet.unMergeCells('A4');
expect(worksheet.getCell('B5').style).not.toBe(worksheet.getCell('A4').style);
expect(worksheet.getCell('B5').style.font).not.toBe(myFonts.arial);

// merge by top-left, bottom-right
worksheet.mergeCells('K10', 'M12');

// merge by start row, start column, end row, end column (equivalent to K10:M12)
worksheet.mergeCells(10,11,12,13);
```

## Insert Rows[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
insertRow(pos, value, style = 'n')
insertRows(pos, values, style = 'n')

// Insert a couple of Rows by key-value, shifting down rows every time
worksheet.insertRow(1, {id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
worksheet.insertRow(1, {id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});

// Insert a row by contiguous Array (assign to columns A, B & C)
worksheet.insertRow(1, [3, 'Sam', new Date()]);

// Insert a row by sparse Array (assign to columns A, E & I)
var rowValues = [];
rowValues[1] = 4;
rowValues[5] = 'Kyle';
rowValues[9] = new Date();
// insert new row and return as row object
const insertedRow = worksheet.insertRow(1, rowValues);

// Insert a row, with inherited style
// This new row will have same style as row on top of it
// And return as row object
const insertedRowInherited = worksheet.insertRow(1, rowValues, 'i');

// Insert a row, keeping original style
// This new row will have same style as it was previously
// And return as row object
const insertedRowOriginal = worksheet.insertRow(1, rowValues, 'o');

// Insert an array of rows, in position 1, shifting down current position 1 and later rows by 2 rows
var rows = [
  [5,'Bob',new Date()], // row by array
  {id:6, name: 'Barbara', dob: new Date()}
];
// insert new rows and return them as array of row objects
const insertedRows = worksheet.insertRows(1, rows);

// Insert an array of rows, with inherited style
// These new rows will have same style as row on top of it
// And return them as array of row objects
const insertedRowsInherited = worksheet.insertRows(1, rows, 'i');

// Insert an array of rows, keeping original style
// These new rows will have same style as it was previously in 'pos' position
const insertedRowsOriginal = worksheet.insertRows(1, rows, 'o');

```
| Parameter | Description | Default Value |
| -------------- | ----------------- | -------- |
| pos          | Row number where you want to insert, pushing down all rows from there |  |
| value/s    | The new row/s values |  |
| style            | 'i' for inherit from row above, , 'i+' to include empty cells, 'o' for original style, 'o+' to include empty cells, 'n' for none | *'n'* |

## Splice[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// Cut one or more rows (rows below are shifted up)
// Known Issue: If a splice causes any merged cells to move, the results may be unpredictable
worksheet.spliceRows(4, 3);

// remove one row and insert two more.
// Note: rows 4 and below will be shifted down by 1 row.
const newRow3Values = [1, 2, 3, 4, 5];
const newRow4Values = ['one', 'two', 'three', 'four', 'five'];
worksheet.spliceRows(3, 1, newRow3Values, newRow4Values);

// Cut one or more cells (cells to the right are shifted left)
// Note: this operation will not affect other rows
row.splice(3, 2);

// remove one cell and insert two more (cells to the right of the cut cell will be shifted right)
row.splice(4, 1, 'new value 1', 'new value 2');
```
| Parameter | Description | Default Value |
| -------------- | ----------------- | -------- |
| start    | Starting point to splice from |  |
| count    | Number of rows/cells to remove |  |
| ...inserts            | New row/cell values to insert |  |

## Duplicate a Row[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
duplicateRow(start, amount = 1, insert = true)

const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet('duplicateTest');
ws.getCell('A1').value = 'One';
ws.getCell('A2').value = 'Two';
ws.getCell('A3').value = 'Three';
ws.getCell('A4').value = 'Four';

// This line will duplicate the row 'One' twice but it will replace rows 'Two' and 'Three'
// if third param was true so it would insert 2 new rows with the values and styles of row 'One'
ws.duplicateRow(1,2,false);
```

| Parameter | Description | Default Value |
| -------------- | ----------------- | -------- |
| start          | Row number you want to duplicate (first in excel is 1) |  |
| amount    | The times you want to duplicate the row | 1 |
| insert            | *true* if you want to insert new rows for the duplicates, or *false* if you want to replace them | *true* |



## Defined Names[⬆](#contents)<!-- Link generated with jump2header -->

Individual cells (or multiple groups of cells) can have names assigned to them.
 The names can be used in formulas and data validation (and probably more).

```javascript
// assign (or get) a name for a cell (will overwrite any other names that cell had)
worksheet.getCell('A1').name = 'PI';
expect(worksheet.getCell('A1').name).to.equal('PI');

// assign (or get) an array of names for a cell (cells can have more than one name)
worksheet.getCell('A1').names = ['thing1', 'thing2'];
expect(worksheet.getCell('A1').names).to.have.members(['thing1', 'thing2']);

// remove a name from a cell
worksheet.getCell('A1').removeName('thing1');
expect(worksheet.getCell('A1').names).to.have.members(['thing2']);
```

## Data Validations[⬆](#contents)<!-- Link generated with jump2header -->

Cells can define what values are valid or not and provide prompting to the user to help guide them.

Validation types can be one of the following:

| Type       | Description |
| ---------- | ----------- |
| list       | Define a discrete set of valid values. Excel will offer these in a dropdown for easy entry |
| whole      | The value must be a whole number |
| decimal    | The value must be a decimal number |
| textLength | The value may be text but the length is controlled |
| custom     | A custom formula controls the valid values |

For types other than list or custom, the following operators affect the validation:

| Operator              | Description |
| --------------------  | ----------- |
| between               | Values must lie between formula results |
| notBetween            | Values must not lie between formula results |
| equal                 | Value must equal formula result |
| notEqual              | Value must not equal formula result |
| greaterThan           | Value must be greater than formula result |
| lessThan              | Value must be less than formula result |
| greaterThanOrEqual    | Value must be greater than or equal to formula result |
| lessThanOrEqual       | Value must be less than or equal to formula result |

```javascript
// Specify list of valid values (One, Two, Three, Four).
// Excel will provide a dropdown with these values.
worksheet.getCell('A1').dataValidation = {
  type: 'list',
  allowBlank: true,
  formulae: ['"One,Two,Three,Four"']
};

// Specify list of valid values from a range.
// Excel will provide a dropdown with these values.
worksheet.getCell('A1').dataValidation = {
  type: 'list',
  allowBlank: true,
  formulae: ['$D$5:$F$5']
};

// Specify Cell must be a whole number that is not 5.
// Show the user an appropriate error message if they get it wrong
worksheet.getCell('A1').dataValidation = {
  type: 'whole',
  operator: 'notEqual',
  showErrorMessage: true,
  formulae: [5],
  errorStyle: 'error',
  errorTitle: 'Five',
  error: 'The value must not be Five'
};

// Specify Cell must be a decimal number between 1.5 and 7.
// Add 'tooltip' to help guid the user
worksheet.getCell('A1').dataValidation = {
  type: 'decimal',
  operator: 'between',
  allowBlank: true,
  showInputMessage: true,
  formulae: [1.5, 7],
  promptTitle: 'Decimal',
  prompt: 'The value must between 1.5 and 7'
};

// Specify Cell must be have a text length less than 15
worksheet.getCell('A1').dataValidation = {
  type: 'textLength',
  operator: 'lessThan',
  showErrorMessage: true,
  allowBlank: true,
  formulae: [15]
};

// Specify Cell must be have be a date before 1st Jan 2016
worksheet.getCell('A1').dataValidation = {
  type: 'date',
  operator: 'lessThan',
  showErrorMessage: true,
  allowBlank: true,
  formulae: [new Date(2016,0,1)]
};
```

## Cell Comments[⬆](#contents)<!-- Link generated with jump2header -->

Add old style comment to a cell

```javascript
// plain text note
worksheet.getCell('A1').note = 'Hello, ExcelJS!';

// colourful formatted note
ws.getCell('B1').note = {
  texts: [
    {'font': {'size': 12, 'color': {'theme': 0}, 'name': 'Calibri', 'family': 2, 'scheme': 'minor'}, 'text': 'This is '},
    {'font': {'italic': true, 'size': 12, 'color': {'theme': 0}, 'name': 'Calibri', 'scheme': 'minor'}, 'text': 'a'},
    {'font': {'size': 12, 'color': {'theme': 1}, 'name': 'Calibri', 'family': 2, 'scheme': 'minor'}, 'text': ' '},
    {'font': {'size': 12, 'color': {'argb': 'FFFF6600'}, 'name': 'Calibri', 'scheme': 'minor'}, 'text': 'colorful'},
    {'font': {'size': 12, 'color': {'theme': 1}, 'name': 'Calibri', 'family': 2, 'scheme': 'minor'}, 'text': ' text '},
    {'font': {'size': 12, 'color': {'argb': 'FFCCFFCC'}, 'name': 'Calibri', 'scheme': 'minor'}, 'text': 'with'},
    {'font': {'size': 12, 'color': {'theme': 1}, 'name': 'Calibri', 'family': 2, 'scheme': 'minor'}, 'text': ' in-cell '},
    {'font': {'bold': true, 'size': 12, 'color': {'theme': 1}, 'name': 'Calibri', 'family': 2, 'scheme': 'minor'}, 'text': 'format'},
  ],
  margins: {
    insetmode: 'custom',
    inset: [0.25, 0.25, 0.35, 0.35]
  },
  protection: {
    locked: True,
    lockText: False
  },
  editAs: 'twoCells',
};
```

### Cell Comments Properties[⬆](#contents)<!-- Link generated with jump2header -->

The following table defines the properties supported by cell comments.

| Field     | Required | Default Value | Description |
| --------  | -------- | ------------- | ----------- |
| texts     | Y        |               | The text of the comment |
| margins | N        | {}  | Determines the value of margins for automatic or custom cell comments
| protection   | N        | {} | Specifying the lock status of objects and object text using protection attributes |
| editAs   | N        | 'absolute' | Use the 'editAs' attribute to specify how the annotation is anchored to the cell  |

### Cell Comments Margins

Determine the page margin setting mode of the cell annotation, automatic or custom mode.

```javascript
ws.getCell('B1').note.margins = {
  insetmode: 'custom',
  inset: [0.25, 0.25, 0.35, 0.35]
}
```

### Supported Margins Properties[⬆](#contents)<!-- Link generated with jump2header -->

| Property     | Required | Default Value | Description |
| --------  | -------- | ------------- | ----------- |
| insetmode     | N        |    'auto'           | Determines whether comment margins are set automatically and the value is 'auto' or 'custom' |
| inset | N        | [0.13, 0.13, 0.25, 0.25]  | Whitespace on the borders of the comment. Units are centimeter. Direction is left, top, right, bottom |

Note: This  ```inset``` setting takes effect only when the value of ```insetmode``` is 'custom'.

### Cell Comments Protection

Specifying the lock status of objects and object text using protection attributes.

```javascript
ws.getCell('B1').note.protection = {
  locked: 'False',
  lockText: 'False',
};
```

### Supported Protection Properties[⬆](#contents)<!-- Link generated with jump2header -->

| Property     | Required | Default Value | Description |
| --------  | -------- | ------------- | ----------- |
| locked     | N        |    'True'           | This element specifies that the object is locked when the sheet is protected |
| lockText | N        | 'True'  | This element specifies that the text of the object is locked |

Note: Locked objects are valid only when the worksheet is protected.

### Cell Comments EditAs[⬆](#contents)<!-- Link generated with jump2header -->

The cell comments can also have the property 'editAs' which will control how the comments is anchored to the cell(s).
It can have one of the following values:

```javascript
ws.getCell('B1').note.editAs = 'twoCells';
```

| Value     | Description |
| --------- | ----------- |
| twoCells | It specifies that the size and position of the note varies with cells |
| oneCells   | It specifies that the size of the note is fixed and the position changes with the cell |
| absolute  | This is the default. Comments will not be moved or sized with cells |

## Tables[⬆](#contents)<!-- Link generated with jump2header -->

Tables allow for in-sheet manipulation of tabular data.

To add a table to a worksheet, define a table model and call addTable:

```javascript
// add a table to a sheet
ws.addTable({
  name: 'MyTable',
  ref: 'A1',
  headerRow: true,
  totalsRow: true,
  style: {
    theme: 'TableStyleDark3',
    showRowStripes: true,
  },
  columns: [
    {name: 'Date', totalsRowLabel: 'Totals:', filterButton: true},
    {name: 'Amount', totalsRowFunction: 'sum', filterButton: false},
  ],
  rows: [
    [new Date('2019-07-20'), 70.10],
    [new Date('2019-07-21'), 70.60],
    [new Date('2019-07-22'), 70.10],
  ],
});
```

Note: Adding a table to a worksheet will modify the sheet by placing
headers and row data to the sheet.
Any data on the sheet covered by the resulting table (including headers and
totals) will be overwritten.

### Table Properties[⬆](#contents)<!-- Link generated with jump2header -->

The following table defines the properties supported by tables.

| Table Property | Description       | Required | Default Value |
| -------------- | ----------------- | -------- | ------------- |
| name           | The name of the table | Y |    |
| displayName    | The display name of the table | N | name |
| ref            | Top left cell of the table | Y |   |
| headerRow      | Show headers at top of table | N | true |
| totalsRow      | Show totals at bottom of table | N | false |
| style          | Extra style properties | N | {} |
| columns        | Column definitions | Y |   |
| rows           | Rows of data | Y |   |

### Table Style Properties[⬆](#contents)<!-- Link generated with jump2header -->

The following table defines the properties supported within the table
style property.

| Style Property     | Description       | Required | Default Value |
| ------------------ | ----------------- | -------- | ------------- |
| theme              | The colour theme of the table | N |  'TableStyleMedium2'  |
| showFirstColumn    | Highlight the first column (bold) | N |  false  |
| showLastColumn     | Highlight the last column (bold) | N |  false  |
| showRowStripes     | Alternate rows shown with background colour | N |  false  |
| showColumnStripes  | Alternate rows shown with background colour | N |  false  |

### Table Column Properties[⬆](#contents)<!-- Link generated with jump2header -->

The following table defines the properties supported within each table
column.

| Column Property    | Description       | Required | Default Value |
| ------------------ | ----------------- | -------- | ------------- |
| name               | The name of the column, also used in the header | Y |    |
| filterButton       | Switches the filter control in the header | N |  false  |
| totalsRowLabel     | Label to describe the totals row (first column) | N | 'Total' |
| totalsRowFunction  | Name of the totals function | N | 'none' |
| totalsRowFormula   | Optional formula for custom functions | N |   |

### Totals Functions[⬆](#contents)<!-- Link generated with jump2header -->

The following table list the valid values for the totalsRowFunction property
defined by columns. If any value other than 'custom' is used, it is not
necessary to include the associated formula as this will be inserted
by the table.

| Totals Functions   | Description       |
| ------------------ | ----------------- |
| none               | No totals function for this column |
| average            | Compute average for the column |
| countNums          | Count the entries that are numbers |
| count              | Count of entries |
| max                | The maximum value in this column |
| min                | The minimum value in this column |
| stdDev             | The standard deviation for this column |
| var                | The variance for this column |
| sum                | The sum of entries for this column |
| custom             | A custom formula. Requires an associated totalsRowFormula value. |

### Table Style Themes[⬆](#contents)<!-- Link generated with jump2header -->

Valid theme names follow the following pattern:

* "TableStyle[Shade][Number]"

Shades, Numbers can be one of:

* Light, 1-21
* Medium, 1-28
* Dark, 1-11

For no theme, use the value null.

Note: custom table themes are not supported by exceljs yet.

### Modifying Tables[⬆](#contents)<!-- Link generated with jump2header -->

Tables support a set of manipulation functions that allow data to be
added or removed and some properties to be changed. Since many of these
operations may have on-sheet effects, the changes must be committed
once complete.

All index values in the table are zero based, so the first row number
and first column number is 0.

**Adding or Removing Headers and Totals**

```javascript
const table = ws.getTable('MyTable');

// turn header row on
table.headerRow = true;

// turn totals row off
table.totalsRow = false;

// commit the table changes into the sheet
table.commit();
```

**Relocating a Table**

```javascript
const table = ws.getTable('MyTable');

// table top-left move to D4
table.ref = 'D4';

// commit the table changes into the sheet
table.commit();
```

**Adding and Removing Rows**

```javascript
const table = ws.getTable('MyTable');

// remove first two rows
table.removeRows(0, 2);

// insert new rows at index 5
table.addRow([new Date('2019-08-05'), 5, 'Mid'], 5);

// append new row to bottom of table
table.addRow([new Date('2019-08-10'), 10, 'End']);

// commit the table changes into the sheet
table.commit();
```

**Adding and Removing Columns**

```javascript
const table = ws.getTable('MyTable');

// remove second column
table.removeColumns(1, 1);

// insert new column (with data) at index 1
table.addColumn(
  {name: 'Letter', totalsRowFunction: 'custom', totalsRowFormula: 'ROW()', totalsRowResult: 6, filterButton: true},
  ['a', 'b', 'c', 'd'],
  2
);

// commit the table changes into the sheet
table.commit();
```

**Change Column Properties**

```javascript
const table = ws.getTable('MyTable');

// Get Column Wrapper for second column
const column = table.getColumn(1);

// set some properties
column.name = 'Code';
column.filterButton = true;
column.style = {font:{bold: true, name: 'Comic Sans MS'}};
column.totalsRowLabel = 'Totals';
column.totalsRowFunction = 'custom';
column.totalsRowFormula = 'ROW()';
column.totalsRowResult = 10;

// commit the table changes into the sheet
table.commit();
```


## Styles[⬆](#contents)<!-- Link generated with jump2header -->

Cells, Rows and Columns each support a rich set of styles and formats that affect how the cells are displayed.

Styles are set by assigning the following properties:

* <a href="#number-formats">numFmt</a>
* <a href="#fonts">font</a>
* <a href="#alignment">alignment</a>
* <a href="#borders">border</a>
* <a href="#fills">fill</a>

```javascript
// assign a style to a cell
ws.getCell('A1').numFmt = '0.00%';

// Apply styles to worksheet columns
ws.columns = [
  { header: 'Id', key: 'id', width: 10 },
  { header: 'Name', key: 'name', width: 32, style: { font: { name: 'Arial Black' } } },
  { header: 'D.O.B.', key: 'DOB', width: 10, style: { numFmt: 'dd/mm/yyyy' } }
];

// Set Column 3 to Currency Format
ws.getColumn(3).numFmt = '"£"#,##0.00;[Red]\-"£"#,##0.00';

// Set Row 2 to Comic Sans.
ws.getRow(2).font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
```

When a style is applied to a row or column, it will be applied to all currently existing cells in that row or column.
 Also, any new cell that is created will inherit its initial styles from the row and column it belongs to.

If a cell's row and column both define a specific style (e.g. font), the cell will use the row style over the column style.
 However if the row and column define different styles (e.g. column.numFmt and row.font), the cell will inherit the font from the row and the numFmt from the column.

Caveat: All the above properties (with the exception of numFmt, which is a string), are JS object structures.
 If the same style object is assigned to more than one spreadsheet entity, then each entity will share the same style object.
 If the style object is later modified before the spreadsheet is serialized, then all entities referencing that style object will be modified too.
 This behaviour is intended to prioritize performance by reducing the number of JS objects created.
 If you want the style objects to be independent, you will need to clone them before assigning them.
 Also, by default, when a document is read from file (or stream) if spreadsheet entities share similar styles, then they will reference the same style object too.

### Number Formats[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// display value as '1 3/5'
ws.getCell('A1').value = 1.6;
ws.getCell('A1').numFmt = '# ?/?';

// display value as '1.60%'
ws.getCell('B1').value = 0.016;
ws.getCell('B1').numFmt = '0.00%';
```

### Fonts[⬆](#contents)<!-- Link generated with jump2header -->

```javascript

// for the wannabe graphic designers out there
ws.getCell('A1').font = {
  name: 'Comic Sans MS',
  family: 4,
  size: 16,
  underline: true,
  bold: true
};

// for the graduate graphic designers...
ws.getCell('A2').font = {
  name: 'Arial Black',
  color: { argb: 'FF00FF00' },
  family: 2,
  size: 14,
  italic: true
};

// for the vertical align
ws.getCell('A3').font = {
  vertAlign: 'superscript'
};

// note: the cell will store a reference to the font object assigned.
// If the font object is changed afterwards, the cell font will change also...
const font = { name: 'Arial', size: 12 };
ws.getCell('A3').font = font;
font.size = 20; // Cell A3 now has font size 20!

// Cells that share similar fonts may reference the same font object after
// the workbook is read from file or stream
```

| Font Property | Description       | Example Value(s) |
| ------------- | ----------------- | ---------------- |
| name          | Font name. | 'Arial', 'Calibri', etc. |
| family        | Font family for fallback. An integer value. | 1 - Serif, 2 - Sans Serif, 3 - Mono, Others - unknown |
| scheme        | Font scheme. | 'minor', 'major', 'none' |
| charset       | Font charset. An integer value. | 1, 2, etc. |
| size          | Font size. An integer value. | 9, 10, 12, 16, etc. |
| color         | Colour description, an object containing an ARGB value. | { argb: 'FFFF0000'} |
| bold          | Font **weight** | true, false |
| italic        | Font *slope* | true, false |
| underline     | Font <u>underline</u> style | true, false, 'none', 'single', 'double', 'singleAccounting', 'doubleAccounting' |
| strike        | Font <strike>strikethrough</strike> | true, false |
| outline       | Font outline | true, false |
| vertAlign     | Vertical align | 'superscript', 'subscript'

### Alignment[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// set cell alignment to top-left, middle-center, bottom-right
ws.getCell('A1').alignment = { vertical: 'top', horizontal: 'left' };
ws.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
ws.getCell('C1').alignment = { vertical: 'bottom', horizontal: 'right' };

// set cell to wrap-text
ws.getCell('D1').alignment = { wrapText: true };

// set cell indent to 1
ws.getCell('E1').alignment = { indent: 1 };

// set cell text rotation to 30deg upwards, 45deg downwards and vertical text
ws.getCell('F1').alignment = { textRotation: 30 };
ws.getCell('G1').alignment = { textRotation: -45 };
ws.getCell('H1').alignment = { textRotation: 'vertical' };
```

**Valid Alignment Property Values**

| horizontal       | vertical    | wrapText | shrinkToFit | indent  | readingOrder | textRotation |
| ---------------- | ----------- | -------- | ----------- | ------- | ------------ | ------------ |
| left             | top         | true     | true        | integer | rtl          | 0 to 90      |
| center           | middle      | false    | false       |         | ltr          | -1 to -90    |
| right            | bottom      |          |             |         |              | vertical     |
| fill             | distributed |          |             |         |              |              |
| justify          | justify     |          |             |         |              |              |
| centerContinuous |             |          |             |         |              |              |
| distributed      |             |          |             |         |              |              |


### Borders[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// set single thin border around A1
ws.getCell('A1').border = {
  top: {style:'thin'},
  left: {style:'thin'},
  bottom: {style:'thin'},
  right: {style:'thin'}
};

// set double thin green border around A3
ws.getCell('A3').border = {
  top: {style:'double', color: {argb:'FF00FF00'}},
  left: {style:'double', color: {argb:'FF00FF00'}},
  bottom: {style:'double', color: {argb:'FF00FF00'}},
  right: {style:'double', color: {argb:'FF00FF00'}}
};

// set thick red cross in A5
ws.getCell('A5').border = {
  diagonal: {up: true, down: true, style:'thick', color: {argb:'FFFF0000'}}
};
```

**Valid Border Styles**

* thin
* dotted
* dashDot
* hair
* dashDotDot
* slantDashDot
* mediumDashed
* mediumDashDotDot
* mediumDashDot
* medium
* double
* thick

### Fills[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// fill A1 with red darkVertical stripes
ws.getCell('A1').fill = {
  type: 'pattern',
  pattern:'darkVertical',
  fgColor:{argb:'FFFF0000'}
};

// fill A2 with yellow dark trellis and blue behind
ws.getCell('A2').fill = {
  type: 'pattern',
  pattern:'darkTrellis',
  fgColor:{argb:'FFFFFF00'},
  bgColor:{argb:'FF0000FF'}
};

// fill A3 with solid coral
ws.getCell('A3').fill = {
  type: 'pattern',
  pattern:'solid',
  fgColor:{argb:'F08080'},
};

// fill A4 with blue-white-blue gradient from left to right
ws.getCell('A4').fill = {
  type: 'gradient',
  gradient: 'angle',
  degree: 0,
  stops: [
    {position:0, color:{argb:'FF0000FF'}},
    {position:0.5, color:{argb:'FFFFFFFF'}},
    {position:1, color:{argb:'FF0000FF'}}
  ]
};


// fill A5 with red-green gradient from center
ws.getCell('A5').fill = {
  type: 'gradient',
  gradient: 'path',
  center:{left:0.5,top:0.5},
  stops: [
    {position:0, color:{argb:'FFFF0000'}},
    {position:1, color:{argb:'FF00FF00'}}
  ]
};
```

#### Pattern Fills[⬆](#contents)<!-- Link generated with jump2header -->

| Property | Required | Description |
| -------- | -------- | ----------- |
| type     | Y        | Value: 'pattern'<br/>Specifies this fill uses patterns |
| pattern  | Y        | Specifies type of pattern (see <a href="#valid-pattern-types">Valid Pattern Types</a> below) |
| fgColor  | N        | Specifies the pattern foreground color. Default is black. |
| bgColor  | N        | Specifies the pattern background color. Default is white. |

Note: If you want to fill a cell using the `solid` pattern, then you don't need to specify `bgColor`.
See example above for cell `A3` with a `solid` pattern and a coral `fgColor`.


**Valid Pattern Types**

* none
* solid
* darkGray
* mediumGray
* lightGray
* gray125
* gray0625
* darkHorizontal
* darkVertical
* darkDown
* darkUp
* darkGrid
* darkTrellis
* lightHorizontal
* lightVertical
* lightDown
* lightUp
* lightGrid
* lightTrellis

#### Gradient Fills[⬆](#contents)<!-- Link generated with jump2header -->

| Property | Required | Description |
| -------- | -------- | ----------- |
| type     | Y        | Value: 'gradient'<br/>Specifies this fill uses gradients |
| gradient | Y        | Specifies gradient type. One of ['angle', 'path'] |
| degree   | angle    | For 'angle' gradient, specifies the direction of the gradient. 0 is from the left to the right. Values from 1 - 359 rotates the direction clockwise |
| center   | path     | For 'path' gradient. Specifies the relative coordinates for the start of the path. 'left' and 'top' values range from 0 to 1 |
| stops    | Y        | Specifies the gradient colour sequence. Is an array of objects containing position and color starting with position 0 and ending with position 1. Intermediary positions may be used to specify other colours on the path. |

**Caveats**

Using the interface above it may be possible to create gradient fill effects not possible using the XLSX editor program.
For example, Excel only supports angle gradients of 0, 45, 90 and 135.
Similarly the sequence of stops may also be limited by the UI with positions [0,1] or [0,0.5,1] as the only options.
Take care with this fill to be sure it is supported by the target XLSX viewers.

### Rich Text[⬆](#contents)<!-- Link generated with jump2header -->

Individual cells now support rich text or in-cell formatting.
 Rich text values can control the font properties of any number of sub-strings within the text value.
 See <a href="font">Fonts</a> for a complete list of details on what font properties are supported.

```javascript

ws.getCell('A1').value = {
  'richText': [
    {'font': {'size': 12,'color': {'theme': 0},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': 'This is '},
    {'font': {'italic': true,'size': 12,'color': {'theme': 0},'name': 'Calibri','scheme': 'minor'},'text': 'a'},
    {'font': {'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': ' '},
    {'font': {'size': 12,'color': {'argb': 'FFFF6600'},'name': 'Calibri','scheme': 'minor'},'text': 'colorful'},
    {'font': {'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': ' text '},
    {'font': {'size': 12,'color': {'argb': 'FFCCFFCC'},'name': 'Calibri','scheme': 'minor'},'text': 'with'},
    {'font': {'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': ' in-cell '},
    {'font': {'bold': true,'size': 12,'color': {'theme': 1},'name': 'Calibri','family': 2,'scheme': 'minor'},'text': 'format'}
  ]
};

expect(ws.getCell('A1').text).to.equal('This is a colorful text with in-cell format');
expect(ws.getCell('A1').type).to.equal(Excel.ValueType.RichText);

```

### Cell Protection[⬆](#contents)<!-- Link generated with jump2header -->

Cell level protection can be modified using the protection property.

```javascript
ws.getCell('A1').protection = {
  locked: false,
  hidden: true,
};
```

**Supported Protection Properties**

| Property | Default | Description |
| -------- | ------- | ----------- |
| locked   | true    | Specifies whether a cell will be locked if the sheet is protected. |
| hidden   | false   | Specifies whether a cell's formula will be visible if the sheet is protected. |

## Conditional Formatting[⬆](#contents)<!-- Link generated with jump2header -->

Conditional formatting allows a sheet to show specific styles, icons, etc
depending on cell values or any arbitrary formula.

Conditional formatting rules are added at the sheet level and will typically
cover a range of cells.

Multiple rules can be applied to a given cell range and each rule will apply
its own style.

If multiple rules affect a given cell, the rule priority value will determine
which rule wins out if competing styles collide.
The rule with the lower priority value wins.
If priority values are not specified for a given rule, ExcelJS will assign them
in ascending order.

Note: at present, only a subset of conditional formatting rules are supported.
Specifically, only the formatting rules that do not require XML rendering
inside an &lt;extLst&gt; element. This means that datasets and three specific
icon sets (3Triangles, 3Stars, 5Boxes) are not supported.

```javascript
// add a checkerboard pattern to A1:E7 based on row + col being even or odd
worksheet.addConditionalFormatting({
  ref: 'A1:E7',
  rules: [
    {
      type: 'expression',
      formulae: ['MOD(ROW()+COLUMN(),2)=0'],
      style: {fill: {type: 'pattern', pattern: 'solid', bgColor: {argb: 'FF00FF00'}}},
    }
  ]
})
```

**Supported Conditional Formatting Rule Types**

| Type         | Description |
| ------------ | ----------- |
| expression   | Any custom function may be used to activate the rule. |
| cellIs       | Compares cell value with supplied formula using specified operator |
| top10        | Applies formatting to cells with values in top (or bottom) ranges |
| aboveAverage | Applies formatting to cells with values above (or below) average |
| colorScale   | Applies a coloured background to cells based on where their values lie in the range |
| iconSet      | Adds one of a range of icons to cells based on value |
| containsText | Applies formatting based on whether cell a specific text |
| timePeriod   | Applies formatting based on whether cell datetime value lies within a specified range |

### Expression[⬆](#contents)<!-- Link generated with jump2header -->

| Field    | Optional | Default | Description |
| -------- | -------- | ------- | ----------- |
| type     |          |         | 'expression' |
| priority | Y        | &lt;auto&gt;  | determines priority ordering of styles |
| formulae |          |         | array of 1 formula string that returns a true/false value. To reference the cell value, use the top-left cell address |
| style    |          |         | style structure to apply if the formula returns true |

### Cell Is[⬆](#contents)<!-- Link generated with jump2header -->

| Field    | Optional | Default | Description |
| -------- | -------- | ------- | ----------- |
| type     |          |         | 'cellIs' |
| priority | Y        | &lt;auto&gt;  | determines priority ordering of styles |
| operator |          |         | how to compare cell value with formula result |
| formulae |          |         | array of 1 formula string that returns the value to compare against each cell |
| style    |          |         | style structure to apply if the comparison returns true |

**Cell Is Operators**

| Operator    | Description |
| ----------- | ----------- |
| equal       | Apply format if cell value equals formula value |
| greaterThan | Apply format if cell value is greater than formula value |
| lessThan    | Apply format if cell value is less than formula value |
| between     | Apply format if cell value is between two formula values (inclusive) |


### Top 10[⬆](#contents)<!-- Link generated with jump2header -->

| Field    | Optional | Default | Description |
| -------- | -------- | ------- | ----------- |
| type     |          |         | 'top10' |
| priority | Y        | &lt;auto&gt;  | determines priority ordering of styles |
| rank     | Y        | 10      | specifies how many top (or bottom) values are included in the formatting |
| percent  | Y        | false   | if true, the rank field is a percentage, not an absolute |
| bottom   | Y        | false   | if true, the bottom values are included instead of the top |
| style    |          |         | style structure to apply if the comparison returns true |

### Above Average[⬆](#contents)<!-- Link generated with jump2header -->

| Field         | Optional | Default | Description |
| ------------- | -------- | ------- | ----------- |
| type          |          |         | 'aboveAverage' |
| priority      | Y        | &lt;auto&gt;  | determines priority ordering of styles |
| aboveAverage  | Y        | false   | if true, the rank field is a percentage, not an absolute |
| style         |          |         | style structure to apply if the comparison returns true |

### Color Scale[⬆](#contents)<!-- Link generated with jump2header -->

| Field         | Optional | Default | Description |
| ------------- | -------- | ------- | ----------- |
| type          |          |         | 'colorScale' |
| priority      | Y        | &lt;auto&gt;  | determines priority ordering of styles |
| cfvo          |          |         | array of 2 to 5 Conditional Formatting Value Objects specifying way-points in the value range |
| color         |          |         | corresponding array of colours to use at given way points |
| style         |          |         | style structure to apply if the comparison returns true |

### Icon Set[⬆](#contents)<!-- Link generated with jump2header -->

| Field         | Optional | Default | Description |
| ------------- | -------- | ------- | ----------- |
| type          |          |         | 'iconSet' |
| priority      | Y        | &lt;auto&gt;  | determines priority ordering of styles |
| iconSet       | Y        | 3TrafficLights | name of icon set to use |
| showValue     |          | true    | Specifies whether the cells in the applied range display the icon and cell value, or the icon only |
| reverse       |          | false   | Specifies whether the icons in the icon set specified in iconSet are show in reserve order. If custom equals "true" this value must be ignored |
| custom        |          |  false  | Specifies whether a custom set of icons is used |
| cfvo          |          |         | array of 2 to 5 Conditional Formatting Value Objects specifying way-points in the value range |
| style         |          |         | style structure to apply if the comparison returns true |

### Data Bar[⬆](#contents)<!-- Link generated with jump2header -->

| Field      | Optional | Default | Description |
| ---------- | -------- | ------- | ----------- |
| type       |          |         | 'dataBar' |
| priority   | Y        | &lt;auto&gt;  | determines priority ordering of styles |
| minLength  |          | 0       | Specifies the length of the shortest data bar in this conditional formatting range |
| maxLength  |          | 100     | Specifies the length of the longest data bar in this conditional formatting range |
| showValue  |          | true    | Specifies whether the cells in the conditional formatting range display both the data bar and the numeric value or the data bar |
| gradient   |          | true    | Specifies whether the data bar has a gradient fill |
| border     |          | true    | Specifies whether the data bar has a border |
| negativeBarColorSameAsPositive  |                | true        | Specifies whether the data bar has a negative bar color that is different from the positive bar color |
| negativeBarBorderColorSameAsPositive  |          | true        | Specifies whether the data bar has a negative border color that is different from the positive border color |
| axisPosition  |       | 'auto'             | Specifies the axis position for the data bar |
| direction  |          | 'leftToRight'      | Specifies the direction of the data bar |
| cfvo          |          |         | array of 2 to 5 Conditional Formatting Value Objects specifying way-points in the value range |
| style         |          |         | style structure to apply if the comparison returns true |

### Contains Text[⬆](#contents)<!-- Link generated with jump2header -->

| Field    | Optional | Default | Description |
| -------- | -------- | ------- | ----------- |
| type     |          |         | 'containsText' |
| priority | Y        | &lt;auto&gt;  | determines priority ordering of styles |
| operator |          |         | type of text comparison |
| text     |          |         | text to search for |
| style    |          |         | style structure to apply if the comparison returns true |

**Contains Text Operators**

| Operator          | Description |
| ----------------- | ----------- |
| containsText      | Apply format if cell value contains the value specified in the 'text' field |
| containsBlanks    | Apply format if cell value contains blanks |
| notContainsBlanks | Apply format if cell value does not contain blanks |
| containsErrors    | Apply format if cell value contains errors |
| notContainsErrors | Apply format if cell value does not contain errors |

### Time Period[⬆](#contents)<!-- Link generated with jump2header -->

| Field      | Optional | Default | Description |
| ---------- | -------- | ------- | ----------- |
| type       |          |         | 'timePeriod' |
| priority   | Y        | &lt;auto&gt;  | determines priority ordering of styles |
| timePeriod |          |         | what time period to compare cell value to |
| style      |          |         | style structure to apply if the comparison returns true |

**Time Periods**

| Time Period       | Description |
| ----------------- | ----------- |
| lastWeek          | Apply format if cell value falls within the last week |
| thisWeek          | Apply format if cell value falls in this week |
| nextWeek          | Apply format if cell value falls in the next week |
| yesterday         | Apply format if cell value is equal to yesterday |
| today             | Apply format if cell value is equal to today |
| tomorrow          | Apply format if cell value is equal to tomorrow |
| last7Days         | Apply format if cell value falls within the last 7 days |
| lastMonth         | Apply format if cell value falls in last month |
| thisMonth         | Apply format if cell value falls in this month |
| nextMonth         | Apply format if cell value falls in next month |

## Outline Levels[⬆](#contents)<!-- Link generated with jump2header -->

Excel supports outlining; where rows or columns can be expanded or collapsed depending on what level of detail the user wishes to view.

Outline levels can be defined in column setup:
```javascript
worksheet.columns = [
  { header: 'Id', key: 'id', width: 10 },
  { header: 'Name', key: 'name', width: 32 },
  { header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1 }
];
```

Or directly on the row or column
```javascript
worksheet.getColumn(3).outlineLevel = 1;
worksheet.getRow(3).outlineLevel = 1;
```

The sheet outline levels can be set on the worksheet
```javascript
// set column outline level
worksheet.properties.outlineLevelCol = 1;

// set row outline level
worksheet.properties.outlineLevelRow = 1;
```

Note: adjusting outline levels on rows or columns or the outline levels on the worksheet will incur a side effect of also modifying the collapsed property of all rows or columns affected by the property change. E.g.:
```javascript
worksheet.properties.outlineLevelCol = 1;

worksheet.getColumn(3).outlineLevel = 1;
expect(worksheet.getColumn(3).collapsed).to.be.true;

worksheet.properties.outlineLevelCol = 2;
expect(worksheet.getColumn(3).collapsed).to.be.false;
```

The outline properties can be set on the worksheet

```javascript
worksheet.properties.outlineProperties = {
  summaryBelow: false,
  summaryRight: false,
};
```

## Images[⬆](#contents)<!-- Link generated with jump2header -->

Adding images to a worksheet is a two-step process.
First, the image is added to the workbook via the addImage() function which will also return an imageId value.
Then, using the imageId, the image can be added to the worksheet either as a tiled background or covering a cell range.

Note: As of this version, adjusting or transforming the image is not supported and images are not supported in streaming mode.

### Add Image to Workbook[⬆](#contents)<!-- Link generated with jump2header -->

The Workbook.addImage function supports adding images by filename or by Buffer.
Note that in both cases, the extension must be specified.
Valid extension values include 'jpeg', 'png', 'gif'.

```javascript
// add image to workbook by filename
const imageId1 = workbook.addImage({
  filename: 'path/to/image.jpg',
  extension: 'jpeg',
});

// add image to workbook by buffer
const imageId2 = workbook.addImage({
  buffer: fs.readFileSync('path/to.image.png'),
  extension: 'png',
});

// add image to workbook by base64
const myBase64Image = "data:image/png;base64,iVBORw0KG...";
const imageId2 = workbook.addImage({
  base64: myBase64Image,
  extension: 'png',
});
```

### Add image background to worksheet[⬆](#contents)<!-- Link generated with jump2header -->

Using the image id from Workbook.addImage, the background to a worksheet can be set using the addBackgroundImage function

```javascript
// set background
worksheet.addBackgroundImage(imageId1);
```

### Add image over a range[⬆](#contents)<!-- Link generated with jump2header -->

Using the image id from Workbook.addImage, an image can be embedded within the worksheet to cover a range.
The coordinates calculated from the range will cover from the top-left of the first cell to the bottom right of the second.

```javascript
// insert an image over B2:D6
worksheet.addImage(imageId2, 'B2:D6');
```

Using a structure instead of a range string, it is possible to partially cover cells.

Note that the coordinate system used for this is zero based, so the top-left of A1 will be { col: 0, row: 0 }.
Fractions of cells can be specified by using floating point numbers, e.g. the midpoint of A1 is { col: 0.5, row: 0.5 }.

```javascript
// insert an image over part of B2:D6
worksheet.addImage(imageId2, {
  tl: { col: 1.5, row: 1.5 },
  br: { col: 3.5, row: 5.5 }
});
```

The cell range can also have the property 'editAs' which will control how the image is anchored to the cell(s)
It can have one of the following values:

| Value     | Description |
| --------- | ----------- |
| undefined | It specifies the image will be moved and sized with cells |
| oneCell   | This is the default. Image will be moved with cells but not sized |
| absolute  | Image will not be moved or sized with cells |

```javascript
ws.addImage(imageId, {
  tl: { col: 0.1125, row: 0.4 },
  br: { col: 2.101046875, row: 3.4 },
  editAs: 'oneCell'
});
```

### Add image to a cell[⬆](#contents)<!-- Link generated with jump2header -->

You can add an image to a cell and then define its width and height in pixels at 96dpi.

```javascript
worksheet.addImage(imageId2, {
  tl: { col: 0, row: 0 },
  ext: { width: 500, height: 200 }
});
```

### Add image with hyperlinks[⬆](#contents)<!-- Link generated with jump2header -->

You can add an image with hyperlinks to a cell, and defines the hyperlinks in image range.

```javascript
worksheet.addImage(imageId2, {
  tl: { col: 0, row: 0 },
  ext: { width: 500, height: 200 },
  hyperlinks: {
    hyperlink: 'http://www.somewhere.com',
    tooltip: 'http://www.somewhere.com'
  }
});
```

## Sheet Protection[⬆](#contents)<!-- Link generated with jump2header -->

Worksheets can be protected from modification by adding a password.

```javascript
await worksheet.protect('the-password', options);
```

Worksheet protection can also be removed:

```javascript
worksheet.unprotect();
```


See <a href="#cell-protection">Cell Protection</a> for details on how
to modify individual cell protection.

**Note:** While the protect() function returns a Promise indicating
that it is async, the current implementation runs on the main
thread and will use approx 600ms on an average CPU. This can be adjusted
by setting the spinCount, which can be used to make the process either
faster or more resilient.

### Sheet Protection Options[⬆](#contents)<!-- Link generated with jump2header -->

| Field               | Default | Description |
| ------------------- | ------- | ----------- |
| selectLockedCells   | true    | Lets the user select locked cells |
| selectUnlockedCells | true    | Lets the user select unlocked cells |
| formatCells         | false   | Lets the user format cells |
| formatColumns       | false   | Lets the user format columns |
| formatRows          | false   | Lets the user format rows |
| insertRows          | false   | Lets the user insert rows |
| insertColumns       | false   | Lets the user insert columns |
| insertHyperlinks    | false   | Lets the user insert hyperlinks |
| deleteRows          | false   | Lets the user delete rows |
| deleteColumns       | false   | Lets the user delete columns |
| sort                | false   | Lets the user sort data |
| autoFilter          | false   | Lets the user filter data in tables |
| pivotTables         | false   | Lets the user use pivot tables |
| spinCount           | 100000  | The number of hash iterations performed when protecting or unprotecting |



## File I/O[⬆](#contents)<!-- Link generated with jump2header -->

### XLSX[⬆](#contents)<!-- Link generated with jump2header -->

#### Reading XLSX[⬆](#contents)<!-- Link generated with jump2header -->

Options supported when reading XLSX files.

| Field            |  Required   |    Type     |Description  |
| ---------------- | ----------- | ----------- | ----------- |
| ignoreNodes      |     N       |  Array      | A list of node names to ignore while loading the XLSX document. Improves performance in some situations. <br/> Available: `sheetPr`, `dimension`, `sheetViews `, `sheetFormatPr`, `cols `, `sheetData`, `autoFilter `, `mergeCells `, `rowBreaks`, `hyperlinks `, `pageMargins`, `dataValidations`, `pageSetup`, `headerFooter `, `printOptions `, `picture`, `drawing`, `sheetProtection`, `tableParts `, `conditionalFormatting`, `extLst`,|

```javascript
// read from a file
const workbook = new Excel.Workbook();
await workbook.xlsx.readFile(filename);
// ... use workbook


// read from a stream
const workbook = new Excel.Workbook();
await workbook.xlsx.read(stream);
// ... use workbook


// load from buffer
const workbook = new Excel.Workbook();
await workbook.xlsx.load(data);
// ... use workbook


// using additional options
const workbook = new Excel.Workbook();
await workbook.xlsx.load(data, {
  ignoreNodes: [
    'dataValidations' // ignores the workbook's Data Validations
  ],
});
// ... use workbook
```

#### Writing XLSX[⬆](#contents)<!-- Link generated with jump2header -->

```javascript
// write to a file
const workbook = createAndFillWorkbook();
await workbook.xlsx.writeFile(filename);

// write to a stream
await workbook.xlsx.write(stream);

// write to a new buffer
const buffer = await workbook.xlsx.writeBuffer();
```

### CSV[⬆](#contents)<!-- Link generated with jump2header -->

#### Reading CSV[⬆](#contents)<!-- Link generated with jump2header -->

Options supported when reading CSV files.

| Field            |  Required   |    Type     |Description  |
| ---------------- | ----------- | ----------- | ----------- |
| dateFormats      |     N       |  Array      | Specify the date encoding format of dayjs. |
| map              |     N       |  Function   | Custom Array.prototype.map() callback function for processing data. |
| sheetName        |     N       |  String     | Specify worksheet name. |
| parserOptions    |     N       |  Object     | [parseOptions options](https://c2fo.github.io/fast-csv/docs/parsing/options)  @fast-csv/format module to write csv data. |

```javascript
// read from a file
const workbook = new Excel.Workbook();
const worksheet = await workbook.csv.readFile(filename);
// ... use workbook or worksheet


// read from a stream
const workbook = new Excel.Workbook();
const worksheet = await workbook.csv.read(stream);
// ... use workbook or worksheet


// read from a file with European Dates
const workbook = new Excel.Workbook();
const options = {
  dateFormats: ['DD/MM/YYYY']
};
const worksheet = await workbook.csv.readFile(filename, options);
// ... use workbook or worksheet


// read from a file with custom value parsing
const workbook = new Excel.Workbook();
const options = {
  map(value, index) {
    switch(index) {
      case 0:
        // column 1 is string
        return value;
      case 1:
        // column 2 is a date
        return new Date(value);
      case 2:
        // column 3 is JSON of a formula value
        return JSON.parse(value);
      default:
        // the rest are numbers
        return parseFloat(value);
    }
  },
  // https://c2fo.github.io/fast-csv/docs/parsing/options
  parserOptions: {
    delimiter: '\t',
    quote: false,
  },
};
const worksheet = await workbook.csv.readFile(filename, options);
// ... use workbook or worksheet
```

The CSV parser uses [fast-csv](https://www.npmjs.com/package/fast-csv) to read the CSV file.
The formatterOptions in the options passed to the above write function will be passed to the @fast-csv/format module to write csv data.
 Please refer to the fast-csv README.md for details.

Dates are parsed using the npm module [dayjs](https://www.npmjs.com/package/dayjs).
 If a dateFormats array is not supplied, the following dateFormats are used:

* 'YYYY-MM-DD\[T\]HH:mm:ss'
* 'MM-DD-YYYY'
* 'YYYY-MM-DD'

Please refer to the [dayjs CustomParseFormat plugin](https://github.com/iamkun/dayjs/blob/HEAD/docs/en/Plugin.md#customparseformat) for details on how to structure a dateFormat.

#### Writing CSV[⬆](#contents)<!-- Link generated with jump2header -->

Options supported when writing to a CSV file.

| Field            |  Required   |    Type     | Description |
| ---------------- | ----------- | ----------- | ----------- |
| dateFormat       |     N       |  String     | Specify the date encoding format of dayjs. |
| dateUTC          |     N       |  Boolean    | Specify whether ExcelJS uses `dayjs.utc ()` to convert time zone for parsing dates. |
| encoding         |     N       |  String     | Specify file encoding format. (Only applies to `.writeFile`.) |
| includeEmptyRows |     N       |  Boolean    | Specifies whether empty rows can be written. |
| map              |     N       |  Function   | Custom Array.prototype.map() callback function for processing row values. |
| sheetName        |     N       |  String     | Specify worksheet name. |
| sheetId          |     N       |  Number     | Specify worksheet ID. |
| formatterOptions |     N       |  Object     | [formatterOptions options](https://c2fo.github.io/fast-csv/docs/formatting/options/) @fast-csv/format module to write csv data. |

```javascript

// write to a file
const workbook = createAndFillWorkbook();
await workbook.csv.writeFile(filename);

// write to a stream
// Be careful that you need to provide sheetName or
// sheetId for correct import to csv.
await workbook.csv.write(stream, { sheetName: 'Page name' });

// write to a file with European Date-Times
const workbook = new Excel.Workbook();
const options = {
  dateFormat: 'DD/MM/YYYY HH:mm:ss',
  dateUTC: true, // use utc when rendering dates
};
await workbook.csv.writeFile(filename, options);


// write to a file with custom value formatting
const workbook = new Excel.Workbook();
const options = {
  map(value, index) {
    switch(index) {
      case 0:
        // column 1 is string
        return value;
      case 1:
        // column 2 is a date
        return dayjs(value).format('YYYY-MM-DD');
      case 2:
        // column 3 is a formula, write just the result
        return value.result;
      default:
        // the rest are numbers
        return value;
    }
  },
  // https://c2fo.github.io/fast-csv/docs/formatting/options
  formatterOptions: {
    delimiter: '\t',
    quote: false,
  },
};
await workbook.csv.writeFile(filename, options);

// write to a new buffer
const buffer = await workbook.csv.writeBuffer();
```

The CSV parser uses [fast-csv](https://www.npmjs.com/package/fast-csv) to write the CSV file.
 The formatterOptions in the options passed to the above write function will be passed to the @fast-csv/format module to write csv data.
 Please refer to the fast-csv README.md for details.

Dates are formatted using the npm module [dayjs](https://www.npmjs.com/package/dayjs).
 If no dateFormat is supplied, dayjs.ISO_8601 is used.
 When writing a CSV you can supply the boolean dateUTC as true to have ExcelJS parse the date without automatically
 converting the timezone using `dayjs.utc()`.

### Streaming I/O[⬆](#contents)<!-- Link generated with jump2header -->

The File I/O documented above requires that an entire workbook is built up in memory before the file can be written.
 While convenient, it can limit the size of the document due to the amount of memory required.

A streaming writer (or reader) processes the workbook or worksheet data as it is generated,
 converting it into file form as it goes. Typically this is much more efficient on memory as the final
 memory footprint and even intermediate memory footprints are much more compact than with the document version,
 especially when you consider that the row and cell objects are disposed once they are committed.

The interface to the streaming workbook and worksheet is almost the same as the document versions with a few minor practical differences:

* Once a worksheet is added to a workbook, it cannot be removed.
* Once a row is committed, it is no longer accessible since it will have been dropped from the worksheet.
* unMergeCells() is not supported.

Note that it is possible to build the entire workbook without committing any rows.
 When the workbook is committed, all added worksheets (including all uncommitted rows) will be automatically committed.
 However in this case, little will have been gained over the Document version.

#### Streaming XLSX[⬆](#contents)<!-- Link generated with jump2header -->

##### Streaming XLSX Writer(#contents)<!-- Link generated with jump2header -->

The streaming XLSX workbook writer is available in the ExcelJS.stream.xlsx namespace.

The constructor takes an optional options object with the following fields:

| Field            | Description |
| ---------------- | ----------- |
| stream           | Specifies a writable stream to write the XLSX workbook to. |
| filename         | If stream not specified, this field specifies the path to a file to write the XLSX workbook to. |
| useSharedStrings | Specifies whether to use shared strings in the workbook. Default is `false`. |
| useStyles        | Specifies whether to add style information to the workbook. Styles can add some performance overhead. Default is `false`. |
| zip              | [Zip options](https://www.archiverjs.com/global.html#ZipOptions) that ExcelJS internally passes to [Archiver](https://github.com/archiverjs/node-archiver). Default is `undefined`. |

If neither stream nor filename is specified in the options, the workbook writer will create a StreamBuf object
 that will store the contents of the XLSX workbook in memory.
 This StreamBuf object, which can be accessed via the property workbook.stream, can be used to either
 access the bytes directly by stream.read() or to pipe the contents to another stream.

```javascript
// construct a streaming XLSX workbook writer with styles and shared strings
const options = {
  filename: './streamed-workbook.xlsx',
  useStyles: true,
  useSharedStrings: true
};
const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
```

In general, the interface to the streaming XLSX writer is the same as the Document workbook (and worksheets)
 described above, in fact the row, cell and style objects are the same.

However there are some differences...

**Construction**

As seen above, the WorkbookWriter will typically require the output stream or file to be specified in the constructor.

**Committing Data**

When a worksheet row is ready, it should be committed so that the row object and contents can be freed.
 Typically this would be done as each row is added...

```javascript
worksheet.addRow({
   id: i,
   name: theName,
   etc: someOtherDetail
}).commit();
```

The reason the WorksheetWriter does not commit rows as they are added is to allow cells to be merged across rows:

```javascript
worksheet.mergeCells('A1:B2');
worksheet.getCell('A1').value = 'I am merged';
worksheet.getCell('C1').value = 'I am not';
worksheet.getCell('C2').value = 'Neither am I';
worksheet.getRow(2).commit(); // now rows 1 and two are committed.
```

As each worksheet is completed, it must also be committed:

```javascript
// Finished adding data. Commit the worksheet
worksheet.commit();
```

To complete the XLSX document, the workbook must be committed. If any worksheet in a workbook are uncommitted,
 they will be committed automatically as part of the workbook commit.

```javascript
// Finished the workbook.
await workbook.commit();
// ... the stream has been written
```

##### Streaming XLSX Reader(#contents)<!-- Link generated with jump2header -->

The streaming XLSX workbook reader is available in the ExcelJS.stream.xlsx namespace.

The constructor takes a required input argument and an optional options argument:

| Argument              | Description |
| --------------------- | ----------- |
| input (required)      | Specifies the name of the file or the readable stream from which to read the XLSX workbook. |
| options (optional)    | Specifies how to handle the event types occuring during the read parsing. |
| options.entries       | Specifies whether to emit entries (`'emit'`) or not (`'ignore'`). Default is `'emit'`. |
| options.sharedStrings | Specifies whether to cache shared strings (`'cache'`), which inserts them into the respective cell values, or whether to emit them (`'emit'`) or ignore them (`'ignore'`), in both of which case the cell value will be a reference to the shared string's index. Default is `'cache'`. |
| options.hyperlinks    | Specifies whether to cache hyperlinks (`'cache'`), which inserts them into their respective cells, whether to emit them (`'emit'`) or whether to ignore them (`'ignore'`). Default is `'cache'`. |
| options.styles        | Specifies whether to cache styles (`'cache'`), which inserts them into their respective rows and cells, or whether to ignore them (`'ignore'`). Default is `'cache'`. |
| options.worksheets    | Specifies whether to emit worksheets (`'emit'`) or not (`'ignore'`). Default is `'emit'`. |

```js
const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader('./file.xlsx');
for await (const worksheetReader of workbookReader) {
  for await (const row of worksheetReader) {
    // ...
  }
}
```

Please note that `worksheetReader` returns an array of rows rather than each row individually for performance reasons: https://github.com/nodejs/node/issues/31979

###### Iterating over all events(#contents)<!-- Link generated with jump2header -->

Events on workbook are 'worksheet', 'shared-strings' and 'hyperlinks'. Events on worksheet are 'row' and 'hyperlinks'.

```js
const options = {
  sharedStrings: 'emit',
  hyperlinks: 'emit',
  worksheets: 'emit',
};
const workbook = new ExcelJS.stream.xlsx.WorkbookReader('./file.xlsx', options);
for await (const {eventType, value} of workbook.parse()) {
  switch (eventType) {
    case 'shared-strings':
      // value is the shared string
    case 'worksheet':
      // value is the worksheetReader
    case 'hyperlinks':
      // value is the hyperlinksReader
  }
}
```

###### Readable stream(#contents)<!-- Link generated with jump2header -->

While we strongly encourage to use async iteration, we also expose a streaming interface for backwards compatibility.

```js
const options = {
  sharedStrings: 'emit',
  hyperlinks: 'emit',
  worksheets: 'emit',
};
const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader('./file.xlsx', options);
workbookReader.read();

workbookReader.on('worksheet', worksheet => {
  worksheet.on('row', row => {
  });
});

workbookReader.on('shared-strings', sharedString => {
  // ...
});

workbookReader.on('hyperlinks', hyperlinksReader => {
  // ...
});

workbookReader.on('end', () => {
  // ...
});
workbookReader.on('error', (err) => {
  // ...
});
```

# Browser[⬆](#contents)<!-- Link generated with jump2header -->

A portion of this library has been isolated and tested for use within a browser environment.

Due to the streaming nature of the workbook reader and workbook writer, these have not been included.
Only the document based workbook may be used (see <a href="#create-a-workbook">Create a Workbook</a> for details).

For example code using ExcelJS in the browser take a look at the <a href="https://github.com/exceljs/exceljs/tree/master/spec/browser">spec/browser</a> folder in the github repo.

## Prebundled[⬆](#contents)<!-- Link generated with jump2header -->

The following files are pre-bundled and included inside the dist folder.

* exceljs.js
* exceljs.min.js

# Value Types[⬆](#contents)<!-- Link generated with jump2header -->

The following value types are supported.

## Null Value[⬆](#contents)<!-- Link generated with jump2header -->

Enum: Excel.ValueType.Null

A null value indicates an absence of value and will typically not be stored when written to file (except for merged cells).
  It can be used to remove the value from a cell.

E.g.

```javascript
worksheet.getCell('A1').value = null;
```

## Merge Cell[⬆](#contents)<!-- Link generated with jump2header -->

Enum: Excel.ValueType.Merge

A merge cell is one that has its value bound to another 'master' cell.
  Assigning to a merge cell will cause the master's cell to be modified.

## Number Value[⬆](#contents)<!-- Link generated with jump2header -->

Enum: Excel.ValueType.Number

A numeric value.

E.g.

```javascript
worksheet.getCell('A1').value = 5;
worksheet.getCell('A2').value = 3.14159;
```

## String Value[⬆](#contents)<!-- Link generated with jump2header -->

Enum: Excel.ValueType.String

A simple text string.

E.g.

```javascript
worksheet.getCell('A1').value = 'Hello, World!';
```

## Date Value[⬆](#contents)<!-- Link generated with jump2header -->

Enum: Excel.ValueType.Date

A date value, represented by the JavaScript Date type.

E.g.

```javascript
worksheet.getCell('A1').value = new Date(2017, 2, 15);
```

## Hyperlink Value[⬆](#contents)<!-- Link generated with jump2header -->

Enum: Excel.ValueType.Hyperlink

A URL with both text and link value.

E.g.
```javascript
// link to web
worksheet.getCell('A1').value = {
  text: 'www.mylink.com',
  hyperlink: 'http://www.mylink.com',
  tooltip: 'www.mylink.com'
};

// internal link
worksheet.getCell('A1').value = { text: 'Sheet2', hyperlink: '#\'Sheet2\'!A1' };
```

## Formula Value[⬆](#contents)<!-- Link generated with jump2header -->

Enum: Excel.ValueType.Formula

An Excel formula for calculating values on the fly.
  Note that while the cell type will be Formula, the cell may have an effectiveType value that will
  be derived from the result value.

Note that ExcelJS cannot process the formula to generate a result, it must be supplied.

Note that function semantic names must be in English and the separator must be a comma.

E.g.

```javascript
worksheet.getCell('A3').value = { formula: 'A1+A2', result: 7 };
worksheet.getCell('A3').value = { formula: 'SUM(A1,A2)', result: 7 };
```

Cells also support convenience getters to access the formula and result:

```javascript
worksheet.getCell('A3').formula === 'A1+A2';
worksheet.getCell('A3').result === 7;
```

### Shared Formula[⬆](#contents)<!-- Link generated with jump2header -->

Shared formulae enhance the compression of the xlsx document by decreasing the repetition
of text within the worksheet xml.
The top-left cell in a range is the designated master and will hold the
formula that all the other cells in the range will derive from.
The other 'slave' cells can then refer to this master cell instead of redefining the
whole formula again.
Note that the master formula will be translated to the slave cells in the usual
Excel fashion so that references to other cells will be shifted down and
to the right depending on the slave's offset to the master.
For example: if the master cell A2 has a formula referencing A1 then
if cell B2 shares A2's formula, then it will reference B1.

A master formula can be assigned to a cell along with the slave cells in its range

```javascript
worksheet.getCell('A2').value = {
  formula: 'A1',
  result: 10,
  shareType: 'shared',
  ref: 'A2:B3'
};
```

A shared formula can be assigned to a cell using a new value form:

```javascript
worksheet.getCell('B2').value = { sharedFormula: 'A2', result: 10 };
```

This specifies that the cell B2 is a formula that will be derived from the formula in
A2 and its result is 10.

The formula convenience getter will translate the formula in A2 to what it should be in B2:

```javascript
expect(worksheet.getCell('B2').formula).to.equal('B1');
```

Shared formulae can be assigned into a sheet using the 'fillFormula' function:

```javascript
// set A1 to starting number
worksheet.getCell('A1').value = 1;

// fill A2 to A10 with ascending count starting from A1
worksheet.fillFormula('A2:A10', 'A1+1', [2,3,4,5,6,7,8,9,10]);
```

fillFormula can also use a callback function to calculate the value at each cell

```javascript
// fill A2 to A100 with ascending count starting from A1
worksheet.fillFormula('A2:A100', 'A1+1', (row, col) => row);
```

### Formula Type[⬆](#contents)<!-- Link generated with jump2header -->

To distinguish between real and translated formula cells, use the formulaType getter:

```javascript
worksheet.getCell('A3').formulaType === Enums.FormulaType.Master;
worksheet.getCell('B3').formulaType === Enums.FormulaType.Shared;
```

Formula type has the following values:

| Name                       |  Value  |
| -------------------------- | ------- |
| Enums.FormulaType.None     |   0     |
| Enums.FormulaType.Master   |   1     |
| Enums.FormulaType.Shared   |   2     |

### Array Formula[⬆](#contents)<!-- Link generated with jump2header -->

A new way of expressing shared formulae in Excel is the array formula.
In this form, the master cell is the only cell that contains any information relating to a formula.
It contains the shareType 'array' along with the range of cells it applies to and the formula that will be copied.
The rest of the cells are regular cells with regular values.

Note: array formulae are not translated in the way shared formulae are.
So if master cell A2 refers to A1, then slave cell B2 will also refer to A1.

E.g.
```javascript
// assign array formula to A2:B3
worksheet.getCell('A2').value = {
  formula: 'A1',
  result: 10,
  shareType: 'array',
  ref: 'A2:B3'
};

// it may not be necessary to fill the rest of the values in the sheet
```

The fillFormula function can also be used to fill an array formula

```javascript
// fill A2:B3 with array formula "A1"
worksheet.fillFormula('A2:B3', 'A1', [1,1,1,1], 'array');
```


## Rich Text Value[⬆](#contents)<!-- Link generated with jump2header -->

Enum: Excel.ValueType.RichText

Rich, styled text.

E.g.
```javascript
worksheet.getCell('A1').value = {
  richText: [
    { text: 'This is '},
    {font: {italic: true}, text: 'italic'},
  ]
};
```

## Boolean Value[⬆](#contents)<!-- Link generated with jump2header -->

Enum: Excel.ValueType.Boolean

E.g.

```javascript
worksheet.getCell('A1').value = true;
worksheet.getCell('A2').value = false;
```

## Error Value[⬆](#contents)<!-- Link generated with jump2header -->

Enum: Excel.ValueType.Error

E.g.

```javascript
worksheet.getCell('A1').value = { error: '#N/A' };
worksheet.getCell('A2').value = { error: '#VALUE!' };
```

The current valid Error text values are:

| Name                           | Value       |
| ------------------------------ | ----------- |
| Excel.ErrorValue.NotApplicable | #N/A        |
| Excel.ErrorValue.Ref           | #REF!       |
| Excel.ErrorValue.Name          | #NAME?      |
| Excel.ErrorValue.DivZero       | #DIV/0!     |
| Excel.ErrorValue.Null          | #NULL!      |
| Excel.ErrorValue.Value         | #VALUE!     |
| Excel.ErrorValue.Num           | #NUM!       |

# Interface Changes[⬆](#contents)<!-- Link generated with jump2header -->

Every effort is made to make a good consistent interface that doesn't break through the versions but regrettably, now and then some things have to change for the greater good.

## 0.1.0[⬆](#contents)<!-- Link generated with jump2header -->

### Worksheet.eachRow[⬆](#contents)<!-- Link generated with jump2header -->

The arguments in the callback function to Worksheet.eachRow have been swapped and changed; it was function(rowNumber,rowValues), now it is function(row, rowNumber) which gives it a look and feel more like the underscore (_.each) function and priorities the row object over the row number.

### Worksheet.getRow[⬆](#contents)<!-- Link generated with jump2header -->

This function has changed from returning a sparse array of cell values to returning a Row object. This enables accessing row properties and will facilitate managing row styles and so on.

The sparse array of cell values is still available via Worksheet.getRow(rowNumber).values;

## 0.1.1[⬆](#contents)<!-- Link generated with jump2header -->

### cell.model[⬆](#contents)<!-- Link generated with jump2header -->

cell.styles renamed to cell.style

## 0.2.44[⬆](#contents)<!-- Link generated with jump2header -->

Promises returned from functions switched from Bluebird to native node Promise which can break calling code
 if they rely on Bluebird's extra features.

To mitigate this the following two changes were added to 0.3.0:

* A more fully featured and still browser compatible promise lib is used by default. This lib supports many of the features of Bluebird but with a much lower footprint.
* An option to inject a different Promise implementation. See <a href="#config">Config</a> section for more details.

# Config[⬆](#contents)<!-- Link generated with jump2header -->

ExcelJS now supports dependency injection for the promise library.
 You can restore Bluebird promises by including the following code in your module...

```javascript
ExcelJS.config.setValue('promise', require('bluebird'));
```

Please note: I have tested ExcelJS with bluebird specifically (since up until recently this was the library it used).
 From the tests I have done it will not work with Q.

# Caveats[⬆](#contents)<!-- Link generated with jump2header -->

## Dist Folder[⬆](#contents)<!-- Link generated with jump2header -->

Before publishing this module, the source code is transpiled and otherwise processed
before being placed in a dist/ folder.
This README identifies two files - a browserified bundle and minified version.
No other contents of the dist/ folder are guaranteed in any way other than the file
specified as "main" in the package.json


# Known Issues[⬆](#contents)<!-- Link generated with jump2header -->

## Testing with Puppeteer[⬆](#contents)<!-- Link generated with jump2header -->

The test suite included in this lib includes a small script executed in a headless browser
to validate the bundled packages. At the time of this writing, it appears that
this test does not play nicely in the Windows Linux subsystem.

For this reason, the browser test can be disabled by the existence of a file named .disable-test-browser

```bash
sudo apt-get install libfontconfig
```

## Splice vs Merge[⬆](#contents)<!-- Link generated with jump2header -->

If any splice operation affects a merged cell, the merge group will not be moved correctly

