fetch = require('node-fetch')
const cc = require('cryptocompare')


let date_label = []
let close_price = []
cc.histoDay('IOT', 'GBP')
.then(data => {
  console.log(data)
  for( var i=0; i<data.length; i++){
    //get date
    unix_tm = data[i].time;
    var dt = new Date(unix_tm*1000);
    var date = dt.getDate();
    var month = dt.getMonth();
    var year = dt.getFullYear();
    var time = year + '/' + month +'/' +date;
    date_label.push(time)
    // get close price
    price = data[i].close;
    close_price.push(price);
  }
}).then(function(){
  console.log(date_label);
  console.log(close_price);
})
.catch(console.error)
