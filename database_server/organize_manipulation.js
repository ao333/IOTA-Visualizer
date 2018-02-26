//This file is used to organize what this server does

const STATE = require('./models/state');
const query_interval = require('./otherjs/query_interval');
const update_users = require('./otherjs/updateUsers');
const calculateStat = require('./otherjs/calculateStat');
const IOTAes = require('./models/iotaes');

function organize(){
  // we will update all unchecked tips every half day and check and update every 10 seconds
  // to calculate mean confirmation time
  setInterval(function(){
    STATE.remove({}).then(calculateStat.createUnfinished);
  }, 43200000);
  setInterval(calculateStat.updateMeanCon, 10500);
  setInterval(calculateStat.checkFinished, 10100);

  //we will update current tips every 5 seconds;
  setInterval(calculateStat.getTips, 5000);
  IOTAes.remove({}).then(function(){
    query_interval();
  });

  //we will update our initial information sent to the users every one hour

 setInterval(function(){
   IOTAes.remove({}).then(function () {
     query_interval();
   });
}, 3600000);

 // goes through to update all current users looking our website every 10 seconds
 setInterval(update_users, 10000);
}



module.exports = organize;