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
            console.log(data);
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

    hash = $("#hash")
    address = $("#address")
    amount = $("#amount")
    status = $("#status")
    time = $("#time")
    branch = $("#branch")
    trunk = $("#trunk")
    bundle = $("#bundle")
    signiture = $("#signature")
    if (data['valid'] == true)
    {
        hash.html(data["hash"]);
        address.html(data["address"]);
        amount.html(data["amount"]);
        status.html(data["status"]);
        time.html(data["time"]);
        branch.html(data["branchTransaction"]);
        trunk.html(data["trunkTransaction"]);
        bundle.html(data["bundle"]);
        signiture.html(data["signiture"]);
    }
    else
    {
        hash.html('-');
        address.html('-');
        amount.html('-');
        status.html('-');
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

        search_header.style.paddingBottom = '270px';

        var search_detail = document.getElementById('search_detail');

        search_detail.style.display = 'block';
    }
}


