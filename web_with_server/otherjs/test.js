/*
var request = require('request');

var command = {
  'command': 'findTransactions',
  'approvees': ['RVORZ9SIIP9RCYMREUIXXVPQIPHVCNPQ9HZWYKFWYWZRE9JQKG9REPKIASHUUECPSQO9JT9XNMVKWYGVAZETAIRPTM']
}

var options = {
  url: 'http://node01.iotatoken.nl:14265',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-IOTA-API-Version': '1',
    'Content-Length': Buffer.byteLength(JSON.stringify(command))
  },
  json: command
};

request(options, function (error, response, data) {
  if (!error && response.statusCode == 200) {
    console.log(data);
  }
});*/

const IOTA = require('iota.lib.js');

var iota = new IOTA({
  'host': 'http://node01.iotatoken.nl',
  'port': 14265
});

iota.api.getTransactionsObjects(["JW9YXMCNDEIKEK9ZXCZR9BVKIXFFMHNYMMKAHFWZBOBNLZGPJGZYBTSJJAITPEZIZZICSFDZJRTQZ9999","JIWLUPNTNWYDQEXXSCJRKDJQVTBEUNWIZESWAOQMALMIQZHWHMTXIOJVBEBQSSICFBNFEYNIEHKDZ9999"], function(error, new_nodes){
  console.log(error);
  console.log(new_nodes);
});