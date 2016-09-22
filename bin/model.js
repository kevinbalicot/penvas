'use strict';

/**
 * Base class for every model entity
 */
export class Model {

    constructor (x, y, width, height, hitbox = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hitbox = hitbox;
        this.collision = false;
        this.parent = {};
    }

    get hitbox () {
        return {
            x: this.x + this._hitbox.x,
            y: this.y + this._hitbox.y,
            width: this._hitbox.width,
            height: this._hitbox.height
        }
    }

    set hitbox (hitbox) {
        this._hitbox = {
            x: hitbox.x || 0,
            y: hitbox.y || 0,
            width: hitbox.width || this.width,
            height: hitbox.height || this.height
        }
    }

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
