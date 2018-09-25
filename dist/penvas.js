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

var _model = require('./model');

var _drawer = require('./drawer');

var _ticker = require('./ticker');

var _ticker2 = _interopRequireDefault(_ticker);

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

/**
 * Create a new application
 * @example
 * let app = new Application({ container: document.getElementById('my-canvas'), width: 500, height: 300 });
 */
var Application = exports.Application = function (_Drawer) {
    _inherits(Application, _Drawer);

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
        _this.io = _io2.default;

        /** @type {loader} */
        _this.loader = _loader2.default;

        /** @type {mouse} */
        _this.mouse = _mouse2.default;

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
        _this.background = options.background || '#ffffff';

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
        document.addEventListener('mousemove', function (event) {
            var rect = _this.canvas.getBoundingClientRect();
            _this.mouse.x = event.clientX - rect.left;
            _this.mouse.y = event.clientY - rect.top;
        });

        document.addEventListener('keydown', function (e) {
            try {
                if (!!_this.options.onKeydown) {
                    _this.options.onKeydown.call(_this, e, _io2.default);
                }
            } catch (e) {
                _this.handleError(e);
            }
        });

        document.addEventListener('keyup', function (e) {
            try {
                if (!!_this.options.onKeyup) {
                    _this.options.onKeyup.call(_this, e, _io2.default);
                }
            } catch (e) {
                _this.handleError(e);
            }
        });

        options.container.appendChild(_this.canvas);

        if (!!options.create) {
            options.create.call(_this);
            _this.loader.on('ready', function () {
                return _this.ready();
            });
        }

        /** @type {Ticker} */
        _this.ticker = _ticker2.default;

        _this.ticker.on('step', _this.step, _this);
        _this.ticker.on('render', _this.render, _this);

        if (_this.loader.ready) {
            _this.ready();
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

    }, {
        key: 'addLayer',
        value: function addLayer(name, layer) {
            this.layers.push({ layer: layer, name: name });

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

    }, {
        key: 'changeLayer',
        value: function changeLayer(name) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var layer = this.layers.find(function (layer) {
                return layer.name === name;
            });

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

    }, {
        key: 'ready',
        value: function ready() {
            this.ticker.start();

            if (!!this.options.ready) {
                this.options.ready.call(this);
            }
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

            this.drawText(err, 10, 50, '10px', 'sans-serif', 'red');
        }
    }]);

    return Application;
}(_drawer.Drawer);

},{"./drawer":3,"./io":11,"./loader":13,"./model":14,"./mouse":15,"./ticker":18}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Container = undefined;

var _drawer = require('./drawer');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

/**
 * Create a new container with a canvas element
 * @example
 * let container = new Container({ width: 200, height: 200, background: 'gray' });
 */
