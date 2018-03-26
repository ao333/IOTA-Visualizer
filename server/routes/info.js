const express = require("express");
const bodyParser = require("body-parser");
const cors = require('./cors');
const driver = require('../config_neo4j');

const infoRouter = express.Router();
infoRouter.use(bodyParser.json());

//send general statistics to client
infoRouter.route('/:query')
  .get(cors.corsWithOptions, (req, res, next) => {
    let limit = '';
    if(req.params.query === 'infor_table_initial')
      limit = '10';
    else if(req.params.query === 'infor_table_update')
      limit = '1';
    let random = parseInt(Math.random() * 3);
    let type;
    if(random === 0) type = 'tip';
    else if(random === 1) type = 'unconfirmed';
    else if(random === 2) type = 'confirmed';
    let session = driver.session();
    session
      .run('MATCH (tran:' + type + ') WITH tran, rand() AS number ' +
        'RETURN tran ORDER BY number LIMIT ' + limit)
      .then(function (result) {
        let transactions = [];
        result.records.forEach(function (record) {
          let obj = Object.assign({}, record.toObject().tran.properties);
          obj.value = obj.value.toInt();
          obj.type = record.toObject().tran.labels[0];
          obj.time = new Date(Number(obj.time)).toLocaleString();
          transactions.push(obj);
        });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(transactions);
        session.close();
      })
      .catch(function (error) {
        console.log(error);
        session.close();
        next(error);
      });
  });

module.exports = infoRouter;