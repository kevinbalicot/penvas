'use strict';

export class Container {

    constructor (options = {}) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || window.innerWidth;
        this.height = options.height || window.innerHeight;
        this.background = options.background || 0xffffff;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = this.background;

        this.context = this.canvas.getContext('2d');
        this.ctx = this.context;
    }
}
