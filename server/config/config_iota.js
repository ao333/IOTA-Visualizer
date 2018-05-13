const IOTA = require('iota.lib.js');

let iota = new IOTA({
  'host': 'http://node.deviceproof.org',
  'port': 14265
});

module.exports = iota;