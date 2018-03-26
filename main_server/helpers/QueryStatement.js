function updateTreeHashString(old_data){
  let result = 'MATCH (tran) WHERE ';
  for(let i = 0; i < old_data.length; i++){
    if(i !== 0)
      result = result + 'OR tran.hash = "' + old_data[i] + '" ';
    else{
      result = result + 'tran.hash = "' + old_data[i] + '" '
    }
  }
  result = result + ' WITH tran MATCH (tran1)-[:CONFIRMS]-(tran) ' +
    ' WITH COLLECT(tran) + COLLECT(tran1) AS items UNWIND items AS item return distinct item';
  return result;
}

module.exports = {
  updateTreeHashString
};