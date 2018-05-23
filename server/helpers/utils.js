/**
 * This file contains general utils (helper functions)
 */

/**
 * because when we search transaction in our neo4j database, every transaction will have two labels.
 * One is source, the other one is status(tip or unconfirmed or confirmed). We need to distinguish these two labels
 * and encapsulate them seperately into data.source and data.type.
 *
 * @param arr: the array containing two labels
 * @param type: whether we want to extract source or status
 * @returns {string} result of extracted label
 */
function extractType(arr, type){
  if(type === 'status'){
    for(let i = 0; i < arr.length; i++){
      if(arr[i] === 'tip')
        return 'tip';
      if(arr[i] === 'unconfirmed')
        return 'unconfirmed';
      if(arr[i] === 'confirmed')
        return 'confirmed';
    }
  }
}

/**
 * delete duplicates (transactions with same hash)
 * @param results
 * @returns {*}
 */
function deleteDuplicates(results){
  let count = [];
  for(let i = 0; i < results.length; i++){
    let this_hash = results[i]["hash"];
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
  extractType,
  deleteDuplicates
};