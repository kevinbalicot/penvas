'use strict';

import { Model } from './../../bin/model';

export class Tile extends Model {

    constructor (posX, posY, x, y, width, height, collision = true) {

        super(x, y, width, height);

        this.posX = posX;
        this.posY = posY;
        this.collision = collision;
    }

    debug (ctx) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.fillStyle = this.collision ? 'red' : 'green';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.restore();
    }
}
