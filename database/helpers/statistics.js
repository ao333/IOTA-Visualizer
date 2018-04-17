/*
  This file defines all functions that calculate statistics and store statistics into MongoDb
 */

const driver = require('../config/config_neo4j');
const Statistics = require('../models/Statistics');
const iota = require('../config/config_iota');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Record = require('../models/Record');

/**
 * update mean confirmation time
 * @param callback
 */
function updateMeanCon(callback){
  let session = driver.session();
  session.run('MATCH (n:confirmed) WHERE n.confirmTime <> 0 RETURN toString(n.confirmTime) AS n1, ' +
    'toString(n.attachmentTimestamp) AS n2 ORDER BY n.confirmTime DESC LIMIT 30')
    .then(function (result) {
      let sum = 0;
      let amount = 0;
      result.records.forEach(function (record) {
        sum += Number(record.toObject().n1) -  Number(record.toObject().n2*1000);
        amount++;
      });
      if(amount !== 0){
        let minute = sum / amount / 1000 / 60;
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

/**
 * update amount of tips
 * @param callback
 */
function updateTips(callback){
  iota.api.getTips(function(error, alltips){
    if(error){
      callback(error);
      return;
    }
    Statistics.findOne({}, function (error, doc) {
      if(error){
        callback(error);
        return;
      }
      if(alltips && doc){
        doc["TotalTips"] = alltips.length;
        doc.save(function (error, aa) {
          if(error){
            callback(error);
            return;
          }
          callback(null);
        })
      }
    })
  });
}

/**
 * update value per second
 * @param callback
 */
function updateValuePerSecond(callback){
  let session = driver.session();
  session
    .run('MATCH (tran) RETURN tran.value as n1, toString(tran.attachmentTimestamp) ' +
      'AS n2 ORDER BY tran.attachmentTimestamp DESC LIMIT 200')
    .then(function (result) {
      let latest_time = Number.MAX_SAFE_INTEGER;
      let earliest_time = -1;
      let sum = 0;
      let total_amount = 0;
      let non_zero_amount = 0;
      result.records.forEach(function (record) {
        total_amount++;
        if(record.toObject().n1> 0){
          non_zero_amount++;
          sum += record.toObject().n1;
          if(Number(record.toObject().n2) > latest_time)
            latest_time = Number(record.toObject().n2);
          else if(Number(record.toObject().n2) < earliest_time)
            earliest_time = Number(record.toObject().n2);
        }
      });
      let meanPerSecond;
      let non_zero_percent;
      let valuePerTran;
      if(latest_time - earliest_time !== 0)
        meanPerSecond = sum / ((latest_time - earliest_time)/1000);
      else
        meanPerSecond = 0;
      if(total_amount !== 0)
        non_zero_percent = non_zero_amount / total_amount;
      else
        non_zero_percent = 0;
      if(non_zero_amount !== 0)
        valuePerTran = sum / non_zero_amount;
      else
        valuePerTran = 0;
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
        if(meanPerSecond !== 0)
          doc["ValuePerSec"] = meanPerSecond;
        if(non_zero_percent !== 0)
          doc["Non_value_Percent"] = non_zero_percent;
        if(valuePerTran !== 0)
          doc["ValuePerTran"] = valuePerTran;
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
    })
    .catch(function (error) {
      session.close();
      callback(error);
    });
}

/**
 * put newly confirmed transaction into MongoDb
 * @param update_transactions
 */
// function extractConfirmed(update_transactions) {
//   if(update_transactions.length === 0)
//     return;
//   let session = driver.session();
//   let query_string = update.queryTransactionsFromHashString(update_transactions);
//   let transactions = [];
//   session
//     .run(query_string)
//     .then(function (result) {
//       result.records.forEach(function (record) {
//         if(record.toObject().tran.labels[0] === "confirmed"){
//           let obj = {};
//           obj.create_time = record.toObject().tran.properties.create_time;
//           obj.confirm_time = record.toObject().tran.properties.time;
//           transactions.push(obj);
//         }
//       });
//       if(transactions.length > 0){
//         ConfirmTime.create(transactions, function (error, doc) {
//           if(error){
//             console.log(error);
//             session.close();
//           }else{
//           }
//         })
//       }
//     })
//     .catch(function (error) {
//       session.close();
//       console.log(error);
//     });
// }

function updatePrice(callback){
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let price = JSON.parse(xhttp.responseText).GBP;
      Statistics.findOne({}, function (error, doc) {
        if(error) {
          callback(error);
          return;
        }
        if(!doc){
          callback(1);
          return;
        }
          doc["Price"] = price;
          doc.save(function (error, aa) {
            if(error){
              callback(error);
              return;
            }
            callback(null);
          })
      })
    }
  };
  xhttp.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=IOTA&tsyms=GBP", true);
  xhttp.send();
}

function copyAndStore(callback){
  Statistics.findOne({},function (error, doc) {
    let new_record = {
      MeanConTime: doc.MeanConTime,
      ValuePerSec: doc.ValuePerSec,
      Non_value_Percent: doc.Non_value_Percent,
      ValuePerTran: doc.ValuePerTran
    };
    Record.create(new_record, function (error, suc) {
      if(error){
        callback(error);
        return;
      }
      callback(null);
    })
  })
}

module.exports = {
  updateMeanCon,
  updateTips,
  updateValuePerSecond,
  updatePrice,
  copyAndStore
};