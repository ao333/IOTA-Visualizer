/**
 * This file is used to serve /node_search router, serving search staff
 */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('./cors');
const iota = require('../config/config_iota');
const queries = require('../helpers/queries');

const searchRouter = express.Router();
searchRouter.use(bodyParser.json());


searchRouter.route('/')
  .post(cors.corsWithOptions, (req, res, next) => {
    if(req.query.search === 'hash'){
      let search_hash = req.body.value;
      console.log(search_hash);
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
    }
    if(req.query.search === 'address'){
      let search_hash = req.body.value;
      iota.api.findTransactionObjects({'addresses':[search_hash]}, function(error, hashes){
        if(error || !hashes){
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({'valid': false});
          return;
        }
        let submit = {};
        submit.address = search_hash;
        submit.num_trans = hashes.length;
        let receive_value = 0;
        let send_value = 0;
        let date = 0;
        for(let i = 0; i < hashes.length; i++){
          if(hashes[i].value > 0)
            receive_value += receive_value;
          if(hashes[i].value < 0)
            send_value += hashes[i].value;
          if(hashes[i].timestamp*1000 > date){
            date = hashes[i].timestamp*1000;
          }
        }
        submit.received_t_value = receive_value;
        submit.sent_t_value = send_value;
        submit.latest_date = new Date(date).toLocaleString();
        let incluhashes = [];
        for(let i = 0; i < hashes.length; i++){
          if(hashes[i].hash !== '999999999999999999999999999999999999999999999999999999999999999999999999999999999'){
            incluhashes.push(hashes[i].hash);
          }
        }
        iota.api.getLatestInclusion(incluhashes, function(error, bools){
          if(error || !bools){
            submit.valid = true;
            submit.con_uncon_ratio = 0;
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(submit);
            return;
          }
          let truenum = 0;
          let falsenum = 0;
          for(let i = 0; i < bools.length; i++){
            if(bools[i])
              truenum++;
            else
              falsenum++;
          }
          submit.valid = true;
          if(falsenum){
            submit.con_uncon_ratio = (truenum/falsenum).toFixed(2);
          }else{
            submit.con_uncon_ratio = 0;
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(submit);
        });




      })
    }

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
