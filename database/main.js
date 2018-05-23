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

  setTimeout(function insert() {
    dbAction.dbInsert(function (error) {
      if(error){
        console.log(7,error);
      }
      else{
        console.log("insertion success!");
      }
      setTimeout(insert, 3000);
    })
  }, 1000);


  setTimeout(function update() {
    dbAction.dbUpdate(function (error) {
      if(error){
        console.log(8,error);
      }else {
        console.log('update success');
      }
      setTimeout(update, 5000);
    })
  }, 5000);


  setTimeout(function deleteMore(){
    dbAction.dbLimit(200000, function(error){
      if(error){
        console.log(9,error);
      }
      setTimeout(deleteMore, 600000);
    })
  }, 600000);