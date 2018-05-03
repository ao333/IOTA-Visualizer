const iota = require('./config/config_iota');
const driver = require('./config/config_neo4j');
const clearRequire = require('clear-require');

// setTimeout(function deletemore(){
//   let session = driver.session();
//   session.run('match (n) WITH n limit 20000 detach delete n')
//     .then(function (result) {
//       console.log("done");
//         setTimeout(deletemore, 100);
//     })
//     .catch(function(err){
//       console.log(err);
//       session.close();
//       setTimeout(deletemore, 100);
//     })
// },1);

let obj = {
  aa: function haha(){
    console.log(12);
}
}

console.log(obj.ab);
