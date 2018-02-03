const mongoose = require('mongoose');
const iota = require("./get_tips");
const IOTAes = require('../models/iotaes');

function getobj(thishash, trunkTransaction,branchTransaction,type){
  var tip_object = {
    'this_hash': thishash,
    'trunkTransaction': trunkTransaction,
    'branchTransaction': branchTransaction,
    'type':type
  };
  return tip_object;
}

function create_father(tip_obj){
  iota.api.getTransactionsObjects([tip_obj["trunkTransaction"], tip_obj["branchTransaction"]], function(error, new_nodes){
    if(!error){
      for(var j = 0; j < new_nodes.length; j++){
        var tip_object = {
          'this_hash': new_nodes[j]["hash"],
          'trunkTransaction': new_nodes[j]["trunkTransaction"],
          'branchTransaction': new_nodes[j]["branchTransaction"],
          'type':"unconfirmed"
        };
        IOTAes.create(tip_object, function (err, small) {
        });
      }
    }

  });
}

module.exports = {
  getobj,
  create_father
}