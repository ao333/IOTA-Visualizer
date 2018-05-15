$(function(){
  let top = $("#footer").position().top;
  if($(window).height() >top + $("#footer").height()){
    $("#footer").css("position", "absolute");
    $("#footer").css("bottom", 0);
  }
  let parameter = getParameterByName('type');
  if(!parameter || parameter === 'day')
    dayChart();
  else if(parameter === 'mean_con_time')
    mean_con_time_chart();
  else if(parameter === 'value_ps')
    value_ps_chart();
  else if(parameter === 'value_pt')
    value_pt_chart();
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}