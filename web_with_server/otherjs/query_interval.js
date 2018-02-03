const mongoose = require('mongoose');
const iota = require("./get_tips");
const IOTAes = require('../models/iotaes');
const tools = require('./tools');

function query_tip(){
  iota.api.getTips(function(error, alltips) {
    iota.api.getTransactionsObjects(alltips, function(a,tips_objects){
      for(var i = 0; i < 1000; i++){
        (function(tips_objects,i){
          IOTAes.findOne({"this_hash": tips_objects[i]["hash"]}, function (err, doc) {
            if(!doc){
              var tip_object = tools.getobj(tips_objects[i]["hash"], tips_objects[i]["trunkTransaction"],
                tips_objects[i]["branchTransaction"], "tip");
              IOTAes.create(tip_object, function (err, small) {
                tools.create_father(tip_object);
              });
            }
          });
        })(tips_objects,i);
      }
    })
  })
}

function go_through_db(){
  IOTAes.find({}).then((iota_transaction) =>{
    for(var i = 0; i < iota_transaction.length(); i++){
      (function(iota_transaction, i){
        iota.api.getLatestInclusion([iota_transaction[i]["this_hash"]]
          ,function(error,data){
            var ifconfirmed = data[0] === true? "confirmed" : "unconfirmed";
            IOTAes.findByIdAndUpdate(iota_transaction[i]._id, {
              $set: {"type" : ifconfirmed}
            }, {new: true}, function(){
              var trunkTransaction = iota_transaction[i]["trunkTransaction"];
              var branchTransaction = iota_transaction[i]["branchTransaction"];
              iota.api.getTransactionsObjects([trunkTransaction, branchTransaction], function(error, new_nodes){

                for(var j = 0; j < new_nodes.length; j++){
                  (function(new_nodes, j){

                    var tip_object = {
                      'this_hash': new_nodes[i]["hash"],
                      'trunkTransaction': new_nodes[i]["trunkTransaction"],
                      'branchTransaction': new_nodes[i]["branchTransaction"],
                      'type':"unconfirmed"
                    };
                    console.log(tip_object);
                    IOTAes.create(tip_object, function (err, small) {
                    });
                  })(new_nodes,j);
                }
              });

            });

          });
      })(iota_transaction, i);
    }

  }, (err) => {})
    .catch((err) => {});
}

module.exports = {
  query_tip,
  go_through_db
}