// components of the graph --------------------------------------------------------------------
let container;
let network;
let tree_nodes;
let tree_edges;
let tree_options;
let sphere_nodes;
let sphere_edges;
let sphere_options;

// other tools ----------------------------------------------------------------------------------
// two timers to update the graph periodically, one for tree, one for sphere
let sphere_graph_timer;
let tree_graph_timer;

let update_hash = []; // store the hashes of nodes that are likely to be updated
let search_click = false; // record if button of search_click is selected
let treeMode = true; // record if button of switching modes is selected

// main function
$(function () {
  prepareTree();
  prepareSphere();
  initialButtons();

  let this_hash = getParameterByName("hash"); // if we choose specific node with hash as center
  if (!this_hash) {
    $.getJSON("/tangle/tree_initial", function (data) {
      init_graph(data, tree_nodes, tree_edges, 0);
      redrawAll(0);
    });

    $.getJSON("/tangle/sphere_initial", function (data) {
      init_graph(data, sphere_nodes, sphere_edges, 1);
    });

  }else{
    $.getJSON("/tangle/tree_initial?hash=" + this_hash, function (data) {
      if (data.novalid) {
        let isOK = confirm('The transaction you search is not in our database, do you want to' +
          'check this transaction details?');
        if (isOK) {
          $(location).attr('href', '/search?hash=' + this_hash);
        }
        return;
      }
      treeMode = true;
      init_graph(data, tree_nodes, tree_edges, 0, this_hash);
      redrawAll(0);
    });

    $.getJSON("/tangle/sphere_initial?hash=" + this_hash, function (data) {
      init_graph(data, sphere_nodes, sphere_edges, 1, this_hash);
    });
  }

  updateInterval(); // start the interval timers to update graph periodically
});

/**
 * prepare nodes, edges, properties, appearance for tree graph
 */
