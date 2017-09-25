(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof2(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof2(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Ticker = require('./ticker');
var Model = require('./model');
var Drawer = require('./drawer');

var io = require('./io');
var loader = require('./loader');
var mouse = require('./mouse');

/**
 * Create a new application
 * @example
 * let app = new Application({ container: document.getElementById('my-canvas'), width: 500, height: 300 });
 */

var Application = function (_Drawer) {
    _inherits(Application, _Drawer);

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
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Application);

        /**
         * Object of options
         * @type {Object}
         */
        var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

        _this.options = options;

        /**
         * List of layers
         * @type {Array<Object>}
         */
        _this.layers = [];

        /**
         * Current layer rendered
         * @type {Object}
         */
        _this.currentLayer = null;

        /** @type {io} */
        _this.io = io;

        /** @type {loader} */
        _this.loader = loader;

        /** @type {mouse} */
        _this.mouse = mouse;

        /**
         * Canvas width (default window width)
         * @type {number}
         */
        _this.width = options.width || window.innerWidth;

        /**
         * Canvas height (default window height)
         * @type {number}
         */
        _this.height = options.height || window.innerHeight;

        /**
         * Canvas background color
         * @type {hex}
         */
        _this.background = options.background || 0xffffff;

        if (_typeof(options.container) != 'object') {
            options.container = document.querySelector('body');
        }

        /** @type {HTMLCanvasElement} */
        _this.canvas = document.createElement('canvas');
        _this.canvas.width = _this.width;
        _this.canvas.height = _this.height;
        _this.canvas.style.backgroundColor = _this.background;

        /** @type {CanvasRenderingContext2D} */
        _this.context = _this.canvas.getContext('2d');
        /** @type {CanvasRenderingContext2D} */
        _this.ctx = _this.context;

        // Update mouse coordinates
        _this.canvas.addEventListener('mousemove', function (event) {
            var rect = _this.canvas.getBoundingClientRect();
            _this.mouse.x = event.clientX - rect.left;
            _this.mouse.y = event.clientY - rect.top;
        });

        options.container.appendChild(_this.canvas);

        if (!!options.create) {
            options.create.call(_this);
            _this.loader.on('ready', function () {
                return _this.ready();
            });
        }

        /** @type {Ticker} */
        _this.ticker = new Ticker();

        _this.ticker.on('step', _this.step, _this);
        _this.ticker.on('render', _this.render, _this);

        if (_this.loader.ready) {
            _this.ticker.start();
        }
        return _this;
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
                if (this[prop] instanceof Model) {
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
                if (model instanceof Model) {
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
}(Drawer);

module.exports = Application;

},{"./drawer":3,"./io":9,"./loader":11,"./model":12,"./mouse":13,"./ticker":15}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var Drawer = require('./drawer');

/**
 * Create a new container with a canvas element
 * @example
 * let container = new Container({ width: 200, height: 200, background: 'gray' });
 */

var Container = function (_Drawer) {
    _inherits(Container, _Drawer);

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
        var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this));

        _this.x = options.x || 0;
        /** @type {number} */
        _this.y = options.y || 0;
        /** @type {number} */
        _this.width = options.width || window.innerWidth;
        /** @type {number} */
        _this.height = options.height || window.innerHeight;
        /** @type {hex} */
        _this.background = options.background || 0xffffff;

        /** @type {HTMLCanvasElement} */
        _this.canvas = document.createElement('canvas');
        _this.canvas.width = _this.width;
        _this.canvas.height = _this.height;
        _this.canvas.style.backgroundColor = _this.background;

        /** @type {CanvasRenderingContext2D} */
        _this.context = _this.canvas.getContext('2d');
        /** @type {CanvasRenderingContext2D} */
        _this.ctx = _this.context;
        return _this;
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
}(Drawer);

module.exports = Container;

},{"./drawer":3}],3:[function(require,module,exports){
'use strict';

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
 * Draw class
 * @param {CanvasRenderingContext2D} ctx
 * @example
 * let drawer = new Drawer();
 * drawer.drawRect(10, 10, 100, 100);
 * let metrics = drawer.drawText('Hello world', 50, 50);
 * metrics.width // text width
 */
var Drawer = function () {
    function Drawer() {
        var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, Drawer);

        this.ctx = ctx;
    }

    /**
     * Reset canvas zone
     */

    _createClass(Drawer, [{
        key: 'clearLayer',
        value: function clearLayer() {
            this.ctx.save();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }

        /**
         * Draw a line
         * @param {number} x - x coordinate for first point of line
         * @param {number} y - y coordinate for first point of line
         * @param {number} destX - x coordinate for second point of line
         * @param {number} destY - y coordinate for second point of line
         * @param {number} [size=1] - line size
         * @param {string} [color=black] - line color
         */

    }, {
        key: 'drawLine',
        value: function drawLine(x, y, destX, destY) {
            var size = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
            var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'black';

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.lineWidth = size;
            this.ctx.strokeStyle = color;
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(destX, destY);
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.restore();
        }

        /**
         * Draw a rectangle
         * @param {number} x - x coordinate for rectangle position
         * @param {number} y - y coordinate for rectangle position
         * @param {number} width - rectangle width
         * @param {number} height - rectangle height
         * @param {number} [size=1] - line size
         * @param {string} [color=black] - line color
         */

    }, {
        key: 'drawRect',
        value: function drawRect(x, y, width, height) {
            var size = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
            var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'black';

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.lineWidth = size;
            this.ctx.strokeStyle = color;
            this.ctx.rect(x, y, width, height);
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.restore();
        }

        /**
         * Draw a fill rectangle
         * @param {number} x - x coordinate for rectangle position
         * @param {number} y - y coordinate for rectangle position
         * @param {number} width - rectangle width
         * @param {number} height - rectangle height
         * @param {string} [color=black] - rectangle background color
         * @param {number} [lineSize=0] - line size
         * @param {string} [lineColor=black] - line color
         */

    }, {
        key: 'drawFillRect',
        value: function drawFillRect(x, y, width, height) {
            var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'black';
            var lineSize = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
            var lineColor = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 'black';

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = color;
            this.ctx.rect(x, y, width, height);
            this.ctx.fill();
            if (lineSize > 0) {
                this.ctx.lineWidth = lineSize;
                this.ctx.strokeStyle = lineColor;
                this.ctx.stroke();
            }
            this.ctx.closePath();
            this.ctx.restore();
        }

        /**
         * Draw a circle
         * @param {number} x - x coordinate for circle position
         * @param {number} y - y coordinate for circle position
         * @param {number} radius - circle radius
         * @param {number} [size=1] - line size
         * @param {string} [color=black] - line color
         * @param {number} [start=0] - angle start
         * @param {number} [end=360] - angle end
         */

    }, {
        key: 'drawCircle',
        value: function drawCircle(x, y, radius) {
            var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
            var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'black';
            var start = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
            var end = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 2 * Math.PI;

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.lineWidth = size;
            this.ctx.strokeStyle = color;
            this.ctx.arc(x, y, radius, start, end);
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.restore();
        }

        /**
         * Draw a fill circle
         * @param {number} x - x coordinate for circle position
         * @param {number} y - y coordinate for circle position
         * @param {number} radius - circle radius
         * @param {string} [color=black] - circle background color
         * @param {number} [lineSize=0] - line size
         * @param {string} [lineColor=black] - line color
         * @param {number} [start=0] - angle start
         * @param {number} [end=360] - angle end
         */

    }, {
        key: 'drawFillCircle',
        value: function drawFillCircle(x, y, radius) {
            var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'black';
            var lineSize = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var lineColor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'black';
            var start = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
            var end = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 2 * Math.PI;

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, start, end);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            if (lineSize > 0) {
                this.ctx.lineWidth = lineSize;
                this.ctx.strokeStyle = lineColor;
                this.ctx.stroke();
            }
            this.ctx.closePath();
            this.ctx.restore();
        }

        /**
         * Draw a text
         * @param {string} text - The text
         * @param {number} x - x coordinate for text position
         * @param {number} y - y coordinate for text position
         * @param {string} [size=10pt] - text size (default: 10pt)
         * @param {string} [font=Arial] - text font familly (default: Arial)
         * @param {string} [color=black] - text color
         * @param {string} [style] - text style, italic, blod etc ...
         * @param {string} [align=left] - text align, left, right, center
         * @return {Object}
         */

    }, {
        key: 'drawText',
        value: function drawText(text, x, y) {
            var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '10pt';
            var font = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'Arial';
            var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'black';
            var style = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';
            var align = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'left';

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.font = style + ' ' + size + ' ' + font;
            this.ctx.textAlign = align;
            this.ctx.fillStyle = color;
            this.ctx.fillText(text, x, y);
            var metrics = this.ctx.measureText(text);
            this.ctx.closePath();
            this.ctx.restore();

            return metrics;
        }
    }]);

    return Drawer;
}();

