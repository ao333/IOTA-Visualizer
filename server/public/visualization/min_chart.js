function minChart(){

  let date_label = [];
  let close_price = [];
  let high_price = [];
  let low_price = [];
  $.get("https://min-api.cryptocompare.com/data/histominute?fsym=IOT&tsym=GBP&limit=60&aggregate=3&e=CCCAGG", function(data, status) {
    data = data["Data"];
    for (var i = 0; i < data.length; i++) {
      //get date
      unix_tm = data[i].time;
      var dt = new Date(unix_tm * 1000);
      var date = dt.getDate();
      var hour = dt.getHours();
      var min= dt.getMinutes();
      if( min < 10) {
        min = '0' + min;
      }
      var time = hour + ':' + min;
      date_label.push(time)
      // get close price
      cl_price = data[i].close;
      close_price.push(cl_price);
      // get high price
      h_price = data[i].high;
      high_price.push(h_price);
      // get close price
      l_price = data[i].low;
      low_price.push(l_price);
    }
  })
  .done(function() {
    $("#Chart").remove();
    $(".wrapper").append('<canvas id="Chart" width="1600" height="900"></canvas>');
    var ctx = $("#Chart");
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: date_label,
        datasets: [{
          data: close_price,
          label: "close price(GBP)",
          borderColor: "#3e95cd",
          fill: false
        }, {
          data: high_price,
          label: "high price(GBP)",
          borderColor: "#ff6384",
          fill: false
        }, {
          data: low_price,
          label: "low price(GBP)",
          borderColor: "#ffce56",
          fill: false
        }]
      }
    });
  });
};