var Container = exports.Container = function (_Drawer) {
    _inherits(Container, _Drawer);

    /**
     * Create a new canvas
     * @param {Object} [options]
     * @param {number} [options.x=0]
     * @param {number} [options.y=0]
     * @param {number} [options.width] - default window width
     * @param {number} [options.height] - default window height
     * @param {string} [options.background=#ffffff]
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
        _this.background = options.background || '#ffffff';

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

    return Container;
}(_drawer.Drawer);

},{"./drawer":3}],3:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Drawer = undefined;

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

var _model = require('./model');

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
var Drawer = exports.Drawer = function () {
    /**
     * @param {CanvasRenderingContext2D} [ctx=null]
     */
    function Drawer() {
        var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, Drawer);

        /** @type {CanvasRenderingContext2D} */
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
         * @param {string} [baseline=alphabetic] - text baseline, top, hanging, middle, alphabetic, ideographic, bottom
         *
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
            var baseline = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 'alphabetic';

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.font = style + ' ' + size + ' ' + font;
            this.ctx.textAlign = align;
            this.ctx.textBaseline = baseline;
            this.ctx.fillStyle = color;
            this.ctx.fillText(text, x, y);
            var metrics = this.ctx.measureText(text);
            this.ctx.closePath();
            this.ctx.restore();

            return metrics;
        }

        /**
         *  Draw images
         * @param {*} source - image or canvas
         * @param {number} x - source pos x
         * @param {number} y - source pos y
         * @param {number} [width=null] - source width
         * @param {number} [height=null] - source height
         * @param {number} [destinationX=null] - destination x
         * @param {number} [destinationY=null] - destination y
         * @param {number} [destinationWidth=null] - destination width
         * @param {number} [destinationHeight=null] - destination height
         */

    }, {
        key: 'drawImage',
        value: function drawImage(source, x, y) {
            var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
            var destinationX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
            var destinationY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
            var destinationWidth = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
            var destinationHeight = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : null;

            this.ctx.save();

            if (null === width && null === height) {
                this.ctx.drawImage(source, x, y);
            } else if (null === destinationX && null === destinationY && null === destinationWidth && null === destinationHeight) {
                this.ctx.drawImage(source, x, y, width, height);
            } else {
                this.ctx.drawImage(source, x, y, width, height, destinationX, destinationY, destinationWidth, destinationHeight);
            }

            this.ctx.restore();
        }

        /**
         * Save context
         * @return {Drawer}
         */

    }, {
        key: 'save',
        value: function save() {
            this.ctx.save();

            return this;
        }

        /**
         * Restore last saved context
         * @return {Drawer}
         */

    }, {
        key: 'restore',
        value: function restore() {
            this.ctx.restore();

            return this;
        }

        /**
         * Rotate model
         * @param {Model} model
         * @param {float} deg
         * @param {number} [pivotX=null]
         * @param {number} [pivotY=null]
         *
         * @return {Drawer}
         */

    }, {
        key: 'rotateModel',
        value: function rotateModel(model, deg) {
            var pivotX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var pivotY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            pivotX = null !== pivotX ? pivotX : model.width / 2;
            pivotY = null !== pivotY ? pivotY : model.height / 2;

            this.ctx.translate(model.x, model.y);
            this.ctx.translate(pivotX, pivotY);

            this.ctx.rotate(deg * Math.PI / 180);

            this.ctx.translate(-1 * pivotX, -1 * pivotY);
            this.ctx.translate(-1 * model.x, -1 * model.y);

            return this;
        }

        /**
         * Draw model
         * @param {Model} model
         *
         * @return {Drawer}
         */

    }, {
        key: 'drawModel',
        value: function drawModel(model) {
            if (!model instanceof _model.Model) {
                throw new Error('Parameter model has to be an instance of Model, it\'s an instance of ' + (typeof model === 'undefined' ? 'undefined' : _typeof(model)) + ' instead.');
            }

            this.ctx.save();
            model.render(this.ctx, this);
            this.ctx.restore();

            return this;
        }

        /**
         * Display model's x,y positions and hitbox information
         * @private
         * @param {Model} model
         */

    }, {
        key: 'renderDebug',
        value: function renderDebug(model) {
            if (!model instanceof _model.Model) {
                throw new Error('Parameter model has to be an instance of Model, it\'s an instance of ' + (typeof model === 'undefined' ? 'undefined' : _typeof(model)) + ' instead.');
            }

            this.drawText('[' + Math.round(model.x) + ', ' + Math.round(model.y) + ']', model.x, model.y - 10, '12px', 'sans-serif');

            this.drawRect(model.x, model.y, model.width, model.height, 1, 'red');

            if (null !== model.hitbox.radius) {
                this.drawCircle(model.hitbox.x, model.hitbox.y, model.hitbox.radius, 1, 'blue');
            } else {
                this.drawRect(model.hitbox.x, model.hitbox.y, model.hitbox.width, model.hitbox.height, 1, 'blue');
            }

            this.drawText('[' + Math.round(model.hitbox.x) + ', ' + Math.round(model.hitbox.y) + ']', model.hitbox.x, model.hitbox.y - 10, '12px', 'sans-serif');
        }

        /**
         * Add models to debug
         * @param {Array<Model>|Model} models
         */

    }, {
        key: 'debug',
        value: function debug() {
            var _this = this;

            var models = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            [].concat(models).forEach(function (model) {
                if (model instanceof _model.Model) {
                    _this.renderDebug(model);
                }
            });
        }
    }]);

    return Drawer;
}();

},{"./model":14}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

var Collection = exports.Collection = function () {
    function Collection() {
        _classCallCheck(this, Collection);

        this.items = [];
    }

    _createClass(Collection, [{
        key: "push",
        value: function push(item) {
            return this.items.push(item);
        }
    }, {
        key: "filter",
        value: function filter(callback) {
            return this.items.filter(callback);
        }
    }, {
        key: "find",
        value: function find(callback) {
            return this.items.find(callback);
        }
    }, {
        key: "sort",
        value: function sort(callback) {
            return this.items.sort(callback);
        }
    }, {
        key: "forEach",
        value: function forEach(callback) {
            return this.items.forEach(callback);
        }
    }, {
        key: "remove",
        value: function remove(callback) {
            var index = this.items.findIndex(callback);

            if (index > -1) {
                return this.items.splice(index, 1);
            }

            return false;
        }
    }, {
        key: "clear",
        value: function clear() {
            this.items = [];
        }
    }]);

    return Collection;
}();

},{}],6:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CollisionChecker = undefined;

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

var _model = require('./../model');

var _collection = require('./collection');

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

