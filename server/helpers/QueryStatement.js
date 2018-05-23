/**
 * This file contains functions to generate query string of neo4j database
 *
 */

/**
 * find up-to-date status of transactions given hash in old_data array
 * @param old_data
 * @returns {string}
 */
function updateString(old_data){
  let result = 'MATCH (item:Node) WHERE ';
  for(let i = 0; i < old_data.length; i++){
    if(i !== 0)
      result = result + 'OR item.hash = "' + old_data[i] + '" ';
    else{
      result = result + 'item.hash = "' + old_data[i] + '" '
    }
  }
  result = result + ' RETURN item';
  return result;
}

/**
 * add some {amount} amount of new data which is connected to old_data
 * @param old_data
 * @param amount
 * @param label  whether we want new unconfirmed data or tip data
 * @returns {string}
 */
function addNewString(old_data, amount, label, non_zero){
  let result = 'MATCH (item:Node)-[:CONFIRMS]-(tran:Node) WHERE ';
  for(let i = 0; i < old_data.length; i++){
    if(i !== 0)
      result = result + 'OR tran.hash = "' + old_data[i] + '" ';
    else{
      result = result + '(tran.hash = "' + old_data[i] + '" '
    }
  }
  result += ')';
  result = result + ' AND (item:' + label + ') ';
  for(let i = 0; i < old_data.length; i++){
    result += ' AND item.hash <> "' + old_data[i] + '" ';
  }

  if(non_zero){
    result += ' AND item.value <> 0 '
  }

  result += 'return distinct item';
  if(amount){
    result +=  ' ORDER BY item.attachmentTimestamp DESC LIMIT ' + amount;
  }
  return result;
}

/**
 * pick randomly {num} amount of tips and their approvees, include two sources
 * @param num
 * @returns {string}
 */
function initialString(num){
  return 'MATCH (tip:tip:Node) WHERE exists((tip)-[:CONFIRMS]-()) WITH tip ORDER BY tip.attachmentTimestamp DESC LIMIT ' +  (num) +  ' OPTIONAL MATCH (tip)-[:CONFIRMS]->(trans:Node) WITH tip, ' +
    'trans OPTIONAL MATCH (trans:Node)-[:CONFIRMS]->(trans2:Node) WITH tip, trans,trans2 ' +
    'OPTIONAL MATCH (trans2:Node)-[:CONFIRMS]->(trans3:Node) WITH tip, trans, trans2, trans3 ' +
    'OPTIONAL MATCH (trans3:Node)-[:CONFIRMS]->(trans4:Node:confirmed) ' +
    'WITH COLLECT(tip) + COLLECT(trans)+ COLLECT(trans2)+ COLLECT(trans3)+COLLECT(trans4)[..2] ' +
    'AS items UNWIND items AS item ' +
    'return distinct item';
}

/**
 * pick some transactions connected to the transaction with specific {hash}
 *
 * @param hash
 * @returns {string}
 */
function initialStringWithHash(hash){
  return 'MATCH (n3:Node)-[:CONFIRMS]-(n1:Node)-[:CONFIRMS]-(n:Node)-[:CONFIRMS]-(n2:Node)-[:CONFIRMS]-(n4:Node) WHERE n.hash = "' + hash + '" WITH COLLECT(n1)[..10] + ' +
    'COLLECT(n2)[..10]+COLLECT(n3)[..10]+ COLLECT(n4)[..10] + COLLECT(n) AS items UNWIND items AS item return distinct item'
}

function nonZeroString(amount){
  return 'MATCH (tip:tip:Node) WHERE exists((tip)-[:CONFIRMS]-()) AND tip.value <> 0 AND tip.value <> 1 AND tip.value <> -1 WITH tip ORDER BY ' +
    ' tip.attachmentTimestamp DESC LIMIT ' + amount +' OPTIONAL MATCH (tip)-[:CONFIRMS]->(trans:Node) WHERE trans.value <> 0 WITH tip, ' +
    ' trans OPTIONAL MATCH (trans)-[:CONFIRMS]->(trans2:Node) WHERE trans2.value <> 0 WITH tip, trans, trans2 ' +
    ' OPTIONAL MATCH (trans2)-[:CONFIRMS]->(trans3:Node) WHERE trans3.value <> 0 ' +
    ' WITH COLLECT(tip) + COLLECT(trans)+ COLLECT(trans2)+ COLLECT(trans3)[..10] AS items UNWIND items ' +
    ' AS item return distinct item';

}

module.exports = {
  updateString,
  addNewString,
  initialString,
  initialStringWithHash,
  nonZeroString
};