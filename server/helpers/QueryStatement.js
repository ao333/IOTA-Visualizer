function updateTreeHashString(old_data){
  let result = 'MATCH (item) WHERE ';
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

function addMoreHashString(old_data, amount, label){
  let result = 'MATCH (item)-[:CONFIRMS]-(tran) WHERE ';
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

  result += 'return distinct item LIMIT ' + amount;
  return result;
}

function initialString(num){
  return 'MATCH (tip:tip) WITH tip LIMIT ' +  num +  ' MATCH (tip)-[CONFIRMS]->(trans) WITH tip, ' +
    'trans MATCH (trans)-[CONFIRMS]->(trans2) WITH tip, trans,trans2 ' +
    'MATCH (trans2)-[CONFIRMS]->(trans3) ' +
    'WITH COLLECT(tip) + COLLECT(trans)+ COLLECT(trans2)+ COLLECT(trans3)[..10] ' +
    'AS items UNWIND items AS item ' +
    'return distinct item'
}

function initialStringWithHash(hash){
  return 'MATCH (n3)-[:CONFIRMS]-(n1)-[:CONFIRMS]-(n:Node)-[:CONFIRMS]-(n2)-[:CONFIRMS]-(n4) WHERE n.hash = "' + hash + '" WITH COLLECT(n1)[..10] + ' +
    'COLLECT(n2)[..10]+COLLECT(n3)[..10]+ COLLECT(n4)[..10] + COLLECT(n) AS items UNWIND items AS item return distinct item'
}

module.exports = {
  updateTreeHashString,
  addMoreHashString,
  initialString,
  initialStringWithHash
};