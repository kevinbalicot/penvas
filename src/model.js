/**
 * Base class for every model entity
 * @example
 * let model = new Model(10, 10, 100, 200);
 */
export class Model {

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Object} [hitbox]
     * @param {Object} [hitbox.x]
     * @param {Object} [hitbox.y]
     * @param {Object} [hitbox.width]
     * @param {Object} [hitbox.height]
     */
    constructor (x, y, width, height, hitbox = {}) {
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
    get hitbox () {
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
    set hitbox (hitbox) {
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
    hasCollisions (models) {

        if (!Array.isArray(models)) {
            models = [models];
        }

        let model;
        for (let i = 0; i < models.length; i++) {
            model = models[i];

            if (this.hitbox.x < model.hitbox.x + model.hitbox.width &&
                this.hitbox.x + model.hitbox.width > model.hitbox.x &&
                this.hitbox.y < model.hitbox.y + model.hitbox.height &&
                this.hitbox.height + this.hitbox.y > model.hitbox.y
            ) {
                return model;
            }
        }

        return false;
    }
}
