//假设我得到了data
/*
data = [{_id, hash, hash1,hash2, type},{},{},{}]
* */
var nodes = [];
var edges = [];
//var nodes_hash = [];
var network;

$.getJSON("http://localhost:3000/tangle/initial", function(data) {
        for (var i = 0; i < data.length; i++) {
            var gro;
            if (data[i]["type"] === "tip") gro = 0;
            else if (data[i]["type"] === "unconfirmed") gro = 1;
            else gro = 2;
            var obj = {
                "id": data[i]["this_hash"],
                "title": data[i]["value"],
                "group": gro,
                "trunkTransaction": data[i]["trunkTransaction"],
                "branchTransaction": data[i]["branchTransaction"]
            };
            //nodes_hash.push(data[i]["this_hash"]);
            nodes.push(obj);

        }
        for (var i = 0; i < data.length; i++) {
            var from1 = data[i]["this_hash"];
            var to1 = data[i]["trunkTransaction"];
            var to2 = data[i]["branchTransaction"];
            var obj1 = {
                "from": from1,
                "to": to1
            };
            var obj2 = {
                "from": from1,
                "to": to2
            };
            edges.push(obj1);
            edges.push(obj2);
        }


    redrawAll();
});

// function redrawAll() {
//   var container = document.getElementById('main_for_show');
//   var data = {
//     nodes: nodes,
//     edges: edges
//   };
//   var options = {
//     nodes: {
//       shape: 'dot',
//       scaling: {
//         min: 10,
//         max: 30
//       },
//       font: {
//         size: 12,
//         face: 'Tahoma'
//       },
//       chosen: {
//         node: function(opt, id, selected, hovering)
//         {
//             if (selected == true){
//             opt['color'] = 'red';
//             opt['width'] = 30;
//           }
//         }
//       }
//     },
//     edges: {
//       width: 0.15,
//       color: {inherit:'both'},
//       smooth: {
//         type: 'continuous'
//       },
//       chosen: {
//         edge: function(opt, id, selected, hovering)
//         {
//             if (selected == true){
//             opt['color'] = 'red';
//             opt['width'] = 30;
//           }
//         }
//       }
//     },
//     physics: {
//       stabilization: false,
//       barnesHut: {
//         gravitationalConstant: -8000,
//         springConstant: 0.001,
//         springLength: 200
//       }
//     },
//     interaction: {
//       tooltipDelay: 200,
//       hideEdgesOnDrag: true
//
//     },
//     groups:{
//       0:{color:'#ffff99'},
//       1:{color:'#33ccff'},
//       3:{color:'#996633'}
//       //3:{hidden: true}
//       // ,2:{color:'ff6666'}
//     }
//   };
//
//   // Note: data is coming from ./datasources/WorldCup2014.js
//   network = new vis.Network(container, data, options);
// }
function redrawAll() {
    var container = document.getElementById('main_for_show');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            shape: 'dot',
            scaling: {
                min: 10,
                max: 30
            },
            font: {
                size: 12,
                face: 'Tahoma'
            },
            chosen: {
                node: function(opt)
                {
                    opt['color'] = '#db2b3d';
                }
            }
        },
        edges: {
            width: 0.15,
            color: {inherit:'both'},
            smooth: {
                type: 'continuous'
            },
            chosen: {
                edge: function(opt)
                {
                    opt['color'] = '#db2b3d';
                    opt['width'] = 30;
                }
            }
        },
        physics: {
            stabilization: false,
            barnesHut: {
                gravitationalConstant: -8000,
                springConstant: 0.001,
                springLength: 200
            }
        },
        interaction: {
            tooltipDelay: 200,
            hideEdgesOnDrag: true

        },
        groups:{
            0:{color:'#ffff99'},
            1:{color:'#33ccff'},
            3:{color:'#996633'}
            //3:{hidden: true}
            // ,2:{color:'ff6666'}
        }
    };





    // Note: data is coming from ./datasources/WorldCup2014.js
    network = new vis.Network(container, data, options);
}
setInterval(function () {
    var updata_hash = [];
    for(var i = 0;i < nodes.length; i++)
        if (nodes[i]['group'] === 0 || nodes[i]['group'] === 1)
            updata_hash.push(nodes[i]['id']);
    var obj1 = {'update_hash' : updata_hash};
    $.post("11", obj1, function(data){
        var new_data = [];
        for (var i = 0; i < data.length; i++) {
            var flag = false;
            for (var j = 0; j < nodes.length; j++){
                if (data[i]['this_hash'] === nodes[j]['id']){
                    flag = true;
                    if (data[i]['type'] === 'tip') {
                        nodes[j]['group'] = 0;
                    }else if (data[i]['type'] === 'unconfirmed'){
                        nodes[j]['group'] = 1;
                    }else if (data[i]['type'] === 'confirmed'){
                        nodes[j]['group'] = 2;
                    }
                    break;
                }
            }
            if (!flag)
                new_data.push(data[i]);
        }

        for(var i = 0;i < new_data.length; i++){
            var gro;
            if(new_data[i]["type"] === "tip") gro = 0;
            else if(new_data[i]["type"] === "unconfirmed") gro = 1;
            else gro = 2;
            var obj = {
                "id" : new_data[i]["this_hash"],
                "title" : new_data[i]["value"],
                "group" : gro,
                "trunkTransaction" : new_data[i]["trunkTransaction"],
                "branchTransaction" : new_data[i]["branchTransaction"]
            };
            nodes.push(obj);

        }
        for(var i = 0; i < new_data.length; i++){
            var from1 = new_data[i]["this_hash"];
            var to1 = new_data[i]["trunkTransaction"];
            var to2 = new_data[i]["branchTransaction"];
            var obj1 = {
                "from" : from1,
                "to" : to1
            };
            var obj2 = {
                "from" : from1,
                "to": to2
            };
            edges.push(obj1);
            edges.push(obj2);
        }
        var data = {
            nodes: nodes,
            edges: edges
        };
        network.setData(data);
        network.redraw();

    }, "json")
},10000);
// create a network

