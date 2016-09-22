'use strict';

import { EventEmitter } from './event-emitter';

export class Ticker extends EventEmitter {

    constructor () {
        super();

        this.lastTick = Date.now();
        this.stopped = true;
        this.frame = 0;
        this.frameskip = 1;
    }

    loop () {

        if (this.stopped) {
            return;
        }

        requestAnimationFrame(this.loop.bind(this));

        let delta = Date.now() - this.lastTick;
        this.lastTick = Date.now();

        if (delta > 1000)  {
            return;
        }

        let dt = delta / 1000;

        this.step(dt);
        this.render(dt);
    }

    start () {
        if (this.stopped) {
            this.stopped = false;
            requestAnimationFrame(this.loop.bind(this));
        }
    }

    stop () {
        this.stopped = true;
    }

    step (dt) {
        this.dispatch('step', dt);
    }

    render (dt) {
        this.dispatch('render', dt);
    }
}
