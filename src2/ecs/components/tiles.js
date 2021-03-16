import loader from './../../loader';
import Component from './../component';

export default class Tiles extends Component {
    constructor(width, height, tileWidth, tileHeight, image, layers = [], properties = {}) {
        super();

        this.width = width;
        this.height = height;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.layers = layers;
        this.properties = properties;

        this.image = image;
        if (typeof image === 'string') {
            this.image = loader.get(image);
        }
    }

    addLayer(layer) {
        this.layers.push(layer);
    }

    findLayer(key, value) {
        return this.layers.find(l => l[key] === value);
    }

    findLayers(key, value) {
        return this.layers.filter(l => l[key] === value);
    }
}
