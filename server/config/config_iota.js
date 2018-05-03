/**
 * connection information for IOTA API
 * @type {IOTA}
 */

const IOTA = require('iota.lib.js');

let iota = new IOTA({
  'host': 'http://node01.iotatoken.nl',
  'port': 14265
});

module.exports = iota;