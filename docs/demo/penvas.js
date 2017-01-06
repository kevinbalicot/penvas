(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Application = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _ticker = require('./ticker');

var _model = require('./model');

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _loader = require('./loader');

var _loader2 = _interopRequireDefault(_loader);

var _mouse = require('./mouse');

var _mouse2 = _interopRequireDefault(_mouse);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Create a new application
 * @example
 * let app = new Application({ container: document.getElementById('my-canvas'), width: 500, height: 300 });
 */
var Application = exports.Application = function () {

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
    function Application() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Application);

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
        this.io = _io2.default;

        /** @type {loader} */
        this.loader = _loader2.default;

        /** @type {mouse} */
        this.mouse = _mouse2.default;

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

        if (_typeof(options.container) != 'object') {
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
        this.canvas.addEventListener('mousemove', function (event) {
            var rect = _this.canvas.getBoundingClientRect();
            _this.mouse.x = event.clientX - rect.left;
            _this.mouse.y = event.clientY - rect.top;
        });

        options.container.appendChild(this.canvas);

        if (!!options.create) {
            options.create.call(this);
            this.loader.on('ready', function () {
                return _this.ready();
            });
        }

        /** @type {Ticker} */
        this.ticker = new _ticker.Ticker();

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

    _createClass(Application, [{
        key: 'step',
        value: function step(dt) {
            try {
                if (!!this.options.step) {
                    this.options.step.call(this, dt);
                }

                if (!!this.currentLayer && !!this.currentLayer.step) {
                    this.currentLayer.step.call(this, dt);
                }
            } catch (e) {
                this.handleError(e);
            }
        }

        /**
         * Callback called at every frame to render models
         * @protected
         * @param {number} dt - Delta between two frames
         */

    }, {
        key: 'render',
        value: function render(dt) {
            try {
                if (!!this.options.render) {
                    this.options.render.call(this, dt);
                }

                if (!!this.currentLayer && !!this.currentLayer.render) {
                    this.currentLayer.render.call(this, dt);
                }
            } catch (e) {
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

    }, {
        key: 'addLayer',
        value: function addLayer(layer, name) {
            this.layers.push({ layer: layer, name: name });

            if (this.layers.length === 1) {
                this.changeLayer(name);
            }

            layer.create.call(this);

            //maybe it's too hight concept for ligth canvas lib
            for (var prop in this) {
                if (this[prop] instanceof _model.Model) {
                    this[prop].parent = this;
                }
            }
        }

        /**
         * Switch the current layer
         * @param {String} name
         */

    }, {
        key: 'changeLayer',
        value: function changeLayer(name) {
            var layer = this.layers.find(function (layer) {
                return layer.name === name;
            });

            if (!!layer) {
                this.currentLayer = layer.layer;
            }
        }

        /**
         * Reset canvas zone
         */

    }, {
        key: 'clearLayer',
        value: function clearLayer() {
            this.ctx.save();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }

        /**
         * Start timer and called application ready function
         * @protected
         */

    }, {
        key: 'ready',
        value: function ready() {
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

    }, {
        key: 'renderDebug',
        value: function renderDebug(model) {
            this.ctx.save();
            this.ctx.font = '12px sans-serif';
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'red';
            this.ctx.rect(model.x, model.y, model.width, model.height);
            this.ctx.stroke();
            this.ctx.fillText('[' + Math.round(model.x) + ', ' + Math.round(model.y) + ']', model.x, model.y - 10);
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'blue';
            this.ctx.rect(model.hitbox.x, model.hitbox.y, model.hitbox.width, model.hitbox.height);
            this.ctx.stroke();
            this.ctx.fillText('[' + Math.round(model.hitbox.x) + ', ' + Math.round(model.hitbox.y) + ']', model.hitbox.x, model.hitbox.y - 10);
            this.ctx.restore();
        }

        /**
         * Add models to debug
         * @param {Array<Model>|Model} models
         */

    }, {
        key: 'debug',
        value: function debug() {
            var _this2 = this;

            var models = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            [].concat(models).forEach(function (model) {
                if (model instanceof _model.Model) {
                    _this2.renderDebug(model);
                }
            });
        }

        /**
         * @private
         * @param {Error} err
         */

    }, {
        key: 'handleError',
        value: function handleError(err) {
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
    }]);

    return Application;
}();

},{"./io":5,"./loader":6,"./model":7,"./mouse":8,"./ticker":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Create a new container with a canvas element
 * @example
 * let container = new Container({ width: 200, height: 200, background: 0xeee })
 */
var Container = exports.Container = function () {

    /**
     * Create a new canvas
     * @param {Object} [options]
     * @param {number} [options.x=0]
     * @param {number} [options.y=0]
     * @param {number} [options.width] - default window width
     * @param {number} [options.height] - default window height
     * @param {hex} [options.background=0xffffff]
     */
    function Container() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Container);

        /** @type {number} */
        this.x = options.x || 0;
        /** @type {number} */
        this.y = options.y || 0;
        /** @type {number} */
        this.width = options.width || window.innerWidth;
        /** @type {number} */
        this.height = options.height || window.innerHeight;
        /** @type {hex} */
        this.background = options.background || 0xffffff;

        /** @type {HTMLCanvasElement} */
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = this.background;

        /** @type {CanvasRenderingContext2D} */
        this.context = this.canvas.getContext('2d');
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.context;
    }

    /**
     * Render this canvas into another canvas
     * @param {RenderingContext} ctx - Another canvas
     * @param {number} x
     * @param {number} y
     */

    _createClass(Container, [{
        key: 'render',
        value: function render(ctx) {
            var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            ctx.save();
            ctx.drawImage(this.canvas, x, y);
            ctx.restore();
        }
    }]);

    return Container;
}();

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Use to emit events
 * @example
 * class MyClass extends EventEmitter {
 *     doSomething() {
 *        this.dispatch('my-event', { message: 'event' });
 *     }
 * }
 */
var EventEmitter = exports.EventEmitter = function () {
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        /**
         * List of registers
         * @protected
         * @type {Array}
         */
        this.registered = [];
    }

    /**
     * Listen event
     * @param {String} event
     * @param {function} callback
     * @param {mixed} context
     */

    _createClass(EventEmitter, [{
        key: "on",
        value: function on(event, callback, context) {
            this.registered.push({ event: event, callback: callback, context: context });
        }

        /**
         * Dispatch event
         * @param {String} event
         * @param {mixed} args
         */

    }, {
        key: "dispatch",
        value: function dispatch(event, args) {
            var _this = this;

            this.registered.forEach(function (register) {
                if (register.event === event) {
                    register.callback.call(register.context || _this, args);
                }
            });
        }
    }]);

    return EventEmitter;
}();

},{}],4:[function(require,module,exports){
'use strict';

var _application = require('./application');

var _container = require('./container');

var _eventEmitter = require('./event-emitter');

var _model = require('./model');

var _sprite = require('./sprite');

var _ticker = require('./ticker');

var _tileset = require('./tileset');

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _loader = require('./loader');

var _loader2 = _interopRequireDefault(_loader);

var _mouse = require('./mouse');

var _mouse2 = _interopRequireDefault(_mouse);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

window.Application = _application.Application;
window.Container = _container.Container;
window.EventEmitter = _eventEmitter.EventEmitter;
window.Model = _model.Model;
window.Sprite = _sprite.Sprite;
window.Ticker = _ticker.Ticker;
window.Tileset = _tileset.Tileset;

window.io = _io2.default;
window.loader = _loader2.default;
window.mouse = _mouse2.default;

},{"./application":1,"./container":2,"./event-emitter":3,"./io":5,"./loader":6,"./model":7,"./mouse":8,"./sprite":9,"./ticker":10,"./tileset":11}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/** @type {Object} */
var KEYS = exports.KEYS = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

/** @type {Object} */
var MOUSE = exports.MOUSE = {
    LEFT_CLICK: 'left_click',
    RIGHT_CLICK: 'right_click',
    MIDDLE_CLICK: 'middle_click'
};

/** @type {Array<number>} */
var io = exports.io = [];

document.addEventListener('keydown', function (e) {
    io[e.keyCode] = true;
});

document.addEventListener('keyup', function (e) {
    io[e.keyCode] = false;
});

document.addEventListener('mousedown', function () {
    io[MOUSE.LEFT_CLICK] = true;
});

document.addEventListener('mouseup', function () {
    io[MOUSE.LEFT_CLICK] = false;
});

exports.default = io;

},{}],6:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loader = exports.Loader = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _eventEmitter = require('./event-emitter');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * Service to load asset
 * @example
 * let layer = {
 *     create: function() {
 *         Loader.add('img/my-image.png', 'player-image');
 *         Loader.add('config/my-config.json', 'player-config', 'json');
 *     },
 *     render: function() {
 *          const image = Loader.get('player-image');
 *          const config = Loader.get('player-config');
 *          this.ctx.drawImage(image, config.x, config.y);
 *     }
 * }
 */
