const express = require("express");
const bodyParser = require("body-parser");
const cors = require('./cors');
const driver = require('../config/config_neo4j');

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
        'RETURN tran, tostring(tran.attachmentTimestamp) AS tt ORDER BY number LIMIT ' + limit)
      .then(function (result) {
        let transactions = [];
        result.records.forEach(function (record) {
          let obj = Object.assign({}, record.toObject().tran.properties);
          obj.type = extractType(record.toObject().tran.labels);
          console.log(record.toObject().tt);
          obj.time = new Date(Number(record.toObject().tt)*1000).toLocaleString();
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