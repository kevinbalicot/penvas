import { Application } from  './src/application';
import { Container } from  './src/container';
import { EventEmitter } from  './src/event-emitter';
import { Model } from  './src/model';
import { Sprite } from  './src/sprite';
import { Ticker } from  './src/ticker';
import { Tileset } from  './src/tileset';

import Keyboard from  './src/keyboard';
import Loader from './src/loader';

window.Application = Application;

/*

'use strict';

import { Application } from './bin/application';
import { Container } from './bin/container';

class Box extends Container {

    render () {
        this.ctx.save();
        this.ctx.fillRect(0, 0, 100, 100);
        this.ctx.restore();
    }
}

var homeLayer = {
    create: function () {
        this.player = {
            x: this.width / 2,
            y: this.height / 2,
            width: 50,
            height: 100
        };
        this.box = new Box({
            width: 50,
            height: 50
        });
    },

    step: function (td) {
        this.player.x += 100 * td;

        if (this.player.x > this.width) {
            this.player.x = this.player.width * -1;
        }
    },

    render: function () {
        this.clearLayer();
        this.box.render();

        this.ctx.save();
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.drawImage(this.box.canvas, this.box.x, this.box.y);
        this.ctx.restore();
    }
};

var app = new Application({
    //debug: true,
});

app.addLayer(homeLayer, 'home');*/
