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

function addMoreHashString(old_data, amount){
  let result = 'MATCH (tran) WHERE ';
  for(let i = 0; i < old_data.length; i++){
    if(i !== 0)
      result = result + 'OR tran.hash = "' + old_data[i] + '" ';
    else{
      result = result + 'tran.hash = "' + old_data[i] + '" '
    }
  }
  result = result + ' WITH tran MATCH (item)-[:CONFIRMS]-(tran) ' +
    ' WHERE item.hash <> tran.hash return distinct item LIMIT ' + amount;
  return result;
}

module.exports = {
  updateTreeHashString,
  addMoreHashString
};