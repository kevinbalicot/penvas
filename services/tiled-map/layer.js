'use strict';

export class Layer {

    constructor (map, frames, properties, tileset, zindex = 0, visible = true) {
        this.map = map;
        this.frames = frames;
        this.properties = properties;
        this.visible = visible;
        this.tileset = tileset;
        this.zindex = zindex;
    }

    getPosFrame (frame) {

        let result = { x: 0, y: 0 };
        let width = this.tileset.columns;
        let height = this.tileset.tilecount / this.tileset.columns;

        if (width - frame >= 0) {
            result.x = frame - 1;
        } else {

            let delta = frame - width;
            result.y = 1;

            while (delta > width) {
                delta = delta - width;
                result.y++;
            }

            result.x = delta - 1;
        }

        return result;
    }

    render (ctx) {
        this.frames.forEach((frame, index) => {
            let pos = this.getPosFrame(frame);
            let tile = this.map.tiles[index];

            ctx.save();
            ctx.drawImage(
                this.map.tilesheet,                            // image
                pos.x * this.tileset.tilewidth,                // pos x
                pos.y * this.tileset.tileheight,               // pos y
                this.tileset.tilewidth,                        // frame width
                this.tileset.tileheight,                       // frame height
                this.map.x + tile.posX * this.tileset.tilewidth,       // destination x
                this.map.y + tile.posY * this.tileset.tileheight,      // destination y
                this.tileset.tilewidth,                        // destination frame width
                this.tileset.tileheight                        // destination frame height
            );
            ctx.restore();
            //tile.debug(ctx);
        });
    }
}
