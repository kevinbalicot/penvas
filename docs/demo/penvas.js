(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Application = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ticker = require('./ticker');

var _model = require('./model');

var _keyboard = require('./keyboard');

var _loader = require('./loader');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Application = exports.Application = function () {

    /**
     * @param {} options
     *      {
     *          HTMLElement container: HTML container (default: body element)
     *          int width: canvas width (default: window width)
     *          int height: canvas height (default: window height)
     *          hex background: canvas background (default: 0xffffff)
     *
     *          function create: called to load assets
     *          function render: called at every frame
     *          function ready: called when application is ready (need to use loader)
     *      }
     */
    function Application() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Application);

        this.options = options;
        this.layers = [];
        this.currentLayer = null;
        this.keyboard = _keyboard.keyboard;
        this.loader = _loader.loader;

        if (_typeof(options.container) != 'object') {
            options.container = document.querySelector('body');
        }

        this.width = options.width || window.innerWidth;
        this.height = options.height || window.innerHeight;
        this.background = options.background || 0xffffff;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = this.background;

        this.context = this.canvas.getContext('2d');
        this.ctx = this.context;

        options.container.appendChild(this.canvas);

        if (!!options.create) {
            options.create.call(this);
            this.loader.on('ready', function () {
                return _this.ready();
            });
        }

        this.ticker = new _ticker.Ticker();

        this.ticker.on('step', this.step, this);
        this.ticker.on('render', this.render, this);

        if (this.loader.ready) {
            this.ticker.start();
        }
    }

    /**
     * Callback called at every frame to calculate models x,y positions
     * @param float dt
     * @return void
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
         * @param float dt
         * @return void
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
         * @param {} layer
         *      {
         *          function create: called to create models
         *          function step: called at every frame
         *          function render: called at every frame
         *      }
         * @param string name
         * @return void
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
         * @param string name
         * @return void
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
         * @return void
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
         * @return void
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
         * @param Model model
         * @return void
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
         * @param Model[] models
         * @return void
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
         * @param Error err
         * @return void
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

},{"./keyboard":5,"./loader":6,"./model":7,"./ticker":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = exports.Container = function () {

    /**
     * Create a new canvas
     * @param {} options
     *      {
     *          int x: default 0
     *          int y: default 0
     *          int width: default window width
     *          int height: default window height
     *          hex background: default 0xffffff
     *      }
     */
    function Container() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Container);

        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || window.innerWidth;
        this.height = options.height || window.innerHeight;
        this.background = options.background || 0xffffff;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = this.background;

        this.context = this.canvas.getContext('2d');
        this.ctx = this.context;
    }

    /**
     * Render this canvas into another canvas
     * @param 2DContext ctx
     * @param int x
     * @param int y
     * @return void
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = exports.EventEmitter = function () {
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        this.registered = [];
    }

    /**
     * @param string event
     * @param function callback
     * @param mixed context
     * @return void
     */


    _createClass(EventEmitter, [{
        key: "on",
        value: function on(event, callback, context) {
            this.registered.push({ event: event, callback: callback, context: context });
        }

        /**
         * @param string event
         * @param mixed args
         * @return void
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

var _keyboard = require('./keyboard');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _loader = require('./loader');

var _loader2 = _interopRequireDefault(_loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Application = _application.Application;
window.Container = _container.Container;
window.EventEmitter = _eventEmitter.EventEmitter;
window.Model = _model.Model;
window.Sprite = _sprite.Sprite;
window.Ticker = _ticker.Ticker;
window.Tileset = _tileset.Tileset;
window.Keyboard = _keyboard2.default;
window.Loader = _loader2.default;

},{"./application":1,"./container":2,"./event-emitter":3,"./keyboard":5,"./loader":6,"./model":7,"./sprite":8,"./ticker":9,"./tileset":10}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var KEY_UP = exports.KEY_UP = 38;
var KEY_DOWN = exports.KEY_DOWN = 40;
var KEY_LEFT = exports.KEY_LEFT = 37;
var KEY_RIGHT = exports.KEY_RIGHT = 39;
var KEY_SPACE = exports.KEY_SPACE = 32;
var KEY_B = exports.KEY_B = 66;
var KEY_N = exports.KEY_N = 78;
var LEFT_CLICK = exports.LEFT_CLICK = 'left_click';

var keyboard = exports.keyboard = [];
keyboard[KEY_UP] = false;
keyboard[KEY_DOWN] = false;
keyboard[KEY_LEFT] = false;
keyboard[KEY_RIGHT] = false;
keyboard[KEY_SPACE] = false;
keyboard[KEY_B] = false;
keyboard[KEY_N] = false;
keyboard[LEFT_CLICK] = false;

document.addEventListener('keydown', function (e) {
    //e.preventDefault();
    keyboard[e.keyCode] = true;
});

document.addEventListener('keyup', function (e) {
    //e.preventDefault();
    keyboard[e.keyCode] = false;
});

document.addEventListener('mousedown', function () {
    keyboard[LEFT_CLICK] = true;
});

document.addEventListener('mouseup', function () {
    keyboard[LEFT_CLICK] = false;
});

exports.default = keyboard;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loader = exports.Loader = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventEmitter = require('./event-emitter');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
     * @param string src
     * @param string id
     * @param string type (image or json)
     * @return void
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
         * Add assat into collection and dispatch event
         * @param mixed el
         * @param string id
         * @return void
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
         * @param string src
         * @param string id
         * @return void
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
         * @param string src
         * @param string id
         * @return void
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
         * @param string id
         * @return mixed
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base class for every model entity
 */
var Model = exports.Model = function () {

    /**
     * @param int x
     * @param int y
     * @param int width
     * @param int height
     * @param {x, y, width, height} hitbox
     */
    function Model(x, y, width, height) {
        var hitbox = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

        _classCallCheck(this, Model);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hitbox = hitbox;
        this.collision = false;
        this.parent = {};
    }

    /**
     * @return {x, y, width, height}
     */


    _createClass(Model, [{
        key: "hasCollisions",


        /**
         * @param Model[] models
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
         * @param {x, y, width, height} hitbox
         */
        ,
        set: function set(hitbox) {
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
exports.Sprite = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = require('./model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sprite = exports.Sprite = function (_Model) {
    _inherits(Sprite, _Model);

    /**
     * @param int x
     * @param int y
     * @param int tileWidth : width tile
     * @param int tileHeight : height tile
     * @param Image image
     * @param {} animations : list of animations
     *                      example : { frames: [9, 10, 11, 12], name: 'walk', loop: true, flip: false }
     * @param {x, y, width, height} hitbox
     */
    function Sprite(x, y, tileWidth, tileHeight, image, animations, hitbox) {
        _classCallCheck(this, Sprite);

        var _this = _possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this, x, y, tileWidth, tileHeight, hitbox));

        _this.image = image;
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
     * @return void
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
         * @param float dt
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
         * @param string animation
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
         * @return void
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.stopped = true;
        }

        /**
         * @return void
         */

    }, {
        key: 'reset',
        value: function reset() {
            this.frame = { x: 0, y: 0 };
        }

        /**
         * @param 2DContext context
         * @return void
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

},{"./model":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Ticker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventEmitter = require('./event-emitter');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
     * @return void
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
         * @return void
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
         * @return void
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.stopped = true;
        }

        /**
         * @param float dt
         * @return void
         */

    }, {
        key: 'step',
        value: function step(dt) {
            this.dispatch('step', dt);
        }

        /**
         * @param float dt
         * @return void
         */

    }, {
        key: 'render',
        value: function render(dt) {
            this.dispatch('render', dt);
        }
    }]);

    return Ticker;
}(_eventEmitter.EventEmitter);

},{"./event-emitter":3}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tileset = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _model = require('./model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tileset = exports.Tileset = function (_Model) {
    _inherits(Tileset, _Model);

    /**
     * @param int x
     * @param int y
     * @param int tileWidth
     * @param int tileHeight
     * @param Image image
     */
    function Tileset(x, y, tileWidth, tileHeight, image) {
        _classCallCheck(this, Tileset);

        var _this = _possibleConstructorReturn(this, (Tileset.__proto__ || Object.getPrototypeOf(Tileset)).call(this, x, y, tileWidth, tileHeight));

        _this.tileWidth = tileWidth;
        _this.tileHeight = tileHeight;
        _this.image = image;
        return _this;
    }

    /**
     * Get tile x,y positions by id (exemple tile number 23)
     * @param int id
     * @return {x, y}
     */


    _createClass(Tileset, [{
        key: 'getTilePosition',
        value: function getTilePosition(id) {
            var columns = this.image.width / this.tileWidth;
            var rows = this.image.height / this.tileHeight;
            var tiles = columns * rows;

            id = id > tiles ? tiles : id;

            var percent = id * this.tileWidth / this.image.width;
            var unit = Math.trunc(percent);
            var decimal = percent - unit;

            var x = decimal * columns - 1;
            var y = Math.trunc(id * this.tileWidth / this.image.width);

            return { x: x < 0 ? columns : x, y: y };
        }

        /**
         * Render a tile
         * @param int id
         * @param 2DContext context
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
