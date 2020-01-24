//var nodes = null;
//var edges = null;
var network = null;

// remove positoins
for (var i = 0; i < nodes.length; i++) {
  delete nodes[i].x;
  delete nodes[i].y;
}

// create a network
var container = document.getElementById("mynetwork");
var data = {
  nodes: nodes,
  edges: edges
};
var options = {
  nodes: {
    shape: "dot",
    scaling: {
      min: 10,
      max: 30
    },
  },

  width: "100%",
  height: "100%",
  interaction: {
    hover: true,
    tooltipDelay: 200,
    hideEdgesOnDrag: true
  },
  layout: {
    improvedLayout: false,
    hierarchical: {
      enabled: false,
//      levelSeparation: 160,
//      nodeSpacing: 10,
//      blockShifting: true,
//      edgeMinimization: true,
//      sortMethod: "directed"
    }
  },
  physics: {
  	enabled: true,
    stabilization: false,
    barnesHut: {
        gravitationalConstant: -80000,
        springConstant: 0.001,
        springLength: 200
      }
  },
  edges: {
    smooth: false,
    hoverWidth: 0,
    width: 0.15,
    color: {
      inherit: "from"
    },
    labelHighlightBold: false,
    hidden: true,
    
  }
};

network = new vis.Network(container, data, options);

var toggle = false;


network.on("hoverNode", function(e) {
  //console.log("HOVER", e.node)
  let connectedEdges = network.getConnectedEdges(e.node);
  lista = [];
	connectedEdges.forEach(edge => {
  	lista.push({
    	id: edge,
      hidden: false
    })
  })
  this.body.data.edges.update(lista)

});

network.on("blurNode", function(e) {
  //console.log("BLUR", e.node)
  let connectedEdges = network.getConnectedEdges(e.node);
  lista = [];
	connectedEdges.forEach(edge => {
  	lista.push({
    	id: edge,
      hidden: true
    })
  })
  this.body.data.edges.update(lista)
});


