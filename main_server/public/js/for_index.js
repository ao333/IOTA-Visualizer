$(function () {
  // force numbers in "information" to change randomly. This is just for current showing.
  // We will delete this later
  var nums = $("#information .num");
  setInterval(function () {
      for (var index = 0; index < 4; index++) {
      	(function(index){
			$.getJSON("/stat/" + index, function (data) {
			        console.log("data: " + data);
              nums[3 - index].innerHTML = data + "";
            })
      	})(index);
      }

  }, 2000);

  /*set the events when mouse click the navigator bar*/
  // index records current clicked button in navigator bar, default is 0
  var current = $("#header .nav_bar .current")[0]
  var nav_bar = $("#header .nav_bar")[0]
  var nav_bars = $("#header a");
  var all_in_nodemap = $("#node_map .all")[0]
  var height_of_nodemap = getStyle($("#node_map")[0], "height")
  nav_bar.onclick = function (event) {
    if(event.target.className != "current" && (event.target.nodeName == "A" || event.target.nodeName == 'a')){
      current.className = current.className.replace("current","");
      event.target.className = "current"
      current = event.target
      var i;
      for(i = 0; i < nav_bars.length; i++){
        if(nav_bars[i] == current)
          break;
      }
      console.log(parseInt(height_of_nodemap) * -i)
      move(all_in_nodemap, "top", parseInt(height_of_nodemap) * -i, 20)
    }
  }
});

function whenexit(){
  $.get("/tangle/delete");
}


