const IOTA = require('iota.lib.js');

let iota = new IOTA({
  'host': 'http://mainnet.necropaz.com',
  'port': 14500
});

iota.api.getTransactionsObjects(['VCCEYLUOMZNQJCHUOLJOQSXFSUCNXEWPSBNZGYYMZHBNXUN9PNHYTJXODOPBYSUBQWRWAQXKINPHA9999'], function(error ,objs){
 console.log(objs);
});