const EventEmitter = require('events');
const Ticker = require('./ticker');

/**
 * @ignore
 */
class Server extends EventEmitter {

    constructor(options = {}) {
        super();

        this.options = options;
        this.ticker = new Ticker();
        this.ticker.on('step', dt => this.step.call(this, dt));

        if (!!this.options.create) {
            this.options.create.call(this);
        }
    }

    step(dt) {
        if (!!this.options.step) {
            this.options.step.call(this, dt);
        }
    }

    ready() {
        this.ticker.start();
    }
}

module.exports = Server;
