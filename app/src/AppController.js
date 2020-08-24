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
        var font = '15pt Bebas Neue';
        document.fonts.load(font).then(() => {
            console.log('Font loaded');
            let txt = 'https://raw.githubusercontent.com/imartinezl/knowledge-map/master/app/src/assets/map1.txt'
            fetch(txt)
                .then((response) => response.text())
                .then((text) => {
                    const data = transform(parse(text));
                    new MindMap('svg#mindmap', data, {});
                })
        });



    }
}