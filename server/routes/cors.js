const cors = require('cors');

//only domains in whitelist could visit specific router
const whitelist = ['http://localhost:3000','http://127.0.0.1:3000', 'http://51.140.113.215:3000'];
let corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  if(whitelist.indexOf(req.header('Origin')) !== -1){
    corsOptions = {origin: true};
  }else{
    corsOptions = {origin: false};
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);