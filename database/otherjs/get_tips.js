const IOTA = require('iota.lib.js');

var iota = new IOTA({
  'host': 'http://node02.iotatoken.nl',
  'port': 14265
});

module.exports = iota;


