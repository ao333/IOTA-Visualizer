const IOTA = require('iota.lib.js');

let iota = new IOTA({
  'host': 'http://node.deviceproof.org',
  'port': 14265
});

iota.api.getTransactionsObjects(['VCCEYLUOMZNQJCHUOLJOQSXFSUCNXEWPSBNZGYYMZHBNXUN9PNHYTJXODOPBYSUBQWRWAQXKINPHA9999'], function(error ,objs){
 console.log(objs);
});