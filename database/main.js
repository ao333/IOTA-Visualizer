/*
    This file is the main file of database. We will just run this file (npm start) so the program will start to
    get initial data into database, update states of these data every 2 seconds
    and add more data connected to data already existed.
 */

const dbAction = require('./helpers/dbAction');
const statistics = require('./helpers/statistics');
const connection = require('./config/config_mongo');


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
      setTimeout(copy, 1800000);
    })
  }, 600000)
},);



setTimeout(function init() {
  // dbAction.dbInit(function (error) {
  //   if(error){
  //     console.log(6, error);
  //     setTimeout(init, 1000);
  //     return;
  //   }
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
  //})
}, 10);









