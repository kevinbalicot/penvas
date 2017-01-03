import { Model } from './model';

/**
 * The class to use tileset image
 * @example
 * const image = Loader.get('my-tileset'); // see Loader documentation
 * let tileset = new Tileset(0, 0, 32, 32, image);
 *
 * // render the first tile of tileset
 * tileset.render(1);
 */
export class Tileset extends Model {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} tileWidth
     * @param {number} tileHeight
     * @param {Image} image
     */
    constructor (x, y, tileWidth, tileHeight, image) {
        super(x, y, tileWidth, tileHeight);

        /** @type {number} */
        this.tileWidth = tileWidth;
        /** @type {number} */
        this.tileHeight = tileHeight;
        /** @type {Image} */
        this.image = image;
        this.tiles = 0;
    }

    /**
     * Get tile x,y positions by id (exemple tile number 23)
     * @private
     * @param {number} id
     * @return {Object}
     * @property {number} x
     * @property {number} y
     */
    getTilePosition (id) {
        const columns = this.image.width / this.tileWidth;
        const rows = this.image.height / this.tileHeight;
        const tiles = columns * rows;
        this.tiles = tiles;

        id = id > tiles ? tiles : id;

        const percent = (id * this.tileWidth) / this.image.width;
        const unit = Math.trunc(percent);
        const decimal = percent - unit;

        const x = (decimal * columns) - 1;
        const y = Math.trunc((id * this.tileWidth) / this.image.width);

        return { x: x < 0 ? columns : x, y};
    }

    /**
     * Render a tile
     * @param {number} id
     * @param {RenderingContext} context
     */
    render (id, context = null) {
        if (id > 0) {
            let ctx = context || this.parent.ctx;
            let tile = this.getTilePosition(id);

            ctx.save();
            ctx.drawImage(
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
            ctx.restore();
        }
    }
}
