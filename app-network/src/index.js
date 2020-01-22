import './styles/index.scss'
import vis from 'vis-network'

// create an array with nodes
var nodes = new vis.DataSet([
    { id: 1, label: 'Node 1', level: 1 },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' },
    { id: 6, label: 'Node 6' }
]);

// create an array with edges
var edges = new vis.DataSet([
    { from: 1, to: 3, title: 'relation', arrows: 'to, from, middle' },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 1, to: 5 },
    { from: 1, to: 6 }
]);
// create a network
var network = null;
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};

var clusterIndex = 0;
var clusters = [];
var lastClusterZoomLevel = 0;
var clusterFactor = 0.9;

function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}

function draw() {
    destroy();
    nodes = [];
    edges = [];

    // create a network
    var container = document.getElementById('mynetwork');
    var options = {
        autoResize: true,
        height: '100%',
        width: '100%',
        locale: 'en',
        clickToUse: false,
        layout: {
            randomSeed: 1,
            clusterThreshold: 50
        },
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
        },
        manipulation: {
            enabled: true,
            initiallyActive: true,
            addNode: function(data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Add Node";
                document.getElementById('node-id').value = data.id;
                document.getElementById('node-label').value = data.label;
                document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = clearPopUp.bind();
                document.getElementById('network-popUp').style.display = 'block';
            },
            editNode: function(data, callback) {
                // filling in the popup DOM elements
                document.getElementById('operation').innerHTML = "Edit Node";
                document.getElementById('node-id').value = data.id;
                document.getElementById('node-label').value = data.label;
                document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                document.getElementById('cancelButton').onclick = cancelEdit.bind(this, callback);
                document.getElementById('network-popUp').style.display = 'block';
            },
            addEdge: function(data, callback) {
                if (data.from == data.to) {
                    var r = confirm("Do you want to connect the node to itself?");
                    if (r == true) {
                        callback(data);
                    }
                } else {
                    callback(data);
                }
            }
        }
    };
    network = new vis.Network(container, data, options);

    // set the first initial zoom level
    network.once('initRedraw', function() {
        if (lastClusterZoomLevel === 0) {
            lastClusterZoomLevel = network.getScale();
        }
    });

    // we use the zoom event for our clustering
    network.on('zoom', function(params) {
        // console.log(params.scale, lastClusterZoomLevel);
        if (params.direction == '-') {
            if (params.scale < lastClusterZoomLevel * clusterFactor) {
                makeClusters(params.scale);
                lastClusterZoomLevel = params.scale;
            }
        } else {
            openClusters(params.scale);
        }
    });

    // if we click on a node, we want to open it up!
    network.on("selectNode", function(params) {
        if (params.nodes.length == 1) {
            if (network.isCluster(params.nodes[0]) == true) {
                network.openCluster(params.nodes[0])
            }
        }
    });


    // make the clusters
    function makeClusters(scale) {
        var clusterOptionsByData = {
            processProperties: function(clusterOptions, childNodes) {
                clusterIndex = clusterIndex + 1;
                var childrenCount = 0;
                for (var i = 0; i < childNodes.length; i++) {
                    childrenCount += childNodes[i].childrenCount || 1;
                }
                clusterOptions.childrenCount = childrenCount;
                clusterOptions.label = "# " + childrenCount + "";
                clusterOptions.font = { size: childrenCount * 5 + 30 }
                clusterOptions.id = 'cluster:' + clusterIndex;
                clusters.push({ id: 'cluster:' + clusterIndex, scale: scale });
                return clusterOptions;
            },
            clusterNodeProperties: { borderWidth: 3, shape: 'database', font: { size: 30 } }
        }
        network.clusterOutliers(clusterOptionsByData);
        if (document.getElementById('stabilizeCheckbox').checked === true) {
            // since we use the scale as a unique identifier, we do NOT want to fit after the stabilization
            network.setOptions({ physics: { stabilization: { fit: false } } });
            network.stabilize();
        }
    }

    // open them back up!
    function openClusters(scale) {
        var newClusters = [];
        var declustered = false;
        for (var i = 0; i < clusters.length; i++) {
            if (clusters[i].scale < scale) {
                network.openCluster(clusters[i].id);
                lastClusterZoomLevel = scale;
                declustered = true;
            } else {
                newClusters.push(clusters[i])
            }
        }
        clusters = newClusters;
        if (declustered === true && document.getElementById('stabilizeCheckbox').checked === true) {
            // since we use the scale as a unique identifier, we do NOT want to fit after the stabilization
            network.setOptions({ physics: { stabilization: { fit: false } } });
            network.stabilize();
        }
    }
}

function clearPopUp() {
    document.getElementById('saveButton').onclick = null;
    document.getElementById('cancelButton').onclick = null;
    document.getElementById('network-popUp').style.display = 'none';
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}

function saveData(data, callback) {
    data.id = document.getElementById('node-id').value;
    data.label = document.getElementById('node-label').value;
    clearPopUp();
    callback(data);
}

document.addEventListener("DOMContentLoaded", () => {
    draw();
});