const bs = require('./iotaBS');
const underscore = require('underscore');

/**
 * truncate all Nodes, add primary key and index to database
 * @param callback
 */
function dbInit(callback){
    bs.dbInit(function(error){
        if(error){
            callback(error);
        }else{
            callback(null);
        }
    });
}

/**
 * insert tips and its parents within fifth generation
 * @param callback
 */
function dbInsert(callback){
    bs.tipInsert(function(error, hashes, hashes1, relatPairs1){
        if(error){
            callback(error);
        }else{
            bs.trunkBranchInsert(hashes1, function(error, hashes2, relatPairs2){
              if(error){
                    callback(error);
                }else{
                    bs.trunkBranchInsert(hashes2, function(error, hashes3, relatPairs3){
                        if(error){
                            callback(error);
                        }else{
                            bs.trunkBranchInsert(hashes3, function(error, hashes4, relatPairs4){
                                if(error){
                                    callback(error);
                                }else{
                                    bs.trunkBranchInsert(hashes4, function(error, hashes5, relatPairs5){
                                        if(error){
                                            callback(error);
                                        }else{
                                            bs.trunkBranchInsert(hashes5, function(error, hashes6, relatPairs6){
                                                if(error){
                                                    callback(error);
                                                }else{
                                                    let relatPairs = relatPairs1.concat(relatPairs2).concat(relatPairs3)
                                                        .concat(relatPairs4).concat(relatPairs5).concat(relatPairs6);
                                                    bs.relatEstablish(relatPairs, function(error){
                                                        if(error){
                                                            callback(error);
                                                        }else{
                                                            callback(null);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

/**
 * update the states of all tips and unconfirmed transactions
 * @param callback
 */
function dbUpdate(callback){
    bs.stateUpdate(function(error){
        if(error){
            callback(error);
        }else{
            bs.delNullNode(function(error){
                if(error){
                    callback(error);
                }else{
                    callback(null);
                }
            });
        }
    });
}

/**
 * set the upper bound of Nodes in database to be @param upperBound
 * @param upperBound
 * @param callback
 */
function dbLimit(upperBound, callback){
    bs.delExtra(upperBound, function(error){
        if(error){
            callback(error);
        }else{
            callback(null);
        }
    });
}

module.exports = {
    dbInit,
    dbInsert,
    dbUpdate,
    dbLimit
};