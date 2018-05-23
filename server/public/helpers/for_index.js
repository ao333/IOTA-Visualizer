$(function () {
  var nums = $("#information .num");

  // set position of top-right corner
  let width_rt = $('#node_map .right-top').width();
  let width_wd = $(window).width();
  let width = (width_wd - width_rt)+150;
  $('#node_map .right-top').css("left", width);

  // set position of loading animation
  let space = $('#space');
  let loader = $('.loader');
  loader.css("left",space.position().left + space.width()/2 - loader.width()/2)
    .css("top", space.position().top+space.height()/2 - loader.height());

  setInterval(function () {
    for (var index = 0; index < 8; index++) {
      (function(index){
        if(index === 5) return;
        $.getJSON("/stat/" + index, function (data) {
          if(typeof data === 'string' && data.match(/[eE]/) && Number(data)){
            extractNumber(data, nums[index]);
          }else{
            nums[index].innerHTML = data + "";
          }
        })
      })(index);
    }
  }, 2000);

  function extractNumber(data, htmlcontent){
    let result = data.split(/[eE]/);
    if(result[1].substring(0,1) === '+')
      result[1] = result[1].substring(1);
    if(result[1] === '0'){
      htmlcontent.innerHTML = result[0];

    }else{
      htmlcontent.innerHTML = result[0] + 'x10<sup>' + result[1] + '</sup>';

    }
  }


  $('#information a').hover(function () {
    $(this).children().css('background-color', '#302f2f');
  }, function () {
    $(this).children().css('background-color', 'black');
  });

  $('#search_hash').click(function () {
    let value = $(this).prev().prev().val();
    $(this).prev().prev().val('');
    window.open('/search?hash='+value, '_blank');
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
    window.open('/search?address='+value, '_blank');
    return false;
  });
});




