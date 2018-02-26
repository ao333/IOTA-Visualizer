//假设我得到了data
/*
data = [{_id, hash, hash1,hash2, type},{},{},{}]
* */
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
//var nodes_hash = [];
var network;

$.getJSON("/tangle/initial", function(data) {
        console.log(data);


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
            // nodes_hash.push(data[i]["this_hash"]);
            nodes.add(obj);
        }
        nodes.add({
                "id": "invisible_root",
                "title": "root",
                "group": 4,
            })
        
        for (var i = 0; i < data.length; i++) {
            if (data[i]["type"] === "unconfirmed")
            {
                if (nodes.get(data[i]["trunkTransaction"]) == null && nodes.get(data[i]["branchTransaction"])==null){
                    var from = "invisible_root"
                    var to = data[i]["this_hash"];
                    
                    var obj = {
                    "id": from+"-"+to,
                    "from": from,
                    "to": to,
                    "color": {color:'#00000000'},
                    chosen: {
                        "edge": function(opt)
                            {
                            }
                    }};

                    try{
                        edges.add(obj);
                    }
                    catch(err){}
                }
            }
            var to = data[i]["this_hash"];
            var from1 = data[i]["trunkTransaction"];
            var from2 = data[i]["branchTransaction"];
            var obj1 = {
                "id": from1+"-"+to,
                "from": from1,
                "to": to
            };
            var obj2 = {
                "id": from2+"-"+to,
                "from": from2,
                "to": to
            };
            try
            {
            edges.add(obj1);
            }
            catch(err)
            {}
            try
            {
            edges.add(obj2);
            }
            catch(err)
            {}
        }

    redrawAll();
});

function redrawAll() {
    var container = document.getElementById('main_for_show');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            shape: 'square',
            size: 15,
            // scaling: {
            //     min: 100,
            //     max: 300
            // },
            font: {
                size: 12,
                face: 'Tahoma'
            },
            chosen: {
                node: function(opt)
                {
                    opt['color'] = '#5d4585';
                }
            }
        },
        edges: {
            width: 2,
            arrows: {
                from: true
            },

            color: {inherit:'both'},
            smooth: {
                type: 'continuous'
            },
            chosen: {
                edge: function(opt, id, selected, hovering)
                {
                    opt['color'] = '#5d4585ff';
                    opt['width'] = 6;
                    var this_edge = edges.get(id);
                    var from = this_edge['from'];
                    var to = this_edge['to'];
                    if (selected || hovering)
                    {
                    	
                    }

                }
            }
        },
        // physics: {
        //     stabilization: false,
        //     barnesHut: {
        //         gravitationalConstant: -8000,
        //         springConstant: 0.001,
        //         springLength: 200
        //     }
        // },
   
        layout: {
            improvedLayout: false,
            hierarchical: {
            enabled: true,
            levelSeparation: 200,
            nodeSpacing: 200,
            direction: 'UD',
            sortMethod: 'directed'
            }
        },
        interaction: {
            tooltipDelay: 200,
            hideEdgesOnDrag: true,
            hover: true

        },
        groups:{
            0:{color:'#888888bb'},//tips
            1:{color:'#aa0000bb'},//unconfirmed
            2:{color:'#00aa00bb'},//confirmed
            4: {hidden: false, color:'#0000ff00'}
            //3:{hidden: true}
            // ,2:{color:'ff6666'}
        }
    };

    // Note: data is coming from ./datasources/WorldCup2014.js
    network = new vis.Network(container, data, options);
}
setInterval(function () {
    $.getJSON("/tangle/update", function(data){
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var gro;
            if (data[i]["type"] === "tip") gro = 0;
            else if (data[i]["type"] === "unconfirmed") gro = 1;
            else gro = 2;
            if(nodes.get(data[i]["this_hash"]) != null)
                nodes.update({
                id:data[i]["this_hash"],
                "title": data[i]["value"],
                "group": gro,
            })
            else
            {
                nodes.add(
                    {
                        "id": data[i]["this_hash"],
                        "title": data[i]["value"],
                        "group": gro,
                        "trunkTransaction": data[i]["trunkTransaction"],
                        "branchTransaction": data[i]["branchTransaction"]
                    });
                var from1 = data[i]["this_hash"];
                var to1 = data[i]["trunkTransaction"];
                var to2 = data[i]["branchTransaction"];
                var obj1 = {
                    "id": from1+"-"+to1,
                    "from": from1,
                    "to": to1
                };
                var obj2 = {
                    "id": from1+"-"+to2,
                    "from": from1,
                    "to": to2
                };

                try
                {
                edges.add(obj1);
                }
                catch(err)
                {}
                try
                {
                edges.add(obj2);
                }
                catch(err)
                {}
            }


        }


    }, "json")
},10000);

// create a network

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
