/*
    This file is the main file of database. We will just run this file (npm start) so the program will start to
    get initial data into database, update states of these data every 2 seconds
    and add more data connected to data already existed.
 */

const dbAction = require('./helpers/dbAction');
const statistics = require('./helpers/statistics');
const connection = require('./config/config_mongo');
const driver = require('./config/config_neo4j');

setTimeout(function(){
  connection.then(function () {
    console.log('connect to mongodb');
    setTimeout(function update() {
      statistics.updateMeanCon(function (error) {
        if(error){
          console.log(1,error);
          setTimeout(update, 1000);
          return;
        }
        statistics.updateValuePerSecond(function (error) {
          if(error){
            console.log(2,error);
            setTimeout(update, 1000);
            return;
          }
          statistics.updateTips(function (error) {
            if(error){
              console.log(3,error);
              setTimeout(update,1000);
              return;
            }
            statistics.updatePrice(function (error) {
              if(error){
                console.log(4, error);
                setTimeout(update,1000);
                return;
              }
              setTimeout(update,1000);
            })
          })
        })
      })
    }, 1);

    setTimeout(function copy() {
      statistics.copyAndStore(function (error) {
        if(error){
          console.log(5, error);
          setTimeout(copy, 1000);
          return;
        }
      })
    }, 600000);
  },);



  setTimeout(function init() {
   // dbAction.dbInit(function (error) {
     // if(error){
       // console.log(6, error);
        //setTimeout(init, 1000);
        //return;
      //}
      console.log('init');
      setTimeout(function insert() {
        dbAction.dbInsert(function (error) {
          if(error){
            console.log(7, error);
            setTimeout(insert, 1000);
            return;
          }
          setTimeout(function update() {
            dbAction.dbUpdate(function update(error) {
              if(error){
                console.log(8, error);
                setTimeout(update, 1000);
              }
              setTimeout(insert, 1000);
            })
          }, 1000);
        })
      }, 1000)
   // })
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
        console.log(err);
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
        console.log(err);
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

        if(count > 100000){
          session.run('MATCH (n) WITH n ORDER BY n.attachmentTimestamp LIMIT ' + (count-100000) + ' DETACH DELETE n')
            .then(function (result) {
              session.close();
            })
            .catch(function(err){
              console.log(err);
              session.close();
              setTimeout(deletemore, 100);
            })
        }else{
          session.close();
        }
      })
      .catch(function(err){
        console.log(err);
        session.close();
        setTimeout(deletemore, 100);
      })
  },200000);

}, 60000);










