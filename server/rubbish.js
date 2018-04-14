const iota = require('./config/config_iota');

// iota.api.getTips(function (error, tips) {
//   let tip = tips[100];
//   iota.api.getTransactionsObjects([tip], function (error, obj) {
//     console.log(obj[0]);
//   } );
// });
//
// iota.api.findTransactionObjects({"addresses" :
//     ['YQNVHBIDSLMQELEQVQXXLZOQIJUROPDHLRGNWMQQPFYSYFX9ZHMVNMUZWGVBNLTXAIWZNTVEQGMULGFD9']}, function(error, objs){
//   console.log(objs);
// })
//
// console.log(new Date(1522944066000));

// iota.api.getTips(function(error, tips){
//   iota.api.getTransactionsObjects([tips[48]], function(error, obj){
//     console.log(obj);
//   })
// });

iota.api.findTransactionObjects({'addresses':['OHBXNCIMPMJSUSYNT9CMFHKRCEUSAZLFDUWZMR9AWHWTDWMDFTURLUBQZUFGIPPUXZQCKVFHQGTBPMLRA']}, function(error, hashes){
  console.log(error);
  console.log(hashes);
});