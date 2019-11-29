"use strict";
const d3 = require('d3');
// const flextree = require('d3-flextree').flextree;
require('markmap/lib/d3-flextree')
const markmap = require('markmap/lib/view.mindmap');
const parse = require('markmap/lib/parse.txtmap');
const transform = require('markmap/lib/transform.headings');


export default class FController {

    constructor() {

    }

    init() {

        console.log("HEY");
        d3.text("assets/example.txtmap").then((text) => {
            // console.log(text); // Hello, world!
            const data = transform(parse(text));
            // console.log(data);
            markmap('svg#mindmap', data, {
                preset: 'default', // or default
                linkShape: 'bracket' // or bracket
            });
        });

    }
}