'use strict';

const crypto = require('crypto');

// Version 4 UUIDs, used for the x14Id attributes of conditional formatting
// extensions. Node has had randomUUID since 14.17; everywhere else — including
// the crypto-browserify shim the browser bundle relies on — we build the value
// from 16 random bytes ourselves.

function fromRandomBytes() {
  const bytes = crypto.randomBytes(16);

  // RFC 4122 section 4.4: pin the version to 4 and the variant to RFC 4122.
  /* eslint-disable no-bitwise */
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  /* eslint-enable no-bitwise */

  const hex = bytes.toString('hex');
  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
}

function v4() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return fromRandomBytes();
}

module.exports = {
  v4,
};
