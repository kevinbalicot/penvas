const EventEmitter = require('events');

/**
 * @ignore
 */
class Ticker extends EventEmitter {

    constructor() {
        super();

        this.lastTick = Date.now();
        this.stopped = true;
        this.timer = null;
    }

    loop() {

        if (this.stopped) {
            return;
        }

        let delta = Date.now() - this.lastTick;
        this.lastTick = Date.now();

        if (delta > 1000)  {
            return;
        }

        let dt = delta / 1000;

        this.step(dt);
    }

    start() {
        if (this.stopped) {
            this.stopped = false;
            this.time = setInterval(() => this.loop(), 10);
        }
    }

    stop() {
        this.stopped = true;
        clearInterval(this.timer);
    }

    step(dt) {
        this.emit('step', dt);
    }
}

module.exports = Ticker;
