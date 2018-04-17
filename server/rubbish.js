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
//

function initialString(num){
  return 'MATCH (tip:tip) WITH tip LIMIT ' +  num +  ' MATCH (tip)-[CONFIRMS]->(trans) WITH tip, ' +
    'trans MATCH (trans)-[CONFIRMS]->(trans2) WITH tip, trans,trans2 ' +
    'MATCH (trans2)-[CONFIRMS]->(trans3) ' +
    'WITH COLLECT(tip) + COLLECT(trans)+ COLLECT(trans2)+ COLLECT(trans3) ' +
    'AS items UNWIND items AS item ' +
    'return distinct item'
}

let driver = require('./config/config_neo4j')
let session = driver.session();
session
  .run(initialString(10))
  .then(function (result) {
    result.records.forEach(function (record) {
      let obj = Object.assign({}, record.toObject().item.properties);
      obj.type = record.toObject().item.labels;
      console.log(obj.type);
    });
    session.close();
  })
  .catch(function (error) {
    console.log(error);
  });

// iota.api.findTransactionObjects({'addresses':['OHBXNCIMPMJSUSYNT9CMFHKRCEUSAZLFDUWZMR9AWHWTDWMDFTURLUBQZUFGIPPUXZQCKVFHQGTBPMLRA']}, function(error, hashes){
//   console.log(error);
//   console.log(hashes);
// });