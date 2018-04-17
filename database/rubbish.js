const iota = require('./config/config_iota');
const driver = require('./config/config_neo4j');
const clearRequire = require('clear-require');

// iota.api.getTips(function (error ,tips) {
//   iota.api.getTransactionsObjects([tips[0]], function (error, objs) {
//     console.log(objs[0])
//   })
// });
// let session = driver.session();
// session.run(`MATCH (n) DETACH DELETE n`)
//   .then(function(result){
//     console.log(result);
//     session.close();
//   })
//   .catch(function(error){
//     console.log(error);
//     session.close();
//   });
updateMeanCon();

function updateMeanCon(callback){
  let session = driver.session();
  session.run('MATCH (n:confirmed) WHERE n.confirmTime <> 0 RETURN toString(n.confirmTime) AS n1, ' +
    'toString(n.attachmentTimestamp) AS n2 ORDER BY n.confirmTime DESC LIMIT 30')
    .then(function (result) {
      let sum = 0;
      let amount = 0;
      result.records.forEach(function (record) {
        sum += Number(record.toObject().n1) -  Number(record.toObject().n2)*1000;
        console.log(sum);
        amount++;
      });
      if(amount !== 0){
        let minute = sum / amount / 1000 / 60;
        console.log(minute);
        return;
        Statistics.findOne({}, function (error, doc) {
          if(error) {
            callback(error);
            session.close();
            return;
          }
          if(!doc){
            callback(1);
            session.close();
            return;
          }
          doc['MeanConTime'] = minute;
          doc.save(function (error, aa) {
            if(error) {
              callback(error);
              session.close();
              return;
            }
            callback(null);
            session.close();
          })
        });
      }else{
        callback(null);
      }
    })
    .catch(function (error) {
      callback(error);
      session.close();
    })
}
