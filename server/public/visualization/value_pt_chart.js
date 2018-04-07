value_pt_chart = () => {
            $.get('/chart', function(data) {
                var date_label = [];
                var unix_time = data.time;
                var mct = data.MeanConTime;
                length = Math.min(unix_time.length, 60);
                for (var i = 0; i < length; i++) {
                    var dt = new Date(unix_time[i]);
                    var year = dt.getFullYear();
                    var month = dt.getMonth() + 1;
                    var date = dt.getDate();
                    var hour = dt.getHours();
                    var min = dt.getMinutes();
                    if (min < 10) {
                        min = '0' + min;
                    }
                    var time = year +'-'+month +'-' + date +" "+ hour + ':' + min;
                    date_label.push(time)
                };
                $("#Chart").remove();
                $(".wrapper").append('<canvas id="Chart" width="1600" height="900"></canvas>');
                var ctx = $("#Chart");
                console.log(data.ValuePerTran)
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: date_label,
                        datasets: [{
                            data: data.ValuePerTran,
                            label: "Value Per Transaction",
                            borderColor: "#ffce56",
                            fill: false
                        }]
                    }
                });
            });
        };
