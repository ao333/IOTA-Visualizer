const driver = require('../config/config_neo4j');
const util = require('./util');

function dbTruncate(callback){
    let session = driver.session();
    session.run(`MATCH (n) DETACH DELETE n`)
        .then(function(result){
            session.close();
            callback(null);
        })
        .catch(function(error){
        session.close();
        callback(error);
    });
}

function primaryKey(callback){
    let session = driver.session();
  session.run('CREATE CONSTRAINT ON (n:Node) ASSERT (n.hash) IS NODE KEY')
        .then(function(result){
            session.close();
            callback(null);
        })
        .catch(function(error){
            session.close();
            callback(error);
        });
}

function findRepli(hashes, callback){
    let session = driver.session();
    session.readTransaction(function (transaction) {
        let result = transaction.run(`UNWIND {hashParam} AS hp WITH DISTINCT hp MATCH (node:Node)
         WHERE node.hash = hp RETURN node.hash AS hash`, {hashParam: hashes});
        return result;
    }).then(function (result) {
        session.close();
        callback(null, result.records.map(function (record) {
            return record.get('hash');
        }));
    }).catch(function (error) {
        session.close();
        callback(error, null);
    });
}

function getCypher(states, callback){
    if(states == 'tip'){
        let cypher = `UNWIND {objectParam} AS op CREATE (node:Node:tip) SET node.hash = op.hash, 
    node.address = op.address, node.value = op.value, node.attachmentTimestamp = op.timestamp, 
    node.trunkTransaction = op.trunkTransaction, node.branchTransaction = op.branchTransaction, 
    node.insertTime = timestamp(), node.confirmTime = 0`;
        callback(null, cypher);
    }else if(states == 'unconfirmed'){
        let cypher = `UNWIND {objectParam} AS op CREATE (node:Node:unconfirmed) SET node.hash = op.hash, 
    node.address = op.address, node.value = op.value, node.attachmentTimestamp = op.timestamp, 
    node.trunkTransaction = op.trunkTransaction, node.branchTransaction = op.branchTransaction, 
    node.insertTime = timestamp(), node.confirmTime = 0`;
        callback(null, cypher);
    }else if(states == 'confirmed'){
        let cypher = `UNWIND {objectParam} AS op CREATE (node:Node:confirmed) SET node.hash = op.hash, 
    node.address = op.address, node.value = op.value, node.attachmentTimestamp = op.timestamp, 
    node.trunkTransaction = op.trunkTransaction, node.branchTransaction = op.branchTransaction, 
    node.insertTime = timestamp(), node.confirmTime = 0`;
        callback(null, cypher);
    }else if(states == 'tipToConf'){
        let cypher = `UNWIND {hashParam} AS hp WITH DISTINCT hp MATCH (node:tip) WHERE node.hash = hp
    REMOVE node:tip SET node:confirmed SET node.confirmTime = timestamp()`;
        callback(null, cypher);
    }else if(states == 'tipToUnconf'){
        let cypher = `UNWIND {hashParam} AS hp WITH DISTINCT hp MATCH (node:tip) WHERE node.hash = hp
    REMOVE node:tip SET node:unconfirmed`;
        callback(null, cypher);
    }else if(states == 'unconfToConf'){
        let cypher = `UNWIND {hashParam} AS hp WITH DISTINCT hp MATCH (node:unconfirmed) WHERE node.hash = hp
    REMOVE node:unconfirmed SET node:confirmed SET node.confirmTime = timestamp()`;
        callback(null, cypher);
    }else if(states == 'findTip'){
        let cypher = `MATCH (node:tip) RETURN node.hash AS hash`;
        callback(null, cypher);
    }else if(states == 'findUnconf'){
        let cypher = `MATCH (node:unconfirmed) RETURN node.hash AS hash`;
        callback(null, cypher);
    }else{
        callback('Wrong states:' + states, null);
    }
}

function findTipAndUnconfirmed(states, callback){
    getCypher(states, function(error, cypher){
        if(error){
            callback(error, null);
        }else{
            let session = driver.session();
            session.readTransaction(function (transaction) {
                let result = transaction.run(cypher);
                return result;
            }).then(function (result) {
                session.close();
                callback(null, result.records.map(function (record) {
                    return record.get('hash');
                }));
            }).catch(function (error) {
                session.close();
                callback(error, null);
            });
        }
    });
}

function batchAddition(objects, states, callback){
    getCypher(states, function(error, cypher){
        if(error){
            callback(error);
        }else{
            let session = driver.session();
            session.run(cypher, {objectParam: objects})
                .then(function(result){
                    session.close();
                    callback(null);
                })
                .catch(function(error){
                session.close();
                callback(error);
            });
        }
    });
}

function stateUpdate(hashes, states, callback){
    getCypher(states, function(error, cypher){
        if(error){
            callback(error);
        }else{
            let session = driver.session();
            session.run(cypher, {hashParam: hashes})
                .then(function(result){
                    session.close();
                    callback(null);
                })
                .catch(function(error){
                session.close();
                callback(error);
            });
        }
    });
}
/*
function relatEstabForward(hashes, callback){
    let session = driver.session();

    session.run(`UNWIND {hashParam} as hp MATCH (newNode:Node) MATCH (node:Node) WHERE newNode.hash = hp 
    AND (node.hash = newNode.trunkTransaction OR node.hash = newNode.branchTransaction)
    MERGE (newNode)-[:CONFIRMS]->(node)`, {hashParam: hashes})
        .then(function(result){
            session.close();
            callback(null);
        }).catch(function(error){
            session.close();
            callback(error);
        });
}

function relatEstabBackward(hashes, callback){
    let session = driver.session();
    session.run(`UNWIND {hashParam} as hp MATCH (newNode:Node) MATCH (node:Node) WHERE newNode.hash = hp 
    AND (node.trunkTransaction = hp OR node.branchTransaction = hp)
    MERGE (node)-[:CONFIRMS]->(newNode)`, {hashParam: hashes})
        .then(function(result){
            session.close();
            callback(null);
        }).catch(function(error){
            session.close();
            callback(error);
        });
}
*/
function relatEstab(pairs, callback){
    let session = driver.session();
    session.run(`UNWIND {pairParam} as pp MATCH (n1:Node), (n2:Node) 
    WHERE n1.hash = pp.start AND n2.hash = pp.end MERGE (n1)-[:CONFIRMS]->(n2)`, {pairParam: pairs})
        .then(function(result){
            session.close();
            callback(null);
        }).catch(function(error){
            session.close();
            callback(error);
        });
}
/*
function delNullNode(callback){
    let session = driver.session();
    session.run(`MATCH (node:Node) WHERE node.hash = 
    '999999999999999999999999999999999999999999999999999999999999999999999999999999999' DELETE node`)
        .then(function(result){
            session.close();
            callback(null);
        }).catch(function(error){
            seesion.close();
            callback(error);
    });
}
*/
module.exports = {
    dbTruncate,
    primaryKey,
    findRepli,
    findTipAndUnconfirmed,
    batchAddition,
    stateUpdate,
    relatEstab
};