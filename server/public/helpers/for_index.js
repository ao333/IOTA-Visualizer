$(function () {
  var nums = $("#information .num");
  setInterval(function () {
      for (var index = 0; index < 8; index++) {
      	(function(index){
      	  if(index === 4) return;
			$.getJSON("/stat/" + index, function (data) {
			        //console.log("data: " + data);
              nums[index].innerHTML = data + "";
            })
      	})(index);
      }
  }, 2000);

  // /*set the events when mouse click the navigator bar*/
  // // index records current clicked button in navigator bar, default is 0
  // var current = $("#header .nav_bar .current")[0]
  // var nav_bar = $("#header .nav_bar")[0]
  // var nav_bars = $("#header a");
  // var all_in_nodemap = $("#node_map .all")[0]
  // var height_of_nodemap = getStyle($("#node_map")[0], "height")
  // nav_bar.onclick = function (event) {
  //   if(event.target.className != "current" && (event.target.nodeName == "A" || event.target.nodeName == 'a')){
  //     current.className = current.className.replace("current","");
  //     event.target.className = "current"
  //     current = event.target
  //     var i;
  //     for(i = 0; i < nav_bars.length; i++){
  //       if(nav_bars[i] == current)
  //         break;
  //     }
  //     console.log(parseInt(height_of_nodemap) * -i)
  //     move(all_in_nodemap, "top", parseInt(height_of_nodemap) * -i, 20)
  //   }
  // };

  $('#information a').hover(function () {
    $(this).children().css('background-color', '#302f2f');
  }, function () {
    $(this).children().css('background-color', 'black');
  })

  $('#search_hash').click(function () {
    let value = $(this).prev().prev().val();
    $(this).prev().prev().val('');
    $(location).attr('href', '/search?hash='+value);
    return false;
  });

  $('#search_hash_this').click(function(){
    let value = $(this).prev().prev().prev().val();
    $(location).attr('href', '/?hash='+value);
    return false;
  });

  $('#search_address').click(function () {
    let value = $(this).prev().val();
    $(this).prev().val('');
    $(location).attr('href', '/search?address='+value);
    return false;
  });
});




