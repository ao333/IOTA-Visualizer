const express = require("express");
const bodyParser = require("body-parser");
const cors = require('./cors');
const iota = require('../config/config_iota');
const queries = require('../helpers/queries');

const searchRouter = express.Router();
searchRouter.use(bodyParser.json());


// send tree data(approximately 100) to client
searchRouter.route('/')
  .post(cors.corsWithOptions, (req, res, next) => {
    let search_hash = req.body.value;
    iota.api.getTransactionsObjects([search_hash], function (error, trans) {
      if(error){
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({'valid': false});
        return;
      }
      let tran = trans[0];
      extractInfo(tran, function (error, result) {
        if(error){
          return next(error);
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      });

    })
  });

function extractInfo(data, callback){
  let result = {};
  result.hash = data.hash;
  result.address = data.address;
  result.amount = data.value;
  result.time = new Date(data.timestamp*1000).toLocaleString();
  result.branchTransaction = data.branchTransaction;
  result.trunkTransaction = data.trunkTransaction;
  result.bundle = data.bundle;
  result.signature = data.signatureMessageFragment;
  queries.determineState([data.hash], function (error, states) {
    if(error){
      callback(error, null);
      return;
    }
    let state = states[0];
    result.status = state;
    result.valid = true;
    callback(null, result);
  })


}

module.exports = searchRouter;
