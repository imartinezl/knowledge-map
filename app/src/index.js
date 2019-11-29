"use strict";

import AppController from './AppController';
import './style.css';

document.addEventListener("DOMContentLoaded", () => {
    let appController = new AppController();
    appController.init();
});