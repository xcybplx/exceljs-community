const fs = require('fs');

const testXformHelper = require('../test-xform-helper');

const StylesXform = verquire('xlsx/xform/style/styles-xform');
const XmlStream = verquire('utils/xml-stream');

const expectations = [
  {
    title: 'Styles with fonts',
    create() {
      return new StylesXform();
    },
    preparedModel: require('./data/styles.1.1.json'),
    xml: fs.readFileSync(`${__dirname}/data/styles.1.2.xml`).toString(),
    get parsedModel() {
      return this.preparedModel;
    },
    tests: ['render', 'renderIn', 'parse'],
  },
];

describe('StylesXform', () => {
  testXformHelper(expectations);

  describe('quotePrefix', () => {
    it('Restores the flag from a parsed cellXfs entry', () => {
      const stylesXform = new StylesXform();
      stylesXform.model = {
        styles: [
          {numFmtId: 0, fontId: 0, fillId: 0, borderId: 0, xfId: 0, quotePrefix: true},
          {numFmtId: 0, fontId: 0, fillId: 0, borderId: 0, xfId: 0},
        ],
        fonts: [],
        borders: [],
        fills: [],
      };
      stylesXform.index = {model: [], numFmt: []};

      expect(stylesXform.getStyleModel(0).quotePrefix).to.equal(true);
      expect(stylesXform.getStyleModel(1).quotePrefix).to.be.undefined();
    });
  });

  describe('As StyleManager', () => {
    it('Reuses one cellXfs entry for repeated quotePrefix styles', () => {
      const stylesXform = new StylesXform(true);
      const before = stylesXform.model.styles.length;

      const first = stylesXform.addStyleModel({quotePrefix: true});
      const second = stylesXform.addStyleModel({quotePrefix: true});

      expect(second).to.equal(first);
      expect(stylesXform.model.styles.length).to.equal(before + 1);
      expect(stylesXform.model.styles[first]).to.contain('quotePrefix="1"');
    });

    it('Keeps quotePrefix styles apart from otherwise identical ones', () => {
      const stylesXform = new StylesXform(true);

      const quoted = stylesXform.addStyleModel({quotePrefix: true});
      const plain = stylesXform.addStyleModel({});

      expect(plain).to.not.equal(quoted);
      expect(stylesXform.model.styles[plain]).to.not.contain('quotePrefix');
    });

    it('Renders empty model', () => {
      const stylesXform = new StylesXform(true);
      const expectedXml = fs
        .readFileSync(`${__dirname}/data/styles.2.2.xml`)
        .toString();

      const xmlStream = new XmlStream();
      stylesXform.render(xmlStream);

      expect(xmlStream.xml).xml.to.equal(expectedXml);
    });
  });
});
