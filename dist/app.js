(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Application = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ticker = require('./ticker');

var _model = require('./model');

var _keyboard = require('./keyboard');

var _loader = require('./loader');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Application = exports.Application = function () {
    function Application() {
        var _this = this;

        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Application);

        this.options = options;
        this.layers = [];
        this.currentLayer = null;
        this.keyboard = _keyboard.keyboard;
        this.loader = _loader.loader;
        //this.debug = options.debug || false;

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

            // Render debug
            /*if (this.debug) {
                for (let prop in this) {
                    if (this[prop] instanceof Model) {
                        this.renderDebug(this[prop]);
                    }
                }
            }*/
        }
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
    }, {
        key: 'clearLayer',
        value: function clearLayer() {
            this.ctx.save();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
    }, {
        key: 'ready',
        value: function ready() {
            this.ticker.start();

            if (!!this.options.ready) {
                this.options.ready.call(this);
            }
        }
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
    }, {
        key: 'debug',
        value: function debug() {
            var _this2 = this;

            var models = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

            [].concat(models).forEach(function (model) {
                if (model instanceof _model.Model) {
                    _this2.renderDebug(model);
                }
            });
        }
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

},{"./keyboard":4,"./loader":5,"./model":6,"./ticker":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = exports.Container = function Container() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
};

},{}],3:[function(require,module,exports){
'use strict';

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

    _createClass(EventEmitter, [{
        key: 'on',
        value: function on(event, callback, context) {
            this.registered.push({ event: event, callback: callback, context: context });
        }
    }, {
        key: 'dispatch',
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

},{}],5:[function(require,module,exports){
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

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Loader).call(this));

        _this.count = 0;
        _this.queue = 0;
        _this.progress = 0;
        _this.ready = true;
        _this.collection = [];
        return _this;
    }

    _createClass(Loader, [{
        key: 'add',
        value: function add(src, id) {
            var type = arguments.length <= 2 || arguments[2] === undefined ? 'image' : arguments[2];


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

},{"./event-emitter":3}],6:[function(require,module,exports){
'use strict';

/**
 * Base class for every model entity
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = exports.Model = function () {
    function Model(x, y, width, height) {
        var hitbox = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

        _classCallCheck(this, Model);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hitbox = hitbox;
        this.collision = false;
        this.parent = {};
    }

    _createClass(Model, [{
        key: 'hasCollisions',
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
        key: 'hitbox',
        get: function get() {
            return {
                x: this.x + this._hitbox.x,
                y: this.y + this._hitbox.y,
                width: this._hitbox.width,
                height: this._hitbox.height
            };
        },
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

},{}],7:[function(require,module,exports){
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

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Ticker).call(this));

        _this.lastTick = Date.now();
        _this.stopped = true;
        _this.frame = 0;
        _this.frameskip = 1;
        return _this;
    }

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
    }, {
        key: 'start',
        value: function start() {
            if (this.stopped) {
                this.stopped = false;
                requestAnimationFrame(this.loop.bind(this));
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.stopped = true;
        }
    }, {
        key: 'step',
        value: function step(dt) {
            this.dispatch('step', dt);
        }
    }, {
        key: 'render',
        value: function render(dt) {
            this.dispatch('render', dt);
        }
    }]);

    return Ticker;
}(_eventEmitter.EventEmitter);

},{"./event-emitter":3}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _application = require('./bin/application');

var _container = require('./bin/container');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Box = function (_Container) {
    _inherits(Box, _Container);

    function Box() {
        _classCallCheck(this, Box);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Box).apply(this, arguments));
    }

    _createClass(Box, [{
        key: 'render',
        value: function render() {
            this.ctx.save();
            this.ctx.fillRect(0, 0, 100, 100);
            this.ctx.restore();
        }
    }]);

    return Box;
}(_container.Container);

var homeLayer = {
    create: function create() {
        this.player = {
            x: this.width / 2,
            y: this.height / 2,
            width: 50,
            height: 100
        };
        this.box = new Box({
            width: 50,
            height: 50
        });
    },

    step: function step(td) {
        this.player.x += 100 * td;

        if (this.player.x > this.width) {
            this.player.x = this.player.width * -1;
        }
    },

    render: function render() {
        this.clearLayer();
        this.box.render();

        this.ctx.save();
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.drawImage(this.box.canvas, this.box.x, this.box.y);
        this.ctx.restore();
    }
};

var app = new _application.Application({
    //debug: true,
});

app.addLayer(homeLayer, 'home');

},{"./bin/application":1,"./bin/container":2}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJiaW4vYXBwbGljYXRpb24uanMiLCJiaW4vY29udGFpbmVyLmpzIiwiYmluL2V2ZW50LWVtaXR0ZXIuanMiLCJiaW4va2V5Ym9hcmQuanMiLCJiaW4vbG9hZGVyLmpzIiwiYmluL21vZGVsLmpzIiwiYmluL3RpY2tlci5qcyIsImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7SUFFYSxXLFdBQUEsVztBQUVULDJCQUEyQjtBQUFBOztBQUFBLFlBQWQsT0FBYyx5REFBSixFQUFJOztBQUFBOztBQUV2QixhQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EsYUFBSyxNQUFMLEdBQWMsRUFBZDtBQUNBLGFBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNBLGFBQUssUUFBTDtBQUNBLGFBQUssTUFBTDtBQUNBOztBQUVBLFlBQUksUUFBTyxRQUFRLFNBQWYsS0FBNEIsUUFBaEMsRUFBMEM7QUFDdEMsb0JBQVEsU0FBUixHQUFvQixTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBcEI7QUFDSDs7QUFFRCxhQUFLLEtBQUwsR0FBYSxRQUFRLEtBQVIsSUFBaUIsT0FBTyxVQUFyQztBQUNBLGFBQUssTUFBTCxHQUFjLFFBQVEsTUFBUixJQUFrQixPQUFPLFdBQXZDO0FBQ0EsYUFBSyxVQUFMLEdBQWtCLFFBQVEsVUFBUixJQUFzQixRQUF4Qzs7QUFFQSxhQUFLLE1BQUwsR0FBYyxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZDtBQUNBLGFBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsS0FBSyxLQUF6QjtBQUNBLGFBQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsS0FBSyxNQUExQjtBQUNBLGFBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsZUFBbEIsR0FBb0MsS0FBSyxVQUF6Qzs7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Um9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyBUaWNrZXIgfSBmcm9tICcuL3RpY2tlcic7XG5pbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHsga2V5Ym9hcmQgfSBmcm9tICcuL2tleWJvYXJkJztcbmltcG9ydCB7IGxvYWRlciB9IGZyb20gJy4vbG9hZGVyJztcblxuZXhwb3J0IGNsYXNzIEFwcGxpY2F0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRMYXllciA9IG51bGw7XG4gICAgICAgIHRoaXMua2V5Ym9hcmQgPSBrZXlib2FyZDtcbiAgICAgICAgdGhpcy5sb2FkZXIgPSBsb2FkZXI7XG4gICAgICAgIC8vdGhpcy5kZWJ1ZyA9IG9wdGlvbnMuZGVidWcgfHwgZmFsc2U7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNvbnRhaW5lciAhPSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgb3B0aW9ucy5jb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aCB8fCB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCB8fCB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IG9wdGlvbnMuYmFja2dyb3VuZCB8fCAweGZmZmZmZjtcblxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmJhY2tncm91bmQ7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNvbnRleHQ7XG5cbiAgICAgICAgb3B0aW9ucy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXG4gICAgICAgIGlmICghIW9wdGlvbnMuY3JlYXRlKSB7XG4gICAgICAgICAgICBvcHRpb25zLmNyZWF0ZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIub24oJ3JlYWR5JywgKCkgPT4gdGhpcy5yZWFkeSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGlja2VyID0gbmV3IFRpY2tlcigpO1xuXG4gICAgICAgIHRoaXMudGlja2VyLm9uKCdzdGVwJywgdGhpcy5zdGVwLCB0aGlzKTtcbiAgICAgICAgdGhpcy50aWNrZXIub24oJ3JlbmRlcicsIHRoaXMucmVuZGVyLCB0aGlzKTtcblxuICAgICAgICBpZiAodGhpcy5sb2FkZXIucmVhZHkpIHtcbiAgICAgICAgICAgIHRoaXMudGlja2VyLnN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGVwIChkdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCEhdGhpcy5vcHRpb25zLnN0ZXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc3RlcC5jYWxsKHRoaXMsIGR0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCEhdGhpcy5jdXJyZW50TGF5ZXIgJiYgISF0aGlzLmN1cnJlbnRMYXllci5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIuc3RlcC5jYWxsKHRoaXMsIGR0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyIChkdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCEhdGhpcy5vcHRpb25zLnJlbmRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5yZW5kZXIuY2FsbCh0aGlzLCBkdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghIXRoaXMuY3VycmVudExheWVyICYmICEhdGhpcy5jdXJyZW50TGF5ZXIucmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TGF5ZXIucmVuZGVyLmNhbGwodGhpcywgZHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRXJyb3IoZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW5kZXIgZGVidWdcbiAgICAgICAgLyppZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgZm9yIChsZXQgcHJvcCBpbiB0aGlzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbcHJvcF0gaW5zdGFuY2VvZiBNb2RlbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckRlYnVnKHRoaXNbcHJvcF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSovXG4gICAgfVxuXG4gICAgYWRkTGF5ZXIgKGxheWVyLCBuYW1lKSB7XG4gICAgICAgIHRoaXMubGF5ZXJzLnB1c2goeyBsYXllciwgbmFtZSB9KTtcblxuICAgICAgICBpZiAodGhpcy5sYXllcnMubGVuZ3RoID09PSAxKcKge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VMYXllcihuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxheWVyLmNyZWF0ZS5jYWxsKHRoaXMpO1xuXG4gICAgICAgIC8vbWF5YmUgaXQncyB0b28gaGlnaHQgY29uY2VwdCBmb3IgbGlndGggY2FudmFzIGxpYlxuICAgICAgICBmb3IgKGxldCBwcm9wIGluIHRoaXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzW3Byb3BdIGluc3RhbmNlb2YgTW9kZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzW3Byb3BdLnBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjaGFuZ2VMYXllciAobmFtZSkge1xuICAgICAgICBsZXQgbGF5ZXIgPSB0aGlzLmxheWVycy5maW5kKGxheWVyID0+IGxheWVyLm5hbWUgPT09IG5hbWUpO1xuXG4gICAgICAgIGlmICghIWxheWVyKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRMYXllciA9IGxheWVyLmxheWVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJMYXllciAoKSB7XG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgfVxuXG4gICAgcmVhZHkgKCkge1xuICAgICAgICB0aGlzLnRpY2tlci5zdGFydCgpO1xuXG4gICAgICAgIGlmICghIXRoaXMub3B0aW9ucy5yZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnJlYWR5LmNhbGwodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJEZWJ1ZyAobW9kZWwpIHtcbiAgICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICAgICB0aGlzLmN0eC5mb250ID0gJzEycHggc2Fucy1zZXJpZic7XG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICdyZWQnO1xuICAgICAgICB0aGlzLmN0eC5yZWN0KG1vZGVsLngsIG1vZGVsLnksIG1vZGVsLndpZHRoLCBtb2RlbC5oZWlnaHQpO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgdGhpcy5jdHguZmlsbFRleHQoYFske01hdGgucm91bmQobW9kZWwueCl9LCAke01hdGgucm91bmQobW9kZWwueSl9XWAsIG1vZGVsLngsIG1vZGVsLnkgLSAxMCk7XG4gICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9ICdibHVlJztcbiAgICAgICAgdGhpcy5jdHgucmVjdChtb2RlbC5oaXRib3gueCwgbW9kZWwuaGl0Ym94LnksIG1vZGVsLmhpdGJveC53aWR0aCwgbW9kZWwuaGl0Ym94LmhlaWdodCk7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICAgICAgICB0aGlzLmN0eC5maWxsVGV4dChgWyR7TWF0aC5yb3VuZChtb2RlbC5oaXRib3gueCl9LCAke01hdGgucm91bmQobW9kZWwuaGl0Ym94LnkpfV1gLCBtb2RlbC5oaXRib3gueCwgbW9kZWwuaGl0Ym94LnkgLSAxMCk7XG4gICAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBkZWJ1ZyAobW9kZWxzID0gW10pIHtcbiAgICAgICAgW10uY29uY2F0KG1vZGVscykuZm9yRWFjaChtb2RlbCA9PiB7XG4gICAgICAgICAgICBpZiAobW9kZWwgaW5zdGFuY2VvZiBNb2RlbCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRGVidWcobW9kZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVFcnJvciAoZXJyKSB7XG4gICAgICAgIHRoaXMudGlja2VyLnN0b3AoKTtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcblxuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICAgICAgICAgdGhpcy5jdHguZm9udCA9ICcxMnB4IHNhbnMtc2VyaWYnO1xuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gJ3JlZCc7XG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsVGV4dChlcnIsIDUwLCA1MCk7XG4gICAgICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjbGFzcyBDb250YWluZXIge1xuXG4gICAgY29uc3RydWN0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLnggPSBvcHRpb25zLnggfHwgMDtcbiAgICAgICAgdGhpcy55ID0gb3B0aW9ucy55IHx8IDA7XG4gICAgICAgIHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoIHx8IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0IHx8IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gb3B0aW9ucy5iYWNrZ3JvdW5kIHx8IDB4ZmZmZmZmO1xuXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuYmFja2dyb3VuZDtcblxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY29udGV4dDtcbiAgICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXIge1xuXG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyZWQgPSBbXTtcbiAgICB9XG5cbiAgICBvbiAoZXZlbnQsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJlZC5wdXNoKHsgZXZlbnQsIGNhbGxiYWNrLCBjb250ZXh0IH0pO1xuICAgIH1cblxuICAgIGRpc3BhdGNoIChldmVudCwgYXJncykge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyZWQuZm9yRWFjaChyZWdpc3RlciA9PiB7XG4gICAgICAgICAgICBpZiAocmVnaXN0ZXIuZXZlbnQgPT09IGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgcmVnaXN0ZXIuY2FsbGJhY2suY2FsbChyZWdpc3Rlci5jb250ZXh0IHx8IHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjb25zdCBLRVlfVVAgPSAzODtcbmV4cG9ydCBjb25zdCBLRVlfRE9XTiA9IDQwO1xuZXhwb3J0IGNvbnN0IEtFWV9MRUZUID0gMzc7XG5leHBvcnQgY29uc3QgS0VZX1JJR0hUID0gMzk7XG5leHBvcnQgY29uc3QgS0VZX1NQQUNFID0gMzI7XG5leHBvcnQgY29uc3QgS0VZX0IgPSA2NjtcbmV4cG9ydCBjb25zdCBLRVlfTiA9IDc4O1xuZXhwb3J0IGNvbnN0IExFRlRfQ0xJQ0sgPSAnbGVmdF9jbGljayc7XG5cbmV4cG9ydCBsZXQga2V5Ym9hcmQgPSBbXTtcbmtleWJvYXJkW0tFWV9VUF0gPSBmYWxzZTtcbmtleWJvYXJkW0tFWV9ET1dOXSA9IGZhbHNlO1xua2V5Ym9hcmRbS0VZX0xFRlRdID0gZmFsc2U7XG5rZXlib2FyZFtLRVlfUklHSFRdID0gZmFsc2U7XG5rZXlib2FyZFtLRVlfU1BBQ0VdID0gZmFsc2U7XG5rZXlib2FyZFtLRVlfQl0gPSBmYWxzZTtcbmtleWJvYXJkW0tFWV9OXSA9IGZhbHNlO1xua2V5Ym9hcmRbTEVGVF9DTElDS10gPSBmYWxzZTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgLy9lLnByZXZlbnREZWZhdWx0KCk7XG4gICAga2V5Ym9hcmRbZS5rZXlDb2RlXSA9IHRydWU7XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgIC8vZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGtleWJvYXJkW2Uua2V5Q29kZV0gPSBmYWxzZTtcbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB7XG4gICAga2V5Ym9hcmRbTEVGVF9DTElDS10gPSB0cnVlO1xufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XG4gICAga2V5Ym9hcmRbTEVGVF9DTElDS10gPSBmYWxzZTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBrZXlib2FyZDtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnLi9ldmVudC1lbWl0dGVyJztcblxuZXhwb3J0IGNsYXNzIExvYWRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5jb3VudCA9IDA7XG4gICAgICAgIHRoaXMucXVldWUgPSAwO1xuICAgICAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IFtdO1xuICAgIH1cblxuICAgIGFkZCAoc3JjLCBpZCwgdHlwZSA9ICdpbWFnZScpIHtcblxuICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICAgIHRoaXMucXVldWUrKztcbiAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnaW1hZ2UnOlxuICAgICAgICAgICAgICAgIHRoaXMubG9hZEltYWdlKHNyYywgaWQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnanNvbic6XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkSnNvbihzcmMsIGlkKTtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZCAoZWwsIGlkKSB7XG4gICAgICAgIHRoaXMucXVldWUtLTtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IDEgLSB0aGlzLnF1ZXVlIC8gdGhpcy5jb3VudDtcblxuICAgICAgICB0aGlzLmNvbGxlY3Rpb24ucHVzaCh7IGlkOiBpZCwgaXRlbTogZWwgfSk7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2goJ2xvYWQnLCB0aGlzLnByb2dyZXNzKTtcblxuICAgICAgICBpZiAodGhpcy5xdWV1ZSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoKCdyZWFkeScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZEltYWdlIChzcmMsIGlkKSB7XG4gICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHRoaXMubG9hZChpbWcsIGlkKTtcbiAgICB9XG5cbiAgICBsb2FkSnNvbiAoc3JjLCBpZCkge1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgIHJlcXVlc3Qub3BlbihcIkdFVFwiLCBzcmMsIHRydWUpO1xuICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGUgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGUudGFyZ2V0LnJlc3BvbnNlKTtcbiAgICAgICAgICAgIHRoaXMubG9hZChkYXRhLCBpZCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICB9XG5cbiAgICBnZXQgKGlkKSB7XG4gICAgICAgIGxldCBpdGVtcyA9IHRoaXMuY29sbGVjdGlvbi5maWx0ZXIoZWwgPT4gZWwuaWQgPT09IGlkKTtcblxuICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGl0ZW1zLmxlbmd0aCA+IDEgPyBpdGVtcy5tYXAoZWwgPT4gZWwuaXRlbSkgOiBpdGVtc1swXS5pdGVtO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IGxvYWRlciA9IG5ldyBMb2FkZXIoKTtcblxuZXhwb3J0IGRlZmF1bHQgbG9hZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGV2ZXJ5IG1vZGVsIGVudGl0eVxuICovXG5leHBvcnQgY2xhc3MgTW9kZWwge1xuXG4gICAgY29uc3RydWN0b3IgKHgsIHksIHdpZHRoLCBoZWlnaHQsIGhpdGJveCA9IHt9KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMuaGl0Ym94ID0gaGl0Ym94O1xuICAgICAgICB0aGlzLmNvbGxpc2lvbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHt9O1xuICAgIH1cblxuICAgIGdldCBoaXRib3ggKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy54ICsgdGhpcy5faGl0Ym94LngsXG4gICAgICAgICAgICB5OiB0aGlzLnkgKyB0aGlzLl9oaXRib3gueSxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLl9oaXRib3gud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuX2hpdGJveC5oZWlnaHRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCBoaXRib3ggKGhpdGJveCkge1xuICAgICAgICB0aGlzLl9oaXRib3ggPSB7XG4gICAgICAgICAgICB4OiBoaXRib3gueCB8fCAwLFxuICAgICAgICAgICAgeTogaGl0Ym94LnkgfHwgMCxcbiAgICAgICAgICAgIHdpZHRoOiBoaXRib3gud2lkdGggfHwgdGhpcy53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogaGl0Ym94LmhlaWdodCB8fCB0aGlzLmhlaWdodFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzQ29sbGlzaW9ucyAobW9kZWxzKSB7XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KG1vZGVscykpIHtcbiAgICAgICAgICAgIG1vZGVscyA9IFttb2RlbHNdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1vZGVsO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbW9kZWwgPSBtb2RlbHNbaV07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhpdGJveC54IDwgbW9kZWwuaGl0Ym94LnggKyBtb2RlbC5oaXRib3gud2lkdGggJiZcbiAgICAgICAgICAgICAgICB0aGlzLmhpdGJveC54ICsgbW9kZWwuaGl0Ym94LndpZHRoID4gbW9kZWwuaGl0Ym94LnggJiZcbiAgICAgICAgICAgICAgICB0aGlzLmhpdGJveC55IDwgbW9kZWwuaGl0Ym94LnkgKyBtb2RlbC5oaXRib3guaGVpZ2h0ICYmXG4gICAgICAgICAgICAgICAgdGhpcy5oaXRib3guaGVpZ2h0ICsgdGhpcy5oaXRib3gueSA+IG1vZGVsLmhpdGJveC55XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICcuL2V2ZW50LWVtaXR0ZXInO1xuXG5leHBvcnQgY2xhc3MgVGlja2VyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmxhc3RUaWNrID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdGhpcy5zdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgICAgIHRoaXMuZnJhbWVza2lwID0gMTtcbiAgICB9XG5cbiAgICBsb29wICgpIHtcblxuICAgICAgICBpZiAodGhpcy5zdG9wcGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpO1xuXG4gICAgICAgIGxldCBkZWx0YSA9IERhdGUubm93KCkgLSB0aGlzLmxhc3RUaWNrO1xuICAgICAgICB0aGlzLmxhc3RUaWNrID0gRGF0ZS5ub3coKTtcblxuICAgICAgICBpZiAoZGVsdGEgPiAxMDAwKSAge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGR0ID0gZGVsdGEgLyAxMDAwO1xuXG4gICAgICAgIHRoaXMuc3RlcChkdCk7XG4gICAgICAgIHRoaXMucmVuZGVyKGR0KTtcbiAgICB9XG5cbiAgICBzdGFydCAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0b3BwZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0b3AgKCkge1xuICAgICAgICB0aGlzLnN0b3BwZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHN0ZXAgKGR0KSB7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2goJ3N0ZXAnLCBkdCk7XG4gICAgfVxuXG4gICAgcmVuZGVyIChkdCkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoKCdyZW5kZXInLCBkdCk7XG4gICAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gJy4vYmluL2FwcGxpY2F0aW9uJztcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gJy4vYmluL2NvbnRhaW5lcic7XG5cbmNsYXNzIEJveCBleHRlbmRzIENvbnRhaW5lciB7XG5cbiAgICByZW5kZXIgKCkge1xuICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDEwMCwgMTAwKTtcbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH1cbn1cblxudmFyIGhvbWVMYXllciA9IHtcbiAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLndpZHRoIC8gMixcbiAgICAgICAgICAgIHk6IHRoaXMuaGVpZ2h0IC8gMixcbiAgICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICAgIGhlaWdodDogMTAwXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYm94ID0gbmV3IEJveCh7XG4gICAgICAgICAgICB3aWR0aDogNTAsXG4gICAgICAgICAgICBoZWlnaHQ6IDUwXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzdGVwOiBmdW5jdGlvbiAodGQpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIueCArPSAxMDAgKiB0ZDtcblxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIueCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnggPSB0aGlzLnBsYXllci53aWR0aCAqIC0xO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNsZWFyTGF5ZXIoKTtcbiAgICAgICAgdGhpcy5ib3gucmVuZGVyKCk7XG5cbiAgICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCh0aGlzLnBsYXllci54LCB0aGlzLnBsYXllci55LCB0aGlzLnBsYXllci53aWR0aCwgdGhpcy5wbGF5ZXIuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5jdHguZHJhd0ltYWdlKHRoaXMuYm94LmNhbnZhcywgdGhpcy5ib3gueCwgdGhpcy5ib3gueSk7XG4gICAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG59O1xuXG52YXIgYXBwID0gbmV3IEFwcGxpY2F0aW9uKHtcbiAgICAvL2RlYnVnOiB0cnVlLFxufSk7XG5cbmFwcC5hZGRMYXllcihob21lTGF5ZXIsICdob21lJyk7XG4iXX0=
