const express = require("express");
const bodyParser = require("body-parser");
const cors = require('./cors');
const driver = require('../config_neo4j');

const tangleRouter = express.Router();
tangleRouter.use(bodyParser.json());


// send tree data(approximately 100) to client
tangleRouter.route('/tree_initial')
  .get(cors.corsWithOptions, (req, res, next) => {
    let session = driver.session();
    session
      .run(initialTreeString())
      .then(function (result) {
        let transactions = [];
        result.records.forEach(function (record) {
          let obj = Object.assign({}, record.toObject().item.properties);
          obj.value = obj.value.toInt();
          obj.type = record.toObject().item.labels[0];
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
      .run('MATCH (tran) RETURN tran')
      .then(function (result) {
        let transactions = [];
        result.records.forEach(function (record) {
          let obj = Object.assign({}, record.toObject().tran.properties);
          obj.value = obj.value.toInt();
          obj.type = record.toObject().tran.labels[0];
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
    let session = driver.session();
    let time_now = Date.now().toString();
    let old_time = Number(req.cookies.time);
    session
      .run('MATCH (tran) WHERE tran.time >= ' + old_time + ' RETURN tran')
      .then(function (result) {
        let transactions = [];
        result.records.forEach(function (record) {
          let obj = Object.assign({}, record.toObject().tran.properties);
          obj.value = obj.value.toInt();
          obj.type = record.toObject().tran.labels[0];
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
module.exports = tangleRouter;

function initialTreeString(){
  return 'MATCH (tip:tip) WITH tip LIMIT 10 MATCH (tip)-[CONFIRMS]->(trans) WITH tip, ' +
    'trans MATCH (trans)-[CONFIRMS]->(trans2) WITH tip, trans,trans2 ' +
    'MATCH (trans2)-[CONFIRMS]->(trans3) ' +
    'WITH COLLECT(tip) + COLLECT(trans)+ COLLECT(trans2)+ COLLECT(trans3) ' +
    'AS items UNWIND items AS item ' +
    'return distinct item'
}