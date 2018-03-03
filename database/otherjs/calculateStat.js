/**
 * This file is used to calculate all required statistics that will be displayed in website
 */
const states = require('../models/state');
const STATs = require('../models/statistics');
const iota = require("./get_tips");

/**
 * create all tips we can detect right now. Later on we will monitor these tips to see
 * how long it will take for them to become confirmed
 */
function createUnfinished(){
  iota.api.getTips(function(error, alltips){
    if(!alltips) console.log(error);
    else{
      let notFinished = [];
      for(let i = 0; i < alltips.length; i++){
        let obj = {};
        obj["createtime"] = Date.now();
        obj["hash"] = alltips[i];
        notFinished.push(obj);
      }
      //store all elements in notFinished in states collection of database
      states.create({notFinished: notFinished}, function(error, docs){
        if(error) console.log(error);
      });
    }
  });
}

/**
 * check if some of the tips are confirmed
 */
function checkFinished() {
  states.findOne({}, function(error, doc){
    if(error) console.log(error);
    if(doc){
      var notfinished = doc["notFinished"];
      let allhashes = [];
      for(let i = 0; i < notfinished.length; i++){
        allhashes.push(notfinished[i]["hash"]);
      }
      iota.api.getLatestInclusion(allhashes, function(error, values){
        if(error) console.log(error);
        if(values){
          for(let i = 0; i < values.length; i++){
            if(values[i]){
              let obj = {};
              obj["createtime"] = notfinished[i]["createtime"];
              obj["finishtime"] = Date.now();
              doc["Finished"].push(obj);
              //delete tip which is confirmed in notFinished array in database collection
              notfinished.splice(i,1);
              values.splice(i,1);
              i--;
            }
          }
          doc.save(function(error, status){
            if(error) console.log(error);
          })
        }
      });
    }
  });
}

/**
 * calcualte mean confirmation time
 */
function updateMeanCon(){
  states.findOne({}, function (error, doc) {
    if(error) console.log(error);
    if(doc){
      let updateArray = doc["Finished"];
      let n = updateArray.length;
      let sum = 0;
      for(let i = 0; i < n; i++){
        sum = sum + updateArray[i]["finishtime"] - updateArray[i]["createtime"];
      }
      let average;
      let minites;
      if(n === 0)
        minites = 0;
      else{
        average = sum / n;
        minites = average/1000/60;
      }
      STATs.findOne({}, function (error, doc) {
        if(error) console.log(error);
        if(doc){
          doc["MeanConTime"] = minites;
          doc.save(function (error, aa) {
            if(error) console.log(error)
          })
        }
      });
    }
  })
}

/**
 * store number of tips we can detect in current network
 */
function getTips(){
  iota.api.getTips(function(error, alltips){
    STATs.findOne({}, function (error, doc) {
      if(error) console.log(error);
      if(alltips){
        doc["TotalTips"] = alltips.length;
        doc.save(function (error, aa) {
          if(error) console.log(error)
        })
      }
    })
  });
}

function getTranserPerSecond(){
  iota.api.getTips(function(error, alltips){
    iota.api.getTransactionsObjects(alltips, function(error, objs){
      let totalValue = 0;
      let mintime = objs[0].timestamp;
      let maxtime = objs[0].timestamp;
      for(let i = 0; i < objs.length; i++){
        if(objs[i].value > 0){
          totalValue = totalValue + objs[i].value;
          if(objs[i].timestamp > maxtime)
            maxtime = objs[i].timestamp;
          if(objs[i].timestamp < mintime)
            mintime = objs[i].timestamp;
        }
      }
      let meanPerSecond = totalValue / ((maxtime - mintime)/1000);
      STATs.findOne({}, function (error, doc) {
        if(error) console.log(error);
        if(doc){
          doc["ValuePerSec"] = meanPerSecond;
          doc.save(function (error, aa) {
            if(error) console.log(error)
          })
        }
      });
    })
  });
}

module.exports = {
  checkFinished,
  createUnfinished,
  updateMeanCon,
  getTips,
  getTranserPerSecond
};