function prepareTree() {
  tree_nodes = new vis.DataSet();
  tree_edges = new vis.DataSet();
  tree_options = {
    nodes: {
      shape: 'square',
      size: 15,
      font: {
        size: 12,
        face: 'Tahoma'
      },
      chosen: {
        node: function (opt) {
          opt['color'] = '#5d4585';
        }
      }
    },
    edges: {
      width: 2,
      arrows: {
        from: true
      },
      color: {inherit: 'both'},
      smooth: {
        type: 'continuous'
      },
      chosen: {
        edge: function (opt, id, selected, hovering) {
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
    groups: {
      0: {color: '#dbdbdb'}, // tip
      1: {color: '#e00b20'}, // unconfirmed
      2: {color: '#0affbd'}, // confirmed
      4: {hidden: false, color: '#0000ff00'}, //hidden node to connect all nodes together
      6: {color: '#ff00fa'}, // searched node
      7: {color: 'yellow'} // new nodes
    }
  };
}

/**
 * prepare nodes, edges, properties, appearance for sphere graph
 */
function prepareSphere() {
  sphere_nodes = new vis.DataSet();
  sphere_edges = new vis.DataSet();
  sphere_options = {
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
        node: function (opt) {
          opt['color'] = '#5d4585';
        }
      }
    },
    edges: {
      width: 2,
      color: {inherit: 'both'},
      smooth: {
        type: 'continuous'
      },
      chosen: {
        edge: function (opt) {
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
    groups: {
      0: {color: '#dbdbdb'},
      1: {color: '#e00b20'},
      2: {color: '#0affbd'},
      4: {hidden: false, color: '#0000ff00'},
      6: {color: 'white'},
      7: {color: 'yellow'}
    }
  };
}

/**
 *  update the graph periodically
 */
function updateInterval() {
  sphere_graph_timer = setInterval(function () {
    if (!treeMode) {
      update_hash = [];
      sphere_nodes.forEach(function (entry) {
        if (entry["group"] < 2)
          update_hash.push(entry['id']);

      });
      $.ajax({
        type: "POST",
        url: "/tangle/sphere_update",
        data: JSON.stringify(update_hash),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
          update_data(data, sphere_nodes, sphere_edges);
        }
      });
    }
  }, 5000);

  tree_graph_timer = setInterval(function () {
    if (treeMode) {
      update_hash = [];
      tree_nodes.forEach(function (entry) {
        if (entry["group"] < 2)
          update_hash.push(entry['id']);

      });

      $.ajax({
        type: "POST",
        url: "/tangle/tree_update",
        data: JSON.stringify(update_hash),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
          update_data(data, tree_nodes, tree_edges);
        }
      });
    }

  }, 8000);
}

/**
 * redraw the graph using current data, this is useful when switching the modes
 *
 * @param mode
 *  current mode
 */
function redrawAll(mode) {
  container = document.getElementById('main_for_show');
  let data;
  let options;
  if (mode === 0) {
    data = {
      nodes: tree_nodes,
      edges: tree_edges
    };
    options = tree_options;
  }
  else {
    data = {
      nodes: sphere_nodes,
      edges: sphere_edges
    };
    options = sphere_options;
  }
  network = new vis.Network(container, data, options);
  if (search_click) {
    network.on('click', clicknodeSearch);
  }
}

/**
 * this function is used to write details (label) for each node in the graph
 *
 * @param lst
 *  the data for which we will write labels
 *
 * @returns {HTMLParagraphElement}
 *
 */
let init_title = function (lst) {
  let para = document.createElement("p");
  let node = document.createTextNode("Hash: " + lst["hash"]);
  let br = document.createElement('br');
  para.appendChild(node);
  para.appendChild(br);
  node = document.createTextNode("Value: " + lst["value"])
  br = document.createElement('br');
  para.appendChild(node);
  para.appendChild(br);
  node = document.createTextNode("Address: " + lst["address"])
  para.appendChild(node);
  br = document.createElement('br');
  para.appendChild(node);
  para.appendChild(br);
  node = document.createTextNode("Node Type: " + lst["type"])
  para.appendChild(node);
  return para
};

/**
 * initial graph
 *
 * @param data
 *  the initial data array
 * @param nodeList
 *  nodeList for specific graph mode
 * @param edgeList
 *  edgeList for specific graph mode
 * @param mode
 *  tree or sphere
 * @param search_hash
 *  in search mode, which is the searched node
 */
//mode 0 = tree  mode 1 = sphere
let init_graph = function (data, nodeList, edgeList, mode, search_hash) {
  for (let i = 0; i < data.length; i++) {
    let gro;
    if (data[i]["hash"] === search_hash) {
      gro = 6;
    }
    else if (data[i]["type"] === "tip") gro = 0;
    else if (data[i]["type"] === "unconfirmed") gro = 1;
    else gro = 2;
    let para = init_title(data[i]);
    let obj = {
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
  });

  for (let i = 0; i < data.length; i++) {

    if (nodeList.get(data[i]["trunkTransaction"]) == null && nodeList.get(data[i]["branchTransaction"]) == null) {
      let from = "invisible_root";
      let to = data[i]["hash"];

      let obj = {
        "id": from + "-" + to,
        "from": from,
        "to": to,
        "color": {color: '#0000ff00'},
        chosen: {
          "edge": function (opt) {
          }
        }
      };

      try {
        edgeList.add(obj);
      }
      catch (err) {
      }
    }
    let to = data[i]["hash"];
    let from1 = data[i]["trunkTransaction"];
    let from2 = data[i]["branchTransaction"];
    let obj1 = {
      "id": from1 + "-" + to,
      "from": from1,
      "to": to
    };
    let obj2 = {
      "id": from2 + "-" + to,
      "from": from2,
      "to": to
    };
    try {
      edgeList.add(obj1);
    }
    catch (err) {
    }
    try {
      edgeList.add(obj2);
    }
    catch (err) {
    }

  }
};

/**
 * set click event to all buttons
 */
function initialButtons() {
  $('#graphmode').change(function () {
    if (!this.checked) {
      treeMode = true;
      redrawAll(0);
    }
    else {
      treeMode = false;
      redrawAll(1);
    }
  });

  $('#search_click').change(function () {
    if (!this.checked) {
      search_click = false;
      network.off('click', clicknodeSearch);
    }
    else {
      search_click = true;
      network.on('click', clicknodeSearch);
    }
  });
}

/**
 * update the data when status of current data changed or there's new data
 *
 * @param data
 * @param nodeList
 * @param edgeList
 */
let update_data = function (data, nodeList, edgeList) {
  for (let i = 0; i < data.length; i++) {
    let gro;
    if (data[i]["type"] === "tip") gro = 0;
    else if (data[i]["type"] === "unconfirmed") gro = 1;
    else gro = 2;
    let para = init_title(data[i]);
    if (nodeList.get(data[i]["hash"]) != null)
      nodeList.update({
        id: data[i]["hash"],
        "title": para,
        "group": gro,
      });
    else {
      nodeList.add(
        {
          "id": data[i]["hash"],
          "title": para,
          "group": 7,
          "trunkTransaction": data[i]["trunkTransaction"],
          "branchTransaction": data[i]["branchTransaction"]
        });
      (function (hash, title, group) {
        setTimeout(function () {
          nodeList.update({
            id: hash,
            "title": title,
            "group": group,
          })
        }, 2000);
      })(data[i]["hash"], para, gro);

      let to = data[i]["hash"];
      let from1 = data[i]["trunkTransaction"];
      let from2 = data[i]["branchTransaction"];
      let obj1 = {
        "id": from1 + "-" + to,
        "from": from1,
        "to": to
      };
      let obj2 = {
        "id": from2 + "-" + to,
        "from": from2,
        "to": to
      };
      try {
        edgeList.add(obj1);
      }
      catch (err) {
      }
      try {
        edgeList.add(obj2);
      }
      catch (err) {
      }
    }
  }
};

/**
 * click the node to search for this node to give more details
 *
 * @param properties
 */
function clicknodeSearch(properties) {
  let id = properties.nodes[0];
  if (!id)
    return;
  $(location).attr('href', '/search?hash=' + id);
}

/**
 * get query string
 *
 * @param name
 * @param url
 * @returns {*}
 */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

