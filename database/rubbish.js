const iota = require('./config/config_iota');
const driver = require('./config/config_neo4j');
const clearRequire = require('clear-require');

setTimeout(function deletemore(){
  let session = driver.session();
  session.run('match (n) return count(n)')
    .then(function (result) {
    })
    .catch(function(err){
      console.log(err);
      session.close();
    })
},1);

