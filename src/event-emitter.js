/**
 * Use to emit events
 * @example
 * class MyClass extends EventEmitter {
 *     doSomething() {
 *        this.dispatch('my-event', { message: 'event' });
 *     }
 * }
 */
export class EventEmitter {
    constructor() {
        /**
         * List of registers
         * @protected
         * @type {Array}
         */
        this.registered = [];
    }

    /**
     * Listen event
     * @param {String} event
     * @param {function} callback
     * @param {mixed} context
     */
    on(event, callback, context) {
        this.registered.push({ event, callback, context });
    }

    /**
     * Dispatch event
     * @param {String} event
     * @param {mixed} args
     */
    dispatch(event, args) {
        this.registered.forEach(register => {
            if (register.event === event) {
                register.callback.call(register.context || this, args);
            }
        });
    }
}