module.exports = Drawer;

},{}],4:[function(require,module,exports){
"use strict";

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
var EventEmitter = function () {
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

module.exports = EventEmitter;

},{}],5:[function(require,module,exports){
"use strict";

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
 * @ignore
 */
var CollisionChecker = function () {
    function CollisionChecker() {
        _classCallCheck(this, CollisionChecker);

        this.pairs = [];
    }

    _createClass(CollisionChecker, [{
        key: "add",
        value: function add(model, platforms) {
            var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

            if (!Array.isArray(platforms)) {
                platforms = [platforms];
            }

            this.pairs.push({ model: model, platforms: platforms, event: event });
        }
    }, {
        key: "check",
        value: function check(td) {
            var model = void 0,
                platform = void 0;
            this.pairs.forEach(function (pair) {
                model = Object.create(pair.model);
                model.step(td);
                platform = model.hasCollisions(pair.platforms);

                if (!!platform) {
                    pair.event(pair.model, platform);
                }
            });
        }
    }, {
        key: "clear",
        value: function clear() {
            this.pairs = [];
        }
    }]);

    return CollisionChecker;
}();

module.exports = CollisionChecker;

},{}],6:[function(require,module,exports){
'use strict';

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

var Model = require('./../model');

/**
 * @ignore
 */

var Map = function () {
    function Map(tileWidth, tileHeight, columns, rows) {
        _classCallCheck(this, Map);

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.columns = columns;
        this.rows = rows;
        this.defaultTileset = null;
        this.layers = {};
        this.tilesets = {};
        this.platforms = {};
    }

    _createClass(Map, [{
        key: 'addLayer',
        value: function addLayer(layer, name) {
            var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var tileset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            var tiles = layer.data || layer.tiles || [];
            var rows = layer.height || layer.rows || this.rows;
            var columns = layer.width || layer.columns || this.columns;
            z = z || layer.z || 0;

            this.layers[name] = { tiles: tiles, rows: rows, columns: columns, name: name, tileset: tileset, z: z };
        }
    }, {
        key: 'addTileset',
        value: function addTileset(tileset, name) {
            var isDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            this.tilesets[name] = tileset;

            if (isDefault) {
                this.defaultTileset = tileset;
            }
        }
    }, {
        key: 'addPlatformLayer',
        value: function addPlatformLayer(layer, name) {
            var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var hidden = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

            var tiles = layer.data || layer.tiles || [];
            var columns = layer.width || layer.columns || this.columns;
            var rows = layer.height || layer.rows || this.rows;

            this.platforms[name] = [];

            var t = 0;
            for (var r = 0; r < rows; r++) {
                for (var c = 0; c < columns; c++) {
                    if (0 !== tiles[t]) {
                        this.platforms[name].push(new Model(c * this.tileWidth, r * this.tileHeight, this.tileWidth, this.tileHeight));
                    }
                    t++;
                }
            }

            if (!hidden) {
                this.addLayer(layer, name, z);
            }
        }
    }, {
        key: 'getLayer',
        value: function getLayer(name) {
            return this.layers[name] || null;
        }
    }, {
        key: 'getPlatform',
        value: function getPlatform(name) {
            return this.platforms[name] || [];
        }
    }, {
        key: 'getTileset',
        value: function getTileset() {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            return this.tilesets[name] || null;
        }
    }, {
        key: 'render',
        value: function render(ctx) {
            var minZ = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var maxZ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 999;

            var tileset = null;
            var layer = null;
            var layers = this.layers;

            for (var layerName in this.layers) {
                layer = this.layers[layerName];

                if (layer.z < minZ || layer.z > maxZ) {
                    continue;
                }

                tileset = null !== layer.tileset ? this.getTileset(layer.tileset) : this.defaultTileset;

                var t = 0;
                for (var rows = 0; rows < layer.rows; rows++) {
                    for (var columns = 0; columns < layer.columns; columns++) {
                        tileset.x = columns * this.tileWidth;
                        tileset.y = rows * this.tileHeight;

                        tileset.render(layer.tiles[t] || 0, ctx);
                        t++;
                    }
                }
            }
        }
    }]);

    return Map;
}();

module.exports = Map;

},{"./../model":12}],7:[function(require,module,exports){
'use strict';

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
 * @ignore
 */
var Renderer = function () {
    function Renderer() {
        _classCallCheck(this, Renderer);

        this.models = [];
    }

    _createClass(Renderer, [{
        key: 'add',
        value: function add(models) {
            var _this = this;

            var _order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
                return 0;
            };

            if (!Array.isArray(models)) {
                models = [models];
            }

            if (typeof _order !== 'function') {
                _order = function order() {
                    return _order;
                };
            }

            models.forEach(function (model) {
                _this.models.push({ model: model, order: _order });
            });
        }
    }, {
        key: 'sort',
        value: function sort() {
            return this.models.sort(function (a, b) {
                var orderA = a.order(a.model);
                var orderB = b.order(b.model);

                if (orderA < orderB) {
                    return -1;
                } else if (orderA > orderB) {
                    return 1;
                }

                return 0;
            });
        }
    }, {
        key: 'render',
        value: function render(ctx) {
            this.sort();
            this.models.forEach(function (el) {
                if (!!el.model.render) {
                    el.model.render(ctx);
                }
            });
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.models = [];
        }
    }]);

    return Renderer;
}();

module.exports = Renderer;

},{}],8:[function(require,module,exports){
'use strict';

var lib = {
    Application: require('./application'),
    Container: require('./container'),
    EventEmitter: require('./event-emitter'),
    Model: require('./model'),
    Sprite: require('./sprite'),
    Ticker: require('./ticker'),
    Tileset: require('./tileset'),
    Drawer: require('./drawer'),

    io: require('./io'),
    loader: require('./loader'),
    mouse: require('./mouse'),
    events: new (require('./event-emitter'))(),

    Map: require('./helper/map'),
    CollisionChecker: require('./helper/collision-checker'),
    Renderer: require('./helper/renderer')
};

window.Application = lib.Application;
window.Container = lib.Container;
window.EventEmitter = lib.EventEmitter;
window.Model = lib.Model;
window.Sprite = lib.Sprite;
window.Ticker = lib.Ticker;
window.Tileset = lib.Tileset;
window.Drawer = lib.Drawer;

window.io = lib.io;
window.loader = lib.loader;
window.mouse = lib.mouse;
window.events = lib.events;

window.Map = lib.Map;
window.CollisionChecker = lib.CollisionChecker;
window.Renderer = lib.Renderer;

module.exports = lib;

},{"./application":1,"./container":2,"./drawer":3,"./event-emitter":4,"./helper/collision-checker":5,"./helper/map":6,"./helper/renderer":7,"./io":9,"./loader":11,"./model":12,"./mouse":13,"./sprite":14,"./ticker":15,"./tileset":16}],9:[function(require,module,exports){
'use strict';

var keys = require('./keys');

/**
 * Array of Input
 * @type {Array<number>}
 * @example
 * if (true === io[KEYS.SPACE]) {
 *     this.player.jump();
 * }
 *
 * if (!!io[39]) {
 *    this.player.walkRight();
 * }
 *
 * if (io[MOUSE.LEFT_CLICK]) {
 *     this.player.attack();
 * }
 */
var io = [];

document.addEventListener('keydown', function (e) {
    io[e.keyCode] = true;
});

document.addEventListener('keyup', function (e) {
    io[e.keyCode] = false;
});

document.addEventListener('mousedown', function () {
    io[keys.LEFT_CLICK] = true;
});

document.addEventListener('mouseup', function () {
    io[keys.LEFT_CLICK] = false;
});

module.exports = io;

},{"./keys":10}],10:[function(require,module,exports){
'use strict';

/**
 * @type {Object}
 * @property {number} KEYS.SPACE
 * @property {number} KEYS.LEFT
 * @property {number} KEYS.UP
 * @property {number} KEYS.RIGHT
 * @property {number} KEYS.DOWN
 * @property {string} MOUSE.LEFT_CLICK
 * @property {string} MOUSE.RIGHT_CLICK
 * @property {string} MOUSE.MIDDLE_CLICK
 */

var keys = {
    STRG: 17,
    CTRL: 17,
    CTRLRIGHT: 18,
    CTRLR: 18,
    SHIFT: 16,
    RETURN: 13,
    ENTER: 13,
    BACKSPACE: 8,
    BCKSP: 8,
    ALT: 18,
    ALTR: 17,
    ALTRIGHT: 17,
    SPACE: 32,
    WIN: 91,
    MAC: 91,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ESC: 27,
    DEL: 46,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,

    LEFT_CLICK: 'left_click',
    RIGHT_CLICK: 'right_click',
    MIDDLE_CLICK: 'middle_click'
};

module.exports = keys;

},{}],11:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var EventEmitter = require('./event-emitter');

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

