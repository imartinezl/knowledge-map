"use strict";
const d3 = require('d3');
const flextree = require('d3-flextree').flextree;
const markmap = require('markmap/lib/d3-flextree');
const parse = require('markmap/lib/parse.txtmap');
const transform = require('markmap/lib/transform.headings');


export default class FController {

    constructor() {

    }

    init() {

        console.log("HEYUs");

        d3.text("./assets/example.txtmap", function (error, text) {
            console.log(error, text);
            if (error) throw error;
            console.log("Hey2")
            const data = transform(parse(text));
            markmap('svg#mindmap', data, {
                preset: 'default', // or default
                linkShape: 'bracket' // or bracket
            });
        });
    }
}