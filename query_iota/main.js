/*
    This file is the main file of database. We will just run this file (npm start) so the program will start to
    get initial data (around 200 transactions) into database, update states of these data every 2 seconds
    and add more data connected to data already existed.
 */
const driver = require('./config/config_neo4j');
const statistics = require('./helpers/statistics');
const connect = require('./config/config_mongo');
const update = require('./helpers/update');

connect.then(()=>{
  console.log('Connected correctly to db');
  // update data, add new data
  setTimeout(startUp, 1000);
}, (err) => {console.log(err);});


// calculate statistics (mean confirmation time, amount of tips, value per second)
let timer_statistics = setTimeout(function tick_statistics() {
  statistics.updateMeanCon(function () {
    statistics.updateTips(function () {
     setTimeout(function () {
       statistics.updatePrice(function () {
         statistics.updateValuePerSecond(function (error, done) {
           if(error)
             console.log(error);
           timer_statistics = setTimeout(tick_statistics, 1000);
         })
       })
     }, 5000);
    });
  });
}, 1000);

function startUp() {
  update.InitialDataIntoDb(function(error){
    if(error)
      console.log(error);
    else{
      console.log('Initial data has been stored in neo4j');
      update.UpdateDb(function (error) {
        if(error)
          console.log(error);
        else{
          let timerId = setTimeout(function tick() {
            console.log("start");
            update.UpdateDb(function(error, update_transactions){
              if(error){
                console.log(error);
                timerId = setTimeout(tick, 2000);
              }
              else{
                // after each update process, store all transactions which are just confirmed,
                // record the time so that we could compute confirmation time.
                statistics.extractConfirmed(update_transactions);
                update.addMoreTransactionsIntodb('tip',function(error){
                  if(error){
                    console.log(error);
                    timerId = setTimeout(tick, 2000);
                  }
                  else{
                    update.addMoreTransactionsIntodb('unconfirmed',function(error){
                      if(error){
                        timerId = setTimeout(tick, 2000);
                        console.log(error);
                      }
                      else{
                        let session = driver.session();
                        session.run('MATCH (n) RETURN COUNT(n)')
                          .then(function (result) {
                            let amount = result.records[0].toObject()['COUNT(n)'].toInt();
                            if(amount < 600){
                              timerId = setTimeout(tick, 2000);
                              console.log("done");
                            }
                            else
                              timerId = setTimeout(startUp, 10000);
                            session.close();
                          })
                          .catch(function (error) {
                            console.log(error);
                            session.close();
                            timerId = setTimeout(tick, 2000);
                          });
                      }
                    });
                  }
                });
              }
            });
          }, 1000);
        }
      })
    }
  });
}







