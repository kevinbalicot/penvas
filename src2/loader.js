import EventEmitter from './event-emitter';

/**
 * Service to load asset
 * @example
 * let layer = {
 *     create: function() {
 *         loader.add('img/my-image.png', 'player-image');
 *         loader.add('config/my-config.json', 'player-config', 'json');
 *     },
 *     render: function() {
 *          const image = loader.get('player-image');
 *          const config = loader.get('player-config');
 *          this.ctx.drawImage(image, config.x, config.y);
 *     }
 * }
 */
export default class Loader extends EventEmitter {
    constructor() {
        super();

        /** @type {number} */
        this.count = 0;

        /** @type {number} */
        this.queue = 0;

        /** @type {number} */
        this.progress = 0;

        /** @type {boolean} */
        this.ready = true;

        /** @type {Array} */
        this.collection = [];
    }

    /**
     * Add asset to load
     * @param {string} src
     * @param {string} id
     * @param {string} type - (image or json)
     */
    add(src, id, type = 'image') {
        this.count++;
        this.queue++;
        this.ready = false;

        switch (type) {
            case 'image':
                this.loadImage(src, id);
                break;
            case 'json':
                this.loadJson(src, id);
                break
        }
    }

    /**
     * Add asset into the collection and dispatch event
     * @param {*} el
     * @param {string} id
     * @emits {load} emit when asset is loaded
     * @emits {ready} emit when all assets are loaded
     */
    load(el, id) {
        this.queue--;
        this.progress = 1 - this.queue / this.count;

        this.collection.push({ id: id, item: el });
        this.emit('load', this.progress);

        if (this.queue === 0) {
            this.count = 0;
            this.progress = 0;
            this.ready = true;
            this.emit('ready');
        }
    }

    /**
     * Load image
     * @private
     * @param {string} src
     * @param {string} id
     */
    loadImage(src, id) {
        const image = new Image();
        image.name = id;
        image.src = src;
        image.crossOrigin = 'anonymous';
        image.onload = () => this.load(image, id);
    }

    /**
     * Load json file
     * @private
     * @param {string} src
     * @param {string} id
     */
    loadJson(src, id) {
        const request = new XMLHttpRequest();

        request.open("GET", src, true);
        request.onload = e => {
            let data = JSON.parse(e.target.response);
            this.load(data, id);
        }

        request.send();
    }

    /**
     * Get asset by id
     * @param {string} id
     * @return {*}
     */
    get(id) {
        let items = this.collection.filter(el => el.id === id);

        if (items.length === 0) {
            return null;
        }

        return items.length > 1 ? items.map(el => el.item) : items[0].item;
    }
}
