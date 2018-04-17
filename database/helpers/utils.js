/*
  This file defines several tool functions(helpers)
 */


/**
 * @param arr
 *  array where elements are picked from
 * @param num
 *  number of elements picked
 * @returns {any[]} result array
 * @description randomly pick {num} amount of elements in array {arr}
 */
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


/**
 * get branch transaction and trunck transaction of transactions given in arr
 * @method getBranchAndTrunckHash
 * @param arr
 * @returns {Array}
 */
function getBranchAndTrunckHash(arr){
  let result = [];
  for(let i = 0; i < arr.length; i++){
    result.push(arr[i].branchTransaction);
    result.push(arr[i].trunkTransaction);
  }
  return result;
}

/**
 * extract useful information for us for all transactions given in arr
 * @param arr
 * @param type
 * @returns {Array}
 */
function extractDataForDb(arr, type){
  let results = [];
  for(let i = 0; i < arr.length; i++){
    let transaction = {
      'this_hash': arr[i].hash,
      'trunkTransaction': arr[i].trunkTransaction,
      'branchTransaction': arr[i].branchTransaction,
      'type':type,
      'value':arr[i].value,
      'address' : arr[i].address,
      'create_time' : arr[i].timestamp * 1000
    };
    results.push(transaction);
  }
  return results;
}

/**
 * delete duplicates (transactions with same hash)
 * @param results
 * @returns {*}
 */
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
  getArrayItems,
  getBranchAndTrunckHash,
  extractDataForDb,
  deleteDuplicates
};