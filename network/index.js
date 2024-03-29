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
     { from: 1, to: 3, hidden: false, label: 'relation', arrows: 'to, from, middle' },
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
         hideNodesOnDrag: false,
         hideEdgesOnDrag: false,
         hideEdgesOnZoom: false,
         navigationButtons: true
     },
     physics: {
         enabled: true,
         stabilization: true,
         minVelocity: 1,
         maxVelocity: 20,
     },
     edges: {
         hidden: true,
         width: 1,
         labelHighlightBold: true
     },
     nodes: {
         borderWidth: 1,
         shape: 'dot',
         color: 'red',
         size: 5,
         font: {
             color: '#343434',
             size: 14,
             face: 'Verdana',
             align: 'center'
         },
         shapeProperties: {
             borderRadius: 10,
         }
     },
     manipulation: {
         enabled: true,
         initiallyActive: false,

     },

 };

 // initialize your network!
 var network = new vis.Network(container, data, options);


 //  network.on('click', function(properties) {
 //      var ids = properties.nodes;
 //      var clickedNodes = nodes.get(ids);
 //      console.log('clicked nodes:', ids);
 //      let id = ids[0];
 //      console.log(nodes)
 //      if (id !== undefined) {
 //          nodes.update({ id: 6, label: "Node 6" });
 //          edges.update({ from: ids[0], to: 6 });
 //          edges.update({ from: 2, to: 5, hidden: false })
 //      }
 //  });

 //  network.on('selectNode', properties => {
 //      console.log('hey')
 //  });

 //  network.on('doubleClick', params => {
 //     var updatedIds = nodes.add([{
 //         label:'new',
 //         x:params.pointer.canvas.x,
 //         y:params.pointer.canvas.y
 //     }]);
 //     network.selectNodes([updatedIds[0]]);
 //     network.editNode();
 //  });