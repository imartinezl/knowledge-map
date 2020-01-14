 // create an array with nodes
 var nodes = new vis.DataSet([
     { id: 1, label: 'Node 1', level: 1 },
     { id: 2, label: 'Node 2' },
     { id: 3, label: 'Node 3' },
     { id: 4, label: 'Node 4' },
     { id: 5, label: 'Node 5' }
 ]);

 // create an array with edges
 var edges = new vis.DataSet([
     { from: 1, to: 3, title: 'relation', arrows: 'to, from, middle' },
     { from: 1, to: 2 },
     { from: 2, to: 4 },
     { from: 2, to: 5 },
     { from: 1, to: 5 }
 ]);

 // create a network
 var container = document.getElementById('mynetwork');

 // provide the data in the vis format
 var data = {
     nodes: nodes,
     edges: edges
 };
 var options = {
     autoResize: true,
     height: '100%',
     width: '100%',
     locale: 'en',
     clickToUse: false,
     interaction: {
         keyboard: false,
         hover: true,
         hoverConnectedEdges: true,
         multiselect: false,
         dragView: true,
         dragNodes: true,
         hideNodesOnDrag: true,
         hideEdgesOnDrag: false,
         hideEdgesOnZoom: true,
         navigationButtons: true
     },
     physics: {
         enabled: true,
         stabilization: true,
         minVelocity: 1,
         maxVelocity: 20,
     },
     edges: {
         width: 1,
         labelHighlightBold: true
     },
     nodes: {
         borderWidth: 1,
         shape: 'dot',
         size: 5,
         shapeProperties: {
             borderRadius: 10,
         }
     }

 };

 // initialize your network!
 var network = new vis.Network(container, data, options);


 network.on('click', function(properties) {
     var ids = properties.nodes;
     var clickedNodes = nodes.get(ids);
     console.log('clicked nodes:', ids);
     let id = ids[0];
     console.log(nodes)
     if (id !== undefined) {
         nodes.update({ id: 6, label: "Node 6" });
         edges.update({ from: ids[0], to: 6 });
         edges.update({ from: 2, to: 5, hidden: false })
     }
 });