var Loader = function (_EventEmitter) {
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
}(EventEmitter);

module.exports = new Loader();

},{"./event-emitter":4}],12:[function(require,module,exports){
"use strict";

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
var Model = function () {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Object} [hitbox]
     * @param {number} [hitbox.x]
     * @param {number} [hitbox.y]
     * @param {number} [hitbox.width]
     * @param {number} [hitbox.height]
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

                if (this.hitbox.x < model.hitbox.x + model.hitbox.width && this.hitbox.x + this.hitbox.width > model.hitbox.x && this.hitbox.y < model.hitbox.y + model.hitbox.height && this.hitbox.y + this.hitbox.height > model.hitbox.y) {
                    return model;
                }
            }

            return false;
        }
    }, {
        key: "step",
        value: function step() {}

        /**
         * @return {Object}
         * @property {number} x
         * @property {number} y
         * @property {number} width
         * @property {number} height
         * @property {Object} hitbox
         * @property {boolean} collision
         */

    }, {
        key: "serialize",
        value: function serialize() {
            return {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                hitbox: this._hitbox,
                collision: this.collision
            };
        }

        /**
         * @param {Object} data
         * @param {number} data.x
         * @param {number} data.y
         * @param {number} data.width
         * @param {number} data.height
         * @param {Object} data.hitbox
         * @param {boolean} collision
         * @return {Model}
         */

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
    }], [{
        key: "deserialize",
        value: function deserialize(_ref) {
            var x = _ref.x,
                y = _ref.y,
                width = _ref.width,
                height = _ref.height,
                hitbox = _ref.hitbox,
                collision = _ref.collision;

            var model = new Model(x, y, width, height, hitbox);

            model.collision = collision;

            return model;
        }
    }]);

    return Model;
}();

