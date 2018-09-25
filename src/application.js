import { Model } from './model';
import { Drawer } from './drawer';

import ticker from './ticker';
import io from './io';
import loader from './loader';
import mouse from './mouse';

/**
 * Create a new application
 * @example
 * let app = new Application({ container: document.getElementById('my-canvas'), width: 500, height: 300 });
 */
export class Application extends Drawer {

    /**
     * @param {Object} [options]
     * @param {HTMLElement} [options.container] - HTML container (default: body element)
     * @param {number} [options.width] - canvas width (default: window width)
     * @param {number} [options.height] - canvas height (default: window height)
     * @param {string} [options.background=#ffffff] - canvas background (default: 0xffffff)
     * @param {function} [options.create] - called to load assets
     * @param {function} [options.render] - called at every frame
     * @param {function} [options.ready] - called when application is ready (need to use loader)
     * @example
     * const app = new Application({
     *   width: 500,
     *   height: 500,
     *   container: document.getElementById('my-canvas'),
     *
     *   create: function() {
     *       loader.add('images/player-sprite.png', 'player');
     *   },
     *
     *   ready: function() {
     *       this.addLayer(layer, 'home');
     *   }
     * });
     */
    constructor(options = {}) {
        super();

        /**
         * Object of options
         * @type {Object}
         */
        this.options = options;

        /**
         * List of layers
         * @type {Array<Object>}
         */
        this.layers = [];

        /**
         * Current layer rendered
         * @type {Object}
         */
        this.currentLayer = null;

        /** @type {io} */
        this.io = io;

        /** @type {loader} */
        this.loader = loader;

        /** @type {mouse} */
        this.mouse = mouse;

        /**
         * Canvas width (default window width)
         * @type {number}
         */
        this.width = options.width || window.innerWidth;

        /**
         * Canvas height (default window height)
         * @type {number}
         */
        this.height = options.height || window.innerHeight;

        /**
         * Canvas background color
         * @type {hex}
         */
        this.background = options.background || '#ffffff';

        if (typeof options.container != 'object') {
            options.container = document.querySelector('body');
        }

        /** @type {HTMLCanvasElement} */
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = this.background;

        /** @type {CanvasRenderingContext2D} */
        this.context = this.canvas.getContext('2d');

        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.context;

        // Update mouse coordinates
        document.addEventListener('mousemove', event => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = event.clientX - rect.left;
            this.mouse.y = event.clientY - rect.top;
        });

        document.addEventListener('keydown', (e) => {
            try {
                if (!!this.options.onKeydown) {
                    this.options.onKeydown.call(this, e, io);
                }
            } catch(e) {
                this.handleError(e);
            }
        });

        document.addEventListener('keyup', (e) => {
            try {
                if (!!this.options.onKeyup) {
                    this.options.onKeyup.call(this, e, io);
                }
            } catch(e) {
                this.handleError(e);
            }
        });

        options.container.appendChild(this.canvas);

        if (!!options.create) {
            options.create.call(this);
            this.loader.on('ready', () => this.ready());
        }

        /** @type {Ticker} */
        this.ticker = ticker;

        this.ticker.on('step', this.step, this);
        this.ticker.on('render', this.render, this);

        if (this.loader.ready) {
            this.ready();
        }
    }

    /**
     * Callback called at every frame to calculate models x,y positions
     * @protected
     * @param {number} dt - Delta between two frames
     */
    step(dt) {
        try {
            if (!!this.options.step) {
                this.options.step.call(this, dt);
            }

            if (!!this.currentLayer && !!this.currentLayer.step) {
                this.currentLayer.step.call(this, dt);
            }
        } catch(e) {
            this.handleError(e);
        }
    }

    /**
     * Callback called at every frame to render models
     * @protected
     * @param {number} dt - Delta between two frames
     */
    render(dt) {
        try {
            if (!!this.options.render) {
                this.options.render.call(this, dt);
            }

            if (!!this.currentLayer && !!this.currentLayer.render) {
                this.currentLayer.render.call(this, dt);
            }
        } catch(e) {
            this.handleError(e);
        }
    }

    /**
     * Add layer to application
     * @param {String} name
     * @param {Object} layer
     * @param {function} layer.create - called to create models
     * @param {function} layer.step - called at every frame
     * @param {function} layer.render - called at every frame
     * @example
     * const layer = {
     *   create: function() {
     *       this.player = new Model(this.width / 2, this.height / 2, 100, 100);
     *   },
     *
     *   step: function() {
     *       this.player.x += 1;
     *       if (this.player.x > this.width) {
     *          this.player.x = -100;
     *       }
     *   },
     *
     *   render: function() {
     *       this.clearLayer();
     *       this.drawRect(this.player.x, this.player.y, this.player.width, this.player.height);
     *   }
     * };
     *
     * app.addLayer('scene1', layer);
     */
    addLayer(name, layer) {
        this.layers.push({ layer, name });

        //maybe it's too hight concept for ligth canvas lib
        /*for (let prop in this) {
            if (this[prop] instanceof Model) {
                this[prop].parent = this;
            }
        }*/
    }

    /**
     * Switch the current layer
     * @param {String} name
     * @param {*} [data=null]
     */
    changeLayer(name, data = null) {
        let layer = this.layers.find(layer => layer.name === name);

        if (!!layer) {
            this.currentLayer = layer.layer;

            if (!!this.currentLayer.create) {
                this.currentLayer.create.call(this, data);
            }
        }
    }

    /**
     * Start timer and called application ready function
     * @protected
     */
    ready() {
        this.ticker.start();

        if (!!this.options.ready) {
            this.options.ready.call(this);
        }
    }

    /**
     * @private
     * @param {Error} err
     */
    handleError(err) {
        this.ticker.stop();
        console.log(err);

        this.drawText(err, 10, 50, '10px', 'sans-serif', 'red');
    }
}
