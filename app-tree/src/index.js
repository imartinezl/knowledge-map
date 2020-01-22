"use strict";

import AppController from './AppController';
import './style.scss';

document.addEventListener("DOMContentLoaded", () => {
    let appController = new AppController();
    appController.init();
});