var Loader = exports.Loader = function (_EventEmitter) {
    _inherits(Loader, _EventEmitter);

    function Loader() {
        _classCallCheck(this, Loader);

        var _this = _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this));

        _this.count = 0;
        _this.queue = 0;
        _this.progress = 0;
        _this.ready = true;
        _this.collection = [];
        return _this;
    }

    /**
     * Add asset to load
     * @param {String} src
     * @param {String} id
     * @param {String} type - (image or json)
     */

    _createClass(Loader, [{
        key: 'add',
        value: function add(src, id) {
            var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'image';

            this.count++;
            this.queue++;
            this.ready = false;

            switch (type) {
                case 'image':
                    this.loadImage(src, id);
                    break;
                case 'json':
                    this.loadJson(src, id);
                    break;
            }
        }

        /**
         * Add asset into the collection and dispatch event
         * @param {mixed} el
         * @param {String} id
         * @emits {load} emit when asset is loaded
         * @emits {ready} emit when all assets are loaded
         */

    }, {
        key: 'load',
        value: function load(el, id) {
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

    }, {
        key: 'loadImage',
        value: function loadImage(src, id) {
            var _this2 = this;

            var img = new Image();
            img.src = src;
            img.onload = function () {
                return _this2.load(img, id);
            };
        }

        /**
         * Load json file
         * @private
         * @param {String} src
         * @param {String} id
         */

    }, {
        key: 'loadJson',
        value: function loadJson(src, id) {
            var _this3 = this;

            var request = new XMLHttpRequest();

            request.open("GET", src, true);
            request.onload = function (e) {
                var data = JSON.parse(e.target.response);
                _this3.load(data, id);
            };

            request.send();
        }

        /**
         * Get asset by id
         * @param {String} id
         * @return {mixed}
         */

    }, {
        key: 'get',
        value: function get(id) {
            var items = this.collection.filter(function (el) {
                return el.id === id;
            });

            if (items.length == 0) {
                return null;
            }

            return items.length > 1 ? items.map(function (el) {
                return el.item;
            }) : items[0].item;
        }
    }]);

    return Loader;
}(_eventEmitter.EventEmitter);

