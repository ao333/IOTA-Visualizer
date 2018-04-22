const express = require("express");
const bodyParser = require("body-parser");
const cors = require('./cors');
const driver = require('../config/config_neo4j');
const queryStatement = require('../helpers/QueryStatement');
const iota = require('../config/config_iota')

const tangleRouter = express.Router();
tangleRouter.use(bodyParser.json());


// send tree data(approximately 100) to client
tangleRouter.route('/tree_initial')
  .get(cors.corsWithOptions, (req, res, next) => {
    if(!req.query.hash){
      let session = driver.session();
      session
        .run(queryStatement.initialString(10))
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
    }else{
      let session = driver.session();
      session
        .run('match (n:Node) where n.hash = "' + req.query.hash + '" return count(n) AS num')
        .then(function (result) {
          let count;
          result.records.forEach(function (record) {
            count = record.toObject().num.toInt();
          });
          if(count !== 0){
            console.log(req.query.hash);
            session
              .run(queryStatement.initialStringWithHash(req.query.hash))
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
                console.log(transactions);
                session.close();
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
    }
  });

//send sphere data(approximately 300) to client
tangleRouter.route('/sphere_initial')
  .get(cors.corsWithOptions, (req, res, next) => {
    if(!req.query.hash){
      let time_now = Date.now().toString();
      let session = driver.session();
      session
        .run(queryStatement.initialString(30))
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
    }else{
      let session = driver.session();
      session
        .run('match (n:Node) where n.hash = " ' + req.query.hash + '" return count(n) AS num')
        .then(function (result) {
          let count;
          result.records.forEach(function (record) {
            count = record.toObject().num.toInt();
          });
          if(count !== 0){
            session
              .run(queryStatement.initialStringWithHash(req.query.hash))
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
          }else{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({valid: false});
            session.close();
          }
        })
        .catch(function (error) {
          session.close();
          next(error);
        });
    }

  });


tangleRouter.route('/sphere_update')
  .post(cors.corsWithOptions, (req, res, next) => {
    update(req, res, next, 5);
  });

tangleRouter.route('/tree_update')
  .post(cors.corsWithOptions, (req, res, next) => {
    update(req, res, next, 1);
  });


module.exports = tangleRouter;

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

function update(req, res, next, amount){

  let choice = ['tip', 'unconfirmed'];
  let choice_index = Math.floor(Math.random()*2);
  let first = choice[choice_index];
  let second = first === 'tip'?'unconfirmed':'tip';

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
      session.run(queryStatement.addMoreHashString(old_data, amount, first))
        .then(function (result) {
          let result1 = 0;
          result.records.forEach(function (record) {
            let obj = Object.assign({}, record.toObject().item.properties);
            obj.type = extractType(record.toObject().item.labels);
            transactions.push(obj);
            result1++;
          });
          if(result1 === 0){
            session.run(queryStatement.addMoreHashString(old_data, amount, second))
              .then(function (result) {
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
          }else{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(transactions);
            session.close();
          }
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