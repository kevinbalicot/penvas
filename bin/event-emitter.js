'use strict';

export class EventEmitter {

    constructor () {
        this.registered = [];
    }

    on (event, callback, context) {
        this.registered.push({ event, callback, context });
    }

    dispatch (event, args) {
        this.registered.forEach(register => {
            if (register.event === event) {
                register.callback.call(register.context || this, args);
            }
        });
    }
}
