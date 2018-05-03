const IOTA = require('iota.lib.js');
const Source = require('./config_sour');

let iota = new IOTA({
  'host': Source.Source,
  'port': 14265
});

module.exports = iota;