var CollisionChecker = exports.CollisionChecker = function (_Collection) {
    _inherits(CollisionChecker, _Collection);

    function CollisionChecker() {
        _classCallCheck(this, CollisionChecker);

        return _possibleConstructorReturn(this, (CollisionChecker.__proto__ || Object.getPrototypeOf(CollisionChecker)).apply(this, arguments));
    }

    _createClass(CollisionChecker, [{
        key: 'add',

        /**
         * @param {Model} model
         * @param {Array<Model>|Model} platforms
         * @param {Callable} [event=function()]
         */
        value: function add(model, platforms) {
            var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

            if (!Array.isArray(platforms)) {
                platforms = [platforms];
            }

            this.push({ model: model, platforms: platforms, event: event });
        }

        /**
         * @param {number} dt
         */

    }, {
        key: 'check',
        value: function check(dt) {
            var model = void 0,
                platform = void 0;
            this.items.forEach(function (pair) {
                model = Object.create(pair.model);
                model.step(dt);
                platform = CollisionChecker.hasCollisions(model, pair.platforms);

                if (!!platform) {
                    pair.event(pair.model, platform);
                }
            });
        }

        /**
         * @param {Callable} callback
         */

    }, {
        key: 'remove',
        value: function remove(callback) {
            var index = this.items.findIndex(function (item) {
                return callback(item.model);
            });

            if (index > -1) {
                return this.items.splice(index, 1);
            }

            return false;
        }

        /**
         * Check if there are any collisions between model and array of models
         * @param {Model} model
         * @param {Array<Model>|Model} models
         * @return {boolean}
         */

    }], [{
        key: 'hasCollisions',
        value: function hasCollisions(model, models) {
            if (!model instanceof _model.Model) {
                throw new Error('Parameter model has to be an instance of Model, it\'s an instance of ' + (typeof model === 'undefined' ? 'undefined' : _typeof(model)) + ' instead.');
            }

            if (!Array.isArray(models)) {
                models = [models];
            }

            var m = void 0;
            for (var i = 0; i < models.length; i++) {
                m = models[i];
                if (!model instanceof _model.Model) {
                    throw new Error('Parameter from models[' + i + '] has to be an instance of Model, it\'s an instance of ' + (typeof m === 'undefined' ? 'undefined' : _typeof(m)) + ' instead.');
                }

                if (!!model.hitbox.radius && !!m.hitbox.radius && CollisionChecker.hasCollisionBetweenCircleAndCircle(model.hitbox, m.hitbox)) {
                    return m;
                } else if (!!model.hitbox.radius && !m.hitbox.radius && CollisionChecker.hasCollisionBetweenCircleAndRectangle(model.hitbox, m.hitbox)) {
                    return m;
                } else if (!model.hitbox.radius && !!m.hitbox.radius && CollisionChecker.hasCollisionBetweenCircleAndRectangle(m.hitbox, model.hitbox)) {
                    return m;
                } else if (!model.hitbox.radius && !m.hitbox.radius && CollisionChecker.hasCollisionBetweenRectangleAndRectangle(model.hitbox, m.hitbox)) {
                    return m;
                }
            }

            return false;
        }

        /**
         * Check collision between circle and another circle
         * @param {Object} circleA
         * @param {number} circleA.x
         * @param {number} circleA.y
         * @param {number} circleA.radius
         * @param {Object} circleB
         * @param {number} circleB.x
         * @param {number} circleB.y
         * @param {number} circleB.radius
         *
         * @return {boolean}
         */

    }, {
        key: 'hasCollisionBetweenCircleAndCircle',
        value: function hasCollisionBetweenCircleAndCircle(circleA, circleB) {
            var dx = circleA.x - circleB.x;
            var dy = circleA.y - circleB.y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < circleA.radius + circleB.radius) {
                return true;
            }

            return false;
        }

        /**
         * Check collision between circle and rectangle
         * @param {Object} circle
         * @param {number} circle.x
         * @param {number} circle.y
         * @param {number} circle.radius
         * @param {Object} rectangle
         * @param {number} rectangle.x
         * @param {number} rectangle.y
         * @param {number} rectangle.width
         * @param {number} rectangle.height
         *
         * @return {boolean}
         */

    }, {
        key: 'hasCollisionBetweenCircleAndRectangle',
        value: function hasCollisionBetweenCircleAndRectangle(circle, rectangle) {
            var distX = Math.abs(circle.x - rectangle.x - rectangle.width / 2);
            var distY = Math.abs(circle.y - rectangle.y - rectangle.height / 2);

            if (distX > rectangle.width / 2 + circle.radius) {
                return false;
            }

            if (distY > rectangle.height / 2 + circle.radius) {
                return false;
            }

            if (distX <= rectangle.width / 2) {
                return true;
            }

            if (distY <= rectangle.height / 2) {
                return true;
            }

            var dx = distX - rectangle.width / 2;
            var dy = distY - rectangle.height / 2;

            return dx * dx + dy * dy <= circle.radius * circle.radius;
        }

        /**
         * Check collision between rectangle and rectangle
         * @param {Object} rectangleA
         * @param {number} rectangleA.x
         * @param {number} rectangleA.y
         * @param {number} rectangleA.width
         * @param {number} rectangleA.height
         * @param {Object} rectangleB
         * @param {number} rectangleB.x
         * @param {number} rectangleB.y
         * @param {number} rectangleB.width
         * @param {number} rectangleB.height
         *
         * @return {boolean}
         */

    }, {
        key: 'hasCollisionBetweenRectangleAndRectangle',
        value: function hasCollisionBetweenRectangleAndRectangle(rectangleA, rectangleB) {
            if (rectangleA.x < rectangleB.x + rectangleB.width && rectangleA.x + rectangleA.width > rectangleB.x && rectangleA.y < rectangleB.y + rectangleB.height && rectangleA.y + rectangleA.height > rectangleB.y) {
                return true;
            }

            return false;
        }
    }]);

    return CollisionChecker;
}(_collection.Collection);

},{"./../model":14,"./collection":5}],7:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Map = undefined;

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

var _model = require('./../model');

var _drawer = require('./../drawer');

var _aStar = require('./pathfinds/a-star');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
 * @ignore
 */
