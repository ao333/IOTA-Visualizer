const IOTA = require('iota.lib.js');

var iota = new IOTA({
  'host': 'http://146.169.47.20',
  'port': 14700
});

iota.api.getTips(function(error, alltips){
  console.log(alltips);
});

module.exports = iota;