var loader = exports.loader = new Loader();
exports.default = loader;

},{"./event-emitter":3}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Base class for every model entity
 * @example
 * let model = new Model(10, 10, 100, 200);
 */
var Model = exports.Model = function () {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Object} [hitbox]
     * @param {Object} [hitbox.x]
     * @param {Object} [hitbox.y]
     * @param {Object} [hitbox.width]
     * @param {Object} [hitbox.height]
     */
    function Model(x, y, width, height) {
        var hitbox = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

        _classCallCheck(this, Model);

        /** @type {Number} */
        this.x = x;
        /** @type {Number} */
        this.y = y;
        /** @type {Number} */
        this.width = width;
        /** @type {Number} */
        this.height = height;

        this.hitbox = hitbox;
        this.collision = false;
        this.parent = {};
    }

    /**
     * @return {Object}
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     */

    _createClass(Model, [{
        key: "hasCollisions",

        /**
         * Check if there are any collisions with models
         * @param {Array<Model>|Models} models
         */
        value: function hasCollisions(models) {

            if (!Array.isArray(models)) {
                models = [models];
            }

            var model = void 0;
            for (var i = 0; i < models.length; i++) {
                model = models[i];

                if (this.hitbox.x < model.hitbox.x + model.hitbox.width && this.hitbox.x + model.hitbox.width > model.hitbox.x && this.hitbox.y < model.hitbox.y + model.hitbox.height && this.hitbox.height + this.hitbox.y > model.hitbox.y) {
                    return model;
                }
            }

            return false;
        }
    }, {
        key: "hitbox",
        get: function get() {
            return {
                x: this.x + this._hitbox.x,
                y: this.y + this._hitbox.y,
                width: this._hitbox.width,
                height: this._hitbox.height
            };
        }

        /**
         * @param {Object} [hitbox]
         * @param {Object} [hitbox.x]
         * @param {Object} [hitbox.y]
         * @param {Object} [hitbox.width]
         * @param {Object} [hitbox.height]
         */

        , set: function set(hitbox) {
            this._hitbox = {
                x: hitbox.x || 0,
                y: hitbox.y || 0,
                width: hitbox.width || this.width,
                height: hitbox.height || this.height
            };
        }
    }]);

    return Model;
}();

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mouse = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _model = require('./model');

