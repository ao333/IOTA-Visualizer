const iota = require('../config/config_iota');
const util = require('./util');
const neo = require('./neoDAO');
const underscore = require('underscore');

/**
 * get {amount} number of tips, tips are returned in form of array of hashes
 * callback(error, tips)
 * @param amount
 * @param callback
 */
function getTips(callback){
    //query tips using iota api
    iota.api.getTips(function (error, tips){
        if(error){
            callback(error, null);
        }else{
            neo.findRepli(tips, function(error, reps){
                if(error){
                    callback(error, null);
                }else{
                    let result = underscore.unique(underscore.difference(tips, reps));
                    callback(null, result);
                }
            });
        }
    });
}

function getTrunkBranchHash(objects, callback){
    let hashes = util.getTrunkBranchHash(objects);
    neo.findRepli(hashes, function(error, reps){
        if(error){
            callback(error, null);
        }else{
            let result = underscore.unique(underscore.difference(hashes, reps));
            callback(null, result);
        }
    });
}

function getTrunkBranchInitState(hashes, callback){
    let hashcopy = [].concat(hashes);
    iota.api.getLatestInclusion(hashes, function(error, isIncluded){
        if(error){
            callback(error, null, null);
        }else{
            let confirmed = [];
            let unconfirmed = [];
            for(let i = 0; i < isIncluded.length; i++){
                if(isIncluded[i]){
                    confirmed.push(hashcopy[i]);
                }else{
                    unconfirmed.push(hashcopy[i]);
                }
            }
            callback(null, confirmed, unconfirmed);
        }
    });
}

function dbInit(callback){
    neo.dbTruncate(function(error){
        if(error){
            callback(error);
        }else{
            neo.primaryKey(function(error){
                if(error){
                    callback(error);
                }else{
                    callback(null);
                }
            });
        }
    });
}

function tipInsert(callback){
    getTips(function(error, hashes){
        if(error){
            callback(error, null, null);
        }else{
            let tiphash = [].concat(hashes);
            iota.api.getTransactionsObjects(hashes, function(error, tip_objects){
                if(error){
                    callback(error, null, null);
                }else{
                    let relatPairs = util.getRelationPairs(tip_objects);
                    neo.batchAddition(tip_objects, 'tip', function(error){
                        if(error){
                            callback(error, null, null);
                        }else{
                            getTrunkBranchHash(tip_objects, function(error, tbhashes){
                                if(error){
                                    callback(error, null, null);
                                }else{
                                    callback(null, tiphash, tbhashes, relatPairs);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function trunkBranchInsert(hashes, callback){
    getTrunkBranchInitState(hashes, function(error, confirmed, unconfirmed){
        if(error){
            callback(error, null);
        }else{
            iota.api.getTransactionsObjects(confirmed, function(error, conf_objects){
                if(error){
                    callback(error, null);
                }else{
                    let confPairs = util.getRelationPairs(conf_objects);
                    //console.log('C'+confPairs.length);
                    neo.batchAddition(conf_objects, 'confirmed', function(error){
                        if(error){
                            callback(error, null);
                        }else{
                            iota.api.getTransactionsObjects(unconfirmed, function(error, raw_unconf_objects){
                                if(error){
                                    callback(error, null);
                                }else{
                                    let unconf_objects = util.arrayRemove(raw_unconf_objects);
                                    let unconfPairs = util.getRelationPairs(unconf_objects);
                                    //console.log('U'+unconfPairs.length);
                                    let relatPairs = confPairs.concat(unconfPairs);
                                    //console.log('R'+relatPairs.length);
                                    neo.batchAddition(unconf_objects, 'unconfirmed', function(error){
                                        if(error){
                                            callback(error, null);
                                        }else{
                                            getTrunkBranchHash(conf_objects, function(error, confHashes){
                                                if(error){
                                                    callback(error, null);
                                                }else{
                                                    getTrunkBranchHash(unconf_objects, function(error, unconfHashes){
                                                        if(error){
                                                            callback(error, null);
                                                        }else{
                                                            let tbhashes = underscore.union(confHashes, unconfHashes);
                                                            //console.log('TB'+tbhashes.length);
                                                            //console.log('R'+relatPairs.length);
                                                            callback(null, tbhashes, relatPairs);
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

function getUpdateUnconfirmedHash(callback){
    neo.findTipAndUnconfirmed('findUnconf', function(error, unconf){
        if(error){
            callback(error, null);
        }else{
            let unconfcopy = [].concat(unconf);
            iota.api.getLatestInclusion(unconf, function(error, isIncluded){
                if(error){
                    callback(error, null);
                }else{
                    let confirmed = [];
                    for(let i = 0; i < isIncluded.length; i++){
                        if(isIncluded[i]){
                            confirmed.push(unconfcopy[i]);
                        }
                    }
                    callback(null, confirmed);
                }
            });
        }
    });
}

function getUpdateTipHash(callback){
    neo.findTipAndUnconfirmed('findTip', function(error, tiphashes){
        if(error){
            callback(error, null, null);
        }else{
            let tiphashcopy1 = [].concat(tiphashes);
            iota.api.getLatestInclusion(tiphashes, function(error, isIncluded){
                if(error){
                    callback(error, null, null);
                }else{
                    let tiphashcopy2 = [].concat(tiphashcopy1);
                    iota.api.findTransactionObjects({'approvees': tiphashcopy1},function (error, objects){
                      if(error) {
                        callback(error, null, null);
                      }else{
                        //console.log(tiphashcopy2.length);
                        let roothashes = util.getTrunkBranchHash(objects);
                        let confirmed = [];
                        let unconfirmed = [];
                        //console.log(isIncluded.length);
                        for(let i = 0; i < isIncluded.length; i++){
                          if(isIncluded[i]){
                            confirmed.push(tiphashcopy2[i]);
                          }else if(roothashes.indexOf(tiphashcopy2[i]) >= 0){
                            unconfirmed.push(tiphashcopy2[i]);
                          }
                        }
                        //console.log(confirmed.length);
                        //console.log(unconfirmed.length);
                        callback(null, confirmed, unconfirmed);
                      }
                    });
                }
            });
        }
    });
}

function stateUpdate(callback){
    getUpdateUnconfirmedHash(function(error, unconfToConf){
        if(error){
            callback(error);
        }else{
            getUpdateTipHash(function(error, tipToConf, tipToUnconf){
                if(error){
                    callback(error);
                }else{
                    neo.stateUpdate(unconfToConf, 'unconfToConf', function(error){
                        if(error){
                            callback(error);
                        }else{
                            neo.stateUpdate(tipToConf, 'tipToConf', function(error){
                                if(error){
                                    callback(error);
                                }else{
                                    neo.stateUpdate(tipToUnconf, 'tipToUnconf', function(error){
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

function relatEstablish(pairs, callback){
    neo.relatEstab(pairs, function(error){
        if(error){
            callback(error);
        }else{
            callback(null);
        }
    });
}

module.exports = {
    dbInit,
    tipInsert,
    getTrunkBranchHash,
    getTrunkBranchInitState,
    trunkBranchInsert,
    stateUpdate,
    relatEstablish
};