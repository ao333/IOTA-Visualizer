const express = require("express");
const bodyParser = require("body-parser");
const cors = require('./cors');
const driver = require('../config/config_neo4j');
const queryStatement = require('../helpers/QueryStatement');

const tangleRouter = express.Router();
tangleRouter.use(bodyParser.json());


// send tree data(approximately 100) to client
tangleRouter.route('/tree_initial')
  .get(cors.corsWithOptions, (req, res, next) => {
    let session = driver.session();
    console.log(initialString(10));
    session
      .run(initialString(10))
      .then(function (result) {
        console.log();
        let transactions = [];
        result.records.forEach(function (record) {
          let obj = Object.assign({}, record.toObject().item.properties);
          obj.type = extractType(record.toObject().item.labels);
          transactions.push(obj);
        });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(transactions);
        session.close();
      })
      .catch(function (error) {
        session.close();
        next(error);
      });
  });

//send sphere data(approximately 300) to client
tangleRouter.route('/sphere_initial')
  .get(cors.corsWithOptions, (req, res, next) => {
    let time_now = Date.now().toString();
    let session = driver.session();
    session
      .run(initialString(30))
      .then(function (result) {
        let transactions = [];
        result.records.forEach(function (record) {
          let obj = Object.assign({}, record.toObject().item.properties);
          obj.type = extractType(record.toObject().item.labels);
          transactions.push(obj);
        });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.cookie('time', time_now);
        res.json(transactions);
        session.close();
      })
      .catch(function (error) {
        session.close();
        next(error);
      });
  });


tangleRouter.route('/sphere_update')
  .get(cors.corsWithOptions, (req, res, next) => {
    let old_data = req.body;
    let query_string = queryStatement.updateTreeHashString(old_data);
    let session = driver.session();
    session
      .run(query_string)
      .then(function (result) {
        let transactions = [];
        result.records.forEach(function (record) {
          let obj = Object.assign({}, record.toObject().item.properties);
          obj.type = extractType(record.toObject().item.labels);
          transactions.push(obj);
        });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(transactions);
        session.close();
      })
      .catch(function (error) {
        session.close();
        next(error);
      });
  });

tangleRouter.route('/tree_update')
  .post(cors.corsWithOptions, (req, res, next) => {
    let old_data = req.body;
    let query_string = queryStatement.updateTreeHashString(old_data);
    let session = driver.session();
    session
      .run(query_string)
      .then(function (result) {
        let transactions = [];
        result.records.forEach(function (record) {
          let obj = Object.assign({}, record.toObject().item.properties);
          obj.type = extractType(record.toObject().item.labels);
          transactions.push(obj);
        });
        console.log('11111' , transactions.length);
        session.run(queryStatement.addMoreHashString(old_data, 1))
          .then(function (result) {
            result.records.forEach(function (record) {
              let obj = Object.assign({}, record.toObject().item.properties);
              obj.type = extractType(record.toObject().item.labels);
              transactions.push(obj);
            });
            console.log('2222', transactions.length);
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
  });


module.exports = tangleRouter;

function initialString(num){
  return 'MATCH (tip:tip) WITH tip LIMIT ' +  num +  ' MATCH (tip)-[CONFIRMS]->(trans) WITH tip, ' +
    'trans MATCH (trans)-[CONFIRMS]->(trans2) WITH tip, trans,trans2 ' +
    'MATCH (trans2)-[CONFIRMS]->(trans3) ' +
    'WITH COLLECT(tip) + COLLECT(trans)+ COLLECT(trans2)+ COLLECT(trans3) ' +
    'AS items UNWIND items AS item ' +
    'return distinct item'
}

function extractType(arr){
  for(let i = 0; i < arr.length; i++){
    if(arr[i] === 'tip')
      return 'tip';
    if(arr[i] === 'unconfirmed')
      return 'unconfirmed';
    if(arr[i] === 'confirmed')
      return 'confirmed';
  }
}