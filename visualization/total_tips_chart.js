let x = [1,2,3,4,5,6,7,8];
let y = [3,3,4,2,5,6,8,3];

var ctx = $("#priceChart");
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: x,
    datasets: [{
      data: y,
      label: "total tips",
      borderColor: "#3e95cd",
      fill: false
    }]
  }
});
