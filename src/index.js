const lib = {
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
