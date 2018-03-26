/*
  This file defines all functions that manipulate Neo4j database
 */

const driver = require('../config/config_neo4j');
const queries = require('./queries');
const iota = require('../config/config_iota');
const utils = require('./utils');

/**
 * return query statement that will query all transactions with hashes given in {hashes}
 * @param hashes
 * @returns {string}
 */
function queryTransactionsFromHashString(hashes){
  let result = 'MATCH (tran) WHERE ';
  for(let i = 0; i < hashes.length; i++){
    if(i === 0)
      result = result + ' tran.hash = ' + '"' + hashes[i] + '" ';
    else
      result = result + ' OR tran.hash = ' + '"' + hashes[i]+ '" ';
  }
  result = result + ' RETURN tran';
  return result;
}


/**
 * return query statement that insert transactions given in {arr} into database
 * @param arr
 * @returns {string}
 */
function addTransactionsIntoDbString(arr){
  let result = 'CREATE ';
  // add all transactions
  for(let i = 0; i < arr.length; i++){
    result = result + `(${'a' + i}:${arr[i].type}{hash:"${arr[i].this_hash}", 
    trunkTransaction: "${arr[i].trunkTransaction}", time: timestamp(), create_time: ${arr[i].create_time}, 
    branchTransaction:"${arr[i].branchTransaction}", address:"${arr[i].address}", value:${arr[i].value}})`;
    if(i !== arr.length - 1){
      result = result + ', ';
    }
  }
  return result;
}


/**
 * return query statement that update relations in the database
 * @returns {string}
 */
function updateNewRelationsString(){
  return 'MATCH (tran) WITH tran ' +
    'MATCH (tran1) WHERE tran1.hash = tran.branchTransaction OR tran1.hash = tran.trunkTransaction ' +
    'MERGE (tran)-[:CONFIRMS]->(tran1)';
}


/**
 * return query statement to update states for transactions already stored in database
 * @param hashes
 * @param states
 * @param oldstates
 * @returns {string}
 */
function updateStateOfHashString(hashes, states, oldstates){
  let result_firsthalf = '';
  let result_lashhalf = '';
  let current_index = '';
  current_index ='a0'; // what is current update index, from 0
  for(let i = 0; i < hashes.length; i++){
    if(i)
      current_index = current_index + ', a' + i;
    if(i!==hashes.length-1)
      result_firsthalf = result_firsthalf + `MATCH (${'a' + i} {hash : "${hashes[i]}"}) WITH ${current_index} `;
    else
      result_firsthalf = result_firsthalf + `MATCH (${'a' + i} {hash : "${hashes[i]}"}) `;
    //first remove old labels, then add new labels
    result_lashhalf = result_lashhalf + `REMOVE ${'a' + i} : ${oldstates[i]} 
    SET ${'a' + i} : ${states[i]}  SET ${'a' + i}.time = timestamp()   `;
  }
  return result_firsthalf + result_lashhalf;
}

/**
 * This is initialization step. We store around 200 transactions into database
 * @param callback
 * @constructor
 */
function InitialDataIntoDb(callback){
  let session = driver.session();
  session
  // for initialization step, we need to delete all data firstly
    .run('MATCH (n)' +
      'DETACH DELETE n')
    .then(function () {
      queries.getInitialDataToShow(function (error, data) {
        if(error){
          callback(error,null);
          return;
        }
        let result = addTransactionsIntoDbString(data);
        session
          .run(result)
          .then(function () {
            session
              .run(updateNewRelationsString())
              .then(function () {
                session.close();
                callback(null, true);
              })
              .catch(function (error) {
                session.close();
                callback(error, null);
              });
          })
          .catch(function (error) {
            session.close();
            callback(error, null);
          });
      });
    })
    .catch(function (error) {
      session.close();
      callback(error, null);
    });
}



/**
 * update the states of transactions in database
 * @param callback
 * @constructor
 */
