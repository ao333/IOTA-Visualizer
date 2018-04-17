const bs = require('./iotaBS');
const underscore = require('underscore');

function dbInit(callback){
    bs.dbInit(function(error){
        if(error){
            callback(error);
        }else{
            callback(null);
        }
    });
}

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
                                                    // console.log('0 ' + hashes.length);
                                                    // console.log('1 ' + hashes1.length + ' ' + relatPairs1.length);
                                                    // console.log('2 ' + hashes2.length + ' ' + relatPairs2.length);
                                                    // console.log('3 ' + hashes3.length + ' ' + relatPairs3.length);
                                                    // console.log('4 ' + hashes4.length + ' ' + relatPairs4.length);
                                                    // console.log('5 ' + hashes5.length + ' ' + relatPairs5.length);
                                                    let relatPairs = relatPairs1.concat(relatPairs2).concat(relatPairs3)
                                                        .concat(relatPairs4).concat(relatPairs5).concat(relatPairs6);
                                                    //console.log('total ' + relatPairs.length);
                                                    bs.relatEstablish(relatPairs, function(error){
                                                        if(error){
                                                            callback(error);
                                                        }else{
                                                            //console.log('total ' + relatPairs.length);
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

function dbUpdate(callback){
    bs.stateUpdate(function(error){
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
    dbUpdate
};