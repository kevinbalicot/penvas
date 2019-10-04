const uuid = require('uuid');

import { GameLoop } from './game-loop';
import { Drawer } from './drawer';
import { Point } from './geometry/point';

const keyboard = {};
const gamepads = [];
const mouse = new Point(0, 0);

document.addEventListener('keydown', event => {
    keyboard[event.which || event.keyCode] = true;
});

document.addEventListener('keyup', event => {
    keyboard[event.which || event.keyCode] = false;
});

document.addEventListener('mousedown', () => {
    mouse['left'] = true;
});

document.addEventListener('mouseup', () => {
    mouse['left'] = false;
});

window.addEventListener('gamepadconnected', event => {
    if (event.gamepad && event.gamepad.id) {
        gamepads.push(event.gamepad);
    }
});

window.addEventListener('gamepaddisconnected', event => {
    if (event.gamepad && event.gamepad.id) {
        const index = gamepads.findIndex(g => g.id === event.gamepad.id);

        if (index != -1) {
            gamepads.splice(index, 1);
        }
    }
});

export class Canvas extends Drawer {
    constructor(options = {}) {
        super();

        this.container = null;
        if (options.container && typeof options.container === 'string') {
            this.container = document.querySelector(options.container);
        } else if (options.container && options.container instanceof HTMLElement) {
            this.container = options.container;
        }

        this.width = options.width || window.innerWidth;
        this.height = options.height || window.innerHeight;

        this.element = document.createElement('canvas');
        this.element.width = this.width;
        this.element.height = this.height;

        if (this.container) {
            this.container.appendChild(this.element);
        }

        this.ctx = this.element.getContext('2d');

        this.keyboard = keyboard;
        this.gamepads = gamepads;
        this.mouse = mouse;

        this.layers = [];

        this.loop = new GameLoop(options.fps || 60);

        this.loop.on('gameloop:step', delta => this.step(delta));
        this.loop.on('gameloop:render', delta => this.render(delta));

        document.addEventListener('keydown', event => {
            this.layers.forEach(layer => layer.keyDown(event));
        });

        document.addEventListener('keyup', event => {
            this.layers.forEach(layer => layer.keyUp(event));
        });

        document.addEventListener('mousemove', event => {
            const rect = this.element.getBoundingClientRect();
            this.mouse.x = event.clientX - rect.left;
            this.mouse.y = event.clientY - rect.top;

            this.layers.forEach(layer => layer.mouseMove(event));
        });

        window.addEventListener('gamepadconnected', event => {
            this.layers.forEach(layer => layer.gamepadUp(event));
        });

        window.addEventListener('gamepaddisconnected', event => {
            this.layers.forEach(layer => layer.gamepadDown(event));
        });
    }

    step(delta) {
        this.layers.forEach(layer => layer.step(delta));
    }

    render(delta) {
        this.layers.forEach(layer => layer.stepRender(delta));
    }

    setLayers(layers) {
        if (!Array.isArray(layers)) {
            layers = [layers];
        }

        this.layers.forEach(layer => layer.ending());
        this.layers = [];

        layers.forEach(layer => this.addLayer(layer));
    }

    addLayer(layer) {
        layer.canvas = this;
        layer.begin();

        this.layers.push(layer);
    }

    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }
}
