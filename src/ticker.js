import { EventEmitter } from './event-emitter';

/**
 * Timer class
 * You can stop and start the game
 */
export class Ticker extends EventEmitter {
    constructor () {
        super();

        /** @type {number} */
        this.lastTick = Date.now();

        /** @type {boolean} */
        this.stopped = true;

        /** @type {number} */
        this.frame = 0;
    }

    /**
     * @private
     */
    loop() {
        if (this.stopped) {
            return;
        }

        requestAnimationFrame(this.loop.bind(this));

        let delta = Date.now() - this.lastTick;
        this.lastTick = Date.now();

        if (delta > 1000)  {
            return;
        }

        this.frame++;
        let dt = delta / 1000;

        this.step(dt);
        this.render(dt);
    }

    /**
     * Start timer
     */
    start() {
        if (this.stopped) {
            this.stopped = false;
            requestAnimationFrame(this.loop.bind(this));
        }
    }

    /**
     * Stop timer
     */
    stop() {
        this.stopped = true;
    }

    /**
     * Called at every frame
     * @private
     * @param {number} dt
     * @emits {step}
     */
    step(dt) {
        this.dispatch('step', dt);
    }

    /**
     * Called at every frame
     * @private
     * @param {number} dt
     * @emits {render}
     */
    render(dt) {
        this.dispatch('render', dt);
    }

    every(frame, callback) {
        if (this.frame % frame === 0) {
            callback();
        }
    }
}

const ticker = new Ticker();
export default ticker;
