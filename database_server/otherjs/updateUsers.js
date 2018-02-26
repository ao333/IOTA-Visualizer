//This file is used to track each user and update information for each user

const iota = require("./get_tips");
const tools = require("./tools");

/**
 *
 */
function update_users(Track){
  let cursor = Track.find({}).cursor();
  cursor.on('data', function(doc) {
    if(!doc || doc["oldValue"].length === 0)
      return;
    var allOldValues = doc["oldValue"].slice(); // obtain user's old information
    var updateValue = doc["updateValue"].slice();
    var allhashes = []; // store all hashes for old information
    var allOldValueshash = []; // only store old information for tip
    let unconfirmed = [];
    let record = 0;
    for(let i = 0; i < allOldValues.length; i++){
      allhashes.push(allOldValues[i]["this_hash"]);
      if(allOldValues[i]["type"] === "tip"){
        allOldValueshash.push(allOldValues[i]["this_hash"]);
      }
      if(allOldValues[i]["type"] === "unconfirmed"){
        unconfirmed.push(allOldValues[i]["this_hash"]);
      }
    }
    unconfirmed = tools.getArrayItems(unconfirmed, Math.min(unconfirmed.length, 3));
    for(let i = 0; i< unconfirmed.length; i++){
      allOldValueshash.push(unconfirmed[i]);
    }
    let index = allOldValueshash.indexOf("999999999999999999999999999999999999999999999999999999999999999999999999999999999");
    allOldValueshash.splice(index, 1);
    iota.api.findTransactionObjects({'approvees': allOldValueshash}, function(error, tips_objects){
      if(error) console.log(error);
      if(tips_objects){
        for(let i = 0; i < tips_objects.length; i++){
          if(allhashes.indexOf(tips_objects[i]["hash"]) < 0){
            let tip_object = tools.getobj(tips_objects[i]["hash"], tips_objects[i]["trunkTransaction"],
              tips_objects[i]["branchTransaction"],"tip",tips_objects[i]["value"]);
            updateValue.push(tip_object);
            break;
          }
        }
        var possible_to_update = [];
        for(let i = 0; i < allOldValues.length; i++){
          if(allOldValues[i]["type"] !== "confirmed")
            possible_to_update.push(allOldValues[i]["this_hash"]);
        }
        iota.api.getLatestInclusion(possible_to_update, function(error, values){
          if(error) console.log(error);
          if(values){
            for(let i = 0; i < values.length; i++){
              if(values[i] === true){
                let item_hash = possible_to_update[i];
                let index = 0;
                for(index = 0; index < allOldValues.length; index++){
                  if(allOldValues[index]["this_hash"] === item_hash)
                    break;
                }
                let item = allOldValues[index];
                item["type"] = "confirmed";
                updateValue.push(item);
                allOldValues.splice(index, 1);
              }
            }
            possible_to_update = [];
            for(let i = 0; i < allOldValues.length; i++){
              if(allOldValues[i]["type"] === "tip")
                possible_to_update.push(allOldValues[i]["this_hash"]);
            }
            let index = possible_to_update.indexOf("999999999999999999999999999999999999999999999999999999999999999999999999999999999");
            possible_to_update.splice(index, 1);
            iota.api.findTransactionObjects({'approvees': possible_to_update}, function(error, tips_objects){
              if(error) {
                console.log(error);
              }
              if(tips_objects){
                let ifinpossible = [];
                for(let i = 0; i < tips_objects.length; i++){
                  ifinpossible.push(tips_objects[i]["trunkTransaction"]);
                  ifinpossible.push(tips_objects[i]["branchTransaction"]);
                }
                for(let i = 0; i < possible_to_update.length; i++){
                  if(ifinpossible.indexOf(possible_to_update[i]) >= 0){
                    let item_hash = possible_to_update[i];
                    let index = 0;
                    for(; index < allOldValues.length; index++){
                      if(allOldValues[index]["this_hash"] === item_hash)
                        break;
                    }
                    let item = allOldValues[index];
                    item["type"] = "unconfirmed";
                    updateValue.push(item);
                    allOldValues.splice(index, 1);
                  }
                }
                Track.findById(doc._id, function(){
                  for(let i = 0; i < updateValue.length; i++){
                    allOldValues.push(updateValue[i]);
                  }
                  doc["oldValue"] = tools.deleteDuplicates(allOldValues);
                  doc.save(function(err, afterupdate){
                    if(err) console.log(err);
                    else{
                      console.log("done");
                    }
                  })
                });
              }
            });
          }
        });
      }
    });
  });
}

module.exports = update_users;