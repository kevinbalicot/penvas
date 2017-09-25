const EventEmitter = require('./event-emitter');

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
class Loader extends EventEmitter {

    constructor () {
        super();

        this.count = 0;
        this.queue = 0;
        this.progress = 0;
        this.ready = true;
        this.collection = [];
    }

    /**
     * Add asset to load
     * @param {String} src
     * @param {String} id
     * @param {String} type - (image or json)
     */
    add (src, id, type = 'image') {
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
     * @param {mixed} el
     * @param {String} id
     * @emits {load} emit when asset is loaded
     * @emits {ready} emit when all assets are loaded
     */
    load (el, id) {
        this.queue--;
        this.progress = 1 - this.queue / this.count;

        this.collection.push({ id: id, item: el });
        this.dispatch('load', this.progress);

        if (this.queue == 0) {
            this.count = 0;
            this.progress = 0;
            this.ready = true;
            this.dispatch('ready');
        }
    }

    /**
     * Load image
     * @private
     * @param {String} src
     * @param {String} id
     */
    loadImage (src, id) {
        let img = new Image();
        img.src = src;
        img.onload = () => this.load(img, id);
    }

    /**
     * Load json file
     * @private
     * @param {String} src
     * @param {String} id
     */
    loadJson (src, id) {
        var request = new XMLHttpRequest();

        request.open("GET", src, true);
        request.onload = e => {
            let data = JSON.parse(e.target.response);
            this.load(data, id);
        }

        request.send();
    }

    /**
     * Get asset by id
     * @param {String} id
     * @return {mixed}
     */
    get (id) {
        let items = this.collection.filter(el => el.id === id);

        if (items.length == 0) {
            return null;
        }

        return items.length > 1 ? items.map(el => el.item) : items[0].item;
    }
}

module.exports = new Loader();