var Map = exports.Map = function () {
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
        this.pathFindingLayer = {};

        this.width = tileWidth * columns;
        this.height = tileHeight * rows;
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
                        this.platforms[name].push(new _model.Model(c * this.tileWidth, r * this.tileHeight, this.tileWidth, this.tileHeight));
                    }
                    t++;
                }
            }

            if (!hidden) {
                this.addLayer(layer, name, z);
            }
        }
    }, {
        key: 'addPathFindingLayer',
        value: function addPathFindingLayer(layer, name) {
            var tiles = layer.data || layer.tiles || [];
            var rows = layer.height || layer.rows || this.rows;
            var columns = layer.width || layer.columns || this.columns;
            var nodes = [];

            var x = void 0,
                y = void 0;
            var t = 0;
            for (var c = 0; c < columns; c++) {
                for (var r = 0; r < rows; r++) {
                    x = r * this.tileWidth;
                    y = c * this.tileHeight;

                    nodes.push({
                        x: x, y: y,
                        posX: r, posY: c,
                        walkable: 0 === tiles[t],
                        g: 0, h: 0
                    });

                    t++;
                }
            }

            this.pathFindingLayer[name] = { nodes: nodes, rows: rows, columns: columns, name: name };
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
        key: 'findPathBetweenPositions',
        value: function findPathBetweenPositions(name, objectA, objectB) {
            var layer = this.pathFindingLayer[name];
            var finder = new _aStar.AStar();

            if (!!layer) {
                var startPosX = Math.floor(objectA.x / this.tileWidth);
                var startPosY = Math.floor(objectA.y / this.tileHeight);

                var endPosX = Math.floor(objectB.x / this.tileWidth);
                var endPosY = Math.floor(objectB.y / this.tileHeight);

                var startNode = { posX: startPosX, posY: startPosY, f: 0, g: 0, h: 0 };
                var endNode = { posX: endPosX, posY: endPosY, f: 0, g: 0, h: 0 };

                return finder.findPath(layer.nodes, startNode, endNode);
            }

            return [];
        }
    }, {
        key: 'render',
        value: function render(drawer, options) {
            if (!drawer instanceof _drawer.Drawer) {
                throw new Error('Parameter drawer has to be an instance of Drawer, it\'s an instance of ' + (typeof drawer === 'undefined' ? 'undefined' : _typeof(drawer)) + ' instead.');
            }

            var ctx = drawer.ctx;
            var minZ = options.minZ || 0;
            var maxZ = options.maxZ || 999;
            var limits = options.limits || { x: 0, y: 0, width: 9999, height: 9999 };
            var onlyLayer = options.layer || null;

            var tileset = null;
            var layer = null;
            var layers = this.layers;

            for (var layerName in this.layers) {
                layer = this.layers[layerName];

                if (layer.z < minZ || layer.z > maxZ || null !== onlyLayer && onlyLayer !== layerName) {
                    continue;
                }

                tileset = null !== layer.tileset ? this.getTileset(layer.tileset) : this.defaultTileset;

                var t = 0;
                for (var columns = 0; columns < layer.columns; columns++) {
                    for (var rows = 0; rows < layer.rows; rows++) {
                        tileset.x = rows * this.tileWidth;
                        tileset.y = columns * this.tileHeight;

                        // Check if tile is into limits
                        if (tileset.x + this.tileWidth >= limits.x && tileset.x <= limits.x + limits.width && tileset.y + this.tileHeight >= limits.y && tileset.y <= limits.y + limits.height) {
                            tileset.renderTile(layer.tiles[t] || 0, ctx);
                        }

                        t++;
                    }
                }
            }
        }
    }]);

    return Map;
}();

},{"./../drawer":3,"./../model":14,"./pathfinds/a-star":8}],8:[function(require,module,exports){
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
 * @ignore
 */
var AStar = exports.AStar = function () {
    function AStar() {
        _classCallCheck(this, AStar);

        this.openList = [];
        this.closeList = [];

        this.NODE_DISTANCE_VALUE = 100;
    }

    _createClass(AStar, [{
        key: "findPath",
        value: function findPath(nodes, startNode, endNode) {
            var _this = this;

            var path = [];
            var currentNode = null;
            var neighbours = [];
            var g = 0;
            var h = 0;
            var f = 0;

            this.addToOpenList(startNode);
            while (this.openList.length > 0) {
                currentNode = this.getCurrentNode();
                if (currentNode.posX === endNode.posX && currentNode.posY === endNode.posY) {
                    break;
                }

                this.addToCloseList(currentNode);
                this.getNeighbours(currentNode, nodes).forEach(function (node) {
                    if (_this.isOnCloseList(node) || !node.walkable) {
                        return;
                    }

                    g = (!!node.parent ? node.parent.g : node.g) + _this.NODE_DISTANCE_VALUE;
                    h = (Math.abs(endNode.posX - node.posX) + Math.abs(endNode.posY - node.posY)) * _this.NODE_DISTANCE_VALUE;
                    f = h + g;

                    if (_this.isOnOpenList(node)) {
                        if (g < node.g) {
                            node.parent = currentNode;
                            node.g = g;
                            node.h = h;
                            node.f = f;
                        }
                    } else {
                        _this.addToOpenList(node);
                        node.parent = currentNode;
                        node.g = g;
                        node.h = h;
                        node.f = f;
                    }
                });
            }

            if (this.openList.length === 0) {
                return path;
            }

            var lastNode = this.getNode(endNode.posX, endNode.posY, nodes);
            while (lastNode.posX !== startNode.posX || lastNode.posY !== startNode.posY) {
                path.push(lastNode);
                lastNode = lastNode.parent;
            }
            path.push(this.getNode(startNode.posX, startNode.posY, nodes));

            return path.reverse();
        }
    }, {
        key: "removeFromCloseList",
        value: function removeFromCloseList(node) {
            var index = this.closeList.findIndex(function (n) {
                return n.posX === node.posX && n.posY === node.posY;
            });

            if (index > -1) {
                this.closeList.splice(index, 1);
            }
        }
    }, {
        key: "removeFromOpenList",
        value: function removeFromOpenList(node) {
            var index = this.openList.findIndex(function (n) {
                return n.posX === node.posX && n.posY === node.posY;
            });

            if (index > -1) {
                this.openList.splice(index, 1);
            }
        }
    }, {
        key: "addToCloseList",
        value: function addToCloseList(node) {
            var hasNode = this.closeList.find(function (n) {
                return n.posX === node.posX && n.posY === node.posY;
            });

            if (!hasNode) {
                this.removeFromOpenList(node);
                this.closeList.push(node);
            }
        }
    }, {
        key: "addToOpenList",
        value: function addToOpenList(node) {
            var hasNode = this.openList.find(function (n) {
                return n.posX === node.posX && n.posY === node.posY;
            });

            if (!hasNode) {
                this.removeFromCloseList(node);
                this.openList.push(node);
            }
        }
    }, {
        key: "getCurrentNode",
        value: function getCurrentNode() {
            var minF = 1000000;
            var currentNode = null;
            this.openList.forEach(function (node) {
                if (node.f < minF) {
                    minF = node.f;
                    currentNode = node;
                }
            });

            return currentNode;
        }
    }, {
        key: "getNeighbours",
        value: function getNeighbours(node, nodes) {
            var neighbours = [];

            if (this.getNode(node.posX, node.posY - 1, nodes)) {
                neighbours.push(this.getNode(node.posX, node.posY - 1, nodes));
            }

            if (this.getNode(node.posX, node.posY + 1, nodes)) {
                neighbours.push(this.getNode(node.posX, node.posY + 1, nodes));
            }

            if (this.getNode(node.posX - 1, node.posY, nodes)) {
                neighbours.push(this.getNode(node.posX - 1, node.posY, nodes));
            }

            if (this.getNode(node.posX + 1, node.posY, nodes)) {
                neighbours.push(this.getNode(node.posX + 1, node.posY, nodes));
            }

            return neighbours;
        }
    }, {
        key: "getNode",
        value: function getNode(posX, posY, nodes) {
            return nodes.find(function (node) {
                return node.posX === posX && node.posY === posY;
            });
        }
    }, {
        key: "isOnCloseList",
        value: function isOnCloseList(node) {
            return this.closeList.some(function (n) {
                return n.posX === node.posX && n.posY === node.posY;
            });
        }
    }, {
        key: "isOnOpenList",
        value: function isOnOpenList(node) {
            return this.openList.some(function (n) {
                return n.posX === node.posX && n.posY === node.posY;
            });
        }
    }]);

    return AStar;
}();

},{}],9:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Renderer = undefined;

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

