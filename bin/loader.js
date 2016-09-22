'use strict';

import { EventEmitter } from './event-emitter';

export class Loader extends EventEmitter {

    constructor () {
        super();

        this.count = 0;
        this.queue = 0;
        this.progress = 0;
        this.ready = true;
        this.collection = [];
    }

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

    loadImage (src, id) {
        let img = new Image();
        img.src = src;
        img.onload = () => this.load(img, id);
    }

    loadJson (src, id) {
        var request = new XMLHttpRequest();

        request.open("GET", src, true);
        request.onload = e => {
            let data = JSON.parse(e.target.response);
            this.load(data, id);
        }

        request.send();
    }

    get (id) {
        let items = this.collection.filter(el => el.id === id);

        if (items.length == 0) {
            return null;
        }

        return items.length > 1 ? items.map(el => el.item) : items[0].item;
    }
}

export const loader = new Loader();

export default loader;
