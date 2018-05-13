$(function () {
  var nums = $("#information .num");

  let width_rt = $('#node_map .right-top').width();
  let width_wd = $(window).width();
  let width = (width_wd - width_rt)+100;
  $('#node_map .right-top').css("left", width);
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




