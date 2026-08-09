// The library is CommonJS, and it assembles its export object at runtime with
// Object.assign. Node's cjs-module-lexer only reads static patterns, so it
// finds no named exports at all and `import {Workbook}` yields undefined —
// while index.d.ts promises that very import. Type-checking passes and the
// build fails, which is the worst way for a mismatch to be discovered.
//
// Listing the names here is the fix: an ES module that says what it exports,
// so no resolver has to infer anything. spec/end-to-end/module-exports.spec.js
// fails if this list ever drifts from what the CommonJS entry actually has.

import ExcelJS from './excel.js';

export const {
  Workbook,
  ModelContainer,
  stream,
  ValueType,
  FormulaType,
  RelationshipType,
  DocumentType,
  ReadingOrder,
  ErrorValue,
} = ExcelJS;

export default ExcelJS;
