const underscore = require('underscore');

/**
 * get branch transaction and trunck transaction of transactions given in arr
 * @method getBranchAndTrunckHash
 * @param arr
 * @returns {Array}
 */
function getTrunkBranchHash(objects){
    let result = [];
    for(let i = 0; i < objects.length; i++){
        result.push(objects[i].branchTransaction);
        result.push(objects[i].trunkTransaction);
    }
    return result;
}

function getRelationPairs(objects){
    let result = [];
    for(let i = 0; i < objects.length; i++){
        result.push({start: objects[i].hash, end: objects[i].branchTransaction});
        result.push({start: objects[i].hash, end: objects[i].trunkTransaction});
    }
    return result;
}

function arrayRemove(object){
    let hash = '999999999999999999999999999999999999999999999999999999999999999999999999999999999';
    let newObject = object.filter(function(obj){
        return hash !== obj.hash;
    });
    return newObject;
}


module.exports = {
    getTrunkBranchHash,
    getRelationPairs,
    arrayRemove
};