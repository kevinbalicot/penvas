'use strict';

import { Model } from './../../bin/model';
import { Tile } from './tile';
import { Layer } from './layer';

export class Map extends Model {

    constructor (x, y, map, tilesheet) {

        super(x, y, map.width * map.tilewidth, map.height * map.tileheight);

        this.columns = map.width;
        this.rows = map.height;
        this.tileWidth = map.tilewidth;
        this.tileHeight = map.tileheight;

        this.tiles = [];
        this.layers = [];

        this.tilesheet = tilesheet;
        this.tileset = map.tilesets[0];

        map.layers.forEach(layer => this.addLayer(layer));

        this.loadTiles();
    }

    addLayer (layer) {
        let properties = layer.properties || {}
        let level = properties.level || 0;
        let newLayer = new Layer(this, layer.data, properties, this.tileset, level, layer.visible);

        this.layers.push(newLayer);
    }

    addTile (posX, posY, collision) {
        let tile = new Tile(
            posX,
            posY,
            this.x + posX * this.tileWidth,
            this.y + posY * this.tileHeight,
            this.tileWidth,
            this.tileHeight,
            collision
        );

        this.tiles.push(tile);
    }

    loadTiles () {
        let index = 0;
        let collisionLayers = this.getCollisionLayers();

        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                let collision =  collisionLayers.some(layer => layer.frames[index] != 0);
                this.addTile(j, i, collision);
                index++;
            }
        }
    }

    getCollisionTiles () {
        return this.tiles.filter(tile => !!tile.collision) || [];
    }

    getCollisionLayers () {
        return this.layers.filter(layer => !!layer.properties && !!layer.properties.collision) || [];
    }

    getVisibleLayers () {
        return this.layers.filter(layer => layer.visible) || [];
    }

    render (ctx) {
        let layers = this.layers.filter(layer => layer.visible) || [];
        layers.forEach(layer => layer.render(ctx));
    }
}
