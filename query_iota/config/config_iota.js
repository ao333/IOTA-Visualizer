const IOTA = require('iota.lib.js');

let iota = new IOTA({
  'host': 'http://node02.iotatoken.nl',
  'port': 14265
});

module.exports = iota;