var _model = require('./../model');

var _collection = require('./collection');

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

var Renderer = exports.Renderer = function (_Collection) {
    _inherits(Renderer, _Collection);

    function Renderer() {
        _classCallCheck(this, Renderer);

        return _possibleConstructorReturn(this, (Renderer.__proto__ || Object.getPrototypeOf(Renderer)).apply(this, arguments));
    }

    _createClass(Renderer, [{
        key: 'add',

        /**
         * @param {Array<Model>|Model} models
         * @param {Callable} [order=function()]
         */
        value: function add(models) {
            var _this2 = this;

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

            models.forEach(function (model, index) {
                if (!model instanceof _model.Model) {
                    throw new Error('Parameter from models[' + index + '] has to be an instance of Model, it\'s an instance of ' + (typeof model === 'undefined' ? 'undefined' : _typeof(model)) + ' instead.');
                }

                _this2.push({ model: model, order: _order });
            });
        }

        /**
         * @return {Array<Model>}
         */

    }, {
        key: 'sortModels',
        value: function sortModels() {
            return this.sort(function (a, b) {
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

        /**
         * @param {Callable} callback
         */

    }, {
        key: 'remove',
        value: function remove(callback) {
            var index = this.items.findIndex(function (item) {
                return callback(item.model);
            });

            if (index > -1) {
                return this.items.splice(index, 1);
            }

            return false;
        }

        /**
         * @param {Drawer} drawer
         */

    }, {
        key: 'render',
        value: function render(drawer) {
            if (!drawer instanceof Drawer) {
                throw new Error('Parameter drawer has to be an instance of Drawer, it\'s an instance of ' + (typeof drawer === 'undefined' ? 'undefined' : _typeof(drawer)) + ' instead.');
            }

            this.sortModels();
            this.forEach(function (el) {
                if (!!el.model.render) {
                    drawer.drawModel(el.model);
                }
            });
        }
    }]);

    return Renderer;
}(_collection.Collection);

},{"./../model":14,"./collection":5}],10:[function(require,module,exports){
'use strict';

var _application = require('./application');

var _container = require('./container');

var _drawer = require('./drawer');

var _eventEmitter = require('./event-emitter');

var _model = require('./model');

var _sprite = require('./sprite');

var _tileset = require('./tileset');

var _ticker = require('./ticker');

var _ticker2 = _interopRequireDefault(_ticker);

var _viewport = require('./viewport');

var _particle = require('./particle');

var _map = require('./helper/map');

var _collisionChecker = require('./helper/collision-checker');

var _renderer = require('./helper/renderer');

var _collection = require('./helper/collection');

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _keys = require('./keys');

var _keys2 = _interopRequireDefault(_keys);

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
window.Tileset = _tileset.Tileset;
window.Drawer = _drawer.Drawer;
window.Viewport = _viewport.Viewport;
window.Particle = _particle.Particle;

window.io = _io2.default;
window.KEYS = _keys2.default;
window.loader = _loader2.default;
window.mouse = _mouse2.default;
window.ticker = _ticker2.default;
window.events = new _eventEmitter.EventEmitter();

window.Map = _map.Map;
window.CollisionChecker = _collisionChecker.CollisionChecker;
window.Renderer = _renderer.Renderer;
window.Collection = _collection.Collection;

},{"./application":1,"./container":2,"./drawer":3,"./event-emitter":4,"./helper/collection":5,"./helper/collision-checker":6,"./helper/map":7,"./helper/renderer":9,"./io":11,"./keys":12,"./loader":13,"./model":14,"./mouse":15,"./particle":16,"./sprite":17,"./ticker":18,"./tileset":19,"./viewport":20}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('./keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

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
var io = {};

document.addEventListener('keydown', function (e) {
    io[e.keyCode] = true;
});

document.addEventListener('keyup', function (e) {
    io[e.keyCode] = false;
});

document.addEventListener('mousedown', function () {
    io[_keys2.default.LEFT_CLICK] = true;
});

document.addEventListener('mouseup', function () {
    io[_keys2.default.LEFT_CLICK] = false;
});

exports.default = io;

},{"./keys":12}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
    BOTTOM: 40,
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

exports.default = keys;

},{}],13:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Loader = undefined;

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
var Loader = exports.Loader = function (_EventEmitter) {
    _inherits(Loader, _EventEmitter);

    function Loader() {
        _classCallCheck(this, Loader);

        /** @type {number} */
        var _this = _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this));

        _this.count = 0;

        /** @type {number} */
        _this.queue = 0;

        /** @type {number} */
        _this.progress = 0;

        /** @type {boolean} */
        _this.ready = true;

        /** @type {Array} */
        _this.collection = [];
        return _this;
    }

    /**
     * Add asset to load
     * @param {string} src
     * @param {string} id
     * @param {string} type - (image or json)
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
         * @param {string} id
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
         * @param {string} src
         * @param {string} id
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
         * @param {string} src
         * @param {string} id
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
         * @param {string} id
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

var loader = new Loader();
exports.default = loader;

},{"./event-emitter":4}],14:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Model = undefined;

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
 * Base class for every model entity
 * @example
 * let model = new Model(10, 10, 100, 200);
 */
