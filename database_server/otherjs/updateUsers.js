//This file is used to track each user and update information for each user

const Track = require('../models/track');
const iota = require("./get_tips");
const tools = require("./tools");

/**
 *
 */
function update_users(){
  let cursor = Track.find({}).cursor();
  cursor.on('data', function(doc) {
    let allOldValues = doc["oldValue"]; // obtain user's old information
    let allhashes = []; // store all hashes for old information
    let allOldValueshash = []; // only store old information for tip
    let possible_to_update = []; // store unconfirmed and tip
    let record = 0;
    for(let i = 0; i < allOldValues.length; i++){
      allhashes.push(allOldValues[i]["this_hash"]);
      if(allOldValues[i]["type"] === "tip"){
        allOldValueshash.push(allOldValues[i]["this_hash"]);
      }
      if(allOldValues[i]["type"] === "unconfirmed" && record === 0){
        allOldValueshash.push(allOldValues[i]["this_hash"]);
        record++;
      }
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
            doc["updateValue"].push(tip_object);
            console.log(tip_object);
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
                doc["updateValue"].push(item);
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
                    doc["updateValue"].push(item);
                    allOldValues.splice(index, 1);
                  }
                }
                Track.findById(doc._id, function(){
                  doc["oldValue"] = allOldValues;
                  for(let i = 0; i < doc["updateValue"].length; i++){
                    doc["oldValue"].push(doc["updateValue"][i]);
                  }
                  doc["updateValue"] = [];
                  console.log("before: ", doc["oldValue"].length);
                  doc["oldValue"] = tools.deleteDuplicates(doc["oldValue"]);
                  console.log("after: ", doc["oldValue"].length);
                  for(let i = 0; i < doc["oldValue"].length; i++){
                    let forward = doc["oldValue"][i]["trunkTransaction"];
                    let backward = doc["oldValue"][i]["branchTransaction"];
                    for(let j = 0; j < doc["oldValue"].length; j++){
                      if(doc["oldValue"][j]["type"] === "tip" && (doc["oldValue"][j]["this_hash"] === forward || doc["oldValue"][j]["this_hash"] === backward)){
                        doc["oldValue"][j]["type"] = "unconfirmed";
                        console.log(doc["oldValue"][j]);
                      }
                    }
                  }
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