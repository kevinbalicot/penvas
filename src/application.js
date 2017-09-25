const Ticker = require('./ticker');
const Model = require('./model');
const Drawer = require('./drawer');

const io = require('./io');
const loader = require('./loader');
const mouse = require('./mouse');

/**
 * Create a new application
 * @example
 * let app = new Application({ container: document.getElementById('my-canvas'), width: 500, height: 300 });
 */
class Application extends Drawer {

    /**
     * @param {Object} [options]
     * @param {HTMLElement} [options.container] - HTML container (default: body element)
     * @param {number} [options.width] - canvas width (default: window width)
     * @param {number} [options.height] - canvas height (default: window height)
     * @param {hex} [options.background=0xffffff] - canvas background (default: 0xffffff)
     * @param {function} [options.create] - called to load assets
     * @param {function} [options.render] - called at every frame
     * @param {function} [options.ready] - called when application is ready (need to use loader)
     */
    constructor (options = {}) {
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
        this.background = options.background || 0xffffff;

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
        this.canvas.addEventListener('mousemove', event => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = event.clientX - rect.left;
            this.mouse.y = event.clientY - rect.top;
        });

        options.container.appendChild(this.canvas);

        if (!!options.create) {
            options.create.call(this);
            this.loader.on('ready', () => this.ready());
        }

        /** @type {Ticker} */
        this.ticker = new Ticker();

        this.ticker.on('step', this.step, this);
        this.ticker.on('render', this.render, this);

        if (this.loader.ready) {
            this.ticker.start();
        }
    }

    /**
     * Callback called at every frame to calculate models x,y positions
     * @protected
     * @param {number} dt - Delta between two frames
     */
    step (dt) {
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
    render (dt) {
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
     * @param {Object} layer
     * @param {function} layer.create - called to create models
     * @param {function} layer.step - called at every frame
     * @param {function} layer.render - called at every frame
     * @param {String} name
     */
    addLayer (layer, name) {
        this.layers.push({ layer, name });

        if (this.layers.length === 1) {
            this.changeLayer(name);
        }

        layer.create.call(this);

        //maybe it's too hight concept for ligth canvas lib
        for (let prop in this) {
            if (this[prop] instanceof Model) {
                this[prop].parent = this;
            }
        }
    }

    /**
     * Switch the current layer
     * @param {String} name
     */
    changeLayer (name) {
        let layer = this.layers.find(layer => layer.name === name);

        if (!!layer) {
            this.currentLayer = layer.layer;
        }
    }

    /**
     * Start timer and called application ready function
     * @protected
     */
    ready () {
        this.ticker.start();

        if (!!this.options.ready) {
            this.options.ready.call(this);
        }
    }

    /**
     * Display model's x,y positions information
     * @private
     * @param {Model} model
     */
    renderDebug (model) {
        this.ctx.save();
        this.ctx.font = '12px sans-serif';
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        this.ctx.rect(model.x, model.y, model.width, model.height);
        this.ctx.stroke();
        this.ctx.fillText(`[${Math.round(model.x)}, ${Math.round(model.y)}]`, model.x, model.y - 10);
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'blue';
        this.ctx.rect(model.hitbox.x, model.hitbox.y, model.hitbox.width, model.hitbox.height);
        this.ctx.stroke();
        this.ctx.fillText(`[${Math.round(model.hitbox.x)}, ${Math.round(model.hitbox.y)}]`, model.hitbox.x, model.hitbox.y - 10);
        this.ctx.restore();
    }

    /**
     * Add models to debug
     * @param {Array<Model>|Model} models
     */
    debug (models = []) {
        [].concat(models).forEach(model => {
            if (model instanceof Model) {
                this.renderDebug(model);
            }
        });
    }

    /**
     * @private
     * @param {Error} err
     */
    handleError (err) {
        this.ticker.stop();
        console.log(err);

        if (this.debug) {
            this.ctx.save();
            this.ctx.font = '12px sans-serif';
            this.ctx.fillStyle = 'red';
            this.ctx.fillText(err, 50, 50);
            this.ctx.restore();
        }
    }
}

module.exports = Application;