var Model = exports.Model = function (_EventEmitter) {
    _inherits(Model, _EventEmitter);

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

        /** @type {number} */
        var _this = _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this));

        _this.x = x;
        /** @type {number} */
        _this.y = y;
        /** @type {number} */
        _this.width = width;
        /** @type {number} */
        _this.height = height;

        _this.hitbox = hitbox;
        _this.collision = false;
        _this.parent = {};
        return _this;
    }

    /**
     * @return {Object}
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     */

    _createClass(Model, [{
        key: 'step',

        /**
         * @param {number} dt
         */
        value: function step(dt) {}

        /**
         * @param {RenderingContext} ctx
         * @param {Drawer} [drawer=null]
         */

    }, {
        key: 'render',
        value: function render(ctx) {
            var drawer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        }

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
        key: 'serialize',
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
         * @param {boolean} data.collision
         * @return {Model}
         */

    }, {
        key: 'hitbox',
        get: function get() {
            return {
                x: this.x + this._hitbox.x,
                y: this.y + this._hitbox.y,
                width: this._hitbox.width,
                height: this._hitbox.height,
                radius: this._hitbox.radius
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
                height: hitbox.height || this.height,
                radius: hitbox.radius || null
            };
        }

        /**
         * @property {number} value
         */

    }, {
        key: 'x',
        set: function set(value) {
            this._x = Math.round(value);
        }

        /**
         * @return {number}
         */

        , get: function get() {
            return this._x;
        }

        /**
         * @property {number} value
         */

    }, {
        key: 'y',
        set: function set(value) {
            this._y = Math.round(value);
        }

        /**
         * @return {number}
         */

        , get: function get() {
            return this._y;
        }
    }], [{
        key: 'deserialize',
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
}(_eventEmitter.EventEmitter);

},{"./event-emitter":4}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Mouse = undefined;

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

var _io2 = _interopRequireDefault(_io);

var _keys = require('./keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

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
var Mouse = exports.Mouse = function () {
    function Mouse() {
        _classCallCheck(this, Mouse);

        /** @type {number} */
        this.x = 0;

        /** @type {number} */
        this.y = 0;

        /** @type {number} - absolute x position */
        this.ax = 0;

        /** @type {number} - absolute y postion */
        this.ay = 0;

        /** @type {number} */
        this.scaleX = 1;

        /** @type {number} */
        this.scaleY = 1;
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

            var x = this.ax > this.x ? this.ax : this.x;
            var y = this.ay > this.y ? this.ay : this.y;

            if (x / this.scaleX <= object.x + object.width && object.x <= x / this.scaleX && y / this.scaleY <= object.y + object.height && object.y <= y / this.scaleY) {
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
            return _io2.default[_keys2.default.LEFT_CLICK] && this.isOver(object);
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
            return _io2.default[_keys2.default.LEFT_CLICK] && this.isOut(object);
        }

        /**
         * @param {Object} target
         * @param {number} target.x
         * @param {number} target.y
         * @param {number} target.width
         * @return {number}
         */

    }, {
        key: 'getAngle',
        value: function getAngle(object) {
            if (object.x === undefined || object.y === undefined || object.width === undefined || object.height === undefined) {
                throw new Error('Object ' + object + ' is not valid, needs x, y, width and height parameters.');
            }

            var x = this.ax > this.x ? this.ax : this.x;
            var y = this.ay > this.y ? this.ay : this.y;

            var rad = Math.atan2(y / this.scaleY - (object.y + object.height / this.scaleY), x / this.scaleX - (object.x + object.width / this.scaleX));

            return rad * 180 / Math.PI;
        }
    }]);

    return Mouse;
}();

