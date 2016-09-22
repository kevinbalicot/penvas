'use strict';

const Ticker = require('./ticker');

class ServerApplication {

    constructor (options = {}) {

        this.options = options;

        this.ticker = new Ticker();
        this.ticker.on('step', this.step, this);

        if (!!this.options.create) {
            this.options.create.call(this);
        }

        this.ready();
    }

    step (dt) {
        if (!!this.options.step) {
            this.options.step.call(this, dt);
        }
    }

    ready () {
        this.ticker.start();
    }

    debug (models = []) {
        [].concat(models).forEach(model => {
            if (model instanceof Model) {

            }
        });
    }
}

module.exports = ServerApplication;