function UpdateDb(callback){
  let session = driver.session();
  session
    // first get all transactions that are likely to be updated (these are tips and unconfirmed)
    .run('MATCH (trans:unconfirmed) RETURN trans UNION MATCH (trans:tip) RETURN trans')
    .then(function (result) {
      let hashes = [];
      let states = [];
      result.records.forEach(function (record) {
        //extract hashes and labels(states)
        states.push(record.toObject().trans.labels[0]);
        hashes.push(record.toObject().trans.properties.hash);
      });
      // get new states of transactions specified by {hashes}
      queries.determineState(hashes, function (error, _states) {
        if(error || !_states){
          callback(error, null);
          session.close();
          return;
        }
        let to_update_hashes = [];
        let to_update_states = [];
        let to_update_oldstates=[];
        for(let i = 0; i < _states.length; i++){
          if(states[i] != _states[i]){
            to_update_hashes.push(hashes[i]);
            to_update_states.push(_states[i]);
            to_update_oldstates.push(states[i]);
          }
        }
        let query_string = updateStateOfHashString(to_update_hashes, to_update_states,to_update_oldstates);
        if(query_string){
          session
            .run(query_string)
            .then(function () {
              session.close();
              callback(null,to_update_hashes);
            })
            .catch(function (error) {
              callback(error, null);
            });
        }else{
          session.close();
          callback(null,[]);
        }
      });
    })
    .catch(function (error) {
      session.close();
      callback(error, null);
    });
}

/**
 * add some transactions into current database. can choose to add type 'tip' or type 'unconfirmed'
 * The transactions added will be approvees of the transaction specified by tip or unconfirmed
 * @param type
 * @param callback
 */
function addMoreTransactionsIntodb(type, callback){
  let session = driver.session();
  let limit = '';
  // if type is 'unconfirmed' we just choose one unconfimred transaction.
  // Otherwise, we will add lots of transactions
  if(type === 'unconfirmed')
    limit += 'ORDER BY number LIMIT 1';
  let old_hashes = [];
  session
    .run('MATCH (tran) RETURN tran.hash') // get all hashses, this is to make sure we will not add repeated node
    .then(function (result) {
      result.records.forEach(function (record) {
        old_hashes.push(record.get('tran.hash'));
      });
      session
      // first get all transactions that are likely to be updated
        .run('MATCH (tran:'+ type +') WITH tran, rand() AS number RETURN tran ' + limit)
        .then(function (result) {
          let hashes = [];
          result.records.forEach(function (record) {
            hashes.push(record.get('tran').properties.hash);
          });
          // get approvees of transactions specified by hashes
          let index = hashes.indexOf("999999999999999999999999999999999999999999999999999999999999999999999999999999999");
          hashes.splice(index,1);
          iota.api.findTransactionObjects({'approvees': hashes},function (error, results) {
            if(error){
              session.close();
              callback(error, null);
              return;
            }
            let transactions = utils.extractDataForDb(results, 'tip');
            //this is to make sure we will not add repeated node
            for(let i = 0; i < transactions.length; i++){
              if(old_hashes.indexOf(transactions[i].this_hash) >= 0){
                transactions.splice(i, 1);
                i--;
              }
            }
            if(transactions.length > 0){
              session
              // first get all transactions that are likely to be updated
                .run(addTransactionsIntoDbString(transactions))
                .then(function () {
                  session
                  // first get all transactions that are likely to be updated
                    .run(updateNewRelationsString())
                    .then(function () {
                      session.close();
                      callback(null,true)
                    })
                    .catch(function (error) {
                      session.close();
                      callback(error, null);
                    });
                })
                .catch(function (error) {
                  session.close();
                  callback(error, null);
                });
            }else{
              session.close();
              callback(null,true);
            }

          });
        })
        .catch(function (error) {
          session.close();
          callback(error, null);
        });
    })
    .catch(function (error) {
      session.close();
      callback(error, null);
    });
}

module.exports = {
  queryTransactionsFromHashString,
  InitialDataIntoDb,
  UpdateDb,
  addMoreTransactionsIntodb
};
