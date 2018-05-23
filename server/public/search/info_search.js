var items = $(" .linkable");

//Initialization Function
$(function () {
  let top = $("#footer").position().top;
  if($(window).height() >top + $("#footer").height()){
    $("#footer").css("position", "absolute");
    $("#footer").css("bottom", 0);
  }

  //position of loader
  let space = $('#for_loader');
  let loader = $('.loader');
  loader.css("left",space.position().left + space.outerWidth(true)/2 - loader.width()/2)
    .css("top", space.position().top);

  	//Extract the query string from url 
    let hashpara = getParameterByName('hash');
    let addresspara = getParameterByName('address');
    //Initialize the search page
    exemain();
    //The url includes a query string, then use the hash id/address in query string as the search entry
    if(hashpara){
      $('#for_loader').css('visibility', 'visible');
      window.scrollTo({
        top: $('#for_loader').position().top,
        behavior: "smooth"
      });
      $.post("/node_search?search=hash", {value: hashpara}, function (data) {
        style_change(1);
        update_data_by_id(data);
      }, "json");
    }
    else if(addresspara){
      $('#for_loader').css('visibility', 'visible');
      window.scrollTo({
        top: $('#for_loader').position().top,
        behavior: "smooth"
      });
      $.post("/node_search?search=address", {value: addresspara}, function (data) {
        style_change(2);
        update_data_by_address(data);
      }, "json")
    }

});
//Initialize the search page
function exemain(){
  var search_button = document.getElementById("search_button");

  var value = document.getElementById("search_input").value;

  search_button.onclick = function() {
    value = document.getElementById("search_input").value;
    send_post(value);
  };
  //When ENTER key pressed down
  document.onkeydown = function (event) {
    value = document.getElementById("search_input").value;
    var key = event || window.event || arguments.callee.caller.arguments[0];
    //if click enter
    if (key === 13 )
      send_post(value)
  };

  //When click on the hash id or address of trunk/branch/bundle transaction in the detailed information 
  //section of page, then redirect page to a new search page for this transation 
  for (var index = 0; index < items.length; index++) {
    items.eq(index).click( function () {
      var value = this.innerHTML;
      if (value.replace(/\s/g, "") != '-')//Check if it is a valid address/hash id
      {
        if (this.id != 'address')
        {
          $('#for_loader').css('visibility', 'visible');
          window.scrollTo({
            top: $('#for_loader').position().top,
            behavior: "smooth"
          });
          $.post("/node_search?search=hash", {value: value}, function (data) {
            style_change(1);
            update_data_by_id(data);
          }, "json");
        }
        else
        {
          $('#search_detail').css('display', 'none');
          $('#for_loader').css('visibility', 'visible');
          window.scrollTo({
            top: $('#for_loader').position().top,
            behavior: "smooth"
          });
          $.post("/node_search?search=address", {value: value}, function (data) {
            style_change(2);
            update_data_by_address(data);
          }, "json")
        }
      }


    });
  }
}


//Function to post value to server either search by hash or address depending on the radio button
var send_post = function (value)
{
    if ($("#by_hash").is(":checked"))
    {
      $('#for_loader').css('visibility', 'visible');
      window.scrollTo({
        top: $('#for_loader').position().top,
        behavior: "smooth"
      });
        $.post("/node_search?search=hash", {value: value}, function (data) {
          style_change(1);
            update_data_by_id(data);
        }, "json");
    }
    else
    {
      $('#for_loader').css('visibility', 'visible');
      window.scrollTo({
        top: $('#for_loader').position().top,
        behavior: "smooth"
      });
        $.post("/node_search?search=address", {value: value}, function (data) {
          style_change(2);
            update_data_by_address(data);
        }, "json")
    }
}
//Function to update the 'search by address information'
// once receive requested info from server
var update_data_by_address = function(data){
    address = $("#address_by_address")
    num_trans = $("#num_trans")
    rece_tran_v = $("#rece_tran_v")
    snt_tran_v = $("#snt_tran_v")
    con_uncon_ratio = $("#con_uncon_ratio")
    latest_date = $("#latest_date")
    if (data['valid'] == true)
    {
        address.html(data['address']);
        num_trans.html(data['num_trans']);
        rece_tran_v.html(data['received_t_value']);
        snt_tran_v.html(data['sent_t_value']);
        con_uncon_ratio.html(data['con_uncon_ratio']);
        latest_date.html(data['latest_date']);
    }
    else
    {
        address.html('-');
        num_trans.html('-');
        rece_tran_v.html('-');
        snt_tran_v.html('-');
        con_uncon_ratio.html('-');
        latest_date.html('-');
    }
}

//Function to update the 'search by hash information'
// once receive requested info from server
var update_data_by_id = function (data) {
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


//Change the webpage layout due to different information to show
function style_change(mode) {//1 for hash 2 for address
  $("#footer").css("position", "relative");
  $('#for_loader').css('visibility', 'hidden');
  if (mode == 1){
        var search_header = document.getElementById('search_header');
        search_header.style.paddingBottom = '5%';

        var search_detail = document.getElementById('search_detail');
        var search_by_add = document.getElementById('search_by_address');
        search_detail.style.display = 'block';
        search_by_add.style.display = 'none'
      window.scrollTo({
        top: $('#search_detail').position().top,
        behavior: "smooth"
      });
    }
    else
    {
        var search_header = document.getElementById('search_header');

        search_header.style.paddingBottom = '5%';

        var search_detail = document.getElementById('search_detail');
        var search_by_add = document.getElementById('search_by_address');
        search_detail.style.display = 'none';
        search_by_add.style.display = 'block'
      window.scrollTo({
        top: $('#search_by_address').position().top,
        behavior: "smooth"
      });
    }
}
//Extract the query string from url 
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


