/**
 * This file is used to query tips and their parents which are used as inital information
 * sent to users at front-end
 * @type {*|IOTA}
 */

const iota = require("./get_tips");
const tools = require('./tools');
const IOTAes = require('../models/iotaes');

/**
 * create 40 tips and all their parents and add these to iota collection. This includes all
 * information we will send to front end node graph initially
 */
function query_tip(){
  iota.api.getTips(function(error, alltips){
    //here we only choose 40 tips because we cannot send too much to front end
    let length = Math.min(alltips.length, 40);
    let remaining_tips = [];
    for(let i = 0; i < length; i++){
      remaining_tips.push(alltips[i]);
    }
    iota.api.getTransactionsObjects(remaining_tips, function(error,tips_objects){
      if(error) console.log(error);
      if(tips_objects){
        addAlltips(tips_objects);
      }
    })
  })
}

/**
 * all first several tips into database
 * @param tips
 */
function addAlltips(tips){
  let results = [];
  for(let i = 0; i < tips.length; i++){
    let tip_object = tools.getobj(tips[i]["hash"], tips[i]["trunkTransaction"],
      tips[i]["branchTransaction"],"tip",tips[i]["value"]);
    results.push(tip_object);
  }
  create_father(tips, results);
}

/**
 * add all parents
 * @param tips     we will find parents of these tips
 * @param results     store results in results
 */
function create_father(tips, results){
  let hashes = [];
  for(let i = 0; i < tips.length; i++){
    hashes.push(tips[i]["hash"]);
  }
  iota.api.getLatestInclusion(hashes, function(error, values){
    if(error) console.log(error);
    if(values){
      for(let i = 0; i < values.length; i++){
        if(values[i] === true) {
          results = tools.deleteDuplicates(results);
          for(let j = 0; j < results.length; j++){
          }
          IOTAes.create(results, function(error, docs){
            if(error) console.log(error);
            else{
              console.log("update finish");
            }
          });
          return;
        }
      }
      let fathers = [];
      for(let i = 0; i < tips.length; i++){
        fathers.push(tips[i]["trunkTransaction"]);
        fathers.push(tips[i]["branchTransaction"])
      }
      iota.api.getTransactionsObjects(fathers, function(error, nodes){
        if(error) console.log(error);
        if(nodes){
          for(let i = 0; i < nodes.length; i++){
            let tip_object = tools.getobj(nodes[i]["hash"], nodes[i]["trunkTransaction"],
              nodes[i]["branchTransaction"],"unconfirmed",nodes[i]["value"]);
            results.push(tip_object);
          }
          create_father(nodes, results);
        }
      });
    }
  });

}

module.exports = query_tip;