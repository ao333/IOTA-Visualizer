// var items = $("#table .item");
// $(function () {
//
//     var dataList = [];
//     $.getJSON("/info/infor_table_initial", function (data) {
//         for (var index = 0; index < 9; index++) {
//             dataList.push({'hash':data[index]['hash'],
//                            'type':data[index]['type'],
//                            'value':data[index]['value'],
//                            'confirmation_time':data[index]['time']})
//         }
//         updateTable(dataList)
//     })
//     var timer = setInterval(function () {
//         resetColor(0);
//         setTimeout(myFunction = function () {
//             $.getJSON("/info/infor_table_update", function (data) {
//                 dataList.pop();
//                 dataList.unshift({'hash':data[0]['hash'],
//                     'type':data[0]['type'],
//                     'value':data[0]['value'],
//                     'confirmation_time':data[0]['time']});
//                 updateTable(dataList);
//             });
//             changeColor(0);
//
//         }, 500)
//
//
//     }, 4000)
//
// });
//
// var changeColor = function (index) {
//     items[index].style.backgroundColor =  '#44556655';
// }
//
// var resetColor = function (index) {
//     items[index].style.backgroundColor = '#000000';
// }
//
// var updateTable = function(lst){
//     for (var index = 0; index < 9; index++) {
//         items.eq(index).parent().attr("href", "/search?hash="+lst[index]['hash']);
//         items.eq(index).children().eq(0).html(lst[index]['hash']);
//         items.eq(index).children().eq(1).html(lst[index]['type']);
//         items.eq(index).children().eq(2).html(lst[index]['value']);
//         items.eq(index).children().eq(3).html(lst[index]['confirmation_time']);
//     }
// };