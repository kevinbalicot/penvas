'use strict';

import { Ticker } from './ticker';
import { Model } from './model';
import { keyboard } from './keyboard';
import { loader } from './loader';

export class Application {

    constructor (options = {}) {

        this.options = options;
        this.layers = [];
        this.currentLayer = null;
        this.keyboard = keyboard;
        this.loader = loader;
        //this.debug = options.debug || false;

        if (typeof options.container != 'object') {
            options.container = document.querySelector('body');
        }

        this.width = options.width || window.innerWidth;
        this.height = options.height || window.innerHeight;
        this.background = options.background || 0xffffff;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = this.background;

        this.context = this.canvas.getContext('2d');
        this.ctx = this.context;

        options.container.appendChild(this.canvas);

        if (!!options.create) {
            options.create.call(this);
            this.loader.on('ready', () => this.ready());
        }

        this.ticker = new Ticker();

        this.ticker.on('step', this.step, this);
        this.ticker.on('render', this.render, this);

        if (this.loader.ready) {
            this.ticker.start();
        }
    }

    step (dt) {
        try {
            if (!!this.options.step) {
                this.options.step.call(this, dt);
            }

            if (!!this.currentLayer && !!this.currentLayer.step) {
                this.currentLayer.step.call(this, dt);
            }
        } catch(e) {
            this.handleError(e);
        }
    }

    render (dt) {
        try {
            if (!!this.options.render) {
                this.options.render.call(this, dt);
            }

            if (!!this.currentLayer && !!this.currentLayer.render) {
                this.currentLayer.render.call(this, dt);
            }
        } catch(e) {
            this.handleError(e);
        }

        // Render debug
        /*if (this.debug) {
            for (let prop in this) {
                if (this[prop] instanceof Model) {
                    this.renderDebug(this[prop]);
                }
            }
        }*/
    }

    addLayer (layer, name) {
        this.layers.push({ layer, name });

        if (this.layers.length === 1) {
            this.changeLayer(name);
        }

        layer.create.call(this);

        //maybe it's too hight concept for ligth canvas lib
        for (let prop in this) {
            if (this[prop] instanceof Model) {
                this[prop].parent = this;
            }
        }
    }

    changeLayer (name) {
        let layer = this.layers.find(layer => layer.name === name);

        if (!!layer) {
            this.currentLayer = layer.layer;
        }
    }

    clearLayer () {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    ready () {
        this.ticker.start();

        if (!!this.options.ready) {
            this.options.ready.call(this);
        }
    }

    renderDebug (model) {
        this.ctx.save();
        this.ctx.font = '12px sans-serif';
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        this.ctx.rect(model.x, model.y, model.width, model.height);
        this.ctx.stroke();
        this.ctx.fillText(`[${Math.round(model.x)}, ${Math.round(model.y)}]`, model.x, model.y - 10);
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'blue';
        this.ctx.rect(model.hitbox.x, model.hitbox.y, model.hitbox.width, model.hitbox.height);
        this.ctx.stroke();
        this.ctx.fillText(`[${Math.round(model.hitbox.x)}, ${Math.round(model.hitbox.y)}]`, model.hitbox.x, model.hitbox.y - 10);
        this.ctx.restore();
    }

    debug (models = []) {
        [].concat(models).forEach(model => {
            if (model instanceof Model) {
                this.renderDebug(model);
            }
        });
    }

    handleError (err) {
        this.ticker.stop();
        console.log(err);

        if (this.debug) {
            this.ctx.save();
            this.ctx.font = '12px sans-serif';
            this.ctx.fillStyle = 'red';
            this.ctx.fillText(err, 50, 50);
            this.ctx.restore();
        }
    }
}