var _container = require('./container');

var _io = require('./io');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * Mouse service
 * @example
 * let tile = { x: 10, y: 10, width: 32, height: 32 };
 * if (mouse.isOver(tile)) {
 *     tile.backgroundColor = 'red';
 * }
 */
var Mouse = function () {
    function Mouse() {
        _classCallCheck(this, Mouse);

        this.x = 0;
        this.y = 0;
    }

    /**
     * Check if mouse coordinates has collisions with object
     * @protected
     * @param {Object} object
     * @param {number} object.x
     * @param {number} object.y
     * @param {number} object.width
     * @param {number} object.height
     */

    _createClass(Mouse, [{
        key: 'hasCollision',
        value: function hasCollision(object) {

            if (object.x === undefined || object.y === undefined || object.width === undefined || object.height === undefined) {
                throw new Error('Object ' + object + ' is not valid, needs x, y, width and height parameters.');
            }

            if (this.x <= object.x + object.width && object.x <= this.x && this.y <= object.y + object.height && object.y <= this.y) {
                return true;
            }

            return false;
        }

        /**
         * Check if mouse is over object
         * @param {Object} object
         * @param {number} object.x
         * @param {number} object.y
         * @param {number} object.width
         * @param {number} object.height
         * @return {boolean}
         */

    }, {
        key: 'isOver',
        value: function isOver(object) {
            return this.hasCollision(object);
        }

        /**
         * Check if mouse is out of object
         * @param {Object} object
         * @param {number} object.x
         * @param {number} object.y
         * @param {number} object.width
         * @param {number} object.height
         * @return {boolean}
         */

    }, {
        key: 'isOut',
        value: function isOut(object) {
            return !this.hasCollision(object);
        }

        /**
         * Check if mouse click and over object
         * @param {Object} object
         * @param {number} object.x
         * @param {number} object.y
         * @param {number} object.width
         * @param {number} object.height
         * @return {boolean}
         */

    }, {
        key: 'isClickOn',
        value: function isClickOn(object) {
            return _io.io[_io.MOUSE.LEFT_CLICK] && this.isOver(object);
        }

        /**
         * Check if mouse click and out of object
         * @param {Object} object
         * @param {number} object.x
         * @param {number} object.y
         * @param {number} object.width
         * @param {number} object.height
         * @return {boolean}
         */

    }, {
        key: 'isClickOut',
        value: function isClickOut(object) {
            return _io.io[_io.MOUSE.LEFT_CLICK] && this.isOut(object);
        }
    }]);

    return Mouse;
}();

var mouse = exports.mouse = new Mouse();
exports.default = mouse;

},{"./container":2,"./io":5,"./model":7}],9:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Sprite = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _model = require('./model');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * The class to use sprite image
 * You can add animations
 * @example
 * const image = Loader.get('my-sprite'); // see Loader documentation
 * const animation = [{ frames: [9, 10, 11, 12], name: 'walk', loop: true }];
 * let sprite = new Sprite(10, 10, 20, 20, image, animation);
 *
 * sprite.play('walk');
 * sprite.render();
 */
