class DungeonMap extends Map {
    constructor(mapName) {
        const mapConfig = loader.get(mapName);
        const tileset = new Tileset(0, 0, mapConfig.tilewidth, mapConfig.tileheight, loader.get('tileset'));

        super(mapConfig.tilewidth, mapConfig.tileheight, mapConfig.width, mapConfig.height);

        this.addTileset(tileset, 'tileset');
        this.addLayer(mapConfig.layers[0], 'floor', 1);
        this.addLayer(mapConfig.layers[1], 'floor2', 2);
        this.addLayer(mapConfig.layers[2], 'top', 3);
        this.addPlatformLayer(mapConfig.layers[3], 'platforms');
        this.addPathFindingLayer(mapConfig.layers[3], 'platforms');
    }
}
