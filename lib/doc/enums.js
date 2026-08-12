'use strict';

module.exports = {
  ValueType: {
    Null: 0,
    Merge: 1,
    Number: 2,
    String: 3,
    Date: 4,
    Hyperlink: 5,
    Formula: 6,
    SharedString: 7,
    RichText: 8,
    Boolean: 9,
    Error: 10,
  },
  FormulaType: {
    None: 0,
    Master: 1,
    Shared: 2,
  },
  RelationshipType: {
    None: 0,
    OfficeDocument: 1,
    Worksheet: 2,
    CalcChain: 3,
    SharedStrings: 4,
    Styles: 5,
    Theme: 6,
    Hyperlink: 7,
  },
  DocumentType: {
    Xlsx: 1,
  },
  ReadingOrder: {
    LeftToRight: 1,
    RightToLeft: 2,
  },
  ErrorValue: {
    NotApplicable: '#N/A',
    Ref: '#REF!',
    Name: '#NAME?',
    DivZero: '#DIV/0!',
    Null: '#NULL!',
    Value: '#VALUE!',
    Num: '#NUM!',
  },
  // The codes Excel writes into pageSetup, and the subset index.d.ts has always
  // named. They lived only in the type declarations until 5.1.0, as a const
  // enum, which meant no consumer compiling with isolatedModules could read
  // them at all. spec/end-to-end/module-exports.spec.js keeps the two lists
  // together from now on.
  PaperSize: {
    Legal: 5,
    Executive: 7,
    A4: 9,
    A5: 11,
    B5: 13,
    Envelope_10: 20,
    Envelope_DL: 27,
    Envelope_C5: 28,
    Envelope_B5: 34,
    Envelope_Monarch: 37,
    Double_Japan_Postcard_Rotated: 82,
    K16_197x273_mm: 119,
  },
};
