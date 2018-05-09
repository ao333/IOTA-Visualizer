const IOTA = require('iota.lib.js');
const Source = require('./config_sour');

let iota = new IOTA({
  'host': Source.Source,
  'port': Source.Port
});

module.exports = iota;