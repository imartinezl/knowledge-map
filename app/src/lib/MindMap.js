// import { flextree } from 'd3-flextree';
import * as d3 from 'd3';
import d3_layout_flextree from './d3Flextree';
// const flextree = require('d3-flextree').flextree;
import ColorPicker from './ColorPicker';
import Pickr from '@simonwep/pickr';


export default class MindMap {

  constructor(svg, data, options) {
    this.initConfig(svg, data, options);
    this.initCanvas();
    this.initMindMap(svg, data, options);
    this.initEvents();
    this.depthChange(0);
  }
  
  initConfig(svg, data, options){
    
    this.font_size = '15pt'
    this.font_family = 'Bebas Neue'
    this.font = this.font_size + ' ' + this.font_family
    
    this.svg = svg;
    this.svgElement = document.getElementById(svg.split('#')[1]);
    this.svgElement.style.fontFamily = this.font_family;
    this.svgElement.style.fontSize = this.font_size;
    
    this.collapsed = false;
    this.traverseMaxDepth(data);
    this.depth = 1; //this.maxDepth;
    this.depthText = document.getElementById("depthText");
    this.depthText.textContent = this.depth/2;
    
    this.newColors = false;
    this.colorA = '#007AFF';
    this.colorB = '#FFF500';
    this.colorPickerA = new ColorPicker('#color-picker-A', this.colorA);
    this.colorPickerB = new ColorPicker('#color-picker-B', this.colorB);

    this.nodeSelect = document.getElementById('nodeSelect');
    this.linkSelect = document.getElementById('linkSelect');

    this.config = {
      circleRadius: 5,
      duration: 300,
      font: this.font,
      layout: 'tree',
      linkShape: this.linkSelect[this.linkSelect.selectedIndex].value, // diagonal or bracket
      nodeHeight: parseInt(this.font),
      nodePaddingHorizontal: 12,
      nodePaddingVertical: 12,
      nodeSeparation: 50,
      renderer: this.nodeSelect[this.nodeSelect.selectedIndex].value, // basic or boxed
      spacingVertical: 12,
      spacingHorizontal: 20,
      truncateLabels: 0,
    };

  }
  initCanvas() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    // context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.font = this.font;
    // this.context.strokeText("KNOWLEDGE MAP", canvas.width / 2, canvas.height / 2);
  }
  initEvents() {
    document.getElementById("autofit").addEventListener("click", this.autoFit.bind(this));
    document.getElementById("zoomIn").addEventListener("click", this.zoomIn.bind(this));
    document.getElementById("zoomOut").addEventListener("click", this.zoomOut.bind(this));
    document.getElementById("depthIn").addEventListener("click", this.depthChange.bind(this,1));
    document.getElementById("depthOut").addEventListener("click", this.depthChange.bind(this,-1));
    this.colorPickerA.pickr.on('change', this.colorChanged.bind(this));
    this.colorPickerB.pickr.on('change', this.colorChanged.bind(this));
    this.nodeSelect.onchange = (event) => this.nodeStyleChanged(event);
    this.linkSelect.onchange = (event) => this.linkStyleChanged(event);
  }
  zoomIn() {
    this.updateZoomCenter(this.state.zoomTranslate, this.state.zoomScale * 1.1);
  }
  zoomOut() {
    this.updateZoomCenter(this.state.zoomTranslate, this.state.zoomScale / 1.1);
  }
  updateZoomCenter = (translate, scale) => {
    this.state.zoomTranslate = translate; // to review
    this.state.zoomScale = scale;
    this.zoom
      .translate(this.state.zoomTranslate)
      .scale(this.state.zoomScale)

    // this.svg.style("transform-origin", "50% 50% 0");
    this.svg.attr("transform", "translate(" + this.state.zoomTranslate + ")" + " scale(" + this.state.zoomScale + ")")
  }
  colorChanged(){
    this.newColors = true;
    this.colorA = this.colorPickerA.getHEXAColor();
    this.colorPickerA.pickr.setColor(this.colorA);
    this.colorB = this.colorPickerB.getHEXAColor();
    this.colorPickerB.pickr.setColor(this.colorB);
    this.update(this.state.root, false);
  }
  nodeStyleChanged(event){
    this.state.renderer = event.target.value;
    this.svg.selectAll("*").remove()
    this.update(this.state.root, true);
  }
  linkStyleChanged(event){
    this.state.linkShape = event.target.value;
    this.svg.selectAll("*").remove()
    this.update(this.state.root, true);
  }
  traverseDepth = (node) => {
    // console.log(node.name, node.children, node.depth)
    if (node.children !== undefined & node.children !== null & node.depth >= this.depth) {
      node.children.forEach(this.traverseDepth);
      node._children = node.children;
      node.children = null;
    } else if (node.children !== undefined & node.children !== null & node.depth < this.depth) {
      node.children.forEach(this.traverseDepth);
    } else if (node._children !== undefined & node.depth >= this.depth) {
      node._children.forEach(this.traverseDepth);
      node.children = node._children;
      node._children = null;
    }else if(node._children !== undefined & node.depth < this.depth){
      node._children.forEach(this.traverseDepth);
      node.children = node._children;
      node._children = null;
    }
  }
  maxDepth = 0;
  traverseMaxDepth = (node) => {
    if(node.children){
      node.children.forEach(this.traverseMaxDepth);
    }else{
      if(node.depth > this.maxDepth){
        this.maxDepth = node.depth;
      }
    }
  }
  depthChange = (incr) => {
    var depth = Math.max(0, Math.min(this.depth + incr*2, this.maxDepth*2));
    if (this.depth !== depth & this.collapsed) { // this.depth !== depth & 
      this.traverseDepth(this.state.root);
      this.collapsed = false;
    }
    this.depth = depth;
    this.traverseDepth(this.state.root);
    this.update(this.state.root, true);
    this.collapsed = !this.collapsed;
  }
  getInitialState = () => {
    return {
      zoomScale: 1,
      zoomTranslate: [0, 0],
      autoFit: false,
    };
  }
  getTextSize = (text, font) => {
    // return {width: text.length};
    var metrics = this.context.measureText(text);
    return metrics;
  };
  layouts = {
    tree: (self) => {
      return d3_layout_flextree()
        .setNodeSizes(true)
        .nodeSize((d) => {
          var metrics = self.getTextSize(d.name, self.config.font);

          var width = metrics.width;
          var height = parseInt(self.config.font);
          if (!d.dummy && width > 0) {
            // Add padding non-empty nodes
            width += 2 * self.state.nodePaddingHorizontal + self.state.nodeSeparation;
          }
          return [height, width];
        })
        .spacing(function (a, b) {
          return a.parent == b.parent ? self.state.spacingVertical : self.state.spacingVertical * 2;
        })
    }
  }
  linkShapes = {
    diagonal: function () {
      return d3.svg.diagonal()
        .projection(function (d) { return [d.y, d.x]; });
    },
    bracket: function () {
      return function (d) {
        return "M" + d.source.y + "," + d.source.x
          + "V" + d.target.x + "H" + d.target.y;
      };
    }
  }

  initMindMap = (svg, data, options) => {
    options = options || {};

    svg = svg.datum ? svg : d3.select(svg);

    this.i = 0;
    this.state = this.getInitialState();
    this.state = { ...this.state, ...this.config };
    this.state.height = svg.node().getBoundingClientRect().height;
    this.state.width = svg.node().getBoundingClientRect().width;

    // disable panning using right mouse button
    svg.on("mousedown", function () {
      var ev = d3.event;
      if (ev.button === 2) {
        ev.stopImmediatePropagation();
      }
    });

    this.zoom = d3.behavior.zoom()
      .scaleExtent([0.1, 2])
      .on("zoom", function () {
        this.updateZoom(d3.event.translate, d3.event.scale);
      }.bind(this));

    this.svg = svg
      .call(this.zoom)
      .append("g");

    this.updateZoom(this.state.zoomTranslate, this.state.zoomScale);

    this.setData(data);
    this.update(this.state.root, true);

    // if (this.state.autoFit === undefined || this.state.autoFit === null) {
    //   this.state.autoFit = false;
    // }
  }
  updateZoom = (translate, scale) => {
    this.state.zoomTranslate = translate; // to review
    this.state.zoomScale = scale;
    this.zoom
      .translate(this.state.zoomTranslate)
      .scale(this.state.zoomScale);
    this.svg.attr("transform", "translate(" + this.state.zoomTranslate + ")" + " scale(" + this.state.zoomScale + ")")
  }
  preprocessData = (data, prev) => {
    var state = this.state;

    if (state.truncateLabels) {
      traverseTruncateLabels(data, state.truncateLabels);
    }

    if (data.children) {
      data.children.forEach(function (d, i) {
        traverseBranchId(d, i, state);
      });
    }

    if (prev) {
      this.diffTreeState(data, prev);
    }
  }
  setData = (data) => {

    this.preprocessData(data, this.state.root);

    this.state.root = data;
    this.state.root.x0 = this.state.height / 2;
    this.state.root.y0 = 0;

    return this;
  }
  diffTreeState = (next, prev) => {
    var childrenNext = next.children;
    var childrenPrev = prev.children || prev._children;

    if (childrenNext && childrenPrev) {
      // if number of children is different (nodes we likely added or removed) we create a name based index
      // else we use position based comparison as nodes were likely just renamed
      var idx;
      if (childrenNext.length !== childrenPrev.length) {
        idx = childrenPrev.reduce(function (res, node) {
          res[node.name] = res[node.name] || [];
          res[node.name].push(node);
          return res;
        }, {});
      }

      for (var k = 0; k < childrenNext.length; k += 1) {
        var child;
        if (idx) {
          var nodes = idx[childrenNext[k].name];
          if (nodes) {
            child = nodes[0];
            idx[childrenNext[k].name] = nodes.slice(1);
          }
        } else {
          child = childrenPrev[k];
        }

        if (child) {
          this.diffTreeState(childrenNext[k], child);
        }
      }

      if (prev._children) {
        next._children = next.children;
        delete next.children;
      }
    }

    return next;
  }
  update = (source, autoFit = false) => {
    var state = this.state;
    source = source || state.root;
    var res = this.layout(state);
    if (autoFit) {
      var minX = d3.min(res.nodes, function (d) { return d.x; });
      var minY = d3.min(res.nodes, function (d) { return d.y; });
      var maxX = d3.max(res.nodes, function (d) { return d.x; });
      var maxY = d3.max(res.nodes, function (d) { return d.y + d.y_size; });
      var realHeight = maxX - minX;
      var realWidth = maxY - minY;
      var scale = Math.min(state.height / realHeight, state.width / realWidth, 1);
      var translate = [
        (state.width - realWidth * scale) / 2 - minY * scale,
        (state.height - realHeight * scale) / 2 - minX * scale
      ];
      this.updateZoom(translate, scale);
    }
    this.render(source, res.nodes, res.links);
    return this;
  }
  autoFit() {
    this.update(this.state.root, true);
  }
  layout = (state) => {
    var layout_ = this.layouts.tree(this);
    if (state.linkShape !== 'bracket') {
      // Fill in with dummy nodes to handle spacing for layout algorithm
      traverseDummyNodes(state.root);
    }

    // Compute the new tree layout.
    var nodes = layout_.nodes(state.root).reverse();

    // Remove dummy nodes after layout is computed
    nodes = nodes.filter(function (n) { return !n.dummy; });
    nodes.forEach(function (n) {
      if (n.children && n.children.length === 1 && n.children[0].dummy) {
        n.children = n.children[0].children;
      }
      if (n.parent && n.parent.dummy) {
        n.parent = n.parent.parent;
      }
    });

    if (state.linkShape === 'bracket') {
      nodes.forEach(function (n) {
        n.y += n.depth * state.spacingHorizontal;
      });
    }

    var links = layout_.links(nodes);

    return {
      nodes: nodes,
      links: links
    };
  }
  render = (source, nodes, links) => {
    this.renderers[this.state.renderer].call(this, source, nodes, links);
  }
  renderers = {
    boxed: function (source, nodes, links) {
      var svg = this.svg;
      var state = this.state;
      this.renderers.basic.call(this, source, nodes, links);
      var node = svg.selectAll("g.markmap-node");

      node.select('rect')
        .attr("y", -(state.nodeHeight + state.nodePaddingVertical) / 2)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('height', state.nodeHeight + state.nodePaddingVertical)
        .attr('fill', function (d) { return d3.rgb(d.color).brighter(1.2); })
        .attr('stroke', function (d) { return d.color; })
        .attr('stroke-width', 1)
        .attr('cursor', 'pointer');

      node.select('text')
        .attr("dy", state.nodeHeight / 2)
        .attr('cursor', 'pointer');

      svg.selectAll("path.markmap-link")
        .attr('stroke-width', 4)
        .attr('fill', 'none');
    },
    basic: function (source, nodes, links) {
      var svg = this.svg;
      var state = this.state;
      var currentMaxDepth = Math.max.apply(Math, nodes.map(i => i.depth));
      // console.log(currentMaxDepth, this.colorA, this.colorB);
      this.depth = currentMaxDepth;
      if(state.linkShape == "bracket"){
        this.depthText.textContent = this.depth;
      }else{
        this.depthText.textContent = this.depth/2;
      }

      var color = d3.scale.linear().domain([0, this.maxDepth])
      .interpolate(d3.interpolateHcl)
      .range([this.colorA, this.colorB])
      var linkShape = this.linkShapes[this.state.linkShape]();

      if (!nodes[0].color | this.newColors) {
        for (var i in nodes) {
          nodes[i].color = color(nodes[i].depth);
        }
        for (var i in links) {
          links[i].source.color = color(links[i].source.depth);
          links[i].target.color = color(links[i].target.depth);
        }
        this.newColors = false;
      }

      function linkWidth(d) {
        var depth = d.depth;
        if (d.name !== '' && d.children && d.children.length === 1 && d.children[0].name === '') {
          depth += 1;
        }
        return Math.max(6 - 2 * depth, 1.5);
      }

      // Update the nodes…
      var node = svg.selectAll("g.markmap-node")
        .data(nodes, function (d) { return d.id || (d.id = ++this.i); }.bind(this));

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
        .attr("class", "markmap-node")
        .attr("transform", function (d) { return "translate(" + (source.y0 + source.y_size - d.y_size - state.nodeSeparation) + "," + (source.x0) + ")"; })
        .on("click", this.click.bind(this))

      nodeEnter.append('rect')
        .attr('class', 'markmap-node-rect')
        .attr("y", function (d) { return -linkWidth(d) / 2 })
        .attr('x', function (d) { return d.y_size; })
        .attr('height', linkWidth)
        .attr('fill', function (d) { return d.color; });

      nodeEnter.append("circle")
        .attr('class', 'markmap-node-circle')
        .attr('cx', function (d) { return d.y_size - state.nodeSeparation; })
        .attr('stroke', function (d) { return d.color; })
        .attr("r", 1e-6)
        .style("fill", function (d) { return d._children ? d.color : ''; })
        .attr('cursor', 'pointer');

      nodeEnter.append("text")
        .attr('class', 'markmap-node-text')
        .attr("x", function (d) { return d.y_size; })
        .attr("dy", "-5")
        .attr("text-anchor", function (d) { return "start"; })
        .text(function (d) { return d.name; })
        .style("fill-opacity", 1e-6)
        .attr('cursor', 'pointer');

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(state.duration)
        .attr("transform", function (d) { return "translate(" + (d.y) + "," + (d.x) + ")"; });

      nodeUpdate.select('rect')
        .attr('x', -1)
        .attr('stroke-opacity', 1)
        .style("fill-opacity", 1)
        .attr('width', function (d) { return d.y_size - state.nodeSeparation; });

      nodeUpdate.select("circle")
        .attr("r", state.circleRadius)
        .style("fill", function (d) { return d._children ? d.color : ''; })
        .style('display', function (d) {
          var hasChildren = d.href || d.children || d._children;
          return hasChildren ? 'inline' : 'none';
        });

      nodeUpdate.select("text")
        .attr("x", 10)
        .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(state.duration)
        .attr("transform", function (d) { return "translate(" + (source.y + source.y_size - d.y_size - state.nodeSeparation) + "," + source.x + ")"; })
        .remove();

      nodeExit.select('rect')
        .attr('x', function (d) { return d.y_size; })
        // .attr('width', 0)
        .attr('stroke-opacity', 1e-6)
        .style("fill-opacity", 1e-6)

      nodeExit.select("circle")
        .attr("r", 1e-6);

      nodeExit.select("text")
        .attr("x", function (d) { return d.y_size; })
        .style("fill-opacity", 1e-6)


      // Update the links…
      var link = svg.selectAll("path.markmap-link")
        .data(links, function (d) { return d.target.id; });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
        .attr("class", "markmap-link")
        .attr('fill', 'none')
        .attr('stroke', function (d) { return d.target.color; })
        .attr('stroke-width', function (l) { return linkWidth(l.target); })
        .attr("d", function (d) {
          var o = { x: source.x0, y: source.y0 + source.y_size - state.nodeSeparation };
          return linkShape({ source: o, target: o });
        });

      // Transition links to their new position.
      link.transition()
        .duration(state.duration)
        .attr("d", function (d) {
          var s = { x: d.source.x, y: d.source.y + d.source.y_size - state.nodeSeparation };
          var t = { x: d.target.x, y: d.target.y };
          return linkShape({ source: s, target: t });
        });

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(state.duration)
        .attr("d", function (d) {
          var o = { x: source.x, y: source.y + source.y_size - state.nodeSeparation };
          return linkShape({ source: o, target: o });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });


    }
  }
  // Toggle children on click.
  click = (d) => {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    this.update(d);
  }
}


var traverseBranchId = (node, branch, state) => {
  if (!("branch" in node)) {
    node.branch = branch;
  }
  if (node.children) {
    node.children.forEach(function (d) {
      traverseBranchId(d, branch, state);
    });
  }
}
var traverseDummyNodes = (node) => {
  if (node.children) {
    node.children.forEach(traverseDummyNodes);

    node.children = [{
      name: '',
      dummy: true,
      children: node.children
    }];
  }
}
var traverseTruncateLabels = (node, length) => {
  if (node.name.length > length) {
    node.name = node.name.slice(0, length - 1) + '\u2026';
  }
  if (node.children) {
    node.children.forEach(function (n) {
      traverseTruncateLabels(n, length);
    });
  }
}