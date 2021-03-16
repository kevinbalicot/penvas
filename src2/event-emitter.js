export default class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(eventName, callback, context, once = false) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }

        const listener = {
            once,
            callback,
            context
        };

        this.listeners[eventName].push(listener);

        return listener;
    }

    once(eventName, callback, context) {
        this.on(eventName, callback, context, true);
    }

    off(eventName, callback = null) {
        if (null === callback) {
            return delete this.listeners[eventName];
        }

        this.listeners[eventName].forEach((listener, index) => {
            this.listeners.splice(index, 1);
        });
    }

    emit(eventName, data = {}) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach((listener, index) => {
                listener.callback.call(listener.context || this, data);

                if (listener.once) {
                    this.listeners.splice(index, 1);
                }
            });
        }
    }
}
