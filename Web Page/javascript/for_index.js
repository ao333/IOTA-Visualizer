
$(function () {
  // force numbers in "information" to change randomly. This is just for current showing.
  // We will delete this later
  var nums = $("#information .num");
  setInterval(function () {
    for(var i = 0; i < nums.length; i++){
      nums[i].innerHTML = parseInt(Math.random() * 1000000 + "")
    }
  }, 2000)


  /**/
  // index records current clicked button in navigator bar, default is 0
  var current = $("#header .nav_bar .current")[0]
  var nav_bar = $("#header .nav_bar")[0]
  nav_bar.onclick = function (event) {
    if(event.target.className != "current"){
      current.className = current.className.replace("current","");
      event.target.className = "current"
      current = event.target
    }
  }
})


