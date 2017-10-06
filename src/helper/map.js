const Model = require('./../model');

/**
 * @ignore
 */
class Map {
    constructor(tileWidth, tileHeight, columns, rows) {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.columns = columns;
        this.rows = rows;
        this.defaultTileset = null;
        this.layers = {};
        this.tilesets = {};
        this.platforms = {};

        this.width = tileWidth * columns;
        this.height = tileHeight * rows;
    }

    addLayer(layer, name, z = 0, tileset = null) {
        const tiles = layer.data || layer.tiles || [];
        const rows = layer.height || layer.rows || this.rows;
        const columns = layer.width || layer.columns || this.columns;
        z = z || layer.z || 0;

        this.layers[name] = { tiles, rows, columns, name, tileset, z };
    }

    addTileset(tileset, name, isDefault = true) {
        this.tilesets[name] = tileset;

        if (isDefault) {
            this.defaultTileset = tileset;
        }
    }

    addPlatformLayer(layer, name, z = 0, hidden = true) {
        const tiles = layer.data || layer.tiles || [];
        const columns = layer.width || layer.columns || this.columns;
        const rows = layer.height || layer.rows || this.rows;

        this.platforms[name] = [];

        let t = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (0 !== tiles[t]) {
                    this.platforms[name].push(
                        new Model(
                            c * this.tileWidth,
                            r * this.tileHeight,
                            this.tileWidth,
                            this.tileHeight
                        )
                    );
                }
                t++;
            }
        }

        if (!hidden) {
            this.addLayer(layer, name, z);
        }
    }

    getLayer(name) {
        return this.layers[name] || null;
    }

    getPlatform(name) {
        return this.platforms[name] || [];
    }

    getTileset(name = null) {
        return this.tilesets[name] || null;
    }

    render(ctx, minZ = 0, maxZ = 999, limits = { x: 0, y: 0, width: 9999, height: 9999 }) {
        let tileset = null;
        let layer = null;
        let layers = this.layers;

        for (let layerName in this.layers) {
            layer = this.layers[layerName];

            if (layer.z < minZ || layer.z > maxZ) {
                continue;
            }

            tileset = null !== layer.tileset ? this.getTileset(layer.tileset) : this.defaultTileset;

            let t = 0;
            for (let rows = 0; rows < layer.rows; rows++) {
                for (let columns = 0; columns < layer.columns; columns++) {
                    tileset.x = columns * this.tileWidth;
                    tileset.y = rows * this.tileHeight;

                    // Check if tile is into limits
                    if (
                        tileset.x + this.tileWidth >= limits.x &&
                        tileset.x <= limits.x + limits.width &&
                        tileset.y + this.tileHeight >= limits.y &&
                        tileset.y <= limits.y + limits.height
                    ) {
                        tileset.render(layer.tiles[t] || 0, ctx);
                    }

                    t++;
                }
            }
        }
    }
}

module.exports = Map;