var Sprite = exports.Sprite = function (_Model) {
    _inherits(Sprite, _Model);

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} tileWidth - width tile
     * @param {number} tileHeight - height tile
     * @param {Image} image
     * @param {Array<Object>} animations - list of animations
     * @example
     * new Sprite(0, 0, 20, 20, image, [{ frames: [9, 10, 11, 12], name: 'walk', loop: true, flip: false }]);
     * @param {Object} [hitbox]
     * @param {Object} [hitbox.x]
     * @param {Object} [hitbox.y]
     * @param {Object} [hitbox.width]
     * @param {Object} [hitbox.height]
     */
    function Sprite(x, y, tileWidth, tileHeight, image, animations, hitbox) {
        _classCallCheck(this, Sprite);

        /** @type {Image} */
        var _this = _possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this, x, y, tileWidth, tileHeight, hitbox));

        _this.image = image;
        /** @type {Array<Object>} */
        _this.animations = animations;

        _this.time = 1;
        _this.stopped = true;
        _this.frame = { x: 0, y: 0 };
        _this.frames = {
            width: image.width / tileWidth,
            height: image.height / tileHeight,
            total: image.width / tileWidth * (image.height / tileHeight)
        };

        _this.currentAnimation = 0;
        _this.currentFrame = 0;
        return _this;
    }

    /**
     * @private
     */

    _createClass(Sprite, [{
        key: 'getNextFrame',
        value: function getNextFrame() {
            var currentAnimation = this.animations[this.currentAnimation];
            var currentFrame = currentAnimation.frames[this.currentFrame];

            if (this.frames.width - currentFrame >= 0) {
                this.frame.x = currentFrame - 1;
                this.frame.y = 0;
            } else {

                var delta = currentFrame - this.frames.width;
                this.frame.y = 1;

                while (delta > this.frames.width) {
                    delta = delta - this.frames.width;
                    this.frame.y++;
                }

                this.frame.x = delta - 1;
            }

            this.currentFrame++;

            if (this.currentFrame >= currentAnimation.frames.length) {
                this.currentFrame = 0;

                if (!currentAnimation.loop) {
                    this.stopped = true;
                }
            }
        }

        /**
         * @param {number} dt - Delta between two frames
         */

    }, {
        key: 'step',
        value: function step(dt) {
            this.time += dt;

            if (this.time >= 0.25 && !this.stopped) {
                this.getNextFrame();
                this.time = 0;
            }
        }

        /**
         * Play animation
         * @param {String} animation
         */

    }, {
        key: 'play',
        value: function play(animation) {
            var currentAnimation = this.animations.filter(function (anim) {
                return anim.name === animation;
            });

            if (!!currentAnimation) {
                var index = this.animations.indexOf(currentAnimation[0]);

                if (this.currentAnimation != index) {
                    this.time = 1;
                    this.currentFrame = 0;
                }

                this.currentAnimation = index;
                this.stopped = false;
            }
        }

        /**
         * Stop animation
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.stopped = true;
        }

        /**
         * Reset animation
         */

    }, {
        key: 'reset',
        value: function reset() {
            this.frame = { x: 0, y: 0 };
        }

        /**
         * Render the sprite
         * @param {RenderingContext} context
         */

    }, {
        key: 'render',
        value: function render() {
            var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var ctx = context || this.parent.ctx;
            var currentAnimation = this.animations[this.currentAnimation];
            ctx.save();

            if (!!currentAnimation && !!currentAnimation.flip) {
                ctx.translate(this.x * 2 + this.width, 1);
                ctx.scale(-1, 1);
            }

            ctx.drawImage(this.image, // image
            this.frame.x * this.width, // pos x
            this.frame.y * this.height, // pos y
            this.width, // frame width
            this.height, // frame height
            this.x, // destination x
            this.y, // destination y
            this.width, // destination frame width
            this.height // destination frame height
            );
            ctx.restore();
        }
    }]);

    return Sprite;
}(_model.Model);

},{"./model":7}],10:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Ticker = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _eventEmitter = require('./event-emitter');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * Timer class
 * You can stop and start the game
 */
