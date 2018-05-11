/*
    This file is the main file of database. We will just run this file (npm start) so the program will start to
    get initial data into database, update states of these data every 2 seconds
    and add more data connected to data already existed.
 */

const dbAction = require('./helpers/dbAction');
const statistics = require('./helpers/statistics');
const connection = require('./config/config_mongo');
const driver = require('./config/config_neo4j');
const Statistics = require('./models/Statistics');

setTimeout(function(){
  connection.then(function startmongo() {
    console.log('connect to mongodb');
    Statistics.findOne({}, function (error, doc) {
      if(error){
        setTimeout(startmongo, 2000);
        return;
      }
      if(!doc || doc.length === 0){
        Statistics.create({}, function(error, success){
          if(error){
            setTimeout(startmongo, 2000);
            return;
          }
          statistics.updateMongoDb();
        })
      }else{
        statistics.updateMongoDb();
      }
    });
  });

  setTimeout(function init() {
      console.log('init. Notice: Initialization process may take a long time');
      setTimeout(function insert() {
        dbAction.dbInsert(function (error) {
          if(error){
            console.log(1, error);
            setTimeout(insert, 1000);
            return;
          }
          console.log("insert success");
          setTimeout(function update() {
            dbAction.dbUpdate(function update(error) {
              if(error){
                console.log(1, error);
                setTimeout(update, 1000);
              }
              console.log("update success");
              setTimeout(insert, 1000);
            })
          }, 1000);
        })
      }, 1000)
  }, 10);

  setTimeout(function delete999(){
    let session = driver.session();
    session.run('MATCH (n) where n.hash = "999999999999999999999999999999999999999999999999999999999999999999999999999999999" ' +
      ' OR n.attachmentTimestamp<0 OR n.address = "999999999999999999999999999999999999999999999999999999999999999999999999999999999" DETACH DELETE n')
      .then(function () {
        session.close();
        setTimeout(delete999, 5000);
      })
      .catch(function(err){
        session.close();
        setTimeout(delete999, 5000);
      })
  });

  setTimeout(function correctTip(){
    let session = driver.session();
    session.run('MATCH (tt)-[:CONFIRMS]->(tran:tip) REMOVE tran:tip SET tran:unconfirmed')
      .then(function () {
        session.close();
        setTimeout(correctTip, 60000);
      })
      .catch(function(err){
        session.close();
        setTimeout(correctTip, 60000);
      })
  },60000);

  setTimeout(function deletemore(){
    let session = driver.session();
    session.run('MATCH (n) RETURN count (n) AS cc')
      .then(function (result) {
        let count;
        result.records.forEach(function (record) {
          count = record.toObject().cc;
        });

        if(count.toInt){
          count = count.toInt();
        }

        // //This is to make sure there are no more than 200000 transactions in database, you can change it later
        // if(count > 200000){
        //   session.run('MATCH (n) WITH n ORDER BY n.attachmentTimestamp LIMIT ' + (count-200000) + ' DETACH DELETE n')
        //     .then(function (result) {
        //       setTimeout(deletemore, 200000);
        //       session.close();
        //     })
        //     .catch(function(err){
        //       session.close();
        //       setTimeout(deletemore, 100);
        //     })
        // }else{
        //   session.close();
        // }
      })
      .catch(function(err){
        session.close();
        setTimeout(deletemore, 100);
      })
  },200000);

}, 10);










