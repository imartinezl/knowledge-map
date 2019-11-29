"use strict";

import * as d3 from 'd3';
// const flextree = require('d3-flextree').flextree;
import Markmap from './lib/view.mindmap';

//require('markmap/lib/d3-flextree');
// import './lib/d3-flextree.js';

// const markmap = require('markmap/lib/view.mindmap');
// import markmap from './lib/view.mindmap';

import parse from './lib/parse.txtmap';
import transform from './lib/transform.headings';


export default class FController {

    constructor() {

    }

    init() {

        console.log("HEY");
        d3.text("assets/map.txt", (error, text) => {
            const data = transform(parse(text));
            console.log(data);
            Markmap('svg#mindmap', data, {
                preset: 'default', // or default / colorful
                linkShape: 'diagonal', // or bracket / diagonal
            });        
        });
        // d3.text("assets/map.txtmap").then((text) => {
        //     // console.log(text); // Hello, world!
        //     const data = transform(parse(text));
        //     console.log(data);
        //     console.log(Markmap);
        //     Markmap('svg#mindmap', data, {
        //         preset: 'default', // or default / colorful
        //         linkShape: 'diagonal', // or bracket / diagonal

        //     });
        // });

    }
}