var Ticker = exports.Ticker = function (_EventEmitter) {
    _inherits(Ticker, _EventEmitter);

    function Ticker() {
        _classCallCheck(this, Ticker);

        var _this = _possibleConstructorReturn(this, (Ticker.__proto__ || Object.getPrototypeOf(Ticker)).call(this));

        _this.lastTick = Date.now();
        _this.stopped = true;
        _this.frame = 0;
        _this.frameskip = 1;
        return _this;
    }

    /**
     * @private
     */

    _createClass(Ticker, [{
        key: 'loop',
        value: function loop() {
            if (this.stopped) {
                return;
            }

            requestAnimationFrame(this.loop.bind(this));

            var delta = Date.now() - this.lastTick;
            this.lastTick = Date.now();

            if (delta > 1000) {
                return;
            }

            var dt = delta / 1000;

            this.step(dt);
            this.render(dt);
        }

        /**
         * Start timer
         */

    }, {
        key: 'start',
        value: function start() {
            if (this.stopped) {
                this.stopped = false;
                requestAnimationFrame(this.loop.bind(this));
            }
        }

        /**
         * Stop timer
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.stopped = true;
        }

        /**
         * Called at every frame
         * @private
         * @param {number} dt
         * @emits {step}
         */

    }, {
        key: 'step',
        value: function step(dt) {
            this.dispatch('step', dt);
        }

        /**
         * Called at every frame
         * @private
         * @param {number} dt
         * @emits {render}
         */

    }, {
        key: 'render',
        value: function render(dt) {
            this.dispatch('render', dt);
        }
    }]);

    return Ticker;
}(_eventEmitter.EventEmitter);

},{"./event-emitter":3}],11:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tileset = undefined;

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _model = require('./model');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * The class to use tileset image
 * @example
 * const image = Loader.get('my-tileset'); // see Loader documentation
 * let tileset = new Tileset(0, 0, 32, 32, image);
 *
 * // render the first tile of tileset
 * tileset.render(1);
 */
var Tileset = exports.Tileset = function (_Model) {
    _inherits(Tileset, _Model);

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} tileWidth
     * @param {number} tileHeight
     * @param {Image} image
     */
    function Tileset(x, y, tileWidth, tileHeight, image) {
        _classCallCheck(this, Tileset);

        /** @type {number} */
        var _this = _possibleConstructorReturn(this, (Tileset.__proto__ || Object.getPrototypeOf(Tileset)).call(this, x, y, tileWidth, tileHeight));

        _this.tileWidth = tileWidth;
        /** @type {number} */
        _this.tileHeight = tileHeight;
        /** @type {Image} */
        _this.image = image;
        /** @type {number} */
        _this.columns = _this.image.width / _this.tileWidth;
        /** @type {number} */
        _this.rows = _this.image.height / _this.tileHeight;
        /** @type {number} */
        _this.tiles = _this.columns * _this.rows;
        return _this;
    }

    /**
     * Get tile x,y positions by id (exemple tile number 23)
     * @private
     * @param {number} id
     * @return {Object}
     * @property {number} x
     * @property {number} y
     */

    _createClass(Tileset, [{
        key: 'getTilePosition',
        value: function getTilePosition(id) {
            id = id > this.tiles ? this.tiles : id;

            var percent = id * this.tileWidth / this.image.width;
            var x = 0;
            var y = 0;

            if (Number.isInteger(percent)) {
                x = this.columns - 1;
                y = percent - 1;
            } else {
                var unit = Math.trunc(percent);
                var decimal = percent - unit;
                x = decimal * this.columns - 1;
                y = Math.trunc(id * this.tileWidth / this.image.width);
            }

            return { x: x < 0 ? this.columns : x, y: y };
        }

        /**
         * Render a tile
         * @param {number} id
         * @param {RenderingContext} context
         */

    }, {
        key: 'render',
        value: function render(id) {
            var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (id > 0) {
                var ctx = context || this.parent.ctx;
                var tile = this.getTilePosition(id);

                ctx.save();
                ctx.drawImage(this.image, // image
                tile.x * this.tileWidth, // pos x
                tile.y * this.tileHeight, // pos y
                this.tileWidth, // frame width
                this.tileHeight, // frame height
                this.x, // destination x
                this.y, // destination y
                this.width, // destination frame width
                this.height // destination frame height
                );
                ctx.restore();
            }
        }
    }]);

    return Tileset;
}(_model.Model);

},{"./model":7}]},{},[4]);
