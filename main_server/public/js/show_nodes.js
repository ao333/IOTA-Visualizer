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
    }
};


var sphere_nodes = new vis.DataSet();
var sphere_edges = new vis.DataSet();
var sphere_options = {
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
    }
};

var network;
var init_graph = function (data, nodeList, edgeList, mode) {
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
        nodeList.add(obj);
    }
    if(mode==0) {
        nodeList.add({
            "id": "invisible_root",
            "title": "root",
            "group": 4,
        })
    }

    for (var i = 0; i < data.length; i++) {
        if (mode==0 && data[i]["type"] === "unconfirmed")
        {
            if (nodeList.get(data[i]["trunkTransaction"]) == null && nodeList.get(data[i]["branchTransaction"])==null){
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
                    edgeList.add(obj);
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
$.getJSON("/tangle/tree_initial", function(data) {
    init_graph(data, tree_nodes, tree_edges, 0);
    redrawAll(0);
});
$.getJSON("/tangle/sphere_initial", function(data) {
    init_graph(data, sphere_nodes, sphere_edges, 1);
});



function redrawAll(mode) {
    var container = document.getElementById('main_for_show');
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

    


var treeMode = true;
$('.graphmode').on('change', function(e) {
    e.preventDefault();
    if (e.checked)
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
var tree_graph_timer = setInterval(function () {
    if (treeMode)
        $.getJSON("/tangle/tree_update", function(data){
            for (var i = 0; i < data.length; i++) {
                var gro;
                if (data[i]["type"] === "tip") gro = 0;
                else if (data[i]["type"] === "unconfirmed") gro = 1;
                else gro = 2;
                if(tree_nodes.get(data[i]["this_hash"]) != null)
                    tree_nodes.update({
                    id:data[i]["this_hash"],
                    "title": data[i]["value"],
                    "group": gro,
                })
                else
                {
                    tree_nodes.add(
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
                        tree_edges.add(obj1);
                    }
                    catch(err)
                    {}
                    try
                    {
                        tree_edges.add(obj2);
                    }
                    catch(err)
                    {}
                }


            }


        }, "json")
},10000);





var sphere_graph_timer = setInterval(function () {
    if (!treeMode)
        $.getJSON("/tangle/sphere_update", function(data){
            for (var i = 0; i < data.length; i++) {
                var gro;
                if (data[i]["type"] === "tip") gro = 0;
                else if (data[i]["type"] === "unconfirmed") gro = 1;
                else gro = 2;
                if(sphere_nodes.get(data[i]["this_hash"]) != null)
                    sphere_nodes.update({
                        id:data[i]["this_hash"],
                        "title": data[i]["value"],
                        "group": gro,
                    })
                else
                {
                    sphere_nodes.add(
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
                        sphere_edges.add(obj1);
                    }
                    catch(err)
                    {}
                    try
                    {
                        sphere_edges.add(obj2);
                    }
                    catch(err)
                    {}
                }


            }


        }, "json")
},10000);