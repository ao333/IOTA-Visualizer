var items = $(" .linkable");

$(function () {

    var search_button = document.getElementById("search_button");

    var value = document.getElementById("search_input").value;

    var times = 0;

    search_button.onclick = function() {
        value = document.getElementById("search_input").value;
        times++;
        style_change(times);
        $.post("/node_search", {value:value}, function (data) {
            update_data(data);
        },"json")


    };
    document.onkeydown = function (event) {
        value = document.getElementById("search_input").value;
        var key = event || window.event || arguments.callee.caller.arguments[0];
        //if click enter
        if (key === 13 ){
            times++;
            style_change(times)
            $.post("/node_search",  {value:value}, function (data) {
                update_data(data);
            },"json")
        }
    };


    for (var index = 0; index < items.length; index++) {
        items.eq(index).click( function () {
            var value = this.innerHTML;
            if (value.replace(/\s/g, "") != '-')
                {
                    $.post("/node_search",  {value:value}, function (data) {
                        update_data(data);
                    },"json")
                }


        });
    }
})



var update_data = function (data) {

    console.log(data)
    hash = $("#hash")
    address = $("#address")
    amount = $("#amount")
    stat = $("#status")
    time = $("#time")
    branch = $("#branch")
    trunk = $("#trunk")
    bundle = $("#bundle")
    signiture = $("#signature")
    if (data['valid'] == true)
    {
        status_text = data['status']
        if (status_text == "confirmed") {
            stat.css('color', "#00ff00aa");
            status_text = '✔ ' + status_text;
        }
        else if (status_text == "unconfirmed"){
            stat.css('color', "#ff0000aa");
            status_text = '✖ ' + status_text
        }
        else {
            status_text = status_text;
            stat.css('color', "#000000ff");
        }
        hash.html(data["hash"]);
        address.html(data["address"]);
        amount.html(data["amount"]);
        stat.html(status_text);
        time.html(data["time"]);
        branch.html(data["branchTransaction"]);
        trunk.html(data["trunkTransaction"]);
        bundle.html(data["bundle"]);
        signiture.html(data["signature"]);
    }
    else
    {
        hash.html('-');
        address.html('-');
        amount.html('-');
        stat.html('-');
        time.html('-');
        branch.html('-');
        trunk.html('-');
        bundle.html('-');
        signiture.html('-');
    }

}



function style_change(times) {
    if (times == 1){
        var search_header = document.getElementById('search_header');

        search_header.style.paddingBottom = '240px';

        var search_detail = document.getElementById('search_detail');

        search_detail.style.display = 'block';
    }
}


