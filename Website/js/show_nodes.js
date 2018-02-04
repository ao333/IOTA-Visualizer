//假设我得到了data
/*
data = [{_id, hash, hash1,hash2, type},{},{},{}]
* */
var nodes = [];
var edges = [];
//var nodes_hash = [];
var network;

$.getJSON("http://51.140.113.215:3000/tangle", function(data){
  for(var i = 0;i < data.length; i++){
    var gro;
    if(data[i]["type"] === "tip") gro = 0;
    else if(data[i]["type"] === "unconfirmed") gro = 1;
    else gro = 2;
    var obj = {
      "id" : data[i]["this_hash"],
      "title" : data[i]["value"],
      "group" : gro,
      "trunkTransaction" : data[i]["trunkTransaction"],
      "branchTransaction" : data[i]["branchTransaction"]
    };
    //nodes_hash.push(data[i]["this_hash"]);
    nodes.push(obj);

  }
  for(var i = 0; i < data.length; i++){
    var from1 = data[i]["this_hash"];
    var to1 = data[i]["trunkTransaction"];
    var to2 = data[i]["branchTransaction"];
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




  // for (var i = 0; i < data.length; i++){
  //   if (nodes_hash.indexOf(nodes[i]['trunkTransaction']) == -1
  //     && nodes_hash.indexOf(nodes[i]['branchTransaction']) == -1)
  //   {
  //     nodes[i]['group'] = 3;
  //   }
  // }


  redrawAll();
});


// create a network
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
        node: function(opt, id, selected, hovering)
        {
            if (selected == true){
            opt['color'] = 'red';
            opt['width'] = 30;
          }
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
        edge: function(opt, id, selected, hovering)
        {
            if (selected == true){
            opt['color'] = 'red';
            opt['width'] = 30;
          }
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