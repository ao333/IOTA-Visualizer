const IOTA = require('iota.lib.js');

let iota = new IOTA({
  'host': 'http://146.169.47.20',
  'port': 14700
});

iota.api.getTips(function(error, tips){
  console.log(error,tips);
});