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

function getArrayItems(arr, num) {
  let temp_array = new Array();
  for (let index in arr) {
    temp_array.push(arr[index]);
  }
  let return_array = new Array();
  for (let i = 0; i<num; i++) {
    if (temp_array.length>0) {
      let arrIndex = Math.floor(Math.random()*temp_array.length);
      return_array[i] = temp_array[arrIndex];
      temp_array.splice(arrIndex, 1);
    } else {
      break;
    }
  }
  return return_array;
}

module.exports = {
  deleteDuplicates,
  getobj,
  getArrayItems
};