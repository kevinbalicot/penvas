'use strict';

class CollisionChecker {

    constructor () {
        this.pair = [];
    }

    add (model, platforms, event) {

        if (!Array.isArray(platforms)) {
            platforms = [platforms];
        }

        this.pair.push({ model, platforms, event });
    }

    check (td) {
        let model, hasCollision;
        this.pair.forEach(pair => {
            model = Object.create(pair.model);
            model.step(td);
            hasCollision = this.hasCollisions(this.getHitbox(model), pair.platforms.map(el => this.getHitbox(el)));

            if (!!hasCollision) {
                pair.event(pair.model);
            }
        });
    }

    hasCollision (hitbox, hitboxes) {

        if (!Array.isArray(hitboxes)) {
            hitboxes = [hitboxes];
        }

        let rect;
        for (let i = 0; i < hitboxes.length; i++) {
            rect = hitboxes[i];

            if (hitbox.x < rect.x + rect.width &&
                hitbox.x + rect.width > rect.x &&
                hitbox.y < rect.y + rect.height &&
                hitbox.height + hitbox.y > rect.y
            ) {
                return true;
            }
        }

        return false;
    }

    getHitbox (model) {
        if (!!model.hitbox) {
            return {
                x: model.x + model.hitbox.x,
                y: model.y + model.hitbox.y,
                width: model.hitbox.width,
                height: model.hitbox.height
            }
        }

        return {
            x: model.x,
            y: model.y,
            width: model.width,
            height: model.height
        }
    }

    clear () {
        this.pair = [];
    }
}

module.exports = CollisionChecker;
