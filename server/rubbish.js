const IOTA = require('iota.lib.js');

let iota = new IOTA({
  'host': 'http://node01.iotatoken.nl',
  'port': 14265
});

iota.api.getNodeInfo(function(error, success) {
  if (error) {
    console.error(error);
  } else {
    console.log(success);
  }
});