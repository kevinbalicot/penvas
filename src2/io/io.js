import Point from '../geometry/point';
import EventEmitter from '../event-emitter';
import KEYS from './keys';

export const keyboard = {};
export const gamepads = [];
export const mouse = new Point(0, 0);

document.addEventListener('keydown', event => {
    keyboard[event.which || event.keyCode] = true;
});

document.addEventListener('keyup', event => {
    keyboard[event.which || event.keyCode] = false;
});

document.addEventListener('mousedown', event => {
    mouse[event.button] = true;
});

document.addEventListener('mouseup', event => {
    mouse[event.button] = false;
});

window.addEventListener('gamepadconnected', event => {
    if (event.gamepad && event.gamepad.id) {
        gamepads.push(event.gamepad);
    }
});

window.addEventListener('gamepaddisconnected', event => {
    if (event.gamepad && event.gamepad.id) {
        const index = gamepads.findIndex(g => g.id === event.gamepad.id);

        if (index !== -1) {
            gamepads.splice(index, 1);
        }
    }
});

const findButton = (id) => {
    for (let button in KEYS) {
        if (KEYS[button] === id) {
            return button;
        }
    }

    return id;
};

export default class IO extends EventEmitter {
    constructor() {
        super();

        document.addEventListener('keydown', event => {
            this.emit('keydown', { event, keyboard });
            this.emit(`keydown:${findButton(event.which || event.keyCode)}`, { event, keyboard });
        });

        document.addEventListener('keyup', event => {
            this.emit('keyup', { event, keyboard });
            this.emit(`keyup:${findButton(event.which || event.keyCode)}`, { event, keyboard });
        });

        document.addEventListener('mousedown', event => {
            this.emit('mousedown', { event, mouse });
            this.emit(`mousedown:${event.button}`, { event, mouse });
        });

        document.addEventListener('mouseup', event => {
            this.emit('mouseup', { event, mouse });
            this.emit(`mouseup:${event.button}`, { event, mouse });
        });

        document.addEventListener('mousemove', event => {
            //const rect = this.element.getBoundingClientRect();
            mouse.x = event.clientX /*- rect.left;*/
            mouse.y = event.clientY /*- rect.top;*/

            this.emit('mousemove', { event, mouse });
        });

        window.addEventListener('gamepadconnected', event => {
            this.emit('gamepadconnected', { event, gamepads });
        });

        window.addEventListener('gamepaddisconnected', event => {
            this.emit('gamepaddisconnected', { event, gamepads });
        });
    }
}
