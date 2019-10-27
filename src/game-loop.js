import uuid from 'uuid/v4';
import { EventEmitter } from './event-emitter';

export class GameLoop extends EventEmitter {
    constructor(maxFPS = 60) {
        super();

        this.maxFPS = maxFPS;
        this.lastFrameTimeMs = 0;
        this.delta = 0;
        this.timestep = 1000 / this.maxFPS;
        this.running = false;
        this.started = false;
        this.frameId = 0;
        this.time = 0;
        this.timeouts = [];
    }

    stop() {
        this.running = false;
        this.started = false;
        this.time = 0;
        cancelAnimationFrame(this.frameId);
    }

    start() {
        if (!this.started) {
            this.time = Date.now();
            this.started = true;
            this.frameId = requestAnimationFrame(timestamp => {
                this.emit('gameloop:render', 1);

                this.running = true;
                this.lastFrameTimeMs = timestamp;
                this.frameId = requestAnimationFrame(timestamp => this.loop(timestamp));
            });
        }
    }

    loop(timestamp) {
        if (this.running) {
            if (timestamp < this.lastFrameTimeMs + this.timestep) {
                this.frameId = requestAnimationFrame(timestamp => this.loop(timestamp));
                return;
            }

            this.delta += timestamp - this.lastFrameTimeMs;
            this.lastFrameTimeMs = timestamp;

            let numUpdateSteps = 0;
            while (this.delta >= this.timestep) {
                this.emit('gameloop:step', this.timestep / 1000);
                this.delta -= this.timestep;

                if (++numUpdateSteps >= 240) {
                    console.log('GAME LOOP PANIC');
                    this.delta = 0;
                    break;
                }
            }

            this.emit('gameloop:render', this.delta / this.timestep);

            this.frameId = requestAnimationFrame(timestamp => this.loop(timestamp));
        }

        this.timeouts.forEach((timeout, index) => {
            if (Date.now() >= timeout.start + timeout.time) {
                timeout.callback();
                this.timeouts.splice(index, 1);
            }
        });
    }

    setTimeout(callback, time) {
        const id = uuid();
        this.timeouts.push({ id, callback, time, start: Date.now() });

        return id;
    }

    clearTimeout(id) {
        const index = this.timeouts.findIndex(i => i.id === id);

        if (index != -1) {
            this.timeouts.splice(index, 1);
        }
    }

    get timeUp() {
        return this.running ? Date.now() - this.time : 0;
    }
}
