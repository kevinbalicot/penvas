/**
 * Base class for every model entity
 * @example
 * let model = new Model(10, 10, 100, 200);
 */
class Model {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Object} [hitbox]
     * @param {number} [hitbox.x]
     * @param {number} [hitbox.y]
     * @param {number} [hitbox.width]
     * @param {number} [hitbox.height]
     */
    constructor(x, y, width, height, hitbox = {}) {
        /** @type {Number} */
        this.x = x;
        /** @type {Number} */
        this.y = y;
        /** @type {Number} */
        this.width = width;
        /** @type {Number} */
        this.height = height;

        this.hitbox = hitbox;
        this.collision = false;
        this.parent = {};
    }

    /**
     * @return {Object}
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     */
    get hitbox() {
        return {
            x: this.x + this._hitbox.x,
            y: this.y + this._hitbox.y,
            width: this._hitbox.width,
            height: this._hitbox.height
        }
    }

    /**
     * @param {Object} [hitbox]
     * @param {Object} [hitbox.x]
     * @param {Object} [hitbox.y]
     * @param {Object} [hitbox.width]
     * @param {Object} [hitbox.height]
     */
    set hitbox(hitbox) {
        this._hitbox = {
            x: hitbox.x || 0,
            y: hitbox.y || 0,
            width: hitbox.width || this.width,
            height: hitbox.height || this.height
        }
    }

    /**
     * Check if there are any collisions with models
     * @param {Array<Model>|Models} models
     */
    hasCollisions(models) {

        if (!Array.isArray(models)) {
            models = [models];
        }

        let model;
        for (let i = 0; i < models.length; i++) {
            model = models[i];

            if (this.hitbox.x < model.hitbox.x + model.hitbox.width &&
                this.hitbox.x + this.hitbox.width > model.hitbox.x &&
                this.hitbox.y < model.hitbox.y + model.hitbox.height &&
                this.hitbox.y + this.hitbox.height > model.hitbox.y
            ) {
                return model;
            }
        }

        return false;
    }

    step() {}

    /**
     * @return {Object}
     * @property {number} x
     * @property {number} y
     * @property {number} width
     * @property {number} height
     * @property {Object} hitbox
     * @property {boolean} collision
     */
    serialize() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            hitbox: this._hitbox,
            collision: this.collision
        };
    }

    /**
     * @param {Object} data
     * @param {number} data.x
     * @param {number} data.y
     * @param {number} data.width
     * @param {number} data.height
     * @param {Object} data.hitbox
     * @param {boolean} collision
     * @return {Model}
     */
    static deserialize({ x, y, width, height, hitbox, collision }) {
        const model = new Model(x, y, width, height, hitbox);

        model.collision = collision;

        return model;
    }
}

module.exports = Model;
