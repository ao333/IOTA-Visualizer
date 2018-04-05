/*
  This file defined functions that are used to query data from IOTA API
 */

const iota = require('../config/config_iota');
const utils = require('./utils');

/**
 * get {amount} number of tips, tips are returned in form of array of hashes
 * callback(error, tips)
 * @param amount
 * @param callback
 */
function getTips(amount, callback){
  //query tips using iota api
  iota.api.getTips(function (error, tips){
    if(error){
      callback(error,null);
    }else{
      let real_amount = tips.length;
      if(amount)
        real_amount = Math.min(real_amount, amount);
      let result = utils.getArrayItems(tips, real_amount);
      callback(null, result);
    }
  });
}

/**
 * add transactions specified by {hash} with type {tip} into {final_results} array.
 * This function is prepared(called) for function getInitialDataToShow(callback).
 * @param hash
 * @param final_results
 * @param type
 * @param callback1
 * @param callback2
 */
function addTransactionsIntoArray(hash, final_results, type, callback1, callback2) {
  iota.api.getTransactionsObjects(hash, function (error, tip_objects) {
    if(error){
      callback2(error, null);
      return;
    }
    let final_results_db = utils.extractDataForDb(tip_objects, type);
    final_results.push(...final_results_db);
    let branch_and_trunk = utils.getBranchAndTrunckHash(tip_objects);
    callback1(final_results, branch_and_trunk);
  });
}


/**
 * This is function is used to query initial data so that later we could store these data into database
 * We will get tips and transactions these tips confirm, repeat this three cycles.
 * @param callback
 *  callback(error, data)
 */
function getInitialDataToShow(callback) {
  getTips(20, function (error, tips) { //choose 65 tips initially
    if(error)
      callback(error, null);
    else{
      let final_results = [];
      addTransactionsIntoArray(tips, final_results, 'tip', function (final_results, branch_and_trunk) {
        addTransactionsIntoArray(branch_and_trunk, final_results, 'unconfirmed', function (final_results, branch_and_trunk) {
          addTransactionsIntoArray(branch_and_trunk, final_results, 'unconfirmed', function (final_results, branch_and_trunk) {
            addTransactionsIntoArray(branch_and_trunk, final_results, 'unconfirmed', function (final_results) {
              final_results = utils.deleteDuplicates(final_results);
              callback(null, final_results);
            }, callback);
          }, callback);
        }, callback);
      }, callback);
    }
  });
}

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
  getInitialDataToShow,
  determineState
};