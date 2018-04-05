const iota = require('./config/config_iota');

iota.api.getTips(function (error, tips) {
  let tip = tips[0];
  iota.api.getTransactionsObjects([tip], function (error, obj) {
    console.log(obj[0]);
  } );
});

