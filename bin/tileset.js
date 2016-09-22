'use strict';

import { Model } from './model';

export class Tileset extends Model {

    constructor (x, y, tileWidth, tileHeight, image, width = null, height = null) {
        super(x, y, width || tileWidth, height || tileHeight);

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.image = image;
    }

    getTile (id) {
        const columns = this.image.width / this.tileWidth;
        const rows = this.image.height / this.tileHeight;
        const tiles = columns * rows;

        id = id > tiles ? tiles : id;

        const percent = (id * this.tileWidth) / this.image.width;
        const unit = Math.trunc(percent);
        const decimal = percent - unit;

        const x = (decimal * columns) - 1;
        const y = Math.trunc((id * this.tileWidth) / this.image.width);

        return { x: x < 0 ? columns : x, y};
    }

    render (id, context = null) {
        if (id > 0) {
            let ctx = context || this.parent.ctx;
            let tile = this.getTile(id);

            ctx.save();
            ctx.drawImage(
                this.image,     // image
                tile.x * this.tileWidth,              // pos x
                tile.y * this.tileHeight,             // pos y
                this.tileWidth,     // frame width
                this.tileHeight,    // frame height
                this.x,         // destination x
                this.y,         // destination y
                this.width,     // destination frame width
                this.height     // destination frame height
            );
            ctx.restore();
        }
    }
}
