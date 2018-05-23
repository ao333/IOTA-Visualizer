const IOTA = require('iota.lib.js');

let iota = new IOTA({
  'host': 'https://turnip.iotasalad.org',
  'port': 14265
});

module.exports = iota;