var mouse = new Mouse();
exports.default = mouse;

},{"./container":2,"./io":11,"./keys":12,"./model":14}],16:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Particle = undefined;

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

// @TODO : doc
var Particle = exports.Particle = function (_Model) {
    _inherits(Particle, _Model);

    function Particle(x, y, type, options) {
        _classCallCheck(this, Particle);

        var _this = _possibleConstructorReturn(this, (Particle.__proto__ || Object.getPrototypeOf(Particle)).call(this, x, y));

        _this.type = type;
        _this.options = options;
        _this.opacity = 1;
        return _this;
    }

    _createClass(Particle, [{
        key: 'step',
        value: function step(dt) {
            if (this.opacity > 0) {
                this.opacity -= this.options.step || 0.01;
                this.opacity = this.opacity < 0 ? 0 : this.opacity;

                this.x += Math.cos(this.options.rotate || 0) * this.options.velocity || 0;
                this.y += Math.sin(this.options.rotate || Math.PI / 2) * this.options.velocity || 0;
            }
        }
    }, {
        key: 'render',
        value: function render(ctx, drawer) {
            if (this.opacity <= 0 || null === drawer) {
                return;
            }

            drawer.save();

            if (!!this.options.rotate) {
                drawer.rotateModel(this, this.options.rotate, this.options.pivotX, this.options.pivotY);
            }

            drawer.ctx.globalAlpha = this.opacity;

            switch (this.type) {
                case 'text':
                    drawer.drawText(this.options.text, this.x, this.y, this.options.size || '8pt', this.options.font || 'Arial, sans-serif', this.options.color || 'black', this.options.style || '', this.options.align || 'left');
                    break;
                case 'image':
                    if (!!this.options.image) {
                        drawer.drawImage(this.options.image, this.x, this.y);
                    }
                    break;
                case 'rect':
                case 'rectangle':
                    if (!!this.options.width && !!this.options.height) {
                        drawer.drawRect(this.x, this.y, this.options.width, this.options.height, this.options.size, this.options.color);
                    }
                    break;
                case 'fillrect':
                case 'fillrectangle':
                case 'fill-rectangle':
                    if (!!this.options.width && !!this.options.height) {
                        drawer.drawFillRect(this.x, this.y, this.options.width, this.options.height, this.options.color, this.options.lineSize, this.options.lineColor);
                    }
                    break;
                case 'circ':
                case 'circle':
                    if (!!this.options.radius) {
                        drawer.drawCircle(this.x, this.y, this.options.radius, this.options.size, this.options.color, this.options.start, this.options.end);
                    }
                    break;
                case 'fillcirc':
                case 'fillcircle':
                case 'fill-circle':
                    if (!!this.options.radius) {
                        drawer.drawFillCircle(this.x, this.y, this.options.radius, this.options.color, this.options.lineSize, this.options.lineColor, this.options.start, this.options.end);
                    }
                    break;
            }

            drawer.restore();
        }
    }, {
        key: 'serialize',
        value: function serialize() {
            return Object.assign(_get(Particle.prototype.__proto__ || Object.getPrototypeOf(Particle.prototype), 'serialize', this).call(this), {
                type: this.type,
                options: this.options,
                opacity: this.opacity
            });
        }
    }], [{
        key: 'deserialize',
        value: function deserialize(_ref) {
            var x = _ref.x,
                y = _ref.y,
                type = _ref.type,
                options = _ref.options,
                opacity = _ref.opacity;

            var particle = new Particle(x, y, type, options);

            particle.opacity = opacity;

            return particle;
        }
    }]);

    return Particle;
}(_model.Model);

},{"./model":14}],17:[function(require,module,exports){
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
 * const image = loader.get('my-sprite'); // see Loader documentation
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
     * @param {Object} [hitbox={}]
     * @param {number} [hitbox.x]
     * @param {number} [hitbox.y]
     * @param {number} [hitbox.width]
     * @param {number} [hitbox.height]
     *
     * @example
     * new Sprite(0, 0, 20, 20, image, [{ frames: [9, 10, 11, 12], name: 'walk', loop: true, flip: false }]);
     */
    function Sprite(x, y, tileWidth, tileHeight, image, animations) {
        var hitbox = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

        _classCallCheck(this, Sprite);

        /** @type {Image} */
        var _this = _possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this, x, y, tileWidth, tileHeight, hitbox));

        _this.image = image;

        /** @type {Array<Object>} */
        _this.animations = animations;

        /** @type {number} */
        _this.time = 1;

        /** @type {boolean} */
        _this.stopped = true;

        /** @type {Object} */
        _this.frame = { x: 0, y: 0 };

        /** @type {Object} */
        _this.frames = {
            width: image.width / tileWidth,
            height: image.height / tileHeight,
            total: image.width / tileWidth * (image.height / tileHeight)
        };

        /** @type {number} */
        _this.currentAnimation = 0;

        /** @type {number} */
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
         * @param {RenderingContext} [ctx=null]
         * @param {Drawer} [drawer=null]
         */

    }, {
        key: 'render',
        value: function render() {
            var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var drawer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            ctx = ctx || this.parent.ctx;
            drawer = drawer || this.parent;

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
}(_model.Model);

},{"./model":14}],18:[function(require,module,exports){
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

        /** @type {number} */
        var _this = _possibleConstructorReturn(this, (Ticker.__proto__ || Object.getPrototypeOf(Ticker)).call(this));

        _this.lastTick = Date.now();

        /** @type {boolean} */
        _this.stopped = true;

        /** @type {number} */
        _this.frame = 0;
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

            this.frame++;
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
    }, {
        key: 'every',
        value: function every(frame, callback) {
            if (this.frame % frame === 0) {
                callback();
            }
        }
    }]);

    return Ticker;
}(_eventEmitter.EventEmitter);

