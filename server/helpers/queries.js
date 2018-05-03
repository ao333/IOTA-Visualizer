/*
  This file defined functions that are used to query data from IOTA API
 */

const iota = require('../config/config_iota');

/**
 * To determine the states (tip, unconfirmed, confirmed) of hashes given
 * @param hashes
 * @param callback
 * callback(error, states); (states are returned values in the form of array)
 */
function determineState(hashes, callback){
  let states = Array(hashes.length).fill('tip');
  iota.api.getLatestInclusion(hashes, function(error, results){
    if(error){
      callback(error, null);
      return;
    }
    for(let i = 0; i < results.length; i++){
      if(results[i])
        states[i] = 'confirmed';
    }
    let index = hashes.indexOf("999999999999999999999999999999999999999999999999999999999999999999999999999999999");
    if(index >= 0){
      hashes.splice(index, 1);
      states.splice(index, 1);
    }
    iota.api.findTransactionObjects({'approvees': hashes},function (error, results) {
      if(error){
        callback(error, null);
        return;
      }
      let potential_unconfirms = [];
      for(let i = 0; i < results.length; i++){
        potential_unconfirms.push(results[i].trunkTransaction);
        potential_unconfirms.push(results[i].branchTransaction);
      }
      for(let i = 0; i < hashes.length; i++){
        if(potential_unconfirms.indexOf(hashes[i]) >= 0 && states[i] !== 'confirmed'){
          states[i] = "unconfirmed";
        }
      }
      if(index >= 0){
        states.splice(index, 0, 'unconfirmed');
      }
      callback(null, states);
    })
  });
}

module.exports = {
  determineState
};