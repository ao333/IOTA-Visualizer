/**
 * This file is used to serve /tangle router. Essentially it is responsible for sending transactions to
 * front end and update transactions of front end
 */

//import libraries
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('./cors');
const driver = require('../config/config_neo4j');
const queryStatement = require('../helpers/QueryStatement');
const utils = require('../helpers/utils');

const tangleRouter = express.Router();
tangleRouter.use(bodyParser.json());

//----------------------------------------------------------------------------------------------------
//four routers

// send tree data(initial amount of tips is 10) to client
tangleRouter.route('/tree_initial')
  .get(cors.corsWithOptions, (req, res, next) => {
    initial(req, res, next, 10);
  });

//send sphere data(initial amount of tips is 30) to client
tangleRouter.route('/sphere_initial')
  .get(cors.corsWithOptions, (req, res, next) => {
    initial(req, res, next, 40);
  });

//update transactions for tree graph
tangleRouter.route('/sphere_update')
  .post(cors.corsWithOptions, (req, res, next) => {
    if(req.query.add_all){
      update(req, res, next, null);
    }else{
      update(req, res, next, 5);
    }
  });

//update transactions for sphere graph
tangleRouter.route('/tree_update')
  .post(cors.corsWithOptions, (req, res, next) => {
    if(req.query.add_all){
      update(req, res, next, 20);
    }else{
      update(req, res, next, 2);
    }
  });


module.exports = tangleRouter;
//-----------------------------------------------------------------------------------------------------------
// initial and update function which are corresponding to former four routers

/**
 * send initial data to client
 * @param req  request
 * @param res  response
 * @param next promise of node.js
 * @param amount  the initial data will include {amount} amount of tips
 */
function initial(req, res, next, amount){
  // determine if we will search for specific hash or it's a general graph
  if(!req.query.hash && !req.query.non_zero){
    let session = driver.session();
    session
      .run(queryStatement.initialString(amount))
      .then(function (result) {
        sendResponse(session, res, result)
      })
      .catch(function (error) {
        session.close();
        next(error);
      });
  }else if(req.query.hash){
    let session = driver.session();
    session
      .run('match (n) where n.hash = "' + req.query.hash + '" return count(n) AS num')
      .then(function (result) {
        let count;
        result.records.forEach(function (record) {
          count = record.toObject().num.toInt();
        });
        if(count !== 0){
          session
            .run(queryStatement.initialStringWithHash(req.query.hash))
            .then(function (result) {
              sendResponse(session, res, result);
            })
            .catch(function (error) {
              session.close();
              next(error);
            });
        }else{
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({novalid: true});
          session.close();
        }
      })
      .catch(function (error) {
        session.close();
        next(error);
      });
  }else if(req.query.non_zero){
    let session = driver.session();
    session
      .run(queryStatement.nonZeroString(amount))
      .then(function (result) {
        sendResponse(session, res, result)
      })
      .catch(function (error) {
        session.close();
        next(error);
      });
  }
}


/**
 * the update procedure will include two steps:
 * 1. update the status of current existed transactions
 * 2. add new transactions into graph
 * @param req
 * @param res
 * @param next
 * @param amount:  there will be {amount} amount of new transactions added into front end graph
 */
function update(req, res, next, amount){
  let first = 'tip';
  let old_data = req.body;
  let query_string = queryStatement.updateString(old_data);
  let session = driver.session();
  session
    .run(query_string)
    .then(function (result) {
      let transactions = [];
      result.records.forEach(function (record) {
        let obj = Object.assign({}, record.toObject().item.properties);
        obj.type = utils.extractType(record.toObject().item.labels, 'status');
        obj.time = new Date(Number(obj.attachmentTimestamp)*1000);
        transactions.push(obj);
      });
      session.run(queryStatement.addNewString(old_data, amount, first, req.query.non_zero))
        .then(function (result) {
          let result1 = 0;
          result.records.forEach(function (record) {
            let obj = Object.assign({}, record.toObject().item.properties);
            obj.type = utils.extractType(record.toObject().item.labels, 'status');
            obj.time = new Date(Number(obj.attachmentTimestamp)*1000);
            transactions.push(obj);
            result1++;
          });
          transactions = modifyTips(transactions);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(transactions);
            session.close();
        })
        .catch(function (error) {
          session.close();
          next(error);
        });
    })
    .catch(function (error) {
      session.close();
      next(error);
    });
}


function sendResponse(session, res, result){
  let transactions = [];
  result.records.forEach(function (record) {
    let obj = Object.assign({}, record.toObject().item.properties);
    obj.type = utils.extractType(record.toObject().item.labels, 'status');
    obj.time = new Date(Number(obj.attachmentTimestamp)*1000);
    transactions.push(obj);
  });
  transactions = utils.deleteDuplicates(transactions);
  transactions = modifyTips(transactions);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json(transactions);
  session.close();
}

function modifyTips(data) {
  for(let i = 0; i < data.length; i++){
    for(let j = 0; j < data.length; j++){
      if((data[j].trunkTransaction === data[i].hash ||
          data[j].branchTransaction === data[i].hash) && data[i].type === 'tip'){
        data[i].type = 'unconfirmed';
      }
    }
  }
  return data;
}