var ticker = new Ticker();
exports.default = ticker;

},{"./event-emitter":4}],19:[function(require,module,exports){
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
 * const image = loader.get('my-tileset'); // see Loader documentation
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

                x = Math.round(decimal * this.columns) - 1;
                y = Math.trunc(id * this.tileWidth / this.image.width);
            }

            return { x: x < 0 ? this.columns : x, y: y };
        }

        /**
         * Render a tile
         * @param {number} id
         * @param {CanvasRenderingContext2D} [ctx=null]
         */

    }, {
        key: 'renderTile',
        value: function renderTile(id) {
            var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            ctx = ctx || this.parent.ctx;

            if (id > 0) {
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

},{"./model":14}],20:[function(require,module,exports){
'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Viewport = undefined;

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

var _model = require('./model');

var _drawer = require('./drawer');

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

/**
 * Create a new Viewport
 * @example
 * const app = new Application({ width: 200, height: 200 });
 * const player = new Sprite(...);
 * const world = new Container(...);
 * const viewport = new Viewport(0, 0, app.canvas, 1, 1, app.width / 2, app.height / 2);
 *
 * viewport.follow(player, world);
 * viewport.drawImage(world);
 */
var Viewport = exports.Viewport = function (_Model) {
    _inherits(Viewport, _Model);

    /**
     * @param {number} x - x position of viewport into world
     * @param {number} y - y position of viewport into world
     * @param {CanvasRenderingContext2D} canvas - canvas where to draw image
     * @param {number} [scaleX=1]
     * @param {number} [scaleY=1]
     * @param {number} [deadZoneX=0] - x position of dead zone (where viewport move when following target)
     * @param {number} [deadZoneY=0] - y position of dead zone (where viewport move when following target)
     */
    function Viewport(x, y, canvas) {
        var scaleX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var scaleY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var deadZoneX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var deadZoneY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

        _classCallCheck(this, Viewport);

        /** @type {CanvasRenderingContext2D} */
        var _this = _possibleConstructorReturn(this, (Viewport.__proto__ || Object.getPrototypeOf(Viewport)).call(this, x, y, canvas.width, canvas.height));

        _this.canvas = canvas;

        /** @type {number} */
        _this.scaleX = scaleX;

        /** @type {number} */
        _this.scaleY = scaleY;

        /** @type {number} */
        _this.deadZoneX = deadZoneX;

        /** @type {number} */
        _this.deadZoneY = deadZoneY;

        // Update mouse coordinates
        document.addEventListener('mousemove', function (event) {
            _mouse2.default.ax = _mouse2.default.x + _this.x * _this.scaleX;
            _mouse2.default.ay = _mouse2.default.y + _this.y * _this.scaleY;
        });

        _mouse2.default.scaleX = _this.scaleX;
        _mouse2.default.scaleY = _this.scaleY;

        _this.ctx = _this.canvas.getContext('2d');
        return _this;
    }

    /**
     * Viewport follow target into world
     * @param {Object} target
     * @param {Object} world
     */

    _createClass(Viewport, [{
        key: 'follow',
        value: function follow(target, world) {
            // Follow target
            if (target.x - this.x + this.deadZoneX / this.scaleX > this.width / this.scaleX) {
                this.x = target.x - (this.width / this.scaleX - this.deadZoneX / this.scaleX);
            } else if (target.x - this.deadZoneX / this.scaleX < this.x) {
                this.x = target.x - this.deadZoneX / this.scaleX;
            }

            if (target.y - this.y + this.deadZoneY / this.scaleY > this.height / this.scaleY) {
                this.y = target.y - (this.height / this.scaleY - this.deadZoneY / this.scaleY);
            } else if (target.y - this.deadZoneY / this.scaleY < this.y) {
                this.y = target.y - this.deadZoneY / this.scaleY;
            }

            // Rest into world
            if (this.x < world.x) {
                this.x = world.x;
            }

            if (this.x + this.width / this.scaleX > world.x + world.width) {
                this.x = world.x + world.width - this.width / this.scaleX;
            }

            if (this.y < world.y) {
                this.y = world.y;
            }

            if (this.y + this.height / this.scaleY > world.y + world.height) {
                this.y = world.y + world.height - this.height / this.scaleY;
            }
        }

        /**
         * Drawn image from source into canvas with viewport
         * @param {Drawer} source
         * @param {number} [x=0]
         * @param {number} [y=0]
         * @param {number} [width=null]
         * @param {number} [height=null]
         */

    }, {
        key: 'drawImage',
        value: function drawImage(source) {
            var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

            if (!source instanceof _drawer.Drawer) {
                throw new Error('Parameter source has to be an instance of Drawer, it\'s an instance of ' + (typeof model === 'undefined' ? 'undefined' : _typeof(model)) + ' instead.');
            }

            this.ctx.drawImage(source.canvas, this.x, this.y, this.width, this.height, x, y, width || this.canvas.width, height || this.canvas.height);
        }
    }]);

    return Viewport;
}(_model.Model);

},{"./drawer":3,"./model":14,"./mouse":15}]},{},[10]);
