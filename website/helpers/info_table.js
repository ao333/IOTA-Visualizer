$(function () {
    // force numbers in "information" to change randomly. This is just for current showing.
    // We will delete this later
    var items = $("#information .item");
    setInterval(function () {

        $.getJSON("http://51.140.113.215:3000/lastest_trans", function (data) {
            for (var index = 0; index < 9; index++) {
                items.eq(index).children().eq(0).html(data[index]['this_hash']);
                items.eq(index).children().eq(1).html(data[index]['type']);
                items.eq(index).children().eq(2).html(data[index]['value']);
                items.eq(index).children().eq(3).html(data[index]['confirmation_time']);
            }
        })

    }, 2000);


});