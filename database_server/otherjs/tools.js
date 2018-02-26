const mongoose = require('mongoose');
const iota = require("./get_tips");
const IOTAes = require('../models/iotaes');

function getobj(thishash, trunkTransaction,branchTransaction,type, value){
  let tip_object = {
    'this_hash': thishash,
    'trunkTransaction': trunkTransaction,
    'branchTransaction': branchTransaction,
    'type':type,
    'value':value
  };
  return tip_object;
}

function deleteDuplicates(results){
  let count = [];
  for(let i = 0; i < results.length; i++){
    let this_hash = results[i]["this_hash"];
    let index = count.indexOf(this_hash);
    if(index === -1){
      count.push(this_hash);
    }else{
      results.splice(i, 1);
      i--;
    }
  }
  return results;
}

module.exports = {
  deleteDuplicates,
  getobj
};