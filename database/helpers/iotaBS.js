const iota = require('../config/config_iota');
const util = require('./util');
const neo = require('./neoDAO');
const underscore = require('underscore');

/**
 * get {amount} number of tips, tips are returned in form of array of hashes
 * callback(error, tips)
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

/**
 * return the hashes of the trunk transactions and branch transactions which
 * did not appear in database
 * @param objects
 * @param callback
 */
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

/**
 * query whether the state of objects with hash in @param hashes is confirmed or unconfirmed
 * @param hashes
 * @param callback
 */
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

/**
 * Initialize the database
 * @param callback
 */
function dbInit(callback){
    neo.dbTruncate(function(error){
        if(error){
            callback(error);
        }else{
            neo.primaryKey(function(error){
                if(error){
                    callback(error);
                }else{
                    neo.timeIndex(function(error){
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

/**
 * get tips from iota api, insert tip transactions which do no appear in database
 * and return the following attributes of those transaction objects
 * tiphash: hashes of tips; tbhashes: trunk and branch transactions; relatPairs: (tip, trunkBranchHash)
 * @param callback
 */
function tipInsert(callback){
    getTips(function(error, hashes){
        if(error){
            callback(error, null, null, null);
        }else{
            let tiphash = [].concat(hashes);
            iota.api.getTransactionsObjects(hashes, function(error, tip_objects){
                if(error){
                    callback(error, null, null, null);
                }else{
                    let relatPairs = util.getRelationPairs(tip_objects);
                    neo.batchAddition(tip_objects, 'tip', function(error){
                        if(error){
                            callback(error, null, null, null);
                        }else{
                            getTrunkBranchHash(tip_objects, function(error, tbhashes){
                                if(error){
                                    callback(error, null, null, null);
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

/**
 * get transactions objects with hashes in @param hashes and insert those
 * which do not appear in database
 * @param hashes
 * @param callback
 */
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
                                    let relatPairs = confPairs.concat(unconfPairs);
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

/**
 * return the hashes whose states change from unconfirmed to confirmed
 * @param callback
 */
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

/**
 * return the hashes of tips whose states change to unconfirmed and confirmed, respectively
 * @param callback
 */
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
                        let roothashes = util.getTrunkBranchHash(objects);
                        let confirmed = [];
                        let unconfirmed = [];
                        for(let i = 0; i < isIncluded.length; i++){
                          if(isIncluded[i]){
                            confirmed.push(tiphashcopy2[i]);
                          }else if(roothashes.indexOf(tiphashcopy2[i]) >= 0){
                            unconfirmed.push(tiphashcopy2[i]);
                          }
                        }
                        callback(null, confirmed, unconfirmed);
                      }
                    });
                }
            });
        }
    });
}

/**
 * update states of all tips and unconfirmed transactions in database
 * @param callback
 */
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

/**
 * delete null nodes in database
 * @param callback
 */
function delNullNode(callback){
    neo.delNullNode(function(error){
        if(error){
            callback(error);
        }else{
            callback(null);
        }
    });
}

/**
 * delete earliest added Nodes until the number of Nodes fall below upperBound
 * @param upperBound
 * @param callback
 */
function delExtra(upperBound, callback){
    neo.nodeCount(function(error, nodeNo){
        if(error){
            callback(error);
        }else{
            if(nodeNo - upperBound > 0){
                neo.delExtraNode(nodeNo - upperBound, function(error){
                    if(error){
                        callback(error);
                    }else{
                        callback(null);
                    }
                });
            }
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
    relatEstablish,
    delNullNode,
    delExtra
};