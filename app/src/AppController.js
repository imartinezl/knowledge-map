"use strict";

import * as d3 from 'd3';
import MindMap from './lib/MindMap';
import parse from './lib/ParseTxt';
import transform from './lib/TransformText';
import TextArea from './lib/TextArea';

export default class AppController {

    constructor() {

    }

    init() {
        // new TextArea();
        var font = '15pt Bebas Neue';
        document.fonts.load(font).then( () => {
            console.log('Font loaded');
            d3.text("./assets/map.txt", (error, text) => {
                const data = transform(parse(text));
                console.log(data);
                new MindMap('svg#mindmap', data, {});        
            });
        });



    }
}