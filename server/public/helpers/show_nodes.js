//假设我得到了data
/*
data = [{_id, hash, hash1,hash2, type},{},{},{}]
* */
var tree_nodes = new vis.DataSet();
var tree_edges = new vis.DataSet();
var tree_options = {
    nodes: {
        shape: 'square',
        size: 15,
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
            }
        }
    },
    physics: {
        hierarchicalRepulsion: {
            springConstant: 0.01,
            damping: 0.3,
            springLength: 100,
            nodeDistance: 140
        },
        stabilization: {
                iterations: 100,
            }
    },
    layout: {
        improvedLayout: false,
        hierarchical: {
            enabled: true,
            levelSeparation: 100,
            nodeSpacing: 100,
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
        0:{color:'#ffff99'},
        1:{color:'#33ccff'},
        2:{color:'#e00b20'},
        4: {hidden: false, color:'#0000ff00'}
    }
};





var sphere_nodes = new vis.DataSet();
var sphere_edges = new vis.DataSet();
var sphere_options = {
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
                opt['color'] = '#5d4585';
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
            gravitationalConstant: -3000,
            springConstant: 0.001,
            springLength: 100
        }
    },
    layout: {
        improvedLayout: false,
        hierarchical: {
            enabled: false
        }
    },
    interaction: {
        tooltipDelay: 200,
        hideEdgesOnDrag: true

    },
    groups:{
        0:{color:'#ffff99'},//tips
        1:{color:'#33ccff'},//unconfirmed
        2:{color:'#e00b20'},//confirmed
        4: {hidden: false, color:'#0000ff00'}
        //3:{hidden: true}
        // ,2:{color:'ff6666'}
    }
};


function redrawAll(mode) {
    container = document.getElementById('main_for_show');
    if (mode == 0) {
        var data = {
            nodes: tree_nodes,
            edges: tree_edges
        };
        var options = tree_options;
    }
    else
    {
        var data = {
            nodes: sphere_nodes,
            edges: sphere_edges
        };
        var options = sphere_options;
    }
    network = new vis.Network(container, data, options);
}

var init_title = function (lst)
{
    var para = document.createElement("p");
    var node = document.createTextNode("Hash: "+lst["hash"]);
    var br = document.createElement('br');
    para.appendChild(node);
    para.appendChild(br);
    node = document.createTextNode("Value: "+lst["value"])
    var br = document.createElement('br');
    para.appendChild(node);
    para.appendChild(br);
    node = document.createTextNode("Address: "+lst["address"])
    para.appendChild(node);
    var br = document.createElement('br');
    para.appendChild(node);
    para.appendChild(br);
    node = document.createTextNode("Node Type: "+lst["type"])
    para.appendChild(node);
    return para
}

//mode 0 = tree  mode 1 = sphere
var init_graph = function (data, nodeList, edgeList, mode) {
    for (var i = 0; i < data.length; i++) {
        var gro;
        if (data[i]["type"] === "tip") gro = 0;
        else if (data[i]["type"] === "unconfirmed") gro = 1;
        else gro = 2;
        var para = init_title(data[i])
        var obj = {
            "id": data[i]["hash"],
            "title": para,
            "group": gro,
            "trunkTransaction": data[i]["trunkTransaction"],
            "branchTransaction": data[i]["branchTransaction"]
        };
        nodeList.add(obj);
    }
    nodeList.add({
        "id": "invisible_root",
        "title": "root",
        "group": 4
    })

    for (var i = 0; i < data.length; i++) {

        if (nodeList.get(data[i]["trunkTransaction"]) == null && nodeList.get(data[i]["branchTransaction"])==null){
            var from = "invisible_root"
            var to = data[i]["hash"];

            var obj = {
                "id": from+"-"+to,
                "from": from,
                "to": to,
                "color": {color:'#0000ff00'},
                chosen: {
                    "edge": function(opt)
                    {
                    }
                }};

            try{
                edgeList.add(obj);
            }
            catch(err){}
        }
        var to = data[i]["hash"];
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
            edgeList.add(obj1);
        }
        catch(err)
        {}
        try
        {
            edgeList.add(obj2);
        }
        catch(err)
        {}

    }
}
var container;
var network;
$.getJSON("/tangle/tree_initial", function(data) {
    treeMode = true
    init_graph(data, tree_nodes, tree_edges, 0);
    redrawAll(0);
});
$.getJSON("/tangle/sphere_initial", function(data) {
    init_graph(data, sphere_nodes, sphere_edges, 1);
});

var treeMode;
$('#graphmode').change(function() {
  if (!this.checked)
  {
    treeMode = true;
    redrawAll(0);
  }
  else
  {
    treeMode = false;
    redrawAll(1);
  }
});




var sphere_graph_timer = setInterval(function () {
    if (!treeMode){
      updata_hash = [];
      sphere_nodes.forEach(function (entry) {
        if (entry["group"] < 2)
          updata_hash.push(entry['id']);

      });
      $.ajax({
        type: "POST",
        url: "/tangle/sphere_update",
        data:JSON.stringify(updata_hash),
        contentType: "application/json; charset=utf-8",
        success: function(data){
          update_data(data, sphere_nodes, sphere_edges);
        }
      });
    }
},10000);
var updata_hash = [];
var tree_graph_timer = setInterval(function () {
    if (treeMode) {
        updata_hash = [];
        tree_nodes.forEach(function (entry) {
            if (entry["group"] < 2)
                updata_hash.push(entry['id']);
            
        });

      console.log(updata_hash.length);
      $.ajax({
        type: "POST",
        url: "/tangle/tree_update",
        data:JSON.stringify(updata_hash),
        contentType: "application/json; charset=utf-8",
        success: function(data){
          console.log(data.length);
          update_data(data, tree_nodes, tree_edges);
        }
      });
    }

},10000);

var update_data = function (data, nodeList, edgeList)
{
    for (var i = 0; i < data.length; i++) {
                var gro;
                if (data[i]["type"] === "tip") gro = 0;
                else if (data[i]["type"] === "unconfirmed") gro = 1;
                else gro = 2;
                var para = init_title(data[i])
                if(nodeList.get(data[i]["hash"]) != null)
                    nodeList.update({
                    id:data[i]["hash"],
                    "title": para,
                    "group": gro,
                })
                else
                {
                    nodeList.add(
                        {
                            "id": data[i]["hash"],
                            "title": para,
                            "group": gro,
                            "trunkTransaction": data[i]["trunkTransaction"],
                            "branchTransaction": data[i]["branchTransaction"]
                        });
                    var to = data[i]["hash"];
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
                        edgeList.add(obj1);
                    }
                    catch(err)
                    {}
                    try
                    {
                        edgeList.add(obj2);
                    }
                    catch(err)
                    {}
                }
            }
};