module.exports = Model;

},{}],13:[function(require,module,exports){
'use strict';

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

var Model = require('./model');
var Container = require('./container');

var io = require('./io');
var keys = require('./keys');

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
         * Check if mouse click and is over object
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
            return io[keys.LEFT_CLICK] && this.isOver(object);
        }

        /**
         * Check if mouse click and is out of object
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
            return io[keys.LEFT_CLICK] && this.isOut(object);
        }
    }]);

    return Mouse;
}();

module.exports = new Mouse();

},{"./container":2,"./io":9,"./keys":10,"./model":12}],14:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;if (getter === undefined) {
            return undefined;
        }return getter.call(receiver);
    }
};

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

var Model = require('./model');

/**
 * The class to use sprite image
 * You can add animations
 * @example
 * const image = loader.get('my-sprite'); // see Loader documentation
 * const animation = [{ frames: [9, 10, 11, 12], name: 'walk', loop: true }];
 * let sprite = new Sprite(10, 10, 20, 20, image, animation);
 *
 * sprite.play('walk');
 * sprite.render();
 */

var Sprite = function (_Model) {
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
     * @param {number} [hitbox.x]
     * @param {number} [hitbox.y]
     * @param {number} [hitbox.width]
     * @param {number} [hitbox.height]
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

        /**
         * @return {Object}
         * @property {number} x
         * @property {number} y
         * @property {number} width
         * @property {number} height
         * @property {Object} hitbox
         * @property {Image} image
         * @property {Object} animations
         * @property {number} time
         * @property {boolean} stopped
         * @property {Object} frame
         * @property {number} currentAnimation
         * @property {number} currentFrame
         */

    }, {
        key: 'serialize',
        value: function serialize() {
            return Object.assign(_get(Sprite.prototype.__proto__ || Object.getPrototypeOf(Sprite.prototype), 'serialize', this).call(this), {
                image: this.image,
                animations: this.animations,
                time: this.time,
                stopped: this.stopped,
                frame: this.frame,
                currentAnimation: this.currentAnimation,
                currentFrame: this.currentFrame
            });
        }

        /**
         * @param {Object} data
         * @param {number} data.x
         * @param {number} data.y
         * @param {number} data.width
         * @param {number} data.height
         * @param {Object} data.hitbox
         * @param {boolean} data.collision
         * @param {Image} data.image
         * @param {Object} data.animations
         * @param {number} data.time
         * @param {boolean} data.stopped
         * @param {Object} data.frame
         * @param {number} data.currentAnimation
         * @param {number} data.currentFrame
         * @return {Sprite}
         */

    }], [{
        key: 'deserialize',
        value: function deserialize(_ref) {
            var x = _ref.x,
                y = _ref.y,
                width = _ref.width,
                height = _ref.height,
                hitbox = _ref.hitbox,
                collision = _ref.collision,
                image = _ref.image,
                animations = _ref.animations,
                time = _ref.time,
                stopped = _ref.stopped,
                frame = _ref.frame,
                currentAnimation = _ref.currentAnimation,
                currentFrame = _ref.currentFrame;

            var sprite = new Sprite(x, y, width, height, image, animations, hitbox);

            sprite.collision = collision;
            sprite.time = time;
            sprite.stopped = stopped;
            sprite.frame = frame;
            sprite.currentAnimation = currentAnimation;
            sprite.currentFrame = currentFrame;

            return sprite;
        }
    }]);

    return Sprite;
}(Model);

module.exports = Sprite;

},{"./model":12}],15:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var EventEmitter = require('./event-emitter');

/**
 * Timer class
 * You can stop and start the game
 */

var Ticker = function (_EventEmitter) {
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
}(EventEmitter);

module.exports = Ticker;

},{"./event-emitter":4}],16:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var Model = require('./model');

/**
 * The class to use tileset image
 * @example
 * const image = loader.get('my-tileset'); // see Loader documentation
 * let tileset = new Tileset(0, 0, 32, 32, image);
 *
 * // render the first tile of tileset
 * tileset.render(1);
 */

var Tileset = function (_Model) {
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

                x = Math.round(decimal * this.columns) - 1;
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
}(Model);

module.exports = Tileset;

},{"./model":12}]},{},[8]);
