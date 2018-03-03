//This file is used to organize what this server does

const STATE = require('./models/state');
const query_interval = require('./otherjs/query_interval');
const update_users = require('./otherjs/updateUsers');
const calculateStat = require('./otherjs/calculateStat');
const IOTAes = require('./models/iotaes');

const Track_tree = require('./models/track_tree');
const Track_sphere = require('./models/track_sphere');

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

  //update Mean confirmation time every 3 minutes
  setInterval(calculateStat.getTranserPerSecond, 300000);

  //we will update our initial information sent to the users every one hour

 setInterval(function(){
   query_interval();
}, 3600000);

 // goes through to update all current users looking our website every 10 seconds
 setInterval(function () {
   update_users(Track_tree);
 }, 20000);
 setInterval(function () {
   update_users(Track_sphere)
 }, 25000)
}



module.exports = organize;