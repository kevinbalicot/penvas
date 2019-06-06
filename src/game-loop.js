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
    }

    stop() {
        this.running = false;
        this.started = false;
        cancelAnimationFrame(this.frameId);
    }

    start() {
        if (!this.started) {
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
    }

    get timeUp() {
        return (this.frameId / this.maxFPS) * 1000;
    }
}
