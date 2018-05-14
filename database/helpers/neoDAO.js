const driver = require('../config/config_neo4j');
const util = require('./util');
const Label = require('../config/config_sour').Label;

/**
 * truncate all nodes in database
 * @param callback
 */
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

/**
 * set hash as the primary key of Node
 * @param callback
 */
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

/**
 * create index on attachTimestamp
 * @param callback
 */
function timeIndex(callback){
    let session = driver.session();
    session.run('CREATE INDEX ON :Node(attachmentTimestamp)')
        .then(function(result){
            session.close();
            callback(null);
        })
        .catch(function(error){
            session.close();
            callback(error);
        });
}

/**
 * return hashes already exists in database
 * @param hashes
 * @param callback
 */
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

/**
 * return the number of Nodes in database
 * @param callback
 */
function nodeCount(callback){
    let session = driver.session();
    session.readTransaction(function (transaction) {
        let result = transaction.run(`MATCH (n:Node) RETURN count (n) AS nodeCount`);
        return result;
    }).then(function (result) {
        session.close();
        callback(null, result.records.map(function (record) {
            return record.get('nodeCount');
        }));
    }).catch(function (error) {
        session.close();
        callback(error);
    });
}

function getCypher(states, callback){
    if(states == 'tip'){
        let cypher = `UNWIND {objectParam} AS op CREATE (node:Node:tip) SET node.hash = op.hash, 
    node.address = op.address, node.value = op.value, node.attachmentTimestamp = op.timestamp, 
    node.trunkTransaction = op.trunkTransaction, node.branchTransaction = op.branchTransaction, 
    node.source = {sourceParam}, node.insertTime = timestamp(), node.confirmTime = 0`;
        callback(null, cypher);
    }else if(states == 'unconfirmed'){
        let cypher = `UNWIND {objectParam} AS op CREATE (node:Node:unconfirmed) SET node.hash = op.hash, 
    node.address = op.address, node.value = op.value, node.attachmentTimestamp = op.timestamp, 
    node.trunkTransaction = op.trunkTransaction, node.branchTransaction = op.branchTransaction, 
    node.source = {sourceParam}, node.insertTime = timestamp(), node.confirmTime = 0`;
        callback(null, cypher);
    }else if(states == 'confirmed'){
        let cypher = `UNWIND {objectParam} AS op CREATE (node:Node:confirmed) SET node.hash = op.hash, 
    node.address = op.address, node.value = op.value, node.attachmentTimestamp = op.timestamp, 
    node.trunkTransaction = op.trunkTransaction, node.branchTransaction = op.branchTransaction, 
    node.source = {sourceParam}, node.insertTime = timestamp(), node.confirmTime = 0`;
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

/**
 * return hashes of all tips or all unconfirmed Nodes in database
 * @param states = {'findTip', 'findUnconf'}
 * @param callback
 */
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

/**
 * do batch addition
 * @param objects: transaction objects
 * @param states = {'tips', 'unconfirmed', 'confirmed'}
 * @param callback
 */
function batchAddition(objects, states, callback){
    getCypher(states, function(error, cypher){
        if(error){
            callback(error);
        }else{
            let session = driver.session();
            session.run(cypher, {objectParam: objects, sourceParam: Label})
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

/**
 * update the states of tip or unconfirmed transactions with hash in @param hashes
 * @param hashes
 * @param states = {'tipToConf', 'tipToUnconf', 'unconfToConf'}
 * @param callback
 */
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

/**
 * build relationship between each member in @param pairs
 * @param pairs
 * @param callback
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

/**
 * delete null node in database
 * @param callback
 */
function delNullNode(callback){
    let session = driver.session();
    session.run(`MATCH (node:Node) WHERE node.hash = 
    '999999999999999999999999999999999999999999999999999999999999999999999999999999999' 
    OR node.attachmentTimestamp < 0 DETACH DELETE node`)
        .then(function(result){
            session.close();
            callback(null);
        }).catch(function(error){
            session.close();
            callback(error);
    });
}

/**
 * delete earliest added {@param extraNode} number of Nodes
 * @param extraNode
 * @param callback
 */
function delExtraNode(extraNode, callback){
    let session = driver.session();
    session.run(`MATCH (n) WITH n ORDER BY n.attachmentTimestamp LIMIT {countParam}
     DETACH DELETE n`, {countParam: extraNode})
        .then(function(result){
            session.close();
            callback(null);
        }).catch(function(error){
            session.close();
            callback(error);
    });
}

module.exports = {
    dbTruncate,
    primaryKey,
    timeIndex,
    findRepli,
    nodeCount,
    findTipAndUnconfirmed,
    batchAddition,
    stateUpdate,
    relatEstab,
    delNullNode,
    delExtraNode
};