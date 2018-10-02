import { Model } from './../model';
import { Drawer } from './../drawer';
import { AStar } from './pathfinds/a-star';

/**
 * @ignore
 */
export class Map {
    constructor(tileWidth, tileHeight, columns, rows) {
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.columns = columns;
        this.rows = rows;
        this.defaultTileset = null;
        this.layers = {};
        this.tilesets = {};
        this.platforms = {};
        this.pathFindingLayer = {};

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

    addPathFindingLayer(layer, name) {
        const tiles = layer.data || layer.tiles || [];
        const rows = layer.height || layer.rows || this.rows;
        const columns = layer.width || layer.columns || this.columns;
        const nodes = [];

        let x, y;
        let t = 0;
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows; r++) {
                x = r * this.tileWidth;
                y = c * this.tileHeight;

                nodes.push({
                    x, y,
                    posX: r, posY: c,
                    walkable: 0 === tiles[t],
                    g: 0, h: 0
                });

                t++;
            }
        }

        this.pathFindingLayer[name] = { nodes, rows, columns, name };
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

    findPathBetweenPositions(name, objectA, objectB) {
        const layer = this.pathFindingLayer[name];
        const finder = new AStar();

        if (!!layer) {
            const startPosX = Math.floor(objectA.x / this.tileWidth);
            const startPosY = Math.floor(objectA.y / this.tileHeight);

            const endPosX = Math.floor(objectB.x / this.tileWidth);
            const endPosY = Math.floor(objectB.y / this.tileHeight);

            const startNode = { posX: startPosX, posY: startPosY, f: 0, g: 0, h: 0 };
            const endNode = { posX: endPosX, posY: endPosY, f: 0, g: 0, h: 0 };

            return finder.findPath(layer.nodes, startNode, endNode);
        }

        return [];
    }

    render(drawer, options = {}) {
        if (!drawer instanceof Drawer) {
            throw new Error(`Parameter drawer has to be an instance of Drawer, it's an instance of ${typeof drawer} instead.`);
        }

        const ctx = drawer.ctx;
        const minZ = options.minZ || 0;
        const maxZ = options.maxZ || 999;
        const limits = options.limits || { x: 0, y: 0, width: 9999, height: 9999 };
        const onlyLayer = options.layer || null;

        let tileset = null;
        let layer = null;
        let layers = this.layers;

        for (let layerName in this.layers) {
            layer = this.layers[layerName];

            if (layer.z < minZ || layer.z > maxZ || (null !== onlyLayer && onlyLayer !== layerName)) {
                continue;
            }

            tileset = null !== layer.tileset ? this.getTileset(layer.tileset) : this.defaultTileset;

            let t = 0;
            for (let columns = 0; columns < layer.columns; columns++) {
                for (let rows = 0; rows < layer.rows; rows++) {
                    tileset.x = rows * this.tileWidth;
                    tileset.y = columns * this.tileHeight;

                    // Check if tile is into limits
                    if (
                        tileset.x + this.tileWidth >= limits.x &&
                        tileset.x <= limits.x + limits.width &&
                        tileset.y + this.tileHeight >= limits.y &&
                        tileset.y <= limits.y + limits.height
                    ) {
                        tileset.renderTile(layer.tiles[t] || 0, ctx);
                    }

                    t++;
                }
            }
        }
    }
}
