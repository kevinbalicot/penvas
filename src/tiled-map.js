export class TiledMap {
    constructor(config) {
        console.log(config);
        this.width = config.width;
        this.height = config.height;

        this.tileWidth = config.tileWidth;
        this.tileHeight = config.tileHeight;

        this.layers = config.layers;
    }
}
