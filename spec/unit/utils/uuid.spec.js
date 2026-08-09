const crypto = require('crypto');

const uuid = verquire('utils/uuid');

// Version 4, RFC 4122 variant: the 13th hex digit is 4 and the 17th is 8, 9, a or b
const V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('uuid', () => {
  it('generates version 4 uuids', () => {
    expect(uuid.v4()).to.match(V4);
  });

  it('does not repeat itself', () => {
    const values = new Set();
    for (let i = 0; i < 1000; i++) {
      values.add(uuid.v4());
    }
    expect(values.size).to.equal(1000);
  });

  describe('without crypto.randomUUID', () => {
    // The browser bundle runs against the crypto-browserify shim, which only
    // offers randomBytes. Node hides that path, so force it here.
    let randomUUID;

    beforeEach(() => {
      ({randomUUID} = crypto);
      delete crypto.randomUUID;
    });

    afterEach(() => {
      if (randomUUID) {
        crypto.randomUUID = randomUUID;
      }
    });

    it('builds version 4 uuids from random bytes', () => {
      expect(uuid.v4()).to.match(V4);
    });

    it('does not repeat itself', () => {
      const values = new Set();
      for (let i = 0; i < 1000; i++) {
        values.add(uuid.v4());
      }
      expect(values.size).to.equal(1000);
    });
  });
});
