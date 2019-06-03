import loader from './loader';

import { Model } from './model';

/**
 * The class to use tileset image
 * @example
 * const image = loader.get('my-tileset'); // see Loader documentation
 * let tileset = new Tileset(0, 0, 32, 32, image);
 *
 * // render the first tile of tileset
 * tileset.renderTile(1, this.application);
 */
export class Tileset extends Model {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} tileWidth
     * @param {number} tileHeight
     * @param {Image} image
     */
    constructor(x, y, tileWidth, tileHeight, image) {
        super(x, y, tileWidth, tileHeight);

        /** @type {number} */
        this.tileWidth = tileWidth;

        /** @type {number} */
        this.tileHeight = tileHeight;

        /** @type {Image} */
        this.image = image;
        if (typeof this.image === 'string') {
            this.image = loader.get(this.image);
        }

        /** @type {number} */
        this.columns = this.image.width / this.tileWidth;

        /** @type {number} */
        this.rows = this.image.height / this.tileHeight;

        /** @type {number} */
        this.tiles = this.columns * this.rows;
    }

    /**
     * Get tile x,y positions by id (exemple tile number 23)
     * @private
     * @param {number} id
     * @return {Object}
     * @property {number} x
     * @property {number} y
     */
    getTilePosition(id) {
        id = id > this.tiles ? this.tiles : id;

        const percent = (id * this.tileWidth) / this.image.width;
        let x = 0;
        let y = 0;

        if (Number.isInteger(percent)) {
            x = this.columns -1;
            y = percent - 1;
        } else {
            const unit = Math.trunc(percent);
            const decimal = percent - unit;

            x = Math.round(decimal * this.columns) - 1;
            y = Math.trunc((id * this.tileWidth) / this.image.width);
        }

        return { x: x < 0 ? this.columns : x, y};
    }

    /**
     * Render a tile
     * @param {number} id
     * @param {Drawer} [drawer=null]
     */
    renderTile(id, drawer = null) {
        drawer = drawer || this.parent;

        if (!drawer instanceof Drawer) {
            throw new Error(`Parameter drawer has to be an instance of Drawer, it's an instance of ${typeof drawer} instead.`);
        }

        if (id > 0) {
            let tile = this.getTilePosition(id);

            drawer.ctx.save();
            drawer.ctx.drawImage(
                this.image,     // image
                tile.x * this.tileWidth,    // pos x
                tile.y * this.tileHeight,   // pos y
                this.tileWidth,     // frame width
                this.tileHeight,    // frame height
                this.x,         // destination x
                this.y,         // destination y
                this.width,     // destination frame width
                this.height     // destination frame height
            );
            drawer.ctx.restore();
        }
    }
}
